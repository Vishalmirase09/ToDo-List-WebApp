const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: error.message,
    availableEndpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      notifications: '/api/notifications',
      users: '/api/users',
      health: '/health'
    }
  });
};

module.exports = notFound;