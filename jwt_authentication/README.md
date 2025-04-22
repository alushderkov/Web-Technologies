# JWT Authentication System Documentation

## Overview

This system implements JSON Web Token (JWT) based authentication for a Node.js/Express application. It provides secure user authentication with access and refresh tokens, token refresh functionality, and protected routes.

---

## Features

- JWT-based authentication with access and refresh tokens  
- Secure cookie storage for refresh tokens  
- Protected routes with JWT verification middleware  
- Token refresh mechanism  
- User logout functionality with token invalidation  
- Role-based access control (partially implemented)

---

## Authentication Flow

1. **Login**: User submits credentials to `/auth` endpoint  
2. **Token Generation**: Server validates credentials and issues:
   - Short-lived access token (30 seconds)
   - Long-lived refresh token (1 day) stored in HTTP-only cookie  
3. **Access Protected Resources**: Client includes access token in `Authorization` header  
4. **Token Refresh**: When access token expires, client requests new one via `/refresh`  
5. **Logout**: Client requests `/logout` to invalidate refresh token  

---

## API Endpoints

### Authentication

**POST /auth**  
- Authenticates user and returns JWT tokens  
- Request Body:
```json
{ "user": "username", "pwd": "password" }
```
- Response:
```json
{ "accessToken": "jwt_token" }
```
*(Refresh token is set as an HTTP-only cookie)*

---

### Token Refresh

**GET /refresh**  
- Issues new access token using valid refresh token  
- Requires `jwt` cookie  
- Response:
```json
{ "accessToken": "new_jwt_token" }
```

---

### Logout

**POST /logout**  
- Invalidates refresh token and clears cookie  
- Requires `jwt` cookie  
- Response: `204 No Content`

---

### Protected Resources

- All `/employees` routes are protected
- Requires valid access token in: `Authorization: Bearer <token>`

---

## Security Features

- HTTP-only, secure cookies for refresh tokens  
- Short-lived access tokens for improved security  
- Server-side invalidation on logout  
- CORS configuration for origin restrictions  
- Middleware to verify JWTs on protected routes  

---

## Implementation Details

### Token Storage

- Access Tokens: Stored client-side (e.g., memory or localStorage)  
- Refresh Tokens: Stored in HTTP-only cookies  

### Middleware

- `verifyJWT`: Verifies access tokens  
- `cookieParser`: Parses refresh tokens from cookies  
- `cors`: Configures Cross-Origin Resource Sharing  

### Token Rotation

- Refresh tokens are single-use and replaced with each refresh  
- Invalidation mechanism helps stop compromised tokens  

---

## Client-Side Requirements

1. Store access token in memory or secure storage  
2. Include access token in `Authorization` header  
3. Handle `401 Unauthorized` by attempting token refresh  
4. Clear tokens on logout and page refresh  
5. Auto-refresh token before expiration if possible  

---

## Error Handling

| Code | Meaning                             |
|------|-------------------------------------|
| 401  | Unauthorized (invalid credentials)  |
| 403  | Forbidden (valid token, no rights)  |
| 404  | Not Found (route doesn't exist)     |
| 204  | No Content (successful logout)      |

---

## Environment Variables

Set the following in your `.env` file:

```env
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

---

## Dependencies

- express: Web framework  
- jsonwebtoken: JWT implementation  
- bcrypt: Password hashing  
- cookie-parser: Cookie handling  
- cors: CORS configuration  
- dotenv: Environment management  

---

## Usage Example

### Login
```bash
curl -X POST http://localhost:3500/auth   -H "Content-Type: application/json"   -d '{"user":"username","pwd":"password"}'
```

### Access Protected Resource
```bash
curl http://localhost:3500/employees   -H "Authorization: Bearer <access_token>"
```

### Refresh Token
```bash
curl http://localhost:3500/refresh   --cookie "jwt=<refresh_token>"
```

### Logout
```bash
curl -X POST http://localhost:3500/logout   --cookie "jwt=<refresh_token>"
```

