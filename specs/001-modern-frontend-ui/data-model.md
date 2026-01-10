# Data Model: Modern Frontend UI for Todo Application

**Feature**: 001-modern-frontend-ui
**Date**: 2026-01-05
**Status**: Complete

## Key Entities

### User
Represents a person using the application with authentication credentials and preferences.

**Attributes**:
- id: string (unique identifier from authentication system)
- email: string (user's email address, validated format)
- name: string (user's display name)
- createdAt: string (ISO date string when account was created)
- preferences: object (user preferences including theme setting)

**Validation Rules**:
- email must be a valid email format
- name must be 1-50 characters
- id must be unique across all users

### Task
Represents a todo item created by a user with title, description, and completion status.

**Attributes**:
- id: string (unique identifier for the task)
- title: string (task title, required)
- description: string (optional task description)
- completed: boolean (completion status, default: false)
- userId: string (foreign key linking to user who created the task)
- createdAt: string (ISO date string when task was created)
- updatedAt: string (ISO date string when task was last modified)
- dueDate: string (optional, ISO date string for task deadline)

**Validation Rules**:
- title must be 1-200 characters
- userId must reference an existing user
- completed must be boolean
- dueDate, if provided, must be a valid future date

## State Transitions

### Task State Transitions
- **Created**: New task with completed=false
- **Completed**: Task marked as completed (completed=true)
- **Reopened**: Completed task marked as incomplete (completed=false)
- **Deleted**: Task removed from user's list

## Relationships

### User → Task
- One-to-Many relationship
- User can have zero or many tasks
- Each task belongs to exactly one user
- Tasks are filtered by userId for data isolation

## API Data Contracts

### Authentication Responses
- **Login Response**: { user: User, token: string }
- **Signup Response**: { user: User, token: string }
- **Token Refresh**: { token: string }

### Task API Responses
- **Get Tasks**: { tasks: Task[] }
- **Get Task**: { task: Task }
- **Create Task**: { task: Task }
- **Update Task**: { task: Task }
- **Delete Task**: { success: boolean }

### Validation Error Format
- **Error Response**: { error: string, field?: string, code: string }