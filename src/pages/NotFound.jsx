import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaRocket } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container">
      <div className="error-page">
        <div className="text-center">
          <div className="mb-4">
            <img 
              src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Page not found" 
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxWidth: '400px', opacity: '0.8' }}
            />
          </div>
          <div className="error-code bounce-in">404</div>
          <h1 className="display-4 fw-bold mb-4 fade-in">Oops! Page Not Found</h1>
          <p className="lead mb-5 text-muted fade-in" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
            Looks like you've ventured into uncharted territory! The page you're looking for 
            doesn't exist, but don't worry - we'll help you get back on track.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap fade-in">
            <Link to="/" className="btn btn-primary btn-lg btn-custom">
              <FaHome className="me-2" />
              Go Home
            </Link>
            <Link to="/todos" className="btn btn-outline-primary btn-lg btn-custom">
              <FaRocket className="me-2" />
              Browse Tasks
            </Link>
          </div>
          
          {/* Fun illustration */}
          <div className="mt-5 d-flex justify-content-center gap-4">
            <div className="text-center">
              <div className="feature-icon mx-auto mb-2" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '60px',
                height: '60px'
              }}>
                <FaHome size={24} />
              </div>
              <p className="small text-muted">Home</p>
            </div>
            <div className="text-center">
              <div className="feature-icon mx-auto mb-2" style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                width: '60px',
                height: '60px'
              }}>
                <FaSearch size={24} />
              </div>
              <p className="small text-muted">Search</p>
            </div>
            <div className="text-center">
              <div className="feature-icon mx-auto mb-2" style={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                width: '60px',
                height: '60px'
              }}>
                <FaRocket size={24} />
              </div>
              <p className="small text-muted">Explore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;