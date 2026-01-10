from sqlmodel import SQLModel, Field, create_engine, Session
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

# Task model for database
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="users.id", index=True)  # Foreign key to user, with index for performance

class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Pydantic models for API requests/responses
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class TaskToggleComplete(BaseModel):
    completed: bool

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    userId: str  # Map to frontend's expected field name and type
    createdAt: str  # ISO format string
    updatedAt: str  # ISO format string

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

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserProfileResponse(BaseModel):
    id: str
    email: str
    name: Optional[str]
    createdAt: str

class AuthResponse(BaseModel):
    user: UserProfileResponse
    token: str