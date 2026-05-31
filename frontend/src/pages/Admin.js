import React, { useState, useEffect } from 'react';
import { requestsAPI, usersAPI, resourcesAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Admin.css';

/* ── Icons ── */
const IcCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcX       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcShield  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcUsers   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcBox     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const IcClipboard=()=> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const IcRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

const getInitials = name => name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
const AVATAR_COLORS = [
  'linear-gradient(135deg,#4AADE5,#F5841F)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
];
const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0)||0) % AVATAR_COLORS.length];

const Admin = () => {
  const { user } = useAuth(); // eslint-disable-line no-unused-vars
  const [requests,   setRequests]   = useState([]);
  const [resources,  setResources]  = useState([]);
  const [users,      setUsers]      = useState([]);
  const [activeTab,  setActiveTab]  = useState('requests');
  const [loading,    setLoading]    = useState(true);
  const [actionMsg,  setActionMsg]  = useState({ type:'', text:'' });
  const [rejectId,   setRejectId]   = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => { fetchData(); }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true);
    setActionMsg({ type:'', text:'' });
    try {
      if (activeTab === 'requests') {
        const res = await requestsAPI.getAll();
        setRequests(res.data?.data || []);
      } else if (activeTab === 'resources') {
        const res = await resourcesAPI.getAll();
        setResources(res.data?.data || []);
      } else if (activeTab === 'users') {
        const res = await usersAPI.getAll();
        setUsers(res.data?.data || []);
      }
    } catch (e) {
      setActionMsg({ type:'error', text:'Failed to load data.' });
    } finally { setLoading(false); }
  };

  const handleApprove = async id => {
    try {
      await requestsAPI.approve(id);
      setActionMsg({ type:'success', text:'Request approved successfully!' });
      fetchData();
    } catch (e) {
      setActionMsg({ type:'error', text: e.response?.data?.message || 'Approval failed.' });
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await requestsAPI.reject(rejectId, { rejectionReason: rejectNote || 'Rejected by admin.' });
      setActionMsg({ type:'success', text:'Request rejected.' });
      setRejectId(null);
      setRejectNote('');
      fetchData();
    } catch (e) {
      setActionMsg({ type:'error', text: e.response?.data?.message || 'Rejection failed.' });
    }
  };

  const pendingCount   = requests.filter(r => r.status === 'pending').length;
  const approvedCount  = requests.filter(r => r.status === 'approved').length;
  const rejectedCount  = requests.filter(r => r.status === 'rejected').length;

  const TABS = [
    { id:'requests',  label:'Requests',  icon:<IcClipboard />, badge: pendingCount || null },
    { id:'resources', label:'Resources', icon:<IcBox />        },
    { id:'users',     label:'Users',     icon:<IcUsers />      },
  ];

  return (
    <div className="ap-root">

      {/* ── Header ── */}
      <div className="ap-header">
        <div className="ap-header-left">
          <div className="ap-header-icon"><IcShield /></div>
          <div>
            <h1>Admin Panel</h1>
            <p>Manage requests, resources, and community members</p>
          </div>
        </div>
        <button className="ap-refresh-btn" onClick={fetchData}>
          <IcRefresh /> Refresh
        </button>
      </div>

      {/* ── Stats (requests tab) ── */}
      {activeTab === 'requests' && (
        <div className="ap-stats">
          <div className="ap-stat" style={{ '--c':'#fde047' }}>
            <span className="ap-stat-val">{pendingCount}</span>
            <span className="ap-stat-lbl">Pending</span>
          </div>
          <div className="ap-stat" style={{ '--c':'#86efac' }}>
            <span className="ap-stat-val">{approvedCount}</span>
            <span className="ap-stat-lbl">Approved</span>
          </div>
          <div className="ap-stat" style={{ '--c':'#fca5a5' }}>
            <span className="ap-stat-val">{rejectedCount}</span>
            <span className="ap-stat-lbl">Rejected</span>
          </div>
          <div className="ap-stat" style={{ '--c':'#87CEEB' }}>
            <span className="ap-stat-val">{requests.length}</span>
            <span className="ap-stat-lbl">Total</span>
          </div>
        </div>
      )}

      {/* ── Message ── */}
      {actionMsg.text && (
        <div className={`ap-msg ${actionMsg.type}`}>
          {actionMsg.type === 'success' ? <IcCheck /> : <IcX />} {actionMsg.text}
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectId && (
        <div className="ap-modal-overlay" onClick={() => setRejectId(null)}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-title">Reject Request</div>
            <p className="ap-modal-sub">Provide a reason for rejection (optional)</p>
            <textarea
              className="ap-modal-textarea"
              placeholder="e.g. Resource already booked for this period…"
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              rows="3"
            />
            <div className="ap-modal-actions">
              <button className="ap-modal-reject-btn" onClick={handleReject}>
                <IcX /> Confirm Reject
              </button>
              <button className="ap-modal-cancel-btn" onClick={() => { setRejectId(null); setRejectNote(''); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="ap-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`ap-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
            {t.badge ? <span className="ap-tab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="ap-content">
        {loading ? (
          <div className="ap-loading"><div className="ap-spinner" /><span>Loading…</span></div>
        ) : (

          /* ── REQUESTS ── */
          activeTab === 'requests' ? (
            requests.length === 0 ? (
              <div className="ap-empty"><span>📋</span><p>No requests found.</p></div>
            ) : (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Requested By</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req._id}>
                        <td>
                          <div className="ap-cell-primary">{req.resourceId?.name || '—'}</div>
                          <div className="ap-cell-sub">{req.resourceId?.category || ''}</div>
                        </td>
                        <td>
                          <div className="ap-user-cell">
                            <div className="ap-user-avatar" style={{ background: avatarColor(req.requestedBy?.name) }}>
                              {getInitials(req.requestedBy?.name)}
                            </div>
                            <div>
                              <div className="ap-cell-primary">{req.requestedBy?.name || '—'}</div>
                              <div className="ap-cell-sub">{req.requestedBy?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ap-cell-sub">{req.requestMessage || '—'}</div>
                        </td>
                        <td>
                          <div className="ap-cell-sub">
                            {req.requestDate ? new Date(req.requestDate).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                          </div>
                        </td>
                        <td>
                          <span className={`ap-status-badge ${req.status}`}>{req.status}</span>
                        </td>
                        <td>
                          {req.status === 'pending' ? (
                            <div className="ap-action-btns">
                              <button className="ap-approve-btn" onClick={() => handleApprove(req._id)}>
                                <IcCheck /> Approve
                              </button>
                              <button className="ap-reject-btn" onClick={() => setRejectId(req._id)}>
                                <IcX /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="ap-cell-sub">
                              {req.status === 'approved' ? `By ${req.approvedBy?.name || 'Admin'}` : req.rejectionReason || '—'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          /* ── RESOURCES ── */
          ) : activeTab === 'resources' ? (
            resources.length === 0 ? (
              <div className="ap-empty"><span>📦</span><p>No resources found.</p></div>
            ) : (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr><th>Name</th><th>Owner</th><th>Category</th><th>Qty</th><th>Condition</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {resources.map(r => (
                      <tr key={r._id}>
                        <td><div className="ap-cell-primary">{r.name}</div></td>
                        <td>
                          <div className="ap-user-cell">
                            <div className="ap-user-avatar" style={{ background: avatarColor(r.owner?.name) }}>
                              {getInitials(r.owner?.name)}
                            </div>
                            <div className="ap-cell-primary">{r.owner?.name || '—'}</div>
                          </div>
                        </td>
                        <td><span className="ap-cat-badge">{r.category}</span></td>
                        <td><div className="ap-cell-sub">{r.quantity || 1}</div></td>
                        <td><div className="ap-cell-sub" style={{ textTransform:'capitalize' }}>{r.condition || '—'}</div></td>
                        <td>
                          <span className={`ap-avail-badge ${r.availability !== false ? 'yes' : 'no'}`}>
                            {r.availability !== false ? '✅ Available' : '🔒 In Use'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          /* ── USERS ── */
          ) : (
            users.length === 0 ? (
              <div className="ap-empty"><span>👥</span><p>No users found.</p></div>
            ) : (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr><th>Member</th><th>Email</th><th>Community</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const roleLabel = { resident:'Member', admin:'Admin', superadmin:'Super Admin' }[u.role] || u.role;
                      return (
                        <tr key={u._id}>
                          <td>
                            <div className="ap-user-cell">
                              <div className="ap-user-avatar" style={{ background: avatarColor(u.name) }}>
                                {u.profile?.avatar
                                  ? <img src={u.profile.avatar} alt={u.name} referrerPolicy="no-referrer" />
                                  : getInitials(u.name)
                                }
                              </div>
                              <div className="ap-cell-primary">{u.name}</div>
                            </div>
                          </td>
                          <td><div className="ap-cell-sub">{u.email}</div></td>
                          <td>
                            <div className="ap-cell-primary">{u.communityName || '—'}</div>
                            <div className="ap-cell-sub">{u.communityType || ''}</div>
                          </td>
                          <td>
                            <span className={`ap-role-badge ${u.role}`}>{roleLabel}</span>
                          </td>
                          <td>
                            <div className="ap-cell-sub">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default Admin;
