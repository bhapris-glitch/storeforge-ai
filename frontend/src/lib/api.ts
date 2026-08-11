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
 * NOT FOR:
 * - Chatbot communication
 * - Sales-agent conversations
 * - Chat memory
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
// TOKEN HELPERS
// ============================================================================
//
// Primary authentication is handled through the HTTP-only cookie:
//
// storeforge_token
//
// We do NOT need to expose the JWT to browser JavaScript.
//
// The localStorage fallback is provided only for development/backward
// compatibility if an older frontend authentication flow is being used.
//

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
// REQUEST URL
// ============================================================================

const buildUrl = (
  endpoint: string
): string => {

  if (
    endpoint.startsWith('http://') ||
    endpoint.startsWith('https://')
  ) {

    return endpoint;

  }


  const normalizedEndpoint =
    endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;


  return `${API_BASE_URL}${normalizedEndpoint}`;

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


  // --------------------------------------------------------------------------
  // JSON content type
  // --------------------------------------------------------------------------

  if (
    body !== undefined &&
    !(body instanceof FormData)
  ) {

    requestHeaders.set(
      'Content-Type',
      'application/json'
    );

  }


  // --------------------------------------------------------------------------
  // Authorization
  // --------------------------------------------------------------------------
  //
  // If using the HTTP-only cookie, the browser sends it automatically because
  // credentials are included below.
  //
  // If an older/local development flow stores the token in localStorage,
  // Authorization is also supported.
  //

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


  // --------------------------------------------------------------------------
  // Handle failed responses
  // --------------------------------------------------------------------------

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
// DEFAULT EXPORT
// ============================================================================

export default api;
