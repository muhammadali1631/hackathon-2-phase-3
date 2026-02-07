from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from src.models.user import User, UserCreate, UserSignIn, UserResponse, UserProfileResponse, AuthResponse, TokenResponse
from src.models.task import Task, TaskCreate, TaskUpdate, TaskToggleComplete, TaskResponse
from src.models.conversation import Conversation, Message, ChatRequest, ChatResponse, ConversationResponse

# Import all models for SQLModel metadata
__all__ = [
    "User", "Task", "Conversation", "Message",
    "UserCreate", "UserSignIn", "UserResponse", "UserProfileResponse",
    "AuthResponse", "TokenResponse", "TaskCreate", "TaskUpdate",
    "TaskToggleComplete", "TaskResponse", "ChatRequest", "ChatResponse",
    "ConversationResponse", "pwd_context"
]