import React from 'react';
import { FaCheckCircle, FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import TodoItem from '../components/TodoItem';
import { groupByDate, formatDate } from '../utils/helpers';

const Completed = ({ todos, onToggleComplete, onDelete, onEdit }) => {
  const groupedTodos = groupByDate(todos);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <div className="feature-icon me-3" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <FaTrophy size={32} />
              </div>
              <h1 className="display-4 fw-bold mb-0" style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Completed Tasks
              </h1>
            </div>
            <p className="lead text-muted">Celebrate your achievements and track your progress</p>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Achievement illustration" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxWidth: '350px', opacity: '0.8' }}
                />
              </div>
              <h3 className="text-muted mb-3">No completed tasks yet</h3>
              <p className="text-muted mb-4">
                Once you complete your tasks, they'll appear here. Keep up the great work!
              </p>
              <div className="d-flex justify-content-center gap-3">
                <div className="text-center">
                  <FaMedal size={32} className="text-warning mb-2" />
                  <p className="small text-muted">First Achievement</p>
                </div>
                <div className="text-center">
                  <FaStar size={32} className="text-info mb-2" />
                  <p className="small text-muted">Productivity Star</p>
                </div>
                <div className="text-center">
                  <FaTrophy size={32} className="text-success mb-2" />
                  <p className="small text-muted">Task Master</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="alert alert-success mb-5 border-0 shadow-sm" style={{ 
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                borderRadius: '16px'
              }}>
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="me-3" size={24} />
                  <div>
                    <h5 className="alert-heading mb-1 fw-bold">Outstanding Progress! 🎉</h5>
                    <p className="mb-0">
                      You've completed <strong>{todos.length}</strong> task{todos.length !== 1 ? 's' : ''}. 
                      Your dedication is truly inspiring!
                    </p>
                  </div>
                </div>
              </div>

              <div className="fade-in">
                {Object.entries(groupedTodos).map(([date, todosForDate]) => (
                  <div key={date} className="date-group mb-5">
                    <div className="d-flex align-items-center mb-4">
                      <FaCheckCircle className="me-3 text-success" size={24} />
                      <h4 className="mb-0">{formatDate(date)}</h4>
                      <span className="badge bg-success text-white ms-3 px-3 py-2">
                        {todosForDate.length} completed
                      </span>
                    </div>
                    <div className="row g-4">
                      {todosForDate.map((todo) => (
                        <div key={todo.id} className="col-12">
                          <TodoItem
                            todo={todo}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleComplete={onToggleComplete}
                            onUpdateStatus={() => {}} // No status updates for completed tasks
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement Section */}
              <div className="mt-5 p-4 rounded-4 text-center" style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}>
                <h4 className="fw-bold mb-3">🏆 Achievement Unlocked!</h4>
                <p className="mb-0">
                  You're on fire! Keep this momentum going and reach new productivity heights.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Completed;