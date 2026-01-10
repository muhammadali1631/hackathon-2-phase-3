---
id: 003
title: backend-todo-api-tasks
stage: tasks
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: backend-todo-api
branch: 001-backend-todo-api
user: mac
command: /sp.tasks
labels: [tasks, backend, todo-api, fastapi, implementation]
links:
  spec: specs/001-backend-todo-api/spec.md
  plan: specs/001-backend-todo-api/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-backend-todo-api/tasks.md
tests:
  - specs/001-backend-todo-api/tasks.md
---

## Prompt

$ARGUMENTS

## Response snapshot

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

- [ ] T001 Create backend directory structure: `backend/main.py`, `backend/models.py`, `backend/db.py`, `backend/auth.py`, `backend/routes/tasks.py`
- [ ] T002 Create .env file with required environment variables: BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEON_DB_URL
- [ ] T003 Install required dependencies: fastapi, uvicorn, sqlmodel, python-dotenv, pyjwt
- [ ] T004 [P] Initialize basic FastAPI app in main.py with basic CORS configuration
- [ ] T005 Set up basic project configuration and ensure project runs with `uvicorn main:app --reload`

---

## Phase 2: Foundational (Blocking Prerequisites)

### Goal
Implement core infrastructure components that all user stories depend on: authentication middleware and database models.

### Independent Test
Verify that JWT authentication can extract user_id from a valid token and that the database models can be created and connected.

### Tasks

- [ ] T006 Implement database connection setup in db.py with Neon Serverless PostgreSQL using SQLModel
- [ ] T007 [P] Create Task model in models.py with all required fields (id, title, description, completed, user_id, created_at, updated_at)
- [ ] T008 [P] Create Pydantic request/response models for Task (TaskCreate, TaskUpdate, TaskResponse) in models.py
- [ ] T009 Implement JWT authentication middleware in auth.py to verify tokens and extract user_id
- [ ] T010 [P] Create database session dependency for FastAPI applications in db.py
- [ ] T011 Test database connection and verify that tables can be created with SQLModel.create_all
- [ ] T012 [P] Set up CORS middleware in main.py for frontend integration
- [ ] T013 [P] Create reusable get_current_user dependency in auth.py

---

## Phase 3: User Story 1 - Create Tasks (Priority: P1)

### Goal
Implement the ability for registered users to create new tasks in the system, storing them securely and making them available only to the owner.

### Independent Test
Can be fully tested by creating a task via the API and verifying it appears in the user's task list without affecting other users' data.

### Tasks

- [ ] T014 [US1] Implement POST /api/tasks endpoint in routes/tasks.py
- [ ] T015 [US1] Validate JWT token and extract user_id for task creation
- [ ] T016 [US1] Create TaskCreate Pydantic model with required title validation
- [ ] T017 [US1] Implement database logic to create task with authenticated user_id
- [ ] T018 [US1] Return created task with 201 status code
- [ ] T019 [US1] Implement validation to ensure title is provided (1-255 chars)
- [ ] T020 [US1] Handle 401 Unauthorized response for invalid/missing tokens
- [ ] T021 [US1] Add automatic setting of user_id from JWT, completed=false, timestamps
- [ ] T022 [US1] Test task creation with valid JWT token
- [ ] T023 [US1] Test 401 response for invalid/missing tokens

---

## Phase 4: User Story 2 - View Tasks (Priority: P1)

### Goal
Implement the ability for registered users to view their tasks, ensuring they only see tasks they created and not tasks from other users.

### Independent Test
Can be fully tested by creating tasks for multiple users and verifying each user only sees their own tasks.

### Tasks

- [ ] T024 [US2] Implement GET /api/tasks endpoint in routes/tasks.py
- [ ] T025 [US2] Validate JWT token and extract user_id for task retrieval
- [ ] T026 [US2] Implement database query to retrieve only tasks owned by authenticated user
- [ ] T027 [US2] Add support for status query parameter (all/pending/completed)
- [ ] T028 [US2] Add support for sort query parameter (created/title/due_date)
- [ ] T029 [US2] Return tasks list with 200 status code
- [ ] T030 [US2] Handle 401 Unauthorized response for invalid/missing tokens
- [ ] T031 [US2] Test task retrieval with valid JWT token
- [ ] T032 [US2] Test that users only see their own tasks (user isolation)
- [ ] T033 [US2] Test status filtering functionality
- [ ] T034 [US2] Test sort functionality

---

## Phase 5: User Story 3 - Update Tasks (Priority: P2)

### Goal
Implement the ability for registered users to update their existing tasks, ensuring only tasks they own can be modified.

### Independent Test
Can be fully tested by updating a task and verifying the changes are reflected while maintaining user isolation.

### Tasks

