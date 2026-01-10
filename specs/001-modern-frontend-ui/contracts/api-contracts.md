# API Contracts: Modern Frontend UI for Todo Application

## Authentication Endpoints

### POST /api/auth/login
**Description**: Authenticate user and return JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401)**:
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_001"
}
```

### POST /api/auth/signup
**Description**: Create new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201)**:
```json
{
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (409)**:
```json
{
  "error": "Email already exists",
  "code": "AUTH_002"
}
```

## Task Management Endpoints

### GET /api/tasks
**Description**: Retrieve all tasks for the authenticated user

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (200)**:
```json
{
  "tasks": [
    {
      "id": "task_12345",
      "title": "Complete project proposal",
      "description": "Finish the project proposal document for client review",
      "completed": false,
      "userId": "user_12345",
      "createdAt": "2026-01-05T10:00:00Z",
      "updatedAt": "2026-01-05T10:00:00Z",
      "dueDate": "2026-01-10T18:00:00Z"
    }
  ]
}
```

### POST /api/tasks
**Description**: Create a new task for the authenticated user

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "title": "Complete project proposal",
  "description": "Finish the project proposal document for client review",
  "dueDate": "2026-01-10T18:00:00Z"
}
```

**Response (201)**:
```json
{
  "task": {
    "id": "task_12345",
    "title": "Complete project proposal",
    "description": "Finish the project proposal document for client review",
    "completed": false,
    "userId": "user_12345",
    "createdAt": "2026-01-05T10:00:00Z",
    "updatedAt": "2026-01-05T10:00:00Z",
    "dueDate": "2026-01-10T18:00:00Z"
  }
}
```

### PUT /api/tasks/{taskId}
**Description**: Update an existing task

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "dueDate": "2026-01-12T18:00:00Z"
}
```

**Response (200)**:
```json
{
  "task": {
    "id": "task_12345",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true,
    "userId": "user_12345",
    "createdAt": "2026-01-05T10:00:00Z",
    "updatedAt": "2026-01-05T11:00:00Z",
    "dueDate": "2026-01-12T18:00:00Z"
  }
}
```

### DELETE /api/tasks/{taskId}
**Description**: Delete a task

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (200)**:
```json
{
  "success": true
}
```

**Response (404)**:
```json
{
  "error": "Task not found",
  "code": "TASK_001"
}
```