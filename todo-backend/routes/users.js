const express = require('express');
const User = require('../models/User');
const Todo = require('../models/Todo');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    // Get user stats
    const todoStats = await Todo.getUserStats(req.user.id);
    const notificationCounts = await Notification.getNotificationCounts(req.user.id);

    // Get recent todos
    const recentTodos = await Todo.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status priority dueDate completed');

    // Get recent notifications
    const recentNotifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title message type read createdAt');

    // Get overdue todos
    const overdueTodos = await Todo.find({
      user: req.user.id,
      completed: false,
      dueDate: { $lt: new Date() }
    }).countDocuments();

    // Get upcoming todos (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingTodos = await Todo.find({
      user: req.user.id,
      completed: false,
      dueDate: { $gte: new Date(), $lte: nextWeek }
    }).countDocuments();

    res.status(200).json({
      success: true,
      data: {
        user: req.user.getPublicProfile(),
        stats: {
          todos: todoStats,
          notifications: notificationCounts,
          overdue: overdueTodos,
          upcoming: upcomingTodos
        },
        recent: {
          todos: recentTodos,
          notifications: recentNotifications
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

// @desc    Get user activity summary
// @route   GET /api/users/activity
// @access  Private
const getActivity = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get todos created in the period
    const todosCreated = await Todo.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    }).countDocuments();

    // Get todos completed in the period
    const todosCompleted = await Todo.find({
      user: req.user.id,
      completedAt: { $gte: startDate }
    }).countDocuments();

    // Get daily activity
    const dailyActivity = await Todo.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          created: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$completed", true] },
                  { $gte: ["$completedAt", startDate] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: `${days} days`,
        summary: {
          todosCreated,
          todosCompleted,
          productivity: todosCreated > 0 ? Math.round((todosCompleted / todosCreated) * 100) : 0
        },
        dailyActivity
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: error.message
    });
  }
};

// @desc    Deactivate user account
// @route   DELETE /api/users/account
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account',
      error: error.message
    });
  }
};

// Routes
router.get('/dashboard', getDashboard);
router.get('/activity', getActivity);
router.put('/preferences', updatePreferences);
router.delete('/account', deactivateAccount);

module.exports = router;