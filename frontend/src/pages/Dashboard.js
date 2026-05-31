import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, resourcesAPI, usersAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

/* ── Icons ── */
const IcUsers    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcBox      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const IcMsg      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcBell     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcPin      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcClock    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcHeart    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcComment  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcShare    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const IcGlobe    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IcStar     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcTrend    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IcLock     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcShield   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

/* ── Helpers ── */
const getInitials = name => name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
const AVATAR_COLORS = [
  'linear-gradient(135deg,#4AADE5,#F5841F)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];
const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0)||0) % AVATAR_COLORS.length];
const RESOURCE_ICONS = { tools:'🔧', books:'📚', equipment:'📽️', parking:'🅿️', other:'📦' };

/* ══════════════════════════════════════════
   DEMO DATA — shown when NOT logged in
══════════════════════════════════════════ */
const DEMO = {
  community: { name:'Green Residency', type:'Apartment Community', id:'APT001' },
  stats: [
    { label:'Total Members', value:120, icon:<IcUsers />,    color:'rgba(74,173,229,0.15)', iconColor:'#87CEEB', trend:'+12 this month' },
    { label:'Upcoming Events', value:12, icon:<IcCalendar />, color:'rgba(251,191,36,0.15)',  iconColor:'#fde047', trend:'2 this week'    },
    { label:'Resources',       value:35, icon:<IcBox />,      color:'rgba(34,197,94,0.15)',   iconColor:'#86efac', trend:'3 new added'   },
    { label:'Community Posts', value:87, icon:<IcMsg />,      color:'rgba(244,114,182,0.15)', iconColor:'#f9a8d4', trend:'+8 today'      },
  ],
  announcements: [
    { id:1, title:'Water Supply Maintenance',      desc:'Water will be off this Saturday 9AM–1PM for pipeline work.',     time:'2h ago'  },
    { id:2, title:'Cricket Tournament — Sunday',   desc:'Annual cricket tournament at Sports Ground. Register by Friday.', time:'5h ago'  },
    { id:3, title:'Community Meeting — Monday',    desc:'Monthly meeting at Main Hall, 6PM. All residents are welcome.',   time:'8h ago'  },
    { id:4, title:'New Members This Week',         desc:'5 new residents joined Green Residency. Give them a warm welcome!',time:'1d ago'  },
    { id:5, title:'Parking Slot Repainting',       desc:'Parking lot lines will be repainted on Sunday. Please move cars.', time:'2d ago'  },
  ],
  events: [
    { _id:'de1', title:'Cricket Tournament',         date: new Date(Date.now()+1*86400000).toISOString(), location:'Sports Ground',   attendees:[{},{},{}],            category:'sports',      description:'Annual inter-block cricket championship. Teams of 6 players each.' },
    { _id:'de2', title:'Community Meeting',          date: new Date(Date.now()+2*86400000).toISOString(), location:'Main Hall',       attendees:[{},{},{},{},{},{}],    category:'social',      description:'Monthly community meeting to discuss upcoming plans and issues.' },
    { _id:'de3', title:'Startup Networking Session', date: new Date(Date.now()+5*86400000).toISOString(), location:'Conference Room', attendees:[{},{}],               category:'education',   description:'Connect with fellow entrepreneurs and share ideas over coffee.' },
    { _id:'de4', title:'Cultural Festival',          date: new Date(Date.now()+7*86400000).toISOString(), location:'Garden Area',     attendees:[{},{},{},{},{},{},{},{}], category:'social',   description:'Music, dance, food stalls, and fun for all ages.' },
    { _id:'de5', title:'Yoga & Wellness Workshop',   date: new Date(Date.now()+3*86400000).toISOString(), location:'Terrace',         attendees:[{},{},{},{}],          category:'health',      description:'Morning yoga and meditation session led by certified instructor.' },
    { _id:'de6', title:'Kids Art Competition',       date: new Date(Date.now()+4*86400000).toISOString(), location:'Community Center',attendees:[{},{},{},{},{},{},{},{},{},{}], category:'social', description:'Drawing and painting contest for children aged 5-15. Prizes for all!' },
    { _id:'de7', title:'Movie Night — Outdoor',      date: new Date(Date.now()+6*86400000).toISOString(), location:'Amphitheatre',    attendees:[{},{},{},{},{}],       category:'entertainment', description:'Open-air movie screening with popcorn and drinks. Bring your blankets!' },
    { _id:'de8', title:'Resident Town Hall Q&A',     date: new Date(Date.now()+9*86400000).toISOString(), location:'Main Hall',       attendees:[{},{},{}],            category:'social',      description:'Open forum with the management committee. Raise your concerns and suggestions.' },
  ],
  members: [
    { _id:'dm1', name:'Ahmed Ismail',   role:'admin',    profile:{} },
    { _id:'dm2', name:'John Smith',     role:'resident', profile:{} },
    { _id:'dm3', name:'Sarah Johnson',  role:'admin',    profile:{} },
    { _id:'dm4', name:'David Kumar',    role:'resident', profile:{} },
    { _id:'dm5', name:'Emma Wilson',    role:'resident', profile:{} },
  ],
  resources: [
    { _id:'dr1', name:'Projector',        category:'equipment', availability:true  },
    { _id:'dr2', name:'Community Hall',   category:'other',     availability:true  },
    { _id:'dr3', name:'Parking Slot',     category:'parking',   availability:true  },
    { _id:'dr4', name:'Sports Equipment', category:'tools',     availability:true  },
  ],
  feed: [
    { id:1, name:'Ahmed Ismail',  role:'Member',          time:'10 min ago', text:'Anyone interested in weekend cricket? We need 4 more players! 🏏', likes:14, comments:5  },
    { id:2, name:'Sarah Johnson', role:'Community Admin',  time:'1h ago',     text:'Community meeting scheduled for Monday 6PM. All residents welcome! 🏛️', likes:32, comments:8  },
    { id:3, name:'John Smith',    role:'Member',          time:'3h ago',     text:'Looking for a projector for a presentation tomorrow evening.', likes:9,  comments:3  },
  ],
};

