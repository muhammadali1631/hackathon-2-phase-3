from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
from src.models import Task, User, Conversation, Message
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("NEON_DB_URL")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

@contextmanager
def get_session():
    """Get database session"""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def get_session_dep():
    """Dependency for FastAPI to get database session"""
    with get_session() as session:
        yield session