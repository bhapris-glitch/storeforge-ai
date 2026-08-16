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
 * - Fetch analytics summary
 * - Fetch daily analytics
 * - Fetch event/category analytics
 * - Fetch store analytics
 * - Fetch recent analytics events
 * - Record analytics events
 * - Record AI usage
 *
 * Backend source:
 * backend/src/modules/analytics/
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
  storeId?: string;
}


export interface AnalyticsSummary {

  totalEvents?: number;

  aiRequests?: number;

  aiTokens?: number;

  totalRevenue?: number;

  conversions?: number;

  deployments?: number;

  products?: number;

  themes?: number;

  stores?: number;

}


export interface DailyAnalyticsPoint {

  _id?: {
    year?: number;
    month?: number;
    day?: number;
  };

  events?: number;

  aiRequests?: number;

  aiTokens?: number;

  revenue?: number;

  conversions?: number;

}


export interface EventCount {

  _id?: string;

  count?: number;

}


export interface CategoryAnalytics {

  _id?: string;

  count?: number;

  aiRequests?: number;

  aiTokens?: number;

  revenue?: number;

  conversions?: number;

}


export interface AnalyticsEvent {

  _id?: string;

  userId?: string;

  storeId?: string | null;

  eventType?: string;

  category?: string;

  action?: string | null;

  entityType?: string | null;

  entityId?: string | null;

  usage?: {

    aiTokens?: number;

    aiRequests?: number;

    processingTime?: number;

  };

  revenue?: {

    amount?: number;

    currency?: string;

  };

  conversion?: boolean;

  source?: string | null;

  device?: string | null;

  createdAt?: string;

  updatedAt?: string;

  metadata?: Record<string, unknown>;

}


// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AnalyticsSummaryResponse {

  success?: boolean;

  summary?: AnalyticsSummary;

  message?: string;

}


export interface DailyAnalyticsResponse {

  success?: boolean;

  analytics?: DailyAnalyticsPoint[];

  message?: string;

}


export interface EventCountsResponse {

  success?: boolean;

  counts?: EventCount[];

  message?: string;

}


export interface CategoryAnalyticsResponse {

  success?: boolean;

  categories?: CategoryAnalytics[];

  message?: string;

}


export interface RecentAnalyticsResponse {

  success?: boolean;

  events?: AnalyticsEvent[];

  message?: string;

}


export interface StoreAnalyticsResponse {

  success?: boolean;

  storeId?: string;

  summary?: AnalyticsSummary;

  daily?: DailyAnalyticsPoint[];

  categories?: CategoryAnalytics[];

  recent?: AnalyticsEvent[];

  message?: string;

}


export interface RecordAnalyticsResponse {

  success?: boolean;

  event?: AnalyticsEvent;

  message?: string;

}


// ============================================================================
// QUERY HELPER
// ============================================================================

function buildParams(
  params: AnalyticsPeriod = {}
): Record<string, unknown> {

  const result: Record<string, unknown> = {};

  if (params.startDate) {
    result.startDate =
      params.startDate;
  }

  if (params.endDate) {
    result.endDate =
      params.endDate;
  }

  if (params.storeId) {
    result.storeId =
      params.storeId;
  }

  return result;
}


// ============================================================================
// GET ANALYTICS SUMMARY
// ============================================================================

