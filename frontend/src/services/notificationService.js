/**
 * Notification Service
 * Manages user & authority push alerts, SLA warnings, inspection schedules, and unread counts.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} NotificationItem
 * @property {string} id
 * @property {'SLA_WARNING'|'INSPECTION_SCHEDULED'|'APPROVAL_GRANTED'|'DISCREPANCY_RAISED'|'FEE_DUE'} type
 * @property {string} title
 * @property {string} message
 * @property {string} timestamp
 * @property {boolean} read
 * @property {string} [link] - Navigation target route
 * @property {string} [applicationId]
 */

export const notificationService = {
  /**
   * Fetch list of user notifications
   * @param {{ unreadOnly?: boolean, page?: number, limit?: number }} [params]
   */
  getNotifications: async (params = {}) => {
    return apiClient.get('/notifications', params);
  },

  /**
   * Get total count of unread notifications (for navbar badge)
   */
  getUnreadCount: async () => {
    return apiClient.get('/notifications/unread-count');
  },

  /**
   * Mark a single notification as read
   * @param {string} notificationId
   */
  markAsRead: async (notificationId) => {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    return apiClient.post('/notifications/mark-all-read');
  },

  /**
   * Delete or archive a notification
   * @param {string} notificationId
   */
  deleteNotification: async (notificationId) => {
    return apiClient.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;
