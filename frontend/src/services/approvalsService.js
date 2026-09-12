import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const approvalsService = {
  evaluateQuestionnaire: async (formData) => {
    return await axiosInstance.post(API_PATHS.APPROVALS.EVALUATE, formData);
  },

  getApprovalsCatalog: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.APPROVALS.GET_ALL, { params });
  },

  getApprovalById: async (id) => {
    return await axiosInstance.get(API_PATHS.APPROVALS.GET_BY_ID(id));
  },

  calculateFees: async (payload) => {
    return await axiosInstance.post(API_PATHS.APPROVALS.CALCULATE_FEES, payload);
  },

  getRequiredDocuments: async (approvalIds) => {
    return await axiosInstance.post(API_PATHS.APPROVALS.GET_REQUIRED_DOCUMENTS, { approvalIds });
  },
};

export default approvalsService;
