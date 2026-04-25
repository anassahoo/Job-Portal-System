import { useEffect, useState } from 'react';
import jobBoxIcon from '../assets/brand/jobbox-icon.jpg';
import { toast } from './Toast';
import { login, signup } from '../API/authApi';

export default function AuthModal({ open, tab, onClose, onLogin }) {
  const [activeTab, setActiveTab] = useState(tab || 'signin');
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass] = useState('');
  const [siErrors, setSiErrors] = useState({ email: '', password: '', form: '' });
  const [suEmail, setSuEmail] = useState('');
  const [suPass, setSuPass] = useState('');
  const [suRole, setSuRole] = useState('student');
  const [suErrors, setSuErrors] = useState({ email: '', password: '', role: '', form: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab(tab || 'signin');
    }
  }, [open, tab]);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
  }

  function validateSignIn() {
    const nextErrors = { email: '', password: '', form: '' };

    if (!siEmail.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(siEmail)) {
      nextErrors.email = 'Enter a valid email (example: name@email.com).';
    }

    if (!siPass) {
      nextErrors.password = 'Password is required.';
    }

    setSiErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  }

  function validateSignUp() {
    const nextErrors = { email: '', password: '', role: '', form: '' };

    if (!suEmail.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(suEmail)) {
      nextErrors.email = 'Enter a valid email (example: name@email.com).';
    }

    if (!suPass) {
      nextErrors.password = 'Password is required.';
    } else if (suPass.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (!suRole) {
      nextErrors.role = 'Please select your role.';
    }

    setSuErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password && !nextErrors.role;
  }

  async function performLogin(email, password) {
    const response = await login({ email, password });
    onLogin(response.user);
    toast(`Welcome back, ${response.user.fname}!`, 'success');
  }

  if (!open) return null;

  async function doSignIn() {
    if (!validateSignIn()) {
      toast('Please fix the highlighted sign-in fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await performLogin(siEmail.trim(), siPass);
    } catch (error) {
      setSiErrors(prev => ({ ...prev, form: error.message || 'Sign in failed. Please try again.' }));
      toast(error.message || 'Sign in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function doSignUp() {
    if (!validateSignUp()) {
      toast('Please fix the highlighted sign-up fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const email = suEmail.trim();
      await signup({ email, password: suPass, role: suRole });

      // Require explicit sign-in after signup before entering dashboard.
      setActiveTab('signin');
      setSiEmail(email);
      setSiPass('');
      setSiErrors({ email: '', password: '', form: '' });
      setSuEmail('');
      setSuPass('');
      setSuErrors({ email: '', password: '', role: '', form: '' });
      toast('Account created successfully. Please sign in to continue.', 'success');
    } catch (error) {
      setSuErrors(prev => ({ ...prev, form: error.message || 'Sign up failed. Please try again.' }));
      toast(error.message || 'Sign up failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-logo">
          <img className="brand-logo-img auth-brand-logo-img" src={jobBoxIcon} alt="JobBox" />
          <div className="auth-logo-box">💼</div>
          JobBox
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab${activeTab === 'signin' ? ' active' : ''}`} onClick={() => setActiveTab('signin')}>Sign In</button>
          <button className={`auth-tab${activeTab === 'signup' ? ' active' : ''}`} onClick={() => setActiveTab('signup')}>Register</button>
        </div>

        {activeTab === 'signin' && (
          <div>
            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={siEmail}
                className={siErrors.email ? 'auth-input-error' : ''}
                onChange={e => {
                  setSiEmail(e.target.value);
                  setSiErrors(prev => ({ ...prev, email: '', form: '' }));
                }}
              />
              {siErrors.email && <div className="auth-error-msg">{siErrors.email}</div>}
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={siPass}
                className={siErrors.password ? 'auth-input-error' : ''}
                onChange={e => {
                  setSiPass(e.target.value);
                  setSiErrors(prev => ({ ...prev, password: '', form: '' }));
                }}
                onKeyDown={e => e.key === 'Enter' && doSignIn()}
              />
              {siErrors.password && <div className="auth-error-msg">{siErrors.password}</div>}
            </div>
            {siErrors.form && <div className="auth-error-msg auth-error-form">{siErrors.form}</div>}
            <button className="auth-btn" onClick={doSignIn} disabled={loading}>{loading ? 'Signing In...' : 'Sign In →'}</button>
            <div className="auth-sep">— or —</div>
            <div className="auth-switch">Don't have an account? <a onClick={() => setActiveTab('signup')}>Register</a></div>
          </div>
        )}

        {activeTab === 'signup' && (
          <div>
            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={suEmail}
                className={suErrors.email ? 'auth-input-error' : ''}
                onChange={e => {
                  setSuEmail(e.target.value);
                  setSuErrors(prev => ({ ...prev, email: '', form: '' }));
                }}
              />
              {suErrors.email && <div className="auth-error-msg">{suErrors.email}</div>}
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={suPass}
                className={suErrors.password ? 'auth-input-error' : ''}
                onChange={e => {
                  setSuPass(e.target.value);
                  setSuErrors(prev => ({ ...prev, password: '', form: '' }));
                }}
              />
              {suErrors.password && <div className="auth-error-msg">{suErrors.password}</div>}
            </div>
            <div className="auth-field">
              <label>I am a</label>
              <select
                value={suRole}
                className={suErrors.role ? 'auth-input-error' : ''}
                onChange={e => {
                  setSuRole(e.target.value);
                  setSuErrors(prev => ({ ...prev, role: '', form: '' }));
                }}
              >
                <option value="student">Job Seeker (Student)</option>
                <option value="recuteir">Recruiter / Employer</option>
              </select>
              {suErrors.role && <div className="auth-error-msg">{suErrors.role}</div>}
            </div>
            {suErrors.form && <div className="auth-error-msg auth-error-form">{suErrors.form}</div>}
            <button className="auth-btn" onClick={doSignUp} disabled={loading}>{loading ? 'Creating Account...' : 'Create Account →'}</button>
            <div className="auth-switch">Already have an account? <a onClick={() => setActiveTab('signin')}>Sign In</a></div>
          </div>
        )}
      </div>
    </div>
  );
}
