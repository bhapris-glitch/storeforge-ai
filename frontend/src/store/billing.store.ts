/**
 * ============================================================================
 * StoreForge AI
 * Billing Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/billing.store.ts
 *
 * Purpose:
 * - Manage SaaS subscription state
 * - Manage pricing plans
 * - Manage checkout state
 * - Manage billing history state
 *
 * Backend handles:
 * - Stripe
 * - Payments
 * - Webhooks
 * - Subscription verification
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// TYPES
// ============================================================================

export type SubscriptionStatus =

  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'inactive';



export interface BillingPlan {

  id: string;

  name: string;

  price: number;

  currency: string;

  interval?: 'month' | 'year';

  description?: string;

  features?: string[];

  stripePriceId?: string;

  popular?: boolean;

}



export interface Subscription {

  id: string;

  planId?: string;

  planName?: string;

  status: SubscriptionStatus;

  price?: number;

  currency?: string;

  interval?: string;

  startDate?: string;

  endDate?: string;

  trialEndsAt?: string;

  cancelAtPeriodEnd?: boolean;

  createdAt?: string;

}



export interface BillingHistoryItem {

  id: string;

  amount: number;

  currency: string;

  status?: string;

  date?: string;

  invoiceUrl?: string;

}


// ============================================================================
// STORE STATE
// ============================================================================

interface BillingState {


  /**
   * Available SaaS plans.
   */
  plans: BillingPlan[];


  /**
   * Current user subscription.
   */
  subscription: Subscription | null;


  /**
   * Billing history.
   */
  invoices: BillingHistoryItem[];


  /**
   * Selected plan during checkout.
   */
  selectedPlan: BillingPlan | null;


  /**
   * Checkout loading state.
   */
  isCheckoutLoading: boolean;


  /**
   * Billing data loading.
   */
  isLoading: boolean;


  /**
   * Whether billing data loaded.
   */
  isLoaded: boolean;


  /**
   * Error state.
   */
  error: string | null;



  // --------------------------------------------------------------------------
  // Plans
  // --------------------------------------------------------------------------


  setPlans: (

    plans: BillingPlan[]

  ) => void;



  setSubscription: (

    subscription: Subscription | null

  ) => void;



  updateSubscription: (

    updates: Partial<Subscription>

  ) => void;



  setInvoices: (

    invoices: BillingHistoryItem[]

  ) => void;



  addInvoice: (

    invoice: BillingHistoryItem

  ) => void;



  selectPlan: (

    plan: BillingPlan | null

  ) => void;



  // --------------------------------------------------------------------------
  // Loading
  // --------------------------------------------------------------------------


  setLoading: (

    loading: boolean

  ) => void;



  setCheckoutLoading: (

    loading: boolean

  ) => void;



  setLoaded: (

    loaded: boolean

  ) => void;



  // --------------------------------------------------------------------------
  // Error
  // --------------------------------------------------------------------------


  setError: (

    error: string | null

  ) => void;



  clearError: () => void;



  // --------------------------------------------------------------------------
  // Reset
  // --------------------------------------------------------------------------


  reset: () => void;


}



// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {


  plans: [],


  subscription: null,


  invoices: [],


  selectedPlan: null,


  isCheckoutLoading: false,


  isLoading: false,


  isLoaded: false,


  error: null


} satisfies Pick<

  BillingState,

  | 'plans'
  | 'subscription'
  | 'invoices'
  | 'selectedPlan'
  | 'isCheckoutLoading'
  | 'isLoading'
  | 'isLoaded'
  | 'error'

>;



// ============================================================================
// STORE
// ============================================================================

export const useBillingStore =

create<BillingState>((set) => ({


  ...initialState,



  // ==========================================================================
  // PLANS
  // ==========================================================================


  setPlans: (

    plans

  ) => {


    set({

      plans,

      error: null

    });


  },



  // ==========================================================================
  // SUBSCRIPTION
  // ==========================================================================


  setSubscription: (

    subscription

  ) => {


    set({

      subscription,

      error: null

    });


  },



  updateSubscription: (

    updates

  ) => {


    set((state) => ({


      subscription:

        state.subscription

          ? {

              ...state.subscription,

              ...updates

            }

          : null



    }));


  },



  // ==========================================================================
  // INVOICES
  // ==========================================================================


  setInvoices: (

    invoices

  ) => {


    set({

      invoices

    });


  },



  addInvoice: (

    invoice

  ) => {


    set((state) => ({


      invoices: [

        ...state.invoices,

        invoice

      ]


    }));


  },



  // ==========================================================================
  // PLAN SELECT
  // ==========================================================================


  selectPlan: (

    plan

  ) => {


    set({

      selectedPlan:

        plan


    });


  },



  // ==========================================================================
  // LOADING
  // ==========================================================================


  setLoading: (

    loading

  ) => {


    set({

      isLoading:

        loading


    });


  },



  setCheckoutLoading: (

    loading

  ) => {


    set({

      isCheckoutLoading:

        loading


    });


  },



  setLoaded: (

    loaded

  ) => {


    set({

      isLoaded:

        loaded


    });


  },



  // ==========================================================================
  // ERROR
  // ==========================================================================


  setError: (

    error

  ) => {


    set({

      error

    });


  },



  clearError: () => {


    set({

      error:

        null


    });


  },



  // ==========================================================================
  // RESET
  // ==========================================================================


  reset: () => {


    set({

      ...initialState


    });


  }



}));



// ============================================================================
// SELECTORS
// ============================================================================

export const billingSelectors = {


  plans: (

    state: BillingState

  ) => state.plans,



  subscription: (

    state: BillingState

  ) => state.subscription,



  invoices: (

    state: BillingState

  ) => state.invoices,



  selectedPlan: (

    state: BillingState

  ) => state.selectedPlan,



  isLoading: (

    state: BillingState

  ) => state.isLoading,



  isCheckoutLoading: (

    state: BillingState

  ) => state.isCheckoutLoading,



  error: (

    state: BillingState

  ) => state.error



};



// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useBillingStore;