/* ── Locked Feature Toast ── */
const LockedToast = ({ onClose }) => (
  <div className="db-locked-toast">
    <IcLock />
    <span>Please login to use this feature.</span>
    <button onClick={onClose}>✕</button>
  </div>
);

/* ── Animated Counter Component ── */
const AnimatedCounter = ({ target }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const end = parseInt(target, 10);
    if (isNaN(end) || end === 0) {
      setCount(target);
      return;
    }
    
    let start = 0;
    const duration = 1000; // 1 second duration
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 16)); // Limit tick rate to 60fps max
    
    return () => clearInterval(timer);
  }, [target]);

  return <>{count}</>;
};

// Pre-compute background particles (snow and glow dots) to prevent re-render flicker
const BG_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left:     `${(i * 7.7 + 3) % 100}%`,
  delay:    `${(i * 0.4) % 6}s`,
  duration: `${10 + (i * 0.8) % 15}s`,
  size:     `${1.5 + (i % 3)}px`,
  opacity:  0.15 + (i % 5) * 0.15,
}));

const GLOW_DOTS = Array.from({ length: 10 }, (_, i) => ({
  left:     `${(i * 23.3 + 10) % 90}%`,
  top:      `${(i * 17.7 + 15) % 80}%`,
  delay:    `${(i * 0.7) % 5}s`,
  duration: `${14 + (i * 1.8) % 12}s`,
  size:     `${3 + (i % 4) * 2}px`,
}));