- [ ] T035 [US3] Implement PUT /api/tasks/{id} endpoint in routes/tasks.py
- [ ] T036 [US3] Implement PATCH /api/tasks/{id}/complete endpoint in routes/tasks.py
- [ ] T037 [US3] Validate JWT token and extract user_id for task update
- [ ] T038 [US3] Implement database logic to verify task ownership before update
- [ ] T039 [US3] Update task details (title, description) with proper validation
- [ ] T040 [US3] Toggle task completion status for PATCH endpoint
- [ ] T041 [US3] Update updated_at timestamp automatically
- [ ] T042 [US3] Return updated task with 200 status code
- [ ] T043 [US3] Handle 401 Unauthorized response for invalid/missing tokens
- [ ] T044 [US3] Handle 403 Forbidden response for unauthorized task access
- [ ] T045 [US3] Handle 404 Not Found response for non-existent tasks
- [ ] T046 [US3] Handle 422 Unprocessable Entity for invalid parameters
- [ ] T047 [US3] Test task update with valid ownership
- [ ] T048 [US3] Test 403 response for unauthorized task access
- [ ] T049 [US3] Test 404 response for non-existent tasks
- [ ] T050 [US3] Test completion toggle functionality

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P2)

### Goal
Implement the ability for registered users to delete tasks they own, ensuring proper authorization and data isolation.

### Independent Test
Can be fully tested by deleting a task and verifying it's removed from the database and only accessible to the owner.

### Tasks

- [ ] T051 [US4] Implement DELETE /api/tasks/{id} endpoint in routes/tasks.py
- [ ] T052 [US4] Validate JWT token and extract user_id for task deletion
- [ ] T053 [US4] Implement database logic to verify task ownership before deletion
- [ ] T054 [US4] Delete task from database
- [ ] T055 [US4] Return 204 No Content status code on successful deletion
- [ ] T056 [US4] Handle 401 Unauthorized response for invalid/missing tokens
- [ ] T057 [US4] Handle 403 Forbidden response for unauthorized task access
- [ ] T058 [US4] Handle 404 Not Found response for non-existent tasks
- [ ] T059 [US4] Test task deletion with valid ownership
- [ ] T060 [US4] Test 403 response for unauthorized task access
- [ ] T061 [US4] Test 404 response for non-existent tasks

---

## Phase 7: User Story 5 - View Individual Task (Priority: P3)

### Goal
Implement the ability for registered users to view the details of a specific task, ensuring they can only access tasks they own.

### Independent Test
Can be fully tested by retrieving a single task and verifying it belongs to the authenticated user.

### Tasks

- [ ] T062 [US5] Implement GET /api/tasks/{id} endpoint in routes/tasks.py
- [ ] T063 [US5] Validate JWT token and extract user_id for task retrieval
- [ ] T064 [US5] Implement database logic to verify task ownership before retrieval
- [ ] T065 [US5] Return single task details with 200 status code
- [ ] T066 [US5] Handle 401 Unauthorized response for invalid/missing tokens
- [ ] T067 [US5] Handle 403 Forbidden response for unauthorized task access
- [ ] T068 [US5] Handle 404 Not Found response for non-existent tasks
- [ ] T069 [US5] Test individual task retrieval with valid ownership
- [ ] T070 [US5] Test 403 response for unauthorized task access
- [ ] T071 [US5] Test 404 response for non-existent tasks

---

## Phase 8: Polish & Cross-Cutting Concerns

### Goal
Implement error handling, validation, and integration testing to ensure a robust and production-ready API.

### Independent Test
Verify that all endpoints properly handle edge cases, validation errors, and unauthorized access.

### Tasks

- [ ] T072 Implement comprehensive error handling with proper HTTPException usage
- [ ] T073 [P] Add input validation for all request models (title length, description length)
- [ ] T074 [P] Add proper logging for errors and important operations
- [ ] T075 [P] Add database connection pooling for Neon Serverless PostgreSQL
- [ ] T076 [P] Add proper timestamp handling with timezone awareness
- [ ] T077 [P] Add environment variable validation at startup
- [ ] T078 [P] Add request/response logging for debugging
- [ ] T079 [P] Add API documentation and Swagger UI configuration
- [ ] T080 Test all endpoints with expired JWT tokens (should return 401)
- [ ] T081 Test all endpoints with invalid task IDs (should return 404)
- [ ] T082 Test user isolation across all endpoints (403 for unauthorized access)
- [ ] T083 Test concurrent request handling for data consistency
- [ ] T084 [P] Add database indexes for user_id and completed fields as specified in requirements
- [ ] T085 Test integration with frontend API calls
- [ ] T086 Perform final verification that all 6 RESTful endpoints are fully implemented
- [ ] T087 [P] Test complete user flow: create → list → update → toggle → delete
- [ ] T088 [P] Verify JWT middleware correctly verifies tokens on every protected route
- [ ] T089 Verify user data isolation is enforced with 100% accuracy
- [ ] T090 Test that API endpoints respond within 500ms under normal load

## Outcome

- ✅ Impact: Generated comprehensive task list for backend API implementation with 90 specific tasks organized by user stories
- 🧪 Tests: Created test tasks for each user story and cross-cutting concerns
- 📁 Files: Created tasks.md with all implementation tasks organized by phase
- 🔁 Next prompts: Ready for implementation using /sp.implement
- 🧠 Reflection: Tasks are organized by user stories to enable independent implementation and testing

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All tasks follow the required format with checkboxes, IDs, and story labels
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation with Phase 1 tasks