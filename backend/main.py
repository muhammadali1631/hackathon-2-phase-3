from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tasks
from routes import auth
from src.api import chat
from db import create_db_and_tables

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware - allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include auth routes under /api prefix
app.include_router(auth.router, prefix="/api")

# Include task routes under /api prefix
app.include_router(tasks.router, prefix="/api")

# Include chat routes under /api prefix
app.include_router(chat.router, prefix="")

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}