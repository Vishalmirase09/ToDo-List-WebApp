import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaCheckCircle, FaPlus, FaBell, FaPlay, FaRocket, FaChartLine, FaStar } from 'react-icons/fa';

const Home = ({ todosCount, completedCount, inProgressCount }) => {
  const pendingCount = todosCount - completedCount;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4 slide-in">
                Organize Your Life with 
                <span className="d-block text-warning">Beautiful Simplicity</span>
              </h1>
              <p className="lead mb-5 slide-in" style={{ fontSize: '1.3rem', lineHeight: '1.6' }}>
                Transform your productivity with our stunning todo management system. 
                Experience the perfect blend of elegance and functionality.
              </p>
              <div className="d-flex gap-3 slide-in flex-wrap">
                <Link to="/todos" className="btn btn-light btn-lg btn-custom float">
                  <FaPlus className="me-2" />
                  Start Creating
                </Link>
                <Link to="/completed" className="btn btn-outline-light btn-lg btn-custom float" style={{ animationDelay: '0.5s' }}>
                  <FaCheckCircle className="me-2" />
                  View Progress
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Productive workspace with modern setup" 
                className="hero-illustration img-fluid rounded-4 shadow-lg fade-in float"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card stats-card text-center h-100 bounce-in glass-effect">
                <div className="card-body">
                  <div className="feature-icon mx-auto mb-3 glow" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <FaTasks size={32} />
                  </div>
                  <h3 className="card-title display-6 fw-bold text-primary">{todosCount}</h3>
                  <p className="card-text text-muted fw-semibold">Total Tasks</p>
                  <div className="progress mt-3" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card stats-card text-center h-100 bounce-in glass-effect" style={{ animationDelay: '0.1s' }}>
                <div className="card-body">
                  <div className="feature-icon mx-auto mb-3 glow" style={{ background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)', animationDelay: '0.5s' }}>
                    <FaCheckCircle size={32} />
                  </div>
                  <h3 className="card-title display-6 fw-bold text-success">{completedCount}</h3>
                  <p className="card-text text-muted fw-semibold">Completed</p>
                  <div className="progress mt-3" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${todosCount > 0 ? (completedCount / todosCount) * 100 : 0}%`, background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card stats-card text-center h-100 bounce-in glass-effect" style={{ animationDelay: '0.2s' }}>
                <div className="card-body">
                  <div className="feature-icon mx-auto mb-3 glow" style={{ background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', animationDelay: '1s' }}>
                    <FaPlay size={32} />
                  </div>
                  <h3 className="card-title display-6 fw-bold text-warning">{inProgressCount}</h3>
                  <p className="card-text text-muted fw-semibold">In Progress</p>
                  <div className="progress mt-3" style={{ height: '8px' }}>
                    <div className="progress-bar bg-warning" style={{ width: `${todosCount > 0 ? (inProgressCount / todosCount) * 100 : 0}%`, background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card stats-card text-center h-100 bounce-in glass-effect" style={{ animationDelay: '0.3s' }}>
                <div className="card-body">
                  <div className="feature-icon mx-auto mb-3 glow" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', animationDelay: '1.5s' }}>
                    <FaBell size={32} />
                  </div>
                  <h3 className="card-title display-6 fw-bold text-info">{pendingCount}</h3>
                  <p className="card-text text-muted fw-semibold">Pending</p>
                  <div className="progress mt-3" style={{ height: '8px' }}>
                    <div className="progress-bar bg-info" style={{ width: `${todosCount > 0 ? (pendingCount / todosCount) * 100 : 0}%`, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 className="display-4 fw-bold mb-4 fade-in">
                Why Choose Our 
                <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  TodoApp?
                </span>
              </h2>
              <p className="lead text-muted fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Experience the perfect blend of beauty, simplicity, and powerful functionality
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card fade-in glass-effect">
                <div className="feature-icon mx-auto" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <FaRocket />
                </div>
                <h4 className="fw-bold mb-3">Lightning Fast</h4>
                <p className="text-muted">
                  Create, edit, and organize your tasks with our lightning-fast interface. 
                  Set priorities, status, and due dates in seconds.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card fade-in glass-effect" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon mx-auto" style={{ background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)' }}>
                  <FaChartLine />
                </div>
                <h4 className="fw-bold mb-3">Smart Analytics</h4>
                <p className="text-muted">
                  Monitor your productivity with beautiful charts, completed task tracking, 
                  and intelligent progress indicators.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card fade-in glass-effect" style={{ animationDelay: '0.4s' }}>
                <div className="feature-icon mx-auto" style={{ background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)' }}>
                  <FaStar />
                </div>
                <h4 className="fw-bold mb-3">Premium Experience</h4>
                <p className="text-muted">
                  Enjoy a premium user experience with smart notifications, 
                  real-time updates, and beautiful animations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 glass-effect" style={{ 
        background: 'rgba(240, 147, 251, 0.1)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '0 2rem',
        borderRadius: '32px'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h3 className="display-5 fw-bold mb-4 fade-in">Ready to Transform Your Productivity?</h3>
              <p className="lead mb-4 fade-in">
                Join thousands of users who have already revolutionized their task management
              </p>
              <Link to="/todos" className="btn btn-light btn-lg btn-custom fade-in glow">
                <FaPlus className="me-2" />
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;