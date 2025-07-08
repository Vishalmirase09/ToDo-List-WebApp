import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Completed from './pages/Completed';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import { generateMockTodos, generateMockNotifications } from './utils/helpers';

function App() {
  const [todos, setTodos] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize with mock data
    setTodos(generateMockTodos());
    setNotifications(generateMockNotifications());
  }, []);

  const addTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      completed: false,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
    
    // Add notification
    const notification = {
      id: Date.now(),
      title: 'New Task Added',
      message: `"${todo.title}" has been added to your todo list`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([notification, ...notifications]);
  };

  const updateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
    
    // Add notification
    const notification = {
      id: Date.now(),
      title: 'Task Updated',
      message: `"${updatedTodo.title}" has been updated`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([notification, ...notifications]);
  };

  const deleteTodo = (todoId) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);
    setTodos(todos.filter(todo => todo.id !== todoId));
    
    // Add notification
    const notification = {
      id: Date.now(),
      title: 'Task Deleted',
      message: `"${todoToDelete?.title}" has been deleted`,
      type: 'warning',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([notification, ...notifications]);
  };

  const toggleComplete = (todoId) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        const updatedTodo = { 
          ...todo, 
          completed: !todo.completed,
          status: !todo.completed ? 'completed' : 'pending'
        };
        
        // Add notification
        const notification = {
          id: Date.now(),
          title: updatedTodo.completed ? 'Task Completed' : 'Task Reopened',
          message: `"${updatedTodo.title}" has been marked as ${updatedTodo.completed ? 'completed' : 'incomplete'}`,
          type: updatedTodo.completed ? 'success' : 'info',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications([notification, ...notifications]);
        
        return updatedTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodoStatus = (todoId, newStatus) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        const updatedTodo = { 
          ...todo, 
          status: newStatus,
          completed: newStatus === 'completed'
        };
        
        // Add notification
        const notification = {
          id: Date.now(),
          title: 'Task Status Updated',
          message: `"${updatedTodo.title}" status changed to ${newStatus}`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications([notification, ...notifications]);
        
        return updatedTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const inProgressTodos = todos.filter(todo => todo.status === 'in-progress');

  return (
    <Router>
      <div className="min-h-screen bg-light">
        <Navbar 
          notifications={notifications} 
          onMarkAsRead={markNotificationAsRead}
        />
        <Routes>
          <Route path="/" element={
            <Home 
              todosCount={todos.length} 
              completedCount={completedTodos.length}
              inProgressCount={inProgressTodos.length}
            />
          } />
          <Route path="/todos" element={
            <Todos 
              todos={activeTodos}
              onAdd={addTodo}
              onEdit={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
              onUpdateStatus={updateTodoStatus}
            />
          } />
          <Route path="/completed" element={
            <Completed 
              todos={completedTodos}
              onToggleComplete={toggleComplete}
              onDelete={deleteTodo}
              onEdit={updateTodo}
            />
          } />
          <Route path="/notifications" element={
            <Notifications 
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
            />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;