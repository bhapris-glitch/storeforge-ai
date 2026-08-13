/**
 * ============================================================================
 * StoreForge AI
 * Frontend API Client
 * ============================================================================
 *
 * File:
 * frontend/src/lib/api.ts
 *
 * Purpose:
 * Central HTTP client used by the StoreForge frontend to communicate with
 * the StoreForge backend.
 *
 * IMPORTANT:
 * - Authentication uses HTTP-only cookies when available.
 * - Legacy localStorage token support is retained for compatibility.
 * - OpenAI is handled by the backend. Never expose OPENAI_API_KEY here.
 *
 * ============================================================================
 */

'use client';


// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';


// ============================================================================
// TYPES
// ============================================================================

export interface ApiRequestOptions
  extends RequestInit {

  token?: string;

  body?: unknown;

}


export interface ApiErrorResponse {

  success?: boolean;

  message?: string;

  error?: string;

  errors?: unknown;

  statusCode?: number;

}


export class ApiError extends Error {

  status: number;

  data: ApiErrorResponse | null;


  constructor(
    message: string,
    status = 500,
    data: ApiErrorResponse | null = null
  ) {

    super(message);

    this.name = 'ApiError';

    this.status = status;

    this.data = data;

  }

}


// ============================================================================
// TOKEN
// ============================================================================

const getStoredToken = (): string | null => {

  if (
    typeof window === 'undefined'
  ) {

    return null;

  }


  return (
    localStorage.getItem(
      'storeforge_token'
    ) ||
    localStorage.getItem(
      'token'
    )
  );

};


// ============================================================================
// URL
// ============================================================================

const buildUrl = (
  endpoint: string
): string => {

  if (
    endpoint.startsWith(
      'http://'
    ) ||
    endpoint.startsWith(
      'https://'
    )
  ) {

    return endpoint;

  }


  const normalizedEndpoint =
    endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;


  return (
    `${API_BASE_URL}${normalizedEndpoint}`
  );

};


// ============================================================================
// QUERY STRING
// ============================================================================

const buildQueryString = (
  params?: Record<string, unknown>
): string => {

  if (!params) {

    return '';

  }


  const searchParams =
    new URLSearchParams();


  Object.entries(
    params
  ).forEach(
    ([key, value]) => {

      if (
        value === undefined ||
        value === null ||
        value === ''
      ) {

        return;

      }


      if (
        Array.isArray(value)
      ) {

        value.forEach(
          (item) => {

            searchParams.append(
              key,
              String(item)
            );

          }
        );

        return;

      }


      searchParams.set(
        key,
        String(value)
      );

    }
  );


  const query =
    searchParams.toString();


  return query
    ? `?${query}`
    : '';

};


// ============================================================================
// RESPONSE PARSER
// ============================================================================

const parseResponse = async (
  response: Response
): Promise<unknown> => {

  const contentType =
    response.headers.get(
      'content-type'
    ) || '';


  if (
    contentType.includes(
      'application/json'
    )
  ) {

    try {

      return await response.json();

    } catch {

      return null;

    }

  }


  return await response.text();

};


// ============================================================================
// ERROR MESSAGE
// ============================================================================

const getErrorMessage = (
  data: unknown,
  status: number
): string => {

  if (
    data &&
    typeof data === 'object'
  ) {

    const errorData =
      data as ApiErrorResponse;


    if (
      typeof errorData.message === 'string' &&
      errorData.message.trim()
    ) {

      return errorData.message;

    }


    if (
      typeof errorData.error === 'string' &&
      errorData.error.trim()
    ) {

      return errorData.error;

    }

  }


  switch (status) {

    case 400:
      return 'Invalid request.';

    case 401:
      return 'Authentication required.';

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return 'The requested resource was not found.';

    case 409:
      return 'The request conflicts with existing data.';

    case 422:
      return 'The submitted data is invalid.';

    case 429:
      return 'Too many requests. Please try again later.';

    case 500:
      return 'Server error. Please try again later.';

    default:
      return `Request failed with status ${status}.`;

  }

};


