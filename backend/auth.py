from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
import os
from dotenv import load_dotenv
from typing import Optional
from sqlmodel import Session
from models import User
from db import get_session_dep

# Load environment variables
load_dotenv()

# Initialize security for Bearer token
security = HTTPBearer()

# Get secret from environment
SECRET = os.getenv("BETTER_AUTH_SECRET", "secret")

class TokenData(BaseModel):
    user_id: int

def verify_token(token: str) -> Optional[TokenData]:
    """Verify JWT token and extract user_id"""
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])

        # Extract user_id (typically stored in 'sub' field by Better Auth)
        user_id: int = payload.get("sub")

        # Handle case where sub might be stored as string
        if isinstance(user_id, str) and user_id.isdigit():
            user_id = int(user_id)

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token_data = TokenData(user_id=user_id)
        return token_data
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user ID from JWT token"""
    token_data = verify_token(credentials.credentials)
    return token_data.user_id


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), session: Session = Depends(get_session_dep)):
    """Get current user object from JWT token"""
    token_data = verify_token(credentials.credentials)
    user_id = token_data.user_id

    # Retrieve the full user object from the database
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user