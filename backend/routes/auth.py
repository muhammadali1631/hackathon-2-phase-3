from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime, timedelta, timezone
import jwt
import os
import bcrypt
from dotenv import load_dotenv

from models import User, UserCreate, UserSignIn, UserResponse, TokenResponse, UserProfileResponse, AuthResponse
from db import get_session_dep
import sys
import os
# Add the parent directory to the path to allow importing from the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth import get_current_user_id

# Load environment variables
load_dotenv()

# Get secret from environment
SECRET = os.getenv("BETTER_AUTH_SECRET", "secret")

router = APIRouter()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt, ensuring it's not too long"""
    # Bcrypt has a 72-byte password length limit
    # Truncate if needed to avoid bcrypt errors
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    # Ensure password is properly truncated to avoid bcrypt length issues
    password = password[:72]  # Additional safety truncation
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default to 7 days
        expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET, algorithm="HS256")
    return encoded_jwt

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, session: Session = Depends(get_session_dep)):
    """Create a new user account and return user profile with JWT token"""
    # Check if user with email already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    # Hash the password
    password_hash = hash_password(user.password)

    # Create new user
    db_user = User(
        email=user.email,
        password_hash=password_hash,
        name=user.name
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create JWT token for the new user
    token_data = {
        "sub": str(db_user.id),  # Ensure sub is a string as per JWT specification
        "email": db_user.email
    }

    access_token = create_access_token(data=token_data)

    # Return user profile and token in the format expected by frontend
    return AuthResponse(
        user=UserProfileResponse(
            id=f"usr_{db_user.id}",
            email=db_user.email,
            name=db_user.name,
            createdAt=db_user.created_at.isoformat()
        ),
        token=access_token
    )

@router.post("/signin", response_model=AuthResponse)
def signin(user_credentials: UserSignIn, session: Session = Depends(get_session_dep)):
    """Sign in user and return user profile with JWT token"""
    # Find user by email
    user = session.exec(select(User).where(User.email == user_credentials.email)).first()

    # Verify user exists and password is correct
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token with user info
    token_data = {
        "sub": str(user.id),  # Ensure sub is a string as per JWT specification
        "email": user.email
    }

    access_token = create_access_token(data=token_data)

    # Return user profile and token in the format expected by frontend
    return AuthResponse(
        user=UserProfileResponse(
            id=f"usr_{user.id}",
            email=user.email,
            name=user.name,
            createdAt=user.created_at.isoformat()
        ),
        token=access_token
    )

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(current_user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session_dep)):
    """Get the current authenticated user's profile information"""
    # Find user by ID from JWT token
    user = session.get(User, current_user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Return user profile in the required format
    return UserProfileResponse(
        id=f"usr_{user.id}",  # Format as requested: usr_ + user.id
        email=user.email,
        name=user.name,
        createdAt=user.created_at.isoformat()  # Convert to ISO format string
    )