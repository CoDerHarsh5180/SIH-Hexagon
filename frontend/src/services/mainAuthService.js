import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const mainAuthService = {
  getAnalytics: async () => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_ANALYTICS);
  },

  getMasterCatalog: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_CATALOG, { params });
  },

  getMasterDocById: async (id) => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_CATALOG_DOC_BY_ID(id));
  },

  createMasterDoc: async (docData) => {
    return await axiosInstance.post(API_PATHS.MAIN_AUTH.CREATE_MASTER_DOC, docData);
  },

  updateMasterDoc: async (id, updatedData) => {
    return await axiosInstance.put(API_PATHS.MAIN_AUTH.UPDATE_MASTER_DOC(id), updatedData);
  },

  getLocalAuthorities: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_LOCAL_AUTHORITIES, { params });
  },

  registerLocalAuthority: async (authorityData) => {
    return await axiosInstance.post(API_PATHS.MAIN_AUTH.REGISTER_LOCAL_AUTHORITY, authorityData);
  },

  getStateComplaints: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_COMPLAINTS, { params });
  },

  interveneComplaint: async (id, interventionData) => {
    return await axiosInstance.post(API_PATHS.MAIN_AUTH.INTERVENE_COMPLAINT(id), interventionData);
  },

  getCentralRequests: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_REQUESTS, { params });
  },

  getCentralRequestById: async (id) => {
    return await axiosInstance.get(API_PATHS.MAIN_AUTH.GET_REQUEST_BY_ID(id));
  },

  approveCentralRequest: async (id, sanctionData) => {
    return await axiosInstance.post(API_PATHS.MAIN_AUTH.APPROVE_REQUEST(id), sanctionData);
  },

  rejectCentralRequest: async (id, remittanceData) => {
    return await axiosInstance.post(API_PATHS.MAIN_AUTH.REJECT_REQUEST(id), remittanceData);
  },
};

export default mainAuthService;
