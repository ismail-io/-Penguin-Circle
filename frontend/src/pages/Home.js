import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────
   DEMO DATA
───────────────────────────────────────── */
const DEMO_COMMUNITY = {
  name: 'Green Residency',
  type: 'Apartment Community',
  id: 'GR-2024-001',
};

const DEMO_MEMBERS = [
  { name: 'Ahmed',   role: 'Member',            avatar: 'A', color: '#4AADE5' },
  { name: 'John',    role: 'Member',            avatar: 'J', color: '#f093fb' },
  { name: 'Sarah',   role: 'Community Admin',   avatar: 'S', color: '#43e97b' },
  { name: 'David',   role: 'Moderator',         avatar: 'D', color: '#fa709a' },
  { name: 'Emma',    role: 'Member',            avatar: 'E', color: '#4facfe' },
  { name: 'Michael', role: 'Member',            avatar: 'M', color: '#a18cd1' },
];

const DEMO_EVENTS = [
  { title: 'Cricket Tournament',       day: 'Sunday',    time: '5:00 PM',  icon: '🏏', color: '#4AADE5' },
  { title: 'Community Meeting',        day: 'Monday',    time: '6:00 PM',  icon: '🤝', color: '#43e97b' },
  { title: 'Cultural Festival',        day: 'Saturday',  time: '7:00 PM',  icon: '🎭', color: '#f093fb' },
  { title: 'Startup Networking Event', day: 'Friday',    time: '4:00 PM',  icon: '🚀', color: '#fa709a' },
];

const DEMO_RESOURCES = [
  { name: 'Projector',        status: 'Available', icon: '📽️', color: '#43e97b' },
  { name: 'Parking Slot',     status: 'Available', icon: '🅿️', color: '#4facfe' },
  { name: 'Community Hall',   status: 'Available', icon: '🏛️', color: '#4AADE5' },
  { name: 'Sports Equipment', status: 'Available', icon: '⚽', color: '#fa709a' },
];

const DEMO_ANNOUNCEMENTS = [
  { text: 'Water maintenance on Saturday.',          icon: '🔧', priority: 'high'   },
  { text: 'Community sports event next weekend.',    icon: '⚽', priority: 'medium' },
  { text: 'New members joined this week.',           icon: '👋', priority: 'low'    },
];

const DEMO_FEED = [
  { name: 'Ahmed',  text: '"Anyone interested in weekend cricket?"',              time: '10m ago', avatar: 'A', color: '#4AADE5' },
  { name: 'Sarah',  text: '"Community meeting scheduled for Monday."',            time: '1h ago',  avatar: 'S', color: '#43e97b' },
  { name: 'John',   text: '"Looking for a projector for presentation."',          time: '3h ago',  avatar: 'J', color: '#f093fb' },
];

const DEMO_STATS = [
  { label: 'Total Members', value: '120', icon: '👥', color: '#4AADE5' },
  { label: 'Events',        value: '12',  icon: '📅', color: '#fa709a' },
  { label: 'Resources',     value: '35',  icon: '📦', color: '#43e97b' },
  { label: 'Posts',         value: '87',  icon: '💬', color: '#4facfe' },
];

const FEATURES = [
  { icon: '🏘️', title: 'Apartments',          desc: 'Manage residents, maintenance, and shared spaces.' },
  { icon: '🎓', title: 'Student Groups',       desc: 'Coordinate study sessions, events, and resources.' },
  { icon: '🚀', title: 'Startup Teams',        desc: 'Collaborate, share tools, and grow together.' },
  { icon: '🎮', title: 'Gaming Groups',        desc: 'Organize tournaments and gaming sessions.' },
  { icon: '⚽', title: 'Sports Clubs',         desc: 'Schedule matches, track members, share gear.' },
  { icon: '🤝', title: 'NGOs',                 desc: 'Coordinate volunteers and community drives.' },
  { icon: '💼', title: 'Professional Networks', desc: 'Connect, network, and share opportunities.' },
  { icon: '🌍', title: 'Local Communities',    desc: 'Unite neighborhoods and local groups.' },
];

