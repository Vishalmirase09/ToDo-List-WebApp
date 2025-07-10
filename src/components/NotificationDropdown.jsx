import React, { useEffect, useRef } from 'react';
import { FaTimes, FaBell, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const NotificationDropdown = ({ notifications, onMarkAsRead, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-warning" />;
      case 'success':
        return <FaCheckCircle className="text-success" />;
      case 'info':
        return <FaInfoCircle className="text-info" />;
      default:
        return <FaBell className="text-primary" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // Handle invalid dates
    if (isNaN(diffInMs) || diffInMs < 0) {
      return 'Unknown time';
    }
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    
    // For older notifications, show the actual date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div 
      ref={dropdownRef} 
      className="notification-dropdown fade-in"
      style={{ 
        position: 'absolute',
        top: '100%',
        right: 0,
        zIndex: 99999,
        marginTop: '8px',
        minWidth: '350px'
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="mb-0 fw-bold">Notifications</h6>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>
      
      {unreadNotifications.length === 0 ? (
        <div className="p-3 text-center text-muted">
          <FaBell size={24} className="mb-2" />
          <p className="mb-0">No new notifications</p>
        </div>
      ) : (
        <div className="overflow-auto" style={{ maxHeight: '300px' }}>
          {unreadNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? '' : 'unread'}`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="d-flex align-items-start">
                <div className="me-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">{notification.title}</h6>
                  <p className="mb-1 text-muted small">{notification.message}</p>
                  <small className="text-secondary">
                    {formatTime(notification.createdAt)}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;