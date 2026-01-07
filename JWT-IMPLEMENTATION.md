# 🔐 JWT Authentication Implementation

## Overview
The CityGuide backend now uses **proper JWT (JSON Web Token)** authentication with bcrypt password hashing for secure user authentication.

## What Changed?

### ✅ Production Server (`production-server.js`)
- **JWT Token Generation**: Uses `jsonwebtoken` library
- **Password Hashing**: Uses `bcryptjs` for secure password storage
- **Token Validation**: Middleware validates JWT on protected routes
- **Token Expiry**: Tokens expire after 7 days
- **Session Validation**: `/api/auth/me` endpoint to validate tokens

### ✅ Frontend Updates
- **Token Validation**: Auth provider now validates tokens with backend
- **Session Restoration**: Properly restores user sessions on app restart
- **Error Handling**: Handles expired/invalid tokens gracefully

## Server Details

### Port
- **8080** (Production server with JWT)

### JWT Configuration
```javascript
JWT_SECRET: 'cityguide_secret_key_2024'
JWT_EXPIRY: '7d' // 7 days
```

## API Endpoints

### Public Endpoints (No Auth Required)
```
GET  /api/health          - Health check
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login user
```

### Protected Endpoints (JWT Required)
```
GET    /api/auth/me       - Validate token & get user info
GET    /api/cities        - Get list of cities
GET    /api/places        - Get places (with pagination)
GET    /api/places/:id    - Get place details
GET    /api/places/search - Search places
GET    /api/favorites     - Get user favorites
POST   /api/favorites     - Add to favorites
DELETE /api/favorites/:id - Remove from favorites
```

## How JWT Works

### 1. Registration/Login Flow
```
User → Register/Login → Server validates → Server generates JWT → Client stores token
```

### 2. Protected Route Access
```
Client → Sends request with JWT in header → Server validates JWT → Server processes request
```

### 3. Token Format
```
Authorization: Bearer <JWT_TOKEN>
```

### 4. JWT Payload
```json
{
  "userId": "user_1",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1704556800,
  "exp": 1705161600
}
```

## Testing the JWT Implementation

### Option 1: Using the Test HTML File
1. Start the production server:
   ```bash
   cd backend
   node production-server.js
   ```

2. Open `test-jwt.html` in your browser:
   ```
   backend/test-jwt.html
   ```

3. Test the flow:
   - Register a new user
   - Login with credentials
   - Validate token
   - Access protected routes (cities, places)

### Option 2: Using Flutter App
1. Start the production server:
   ```bash
   cd backend
   node production-server.js
   ```

2. Run Flutter app:
   ```bash
   cd frontend
   flutter run -d chrome
   ```

3. The app will:
   - Auto-detect environment (web/mobile)
   - Use appropriate API URL
   - Store JWT in SharedPreferences
   - Validate token on app restart
   - Handle expired tokens

### Option 3: Using curl/Postman

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Validate Token
```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Cities (Protected)
```bash
curl http://localhost:8080/api/auth/cities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

### ✅ Password Security
- Passwords are hashed using bcrypt (10 salt rounds)
- Plain text passwords are never stored
- Password validation on login

### ✅ Token Security
- JWT signed with secret key
- Token includes expiry time
- Server validates token signature
- Invalid/expired tokens are rejected

### ✅ API Security
- All sensitive routes require authentication
- Token must be sent in Authorization header
- User-specific data isolation (favorites)

## Error Handling

### Authentication Errors
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Registration Errors
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

## Frontend Integration

### Token Storage
```dart
// Save token
await _apiService.saveToken(token);

// Get token
final token = await _apiService.getToken();

// Remove token
await _apiService.removeToken();
```

### API Requests with Token
```dart
// Token is automatically added to all requests via interceptor
_dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) async {
    final token = await getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  },
));
```

### Session Restoration
```dart
// On app start
final restored = await authProvider.restoreSession();
if (restored) {
  // Navigate to home screen
} else {
  // Navigate to login screen
}
```

## Debugging

### Server Logs
The production server includes comprehensive logging:
- 📨 Request logging (method, path, timestamp)
- 🔐 Authentication attempts
- ✅ Successful operations
- ❌ Error details
- 👤 User information

### Frontend Logs
The Flutter app includes debug logging:
- 🌐 API base URL detection
- 🚀 API requests
- 🔑 Token operations
- ✅ Successful responses
- ❌ Error details

## Migration from Test Server

### Old (test-web-server.js)
- Simple token generation: `token_${userId}_${timestamp}`
- No password hashing
- No token validation
- No expiry

### New (production-server.js)
- Proper JWT with signature
- Bcrypt password hashing
- Token validation middleware
- 7-day expiry
- Session validation endpoint

## Next Steps

### For Production Deployment
1. Move JWT_SECRET to environment variable
2. Use MongoDB for persistent storage
3. Implement token refresh mechanism
4. Add rate limiting
5. Enable HTTPS
6. Add request logging to database
7. Implement password reset flow
8. Add email verification

### Optional Enhancements
- Refresh tokens for extended sessions
- Role-based access control (admin, user)
- OAuth integration (Google, Facebook)
- Two-factor authentication
- Password strength requirements
- Account lockout after failed attempts

## Troubleshooting

### Issue: "Invalid or expired token"
**Solution**: Token has expired or is invalid. User needs to login again.

### Issue: "Access denied. No token provided"
**Solution**: Token not sent in request. Check Authorization header.

### Issue: "User already exists"
**Solution**: Email is already registered. Use login instead.

### Issue: Port 8080 already in use
**Solution**: 
```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>

# Then restart server
node production-server.js
```

## Summary

✅ **Secure Authentication**: Proper JWT with bcrypt password hashing
✅ **Token Validation**: Middleware validates all protected routes
✅ **Session Management**: Token storage and restoration
✅ **Error Handling**: Comprehensive error messages
✅ **Debug Logging**: Detailed logs for troubleshooting
✅ **Frontend Integration**: Seamless token management
✅ **Testing Tools**: HTML test page for quick validation

The CityGuide app now has production-ready JWT authentication! 🎉
