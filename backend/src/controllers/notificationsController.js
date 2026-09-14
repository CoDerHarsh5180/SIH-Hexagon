import Notification from '../models/Notification.js';

/**
 * @desc    Get notifications for current user/role
 * @route   GET /api/notifications
 * @access  Public / Private
 */
export const getNotifications = async (req, res) => {
  try {
    const role = req.user?.role || req.query.role || 'USER';
    const userId = req.user?._id;

    const query = {
      $or: [
        { role: 'ALL' },
        { role },
        ...(userId ? [{ userId }] : []),
      ],
    };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error('[notificationsController:getNotifications] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

/**
 * @desc    Get unread notifications count
 * @route   GET /api/notifications/unread-count
 * @access  Public / Private
 */
export const getUnreadCount = async (req, res) => {
  try {
    const role = req.user?.role || req.query.role || 'USER';
    const userId = req.user?._id;

    const query = {
      isRead: false,
      $or: [
        { role: 'ALL' },
        { role },
        ...(userId ? [{ userId }] : []),
      ],
    };

    const count = await Notification.countDocuments(query);

    return res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Public / Private
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { returnDocument: 'after' }
    );

    if (!notif) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notif,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   POST /api/notifications/mark-all-read
 * @access  Public / Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const role = req.user?.role || req.body.role || 'USER';
    const userId = req.user?._id;

    const query = {
      isRead: false,
      $or: [
        { role: 'ALL' },
        { role },
        ...(userId ? [{ userId }] : []),
      ],
    };

    await Notification.updateMany(query, { isRead: true, readAt: new Date() });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('[notificationsController:markAllAsRead] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Public / Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notification removed',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
