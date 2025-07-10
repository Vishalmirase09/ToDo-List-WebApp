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
      style={{ 
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        zIndex: 9999,
        width: '350px',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        maxHeight: '500px',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="mb-0 fw-bold">Notifications</h6>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onClose}
          style={{ border: 'none', background: 'transparent' }}
        >
          <FaTimes />
        </button>
      </div>
      
      {unreadNotifications.length === 0 ? (
        <div 
          className="text-center text-muted"
          style={{ padding: '2rem' }}
        >
          <FaBell size={24} className="mb-2" />
          <p className="mb-0">No new notifications</p>
        </div>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {unreadNotifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: notification.read ? 'white' : 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
                borderLeft: notification.read ? 'none' : '4px solid #667eea'
              }}
              onClick={() => onMarkAsRead(notification.id)}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = notification.read ? 'white' : 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)';
              }}
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