// ============================================================================
// CORE REQUEST
// ============================================================================

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {

  const {
    token,
    body,
    headers,
    ...requestOptions
  } = options;


  const storedToken =
    token ||
    getStoredToken();


  const requestHeaders =
    new Headers(
      headers
    );


  if (
    body !== undefined &&
    !(body instanceof FormData)
  ) {

    requestHeaders.set(
      'Content-Type',
      'application/json'
    );

  }


  if (storedToken) {

    requestHeaders.set(
      'Authorization',
      `Bearer ${storedToken}`
    );

  }


  const requestBody =
    body === undefined
      ? undefined
      : body instanceof FormData
        ? body
        : JSON.stringify(body);


  let response: Response;


  try {

    response =
      await fetch(
        buildUrl(endpoint),
        {

          ...requestOptions,

          headers:
            requestHeaders,

          credentials:
            'include',

          body:
            requestBody

        }
      );

  } catch (error) {

    throw new ApiError(
      'Unable to connect to the StoreForge server.',
      0,
      {
        message:
          error instanceof Error
            ? error.message
            : 'Network error'
      }
    );

  }


  const data =
    await parseResponse(
      response
    );


  if (!response.ok) {

    throw new ApiError(

      getErrorMessage(
        data,
        response.status
      ),

      response.status,

      data &&
      typeof data === 'object'
        ? data as ApiErrorResponse
        : null

    );

  }


  return data as T;

}


// ============================================================================
// HTTP METHODS
// ============================================================================

export const api = {

  get: <T = unknown>(
    endpoint: string,
    options: Omit<
      ApiRequestOptions,
      'body'
    > = {}
  ) => {

    return apiRequest<T>(
      endpoint,
      {

        ...options,

        method:
          'GET'

      }
    );

  },


  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<
      ApiRequestOptions,
      'body'
    > = {}
  ) => {

    return apiRequest<T>(
      endpoint,
      {

        ...options,

        method:
          'POST',

        body

      }
    );

  },


  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<
      ApiRequestOptions,
      'body'
    > = {}
  ) => {

    return apiRequest<T>(
      endpoint,
      {

        ...options,

        method:
          'PUT',

        body

      }
    );

  },


  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options: Omit<
      ApiRequestOptions,
      'body'
    > = {}
  ) => {

    return apiRequest<T>(
      endpoint,
      {

        ...options,

        method:
          'PATCH',

        body

      }
    );

  },


  delete: <T = unknown>(
    endpoint: string,
    options: Omit<
      ApiRequestOptions,
      'body'
    > = {}
  ) => {

    return apiRequest<T>(
      endpoint,
      {

        ...options,

        method:
          'DELETE'

      }
    );

  }

};


// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {

  login: <T = unknown>(
    data: {
      email: string;
      password: string;
    }
  ) => {

    return api.post<T>(
      '/auth/login',
      data
    );

  },


  register: <T = unknown>(
    data: {
      name: string;
      email: string;
      password: string;
    }
  ) => {

    return api.post<T>(
      '/auth/register',
      data
    );

  },


  logout: <T = unknown>() => {

    return api.post<T>(
      '/auth/logout'
    );

  },


  me: <T = unknown>() => {

    return api.get<T>(
      '/auth/me'
    );

  }

};


// ============================================================================
// STORE API
// ============================================================================

export const storeApi = {

  list: <T = unknown>() => {

    return api.get<T>(
      '/stores'
    );

  },


  get: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/stores/${storeId}`
    );

  },


  create: <T = unknown>(
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      '/stores',
      data
    );

  },


  update: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/stores/${storeId}`,
      data
    );

  },


  delete: <T = unknown>(
    storeId: string
  ) => {

    return api.delete<T>(
      `/stores/${storeId}`
    );

  }

};


// ============================================================================
// BRANDING API
// ============================================================================

export const brandingApi = {

  get: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/branding/${storeId}`
    );

  },


  create: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      `/branding/${storeId}`,
      data
    );

  },


  update: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/branding/${storeId}`,
      data
    );

  }

};


// ============================================================================
// PRODUCT API
// ============================================================================

export const productApi = {

  list: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/products/${storeId}`
    );

  },


  get: <T = unknown>(
    storeId: string,
    productId: string
  ) => {

    return api.get<T>(
      `/products/${storeId}/${productId}`
    );

  },


  create: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      `/products/${storeId}`,
      data
    );

  },


  generate: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      `/products/${storeId}/generate`,
      data
    );

  },


  update: <T = unknown>(
    storeId: string,
    productId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/products/${storeId}/${productId}`,
      data
    );

  },


  delete: <T = unknown>(
    storeId: string,
    productId: string
  ) => {

    return api.delete<T>(
      `/products/${storeId}/${productId}`
    );

  }

};


// ============================================================================
// THEME API
// ============================================================================

