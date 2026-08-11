/**
 * ============================================================================
 * StoreForge AI
 * Dashboard Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/dashboard.store.ts
 *
 * Purpose:
 * - Manage dashboard state
 * - Store dashboard metrics
 * - Store activity feed
 * - Track AI process status
 * - Handle dashboard loading/errors
 *
 * Backend handles:
 * - Analytics calculations
 * - Data aggregation
 * - AI processing
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// TYPES
// ============================================================================

export interface DashboardMetrics {

  totalStores?: number;

  totalProducts?: number;

  totalRevenue?: number;

  revenueGrowth?: number;

  orders?: number;

  customers?: number;

  conversionRate?: number;

  activeSubscription?: boolean;

}



export interface DashboardActivity {

  id: string;

  type:

    | 'store_created'
    | 'product_generated'
    | 'theme_generated'
    | 'branding_generated'
    | 'deployment'
    | 'subscription';


  title: string;

  description?: string;

  createdAt?: string;

}



export interface AITaskStatus {

  id?: string;

  type?:

    | 'branding'
    | 'product'
    | 'theme'
    | 'analysis';


  status?:

    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';


  progress?: number;


  message?: string;

}



// ============================================================================
// STORE STATE
// ============================================================================

interface DashboardState {


  /**
   * Dashboard metric cards.
   */
  metrics: DashboardMetrics | null;



  /**
   * Recent user activities.
   */
  activities: DashboardActivity[];



  /**
   * Current AI generation tasks.
   */
  aiTasks: AITaskStatus[];



  /**
   * Dashboard loading.
   */
  isLoading: boolean;



  /**
   * Whether dashboard loaded.
   */
  isLoaded: boolean;



  /**
   * Refreshing dashboard.
   */
  isRefreshing: boolean;



  /**
   * Error message.
   */
  error: string | null;



  // --------------------------------------------------------------------------
  // Metrics
  // --------------------------------------------------------------------------


  setMetrics: (

    metrics: DashboardMetrics

  ) => void;



  updateMetrics: (

    updates: Partial<DashboardMetrics>

  ) => void;



  // --------------------------------------------------------------------------
  // Activity
  // --------------------------------------------------------------------------


  setActivities: (

    activities: DashboardActivity[]

  ) => void;



  addActivity: (

    activity: DashboardActivity

  ) => void;



  // --------------------------------------------------------------------------
  // AI Tasks
  // --------------------------------------------------------------------------


  setAITasks: (

    tasks: AITaskStatus[]

  ) => void;



  addAITask: (

    task: AITaskStatus

  ) => void;



  updateAITask: (

    id: string,

    updates: Partial<AITaskStatus>

  ) => void;



  removeAITask: (

    id: string

  ) => void;



  // --------------------------------------------------------------------------
  // Loading
  // --------------------------------------------------------------------------


  setLoading: (

    loading: boolean

  ) => void;



  setRefreshing: (

    refreshing: boolean

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


  metrics: null,


  activities: [],


  aiTasks: [],


  isLoading: false,


  isLoaded: false,


  isRefreshing: false,


  error: null


} satisfies Pick<

  DashboardState,

  | 'metrics'
  | 'activities'
  | 'aiTasks'
  | 'isLoading'
  | 'isLoaded'
  | 'isRefreshing'
  | 'error'

>;



// ============================================================================
// STORE
// ============================================================================

export const useDashboardStore =

create<DashboardState>((set) => ({


  ...initialState,



  // ==========================================================================
  // METRICS
  // ==========================================================================


  setMetrics: (

    metrics

  ) => {


    set({

      metrics,

      error: null

    });


  },



  updateMetrics: (

    updates

  ) => {


    set((state) => ({


      metrics: {


        ...(state.metrics || {}),


        ...updates


      }


    }));


  },



  // ==========================================================================
  // ACTIVITIES
  // ==========================================================================


  setActivities: (

    activities

  ) => {


    set({

      activities

    });


  },



  addActivity: (

    activity

  ) => {


    set((state) => ({


      activities: [


        activity,


        ...state.activities


      ]


    }));


  },



  // ==========================================================================
  // AI TASKS
  // ==========================================================================


  setAITasks: (

    aiTasks

  ) => {


    set({

      aiTasks

    });


  },



  addAITask: (

    task

  ) => {


    set((state) => ({


      aiTasks: [


        ...state.aiTasks,


        task


      ]


    }));


  },



  updateAITask: (

    id,

    updates

  ) => {


    set((state) => ({


      aiTasks:

        state.aiTasks.map(

          (task) =>

            task.id === id

              ? {

                  ...task,

                  ...updates

                }

              : task

        )


    }));


  },



  removeAITask: (

    id

  ) => {


    set((state) => ({


      aiTasks:

        state.aiTasks.filter(

          (task) =>

            task.id !== id

        )


    }));


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



  setRefreshing: (

    refreshing

  ) => {


    set({

      isRefreshing:

        refreshing


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

export const dashboardSelectors = {


  metrics: (

    state: DashboardState

  ) => state.metrics,



  activities: (

    state: DashboardState

  ) => state.activities,



  aiTasks: (

    state: DashboardState

  ) => state.aiTasks,



  isLoading: (

    state: DashboardState

  ) => state.isLoading,



  isRefreshing: (

    state: DashboardState

  ) => state.isRefreshing,



  error: (

    state: DashboardState

  ) => state.error


};



// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useDashboardStore;
