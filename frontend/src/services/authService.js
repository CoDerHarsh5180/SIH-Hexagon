import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const authService = {
  login: async (credentials) => {
    return await axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);
  },

  register: async (payload) => {
    return await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
  },

  logout: async () => {
    return await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {});
  },

  getProfile: async () => {
    return await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
  },

  updateProfile: async (profileData) => {
    return await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, profileData);
  },

  forgotPassword: async (email) => {
    return await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (payload) => {
    return await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, payload);
  },

  sendOtp: async (email, role = 'USER') => {
    return await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, { email, role });
  },

  verifyOtp: async (email, otp) => {
    return await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, { email, otp });
  },
};

export default authService;
