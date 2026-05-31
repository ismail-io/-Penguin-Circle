import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Events.css';

/* ── Icons ── */
const IcCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcPin      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcUser     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcUsers    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcPlus     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IcX        = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcCheck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcLock     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

const CATEGORY_COLORS = {
  social:      { bg:'rgba(74,173,229,0.15)', color:'#87CEEB', border:'rgba(74,173,229,0.3)' },
  sports:      { bg:'rgba(34,197,94,0.15)',   color:'#86efac', border:'rgba(34,197,94,0.3)'   },
  educational: { bg:'rgba(251,191,36,0.15)',  color:'#fde047', border:'rgba(251,191,36,0.3)'  },
  maintenance: { bg:'rgba(239,68,68,0.15)',   color:'#fca5a5', border:'rgba(239,68,68,0.3)'   },
  other:       { bg:'rgba(245,132,31,0.15)',  color:'#FFB74D', border:'rgba(245,132,31,0.3)' },
};
const CATEGORY_ICONS = { social:'🎉', sports:'⚽', educational:'📚', maintenance:'🔧', other:'📌' };
const EMPTY_FORM = { title:'', description:'', date:'', time:'', location:'', capacity:'', category:'social' };

/* ── Demo events ── */
const DEMO_EVENTS = [
  { _id:'de1', title:'Cricket Tournament',         date:new Date(Date.now()+1*86400000).toISOString(), location:'Sports Ground',   category:'sports',  attendees:[{},{},{}],  description:'Annual cricket tournament open to all residents. Teams of 11.' },
  { _id:'de2', title:'Community Meeting',          date:new Date(Date.now()+2*86400000).toISOString(), location:'Main Hall',       category:'social',  attendees:[{},{},{},{},{},{}], description:'Monthly community meeting to discuss upcoming plans and issues.' },
  { _id:'de3', title:'Startup Networking Session', date:new Date(Date.now()+5*86400000).toISOString(), location:'Conference Room', category:'educational', attendees:[{},{}], description:'Connect with fellow entrepreneurs and startup founders in the community.' },
  { _id:'de4', title:'Cultural Festival',          date:new Date(Date.now()+7*86400000).toISOString(), location:'Garden Area',     category:'social',  attendees:[{},{},{},{},{},{},{},{},{}], description:'Celebrate diverse cultures with food, music, and performances.' },
];

