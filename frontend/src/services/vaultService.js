import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const vaultService = {
  getVaultDocuments: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.VAULT.GET_DOCUMENTS, { params });
  },

  getPendingDocuments: async (params = {}) => {
    return await axiosInstance.get(API_PATHS.VAULT.GET_PENDING_DOCS, { params });
  },

  getVaultDocumentById: async (id) => {
    return await axiosInstance.get(API_PATHS.VAULT.GET_DOCUMENT_BY_ID(id));
  },

  uploadCertificate: async (formData) => {
    return await axiosInstance.post(API_PATHS.VAULT.UPLOAD_DOCUMENT, formData);
  },

  renewDocument: async (id, renewalData) => {
    return await axiosInstance.post(API_PATHS.VAULT.RENEW_DOCUMENT(id), renewalData);
  },

  downloadCertificate: async (id) => {
    return await axiosInstance.get(API_PATHS.VAULT.DOWNLOAD_CERTIFICATE(id), {
      responseType: 'blob',
    });
  },
};

export default vaultService;
