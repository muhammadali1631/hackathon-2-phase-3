from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User, UserProfileResponse
import json
from datetime import datetime

class ToolsService:
    def __init__(self):
        pass

    def get_available_tools(self) -> List[Dict[str, Any]]:
        """
        Return the list of available tools in Cohere-compatible format
        """
        tools = [
            {
                "name": "add_task",
                "description": "Add a new task for the user",
                "parameter_definitions": {
                    "title": {
                        "description": "The title of the task",
                        "type": "str",
                        "required": True
                    },
                    "description": {
                        "description": "The description of the task",
                        "type": "str",
                        "required": False
                    },
                    "user_id": {
                        "description": "The user ID for whom to create the task",
                        "type": "int",
                        "required": True
                    }
                }
            },
            {
                "name": "list_tasks",
                "description": "List tasks for the user with optional filters",
                "parameter_definitions": {
                    "user_id": {
                        "description": "The user ID whose tasks to list",
                        "type": "int",
                        "required": True
                    },
                    "status": {
                        "description": "Filter by task status ('all', 'pending', 'completed')",
                        "type": "str",
                        "required": False,
                        "default": "all"
                    }
                }
            },
            {
                "name": "complete_task",
                "description": "Mark a task as completed",
                "parameter_definitions": {
                    "task_id": {
                        "description": "The ID of the task to complete",
                        "type": "int",
                        "required": True
                    },
                    "user_id": {
                        "description": "The user ID who owns the task",
                        "type": "int",
                        "required": True
                    }
                }
            },
            {
                "name": "delete_task",
                "description": "Delete a task",
                "parameter_definitions": {
                    "task_id": {
                        "description": "The ID of the task to delete",
                        "type": "int",
                        "required": True
                    },
                    "user_id": {
                        "description": "The user ID who owns the task",
                        "type": "int",
                        "required": True
                    }
                }
            },
            {
                "name": "update_task",
                "description": "Update a task's information",
                "parameter_definitions": {
                    "task_id": {
                        "description": "The ID of the task to update",
                        "type": "int",
                        "required": True
                    },
                    "title": {
                        "description": "The new title for the task",
                        "type": "str",
                        "required": False
                    },
                    "description": {
                        "description": "The new description for the task",
                        "type": "str",
                        "required": False
                    },
                    "completed": {
                        "description": "Whether the task is completed",
                        "type": "bool",
                        "required": False
                    },
                    "user_id": {
                        "description": "The user ID who owns the task",
                        "type": "int",
                        "required": True
                    }
                }
            },
            {
                "name": "get_user_profile",
                "description": "Get the user's profile information",
                "parameter_definitions": {
                    "user_id": {
                        "description": "The ID of the user to get profile for",
                        "type": "int",
                        "required": True
                    }
                }
            }
        ]
        return tools

    def execute_tool(self, session: Session, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool with given arguments
        """
        try:
            if tool_name == "add_task":
                return self._add_task(session, arguments)
            elif tool_name == "list_tasks":
                return self._list_tasks(session, arguments)
            elif tool_name == "complete_task":
                return self._complete_task(session, arguments)
            elif tool_name == "delete_task":
                return self._delete_task(session, arguments)
            elif tool_name == "update_task":
                return self._update_task(session, arguments)
            elif tool_name == "get_user_profile":
                return self._get_user_profile(session, arguments)
            else:
                return {"error": f"Unknown tool: {tool_name}", "success": False}
        except Exception as e:
            return {"error": str(e), "success": False}

    def _add_task(self, session: Session, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Add a new task for the user
        """
        user_id = args.get("user_id")

        # Ensure user_id is an integer for the database query
        user_id_int = int(user_id) if isinstance(user_id, str) else user_id

        title = args.get("title")
        description = args.get("description", "")

        # Verify user exists
        user_statement = select(User).where(User.id == user_id_int)
        user = session.exec(user_statement).first()
        if not user:
            return {"error": "User not found", "success": False}

        # Create task
        task_data = TaskCreate(title=title, description=description, completed=False)
        task = Task(
            title=task_data.title,
            description=task_data.description,
            completed=task_data.completed,
            user_id=user_id_int
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "success": True,
            "task_id": task.id,
            "message": f"Task '{task.title}' has been added successfully!"
        }

    def _list_tasks(self, session: Session, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        List tasks for the user with optional filters
        """
        user_id = args.get("user_id")
        print(f"DEBUG: _list_tasks called with user_id: {user_id} (type: {type(user_id)})")

        # Let's also check what tasks exist in the database for debugging
        all_users_stmt = select(Task.user_id).distinct()
        all_user_ids = session.exec(all_users_stmt).all()
        print(f"DEBUG: All user IDs in tasks table: {all_user_ids}")

        # Count tasks for this specific user
        user_task_count = session.exec(select(Task).where(Task.user_id == user_id)).all()
        print(f"DEBUG: Found {len(user_task_count)} tasks for user_id {user_id}")

        for task in user_task_count:
            print(f"DEBUG: Task {task.id} for user {task.user_id}: {task.title}")

        status_filter = args.get("status", "all")  # all, pending, completed

        # Ensure user_id is an integer for the database query
        user_id_int = int(user_id) if isinstance(user_id, str) else user_id
        print(f"DEBUG: Using user_id_int: {user_id_int} (original: {user_id})")

        # Build query
        statement = select(Task).where(Task.user_id == user_id_int)

        if status_filter == "pending":
            statement = statement.where(Task.completed == False)
        elif status_filter == "completed":
            statement = statement.where(Task.completed == True)

        statement = statement.order_by(Task.created_at.desc())
        tasks = session.exec(statement).all()

        task_list = []
        for task in tasks:
            task_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat()
            })

        print(f"DEBUG: Returning {len(task_list)} tasks for user {user_id}")
        return {
            "success": True,
            "tasks": task_list,
            "count": len(task_list),
            "message": f"Found {len(task_list)} tasks for user {user_id}" if len(task_list) > 0 else f"You don't have any tasks assigned to you at the moment."
        }

    def _complete_task(self, session: Session, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Mark a task as completed
        """
        task_id = args.get("task_id")
        user_id = args.get("user_id")

        # Ensure user_id is an integer for the database query
        user_id_int = int(user_id) if isinstance(user_id, str) else user_id

        # Get task and verify ownership
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id_int)
        task = session.exec(statement).first()

        if not task:
            return {"error": "Task not found or access denied", "success": False}

        # Update task
        task.completed = True
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "success": True,
            "message": f"Task '{task.title}' has been marked as completed!"
        }

    def _delete_task(self, session: Session, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Delete a task
        """
        task_id = args.get("task_id")
        user_id = args.get("user_id")

        # Ensure user_id is an integer for the database query
        user_id_int = int(user_id) if isinstance(user_id, str) else user_id

        # Get task and verify ownership
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id_int)
        task = session.exec(statement).first()

        if not task:
            return {"error": "Task not found or access denied", "success": False}

        # Delete task
        session.delete(task)
        session.commit()

        return {
            "success": True,
            "message": f"Task '{task.title}' has been deleted!"
        }

    def _update_task(self, session: Session, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a task's information
        """
        task_id = args.get("task_id")
        user_id = args.get("user_id")

        # Ensure user_id is an integer for the database query
        user_id_int = int(user_id) if isinstance(user_id, str) else user_id

        # Get task and verify ownership
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id_int)
        task = session.exec(statement).first()

        if not task:
            return {"error": "Task not found or access denied", "success": False}

        # Update fields if provided
        if "title" in args and args["title"] is not None:
            task.title = args["title"]
        if "description" in args and args["description"] is not None:
            task.description = args["description"]
        if "completed" in args and args["completed"] is not None:
            task.completed = args["completed"]

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "success": True,
            "message": f"Task '{task.title}' has been updated!"
        }

    def _get_user_profile(self, session: Session, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get the user's profile information
        """
        user_id = args.get("user_id")

        # Get user
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()

        if not user:
            return {"error": "User not found", "success": False}

        # Format response
        profile_response = UserProfileResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            createdAt=user.created_at.isoformat()
        )

        return {
            "success": True,
            "profile": profile_response.dict(),
            "message": "User profile retrieved successfully"
        }