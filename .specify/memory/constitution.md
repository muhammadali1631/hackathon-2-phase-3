<!--
SYNC IMPACT REPORT:
Version change: 1.0.0 → 2.0.0 (major update for AI chatbot integration)
Modified principles: I, II, III, V (updated to include AI/LLM aspects)
Added sections: VII. AI Agent Architecture, VIII. Cohere LLM Integration, IX. MCP Tools Standardization, X. Stateless Conversation Architecture
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/templates/commands/*.md: ⚠ pending
Follow-up TODOs: None
-->
# Hackathon Phase 3 – AI Todo Chatbot Integration Constitution

## Core Principles

### I. Full Agentic, Spec-Driven Development with Zero Manual Coding
All development must follow spec-driven methodology where every feature is defined in specifications before implementation. No manual coding allowed – all implementation must be generated via Claude Code using Spec-Kit references. Development follows the strict sequence: Spec → Plan → Tasks → Implementation. AI agents must be designed and implemented according to specifications with full traceability from requirements to code.

### II. Zero Manual Coding Mandate with AI Integration
No code may be written directly by humans. All implementation must be generated through Claude Code agents using /sp.implement and related skills. Every line of code must be traceable to a specification requirement through Claude Code prompts. AI chatbot functionality must be implemented following the same spec-driven principles with full automation.

### III. Modular Architecture Through Agents and Skills with AI Components
System architecture must be modular with dedicated agents for different concerns: Main Agent, Task Agent, Auth Agent, UI Agent, and AI Chatbot Agent. Each agent has defined skills and responsibilities with clear interfaces and contracts between them. MCP (Model Context Protocol) tools serve as standardized interfaces for agent-tool interaction.

### IV. Complete User Isolation and Data Ownership
Every user must have complete isolation of their data. All database queries must be filtered by authenticated user_id. Users can only access, modify, or delete their own tasks. No cross-user data access is permitted under any circumstances. AI chatbot operations must enforce the same strict user isolation principles.

### V. Strict Technology Stack Adherence with AI Extensions
Implementation must use exactly the specified technology stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth (JWT), Tailwind CSS, plus Cohere API for AI functionality. No external libraries beyond the specified stack and Cohere SDK are permitted.

### VI. Stateless Authentication with JWT
Authentication must be completely stateless using JWT tokens only. No session storage on backend. Better Auth configured with JWT plugin. JWT tokens issued on login and automatically attached to all API requests from frontend. AI chat endpoints must verify JWT and enforce user_id ownership for all operations.

## AI-Specific Requirements

### VII. AI Agent Architecture
- AI chatbot must fully control task management operations (add, list, complete, delete, update) through natural language processing
- Natural language understanding must interpret intents like "Add task buy milk", "Show pending tasks", "Mark task 4 complete", "Delete the old one"
- AI responses must be contextual, multilingual (English + Urdu support), and provide action confirmations
- Agent behavior must be stateful through database persistence while maintaining stateless server architecture

### VIII. Cohere LLM Integration
- Use Cohere API as the primary LLM backend for agent reasoning, tool calling, and response generation
- Adapt OpenAI Agents SDK patterns to work with Cohere API using Cohere's tool-calling capabilities
- Use Cohere models (command-r-plus or command-r) with tool calling enabled
- Implement proper API key management via COHERE_API_KEY environment variable
- Cohere integration must be secured and properly validated with error handling

### IX. MCP Tools Standardization
- MCP (Model Context Protocol) tools remain the standardized interface for agent-tool interaction
- Expose all task and user operations as MCP-compatible tools: add_task, list_tasks, complete_task, delete_task, update_task, get_user_profile
- All tools must require user_id (from JWT) and enforce ownership
- Tool calls must be logged and tracked for audit and debugging purposes
- Tools must follow consistent interface patterns with proper error handling

### X. Stateless Conversation Architecture
- Implement stateless architecture for scalability with conversation state persisted only in database
- Maintain conversations and messages tables for preserving chat history across requests
- Conversation context must be fetched from DB on every request and user/assistant messages stored after processing
- Support optional conversation_id parameter for continuing existing conversations
- System must resume conversation state after server restart

## Security and Data Requirements

### Authentication and Authorization
- Every API endpoint must require valid JWT token for access
- FastAPI middleware must verify JWT and extract user_id on every protected route
- All CRUD operations must enforce task ownership (user can only access their own tasks)
- Database schema must match specifications exactly with user_id foreign keys
- AI chat endpoints must enforce identical security requirements as traditional API endpoints

### Data Isolation
- All database queries must be filtered by authenticated user_id
- Zero data leakage between users is permitted
- Users table managed by Better Auth, tasks table with user_id foreign key relationship
- No direct database access from frontend – all operations via protected FastAPI endpoints
- AI operations must enforce the same data isolation principles as traditional operations

## Development Workflow

### Implementation Process
- All features must be implemented exactly as defined in /specs folder
- Every reference in prompts must use @specs/path/to/file.md format
- Code structure must follow guidelines in root CLAUDE.md, frontend/CLAUDE.md, and backend/CLAUDE.md
- Frontend uses server components by default with responsive UI using Tailwind CSS
- AI chatbot implementation must follow same rigorous specification and testing standards

### Quality Standards
- All CRUD operations must be fully implemented with proper error handling
- Responsive frontend with task list, create/edit forms, authentication pages, and AI chat interface
- AI chatbot must handle natural language intents correctly with appropriate tool calls
- All code must pass validation and testing requirements
- Project must run locally with specified commands (docker-compose up or separate npm/uvicorn)

## Governance

This constitution supersedes all other development practices and standards for this project. All development activities must comply with these principles. Amendments to this constitution require explicit documentation, approval from project stakeholders, and a migration plan for existing codebase. All pull requests and code reviews must verify compliance with these principles. Use CLAUDE.md files for runtime development guidance and best practices.

**Version**: 2.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-02-04