const Events = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isDemo = !isAuthenticated;

  const [events,   setEvents]   = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(!isDemo);
  const [creating, setCreating] = useState(false);
  const [filter,   setFilter]   = useState('all');
  const [msg,      setMsg]      = useState({ type:'', text:'' });

  const isAdmin = !isDemo && (user?.role === 'admin' || user?.role === 'superadmin');

  const showLocked = () => setMsg({ type:'locked', text:'Please login to use this feature.' });

  const fetchEvents = useCallback(async () => {
    try {
      const res = await eventsAPI.getAll();
      setEvents(res.data?.data || []);
    } catch { setEvents([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isDemo) { setEvents(DEMO_EVENTS); }
    else        { setLoading(true); fetchEvents(); }
  }, [isDemo, fetchEvents]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async e => {
    e.preventDefault();
    setCreating(true); setMsg({ type:'', text:'' });
    try {
      await eventsAPI.create(formData);
      setFormData(EMPTY_FORM); setShowForm(false);
      setMsg({ type:'success', text:'Event created!' });
      fetchEvents();
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Failed to create event.' });
    } finally { setCreating(false); }
  };

  const handleJoin = async id => {
    if (isDemo) { showLocked(); return; }
    try { await eventsAPI.join(id); fetchEvents(); }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message || 'Could not join.' }); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this event?')) return;
    try { await eventsAPI.delete(id); fetchEvents(); setMsg({ type:'success', text:'Event deleted.' }); }
    catch { setMsg({ type:'error', text:'Could not delete.' }); }
  };

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);

  if (loading) return <div className="ev-loading"><div className="ev-spinner" /><span>Loading events…</span></div>;

  return (
    <div className="ev-root">
      {/* Demo banner */}
      {isDemo && (
        <div className="ev-demo-banner">
          <span>🔔 <strong>Sample Data</strong> — Showing community events. <button onClick={() => navigate('/login')}>Login</button> or <button onClick={() => navigate('/register')}>Register</button> to create and join real events.</span>
        </div>
      )}

      <div className="ev-header">
        <div>
          <h1>Community Events</h1>
          <p>{isDemo ? 'Explore upcoming events in Green Residency' : 'Discover and join events in your community'}</p>
        </div>
        {isAdmin && (
          <button className="ev-create-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? <><IcX /> Cancel</> : <><IcPlus /> Create Event</>}
          </button>
        )}
        {isDemo && (
          <button className="ev-create-btn demo-locked" onClick={showLocked}>
            <IcLock /> Create Event
          </button>
        )}
      </div>

      {msg.text && (
        <div className={`ev-msg ${msg.type === 'locked' ? 'locked' : msg.type}`}>
          {msg.type === 'locked' ? <IcLock /> : msg.type === 'success' ? <IcCheck /> : <IcX />} {msg.text}
          {msg.type === 'locked' && <button className="ev-msg-login" onClick={() => navigate('/login')}>Login →</button>}
        </div>
      )}

      {showForm && isAdmin && (
        <div className="ev-form-card">
          <div className="ev-form-title">✏️ Create New Event</div>
          <form onSubmit={handleSubmit}>
            <div className="ev-form-grid">
              <div className="ev-form-field ev-full"><label>Event Title *</label><input type="text" name="title" value={formData.title} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder="e.g. Community BBQ Night" required /></div>
              <div className="ev-form-field ev-full"><label>Description *</label><textarea name="description" value={formData.description} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder="Describe the event…" rows="3" required /></div>
              <div className="ev-form-field"><label>Date *</label><input type="date" name="date" value={formData.date} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))} required /></div>
              <div className="ev-form-field"><label>Time</label><input type="time" name="time" value={formData.time} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))} /></div>
              <div className="ev-form-field"><label>Location *</label><input type="text" name="location" value={formData.location} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder="e.g. Garden Area" required /></div>
              <div className="ev-form-field"><label>Capacity</label><input type="number" name="capacity" value={formData.capacity} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder="Max attendees" min="1" /></div>
              <div className="ev-form-field"><label>Category</label>
                <select name="category" value={formData.category} onChange={e => setFormData(p=>({...p,[e.target.name]:e.target.value}))}>
                  <option value="social">🎉 Social</option><option value="sports">⚽ Sports</option>
                  <option value="educational">📚 Educational</option><option value="maintenance">🔧 Maintenance</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>
            </div>
            <div className="ev-form-actions">
              <button type="submit" className="ev-submit-btn" disabled={creating}>{creating ? <><span className="ev-spinner-sm" /> Creating…</> : <><IcCheck /> Create Event</>}</button>
              <button type="button" className="ev-cancel-btn" onClick={() => setShowForm(false)}><IcX /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="ev-filters">
        {['all','social','sports','educational','maintenance','other'].map(f => (
          <button key={f} className={`ev-filter-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
            {f==='all' ? '🌐 All' : `${CATEGORY_ICONS[f]} ${f.charAt(0).toUpperCase()+f.slice(1)}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="ev-empty"><span>📅</span><p>No events found.</p></div>
      ) : (
        <div className="ev-grid">
          {filtered.map(ev => {
            const d    = new Date(ev.date);
            const cat  = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.other;
            const icon = CATEGORY_ICONS[ev.category]  || '📌';
            const isOwner = !isDemo && (ev.createdBy?._id === user?.id || ev.createdBy === user?.id);
            const joined  = !isDemo && ev.attendees?.some(a => (a._id||a) === user?.id);
            return (
              <div key={ev._id} className="ev-card">
                <div className="ev-card-top">
                  <div className="ev-card-date">
                    <span className="ev-date-day">{d.getDate()}</span>
                    <span className="ev-date-mon">{d.toLocaleDateString('en-US',{month:'short'})}</span>
                  </div>
                  <span className="ev-cat-badge" style={{ background:cat.bg, color:cat.color, border:`1px solid ${cat.border}` }}>{icon} {ev.category}</span>
                  {isAdmin && isOwner && <button className="ev-delete-btn" onClick={() => handleDelete(ev._id)}><IcTrash /></button>}
                </div>
                <h3 className="ev-card-title">{ev.title}</h3>
                <p className="ev-card-desc">{ev.description}</p>
                <div className="ev-card-meta">
                  <span><IcPin /> {ev.location||'TBD'}</span>
                  <span><IcCalendar /> {d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span>
                  {ev.createdBy?.name && <span><IcUser /> {ev.createdBy.name}</span>}
                </div>
                <div className="ev-card-footer">
                  <span className="ev-attendees"><IcUsers /> {ev.attendees?.length||0} attending</span>
                  {ev.capacity && <span className="ev-capacity">/ {ev.capacity} max</span>}
                  <button className={`ev-join-btn ${joined?'joined':''} ${isDemo?'demo':''}`} onClick={() => handleJoin(ev._id)}>
                    {isDemo ? <><IcLock /> Join</> : joined ? '✓ Joined' : 'Join'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;