const WORKFLOW_STEPS = [
  { icon: '🔐', label: 'Login',                  desc: 'Sign in securely with email or Google' },
  { icon: '🏘️', label: 'Join Community',          desc: 'Connect to your community by ID' },
  { icon: '📅', label: 'View Events',             desc: 'Browse upcoming community events' },
  { icon: '✏️', label: 'Create Event',            desc: 'Admins create and manage events' },
  { icon: '📦', label: 'Add Resource',            desc: 'List shared resources for the community' },
  { icon: '📋', label: 'Request Resource',        desc: 'Members request available resources' },
  { icon: '🔍', label: 'Admin Reviews Request',   desc: 'Admin reviews all incoming requests' },
  { icon: '✅', label: 'Admin Approves Request',  desc: 'Request is approved or declined' },
  { icon: '🎯', label: 'Resource Assigned',       desc: 'Resource is assigned to the member' },
  { icon: '🤝', label: 'Community Collaboration', desc: 'Community grows stronger together' },
];

/* ─────────────────────────────────────────
   FLOWCHART MODAL
───────────────────────────────────────── */
const FlowchartModal = ({ onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="hm-modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Community Connect Workflow"
    >
      <div className="hm-modal">
        <div className="hm-modal-header">
          <div className="hm-modal-title">
            <span className="hm-modal-title-icon">🔄</span>
            Community Connect Workflow
          </div>
          <button className="hm-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="hm-modal-body">
          <div className="hm-flow-grid">
            {WORKFLOW_STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <div className="hm-flow-step" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="hm-flow-step-icon">{step.icon}</div>
                  <div className="hm-flow-step-content">
                    <div className="hm-flow-step-label">{step.label}</div>
                    <div className="hm-flow-step-desc">{step.desc}</div>
                  </div>
                  <div className="hm-flow-step-num">{String(i + 1).padStart(2, '0')}</div>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="hm-flow-arrow">↓</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────── */

// Pre-compute stable particle positions (avoids flicker on re-render)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left:     `${(i * 5.3 + 2) % 100}%`,
  delay:    `${(i * 0.4) % 8}s`,
  duration: `${6 + (i * 0.7) % 8}s`,
  size:     `${2 + (i % 3)}px`,
}));

