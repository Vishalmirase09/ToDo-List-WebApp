const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const { 
  validateNotification, 
  validateObjectId, 
  validatePagination 
} = require('../middleware/validation');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all notifications for authenticated user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read, type, category } = req.query;

    // Build filters
    const filters = {};
    if (read !== undefined) filters.read = read === 'true';
    if (type) filters.type = type;
    if (category) filters.category = category;

    // Get notifications with pagination
    const notifications = await Notification.getUserNotifications(req.user.id, filters)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const query = { user: req.user.id, ...filters };
    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      count: notifications.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// @desc    Get notification counts
// @route   GET /api/notifications/counts
// @access  Private
const getNotificationCounts = async (req, res) => {
  try {
    const counts = await Notification.getNotificationCounts(req.user.id);

    res.status(200).json({
      success: true,
      data: counts
    });
  } catch (error) {
    console.error('Get notification counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification counts',
      error: error.message
    });
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('relatedTodo', 'title status priority');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message
    });
  }
};

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const notification = await Notification.createNotification(req.body);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/read
// @access  Private
const deleteReadNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      user: req.user.id,
      read: true
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} read notifications deleted`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete read notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting read notifications',
      error: error.message
    });
  }
};

// Routes
router.get('/counts', getNotificationCounts);
router.get('/', validatePagination, getNotifications);
router.get('/:id', validateObjectId, getNotification);
router.post('/', validateNotification, createNotification);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', validateObjectId, markAsRead);
router.delete('/read', deleteReadNotifications);
router.delete('/:id', validateObjectId, deleteNotification);

module.exports = router;