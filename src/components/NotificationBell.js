import React, { useContext, useState } from 'react';
import NotificationsContext from '../context/NotificationsContext';
import '../App.css';

export default function NotificationBell({ recipient }) {
  const { getUnreadCount, getNotificationsForRecipient, markAsRead, deleteNotification, markAllAsRead } = useContext(
    NotificationsContext
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = getUnreadCount(recipient);
  const notifs = getNotificationsForRecipient(recipient);

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={() => {
                  markAllAsRead(recipient);
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="notification-list">
            {notifs.length > 0 ? (
              notifs.map((n) => (
                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                  <div className="notif-content">
                    <p>{n.message}</p>
                    <span className="notif-time">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="notif-actions">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="mark-read-btn">
                        ✓
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="delete-btn">
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notifs">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
