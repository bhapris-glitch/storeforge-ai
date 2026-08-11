/**
 * ============================================================================
 * StoreForge AI
 * Admin Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/admin.service.ts
 *
 * Purpose:
 * - Admin dashboard statistics
 * - User management
 * - Store management
 * - Subscription management
 * - System statistics
 *
 * IMPORTANT:
 * - All authorization must be enforced by the backend.
 * - Frontend role checks are NOT a security boundary.
 *
 * ============================================================================
 */

'use client';

import {
  adminApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface AdminStats {

  totalUsers?: number;

  activeUsers?: number;

  totalStores?: number;

  activeStores?: number;

  connectedStores?: number;

  totalProducts?: number;

  totalThemes?: number;

  totalDeployments?: number;

  successfulDeployments?: number;

  failedDeployments?: number;

  activeSubscriptions?: number;

  trialSubscriptions?: number;

  cancelledSubscriptions?: number;

  monthlyRevenue?: number;

  totalRevenue?: number;

  currency?: string;

}


export interface AdminUser {

  id: string;

  _id?: string;

  name?: string;

  email: string;

  role?: string;

  status?: string;

  createdAt?: string;

  updatedAt?: string;

}


export interface AdminStore {

  id: string;

  _id?: string;

  userId?: string;

  name?: string;

  shopifyDomain?: string;

  customDomain?: string;

  platform?: string;

  status?: string;

  isConnected?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


export interface AdminSubscription {

  id: string;

  _id?: string;

  userId?: string;

  storeId?: string;

  plan?: string;

  status?: string;

  price?: number;

  currency?: string;

  interval?: string;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  currentPeriodStart?: string;

  currentPeriodEnd?: string;

  cancelAtPeriodEnd?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AdminStatsResponse {

  success?: boolean;

  message?: string;

  stats?: AdminStats;

  data?:
    | AdminStats
    | {
        stats?: AdminStats;
      };

}


export interface AdminUsersResponse {

  success?: boolean;

  message?: string;

  users?: AdminUser[];

  data?:
    | AdminUser[]
    | {
        users?: AdminUser[];
      };

}


export interface AdminStoresResponse {

  success?: boolean;

  message?: string;

  stores?: AdminStore[];

  data?:
    | AdminStore[]
    | {
        stores?: AdminStore[];
      };

}


export interface AdminSubscriptionsResponse {

  success?: boolean;

  message?: string;

  subscriptions?: AdminSubscription[];

  data?:
    | AdminSubscription[]
    | {
        subscriptions?: AdminSubscription[];
      };

}


export interface AdminActionResponse {

  success?: boolean;

  message?: string;

  data?: unknown;

}


// ============================================================================
// QUERY TYPES
// ============================================================================

export interface AdminListParams {

  page?: number;

  limit?: number;

  search?: string;

  status?: string;

  role?: string;

  plan?: string;

  sort?: string;

  order?: 'asc' | 'desc';

}


// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function extractStats(
  response: AdminStatsResponse
): AdminStats {

  if (response.stats) {

    return response.stats;

  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (
      'stats' in response.data &&
      response.data.stats
    ) {

      return response.data.stats;

    }


    return response.data as AdminStats;

  }


  return {};

}


function extractUsers(
  response: AdminUsersResponse
): AdminUser[] {

  if (
    Array.isArray(response.users)
  ) {

    return response.users;

  }


  if (
    Array.isArray(response.data)
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.users)
  ) {

    return response.data.users;

  }


  return [];

}


function extractStores(
  response: AdminStoresResponse
): AdminStore[] {

  if (
    Array.isArray(response.stores)
  ) {

    return response.stores;

  }


  if (
    Array.isArray(response.data)
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.stores)
  ) {

    return response.data.stores;

  }


  return [];

}


