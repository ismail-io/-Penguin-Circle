import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import './GoogleOnboarding.css';

/* ── Icons ── */
const IconUser   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconGlobe  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconId     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
const IconHome   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconEdit   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconAlert  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconCheck  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconArrow  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IconStar   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

/* ── Community types ── */
const COMMUNITY_TYPES = [
  'Apartment','Local Community','Student Group','Startup Team',
  'Gaming Group','Sports Club','NGO / Volunteer Group','Professional Network',
  'Tech Community','Business Community','Educational Institution',
  'Freelancer Group','Creator Community','Fitness Club',
  'Religious Organization','Cultural Association','Social Club','Other',
];

const ROLES = ['Member', 'Community Admin', 'Moderator'];

/* ── Particles ── */
const Particles = () => {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: `${2 + Math.random() * 3}px`,
  }));
  return (
    <div className="ob-particles">
      {items.map(p => (
        <div key={p.id} className="ob-particle" style={{ left: p.left, bottom: '-10px', width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }} />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   GOOGLE ONBOARDING
══════════════════════════════════════════ */
const GoogleOnboarding = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  // Get Google data passed from Login page
  const googleData = location.state?.googleData;

  const [form, setForm] = useState({
    name:            googleData?.name    || '',
    email:           googleData?.email   || '',
    communityType:   '',
    customCommunity: '',
    communityId:     '',
    communityName:   '',
    role:            'Member',
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if no Google data (direct URL access)
  useEffect(() => {
    if (!googleData) {
      navigate('/login');
    }
  }, [googleData, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name          = 'Full name is required';
    if (!form.communityType)        e.communityType  = 'Please select a community type';
    if (form.communityType === 'Other' && !form.customCommunity.trim())
                                    e.customCommunity = 'Please enter your community name';
    if (!form.communityId.trim())   e.communityId    = 'Community / Apartment ID is required';
    if (!form.communityName.trim()) e.communityName  = 'Community name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        googleId:      googleData.googleId,
        name:          form.name.trim(),
        email:         form.email,
        avatar:        googleData.avatar,
        communityType: form.communityType === 'Other'
                         ? form.customCommunity.trim()
                         : form.communityType,
        communityId:   form.communityId.trim(),
        communityName: form.communityName.trim(),
        role:          form.role,
      };

      const res = await authAPI.googleComplete(payload);
      const { token, user } = res.data;

      setSuccess('Profile complete! Welcome to your community 🎉');
      login(user, token);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!googleData) return null;

  return (
    <div className="ob-page">
      <Particles />
      <div className="ob-blob ob-blob-1" />
      <div className="ob-blob ob-blob-2" />

      <div className="ob-wrapper">
        <div className="ob-card">

          {/* Progress bar */}
          <div className="ob-progress">
            <div className="ob-step ob-step-done">
              <div className="ob-step-circle"><IconCheck /></div>
              <span>Google Sign-In</span>
            </div>
            <div className="ob-step-line ob-step-line-done" />
            <div className="ob-step ob-step-active">
              <div className="ob-step-circle"><IconStar /></div>
              <span>Complete Profile</span>
            </div>
          </div>

          {/* Google profile preview */}
          <div className="ob-profile-preview">
            <div className="ob-avatar-wrap">
              {googleData.avatar ? (
                <img src={googleData.avatar} alt={googleData.name} className="ob-avatar" referrerPolicy="no-referrer" />
              ) : (
                <div className="ob-avatar-fallback">
                  {googleData.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ob-avatar-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div className="ob-profile-info">
              <h2>Complete Your Community Profile</h2>
              <p>Signed in as <strong>{googleData.email}</strong></p>
            </div>
          </div>

          {/* Step label */}
          <div className="ob-step-label">
            <span className="ob-step-badge">Step 2 of 2</span>
            <span className="ob-step-text">Tell us about your community</span>
          </div>

          {/* Messages */}
          {error   && <div className="ob-message ob-error"  ><IconAlert /> {error}</div>}
          {success && <div className="ob-message ob-success"><IconCheck /> {success}</div>}

          {/* Form */}
          <form className="ob-form" onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="ob-field">
              <label htmlFor="ob-name">Full Name</label>
              <div className="ob-input-wrap">
                <span className="ob-icon"><IconUser /></span>
                <input
                  id="ob-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              {errors.name && <span className="ob-field-error"><IconAlert />{errors.name}</span>}
            </div>

            {/* Email (read-only) */}
            <div className="ob-field">
              <label htmlFor="ob-email">
                Email Address
                <span className="ob-readonly-badge">from Google</span>
              </label>
              <div className="ob-input-wrap">
                <span className="ob-icon"><IconMail /></span>
                <input
                  id="ob-email"
                  type="email"
                  value={form.email}
                  readOnly
                  className="ob-readonly"
                />
              </div>
            </div>

            {/* Community Type */}
            <div className="ob-field">
              <label htmlFor="ob-community-type">Community Type <span className="ob-required">*</span></label>
              <div className="ob-input-wrap">
                <span className="ob-icon"><IconGlobe /></span>
                <select
                  id="ob-community-type"
                  name="communityType"
                  value={form.communityType}
                  onChange={handleChange}
                  style={{ paddingRight: '36px' }}
                >
                  <option value="">Select Community Type</option>
                  {COMMUNITY_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="ob-select-arrow">▾</span>
              </div>
              {errors.communityType && <span className="ob-field-error"><IconAlert />{errors.communityType}</span>}
            </div>

            {/* Custom community type (if Other) */}
            {form.communityType === 'Other' && (
              <div className="ob-field ob-field-indent">
                <label htmlFor="ob-custom">Custom Community Type <span className="ob-required">*</span></label>
                <div className="ob-input-wrap">
                  <span className="ob-icon"><IconEdit /></span>
                  <input
                    id="ob-custom"
                    type="text"
                    name="customCommunity"
                    value={form.customCommunity}
                    onChange={handleChange}
                    placeholder="e.g. Sunrise Residents Group"
                  />
                </div>
                {errors.customCommunity && <span className="ob-field-error"><IconAlert />{errors.customCommunity}</span>}
              </div>
            )}

            {/* Two column row */}
            <div className="ob-row">
              {/* Community ID */}
              <div className="ob-field">
                <label htmlFor="ob-community-id">Community / Apartment ID <span className="ob-required">*</span></label>
                <div className="ob-input-wrap">
                  <span className="ob-icon"><IconId /></span>
                  <input
                    id="ob-community-id"
                    type="text"
                    name="communityId"
                    value={form.communityId}
                    onChange={handleChange}
                    placeholder="e.g. APT-2024-001"
                  />
                </div>
                {errors.communityId && <span className="ob-field-error"><IconAlert />{errors.communityId}</span>}
              </div>

              {/* Community Name */}
              <div className="ob-field">
                <label htmlFor="ob-community-name">Community Name <span className="ob-required">*</span></label>
                <div className="ob-input-wrap">
                  <span className="ob-icon"><IconHome /></span>
                  <input
                    id="ob-community-name"
                    type="text"
                    name="communityName"
                    value={form.communityName}
                    onChange={handleChange}
                    placeholder="e.g. Sunrise Apartments"
                  />
                </div>
                {errors.communityName && <span className="ob-field-error"><IconAlert />{errors.communityName}</span>}
              </div>
            </div>

            {/* Role */}
            <div className="ob-field">
              <label>Your Role</label>
              <div className="ob-role-group">
                {ROLES.map(r => (
                  <label key={r} className={`ob-role-option ${form.role === r ? 'ob-role-selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={form.role === r}
                      onChange={handleChange}
                    />
                    <span className="ob-role-icon">
                      {r === 'Member'          && <IconUser />}
                      {r === 'Community Admin' && <IconShield />}
                      {r === 'Moderator'       && <IconEdit />}
                    </span>
                    <span className="ob-role-label">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="ob-actions">
              <button
                type="button"
                className="ob-btn-back"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                <IconArrow /> Back
              </button>

              <button
                type="submit"
                className="ob-btn-submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? <><span className="ob-spinner" /> Setting up…</>
                    : <><IconCheck /> Complete Registration</>
                  }
                </span>
              </button>
            </div>

          </form>

          <p className="ob-terms">
            By completing registration you agree to our{' '}
            <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default GoogleOnboarding;
