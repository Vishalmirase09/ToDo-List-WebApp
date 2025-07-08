import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaUndo, FaClock, FaPlay, FaPause, FaFlag } from 'react-icons/fa';
import { getPriorityColor, getStatusColor } from '../utils/helpers';

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete, onUpdateStatus }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const priorityColor = getPriorityColor(todo.priority);
  const statusColor = getStatusColor(todo.status);
  const isOverdue = new Date(todo.dueDate) < new Date() && !todo.completed;
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: FaClock, color: 'secondary' },
    { value: 'in-progress', label: 'In Progress', icon: FaPlay, color: 'warning' },
    { value: 'completed', label: 'Completed', icon: FaCheck, color: 'success' }
  ];

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(todo.id, newStatus);
    setShowStatusDropdown(false);
  };

  const currentStatus = statusOptions.find(s => s.value === todo.status) || statusOptions[0];

  return (
    <div className={`card todo-card mb-4 ${todo.completed ? 'completed-todo' : ''}`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="card-title mb-2 fw-bold" style={{ fontSize: '1.25rem' }}>
              {todo.title}
            </h5>
            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <span className={`badge ${priorityColor} text-white px-3 py-2`} style={{ fontSize: '0.8rem' }}>
                <FaFlag className="me-1" size={12} />
                {todo.priority}
              </span>

              {/* Status Dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className={`btn btn-sm btn-${currentStatus.color} dropdown-toggle px-3 py-2`}
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  style={{ fontSize: '0.8rem', fontWeight: '600' }}
                >
                  <currentStatus.icon className="me-1" size={12} />
                  {currentStatus.label}
                </button>
                {showStatusDropdown && (
                  <div className="dropdown-menu show" style={{ zIndex: 3000 }}>
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        className={`dropdown-item ${todo.status === status.value ? 'active' : ''}`}
                        onClick={() => handleStatusChange(status.value)}
                      >
                        <status.icon className="me-2" size={12} />
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <small className="text-muted d-flex align-items-center fw-semibold">
                <FaClock className="me-1" />
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </small>

              {isOverdue && (
                <span className="badge bg-danger text-white px-3 py-2">
                  ⚠️ Overdue
                </span>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${todo.completed ? 'btn-warning' : 'btn-success'} px-3`}
              onClick={() => onToggleComplete(todo.id)}
              title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed ? <FaUndo /> : <FaCheck />}
            </button>
            <button
              className="btn btn-sm btn-outline-primary px-3"
              onClick={() => onEdit(todo)}
              title="Edit todo"
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-sm btn-outline-danger px-3"
              onClick={() => onDelete(todo.id)}
              title="Delete todo"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {todo.description && (
          <p className="card-text text-muted mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
            {todo.description}
          </p>
        )}

        {todo.completed && (
          <div className="d-flex align-items-center text-success fw-semibold">
            <FaCheck className="me-2" />
            <span>Task completed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;