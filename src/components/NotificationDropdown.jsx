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
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxHeight: '500px',
        overflowY: 'auto',
        animation: 'fadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div 
        className="d-flex justify-content-between align-items-center p-4"
        style={{ 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
          borderRadius: '24px 24px 0 0'
        }}
      >
        <h6 className="mb-0 fw-bold" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔔 Notifications
        </h6>
        <button
          className="btn btn-sm"
          onClick={onClose}
          style={{ 
            border: 'none', 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
            borderRadius: '12px',
            color: '#667eea',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(102, 126, 234, 0.2)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <FaTimes />
        </button>
      </div>
      
      {unreadNotifications.length === 0 ? (
        <div 
          className="text-center"
          style={{ 
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(240, 147, 251, 0.08) 100%)'
          }}
        >
          <div 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
            }}
          >
            <FaBell size={32} color="white" />
          </div>
          <h6 className="fw-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>All Caught Up! 🎉</h6>
          <p className="mb-0 text-muted">No new notifications to show</p>
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {unreadNotifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: notification.read ? 'transparent' : 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(240, 147, 251, 0.08) 100%)',
                borderLeft: notification.read ? 'none' : '6px solid transparent',
                borderImage: notification.read ? 'none' : 'linear-gradient(135deg, #667eea 0%, #f093fb 100%) 1',
                borderRadius: notification.read ? '0' : '0 16px 16px 0',
                margin: notification.read ? '0' : '0 0 0 -1px'
              }}
              onClick={() => onMarkAsRead(notification.id)}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(240, 147, 251, 0.12) 100%)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = notification.read ? 'transparent' : 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(240, 147, 251, 0.08) 100%)';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <div className="d-flex align-items-start">
                <div 
                  className="me-3 mt-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-2 fw-bold" style={{ color: '#2d3748' }}>
                    {notification.title}
                  </h6>
                  <p className="mb-2 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {notification.message}
                  </p>
                  <small 
                    className="fw-semibold"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
                      color: '#667eea',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.75rem'
                    }}
                  >
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