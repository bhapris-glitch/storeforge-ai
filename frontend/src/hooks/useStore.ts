/**
 * ============================================================================
 * StoreForge AI
 * useStore Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useStore.ts
 *
 * Purpose:
 * - Provide a clean React interface for store state
 * - Manage the authenticated user's stores
 * - Manage the currently selected store
 * - Add/update/remove stores
 * - Manage store loading/error state
 *
 * IMPORTANT:
 * - No Shopify access token is stored here.
 * - Backend remains the source of truth for authorization.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useStoreStore
} from '@/store';

import type {
  Store
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useStore() {

  // ==========================================================================
  // STATE
  // ==========================================================================

  const stores =
    useStoreStore(
      (state) => state.stores
    );


  const currentStore =
    useStoreStore(
      (state) => state.currentStore
    );


  const isLoading =
    useStoreStore(
      (state) => state.isLoading
    );


  const isLoaded =
    useStoreStore(
      (state) => state.isLoaded
    );


  const error =
    useStoreStore(
      (state) => state.error
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setStores =
    useStoreStore(
      (state) => state.setStores
    );


  const addStore =
    useStoreStore(
      (state) => state.addStore
    );


  const updateStore =
    useStoreStore(
      (state) => state.updateStore
    );


  const removeStore =
    useStoreStore(
      (state) => state.removeStore
    );


  const setCurrentStore =
    useStoreStore(
      (state) => state.setCurrentStore
    );


  const selectStore =
    useStoreStore(
      (state) => state.selectStore
    );


  const setLoading =
    useStoreStore(
      (state) => state.setLoading
    );


  const setLoaded =
    useStoreStore(
      (state) => state.setLoaded
    );


  const setError =
    useStoreStore(
      (state) => state.setError
    );


  const clearError =
    useStoreStore(
      (state) => state.clearError
    );


  const reset =
    useStoreStore(
      (state) => state.reset
    );


  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

  const handleSetStores =
    useCallback(
      (
        value: Store[]
      ) => {

        setStores(value);

      },
      [setStores]
    );


  const handleAddStore =
    useCallback(
      (
        store: Store
      ) => {

        addStore(store);

      },
      [addStore]
    );


  const handleUpdateStore =
    useCallback(
      (
        storeId: string,
        updates: Partial<Store>
      ) => {

        updateStore(
          storeId,
          updates
        );

      },
      [updateStore]
    );


  const handleRemoveStore =
    useCallback(
      (
        storeId: string
      ) => {

        removeStore(
          storeId
        );

      },
      [removeStore]
    );


  const handleSetCurrentStore =
    useCallback(
      (
        store: Store | null
      ) => {

        setCurrentStore(
          store
        );

      },
      [setCurrentStore]
    );


  const handleSelectStore =
    useCallback(
      (
        storeId: string
      ) => {

        selectStore(
          storeId
        );

      },
      [selectStore]
    );


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
  // RETURN
  // ==========================================================================

  return {

    // ------------------------------------------------------------------------
    // Store data
    // ------------------------------------------------------------------------

    stores,

    currentStore,

    activeStore:
      currentStore,


    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    isLoading,

    isLoaded,

    error,


    // ------------------------------------------------------------------------
    // Store actions
    // ------------------------------------------------------------------------

    setStores:
      handleSetStores,

    addStore:
      handleAddStore,

    updateStore:
      handleUpdateStore,

    removeStore:
      handleRemoveStore,

    setCurrentStore:
      handleSetCurrentStore,

    selectStore:
      handleSelectStore,


    // ------------------------------------------------------------------------
    // State actions
    // ------------------------------------------------------------------------

    setLoading,

    setLoaded,

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

export default useStore;
