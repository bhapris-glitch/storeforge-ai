/**
 * ============================================================================
 * StoreForge AI
 * useUser Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useUser.ts
 *
 * Purpose:
 * - Provide a clean React interface for the user store
 * - Expose the current user's profile
 * - Update profile information
 * - Manage user loading/error state
 *
 * Authentication state remains in useAuth().
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useUserStore
} from '@/store';

import type {
  UserProfile,
  UserProfileUpdate
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useUser() {

  // ==========================================================================
  // STATE
  // ==========================================================================

  const profile =
    useUserStore(
      (state) => state.profile
    );


  const isLoading =
    useUserStore(
      (state) => state.isLoading
    );


  const isLoaded =
    useUserStore(
      (state) => state.isLoaded
    );


  const error =
    useUserStore(
      (state) => state.error
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setProfile =
    useUserStore(
      (state) => state.setProfile
    );


  const updateProfile =
    useUserStore(
      (state) => state.updateProfile
    );


  const setLoading =
    useUserStore(
      (state) => state.setLoading
    );


  const setLoaded =
    useUserStore(
      (state) => state.setLoaded
    );


  const setError =
    useUserStore(
      (state) => state.setError
    );


  const clearError =
    useUserStore(
      (state) => state.clearError
    );


  const clearProfile =
    useUserStore(
      (state) => state.clearProfile
    );


  const reset =
    useUserStore(
      (state) => state.reset
    );


  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

  const handleSetProfile =
    useCallback(
      (
        user: UserProfile | null
      ) => {

        setProfile(user);

      },
      [setProfile]
    );


  const handleUpdateProfile =
    useCallback(
      (
        updates: UserProfileUpdate
      ) => {

        updateProfile(updates);

      },
      [updateProfile]
    );


  const handleClearError =
    useCallback(
      () => {

        clearError();

      },
      [clearError]
    );


  const handleClearProfile =
    useCallback(
      () => {

        clearProfile();

      },
      [clearProfile]
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
    // User
    // ------------------------------------------------------------------------

    profile,

    user:
      profile,


    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    isLoading,

    isLoaded,

    error,


    // ------------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------------

    setProfile:
      handleSetProfile,

    updateProfile:
      handleUpdateProfile,

    setLoading,

    setLoaded,

    setError,

    clearError:
      handleClearError,

    clearProfile:
      handleClearProfile,

    reset:
      handleReset

  };

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useUser;
