import { useState } from 'react';
import './index.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { ToastContainer, useToast } from './components/Toast';
import { toast } from './components/Toast';

export default function App() {
  const { toasts, showToast } = useToast();
  const [page, setPage] = useState('landing'); // 'landing' | 'dashboard'
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  const [currentUser, setCurrentUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  function openAuth(tab = 'signin') {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  function handleLogin(user) {
    setCurrentUser(user);
    setAuthOpen(false);
    setPage('dashboard');
    window.scrollTo(0, 0);
  }

  function handleSignOut() {
    setCurrentUser(null);
    setSavedJobs([]);
    setApplications([]);
    setPage('landing');
    window.scrollTo(0, 0);
    toast('Signed out successfully.', 'info');
  }

  function handleSaveJob(job) {
    setSavedJobs(prev => {
      if (prev.find(j => j.id === job.id)) {
        toast(`"${job.title}" is already saved.`, 'info');
        return prev;
      }
      toast(`"${job.title}" saved to your list!`, 'success');
      return [...prev, job];
    });
  }

  function handleRemoveSaved(id) {
    setSavedJobs(prev => prev.filter(j => j.id !== id));
  }

  function handleApply(application) {
    setApplications(prev => [...prev, application]);
  }

  return (
    <>
      {page === 'landing' && (
        <LandingPage onOpenAuth={openAuth} />
      )}
      {page === 'dashboard' && currentUser && (
        <Dashboard
          user={currentUser}
          onSignOut={handleSignOut}
          onApply={handleApply}
          savedJobs={savedJobs}
          applications={applications}
          onSaveJob={handleSaveJob}
          onRemoveSaved={handleRemoveSaved}
        />
      )}
      <AuthModal
        open={authOpen}
        tab={authTab}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
      />
      <ToastContainer toasts={toasts} />
    </>
  );
}