export const themeApi = {

  list: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/themes/${storeId}`
    );

  },


  get: <T = unknown>(
    storeId: string,
    themeId: string
  ) => {

    return api.get<T>(
      `/themes/${storeId}/${themeId}`
    );

  },


  create: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      `/themes/${storeId}`,
      data
    );

  },


  update: <T = unknown>(
    storeId: string,
    themeId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/themes/${storeId}/${themeId}`,
      data

    );

  },


  deploy: <T = unknown>(
    storeId: string,
    themeId: string
  ) => {

    return api.post<T>(
      `/themes/${storeId}/${themeId}/deploy`
    );

  }

};


// ============================================================================
// SHOPIFY API
// ============================================================================

export const shopifyApi = {

  install: <T = unknown>(
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      '/shopify/install',
      data
    );

  },


  stores: <T = unknown>() => {

    return api.get<T>(
      '/shopify/stores'
    );

  },


  status: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/shopify/status/${storeId}`
    );

  }

};


// ============================================================================
// BILLING API
// ============================================================================

export const billingApi = {

  plans: <T = unknown>() => {

    return api.get<T>(
      '/billing/plans'
    );

  },


  subscription: <T = unknown>() => {

    return api.get<T>(
      '/billing/subscription'
    );

  },


  checkout: <T = unknown>(
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      '/billing/checkout',
      data
    );

  },


  cancel: <T = unknown>() => {

    return api.post<T>(
      '/billing/cancel'
    );

  }

};


// ============================================================================
// ANALYTICS API
// ============================================================================

export const analyticsApi = {

  dashboard: <T = unknown>(
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/dashboard${buildQueryString(params)}`
    );

  },


  store: <T = unknown>(
    storeId: string,
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/stores/${storeId}${buildQueryString(params)}`
    );

  },


  products: <T = unknown>(
    storeId: string,
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/products/${storeId}${buildQueryString(params)}`
    );

  },


  themes: <T = unknown>(
    storeId: string,
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/themes/${storeId}${buildQueryString(params)}`
    );

  },


  deployments: <T = unknown>(
    storeId: string,
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/deployments/${storeId}${buildQueryString(params)}`
    );

  },


  revenue: <T = unknown>(
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/revenue${buildQueryString(params)}`
    );

  },


  usage: <T = unknown>(
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/analytics/usage${buildQueryString(params)}`
    );

  }

};


// ============================================================================
// ADMIN API
// ============================================================================

export const adminApi = {

  stats: <T = unknown>() => {

    return api.get<T>(
      '/admin/stats'
    );

  },


  users: <T = unknown>(
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/admin/users${buildQueryString(params)}`
    );

  },


  user: <T = unknown>(
    userId: string
  ) => {

    return api.get<T>(
      `/admin/users/${userId}`
    );

  },


  updateUser: <T = unknown>(
    userId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/admin/users/${userId}`,
      data
    );

  },


  stores: <T = unknown>(
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/admin/stores${buildQueryString(params)}`
    );

  },


  store: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/admin/stores/${storeId}`
    );

  },


  updateStore: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/admin/stores/${storeId}`,
      data
    );

  },


  subscriptions: <T = unknown>(
    params: Record<string, unknown> = {}
  ) => {

    return api.get<T>(
      `/admin/subscriptions${buildQueryString(params)}`
    );

  },


  updateSubscription: <T = unknown>(
    subscriptionId: string,
    data: Record<string, unknown>
  ) => {

    return api.patch<T>(
      `/admin/subscriptions/${subscriptionId}`,
      data
    );

  },


  health: <T = unknown>() => {

    return api.get<T>(
      '/admin/health'
    );

  }

};


// ============================================================================
// DEPLOYMENT API
// ============================================================================

export const deploymentApi = {

  list: <T = unknown>(
    storeId: string
  ) => {

    return api.get<T>(
      `/deployments/${storeId}`
    );

  },


  get: <T = unknown>(
    storeId: string,
    deploymentId: string
  ) => {

    return api.get<T>(
      `/deployments/${storeId}/${deploymentId}`
    );

  },


  create: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) => {

    return api.post<T>(
      `/deployments/${storeId}`,
      data
    );

  },


  status: <T = unknown>(
    storeId: string,
    deploymentId: string
  ) => {

    return api.get<T>(
      `/deployments/${storeId}/${deploymentId}/status`
    );

  },


  cancel: <T = unknown>(
    storeId: string,
    deploymentId: string
  ) => {

    return api.post<T>(
      `/deployments/${storeId}/${deploymentId}/cancel`
    );

  }

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default api;
