# Data Model: Backend Todo API

**Feature**: 001-backend-todo-api
**Date**: 2026-01-06
**Model Version**: 1.0

## Entity: Task

**Description**: Represents a user's to-do item with properties like title, description, completion status, creation date, and user_id for ownership

### Fields
- **id** (Integer, Primary Key, Auto-generated)
  - Unique identifier for the task
  - Auto-incrementing integer
- **title** (String, Required, Max 255 chars)
  - The title of the task
  - Required field for all tasks
- **description** (String, Optional, Max 1000 chars)
  - Detailed description of the task
  - Optional field, can be null
- **completed** (Boolean, Default: false)
  - Status of the task completion
  - False = pending, True = completed
- **user_id** (Integer, Required, Foreign Key)
  - References the user who owns this task
  - Enforces data isolation between users
- **created_at** (DateTime, Auto-generated)
  - Timestamp when the task was created
  - Automatically set when record is created
- **updated_at** (DateTime, Auto-generated)
  - Timestamp when the task was last updated
  - Automatically updated when record is modified

### Relationships
- **Belongs to**: User (via user_id foreign key)
  - Each task is owned by exactly one user
  - Enforces user data isolation

### Validation Rules
- Title must be provided (not null/empty)
- Title length must be between 1-255 characters
- User_id must reference an existing user
- Completed field must be boolean (true/false)

### State Transitions
- **Created**: When task is first added (completed = false by default)
- **Updated**: When task details are modified (title, description)
- **Completed**: When task completion status is toggled (completed = true)
- **Reopened**: When completed task is toggled back (completed = false)
- **Deleted**: When task is removed from system

## Entity: User (Minimal Reference)

**Description**: Represents a registered user in the system, identified by user_id that is extracted from JWT tokens, with tasks linked via foreign key relationship. This entity is primarily managed by Better Auth.

### Fields
- **id** (Integer, Primary Key)
  - Unique identifier for the user
  - Extracted from JWT token's 'sub' field
- **tasks** (Relationship - One-to-Many)
  - Collection of tasks owned by this user
  - Used to enforce user data isolation

### Relationships
- **Has many**: Tasks (via tasks.user_id foreign key)
  - Each user can own multiple tasks
  - All queries must be filtered by user_id

### Validation Rules
- User must be authenticated to access any task endpoints
- User_id must match the authenticated user from JWT token
- No direct manipulation of user data through task API

## API Contract Requirements

### Task Creation
- Requires: title (string), optional: description (string)
- Automatically sets: user_id from JWT, completed=false, timestamps

### Task Retrieval
- Filters all queries by authenticated user_id
- Supports: status filtering (all/pending/completed), sorting (created/title/due_date)

### Task Updates
- Validates that authenticated user owns the task
- Updates: title, description, completed status
- Automatically updates: updated_at timestamp

### Task Deletion
- Validates that authenticated user owns the task
- Removes task from database
- Returns: 204 No Content on successful deletion