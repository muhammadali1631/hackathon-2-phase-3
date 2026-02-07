# Quickstart Guide: AI Todo Chatbot Integration (Cohere-Powered)

## Overview
This guide provides the essential steps to get the Cohere-powered AI chatbot running in your local development environment.

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- Access to Cohere API (command-r-plus model)
- Docker (optional, for database)

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install cohere-python SDK
pip install cohere
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env):**
```env
COHERE_API_KEY=your_cohere_api_key_here
NEON_DB_URL=postgresql://username:password@localhost:5432/todo_app
BETTER_AUTH_SECRET=your_auth_secret
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key_here  # Only if needed on frontend
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_domain_allowlist_key  # If using ChatKit
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Database Setup

### 1. Start Database
```bash
# Option A: Using Docker
docker-compose up -d

# Option B: Using existing PostgreSQL
# Ensure PostgreSQL is running and accessible
```

### 2. Run Migrations
```bash
# In backend directory
cd backend
source venv/bin/activate

# Apply database migrations (includes new Conversation and Message models)
alembic upgrade head
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
source venv/bin/activate

# Run the FastAPI server
uvicorn src.main:app --reload --port 8000
```

### 2. Start Frontend Server
```bash
cd frontend

# Run the Next.js development server
npm run dev
```

### 3. Application URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs

## Testing the Chatbot Feature

### 1. Register/Login
- Visit http://localhost:3000
- Register a new account or login with existing credentials

### 2. Access Chatbot
- Look for the floating chatbot icon in the bottom-right corner
- Click the icon to open the chat interface

### 3. Test Commands
Try these sample commands:
- "Add task buy groceries"
- "Show my pending tasks"
- "Complete task 1"
- "Mera email kya hai?"

## API Endpoints

### Chat Endpoint
```
POST /api/{user_id}/chat
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "message": "Add task buy milk",
  "conversation_id": "optional_conversation_uuid"
}
```

### Expected Response
```json
{
  "conversation_id": "uuid_of_conversation",
  "response": "Task 'buy milk' added successfully!",
  "tool_calls": [
    {
      "name": "add_task",
      "arguments": {"title": "buy milk"}
    }
  ]
}
```

## Troubleshooting

### Common Issues

#### 1. Cohere API Connection Issues
- Verify COHERE_API_KEY is correctly set
- Check internet connection
- Ensure command-r-plus model is available in your Cohere account

#### 2. Database Connection Issues
- Verify NEON_DB_URL is correctly formatted
- Ensure PostgreSQL server is running
- Check database credentials

#### 3. Authentication Issues
- Confirm JWT tokens are being passed correctly
- Verify BETTER_AUTH_SECRET matches between frontend and backend

#### 4. Chat Interface Not Loading
- Check browser console for JavaScript errors
- Verify frontend can connect to backend API
- Ensure CORS settings allow localhost connections

## Development Notes

### Adding New Tools
To add new MCP-compatible tools for the chatbot:
1. Define the tool in the tools_service.py
2. Implement the corresponding function
3. Add the tool definition to the Cohere tools list
4. Test the new functionality

### Modifying Data Models
When changing the Conversation or Message models:
1. Update the data-model.md documentation
2. Modify the SQLAlchemy/SQLModel classes
3. Create and run a new Alembic migration
4. Test the changes thoroughly

## Production Deployment
For production deployment:
- Use environment-appropriate database settings
- Implement proper secret management
- Configure domain allowlists for Cohere API
- Set up monitoring and logging
- Implement rate limiting