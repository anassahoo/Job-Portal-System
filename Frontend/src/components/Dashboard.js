import { useEffect, useRef, useState } from 'react';
import { JOBS_DATA, RECRUITERS, CANDIDATES, MESSAGES } from '../data';
import { toast } from './Toast';
import ApplyModal from './ApplyModal';
import jobBoxIcon from '../assets/brand/jobbox-icon.jpg';
import welcomeBackImage from '../assets/dashboard/welcome-back.webp';

const DASHBOARD_ICONS = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  find: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  saved: <path d="M6 4h12v17l-6-3.5L6 21V4Z" />,
  applications: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
      <path d="M9 18h4" />
    </>
  ),
  messages: (
    <>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </>
  ),
  recruiters: (
    <>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M4 12h16" />
    </>
  ),
  candidates: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 16.5A4.5 4.5 0 0 1 21 20" />
    </>
  ),
  blog: (
    <>
      <path d="M6 3h9l3 3v15H6V3Z" />
      <path d="M14 3v4h4" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
      <path d="M9 19h3" />
    </>
  ),
  news: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h4" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
      <path d="M15 9h1" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.5-.2-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22h-4v-.3a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.2.1-2-3.5.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.5.2.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V2h4v.3a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.2-.1 2 3.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.5v4h-.5a1.7 1.7 0 0 0-1.6 1.1Z" />
    </>
  ),
};

function DashboardIcon({ name }) {
  return (
    <svg className="dashboard-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {DASHBOARD_ICONS[name]}
    </svg>
  );
}

