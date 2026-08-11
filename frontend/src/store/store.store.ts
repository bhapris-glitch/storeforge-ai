/**
 * ============================================================================
 * StoreForge AI
 * Store Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/store.store.ts
 *
 * Purpose:
 * - Maintain the currently selected store
 * - Maintain the merchant's store list
 * - Track store loading/error state
 * - Track Shopify connection status
 * - Select/change the active store
 *
 * IMPORTANT:
 * - Never store Shopify access tokens in frontend state.
 * - Backend remains the source of truth for store authorization.
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// TYPES
// ============================================================================

export interface Store {

  id: string;

  _id?: string;

  userId?: string;

  name: string;

  shopifyDomain?: string;

  shopifyStoreId?: string;

  customDomain?: string;

  platform?: string;

  status?: string;

  isConnected?: boolean;

  currency?: string;

  country?: string;

  timezone?: string;

  email?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// STORE STATE
// ============================================================================

interface StoreState {

  /**
   * All stores belonging to the authenticated user.
   */
  stores: Store[];


  /**
   * Currently selected store.
   */
  currentStore: Store | null;


  /**
   * Whether stores are being loaded.
   */
  isLoading: boolean;


  /**
   * Whether the initial store request has completed.
   */
  isLoaded: boolean;


  /**
   * Store-related error.
   */
  error: string | null;


  /**
   * Replace the complete store list.
   */
  setStores: (
    stores: Store[]
  ) => void;


  /**
   * Add a store to the store list.
   */
  addStore: (
    store: Store
  ) => void;


  /**
   * Update an existing store.
   */
  updateStore: (
    storeId: string,
    updates: Partial<Store>
  ) => void;


  /**
   * Remove a store from the local list.
   */
  removeStore: (
    storeId: string
  ) => void;


  /**
   * Select the active store.
   */
  setCurrentStore: (
    store: Store | null
  ) => void;


  /**
   * Select a store by ID.
   */
  selectStore: (
    storeId: string
  ) => void;


  /**
   * Set loading state.
   */
  setLoading: (
    loading: boolean
  ) => void;


  /**
   * Mark stores as loaded.
   */
  setLoaded: (
    loaded: boolean
  ) => void;


  /**
   * Set an error.
   */
  setError: (
    error: string | null
  ) => void;


  /**
   * Clear the current error.
   */
  clearError: () => void;


  /**
   * Clear all store state.
   */
  reset: () => void;

}


// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {

  stores: [],

  currentStore: null,

  isLoading: false,

  isLoaded: false,

  error: null

} satisfies Pick<
  StoreState,
  | 'stores'
  | 'currentStore'
  | 'isLoading'
  | 'isLoaded'
  | 'error'
>;


// ============================================================================
// STORE
// ============================================================================

export const useStoreStore =
  create<StoreState>((set) => ({

    ...initialState,


    // ========================================================================
    // SET STORES
    // ========================================================================

    setStores: (
      stores
    ) => {

      set((state) => {

        let currentStore =
          state.currentStore;


        /*
         * If there is no currently selected store,
         * automatically select the first available store.
         */

        if (
          !currentStore &&
          stores.length > 0
        ) {

          currentStore =
            stores[0];

        }


        /*
         * If the current store still exists in the
         * newly loaded list, use the latest version.
         */

        if (
          currentStore
        ) {

          const updatedCurrentStore =
            stores.find(
              (store) =>
                store.id ===
                currentStore?.id
            );


          if (
            updatedCurrentStore
          ) {

            currentStore =
              updatedCurrentStore;

          }

        }


        return {

          stores,

          currentStore,

          isLoaded: true,

          error: null

        };

      });

    },


    // ========================================================================
    // ADD STORE
    // ========================================================================

    addStore: (
      store
    ) => {

      set((state) => {

        const exists =
          state.stores.some(
            (item) =>
              item.id === store.id
          );


        if (exists) {

          return state;

        }


        return {

          stores: [
            ...state.stores,
            store
          ],

          currentStore:
            state.currentStore ||
            store,

          error: null

        };

      });

    },


    // ========================================================================
    // UPDATE STORE
    // ========================================================================

    updateStore: (
      storeId,
      updates
    ) => {

      set((state) => {

        const stores =
          state.stores.map(
            (store) => {

              if (
                store.id !==
                storeId
              ) {

                return store;

              }


              return {

                ...store,

                ...updates

              };

            }
          );


        let currentStore =
          state.currentStore;


        if (
          currentStore?.id ===
          storeId
        ) {

          currentStore = {

            ...currentStore,

            ...updates

          };

        }


        return {

          stores,

          currentStore

        };

      });

    },


    // ========================================================================
    // REMOVE STORE
    // ========================================================================

    removeStore: (
      storeId
    ) => {

      set((state) => {

        const stores =
          state.stores.filter(
            (store) =>
              store.id !== storeId
          );


        let currentStore =
          state.currentStore;


        /*
         * If the active store was removed,
         * select another available store.
         */

        if (
          currentStore?.id ===
          storeId
        ) {

          currentStore =
            stores[0] ||
            null;

        }


        return {

          stores,

          currentStore,

          error: null

        };

      });

    },


    // ========================================================================
    // SET CURRENT STORE
    // ========================================================================

    setCurrentStore: (
      store
    ) => {

      set({

        currentStore:
          store,

        error: null

      });

    },


    // ========================================================================
    // SELECT STORE BY ID
    // ========================================================================

    selectStore: (
      storeId
    ) => {

      set((state) => {

        const store =
          state.stores.find(
            (item) =>
              item.id === storeId
          );


        if (!store) {

          return {

            error:
              'Store not found.'

          };

        }


        return {

          currentStore:
            store,

          error: null

        };

      });

    },


    // ========================================================================
    // LOADING
    // ========================================================================

    setLoading: (
      loading
    ) => {

      set({

        isLoading:
          loading

      });

    },


    // ========================================================================
    // LOADED
    // ========================================================================

    setLoaded: (
      loaded
    ) => {

      set({

        isLoaded:
          loaded

      });

    },


    // ========================================================================
    // ERROR
    // ========================================================================

    setError: (
      error
    ) => {

      set({

        error

      });

    },


    // ========================================================================
    // CLEAR ERROR
    // ========================================================================

    clearError: () => {

      set({

        error: null

      });

    },


    // ========================================================================
    // RESET
    // ========================================================================

    reset: () => {

      set({

        ...initialState

      });

    }

  }));


// ============================================================================
// SELECTORS
// ============================================================================

export const storeSelectors = {

  stores: (
    state: StoreState
  ) => state.stores,


  currentStore: (
    state: StoreState
  ) => state.currentStore,


  isLoading: (
    state: StoreState
  ) => state.isLoading,


  isLoaded: (
    state: StoreState
  ) => state.isLoaded,


  error: (
    state: StoreState
  ) => state.error

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useStoreStore;
