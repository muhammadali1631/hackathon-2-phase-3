# Feature Specification: Backend Todo API

**Feature Branch**: `001-backend-todo-api`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Backend Specification for Hackathon Phase 2 Todo Full-Stack Web Application
Target audience: Hackathon judges evaluating secure, scalable backend architecture, spec-driven implementation, and seamless full-stack integration; end-users relying on reliable task persistence and user isolation in a multi-user Todo app
Focus: Develop a robust, secure FastAPI backend with SQLModel ORM for Neon Serverless PostgreSQL, implementing all RESTful API endpoints for task CRUD operations, JWT-based authentication verification integrated with Better Auth from the frontend, and full enforcement of user data isolation, ensuring perfect interoperability with the Next.js frontend via shared JWT secrets and environment variables
Success criteria:

All 6 RESTful endpoints fully implemented as specified in @specs/api/rest-endpoints.md (GET /api/tasks, POST /api/tasks, GET /api/tasks/{id}, PUT /api/tasks/{id}, DELETE /api/tasks/{id}, PATCH /api/tasks/{id}/complete)
JWT middleware correctly verifies tokens on every protected route using the shared BETTER_AUTH_SECRET, extracts user_id, and enforces task ownership (401 Unauthorized for invalid/missing tokens)
Database schema exactly matches @specs/database/schema.md: 'users' table (managed by Better Auth integration) and 'tasks' table with user_id foreign key, indexes for user_id and completed
SQLModel used for all ORM operations: models in models.py, database connection in db.py via NEON_DB_URL env var
User isolation enforced: All queries filter by authenticated user_id from JWT; no data leakage between users
Query parameters supported: For GET /api/tasks – status (\"all\"/\"pending\"/\"completed\"), sort (\"created\"/\"title\"/\"due_date\" if extended)
Error handling: Use HTTPException for validation errors (e.g., missing title), 404 for non-existent tasks, 403 for unauthorized task access
Pydantic models for request/response validation on all endpoints
Backend runs independently with uvicorn main:app --reload and integrates via docker-compose.yml
Seamless frontend integration: API calls from frontend's /lib/api.ts succeed with JWT headers; auth flow from Better Auth issues verifiable tokens
Environment variables loaded correctly: BETTER_AUTH_SECRET for JWT, NEON_DB_URL for DB connection (use provided example values for setup)
Performance optimizations: Efficient queries with indexes; connection pooling for Neon DB
Entire backend generated via Claude Code using references to @specs/features/task-crud.md, @specs/features/authentication.md, @specs/agents/task-agent.md, @specs/agents/auth-agent.md, @specs/skills/task-skills.md, @specs/skills/auth-skills.md
Judges confirm: \"Secure, efficient, and perfectly integrated – no vulnerabilities, full spec compliance\"

Constraints:

Technology locked: FastAPI (Python), SQLModel (ORM), Neon Serverless PostgreSQL, PyJWT or equivalent for token verification (no additional installs beyond stack)
No manual coding: All generation via Spec-Kit and Claude Code prompts referencing specs
Authentication: FastAPI middleware for JWT verification; integrate with Better Auth's frontend-issued tokens using shared BETTER_AUTH_SECRET env var
Structure: Follow backend/CLAUDE.md guidelines exactly (main.py entry, models.py, routes/ folder for handlers, db.py for connection)
Environment variables: Use .env file with BETTER_AUTH_SECRET=secret, BETTER_AUTH_URL=http://localhost:3000, NEON_DB_URL=postgresql://neonpg_5xMPfhq9XgaS@ep-bitter-cloud-adk6f8ds-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require (load via dotenv or similar)
Stateless auth: No shared DB sessions; JWT for verification only
API base: All routes under /api/ (e.g., /api/tasks); CORS enabled for frontend origin
Database: Neon-specific connection string; handle migrations implicitly via SQLModel (create_all on startup if needed)
Exclude frontend generation in this spec (assume frontend is complete; focus on backend and integration points)
Timeline: Complete backend before full-stack testing; ensure integration succeeds without modifications to frontend

Not building:

Frontend UI or Next.js components (handled in separate frontend spec)
Better Auth library itself (use as-is for frontend; backend only verifies JWTs)
Advanced database features like full-text search, pagination beyond basic filtering, or real-time updates (WebSockets)
Custom authentication beyond JWT (no OAuth, no email verification)
Testing frameworks or CI/CD pipelines (focus on core backend logic)
Deployment configurations (e.g., Heroku, Vercel – local docker-compose only)
Phase 3 chatbot or MCP tools (keep to Phase 2 basics)

Final note: The backend must be rock-solid, secure, and integrate flawlessly with the frontend – every endpoint should handle real-world scenarios like concurrent requests, invalid inputs, and token expiry. Use the provided .env example to ensure immediate testability, and reference all specs precisely in Claude prompts for traceable, agentic development. This will make the full-stack app production-grade in security and performance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Tasks (Priority: P1)

As a registered user, I want to create new tasks in the system so that I can track my to-dos and responsibilities. When I submit a task with a title and optional details, the system should store it securely and make it available only to me.

**Why this priority**: This is the foundational functionality of a todo app - without the ability to create tasks, no other features matter.

**Independent Test**: Can be fully tested by creating a task via the API and verifying it appears in the user's task list without affecting other users' data.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with a valid JWT token, **When** I POST to /api/tasks with a valid task payload, **Then** the task is created in the database linked to my user ID and returned with a 201 status code
2. **Given** I am an unauthenticated user or have an invalid JWT token, **When** I POST to /api/tasks, **Then** I receive a 401 Unauthorized response and no task is created

---

### User Story 2 - View Tasks (Priority: P1)

As a registered user, I want to view my tasks so that I can see what I need to do. When I request my tasks, I should only see the ones I created and not tasks from other users.

**Why this priority**: This is essential for the core functionality - users need to see their tasks to manage them effectively.

**Independent Test**: Can be fully tested by creating tasks for multiple users and verifying each user only sees their own tasks.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with multiple tasks, **When** I GET /api/tasks, **Then** I receive a list containing only my tasks with a 200 status code
2. **Given** I am an authenticated user filtering tasks by status, **When** I GET /api/tasks with status parameter, **Then** I receive only tasks matching the specified status (all/pending/completed)
3. **Given** I am an unauthenticated user, **When** I GET /api/tasks, **Then** I receive a 401 Unauthorized response

---

### User Story 3 - Update Tasks (Priority: P2)

As a registered user, I want to update my existing tasks so that I can modify their details or mark them as complete. When I update a task, it should only affect tasks I own.

**Why this priority**: Task management includes the ability to modify existing tasks, which is essential for a functional todo system.

**Independent Test**: Can be fully tested by updating a task and verifying the changes are reflected while maintaining user isolation.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user and own a specific task, **When** I PUT /api/tasks/{id} with updated data, **Then** the task is updated and returned with a 200 status code
2. **Given** I am an authenticated user trying to update a task that belongs to another user, **When** I PUT /api/tasks/{id}, **Then** I receive a 403 Forbidden response and the task remains unchanged
3. **Given** I am an authenticated user and want to mark a task complete, **When** I PATCH /api/tasks/{id}/complete, **Then** the task's completed status is toggled and returned with a 200 status code

---

### User Story 4 - Delete Tasks (Priority: P2)

As a registered user, I want to delete tasks that I no longer need so that I can keep my task list organized and clean.

**Why this priority**: Task deletion is important for maintaining an organized task list and completing the CRUD operations.

**Independent Test**: Can be fully tested by deleting a task and verifying it's removed from the database and only accessible to the owner.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user and own a specific task, **When** I DELETE /api/tasks/{id}, **Then** the task is removed from the database with a 204 status code
2. **Given** I am an authenticated user trying to delete a task that belongs to another user, **When** I DELETE /api/tasks/{id}, **Then** I receive a 403 Forbidden response and the task remains in the database

---

### User Story 5 - View Individual Task (Priority: P3)

As a registered user, I want to view the details of a specific task so that I can see all its information without seeing all my tasks.

**Why this priority**: Useful for viewing detailed information about a specific task, though less critical than bulk operations.

**Independent Test**: Can be fully tested by retrieving a single task and verifying it belongs to the authenticated user.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user and own a specific task, **When** I GET /api/tasks/{id}, **Then** the task details are returned with a 200 status code
2. **Given** I am an authenticated user trying to access a task that belongs to another user, **When** I GET /api/tasks/{id}, **Then** I receive a 403 Forbidden response
3. **Given** I am an authenticated user requesting a non-existent task, **When** I GET /api/tasks/{id}, **Then** I receive a 404 Not Found response

---

### Edge Cases

- What happens when a user tries to create a task without a title? The system should return a 400 Bad Request error with validation details.
- How does the system handle expired JWT tokens? The system should return a 401 Unauthorized response.
- What happens when a user tries to access a task that doesn't exist? The system should return a 404 Not Found response.
- How does the system handle concurrent requests from the same user? The system should handle them safely without data corruption.
- What happens when the database is temporarily unavailable? The system should return appropriate error responses and handle the failure gracefully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide RESTful API endpoints for task CRUD operations (GET /api/tasks, POST /api/tasks, GET /api/tasks/{id}, PUT /api/tasks/{id}, DELETE /api/tasks/{id}, PATCH /api/tasks/{id}/complete)
- **FR-002**: System MUST verify JWT tokens on every protected route using the shared BETTER_AUTH_SECRET and extract user_id from the token
- **FR-003**: System MUST enforce task ownership by filtering all queries by the authenticated user_id from JWT, preventing data leakage between users
- **FR-004**: System MUST use SQLModel ORM for all database operations with proper models and database connection via NEON_DB_URL environment variable
- **FR-005**: System MUST support query parameters for GET /api/tasks including status ("all"/"pending"/"completed") and sort ("created"/"title"/"due_date")
- **FR-006**: System MUST handle authentication errors by returning 401 Unauthorized for invalid/missing tokens
- **FR-007**: System MUST return 403 Forbidden for unauthorized task access attempts
- **FR-008**: System MUST return 404 Not Found for non-existent tasks
- **FR-009**: System MUST use Pydantic models for request/response validation on all endpoints
- **FR-010**: System MUST validate required fields (e.g., task title) and return appropriate error responses for validation failures
- **FR-011**: System MUST handle concurrent requests safely without data corruption
- **FR-012**: System MUST connect to Neon Serverless PostgreSQL database using the provided connection string format

### Key Entities

- **Task**: Represents a user's to-do item with properties like title, description, completion status, creation date, and user_id for ownership
- **User**: Represents a registered user in the system, identified by user_id that is extracted from JWT tokens, with tasks linked via foreign key relationship

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 RESTful endpoints are fully implemented and functional as specified in the requirements
- **SC-002**: JWT authentication middleware correctly verifies tokens on every protected route with 99.9% success rate for valid tokens
- **SC-003**: User data isolation is enforced with 100% accuracy - no user can access another user's tasks
- **SC-004**: System handles 1000 concurrent users without data leakage or authentication failures
- **SC-005**: API endpoints respond within 500ms for 95% of requests under normal load conditions
- **SC-006**: Query parameters for filtering and sorting work correctly as specified in the requirements
- **SC-007**: Error handling returns appropriate HTTP status codes (401, 403, 404) for different failure scenarios
- **SC-008**: System integrates seamlessly with the Next.js frontend via shared JWT secrets without requiring frontend modifications
- **SC-009**: Hackathon judges confirm the backend is secure, efficient, and fully compliant with the specification
- **SC-010**: All API endpoints properly validate input using Pydantic models and return meaningful error messages
