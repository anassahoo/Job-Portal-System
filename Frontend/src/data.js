import creativeWritingImage from './assets/categories/creative-writing.avif';
import engineeringImage from './assets/categories/engineering.jpg';
import financeCategoryImage from './assets/categories/finance.webp';
import humanResourceImage from './assets/categories/human-resource.webp';
import managementImage from './assets/categories/management.gif';
import marketResearchImage from './assets/categories/market-research.jpg';
import marketingSalesImage from './assets/categories/marketing-sales.jpg';
import retailProductImage from './assets/categories/retail-product.jpg';
import softwareImage from './assets/categories/software.webp';
import contentStrategistImage from './assets/job-of-day/content-strategist.avif';
import financeAnalystImage from './assets/job-of-day/finance-analyst.jpg';
import fullStackDeveloperImage from './assets/job-of-day/full-stack-developer.jpg';
import hrBusinessPartnerImage from './assets/job-of-day/hr-business-partner.webp';
import leadQualityControlImage from './assets/job-of-day/lead-quality-control.webp';
import reactNativeImage from './assets/job-of-day/react-native.png';
import systemEngineerImage from './assets/job-of-day/system-engineer.jpg';
import uiUxDesignerImage from './assets/job-of-day/ui-ux-designer.jpg';

export const JOBS_DATA = [
  { id: 1, title: 'Lead Quality Control QA', company: 'Ashford', location: 'France', type: 'Full-Time', salary: '$500/hr', tags: ['App', 'Figma', 'Java'], color: '#EF4444', category: 'software', remote: false, image: leadQualityControlImage },
  { id: 2, title: 'React Native Web Developer', company: 'Percepta', location: 'Germany', type: 'Full-Time', salary: '$800/hr', tags: ['React', 'Node.js', 'Figma'], color: '#3B82F6', category: 'software', remote: false, image: reactNativeImage },
  { id: 3, title: 'Senior System Engineer', company: 'Tesla', location: 'Denmark', type: 'Temporary', salary: '$600/hr', tags: ['AWS', 'Docker', 'Linux'], color: '#E31937', category: 'software', remote: false, image: systemEngineerImage },
  { id: 4, title: 'Full Stack Engineer', company: 'Bing Search', location: 'New York, USA', type: 'Internship', salary: '$800/hr', tags: ['Figma', 'Python', 'SQL'], color: '#8B5CF6', category: 'software', remote: false, image: fullStackDeveloperImage },
  { id: 5, title: 'UI/UX Designer Fulltime', company: 'Exela Movers', location: 'Australia', type: 'Full-Time', salary: '$650/hr', tags: ['Figma', 'Sketch', 'XD'], color: '#F59E0B', category: 'design', remote: false, image: uiUxDesignerImage },
  { id: 6, title: 'Marketing Manager', company: 'BrandAmp', location: 'Remote', type: 'Remote', salary: '$120K/yr', tags: ['SEO', 'Analytics', 'Ads'], color: '#059669', category: 'marketing', remote: true, image: marketingSalesImage },
  { id: 7, title: 'Finance Analyst', company: 'Goldman Sachs', location: 'New York', type: 'Full-Time', salary: '$140K/yr', tags: ['Excel', 'CFA', 'SAP'], color: '#1E40AF', category: 'finance', remote: false, image: financeAnalystImage },
  { id: 8, title: 'HR Business Partner', company: 'Spotify', location: 'Sweden', type: 'Full-Time', salary: '$90K/yr', tags: ['HR', 'Recruiting', 'HRIS'], color: '#1DB954', category: 'hr', remote: false, image: hrBusinessPartnerImage },
  { id: 9, title: 'Content Strategist', company: 'HubSpot', location: 'Remote', type: 'Remote', salary: '$80K/yr', tags: ['Writing', 'SEO', 'CMS'], color: '#FF7A59', category: 'marketing', remote: true, image: contentStrategistImage },
  { id: 10, title: 'Product Manager', company: 'Airbnb', location: 'San Francisco', type: 'Full-Time', salary: '$160K/yr', tags: ['Agile', 'Jira', 'Analytics'], color: '#FF5A5F', category: 'management', remote: false, image: managementImage },
  { id: 11, title: 'Data Scientist', company: 'OpenAI', location: 'Remote', type: 'Remote', salary: '$180K/yr', tags: ['Python', 'ML', 'TensorFlow'], color: '#10A37F', category: 'software', remote: true, image: softwareImage },
  { id: 12, title: 'DevOps Engineer', company: 'Microsoft', location: 'Redmond', type: 'Full-Time', salary: '$150K/yr', tags: ['Azure', 'K8s', 'CI/CD'], color: '#0078D4', category: 'software', remote: false, image: engineeringImage },
];

