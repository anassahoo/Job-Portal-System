import { useState, useCallback, useEffect } from 'react';

let toastHandler = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => { toastHandler = showToast; }, [showToast]);

  return { toasts, showToast };
}

export function toast(msg, type = 'info') {
  if (toastHandler) toastHandler(msg, type);
}

export function ToastContainer({ toasts }) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-msg ${t.type}`}>
          <span>{icons[t.type] || 'ℹ️'}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}