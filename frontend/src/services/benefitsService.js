import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const benefitsService = {
  getSchemes: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.GOV_BENEFITS.GET_SCHEMES, { params });
  },

  getSchemeById: async (id) => {
    return await axiosInstance.get(API_PATHS.GOV_BENEFITS.GET_SCHEME_BY_ID(id));
  },

  checkEligibility: async (id, criteria = {}) => {
    return await axiosInstance.post(API_PATHS.GOV_BENEFITS.CHECK_ELIGIBILITY(id), criteria);
  },

  applyScheme: async (id, claimData) => {
    return await axiosInstance.post(API_PATHS.GOV_BENEFITS.APPLY_SCHEME(id), claimData);
  },
};

export default benefitsService;
