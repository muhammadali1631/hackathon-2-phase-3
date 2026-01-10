# Implementation Tasks: Backend Todo API

**Feature**: 001-backend-todo-api
**Generated**: 2026-01-06
**Spec**: specs/001-backend-todo-api/spec.md

## Implementation Strategy

**MVP First**: Implement User Story 1 (Create Tasks) with minimal authentication and database setup to create a working foundation, then incrementally add features.

**Delivery Approach**: Phase 1-2 establish foundational infrastructure, then Phase 3+ implement user stories in priority order (P1, P2, P3), with Phase 7 for polish and integration.

## Dependencies

User Story 1 (Create Tasks) → User Story 2 (View Tasks) → User Story 3 (Update Tasks) → User Story 4 (Delete Tasks) → User Story 5 (View Individual Task)

## Parallel Execution Examples

- Phase 1: Setup can run in parallel (creating project structure, installing dependencies, setting up environment)
- Phase 2: Authentication and database setup can be developed separately but integrated together
- Phase 6: Error handling can be applied across all endpoints in parallel

---

## Phase 1: Setup (Project Initialization)

### Goal
Establish project structure and basic configuration for the FastAPI backend application.

### Independent Test
Verify that the project structure exists and dependencies can be installed successfully.

### Tasks

- [X] T001 Create backend directory structure: `backend/main.py`, `backend/models.py`, `backend/db.py`, `backend/auth.py`, `backend/routes/tasks.py`
- [X] T002 Create .env file with required environment variables: BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEON_DB_URL
- [X] T003 Install required dependencies: fastapi, uvicorn, sqlmodel, python-dotenv, pyjwt
- [X] T004 [P] Initialize basic FastAPI app in main.py with basic CORS configuration
- [X] T005 Set up basic project system and ensure project runs with `uvicorn main:app --reload`

---

## Phase 2: Foundational (Blocking Prerequisites)

### Goal
Implement core infrastructure components that all user stories depend on: authentication middleware and database models.

### Independent Test
Verify that JWT authentication can extract user_id from a valid token and that the database models can be created and connected.

### Tasks

- [X] T006 Implement database connection setup in db.py with Neon Serverless PostgreSQL using SQLModel
- [X] T007 [P] Create Task model in models.py with all required fields (id, title, description, completed, user_id, created_at, updated_at)
- [X] T008 [P] Create Pydantic request/response models for Task (TaskCreate, TaskUpdate, TaskResponse) in models.py
- [X] T009 Implement JWT authentication middleware in auth.py to verify tokens and extract user_id
- [X] T010 [P] Create database session dependency for FastAPI applications in db.py
- [X] T011 Test database connection and verify that tables can be created with SQLModel.create_all
- [X] T012 [P] Set up CORS middleware in main.py for frontend integration
- [X] T013 [P] Create reusable get_current_user dependency in auth.py

---

## Phase 3: User Story 1 - Create Tasks (Priority: P1)

### Goal
Implement the ability for registered users to create new tasks in the system, storing them securely and making them available only to the owner.

### Independent Test
Can be fully tested by creating a task via the API and verifying it appears in the user's task list without affecting other users' data.

### Tasks

- [X] T014 [US1] Implement POST /api/tasks endpoint in routes/tasks.py
- [X] T015 [US1] Validate JWT token and extract user_id for task creation
- [X] T016 [US1] Create TaskCreate Pydantic model with required title validation
- [X] T017 [US1] Implement database logic to create task with authenticated user_id
- [X] T018 [US1] Return created task with 201 status code
- [X] T019 [US1] Implement validation to ensure title is provided (1-255 chars)
- [X] T020 [US1] Handle 401 Unauthorized response for invalid/missing tokens
- [X] T021 [US1] Add automatic setting of user_id from JWT, completed=false, timestamps
- [X] T022 [US1] Test task creation with valid JWT token
- [X] T023 [US1] Test 401 response for invalid/missing tokens

---

## Phase 4: User Story 2 - View Tasks (Priority: P1)

### Goal
Implement the ability for registered users to view their tasks, ensuring they only see tasks they created and not tasks from other users.

### Independent Test
Can be fully tested by creating tasks for multiple users and verifying each user only sees their own tasks.

### Tasks

- [X] T024 [US2] Implement GET /api/tasks endpoint in routes/tasks.py
- [X] T025 [US2] Validate JWT token and extract user_id for task retrieval
- [X] T026 [US2] Implement database query to retrieve only tasks owned by authenticated user
- [X] T027 [US2] Add support for status query parameter (all/pending/completed)
- [X] T028 [US2] Add support for sort query parameter (created/title/due_date)
- [X] T029 [US2] Return tasks list with 200 status code
- [X] T030 [US2] Handle 401 Unauthorized response for invalid/missing tokens
- [X] T031 [US2] Test task retrieval with valid JWT token
- [X] T032 [US2] Test that users only see their own tasks (user isolation)
- [X] T033 [US2] Test status filtering functionality
- [X] T034 [US2] Test sort functionality

---

## Phase 5: User Story 3 - Update Tasks (Priority: P2)

