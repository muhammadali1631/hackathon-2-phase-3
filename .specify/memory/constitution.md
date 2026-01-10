<!--
SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.0.0 (initial creation)
Modified principles: None (new constitution)
Added sections: All sections added
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ updated
- .specify/templates/spec-template.md: ✅ updated
- .specify/templates/tasks-template.md: ✅ updated
- .specify/templates/commands/*.md: ✅ updated
Follow-up TODOs: None
-->
# Hackathon Phase 2 – Todo Full-Stack Web Application Constitution

## Core Principles

### I. Fully Spec-Driven and Agentic Development
All development must follow spec-driven methodology where every feature is defined in specifications before implementation. No manual coding allowed – all implementation must be generated via Claude Code using Spec-Kit references. Development follows the strict sequence: Spec → Plan → Tasks → Implementation.

### II. Zero Manual Coding Mandate
No code may be written directly by humans. All implementation must be generated through Claude Code agents using /sp.implement and related skills. Every line of code must be traceable to a specification requirement through Claude Code prompts.

### III. Modular Architecture Through Agents and Skills
System architecture must be modular with dedicated agents for different concerns: Main Agent, Task Agent, Auth Agent, UI Agent. Each agent has defined skills and responsibilities with clear interfaces and contracts between them.

### IV. Complete User Isolation and Data Ownership
Every user must have complete isolation of their data. All database queries must be filtered by authenticated user_id. Users can only access, modify, or delete their own tasks. No cross-user data access is permitted under any circumstances.

### V. Strict Technology Stack Adherence
Implementation must use exactly the specified technology stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth (JWT), Tailwind CSS. No external libraries beyond the specified stack are permitted.

### VI. Stateless Authentication with JWT
Authentication must be completely stateless using JWT tokens only. No session storage on backend. Better Auth configured with JWT plugin. JWT tokens issued on login and automatically attached to all API requests from frontend.

## Security and Data Requirements

### Authentication and Authorization
- Every API endpoint must require valid JWT token for access
- FastAPI middleware must verify JWT and extract user_id on every protected route
- All CRUD operations must enforce task ownership (user can only access their own tasks)
- Database schema must match specifications exactly with user_id foreign keys

### Data Isolation
- All database queries must be filtered by authenticated user_id
- Zero data leakage between users is permitted
- Users table managed by Better Auth, tasks table with user_id foreign key relationship
- No direct database access from frontend – all operations via protected FastAPI endpoints

## Development Workflow

### Implementation Process
- All features must be implemented exactly as defined in /specs folder
- Every reference in prompts must use @specs/path/to/file.md format
- Code structure must follow guidelines in root CLAUDE.md, frontend/CLAUDE.md, and backend/CLAUDE.md
- Frontend uses server components by default with responsive UI using Tailwind CSS

### Quality Standards
- All CRUD operations must be fully implemented with proper error handling
- Responsive frontend with task list, create/edit forms, and authentication pages
- All code must pass validation and testing requirements
- Project must run locally with specified commands (docker-compose up or separate npm/uvicorn)

## Governance

This constitution supersedes all other development practices and standards for this project. All development activities must comply with these principles. Amendments to this constitution require explicit documentation, approval from project stakeholders, and a migration plan for existing codebase. All pull requests and code reviews must verify compliance with these principles. Use CLAUDE.md files for runtime development guidance and best practices.

**Version**: 1.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05
