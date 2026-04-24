import { useState } from 'react';
import jobBoxIcon from '../assets/brand/jobbox-icon.jpg';
import { toast } from './Toast';

export default function AuthModal({ open, tab, onClose, onLogin }) {
  const [activeTab, setActiveTab] = useState(tab || 'signin');
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass] = useState('');
  const [suFname, setSuFname] = useState('');
  const [suLname, setSuLname] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass, setSuPass] = useState('');
  const [suRole, setSuRole] = useState('jobseeker');

  if (!open) return null;

  function doSignIn() {
    if (!siEmail || !siPass) { toast('Please fill in all fields.', 'error'); return; }
    const stored = JSON.parse(localStorage.getItem('jb_users') || '[]');
    const user = stored.find(u => u.email === siEmail && u.password === siPass);
    if (!user) {
      const guestUser = { fname: 'Guest', lname: 'User', email: siEmail, role: 'jobseeker' };
      onLogin(guestUser);
      toast('Signed in as guest (demo mode).', 'info');
      return;
    }
    onLogin(user);
    toast(`Welcome back, ${user.fname}!`, 'success');
  }

  function doSignUp() {
    if (!suFname || !suLname || !suEmail || !suPass) { toast('Please fill in all fields.', 'error'); return; }
    if (suPass.length < 6) { toast('Password must be at least 6 characters.', 'error'); return; }
    const stored = JSON.parse(localStorage.getItem('jb_users') || '[]');
    if (stored.find(u => u.email === suEmail)) { toast('Email already registered. Please sign in.', 'error'); return; }
    const newUser = { fname: suFname, lname: suLname, email: suEmail, password: suPass, role: suRole };
    stored.push(newUser);
    localStorage.setItem('jb_users', JSON.stringify(stored));
    onLogin(newUser);
    toast(`Welcome, ${suFname}! Account created successfully.`, 'success');
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
            <div className="auth-field"><label>Email Address</label><input type="email" placeholder="Enter email" value={siEmail} onChange={e => setSiEmail(e.target.value)} /></div>
            <div className="auth-field"><label>Password</label><input type="password" placeholder="Enter password" value={siPass} onChange={e => setSiPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSignIn()} /></div>
            <button className="auth-btn" onClick={doSignIn}>Sign In →</button>
            <div className="auth-sep">— or —</div>
            <div className="auth-switch">Don't have an account? <a onClick={() => setActiveTab('signup')}>Register</a></div>
          </div>
        )}

        {activeTab === 'signup' && (
          <div>
            <div className="auth-field">
              <div className="row">
                <div><label>First Name</label><input type="text" placeholder="First" value={suFname} onChange={e => setSuFname(e.target.value)} /></div>
                <div><label>Last Name</label><input type="text" placeholder="Last" value={suLname} onChange={e => setSuLname(e.target.value)} /></div>
              </div>
            </div>
            <div className="auth-field"><label>Email Address</label><input type="email" placeholder="Enter email" value={suEmail} onChange={e => setSuEmail(e.target.value)} /></div>
            <div className="auth-field"><label>Password</label><input type="password" placeholder="Min 6 characters" value={suPass} onChange={e => setSuPass(e.target.value)} /></div>
            <div className="auth-field">
              <label>I am a</label>
              <select value={suRole} onChange={e => setSuRole(e.target.value)}>
                <option value="jobseeker">Job Seeker</option>
                <option value="recruiter">Recruiter / Employer</option>
              </select>
            </div>
            <button className="auth-btn" onClick={doSignUp}>Create Account →</button>
            <div className="auth-switch">Already have an account? <a onClick={() => setActiveTab('signin')}>Sign In</a></div>
          </div>
        )}
      </div>
    </div>
  );
}
