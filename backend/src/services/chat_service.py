from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlmodel import Session, select
from ..models.conversation import Conversation, Message, ChatRequest, ChatResponse
from ..models.user import User
from ..models.task import Task
from .tools_service import ToolsService
import cohere
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class CohereRunner:
    def __init__(self):
        self.cohere_client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
        self.tools_service = ToolsService()

    def run_conversation(self, session: Session, user_id: int, user_message: str, conversation_id: Optional[str] = None) -> ChatResponse:
        """
        Run a conversation with the Cohere API, handling tool calls
        """
        print(f"DEBUG: Creating/getting conversation for user_id: {user_id}")
        # Get or create conversation
        chat_service = ChatService()
        conversation = chat_service.create_or_get_conversation(session, user_id, conversation_id)

        # Load conversation history
        history = chat_service.load_conversation_history(session, conversation.id)

        # Prepare tools for Cohere
        tools = self.tools_service.get_available_tools()

        # Prepare chat history for Cohere
        formatted_history = []
        for hist_item in history:
            formatted_history.append({
                "role": "CHATBOT" if hist_item["role"] == "assistant" else "USER",
                "message": hist_item["message"]
            })

        try:
            # Call Cohere with tools
            response = self.cohere_client.chat(
                message=user_message,
                chat_history=formatted_history,
                tools=tools,
                model="command-r-08-2024"
            )
        except Exception as e:
            # Handle Cohere API failures gracefully
            error_message = f"Sorry, I'm experiencing difficulties processing your request. Please try again later. Error: {str(e)}"

            # Save user message to database
            chat_service.save_message(
                session=session,
                conversation_id=conversation.id,
                role="user",
                content=user_message
            )

            # Save error response to database
            chat_service.save_message(
                session=session,
                conversation_id=conversation.id,
                role="assistant",
                content=error_message
            )

            # Update conversation timestamp
            conversation.updated_at = datetime.now(timezone.utc)
            session.add(conversation)
            session.commit()

            return ChatResponse(
                conversation_id=str(conversation.id),
                response=error_message,
                tool_calls=[],
                timestamp=datetime.now().isoformat()
            )

        # Process tool calls if any
        final_response_text = response.text

        if hasattr(response, 'tool_calls') and response.tool_calls:
            for tool_call in response.tool_calls:
                # Ensure user_id is included in tool call parameters for relevant tools
                # Override any user_id provided by AI to ensure security - only use authenticated user's ID
                tool_params = tool_call.parameters.copy()  # Create a copy to avoid modifying original
                print(f"DEBUG: Processing tool call {tool_call.name} with original params: {tool_call.parameters}")
                print(f"DEBUG: Current authenticated user_id to enforce: {user_id}")

                # For tools that require user_id, always enforce the authenticated user's ID
                if tool_call.name in ['add_task', 'list_tasks', 'complete_task', 'delete_task', 'update_task', 'get_user_profile']:
                    original_user_id = tool_params.get('user_id')
                    tool_params['user_id'] = user_id
                    print(f"DEBUG: Enforced user_id {user_id} into tool_params for {tool_call.name} (was: {original_user_id})")
                else:
                    print(f"DEBUG: Tool {tool_call.name} doesn't require user_id enforcement")

                # Execute the tool
                result = self.tools_service.execute_tool(session, tool_call.name, tool_params)

                # Save the tool call and result to database
                chat_service.save_message(
                    session=session,
                    conversation_id=conversation.id,
                    role="assistant",
                    content=f"Tool call: {tool_call.name} with params: {tool_call.parameters}",
                    tool_calls=str(tool_call.parameters),
                    tool_call_results=str(result)
                )

                # Generate immediate response based on tool result instead of calling Cohere again
                if result.get('success'):
                    if tool_call.name == 'list_tasks':
                        task_count = result.get('count', 0)
                        if task_count > 0:
                            tasks = result.get('tasks', [])
                            # Format tasks with IDs: "ID: Title"
                            task_list = [f"{task['id']}: {task['title']}" for task in tasks]
                            if task_count == 1:
                                final_response_text = f"You have 1 task: {task_list[0]}"
                            else:
                                # Show all tasks (don't truncate)
                                shown_tasks = ', '.join(task_list)
                                final_response_text = f"You have {task_count} tasks: {shown_tasks}"
                        else:
                            final_response_text = result.get('message', 'You have no tasks at the moment.')
                    elif tool_call.name == 'add_task':
                        final_response_text = result.get('message', 'Task added successfully!')
                    elif tool_call.name in ['complete_task', 'update_task', 'delete_task']:
                        final_response_text = result.get('message', 'Task updated successfully!')
                    elif tool_call.name == 'get_user_profile':
                        final_response_text = f"Hello {result.get('profile', {}).get('name', 'there')}! Your email is {result.get('profile', {}).get('email', 'not available')}."
                    else:
                        final_response_text = result.get('message', 'Operation completed successfully!')
                else:
                    final_response_text = f"Sorry, I encountered an error: {result.get('error', 'Unknown error occurred.')}"

        # Save user message to database
        chat_service.save_message(
            session=session,
            conversation_id=conversation.id,
            role="user",
            content=user_message
        )

        # Save assistant response to database
        chat_service.save_message(
            session=session,
            conversation_id=conversation.id,
            role="assistant",
            content=final_response_text
        )

        # Update conversation timestamp
        conversation.updated_at = datetime.now()
        session.add(conversation)
        session.commit()

        # Generate conversation title if this is the first message
        if len(history) == 0:
            title = user_message[:50] + "..." if len(user_message) > 50 else user_message
            chat_service.update_conversation_title(session, conversation.id, title)

        return ChatResponse(
            conversation_id=str(conversation.id),
            response=final_response_text,
            tool_calls=[{"name": tc.name, "arguments": tc.parameters} for tc in response.tool_calls] if hasattr(response, 'tool_calls') and response.tool_calls else [],
            timestamp=datetime.now().isoformat()
        )


