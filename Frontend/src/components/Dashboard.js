import { useEffect, useRef, useState } from 'react';
import { MESSAGES } from '../data';
import { toast } from './Toast';
import ApplyModal from './ApplyModal';
import jobBoxIcon from '../assets/brand/jobbox-icon.jpg';
import welcomeBackImage from '../assets/dashboard/welcome-back.webp';
import { updateStoredSessionUser } from '../API/authApi';
import { getMyProfile, getProfileImageUrl, getResumeFileUrl, updateMyAccount, updateMyProfile, uploadMyProfileImage } from '../API/userAPI';
import { addSkill, getAllSkills as getAllStudentSkills, getMySkills, removeSkill } from '../API/skillApi';
import {
  applyToJob,
  getCandidatesForJobSeeker,
  getJobsForJobSeeker,
  getMyApplicationsForJobSeeker,
  getRecruitersForJobSeeker,
  uploadResumeForJobSeeker,
} from '../API/jobSeekerApi';
import {
  addJobSkill,
  createCompany,
  createJob,
  createSkill,
  getAllSkills,
  getMyCompany,
  getMyJobs,
  getRecruiterApplications,
  updateRecruiterApplicationStatus,
  updateJob,
  updateMyCompany,
} from '../API/recruiterApi';

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

const COUNTRY_PHONE_CODES = [
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+92', label: 'Pakistan (+92)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+966', label: 'Saudi Arabia (+966)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
];

function getApplicationStatusMeta(rawStatus) {
  const normalized = String(rawStatus || '').trim().toLowerCase();
  const statusMap = {
    pending: { key: 'pending', label: 'Pending' },
    interview: { key: 'interview', label: 'Interview' },
    interviewed: { key: 'interview', label: 'Interview' },
    reject: { key: 'rejected', label: 'Rejected' },
    rejected: { key: 'rejected', label: 'Rejected' },
    accept: { key: 'offered', label: 'Accepted' },
    accepted: { key: 'offered', label: 'Accepted' },
    offer: { key: 'offered', label: 'Offered' },
    offered: { key: 'offered', label: 'Offered' },
    active: { key: 'active', label: 'Active' },
  };

  return statusMap[normalized] || { key: 'pending', label: 'Pending' };
}

