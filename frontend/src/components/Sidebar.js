import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

/* ── Icons ── */
const IC = {
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Feed:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Members:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Events:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Resources: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Announce:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Chat:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></svg>,
  Market:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Settings:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Admin:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Logout:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevLeft:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ── Nav items config ── */
const NAV_ITEMS = [
  { icon: 'Dashboard', label: 'Dashboard',      path: '/dashboard'  },
  { icon: 'Feed',      label: 'Community Feed', path: '/community',  badge: '3' },
  { icon: 'Members',   label: 'Members',        path: '/community'  },
  { icon: 'Events',    label: 'Events',         path: '/events'     },
  { icon: 'Resources', label: 'Resources',      path: '/resources'  },
  { icon: 'Announce',  label: 'Announcements',  path: '/dashboard'  },
  { icon: 'Chat',      label: 'Community Chat', path: '/community',  badge: '5' },
  { icon: 'Market',    label: 'Marketplace',    path: '/resources'  },
];

/* ══════════════════════════════════════════
   SIDEBAR COMPONENT
══════════════════════════════════════════ */
const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isDemo    = !isAuthenticated;

  const isMobile = () => window.innerWidth <= 900;

  const handleNav = (path) => {
    navigate(path);
    if (isMobile()) onClose();
  };

  const handleLogout = () => {
    logout();
    window.scrollTo(0, 0);
    navigate('/login');
  };

  const avatar   = user?.avatar || user?.profile?.avatar;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  /* Active check — exact for dashboard, startsWith for others */
  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay — mobile only, only when open */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>

        {/* ── Collapse toggle (desktop only) ── */}
        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <IC.ChevRight /> : <IC.ChevLeft />}
        </button>

        {/* ── Brand ── */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🐧</div>
          <div className="sidebar-brand-text">
            <h2>Penguin</h2>
            <p>Circle Platform</p>
          </div>
        </div>

        {/* ── User mini card — only show when authenticated ── */}
        {!isDemo && (
          <div className="sidebar-user" title={collapsed ? user?.name : ''}>
            <div className="sidebar-user-avatar">
              {avatar
                ? <img src={avatar} alt={user?.name} referrerPolicy="no-referrer" />
                : initials
              }
            </div>
            <div className="sidebar-user-info">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.communityName || user?.communityType || 'Community Member'}</p>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="sidebar-nav" aria-label="Main navigation">

          {NAV_ITEMS.map(item => {
            const Icon   = IC[item.icon];
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
                data-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <span className="nav-icon"><Icon /></span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}

          {/* Admin section */}
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <>
              <div className="sidebar-divider" />
              <div className="sidebar-section-label">Admin</div>
              <button
                className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => handleNav('/admin')}
                data-label="Admin Panel"
              >
                <span className="nav-icon"><IC.Admin /></span>
                <span className="nav-label">Admin Panel</span>
              </button>
            </>
          )}

          {/* Account section */}
          <div className="sidebar-divider" />
          <div className="sidebar-section-label">Account</div>

          <button
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => handleNav('/profile')}
            data-label="Settings"
          >
            <span className="nav-icon"><IC.Settings /></span>
            <span className="nav-label">Settings</span>
          </button>

        </nav>

        {/* ── Logout ── */}
        <div className="sidebar-bottom">
          {isDemo ? (
            <button className="logout-btn login-btn" onClick={() => navigate('/login')} data-label="Login">
              <span className="nav-icon"><IC.Logout /></span>
              <span className="nav-label">Login / Register</span>
            </button>
          ) : (
            <button className="logout-btn" onClick={handleLogout} data-label="Logout">
              <span className="nav-icon"><IC.Logout /></span>
              <span className="nav-label">Logout</span>
            </button>
          )}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