class ChatService:
    def __init__(self):
        self.cohere_client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))

    def create_or_get_conversation(self, session: Session, user_id: int, conversation_id: Optional[str] = None) -> Conversation:
        """
        Create a new conversation or get existing one based on conversation_id
        """
        print(f"DEBUG: create_or_get_conversation called with user_id: {user_id}")
        if conversation_id:
            # Get existing conversation
            statement = select(Conversation).where(
                Conversation.id == int(conversation_id),
                Conversation.user_id == user_id
            )
            conversation = session.exec(statement).first()
            if conversation:
                print(f"DEBUG: Found existing conversation for user_id: {user_id}")
                return conversation

        # Create new conversation
        conversation = Conversation(user_id=user_id, title=None, is_active=True)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        print(f"DEBUG: Created new conversation with id {conversation.id} for user_id: {user_id}")
        return conversation

    def load_conversation_history(self, session: Session, conversation_id: int, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Load conversation history from database with message limit
        """
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at).limit(limit)

        messages = session.exec(statement).all()

        history = []
        for msg in messages:
            history.append({
                "role": msg.role,
                "message": msg.content
            })

        return history

    def save_message(self, session: Session, conversation_id: int, role: str, content: str,
                     tool_calls: Optional[str] = None, tool_call_results: Optional[str] = None) -> Message:
        """
        Save a message to the database
        """
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tool_calls=tool_calls,
            tool_call_results=tool_call_results
        )
        session.add(message)
        session.commit()
        session.refresh(message)
        return message

    def update_conversation_title(self, session: Session, conversation_id: int, title: str):
        """
        Update conversation title based on first message
        """
        statement = select(Conversation).where(Conversation.id == conversation_id)
        conversation = session.exec(statement).first()
        if conversation and not conversation.title:
            conversation.title = title[:100]  # Limit to 100 chars
            session.add(conversation)
            session.commit()

    def get_user_conversations(self, session: Session, user_id: int) -> List[Conversation]:
        """
        Get all conversations for a user
        """
        statement = select(Conversation).where(
            Conversation.user_id == user_id
        ).order_by(Conversation.updated_at.desc())

        conversations = session.exec(statement).all()
        return conversations