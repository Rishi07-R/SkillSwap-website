import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataService } from '../lib/dataService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { currentProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);

  const fetchNotifications = async () => {
    if (!currentProfile?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await DataService.getNotifications(currentProfile.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [currentProfile?.id]);

  const showToast = (message, type = 'info', title = '') => {
    setToast({ id: Date.now(), message, type, title });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const markAsRead = async (id) => {
    await DataService.markNotificationRead(id);
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    if (currentProfile?.id) {
      await DataService.markAllNotificationsRead(currentProfile.id);
      await fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toast,
        showToast,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-slide-up shadow-2xl rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
            toast.type === 'error' ? 'bg-rose-100 text-rose-700' :
            toast.type === 'warning' ? 'bg-amber-100 text-amber-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            <span className="text-xl">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '✨'}
            </span>
          </div>
          <div className="flex-1">
            {toast.title && <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{toast.title}</h4>}
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
