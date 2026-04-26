import { useEffect, useState } from 'react';
import { toast } from './Toast';

export default function ApplyModal({ open, job, onClose, onSubmit, prefill = {} }) {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [exp, setExp] = useState('');
  const [cover, setCover] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (!open || !job) return;

    setFname(prefill.first_name || prefill.fname || '');
    setLname(prefill.last_name || prefill.lname || '');
    setEmail(prefill.email || '');
    setPhone(prefill.phone || '');
    setExp(prefill.experience || '');
    setCover('');
    setResumeFile(null);
  }, [open, job, prefill]);

  if (!open || !job) return null;

  function submit() {
    if (!fname || !lname || !email || !phone) { toast('Please complete your profile details first.', 'error'); return; }
    if (!resumeFile) { toast('Please upload your resume.', 'error'); return; }
    onSubmit({ ...job, fname, lname, email, phone, exp, cover, resumeFile, status: 'Pending', appliedAt: new Date().toLocaleDateString() });
    toast(`Application submitted for "${job.title}"!`, 'success');
    onClose();
  }

  return (
    <div className="apply-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="apply-card">
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="apply-header">
          <h2>Apply for this Job</h2>
          <p>Fill in your details to apply</p>
        </div>
        <div className="apply-job-info">
          <div className="apply-job-logo" style={{ background: job.color || '#6454F0' }}>{(job.company || 'C')[0]}</div>
          <div className="apply-job-details">
            <h3>{job.title}</h3>
            <p>{job.company} · {job.location || job.loc || ''}</p>
          </div>
        </div>
        <div className="apply-row">
          <div className="apply-field"><label>First Name *</label><input value={fname} onChange={e => setFname(e.target.value)} placeholder="First Name" /></div>
          <div className="apply-field"><label>Last Name</label><input value={lname} onChange={e => setLname(e.target.value)} placeholder="Last Name" /></div>
        </div>
        <div className="apply-field"><label>Email *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /></div>
        <div className="apply-row">
          <div className="apply-field"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" /></div>
          <div className="apply-field">
            <label>Years of Experience</label>
            <select value={exp} onChange={e => setExp(e.target.value)}>
              <option value="">Select...</option>
              <option>0–1 years</option><option>1–3 years</option><option>3–5 years</option><option>5–10 years</option><option>10+ years</option>
            </select>
          </div>
        </div>
        <div className="apply-field">
          <label>Resume (PDF/DOC/DOCX)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => setResumeFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="apply-field"><label>Cover Letter</label><textarea value={cover} onChange={e => setCover(e.target.value)} placeholder="Tell us why you're a great fit..." /></div>
        <button className="apply-submit" onClick={submit}>Submit Application →</button>
      </div>
    </div>
  );
}