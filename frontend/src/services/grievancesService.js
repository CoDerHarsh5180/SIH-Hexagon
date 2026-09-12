import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const grievancesService = {
  submitQuery: async (queryData) => {
    return await axiosInstance.post(API_PATHS.GRIEVANCES.SUBMIT_QUERY, queryData);
  },

  getUserQueries: async () => {
    return await axiosInstance.get(API_PATHS.GRIEVANCES.GET_QUERIES);
  },

  getQueryById: async (id) => {
    return await axiosInstance.get(API_PATHS.GRIEVANCES.GET_QUERY_BY_ID(id));
  },

  submitComplaint: async (complaintData) => {
    return await axiosInstance.post(API_PATHS.GRIEVANCES.SUBMIT_COMPLAINT, complaintData);
  },

  getUserComplaints: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.GRIEVANCES.GET_COMPLAINTS, { params });
  },

  getComplaintById: async (id) => {
    return await axiosInstance.get(API_PATHS.GRIEVANCES.GET_COMPLAINT_BY_ID(id));
  },

  submitFeedback: async (feedbackData) => {
    return await axiosInstance.post(API_PATHS.GRIEVANCES.SUBMIT_FEEDBACK, feedbackData);
  },

  getFeedbackStats: async () => {
    return await axiosInstance.get(API_PATHS.GRIEVANCES.GET_FEEDBACK_STATS);
  },
};

export default grievancesService;
