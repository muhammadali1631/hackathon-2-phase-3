# User Profile MCP Tool

## get_user_profile
- Purpose: Get current user's basic info
- Parameters: user_id (string, req)
- Returns: {id: string, email: string, name: string, createdAt: string (ISO)}
- DB: Fetch from users table (Better Auth managed)
- Only returns for matching user_id (security)