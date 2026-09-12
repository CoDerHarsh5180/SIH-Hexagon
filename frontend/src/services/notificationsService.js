import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const notificationsService = {
  getNotifications: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL, { params });
  },

  getUnreadCount: async () => {
    return await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_UNREAD_COUNT);
  },

  markAsRead: async (id) => {
    return await axiosInstance.patch(API_PATHS.NOTIFICATIONS.MARK_AS_READ(id));
  },

  markAllAsRead: async () => {
    return await axiosInstance.post(API_PATHS.NOTIFICATIONS.MARK_ALL_AS_READ);
  },

  deleteNotification: async (id) => {
    return await axiosInstance.delete(API_PATHS.NOTIFICATIONS.DELETE_NOTIFICATION(id));
  },
};

export default notificationsService;
