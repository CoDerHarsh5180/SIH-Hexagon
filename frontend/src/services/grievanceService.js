/**
 * Grievance & Citizen Engagement Service
 * Manages queries, complaints, suggestions, and platform feedback.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} QueryPayload
 * @property {string} subject
 * @property {string} category - 'TECHNICAL' | 'APPROVAL_PROCEDURE' | 'FEE_PAYMENT' | 'PORTAL_GUIDANCE'
 * @property {'LOW'|'MEDIUM'|'HIGH'|'URGENT'} priority
 * @property {string} description
 * @property {string} [relatedApplicationId]
 */

/**
 * @typedef {Object} ComplaintPayload
 * @property {string} targetDepartment - Department / Authority complained against
 * @property {string} complaintCategory - 'HARASSMENT' | 'UNDUE_DELAY' | 'INSPECTION_MISCONDUCT' | 'BRIBERY_SOLICITATION' | 'PROCEDURAL_IRREGULARITY'
 * @property {string} [relatedApplicationId]
 * @property {string} incidentDate
 * @property {string} description
 * @property {string[]} [evidenceFileUrls]
 */

/**
 * @typedef {Object} FeedbackPayload
 * @property {number} overallRating - 1 to 5
 * @property {Object} categoryRatings
 * @property {number} [categoryRatings.easeOfNavigation]
 * @property {number} [categoryRatings.processingSpeed]
 * @property {number} [categoryRatings.officerResponsiveness]
 * @property {string} comments
 * @property {string} [suggestions]
 */

export const grievanceService = {
  // ── Queries ──
  /**
   * Submit a new helpdesk query
   * @param {QueryPayload} payload
   */
  submitQuery: async (payload) => {
    return apiClient.post('/grievances/queries', payload);
  },

  /**
   * Fetch enterprise's submitted queries
   * @param {{ status?: string, page?: number, limit?: number }} [params]
   */
  getUserQueries: async (params = {}) => {
    return apiClient.get('/grievances/queries', params);
  },

  /**
   * Get specific query thread with authority response
   * @param {string} queryId
   */
  getQueryById: async (queryId) => {
    return apiClient.get(`/grievances/queries/${queryId}`);
  },

  // ── Complaints ──
  /**
   * Lodge a formal vigilance or administrative complaint
   * @param {ComplaintPayload} payload
   */
  submitComplaint: async (payload) => {
    return apiClient.post('/grievances/complaints', payload);
  },

  /**
   * Fetch submitted complaints with status and investigation findings
   * @param {{ status?: string, page?: number, limit?: number }} [params]
   */
  getUserComplaints: async (params = {}) => {
    return apiClient.get('/grievances/complaints', params);
  },

  /**
   * Get single complaint investigation status
   * @param {string} complaintId
   */
  getComplaintById: async (complaintId) => {
    return apiClient.get(`/grievances/complaints/${complaintId}`);
  },

  // ── Feedback ──
  /**
   * Submit portal and single-window clearance feedback
   * @param {FeedbackPayload} payload
   */
  submitFeedback: async (payload) => {
    return apiClient.post('/grievances/feedback', payload);
  },

  /**
   * Fetch public feedback metrics and satisfaction indices
   */
  getPublicFeedbackStats: async () => {
    return apiClient.get('/grievances/feedback/stats');
  },
};

export default grievanceService;
