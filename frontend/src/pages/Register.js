import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

/* ── SVG Icons ── */
const IconUser    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconLock    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconId      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
const IconGlobe   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconEdit    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconEye     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>;
const IconAlert   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconUsers   = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

/* ── Particles ── */
const Particles = () => {
  const items = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: `${2 + Math.random() * 4}px`,
  }));
  return (
    <div className="auth-particles">
      {items.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, bottom: '-10px', width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }} />
      ))}
    </div>
  );
};

/* ── Community types ── */
const COMMUNITY_TYPES = [
  'Apartment',
  'Local Community',
  'Student Group',
  'Startup Team',
  'Gaming Group',
  'Sports Club',
  'NGO / Volunteer Group',
  'Professional Network',
  'Tech Community',
  'Business Community',
  'Educational Institution',
  'Freelancer Group',
  'Creator Community',
  'Fitness Club',
  'Religious Organization',
  'Cultural Association',
  'Social Club',
  'Other',
];

/* ── Password strength ── */
const getStrength = pw => {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '',         color: 'transparent',  pct: '0%'   },
    { label: 'Weak',     color: '#ef4444',       pct: '20%'  },
    { label: 'Fair',     color: '#f97316',       pct: '40%'  },
    { label: 'Good',     color: '#eab308',       pct: '60%'  },
    { label: 'Strong',   color: '#22c55e',       pct: '80%'  },
    { label: 'Very Strong', color: '#10b981',    pct: '100%' },
  ];
  return map[score];
};

/* ══════════════════════════════════════════
   REGISTER COMPONENT
══════════════════════════════════════════ */
const Register = () => {
  const [formData, setFormData] = useState({
    name:            '',
    email:           '',
    userId:          '',
    password:        '',
    confirmPassword: '',
    communityType:   '',
    customCommunity: '',
    apartmentId:     '',
  });

  const [showPw,        setShowPw]        = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [fieldErrors,   setFieldErrors]   = useState({});

  const { login } = useAuth();
  const navigate  = useNavigate();

  const strength = getStrength(formData.password);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!formData.name.trim())                          errs.name            = 'Full name is required';
    if (!formData.email)                                errs.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))     errs.email           = 'Enter a valid email';
    if (!formData.userId.trim())                        errs.userId          = 'User ID is required';
    if (!formData.password)                             errs.password        = 'Password is required';
    else if (formData.password.length < 6)              errs.password        = 'Minimum 6 characters';
    if (!formData.confirmPassword)                      errs.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.communityType)                        errs.communityType   = 'Please select a community type';
    if (formData.communityType === 'Other' && !formData.customCommunity.trim())
                                                        errs.customCommunity = 'Please enter your community name';
    if (!formData.apartmentId.trim())                   errs.apartmentId     = 'Community / Apartment ID is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name:          formData.name.trim(),
        email:         formData.email.trim(),
        password:      formData.password,
        apartmentId:   formData.apartmentId.trim(),
        communityType: formData.communityType === 'Other'
                         ? formData.customCommunity.trim()
                         : formData.communityType,
        userId:        formData.userId.trim(),
      };

      const res = await authAPI.register(payload);
      const { token, user } = res.data;

      setSuccess('Account created! Redirecting to dashboard…');
      login(user, token);
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.googleAuth(credentialResponse.credential);
      const { token, user } = res.data;
      setSuccess('Google Sign-In successful! Redirecting…');
      login(user, token);
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign-In failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  /* ── Field helper ── */
  const Field = ({ id, label, icon: Icon, children, error: err }) => (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {Icon && <span className="input-icon"><Icon /></span>}
        {children}
      </div>
      {err && <span className="field-error"><IconAlert />{err}</span>}
    </div>
  );

  return (
    <div className="auth-page">
      <Particles />
      <div className="auth-blob-mid" />

      <div className="auth-wrapper">
        <div className="auth-card">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-icon"><IconUsers /></div>
            <h1>Penguin Circle</h1>
            <p>Create your community account</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className="auth-tab" onClick={() => navigate('/login')}>Sign In</button>
            <button className="auth-tab active">Register</button>
          </div>

          {/* Messages */}
          {error   && <div className="auth-message error"  ><IconAlert /> {error}</div>}
          {success && <div className="auth-message success"><IconCheck /> {success}</div>}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Name + User ID */}
            <div className="form-row">
              <Field id="reg-name" label="Full Name" icon={IconUser} error={fieldErrors.name}>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </Field>

              <Field id="reg-userid" label="User ID" icon={IconId} error={fieldErrors.userId}>
                <input
                  id="reg-userid"
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="john_doe_42"
                  autoComplete="username"
                />
              </Field>
            </div>

            {/* Email */}
            <Field id="reg-email" label="Gmail Address" icon={IconMail} error={fieldErrors.email}>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                autoComplete="email"
              />
            </Field>

            {/* Password */}
            <Field id="reg-password" label="Password" icon={IconLock} error={fieldErrors.password}>
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </Field>

            {/* Strength bar */}
            {formData.password && (
              <div className="pw-strength">
                <div className="pw-strength-bar">
                  <div className="pw-strength-fill" style={{ width: strength.pct, background: strength.color }} />
                </div>
                <div className="pw-strength-label" style={{ color: strength.color }}>{strength.label}</div>
              </div>
            )}

            {/* Confirm Password */}
            <Field id="reg-confirm" label="Confirm Password" icon={IconLock} error={fieldErrors.confirmPassword}>
              <input
                id="reg-confirm"
                type={showConfirmPw ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              <button type="button" className="pw-toggle" onClick={() => setShowConfirmPw(v => !v)} aria-label="Toggle confirm password">
                {showConfirmPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </Field>

            {/* Community Type */}
            <div className="form-field">
              <label htmlFor="reg-community">Community Type</label>
              <div className="input-wrap">
                <span className="input-icon"><IconGlobe /></span>
                <select
                  id="reg-community"
                  name="communityType"
                  value={formData.communityType}
                  onChange={handleChange}
                  style={{ paddingRight: '36px' }}
                >
                  <option value="">Select Community</option>
                  {COMMUNITY_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {fieldErrors.communityType && <span className="field-error"><IconAlert />{fieldErrors.communityType}</span>}
            </div>

            {/* Custom community name (shown when "Other" selected) */}
            {formData.communityType === 'Other' && (
              <Field id="reg-custom" label="Enter Community Name" icon={IconEdit} error={fieldErrors.customCommunity}>
                <input
                  id="reg-custom"
                  type="text"
                  name="customCommunity"
                  value={formData.customCommunity}
                  onChange={handleChange}
                  placeholder="e.g. Sunrise Residents Group"
                />
              </Field>
            )}

            {/* Apartment / Community ID */}
            <Field id="reg-apt" label="Community / Apartment ID" icon={IconId} error={fieldErrors.apartmentId}>
              <input
                id="reg-apt"
                type="text"
                name="apartmentId"
                value={formData.apartmentId}
                onChange={handleChange}
                placeholder="Enter your community ID"
              />
            </Field>

            {/* Submit */}
            <button type="submit" className="btn-submit" disabled={loading}>
              <span>
                {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
              </span>
            </button>

            {/* Divider */}
            <div className="auth-divider"><span>or sign up with</span></div>

            {/* Google */}
            <div className="google-btn-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="signup_with"
                width="400"
              />
            </div>

          </form>

          {/* Footer */}
          <p className="auth-footer">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')}>Sign in</button>
          </p>

          <p className="auth-terms">
            By registering you agree to our{' '}
            <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