export async function getAnalyticsSummary(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsSummary> {

  const response =
    await analyticsApi.summary<AnalyticsSummaryResponse>(
      buildParams(params)
    );

  return (
    response.summary || {
      totalEvents: 0,
      aiRequests: 0,
      aiTokens: 0,
      totalRevenue: 0,
      conversions: 0,
      deployments: 0,
      products: 0,
      themes: 0,
      stores: 0,
    }
  );
}


// ============================================================================
// GET DAILY ANALYTICS
// ============================================================================

export async function getDailyAnalytics(
  params: AnalyticsPeriod = {}
): Promise<DailyAnalyticsPoint[]> {

  const response =
    await analyticsApi.daily<DailyAnalyticsResponse>(
      buildParams(params)
    );

  return (
    response.analytics || []
  );
}


// ============================================================================
// GET EVENT COUNTS
// ============================================================================

export async function getEventCounts(
  params: AnalyticsPeriod = {}
): Promise<EventCount[]> {

  const response =
    await analyticsApi.events<EventCountsResponse>(
      buildParams(params)
    );

  return (
    response.counts || []
  );
}


// ============================================================================
// GET CATEGORY ANALYTICS
// ============================================================================

export async function getCategoryAnalytics(
  params: AnalyticsPeriod = {}
): Promise<CategoryAnalytics[]> {

  const response =
    await analyticsApi.categories<CategoryAnalyticsResponse>(
      buildParams(params)
    );

  return (
    response.categories || []
  );
}


// ============================================================================
// GET RECENT ANALYTICS EVENTS
// ============================================================================

export async function getRecentAnalytics(
  params: AnalyticsPeriod & {
    limit?: number;
  } = {}
): Promise<AnalyticsEvent[]> {

  const query: Record<string, unknown> =
    buildParams(params);

  if (params.limit) {
    query.limit =
      params.limit;
  }

  const response =
    await analyticsApi.recent<RecentAnalyticsResponse>(
      query
    );

  return (
    response.events || []
  );
}


// ============================================================================
// GET STORE ANALYTICS
// ============================================================================

export async function getStoreAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<StoreAnalyticsResponse> {

  if (!storeId) {
    throw new Error(
      'Store ID is required.'
    );
  }

  const response =
    await analyticsApi.store<StoreAnalyticsResponse>(
      storeId,
      buildParams(params)
    );

  return {
    success:
      response.success,

    storeId:
      response.storeId ||
      storeId,

    summary:
      response.summary || {
        totalEvents: 0,
        aiRequests: 0,
        aiTokens: 0,
        totalRevenue: 0,
        conversions: 0,
        deployments: 0,
        products: 0,
        themes: 0,
        stores: 0,
      },

    daily:
      response.daily || [],

    categories:
      response.categories || [],

    recent:
      response.recent || [],
  };
}


// ============================================================================
// GET STORE SUMMARY
// ============================================================================

export async function getStoreSummary(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<AnalyticsSummary> {

  const result =
    await getStoreAnalytics(
      storeId,
      params
    );

  return (
    result.summary || {}
  );
}


// ============================================================================
// GET STORE DAILY ANALYTICS
// ============================================================================

export async function getStoreDailyAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<DailyAnalyticsPoint[]> {

  const result =
    await getStoreAnalytics(
      storeId,
      params
    );

  return (
    result.daily || []
  );
}


// ============================================================================
// GET STORE CATEGORY ANALYTICS
// ============================================================================

export async function getStoreCategoryAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<CategoryAnalytics[]> {

  const result =
    await getStoreAnalytics(
      storeId,
      params
    );

  return (
    result.categories || []
  );
}


// ============================================================================
// GET STORE RECENT EVENTS
// ============================================================================

export async function getStoreRecentAnalytics(
  storeId: string,
  limit = 20
): Promise<AnalyticsEvent[]> {

  const result =
    await getStoreAnalytics(
      storeId,
      {
        limit,
      } as AnalyticsPeriod
    );

  return (
    result.recent || []
  );
}


// ============================================================================
// RECORD GENERIC EVENT
// ============================================================================

export async function recordEvent(
  data: Record<string, unknown>
): Promise<AnalyticsEvent | undefined> {

  const response =
    await analyticsApi.recordEvent<RecordAnalyticsResponse>(
      data
    );

  return response.event;
}


// ============================================================================
// RECORD AI USAGE
// ============================================================================

export async function recordAIUsage(
  data: {
    storeId?: string;
    eventType?: string;
    tokens?: number;
    processingTime?: number;
    metadata?: Record<string, unknown>;
  }
): Promise<AnalyticsEvent | undefined> {

  const response =
    await analyticsApi.recordAIUsage<RecordAnalyticsResponse>(
      data
    );

  return response.event;
}


// ============================================================================
// CONVENIENCE EVENT HELPERS
// ============================================================================

export async function recordStoreEvent(
  data: {
    storeId?: string;
    eventType: string;
    action?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AnalyticsEvent | undefined> {

  return recordEvent({
    ...data,

    category:
      'store',
  });
}


export async function recordProductEvent(
  data: {
    storeId?: string;
    eventType: string;
    action?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AnalyticsEvent | undefined> {

  return recordEvent({
    ...data,

    category:
      'product',

    entityType:
      'product',
  });
}


export async function recordThemeEvent(
  data: {
    storeId?: string;
    eventType: string;
    action?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AnalyticsEvent | undefined> {

  return recordEvent({
    ...data,

    category:
      'theme',

    entityType:
      'theme',
  });
}


export async function recordDeploymentEvent(
  data: {
    storeId?: string;
    eventType: string;
    action?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AnalyticsEvent | undefined> {

  return recordEvent({
    ...data,

    category:
      'deployment',

    entityType:
      'deployment',
  });
}


export async function recordBillingEvent(
  data: {
    storeId?: string;
    eventType: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AnalyticsEvent | undefined> {

  return recordEvent({
    ...data,

    category:
      'billing',

    revenue: {
      amount:
        Number(data.amount || 0),

      currency:
        data.currency || 'usd',
    },

    conversion:
      data.eventType ===
        'subscription.created' ||
      data.eventType ===
        'payment.succeeded',
  });
}


// ============================================================================
// DATE RANGE HELPER
// ============================================================================

export function getDateRange(
  period: string
): AnalyticsPeriod {

  const now =
    new Date();

  const endDate =
    now.toISOString();

  const start =
    new Date(now);

  switch (period) {

    case 'today':
      start.setHours(
        0,
        0,
        0,
        0
      );
      break;


    case '7d':
    case '7days':
      start.setDate(
        start.getDate() - 7
      );
      break;


    case '30d':
    case '30days':
      start.setDate(
        start.getDate() - 30
      );
      break;


    case '90d':
    case '90days':
      start.setDate(
        start.getDate() - 90
      );
      break;


    case 'year':
    case '1y':
      start.setFullYear(
        start.getFullYear() - 1
      );
      break;


    default:
      return {
        period,
      };
  }

  return {
    startDate:
      start.toISOString(),

    endDate,
  };
}


// ============================================================================
// BACKWARD-COMPATIBLE SERVICE METHODS
// ============================================================================
//
// These names keep existing components/hooks from immediately breaking while
// using the real backend analytics endpoints.
// ============================================================================

export async function getDashboardAnalytics(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsSummary> {

  return getAnalyticsSummary(
    params
  );
}


export async function getProductAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<CategoryAnalytics[]> {

  const categories =
    await getStoreCategoryAnalytics(
      storeId,
      params
    );

  return categories.filter(
    (item) =>
      item._id === 'product'
  );
}


export async function getThemeAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<CategoryAnalytics[]> {

  const categories =
    await getStoreCategoryAnalytics(
      storeId,
      params
    );

  return categories.filter(
    (item) =>
      item._id === 'theme'
  );
}


export async function getDeploymentAnalytics(
  storeId: string,
  params: AnalyticsPeriod = {}
): Promise<CategoryAnalytics[]> {

  const categories =
    await getStoreCategoryAnalytics(
      storeId,
      params
    );

  return categories.filter(
    (item) =>
      item._id === 'deployment'
  );
}


export async function getRevenueAnalytics(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsPoint[]> {

  const daily =
    await getDailyAnalytics(
      params
    );

  return daily.map(
    (item) => ({
      date:
        item._id
          ? `${item._id.year || 0}-${String(
              item._id.month || 0
            ).padStart(2, '0')}-${String(
              item._id.day || 0
            ).padStart(2, '0')}`
          : '',

      value:
        Number(item.revenue || 0),

      label:
        'Revenue',
    })
  );
}


export async function getUsageAnalytics(
  params: AnalyticsPeriod = {}
): Promise<AnalyticsPoint[]> {

  const daily =
    await getDailyAnalytics(
      params
    );

  return daily.map(
    (item) => ({
      date:
        item._id
          ? `${item._id.year || 0}-${String(
              item._id.month || 0
            ).padStart(2, '0')}-${String(
              item._id.day || 0
            ).padStart(2, '0')}`

          : '',

      value:
        Number(
          item.aiRequests || 0
        ),

      label:
        'AI Requests',
    })
  );
}


// ============================================================================
// LOCAL ANALYTICS POINT TYPE
// ============================================================================

export interface AnalyticsPoint {

  date: string;

  value: number;

  label?: string;

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const analyticsService = {

  getAnalyticsSummary,

  getDailyAnalytics,

  getEventCounts,

  getCategoryAnalytics,

  getRecentAnalytics,

  getStoreAnalytics,

  getStoreSummary,

  getStoreDailyAnalytics,

  getStoreCategoryAnalytics,

  getStoreRecentAnalytics,

  recordEvent,

  recordAIUsage,

  recordStoreEvent,

  recordProductEvent,

  recordThemeEvent,

  recordDeploymentEvent,

  recordBillingEvent,

  getDashboardAnalytics,

  getProductAnalytics,

  getThemeAnalytics,

  getDeploymentAnalytics,

  getRevenueAnalytics,

  getUsageAnalytics,

  getDateRange,

};


export default analyticsService;
