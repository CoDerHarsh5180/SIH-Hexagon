/**
 * Authentication & Enterprise Profile Service
 * Manages user authentication, registration, portal switching, and profile data.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 * @property {'USER'|'LOCAL_AUTH'|'MAIN_AUTH'} [portalType='USER']
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} fullName
 * @property {string} email
 * @property {string} password
 * @property {string} [phone]
 * @property {string} [companyName]
 * @property {string} [udyamNumber]
 * @property {string} [cinNumber]
 * @property {string} [industryType]
 * @property {string} [scale] - MICRO | SMALL | MEDIUM | LARGE
 * @property {Object} [address]
 * @property {string} [address.street]
 * @property {string} [address.city]
 * @property {string} [address.district]
 * @property {string} [address.state]
 * @property {string} [address.pincode]
 */

export const authService = {
  /**
   * Log in user or authority officer
   * @param {LoginPayload} credentials
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response?.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user?.role || 'USER');
    }
    return response;
  },

  /**
   * Register a new industrial user / enterprise
   * @param {RegisterPayload} payload
   */
  register: async (payload) => {
    return apiClient.post('/auth/register', payload);
  },

  /**
   * Log out current user & clear stored credentials
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      sessionStorage.clear();
    }
  },

  /**
   * Fetch current authenticated user / enterprise profile
   */
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  /**
   * Update enterprise profile details
   * @param {Partial<RegisterPayload>} profileData
   */
  updateProfile: async (profileData) => {
    return apiClient.put('/auth/profile', profileData);
  },

  /**
   * Request password reset link / OTP
   * @param {{ email: string }} payload
   */
  forgotPassword: async (payload) => {
    return apiClient.post('/auth/forgot-password', payload);
  },

  /**
   * Reset password with token/OTP
   * @param {{ token: string, newPassword: string }} payload
   */
  resetPassword: async (payload) => {
    return apiClient.post('/auth/reset-password', payload);
  },

  /**
   * Refresh session token
   */
  refreshToken: async () => {
    return apiClient.post('/auth/refresh-token');
  },
};

export default authService;
