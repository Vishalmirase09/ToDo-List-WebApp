const express = require('express');
const Todo = require('../models/Todo');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const { 
  validateTodo, 
  validateUpdateTodo, 
  validateObjectId, 
  validatePagination, 
  validateTodoFilters 
} = require('../middleware/validation');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Helper function to create notification
const createTodoNotification = async (userId, title, message, type = 'info', todoId = null) => {
  try {
    await Notification.createNotification({
      title,
      message,
      type,
      user: userId,
      category: 'todo',
      relatedTodo: todoId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// @desc    Get all todos for authenticated user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', ...filters } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.completed !== undefined) query.completed = filters.completed === 'true';
    if (filters.overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.completed = false;
    }

    // Search functionality
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const todos = await Todo.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Todo.countDocuments(query);

    res.status(200).json({
      success: true,
      count: todos.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: todos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error.message
    });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error.message
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const todo = await Todo.create(req.body);

    // Create notification
    await createTodoNotification(
      req.user.id,
      'New Task Created',
      `"${todo.title}" has been added to your todo list`,
      'success',
      todo._id
    );

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error.message
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    let todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Store old values for notification
    const oldStatus = todo.status;
    const oldCompleted = todo.completed;

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Create notification for status changes
    if (oldStatus !== todo.status || oldCompleted !== todo.completed) {
      let notificationMessage = '';
      let notificationType = 'info';

      if (todo.completed && !oldCompleted) {
        notificationMessage = `"${todo.title}" has been marked as completed`;
        notificationType = 'success';
      } else if (!todo.completed && oldCompleted) {
        notificationMessage = `"${todo.title}" has been reopened`;
        notificationType = 'info';
      } else if (oldStatus !== todo.status) {
        notificationMessage = `"${todo.title}" status changed to ${todo.status}`;
        notificationType = 'info';
      }

      if (notificationMessage) {
        await createTodoNotification(
          req.user.id,
          'Task Updated',
          notificationMessage,
          notificationType,
          todo._id
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    // Create notification
    await createTodoNotification(
      req.user.id,
      'Task Deleted',
      `"${todo.title}" has been deleted`,
      'warning'
    );

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error.message
    });
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res) => {
  try {
    const stats = await Todo.getUserStats(req.user.id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get todo stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todo statistics',
      error: error.message
    });
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodoCompletion = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Toggle completion
    todo.completed = !todo.completed;
    todo.status = todo.completed ? 'completed' : 'pending';
    
    await todo.save();

    // Create notification
    await createTodoNotification(
      req.user.id,
      todo.completed ? 'Task Completed' : 'Task Reopened',
      `"${todo.title}" has been marked as ${todo.completed ? 'completed' : 'incomplete'}`,
      todo.completed ? 'success' : 'info',
      todo._id
    );

    res.status(200).json({
      success: true,
      message: `Todo ${todo.completed ? 'completed' : 'reopened'} successfully`,
      data: todo
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling todo completion',
      error: error.message
    });
  }
};

// Routes
router.get('/stats', getTodoStats);
router.get('/', validatePagination, validateTodoFilters, getTodos);
router.get('/:id', validateObjectId, getTodo);
router.post('/', validateTodo, createTodo);
router.put('/:id', validateObjectId, validateUpdateTodo, updateTodo);
router.delete('/:id', validateObjectId, deleteTodo);
router.patch('/:id/toggle', validateObjectId, toggleTodoCompletion);

module.exports = router;