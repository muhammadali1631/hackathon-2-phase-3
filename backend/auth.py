from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
import os
from dotenv import load_dotenv
from typing import Optional

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
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token_data = verify_token(credentials.credentials)
    return token_data.user_id