/* ══════════════════════════════════════════
   DASHBOARD — Smart Demo + Real Mode
   Redesigned Premium Glassmorphism UI
   Theme: Deep Blue (#2563EB) & Orange (#F97316)
 ══════════════════════════════════════════ */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isDemo = !isAuthenticated;

  const [events,     setEvents]     = useState([]);
  const [resources,  setResources]  = useState([]);
  const [members,    setMembers]    = useState([]);
  const [loading,    setLoading]    = useState(!isDemo);
  const [likedPosts, setLikedPosts] = useState({});
  const [lockedMsg,  setLockedMsg]  = useState(false);

  const now     = new Date();
  const dayNum  = now.getDate();
  const dayName = now.toLocaleDateString('en-US', { weekday:'long' });
  const month   = now.toLocaleDateString('en-US', { month:'long' });
  const year    = now.getFullYear();

  /* ── Load data ── */
  const fetchReal = useCallback(async () => {
    try {
      const [evRes, resRes, usrRes] = await Promise.allSettled([
        eventsAPI.getAll(),
        resourcesAPI.getAll(),
        usersAPI.getAll(),
      ]);
      const evData  = evRes.status  === 'fulfilled' ? (evRes.value.data?.data  || []) : [];
      const resData = resRes.status === 'fulfilled' ? (resRes.value.data?.data || []) : [];
      const usrData = usrRes.status === 'fulfilled' ? (usrRes.value.data?.data || []) : [];
      setEvents(   evData.length  ? evData.slice(0,8)  : DEMO.events);
      setResources(resData.length ? resData.slice(0,4) : DEMO.resources);
      setMembers(  usrData.length ? usrData.slice(0,5) : DEMO.members);
    } catch {
      setEvents(DEMO.events); setResources(DEMO.resources); setMembers(DEMO.members);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isDemo) {
      setEvents(DEMO.events); setResources(DEMO.resources); setMembers(DEMO.members);
    } else {
      setLoading(true);
      fetchReal();
    }
  }, [isDemo, fetchReal]);

  const toggleLike = id => {
    if (isDemo) { showLocked(); return; }
    setLikedPosts(p => ({ ...p, [id]: !p[id] }));
  };

  const showLocked = () => {
    setLockedMsg(true);
    setTimeout(() => setLockedMsg(false), 3000);
  };

  /* ── Derived display values ── */
  const communityName = isDemo ? DEMO.community.name : (user?.communityName || user?.apartmentId || 'My Community');
  const communityType = isDemo ? DEMO.community.type : (user?.communityType || 'Community');
  const communityId   = isDemo ? DEMO.community.id   : (user?.communityId   || user?.apartmentId || '—');
  const displayName   = isDemo ? 'Guest'             : (user?.name?.split(' ')[0] || 'User');
  const roleLabel     = isDemo ? 'Guest'             : ({ resident:'Member', admin:'Community Admin', superadmin:'Super Admin' }[user?.role] || 'Member');
  const announcements = DEMO.announcements;
  const feed          = DEMO.feed;

  const stats = isDemo ? DEMO.stats : [
    { label:'Total Members',   value: members.length  || 0,  icon:<IcUsers />,    color:'rgba(74,173,229,0.15)', iconColor:'#87CEEB', trend:'+12 this month' },
    { label:'Upcoming Events', value: events.length   || 0,  icon:<IcCalendar />, color:'rgba(251,191,36,0.15)',  iconColor:'#fde047', trend:'2 this week'    },
    { label:'Resources',       value: resources.filter(r=>r.availability!==false).length || 0, icon:<IcBox />, color:'rgba(34,197,94,0.15)', iconColor:'#86efac', trend:'3 new added' },
    { label:'Community Posts', value: 87,                    icon:<IcMsg />,      color:'rgba(244,114,182,0.15)', iconColor:'#f9a8d4', trend:'+8 today'      },
  ];

  if (loading) return (
    <div className="db-loading">
      <div className="db-spinner" />
      <span>Loading your dashboard…</span>
    </div>
  );

  return (
    <div className="dashboard">
      {/* ── Background Particles & Glowing Effects ── */}
      <div className="db-bg-effects" aria-hidden="true">
        <div className="db-bg-glow-orange" />
        <div className="db-bg-glow-blue" />
        <div className="db-bg-snow">
          {BG_PARTICLES.map((p, i) => (
            <div
              key={`snow-${i}`}
              className="db-snow-particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
        <div className="db-bg-glowing-dots">
          {GLOW_DOTS.map((d, i) => (
            <div
              key={`glow-${i}`}
              className="db-glow-dot"
              style={{
                left: d.left,
                top: d.top,
                animationDelay: d.delay,
                animationDuration: d.duration,
                width: d.size,
                height: d.size,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── LOCKED TOAST ── */}
      {lockedMsg && <LockedToast onClose={() => setLockedMsg(false)} />}

      {/* ── SAMPLE DATA NOTICE ── */}
      {isDemo && (
        <div className="db-sample-notice">
          <span>🔔</span>
          <span>Login to access your community and real-time data.</span>
        </div>
      )}
      {/* ── WELCOME BANNER ── */}
      <div className="db-welcome">
        <div className="db-welcome-left">
          <h1>
            {isDemo
              ? <>Community <span>Dashboard</span> 🏘️</>
              : <>Welcome Back, <span>{displayName}</span> 👋</>
            }
          </h1>
          {!isDemo && (
            <div className="db-welcome-meta">
              {communityName && communityName !== '—' && (
                <span className="db-welcome-tag">🏘️ <strong>{communityName}</strong></span>
              )}
              {communityType && communityType !== 'Community' && (
                <span className="db-welcome-tag"><IcGlobe /> <strong>{communityType}</strong></span>
              )}
              <span className="db-welcome-tag"><IcStar /> <strong>{roleLabel}</strong></span>
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <span className="db-welcome-tag admin"><IcShield /> <strong>Admin</strong></span>
              )}
            </div>
          )}
        </div>
        <div className="db-welcome-date">
          <div className="db-date-day">{dayNum}</div>
          <div className="db-date-rest">{dayName}<br />{month} {year}</div>
        </div>
      </div>

      {/* ── USER INFO STRIP (real mode only) ── */}
      {!isDemo && (
        <div className="db-user-strip">
          <div className="db-user-strip-item">
            <span className="db-strip-label">Name</span>
            <span className="db-strip-value">{user?.name || '—'}</span>
          </div>
          <div className="db-user-strip-sep" />
          <div className="db-user-strip-item">
            <span className="db-strip-label">Email</span>
            <span className="db-strip-value">{user?.email || '—'}</span>
          </div>
          <div className="db-user-strip-sep" />
          <div className="db-user-strip-item">
            <span className="db-strip-label">User ID</span>
            <span className="db-strip-value mono">{user?.id?.slice(-8)?.toUpperCase() || '—'}</span>
          </div>
          {communityId && communityId !== '—' && !/^0+$/.test(communityId) && (
            <>
              <div className="db-user-strip-sep" />
              <div className="db-user-strip-item">
                <span className="db-strip-label">Community ID</span>
                <span className="db-strip-value mono">{communityId}</span>
              </div>
            </>
          )}
          <div className="db-user-strip-sep" />
          <div className="db-user-strip-item">
            <span className="db-strip-label">Role</span>
            <span className="db-strip-value role">{roleLabel}</span>
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      <div className="db-stats">
        {stats.map((s, i) => (
          <div key={i} className="db-stat-card">
            <div className="db-stat-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
            <div className="db-stat-info">
              <div className="db-stat-value"><AnimatedCounter target={s.value} /></div>
              <div className="db-stat-label">{s.label}</div>
              <div className="db-stat-change up"><IcTrend /> {s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="db-grid">

        {/* Announcements */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <div className="db-card-title-icon" style={{ background:'rgba(239,68,68,0.15)', color:'#fca5a5' }}><IcBell /></div>
              Announcements
            </div>
            <button className="db-card-action" onClick={isDemo ? showLocked : undefined}>View All</button>
          </div>
          <div className="db-card-body">
            {announcements.map(a => (
              <div key={a.id} className="db-announce-item">
                <div className="db-announce-content">
                  <div className="db-announce-title">{a.title}</div>
                  <div className="db-announce-desc">{a.desc}</div>
                  <div className="db-announce-time"><IcClock /> {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <div className="db-card-title-icon" style={{ background:'rgba(251,191,36,0.15)', color:'#fde047' }}><IcCalendar /></div>
              Upcoming Events
            </div>
            <button className="db-card-action" onClick={() => navigate('/events')}>View All</button>
          </div>
          <div className="db-card-body">
            {events.length === 0
              ? <div className="db-empty">No upcoming events</div>
              : events.map(ev => {
                  const d = new Date(ev.date);
                  return (
                    <div key={ev._id} className="db-event-item">
                      <div className="db-event-date-box">
                        <span className="day">{d.getDate()}</span>
                        <span className="mon">{d.toLocaleDateString('en-US',{month:'short'})}</span>
                      </div>
                      <div className="db-event-info">
                        <div className="db-event-name">{ev.title}</div>
                        <div className="db-event-meta">
                          <span><IcPin /> {ev.location||'TBD'}</span>
                          <span><IcClock /> {d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span>
                        </div>
                      </div>
                      <button className="db-join-btn" onClick={isDemo ? showLocked : () => navigate('/events')}>
                        Join
                      </button>
                    </div>
                  );
                })
            }
          </div>
        </div>

        {/* Community Feed */}
        <div className="db-card db-span-1">
          <div className="db-card-header">
            <div className="db-card-title">
              <div className="db-card-title-icon" style={{ background:'rgba(74,173,229,0.15)', color:'#87CEEB' }}><IcMsg /></div>
              Community Feed
            </div>
            <button className="db-card-action" onClick={() => navigate('/community')}>View All</button>
          </div>
          <div className="db-card-body">
            {feed.map(post => (
              <div key={post.id} className="db-feed-item">
                <div className="db-feed-header">
                  <div className="db-feed-avatar" style={{ background: avatarColor(post.name) }}>{getInitials(post.name)}</div>
                  <div>
                    <div className="db-feed-user-name">{post.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{post.role}</div>
                  </div>
                  <span className="db-feed-time">{post.time}</span>
                </div>
                <div className="db-feed-text">{post.text}</div>
                <div className="db-feed-actions">
                  <button className={`db-feed-btn ${likedPosts[post.id]?'liked':''}`} onClick={() => toggleLike(post.id)}>
                    <IcHeart /> {post.likes+(likedPosts[post.id]?1:0)}
                  </button>
                  <button className="db-feed-btn" onClick={isDemo ? showLocked : undefined}><IcComment /> {post.comments}</button>
                  <button className="db-feed-btn" onClick={isDemo ? showLocked : undefined}><IcShare /> Share</button>
                </div>
              </div>
            ))}
            {isDemo && (
              <div className="db-feed-locked" onClick={showLocked}>
                <IcLock />
                <span>Login to post in the community feed</span>
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <div className="db-card-title-icon" style={{ background:'rgba(34,197,94,0.15)', color:'#86efac' }}><IcUsers /></div>
              {isDemo ? 'Community Members' : 'Community Members'}
            </div>
            <button className="db-card-action" onClick={() => navigate('/community')}>View All</button>
          </div>
          <div className="db-card-body">
            {members.map(m => {
              const isAdmin = m.role==='admin'||m.role==='superadmin';
              const roleStr = { resident:'Member', admin:'Community Admin', superadmin:'Super Admin' }[m.role]||m.role;
              return (
                <div key={m._id} className="db-member-item">
                  <div className="db-member-avatar" style={{ background: avatarColor(m.name) }}>
                    {m.profile?.avatar ? <img src={m.profile.avatar} alt={m.name} referrerPolicy="no-referrer" /> : getInitials(m.name)}
                  </div>
                  <div className="db-member-info">
                    <div className="db-member-name">{m.name}</div>
                    <div className="db-member-role">{roleStr}</div>
                  </div>
                  {isAdmin ? <span className="db-member-badge admin">Admin</span> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <div className="db-card-title-icon" style={{ background:'rgba(251,191,36,0.15)', color:'#fde047' }}><IcBox /></div>
              {isDemo ? 'Resources' : 'Resources'}
            </div>
            <button className="db-card-action" onClick={() => navigate('/resources')}>View All</button>
          </div>
          <div className="db-card-body">
            {resources.map(r => (
              <div key={r._id} className="db-resource-item">
                <div className="db-resource-icon" style={{ background:'rgba(255,255,255,0.06)' }}>{RESOURCE_ICONS[r.category]||'📦'}</div>
                <div className="db-resource-info">
                  <div className="db-resource-name">{r.name}</div>
                  <div className="db-resource-cat">{r.category}</div>
                </div>
                {r.availability !== false
                  ? <button className="db-req-btn" onClick={isDemo ? showLocked : () => navigate('/resources')}>
                      Request
                    </button>
                  : <span className="db-avail-badge no">In Use</span>
                }
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
