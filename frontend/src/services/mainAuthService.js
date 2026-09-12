/**
 * Main Authority Governance Service (Apex Regulatory Portal)
 * Manages macro analytics, master statutory document creation, dynamic pipeline orchestration,
 * subordinate local authority oversight, and system-wide complaints.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} PipelineNodeConfig
 * @property {number} orderIndex
 * @property {string} nodeTitle - E.g. 'Auth 1: Desk Screening'
 * @property {string} authorityDivision - E.g. 'Pollution Control Sub-Regional Office'
 * @property {number} maxSlaDays
 * @property {boolean} requiresFieldVisit
 * @property {boolean} canIssueDiscrepancy
 */

/**
 * @typedef {Object} CreateMasterDocPayload
 * @property {string} docName
 * @property {string} department
 * @property {'ENVIRONMENT'|'SAFETY'|'UTILITY'|'LABOUR'|'MUNICIPAL'} category
 * @property {number} validityYears
 * @property {number} totalEstimatedDays
 * @property {string} feeCalculationFormula
 * @property {Array<{ docName: string, isMandatory: boolean, format: string }>} requiredDocuments
 * @property {PipelineNodeConfig[]} pipelineStages
 * @property {string[]} [inspectionChecklist]
 */

export const mainAuthService = {
  /**
   * Fetch apex dashboard analytics, compliance rates, and bottleneck statistics
   */
  getDashboardAnalytics: async () => {
    return apiClient.get('/main-auth/analytics');
  },

  /**
   * Fetch master catalog of statutory approvals and clearances
   * @param {{ category?: string, department?: string, page?: number, limit?: number }} [params]
   */
  getMasterCatalog: async (params = {}) => {
    return apiClient.get('/main-auth/catalog', params);
  },

  /**
   * Get single master approval specification
   * @param {string} docId
   */
  getMasterDocById: async (docId) => {
    return apiClient.get(`/main-auth/catalog/${docId}`);
  },

  /**
   * Create a new statutory clearance with dynamic pipeline configuration
   * @param {CreateMasterDocPayload} payload
   */
  createMasterApproval: async (payload) => {
    return apiClient.post('/main-auth/create-doc', payload);
  },

  /**
   * Update master approval attributes, SLA rules, or pipeline steps
   * @param {string} docId
   * @param {Partial<CreateMasterDocPayload>} payload
   */
  updateMasterApproval: async (docId, payload) => {
    return apiClient.put(`/main-auth/catalog/${docId}`, payload);
  },

  /**
   * Fetch directory of all regional/local authority sub-offices and nodal officers
   * @param {{ state?: string, district?: string }} [params]
   */
  getLocalAuthoritiesDirectory: async (params = {}) => {
    return apiClient.get('/main-auth/local-authorities', params);
  },

  /**
   * Add or register a subordinate local authority jurisdiction
   * @param {{ officeName: string, district: string, jurisdictionPincodes: string[], nodalOfficerEmail: string }} payload
   */
  registerLocalAuthority: async (payload) => {
    return apiClient.post('/main-auth/local-authorities', payload);
  },

  /**
   * Fetch statewide administrative and harassment complaints
   * @param {{ department?: string, status?: string, page?: number }} [params]
   */
  getAllComplaints: async (params = {}) => {
    return apiClient.get('/main-auth/complaints', params);
  },

  /**
   * Intervene or resolve a high-level escalation complaint
   * @param {string} complaintId
   * @param {{ action: 'DISMISS'|'ISSUE_SHOWCAUSE'|'PENALIZE_OFFICER'|'EXPEDITE_CLEARANCE', notes: string }} payload
   */
  resolveApexComplaint: async (complaintId, payload) => {
    return apiClient.post(`/main-auth/complaints/${complaintId}/intervene`, payload);
  },

  /**
   * Get Main Authority administrator profile
   */
  getMainAuthProfile: async () => {
    return apiClient.get('/main-auth/profile');
  },

  // ── Central Clearance Requests ──

  /**
   * Fetch inward clearance applications requiring Central / Apex clearance
   * @param {{ clearanceLevel?: string, status?: string, search?: string, page?: number, limit?: number }} [params]
   */
  getCentralRequests: async (params = {}) => {
    return apiClient.get('/main-auth/requests', params);
  },

  /**
   * Get detailed dossier for a central clearance application
   * @param {string} requestId
   */
  getCentralRequestDetails: async (requestId) => {
    return apiClient.get(`/main-auth/requests/${requestId}`);
  },

  /**
   * Issue apex approval and cryptographically sign clearance certificate
   * @param {string} requestId
   * @param {{ signedLicenseNumber: string, validityYears: number, remarks: string }} payload
   */
  submitApexApprovalDecision: async (requestId, payload) => {
    return apiClient.post(`/main-auth/requests/${requestId}/approve`, payload);
  },

  /**
   * Issue statutory remittance or disapproval order
   * @param {string} requestId
   * @param {{ primaryGround: string, detailedOrderReason: string }} payload
   */
  submitApexRemittance: async (requestId, payload) => {
    return apiClient.post(`/main-auth/requests/${requestId}/reject`, payload);
  },
};

export default mainAuthService;
