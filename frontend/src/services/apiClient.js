/**
 * Central API Client for DocFlow Platform
 * Handles HTTP requests, JWT authorization headers, query parameter serialization,
 * error handling, and file/FormData submissions.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieve auth token from storage
 */
const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null;
  } catch {
    return null;
  }
};

/**
 * Build URL with query params
 */
const buildUrl = (endpoint, params = {}) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = new URL(`${base}/${cleanEndpoint}`);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * Generic fetch request handler
 */
async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    data = null,
    params = {},
    headers = {},
    customBaseUrl = null,
    ...restOptions
  } = options;

  const url = customBaseUrl
    ? `${customBaseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
    : buildUrl(endpoint, params);

  const requestHeaders = { ...headers };
  const token = getAuthToken();

  if (token && !requestHeaders['Authorization']) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  if (!isFormData && !requestHeaders['Content-Type'] && method !== 'GET') {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers: requestHeaders,
    ...restOptions,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true, data: null };
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const result = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (isJson && result && (result.message || result.error)) ||
        response.statusText ||
        'API Request Failed';
      throw new ApiError(errorMessage, response.status, result);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error occurred', 500, null);
  }
}

export const apiClient = {
  get: (endpoint, params = {}, options = {}) =>
    request(endpoint, { method: 'GET', params, ...options }),

  post: (endpoint, data = {}, options = {}) =>
    request(endpoint, { method: 'POST', data, ...options }),

  put: (endpoint, data = {}, options = {}) =>
    request(endpoint, { method: 'PUT', data, ...options }),

  patch: (endpoint, data = {}, options = {}) =>
    request(endpoint, { method: 'PATCH', data, ...options }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { method: 'DELETE', ...options }),

  upload: (endpoint, formData, options = {}) =>
    request(endpoint, { method: 'POST', data: formData, ...options }),
};

export { ApiError, getAuthToken };
export default apiClient;
