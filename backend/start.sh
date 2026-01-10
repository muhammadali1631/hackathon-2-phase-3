#!/bin/bash
# Startup script for the Todo API backend

# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI application with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000