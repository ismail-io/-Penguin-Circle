import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './LandingPage.css';

/* ── Icons ── */
const IcMail   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IcLock   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>;
const IcAlert  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcCheck  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcUser   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcGlobe  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IcArrow  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

/* ── Stable node positions ── */
const NODES = [
  [15,60],[25,35],[40,70],[55,45],[70,65],[80,30],[90,55],[35,20],[65,80],[50,15],
  [20,80],[75,15],[45,55],[30,50],[85,70],[10,40],[60,25],[50,85],[25,65],[70,40],
  [5,25],[95,35],[42,90],[78,85],[12,90],
];
const FIGURES = [
  [20,55],[40,40],[60,50],[75,35],[85,60],[30,70],[50,25],[10,65],[65,20],[88,78],
];
/* Penguin SVG figure for background */
const PenguinFigure = () => (
  <svg viewBox="0 0 40 56" fill="none">
    {/* Body */}
    <ellipse cx="20" cy="34" rx="14" ry="18" fill="#1a1a2e"/>
    {/* Belly */}
    <ellipse cx="20" cy="36" rx="9" ry="14" fill="#e8ecf1" opacity="0.25"/>
    {/* Head */}
    <circle cx="20" cy="14" r="10" fill="#1a1a2e"/>
    {/* Eyes */}
    <circle cx="16" cy="12" r="2" fill="#00d4ff"/>
    <circle cx="24" cy="12" r="2" fill="#00d4ff"/>
    <circle cx="16.5" cy="11.5" r="0.7" fill="#fff"/>
    <circle cx="24.5" cy="11.5" r="0.7" fill="#fff"/>
    {/* Beak */}
    <polygon points="18,15 22,15 20,19" fill="#ffaa00"/>
    {/* Flippers */}
    <ellipse cx="5" cy="32" rx="4" ry="10" fill="#1a1a2e" transform="rotate(-10 5 32)"/>
    <ellipse cx="35" cy="32" rx="4" ry="10" fill="#1a1a2e" transform="rotate(10 35 32)"/>
    {/* Feet */}
    <ellipse cx="14" cy="52" rx="5" ry="2.5" fill="#ffaa00"/>
    <ellipse cx="26" cy="52" rx="5" ry="2.5" fill="#ffaa00"/>
  </svg>
);
const LINES = [
  [15,60,25,35],[25,35,40,70],[40,70,55,45],[55,45,70,65],[70,65,80,30],[80,30,90,55],
  [25,35,55,45],[40,70,70,65],[15,60,40,70],[55,45,80,30],[35,20,55,45],[65,80,55,45],
  [20,80,40,70],[75,15,80,30],[50,15,35,20],[85,70,70,65],[10,40,25,35],[60,25,55,45],
  [45,55,55,45],[30,50,25,35],[5,25,15,60],[95,35,80,30],[42,90,65,80],[78,85,85,70],
];

const COMMUNITY_TYPES = [
  'Apartment','Local Community','Student Group','Startup Team',
  'Gaming Group','Sports Club','NGO / Volunteer Group','Professional Network','Other',
];

/* ── Password strength ── */
const pwStrength = pw => {
  if (!pw) return { score:0, label:'', color:'transparent', pct:'0%' };
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const m = [
    { label:'',          color:'transparent', pct:'0%'   },
    { label:'Weak',      color:'#ef4444',     pct:'20%'  },
    { label:'Fair',      color:'#f97316',     pct:'40%'  },
    { label:'Good',      color:'#eab308',     pct:'60%'  },
    { label:'Strong',    color:'#22c55e',     pct:'80%'  },
    { label:'Very Strong',color:'#10b981',    pct:'100%' },
  ];
  return m[s];
};

