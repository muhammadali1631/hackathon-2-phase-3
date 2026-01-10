# Quickstart Guide: Backend Todo API

**Feature**: 001-backend-todo-api
**Date**: 2026-01-06

## Prerequisites

- Python 3.11+
- pip package manager
- Access to Neon Serverless PostgreSQL database
- Better Auth configured on frontend with shared JWT secret

## Setup Instructions

### 1. Clone and Navigate to Project
```bash
# If you haven't already, navigate to your project directory
cd /path/to/your/project
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install fastapi uvicorn sqlmodel python-dotenv pyjwt
```

### 4. Create Environment File
Create a `.env` file in your backend root directory with the following content:

```env
BETTER_AUTH_SECRET=secret
BETTER_AUTH_URL=http://localhost:3000
NEON_DB_URL=postgresql://neonpg_5xMPfhq9XgaS@ep-bitter-cloud-adk6f8ds-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 5. Project Structure
Create the following directory structure:

```
backend/
├── main.py                 # FastAPI application entry point
├── .env                    # Environment variables
├── models.py               # SQLModel database models
├── db.py                   # Database connection and session
├── auth.py                 # JWT authentication middleware
└── routes/
    └── tasks.py            # Task CRUD endpoints
```

## Running the Application

### 1. Start the Development Server
```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### 2. API Documentation
- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

### 3. Environment Variables
Make sure the following environment variables are set in your `.env` file:
- `BETTER_AUTH_SECRET` - Shared secret for JWT verification
- `NEON_DB_URL` - Connection string for Neon Serverless PostgreSQL

## API Endpoints

### Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Task Endpoints

#### Create Task
- `POST /api/tasks`
- Request body: `{"title": "Task title", "description": "Optional description"}`
- Response: Created task object with 201 status

#### Get All Tasks
- `GET /api/tasks`
- Query parameters: `status` (all/pending/completed), `sort` (created/title)
- Response: Array of user's tasks

#### Get Single Task
- `GET /api/tasks/{id}`
- Response: Single task object

#### Update Task
- `PUT /api/tasks/{id}`
- Request body: `{"title": "New title", "description": "New description"}`
- Response: Updated task object

#### Toggle Task Completion
- `PATCH /api/tasks/{id}/complete`
- Response: Task object with updated completion status

#### Delete Task
- `DELETE /api/tasks/{id}`
- Response: 204 No Content

## Testing the API

### Using curl
```bash
# Get all tasks (replace YOUR_TOKEN with actual JWT)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/tasks

# Create a task
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title": "Test task", "description": "A test task"}' \
     http://localhost:8000/api/tasks
```

### Integration with Frontend
The backend is designed to work seamlessly with the Next.js frontend that uses Better Auth. The frontend should:
1. Obtain JWT token from Better Auth after successful login
2. Include the token in the Authorization header for all API requests
3. Handle 401 (unauthorized) and 403 (forbidden) responses appropriately

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Verify NEON_DB_URL is correct and database is accessible
2. **JWT Verification Failures**: Ensure BETTER_AUTH_SECRET matches the frontend configuration
3. **CORS Errors**: Check that your frontend domain is properly configured in CORS middleware
4. **User Isolation Not Working**: Verify that all endpoints properly filter by authenticated user_id

### Environment Setup Verification
```bash
# Check if environment variables are loaded
python -c "import os; print('DB URL loaded:', bool(os.getenv('NEON_DB_URL')))"
```