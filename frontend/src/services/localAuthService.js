/**
 * Local Authority Service (Inspection, Scrutiny & Field Desk Portal)
 * Manages desk screening, site inspection scheduling, report generation, discrepancy issuance, and request history.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} ScrutinyDecisionPayload
 * @property {'APPROVED'|'REJECTED'|'DISCREPANCY'} action
 * @property {string} remarks
 * @property {string[]} [discrepancyItems] - Specific documents or items requiring revision
 * @property {string} [forwardToAuthorityId] - Next authority node in pipeline
 */

/**
 * @typedef {Object} InspectionSchedulePayload
 * @property {string} inspectionDate - YYYY-MM-DD
 * @property {string} inspectorName
 * @property {string} inspectorPhone
 * @property {string} designatedOffice
 * @property {string} [checklistTemplateId]
 * @property {string} [specialInstructions]
 */

/**
 * @typedef {Object} InspectionReportPayload
 * @property {boolean} isPassed
 * @property {number} complianceScore - 0 to 100
 * @property {string} siteObservations
 * @property {string[]} verifiedItems
 * @property {string} [reportDocumentUrl]
 * @property {Array<{ latitude: number, longitude: number, timestamp: string }>} [geoTagging]
 */

export const localAuthService = {
  /**
   * Fetch inward clearance applications assigned to this local authority desk
   * @param {{ stage?: 'DESK_SCRUTINY'|'FIELD_INSPECTION'|'ALL', priority?: string, search?: string }} [params]
   */
  getInwardRequests: async (params = {}) => {
    return apiClient.get('/local-auth/requests', params);
  },

  /**
   * Get single application dossier for scrutiny review
   * @param {string} requestId
   */
  getRequestDetails: async (requestId) => {
    return apiClient.get(`/local-auth/requests/${requestId}`);
  },

  /**
   * Record desk scrutiny decision (Pass, Discrepancy, Reject)
   * @param {string} requestId
   * @param {ScrutinyDecisionPayload} payload
   */
  submitScrutinyDecision: async (requestId, payload) => {
    return apiClient.post(`/local-auth/requests/${requestId}/scrutiny`, payload);
  },

  /**
   * Schedule a mandatory field site inspection
   * @param {string} requestId
   * @param {InspectionSchedulePayload} payload
   */
  scheduleInspection: async (requestId, payload) => {
    return apiClient.post(`/local-auth/requests/${requestId}/schedule-inspection`, payload);
  },

  /**
   * Submit physical inspection report with findings & compliance outcome
   * @param {string} requestId
   * @param {InspectionReportPayload | FormData} payload
   */
  submitInspectionReport: async (requestId, payload) => {
    return apiClient.post(`/local-auth/requests/${requestId}/inspection-report`, payload);
  },

  /**
   * Fetch closed, approved, or forwarded requests audit log
   * @param {{ dateFrom?: string, dateTo?: string, outcome?: string, page?: number }} [params]
   */
  getRequestHistory: async (params = {}) => {
    return apiClient.get('/local-auth/history', params);
  },

  /**
   * Fetch complaints directed against this local authority division
   * @param {{ status?: string, page?: number }} [params]
   */
  getDepartmentComplaints: async (params = {}) => {
    return apiClient.get('/local-auth/complaints', params);
  },

  /**
   * Submit grievance resolution notes for local complaint
   * @param {string} complaintId
   * @param {{ resolutionNotes: string, status: 'RESOLVED'|'DISMISSED' }} payload
   */
  resolveComplaint: async (complaintId, payload) => {
    return apiClient.post(`/local-auth/complaints/${complaintId}/resolve`, payload);
  },

  /**
   * Get designated local authority officer profile & jurisdiction info
   */
  getAuthorityProfile: async () => {
    return apiClient.get('/local-auth/profile');
  },
};

export default localAuthService;
