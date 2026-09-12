/**
 * Government Benefits & Incentive Schemes Service
 * Manages industrial subsidies, capital investment incentives, and MSME benefit schemes.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} BenefitScheme
 * @property {string} id
 * @property {string} title
 * @property {string} department - 'Ministry of MSME' | 'DPIIT' | 'State Industries Dept'
 * @property {'CAPITAL_SUBSIDY'|'INTEREST_SUBVENTION'|'STAMP_DUTY_EXEMPTION'|'GREEN_INCENTIVE'} type
 * @property {string} maxBenefitAmount - E.g. '₹ 50,00,000'
 * @property {string[]} eligibleSectors
 * @property {string} deadline
 * @property {string} description
 * @property {string[]} qualifyingCriteria
 */

export const benefitsService = {
  /**
   * Fetch all government benefit & subsidy schemes
   * @param {{ sector?: string, type?: string, search?: string }} [params]
   */
  getBenefitSchemes: async (params = {}) => {
    return apiClient.get('/benefits/schemes', params);
  },

  /**
   * Get single scheme details
   * @param {string} schemeId
   */
  getSchemeById: async (schemeId) => {
    return apiClient.get(`/benefits/schemes/${schemeId}`);
  },

  /**
   * Check eligibility for a specific scheme based on user enterprise profile
   * @param {string} schemeId
   */
  checkEligibility: async (schemeId) => {
    return apiClient.post(`/benefits/schemes/${schemeId}/check-eligibility`);
  },

  /**
   * Submit an application for an incentive scheme
   * @param {string} schemeId
   * @param {{ udyamRegNumber: string, claimAmount: number, supportingDocs: string[] }} payload
   */
  applyForScheme: async (schemeId, payload) => {
    return apiClient.post(`/benefits/schemes/${schemeId}/apply`, payload);
  },
};

export default benefitsService;
