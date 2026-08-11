/**
 * ============================================================================
 * StoreForge AI
 * useBilling Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useBilling.ts
 *
 * Purpose:
 * - Provide a clean React interface for billing state
 * - Manage subscription information
 * - Manage available pricing plans
 * - Manage billing history
 * - Manage checkout UI state
 *
 * IMPORTANT:
 * - This hook does not process payments.
 * - Stripe/payment operations belong in billing.service.ts.
 * - Backend remains the source of truth for subscription status.
 * - Never place Stripe secret keys or payment secrets in frontend code.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useBillingStore
} from '@/store';

import type {
  BillingPlan,
  Subscription,
  BillingHistoryItem
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useBilling() {


  // ==========================================================================
  // STATE
  // ==========================================================================

  const plans =
    useBillingStore(
      (state) => state.plans
    );


  const subscription =
    useBillingStore(
      (state) => state.subscription
    );


  const invoices =
    useBillingStore(
      (state) => state.invoices
    );


  const selectedPlan =
    useBillingStore(
      (state) => state.selectedPlan
    );


  const isCheckoutLoading =
    useBillingStore(
      (state) => state.isCheckoutLoading
    );


  const isLoading =
    useBillingStore(
      (state) => state.isLoading
    );


  const isLoaded =
    useBillingStore(
      (state) => state.isLoaded
    );


  const error =
    useBillingStore(
      (state) => state.error
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setPlans =
    useBillingStore(
      (state) => state.setPlans
    );


  const setSubscription =
    useBillingStore(
      (state) => state.setSubscription
    );


  const updateSubscription =
    useBillingStore(
      (state) => state.updateSubscription
    );


  const setInvoices =
    useBillingStore(
      (state) => state.setInvoices
    );


  const addInvoice =
    useBillingStore(
      (state) => state.addInvoice
    );


  const selectPlan =
    useBillingStore(
      (state) => state.selectPlan
    );


  const setLoading =
    useBillingStore(
      (state) => state.setLoading
    );


  const setCheckoutLoading =
    useBillingStore(
      (state) => state.setCheckoutLoading
    );


  const setLoaded =
    useBillingStore(
      (state) => state.setLoaded
    );


  const setError =
    useBillingStore(
      (state) => state.setError
    );


  const clearError =
    useBillingStore(
      (state) => state.clearError
    );


  const reset =
    useBillingStore(
      (state) => state.reset
    );


  // ==========================================================================
  // PLAN ACTIONS
  // ==========================================================================

  const handleSetPlans =
    useCallback(
      (
        value: BillingPlan[]
      ) => {

        setPlans(value);

      },
      [setPlans]
    );


  const handleSelectPlan =
    useCallback(
      (
        plan: BillingPlan | null
      ) => {

        selectPlan(plan);

      },
      [selectPlan]
    );


  // ==========================================================================
  // SUBSCRIPTION ACTIONS
  // ==========================================================================

  const handleSetSubscription =
    useCallback(
      (
        value: Subscription | null
      ) => {

        setSubscription(value);

      },
      [setSubscription]
    );


  const handleUpdateSubscription =
    useCallback(
      (
        updates: Partial<Subscription>
      ) => {

        updateSubscription(updates);

      },
      [updateSubscription]
    );


  // ==========================================================================
  // BILLING HISTORY
  // ==========================================================================

  const handleSetInvoices =
    useCallback(
      (
        value: BillingHistoryItem[]
      ) => {

        setInvoices(value);

      },
      [setInvoices]
    );


  const handleAddInvoice =
    useCallback(
      (
        invoice: BillingHistoryItem
      ) => {

        addInvoice(invoice);

      },
      [addInvoice]
    );


  // ==========================================================================
  // ERROR / RESET
  // ==========================================================================

  const handleClearError =
    useCallback(
      () => {

        clearError();

      },
      [clearError]
    );


  const handleReset =
    useCallback(
      () => {

        reset();

      },
      [reset]
    );


  // ==========================================================================
  // DERIVED BILLING STATE
  // ==========================================================================

  const isSubscribed =
    subscription?.status === 'active' ||
    subscription?.status === 'trialing';


  const isTrialing =
    subscription?.status === 'trialing';


  const isActive =
    subscription?.status === 'active';


  const isPastDue =
    subscription?.status === 'past_due';


  const isCancelled =
    subscription?.status === 'cancelled';


  const isExpired =
    subscription?.status === 'expired';


  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {


    // ------------------------------------------------------------------------
    // Plans
    // ------------------------------------------------------------------------

    plans,

    selectedPlan,


    // ------------------------------------------------------------------------
    // Subscription
    // ------------------------------------------------------------------------

    subscription,


    // Convenient aliases for UI
    currentPlan:
      subscription?.planName || null,

    subscriptionStatus:
      subscription?.status || null,


    // ------------------------------------------------------------------------
    // Billing history
    // ------------------------------------------------------------------------

    invoices,

    billingHistory:
      invoices,


    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    isLoading,

    isLoaded,

    isCheckoutLoading,

    error,


    // ------------------------------------------------------------------------
    // Derived state
    // ------------------------------------------------------------------------

    isSubscribed,

    isTrialing,

    isActive,

    isPastDue,

    isCancelled,

    isExpired,


    // ------------------------------------------------------------------------
    // Plan actions
    // ------------------------------------------------------------------------

    setPlans:
      handleSetPlans,

    selectPlan:
      handleSelectPlan,


    // ------------------------------------------------------------------------
    // Subscription actions
    // ------------------------------------------------------------------------

    setSubscription:
      handleSetSubscription,

    updateSubscription:
      handleUpdateSubscription,


    // ------------------------------------------------------------------------
    // Invoice actions
    // ------------------------------------------------------------------------

    setInvoices:
      handleSetInvoices,

    addInvoice:
      handleAddInvoice,


    // ------------------------------------------------------------------------
    // Loading
    // ------------------------------------------------------------------------

    setLoading,

    setCheckoutLoading,

    setLoaded,


    // ------------------------------------------------------------------------
    // Error / reset
    // ------------------------------------------------------------------------

    setError,

    clearError:
      handleClearError,

    reset:
      handleReset

  };

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useBilling;
