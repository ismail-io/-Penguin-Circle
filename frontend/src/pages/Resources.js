import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, requestsAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Resources.css';

/* ── Icons ── */
const IcPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IcX      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcCheck  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcUser   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcLock   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

const CATEGORY_ICONS  = { tools:'🔧', books:'📚', equipment:'📽️', parking:'🅿️', other:'📦' };
const CATEGORY_COLORS = {
  tools:     { bg:'rgba(251,191,36,0.12)',  color:'#fde047', border:'rgba(251,191,36,0.25)'  },
  books:     { bg:'rgba(74,173,229,0.12)', color:'#87CEEB', border:'rgba(74,173,229,0.25)' },
  equipment: { bg:'rgba(244,114,182,0.12)', color:'#f9a8d4', border:'rgba(244,114,182,0.25)' },
  parking:   { bg:'rgba(34,197,94,0.12)',   color:'#86efac', border:'rgba(34,197,94,0.25)'   },
  other:     { bg:'rgba(245,132,31,0.12)',  color:'#FFB74D', border:'rgba(245,132,31,0.25)' },
};
const CONDITION_COLORS = {
  excellent:{ color:'#86efac', bg:'rgba(34,197,94,0.12)'  },
  good:     { color:'#fde047', bg:'rgba(251,191,36,0.12)' },
  fair:     { color:'#fca5a5', bg:'rgba(239,68,68,0.12)'  },
};
const EMPTY_FORM = { name:'', description:'', category:'tools', quantity:1, condition:'good' };

const DEMO_RESOURCES = [
  { _id:'dr1', name:'Projector',        category:'equipment', availability:true,  condition:'good',      description:'HD projector for presentations and movie nights.' },
  { _id:'dr2', name:'Community Hall',   category:'other',     availability:true,  condition:'excellent', description:'Large hall for events, meetings, and gatherings.' },
  { _id:'dr3', name:'Parking Slot B4',  category:'parking',   availability:true,  condition:'good',      description:'Covered parking slot near the main entrance.' },
  { _id:'dr4', name:'Sports Equipment', category:'tools',     availability:true,  condition:'good',      description:'Cricket bats, balls, badminton rackets, and more.' },
  { _id:'dr5', name:'Community Library',category:'books',     availability:false, condition:'excellent', description:'Collection of 200+ books across genres.' },
  { _id:'dr6', name:'BBQ Grill Set',    category:'tools',     availability:true,  condition:'good',      description:'Full BBQ grill set for outdoor events.' },
];

