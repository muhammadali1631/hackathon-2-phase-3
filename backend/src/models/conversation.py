from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel

class ConversationBase(SQLModel):
    title: Optional[str] = Field(default=None, max_length=100)
    user_id: int = Field(foreign_key="users.id", index=True)  # Foreign key to user, with index for performance
    is_active: bool = Field(default=True)

class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageBase(SQLModel):
    conversation_id: int = Field(foreign_key="conversations.id", index=True)  # Foreign key to conversation
    role: str = Field(regex="^(user|assistant|system)$")  # Enum-like validation
    content: str = Field(max_length=10000)  # Up to 10,000 characters
    tool_calls: Optional[str] = Field(default=None)  # JSON string for tool calls
    tool_call_results: Optional[str] = Field(default=None)  # JSON string for results

class Message(MessageBase, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Pydantic models for chat functionality
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    tool_calls: Optional[list] = []
    timestamp: str

class ConversationResponse(BaseModel):
    id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    is_active: bool