const SETTINGS_ICONS = {
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  account: (
    <>
      <rect x="6" y="10" width="12" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
      <path d="M12 14v2" />
    </>
  ),
  notifications: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M10 20a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  privacy: (
    <>
      <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  danger: (
    <>
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </>
  ),
};

function SettingsIcon({ name }) {
  return (
    <svg className="settings-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {SETTINGS_ICONS[name]}
    </svg>
  );
}

const SETTINGS_NAV_ITEMS = [
  { key: 'profile', icon: 'profile', label: 'Profile' },
  { key: 'account', icon: 'account', label: 'Account' },
  { key: 'notifications', icon: 'notifications', label: 'Notifications' },
  { key: 'privacy', icon: 'privacy', label: 'Privacy' },
  { key: 'danger', icon: 'danger', label: 'Danger Zone' },
];

export default function Dashboard({ user, onSignOut, onApply, savedJobs, applications, onSaveJob, onRemoveSaved }) {
  const [section, setSection] = useState('home');
  const [topSearch, setTopSearch] = useState('');
  const [jobKw, setJobKw] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobType, setJobType] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(JOBS_DATA);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [settingsPanel, setSettingsPanel] = useState('profile');
  const [msgActive, setMsgActive] = useState(0);
  const [msgInput, setMsgInput] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([
    { type: 'recv', text: "Hi! We reviewed your application and would like to schedule an interview. Are you available this week?", time: '10:30 AM' },
    { type: 'sent', text: "That sounds great! I'm available Tuesday or Thursday afternoon.", time: '10:45 AM' },
    { type: 'recv', text: "Perfect! Let's do Thursday at 3 PM via Zoom. We'll send you the link.", time: '11:00 AM' },
  ]);
  const [toggles, setToggles] = useState({ emailAlerts: true, appStatus: true, msgNotif: true, weeklyDigest: false, marketing: false, profileVisible: true, showResume: true, openToWork: true, hideFromCurrent: false });
  const [profileForm, setProfileForm] = useState({ fname: user.fname || '', lname: user.lname || '', email: user.email || '', phone: '', title: '', location: '', bio: '' });
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  const displayName = user.fname || 'Guest';
  const initials = (user.fname?.[0] || 'G') + (user.lname?.[0] || '');
  const sectionTitles = { home: 'Home', find: 'Find a Job', saved: 'Saved Jobs', applications: 'My Applications', messages: 'Messages', recruiters: 'Recruiters', candidates: 'Candidates', blog: 'Blog', news: 'News', settings: 'Settings' };

  useEffect(() => {
    function closeAccountMenu(event) {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', closeAccountMenu);
    return () => document.removeEventListener('mousedown', closeAccountMenu);
  }, []);

  function doJobSearch() {
    const kw = (jobKw || topSearch).toLowerCase();
    const lc = jobLoc.toLowerCase();
    const tp = jobType.toLowerCase();
    setFilteredJobs(JOBS_DATA.filter(j => {
      const matchKw = !kw || j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw) || j.tags.some(t => t.toLowerCase().includes(kw)) || j.category.includes(kw);
      const matchLoc = !lc || j.location.toLowerCase().includes(lc) || (lc === 'remote' && j.remote);
      const matchType = !tp || j.type.toLowerCase().includes(tp);
      return matchKw && matchLoc && matchType;
    }));
    setSection('find');
  }

  function openJobModal(job) { setSelectedJob(job); }

  function sendMessage() {
    if (!msgInput.trim()) return;
    const text = msgInput.trim();
    setChatHistory(h => [...h, { type: 'sent', text, time: 'Just now' }]);
    setMsgInput('');
    const replies = ["Thanks for reaching out! We'll get back to you soon.", "Got your message! Let me check with the team.", "Noted! We appreciate your interest.", "Thank you! We'll follow up within 24 hours."];
    setTimeout(() => setChatHistory(h => [...h, { type: 'recv', text: replies[Math.floor(Math.random() * replies.length)], time: 'Just now' }]), 1200);
  }

  function saveProfile() {
    toast('Profile saved successfully!', 'success');
  }

  function changePassword() {
    if (!newPass || !confPass) { toast('Please fill in both password fields.', 'error'); return; }
    if (newPass.length < 6) { toast('Password must be at least 6 characters.', 'error'); return; }
    if (newPass !== confPass) { toast('Passwords do not match.', 'error'); return; }
    toast('Password updated successfully!', 'success');
    setNewPass(''); setConfPass('');
  }

  const NAV_ITEMS = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'find', icon: 'find', label: 'Find a Job' },
    { key: 'saved', icon: 'saved', label: 'Saved Jobs', badge: savedJobs.length },
    { key: 'applications', icon: 'applications', label: 'Applications', badge: applications.length },
    { key: 'messages', icon: 'messages', label: 'Messages', badge: 3 },
    { key: 'recruiters', icon: 'recruiters', label: 'Recruiters' },
    { key: 'candidates', icon: 'candidates', label: 'Candidates' },
    { key: 'blog', icon: 'blog', label: 'Blog' },
    { key: 'news', icon: 'news', label: 'News' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="jobie-layout">
      {/* SIDEBAR */}
      <div className="jobie-sidebar">
        <div className="jobie-logo" onClick={onSignOut}>
          <img className="brand-logo-img jobie-brand-logo-img" src={jobBoxIcon} alt="JobBox" />
          <div className="jobie-logo-box">💼</div>
          <span className="jobie-logo-text">JobBox</span>
        </div>
        <nav className="jobie-nav">
          {NAV_ITEMS.map(item => (
            <div key={item.key} className={`jobie-nav-item${section === item.key ? ' active' : ''}`} onClick={() => setSection(item.key)}>
              <span className="ni"><DashboardIcon name={item.icon} /></span>
              {item.label}
              {item.badge !== undefined && <span className="jobie-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="jobie-sidebar-footer">
          <div className="jobie-sidebar-user">
            <div className="jobie-sidebar-avatar">{initials}</div>
            <div>
              <div className="jobie-sidebar-uname">{displayName} {user.lname || ''}</div>
              <div className="jobie-sidebar-role">{user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</div>
            </div>
          </div>
          <button className="jobie-sidebar-signout" onClick={onSignOut}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="jobie-main">
        {/* TOPBAR */}
        <div className="jobie-topbar">
          <div className="jobie-page-title">{sectionTitles[section] || 'Dashboard'}</div>
          <div className="jobie-topbar-right">
            <div className="jobie-search-top">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9199A3" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input placeholder="Search jobs..." value={topSearch} onChange={e => setTopSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doJobSearch()} />
            </div>
            <div className="topbar-icon-btn" onClick={() => toast('No new notifications', 'info')}>🔔<span className="topbar-dot" /></div>
            <div className="topbar-user-wrap" ref={accountMenuRef}>
              <button className={`topbar-user${accountMenuOpen ? ' open' : ''}`} onClick={() => setAccountMenuOpen(v => !v)}>
                <span className="topbar-avatar">{initials}</span>
                <span className="topbar-user-info">
                  <span className="name">{displayName}</span>
                  <span className="role">{user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</span>
                </span>
                <svg className="topbar-user-chevron" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {accountMenuOpen && (
                <div className="topbar-account-menu">
                  <button onClick={onSignOut}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M10 17l5-5-5-5" />
                      <path d="M15 12H3" />
                      <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className={`jobie-content${section === 'messages' ? ' jobie-content-messages' : ''}`}>

          {/* HOME */}
          {section === 'home' && (
            <div>
              <div
                className="welcome-banner"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(7, 28, 56, .84) 0%, rgba(10, 101, 204, .54) 58%, rgba(10, 101, 204, .16) 100%), url(${welcomeBackImage})`,
                }}
              >
                <div className="welcome-banner-content">
                  <div className="welcome-slide-bar" aria-hidden="true" />
                  <h2>Welcome back, {displayName}!</h2>
                  <p>You have {applications.length} active applications. Keep applying to increase your chances!</p>
                </div>
              </div>
              <div className="dash-stats-row">
                <div className="dash-stat-card"><h4>Total Applied</h4><div className="num">{applications.length}</div><div className="change">↑ {applications.length} total applied</div></div>
                <div className="dash-stat-card"><h4>Saved Jobs</h4><div className="num">{savedJobs.length}</div><div className="change">Jobs bookmarked</div></div>
                <div className="dash-stat-card"><h4>Interviews</h4><div className="num">{applications.filter(a => a.status === 'Interview').length}</div><div className="change">Scheduled</div></div>
              </div>
              <div className="dash-two-col">
                <div className="dash-panel">
                  <h3>Recent Applications</h3>
                  {applications.length === 0 ? <div style={{ color: '#9CA3AF', fontSize: 13 }}>No applications yet. Start applying!</div> : (
                    <div className="recent-apps-list">
                      {applications.slice(-5).reverse().map((a, i) => (
                        <div key={i} className="recent-app-item">
                          <div className="recent-app-logo" style={{ background: a.color || '#0A65CC' }}>{(a.company || 'C')[0]}</div>
                          <div className="recent-app-info"><h4>{a.title}</h4><p>{a.company} · {a.appliedAt}</p></div>
                          <span className={`app-status ${a.status?.toLowerCase()}`}>{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="dash-panel">
                  <h3>Recommended Jobs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {JOBS_DATA.slice(0, 4).map(j => (
                      <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #F0F0F5', cursor: 'pointer' }} onClick={() => { setSection('find'); openJobModal(j); }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: j.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>{j.company[0]}</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: '#18191C' }}>{j.title}</div><div style={{ fontSize: 11, color: '#767F8C' }}>{j.company} · {j.salary}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FIND JOB */}
          {section === 'find' && (
            <div>
              <div className="find-job-search">
                <div className="find-job-field"><label>Job Title / Keyword</label><input value={jobKw} onChange={e => setJobKw(e.target.value)} placeholder="e.g. React Developer" /></div>
                <div className="find-job-field"><label>Location</label><input value={jobLoc} onChange={e => setJobLoc(e.target.value)} placeholder="e.g. Remote, New York" /></div>
                <div className="find-job-field">
                  <label>Job Type</label>
                  <select value={jobType} onChange={e => setJobType(e.target.value)}>
                    <option value="">All Types</option>
                    <option>Full-Time</option><option>Part-Time</option><option>Remote</option><option>Internship</option><option>Temporary</option>
                  </select>
                </div>
                <button className="btn-search-jobs" onClick={doJobSearch}>Search</button>
              </div>
              <div className="jobie-jobs-grid">
                {filteredJobs.map(j => (
                  <div key={j.id} className="jobie-job-card" onClick={() => openJobModal(j)}>
                    {j.image ? (
                      <div className="jjc-media">
                        <img src={j.image} alt={`${j.title} role`} />
                        <div className={`jjc-bookmark jjc-bookmark-media${savedJobs.find(s => s.id === j.id) ? ' saved' : ''}`} onClick={e => { e.stopPropagation(); onSaveJob(j); }}>🔖</div>
                      </div>
                    ) : (
                      <div className="jjc-header">
                        <div className="jjc-logo" style={{ background: j.color }}>{j.company[0]}</div>
                        <div className={`jjc-bookmark${savedJobs.find(s => s.id === j.id) ? ' saved' : ''}`} onClick={e => { e.stopPropagation(); onSaveJob(j); }}>🔖</div>
                      </div>
                    )}
                    <div className="jjc-title">{j.title}</div>
                    <div className="jjc-company">🏢 {j.company} &nbsp;·&nbsp; 📍 {j.location}</div>
                    <div className="jjc-tags">
                      <span className="jjc-tag jjc-tag-blue">{j.type}</span>
                      {j.tags.slice(0, 2).map((t, i) => <span key={t} className={`jjc-tag ${['jjc-tag-green', 'jjc-tag-orange'][i]}`}>{t}</span>)}
                    </div>
                    <div className="jjc-footer">
                      <div className="jjc-salary">{j.salary}</div>
                      <button className="btn-jjc-apply" onClick={e => { e.stopPropagation(); setApplyJob(j); }}>Apply Now</button>
                    </div>
                  </div>
                ))}
                {filteredJobs.length === 0 && <div className="app-empty" style={{ gridColumn: '1/-1' }}>No jobs match your search. Try different keywords.</div>}
              </div>
            </div>
          )}

          {/* SAVED JOBS */}
          {section === 'saved' && (
            <div>
              {savedJobs.length === 0 ? (
                <div className="app-empty">No saved jobs yet. Browse jobs and click 🔖 to save them.</div>
              ) : (
                <div className="jobie-jobs-grid">
                  {savedJobs.map(j => (
                    <div key={j.id} className="jobie-job-card">
                      {j.image ? (
                        <div className="jjc-media">
                          <img src={j.image} alt={`${j.title} role`} />
                          <div className="jjc-bookmark jjc-bookmark-media saved" onClick={() => { onRemoveSaved(j.id); toast(`"${j.title}" removed from saved.`, 'info'); }}>🔖</div>
                        </div>
                      ) : (
                        <div className="jjc-header">
                          <div className="jjc-logo" style={{ background: j.color || '#0A65CC' }}>{(j.company || 'C')[0]}</div>
                          <div className="jjc-bookmark saved" onClick={() => { onRemoveSaved(j.id); toast(`"${j.title}" removed from saved.`, 'info'); }}>🔖</div>
                        </div>
                      )}
                      <div className="jjc-title">{j.title}</div>
                      <div className="jjc-company">🏢 {j.company} &nbsp;·&nbsp; 📍 {j.location || ''}</div>
                      <div className="jjc-tags">
                        <span className="jjc-tag jjc-tag-blue">{j.type || 'Full-Time'}</span>
                        {(j.tags || []).slice(0, 2).map((t, i) => <span key={t} className={`jjc-tag ${['jjc-tag-green', 'jjc-tag-orange'][i]}`}>{t}</span>)}
                      </div>
                      <div className="jjc-footer">
                        <div className="jjc-salary">{j.salary || 'Competitive'}</div>
                        <button className="btn-jjc-apply" onClick={() => setApplyJob(j)}>Apply Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* APPLICATIONS */}
          {section === 'applications' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBF0', overflow: 'hidden' }}>
              {applications.length === 0 ? (
                <div className="app-empty">No applications yet. Find a job and apply!</div>
              ) : (
                <table className="app-table">
                  <thead><tr><th>Job Title</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
                  <tbody>
                    {applications.map((a, i) => (
                      <tr key={i}>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.company}</td>
                        <td>{a.appliedAt}</td>
                        <td><span className={`app-status ${a.status?.toLowerCase()}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* MESSAGES */}
          {section === 'messages' && (
            <div className="messages-layout">
              <div className="msg-list">
                <div className="msg-list-header">Messages</div>
                {MESSAGES.map((m, i) => (
                  <div key={i} className={`msg-item${msgActive === i ? ' active' : ''}`} onClick={() => setMsgActive(i)}>
                    <div className="msg-item-head">
                      <div className="msg-avatar-sm" style={{ background: m.color }}>{m.name[0]}</div>
                      <div className="msg-name">{m.name}</div>
                      <div className="msg-time">{m.time}</div>
                    </div>
                    <div className="msg-preview">{m.preview}</div>
                  </div>
                ))}
              </div>
              <div className="msg-chat">
                <div className="msg-chat-header">
                  <div className="msg-chat-avatar" style={{ background: MESSAGES[msgActive].color }}>{MESSAGES[msgActive].name[0]}</div>
                  <div>
                    <div className="msg-chat-name">{MESSAGES[msgActive].name}</div>
                    <div className="msg-chat-sub">{MESSAGES[msgActive].subject}</div>
                  </div>
                </div>
                <div className="msg-chat-area">
                  {chatHistory.map((c, i) => (
                    <div key={i} className={`msg-bubble ${c.type}`}>
                      <div className="msg-bubble-text">{c.text}</div>
                      <div className="msg-bubble-time">{c.time}</div>
                    </div>
                  ))}
                </div>
                <div className="msg-input-area">
                  <input placeholder="Type a message..." value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button className="msg-send-btn" onClick={sendMessage}>Send</button>
                </div>
              </div>
            </div>
          )}

          {/* RECRUITERS */}
          {section === 'recruiters' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C' }}>Top Recruiters</h3>
              </div>
              <div className="recruiters-grid">
                {RECRUITERS.map((r, i) => (
                  <div key={i} className="recruiter-card">
                    <div className="recruiter-avatar" style={{ background: r.color }}>{r.name[0]}</div>
                    <div className="recruiter-name">{r.name}</div>
                    <div className="recruiter-company">{r.company}</div>
                    <div className="recruiter-stats">
                      <div className="recruiter-stat"><h4>{r.jobs}</h4><p>Jobs Posted</p></div>
                      <div className="recruiter-stat"><h4>{r.rating}</h4><p>Rating</p></div>
                    </div>
                    <button className="btn-connect" onClick={() => toast(`Connection request sent to ${r.name.split(' ')[0]}!`, 'success')}>Connect</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CANDIDATES */}
          {section === 'candidates' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C' }}>Browse Candidates</h3>
                <input type="text" placeholder="Search candidates..." style={{ padding: '9px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 13, outline: 'none', width: 220 }} />
              </div>
              <div className="candidates-grid">
                {CANDIDATES.map((c, i) => (
                  <div key={i} className="candidate-card">
                    <div className="candidate-avatar" style={{ background: c.color }}>{c.initials}</div>
                    <div className="candidate-name">{c.name}</div>
                    <div className="candidate-role">{c.role}</div>
                    <div className="candidate-skills">{c.skills.map(s => <span key={s} className="candidate-skill">{s}</span>)}</div>
                    <button className="btn-view-profile" onClick={() => toast('Profile opened!', 'info')}>View Profile</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG */}
          {section === 'blog' && (
            <div>
              <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C', marginBottom: 20 }}>Blog</h3>
              <div className="blog-grid">
                <div className="blog-posts">
                  {[
                    { bg: '#EEF5FF', emoji: '📝', title: 'How to Write a Resume That Actually Gets Noticed in 2026', desc: "In today's competitive job market, your resume has just 7 seconds to make an impression.", date: 'Apr 20, 2026', author: 'Sarah K.', time: '5 min read' },
                    { bg: '#F0FDF4', emoji: '💼', title: 'Top 10 High-Demand Skills Employers Are Looking for Right Now', desc: 'From AI fluency to emotional intelligence, we break down exactly what skills are getting candidates hired.', date: 'Apr 17, 2026', author: 'Mark T.', time: '8 min read' },
                    { bg: '#FFF7ED', emoji: '🏠', title: 'Remote Work vs. Office: What Employers Really Think in 2026', desc: 'A survey of 500 hiring managers reveals surprising insights about remote work preferences.', date: 'Apr 14, 2026', author: 'James L.', time: '6 min read' },
                  ].map((p, i) => (
                    <div key={i} className="blog-post-card">
                      <div className="blog-post-img" style={{ background: p.bg }}>{p.emoji}</div>
                      <div className="blog-post-body">
                        <h3>{p.title}</h3>
                        <p>{p.desc}</p>
                        <div className="blog-post-meta"><span>📅 {p.date}</span><span>👤 {p.author}</span><span>⏱️ {p.time}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="blog-sidebar-card">
                    <h3>Popular Tags</h3>
                    {['Resume Tips', 'Remote Work', 'Career Growth', 'Tech Jobs', 'Interview Prep', 'Salary Tips'].map(t => (
                      <span key={t} className="blog-sidebar-tag" onClick={() => toast(`Filtering by ${t}`, 'info')}>{t}</span>
                    ))}
                  </div>
                  <div className="blog-sidebar-card">
                    <h3>Most Read</h3>
                    {['Negotiating Your First Salary: A Complete Guide', 'LinkedIn vs JobBox: Which Works Better?', 'Switching Careers After 30: Real Stories'].map(t => (
                      <div key={t} style={{ fontSize: 13, color: '#18191C', cursor: 'pointer', paddingBottom: 10, borderBottom: '1px solid #F0F0F5', marginBottom: 10 }} onClick={() => toast('Opening article...', 'info')}>📌 {t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEWS */}
          {section === 'news' && (
            <div>
              <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C', marginBottom: 20 }}>Career &amp; Industry News</h3>
              <div className="news-grid">
                {[
                  { bg: '#EEF5FF', emoji: '📰', badge: 'Career Tips', title: '5 Ways to Stand Out in a Competitive Job Market', meta: 'By Sarah K. · Apr 18, 2026' },
                  { bg: '#F0FDF4', emoji: '💡', badge: 'Tech Industry', title: 'Tech Hiring Surges: What You Need to Know in 2026', meta: 'By Mark T. · Apr 15, 2026' },
                  { bg: '#FFF7ED', emoji: '🏠', badge: 'Remote Work', title: 'Companies Doubling Down on Remote Work Policies', meta: 'By James L. · Apr 12, 2026' },
                  { bg: '#FDF4FF', emoji: '🤖', badge: 'AI & Jobs', title: "AI Won't Replace You: But People Using AI Will", meta: 'By Dr. Emily R. · Apr 10, 2026' },
                  { bg: '#F5F3FF', emoji: '💸', badge: 'Salary Trends', title: '2026 Salary Report: Which Roles Saw Biggest Gains?', meta: 'By Finance Desk · Apr 8, 2026' },
                  { bg: '#F0FDF4', emoji: '🌍', badge: 'Global Jobs', title: 'Cross-Border Hiring: A New Trend Reshaping Work', meta: 'By Global Team · Apr 5, 2026' },
                ].map((n, i) => (
                  <div key={i} className="news-card-full" onClick={() => toast('Opening article...', 'info')}>
                    <div className="news-img-full" style={{ background: n.bg }}>{n.emoji}</div>
                    <div className="news-body-full">
                      <span className="news-badge">{n.badge}</span>
                      <div className="news-title-full">{n.title}</div>
                      <div className="news-meta-full">{n.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div>
              <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C', marginBottom: 20 }}>Settings</h3>
              <div className="settings-grid">
                <div className="settings-nav">
                  {SETTINGS_NAV_ITEMS.map(item => (
                    <div key={item.key} className={`settings-nav-item${settingsPanel === item.key ? ' active' : ''}${item.key === 'danger' ? ' danger' : ''}`} onClick={() => setSettingsPanel(item.key)}>
                      <span className="settings-nav-icon-box"><SettingsIcon name={item.icon} /></span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="settings-panel">
                  {settingsPanel === 'profile' && (
                    <div className="settings-panel-section active">
                      <h3>Profile Information</h3>
                      <div className="avatar-upload">
                        <div className="avatar-big">{initials}</div>
                        <div><button className="btn-upload-photo" onClick={() => toast('Photo upload feature coming soon!', 'info')}>Upload Photo</button><p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>JPG, PNG, max 2MB</p></div>
                      </div>
                      <div className="settings-row">
                        <div className="settings-field"><label>First Name</label><input value={profileForm.fname} onChange={e => setProfileForm(f => ({ ...f, fname: e.target.value }))} placeholder="First Name" /></div>
                        <div className="settings-field"><label>Last Name</label><input value={profileForm.lname} onChange={e => setProfileForm(f => ({ ...f, lname: e.target.value }))} placeholder="Last Name" /></div>
                      </div>
                      <div className="settings-field"><label>Email</label><input type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" /></div>
                      <div className="settings-field"><label>Phone</label><input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 890" /></div>
                      <div className="settings-field"><label>Professional Title</label><input value={profileForm.title} onChange={e => setProfileForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Software Engineer" /></div>
                      <div className="settings-field"><label>Location</label><input value={profileForm.location} onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Country" /></div>
                      <div className="settings-field"><label>Bio</label><textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none', minHeight: 90, resize: 'vertical' }} placeholder="Tell employers about yourself..." /></div>
                      <button className="settings-save" onClick={saveProfile}>Save Changes</button>
                    </div>
                  )}
                  {settingsPanel === 'account' && (
                    <div className="settings-panel-section active">
                      <h3>Account &amp; Security</h3>
                      <div className="settings-field"><label>Current Password</label><input type="password" placeholder="Enter current password" /></div>
                      <div className="settings-field"><label>New Password</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 6 characters" /></div>
                      <div className="settings-field"><label>Confirm New Password</label><input type="password" value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="Repeat new password" /></div>
                      <button className="settings-save" onClick={changePassword}>Update Password</button>
                    </div>
                  )}
                  {settingsPanel === 'notifications' && (
                    <div className="settings-panel-section active">
                      <h3>Notification Preferences</h3>
                      {[['emailAlerts', 'Email Alerts for New Jobs', 'Get notified when new jobs match your profile'], ['appStatus', 'Application Status Updates', 'Know when employers view or respond'], ['msgNotif', 'Messages Notifications', 'Alert when you receive new messages'], ['weeklyDigest', 'Weekly Job Digest', 'Weekly email with top matching jobs'], ['marketing', 'Marketing Emails', 'Tips, news, and product updates']].map(([k, h, p]) => (
                        <div key={k} className="toggle-row">
                          <div className="toggle-row-text"><h4>{h}</h4><p>{p}</p></div>
                          <div className={`toggle-switch${toggles[k] ? ' on' : ''}`} onClick={() => setToggles(t => ({ ...t, [k]: !t[k] }))} />
                        </div>
                      ))}
                      <button className="settings-save" style={{ marginTop: 16 }} onClick={() => toast('Notification preferences saved!', 'success')}>Save Preferences</button>
                    </div>
                  )}
                  {settingsPanel === 'privacy' && (
                    <div className="settings-panel-section active">
                      <h3>Privacy Settings</h3>
                      {[['profileVisible', 'Profile Visibility', 'Allow recruiters to find your profile'], ['showResume', 'Show Resume to Employers', 'Your resume is accessible by verified employers'], ['openToWork', 'Open to Work Badge', 'Show "Open to Work" on your profile'], ['hideFromCurrent', 'Hide from Current Employer', 'Prevent your current employer from seeing you']].map(([k, h, p]) => (
                        <div key={k} className="toggle-row">
                          <div className="toggle-row-text"><h4>{h}</h4><p>{p}</p></div>
                          <div className={`toggle-switch${toggles[k] ? ' on' : ''}`} onClick={() => setToggles(t => ({ ...t, [k]: !t[k] }))} />
                        </div>
                      ))}
                      <button className="settings-save" style={{ marginTop: 16 }} onClick={() => toast('Privacy settings saved!', 'success')}>Save Privacy Settings</button>
                    </div>
                  )}
                  {settingsPanel === 'danger' && (
                    <div className="settings-panel-section active">
                      <h3 className="settings-danger-title">Danger Zone</h3>
                      <div className="danger-action-card danger-delete-card">
                        <h4>Delete Account</h4>
                        <p>Once you delete your account, there is no going back. All your data will be permanently erased.</p>
                        <button className="danger-action-btn danger-delete-btn" onClick={() => toast('Account deletion requires email confirmation. Check your inbox.', 'error')}>Delete My Account</button>
                      </div>
                      <div className="danger-action-card danger-signout-card">
                        <h4>Sign Out Everywhere</h4>
                        <p>This will sign you out from all devices.</p>
                        <button className="danger-action-btn danger-signout-btn" onClick={onSignOut}>Sign Out All Devices</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DASHBOARD JOB MODAL */}
      {selectedJob && (
        <div className="djm-overlay open" onClick={e => { if (e.target === e.currentTarget) setSelectedJob(null); }}>
          <div className="djm-card">
            <button className="djm-close" onClick={() => setSelectedJob(null)}>✕</button>
            <div style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
              <div style={{ width: 54, height: 54, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#fff', background: selectedJob.color }}>{selectedJob.company[0]}</div>
              <div><h2 style={{ fontFamily: 'Jost', fontSize: 20, fontWeight: 800, color: '#18191C' }}>{selectedJob.title}</h2><p style={{ fontSize: 13, color: '#767F8C', marginTop: 3 }}>{selectedJob.company} · {selectedJob.location}</p></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#F7F8FC', borderRadius: 8, padding: '12px 14px' }}><div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>Salary</div><div style={{ fontFamily: 'Jost', fontSize: 15, fontWeight: 700, color: '#18191C' }}>{selectedJob.salary}</div></div>
              <div style={{ background: '#F7F8FC', borderRadius: 8, padding: '12px 14px' }}><div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>Work Type</div><div style={{ fontFamily: 'Jost', fontSize: 15, fontWeight: 700, color: '#18191C' }}>{selectedJob.type}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {selectedJob.tags.map(t => <span key={t} className="jjc-tag jjc-tag-blue">{t}</span>)}
            </div>
            <div>
              <h4 style={{ fontFamily: 'Jost', fontSize: 14, fontWeight: 700, color: '#18191C', marginBottom: 8 }}>About this Role</h4>
              <p style={{ fontSize: 13, color: '#767F8C', lineHeight: 1.7 }}>We're looking for a talented professional to join our growing team. You'll work on real-world problems and help build products used by millions.</p>
              <h4 style={{ fontFamily: 'Jost', fontSize: 14, fontWeight: 700, color: '#18191C', margin: '14px 0 8px' }}>Requirements</h4>
              <ul style={{ paddingLeft: 16, fontSize: 13, color: '#767F8C', lineHeight: 2 }}>
                <li>2+ years of professional experience</li><li>Proficiency in relevant technologies</li><li>Strong communication &amp; teamwork skills</li><li>Self-starter with a growth mindset</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => { setSelectedJob(null); setApplyJob(selectedJob); }} style={{ flex: 1, padding: 12, background: '#0A65CC', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Apply Now →</button>
              <button onClick={() => { onSaveJob(selectedJob); setSelectedJob(null); }} style={{ padding: '12px 20px', border: '1.5px solid #0A65CC', background: 'transparent', color: '#0A65CC', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>💾 Save Job</button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY MODAL */}
      <ApplyModal open={!!applyJob} job={applyJob} onClose={() => setApplyJob(null)} onSubmit={onApply} />
    </div>
  );
}
