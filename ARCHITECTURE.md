# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               React Frontend (Port 3000)              │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ Pages        │  │ Components   │  │ Context    │ │  │
│  │  │ - Home       │  │ - Navbar     │  │ - Auth     │ │  │
│  │  │ - Dashboard  │  │ - Sidebar    │  │ Context    │ │  │
│  │  │ - Events     │  │              │  │            │ │  │
│  │  │ - Resources  │  └──────────────┘  └────────────┘ │  │
│  │  │ - Community  │                                    │  │
│  │  │ - Profile    │        ┌──────────────────────┐   │  │
│  │  │ - Admin      │        │  Axios API Client    │   │  │
│  │  └──────────────┘        │  (src/utils/api.js)  │   │  │
│  │                          └──────────────────────┘   │  │
│  │                                │                     │  │
│  │                                │ HTTP/REST           │  │
│  │                                ▼                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                │                             │
└────────────────────────────────┼─────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │   CORS (Enabled)     │   │   Auth Checks        │
        └──────────────────────┘   └──────────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                ┌────────────────▼────────────────┐
                │                                 │
                │  Express.js Backend (Port 5000) │
                │                                 │
                │  ┌──────────────────────────┐   │
                │  │ Middleware               │   │
                │  │ - Authentication         │   │
                │  │ - Validation             │   │
                │  │ - Error Handling         │   │
                │  └──────────────────────────┘   │
                │  ┌──────────────────────────┐   │
                │  │ Routes                   │   │
                │  │ - /auth                  │   │
                │  │ - /api/events            │   │
                │  │ - /api/resources         │   │
                │  │ - /api/requests          │   │
                │  │ - /api/users             │   │
                │  └──────────────────────────┘   │
                │  ┌──────────────────────────┐   │
                │  │ Controllers              │   │
                │  │ - authController         │   │
                │  │ - eventController        │   │
                │  │ - resourceController     │   │
                │  │ - requestController      │   │
                │  │ - userController         │   │
                │  └──────────────────────────┘   │
                │                                 │
                └────────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Mongoose ODM           │
                    │  (Schema Validation)    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │                         │
                    │  MongoDB Database       │
                    │                         │
                    │  Collections:           │
                    │  - users                │
                    │  - apartments           │
                    │  - events               │
                    │  - resources            │
                    │  - resourcerequests     │
                    │                         │
                    └─────────────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User submits credentials
   ▼
2. Backend validates with bcrypt
   ▼
3. JWT token generated
   ▼
4. Token stored in localStorage
   ▼
5. Token sent with API requests
   ▼
6. Backend validates token
   ▼
7. Request processed or denied
```

### Resource Request Flow
```
1. Resident requests resource
   ▼
2. Request created in database
   ▼
3. Admin views pending requests
   ▼
4. Admin approves/rejects
   ▼
5. Resident notified of status
```

## Component Structure

### Frontend Components Hierarchy
```
App
├── AuthProvider
│   └── AuthContext
│
├── Home (unauthenticated)
│   ├── Login
│   └── Register
│
└── Main Layout (authenticated)
    ├── Navbar
    │   ├── Menu Toggle
    │   ├── Notification Bell
    │   └── Profile Dropdown
    │
    ├── Sidebar
    │   ├── Navigation Links
    │   └── Logout Button
    │
    └── Pages
        ├── Dashboard
        ├── Events
        ├── Resources
        ├── Community
        ├── Profile
        └── Admin (for admin/superadmin only)
```

## Database Schema Relationships

```
Apartment
    │
    ├─ User (apartmentId)
    │  ├─ Event (createdBy, apartmentId)
    │  │  └─ attendees: [User]
    │  │
    │  ├─ Resource (owner, apartmentId)
    │  │
    │  └─ ResourceRequest (requestedBy, approvedBy)
    │     └─ resourceId: Resource
