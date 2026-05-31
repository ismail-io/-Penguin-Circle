# Community Connection Platform - Backend Setup Guide

## Initial Setup

### 1. Environment Configuration
Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/community-connection
JWT_SECRET=your_super_secret_jwt_key_make_it_strong_and_long
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 2. Sample Data Creation

After starting the backend, you can create sample data using MongoDB Compass or CLI:

#### Create Sample Apartments
```javascript
db.apartments.insertMany([
  {
    name: "Sunset Heights",
    address: "123 Main Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    description: "Modern apartment complex with great amenities",
    amenities: ["gym", "pool", "parking", "wifi"]
  },
  {
    name: "Green Valley",
    address: "456 Oak Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    description: "Eco-friendly residential community",
    amenities: ["garden", "solar panels", "recycling program"]
  }
])
```

#### Sample User Password
- Email: resident1@example.com
- Password: password123

### 3. API Testing

Use Postman or similar tool to test endpoints:

#### Register User
```
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "apartmentId": "apartment_id_here"
}
```

#### Login
```
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:** 
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env matches your MongoDB setup
- Use MongoDB Atlas if running locally is problematic

### Issue: "JWT verification failed"
**Solution:**
- Ensure JWT_SECRET matches between login and request tokens
- Check token is being sent in Authorization header as: `Bearer <token>`

### Issue: "ValidationError: Path `email` is required"
**Solution:**
- Ensure all required fields are being sent in request
- Check request body format matches schema requirements

## Development Tips

### Use Nodemon for Auto-Reload
Backend already configured with nodemon:
```bash
npm run dev
```

### Debug Requests
Add console.log statements in controllers to debug:
```javascript
console.log('Request body:', req.body);
console.log('User:', req.user);
```

### Test Protected Routes
Make sure to include Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Backup & Recovery

### Backup MongoDB
```bash
mongodump --uri "mongodb://localhost:27017/community-connection" --out ./backup
```

### Restore MongoDB
```bash
mongorestore --uri "mongodb://localhost:27017/community-connection" ./backup/community-connection
```

## Performance Optimization

1. Add database indexes for frequently queried fields
2. Implement pagination for list endpoints
3. Use projection to limit returned fields
4. Cache frequently accessed data

## Security Best Practices

1. ✅ Passwords are hashed with bcryptjs
2. ✅ JWT tokens expire after 7 days
3. ✅ Environment variables store sensitive data
4. ✅ Input validation prevents injection attacks
5. ⚠️ TODO: Add rate limiting for auth endpoints
6. ⚠️ TODO: Add HTTPS in production

## Scaling Considerations

- Consider using MongoDB Atlas for production
- Implement database connection pooling
- Add caching layer (Redis)
- Use load balancing for multiple servers
- Implement queue system for background jobs