const Resources = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isDemo = !isAuthenticated;

  const [resources, setResources] = useState([]);
  const [formData,  setFormData]  = useState(EMPTY_FORM);
  const [showForm,  setShowForm]  = useState(false);
  const [filter,    setFilter]    = useState('all');
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(!isDemo);
  const [creating,  setCreating]  = useState(false);
  const [msg,       setMsg]       = useState({ type:'', text:'' });

  const isAdmin = !isDemo && (user?.role === 'admin' || user?.role === 'superadmin');
  const showLocked = () => setMsg({ type:'locked', text:'Please login to use this feature.' });

  const fetchResources = useCallback(async () => {
    try {
      const params = filter !== 'all' ? { category: filter } : {};
      const res = await resourcesAPI.getAll(params);
      setResources(res.data?.data || []);
    } catch { setResources([]); }
    finally  { setLoading(false); }
  }, [filter]);

  useEffect(() => {
    if (isDemo) { setResources(DEMO_RESOURCES); }
    else        { setLoading(true); fetchResources(); }
  }, [isDemo, fetchResources]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async e => {
    e.preventDefault(); setCreating(true); setMsg({ type:'', text:'' });
    try {
      await resourcesAPI.create(formData);
      setFormData(EMPTY_FORM); setShowForm(false);
      setMsg({ type:'success', text:'Resource added!' }); fetchResources();
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.message || 'Failed.' }); }
    finally { setCreating(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this resource?')) return;
    try { await resourcesAPI.delete(id); setMsg({ type:'success', text:'Deleted.' }); fetchResources(); }
    catch { setMsg({ type:'error', text:'Could not delete.' }); }
  };

  const handleRequest = async id => {
    if (isDemo) { showLocked(); return; }
    try { await requestsAPI.create({ resourceId: id }); setMsg({ type:'success', text:'Request submitted! Admin will review it.' }); }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message || 'Could not submit.' }); }
  };

  const filtered = resources.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="rs-loading"><div className="rs-spinner" /><span>Loading resources…</span></div>;

  return (
    <div className="rs-root">
      {isDemo && (
        <div className="rs-demo-banner">
          <span>🔔 <strong>Sample Data</strong> — Showing community resources. <button onClick={() => navigate('/login')}>Login</button> or <button onClick={() => navigate('/register')}>Register</button> to request and manage real resources.</span>
        </div>
      )}

      <div className="rs-header">
        <div>
          <h1>Resource Sharing</h1>
          <p>{isDemo ? 'Explore shared resources in Green Residency' : 'Browse and request shared community resources'}</p>
        </div>
        {isAdmin && (
          <button className="rs-add-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? <><IcX /> Cancel</> : <><IcPlus /> Add Resource</>}
          </button>
        )}
        {isDemo && (
          <button className="rs-add-btn demo-locked" onClick={showLocked}><IcLock /> Add Resource</button>
        )}
      </div>

      {msg.text && (
        <div className={`rs-msg ${msg.type === 'locked' ? 'locked' : msg.type}`}>
          {msg.type === 'locked' ? <IcLock /> : msg.type === 'success' ? <IcCheck /> : <IcX />} {msg.text}
          {msg.type === 'locked' && <button className="rs-msg-login" onClick={() => navigate('/login')}>Login →</button>}
        </div>
      )}

      {showForm && isAdmin && (
        <div className="rs-form-card">
          <div className="rs-form-title">📦 Add New Resource</div>
          <form onSubmit={handleSubmit}>
            <div className="rs-form-grid">
              <div className="rs-form-field rs-full"><label>Resource Name *</label><input type="text" name="name" value={formData.name} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder="e.g. Power Drill" required /></div>
              <div className="rs-form-field rs-full"><label>Description *</label><textarea name="description" value={formData.description} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder="Describe the resource…" rows="3" required /></div>
              <div className="rs-form-field"><label>Category</label>
                <select name="category" value={formData.category} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))}>
                  <option value="tools">🔧 Tools</option><option value="books">📚 Books</option>
                  <option value="equipment">📽️ Equipment</option><option value="parking">🅿️ Parking</option><option value="other">📦 Other</option>
                </select>
              </div>
              <div className="rs-form-field"><label>Quantity</label><input type="number" name="quantity" value={formData.quantity} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))} min="1" /></div>
              <div className="rs-form-field"><label>Condition</label>
                <select name="condition" value={formData.condition} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))}>
                  <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option>
                </select>
              </div>
            </div>
            <div className="rs-form-actions">
              <button type="submit" className="rs-submit-btn" disabled={creating}>{creating?<><span className="rs-spinner-sm"/>Adding…</>:<><IcCheck/>Add Resource</>}</button>
              <button type="button" className="rs-cancel-btn" onClick={()=>setShowForm(false)}><IcX/>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="rs-toolbar">
        <div className="rs-search">
          <span className="rs-search-icon"><IcSearch /></span>
          <input type="text" placeholder="Search resources…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="rs-filters">
          {['all','tools','books','equipment','parking','other'].map(f => (
            <button key={f} className={`rs-filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f==='all'?'🌐 All':`${CATEGORY_ICONS[f]} ${f.charAt(0).toUpperCase()+f.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="rs-stats-bar">
        <span>📦 {filtered.length} resource{filtered.length!==1?'s':''}</span>
        <span>✅ {filtered.filter(r=>r.availability!==false).length} available</span>
        <span>🔒 {filtered.filter(r=>r.availability===false).length} in use</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rs-empty"><span>📦</span><p>No resources found.</p></div>
      ) : (
        <div className="rs-grid">
          {filtered.map(r => {
            const cat  = CATEGORY_COLORS[r.category]  || CATEGORY_COLORS.other;
            const cond = CONDITION_COLORS[r.condition] || CONDITION_COLORS.good;
            const icon = CATEGORY_ICONS[r.category]   || '📦';
            const isOwner = !isDemo && (r.owner?._id===user?.id || r.owner===user?.id);
            const avail   = r.availability !== false;
            return (
              <div key={r._id} className={`rs-card ${!avail?'in-use':''}`}>
                <div className="rs-card-top">
                  <div className="rs-card-icon" style={{ background:cat.bg, border:`1px solid ${cat.border}` }}>{icon}</div>
                  <span className="rs-cat-badge" style={{ background:cat.bg, color:cat.color, border:`1px solid ${cat.border}` }}>{r.category}</span>
                  <span className={`rs-avail-badge ${avail?'yes':'no'}`}>{avail?'✅ Available':'🔒 In Use'}</span>
                </div>
                <h3 className="rs-card-name">{r.name}</h3>
                <p className="rs-card-desc">{r.description}</p>
                <div className="rs-card-meta">
                  {r.condition && <span className="rs-cond-badge" style={{ background:cond.bg, color:cond.color }}>{r.condition}</span>}
                  {r.quantity > 1 && <span className="rs-qty">Qty: {r.quantity}</span>}
                  {r.owner?.name && <span className="rs-owner"><IcUser /> {r.owner.name}</span>}
                </div>
                <div className="rs-card-actions">
                  {avail && (
                    <button className={`rs-request-btn ${isDemo?'demo':''}`} onClick={() => handleRequest(r._id)}>
                      {isDemo ? <><IcLock /> Request</> : 'Request'}
                    </button>
                  )}
                  {!avail && <span className="rs-unavail-note">Currently unavailable</span>}
                  {(isOwner || isAdmin) && (
                    <button className="rs-delete-btn" onClick={() => handleDelete(r._id)}><IcTrash /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Resources;
