---
id: 002
title: backend-todo-api-plan
stage: plan
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: backend-todo-api
branch: 001-backend-todo-api
user: mac
command: /sp.plan
labels: [plan, backend, todo-api, fastapi, architecture]
links:
  spec: specs/001-backend-todo-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-backend-todo-api/plan.md
  - specs/001-backend-todo-api/research.md
  - specs/001-backend-todo-api/data-model.md
  - specs/001-backend-todo-api/quickstart.md
  - specs/001-backend-todo-api/contracts/api-contract.md
tests:
  - specs/001-backend-todo-api/research.md
  - specs/001-backend-todo-api/data-model.md
---

## Prompt

Implementation Plan for Backend – Hackathon Phase 2 Todo Full-Stack Web Application
Create:

Detailed backend architecture sketch (folder structure, dependency flow, middleware pipeline)
JWT authentication middleware design with user extraction and dependency injection
SQLModel models and database connection strategy for Neon Serverless PostgreSQL
Route handlers breakdown with request/response models
Error handling and validation strategy
CORS and environment variable loading configuration
Integration points documentation with frontend (API base URL, JWT flow, error codes)

Decisions needing documentation:

Dependency injection for current_user: FastAPI Depends vs manual extraction → Use Depends with reusable get_current_user dependency (cleaner, reusable across routes)
Database session management: Session per request vs global → Per-request Session via dependency (best practice for FastAPI + SQLModel)
Environment loading: python-dotenv vs pydantic-settings → python-dotenv (simple, matches provided .env example)
CORS configuration: Allow specific origin vs wildcard → Specific origin with credentials support (secure + works with Better Auth cookies if any)
JWT library: pyjwt vs authlib → pyjwt (lightweight, widely used, sufficient for verification)
Table creation: SQLModel create_all on startup vs manual migrations → create_all on startup (acceptable for hackathon, Neon handles schema)
API prefix: /api vs root → /api (clean separation, matches spec)
Response models: Separate Pydantic models for TaskCreate, TaskUpdate, TaskResponse → Yes (better validation and documentation)

Testing strategy (validation against success criteria):

Manual API testing: Use Postman/Thunder Client or curl to test all endpoints with valid/invalid JWTs
User isolation: Create two users via frontend, confirm each can only access own tasks (403 on foreign task ID)
Token verification: Requests without token → 401; expired/invalid signature → 401
Database persistence: Tasks created via POST visible in subsequent GET; updates/deletes work correctly
Filtering: GET /api/tasks?status=completed returns only completed tasks for user
Integration test: Run frontend + backend together (docker-compose or separate terminals), perform full flow (signup → login → create task → list → toggle → delete)
Error cases: Missing title → 422; non-existent task → 404; wrong user task → 403
Neon connection: Confirm connection succeeds with provided NEON_DB_URL (SSL + channel_binding)

Technical details:

Use spec-concurrent approach: Implement and refine backend components iteratively while referencing @specs/api/rest-endpoints.md, @specs/database/schema.md, @specs/agents/task-agent.md, @specs/agents/auth-agent.md
JWT verification: Decode with BETTER_AUTH_SECRET, extract sub (user_id), validate exp/iat
All routes use current_user dependency to inject authenticated user
SQLModel models: Task with user_id relationship, User model minimal (since Better Auth manages users)
FastAPI docs: Automatically generated Swagger UI at /docs shows all endpoints with auth
Logging: Basic print/logging for startup and errors (optional but helpful)

Organize by phases:

Foundation → Set up FastAPI project structure, install dependencies (fastapi, uvicorn, sqlmodel, python-dotenv, pyjwt), load .env (BETTER_AUTH_SECRET, NEON_DB_URL), basic main.py with app and CORS
Database Layer → Create models.py (Task and minimal User), db.py with engine/session dependency, create tables on startup
Authentication Middleware → Implement JWT verification dependency (get_current_user), handle token errors gracefully
Task Models & Routes → Define Pydantic schemas, implement CRUD route handlers in routes/tasks.py with user filtering
Toggle Completion Route → Separate PATCH endpoint with optimistic toggle logic
Error Handling & Validation → Centralize HTTPException usage, proper status codes
Integration & Polish → Enable Swagger docs, test full flow with frontend, add any missing query params (status/sort)
Final Review → Verify zero data leakage, perfect JWT integration, all specs covered, runs smoothly with frontend

