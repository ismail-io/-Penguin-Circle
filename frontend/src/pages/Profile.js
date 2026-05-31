import React, { useState, useEffect } from 'react';
import { usersAPI, requestsAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Profile.css';

/* ── Icons ── */
const IcUser     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcMail     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IcId       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
const IcGlobe    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IcShield   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcPhone    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcEdit     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcCheck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcClock    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const getInitials = name => name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
const AVATAR_COLORS = [
  'linear-gradient(135deg,#4AADE5,#F5841F)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
];
const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0)||0) % AVATAR_COLORS.length];

const Profile = () => {
  const { user, login, token } = useAuth();
  const [profileData, setProfileData] = useState({ name: user?.name||'', phone: '', bio: '', avatar: '' });
  const [requests,    setRequests]    = useState([]);
  const [editMode,    setEditMode]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState({ type:'', text:'' });

  const roleLabel = { resident:'Member', admin:'Community Admin', superadmin:'Super Admin' }[user?.role] || 'Member';
  const joinDate  = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })
    : 'N/A';
  const communityName = user?.communityName || '—';
  const communityId   = user?.communityId   || user?.apartmentId || '—';
  const communityType = user?.communityType || '—';
  const userId        = user?.id?.slice(-8)?.toUpperCase() || '—';
  const avatar        = user?.avatar || user?.profile?.avatar || profileData.avatar;

  useEffect(() => { fetchUserData(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserData = async () => {
    try {
      const [userRes, reqRes] = await Promise.allSettled([
        usersAPI.getById(user?.id),
        requestsAPI.getAll(),
      ]);
      if (userRes.status === 'fulfilled') {
        const d = userRes.value.data?.data || userRes.value.data;
        setProfileData({
          name:   d?.name   || user?.name || '',
          phone:  d?.phone  || '',
          bio:    d?.profile?.bio    || '',
          avatar: d?.profile?.avatar || '',
        });
      }
      if (reqRes.status === 'fulfilled') {
        setRequests(reqRes.value.data?.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProfileData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type:'', text:'' });
    try {
      await usersAPI.updateProfile(profileData);
      // Update local auth context name
      login({ ...user, name: profileData.name }, token);
      setMsg({ type:'success', text:'Profile updated successfully!' });
      setEditMode(false);
      fetchUserData();
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Update failed. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const statusConfig = {
    approved: { icon: <IcCheck />, label: 'Approved', cls: 'approved' },
    rejected: { icon: <IcX />,     label: 'Rejected', cls: 'rejected' },
    pending:  { icon: <IcClock />, label: 'Pending',  cls: 'pending'  },
  };

  if (loading) {
    return (
      <div className="pf-loading">
        <div className="pf-spinner" />
        <span>Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="pf-root">
      <div className="pf-inner">

        {/* ── Page Header ── */}
        <div className="pf-page-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information and community details</p>
          </div>
          <button
            className={`pf-edit-btn ${editMode ? 'cancel' : ''}`}
            onClick={() => { setEditMode(v => !v); setMsg({ type:'', text:'' }); }}
          >
            {editMode ? <><IcX /> Cancel</> : <><IcEdit /> Edit Profile</>}
          </button>
        </div>

        {msg.text && (
          <div className={`pf-msg ${msg.type}`}>
            {msg.type === 'success' ? <IcCheck /> : <IcX />} {msg.text}
          </div>
        )}

        <div className="pf-grid">

          {/* ── Left: Avatar + Identity ── */}
          <div className="pf-col-left">

            {/* Avatar Card */}
            <div className="pf-card pf-avatar-card">
              <div className="pf-avatar-wrap">
                {avatar
                  ? <img src={avatar} alt={user?.name} referrerPolicy="no-referrer" className="pf-avatar-img" />
                  : <div className="pf-avatar-initials" style={{ background: avatarColor(user?.name) }}>
                      {getInitials(user?.name)}
                    </div>
                }
                <div className="pf-avatar-ring" />
              </div>
              <h2 className="pf-avatar-name">{user?.name || '—'}</h2>
              <span className="pf-role-badge">{roleLabel}</span>
              <div className="pf-avatar-community">
                <span>🏘️</span> {communityName}
              </div>
            </div>

            {/* Community Info Card */}
            <div className="pf-card">
              <div className="pf-card-title">Community Details</div>
              <div className="pf-info-list">
                <div className="pf-info-row">
                  <span className="pf-info-icon"><IcGlobe /></span>
                  <div>
                    <div className="pf-info-label">Community Name</div>
                    <div className="pf-info-value">{communityName}</div>
                  </div>
                </div>
                <div className="pf-info-row">
                  <span className="pf-info-icon"><IcId /></span>
                  <div>
                    <div className="pf-info-label">Community ID</div>
                    <div className="pf-info-value mono">{communityId}</div>
                  </div>
                </div>
                <div className="pf-info-row">
                  <span className="pf-info-icon"><IcShield /></span>
                  <div>
                    <div className="pf-info-label">Community Type</div>
                    <div className="pf-info-value">{communityType}</div>
                  </div>
                </div>
                <div className="pf-info-row">
                  <span className="pf-info-icon"><IcCalendar /></span>
                  <div>
                    <div className="pf-info-label">Member Since</div>
                    <div className="pf-info-value">{joinDate}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right: Personal Info + Requests ── */}
          <div className="pf-col-right">

            {/* Personal Info Card */}
            <div className="pf-card">
              <div className="pf-card-title">Personal Information</div>

              {!editMode ? (
                <div className="pf-info-grid">
                  <div className="pf-info-field">
                    <div className="pf-info-field-label"><IcUser /> Full Name</div>
                    <div className="pf-info-field-value">{profileData.name || '—'}</div>
                  </div>
                  <div className="pf-info-field">
                    <div className="pf-info-field-label"><IcMail /> Email</div>
                    <div className="pf-info-field-value">{user?.email || '—'}</div>
                  </div>
                  <div className="pf-info-field">
                    <div className="pf-info-field-label"><IcId /> User ID</div>
                    <div className="pf-info-field-value mono">{userId}</div>
                  </div>
                  <div className="pf-info-field">
                    <div className="pf-info-field-label"><IcShield /> Role</div>
                    <div className="pf-info-field-value">
                      <span className="pf-role-inline">{roleLabel}</span>
                    </div>
                  </div>
                  <div className="pf-info-field">
                    <div className="pf-info-field-label"><IcPhone /> Phone</div>
                    <div className="pf-info-field-value">{profileData.phone || 'Not set'}</div>
                  </div>
                  <div className="pf-info-field pf-full-width">
                    <div className="pf-info-field-label">Bio</div>
                    <div className="pf-info-field-value">{profileData.bio || 'No bio added yet.'}</div>
                  </div>
                </div>
              ) : (
                <form className="pf-form" onSubmit={handleSubmit}>
                  <div className="pf-form-row">
                    <div className="pf-form-field">
                      <label>Full Name</label>
                      <div className="pf-input-wrap">
                        <span className="pf-input-icon"><IcUser /></span>
                        <input type="text" name="name" value={profileData.name} onChange={handleChange} placeholder="Your full name" />
                      </div>
                    </div>
                    <div className="pf-form-field">
                      <label>Phone Number</label>
                      <div className="pf-input-wrap">
                        <span className="pf-input-icon"><IcPhone /></span>
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                      </div>
                    </div>
                  </div>
                  <div className="pf-form-field">
                    <label>Bio</label>
                    <textarea name="bio" value={profileData.bio} onChange={handleChange} placeholder="Tell your community about yourself…" rows="4" />
                  </div>
                  <div className="pf-form-actions">
                    <button type="submit" className="pf-save-btn" disabled={saving}>
                      {saving ? <><span className="pf-spinner-sm" /> Saving…</> : <><IcCheck /> Save Changes</>}
                    </button>
                    <button type="button" className="pf-cancel-btn" onClick={() => setEditMode(false)}>
                      <IcX /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Resource Requests Card */}
            <div className="pf-card">
              <div className="pf-card-title">My Resource Requests</div>
              {requests.length > 0 ? (
                <div className="pf-requests">
                  {requests.map(req => {
                    const s = statusConfig[req.status] || statusConfig.pending;
                    return (
                      <div key={req._id} className="pf-request-item">
                        <div className="pf-request-info">
                          <div className="pf-request-name">{req.resourceId?.name || 'Resource'}</div>
                          <div className="pf-request-msg">{req.requestMessage || 'No message'}</div>
                        </div>
                        <span className={`pf-status-badge ${s.cls}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pf-empty">
                  <span>📦</span>
                  <p>No resource requests yet.</p>
                  <small>Browse resources and make a request to see it here.</small>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
