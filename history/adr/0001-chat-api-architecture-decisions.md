# ADR-0001: Chat API Architecture Decisions

## Status
Accepted

## Date
2026-02-04

## Context
During the implementation of the chat API for the AI chatbot feature, several architectural decisions needed to be made regarding:
- API routing and endpoint structure
- Authentication and authorization flow
- Database schema and relationships
- AI model integration approach
- Error handling and resilience patterns

## Decision

### 1. Router Configuration
We decided to use path-based user identification (`/api/{user_id}/chat`) combined with JWT token validation to ensure proper user isolation and security.

### 2. Authentication Flow
Implemented JWT-based authentication with proper token validation and user ID extraction from the token payload, ensuring that the authenticated user matches the requested user ID in the path.

### 3. Database Integration
Used SQLModel with proper foreign key relationships between users, conversations, and messages to maintain data integrity and enable efficient querying.

### 4. AI Model Integration
Selected Cohere's `command-r-08-2024` model as the primary AI model, with proper error handling for API failures and graceful degradation.

### 5. Tool Calling Architecture
Implemented a service-based architecture for tool integration, allowing the AI to call various backend functions while maintaining security and proper user context.

## Alternatives Considered

### Alternative 1: Different Authentication Approach
- Option: Session-based authentication
- Rejected: JWT provides better scalability and statelessness

### Alternative 2: Different Database Approach
- Option: Direct database connections without ORM
- Rejected: SQLModel provides better type safety and maintainability

### Alternative 3: Different AI Provider
- Option: OpenAI, Anthropic, or other providers
- Chosen: Cohere for its strong tool-calling capabilities and cost-effectiveness

## Consequences

### Positive
- Secure user isolation with proper authentication
- Scalable architecture supporting multiple concurrent users
- Flexible tool integration for extended functionality
- Robust error handling and graceful degradation

### Negative
- Increased complexity in authentication validation
- Dependency on external AI provider
- Additional database queries for each conversation

## Notes
This architecture supports the core requirements of the AI chatbot while maintaining security, scalability, and extensibility for future enhancements.