export const LANDING_JOBS = [
  { title: 'Lead Quality Control QA', company: 'Ashford', loc: 'France', type: 'Full-Time', salary: '$500/hr', skills: ['App', 'Figma', 'Java'], color: '#EF4444', cat: 'all', image: leadQualityControlImage },
  { title: 'React Native Web Developer', company: 'Percepta', loc: 'Germany', type: 'Full-Time', salary: '$800/hr', skills: ['App', 'Figma', 'PSD'], color: '#3B82F6', cat: 'software', image: reactNativeImage },
  { title: 'Senior System Engineer', company: 'Tesla', loc: 'Denmark', type: 'Temporary', salary: '$600/hr', skills: ['App', 'Figma', 'Java'], color: '#E31937', cat: 'software', image: systemEngineerImage },
  { title: 'Full Stack Engineer', company: 'Bing Search', loc: 'New York, USA', type: 'Internship', salary: '$800/hr', skills: ['Figma'], color: '#8B5CF6', cat: 'software', image: fullStackDeveloperImage },
  { title: 'UI/UX Designer Fulltime', company: 'Exela Movers', loc: 'Australia', type: 'Full-Time', salary: '$650/hr', skills: ['Figma', 'Sketch'], color: '#F59E0B', cat: 'design', image: uiUxDesignerImage },
  { title: 'Content Strategist', company: 'HubSpot', loc: 'Remote', type: 'Remote', salary: '$80K/yr', skills: ['Writing', 'SEO'], color: '#FF7A59', cat: 'content', image: contentStrategistImage },
  { title: 'Finance Analyst', company: 'Goldman Sachs', loc: 'New York', type: 'Full-Time', salary: '$140K/yr', skills: ['Excel', 'CFA'], color: '#1E40AF', cat: 'finance', image: financeAnalystImage },
  { title: 'HR Business Partner', company: 'Spotify', loc: 'Sweden', type: 'Full-Time', salary: '$90K/yr', skills: ['HR', 'Recruiting'], color: '#1DB954', cat: 'hr', image: hrBusinessPartnerImage },
];

export const RECRUITERS = [
  { name: 'Mark Rivera', company: 'Tesla · Talent Acquisition', jobs: 89, rating: '4.7★', color: '#E31937' },
  { name: 'Priya Patel', company: 'Meta · Senior Recruiter', jobs: 210, rating: '4.8★', color: '#0866FF' },
  { name: 'James Liu', company: 'Amazon · Recruiter', jobs: 178, rating: '4.6★', color: '#FF6900' },
  { name: 'Nina Okafor', company: 'Netflix · HR Manager', jobs: 95, rating: '4.9★', color: '#6454F0' },
  { name: 'Ahmed Hassan', company: 'Airbnb · Talent Lead', jobs: 67, rating: '4.5★', color: '#0A65CC' },
];

export const CANDIDATES = [
  { initials: 'AL', name: 'Alex Lee', role: 'Full Stack Developer', skills: ['React', 'Node.js', 'Python'], color: '#6454F0' },
  { initials: 'MK', name: 'Maria Kim', role: 'UX Designer', skills: ['Figma', 'Sketch', 'XD'], color: '#059669' },
  { initials: 'JS', name: 'John Smith', role: 'Data Scientist', skills: ['Python', 'ML', 'SQL'], color: '#D97706' },
  { initials: 'PR', name: 'Priya Rao', role: 'Product Manager', skills: ['Agile', 'Jira', 'GA'], color: '#dc2626' },
  { initials: 'DM', name: 'David Moore', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'K8s'], color: '#0A65CC' },
  { initials: 'SN', name: 'Sophie N.', role: 'Marketing Manager', skills: ['SEO', 'Analytics', 'Ads'], color: '#7C3AED' },
  { initials: 'RC', name: 'Ryan Chen', role: 'Backend Engineer', skills: ['Go', 'Rust', 'Redis'], color: '#BE185D' },
  { initials: 'LA', name: 'Layla Ahmed', role: 'Finance Analyst', skills: ['Excel', 'CFA', 'SAP'], color: '#047857' },
];

export const MESSAGES = [
  { name: 'Sarah @ Google', email: 'sarah@google.com', subject: 'Interview Invitation', preview: 'Hi! We reviewed your application...', time: '10:30 AM', color: '#4285F4' },
  { name: 'Mark @ Tesla', email: 'mark@tesla.com', subject: 'Re: Application Status', preview: 'Thanks for applying, we are...', time: '9:15 AM', color: '#E31937' },
  { name: 'Priya @ Meta', email: 'priya@meta.com', subject: 'Exciting Opportunity', preview: 'We have a role that might be...', time: 'Yesterday', color: '#0866FF' },
];

const RAW_CATEGORIES = [
  { icon: '🛒', name: 'Retail & Product', count: 3, bg: '#FFF0EA' },
  { image: creativeWritingImage, name: 'Content Writer', count: 8, bg: '#EEF5FF' },
  { icon: '👥', name: 'Human Resource', count: 3, bg: '#F0FDF4' },
  { icon: '🔬', name: 'Market Research', count: 4, bg: '#FEF9EE' },
  { icon: '🏪', name: 'Retail & Product', count: 4, bg: '#FFF0EA' },
  { icon: '💻', name: 'Software', count: 4, bg: '#EEF5FF' },
  { icon: '💰', name: 'Finance', count: 5, bg: '#F0FDF4' },
  { icon: '📊', name: 'Management', count: 5, bg: '#FFF7ED' },
  { icon: '📣', name: 'Marketing & Sale', count: 4, bg: '#FDF4FF' },
  { icon: '⚙️', name: 'Engineering', count: 4, bg: '#EEF5FF' },
];

const CATEGORY_IMAGES = {
  'Retail & Product': retailProductImage,
  'Content Writer': creativeWritingImage,
  'Human Resource': humanResourceImage,
  'Market Research': marketResearchImage,
  Software: softwareImage,
  Finance: financeCategoryImage,
  Management: managementImage,
  'Marketing & Sale': marketingSalesImage,
  Engineering: engineeringImage,
};

export const CATEGORIES = RAW_CATEGORIES.map(category => ({
  ...category,
  image: CATEGORY_IMAGES[category.name],
}));
