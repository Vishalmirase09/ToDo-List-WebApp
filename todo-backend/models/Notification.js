const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'reminder'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['todo', 'system', 'reminder', 'achievement'],
    default: 'todo'
  },
  relatedTodo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    action: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    source: {
      type: String,
      default: 'system'
    }
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
});

// Pre-save middleware to update readAt when read status changes
notificationSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = new Date();
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to get user's notifications
notificationSchema.statics.getUserNotifications = function(userId, filters = {}) {
  const query = { user: userId };
  
  if (filters.read !== undefined) {
    query.read = filters.read;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  return this.find(query)
    .populate('relatedTodo', 'title status priority')
    .sort({ createdAt: -1 });
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { user: userId, read: false },
    { 
      read: true, 
      readAt: new Date(),
      updatedAt: new Date()
    }
  );
};

// Static method to get notification counts
notificationSchema.statics.getNotificationCounts = async function(userId) {
  const counts = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: {
          $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
        },
        byType: {
          $push: {
            type: '$type',
            read: '$read'
          }
        }
      }
    }
  ]);
  
  const result = counts[0] || { total: 0, unread: 0, byType: [] };
  
  // Count by type
  const typeCounts = result.byType.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = { total: 0, unread: 0 };
    }
    acc[item.type].total++;
    if (!item.read) {
      acc[item.type].unread++;
    }
    return acc;
  }, {});
  
  return {
    total: result.total,
    unread: result.unread,
    byType: typeCounts
  };
};

module.exports = mongoose.model('Notification', notificationSchema);