import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const TodoModal = ({ show, onClose, onSave, todo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'pending'
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        dueDate: todo.dueDate || '',
        priority: todo.priority || 'Medium',
        status: todo.status || 'pending'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'pending'
      });
    }
  }, [todo, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.dueDate) {
      onSave(formData);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'pending'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {todo ? 'Edit Task' : 'Add New Task'}
            </h5>
            <button
              type="button"
              className="btn-close"
              style={{ filter: "invert(1)" }}
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-bold">
                  Task Title *
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-bold">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description (optional)..."
                />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="dueDate" className="form-label fw-bold">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="priority" className="form-label fw-bold">
                      Priority Level
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">🟢 Low Priority</option>
                      <option value="Medium">🟠 Medium Priority</option>
                      <option value="High">🔴 High Priority</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label fw-bold">
                      Status
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <small>
                  <strong>Tip:</strong> You can change the status and priority later from the task list.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={onClose}
              >
                <FaTimes className="me-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!formData.title.trim() || !formData.dueDate}
              >
                <FaSave className="me-2" />
                {todo ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;