This plan guarantees a secure, robust, and perfectly integrated backend that meets every requirement in the original hackathon document. When executed phase-by-phase with Claude Code referencing the specs, the result will be production-grade, fully compliant, and seamlessly connected to your modern frontend.

## Response snapshot

# Implementation Plan: Backend Todo API

**Branch**: `001-backend-todo-api` | **Date**: 2026-01-06 | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a secure, robust FastAPI backend for the Todo Full-Stack Web Application with SQLModel ORM for Neon Serverless PostgreSQL. The backend provides all 6 RESTful API endpoints for task CRUD operations with JWT-based authentication verification integrated with Better Auth from the frontend. User data isolation is enforced through filtering all queries by authenticated user_id extracted from JWT tokens, ensuring no data leakage between users. The implementation follows spec-driven methodology with agentic development using Claude Code, adhering to the technology stack of FastAPI, SQLModel, Neon PostgreSQL, and PyJWT as specified in the feature requirements.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, PyJWT, python-dotenv, uvicorn
**Storage**: Neon Serverless PostgreSQL database with SQLModel ORM
**Testing**: Manual API testing with Postman/Thunder Client, integration testing with frontend
**Target Platform**: Linux/Unix server environment (local development and deployment)
**Project Type**: Web backend API service
**Performance Goals**: API endpoints respond within 500ms for 95% of requests under normal load conditions, handle 1000 concurrent users
**Constraints**: Technology locked (FastAPI, SQLModel, Neon PostgreSQL, PyJWT), JWT authentication with Better Auth integration, user data isolation enforcement, all routes under /api/ prefix
**Scale/Scope**: Multi-user Todo application supporting secure task management with proper user isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Fully Spec-Driven and Agentic Development**: ✅ PASS - All development will follow spec-driven methodology with implementation generated via Claude Code agents using references to @specs/api/rest-endpoints.md, @specs/database/schema.md, @specs/agents/task-agent.md, @specs/agents/auth-agent.md

2. **Zero Manual Coding Mandate**: ✅ PASS - Implementation will be generated exclusively through Claude Code agents using /sp.implement and related skills, with all code traceable to specification requirements

3. **Modular Architecture Through Agents and Skills**: ✅ PASS - Using dedicated agents: Task Agent for CRUD operations, Auth Agent for JWT authentication, with clear interfaces between components

4. **Complete User Isolation and Data Ownership**: ✅ PASS - All database queries will be filtered by authenticated user_id, enforcing task ownership with no cross-user data access permitted

5. **Strict Technology Stack Adherence**: ✅ PASS - Implementation will use exactly the specified stack: FastAPI, SQLModel, Neon Serverless PostgreSQL, PyJWT for authentication

6. **Stateless Authentication with JWT**: ✅ PASS - Authentication will be completely stateless using JWT tokens only, verifying tokens with BETTER_AUTH_SECRET, with no session storage on backend

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-todo-api/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-contract.md
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (backend structure)

```text
backend/
├── main.py                 # FastAPI application entry point
├── .env                    # Environment variables
├── models.py               # SQLModel database models
├── db.py                   # Database connection and session
├── auth.py                 # JWT authentication middleware
└── routes/
    └── tasks.py            # Task CRUD endpoints
```

**Structure Decision**: Selected web application backend structure with dedicated backend/ directory for FastAPI application. This structure separates the backend API from the frontend (which is in the main project root) and follows the requirements for a FastAPI + SQLModel + Neon PostgreSQL backend service.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

## Outcome

- ✅ Impact: Created comprehensive implementation plan for backend API with all required sections, research, data models, and contracts
- 🧪 Tests: Generated research, data models, quickstart guide, and API contracts to support development
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and contracts/api-contract.md
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: The plan thoroughly addresses all architectural decisions and implementation requirements while maintaining compliance with project constitution

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All constitution checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks from the plan with /sp.tasks