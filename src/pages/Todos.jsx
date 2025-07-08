import React, { useState } from 'react';
import { FaPlus, FaFilter, FaSort, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import TodoItem from '../components/TodoItem';
import TodoModal from '../components/TodoModal';
import { groupByDate, formatDate } from '../utils/helpers';

const Todos = ({ todos, onAdd, onEdit, onDelete, onToggleComplete, onUpdateStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowModal(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowModal(true);
  };

  const handleSaveTodo = (todo) => {
    if (editingTodo) {
      onEdit({ ...todo, id: editingTodo.id });
    } else {
      onAdd(todo);
    }
    setShowModal(false);
    setEditingTodo(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (filter === 'all') return true;
    if (filter === 'high') return todo.priority === 'High';
    if (filter === 'medium') return todo.priority === 'Medium';
    if (filter === 'low') return todo.priority === 'Low';
    if (filter === 'pending') return todo.status === 'pending';
    if (filter === 'in-progress') return todo.status === 'in-progress';
    if (filter === 'overdue') {
      return new Date(todo.dueDate) < new Date() && !todo.completed;
    }
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'status') {
      const statusOrder = { 'in-progress': 3, 'pending': 2, 'completed': 1 };
      return statusOrder[b.status] - statusOrder[a.status];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const groupedTodos = groupByDate(sortedTodos);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="display-4 fw-bold mb-2" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                My Tasks
              </h1>
              <p className="lead text-muted">Organize your life, one task at a time</p>
            </div>
            <button
              className="btn btn-primary btn-lg btn-custom"
              onClick={handleAddTodo}
            >
              <FaPlus className="me-2" />
              Add New Task
            </button>
          </div>

          {/* Search and Filters */}
          <div className="row mb-5">
            <div className="col-md-4">
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control form-control-lg ps-5"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <FaFilter className="text-muted me-2" />
                <select
                  className="form-select form-select-lg"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟠 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                  <option value="overdue">⚠️ Overdue</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <FaSort className="text-muted me-2" />
                <select
                  className="form-select form-select-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="dueDate">📅 Sort by Due Date</option>
                  <option value="priority">⭐ Sort by Priority</option>
                  <option value="status">📊 Sort by Status</option>
                  <option value="title">🔤 Sort by Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Todo List */}
          {sortedTodos.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Empty task list" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxWidth: '300px', opacity: '0.8' }}
                />
              </div>
              <h3 className="text-muted mb-3">
                {searchTerm ? 'No tasks match your search' : 'No tasks found'}
              </h3>
              <p className="text-muted mb-4">
                {filter === 'all' && !searchTerm
                  ? "You don't have any tasks yet. Create your first task to get started!"
                  : searchTerm 
                    ? "Try adjusting your search terms or filters."
                    : "No tasks match your current filter. Try adjusting your filters."
                }
              </p>
              <button
                className="btn btn-primary btn-lg btn-custom"
                onClick={handleAddTodo}
              >
                <FaPlus className="me-2" />
                {searchTerm || filter !== 'all' ? 'Add New Task' : 'Add Your First Task'}
              </button>
            </div>
          ) : (
            <div className="fade-in">
              {Object.entries(groupedTodos).map(([date, todosForDate]) => (
                <div key={date} className="date-group mb-5">
                  <div className="d-flex align-items-center mb-4">
                    <FaCalendarAlt className="me-3 text-primary" size={24} />
                    <h4 className="mb-0">{formatDate(date)}</h4>
                    <span className="badge bg-light text-dark ms-3 px-3 py-2">
                      {todosForDate.length} task{todosForDate.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="row g-4">
                    {todosForDate.map((todo) => (
                      <div key={todo.id} className="col-12">
                        <TodoItem
                          todo={todo}
                          onEdit={handleEditTodo}
                          onDelete={onDelete}
                          onToggleComplete={onToggleComplete}
                          onUpdateStatus={onUpdateStatus}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TodoModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveTodo}
        todo={editingTodo}
      />
    </div>
  );
};

export default Todos;