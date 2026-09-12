/**
 * Approval Service ("Know Your Approval" & Rules Engine)
 * Manages approval discovery, questionnaire evaluation, statutory requirements, and SLA fee calculation.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} ApprovalEvaluationPayload
 * @property {string} sector - E.g. 'Manufacturing', 'Chemical', 'Food Processing'
 * @property {string} enterpriseScale - 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE'
 * @property {string} state - E.g. 'Maharashtra'
 * @property {string} district - E.g. 'Raigad'
 * @property {string} zoneType - 'INDUSTRIAL_AREA' | 'MIXED_ZONE' | 'RESIDENTIAL' | 'RURAL'
 * @property {number} builtUpAreaSqM
 * @property {number} connectedPowerLoadKW
 * @property {number} dailyWaterConsumptionKLD
 * @property {boolean} generatesHazardousWaste
 * @property {boolean} involvesChemicalStorage
 * @property {number} investmentAmountInr
 * @property {number} expectedEmployees
 */

/**
 * @typedef {Object} ApprovalFilterParams
 * @property {string} [category] - 'ENVIRONMENT' | 'SAFETY' | 'UTILITY' | 'MUNICIPAL'
 * @property {string} [authority] - Department / Board name
 * @property {string} [mandatory] - 'true' | 'false'
 * @property {string} [search]
 * @property {number} [page=1]
 * @property {number} [limit=20]
 */

export const approvalService = {
  /**
   * Run decision-engine questionnaire to get mandatory approvals list
   * @param {ApprovalEvaluationPayload} payload
   */
  evaluateApprovals: async (payload) => {
    return apiClient.post('/approvals/evaluate', payload);
  },

  /**
   * Fetch full directory of statutory approvals
   * @param {ApprovalFilterParams} [params]
   */
  getApprovalsCatalog: async (params = {}) => {
    return apiClient.get('/approvals', params);
  },

  /**
   * Get single approval specification & requirements
   * @param {string} approvalId
   */
  getApprovalById: async (approvalId) => {
    return apiClient.get(`/approvals/${approvalId}`);
  },

  /**
   * Calculate exact estimated fees, challan breakdowns, and SLA timeline
   * @param {{ approvalIds: string[], enterpriseScale: string, investmentAmount: number }} payload
   */
  calculateFeesAndTimeline: async (payload) => {
    return apiClient.post('/approvals/calculator', payload);
  },

  /**
   * Fetch list of mandatory supporting documents required for a set of approvals
   * @param {{ approvalIds: string[] }} payload
   */
  getRequiredChecklist: async (payload) => {
    return apiClient.post('/approvals/required-documents', payload);
  },
};

export default approvalService;
