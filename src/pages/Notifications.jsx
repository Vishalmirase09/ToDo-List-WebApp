import React from 'react';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaEnvelope, FaGift } from 'react-icons/fa';

const Notifications = ({ notifications, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-warning" size={24} />;
      case 'success':
        return <FaCheckCircle className="text-success" size={24} />;
      case 'info':
        return <FaInfoCircle className="text-info" size={24} />;
      default:
        return <FaBell className="text-primary" size={24} />;
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'warning':
        return 'alert-warning';
      case 'success':
        return 'alert-success';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-primary';
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
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <div className="feature-icon me-3 m-0" style={{ background: 'linear-gradient(135deg,rgb(134, 235, 230) 0%,rgb(250, 172, 197) 100%)' }}>
                <FaBell size={32} />
              </div>
              <h1
                className="display-4 fw-bold mb-0"
                style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Notifications
              </h1>

            </div>
            <p className="lead text-muted">Stay updated with your task activities</p>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="No notifications"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxWidth: '350px', opacity: '0.8' }}
                />
              </div>
              <h3 className="text-muted mb-3">All caught up! 🎉</h3>
              <p className="text-muted">
                You're all caught up! Notifications will appear here when you have new updates.
              </p>
              <div className="d-flex justify-content-center gap-4 mt-4">
                <div className="text-center">
                  <FaEnvelope size={32} className="text-primary mb-2" />
                  <p className="small text-muted">Task Updates</p>
                </div>
                <div className="text-center">
                  <FaGift size={32} className="text-success mb-2" />
                  <p className="small text-muted">Achievements</p>
                </div>
                <div className="text-center">
                  <FaBell size={32} className="text-warning mb-2" />
                  <p className="small text-muted">Reminders</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <h3 className="h4 mb-0 fw-bold text-dark">
                      🔔 Unread ({unreadNotifications.length})
                    </h3>
                    <span className="badge bg-danger text-white ms-3 px-3 py-2">
                      New
                    </span>
                  </div>
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`alert ${getNotificationClass(notification.type)} alert-dismissible fade show border-0 shadow-sm mb-3`}
                      role="alert"
                      style={{ borderRadius: '16px' }}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="alert-heading mb-2 fw-bold">{notification.title}</h5>
                          <p className="mb-2">{notification.message}</p>
                          <small className="text-muted fw-semibold">
                            {formatTime(notification.createdAt)}
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => onMarkAsRead(notification.id)}
                          aria-label="Mark as read"
                        ></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div>
                  <h3 className="h4 mb-4 text-muted fw-bold">
                    📖 Read ({readNotifications.length})
                  </h3>
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="card mb-3 border-0 shadow-sm"
                      style={{ borderRadius: '16px', opacity: '0.8' }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start">
                          <div className="me-3">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="card-title mb-2 fw-bold">{notification.title}</h6>
                            <p className="card-text mb-2 text-muted">{notification.message}</p>
                            <small className="text-muted fw-semibold">
                              {formatTime(notification.createdAt)}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;