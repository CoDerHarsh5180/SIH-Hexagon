/**
 * Central Services Index
 * Re-exports all domain API services and the base HTTP client for clean importing.
 *
 * Example usage:
 *   import { authService, trackingService, vaultService } from '@/services';
 *   // or
 *   import { apiClient } from '@/services';
 */

export { apiClient, ApiError, getAuthToken } from './apiClient';
export { authService } from './authService';
export { approvalService } from './approvalService';
export { applicationService } from './applicationService';
export { trackingService } from './trackingService';
export { vaultService } from './vaultService';
export { grievanceService } from './grievanceService';
export { benefitsService } from './benefitsService';
export { notificationService } from './notificationService';
export { localAuthService } from './localAuthService';
export { mainAuthService } from './mainAuthService';
