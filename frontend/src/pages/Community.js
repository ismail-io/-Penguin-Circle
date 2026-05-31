import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Community.css';

/* ── Icons ── */
const IcSearch  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcMail    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IcHeart   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcComment = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcShare   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const IcUsers   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcMsg     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcSend    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcLock    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

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

/* ── Demo data ── */
const DEMO_MEMBERS = [
  { _id:'dm1', name:'Ahmed Ismail',  role:'admin',    email:'ahmed@greenresidency.com',  profile:{} },
  { _id:'dm2', name:'John Smith',    role:'resident', email:'john@greenresidency.com',   profile:{} },
  { _id:'dm3', name:'Sarah Johnson', role:'admin',    email:'sarah@greenresidency.com',  profile:{} },
  { _id:'dm4', name:'David Kumar',   role:'resident', email:'david@greenresidency.com',  profile:{} },
  { _id:'dm5', name:'Emma Wilson',   role:'resident', email:'emma@greenresidency.com',   profile:{} },
];

const DEMO_FEED = [
  { id:1, name:'Sarah Johnson', role:'Community Admin', time:'10 min ago', text:'Reminder: Community meeting this Monday at 6PM in the main hall. All residents welcome! 🏛️', likes:24, comments:8  },
  { id:2, name:'Ahmed Ismail',  role:'Member',          time:'1h ago',     text:'Anyone interested in weekend cricket? We need 4 more players for Sunday 5PM! 🏏',           likes:18, comments:12 },
  { id:3, name:'John Smith',    role:'Member',          time:'3h ago',     text:'Looking for a projector for a presentation tomorrow evening. Anyone have one available?',    likes:6,  comments:3  },
  { id:4, name:'David Kumar',   role:'Moderator',       time:'5h ago',     text:'Cultural Festival this Saturday at 7PM! Food, music, and performances. Don\'t miss it 🎭',  likes:41, comments:15 },
  { id:5, name:'Emma Wilson',   role:'Member',          time:'1d ago',     text:'Just wanted to say this community is amazing. Everyone has been so helpful! ❤️',            likes:55, comments:20 },
];

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isDemo = !isAuthenticated;

  const [members,    setMembers]    = useState([]);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab,  setActiveTab]  = useState('members');
  const [loading,    setLoading]    = useState(!isDemo);
  const [likedPosts, setLikedPosts] = useState({});
  const [postText,   setPostText]   = useState('');
  const [lockedMsg,  setLockedMsg]  = useState(false);

  const showLocked = () => { setLockedMsg(true); setTimeout(() => setLockedMsg(false), 3000); };

  const fetchMembers = useCallback(async () => {
    try {
      const res = await usersAPI.getAll();
      setMembers(res.data?.data || []);
    } catch { setMembers([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isDemo) { setMembers(DEMO_MEMBERS); }
    else        { setLoading(true); fetchMembers(); }
  }, [isDemo, fetchMembers]); // eslint-disable-line react-hooks/exhaustive-deps

  const feed = isDemo ? DEMO_FEED : DEMO_FEED; // real feed API not yet implemented

  const filtered = members.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
                        m.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleLike = id => {
    if (isDemo) { showLocked(); return; }
    setLikedPosts(p => ({ ...p, [id]: !p[id] }));
  };

  const adminCount    = members.filter(m => m.role==='admin'||m.role==='superadmin').length;
  const residentCount = members.filter(m => m.role==='resident').length;

  if (loading) return <div className="cm-loading"><div className="cm-spinner" /><span>Loading community…</span></div>;

  return (
    <div className="cm-root">

      {/* Sample data notice */}
      {isDemo && (
        <div className="cm-demo-banner">
          <span>🔔 <strong>Sample Data</strong> — Showing Green Residency community. <button onClick={() => navigate('/login')}>Login</button> or <button onClick={() => navigate('/register')}>Register</button> to connect with your real community.</span>
        </div>
      )}

      {/* Locked toast */}
      {lockedMsg && (
        <div className="cm-locked-toast">
          <IcLock /> Please login to use this feature.
          <button onClick={() => navigate('/login')}>Login →</button>
        </div>
      )}

      {/* Header */}
      <div className="cm-header">
        <div>
          <h1>Community Hub</h1>
          <p>{isDemo ? 'Green Residency — Apartment Community' : 'Connect with members and stay updated'}</p>
        </div>
        <div className="cm-header-stats">
          <div className="cm-hstat"><span>{members.length}</span><small>Members</small></div>
          <div className="cm-hstat"><span>{adminCount}</span><small>Admins</small></div>
          <div className="cm-hstat"><span>{residentCount}</span><small>Residents</small></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cm-tabs">
        <button className={`cm-tab ${activeTab==='members'?'active':''}`} onClick={() => setActiveTab('members')}>
          <IcUsers /> Members <span className="cm-tab-count">{members.length}</span>
        </button>
        <button className={`cm-tab ${activeTab==='feed'?'active':''}`} onClick={() => setActiveTab('feed')}>
          <IcMsg /> Community Feed <span className="cm-tab-count">{feed.length}</span>
        </button>
      </div>

      {/* ══ MEMBERS TAB ══ */}
      {activeTab === 'members' && (
        <>
          <div className="cm-toolbar">
            <div className="cm-search">
              <span className="cm-search-icon"><IcSearch /></span>
              <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="cm-role-filters">
              {['all','resident','admin','superadmin'].map(r => (
                <button key={r} className={`cm-role-btn ${roleFilter===r?'active':''}`} onClick={() => setRoleFilter(r)}>
                  {{ all:'🌐 All', resident:'👤 Members', admin:'🛡️ Admins', superadmin:'⭐ Super Admin' }[r]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="cm-empty"><span>👥</span><p>No members found.</p></div>
          ) : (
            <div className="cm-members-grid">
              {filtered.map(m => {
                const roleLabel = { resident:'Member', admin:'Community Admin', superadmin:'Super Admin' }[m.role] || m.role;
                const isAdminM  = m.role==='admin'||m.role==='superadmin';
                const isSelf    = !isDemo && m._id === user?.id;
                const joinDate  = m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '';
                return (
                  <div key={m._id} className={`cm-member-card ${isSelf?'self':''}`}>
                    {isSelf && <div className="cm-self-badge">You</div>}
                    <div className="cm-member-avatar" style={{ background: avatarColor(m.name) }}>
                      {m.profile?.avatar
                        ? <img src={m.profile.avatar} alt={m.name} referrerPolicy="no-referrer" />
                        : getInitials(m.name)
                      }
                    </div>
                    <div className="cm-member-name">{m.name}</div>
                    <span className={`cm-member-role-badge ${isAdminM?'admin':'member'}`}>
                      {isAdminM ? '🛡️' : '👤'} {roleLabel}
                    </span>
                    {m.profile?.bio && <p className="cm-member-bio">{m.profile.bio}</p>}
                    <div className="cm-member-contact">
                      <span><IcMail /> {isDemo ? m.email : m.email}</span>
                    </div>
                    {joinDate && <div className="cm-member-joined">Joined {joinDate}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ══ FEED TAB ══ */}
      {activeTab === 'feed' && (
        <div className="cm-feed-wrap">

          {/* Composer */}
          <div className={`cm-composer ${isDemo?'demo-locked':''}`} onClick={isDemo ? showLocked : undefined}>
            <div className="cm-composer-avatar" style={{ background: isDemo ? '#4AADE5' : avatarColor(user?.name) }}>
              {isDemo ? '👤' : (user?.avatar||user?.profile?.avatar
                ? <img src={user.avatar||user.profile.avatar} alt={user.name} referrerPolicy="no-referrer" />
                : getInitials(user?.name)
              )}
            </div>
            <div className="cm-composer-input">
              <textarea
                placeholder={isDemo ? '🔒 Login to post in the community feed…' : `What's on your mind, ${user?.name?.split(' ')[0]||'there'}?`}
                value={postText}
                onChange={e => { if (!isDemo) setPostText(e.target.value); }}
                rows="2"
                readOnly={isDemo}
                style={{ cursor: isDemo ? 'pointer' : 'text' }}
              />
              <div className="cm-composer-footer">
                <span className="cm-composer-hint">
                  {isDemo ? 'Login to share updates with your community' : 'Share updates, ask questions, or start a discussion'}
                </span>
                {isDemo ? (
                  <button className="cm-post-btn" onClick={() => navigate('/login')}>Login to Post</button>
                ) : (
                  <button className="cm-post-btn" disabled={!postText.trim()} onClick={() => setPostText('')}>
                    <IcSend /> Post
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feed posts */}
          <div className="cm-feed">
            {feed.map(post => (
              <div key={post.id} className="cm-post">
                <div className="cm-post-header">
                  <div className="cm-post-avatar" style={{ background: avatarColor(post.name) }}>
                    {getInitials(post.name)}
                  </div>
                  <div className="cm-post-meta">
                    <div className="cm-post-name">{post.name}</div>
                    <div className="cm-post-role-time">
                      <span className="cm-post-role">{post.role}</span>
                      <span className="cm-post-dot">·</span>
                      <span className="cm-post-time">{post.time}</span>
                    </div>
                  </div>
                  {isDemo && <span className="cm-demo-post-tag">Demo</span>}
                </div>
                <p className="cm-post-text">{post.text}</p>
                <div className="cm-post-actions">
                  <button className={`cm-action-btn ${likedPosts[post.id]?'liked':''}`} onClick={() => toggleLike(post.id)}>
                    <IcHeart /> {post.likes+(likedPosts[post.id]?1:0)} Likes
                  </button>
                  <button className="cm-action-btn" onClick={isDemo ? showLocked : undefined}>
                    <IcComment /> {post.comments} Comments
                  </button>
                  <button className="cm-action-btn" onClick={isDemo ? showLocked : undefined}>
                    <IcShare /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