const Home = () => {
  const navigate = useNavigate();
  const [showFlow, setShowFlow] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Force correct body background when home page is shown (after logout)
  useEffect(() => {
    document.body.style.background = '#0a0d14';
    document.body.style.overflow   = 'auto';
    return () => {
      document.body.style.background = '#0f1117';
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="hm-root">

      {/* ── TOP NAV ── */}
      <nav className={`hm-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="hm-nav-inner">
          <div className="hm-nav-logo" onClick={() => scrollTo('hero')}>
            <span className="hm-nav-logo-icon">🏘️</span>
            <span className="hm-nav-logo-text">Community <strong>Connect</strong></span>
          </div>

          <div className={`hm-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollTo('hero')}>Home</button>
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('demo')}>Demo</button>
            <button onClick={() => scrollTo('about')}>About</button>
          </div>

          <div className="hm-nav-actions">
            <button className="hm-nav-btn-ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="hm-nav-btn-primary" onClick={() => navigate('/register')}>Sign Up</button>
          </div>

          <button
            className="hm-nav-hamburger"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hm-hero" id="hero">
        <div className="hm-hero-bg">
          <div className="hm-hero-orb hm-orb-1" />
          <div className="hm-hero-orb hm-orb-2" />
          <div className="hm-hero-orb hm-orb-3" />
          <div className="hm-hero-particles">
            {PARTICLES.map((p, i) => (
              <div key={i} className="hm-particle" style={{
                left:              p.left,
                animationDelay:    p.delay,
                animationDuration: p.duration,
                width:             p.size,
                height:            p.size,
              }} />
            ))}
          </div>
        </div>

        <div className="hm-hero-content">
          <div className="hm-hero-badge">🌟 Open Source Community Platform</div>
          <h1 className="hm-hero-title">
            Connect, Share,<br />and <span className="hm-hero-gradient">Grow Together</span>
          </h1>
          <p className="hm-hero-subtitle">
            Explore how communities collaborate, organize events, share resources, and stay connected.
            Built for apartments, student groups, startups, sports clubs, and more.
          </p>
          <div className="hm-hero-btns">
            <button className="hm-btn-explore" onClick={() => scrollTo('demo')}>
              <span>🔍</span> Explore Demo
            </button>
            <button className="hm-btn-login" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="hm-btn-signup" onClick={() => navigate('/register')}>
              Sign Up Free
            </button>
          </div>
          <div className="hm-hero-stats">
            {DEMO_STATS.map((s, i) => (
              <div key={i} className="hm-hero-stat">
                <span className="hm-hero-stat-val" style={{ color: s.color }}>{s.value}</span>
                <span className="hm-hero-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="hm-features" id="features">
        <div className="hm-section-inner">
          <div className="hm-section-badge">✨ Supported Communities</div>
          <h2 className="hm-section-title">Built for Every Community</h2>
          <p className="hm-section-sub">
            One platform that adapts to any group — from apartment residents to global professional networks.
          </p>
          <div className="hm-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="hm-feature-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="hm-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO DASHBOARD ── */}
      <section className="hm-demo" id="demo">
        <div className="hm-section-inner">
          <div className="hm-section-badge">🎯 Live Preview</div>
          <h2 className="hm-section-title">Demo Dashboard</h2>
          <p className="hm-section-sub">
            Explore a sample community — no login required.
          </p>

          {/* Demo Login Banner */}
          <div className="hm-demo-banner">
            <div className="hm-demo-banner-left">
              <span className="hm-demo-banner-icon">👁️</span>
              <div>
                <strong>You are currently viewing Demo Mode.</strong>
                <span> Login or Register to access real community data and features.</span>
              </div>
            </div>
            <div className="hm-demo-banner-btns">
              <button onClick={() => navigate('/login')}>Login</button>
              <button className="primary" onClick={() => navigate('/register')}>Register</button>
            </div>
          </div>

          {/* Community Header */}
          <div className="hm-demo-community-header">
            <div className="hm-demo-community-icon">🏘️</div>
            <div>
              <h3>{DEMO_COMMUNITY.name}</h3>
              <span className="hm-demo-community-type">{DEMO_COMMUNITY.type}</span>
              <span className="hm-demo-community-id">ID: {DEMO_COMMUNITY.id}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="hm-demo-stats">
            {DEMO_STATS.map((s, i) => (
              <div key={i} className="hm-demo-stat-card" style={{ '--accent': s.color }}>
                <div className="hm-demo-stat-icon">{s.icon}</div>
                <div className="hm-demo-stat-val">{s.value}</div>
                <div className="hm-demo-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Demo Tabs */}
          <div className="hm-demo-tabs">
            {['feed', 'events', 'resources', 'members', 'announcements'].map(tab => (
              <button
                key={tab}
                className={`hm-demo-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {{ feed: '💬 Feed', events: '📅 Events', resources: '📦 Resources', members: '👥 Members', announcements: '📢 Announcements' }[tab]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="hm-demo-content">

            {activeTab === 'feed' && (
              <div className="hm-demo-feed">
                {DEMO_FEED.map((post, i) => (
                  <div key={i} className="hm-feed-item">
                    <div className="hm-feed-avatar" style={{ background: post.color }}>{post.avatar}</div>
                    <div className="hm-feed-body">
                      <div className="hm-feed-meta">
                        <strong>{post.name}</strong>
                        <span>{post.time}</span>
                      </div>
                      <p>{post.text}</p>
                    </div>
                  </div>
                ))}
                <div className="hm-demo-lock-overlay">
                  <span>🔒</span>
                  <p>Login to post and interact with your community</p>
                  <button onClick={() => navigate('/login')}>Login to Continue</button>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="hm-demo-events">
                {DEMO_EVENTS.map((ev, i) => (
                  <div key={i} className="hm-demo-event-card" style={{ '--accent': ev.color }}>
                    <div className="hm-demo-event-icon">{ev.icon}</div>
                    <div className="hm-demo-event-info">
                      <h4>{ev.title}</h4>
                      <span>📅 {ev.day} · ⏰ {ev.time}</span>
                    </div>
                    <button className="hm-demo-event-btn" onClick={() => navigate('/login')}>Join</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="hm-demo-resources">
                {DEMO_RESOURCES.map((r, i) => (
                  <div key={i} className="hm-demo-resource-card">
                    <div className="hm-demo-resource-icon">{r.icon}</div>
                    <div className="hm-demo-resource-info">
                      <h4>{r.name}</h4>
                      <span className="hm-demo-resource-status available">✅ {r.status}</span>
                    </div>
                    <button className="hm-demo-resource-btn" onClick={() => navigate('/login')}>Request</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="hm-demo-members">
                {DEMO_MEMBERS.map((m, i) => (
                  <div key={i} className="hm-demo-member-card">
                    <div className="hm-demo-member-avatar" style={{ background: m.color }}>{m.avatar}</div>
                    <div className="hm-demo-member-info">
                      <strong>{m.name}</strong>
                      <span className={`hm-demo-member-role ${m.role === 'Community Admin' ? 'admin' : m.role === 'Moderator' ? 'mod' : ''}`}>
                        {m.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="hm-demo-announcements">
                {DEMO_ANNOUNCEMENTS.map((a, i) => (
                  <div key={i} className={`hm-demo-announce-item priority-${a.priority}`}>
                    <span className="hm-demo-announce-icon">{a.icon}</span>
                    <span>{a.text}</span>
                    <span className={`hm-demo-announce-badge ${a.priority}`}>{a.priority}</span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Flowchart Button */}
          <div className="hm-flow-btn-wrap">
            <button className="hm-flow-btn" onClick={() => setShowFlow(true)}>
              <span>🔄</span> How Community Connect Works
            </button>
          </div>

        </div>
      </section>

      {/* ── ABOUT / OPEN SOURCE ── */}
      <section className="hm-about" id="about">
        <div className="hm-section-inner">
          <div className="hm-section-badge">🌐 Open Source</div>
          <h2 className="hm-section-title">Built in the Open</h2>
          <p className="hm-section-sub">
            Community Connect is fully open source. Contribute, fork, and build your own community platform.
          </p>
          <div className="hm-about-grid">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hm-about-card">
              <span className="hm-about-card-icon">⭐</span>
              <h4>GitHub Repository</h4>
              <p>Star, fork, and contribute to the project</p>
            </a>
            <a href="#docs" className="hm-about-card">
              <span className="hm-about-card-icon">📖</span>
              <h4>Documentation</h4>
              <p>Full setup and usage guides</p>
            </a>
            <a href="#api" className="hm-about-card">
              <span className="hm-about-card-icon">🔌</span>
              <h4>API Docs</h4>
              <p>REST API reference and examples</p>
            </a>
            <a href="#guidelines" className="hm-about-card">
              <span className="hm-about-card-icon">📋</span>
              <h4>Community Guidelines</h4>
              <p>How we keep communities safe and healthy</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="hm-footer">
        <div className="hm-footer-inner">
          <div className="hm-footer-brand">
            <span className="hm-footer-logo">🏘️ Community Connect</span>
            <p>Open source platform for every community.</p>
          </div>
          <div className="hm-footer-links">
            <div className="hm-footer-col">
              <h5>Platform</h5>
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <button onClick={() => navigate('/register')}>Sign Up</button>
            </div>
            <div className="hm-footer-col">
              <h5>Open Source</h5>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a href="#docs">Documentation</a>
              <a href="#api">API Docs</a>
            </div>
            <div className="hm-footer-col">
              <h5>Community</h5>
              <a href="#guidelines">Guidelines</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="hm-footer-bottom">
          <span>© 2024 Community Connect · Open Source · MIT License</span>
          <div className="hm-footer-tech">
            <span>React</span><span>Node.js</span><span>MongoDB</span><span>JWT</span>
          </div>
        </div>
      </footer>

      {/* ── FLOWCHART MODAL ── */}
      {showFlow && <FlowchartModal onClose={() => setShowFlow(false)} />}

    </div>
  );
};

export default Home;
