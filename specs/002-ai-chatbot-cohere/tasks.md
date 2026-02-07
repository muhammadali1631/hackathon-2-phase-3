# Implementation Tasks: AI Todo Chatbot Integration (Cohere-Powered)

**Feature**: AI Todo Chatbot Integration (Cohere-Powered)
**Branch**: `002-ai-chatbot-cohere`
**Spec**: specs/002-ai-chatbot-cohere/spec.md
**Plan**: specs/002-ai-chatbot-cohere/plan.md

## Implementation Strategy

This implementation follows a phased approach where each user story results in a complete, independently testable increment. The strategy prioritizes delivering core functionality early (MVP) with subsequent enhancements for a polished experience.

- **MVP Scope**: User Story 1 (Natural Language Task Management) with minimal UI
- **Incremental Delivery**: Each user story builds upon the previous with additional functionality
- **Parallel Execution**: Where possible, tasks are marked [P] to allow parallel development
- **Independent Testing**: Each user story can be tested independently once completed

## Phase 1: Setup & Environment

- [x] T001 Create COHERE_API_KEY environment variable in backend/.env
- [x] T002 Install cohere-python SDK in backend requirements.txt and pip install
- [x] T003 Update backend Alembic migration to include Conversation and Message models
- [x] T004 Create frontend chat API service file at frontend/src/services/chatApi.ts
- [ ] T005 [P] Add COHERE_API_KEY to backend configuration loading

## Phase 2: Foundational Components

- [x] T010 Create Conversation model in backend/src/models/conversation.py with id, user_id, title, created_at, updated_at, is_active
- [x] T011 Create Message model in backend/src/models/message.py with id, conversation_id, role, content, tool_calls, tool_call_results, created_at
- [x] T012 [P] Create ChatService in backend/src/services/chat_service.py for conversation management
- [x] T013 [P] Create ToolsService in backend/src/services/tools_service.py for MCP-compatible tools
- [x] T014 [P] Update User model in backend/src/models/user.py with last_chat_interaction field
- [x] T015 [P] Create CohereRunner class in backend/src/services/chat_service.py for AI integration

## Phase 3: User Story 1 - Natural Language Task Management [US1]

**Goal**: Enable users to manage todos using natural language commands like "Add task buy milk" or "Show pending tasks".

**Independent Test Criteria**: Send natural language commands to the chatbot and verify that appropriate task operations are performed, delivering the core conversational interface value.

**Acceptance Scenarios**:
1. Given I'm logged in and see the chatbot UI, When I type "Add task buy milk", Then a new task "buy milk" is created and I receive confirmation
2. Given I have existing tasks, When I type "Show pending tasks", Then I see a list of my pending tasks in the chat
3. Given I have a task with ID 5, When I type "Complete task 5", Then the task is marked complete and I receive confirmation
4. Given I have multiple tasks, When I type "Delete the old one", Then the oldest task is deleted and I receive confirmation

### Implementation Tasks:

- [x] T020 [US1] Create add_task tool function in backend/src/services/tools_service.py
- [x] T021 [US1] Create list_tasks tool function in backend/src/services/tools_service.py
- [x] T022 [US1] Create complete_task tool function in backend/src/services/tools_service.py
- [x] T023 [US1] Create delete_task tool function in backend/src/services/tools_service.py
- [x] T024 [US1] Create update_task tool function in backend/src/services/tools_service.py
- [x] T025 [US1] Define Cohere tools schema for all task operations in backend/src/services/tools_service.py
- [x] T026 [US1] Implement chat endpoint POST /api/{user_id}/chat in backend/src/api/chat.py
- [x] T027 [US1] [P] Implement conversation history loading in ChatService
- [x] T028 [US1] [P] Implement message saving logic in ChatService
- [x] T029 [US1] [P] Integrate CohereRunner with tool execution in ChatService
- [x] T030 [US1] [P] Add basic chat UI component in frontend/src/components/ChatWindow.tsx
- [x] T031 [US1] [P] Add simple chat input/output in frontend/src/components/ChatWindow.tsx
- [x] T032 [US1] [P] Connect frontend to backend chat API in frontend/src/services/chatApi.ts
- [x] T033 [US1] [P] Add floating chatbot icon in frontend/src/components/ChatbotIcon.tsx
- [x] T034 [US1] [P] Basic styling for chat interface with Tailwind CSS
- [ ] T035 [US1] Test natural language commands for task operations

## Phase 4: User Story 2 - User Profile Information Access [US2]

**Goal**: Allow users to ask for their profile information using natural language like "Mera email kya hai?" or "Who am I?".

**Independent Test Criteria**: Ask profile-related questions and verify that correct user information (id, email, name, createdAt) is returned, delivering the profile access value.

**Acceptance Scenarios**:
1. Given I'm logged in, When I ask "Mera email kya hai?", Then I receive my email address in the response
2. Given I'm logged in, When I ask "Who am I?", Then I receive my name and email information
3. Given I'm logged in, When I ask "Mera naam batao", Then I receive my name in the response

