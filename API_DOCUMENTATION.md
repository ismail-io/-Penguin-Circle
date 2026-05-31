# API Documentation

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-production-url.com`

## Authentication

All endpoints (except `/auth/*`) require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

---

## Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "apartmentId": "60d5ec49c1234567890abcde"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "resident",
    "apartmentId": "60d5ec49c1234567890abcde"
  }
}
```

**Errors**:
- 400: User already exists
- 400: Validation errors

---

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "resident",
    "apartmentId": "60d5ec49c1234567890abcde"
  }
}
```

**Errors**:
- 401: Invalid credentials

---

## Event Endpoints

### Get All Events

```http
GET /api/events
Authorization: Bearer <token>

Query Parameters:
- apartmentId (optional): Filter by apartment
```

**Response** (200 OK)
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "title": "Community Picnic",
      "description": "Annual community picnic",
      "date": "2024-06-15T14:00:00Z",
      "time": "14:00",
      "location": "Central Park",
      "category": "social",
      "capacity": 50,
      "createdBy": {
        "_id": "60d5ec49c1234567890abcde",
        "name": "Admin User"
      },
      "attendees": [],
      "createdAt": "2024-05-15T10:00:00Z"
    }
  ]
}
```

---

### Create Event

```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Community Meeting",
  "description": "Monthly community meeting",
  "date": "2024-06-20",
  "time": "18:00",
  "location": "Community Center",
  "capacity": 100,
  "category": "social"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "title": "Community Meeting",
    "description": "Monthly community meeting",
    "date": "2024-06-20T18:00:00Z",
    "time": "18:00",
    "location": "Community Center",
    "capacity": 100,
    "category": "social",
    "createdBy": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "John Doe"
    },
    "attendees": [],
    "createdAt": "2024-05-15T10:00:00Z"
  }
}
```

**Errors**:
- 401: Unauthorized
- 400: Validation errors

---

### Update Event

```http
PUT /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2024-06-21",
  "time": "19:00",
  "location": "New Location",
  "capacity": 75,
  "category": "social"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "title": "Updated Title",
    ...
  }
}
```

---

### Delete Event

```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### Join Event

```http
POST /api/events/:id/join
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "title": "Community Meeting",
    "attendees": [
      {"_id": "60d5ec49c1234567890abcde", "name": "John Doe"},
      {"_id": "60d5ec49c1234567890abcdf", "name": "Jane Doe"}
    ]
  },
  "message": "Successfully joined event"
}
```

---

### Leave Event

```http
POST /api/events/:id/leave
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Successfully left event"
}
```

---

## Resource Endpoints

### Get All Resources

```http
GET /api/resources
Authorization: Bearer <token>

Query Parameters:
- category (optional): tools, books, equipment, parking, other
- availability (optional): true or false
```

**Response** (200 OK)
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "name": "Power Drill",
      "description": "18V cordless drill",
      "category": "tools",
      "owner": {
        "_id": "60d5ec49c1234567890abcde",
        "name": "John Doe"
      },
      "availability": true,
      "quantity": 1,
      "condition": "good",
      "createdAt": "2024-05-15T10:00:00Z"
    }
  ]
}
```

---

### Create Resource

```http
POST /api/resources
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Vacuum Cleaner",
  "description": "Dyson cordless vacuum",
  "category": "equipment",
  "quantity": 1,
  "condition": "excellent"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "name": "Vacuum Cleaner",
    "description": "Dyson cordless vacuum",
    "category": "equipment",
    "owner": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "John Doe"
    },
    "availability": true,
    "quantity": 1,
    "condition": "excellent",
    "createdAt": "2024-05-15T10:00:00Z"
  }
}
```

---

### Update Resource

```http
PUT /api/resources/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "quantity": 2,
  "availability": false
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "name": "Updated Name",
    ...
  }
}
```

---

### Delete Resource

```http
DELETE /api/resources/:id
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

---

## Resource Request Endpoints

### Get Resource Requests

```http
GET /api/requests
Authorization: Bearer <token>

Query Parameters:
- status (optional): pending, approved, rejected, returned
```

**Response** (200 OK)
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "resourceId": {
        "_id": "60d5ec49c1234567890abcde",
        "name": "Power Drill"
      },
      "requestedBy": {
        "_id": "60d5ec49c1234567890abcde",
        "name": "Jane Doe"
      },
      "status": "pending",
      "requestMessage": "Need it for weekend project",
      "requestDate": "2024-05-15T10:00:00Z"
    }
  ]
}
```

---

### Create Resource Request

```http
POST /api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "resourceId": "60d5ec49c1234567890abcde",
  "requestMessage": "Need it for my project"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "resourceId": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "Power Drill"
    },
    "requestedBy": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "Jane Doe"
    },
    "status": "pending",
    "requestMessage": "Need it for my project",
    "requestDate": "2024-05-15T10:00:00Z"
  }
}
```

---

### Approve Request

```http
POST /api/requests/:id/approve
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "status": "approved",
    "approvedBy": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "Admin User"
    },
    "approvalDate": "2024-05-15T11:00:00Z"
  },
  "message": "Request approved"
}
```

---

### Reject Request

```http
POST /api/requests/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "rejectionReason": "Resource already in use"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "status": "rejected",
    "rejectionReason": "Resource already in use"
  },
  "message": "Request rejected"
}
```

---

## User Endpoints

### Get Community Members

```http
GET /api/users
Authorization: Bearer <token>

Query Parameters:
- searchTerm (optional): Search by name or email
```

**Response** (200 OK)
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "resident",
      "phone": "+1-234-567-8900",
      "profile": {
        "bio": "Tech enthusiast",
        "avatar": "https://..."
      },
      "createdAt": "2024-05-15T10:00:00Z"
    }
  ]
}
```

---

### Get User Profile

```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "resident",
    "phone": "+1-234-567-8900",
    "profile": {
      "bio": "Tech enthusiast",
      "avatar": "https://..."
    },
    "createdAt": "2024-05-15T10:00:00Z"
  }
}
```

---

### Update Profile

```http
PUT /api/users/profile/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1-234-567-8901",
  "bio": "Updated bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Updated",
    "phone": "+1-234-567-8901",
    "profile": {
      "bio": "Updated bio",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "message": "Profile updated successfully"
}
```

---

### Get All Users (SuperAdmin Only)

```http
GET /api/users/all
Authorization: Bearer <superadmin_token>
```

**Response** (200 OK)
```json
{
  "success": true,
  "count": 50,
  "data": [...]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - No permission for this action |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Rate Limiting

Currently not implemented. Future versions will include:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## Pagination

Add to future versions:
```
GET /api/events?page=1&limit=10
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","apartmentId":"123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

### Get Events
```bash
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer <token>"
```

### Create Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Event","description":"Desc","date":"2024-06-15","location":"Place"}'
```

---

## Testing with Postman

1. Import collection: See `postman-collection.json` (if available)
2. Set environment variable `baseUrl` to `http://localhost:5000`
3. Set `token` variable after login
4. Run requests with {{baseUrl}} and {{token}}

---

## Changelog

### Version 1.0.0 (Initial Release)
- ✅ Authentication (register, login)
- ✅ Events management
- ✅ Resource sharing
- ✅ Resource requests
- ✅ User profiles
- ✅ Admin panel

### Planned Features
- ⏳ WebSocket for notifications
- ⏳ File uploads
- ⏳ Messaging system
- ⏳ Advanced filtering
- ⏳ Analytics

---

**API Documentation Complete!** 

For more information, visit the [GitHub Repository](https://github.com/yourname/community-connection)
