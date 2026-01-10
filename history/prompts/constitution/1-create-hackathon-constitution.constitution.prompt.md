---
id: 1
title: Create Hackathon Constitution
stage: constitution
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: mac
command: /sp.constitution
labels: [constitution, setup, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```
/sp.constitution
Project: Hackathon Phase 2 – Todo Full-Stack Web Application (Next.js + FastAPI + Neon DB)
Core principles:

Fully spec-driven and agentic development
Zero manual coding allowed – all implementation must be generated via Claude Code using Spec-Kit references
Modular architecture through agents and skills
Complete user isolation and data ownership enforcement
Strict adherence to the provided technology stack and monorepo structure

Key standards:

All features must be implemented exactly as defined in /specs folder
Every API endpoint must require valid JWT token and filter data by authenticated user_id
Better Auth configured with JWT plugin and shared BETTER_AUTH_SECRET between frontend and backend
Database schema must match @specs/database/schema.md exactly (users table managed by Better Auth, tasks table with user_id foreign key)
All references in prompts must use @specs/path/to/file.md format
Code structure must follow guidelines in root CLAUDE.md, frontend/CLAUDE.md, and backend/CLAUDE.md
Responsive, clean UI using Tailwind CSS and Next.js App Router (server components by default)

Constraints:

Technology stack locked: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth (JWT), Tailwind CSS
Monorepo structure must exactly match the documented layout including .spec-kit/config.yaml
No external libraries beyond the specified stack
No direct database access from frontend – all operations via protected FastAPI endpoints
No session storage on backend – authentication must be stateless (JWT only)
All CRUD operations must enforce task ownership (user can only access their own tasks)

Success criteria:

Complete implementation of all 5 basic task CRUD operations + toggle completion as a multi-user web app
Successful user signup and login with Better Auth
JWT tokens issued on login and automatically attached to all API requests from frontend
FastAPI middleware correctly verifies JWT and extracts user_id on every protected route
All database queries filtered by authenticated user_id – zero data leakage between users
Responsive frontend with task list, create/edit forms, and authentication pages
Project runs locally with docker-compose up (or separately via npm run dev and uvicorn)
Entire implementation traceable to specs via Claude Code prompts using @specs references
Full agentic structure in place: Main Agent, Task Agent, Auth Agent, UI Agent with defined skills
All files and folders created exactly as per the monorepo specification structure

Final deliverables:

Fully structured monorepo with all specs, CLAUDE.md files, and .spec-kit config
Working full-stack application meeting all acceptance criteria
Clear history of spec-driven Claude Code prompts demonstrating zero manual coding
```

## Response snapshot

A comprehensive constitution has been created for the Hackathon Phase 2 Todo Full-Stack Web Application project. The constitution includes:

- Six core principles: Fully Spec-Driven Development, Zero Manual Coding, Modular Architecture, Complete User Isolation, Strict Technology Stack Adherence, and Stateless Authentication
- Security and Data Requirements section with Authentication/Authorization and Data Isolation requirements
- Development Workflow section with Implementation Process and Quality Standards
- Governance section with amendment procedures

The constitution is stored in `.specify/memory/constitution.md` and follows all the requirements specified in the user prompt.

## Outcome

- ✅ Impact: Project constitution created with all specified principles and requirements
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with comprehensive project constitution
- 🔁 Next prompts: Project can now proceed with spec creation and implementation following the constitution
- 🧠 Reflection: Constitution provides clear governance framework for the agentic development process

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin creating project specifications based on the constitution