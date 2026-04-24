import { useState } from 'react';
import { LANDING_JOBS, CATEGORIES } from '../data';
import { toast } from './Toast';
import jobBoxIcon from '../assets/brand/jobbox-icon.jpg';
import communicationOneImage from '../assets/hero/communication-1.webp';
import communicationTwoImage from '../assets/hero/communication-2.jpg';

export default function LandingPage({ onOpenAuth }) {
  const [cat, setCat] = useState('');
  const [loc, setLoc] = useState('');
  const [kw, setKw] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  const tabDefs = [
    { key: 'all', label: 'All Jobs' },
    { key: 'content', label: '✏️ Content Writer' },
    { key: 'finance', label: '💰 Finance' },
    { key: 'hr', label: '👥 Human Resource' },
    { key: 'management', label: '📊 Management' },
    { key: 'software', label: '💻 Software' },
    { key: 'marketing', label: '📣 Marketing' },
  ];

  const filteredJobs = activeTab === 'all' ? LANDING_JOBS : LANDING_JOBS.filter(j => j.cat === activeTab || j.cat === 'all');

  function handleSearch() {
    const q = kw || cat || 'jobs';
    toast(`Searching for "${q}"... Sign in to view results.`, 'info');
    setTimeout(() => onOpenAuth('signin'), 800);
  }

  const NEWS = [
    { image: '/career-news/career-tips.jfif', position: 'center', alt: 'Career tips and resume writing', tag: 'Career Tips', title: 'How to Write a Resume That Gets Noticed in 2026', meta: 'Apr 20, 2026 · Sarah K.' },
    { image: '/career-news/tech-industry.webp', position: 'center', alt: 'Technology industry hiring news', tag: 'Tech Industry', title: 'Tech Hiring Surges: What You Need to Know', meta: 'Apr 15, 2026 · Mark T.' },
    { image: '/career-news/remote-work.webp', position: 'center', alt: 'Remote work career news', tag: 'Remote Work', title: 'Companies Doubling Down on Remote Work Policies', meta: 'Apr 12, 2026 · James L.' },
  ];

  return (
    <div>
      {/* NAV */}
      <nav className="jb-nav">
        <div className="jb-logo">
          <img className="brand-logo-img jb-brand-logo-img" src={jobBoxIcon} alt="JobBox" />
          <div className="jb-logo-icon">💼</div>JobBox
        </div>
        <div className="jb-nav-links">
          <a className="active">Home</a>
          <a onClick={() => onOpenAuth()}>Find a Job</a>
          <a onClick={() => onOpenAuth()}>Recruiters</a>
          <a onClick={() => onOpenAuth()}>Candidates</a>
          <a onClick={() => onOpenAuth()}>Blog</a>
        </div>
        <div className="jb-nav-right">
          <a onClick={() => onOpenAuth('signup')}>Register</a>
          <button className="btn-signin-nav" onClick={() => onOpenAuth('signin')}>Sign In</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg,#EEF5FF 0%,#fff 60%)' }}>
        <div className="jb-hero">
          <div className="jb-hero-left">
            <h1>The <span>Easiest Way</span><br />to Get Your New Job</h1>
            <p>Each month, more than 3 million job seekers turn to JobBox in their search for work, making over 140,000 applications every single day.</p>
            <div className="jb-search-box">
              <div className="jb-search-field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                <select value={cat} onChange={e => setCat(e.target.value)}>
                  <option value="">All Industries</option>
                  <option>Technology</option><option>Finance</option><option>Design</option><option>Marketing</option><option>Human Resource</option>
                </select>
              </div>
              <div className="jb-search-field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" /></svg>
                <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="Location" />
              </div>
              <div className="jb-search-field" style={{ borderRight: 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input type="text" value={kw} onChange={e => setKw(e.target.value)} placeholder="Keywords" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <button className="jb-search-btn" onClick={handleSearch}>Search</button>
            </div>
            <div className="jb-popular">
              <strong>Popular:</strong>
              {['Content Writer', 'Finance', 'HR', 'Management'].map(p => (
                <span key={p}><a onClick={() => { setKw(p); handleSearch(); }}>{p}</a>{' '}</span>
              ))}
            </div>
          </div>
          <div className="jb-hero-right">
            <div className="hero-img-main">
              <img src={communicationOneImage} alt="Professional communication" />
            </div>
            <div className="hero-img-2">
              <img src={communicationTwoImage} alt="Team communication" />
            </div>
            <div className="hero-dot-grid">
              {Array(24).fill(0).map((_, i) => <span key={i} />)}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="jb-stats">
        <div className="jb-stats-inner">
          {[['1.8K+', 'Jobs Posted Daily'], ['840K+', 'Total Job Listings'], ['3.2M+', 'Monthly Visitors'], ['140K+', 'Applications / Day'], ['98%', 'Satisfaction Rate']].map(([n, l], i, arr) => (
            <span key={i} style={{ display: 'contents' }}>
              <div className="jb-stat-item"><h3>{n}</h3><p>{l}</p></div>
              {i < arr.length - 1 && <div className="jb-stat-divider" />}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="jb-section">
        <div className="jb-section-head">
          <h2>Browse by category</h2>
          <p>Find the job that's perfect for you. About 800+ new jobs everyday</p>
        </div>
        <div className="jb-cat-grid">
          {CATEGORIES.map((c, i) => (
            <div className={`jb-cat-card${c.image ? ' has-cover-image' : ''}`} key={i} onClick={() => onOpenAuth()}>
              {c.image && <img className="jb-cat-cover-img" src={c.image} alt={`${c.name} category`} />}
              {!c.image && <div className="jb-cat-icon" style={{ background: c.bg }}>{c.icon}</div>}
              <div className="jb-cat-text"><h4>{c.name}</h4><p>{c.count} Jobs Available</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* HIRING BANNER */}
      <div className="jb-hire-wrap">
        <div
          className="jb-hire"
          style={{ backgroundImage: "linear-gradient(90deg,rgba(7,28,56,.76),rgba(10,101,204,.34)), url('/hiring/hiring-banner.webp')" }}
        >
          <div className="jb-hire-text">
            <p>WE ARE</p>
            <h2><span>HIRING</span></h2>
            <div className="sub">Let's Work Together &amp; Explore Opportunities</div>
          </div>
          <button className="btn-hero-apply" onClick={() => onOpenAuth()}>Apply Now →</button>
        </div>
      </div>

      {/* JOBS OF THE DAY */}
      <div className="jb-jobs-wrap">
        <div className="jb-jobs-inner">
          <div className="jb-section-head"><h2>Jobs of the day</h2><p>Search and connect with the right candidates faster</p></div>
          <div className="jb-job-filter-tabs">
            {tabDefs.map(t => (
              <button key={t.key} className={`jb-job-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
            ))}
          </div>
          <div className="jb-jobs-grid">
            {filteredJobs.map((j, i) => (
              <div key={i} className="jb-job-card" onClick={() => setSelectedJob(j)}>
                <div className="jb-job-card-media">
                  {j.image && <img src={j.image} alt={`${j.title} role`} />}
                </div>
                <div className="jb-jc-top">
                  <span className="jb-featured-badge">⚡ Featured</span>
                </div>
                <div className="jb-job-name">{j.title}</div>
                <div className="jb-job-company">🏢 {j.company} &nbsp;·&nbsp; 🌍 {j.loc}</div>
                <div className="jb-job-type">📅 {j.type}</div>
                <div className="jb-job-desc">Exciting opportunity to join a world-class team. Work on challenging projects with top professionals.</div>
                <div className="jb-job-skills">{j.skills.map(s => <span key={s} className="jb-skill-tag">{s}</span>)}</div>
                <div className="jb-job-footer">
                  <div className="jb-salary">{j.salary}</div>
                  <button className="btn-apply-sm" onClick={e => { e.stopPropagation(); setSelectedJob(j); }}>Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEWS */}
      <div className="jb-news-wrap">
        <div className="jb-section-head"><h2>Latest Career News</h2><p>Stay up to date with job market trends and career tips</p></div>
        <div className="jb-news-grid">
          {NEWS.map((n, i) => (
            <div key={i} className="jb-news-card" onClick={() => toast('Opening article...', 'info')}>
              <div className="jb-news-img">
                <img src={n.image} alt={n.alt} style={{ objectPosition: n.position }} />
              </div>
              <div className="jb-news-body">
                <span className="jb-news-tag">{n.tag}</span>
                <div className="jb-news-title">{n.title}</div>
                <div className="jb-news-meta">{n.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="jb-footer">
        <div className="jb-footer-grid">
          <div className="jb-footer-brand">
            <div className="footer-logo-with-image"><img className="brand-logo-img footer-brand-logo-img" src={jobBoxIcon} alt="JobBox" />JobBox</div>
            <div className="logo">💼 JobBox</div>
            <p>The world's leading job platform connecting talent with opportunity. Over 3 million job seekers find their perfect role every month.</p>
          </div>
          <div className="jb-footer-col">
            <h4>For Job Seekers</h4>
            {['Browse Jobs', 'My Applications', 'Saved Jobs', 'Career Resources'].map(l => <a key={l} onClick={() => onOpenAuth()}>{l}</a>)}
          </div>
          <div className="jb-footer-col">
            <h4>For Employers</h4>
            {['Post a Job', 'Browse Candidates', 'Recruiter Tools', 'Pricing Plans'].map(l => <a key={l} onClick={() => onOpenAuth()}>{l}</a>)}
          </div>
          <div className="jb-footer-col">
            <h4>Company</h4>
            {['About Us', 'Blog', 'Careers at JobBox', 'Contact'].map(l => <a key={l} onClick={() => onOpenAuth()}>{l}</a>)}
          </div>
        </div>
        <div className="jb-footer-bottom">© 2026 JobBox Inc. All rights reserved.</div>
      </footer>

      {/* LANDING JOB MODAL */}
      {selectedJob && (
        <div className="jlm-overlay open" onClick={e => { if (e.target === e.currentTarget) setSelectedJob(null); }}>
          <div className="jlm-card">
            <button className="jlm-close" onClick={() => setSelectedJob(null)}>✕</button>
            <div className="jlm-head">
              <div className="jlm-logo" style={{ background: selectedJob.color }}>{selectedJob.company[0]}</div>
              <div className="jlm-title-text">
                <h2>{selectedJob.title}</h2>
                <p>{selectedJob.company} · {selectedJob.loc}</p>
              </div>
            </div>
            <div className="jlm-info-row">
              <div className="jlm-info-box"><div className="label">Salary</div><div className="value">{selectedJob.salary}</div></div>
              <div className="jlm-info-box"><div className="label">Job Type</div><div className="value">{selectedJob.type}</div></div>
            </div>
            <div className="jlm-section">
              <h4>Job Description</h4>
              <p>We are looking for a skilled professional to join our team. You'll work on exciting projects, collaborate with talented colleagues, and make a real impact in a fast-growing company.</p>
              <h4>Requirements</h4>
              <ul><li>3+ years of relevant experience</li><li>Strong problem-solving and communication skills</li><li>Ability to work in a fast-paced environment</li><li>Team player with a growth mindset</li></ul>
              <h4>Benefits</h4>
              <ul><li>Competitive salary package</li><li>Remote-friendly work culture</li><li>Health &amp; dental insurance</li><li>Annual $2,000 learning budget</li></ul>
            </div>
            <div className="jlm-footer">
              <button className="btn-jlm-apply" onClick={() => { setSelectedJob(null); onOpenAuth('signin'); toast('Please sign in to apply for jobs.', 'info'); }}>Apply Now →</button>
              <button className="btn-jlm-save" onClick={() => { setSelectedJob(null); onOpenAuth('signin'); toast('Sign in to save jobs.', 'info'); }}>💾 Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
