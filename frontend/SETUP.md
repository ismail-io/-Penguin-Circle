# Community Connection Platform - Frontend Setup Guide

## Initial Setup

### 1. Environment Configuration
Create a `.env` file in the frontend directory (optional):

```
REACT_APP_API_URL=http://localhost:5000
```

If not specified, it will default to `http://localhost:5000`

### 2. API Base URL Configuration

The API client is configured in `src/utils/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

To change the API URL for different environments:

**Development:**
```
REACT_APP_API_URL=http://localhost:5000
```

**Production:**
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### 3. Authentication Flow

The app uses JWT for authentication:

1. User registers/logs in
2. Token is stored in localStorage
3. Token is sent with every API request
4. Protected routes check token in localStorage

### 4. Component Structure

```
App.js (Main Router)
├── AuthProvider (Auth Context)
├── Navbar (Top Navigation)
├── Sidebar (Side Menu)
└── Pages
    ├── Home (Landing)
    ├── Login
    ├── Register
    ├── Dashboard
    ├── Events
    ├── Resources
    ├── Community
    ├── Profile
    └── Admin
```

## Development Tips

### Hot Reload
React automatically reloads on file changes during development.

### Local Storage Debugging
Check authentication state in browser console:
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

### API Call Debugging
Check network requests in browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Make API calls to see requests/responses

### Debug Auth Context
Add logging to `src/context/AuthContext.js`:
```javascript
console.log('User logged in:', user);
console.log('Token:', token);
```

## Common Issues & Solutions

### Issue: "401 Unauthorized"
**Solution:**
- Token may have expired, login again
- Check Authorization header is sent correctly
- Verify token in localStorage

### Issue: "404 Not Found"
**Solution:**
- Ensure backend is running on correct port
- Check REACT_APP_API_URL matches backend URL
- Verify API route exists on backend

### Issue: "CORS Error"
**Solution:**
- Ensure backend has CORS enabled
- Check frontend URL is allowed in backend CORS config
- Restart backend server

### Issue: "Cannot find module"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Customization

### Change Theme Colors

Edit CSS variables in component `.css` files:

```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--text-color: #333;
--background-color: #f5f5f5;
```

Primary color used: `#667eea` (purple-blue)

### Add New Page

1. Create page component in `src/pages/`
2. Add route in `App.js`
3. Add navigation link in `Sidebar.js`
4. Create corresponding CSS file

Example:
```javascript
// src/pages/Notifications.js
import React from 'react';
import './Notifications.css';

const Notifications = () => {
  return <div className="notifications">...</div>;
};

export default Notifications;
```

### Add New Component

Create in `src/components/`:

```javascript
// src/components/NotificationBell.js
import React from 'react';
import { Bell } from 'lucide-react';
import './NotificationBell.css';

const NotificationBell = () => {
  return <Bell size={20} />;
};

export default NotificationBell;
```

## Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder

### Serve Production Build Locally
```bash
npm install -g serve
serve -s build
```

## Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Token is stored in localStorage
- [ ] Dashboard displays correctly
- [ ] Can create events
- [ ] Can view resources
- [ ] Can request resources
- [ ] Can view community members
- [ ] Admin panel is protected
- [ ] Logout clears token

### Test Different Roles

Create test users with different roles:
- Resident: Standard user access
- Admin: Can manage resources and approve requests
- SuperAdmin: Full system access

## Performance Optimization

1. ✅ Lazy load components with React.lazy()
2. ✅ Memoize components with React.memo()
3. ✅ Use useCallback for expensive functions
4. ✅ Implement pagination for lists
5. ⚠️ TODO: Add image optimization
6. ⚠️ TODO: Implement service workers for PWA

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

Features implemented:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance
- Focus management

## Dependencies

- react@^18.2.0 - UI library
- react-router-dom@^6.10.0 - Routing
- axios@^1.3.4 - HTTP client
- lucide-react@^0.263.1 - Icons

## Additional Resources

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Lucide Icons](https://lucide.dev)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
