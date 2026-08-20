/**
 * ============================================================================
 * StoreForge AI
 * Billing Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/billing.service.ts
 *
 * Purpose:
 * - Fetch subscription plans
 * - Get current subscription
 * - Create Stripe checkout session
 * - Cancel subscription
 *
 * ============================================================================
 */

'use client';

import {
  billingApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface BillingPlan {

  id: string;

  name: string;

  description?: string;

  price: number;

  currency: string;

  interval?: string;

  features?: string[];

  stripePriceId?: string;

  isPopular?: boolean;

}


export interface Subscription {

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
// REQUEST TYPES
// ============================================================================

export interface CheckoutData {

  planId: string;

  storeId?: string;

  successUrl?: string;

  cancelUrl?: string;

}


export interface CancelSubscriptionData {

  reason?: string;

}


// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface PlansResponse {

  success?: boolean;

  message?: string;

  plans?: BillingPlan[];

  data?:
    | BillingPlan[]
    | {
        plans?: BillingPlan[];
      };

}


export interface SubscriptionResponse {

  success?: boolean;

  message?: string;

  subscription?: Subscription;

  data?:
    | Subscription
    | {
        subscription?: Subscription;
      };

}


export interface CheckoutResponse {

  success?: boolean;

  message?: string;

  checkoutUrl?: string;

  sessionId?: string;

  data?: {

    checkoutUrl?: string;

    sessionId?: string;

  };

}


// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function extractPlans(
  response: PlansResponse
): BillingPlan[] {

  if (
    Array.isArray(
      response.plans
    )
  ) {

    return response.plans;

  }


  if (
    response.data &&
    Array.isArray(
      response.data
    )
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.plans)
  ) {

    return response.data.plans;

  }


  return [];

}



function extractSubscription(
  response: SubscriptionResponse
): Subscription | null {

  if (
    response.subscription
  ) {

    return response.subscription;

  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (
      'subscription' in response.data &&
      response.data.subscription
    ) {

      return response.data.subscription;

    }


    if (
      'id' in response.data ||
      '_id' in response.data
    ) {

      return response.data as Subscription;

    }

  }


  return null;

}


// ============================================================================
// GET PLANS
// ============================================================================

export async function getPlans()
: Promise<BillingPlan[]> {

  const response =
    await billingApi.plans<PlansResponse>();


  return extractPlans(
    response
  );

}


// ============================================================================
// GET CURRENT SUBSCRIPTION
// ============================================================================

export async function getSubscription()
: Promise<Subscription | null> {

  const response =
    await billingApi.subscription<SubscriptionResponse>();


  return extractSubscription(
    response
  );

}


// ============================================================================
// CREATE CHECKOUT SESSION
// ============================================================================

export async function createCheckout(
  data: CheckoutData
): Promise<CheckoutResponse> {


  if (
    !data.planId
  ) {

    throw new Error(
      'Plan ID is required.'
    );

  }


  return billingApi.checkout<CheckoutResponse>(
  data as unknown as Record<string, unknown>
);

}


// ============================================================================
// REDIRECT TO STRIPE CHECKOUT
// ============================================================================

export async function startCheckout(
  data: CheckoutData
): Promise<void> {

  const response =
    await createCheckout(
      data
    );


  const checkoutUrl =
    response.checkoutUrl ||
    response.data?.checkoutUrl;


  if (!checkoutUrl) {

    throw new Error(
      'Stripe checkout URL was not generated.'
    );

  }


  window.location.href =
    checkoutUrl;

}

// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================

export async function cancelSubscription(
  data: CancelSubscriptionData = {}
): Promise<void> {

  await billingApi.cancel();

}


// ============================================================================
// SUBSCRIPTION HELPERS
// ============================================================================

export function isSubscriptionActive(
  subscription: Subscription | null
): boolean {

  if (!subscription) {

    return false;

  }


  return (
    subscription.status === 'active' ||
    subscription.status === 'trialing'
  );

}



export function isTrialSubscription(
  subscription: Subscription | null
): boolean {

  return (
    subscription?.status === 'trialing'
  );

}



export function willCancelAtEnd(
  subscription: Subscription | null
): boolean {

  return Boolean(
    subscription?.cancelAtPeriodEnd
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const billingService = {

  getPlans,

  getSubscription,

  createCheckout,

  startCheckout,

  cancelSubscription,

  isSubscriptionActive,

  isTrialSubscription,

  willCancelAtEnd

};


export default billingService;