function extractSubscriptions(
  response: AdminSubscriptionsResponse
): AdminSubscription[] {

  if (
    Array.isArray(response.subscriptions)
  ) {

    return response.subscriptions;

  }


  if (
    Array.isArray(response.data)
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.subscriptions)
  ) {

    return response.data.subscriptions;

  }


  return [];

}


// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export async function getAdminStats()
: Promise<AdminStats> {

  const response =
    await adminApi.stats<AdminStatsResponse>();


  return extractStats(
    response
  );

}


// ============================================================================
// USERS
// ============================================================================

export async function getUsers(
  params: AdminListParams = {}
): Promise<AdminUser[]> {

  const response =
    await adminApi.users<AdminUsersResponse>(
      params as Record<string, unknown>
    );


  return extractUsers(
    response
  );

}


// ============================================================================
// SINGLE USER
// ============================================================================

export async function getUser(
  userId: string
): Promise<AdminUser> {

  if (!userId) {

    throw new Error(
      'User ID is required.'
    );

  }


  const response =
    await adminApi.user<{
      success?: boolean;
      message?: string;
      user?: AdminUser;
      data?: AdminUser | { user?: AdminUser };
    }>(
      userId
    );


  const user =
    response.user ||
    (
      response.data &&
      !('user' in response.data)
        ? response.data
        : response.data?.user
    );


  if (!user) {

    throw new Error(
      'User was not returned by the server.'
    );

  }


  return user as AdminUser;

}


// ============================================================================
// UPDATE USER
// ============================================================================

export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
  }
): Promise<void> {

  if (!userId) {

    throw new Error(
      'User ID is required.'
    );

  }


  await adminApi.updateUser(
    userId,
    data as Record<string, unknown>
  );

}


// ============================================================================
// STORES
// ============================================================================

export async function getStores(
  params: AdminListParams = {}
): Promise<AdminStore[]> {

  const response =
    await adminApi.stores<AdminStoresResponse>(
      params as Record<string, unknown>
    );


  return extractStores(
    response
  );

}


// ============================================================================
// SINGLE STORE
// ============================================================================

export async function getStore(
  storeId: string
): Promise<AdminStore> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await adminApi.store<{
      success?: boolean;
      message?: string;
      store?: AdminStore;
      data?: AdminStore | { store?: AdminStore };
    }>(
      storeId
    );


  const store =
    response.store ||
    (
      response.data &&
      !('store' in response.data)
        ? response.data
        : response.data?.store
    );


  if (!store) {

    throw new Error(
      'Store was not returned by the server.'
    );

  }


  return store as AdminStore;

}


// ============================================================================
// UPDATE STORE
// ============================================================================

export async function updateStore(
  storeId: string,
  data: {
    name?: string;
    status?: string;
  }
): Promise<void> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  await adminApi.updateStore(
    storeId,
    data as Record<string, unknown>
  );

}


// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

export async function getSubscriptions(
  params: AdminListParams = {}
): Promise<AdminSubscription[]> {

  const response =
    await adminApi.subscriptions<AdminSubscriptionsResponse>(
      params as Record<string, unknown>
    );


  return extractSubscriptions(
    response
  );

}


// ============================================================================
// UPDATE SUBSCRIPTION
// ============================================================================

export async function updateSubscription(
  subscriptionId: string,
  data: {
    plan?: string;
    status?: string;
  }
): Promise<void> {

  if (!subscriptionId) {

    throw new Error(
      'Subscription ID is required.'
    );

  }


  await adminApi.updateSubscription(
    subscriptionId,
    data as Record<string, unknown>
  );

}


// ============================================================================
// SYSTEM HEALTH
// ============================================================================

export async function getSystemHealth()
: Promise<unknown> {

  return adminApi.health();

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const adminService = {

  getAdminStats,

  getUsers,

  getUser,

  updateUser,

  getStores,

  getStore,

  updateStore,

  getSubscriptions,

  updateSubscription,

  getSystemHealth

};


export default adminService;
