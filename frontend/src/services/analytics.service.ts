/**
 * ============================================================================
 * StoreForge AI
 * Analytics Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/analytics.service.ts
 *
 * Purpose:
 * - Fetch dashboard analytics
 * - Fetch store analytics
 * - Fetch product-generation analytics
 * - Fetch theme-generation analytics
 * - Fetch deployment analytics
 * - Fetch revenue/usage statistics
 *
 * NOT FOR:
 * - Chatbot analytics
 * - Customer conversations
 * - Sales-agent analytics
 *
 * ============================================================================
 */

'use client';

import {
  analyticsApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface AnalyticsPeriod {
  startDate?: string;
  endDate?: string;
  period?: string;
}


export interface AnalyticsSummary {

  totalStores?: number;

  activeStores?: number;

  connectedStores?: number;

  totalProducts?: number;

  generatedProducts?: number;

  totalThemes?: number;

  generatedThemes?: number;

  totalDeployments?: number;

  successfulDeployments?: number;

  failedDeployments?: number;

  totalRevenue?: number;

  currency?: string;

  usage?: number;

}


export interface AnalyticsPoint {

  date: string;

  value: number;

  label?: string;

}


export interface AnalyticsData {

  summary?: AnalyticsSummary;

  stores?: AnalyticsPoint[];

  products?: AnalyticsPoint[];

  themes?: AnalyticsPoint[];

  deployments?: AnalyticsPoint[];

  revenue?: AnalyticsPoint[];

  usage?: AnalyticsPoint[];

}


export interface AnalyticsResponse {

  success?: boolean;

  message?: string;

  analytics?: AnalyticsData;

  data?: AnalyticsData;

}


// ============================================================================
// RESPONSE HELPER
// ============================================================================

function extractAnalytics(
  response: AnalyticsResponse
): AnalyticsData {

  if (response.analytics) {

    return response.analytics;

  }


  if (response.data) {

    return response.data;

  }


  return {};

}


// ============================================================================
// GET DASHBOARD ANALYTICS
// ============================================================================

export async function getDashboardAnalytics(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  const response =
    await analyticsApi.dashboard<AnalyticsResponse>(
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// GET STORE ANALYTICS
// ============================================================================

export async function getStoreAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await analyticsApi.store<AnalyticsResponse>(
      storeId,
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// GET PRODUCT ANALYTICS
// ============================================================================

export async function getProductAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await analyticsApi.products<AnalyticsResponse>(
      storeId,
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// GET THEME ANALYTICS
// ============================================================================

export async function getThemeAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await analyticsApi.themes<AnalyticsResponse>(
      storeId,
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// GET DEPLOYMENT ANALYTICS
// ============================================================================

export async function getDeploymentAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await analyticsApi.deployments<AnalyticsResponse>(
      storeId,
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// GET REVENUE ANALYTICS
// ============================================================================

export async function getRevenueAnalytics(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  const response =
    await analyticsApi.revenue<AnalyticsResponse>(
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// GET USAGE ANALYTICS
// ============================================================================

export async function getUsageAnalytics(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsData> {

  const response =
    await analyticsApi.usage<AnalyticsResponse>(
      params as Record<string, unknown>
    );


  return extractAnalytics(
    response
  );

}


// ============================================================================
// DATE RANGE HELPERS
// ============================================================================

export function getDateRange(
  period: string
): AnalyticsPeriod {

  return {
    period
  };

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const analyticsService = {

  getDashboardAnalytics,

  getStoreAnalytics,

  getProductAnalytics,

  getThemeAnalytics,

  getDeploymentAnalytics,

  getRevenueAnalytics,

  getUsageAnalytics,

  getDateRange

};


export default analyticsService;