const LandingPage = ({ initialModal }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [modal,       setModal]       = useState(initialModal); // 'login' | 'register' | null
  const [tab,         setTab]         = useState(initialModal === 'register' ? 'register' : 'login');
  const [showPw,      setShowPw]      = useState(false);
  const [showPw2,     setShowPw2]     = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  /* Login form */
  const [loginForm, setLoginForm] = useState({ email:'', password:'' });

  /* Register form */
  const [regForm, setRegForm] = useState({
    name:'', email:'', password:'', confirmPassword:'',
    communityType:'', communityName:'', communityId:'',
  });

  const strength = pwStrength(regForm.password);

  /* Pre-fill remembered email */
  useEffect(() => {
    const saved = localStorage.getItem('cc_remember');
    if (saved) {
      try { const { email } = JSON.parse(saved); setLoginForm(p => ({ ...p, email })); setRememberMe(true); }
      catch (_) {}
    }
  }, []);

  /* Sync tab with modal */
  useEffect(() => { if (modal) setTab(modal); }, [modal]);

  const openModal  = (t) => { setModal(t); setTab(t); setError(''); setSuccess(''); setFieldErrors({}); };
  const closeModal = ()  => { setModal(null); setError(''); setSuccess(''); };

  /* ── Login submit ── */
  const handleLogin = async e => {
    e.preventDefault();
    const errs = {};
    if (!loginForm.email)    errs.email    = 'Email is required';
    if (!loginForm.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true); setError('');
    try {
      const res = await authAPI.login(loginForm);
      const { token, user } = res.data;
      if (rememberMe) localStorage.setItem('cc_remember', JSON.stringify({ email: loginForm.email }));
      else localStorage.removeItem('cc_remember');
      setSuccess('Login successful!');
      login(user, token);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  /* ── Register submit ── */
  const handleRegister = async e => {
    e.preventDefault();
    const errs = {};
    if (!regForm.name.trim())          errs.name          = 'Name is required';
    if (!regForm.email)                errs.email         = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regForm.email)) errs.email = 'Enter a valid email';
    if (!regForm.password)             errs.password      = 'Password is required';
    else if (regForm.password.length < 6) errs.password   = 'Minimum 6 characters';
    if (regForm.password !== regForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!regForm.communityType)        errs.communityType = 'Select a community type';
    if (!regForm.communityName.trim()) errs.communityName = 'Community name is required';
    if (!regForm.communityId.trim())   errs.communityId   = 'Community ID is required';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true); setError('');
    try {
      const res = await authAPI.register({
        name: regForm.name.trim(), email: regForm.email.trim(),
        password: regForm.password,
        communityType: regForm.communityType,
        communityName: regForm.communityName.trim(),
        apartmentId:   regForm.communityId.trim(),
      });
      const { token, user } = res.data;
      setSuccess('Account created!');
      login(user, token);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  /* ── Google auth ── */
  const handleGoogle = async (credentialResponse) => {
    setError(''); setLoading(true);
    try {
      const res = await authAPI.googleAuth(credentialResponse.credential);
      const { isNewUser, token, user, googleData } = res.data;
      if (isNewUser) { navigate('/google-onboarding', { state: { googleData } }); }
      else { login(user, token); navigate('/dashboard'); }
    } catch (err) { setError(err.response?.data?.message || 'Google Sign-In failed.'); }
    finally { setLoading(false); }
  };

  const lc = (name, val) => { setLoginForm(p => ({ ...p, [name]: val })); if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' })); if (error) setError(''); };
  const rc = (name, val) => { setRegForm(p => ({ ...p, [name]: val }));   if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' })); if (error) setError(''); };

  return (
    <div className="lp-root">

      {/* ══ NETWORK BACKGROUND ══ */}
      <div className="lp-bg">
        {/* Gradient layers */}
        <div className="lp-bg-gradient" />

        {/* SVG connection lines */}
        <svg className="lp-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {LINES.map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </svg>

        {/* Glowing nodes */}
        {NODES.map(([x,y], i) => (
          <div key={i} className={`lp-node ${i%5===4?'orange':''}`}
            style={{ left:`${x}%`, top:`${y}%`, animationDelay:`${(i*0.31)%4}s` }} />
        ))}

        {/* Silhouette figures */}
        {FIGURES.map(([x,y], i) => (
          <div key={i} className="lp-figure"
            style={{ left:`${x}%`, top:`${y}%`, animationDelay:`${(i*0.5)%5}s` }}>
            <PenguinFigure />
          </div>
        ))}
      </div>

      {/* ══ TOP NAVIGATION ══ */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <span>🐧</span>
          <span>Penguin <strong>Circle</strong></span>
        </div>
        <div className="lp-nav-links">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/dashboard')}>About</button>
          <button onClick={() => navigate('/dashboard')}>Services</button>
          <button onClick={() => navigate('/dashboard')}>Contact</button>
        </div>
        <button className="lp-nav-login-btn" onClick={() => openModal('login')}>
          Login
        </button>
      </nav>

      {/* ══ HERO TEXT ══ */}
      <div className="lp-hero">
        <div className="lp-hero-badge">🐧 Penguin Circle Community Platform</div>
        <h1 className="lp-hero-title">
          Waddle In &<br />
          <span className="lp-hero-gradient">Connect Together</span>
        </h1>
        <p className="lp-hero-sub">
          Join the coolest community — apartments, startups, sports clubs, student groups and more. Huddle up with Penguin Circle!
        </p>
        <div className="lp-hero-btns">
          <button className="lp-btn-primary" onClick={() => openModal('login')}>
            Get Started <IcArrow />
          </button>
          <button className="lp-btn-ghost" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
        </div>
      </div>

      {/* ══ LOGIN / REGISTER MODAL ══ */}
      {modal && (
        <div className="lp-modal-overlay" onClick={e => { if (e.target.classList.contains('lp-modal-overlay')) closeModal(); }}>
          <div className="lp-modal">

            {/* Logo */}
            <div className="lp-modal-logo">
              <div className="lp-modal-logo-icon">🐧</div>
              <div>
                <div className="lp-modal-logo-name">Penguin <strong>Circle</strong></div>
                <div className="lp-modal-logo-sub">Your community platform</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="lp-modal-tabs">
              <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); setFieldErrors({}); }}>
                Login
              </button>
              <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); setFieldErrors({}); }}>
                Register
              </button>
            </div>

            {/* Messages */}
            {error   && <div className="lp-msg error"  ><IcAlert /> {error}</div>}
            {success && <div className="lp-msg success"><IcCheck /> {success}</div>}

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} noValidate>
                <div className="lp-field">
                  <label>Email Address</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IcMail /></span>
                    <input type="email" value={loginForm.email} onChange={e => lc('email', e.target.value)}
                      placeholder="you@example.com" autoComplete="email" className={fieldErrors.email?'err':''} />
                  </div>
                  {fieldErrors.email && <span className="lp-field-err"><IcAlert />{fieldErrors.email}</span>}
                </div>

                <div className="lp-field">
                  <label>Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IcLock /></span>
                    <input type={showPw?'text':'password'} value={loginForm.password} onChange={e => lc('password', e.target.value)}
                      placeholder="Enter your password" autoComplete="current-password" className={fieldErrors.password?'err':''} />
                    <button type="button" className="lp-pw-toggle" onClick={() => setShowPw(v=>!v)}>
                      {showPw ? <IcEyeOff /> : <IcEye />}
                    </button>
                  </div>
                  {fieldErrors.password && <span className="lp-field-err"><IcAlert />{fieldErrors.password}</span>}
                </div>

                <div className="lp-extras">
                  <label className="lp-remember">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="lp-forgot" onClick={() => setError('Password reset coming soon.')}>
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="lp-submit-btn" disabled={loading}>
                  {loading ? <><span className="lp-spinner"/>Signing in…</> : <><span>Login</span><IcArrow /></>}
                </button>

                <div className="lp-divider"><span>or continue with</span></div>
                <div className="lp-google-wrap">
                  <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google Sign-In failed.')}
                    theme="filled_black" shape="rectangular" size="large" text="continue_with" width="340" />
                </div>

                <p className="lp-switch">
                  Don't have an account? <button type="button" onClick={() => { setTab('register'); setError(''); setFieldErrors({}); }}>Create Account</button>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} noValidate>
                <div className="lp-form-row">
                  <div className="lp-field">
                    <label>Full Name</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><IcUser /></span>
                      <input type="text" value={regForm.name} onChange={e => rc('name', e.target.value)}
                        placeholder="John Doe" className={fieldErrors.name?'err':''} />
                    </div>
                    {fieldErrors.name && <span className="lp-field-err"><IcAlert />{fieldErrors.name}</span>}
                  </div>
                  <div className="lp-field">
                    <label>Email</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><IcMail /></span>
                      <input type="email" value={regForm.email} onChange={e => rc('email', e.target.value)}
                        placeholder="you@example.com" className={fieldErrors.email?'err':''} />
                    </div>
                    {fieldErrors.email && <span className="lp-field-err"><IcAlert />{fieldErrors.email}</span>}
                  </div>
                </div>

                <div className="lp-form-row">
                  <div className="lp-field">
                    <label>Password</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><IcLock /></span>
                      <input type={showPw?'text':'password'} value={regForm.password} onChange={e => rc('password', e.target.value)}
                        placeholder="Min. 6 characters" className={fieldErrors.password?'err':''} />
                      <button type="button" className="lp-pw-toggle" onClick={() => setShowPw(v=>!v)}>
                        {showPw ? <IcEyeOff /> : <IcEye />}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="lp-field-err"><IcAlert />{fieldErrors.password}</span>}
                    {regForm.password && (
                      <div className="lp-pw-strength">
                        <div className="lp-pw-bar"><div style={{ width:strength.pct, background:strength.color }} /></div>
                        <span style={{ color:strength.color }}>{strength.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="lp-field">
                    <label>Confirm Password</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><IcLock /></span>
                      <input type={showPw2?'text':'password'} value={regForm.confirmPassword} onChange={e => rc('confirmPassword', e.target.value)}
                        placeholder="Re-enter password" className={fieldErrors.confirmPassword?'err':''} />
                      <button type="button" className="lp-pw-toggle" onClick={() => setShowPw2(v=>!v)}>
                        {showPw2 ? <IcEyeOff /> : <IcEye />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <span className="lp-field-err"><IcAlert />{fieldErrors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="lp-field">
                  <label>Community Type</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon"><IcGlobe /></span>
                    <select value={regForm.communityType} onChange={e => rc('communityType', e.target.value)} className={fieldErrors.communityType?'err':''}>
                      <option value="">Select community type</option>
                      {COMMUNITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {fieldErrors.communityType && <span className="lp-field-err"><IcAlert />{fieldErrors.communityType}</span>}
                </div>

                <div className="lp-form-row">
                  <div className="lp-field">
                    <label>Community Name</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><IcUser /></span>
                      <input type="text" value={regForm.communityName} onChange={e => rc('communityName', e.target.value)}
                        placeholder="e.g. Green Residency" className={fieldErrors.communityName?'err':''} />
                    </div>
                    {fieldErrors.communityName && <span className="lp-field-err"><IcAlert />{fieldErrors.communityName}</span>}
                  </div>
                  <div className="lp-field">
                    <label>Community ID</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><IcUser /></span>
                      <input type="text" value={regForm.communityId} onChange={e => rc('communityId', e.target.value)}
                        placeholder="e.g. APT001" className={fieldErrors.communityId?'err':''} />
                    </div>
                    {fieldErrors.communityId && <span className="lp-field-err"><IcAlert />{fieldErrors.communityId}</span>}
                  </div>
                </div>

                <button type="submit" className="lp-submit-btn" disabled={loading}>
                  {loading ? <><span className="lp-spinner"/>Creating account…</> : <><span>Create Account</span><IcArrow /></>}
                </button>

                <div className="lp-divider"><span>or sign up with</span></div>
                <div className="lp-google-wrap">
                  <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google Sign-In failed.')}
                    theme="filled_black" shape="rectangular" size="large" text="signup_with" width="340" />
                </div>

                <p className="lp-switch">
                  Already have an account? <button type="button" onClick={() => { setTab('login'); setError(''); setFieldErrors({}); }}>Sign In</button>
                </p>
              </form>
            )}

            {/* Close button */}
            <button className="lp-modal-close" onClick={closeModal} aria-label="Close">✕</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
