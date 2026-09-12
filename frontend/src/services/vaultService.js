/**
 * Document Vault & Renewals Service ("Your Docs" & "Pending Docs")
 * Manages enterprise statutory document repository, validity periods, compliance alerts, and multi-step renewal workflows.
 */

import apiClient from './apiClient';

/**
 * @typedef {Object} VaultDocument
 * @property {string} id
 * @property {string} name
 * @property {string} authority
 * @property {string} category
 * @property {string} issueDate
 * @property {string} expiryDate
 * @property {'ACTIVE'|'EXPIRING_SOON'|'EXPIRED'} status
 * @property {string} certificateNumber
 * @property {string} [fileUrl]
 * @property {number} [renewalFee]
 * @property {Array<{ name: string, description: string, mandatory: boolean }>} [requiredRenewalDocs]
 */

/**
 * @typedef {Object} RenewalSubmissionPayload
 * @property {string} documentId
 * @property {number} renewalYears - 1 | 3 | 5
 * @property {Array<{ docType: string, fileId?: string, fileUrl?: string }>} uploadedDocs
 * @property {Object} paymentInfo
 * @property {number} paymentInfo.amount
 * @property {string} paymentInfo.paymentMethod - 'UPI' | 'NET_BANKING' | 'CHALLAN'
 * @property {string} [paymentInfo.transactionRef]
 */

export const vaultService = {
  /**
   * Fetch all documents stored in enterprise compliance vault
   * @param {{ status?: 'ACTIVE'|'EXPIRING_SOON'|'EXPIRED'|'ALL', category?: string, search?: string }} [params]
   */
  getVaultDocuments: async (params = {}) => {
    return apiClient.get('/vault/documents', params);
  },

  /**
   * Fetch documents requiring pending user action or submission
   * @param {{ priority?: 'CRITICAL'|'HIGH'|'MEDIUM'|'ALL', search?: string }} [params]
   */
  getPendingDocuments: async (params = {}) => {
    return apiClient.get('/vault/pending-docs', params);
  },

  /**
   * Get single vault document details with renewal requirements
   * @param {string} docId
   */
  getVaultDocById: async (docId) => {
    return apiClient.get(`/vault/documents/${docId}`);
  },

  /**
   * Upload a new statutory document to the enterprise vault
   * @param {FormData} formData
   */
  uploadDocument: async (formData) => {
    return apiClient.upload('/vault/documents/upload', formData);
  },

  /**
   * Submit document renewal application with required files and payment
   * @param {string} docId
   * @param {RenewalSubmissionPayload} payload
   */
  renewDocument: async (docId, payload) => {
    return apiClient.post(`/vault/documents/${docId}/renew`, payload);
  },

  /**
   * Download digitally signed certificate
   * @param {string} docId
   */
  downloadCertificateUrl: (docId) => {
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/vault/documents/${docId}/download`;
  },
};

export default vaultService;
