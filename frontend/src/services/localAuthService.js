import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const localAuthService = {
  getInwardRequests: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.LOCAL_AUTH.GET_REQUESTS, { params });
  },

  getRequestDossier: async (id) => {
    return await axiosInstance.get(API_PATHS.LOCAL_AUTH.GET_REQUEST_BY_ID(id));
  },

  submitScrutinyDecision: async (id, scrutinyData) => {
    return await axiosInstance.post(API_PATHS.LOCAL_AUTH.SUBMIT_SCRUTINY(id), scrutinyData);
  },

  scheduleInspection: async (id, scheduleData) => {
    return await axiosInstance.post(API_PATHS.LOCAL_AUTH.SCHEDULE_INSPECTION(id), scheduleData);
  },

  submitInspectionReport: async (id, reportData) => {
    return await axiosInstance.post(API_PATHS.LOCAL_AUTH.SUBMIT_INSPECTION_REPORT(id), reportData);
  },

  getHistory: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.LOCAL_AUTH.GET_HISTORY, { params });
  },

  resolveComplaint: async (id, resolutionData) => {
    return await axiosInstance.post(API_PATHS.LOCAL_AUTH.RESOLVE_COMPLAINT(id), resolutionData);
  },
};

export default localAuthService;
