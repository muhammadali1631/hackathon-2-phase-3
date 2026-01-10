# Todo API Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure your `.env` file has the required environment variables:
```env
BETTER_AUTH_SECRET=secret
BETTER_AUTH_URL=http://localhost:3000
NEON_DB_URL=postgresql://neondb_owner:npg_5xMPfhq9XgaS@ep-bitter-cloud-adk6f8ds-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Running the Application

Start the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health check
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

All task endpoints are under `/api/`:
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete a task