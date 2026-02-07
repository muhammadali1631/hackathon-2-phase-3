from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, List
from datetime import datetime
from src.models.conversation import ChatRequest, ChatResponse, Conversation
from src.services.chat_service import CohereRunner, ChatService
from db import get_session_dep
from auth import get_current_user
from src.models.user import User

router = APIRouter(tags=["chat"])

@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: int,
    request: ChatRequest,
    session: Session = Depends(get_session_dep),
    current_user: User = Depends(get_current_user)
):
    """
    Chat endpoint that processes natural language messages and returns AI-generated responses
    """
    print(f"DEBUG: Received user_id from path: {user_id}")
    print(f"DEBUG: Authenticated user ID: {current_user.id}")

    # Verify that the user_id in the path matches the authenticated user
    if current_user.id != user_id:
        print(f"DEBUG: User ID mismatch - path: {user_id}, authenticated: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Cannot access this conversation. Path user_id: {user_id}, Authenticated user_id: {current_user.id}"
        )

    try:
        # Initialize the Cohere runner
        cohere_runner = CohereRunner()

        # Run the conversation
        response = cohere_runner.run_conversation(
            session=session,
            user_id=user_id,
            user_message=request.message,
            conversation_id=request.conversation_id
        )

        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your request: {str(e)}"
        )


@router.get("/api/{user_id}/conversations", response_model=list)
async def get_user_conversations(
    user_id: int,
    session: Session = Depends(get_session_dep),
    current_user: User = Depends(get_current_user)
):
    """
    Get all conversations for the user
    """
    # Verify that the user_id in the path matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access these conversations"
        )

    try:
        chat_service = ChatService()
        conversations = chat_service.get_user_conversations(session, user_id)

        # Convert to simple dict representation
        result = []
        for conv in conversations:
            result.append({
                "id": conv.id,
                "title": conv.title,
                "created_at": conv.created_at,
                "updated_at": conv.updated_at,
                "is_active": conv.is_active
            })

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching conversations: {str(e)}"
        )


@router.get("/api/{user_id}/conversations/{conversation_id}/messages", response_model=list)
async def get_conversation_messages(
    user_id: int,
    conversation_id: int,
    session: Session = Depends(get_session_dep),
    current_user: User = Depends(get_current_user)
):
    """
    Get all messages for a specific conversation
    """
    # Verify that the user_id in the path matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access these conversations"
        )

    try:
        # Verify that the conversation belongs to the user
        chat_service = ChatService()
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        conversation = session.exec(statement).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )

        # Load conversation history
        history = chat_service.load_conversation_history(session, conversation_id)
        
        # Convert to simple dict representation
        result = []
        for msg in history:
            result.append({
                "role": msg["role"],
                "content": msg["message"],
                "timestamp": datetime.now().isoformat()  # Using current time since we don't store timestamps per message in the history
            })

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching conversation messages: {str(e)}"
        )