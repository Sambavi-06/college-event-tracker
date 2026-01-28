import React, { createContext, useEffect, useState } from 'react';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('notifications');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  function addNotification(message, type = 'info', recipient = null) {
    const notif = {
      id: Date.now(),
      message,
      type,
      recipient,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    return notif;
  }

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead(recipient = null) {
    setNotifications((prev) =>
      prev.map((n) =>
        recipient ? (n.recipient === recipient ? { ...n, read: true } : n) : { ...n, read: true }
      )
    );
  }

  function getUnreadCount(recipient = null) {
    return notifications.filter((n) => !n.read && (!recipient || n.recipient === recipient)).length;
  }

  function getNotificationsForRecipient(recipient) {
    return notifications.filter((n) => n.recipient === recipient);
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        getUnreadCount,
        getNotificationsForRecipient,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsContext;
