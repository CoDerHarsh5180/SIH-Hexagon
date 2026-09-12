import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const applicationsService = {
  submitApplication: async (applicationData) => {
    return await axiosInstance.post(API_PATHS.APPLICATIONS.SUBMIT, applicationData);
  },

  submitCustomApplication: async (customData) => {
    return await axiosInstance.post(API_PATHS.APPLICATIONS.CUSTOM_APPLY, customData);
  },

  getUserApplications: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.APPLICATIONS.GET_USER_APPLICATIONS, { params });
  },

  getApplicationById: async (id) => {
    return await axiosInstance.get(API_PATHS.APPLICATIONS.GET_APPLICATION_BY_ID(id));
  },

  respondDiscrepancy: async (id, discrepancyData) => {
    return await axiosInstance.post(API_PATHS.APPLICATIONS.RESPOND_DISCREPANCY(id), discrepancyData);
  },

  submitFeePayment: async (id, paymentData) => {
    return await axiosInstance.post(API_PATHS.APPLICATIONS.SUBMIT_FEE_PAYMENT(id), paymentData);
  },

  withdrawApplication: async (id, reason) => {
    return await axiosInstance.post(API_PATHS.APPLICATIONS.WITHDRAW(id), { reason });
  },
};

export default applicationsService;
