# Research Summary: AI Todo Chatbot Integration (Cohere-Powered)

## Overview
This research document consolidates findings and decisions for implementing the Cohere-powered AI chatbot for the Todo application. It resolves all technical unknowns and provides the foundation for implementation.

## Key Decisions Made

### 1. Cohere Model Selection
- **Decision**: Use `command-r-plus` model for optimal tool-calling accuracy
- **Rationale**: Provides superior reasoning capabilities and better tool-calling accuracy compared to base command-r, which is crucial for the hackathon demo where precision in task management is essential
- **Alternatives considered**:
  - `command-r`: Faster and cheaper but less accurate for complex tool calls
  - Custom fine-tuned model: Higher cost and complexity without guaranteed improvement

### 2. Tool Calling Implementation
- **Decision**: Use Cohere native tool calling instead of forcing JSON mode
- **Rationale**: Native tool calling is more reliable, supports parallel tool execution, and leverages Cohere's optimized tool-handling capabilities
- **Alternatives considered**:
  - JSON mode: Less reliable and doesn't support parallel execution
  - Custom parsing: More complex and error-prone

### 3. Chat UI Technology
- **Decision**: Hybrid approach - try hosted OpenAI ChatKit first, fallback to custom React component
- **Rationale**: Hosted ChatKit provides a polished, feature-rich experience with minimal development time, but custom component ensures reliability and control if setup issues arise
- **Alternatives considered**:
  - Build from scratch: More time-consuming but complete control
  - Third-party chat components: Potential licensing costs and limited customization

### 4. Floating Icon Style
- **Decision**: Modern circular FAB with subtle pulse animation on new messages
- **Rationale**: Follows established patterns (WhatsApp/Telegram) while providing clear visual indication of activity
- **Alternatives considered**:
  - Traditional chat bubble: More obvious but potentially cluttered
  - Minimal icon: Cleaner but less noticeable

### 5. Message History Management
- **Decision**: Truncate to last 20 messages per conversation to prevent token blowup
- **Rationale**: Balances context retention with cost/performance considerations
- **Alternatives considered**:
  - Unlimited history: Could lead to excessive token usage and slower responses
  - Shorter history (10 messages): Might lose important context

### 6. Tool Execution Order
- **Decision**: Parallel execution when possible (Cohere supports it)
- **Rationale**: Improves response time when multiple tools need to be executed
- **Alternatives considered**:
  - Sequential execution: Simpler but slower

### 7. Response Streaming Approach
- **Decision**: Simulate typing effect in frontend (no real streaming from Cohere in basic setup)
- **Rationale**: Provides better user experience without the complexity of handling streaming responses
- **Alternatives considered**:
  - Real streaming: More complex implementation but more authentic

### 8. Conversation Naming
- **Decision**: Auto-generate short title from first user message
- **Rationale**: Provides meaningful conversation identification without user effort
- **Alternatives considered**:
  - Manual naming: More control but requires user effort
  - Generic names: Simpler but less useful for users

## Technical Architecture Findings

### Cohere Integration Patterns
- Cohere's `chat` API supports both message history and tool definitions in a single call
- Tool results can be fed back into subsequent calls for complex multi-step operations
- The API handles conversation context management effectively when history is provided

### MCP Compatibility with Cohere
- Cohere tools use JSON Schema format which aligns well with MCP tool definitions
- Tools can be defined with name, description, and parameters following standard formats
- Response includes both natural language output and structured tool call information

### Database Integration Considerations
- Conversation and Message models need to be designed for efficient history retrieval
- Foreign key relationships to user table must be maintained for security
- Indexing strategy should optimize for user-based queries and chronological ordering

### Frontend Integration Patterns
- Floating Action Button (FAB) pattern works well for chatbot access
- Modal-based chat windows provide focused interaction without disrupting main UI
- Message threading requires careful state management to sync with backend

## Risk Assessment

### High Priority Risks
1. **Cohere API availability/cost**: Monitor usage and have fallback plan
2. **Data isolation failures**: Critical security concern requiring thorough validation
3. **Performance degradation**: Long conversation histories could slow responses

### Mitigation Strategies
1. **API monitoring**: Implement usage tracking and alerts
2. **Security validation**: Comprehensive testing of user_id filtering
3. **History management**: Enforce message limits and implement history truncation

## Implementation Prerequisites

### Environment Setup
- COHERE_API_KEY environment variable configuration
- Domain allowlist preparation for ChatKit (if used)
- Database migration for new Conversation/Message models

### Dependency Requirements
- cohere-python SDK installation
- Updates to existing authentication middleware for chat endpoints
- Frontend state management for chat UI

## Next Steps Validation

This research validates that the proposed implementation approach is technically feasible and aligns with the project requirements. All major technical decisions have been made, clearing the path for the design phase (Phase 1).