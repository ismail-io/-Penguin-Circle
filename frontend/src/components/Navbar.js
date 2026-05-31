import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

/* ── Icons ── */
const IcMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcSearch  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcBell    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcMsg     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcUser    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcEdit    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
// eslint-disable-next-line no-unused-vars
const IcLock    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcGear    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>;
const IcLogout  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcShield  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcCalendar= () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    window.scrollTo(0, 0);
    navigate('/');
  };

  const avatar   = user?.avatar || user?.profile?.avatar;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '?';
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  const roleLabel = {
    resident:   'Member',
    admin:      'Community Admin',
    superadmin: 'Super Admin',
  }[user?.role] || (user ? user.role : 'Guest');

  return (
    <header className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <IcMenu />
        </button>
        <div className="navbar-logo" onClick={() => navigate('/dashboard')} style={{ cursor:'pointer' }}>
          <span className="navbar-logo-icon">🐧</span>
          <span className="navbar-logo-text">Penguin <span>Circle</span></span>
        </div>
      </div>

      {/* Centre nav links — only when NOT authenticated */}
      {!isAuthenticated && (
        <nav className="navbar-public-links">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/dashboard')}>Features</button>
          <button onClick={() => navigate('/community')}>Communities</button>
          <button onClick={() => navigate('/dashboard')}>About</button>
          <button onClick={() => navigate('/dashboard')}>Contact</button>
        </nav>
      )}

      {/* Search — only when authenticated */}
      {isAuthenticated && (
        <div className="navbar-search">
          <span className="navbar-search-icon"><IcSearch /></span>
          <input type="text" placeholder="Search members, events, resources…" />
        </div>
      )}

      {/* Right */}
      <div className="navbar-right">
        {!isAuthenticated ? (
          /* ── Demo mode: show Login / Register ── */
          <>
            <button className="nb-auth-btn ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="nb-auth-btn primary" onClick={() => navigate('/register')}>Sign Up</button>
          </>
        ) : (
          /* ── Authenticated: show icons + profile ── */
          <>
            <button className="nb-icon-btn" aria-label="Messages">
              <IcMsg />
              <span className="nb-badge" />
            </button>
            <button className="nb-icon-btn" aria-label="Notifications">
              <IcBell />
              <span className="nb-badge" />
            </button>

            {/* Profile button */}
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button
                className={`nb-profile-btn ${dropOpen ? 'open' : ''}`}
                onClick={() => setDropOpen(v => !v)}
                aria-label="Profile menu"
              >
                <div className="nb-avatar">
                  {avatar ? <img src={avatar} alt={user?.name} referrerPolicy="no-referrer" /> : initials}
                </div>
                <span className="nb-profile-name">{user?.name?.split(' ')[0] || 'User'}</span>
                <span className="nb-chevron"><IcChevron /></span>
              </button>

              {/* ── Profile Dropdown Panel ── */}
              {dropOpen && (
                <div className="nb-dropdown">
                  <div className="nb-drop-header">
                    <div className="nb-drop-avatar">
                      {avatar ? <img src={avatar} alt={user?.name} referrerPolicy="no-referrer" /> : initials}
                    </div>
                    <div>
                      <div className="nb-drop-name">{user?.name || 'User'}</div>
                      <div className="nb-drop-email">{user?.email || '—'}</div>
                      <span className="nb-drop-role-badge">⭐ {roleLabel}</span>
                    </div>
                  </div>

                  <div className="nb-drop-info">
                    <div className="nb-info-item">
                      <div className="nb-info-label">User ID</div>
                      <div className="nb-info-value">{user?.id?.slice(-8)?.toUpperCase() || 'N/A'}</div>
                    </div>
                    <div className="nb-info-item">
                      <div className="nb-info-label">Community</div>
                      <div className="nb-info-value">{user?.communityName || 'N/A'}</div>
                    </div>
                    <div className="nb-info-item">
                      <div className="nb-info-label">Community ID</div>
                      <div className="nb-info-value">{user?.communityId || user?.apartmentId || 'N/A'}</div>
                    </div>
                    <div className="nb-info-item">
                      <div className="nb-info-label">Type</div>
                      <div className="nb-info-value">{user?.communityType || 'Apartment'}</div>
                    </div>
                    <div className="nb-info-item" style={{ gridColumn:'1 / -1' }}>
                      <div className="nb-info-label" style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <IcCalendar /> Joined
                      </div>
                      <div className="nb-info-value">{joinDate}</div>
                    </div>
                  </div>

                  <div className="nb-drop-actions">
                    <button className="nb-drop-action" onClick={() => { navigate('/profile'); setDropOpen(false); }}>
                      <IcUser /> View Profile
                    </button>
                    <button className="nb-drop-action" onClick={() => { navigate('/profile'); setDropOpen(false); }}>
                      <IcEdit /> Edit Profile
                    </button>
                    <button className="nb-drop-action" onClick={() => setDropOpen(false)}>
                      <IcGear /> Settings
                    </button>
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <button className="nb-drop-action admin" onClick={() => { navigate('/admin'); setDropOpen(false); }}>
                        <IcShield /> Admin Panel
                      </button>
                    )}
                    <div className="nb-drop-divider" />
                    <button className="nb-drop-action danger" onClick={handleLogout}>
                      <IcLogout /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
