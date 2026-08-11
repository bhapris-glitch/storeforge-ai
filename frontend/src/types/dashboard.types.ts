/**
 * ============================================================================
 * StoreForge AI
 * Dashboard Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/dashboard.types.ts
 *
 * Purpose:
 * - Shared dashboard types
 * - Dashboard metrics
 * - Analytics summaries
 * - Recent activity
 * - AI generation task status
 * - Dashboard API responses
 *
 * IMPORTANT:
 * - Dashboard data is scoped to the authenticated user/store.
 * - No chatbot/customer-conversation types belong here.
 * - Backend remains the source of truth for analytics and task status.
 *
 * ============================================================================
 */


// ============================================================================
// DASHBOARD DATE RANGE
// ============================================================================

export type DashboardDateRange =
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | '12m'
  | 'custom';


// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface DashboardMetrics {

  totalStores: number;

  activeStores: number;

  totalProducts: number;

  publishedProducts: number;

  totalThemes: number;

  publishedThemes: number;

  totalOrders?: number;

  totalRevenue?: number;

  currency?: string;

  revenueChange?: number;

  productChange?: number;

  storeChange?: number;

  orderChange?: number;

  lastUpdatedAt?: string;

}


// ============================================================================
// ANALYTICS DATA POINT
// ============================================================================

export interface AnalyticsDataPoint {

  date: string;

  value: number;

  label?: string;

}


// ============================================================================
// REVENUE ANALYTICS
// ============================================================================

export interface RevenueAnalytics {

  currency: string;

  total: number;

  previousTotal?: number;

  percentageChange?: number;

  data: AnalyticsDataPoint[];

}


// ============================================================================
// PRODUCT ANALYTICS
// ============================================================================

export interface ProductAnalytics {

  total: number;

  active: number;

  draft: number;

  archived: number;

  data?: AnalyticsDataPoint[];

}


// ============================================================================
// STORE ANALYTICS
// ============================================================================

export interface StoreAnalytics {

  total: number;

  active: number;

  disconnected: number;

  pending: number;

  data?: AnalyticsDataPoint[];

}


// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================

export interface DashboardAnalytics {

  range: DashboardDateRange;

  revenue?: RevenueAnalytics;

  products?: ProductAnalytics;

  stores?: StoreAnalytics;

  updatedAt?: string;

}


// ============================================================================
// ACTIVITY TYPE
// ============================================================================

export type DashboardActivityType =

  | 'store_created'
  | 'store_connected'
  | 'store_disconnected'
  | 'product_created'
  | 'product_updated'
  | 'product_published'
  | 'theme_created'
  | 'theme_updated'
  | 'theme_published'
  | 'branding_generated'
  | 'product_ai_generated'
  | 'theme_ai_generated'
  | 'billing_started'
  | 'billing_updated'
  | 'billing_cancelled'
  | 'deployment_started'
  | 'deployment_completed'
  | 'deployment_failed'
  | 'system';


// ============================================================================
// ACTIVITY STATUS
// ============================================================================

export type DashboardActivityStatus =

  | 'success'
  | 'info'
  | 'warning'
  | 'error';


// ============================================================================
// DASHBOARD ACTIVITY
// ============================================================================

export interface DashboardActivity {

  id: string;

  type: DashboardActivityType;

  status?: DashboardActivityStatus;

  title: string;

  description?: string;

  storeId?: string;

  storeName?: string;

  resourceId?: string;

  resourceType?:
    | 'store'
    | 'product'
    | 'theme'
    | 'branding'
    | 'billing'
    | 'deployment'
    | 'system';

  createdAt: string;

}


// ============================================================================
// AI TASK TYPE
// ============================================================================

export type AITaskType =

  | 'product_generation'
  | 'theme_generation'
  | 'branding_generation'
  | 'seo_generation'
  | 'content_generation';


// ============================================================================
// AI TASK STATUS
// ============================================================================

export type AITaskExecutionStatus =

  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';


// ============================================================================
// AI TASK STATUS
// ============================================================================

export interface AITaskStatus {

  id: string;

  type: AITaskType;

  status: AITaskExecutionStatus;

  storeId?: string;

  resourceId?: string;

  progress?: number;

  message?: string;

  result?: Record<string, unknown> | null;

  error?: string | null;

  startedAt?: string;

  completedAt?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// DASHBOARD SUMMARY
// ============================================================================

export interface DashboardSummary {

  metrics: DashboardMetrics;

  analytics?: DashboardAnalytics;

  activities: DashboardActivity[];

  aiTasks: AITaskStatus[];

}


// ============================================================================
// DASHBOARD QUERY
// ============================================================================

export interface DashboardQuery {

  storeId?: string;

  range?: DashboardDateRange;

  startDate?: string;

  endDate?: string;

  activityLimit?: number;

  taskLimit?: number;

}


// ============================================================================
// DASHBOARD RESPONSE
// ============================================================================

export interface DashboardResponse {

  dashboard: DashboardSummary;

  message?: string;

}


// ============================================================================
// METRICS RESPONSE
// ============================================================================

export interface DashboardMetricsResponse {

  metrics: DashboardMetrics;

  message?: string;

}


// ============================================================================
// ANALYTICS RESPONSE
// ============================================================================

export interface DashboardAnalyticsResponse {

  analytics: DashboardAnalytics;

  message?: string;

}


// ============================================================================
// ACTIVITY RESPONSE
// ============================================================================

export interface DashboardActivityResponse {

  activities: DashboardActivity[];

  message?: string;

}


// ============================================================================
// AI TASK RESPONSE
// ============================================================================

export interface AITaskResponse {

  task: AITaskStatus;

  message?: string;

}


// ============================================================================
// AI TASKS RESPONSE
// ============================================================================

export interface AITasksResponse {

  tasks: AITaskStatus[];

  message?: string;

}


// ============================================================================
// DASHBOARD STATE
// ============================================================================

export interface DashboardState {

  metrics: DashboardMetrics | null;

  analytics: DashboardAnalytics | null;

  activities: DashboardActivity[];

  aiTasks: AITaskStatus[];

  isLoading: boolean;

  isLoaded: boolean;

  isRefreshing: boolean;

  error: string | null;

}