export default function Dashboard({ user, onSignOut, onUserUpdate, onApply, savedJobs, applications, onSaveJob, onRemoveSaved }) {
  const [section, setSection] = useState('home');
  const [topSearch, setTopSearch] = useState('');
  const [jobKw, setJobKw] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobType, setJobType] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [directoryRecruiters, setDirectoryRecruiters] = useState([]);
  const [directoryCandidates, setDirectoryCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [settingsPanel, setSettingsPanel] = useState('profile');
  const [msgActive, setMsgActive] = useState(0);
  const [msgInput, setMsgInput] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const profileFileInputRef = useRef(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { type: 'recv', text: "Hi! We reviewed your application and would like to schedule an interview. Are you available this week?", time: '10:30 AM' },
    { type: 'sent', text: "That sounds great! I'm available Tuesday or Thursday afternoon.", time: '10:45 AM' },
    { type: 'recv', text: "Perfect! Let's do Thursday at 3 PM via Zoom. We'll send you the link.", time: '11:00 AM' },
  ]);
  const [toggles, setToggles] = useState({ emailAlerts: true, appStatus: true, msgNotif: true, weeklyDigest: false, marketing: false, profileVisible: true, showResume: true, openToWork: true, hideFromCurrent: false });
  const [profileForm, setProfileForm] = useState({ fname: user.fname || '', lname: user.lname || '', phone: '', title: '', location: '', bio: '' });
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [profileSaving, setProfileSaving] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [accountEmail, setAccountEmail] = useState(user.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [profileErrors, setProfileErrors] = useState({ fname: '', lname: '', phone: '', title: '', location: '', bio: '' });
  const [accountErrors, setAccountErrors] = useState({ email: '', current: '', newPass: '', confirm: '' });

  const displayName = profileForm.fname?.trim() || user.fname || 'Guest';
  const initials = `${profileForm.fname?.[0] || user.fname?.[0] || 'G'}${profileForm.lname?.[0] || user.lname?.[0] || ''}`;
  const isRecruiterRole = ['recruiter', 'recuteir', 'recuiter', 'recurieter', 'recuriecter'].includes(String(user.role || '').toLowerCase());
  const sectionTitles = {
    // Student sections
    home: 'Home',
    find: 'Find a Job',
    saved: 'Saved Jobs',
    applications: 'My Applications',
    messages: 'Messages',
    recruiters: 'Recruiters',
    candidates: 'Candidates',
    settings: 'Settings',
    // Recruiter sections
    recHome: 'Dashboard',
    company: 'Company Profile',
    postJob: 'Post a Job',
    myJobs: 'My Jobs',
    applicants: 'Applicants',
  };
  const [companyForm, setCompanyForm] = useState({ name: '', description: '' });
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState('');
  const [jobForm, setJobForm] = useState({ title: '', description: '', jobType: 'Full-Time', requiredSkills: '' });
  const [myJobs, setMyJobs] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [applicantList, setApplicantList] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const recruiterPendingCount = applicantList.length;
  const [jobSeekerSkills, setJobSeekerSkills] = useState([]);
  const [jobSeekerSkillCatalog, setJobSeekerSkillCatalog] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [applyPrefill, setApplyPrefill] = useState({});

  useEffect(() => {
    function closeAccountMenu(event) {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }

      if (!notificationMenuRef.current?.contains(event.target)) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', closeAccountMenu);
    return () => document.removeEventListener('mousedown', closeAccountMenu);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getMyProfile();

        const phoneText = profile.phone || '';
        const parsedPhone = phoneText.match(/^(\+\d{1,4})\s*(.*)$/);

        if (parsedPhone) {
          const incomingCode = parsedPhone[1];
          if (COUNTRY_PHONE_CODES.some(item => item.code === incomingCode)) {
            setPhoneCountryCode(incomingCode);
          }
        }

        setProfileForm({
          fname: profile.first_name || user.fname || '',
          lname: profile.last_name || user.lname || '',
          phone: parsedPhone ? parsedPhone[2] : phoneText,
          title: profile.professional_title || '',
          location: profile.location || '',
          bio: profile.bio || '',
        });

        setApplyPrefill({
          first_name: profile.first_name || user.fname || '',
          last_name: profile.last_name || user.lname || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          experience: '',
        });

        setAccountEmail(profile.email || user.email || '');
        if (profile.profile_image) {
          setProfileImageUrl(getProfileImageUrl(profile.profile_image));
        }

        const userPatch = {
          fname: profile.first_name || user.fname || '',
          lname: profile.last_name || user.lname || '',
          email: profile.email || user.email || '',
        };

        updateStoredSessionUser(userPatch);
        if (onUserUpdate) onUserUpdate(userPatch);
      } catch {
        // Keep defaults from login session when profile is not created yet.
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (isRecruiterRole && section === 'home') {
      setSection('recHome');
    }

    if (!isRecruiterRole && ['recHome', 'company', 'postJob', 'myJobs', 'applicants'].includes(section)) {
      setSection('home');
    }
  }, [isRecruiterRole, section]);

  useEffect(() => {
    async function loadRecruiterData() {
      if (!isRecruiterRole) return;

      try {
        const [myCompany, recruiterJobs, applicants, skills] = await Promise.all([
          getMyCompany().catch(() => null),
          getMyJobs().catch(() => []),
          getRecruiterApplications(),
          getAllSkills().catch(() => []),
        ]);

        if (myCompany) {
          setCompanyData({
            name: myCompany.name || '',
            description: myCompany.description || '',
            logo: myCompany.logo || '',
          });
          setCompanyId(myCompany.id || null);
        } else {
          setCompanyData(null);
          setCompanyId(null);
        }

        const mappedJobs = Array.isArray(recruiterJobs)
          ? recruiterJobs.map(j => ({
                id: j.id,
                title: j.title,
                description: j.description || '',
                company: j.company_name || myCompany?.name || 'Company',
                posted: `Job #${j.id}`,
                applicants: Number(j.applicants_count || 0),
                status: 'Active',
                requiredSkills: j.required_skills || '',
              }))
          : [];
        setMyJobs(mappedJobs);

        const mappedApplicants = Array.isArray(applicants)
          ? applicants.map(a => {
              const statusMeta = getApplicationStatusMeta(a.status);
              const isRejected = statusMeta.key === 'rejected';

              return {
              id: a.id,
              userId: a.user_id,
              name: [a.first_name, a.last_name].filter(Boolean).join(' ') || a.applicant_email || `Candidate #${a.user_id}`,
              email: a.applicant_email || '',
              phone: a.phone || '',
              role: a.job_title || 'Applied Role',
              company: a.company_name || companyData?.name || 'Company',
              match: `${a.match_percentage || 0}%`,
              status: statusMeta.label,
              applied: `Application #${a.id}`,
              title: a.professional_title || 'Not provided',
              location: a.location || 'Not provided',
              bio: a.bio || 'No profile bio available.',
              profileImage: a.profile_image || '',
              resumeFile: a.resume_file || '',
              experience: a.experience || 'Not provided',
              coverLetter: a.cover_letter || 'No cover letter shared.',
              skills: String(a.skills || '')
                .split(',')
                .map(skill => skill.trim())
                .filter(Boolean),
              prediction: isRejected ? (a.prediction || 'No reason provided') : '',
              resumeScore: a.resume_score ?? 0,
              projectScore: a.project_score ?? 0,
              };
            })
          : [];
        setApplicantList(mappedApplicants);

        setAvailableSkills(Array.isArray(skills) ? skills : []);
      } catch (error) {
        toast(error.message || 'Failed to load recruiter dashboard data.', 'error');
      }
    }

    loadRecruiterData();
  }, [isRecruiterRole]);

  useEffect(() => {
    async function loadJobSeekerData() {
      if (isRecruiterRole) return;

      try {
        const [jobs, recruiters, candidates, apps] = await Promise.all([
          getJobsForJobSeeker(),
          getRecruitersForJobSeeker(),
          getCandidatesForJobSeeker(),
          getMyApplicationsForJobSeeker(),
        ]);
        const [skills, mySkills] = await Promise.all([
          getAllStudentSkills().catch(() => []),
          getMySkills().catch(() => []),
        ]);

        const normalizedJobs = Array.isArray(jobs)
          ? jobs.map(j => ({
              id: j.id,
              title: j.title,
              company: j.company_name || 'Company',
              image: j.company_logo ? getProfileImageUrl(j.company_logo) : '',
              companyLogo: j.company_logo ? getProfileImageUrl(j.company_logo) : '',
              location: j.location || 'Remote',
              type: j.type || 'Full-Time',
              tags: String(j.required_skills || j.tags || '')
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean),
              salary: j.salary || 'Competitive',
              description: j.description || '',
              category: (j.title || '').toLowerCase(),
              remote: String(j.location || '').toLowerCase().includes('remote'),
            }))
          : [];

        const normalizedRecruiters = Array.isArray(recruiters)
          ? recruiters.map(r => ({
              name: r.company_name || 'Recruiter',
              company: r.company_name || 'Company',
              jobs: Number(r.jobs_posted || 0),
              rating: '4.8',
              color: '#0A65CC',
              logo: r.logo || '',
            }))
          : [];

        const normalizedCandidates = Array.isArray(candidates)
          ? candidates.map(c => ({
              initials: `${(c.first_name || c.email || 'C')[0]}${(c.last_name || '')[0] || ''}`.toUpperCase(),
              name: [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email,
              role: c.professional_title || 'Candidate',
              email: c.email || '',
              location: c.location || '',
              bio: c.bio || '',
              skills: String(c.skills || '')
                .split(',')
                .map(skill => skill.trim())
                .filter(Boolean),
              profileImage: c.profile_image || '',
              color: '#0A65CC',
            }))
          : [];

        const normalizedApps = Array.isArray(apps)
          ? apps.map(a => {
              const statusMeta = getApplicationStatusMeta(a.status);

              return {
              id: a.id,
              jobId: a.job_id,
              title: a.job_title || 'Job',
              company: a.company_name || 'Company',
              status: statusMeta.label,
              appliedAt: `Application #${a.id}`,
              };
            })
          : [];

        setAllJobs(normalizedJobs);
        setFilteredJobs(normalizedJobs);
        setDirectoryRecruiters(normalizedRecruiters);
        setDirectoryCandidates(normalizedCandidates);
        setMyApplications(normalizedApps);
        setJobSeekerSkillCatalog(Array.isArray(skills) ? skills : []);
        setJobSeekerSkills(Array.isArray(mySkills) ? mySkills : []);
      } catch (error) {
        toast(error.message || 'Failed to load job seeker data', 'error');
      }
    }

    loadJobSeekerData();
  }, [isRecruiterRole]);

  useEffect(() => {
    if (isRecruiterRole) return;

    const refreshInterval = setInterval(async () => {
      try {
        const apps = await getMyApplicationsForJobSeeker();
        const normalizedApps = Array.isArray(apps)
          ? apps.map(a => {
              const statusMeta = getApplicationStatusMeta(a.status);

              return {
              id: a.id,
              jobId: a.job_id,
              title: a.job_title || 'Job',
              company: a.company_name || 'Company',
              status: statusMeta.label,
              appliedAt: `Application #${a.id}`,
              };
            })
          : [];

        setMyApplications(normalizedApps);
      } catch {
        // keep existing local state if refresh fails
      }
    }, 15000);

    return () => clearInterval(refreshInterval);
  }, [isRecruiterRole]);

  async function handleSaveCompany() {
    if (!companyForm.name.trim() || !companyForm.description.trim()) {
      toast('Please fill in all fields', 'error');
      return;
    }

    try {
      if (isEditingCompany && companyData) {
        const result = await updateMyCompany({
          name: companyForm.name.trim(),
          description: companyForm.description.trim(),
          logo: companyLogoFile,
        });

        const nextCompany = result?.company || {
          ...companyData,
          name: companyForm.name.trim(),
          description: companyForm.description.trim(),
        };
        setCompanyData(nextCompany);
        setCompanyId(nextCompany?.id || companyId);
        toast('Company profile updated!', 'success');
      } else {
        const result = await createCompany({
          name: companyForm.name.trim(),
          description: companyForm.description.trim(),
          logo: companyLogoFile,
        });

        setCompanyData({
          name: companyForm.name.trim(),
          description: companyForm.description.trim(),
          logo: result.logo || '',
        });
        setCompanyId(result.company_id || null);
        toast('Company profile created!', 'success');
      }

      setCompanyForm({ name: '', description: '' });
      setCompanyLogoFile(null);
      setCompanyLogoPreview('');
      setIsEditingCompany(false);
    } catch (error) {
      toast(error.message || 'Failed to save company profile', 'error');
    }
  }

  function handleEditJobClick(job) {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      jobType: 'Full-Time',
      requiredSkills: job.requiredSkills || job.required_skills || '',
    });
    setSection('postJob');
  }

  async function handlePostJob() {
    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      toast('Please fill in all fields', 'error');
      return;
    }

    if (!companyId && !editingJobId) {
      toast('Please create a company profile first.', 'error');
      return;
    }

    try {
      const skillTokens = String(jobForm.requiredSkills || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const normalizedMap = new Map(
        availableSkills.map(s => [String(s.skill_name || '').trim().toLowerCase(), s.id])
      );

      const skillIds = [];
      for (const skillName of skillTokens) {
        const key = skillName.toLowerCase();
        if (normalizedMap.has(key)) {
          skillIds.push(normalizedMap.get(key));
          continue;
        }

        const created = await createSkill({ skill_name: skillName });
        if (created?.skill_id) {
          skillIds.push(created.skill_id);
          normalizedMap.set(key, created.skill_id);
        }
      }

      let result = null;
      if (editingJobId) {
        await updateJob(editingJobId, {
          title: jobForm.title.trim(),
          description: jobForm.description.trim(),
          skill_ids: skillIds,
        });
      } else {
        result = await createJob({
          title: jobForm.title.trim(),
          description: jobForm.description.trim(),
          company_id: companyId,
        });

        if (skillIds.length > 0 && result?.job_id) {
          await Promise.all(skillIds.map(skillId => addJobSkill({ job_id: result.job_id, skill_id: skillId })));
        }
      }

      if (editingJobId) {
        setMyJobs(prev => prev.map(j => (
          j.id === editingJobId
            ? { ...j, title: jobForm.title.trim(), description: jobForm.description.trim(), requiredSkills: skillTokens.join(', ') }
            : j
        )));
      } else {
        setMyJobs(prev => [
          {
            id: result?.job_id || Date.now(),
            title: jobForm.title.trim(),
            description: jobForm.description.trim(),
            company: companyData?.name || 'Company',
            posted: 'Just now',
            applicants: 0,
            status: 'Active',
            requiredSkills: skillTokens.join(', '),
          },
          ...prev,
        ]);
      }

      setJobForm({ title: '', description: '', jobType: 'Full-Time', requiredSkills: '' });
      setEditingJobId(null);
      setSection('myJobs');
      toast(editingJobId ? 'Job updated successfully!' : 'Job posted successfully!', 'success');
    } catch (error) {
      toast(error.message || (editingJobId ? 'Failed to update job' : 'Failed to post job'), 'error');
    }
  }

  function doJobSearch() {
    const kw = (jobKw || topSearch).toLowerCase();
    const lc = jobLoc.toLowerCase();
    const tp = jobType.toLowerCase();
    setFilteredJobs(allJobs.filter(j => {
      const matchKw = !kw || j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw) || j.tags.some(t => t.toLowerCase().includes(kw)) || j.category.includes(kw);
      const matchLoc = !lc || j.location.toLowerCase().includes(lc) || (lc === 'remote' && j.remote);
      const matchType = !tp || j.type.toLowerCase().includes(tp);
      return matchKw && matchLoc && matchType;
    }));
    setSection('find');
  }

  async function handleJobSeekerApply(applicationPayload) {
    try {
      const alreadyApplied = myApplications.some(app => String(app.jobId) === String(applicationPayload.id));
      if (alreadyApplied) {
        toast('You already applied for this job.', 'error');
        return;
      }

      if (applicationPayload?.resumeFile) {
        await uploadResumeForJobSeeker(applicationPayload.resumeFile, {
          first_name: applicationPayload.fname,
          last_name: applicationPayload.lname,
          email: applicationPayload.email,
          phone: applicationPayload.phone,
          experience: applicationPayload.exp,
          cover_letter: applicationPayload.cover,
        });
      }

      await applyToJob({ job_id: applicationPayload.id });
      const apps = await getMyApplicationsForJobSeeker();
      const normalizedApps = Array.isArray(apps)
        ? apps.map(a => {
            const statusMeta = getApplicationStatusMeta(a.status);

            return {
            id: a.id,
            title: a.job_title || applicationPayload.title || 'Job',
            company: a.company_name || applicationPayload.company || 'Company',
            status: statusMeta.label,
            appliedAt: `Application #${a.id}`,
            };
          })
        : [];
      setMyApplications(normalizedApps);

      if (typeof onApply === 'function') {
        onApply(applicationPayload);
      }

      setApplyPrefill(prev => ({
        ...prev,
        first_name: applicationPayload.fname,
        last_name: applicationPayload.lname,
        email: applicationPayload.email,
        phone: applicationPayload.phone,
        experience: applicationPayload.exp,
      }));
    } catch (error) {
      toast(error.message || 'Failed to apply for job', 'error');
    }
  }

  async function handleAddSkill() {
    if (!selectedSkillId) {
      toast('Please select a skill.', 'error');
      return;
    }

    try {
      await addSkill(selectedSkillId);
      const refreshed = await getMySkills();
      setJobSeekerSkills(Array.isArray(refreshed) ? refreshed : []);
      setSelectedSkillId('');
      toast('Skill added successfully!', 'success');
    } catch (error) {
      toast(error.message || 'Failed to add skill', 'error');
    }
  }

  async function handleRemoveSkill(skillId) {
    try {
      await removeSkill(skillId);
      setJobSeekerSkills(prev => prev.filter(skill => skill.id !== skillId));
      toast('Skill removed successfully!', 'info');
    } catch (error) {
      toast(error.message || 'Failed to remove skill', 'error');
    }
  }

  function openJobModal(job) { setSelectedJob(job); }

  async function handleRecruiterStatusChange(applicationId, nextStatus, candidateName) {
    try {
      const result = await updateRecruiterApplicationStatus(applicationId, nextStatus);
      const normalized = getApplicationStatusMeta(result?.status || nextStatus).label;
      setApplicantList(prev => prev.map(a => (a.id === applicationId ? { ...a, status: normalized } : a)));
      setSelectedProfile(prev => {
        if (!prev || prev.type !== 'application' || prev.data?.id !== applicationId) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            status: normalized,
          },
        };
      });
      toast(`${candidateName} marked as ${normalized}.`, 'success');
    } catch (error) {
      toast(error.message || 'Failed to update candidate status', 'error');
    }
  }

  const notificationItems = isRecruiterRole
    ? applicantList.slice(0, 6).map(applicant => {
        const statusMeta = getApplicationStatusMeta(applicant.status);

        return {
        id: `app-${applicant.id}`,
        title: statusMeta.label === 'Pending' ? 'New application received' : `Application ${statusMeta.label.toLowerCase()}`,
        detail: `${applicant.name} · ${applicant.role}`,
        tone: statusMeta.label === 'Pending' ? 'success' : 'info',
        };
      })
    : myApplications.slice(0, 6).map(application => {
        const statusMeta = getApplicationStatusMeta(application.status);

        return {
        id: `my-${application.id}`,
        title: `Application ${statusMeta.label.toLowerCase()}`,
        detail: `${application.title} · ${application.company}`,
        tone: statusMeta.label === 'Rejected' ? 'error' : 'info',
        };
      });

  function sendMessage() {
    if (!msgInput.trim()) return;
    const text = msgInput.trim();
    setChatHistory(h => [...h, { type: 'sent', text, time: 'Just now' }]);
    setMsgInput('');
    const replies = ["Thanks for reaching out! We'll get back to you soon.", "Got your message! Let me check with the team.", "Noted! We appreciate your interest.", "Thank you! We'll follow up within 24 hours."];
    setTimeout(() => setChatHistory(h => [...h, { type: 'recv', text: replies[Math.floor(Math.random() * replies.length)], time: 'Just now' }]), 1200);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
  }

  function validateProfile() {
    const numericPhone = profileForm.phone.replace(/\D/g, '');

    const nextErrors = {
      fname: profileForm.fname.trim() ? '' : 'First name is required.',
      lname: profileForm.lname.trim() ? '' : 'Last name is required.',
      phone: !profileForm.phone.trim() ? 'Phone is required.' : (numericPhone.length < 6 ? 'Enter a valid phone number.' : ''),
      title: profileForm.title.trim() ? '' : 'Professional title is required.',
      location: profileForm.location.trim() ? '' : 'Location is required.',
      bio: profileForm.bio.trim() ? '' : 'Bio is required.',
    };

    setProfileErrors(nextErrors);
    return Object.values(nextErrors).every(err => !err);
  }

  async function saveProfile() {
    if (!validateProfile()) {
      toast('Please complete all required profile fields.', 'error');
      return;
    }

    setProfileSaving(true);
    try {
      const response = await updateMyProfile({
        first_name: profileForm.fname.trim(),
        last_name: profileForm.lname.trim(),
        phone: `${phoneCountryCode} ${profileForm.phone.trim()}`,
        professional_title: profileForm.title.trim(),
        location: profileForm.location.trim(),
        bio: profileForm.bio.trim(),
      });

      const userPatch = {
        fname: profileForm.fname.trim(),
        lname: profileForm.lname.trim(),
      };

      updateStoredSessionUser(userPatch);
      if (onUserUpdate) onUserUpdate(userPatch);

      const createdNow = String(response?.message || '').toLowerCase().includes('created');
      toast(createdNow ? 'Profile added successfully!' : 'Profile updated successfully!', 'success');
    } catch (error) {
      toast(error.message || 'Failed to save profile.', 'error');
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleProfilePhotoSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast('Only JPG and PNG images are allowed.', 'error');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('Image size must be 5MB or less.', 'error');
      event.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadMyProfileImage(file);
      const nextUrl = `${getProfileImageUrl(result.file)}?v=${Date.now()}`;
      setProfileImageUrl(nextUrl);
      toast('Profile photo updated!', 'success');
    } catch (error) {
      toast(error.message || 'Failed to upload image.', 'error');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  }

  function validateAccount() {
    const wantsEmailChange = accountEmail.trim() !== (user.email || '').trim();
    const wantsPasswordChange = !!newPass || !!confPass;

    const nextErrors = { email: '', current: '', newPass: '', confirm: '' };

    if (!wantsEmailChange && !wantsPasswordChange) {
      nextErrors.email = 'No account changes to update.';
    }

    if (wantsEmailChange && !isValidEmail(accountEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (wantsPasswordChange) {
      if (!currentPass) nextErrors.current = 'Current password is required.';
      if (!newPass) nextErrors.newPass = 'New password is required.';
      else if (newPass.length < 6) nextErrors.newPass = 'Password must be at least 6 characters.';
      if (!confPass) nextErrors.confirm = 'Please confirm your new password.';
      else if (newPass !== confPass) nextErrors.confirm = 'Passwords do not match.';
    }

    setAccountErrors(nextErrors);
    return Object.values(nextErrors).every(err => !err);
  }

  async function saveAccount() {
    if (!validateAccount()) {
      toast('Please correct account form errors.', 'error');
      return;
    }

    const wantsEmailChange = accountEmail.trim() !== (user.email || '').trim();
    const wantsPasswordChange = !!newPass;

    const payload = {};
    if (wantsEmailChange) payload.email = accountEmail.trim();
    if (wantsPasswordChange) {
      payload.current_password = currentPass;
      payload.new_password = newPass;
    }

    setAccountSaving(true);
    try {
      const response = await updateMyAccount(payload);

      if (response?.user?.email) {
        const userPatch = { email: response.user.email };
        updateStoredSessionUser(userPatch);
        if (onUserUpdate) onUserUpdate(userPatch);
      }

      setCurrentPass('');
      setNewPass('');
      setConfPass('');
      setAccountErrors({ email: '', current: '', newPass: '', confirm: '' });
      toast('Account updated successfully!', 'success');
    } catch (error) {
      const errorMessage = error.message || 'Failed to update account.';

      if (errorMessage.toLowerCase().includes('current password')) {
        setAccountErrors(prev => ({ ...prev, current: errorMessage }));
      }

      toast(errorMessage, 'error');
    } finally {
      setAccountSaving(false);
    }
  }

  const NAV_ITEMS = isRecruiterRole ? [
    { key: 'recHome', icon: 'home', label: 'Dashboard' },
    { key: 'company', icon: 'recruiters', label: 'Company Profile' },
    { key: 'postJob', icon: 'find', label: 'Post a Job' },
    { key: 'myJobs', icon: 'blog', label: 'My Jobs' },
    { key: 'applicants', icon: 'candidates', label: 'Applicants' },
    { key: 'messages', icon: 'messages', label: 'Messages', badge: 3 },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ] : [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'find', icon: 'find', label: 'Find a Job' },
    { key: 'saved', icon: 'saved', label: 'Saved Jobs', badge: savedJobs.length },
    { key: 'applications', icon: 'applications', label: 'Applications', badge: myApplications.length },
    { key: 'messages', icon: 'messages', label: 'Messages', badge: 3 },
    { key: 'recruiters', icon: 'recruiters', label: 'Recruiters' },
    { key: 'candidates', icon: 'candidates', label: 'Candidates' },
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
            <div className="jobie-sidebar-avatar">
              {profileImageUrl ? <img src={profileImageUrl} alt="Profile" /> : initials}
            </div>
            <div>
              <div className="jobie-sidebar-uname">{`${displayName}${profileForm.lname ? ` ${profileForm.lname}` : ''}`.trim()}</div>
              <div className="jobie-sidebar-role">{isRecruiterRole ? 'Recruiter' : 'Job Seeker'}</div>
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
            <div className="topbar-icon-wrap" ref={notificationMenuRef}>
              <div className="topbar-icon-btn" onClick={() => setNotificationOpen(v => !v)}>
                🔔
                <span className="topbar-dot" />
                {notificationItems.length > 0 ? <span className="topbar-badge">{notificationItems.length}</span> : null}
              </div>
              {notificationOpen && (
                <div className="topbar-notification-menu">
                  <div className="topbar-notification-head">
                    <strong>Notifications</strong>
                    <span>{notificationItems.length} updates</span>
                  </div>
                  {notificationItems.length === 0 ? (
                    <div className="topbar-notification-empty">No new notifications</div>
                  ) : notificationItems.map(item => (
                    <div key={item.id} className={`topbar-notification-item ${item.tone}`}>
                      <div className="topbar-notification-title">{item.title}</div>
                      <div className="topbar-notification-detail">{item.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="topbar-user-wrap" ref={accountMenuRef}>
              <button className={`topbar-user${accountMenuOpen ? ' open' : ''}`} onClick={() => setAccountMenuOpen(v => !v)}>
                <span className="topbar-avatar">
                  {profileImageUrl ? <img src={profileImageUrl} alt="Profile" /> : initials}
                </span>
                <span className="topbar-user-info">
                  <span className="name">{displayName}</span>
                  <span className="role">{isRecruiterRole ? 'Recruiter' : 'Job Seeker'}</span>
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
          {!isRecruiterRole && section === 'home' && (
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
                  <p>You have {myApplications.length} active applications. Keep applying to increase your chances!</p>
                </div>
              </div>
              <div className="dash-stats-row">
                <div className="dash-stat-card"><h4>Total Applied</h4><div className="num">{myApplications.length}</div><div className="change">↑ {myApplications.length} total applied</div></div>
                <div className="dash-stat-card"><h4>Saved Jobs</h4><div className="num">{savedJobs.length}</div><div className="change">Jobs bookmarked</div></div>
                <div className="dash-stat-card"><h4>Interviews</h4><div className="num">{myApplications.filter(a => getApplicationStatusMeta(a.status).key === 'interview').length}</div><div className="change">Scheduled</div></div>
              </div>
              <div className="dash-two-col">
                <div className="dash-panel">
                  <h3>Recent Applications</h3>
                  {myApplications.length === 0 ? <div style={{ color: '#9CA3AF', fontSize: 13 }}>No applications yet. Start applying!</div> : (
                    <div className="recent-apps-list">
                      {myApplications.slice(-5).reverse().map((a, i) => (
                        <div key={i} className="recent-app-item">
                          <div className="recent-app-logo" style={{ background: a.color || '#0A65CC' }}>{(a.company || 'C')[0]}</div>
                          <div className="recent-app-info"><h4>{a.title}</h4><p>{a.company} · {a.appliedAt}</p></div>
                          <span className={`app-status ${getApplicationStatusMeta(a.status).key}`}>{getApplicationStatusMeta(a.status).label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="dash-panel">
                  <h3>Recommended Jobs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {allJobs.slice(0, 4).map(j => (
                      <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #F0F0F5', cursor: 'pointer' }} onClick={() => { setSection('find'); openJobModal(j); }}>
                        <div style={j.companyLogo ? {
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          backgroundImage: `url(${j.companyLogo})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          border: '1px solid #E4E5E8',
                          flexShrink: 0,
                        } : {
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: j.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: 13,
                          flexShrink: 0,
                        }}>{j.companyLogo ? null : j.company[0]}</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: '#18191C' }}>{j.title}</div><div style={{ fontSize: 11, color: '#767F8C' }}>{j.company} · {j.salary}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FIND JOB */}
          {!isRecruiterRole && section === 'find' && (
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
                    {j.image && String(j.image).trim() ? (
                      <div className="jjc-media">
                        <img src={j.image} alt={`${j.title} role`} />
                        <div className={`jjc-bookmark jjc-bookmark-media${savedJobs.find(s => s.id === j.id) ? ' saved' : ''}`} onClick={e => { e.stopPropagation(); onSaveJob(j); }}>🔖</div>
                      </div>
                    ) : (
                      <div className="jjc-header">
                        <div className="jjc-logo" style={{ background: j.color || '#0A65CC' }}>{(j.company || 'C')[0]}</div>
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
          {!isRecruiterRole && section === 'saved' && (
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
          {!isRecruiterRole && section === 'applications' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBF0', overflowX: 'auto', overflowY: 'hidden' }}>
              {myApplications.length === 0 ? (
                <div className="app-empty">No applications yet. Find a job and apply!</div>
              ) : (
                <table className="app-table">
                  <thead><tr><th>Job Title</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
                  <tbody>
                    {myApplications.map((a, i) => (
                      <tr key={i}>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.company}</td>
                        <td>{a.appliedAt}</td>
                        <td><span className={`app-status ${getApplicationStatusMeta(a.status).key}`}>{getApplicationStatusMeta(a.status).label}</span></td>
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

          {/* RECRUITER DASHBOARD HOME */}
          {isRecruiterRole && section === 'recHome' && (
            <div>
              <div className="welcome-banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(7, 28, 56, .84) 0%, rgba(10, 101, 204, .54) 58%, rgba(10, 101, 204, .16) 100%), url(${welcomeBackImage})` }}>
                <div className="welcome-banner-content">
                  <div className="welcome-slide-bar" aria-hidden="true" />
                  <h2>Welcome back, {displayName}!</h2>
                  <p>{companyData ? `${companyData.name} · ` : ''}You have {myJobs.length} active job postings. {applicantList.length} new applicants to review!</p>
                </div>
              </div>
              <div className="dash-stats-row">
                <div className="dash-stat-card"><h4>Active Jobs</h4><div className="num">{myJobs.length}</div><div className="change">Currently posted</div></div>
                <div className="dash-stat-card"><h4>Total Applicants</h4><div className="num">{applicantList.length}</div><div className="change">Across all jobs</div></div>
                <div className="dash-stat-card"><h4>Interviews</h4><div className="num">{applicantList.filter(a => getApplicationStatusMeta(a.status).key === 'interview').length}</div><div className="change">Scheduled</div></div>
              </div>
              <div className="dash-two-col">
                <div className="dash-panel">
                  <h3>Recent Applications</h3>
                  {applicantList.length === 0 ? <div style={{ color: '#9CA3AF', fontSize: 13 }}>No applications yet.</div> : (
                    <div className="recent-apps-list">
                      {applicantList.slice(-5).reverse().map((a, i) => (
                        <div key={i} className="recent-app-item">
                          <div className="recent-app-logo" style={{ background: '#0A65CC' }}>{(a.name || 'A')[0]}</div>
                          <div className="recent-app-info"><h4>{a.name}</h4><p>{a.role} · {a.applied}</p></div>
                          <span className={`app-status ${getApplicationStatusMeta(a.status).key}`}>{getApplicationStatusMeta(a.status).label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="dash-panel">
                  <h3>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button onClick={() => setSection('company')} style={{ padding: '12px 14px', background: '#F7F8FC', border: '1px solid #E4E5E8', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#0A65CC', textAlign: 'left' }}>🏢 Manage Company Profile</button>
                    <button onClick={() => setSection('postJob')} style={{ padding: '12px 14px', background: '#F7F8FC', border: '1px solid #E4E5E8', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#0A65CC', textAlign: 'left' }}>📝 Post a New Job</button>
                    <button onClick={() => setSection('myJobs')} style={{ padding: '12px 14px', background: '#F7F8FC', border: '1px solid #E4E5E8', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#0A65CC', textAlign: 'left' }}>📋 View All Jobs</button>
                    <button onClick={() => setSection('applicants')} style={{ padding: '12px 14px', background: '#F7F8FC', border: '1px solid #E4E5E8', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#0A65CC', textAlign: 'left' }}>👥 View Applicants</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RECRUITER - COMPANY PROFILE */}
          {isRecruiterRole && section === 'company' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBF0', padding: 24 }}>
              <h3 style={{ fontFamily: 'Jost', fontSize: 20, fontWeight: 700, color: '#18191C', marginBottom: 20 }}>Company Profile</h3>
              {companyData && !isEditingCompany ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Company Name</label>
                      <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, color: '#18191C' }}>{companyData.name}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Location</label>
                      <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, color: '#18191C' }}>📍 New York, USA</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    {companyData.logo ? (
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Company Logo</label>
                        <img
                          src={getProfileImageUrl(companyData.logo)}
                          alt="Company logo"
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid #E4E5E8' }}
                        />
                      </div>
                    ) : null}
                    <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Description</label>
                    <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, color: '#18191C', minHeight: 80 }}>{companyData.description}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditingCompany(true);
                      setCompanyForm({ name: companyData.name || '', description: companyData.description || '' });
                      setCompanyLogoFile(null);
                      setCompanyLogoPreview(companyData.logo ? getProfileImageUrl(companyData.logo) : '');
                    }}
                    style={{ padding: '10px 18px', background: '#0A65CC', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 14, fontWeight: 600 }}
                  >
                    Edit Company
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#767F8C', marginBottom: 20 }}>Set up your company profile to start posting jobs</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Company Name *</label>
                      <input value={companyForm.name} onChange={e => setCompanyForm(f => ({ ...f, name: e.target.value }))} placeholder="Your company name" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Company Logo</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={e => {
                        const file = e.target.files?.[0] || null;
                        if (!file) {
                          setCompanyLogoFile(null);
                          setCompanyLogoPreview('');
                          return;
                        }

                        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                          toast('Only JPG and PNG images are allowed.', 'error');
                          e.target.value = '';
                          setCompanyLogoFile(null);
                          setCompanyLogoPreview('');
                          return;
                        }

                        if (file.size > 5 * 1024 * 1024) {
                          toast('Logo size must be 5MB or less.', 'error');
                          e.target.value = '';
                          setCompanyLogoFile(null);
                          setCompanyLogoPreview('');
                          return;
                        }

                        setCompanyLogoFile(file);
                        setCompanyLogoPreview(URL.createObjectURL(file));
                      }}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none' }}
                    />
                    {companyLogoPreview ? (
                      <img
                        src={companyLogoPreview}
                        alt="Logo preview"
                        style={{ marginTop: 10, width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid #E4E5E8' }}
                      />
                    ) : null}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Company Description *</label>
                    <textarea value={companyForm.description} onChange={e => setCompanyForm(f => ({ ...f, description: e.target.value }))} placeholder="Tell us about your company..." style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none', minHeight: 120, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleSaveCompany} style={{ padding: '11px 20px', background: '#0A65CC', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 14, fontWeight: 600 }}>
                      {isEditingCompany ? 'Update Company Profile' : 'Create Company Profile'}
                    </button>
                    {isEditingCompany ? (
                      <button
                        onClick={() => {
                          setIsEditingCompany(false);
                          setCompanyForm({ name: '', description: '' });
                          setCompanyLogoFile(null);
                          setCompanyLogoPreview('');
                        }}
                        style={{ padding: '11px 20px', background: 'transparent', color: '#0A65CC', border: '1.5px solid #0A65CC', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 14, fontWeight: 600 }}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RECRUITER - POST JOB */}
          {isRecruiterRole && section === 'postJob' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBF0', padding: 24 }}>
              <h3 style={{ fontFamily: 'Jost', fontSize: 20, fontWeight: 700, color: '#18191C', marginBottom: 20 }}>{editingJobId ? 'Edit Job' : 'Post a New Job'}</h3>
              {!companyData ? (
                <div style={{ padding: 20, background: '#FEF3C7', borderRadius: 8, color: '#92400E', fontFamily: 'Mulish', fontSize: 14 }}>⚠️ Please create a company profile first before posting jobs. <button onClick={() => setSection('company')} style={{ marginTop: 10, padding: '8px 16px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Go to Company Profile</button></div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Job Title *</label>
                      <input value={jobForm.title} onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior React Developer" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Job Type *</label>
                      <select value={jobForm.jobType} onChange={e => setJobForm(f => ({ ...f, jobType: e.target.value }))} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none' }}>
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Job Description *</label>
                    <textarea value={jobForm.description} onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the job role, responsibilities, and requirements..." style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none', minHeight: 140, resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600, color: '#18191C', marginBottom: 8 }}>Required Skills (comma separated)</label>
                    <input
                      value={jobForm.requiredSkills}
                      onChange={e => setJobForm(f => ({ ...f, requiredSkills: e.target.value }))}
                      placeholder="e.g. React, Node.js, SQL"
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handlePostJob} style={{ padding: '11px 20px', background: '#0A65CC', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 14, fontWeight: 600 }}>
                      {editingJobId ? 'Update Job' : 'Post Job'}
                    </button>
                    <button
                      onClick={() => {
                        setJobForm({ title: '', description: '', jobType: 'Full-Time', requiredSkills: '' });
                        setEditingJobId(null);
                      }}
                      style={{ padding: '11px 20px', background: 'transparent', color: '#0A65CC', border: '1.5px solid #0A65CC', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 14, fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RECRUITER - MY JOBS */}
          {isRecruiterRole && section === 'myJobs' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBF0', overflowX: 'auto', overflowY: 'hidden' }}>
              <div style={{ padding: 24, borderBottom: '1px solid #EBEBF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C' }}>My Jobs ({myJobs.length})</h3>
                <button onClick={() => setSection('postJob')} style={{ padding: '8px 16px', background: '#0A65CC', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 600 }}>+ Post New Job</button>
              </div>
              {myJobs.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No jobs posted yet. Start by posting your first job!</div>
              ) : (
                <table className="app-table">
                  <thead><tr><th>Job Title</th><th>Posted</th><th>Applicants</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {myJobs.map((j, i) => (
                      <tr key={i}>
                        <td><strong>{j.title}</strong></td>
                        <td>{j.posted}</td>
                        <td><span style={{ fontWeight: 600, color: '#0A65CC' }}>{j.applicants}</span></td>
                        <td><span className={`app-status ${getApplicationStatusMeta(j.status).key}`}>{j.status}</span></td>
                        <td><button onClick={() => handleEditJobClick(j)} style={{ padding: '4px 10px', background: '#F0F0F5', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#18191C' }}>Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* RECRUITER - APPLICANTS */}
          {isRecruiterRole && section === 'applicants' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBF0', overflowX: 'auto', overflowY: 'hidden' }}>
              <div style={{ padding: 24, borderBottom: '1px solid #EBEBF0' }}>
                <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C' }}>Applicants ({applicantList.length})</h3>
              </div>
              {applicantList.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No applicants yet.</div>
              ) : (
                <table className="app-table">
                  <thead><tr><th>Candidate</th><th>Role Applied</th><th>Match</th><th>Resume</th><th>Status</th><th>Applied</th><th>Actions</th></tr></thead>
                  <tbody>
                    {applicantList.map((a, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{a.name}</strong>
                          <div style={{ fontSize: 11, color: '#767F8C' }}>{a.email || 'No email'}</div>
                        </td>
                        <td>{a.role}</td>
                        <td><span style={{ fontWeight: 600, color: '#0A65CC' }}>{a.match}</span></td>
                        <td>
                          {a.resumeFile ? (
                            <a href={getResumeFileUrl(a.resumeFile)} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0A65CC', fontWeight: 700, textDecoration: 'none' }}>Open Resume</a>
                          ) : (
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>No resume</span>
                          )}
                        </td>
                        <td><span className={`app-status ${getApplicationStatusMeta(a.status).key}`}>{getApplicationStatusMeta(a.status).label}</span></td>
                        <td>{a.applied}</td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setSelectedProfile({ type: 'application', data: a })} style={{ padding: '4px 10px', background: '#F0F0F5', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#18191C' }}>View</button>
                          <button onClick={() => handleRecruiterStatusChange(a.id, 'interview', a.name)} style={{ padding: '4px 10px', background: '#EEF5FF', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#0A65CC' }}>Interview</button>
                          <button onClick={() => handleRecruiterStatusChange(a.id, 'rejected', a.name)} style={{ padding: '4px 10px', background: '#FFF1F1', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#B42318' }}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* RECRUITERS */}
          {!isRecruiterRole && section === 'recruiters' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C' }}>Top Recruiters</h3>
              </div>
              <div className="recruiters-grid">
                {directoryRecruiters.map((r, i) => (
                  <div key={i} className="recruiter-card">
                    <div className="recruiter-avatar" style={r.logo ? {
                      backgroundImage: `url(${getProfileImageUrl(r.logo)})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: '#fff',
                    } : { background: r.color }}>
                      {r.logo ? null : r.name[0]}
                    </div>
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
          {!isRecruiterRole && section === 'candidates' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 700, color: '#18191C' }}>Browse Candidates</h3>
                <input type="text" placeholder="Search candidates..." style={{ padding: '9px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 13, outline: 'none', width: 220 }} />
              </div>
              <div className="candidates-grid">
                {directoryCandidates.map((c, i) => (
                  <div key={i} className="candidate-card">
                    <div
                      className="candidate-avatar"
                      style={c.profileImage ? {
                        backgroundImage: `url(${getProfileImageUrl(c.profileImage)})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      } : { background: c.color }}
                    >
                      {c.profileImage ? null : c.initials}
                    </div>
                    <div className="candidate-name">{c.name}</div>
                    <div className="candidate-role">{c.role}</div>
                    <div className="candidate-skills">{c.skills.map(s => <span key={s} className="candidate-skill">{s}</span>)}</div>
                    <button className="btn-view-profile" onClick={() => setSelectedProfile({ type: 'candidate', data: c })}>View Profile</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG */}
          {false && !isRecruiterRole && section === 'blog' && (
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
          {false && !isRecruiterRole && section === 'news' && (
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
                        <div className="avatar-big">{profileImageUrl ? <img src={profileImageUrl} alt="Profile" /> : initials}</div>
                        <div>
                          <input
                            ref={profileFileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            className="profile-file-input"
                            onChange={handleProfilePhotoSelect}
                          />
                          <button className="btn-upload-photo" onClick={() => profileFileInputRef.current?.click()} disabled={uploadingImage}>
                            {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                          </button>
                          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>JPG, PNG, max 5MB</p>
                        </div>
                      </div>
                      <div className="settings-row">
                        <div className="settings-field">
                          <label>First Name</label>
                          <input
                            value={profileForm.fname}
                            className={profileErrors.fname ? 'settings-input-error' : ''}
                            onChange={e => {
                              setProfileForm(f => ({ ...f, fname: e.target.value }));
                              setProfileErrors(prev => ({ ...prev, fname: '' }));
                            }}
                            placeholder="First Name"
                          />
                          {profileErrors.fname && <div className="settings-error-msg">{profileErrors.fname}</div>}
                        </div>
                        <div className="settings-field">
                          <label>Last Name</label>
                          <input
                            value={profileForm.lname}
                            className={profileErrors.lname ? 'settings-input-error' : ''}
                            onChange={e => {
                              setProfileForm(f => ({ ...f, lname: e.target.value }));
                              setProfileErrors(prev => ({ ...prev, lname: '' }));
                            }}
                            placeholder="Last Name"
                          />
                          {profileErrors.lname && <div className="settings-error-msg">{profileErrors.lname}</div>}
                        </div>
                      </div>
                      <div className="settings-field">
                        <label>Phone</label>
                        <div className="settings-phone-group">
                          <select
                            value={phoneCountryCode}
                            onChange={e => setPhoneCountryCode(e.target.value)}
                            className={profileErrors.phone ? 'settings-input-error' : ''}
                          >
                            {COUNTRY_PHONE_CODES.map(item => (
                              <option key={item.code} value={item.code}>{item.label}</option>
                            ))}
                          </select>
                          <input
                            value={profileForm.phone}
                            className={profileErrors.phone ? 'settings-input-error' : ''}
                            onChange={e => {
                              setProfileForm(f => ({ ...f, phone: e.target.value }));
                              setProfileErrors(prev => ({ ...prev, phone: '' }));
                            }}
                            placeholder="555 123 4567"
                          />
                        </div>
                        {profileErrors.phone && <div className="settings-error-msg">{profileErrors.phone}</div>}
                      </div>
                      <div className="settings-field">
                        <label>Professional Title</label>
                        <input
                          value={profileForm.title}
                          className={profileErrors.title ? 'settings-input-error' : ''}
                          onChange={e => {
                            setProfileForm(f => ({ ...f, title: e.target.value }));
                            setProfileErrors(prev => ({ ...prev, title: '' }));
                          }}
                          placeholder="e.g. Senior Software Engineer"
                        />
                        {profileErrors.title && <div className="settings-error-msg">{profileErrors.title}</div>}
                      </div>
                      <div className="settings-field">
                        <label>Location</label>
                        <input
                          value={profileForm.location}
                          className={profileErrors.location ? 'settings-input-error' : ''}
                          onChange={e => {
                            setProfileForm(f => ({ ...f, location: e.target.value }));
                            setProfileErrors(prev => ({ ...prev, location: '' }));
                          }}
                          placeholder="City, Country"
                        />
                        {profileErrors.location && <div className="settings-error-msg">{profileErrors.location}</div>}
                      </div>
                      <div className="settings-field">
                        <label>Bio</label>
                        <textarea
                          value={profileForm.bio}
                          className={profileErrors.bio ? 'settings-input-error' : ''}
                          onChange={e => {
                            setProfileForm(f => ({ ...f, bio: e.target.value }));
                            setProfileErrors(prev => ({ ...prev, bio: '' }));
                          }}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none', minHeight: 90, resize: 'vertical' }}
                          placeholder="Tell employers about yourself..."
                        />
                        {profileErrors.bio && <div className="settings-error-msg">{profileErrors.bio}</div>}
                      </div>
                      {!isRecruiterRole && (
                        <div className="settings-field">
                          <label>My Skills</label>
                          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                            <select
                              value={selectedSkillId}
                              onChange={e => setSelectedSkillId(e.target.value)}
                              style={{ flex: 1, padding: '11px 14px', border: '1.5px solid #E4E5E8', borderRadius: 8, fontFamily: 'Mulish', fontSize: 14, outline: 'none' }}
                            >
                              <option value="">Select a skill</option>
                              {jobSeekerSkillCatalog.map(skill => (
                                <option key={skill.id} value={skill.id}>{skill.skill_name}</option>
                              ))}
                            </select>
                            <button className="settings-save" onClick={handleAddSkill} type="button">Add Skill</button>
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {jobSeekerSkills.map(skill => (
                              <span key={skill.id} className="candidate-skill" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                {skill.skill_name}
                                <button type="button" onClick={() => handleRemoveSkill(skill.id)} style={{ border: 'none', background: 'transparent', color: '#0A65CC', cursor: 'pointer', fontWeight: 700 }}>×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <button className="settings-save" onClick={saveProfile} disabled={profileSaving}>{profileSaving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                  )}
                  {settingsPanel === 'account' && (
                    <div className="settings-panel-section active">
                      <h3>Account &amp; Security</h3>
                      <div className="settings-field">
                        <label>Account Email</label>
                        <input
                          type="email"
                          value={accountEmail}
                          className={accountErrors.email ? 'settings-input-error' : ''}
                          onChange={e => {
                            setAccountEmail(e.target.value);
                            setAccountErrors(prev => ({ ...prev, email: '' }));
                          }}
                          placeholder="your@email.com"
                        />
                        {accountErrors.email && <div className="settings-error-msg">{accountErrors.email}</div>}
                      </div>
                      <div className="settings-field">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={currentPass}
                          className={accountErrors.current ? 'settings-input-error' : ''}
                          onChange={e => {
                            setCurrentPass(e.target.value);
                            setAccountErrors(prev => ({ ...prev, current: '' }));
                          }}
                          placeholder="Required for password change"
                        />
                        {accountErrors.current && <div className="settings-error-msg">{accountErrors.current}</div>}
                      </div>
                      <div className="settings-field">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={newPass}
                          className={accountErrors.newPass ? 'settings-input-error' : ''}
                          onChange={e => {
                            setNewPass(e.target.value);
                            setAccountErrors(prev => ({ ...prev, newPass: '' }));
                          }}
                          placeholder="Min 6 characters"
                        />
                        {accountErrors.newPass && <div className="settings-error-msg">{accountErrors.newPass}</div>}
                      </div>
                      <div className="settings-field">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={confPass}
                          className={accountErrors.confirm ? 'settings-input-error' : ''}
                          onChange={e => {
                            setConfPass(e.target.value);
                            setAccountErrors(prev => ({ ...prev, confirm: '' }));
                          }}
                          placeholder="Repeat new password"
                        />
                        {accountErrors.confirm && <div className="settings-error-msg">{accountErrors.confirm}</div>}
                      </div>
                      <button className="settings-save" onClick={saveAccount} disabled={accountSaving}>{accountSaving ? 'Updating...' : 'Update Account'}</button>
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

      {/* PROFILE / CV MODAL */}
      {selectedProfile && (
        <div className="djm-overlay open" onClick={e => { if (e.target === e.currentTarget) setSelectedProfile(null); }}>
          <div className="profile-card">
            <button className="djm-close" onClick={() => setSelectedProfile(null)}>✕</button>
            {selectedProfile.type === 'candidate' ? (
              <>
                <div className="profile-header">
                  <div className="profile-avatar" style={selectedProfile.data.profileImage ? {
                    backgroundImage: `url(${getProfileImageUrl(selectedProfile.data.profileImage)})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : { background: '#0A65CC' }}>{selectedProfile.data.profileImage ? null : selectedProfile.data.initials}</div>
                  <div>
                    <h2>{selectedProfile.data.name}</h2>
                    <p>{selectedProfile.data.role}</p>
                  </div>
                </div>
                <div className="profile-meta-grid">
                  <div><span>Email</span><strong>{selectedProfile.data.email || 'Private'}</strong></div>
                  <div><span>Location</span><strong>{selectedProfile.data.location || 'Not provided'}</strong></div>
                </div>
                <div className="profile-section">
                  <h4>Bio</h4>
                  <p>{selectedProfile.data.bio || 'No bio shared yet.'}</p>
                </div>
                <div className="profile-section">
                  <h4>Skills</h4>
                  <div className="candidate-skills">
                    {selectedProfile.data.skills.length > 0
                      ? selectedProfile.data.skills.map(skill => <span key={skill} className="candidate-skill">{skill}</span>)
                      : <span className="profile-empty-note">No skills listed.</span>}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="profile-header">
                  <div className="profile-avatar" style={selectedProfile.data.profileImage ? {
                    backgroundImage: `url(${getProfileImageUrl(selectedProfile.data.profileImage)})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : { background: '#0A65CC' }}>{selectedProfile.data.profileImage ? null : selectedProfile.data.name[0]}</div>
                  <div>
                    <h2>{selectedProfile.data.name}</h2>
                    <p>{selectedProfile.data.role}</p>
                  </div>
                </div>
                <div className="profile-meta-grid">
                  <div><span>Email</span><strong>{selectedProfile.data.email || 'Private'}</strong></div>
                  <div><span>Phone</span><strong>{selectedProfile.data.phone || 'Private'}</strong></div>
                  <div><span>Location</span><strong>{selectedProfile.data.location || 'Not provided'}</strong></div>
                  <div><span>Experience</span><strong>{selectedProfile.data.experience || 'Not provided'}</strong></div>
                  <div><span>Match Score</span><strong>{selectedProfile.data.match || '0%'}</strong></div>
                  <div><span>Status</span><strong>{selectedProfile.data.status || 'Pending'}</strong></div>
                  <div><span>{selectedProfile.data.status === 'Rejected' ? 'Rejection Reason' : 'AI Review'}</span><strong>{selectedProfile.data.prediction || (selectedProfile.data.status === 'Rejected' ? 'No reason provided' : 'Interview')}</strong></div>
                  <div><span>Resume Score</span><strong>{selectedProfile.data.resumeScore}</strong></div>
                  <div><span>Project Score</span><strong>{selectedProfile.data.projectScore}</strong></div>
                  <div><span>Job Applied</span><strong>{selectedProfile.data.role || 'Applied Role'}</strong></div>
                </div>
                <div className="profile-section">
                  <h4>Profile Summary</h4>
                  <p>{selectedProfile.data.bio || 'No profile bio available.'}</p>
                </div>
                <div className="profile-section">
                  <h4>Skills</h4>
                  <div className="candidate-skills">
                    {selectedProfile.data.skills?.length
                      ? selectedProfile.data.skills.map(skill => <span key={skill} className="candidate-skill">{skill}</span>)
                      : <span className="profile-empty-note">No skills listed.</span>}
                  </div>
                </div>
                <div className="profile-section">
                  <h4>Cover Letter</h4>
                  <p>{selectedProfile.data.coverLetter || 'No cover letter shared.'}</p>
                </div>
                <div className="profile-section">
                  <h4>Resume</h4>
                  {selectedProfile.data.resumeFile ? (
                    <a className="resume-link" href={getResumeFileUrl(selectedProfile.data.resumeFile)} target="_blank" rel="noreferrer">Open Resume</a>
                  ) : (
                    <span className="profile-empty-note">No resume uploaded.</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button
                    onClick={() => handleRecruiterStatusChange(selectedProfile.data.id, 'interview', selectedProfile.data.name)}
                    style={{ padding: '10px 16px', background: '#EEF5FF', color: '#0A65CC', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 700 }}
                  >
                    Mark Interview
                  </button>
                  <button
                    onClick={() => handleRecruiterStatusChange(selectedProfile.data.id, 'rejected', selectedProfile.data.name)}
                    style={{ padding: '10px 16px', background: '#FFF1F1', color: '#B42318', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mulish', fontSize: 13, fontWeight: 700 }}
                  >
                    Reject Candidate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* APPLY MODAL */}
      <ApplyModal open={!!applyJob} job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleJobSeekerApply} prefill={applyPrefill} />
    </div>
  );
}
