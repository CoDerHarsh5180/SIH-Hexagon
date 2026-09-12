import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const trackingService = {
  getTrackingPipeline: async (id) => {
    return await axiosInstance.get(API_PATHS.TRACKING.GET_PIPELINE(id));
  },

  publicLookup: async (applicationId, verificationCode) => {
    return await axiosInstance.post(API_PATHS.TRACKING.PUBLIC_LOOKUP, {
      applicationId,
      verificationCode,
    });
  },

  getAuditHistory: async (id) => {
    return await axiosInstance.get(API_PATHS.TRACKING.GET_AUDIT_HISTORY(id));
  },

  escalateSla: async (id, escalationData) => {
    return await axiosInstance.post(API_PATHS.TRACKING.ESCALATE(id), escalationData);
  },
};

export default trackingService;
