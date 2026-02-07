from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from models import Task, TaskCreate, TaskUpdate, TaskResponse, TaskToggleComplete
from db import get_session_dep
from auth import get_current_user_id
from datetime import datetime, timezone

router = APIRouter()

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, current_user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session_dep)):
    """Create a new task for the authenticated user"""
    # Create task with user_id from authenticated user
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=current_user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    # Return task in the format expected by frontend
    return TaskResponse(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        completed=db_task.completed,
        userId=f"usr_{db_task.user_id}",  # Format as expected by frontend
        createdAt=db_task.created_at.isoformat(),
        updatedAt=db_task.updated_at.isoformat()
    )

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    current_user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session_dep),
    status_filter: str = "all",  # all, pending, completed
    sort: str = "created"  # created, title
):
    """Get all tasks for the authenticated user with optional filtering and sorting"""
    # Build query to get tasks for current user only
    query = session.query(Task).filter(Task.user_id == current_user_id)

    # Apply status filter
    if status_filter == "pending":
        query = query.filter(Task.completed == False)
    elif status_filter == "completed":
        query = query.filter(Task.completed == True)

    # Apply sorting
    if sort == "title":
        query = query.order_by(Task.title)
    elif sort == "created":
        query = query.order_by(Task.created_at.desc())
    # Add other sort options if needed

    db_tasks = query.all()
    # Convert to response format expected by frontend
    return [
        TaskResponse(
            id=db_task.id,
            title=db_task.title,
            description=db_task.description,
            completed=db_task.completed,
            userId=f"usr_{db_task.user_id}",  # Format as expected by frontend
            createdAt=db_task.created_at.isoformat(),
            updatedAt=db_task.updated_at.isoformat()
        )
        for db_task in db_tasks
    ]

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, current_user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session_dep)):
    """Get a specific task by ID for the authenticated user"""
    db_task = session.get(Task, task_id)

    # Check if task exists and belongs to current user
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    # Return task in the format expected by frontend
    return TaskResponse(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        completed=db_task.completed,
        userId=f"usr_{db_task.user_id}",  # Format as expected by frontend
        createdAt=db_task.created_at.isoformat(),
        updatedAt=db_task.updated_at.isoformat()
    )

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, current_user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session_dep)):
    """Update a specific task by ID for the authenticated user"""
    db_task = session.get(Task, task_id)

    # Check if task exists and belongs to current user
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update fields if provided
    if task_update.title is not None:
        db_task.title = task_update.title
    if task_update.description is not None:
        db_task.description = task_update.description

    # Update the timestamp
    db_task.updated_at = datetime.now(timezone.utc)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    # Return task in the format expected by frontend
    return TaskResponse(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        completed=db_task.completed,
        userId=f"usr_{db_task.user_id}",  # Format as expected by frontend
        createdAt=db_task.created_at.isoformat(),
        updatedAt=db_task.updated_at.isoformat()
    )

@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(task_id: int, task_toggle: TaskToggleComplete, current_user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session_dep)):
    """Toggle the completion status of a specific task for the authenticated user"""
    db_task = session.get(Task, task_id)

    # Check if task exists and belongs to current user
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Toggle completion status
    db_task.completed = task_toggle.completed
    db_task.updated_at = datetime.now(timezone.utc)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    # Return task in the format expected by frontend
    return TaskResponse(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        completed=db_task.completed,
        userId=f"usr_{db_task.user_id}",  # Format as expected by frontend
        createdAt=db_task.created_at.isoformat(),
        updatedAt=db_task.updated_at.isoformat()
    )

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, current_user_id: int = Depends(get_current_user_id), session: Session = Depends(get_session_dep)):
    """Delete a specific task by ID for the authenticated user"""
    task = session.get(Task, task_id)

    # Check if task exists and belongs to current user
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()

    return