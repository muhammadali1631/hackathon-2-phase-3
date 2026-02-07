from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User model for database
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)

class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str = Field()
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    # last_chat_interaction: Optional[datetime] = Field(default=None)  # New field for chatbot integration (temporarily commented out for migration)

# Pydantic models for authentication
class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class UserSignIn(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    created_at: datetime

class UserProfileResponse(BaseModel):
    id: str
    email: str
    name: Optional[str]
    createdAt: str

class AuthResponse(BaseModel):
    user: UserProfileResponse
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"