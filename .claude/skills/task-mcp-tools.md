# Task MCP Tools

## add_task
- Purpose: Create new task
- Parameters: user_id (string, req), title (string, req), description (string, opt)
- Returns: {task_id: int, status: "created", title: str}
- DB: Insert into tasks table with user_id

## list_tasks
- Purpose: Get user's tasks
- Parameters: user_id (string, req), status (string, opt: "all"|"pending"|"completed")
- Returns: Array of {id, title, description, completed, created_at, updated_at}

## complete_task
- Purpose: Mark task complete
- Parameters: user_id (string, req), task_id (int, req)
- Returns: {task_id: int, status: "completed", title: str}
- Update: Set completed=true, updated_at=now

## delete_task
- Purpose: Delete task
- Parameters: user_id (string, req), task_id (int, req)
- Returns: {task_id: int, status: "deleted", title: str}
- Check ownership before delete

## update_task
- Purpose: Update task
- Parameters: user_id (string, req), task_id (int, req), title (string, opt), description (string, opt)
- Returns: {task_id: int, status: "updated", title: str}
- Only update provided fields