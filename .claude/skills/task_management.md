# Task Management Skill

A comprehensive task management system with RESTful API endpoints for creating, reading, updating, and deleting tasks.

## API Endpoints

### `create_task(title: str, description?: str)` → `POST /api/tasks`
Creates a new task with the provided title and optional description.

**Parameters:**
- `title` (str, required): The title of the task
- `description` (str, optional): Additional details about the task

**Response:**
- Returns the created task object with ID, timestamps, and initial status

### `list_tasks(status?: str, sort?: str)` → `GET /api/tasks`
Retrieves a list of all tasks with optional filtering and sorting.

**Parameters:**
- `status` (str, optional): Filter tasks by status ('todo', 'in-progress', 'completed')
- `sort` (str, optional): Sort order ('asc', 'desc', 'created-asc', 'created-desc')

**Response:**
- Returns an array of task objects matching the criteria

### `get_task(id: int)` → `GET /api/tasks/{id}`
Retrieves a specific task by its ID.

**Parameters:**
- `id` (int): The unique identifier of the task

**Response:**
- Returns the task object or a 404 error if not found

### `update_task(id: int, updates)` → `PUT /api/tasks/{id}`
Updates an existing task with the provided changes.

**Parameters:**
- `id` (int): The unique identifier of the task to update
- `updates` (object): Object containing the properties to update

**Response:**
- Returns the updated task object or a 404 error if not found

### `delete_task(id: int)` → `DELETE /api/tasks/{id}`
Removes a task by its ID.

**Parameters:**
- `id` (int): The unique identifier of the task to delete

**Response:**
- Returns 204 No Content on successful deletion or 404 if not found

### `toggle_complete(id: int)` → `PATCH /api/tasks/{id}/complete`
Toggles the completion status of a task.

**Parameters:**
- `id` (int): The unique identifier of the task to toggle

**Response:**
- Returns the updated task object with the toggled status or a 404 error if not found

## Data Model

### Task Object
```typescript
{
  id: number,           // Unique identifier
  title: string,        // Task title
  description?: string, // Optional description
  status: 'todo' | 'in-progress' | 'completed', // Current status
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

## Implementation Details

- All endpoints follow RESTful conventions
- Proper HTTP status codes are returned (200, 201, 204, 400, 404, 500)
- Input validation is performed on all requests
- Error handling is implemented for edge cases
- In-memory storage is used (would typically connect to a database in production)

## Usage Examples

### Creating a Task
```javascript
// POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the task management system"
}
```

### Updating a Task
```javascript
// PUT /api/tasks/1
{
  "status": "in-progress",
  "description": "Working on the implementation"
}
```

### Toggling Completion
```javascript
// PATCH /api/tasks/1/complete
// Returns the task with toggled status
```