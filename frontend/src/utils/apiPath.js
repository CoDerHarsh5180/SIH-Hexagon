/**
 * DocFlow Single-Window Industrial Clearance Platform
 * Consolidated API Paths & Base URL Configuration
 *
 * This file centralizes all backend API route endpoints required across
 * the three portals (User Portal, Local Authority Desk, Main Authority Directorate).
 */

export const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

export const API_PATHS = {
  // ── 01. Authentication & Enterprise Profile ──
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    SEND_OTP: "/api/auth/send-otp",
    VERIFY_OTP: "/api/auth/verify-otp",
  },

  // ── 02. Approvals, "Know Your Approval" & Rules Engine ──
  APPROVALS: {
    EVALUATE: "/api/approvals/evaluate",
    GET_ALL: "/api/approvals",
    GET_BY_ID: (id) => `/api/approvals/${id}`,
    CALCULATE_FEES: "/api/approvals/calculator",
    GET_REQUIRED_DOCUMENTS: "/api/approvals/required-documents",
  },

  // ── 03. Applications & Custom Clearances ──
  APPLICATIONS: {
    SUBMIT: "/api/applications",
    CUSTOM_APPLY: "/api/applications/custom-apply",
    GET_USER_APPLICATIONS: "/api/applications",
    GET_APPLICATION_BY_ID: (id) => `/api/applications/${id}`,
    RESPOND_DISCREPANCY: (id) => `/api/applications/${id}/discrepancy-response`,
    SUBMIT_FEE_PAYMENT: (id) => `/api/applications/${id}/fee-payment`,
    WITHDRAW: (id) => `/api/applications/${id}/withdraw`,
  },

  // ── 04. Document Tracking & Inter-Authority Pipeline ──
  TRACKING: {
    GET_PIPELINE: (id) => `/api/tracking/${id}`,
    PUBLIC_LOOKUP: "/api/tracking/public-lookup",
    GET_AUDIT_HISTORY: (id) => `/api/tracking/${id}/history`,
    ESCALATE: (id) => `/api/tracking/${id}/escalate`,
  },

  // ── 05. Enterprise Document Vault & Statutory Renewals ──
  VAULT: {
    GET_DOCUMENTS: "/api/vault/documents",
    GET_PENDING_DOCS: "/api/vault/pending-docs",
    GET_DOCUMENT_BY_ID: (id) => `/api/vault/documents/${id}`,
    UPLOAD_DOCUMENT: "/api/vault/documents/upload",
    RENEW_DOCUMENT: (id) => `/api/vault/documents/${id}/renew`,
    DOWNLOAD_CERTIFICATE: (id) => `/api/vault/documents/${id}/download`,
  },

  // ── 06. Grievances, Queries & Citizen Feedback ──
  GRIEVANCES: {
    SUBMIT_QUERY: "/api/grievances/queries",
    GET_QUERIES: "/api/grievances/queries",
    GET_QUERY_BY_ID: (id) => `/api/grievances/queries/${id}`,
    SUBMIT_COMPLAINT: "/api/grievances/complaints",
    GET_COMPLAINTS: "/api/grievances/complaints",
    GET_COMPLAINT_BY_ID: (id) => `/api/grievances/complaints/${id}`,
    SUBMIT_FEEDBACK: "/api/grievances/feedback",
    GET_FEEDBACK_STATS: "/api/grievances/feedback/stats",
  },

  // ── 07. Government Benefits & Subsidies ──
  GOV_BENEFITS: {
    GET_SCHEMES: "/api/benefits/schemes",
    GET_SCHEME_BY_ID: (id) => `/api/benefits/schemes/${id}`,
    CHECK_ELIGIBILITY: (id) => `/api/benefits/schemes/${id}/check-eligibility`,
    APPLY_SCHEME: (id) => `/api/benefits/schemes/${id}/apply`,
  },

  // ── 08. Notifications & Real-Time Alerts ──
  NOTIFICATIONS: {
    GET_ALL: "/api/notifications",
    GET_UNREAD_COUNT: "/api/notifications/unread-count",
    MARK_AS_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_AS_READ: "/api/notifications/mark-all-read",
    DELETE_NOTIFICATION: (id) => `/api/notifications/${id}`,
  },

  // ── 09. Local Authority Desk & Field Inspection ──
  LOCAL_AUTH: {
    GET_REQUESTS: "/api/local-auth/requests",
    GET_REQUEST_BY_ID: (id) => `/api/local-auth/requests/${id}`,
    SUBMIT_SCRUTINY: (id) => `/api/local-auth/requests/${id}/scrutiny`,
    SCHEDULE_INSPECTION: (id) => `/api/local-auth/requests/${id}/schedule-inspection`,
    SUBMIT_INSPECTION_REPORT: (id) => `/api/local-auth/requests/${id}/inspection-report`,
    GET_HISTORY: "/api/local-auth/history",
    RESOLVE_COMPLAINT: (id) => `/api/local-auth/complaints/${id}/resolve`,
  },

  // ── 10. Main Authority Governance & Apex Regulatory ──
  MAIN_AUTH: {
    GET_ANALYTICS: "/api/main-auth/analytics",
    GET_CATALOG: "/api/main-auth/catalog",
    GET_CATALOG_DOC_BY_ID: (id) => `/api/main-auth/catalog/${id}`,
    CREATE_DOC: "/api/main-auth/create-doc",
    CREATE_MASTER_DOC: "/api/main-auth/create-doc",
    UPDATE_DOC: (id) => `/api/main-auth/catalog/${id}`,
    UPDATE_MASTER_DOC: (id) => `/api/main-auth/catalog/${id}`,
    GET_LOCAL_AUTHORITIES: "/api/main-auth/local-authorities",
    REGISTER_LOCAL_AUTHORITY: "/api/main-auth/local-authorities",
    GET_COMPLAINTS: "/api/main-auth/complaints",
    INTERVENE_COMPLAINT: (id) => `/api/main-auth/complaints/${id}/intervene`,
    GET_REQUESTS: "/api/main-auth/requests",
    GET_REQUEST_BY_ID: (id) => `/api/main-auth/requests/${id}`,
    APPROVE_REQUEST: (id) => `/api/main-auth/requests/${id}/approve`,
    REJECT_REQUEST: (id) => `/api/main-auth/requests/${id}/reject`,
  },
};

export default API_PATHS;
