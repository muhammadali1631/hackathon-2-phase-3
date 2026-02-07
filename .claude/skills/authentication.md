# Authentication Skill

A comprehensive authentication system with signup, login, and JWT-based protection for secure routes.

## Functions

### `signup(email: string, password: string, name: string)`
Registers a new user with email, password, and name.

**Parameters:**
- `email` (string): User's email address (must be unique and valid)
- `password` (string): User's password (should meet complexity requirements)
- `name` (string): User's full name or display name

**Response:**
- Returns a success message and user object (excluding sensitive data like password hash)
- Creates a new user record in the database
- Hashes and securely stores the password
- Generates a JWT token for immediate login

### `login(email: string, password: string)` → `JWT Token`
Authenticates a user and returns a JWT token for subsequent requests.

**Parameters:**
- `email` (string): User's registered email address
- `password` (string): User's password

**Response:**
- Returns a signed JWT token on successful authentication
- Validates credentials against stored hashed password
- Returns appropriate error messages for invalid credentials
- May include refresh tokens for extended sessions

### `get_current_user()` → `User Object`
Retrieves the currently authenticated user from the JWT token.

**Prerequisites:**
- Requires a valid JWT token in the Authorization header (`Bearer <token>`)

**Response:**
- Returns the user object associated with the JWT token
- Extracts user ID from the token payload
- Fetches user details from the database
- Returns null or throws error if token is invalid/expired

### `protect_route()` → `Middleware`
Verifies JWT token and injects user_id into the request context.

**Functionality:**
- Middleware function to protect routes that require authentication
- Verifies the JWT token's signature and validity
- Decodes the user ID from the token
- Injects the user ID into the request object for downstream handlers
- Returns 401 Unauthorized if token is missing or invalid

## Implementation Details

### JWT Token Structure
```javascript
{
  "user_id": number,      // Unique identifier of the user
  "email": string,        // User's email address
  "exp": number,          // Expiration timestamp
  "iat": number           // Issued at timestamp
}
```

### Password Security
- Passwords are hashed using bcrypt or Argon2 before storage
- Minimum password strength requirements enforced
- Secure salt generation for each password

### Security Measures
- JWT tokens have configurable expiration times
- Tokens are signed with a strong secret key
- Rate limiting on authentication endpoints
- Secure cookie options for token storage (if applicable)

## Usage Examples

### Signing Up a New User
```javascript
// Example usage of signup function
const newUser = await signup("user@example.com", "SecurePass123!", "John Doe");
```

### Authenticating a User
```javascript
// Example usage of login function
const token = await login("user@example.com", "SecurePass123!");
// Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Protecting a Route
```javascript
// Example usage of protect_route middleware
app.get('/dashboard', protect_route(), (req, res) => {
  // req.user_id is available here after middleware
  const userId = req.user_id;
  // Serve protected content
});
```

### Getting Current User
```javascript
// Example usage of get_current_user function
const currentUser = await get_current_user();
// Returns user object or null if not authenticated
```

## Error Handling

- Invalid credentials return 401 Unauthorized
- Expired tokens return 401 Unauthorized
- Malformed tokens return 401 Unauthorized
- Server errors return 500 Internal Server Error
- Appropriate error messages for different failure scenarios