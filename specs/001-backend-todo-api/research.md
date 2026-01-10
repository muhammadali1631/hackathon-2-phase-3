# Research Summary: Backend Todo API

**Feature**: 001-backend-todo-api
**Date**: 2026-01-06
**Research Phase**: Complete

## Research Tasks Completed

### 1. JWT Authentication Middleware Design

**Decision**: Use FastAPI Depends with reusable get_current_user dependency
**Rationale**: Cleaner implementation that is reusable across all routes requiring authentication. This approach follows FastAPI best practices and allows for consistent authentication handling throughout the API.
**Alternatives considered**: Manual JWT extraction in each route handler (would lead to code duplication and maintenance issues)

### 2. Database Session Management

**Decision**: Per-request Session via dependency
**Rationale**: Best practice for FastAPI + SQLModel applications. Ensures proper connection handling, automatic cleanup, and prevents connection leaks. Each request gets its own session which is closed after the request completes.
**Alternatives considered**: Global session (would cause concurrency issues and potential data leakage between requests)

### 3. Environment Variable Loading

**Decision**: python-dotenv
**Rationale**: Simple approach that matches the provided .env example in the specification. Lightweight and straightforward for the hackathon requirements.
**Alternatives considered**: pydantic-settings (more complex than needed for this use case)

### 4. CORS Configuration

**Decision**: Specific origin with credentials support
**Rationale**: More secure than wildcard configuration and works properly with Better Auth cookies if any. Allows the frontend to make authenticated requests to the backend.
**Alternatives considered**: Wildcard CORS configuration (less secure and potentially allows unauthorized cross-origin requests)

### 5. JWT Library Selection

**Decision**: pyjwt
**Rationale**: Lightweight, widely used library that is sufficient for JWT verification. Well-documented and commonly used with FastAPI applications.
**Alternatives considered**: authlib (more complex and feature-rich than needed for simple JWT verification)

### 6. Database Schema Creation

**Decision**: SQLModel create_all on startup
**Rationale**: Acceptable for hackathon project and Neon handles schema management. Ensures database tables exist when the application starts.
**Alternatives considered**: Manual migrations (overkill for hackathon scope)

### 7. API Endpoint Structure

**Decision**: All routes under /api/ prefix
**Rationale**: Clean separation of API endpoints from potential future root-level routes. Matches the specification requirement.
**Alternatives considered**: Root-level endpoints (would mix API and web routes)

### 8. Response Model Design

**Decision**: Separate Pydantic models for TaskCreate, TaskUpdate, TaskResponse
**Rationale**: Better validation and documentation. Allows for different validation rules and fields for different operations (e.g., TaskCreate doesn't need an ID, TaskResponse might include additional computed fields).
**Alternatives considered**: Single model for all operations (less flexible and less clear validation)

## Architecture Research

### Backend Structure
- **Folder structure**: backend/src/ with models/, services/, api/, db/ subdirectories
- **Dependency flow**: API routes depend on services, services depend on models/db
- **Middleware pipeline**: CORS → Authentication → Request handling

### JWT Token Verification Process
- Decode JWT with BETTER_AUTH_SECRET
- Extract user_id from token payload (typically in 'sub' field)
- Validate token expiration (exp) and issued-at (iat) claims
- Return user_id for use in route handlers

### SQLModel Implementation Strategy
- Define Task model with user_id foreign key relationship to User
- Define minimal User model (since Better Auth manages users)
- Create database session dependency for FastAPI
- Implement connection pooling for Neon Serverless PostgreSQL

## Integration Points with Frontend

### API Base URL
- Backend API will be available at /api/ endpoints
- Frontend will make requests to http://localhost:8000/api/ in development
- JWT tokens will be automatically attached by frontend from Better Auth

### JWT Flow
- Frontend handles user authentication via Better Auth
- JWT tokens issued by Better Auth will be verified by backend
- Tokens will be sent in Authorization header: "Bearer {token}"

### Error Code Mapping
- 401: Invalid/missing JWT token
- 403: Unauthorized access to resources owned by other users
- 404: Resource not found
- 422: Validation errors for request parameters