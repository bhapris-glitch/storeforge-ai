// ============================================================================
// StoreForge AI
// Frontend API Client
// ============================================================================

'use client';

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';


// ============================================================================
// CONFIGURATION
// ============================================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';


// ============================================================================
// API ERROR
// ============================================================================

export interface ApiErrorResponse {

  success?: boolean;

  message?: string;

  error?: string;

  errors?: unknown;

}


export class ApiError extends Error {

  status: number;

  data?: ApiErrorResponse;


  constructor(
    message: string,
    status = 500,
    data?: ApiErrorResponse
  ) {

    super(message);

    this.name = 'ApiError';

    this.status = status;

    this.data = data;

  }

}


// ============================================================================
// QUERY BUILDER
// ============================================================================

export function buildQueryString(
  params: Record<string, unknown> = {}
): string {

  const searchParams =
    new URLSearchParams();


  Object.entries(params).forEach(
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

}


// ============================================================================
// AXIOS CLIENT
// ============================================================================

const api: AxiosInstance =
  axios.create({

    baseURL: API_URL,

    headers: {
      'Content-Type':
        'application/json',
    },

    withCredentials: true,

    timeout: 30000,

  });


// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

api.interceptors.request.use(
  (config) => {

    if (
      typeof window !==
      'undefined'
    ) {

      const token =
        localStorage.getItem(
          'accessToken'
        ) ||
        localStorage.getItem(
          'token'
        );


      if (token) {

        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;

      }

    }


    return config;

  }
);


// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

api.interceptors.response.use(

  (response) =>
    response,


  (error: AxiosError<ApiErrorResponse>) => {

    const status =
      error.response?.status ||
      500;


    const data =
      error.response?.data;


    const message =
      data?.message ||
      data?.error ||
      error.message ||
      'Request failed.';


    if (
      status === 401 &&
      typeof window !==
        'undefined'
    ) {

      localStorage.removeItem(
        'accessToken'
      );

      localStorage.removeItem(
        'token'
      );

    }


    return Promise.reject(
      new ApiError(
        message,
        status,
        data
      )
    );

  }

);


// ============================================================================
// GENERIC REQUEST HELPERS
// ============================================================================

export async function get<
  T = unknown
>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {

  const response =
    await api.get<T>(
      url,
      config
    );

  return response.data;

}


export async function post<
  T = unknown
>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {

  const response =
    await api.post<T>(
      url,
      data,
      config
    );

  return response.data;

}


export async function put<
  T = unknown
>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {

  const response =
    await api.put<T>(
      url,
      data,
      config
    );

  return response.data;

}


export async function patch<
  T = unknown
>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {

  const response =
    await api.patch<T>(
      url,
      data,
      config
    );

  return response.data;

}


export async function del<
  T = unknown
>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {

  const response =
    await api.delete<T>(
      url,
      config
    );

  return response.data;

}


// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {

  register: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/auth/register',
      data
    ),


  login: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/auth/login',
      data
    ),


  me: <T = unknown>() =>
    get<T>(
      '/auth/me'
    ),


  logout: <T = unknown>() =>
    post<T>(
      '/auth/logout'
    ),

};
//=================================
// deployment Api
// =================================

export const deploymentApi = {

  list: <T = unknown>(
    storeId: string
  ) =>
    api.get<T>(
      `/deployments/${storeId}`
    ),

  get: <T = unknown>(
    storeId: string,
    deploymentId: string
  ) =>
    api.get<T>(
      `/deployments/${storeId}/${deploymentId}`
    ),

  create: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) =>
    api.post<T>(
      `/deployments/${storeId}`,
      data
    ),

  status: <T = unknown>(
    storeId: string,
    deploymentId: string
  ) =>
    api.get<T>(
      `/deployments/${storeId}/${deploymentId}/status`
    ),

  cancel: <T = unknown>(
    storeId: string,
    deploymentId: string
  ) =>
    api.post<T>(
      `/deployments/${storeId}/${deploymentId}/cancel`,
      {}
    ),

};

// ============================================================================
// USER API
// ============================================================================


export const userApi = {

  me: <T = unknown>() =>
    get<T>(
      '/users/me'
    ),


  update: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    put<T>(
      '/users/me',
      data
    ),

};


// ============================================================================
// STORE API
// ============================================================================

export const storeApi = {

  list: <T = unknown>() =>
    get<T>(
      '/stores'
    ),


  get: <T = unknown>(
    storeId: string
  ) =>
    get<T>(
      `/stores/${storeId}`
    ),


  create: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/stores',
      data
    ),


  update: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) =>
    put<T>(
      `/stores/${storeId}`,
      data
    ),


  remove: <T = unknown>(
    storeId: string
  ) =>
    del<T>(
      `/stores/${storeId}`
    ),

};

// ============================================================================
// BRANDING API
// ============================================================================

export const brandingApi = {

  get: <T = unknown>(
    storeId: string
  ) =>
    get<T>(
      `/branding/${storeId}`
    ),


  update: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) =>
    put<T>(
      `/branding/${storeId}`,
      data
    ),

};


// ============================================================================
// PRODUCT API
// ============================================================================

