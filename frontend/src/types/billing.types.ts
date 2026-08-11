/**
 * ============================================================================
 * StoreForge AI
 * Billing Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/billing.types.ts
 *
 * Purpose:
 * - Shared billing/subscription types
 * - Pricing plans
 * - Subscription state
 * - Billing history/invoices
 * - Checkout requests/responses
 * - Enterprise sales request types
 *
 * IMPORTANT:
 * - Frontend never receives Stripe secret keys.
 * - Frontend never creates Stripe subscriptions directly.
 * - Backend is the source of truth for billing status.
 * - Currency for the current billing system is USD.
 *
 * ============================================================================
 */


// ============================================================================
// BILLING CURRENCY
// ============================================================================

export type BillingCurrency = 'USD';


// ============================================================================
// BILLING INTERVAL
// ============================================================================

export type BillingInterval =
  | 'month'
  | 'year';


// ============================================================================
// PLAN ID
// ============================================================================

export type BillingPlanId =
  | 'starter'
  | 'growth'
  | 'premium'
  | 'enterprise';


// ============================================================================
// PLAN STATUS
// ============================================================================

export type BillingPlanStatus =
  | 'active'
  | 'inactive';


// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'incomplete'
  | 'incomplete_expired';


// ============================================================================
// INVOICE STATUS
// ============================================================================

export type InvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'void'
  | 'uncollectible'
  | 'failed';


// ============================================================================
// BILLING PLAN
// ============================================================================

export interface BillingPlan {

  id: BillingPlanId;

  name: string;

  description?: string;

  price: number;

  currency: BillingCurrency;

  interval?: BillingInterval;

  status?: BillingPlanStatus;

  features: string[];

  highlighted?: boolean;

  contactSales?: boolean;

  stripePriceId?: string;

}


// ============================================================================
// DEFAULT PRICING PLANS
// ============================================================================

export const BILLING_PLANS: readonly BillingPlan[] = [

  {

    id: 'starter',

    name: 'Starter',

    description:
      'Essential tools to start building your store.',

    price: 25,

    currency: 'USD',

    interval: 'month',

    status: 'active',

    features: [],

    highlighted: false,

    contactSales: false

  },

  {

    id: 'growth',

    name: 'Growth',

    description:
      'Advanced tools for growing businesses.',

    price: 59,

    currency: 'USD',

    interval: 'month',

    status: 'active',

    features: [],

    highlighted: true,

    contactSales: false

  },

  {

    id: 'premium',

    name: 'Premium',

    description:
      'Complete AI-powered store creation experience.',

    price: 149,

    currency: 'USD',

    interval: 'month',

    status: 'active',

    features: [],

    highlighted: false,

    contactSales: false

  },

  {

    id: 'enterprise',

    name: 'Enterprise',

    description:
      'Custom solutions for larger businesses.',

    price: 0,

    currency: 'USD',

    status: 'active',

    features: [],

    highlighted: false,

    contactSales: true

  }

] as const;


// ============================================================================
// SUBSCRIPTION
// ============================================================================

export interface Subscription {

  id: string;

  userId?: string;

  storeId?: string;

  planId: BillingPlanId;

  planName?: string;

  status: SubscriptionStatus;

  currency: BillingCurrency;

  amount?: number;

  interval?: BillingInterval;

  currentPeriodStart?: string;

  currentPeriodEnd?: string;

  trialStart?: string | null;

  trialEnd?: string | null;

  cancelAtPeriodEnd?: boolean;

  cancelledAt?: string | null;

  endedAt?: string | null;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// BILLING HISTORY ITEM / INVOICE
// ============================================================================

export interface BillingHistoryItem {

  id: string;

  invoiceId?: string;

  subscriptionId?: string;

  planId?: BillingPlanId;

  planName?: string;

  amount: number;

  currency: BillingCurrency;

  status: InvoiceStatus;

  invoiceNumber?: string;

  invoiceUrl?: string | null;

  receiptUrl?: string | null;

  description?: string;

  periodStart?: string;

  periodEnd?: string;

  paidAt?: string | null;

  dueDate?: string | null;

  createdAt?: string;

}


// ============================================================================
// BILLING HISTORY QUERY
// ============================================================================

export interface BillingHistoryQuery {

  page?: number;

  limit?: number;

  status?: InvoiceStatus;

  startDate?: string;

  endDate?: string;

}


// ============================================================================
// BILLING PAGINATION
// ============================================================================

export interface BillingPagination {

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

}


// ============================================================================
// BILLING HISTORY RESPONSE
// ============================================================================

export interface BillingHistoryResponse {

  invoices: BillingHistoryItem[];

  pagination?: BillingPagination;

  message?: string;

}


// ============================================================================
// SUBSCRIPTION RESPONSE
// ============================================================================

export interface SubscriptionResponse {

  subscription: Subscription | null;

  message?: string;

}


// ============================================================================
// PLANS RESPONSE
// ============================================================================

export interface BillingPlansResponse {

  plans: BillingPlan[];

  currency: BillingCurrency;

  message?: string;

}


// ============================================================================
// CHECKOUT REQUEST
// ============================================================================

export interface CreateCheckoutRequest {

  planId: Exclude<
    BillingPlanId,
    'enterprise'
  >;

  interval?: BillingInterval;

  successUrl?: string;

  cancelUrl?: string;

}


// ============================================================================
// CHECKOUT RESPONSE
// ============================================================================

export interface CreateCheckoutResponse {

  checkoutUrl: string;

  sessionId?: string;

  message?: string;

}


// ============================================================================
// CHANGE PLAN REQUEST
// ============================================================================

export interface ChangePlanRequest {

  planId: Exclude<
    BillingPlanId,
    'enterprise'
  >;

  interval?: BillingInterval;

}


// ============================================================================
// CHANGE PLAN RESPONSE
// ============================================================================

export interface ChangePlanResponse {

  subscription: Subscription;

  message?: string;

}


// ============================================================================
// CANCEL SUBSCRIPTION REQUEST
// ============================================================================

export interface CancelSubscriptionRequest {

  immediately?: boolean;

  reason?: string;

}


// ============================================================================
// CANCEL SUBSCRIPTION RESPONSE
// ============================================================================

export interface CancelSubscriptionResponse {

  subscription: Subscription;

  message?: string;

}


// ============================================================================
// RESUME SUBSCRIPTION RESPONSE
// ============================================================================

export interface ResumeSubscriptionResponse {

  subscription: Subscription;

  message?: string;

}


// ============================================================================
// ENTERPRISE SALES REQUEST
// ============================================================================

export interface EnterpriseSalesRequest {

  name: string;

  email: string;

  company?: string;

  phone?: string;

  website?: string;

  teamSize?: string;

  message?: string;

}


// ============================================================================
// ENTERPRISE SALES RESPONSE
// ============================================================================

export interface EnterpriseSalesResponse {

  success: boolean;

  message: string;

}


// ============================================================================
// BILLING STATE
// ============================================================================

export interface BillingState {

  plans: BillingPlan[];

  subscription: Subscription | null;

  invoices: BillingHistoryItem[];

  selectedPlan: BillingPlan | null;

  isCheckoutLoading: boolean;

  isLoading: boolean;

  isLoaded: boolean;

  error: string | null;

}
