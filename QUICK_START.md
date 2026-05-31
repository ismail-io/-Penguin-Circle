# Quick Start Guide

## 🚀 Start the Platform in 5 Minutes

### Prerequisites
- Node.js installed
- MongoDB running locally OR MongoDB Atlas account
- npm or yarn

### Step 1: Start Backend (Terminal 1)

```bash
cd backend

# Install dependencies (first time only)
npm install

# Create .env file
echo MONGODB_URI=mongodb://localhost:27017/community-connection > .env
echo JWT_SECRET=your_secret_key_here >> .env
echo JWT_EXPIRE=7d >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env

# Start backend
npm run dev
```

✅ Backend running on http://localhost:5000

### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend
npm start
```

✅ Frontend running on http://localhost:3000

### Step 3: Create Test Account

Go to http://localhost:3000 and register with:

- **Name**: Your Name
- **Email**: yourname@example.com
- **Password**: password123
- **Apartment ID**: 123456 (any ID, as long as it matches for same apartment)

### Step 4: Explore the Platform! 🎉

Once logged in, you can:
- ✅ View dashboard with events and resources
- ✅ Create and join community events
- ✅ Share resources with neighbors
- ✅ Request resources from others
- ✅ View community members
- ✅ Update your profile

---

## 📋 Default Test User Roles

### User 1 - Resident
```
Email: resident1@example.com
Password: password123
Role: Resident
```

### User 2 - Admin
```
Email: admin1@example.com
Password: password123
Role: Admin (can approve resource requests)
```

### User 3 - SuperAdmin
```
Email: superadmin@example.com
Password: password123
Role: SuperAdmin (full access)
```

---

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/community-connection

# JWT Settings
JWT_SECRET=your_very_secret_key_make_it_long_and_random
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
```

### Using MongoDB Atlas (Cloud)

If you don't have MongoDB locally installed:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in .env:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/community-connection?retryWrites=true&w=majority
```

---

## 🌐 API Testing

### Test Backend with Curl

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","apartmentId":"123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📁 Important Files

### Backend
- `server.js` - Main server file
- `config/db.js` - Database connection
- `models/` - Database schemas
- `routes/` - API endpoints
- `controllers/` - Business logic
- `middleware/` - Auth & validation

### Frontend
- `App.js` - Main application
- `pages/` - All pages (Home, Dashboard, Events, etc.)
- `components/` - Reusable components (Navbar, Sidebar)
- `context/AuthContext.js` - Authentication state
- `utils/api.js` - API client configuration

---

## ✅ Verification Checklist

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "webpack compiled successfully"
- [ ] Browser opens to http://localhost:3000
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Dashboard displays
- [ ] Can create event
- [ ] Can add resource
- [ ] Can view members

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process and restart
npm run dev
```

### Frontend won't compile
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start again
npm start
```

### MongoDB connection failed
```bash
# Start MongoDB (Mac)
brew services start mongodb-community

# Start MongoDB (Windows)
# Use MongoDB installer or Atlas cloud

# Test connection
mongosh mongodb://localhost:27017
```

### CORS errors
- Ensure backend CORS is enabled (it is by default)
- Check frontend URL matches backend allowed origins
- Restart both servers

---

## 📚 Next Steps

1. Read [README.md](./README.md) for complete documentation
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. See [backend/SETUP.md](./backend/SETUP.md) for backend details
4. See [frontend/SETUP.md](./frontend/SETUP.md) for frontend details

---

## 🎯 Feature Usage Examples

### Create an Event
1. Go to Events page
2. Click "Create Event"
3. Fill in details (title, description, date, location)
4. Click "Create Event"
5. Other residents can view and join

### Share a Resource
1. Go to Resources page
2. Click "Add Resource"
3. Enter resource details (name, category, condition)
4. Click "Add Resource"
5. Residents can request your resource

### Request a Resource
1. Find resource you want on Resources page
2. Click "Request"
3. Admin will review and approve/reject
4. Check Profile for request status

---

## 📞 Support & Contributing

- Report issues in GitHub Issues
- Check existing documentation
- Review code comments for implementation details

---

**Happy Building! 🚀**

Questions? Check the comprehensive README.md and documentation files!
