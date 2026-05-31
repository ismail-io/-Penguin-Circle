import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import GoogleOnboarding from './pages/GoogleOnboarding';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminPanel from './pages/AdminPanel';
import './App.css';

/* ── Admin-only route ── */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && (user?.role === 'admin' || user?.role === 'superadmin')
    ? children
    : <Navigate to="/dashboard" replace />;
};

/* ── Full-screen loading spinner (shown while JWT is being validated) ── */
const AppLoader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#ffffff', flexDirection: 'column', gap: 16,
  }}>
    <div style={{
      width: 44, height: 44,
      border: '3px solid rgba(74,173,229,0.2)',
      borderTopColor: '#4AADE5',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: 'rgba(55,65,81,0.6)', fontSize: 14 }}>Loading…</span>
  </div>
);

/* ── Main app content ── */
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* Show spinner while checking stored JWT */
  if (loading) return <AppLoader />;

  return (
    <Routes>

      {/* ══════════════════════════════════════
          UNAUTHENTICATED ROUTES
          Landing page with login modal overlay
      ══════════════════════════════════════ */}
      <Route
        path="/login"
        element={isAuthenticated
          ? <Navigate to="/dashboard" replace />
          : <LandingPage initialModal="login" />
        }
      />
      <Route
        path="/register"
        element={isAuthenticated
          ? <Navigate to="/dashboard" replace />
          : <LandingPage initialModal="register" />
        }
      />
      <Route path="/google-onboarding" element={<GoogleOnboarding />} />

      {/* ══════════════════════════════════════
          ROOT — smart redirect
          Authenticated  → /dashboard
          Not auth       → Landing page
      ══════════════════════════════════════ */}
      <Route
        path="/"
        element={isAuthenticated
          ? <Navigate to="/dashboard" replace />
          : <LandingPage initialModal={null} />
        }
      />

      {/* ══════════════════════════════════════
          DASHBOARD SHELL
          Works for both authenticated + guest
          (guest sees sample data)
      ══════════════════════════════════════ */}
      <Route path="*" element={
        <div className="app-layout">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(v => !v)}
          />
          <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="app-content">
              <Routes>
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/events"      element={<Events />} />
                <Route path="/resources"   element={<Resources />} />
                <Route path="/community"   element={<Community />} />
                <Route path="/profile"     element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
                <Route path="/admin"       element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="/admin-panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="*"            element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      } />

    </Routes>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
