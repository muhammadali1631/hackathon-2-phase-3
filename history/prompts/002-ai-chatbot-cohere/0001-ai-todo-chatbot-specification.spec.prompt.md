---
id: 0001
title: AI Todo Chatbot Specification
stage: spec
date: 2026-02-04
surface: agent
model: Claude Sonnet 4.5
feature: 002-ai-chatbot-cohere
branch: 002-ai-chatbot-cohere
user: mac
command: /sp.specify
labels: [ai, chatbot, todo, cohere, specification]
links:
  spec: specs/002-ai-chatbot-cohere/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-ai-chatbot-cohere/spec.md
  - specs/002-ai-chatbot-cohere/checklists/requirements.md
tests:
  - none
---

## Prompt

Phase III – AI Todo Chatbot Specification (Cohere-Powered, Integrated into Existing Full-Stack Todo App)
Target audience: Hackathon judges evaluating advanced agentic AI integration, seamless upgrade from Phase II, modern UX with chatbot presence, and correct use of Cohere API instead of OpenAI
End-users: People who want to manage their todos conversationally in natural language (English + Urdu support) while keeping the beautiful Phase II UI intact
Focus:
Build and integrate a powerful, natural-language Todo AI Chatbot into the existing Next.js + FastAPI full-stack application using Cohere as the LLM backend (instead of OpenAI). Adapt OpenAI Agents SDK patterns to work with Cohere's tool-calling and chat completions API. Add a floating chatbot icon in the UI that opens a modern chat interface (using OpenAI ChatKit or custom lightweight chat component). The chatbot must fully control task CRUD operations + provide user profile information via natural language.
Success criteria:

Chatbot understands and executes natural language commands for all task operations: add, list (with filters), complete, delete, update
Responds to user profile queries: "Mera email kya hai?", "Who am I?", "Mera naam batao", etc. → returns id, email, name, createdAt
Friendly, contextual, multilingual responses with action confirmations (e.g., "Task 'Buy groceries' add kar diya gaya!", "Aap ka email hai muhammad@example.com")
Floating chatbot icon appears in bottom-right corner of the app (only when logged in)
Clicking icon opens a clean, modern chat window (ChatKit or custom) with message history, typing indicator, smooth scroll
Chat persists across sessions via database (Conversation + Message tables)
Stateless backend: POST /api/{user_id}/chat endpoint handles every request independently
Uses Cohere API (command-r or command-r-plus model) with tool calling enabled
Adapts OpenAI Agents SDK structure to Cohere (custom runner using cohere.Client, tool definitions, message history)
All MCP tools implemented and called correctly: add_task, list_tasks, complete_task, delete_task, update_task, get_user_profile
Every tool call requires authenticated user_id (from JWT) → strict ownership enforcement
Chat history loaded from DB on each request → context preserved even after server restart
UI integration: Chat icon + window added to existing Phase II dashboard without breaking task list/form
Judges say: "Impressive Cohere-powered agentic chatbot – seamless, secure, delightful UX upgrade"

Constraints:

Must integrate into existing Phase II monorepo (frontend/Next.js + backend/FastAPI) – no new repo
LLM: Cohere only – use COHERE_API_KEY environment variable
No OpenAI calls – adapt the provided OpenAI Agents SDK example to use Cohere SDK (cohere-python)
Model: command-r-plus or command-r (tool-calling supported)
Authentication: Reuse existing Better Auth + JWT middleware (get_current_user)
Chat endpoint: POST /api/{user_id}/chat protected by JWT
Frontend chat UI: Prefer OpenAI ChatKit (hosted) if possible → configure domain allowlist + NEXT_PUBLIC_OPENAI_DOMAIN_KEY
Fallback: Lightweight custom chat component (React + Tailwind) if ChatKit setup issues
No new UI libraries beyond Tailwind + existing stack
Environment: Add COHERE_API_KEY to .env
Stateless server: No in-memory state – everything in Neon DB
Keep Phase II task CRUD UI/API 100% functional
No voice, images, file upload in chat (text-only for Phase III)

Not building:

Multi-agent swarms or complex delegation (single main agent + tools)
Real-time streaming (single response per request)
Advanced memory beyond DB-persisted messages
Custom LLM fine-tuning or prompt engineering playground
Mobile-specific chat optimizations beyond responsive design
New authentication flows (reuse Phase II login)

Technical integration points:

Backend: Add cohere.Client, define tools in Cohere-compatible format, build custom Runner similar to provided example
Adapt this pattern:

Pythonfrom cohere import Client as CohereClient
cohere_client = CohereClient(api_key=COHERE_API_KEY)

# Define tools (JSON schema format Cohere understands)
tools = [add_task_tool_schema, list_tasks_tool_schema, ...]

# Custom runner that handles chat + tool calls
response = cohere_client.chat(
    message=user_message,
    model="command-r-plus",
    tools=tools,
    tool_results=previous_tool_results if any,
    chat_history=history_from_db
)

Frontend: Add floating action button (FAB) → open modal/chat window → send messages to /api/{user_id}/chat with JWT
DB: Extend with Conversation & Message models as per Phase III spec

Design goals for chatbot UI:

Floating circular icon (chat bubble) bottom-right, appears only when logged in
Modern chat window: dark/light mode support, message bubbles (user right, assistant left), typing indicator
Auto-scroll to bottom, preserved scroll position on reopen
Minimalist Tailwind styling matching Phase II premium aesthetic

This specification ensures a best-in-class, Cohere-powered AI chatbot that feels like a natural extension of your beautiful Phase II Todo app – secure, agentic, delightful, and perfectly integrated.

## Response snapshot

Created comprehensive specification for the AI Todo Chatbot Integration feature. The specification includes:
- Four prioritized user stories covering core functionality (natural language task management, profile access, persistent chat experience, and UI integration)
- Comprehensive functional requirements (FR-001 through FR-015) focusing on business capabilities rather than technical implementation
- Key entities definition for data modeling
- Ten measurable success criteria (SC-001 through SC-010) with specific metrics
- Identified edge cases for robustness
- A quality checklist confirming the specification meets all requirements

The specification follows the template structure and maintains a business-focused approach without leaking implementation details, while clearly defining the scope and requirements for the AI chatbot feature.

## Outcome

- ✅ Impact: Created complete specification for AI chatbot integration feature
- 🧪 Tests: No tests needed for specification creation
- 📁 Files: Created spec.md and requirements checklist in specs/002-ai-chatbot-cohere/
- 🔁 Next prompts: Ready for clarification or planning phase
- 🧠 Reflection: Specification successfully abstracts technical implementation while defining clear business requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Proceed to planning phase with /sp.plan
