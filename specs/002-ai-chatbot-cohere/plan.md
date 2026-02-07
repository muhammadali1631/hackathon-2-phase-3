# Implementation Plan: AI Todo Chatbot Integration (Cohere-Powered)

**Branch**: `002-ai-chatbot-cohere` | **Date**: 2026-02-04 | **Spec**: specs/002-ai-chatbot-cohere/spec.md
**Input**: Feature specification from `/specs/002-ai-chatbot-cohere/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a Cohere-powered AI chatbot that enables natural language task management for the existing Todo application. The system will provide a chat interface that processes natural language commands to perform CRUD operations on tasks and retrieve user profile information. The backend includes a custom Cohere runner that handles conversation history, tool calling, and message persistence, while the frontend features a floating chatbot icon and modal interface.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Python 3.11, TypeScript/JavaScript (Next.js 16+)
**Primary Dependencies**: FastAPI, Cohere Python SDK, SQLModel, Better Auth, Next.js, React, Tailwind CSS
**Storage**: Neon PostgreSQL database with SQLModel ORM
**Testing**: pytest for backend, Jest/Vitest for frontend
**Target Platform**: Web application (Linux/Mac/Windows server for backend, cross-platform browser for frontend)
**Project Type**: Web application (full-stack with separate frontend and backend)
**Performance Goals**: <3 second average response time for chat queries including AI processing
**Constraints**: <20 message history limit per conversation to prevent token blowup, strict user data isolation
**Scale/Scope**: Individual user conversations, single-tenant per user model

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Zero Manual Coding Mandate**: All implementation will be generated via Claude Code using /sp.implement and related skills
- ✅ **Modular Architecture**: Implemented dedicated components for chatbot functionality while integrating with existing task/auth modules
- ✅ **Complete User Isolation**: All database queries will be filtered by authenticated user_id, enforcing strict data separation
- ✅ **Technology Stack Adherence**: Using specified stack (Next.js, FastAPI, SQLModel, Neon PostgreSQL, Better Auth, Cohere API)
- ✅ **Stateless Authentication**: Leveraging existing JWT-based authentication system for chat endpoints
- ✅ **MCP Tools Standardization**: Implementing tools in Cohere-compatible format that follow MCP interface patterns
- ✅ **Stateless Conversation Architecture**: Persisting conversation state only in database (Conversation + Message tables)
- ✅ **Security Requirements**: All chat operations protected by JWT, enforcing user_id ownership

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-chatbot-cohere/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── conversation.py          # New: Conversation model
│   │   └── message.py               # New: Message model
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   ├── chat_service.py          # New: Cohere integration and chat logic
│   │   └── tools_service.py         # New: MCP-compatible tools implementation
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   └── chat.py                  # New: Chat endpoint
│   └── main.py
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── ChatbotIcon.tsx          # New: Floating chatbot icon
│   │   ├── ChatWindow.tsx           # New: Chat interface modal
│   │   ├── TaskList.tsx
│   │   └── Layout.tsx
│   ├── pages/
│   │   ├── dashboard.tsx
│   │   └── api/
│   │       └── [user_id]/
│   │           └── chat.ts          # New: API route for chat
│   ├── services/
│   │   ├── api.ts
│   │   └── chatApi.ts               # New: Chat API service
│   └── styles/
└── public/
```

**Structure Decision**: Selected Option 2: Web application structure to accommodate the existing frontend/backend separation. New models (conversation, message), services (chat_service, tools_service), API endpoints (chat.py), and frontend components (ChatbotIcon, ChatWindow) will be added to extend the existing architecture while maintaining modularity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [None] | [No violations identified] | [All constitution requirements met] |