### Implementation Tasks:

- [x] T040 [US2] Create get_user_profile tool function in backend/src/services/tools_service.py
- [x] T041 [US2] Add user profile tool to Cohere tools schema in backend/src/services/tools_service.py
- [x] T042 [US2] Test profile queries in multiple languages (English and Urdu)
- [x] T043 [US2] [P] Update chat interface to handle profile responses appropriately
- [x] T044 [US2] [P] Add multilingual response formatting in ChatService

## Phase 5: User Story 3 - Persistent Chat Experience [US3]

**Goal**: Ensure chat conversations persist across sessions and browser refreshes so users can continue conversations seamlessly.

**Independent Test Criteria**: Start a conversation, refresh the page, and verify that the conversation history is preserved, delivering continuity value.

**Acceptance Scenarios**:
1. Given I've had a conversation with the chatbot, When I refresh the page, Then I can see the previous messages in the chat window
2. Given I've had a conversation yesterday, When I log in today, Then I can access my previous conversations
3. Given I have multiple conversations, When I switch between them, Then each conversation maintains its own context

### Implementation Tasks:

- [x] T050 [US3] Implement conversation listing endpoint GET /api/{user_id}/conversations in backend/src/api/chat.py
- [x] T051 [US3] Add conversation switching functionality in frontend/src/components/ChatWindow.tsx
- [x] T052 [US3] [P] Implement conversation persistence in ChatService
- [x] T053 [US3] [P] Add conversation history truncation (last 20 messages) in ChatService
- [x] T054 [US3] [P] Update frontend to maintain conversation state across page refreshes
- [x] T055 [US3] [P] Add conversation auto-title generation from first message
- [ ] T056 [US3] Test conversation persistence across browser refreshes
- [ ] T057 [US3] Test multiple conversation management

## Phase 6: User Story 4 - Visual Chat Interface Integration [US4]

**Goal**: Provide a floating chatbot icon that appears when logged in, giving easy access to the AI assistant without cluttering the main UI.

**Independent Test Criteria**: Log in and verify the chatbot icon appears, clicking it opens the chat window, delivering accessibility value.

**Acceptance Scenarios**:
1. Given I'm logged in, When I visit any page, Then I see a floating chatbot icon in the bottom-right corner
2. Given I see the chatbot icon, When I click it, Then a chat window opens with a clean, modern interface
3. Given I have an open chat window, When I click outside it, Then the window closes without losing conversation context

### Implementation Tasks:

- [x] T060 [US4] Create polished ChatWindow component with modern UI in frontend/src/components/ChatWindow.tsx
- [x] T061 [US4] Add smooth animations and transitions to chat interface
- [x] T062 [US4] [P] Implement floating action button (FAB) with pulse animation in frontend/src/components/ChatbotIcon.tsx
- [x] T063 [US4] [P] Add click-outside-to-close functionality for chat window
- [x] T064 [US4] [P] Add typing indicators and message animations
- [x] T065 [US4] [P] Implement auto-scroll to bottom for new messages
- [x] T066 [US4] [P] Add dark mode support consistent with main app
- [x] T067 [US4] [P] Add message threading and proper role-based styling
- [x] T068 [US4] Test floating icon visibility and behavior
- [x] T069 [US4] Test smooth UI interactions and animations

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T070 Add error handling for Cohere API failures with user-friendly messages
- [x] T071 [P] Implement rate limiting for chat endpoints in backend/src/api/chat.py
- [x] T072 [P] Add comprehensive logging for chat interactions
- [x] T073 [P] Add validation for message content length and format
- [x] T074 [P] Implement proper cleanup of inactive conversations
- [x] T075 [P] Add internationalization support for Urdu language responses
- [x] T076 [P] Optimize database queries with proper indexing for conversation/message retrieval
- [x] T077 [P] Add unit tests for all new services and endpoints
- [x] T078 [P] Add integration tests for end-to-end chat functionality
- [x] T079 [P] Update documentation for new API endpoints
- [x] T080 [P] Add monitoring and alerting for chat service performance

## Dependencies Between User Stories

- **US2 depends on US1**: Profile access requires the foundational chat infrastructure
- **US3 depends on US1**: Conversation persistence builds on the basic chat functionality
- **US4 depends on US1**: UI enhancements require the underlying chat functionality to work

## Parallel Execution Opportunities

- **Services Layer**: ToolsService and ChatService can be developed in parallel [P tasks]
- **Frontend Components**: ChatWindow and ChatbotIcon can be developed in parallel [P tasks]
- **UI Polish**: Styling and animations can be added in parallel once core functionality exists [P tasks]
- **Testing**: Unit tests can be written in parallel with implementation [P tasks]

## Test Strategy

- **Unit Tests**: Individual service functions and tool implementations
- **Integration Tests**: End-to-end chat functionality with Cohere integration
- **UI Tests**: Chat interface interactions and state management
- **Security Tests**: Authentication and user data isolation validation
- **Performance Tests**: Response times and message history handling