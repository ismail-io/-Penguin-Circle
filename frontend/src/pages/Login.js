import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

/* ── Icons ── */
const IcMail    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IcLock    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcEye     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcEyeOff  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>;
const IcAlert   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcArrow   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

/* ── Network node background (replicates the provided image) ── */
const NetworkBg = () => (
  <div className="lg-network-bg" aria-hidden="true">
    {/* Glowing nodes */}
    {[
      [15,60],[25,35],[40,70],[55,45],[70,65],[80,30],[90,55],[35,20],[65,80],[50,15],
      [20,80],[75,15],[45,55],[30,50],[85,70],[10,40],[60,25],[50,85],[25,65],[70,40],
    ].map(([x,y],i) => (
      <div key={i} className="lg-node" style={{ left:`${x}%`, top:`${y}%`, animationDelay:`${i*0.3}s` }} />
    ))}
    {/* Silhouette figures */}
    {[
      [20,55],[40,40],[60,50],[75,35],[85,60],[30,70],[50,25],[10,65],
    ].map(([x,y],i) => (
      <div key={i} className="lg-figure" style={{ left:`${x}%`, top:`${y}%`, animationDelay:`${i*0.5}s` }}>
        <svg viewBox="0 0 40 56" fill="none">
          <ellipse cx="20" cy="34" rx="14" ry="18" fill="#1a1a2e"/>
          <ellipse cx="20" cy="36" rx="9" ry="14" fill="#e8ecf1" opacity="0.25"/>
          <circle cx="20" cy="14" r="10" fill="#1a1a2e"/>
          <circle cx="16" cy="12" r="2" fill="#00d4ff"/>
          <circle cx="24" cy="12" r="2" fill="#00d4ff"/>
          <circle cx="16.5" cy="11.5" r="0.7" fill="#fff"/>
          <circle cx="24.5" cy="11.5" r="0.7" fill="#fff"/>
          <polygon points="18,15 22,15 20,19" fill="#ffaa00"/>
          <ellipse cx="5" cy="32" rx="4" ry="10" fill="#1a1a2e" transform="rotate(-10 5 32)"/>
          <ellipse cx="35" cy="32" rx="4" ry="10" fill="#1a1a2e" transform="rotate(10 35 32)"/>
          <ellipse cx="14" cy="52" rx="5" ry="2.5" fill="#ffaa00"/>
          <ellipse cx="26" cy="52" rx="5" ry="2.5" fill="#ffaa00"/>
        </svg>
      </div>
    ))}
    {/* Connection lines via SVG */}
    <svg className="lg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1="15" y1="60" x2="25" y2="35" /><line x1="25" y1="35" x2="40" y2="70" />
      <line x1="40" y1="70" x2="55" y2="45" /><line x1="55" y1="45" x2="70" y2="65" />
      <line x1="70" y1="65" x2="80" y2="30" /><line x1="80" y1="30" x2="90" y2="55" />
      <line x1="25" y1="35" x2="55" y2="45" /><line x1="40" y1="70" x2="70" y2="65" />
      <line x1="15" y1="60" x2="40" y2="70" /><line x1="55" y1="45" x2="80" y2="30" />
      <line x1="35" y1="20" x2="55" y2="45" /><line x1="65" y1="80" x2="55" y2="45" />
      <line x1="20" y1="80" x2="40" y2="70" /><line x1="75" y1="15" x2="80" y2="30" />
      <line x1="50" y1="15" x2="35" y2="20" /><line x1="85" y1="70" x2="70" y2="65" />
      <line x1="10" y1="40" x2="25" y2="35" /><line x1="60" y1="25" x2="55" y2="45" />
    </svg>
  </div>
);

const Login = () => {
  const [form,        setForm]        = useState({ email:'', password:'' });
  const [showPw,      setShowPw]      = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('cc_remember');
    if (saved) {
      try { const { email } = JSON.parse(saved); setForm(p => ({ ...p, email })); setRememberMe(true); }
      catch (_) {}
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email)                         e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                      e.password = 'Password is required';
    setFieldErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data;
      if (rememberMe) localStorage.setItem('cc_remember', JSON.stringify({ email: form.email }));
      else localStorage.removeItem('cc_remember');
      setSuccess('Login successful! Redirecting…');
      login(user, token);
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(''); setLoading(true);
    try {
      const res = await authAPI.googleAuth(credentialResponse.credential);
      const { isNewUser, token, user, googleData } = res.data;
      if (isNewUser) { navigate('/google-onboarding', { state: { googleData } }); }
      else { setSuccess('Google Sign-In successful!'); login(user, token); setTimeout(() => navigate('/dashboard'), 700); }
    } catch (err) { setError(err.response?.data?.message || 'Google Sign-In failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="lg-root">
      <NetworkBg />
      <div className="lg-overlay" />

      {/* Back to home */}
      <button className="lg-back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="lg-center">
        <div className="lg-card">

          {/* Logo */}
          <div className="lg-logo">
            <div className="lg-logo-icon">🐧</div>
            <div className="lg-logo-text">
              <span>Penguin</span><strong>Circle</strong>
            </div>
          </div>

          <h1 className="lg-title">Welcome Back</h1>
          <p className="lg-subtitle">Sign in to your community account</p>

          {/* Notification banner */}
          <div className="lg-info-banner">
            <span>🔒</span>
            <span>Login or Register to access your own community and real-time data.</span>
          </div>

          {/* Messages */}
          {error   && <div className="lg-msg error"  ><IcAlert /> {error}</div>}
          {success && <div className="lg-msg success"><IcCheck /> {success}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="lg-field">
              <label>Email Address</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon"><IcMail /></span>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  autoComplete="email" className={fieldErrors.email ? 'err' : ''}
                />
              </div>
              {fieldErrors.email && <span className="lg-field-err"><IcAlert />{fieldErrors.email}</span>}
            </div>

            {/* Password */}
            <div className="lg-field">
              <label>Password</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon"><IcLock /></span>
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Enter your password"
                  autoComplete="current-password" className={fieldErrors.password ? 'err' : ''}
                />
                <button type="button" className="lg-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <IcEyeOff /> : <IcEye />}
                </button>
              </div>
              {fieldErrors.password && <span className="lg-field-err"><IcAlert />{fieldErrors.password}</span>}
            </div>

            {/* Remember / Forgot */}
            <div className="lg-extras">
              <label className="lg-remember">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="lg-forgot" onClick={() => setError('Password reset coming soon.')}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="lg-submit-btn" disabled={loading}>
              {loading
                ? <><span className="lg-spinner" /> Signing in…</>
                : <><span>Sign In</span><IcArrow /></>
              }
            </button>

            {/* Divider */}
            <div className="lg-divider"><span>or continue with</span></div>

            {/* Google */}
            <div className="lg-google-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-In failed. Try again.')}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                width="360"
              />
            </div>

          </form>

          {/* Footer */}
          <div className="lg-footer">
            <span>Don't have an account?</span>
            <button onClick={() => navigate('/register')}>Create Account</button>
          </div>

          <p className="lg-terms">
            By signing in you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