```

## API Structure

### Authentication Routes
```
POST   /auth/register       - Create new user
POST   /auth/login          - Login user
```

### Event Routes
```
GET    /api/events          - List all events
POST   /api/events          - Create event (admin only)
PUT    /api/events/:id      - Update event
DELETE /api/events/:id      - Delete event
POST   /api/events/:id/join - Join event
POST   /api/events/:id/leave - Leave event
```

### Resource Routes
```
GET    /api/resources       - List resources
POST   /api/resources       - Create resource
PUT    /api/resources/:id   - Update resource
DELETE /api/resources/:id   - Delete resource
```

### Request Routes
```
GET    /api/requests        - Get user's requests
POST   /api/requests        - Create request
POST   /api/requests/:id/approve - Approve request
POST   /api/requests/:id/reject  - Reject request
```

### User Routes
```
GET    /api/users           - Get community members
GET    /api/users/:id       - Get user profile
PUT    /api/users/profile/update - Update profile
GET    /api/users/all       - Get all users (superadmin)
```

## Authentication & Authorization

### JWT Structure
```
Header
├─ alg: "HS256"
├─ typ: "JWT"

Payload
├─ id: user_id
├─ role: "resident|admin|superadmin"
├─ iat: issued_at_timestamp
└─ exp: expiration_timestamp

Signature
└─ HMAC-SHA256(secret)
```

### Role-Based Access Control
```
Resident
├─ Can view events
├─ Can create events
├─ Can view resources
├─ Can create resources
└─ Can request resources

Admin
├─ All Resident permissions
├─ Can approve/reject requests
├─ Can manage all events
└─ Can manage all resources

SuperAdmin
├─ All Admin permissions
├─ Can manage users
└─ Can manage apartments
```

## Error Handling

### HTTP Status Codes
```
200 OK              - Request successful
201 Created         - Resource created
400 Bad Request     - Invalid input
401 Unauthorized    - Missing/invalid token
403 Forbidden       - No permission
404 Not Found       - Resource not found
500 Server Error    - Internal server error
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Security Measures

```
✅ Password Hashing
   └─ bcryptjs (salt rounds: 10)

✅ Token Authentication
   └─ JWT (7-day expiration)

✅ Input Validation
   └─ express-validator

✅ CORS Protection
   └─ Enabled for local development

✅ Route Protection
   └─ authenticate middleware required

✅ Role Authorization
   └─ authorize middleware checks role
```

## Performance Considerations

1. **Database Indexing**
   - Indexes on frequently queried fields
   - Composite indexes for related queries

2. **API Optimization**
   - Projection to limit returned fields
   - Pagination for large datasets
   - Connection pooling

3. **Frontend Optimization**
   - Component memoization
   - Lazy loading of routes
   - Image optimization

4. **Caching**
   - localStorage for user data
   - API response caching
   - Browser caching for static assets

## Deployment Architecture

### Development
```
LocalHost:3000 (Frontend)
    ↓
LocalHost:5000 (Backend)
    ↓
LocalHost:27017 (MongoDB)
```

### Production
```
CDN (Static Assets)
    ↓
Frontend (Vercel/Netlify)
    ↓
API Gateway
    ↓
Backend (Heroku/AWS)
    ↓
MongoDB Atlas (Cloud Database)
```

## File Structure Standards

### Backend
- `/config` - Configuration files
- `/models` - Database schemas
- `/routes` - API routes
- `/controllers` - Business logic
- `/middleware` - Express middleware

### Frontend
- `/components` - Reusable components
- `/pages` - Page components
- `/context` - React context
- `/hooks` - Custom hooks
- `/utils` - Helper functions

## Development Workflow

1. **Feature Branch** - Create from main
2. **Development** - Make changes
3. **Testing** - Test locally
4. **Commit** - Commit changes
5. **Push** - Push to branch
6. **Review** - Code review
7. **Merge** - Merge to main
8. **Deploy** - Deploy to production

## Monitoring & Logging

### Backend Logs
- Server startup
- API requests
- Database operations
- Error stack traces

### Frontend Logs
- Component lifecycle
- API responses
- User interactions
- Error boundaries

## Future Enhancements

1. WebSocket for real-time notifications
2. File upload system (images, documents)
3. Advanced search and filtering
4. User messaging system
5. Event RSVP management
6. Resource usage tracking
7. Analytics dashboard
8. Two-factor authentication
9. Email notifications
10. Mobile app version
