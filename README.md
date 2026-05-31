# Community Connection Platform

A full-stack, modern community platform designed for apartment residents to connect, share resources, join local events, and communicate seamlessly with administrators.

https://ismail-io.github.io/-Penguin-Circle/

---

## 💡 Why Use This Website?

Living in modern apartments or gated communities often leads to disconnected residents, underutilized resources, and fragmented communication. The **Community Connection Platform** solves these challenges by providing:

1. **Shared Economy (Resource Sharing)**: Instead of buying expensive tools, books, or equipment that are rarely used, residents can list items for share or request to borrow them from neighbors.
2. **Centralized Events Calendar**: Stay updated with community get-togethers, meetings, and recreational events, encouraging active resident participation.
3. **Structured Admin Workflows**: Requests to borrow high-value items or host major community events pass through an Admin approval/rejection loop to ensure safety and order.
4. **Instant Digital Directory**: Easily look up neighbors by name or email, fostering friendly and collaborative community relations.
5. **Secure Authentication & Onboarding**: Seamless integration with Google OAuth and standard authentication ensures only verified apartment members can join.

---

## ⚙️ Core Tools & Integrations Used

This project utilizes modern software engineering tools and platforms:

* **React.js (Frontend)**: For building a fast, interactive, and responsive single-page user interface.
* **Node.js & Express (Backend API)**: Providing a robust, high-performance RESTful API structure.
* **MongoDB Atlas (Database)**: Cloud-hosted NoSQL database storing users, events, and resource request logs.
* **Google Cloud Console (OAuth API)**: Enables single-sign-on (SSO) authentication for residents.
* **JWT (JSON Web Tokens)**: Used for secure, stateless session tracking and role-based client routing.
* **Bcrypt.js**: Secures user passwords by hashing them before storage.
* **Nodemon**: Automatically restarts the Node application during local development on file changes.

## 📖 How to Use the Platform: A Step-by-Step Example

Here is a typical resident workflow on the platform:

1. **Onboarding**:
   * Visit the landing page and click **Login** or **Register**.
   * You can sign up using a traditional email/password form or click **Sign in with Google** for a 1-click login.
   * If signing up via Google, complete the one-time **Google Onboarding Form** to select your role (Resident/Admin) and enter your community name/apartment ID.
2. **Browsing the Dashboard**:
   * View upcoming community activities, active shared resources, and popular events.
3. **Sharing/Borrowing a Resource**:
   * Go to **Resources** and list a tool (e.g., a ladder or drill) you're willing to share.
   * To borrow an item, click **Request Resource** on a neighbor's listed item, type a short message, and submit.
   * The owner or Admin will receive the request and can approve/reject it.
4. **Joining an Event**:
   * Go to **Events**, browse listed social gatherings, and click **Join Event** to secure a spot.

---

## 🎯 Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Three user roles: Resident, Admin, SuperAdmin
- Protected routes based on user roles

### Dashboard
- Display upcoming events
- Display available resources
- Display recent community activities

### Event Management
- Create, edit, and delete events
- Join/leave events
- Event details: title, description, date, location, created by
- Event categories and capacity management

### Resource Sharing
- Add, update, and delete resources
- Resource categories: tools, books, equipment, parking, other
- Availability status tracking
- Request resources from other residents

### Resource Request Management
- Submit resource requests
- Admin approval/rejection workflow
- Request tracking and history

### Community Features
- View all apartment residents
- Search residents by name or email
- View resident profiles
- Community member management

### Admin Panel
- Manage resources and events
- Approve/reject resource requests
- Manage residents
- View community statistics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - UI icons
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
community-connection-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Apartment.js          # Apartment schema
│   │   ├── Event.js              # Event schema
│   │   ├── Resource.js           # Resource schema
│   │   └── ResourceRequest.js    # Resource request schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── events.js            # Event routes
│   │   ├── resources.js         # Resource routes
│   │   ├── requests.js          # Request routes
│   │   └── users.js             # User routes
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── eventController.js   # Event logic
│   │   ├── resourceController.js # Resource logic
│   │   ├── requestController.js  # Request logic
│   │   └── userController.js    # User logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Input validation
│   ├── server.js                # Main server file
│   ├── package.json             # Dependencies
│   └── .env.example             # Environment variables example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js         # Navigation bar
    │   │   ├── Navbar.css
    │   │   ├── Sidebar.js        # Sidebar menu
    │   │   └── Sidebar.css
    │   ├── pages/
    │   │   ├── Home.js           # Landing page
    │   │   ├── Home.css
    │   │   ├── Login.js          # Login page
    │   │   ├── Register.js       # Registration page
    │   │   ├── Auth.css
    │   │   ├── Dashboard.js      # Dashboard
    │   │   ├── Dashboard.css
    │   │   ├── Events.js         # Events page
    │   │   ├── Events.css
    │   │   ├── Resources.js      # Resources page
    │   │   ├── Resources.css
    │   │   ├── Community.js      # Community members
    │   │   ├── Community.css
    │   │   ├── Profile.js        # User profile
    │   │   ├── Profile.css
    │   │   ├── Admin.js          # Admin panel
    │   │   └── Admin.css
    │   ├── context/
    │   │   └── AuthContext.js    # Auth state management
    │   ├── hooks/
    │   │   └── useAuth.js        # Custom auth hook
    │   ├── utils/
    │   │   └── api.js            # API calls
    │   ├── App.js                # Main App component
    │   ├── App.css
    │   └── index.js              # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Update .env with your credentials**