export const productApi = {

  list: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/products${buildQueryString(
        params
      )}`
    ),


  get: <T = unknown>(
    productId: string
  ) =>
    get<T>(
      `/products/${productId}`
    ),


  create: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/products',
      data
    ),


  update: <T = unknown>(
    productId: string,
    data: Record<string, unknown>
  ) =>
    put<T>(
      `/products/${productId}`,
      data
    ),


  remove: <T = unknown>(
    productId: string
  ) =>
    del<T>(
      `/products/${productId}`
    ),


  generate: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/products/generate',
      data
    ),

};


// ============================================================================
// THEME API
// ============================================================================

export const themeApi = {

  list: <T = unknown>(
    storeId: string
  ) =>
    get<T>(
      `/themes?storeId=${encodeURIComponent(
        storeId
      )}`
    ),


  get: <T = unknown>(
    _storeId: string,
    themeId: string
  ) =>
    get<T>(
      `/themes/${themeId}`
    ),


  create: <T = unknown>(
    storeId: string,
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/themes',
      {
        ...data,
        storeId,
      }
    ),


  update: <T = unknown>(
    _storeId: string,
    themeId: string,
    data: Record<string, unknown>
  ) =>
    put<T>(
      `/themes/${themeId}`,
      data
    ),


  remove: <T = unknown>(
    _storeId: string,
    themeId: string
  ) =>
    del<T>(
      `/themes/${themeId}`
    ),


  deploy: <T = unknown>(
    _storeId: string,
    themeId: string
  ) =>
    post<T>(
      `/themes/${themeId}/deploy`
    ),

};


// ============================================================================
// ANALYTICS API
// ============================================================================

export const analyticsApi = {

  summary: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/analytics/summary${buildQueryString(
        params
      )}`
    ),


  daily: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/analytics/daily${buildQueryString(
        params
      )}`
    ),


  events: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/analytics/events/counts${buildQueryString(
        params
      )}`
    ),


  categories: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/analytics/categories${buildQueryString(
        params
      )}`
    ),


  recent: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/analytics/recent${buildQueryString(
        params
      )}`
    ),


  store: <T = unknown>(
    storeId: string,
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/analytics/store/${storeId}${buildQueryString(
        params
      )}`
    ),


  recordEvent: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/analytics/events',
      data
    ),


  recordAIUsage: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/analytics/ai-usage',
      data
    ),

};


// ============================================================================
// BILLING API
// ============================================================================

export const billingApi = {

  plans: <T = unknown>() =>
    get<T>(
      '/billing/plans'
    ),


  subscription: <T = unknown>() =>
    get<T>(
      '/billing/subscription'
    ),


  checkout: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/billing/checkout',
      data
    ),


  cancel: <T = unknown>() =>
    post<T>(
      '/billing/cancel'
    ),


  resume: <T = unknown>() =>
    post<T>(
      '/billing/resume'
    ),


  changePlan: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/billing/change-plan',
      data
    ),


  limits: <T = unknown>() =>
    get<T>(
      '/billing/limits'
    ),


  feature: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/billing/feature',
      data
    ),

};

// ============================================================================
// AI API
// ============================================================================

export const aiApi = {

  chat: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/chat',
      data
    ),

  generateProduct: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/products/generate',
      data
    ),

  generateTheme: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/themes/generate',
      data
    ),

  generateContent: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/generate',
      data
    ),

  analyze: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/analyze',
      data
    ),

  brand: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/brand',
      data
    ),

  product: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/product',
      data
    ),

  theme: <T = unknown>(
    data: Record<string, unknown>
  ) =>
    post<T>(
      '/ai/theme',
      data
    ),

};
// ============================================================================
// ADMIN API
// ============================================================================

export const adminApi = {

  dashboard: <T = unknown>() =>
    get<T>(
      '/admin/dashboard'
    ),


  overview: <T = unknown>() =>
    get<T>(
      '/admin/overview'
    ),


  users: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/admin/users${buildQueryString(
        params
      )}`
    ),


  user: <T = unknown>(
    userId: string
  ) =>
    get<T>(
      `/admin/users/${userId}`
    ),


  userCounts: <T = unknown>() =>
    get<T>(
      '/admin/users/counts'
    ),


  updateUserStatus: <T = unknown>(
    userId: string,
    status: string
  ) =>
    patch<T>(
      `/admin/users/${userId}/status`,
      {
        status,
      }
    ),


  // PATCH /api/admin/users/:userId/activate
  activateUser: <T = unknown>(
    userId: string
  ) =>
    patch<T>(
      `/admin/users/${userId}/activate`
    ),


  // PATCH /api/admin/users/:userId/suspend
  suspendUser: <T = unknown>(
    userId: string
  ) =>
    patch<T>(
      `/admin/users/${userId}/suspend`
    ),


  deleteUser: <T = unknown>(
    userId: string
  ) =>
    del<T>(
      `/admin/users/${userId}`
    ),


  stores: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/admin/stores${buildQueryString(
        params
      )}`
    ),


  store: <T = unknown>(
    storeId: string
  ) =>
    get<T>(
      `/admin/stores/${storeId}`
    ),


  storeCounts: <T = unknown>() =>
    get<T>(
      '/admin/stores/counts'
    ),


  updateStoreStatus: <T = unknown>(
    storeId: string,
    status: string
  ) =>
    patch<T>(
      `/admin/stores/${storeId}/status`,
      {
        status,
      }
    ),


  billing: <T = unknown>(
    params: Record<string, unknown> = {}
  ) =>
    get<T>(
      `/admin/billing${buildQueryString(
        params
      )}`
    ),


  billingSummary: <T = unknown>() =>
    get<T>(
      '/admin/billing/summary'
    ),


  recentUsers: <T = unknown>(
    limit = 10
  ) =>
    get<T>(
      `/admin/recent/users?limit=${encodeURIComponent(
        String(limit)
      )}`
    ),


  recentStores: <T = unknown>(
    limit = 10
  ) =>
    get<T>(
      `/admin/recent/stores?limit=${encodeURIComponent(
        String(limit)
      )}`
    ),

};


// ============================================================================
// HEALTH
// ============================================================================

export const healthApi = {

  check: <T = unknown>() =>
    get<T>(
      '/health'
    ),

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default api;
