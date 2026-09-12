/**
 * Document Tracking & Pipeline Service
 * Manages inter-authority approval pipelines, live step progression, officer contacts, and SLA escalations.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} PipelineStep
 * @property {string} id
 * @property {string} roleKey - 'user' | 'auth1' | 'auth2' | 'auth3' | 'final'
 * @property {string} name - Step label
 * @property {string} authorityName - Responsible Directorate/Board
 * @property {string} contactPerson - Officer name & designation
 * @property {string} phone - Direct helpline/office number
 * @property {string} office - Room & physical address
 * @property {'COMPLETED'|'IN_PROGRESS'|'PENDING'|'DISCREPANCY'} status
 * @property {string|null} completedDate
 * @property {string} remarks
 */

/**
 * @typedef {Object} TrackingDetailResponse
 * @property {string} applicationId
 * @property {string} docName
 * @property {string} description
 * @property {string} dateApplied
 * @property {string} estimatedDate
 * @property {string} currentStatus
 * @property {PipelineStep[]} pipelineSteps
 * @property {Array<{ name: string, size: string, uploadedAt: string, fileUrl: string }>} submittedFiles
 */

export const trackingService = {
  /**
   * Get full tracking pipeline data for an application
   * @param {string} applicationId
   * @returns {Promise<TrackingDetailResponse>}
   */
  getTrackingDetails: async (applicationId) => {
    return apiClient.get(`/tracking/${applicationId}`);
  },

  /**
   * Public tracking lookup without authentication (Application ID + verification code)
   * @param {{ applicationId: string, verificationCode?: string }} payload
   */
  publicTrackDocument: async (payload) => {
    return apiClient.post('/tracking/public-lookup', payload);
  },

  /**
   * Fetch complete timeline audit trail of status transitions and timestamps
   * @param {string} applicationId
   */
  getAuditHistory: async (applicationId) => {
    return apiClient.get(`/tracking/${applicationId}/history`);
  },

  /**
   * Trigger SLA escalation for an overdue clearance step
   * @param {string} applicationId
   * @param {{ currentStepId: string, daysOverdue: number, remarks?: string }} payload
   */
  escalateStep: async (applicationId, payload) => {
    return apiClient.post(`/tracking/${applicationId}/escalate`, payload);
  },
};

export default trackingService;