```
MONGODB_URI=mongodb://localhost:27017/community-connection
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

5. **Start MongoDB**
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
```

6. **Run the backend server**
```bash
npm start

# For development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file (optional)**
```
REACT_APP_API_URL=http://localhost:5000
```

4. **Start the frontend server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Resource Requests
- `GET /api/requests` - Get user's requests
- `POST /api/requests` - Create request
- `POST /api/requests/:id/approve` - Approve request (Admin)
- `POST /api/requests/:id/reject` - Reject request (Admin)

### Users
- `GET /api/users` - Get community members
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile/update` - Update profile
- `GET /api/users/all` - Get all users (SuperAdmin)

## 🔐 User Roles

### Resident
- View events and resources
- Create and manage own resources
- Join events
- Request resources
- View community members

### Admin
- All Resident permissions
- Create and manage events
- Approve/reject resource requests
- Manage resources
- Manage residents

### SuperAdmin
- All Admin permissions
- Manage all apartments
- Manage all users
- System-wide administration

## 📝 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (resident, admin, superadmin),
  apartmentId: ObjectId,
  phone: String,
  profile: {
    bio: String,
    avatar: String
  },
  createdAt: Date
}
```

### Event
```javascript
{
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  createdBy: ObjectId (User),
  apartmentId: ObjectId,
  attendees: [ObjectId],
  capacity: Number,
  category: String,
  createdAt: Date
}
```

### Resource
```javascript
{
  name: String,
  description: String,
  category: String,
  owner: ObjectId (User),
  apartmentId: ObjectId,
  availability: Boolean,
  quantity: Number,
  condition: String,
  createdAt: Date
}
```

### ResourceRequest
```javascript
{
  resourceId: ObjectId,
  requestedBy: ObjectId (User),
  status: String (pending, approved, rejected),
  requestMessage: String,
  approvedBy: ObjectId (User),
  rejectionReason: String,
  requestDate: Date,
  approvalDate: Date,
  createdAt: Date
}
```

## 🎨 UI/UX Features

- Modern gradient design with purple/blue theme
- Responsive layout for mobile and desktop
- Smooth transitions and animations
- Intuitive navigation with sidebar menu
- Card-based layouts for content organization
- Status badges for event and resource availability
- Role-based menu visibility
- Clean forms with validation feedback

## 🔑 Key Features Implementation

### JWT Authentication
- Tokens are generated on login
- Tokens are stored in localStorage
- Tokens are sent with every API request in Authorization header
- Protected routes redirect unauthenticated users to login

### Password Security
- Passwords are hashed with bcryptjs before storage
- Passwords are never returned in API responses
- Password fields are selected explicitly when needed

### Role-Based Access Control
- Middleware validates user role for protected endpoints
- Frontend hides admin features from non-admin users
- Routes are protected based on user role

### Resource Request Workflow
1. User requests a resource
2. Request appears in admin panel as pending
3. Admin approves or rejects the request
4. User gets notification of request status

## 🚨 Error Handling

- Validation errors return 400 status with error messages
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## 📦 Building for Production

### Backend
```bash
# Set environment to production
NODE_ENV=production

# Run server
npm start
```

### Frontend
```bash
npm run build

# Output will be in build/ folder
```

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB credentials

### CORS Issues
- Backend should have CORS enabled
- Frontend API URL should match backend URL

### Token Issues
- Clear localStorage and login again
- Check JWT_SECRET matches between sessions
- Verify token expiration settings

## 📞 Support

For support, email support@communitycconnection.com or open an issue in the repository.

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net/)

---

Happy Building! 🎉
