/**
 * Application & Custom Apply Service
 * Manages industrial clearance applications, custom form submissions, attachments, and applicant discrepancy responses.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} ApplicationSubmissionPayload
 * @property {string} approvalId - Master approval ID being applied for
 * @property {string} [customDocName] - Used in custom apply if not in standard catalog
 * @property {string} targetDepartment - Authority / Department handling the clearance
 * @property {Object} applicantDetails
 * @property {string} applicantDetails.contactPerson
 * @property {string} applicantDetails.phone
 * @property {string} applicantDetails.email
 * @property {Object} industrialDetails
 * @property {string} industrialDetails.plotNumber
 * @property {string} industrialDetails.industrialArea
 * @property {string} industrialDetails.investmentAmount
 * @property {string} industrialDetails.manufacturingCategory
 * @property {Array<{ docType: string, fileUrl: string, fileName: string }>} [attachments]
 * @property {Object} [feePayment]
 * @property {string} feePayment.challanNumber
 * @property {number} feePayment.amountPaid
 * @property {string} feePayment.paymentDate
 */

export const applicationService = {
  /**
   * Submit a standard approval application
   * @param {ApplicationSubmissionPayload | FormData} payload
   */
  submitApplication: async (payload) => {
    return apiClient.post('/applications', payload);
  },

  /**
   * Submit a custom unlisted clearance request (Custom Docs Apply)
   * @param {ApplicationSubmissionPayload | FormData} payload
   */
  submitCustomApplication: async (payload) => {
    return apiClient.post('/applications/custom-apply', payload);
  },

  /**
   * Fetch all applications submitted by the current enterprise
   * @param {{ status?: string, page?: number, limit?: number, search?: string }} [params]
   */
  getUserApplications: async (params = {}) => {
    return apiClient.get('/applications', params);
  },

  /**
   * Fetch specific application details
   * @param {string} applicationId
   */
  getApplicationById: async (applicationId) => {
    return apiClient.get(`/applications/${applicationId}`);
  },

  /**
   * Respond to desk screening or inspection discrepancy
   * @param {string} applicationId
   * @param {{ stepId: string, remarks: string, revisedFiles?: Array<File|Object> } | FormData} payload
   */
  respondToDiscrepancy: async (applicationId, payload) => {
    return apiClient.post(`/applications/${applicationId}/discrepancy-response`, payload);
  },

  /**
   * Submit fee payment challan details for an application
   * @param {string} applicationId
   * @param {{ challanNumber: string, amount: number, paymentProofUrl: string, bankReference?: string }} payload
   */
  submitFeePayment: async (applicationId, payload) => {
    return apiClient.post(`/applications/${applicationId}/fee-payment`, payload);
  },

  /**
   * Withdraw an in-progress application
   * @param {string} applicationId
   * @param {{ reason: string }} payload
   */
  withdrawApplication: async (applicationId, payload) => {
    return apiClient.post(`/applications/${applicationId}/withdraw`, payload);
  },
};

export default applicationService;
