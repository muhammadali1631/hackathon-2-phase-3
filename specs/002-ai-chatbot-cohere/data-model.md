# Data Model: AI Todo Chatbot Integration (Cohere-Powered)

## Overview
This document defines the data models required for the Cohere-powered AI chatbot functionality, extending the existing Todo application data model while maintaining consistency with existing patterns.

## Entity Definitions

### Conversation
Represents a chat session between a user and the AI assistant.

- **id**: UUID (Primary Key) - Unique identifier for the conversation
- **user_id**: UUID (Foreign Key) - Reference to the user who owns this conversation
- **title**: String (nullable) - Auto-generated short title from first user message
- **created_at**: DateTime - Timestamp when conversation started
- **updated_at**: DateTime - Timestamp when conversation was last updated
- **is_active**: Boolean (default: true) - Whether conversation is currently active

**Relationships**:
- Belongs to: User (many-to-one)
- Has many: Messages (one-to-many)

**Validation Rules**:
- user_id must reference an existing user
- title length must be ≤ 100 characters if provided
- created_at and updated_at must be valid timestamps

### Message
Represents individual messages within a conversation.

- **id**: UUID (Primary Key) - Unique identifier for the message
- **conversation_id**: UUID (Foreign Key) - Reference to the conversation this message belongs to
- **role**: String (enum: "user", "assistant", "system") - The sender role
- **content**: Text - The message content
- **tool_calls**: JSON (nullable) - Structured representation of any tools called by this message
- **tool_call_results**: JSON (nullable) - Results from executed tools
- **created_at**: DateTime - Timestamp when message was created

**Relationships**:
- Belongs to: Conversation (many-to-one)

**Validation Rules**:
- conversation_id must reference an existing conversation
- role must be one of the allowed values
- content must be provided
- tool_calls must follow Cohere's tool call format if present
- created_at must be a valid timestamp

### Extended UserProfile (Existing)
Enhanced with chatbot-related information.

- **id**: UUID (Primary Key) - Existing field
- **email**: String - Existing field
- **name**: String - Existing field
- **created_at**: DateTime - Existing field
- **last_chat_interaction**: DateTime (nullable) - Timestamp of last chat activity

**Relationships**:
- Has many: Conversations (one-to-many)

## State Transitions

### Conversation States
- **Active**: New conversation created, user can add messages
- **Paused**: Conversation inactive for extended period (still accessible)
- **Archived**: User-requested archive (read-only, no new messages)

**Transitions**:
- Active → Paused: After 30 days of inactivity
- Active → Archived: User action
- Paused → Active: User sends new message

### Message States
- **Pending**: Message sent, waiting for AI response
- **Processing**: AI processing the message
- **Completed**: AI response received and saved
- **Failed**: Error occurred during processing

## Data Integrity Constraints

### Referential Integrity
- All foreign key relationships must reference existing records
- Cascade deletion: When user is deleted, all their conversations and messages are removed
- Orphan protection: Messages must belong to existing conversations

### Business Rules
- Users can only access their own conversations and messages
- Message content cannot exceed 10,000 characters
- Conversation titles are automatically generated from the first message if not explicitly set
- Message ordering is chronological based on created_at timestamp

## Indexing Strategy

### Primary Indexes
- Conversation.id (primary key)
- Message.id (primary key)

### Secondary Indexes
- Conversation.user_id (foreign key, for user-based queries)
- Message.conversation_id (foreign key, for conversation history retrieval)
- Message.created_at (for chronological ordering)
- Conversation.updated_at (for sorting conversations by recency)

## API Contract Implications

### Query Patterns
- Retrieve user's conversations: Filter by user_id, sort by updated_at DESC
- Retrieve conversation history: Filter by conversation_id, sort by created_at ASC
- Search messages: Full-text search on content field (if needed)

### Performance Considerations
- Pagination recommended for conversation lists (default: 20 items per page)
- Message history truncated to last 20 messages for performance
- Asynchronous message saving to prevent blocking the chat response

## Security Considerations

### Data Access
- All queries must be filtered by authenticated user_id
- No cross-user data access allowed
- Conversation and message access controlled through user authentication

### Privacy
- Message content is encrypted at rest if sensitive information is detected
- User profile information access restricted to authenticated users only
- Audit trail maintained for data access operations

## Migration Strategy

### From Existing Schema
- Add new Conversation table with user_id foreign key
- Add new Message table with conversation_id foreign key
- Extend UserProfile table with last_chat_interaction field
- Update existing indexes as needed

### Rollback Plan
- Remove new tables and columns in reverse order
- Restore previous schema constraints
- Validate data integrity after rollback