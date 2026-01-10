# OpenAPI Contract: Backend Todo API

**Feature**: 001-backend-todo-api
**Date**: 2026-01-06
**API Version**: 1.0.0
**OpenAPI Version**: 3.0.0

## API Endpoints Contract

### Base Path
All API endpoints are accessible under `/api/` prefix

### Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Common Error Responses
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Attempting to access resources owned by another user
- `404 Not Found`: Requested resource does not exist
- `422 Unprocessable Entity`: Validation error in request parameters

---

## Task Endpoints

### 1. Create Task
**Endpoint**: `POST /api/tasks`

**Description**: Create a new task for the authenticated user

**Request Body**:
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional, max 1000 chars)"
}
```

**Request Headers**:
- `Authorization: Bearer <jwt-token>`

**Success Response**:
- `201 Created`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token
- `422 Unprocessable Entity`: Missing title or invalid parameters

---

### 2. Get All Tasks
**Endpoint**: `GET /api/tasks`

**Description**: Retrieve all tasks for the authenticated user with optional filtering

**Query Parameters**:
- `status` (optional): "all", "pending", "completed" (default: "all")
- `sort` (optional): "created", "title", "due_date" (default: "created")

**Request Headers**:
- `Authorization: Bearer <jwt-token>`

**Success Response**:
- `200 OK`
```json
[
  {
    "id": "integer",
    "title": "string",
    "description": "string or null",
    "completed": "boolean",
    "user_id": "integer",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token

---

### 3. Get Single Task
**Endpoint**: `GET /api/tasks/{id}`

**Description**: Retrieve a specific task by ID for the authenticated user

**Path Parameters**:
- `id` (integer): Task ID

**Request Headers**:
- `Authorization: Bearer <jwt-token>`

**Success Response**:
- `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Task belongs to another user
- `404 Not Found`: Task does not exist

---

### 4. Update Task
**Endpoint**: `PUT /api/tasks/{id}`

**Description**: Update an existing task for the authenticated user

**Path Parameters**:
- `id` (integer): Task ID

**Request Body**:
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional, max 1000 chars)"
}
```

**Request Headers**:
- `Authorization: Bearer <jwt-token>`

**Success Response**:
- `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Task belongs to another user
- `404 Not Found`: Task does not exist
- `422 Unprocessable Entity`: Invalid parameters

---

### 5. Toggle Task Completion
**Endpoint**: `PATCH /api/tasks/{id}/complete`

**Description**: Toggle the completion status of a task for the authenticated user

**Path Parameters**:
- `id` (integer): Task ID

**Request Headers**:
- `Authorization: Bearer <jwt-token>`

**Success Response**:
- `200 OK`
```json
{
  "id": "integer",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Task belongs to another user
- `404 Not Found`: Task does not exist

---

### 6. Delete Task
**Endpoint**: `DELETE /api/tasks/{id}`

**Description**: Delete a task for the authenticated user

**Path Parameters**:
- `id` (integer): Task ID

**Request Headers**:
- `Authorization: Bearer <jwt-token>`

**Success Response**:
- `204 No Content`

**Error Responses**:
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Task belongs to another user
- `404 Not Found`: Task does not exist

---

## Data Models

### Task Model
```json
{
  "id": "integer (auto-generated)",
  "title": "string (required, max 255 chars)",
  "description": "string (optional, max 1000 chars)",
  "completed": "boolean (default: false)",
  "user_id": "integer (foreign key)",
  "created_at": "datetime (auto-generated)",
  "updated_at": "datetime (auto-generated)"
}
```

### User Model (Reference)
```json
{
  "id": "integer (extracted from JWT)",
  "tasks": "array of Task objects (relationship)"
}
```

## Security Requirements
- JWT token verification on all endpoints
- User ID extraction from JWT token
- Task ownership validation (user can only access own tasks)
- No data leakage between users