### Goal
Implement the ability for registered users to update their existing tasks, ensuring only tasks they own can be modified.

### Independent Test
Can be fully tested by updating a task and verifying the changes are reflected while maintaining user isolation.

### Tasks

- [X] T035 [US3] Implement PUT /api/tasks/{id} endpoint in routes/tasks.py
- [X] T036 [US3] Implement PATCH /api/tasks/{id}/complete endpoint in routes/tasks.py
- [X] T037 [US3] Validate JWT token and extract user_id for task update
- [X] T038 [US3] Implement database logic to verify task ownership before update
- [X] T039 [US3] Update task details (title, description) with proper validation
- [X] T040 [US3] Toggle task completion status for PATCH endpoint
- [X] T041 [US3] Update updated_at timestamp automatically
- [X] T042 [US3] Return updated task with 200 status code
- [X] T043 [US3] Handle 401 Unauthorized response for invalid/missing tokens
- [X] T044 [US3] Handle 403 Forbidden response for unauthorized task access
- [X] T045 [US3] Handle 404 Not Found response for non-existent tasks
- [X] T046 [US3] Handle 422 Unprocessable Entity for invalid parameters
- [X] T047 [US3] Test task update with valid ownership
- [X] T048 [US3] Test 403 response for unauthorized task access
- [X] T049 [US3] Test 404 response for non-existent tasks
- [X] T050 [US3] Test completion toggle functionality

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P2)

### Goal
Implement the ability for registered users to delete tasks they own, ensuring proper authorization and data isolation.

### Independent Test
Can be fully tested by deleting a task and verifying it's removed from the database and only accessible to the owner.

### Tasks

- [X] T051 [US4] Implement DELETE /api/tasks/{id} endpoint in routes/tasks.py
- [X] T052 [US4] Validate JWT token and extract user_id for task deletion
- [X] T053 [US4] Implement database logic to verify task ownership before deletion
- [X] T054 [US4] Delete task from database
- [X] T055 [US4] Return 204 No Content status code on successful deletion
- [X] T056 [US4] Handle 401 Unauthorized response for invalid/missing tokens
- [X] T057 [US4] Handle 403 Forbidden response for unauthorized task access
- [X] T058 [US4] Handle 404 Not Found response for non-existent tasks
- [X] T059 [US4] Test task deletion with valid ownership
- [X] T060 [US4] Test 403 response for unauthorized task access
- [X] T061 [US4] Test 404 response for non-existent tasks

---

## Phase 7: User Story 5 - View Individual Task (Priority: P3)

### Goal
Implement the ability for registered users to view the details of a specific task, ensuring they can only access tasks they own.

### Independent Test
Can be fully tested by retrieving a single task and verifying it belongs to the authenticated user.

### Tasks

- [X] T062 [US5] Implement GET /api/tasks/{id} endpoint in routes/tasks.py
- [X] T063 [US5] Validate JWT token and extract user_id for task retrieval
- [X] T064 [US5] Implement database logic to verify task ownership before retrieval
- [X] T065 [US5] Return single task details with 200 status code
- [X] T066 [US5] Handle 401 Unauthorized response for invalid/missing tokens
- [X] T067 [US5] Handle 403 Forbidden response for unauthorized task access
- [X] T068 [US5] Handle 404 Not Found response for non-existent tasks
- [X] T069 [US5] Test individual task retrieval with valid ownership
- [X] T070 [US5] Test 403 response for unauthorized task access
- [X] T071 [US5] Test 404 response for non-existent tasks

---

## Phase 8: Polish & Cross-Cutting Concerns

### Goal
Implement error handling, validation, and integration testing to ensure a robust and production-ready API.

### Independent Test
Verify that all endpoints properly handle edge cases, validation errors, and unauthorized access.

### Tasks

- [X] T072 Implement comprehensive error handling with proper HTTPException usage
- [X] T073 [P] Add input validation for all request models (title length, description length)
- [X] T074 [P] Add proper logging for errors and important operations
- [X] T075 [P] Add database connection pooling for Neon Serverless PostgreSQL
- [X] T076 [P] Add proper timestamp handling with timezone awareness
- [X] T077 [P] Add environment variable validation at startup
- [X] T078 [P] Add request/response logging for debugging
- [X] T079 [P] Add API documentation and Swagger UI configuration
- [X] T080 Test all endpoints with expired JWT tokens (should return 401)
- [X] T081 Test all endpoints with invalid task IDs (should return 404)
- [X] T082 Test user isolation across all endpoints (403 for unauthorized access)
- [X] T083 Test concurrent request handling for data consistency
- [X] T084 [P] Add database indexes for user_id and completed fields as specified in requirements
- [X] T085 Test integration with frontend API calls
- [X] T086 Perform final verification that all 6 RESTful endpoints are fully implemented
- [X] T087 [P] Test complete user flow: create → list → update → toggle → delete
- [X] T088 [P] Verify JWT middleware correctly verifies tokens on every protected route
- [X] T089 Verify user data isolation is enforced with 100% accuracy
- [X] T090 Test that API endpoints respond within 500ms under normal load