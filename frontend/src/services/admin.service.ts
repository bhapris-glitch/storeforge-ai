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
 * Frontend service layer for the StoreForge AI admin panel.
 *
 * IMPORTANT:
 * These methods correspond to the actual backend Admin routes:
 *
 * /api/admin/dashboard
 * /api/admin/overview
 * /api/admin/users
 * /api/admin/stores
 * /api/admin/billing
 * /api/admin/recent/*
 *
 * ============================================================================
 */

'use client';

import {
  adminApi,
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface AdminUser {

  _id?: string;

  id?: string;

  name?: string;

  email?: string;

  role?: string;

  status?: string;

  createdAt?: string;

  updatedAt?: string;

  [key: string]: unknown;
}


export interface AdminStore {

  _id?: string;

  id?: string;

  name?: string;

  shopDomain?: string;

  domain?: string;

  status?: string;

  userId?: string;

  createdAt?: string;

  updatedAt?: string;

  [key: string]: unknown;
}


export interface AdminBilling {

  _id?: string;

  userId?: string;

  storeId?: string;

  plan?: string;

  status?: string;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  currentPeriodStart?: string;

  currentPeriodEnd?: string;

  createdAt?: string;

  updatedAt?: string;

  [key: string]: unknown;
}


// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AdminDashboardResponse {

  success?: boolean;

  dashboard?: Record<string, unknown>;

  message?: string;

  [key: string]: unknown;
}


export interface AdminOverviewResponse {

  success?: boolean;

  message?: string;

  [key: string]: unknown;
}


export interface AdminUsersResponse {

  success?: boolean;

  users?: AdminUser[];

  total?: number;

  page?: number;

  limit?: number;

  pages?: number;

  message?: string;

  [key: string]: unknown;
}


export interface AdminUserResponse {

  success?: boolean;

  user?: AdminUser;

  message?: string;

  [key: string]: unknown;
}


export interface AdminStoresResponse {

  success?: boolean;

  stores?: AdminStore[];

  total?: number;

  page?: number;

  limit?: number;

  pages?: number;

  message?: string;

  [key: string]: unknown;
}


export interface AdminStoreResponse {

  success?: boolean;

  store?: AdminStore;

  message?: string;

  [key: string]: unknown;
}


export interface AdminBillingResponse {

  success?: boolean;

  billing?: AdminBilling[];

  total?: number;

  page?: number;

  limit?: number;

  pages?: number;

  message?: string;

  [key: string]: unknown;
}


export interface AdminCountsResponse {

  success?: boolean;

  counts?: Record<string, unknown>;

  message?: string;

  [key: string]: unknown;
}


// ============================================================================
// QUERY TYPES
// ============================================================================

/**
 * Query parameters shared by admin list endpoints.
 *
 * The index signature is intentional because the admin API client
 * expects Record<string, unknown>.
 */
export interface AdminListParams {

  page?: number;

  limit?: number;

  search?: string;

  status?: string;

  role?: string;

  plan?: string;

  [key: string]: unknown;
}


// ============================================================================
// DASHBOARD
// ============================================================================

export async function getDashboard() {

  const response =
    await adminApi.dashboard<
      AdminDashboardResponse
    >();

  return response;
}


// ============================================================================
// SYSTEM OVERVIEW
// ============================================================================

export async function getOverview() {

  const response =
    await adminApi.overview<
      AdminOverviewResponse
    >();

  return response;
}


// ============================================================================
// USERS
// ============================================================================

export async function getUsers(
  params: AdminListParams = {}
) {

  const response =
    await adminApi.users<
      AdminUsersResponse
    >(
      params
    );

  return response;
}


export async function getUser(
  userId: string
) {

  if (!userId?.trim()) {
    throw new Error(
      'User ID is required.'
    );
  }

  const response =
    await adminApi.user<
      AdminUserResponse
    >(
      userId
    );

  return response;
}


export async function getUserCounts() {

  const response =
    await adminApi.userCounts<
      AdminCountsResponse
    >();

  return response;
}


// ============================================================================
// USER STATUS
// ============================================================================

export async function updateUserStatus(
  userId: string,
  status: string
) {

  if (!userId?.trim()) {
    throw new Error(
      'User ID is required.'
    );
  }

  if (!status?.trim()) {
    throw new Error(
      'User status is required.'
    );
  }

  const response =
    await adminApi.updateUserStatus<
      AdminUserResponse
    >(
      userId,
      status
    );

  return response;
}


export async function activateUser(
  userId: string
) {

  if (!userId?.trim()) {
    throw new Error(
      'User ID is required.'
    );
  }

  const response =
    await adminApi.activateUser<
      AdminUserResponse
    >(
      userId
    );

  return response;
}


export async function suspendUser(
  userId: string
) {

  if (!userId?.trim()) {
    throw new Error(
      'User ID is required.'
    );
  }

  const response =
    await adminApi.suspendUser<
      AdminUserResponse
    >(
      userId
    );

  return response;
}


export async function deleteUser(
  userId: string
) {

  if (!userId?.trim()) {
    throw new Error(
      'User ID is required.'
    );
  }

  const response =
    await adminApi.deleteUser<
      AdminUserResponse
    >(
      userId
    );

  return response;
}


// ============================================================================
// STORES
// ============================================================================

export async function getStores(
  params: AdminListParams = {}
) {

  const response =
    await adminApi.stores<
      AdminStoresResponse
    >(
      params
    );

  return response;
}


export async function getStore(
  storeId: string
) {

  if (!storeId?.trim()) {
    throw new Error(
      'Store ID is required.'
    );
  }

  const response =
    await adminApi.store<
      AdminStoreResponse
    >(
      storeId
    );

  return response;
}


export async function getStoreCounts() {

  const response =
    await adminApi.storeCounts<
      AdminCountsResponse
    >();

  return response;
}


// ============================================================================
// STORE STATUS
// ============================================================================

export async function updateStoreStatus(
  storeId: string,
  status: string
) {

  if (!storeId?.trim()) {
    throw new Error(
      'Store ID is required.'
    );
  }

  if (!status?.trim()) {
    throw new Error(
      'Store status is required.'
    );
  }

  const response =
    await adminApi.updateStoreStatus<
      AdminStoreResponse
    >(
      storeId,
      status
    );

  return response;
}


// ============================================================================
// BILLING
// ============================================================================

export async function getBilling(
  params: AdminListParams = {}
) {

  const response =
    await adminApi.billing<
      AdminBillingResponse
    >(
      params
    );

  return response;
}


export async function getBillingSummary() {

  const response =
    await adminApi.billingSummary<
      Record<string, unknown>
    >();

  return response;
}


// ============================================================================
// RECENT ACTIVITY
// ============================================================================

export async function getRecentUsers(
  limit = 10
) {

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      100
    );

  const response =
    await adminApi.recentUsers<
      AdminUsersResponse
    >(
      safeLimit
    );

  return response;
}


export async function getRecentStores(
  limit = 10
) {

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      100
    );

  const response =
    await adminApi.recentStores<
      AdminStoresResponse
    >(
      safeLimit
    );

  return response;
}


// ============================================================================
// DEFAULT SERVICE
// ============================================================================

const adminService = {

  getDashboard,

  getOverview,

  getUsers,

  getUser,

  getUserCounts,

  updateUserStatus,

  activateUser,

  suspendUser,

  deleteUser,

  getStores,

  getStore,

  getStoreCounts,

  updateStoreStatus,

  getBilling,

  getBillingSummary,

  getRecentUsers,

  getRecentStores,

};


export default adminService;
