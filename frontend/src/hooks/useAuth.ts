/**
 * ============================================================================
 * StoreForge AI
 * useAuth Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useAuth.ts
 *
 * Purpose:
 * - Provide a clean React hook for authentication state
 * - Expose login/logout/session state
 * - Keep components independent from Zustand implementation details
 *
 * Authentication credentials are handled by secure backend cookies.
 * No JWT/token is stored by this hook.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useAuthStore
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useAuth() {

  const user =
    useAuthStore(
      (state) => state.user
    );


  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );


  const isLoading =
    useAuthStore(
      (state) => state.isLoading
    );


  const isInitialized =
    useAuthStore(
      (state) => state.isInitialized
    );


  const error =
    useAuthStore(
      (state) => state.error
    );


  const setUser =
    useAuthStore(
      (state) => state.setUser
    );


  const login =
    useAuthStore(
      (state) => state.login
    );


  const logout =
    useAuthStore(
      (state) => state.logout
    );


  const setLoading =
    useAuthStore(
      (state) => state.setLoading
    );


  const setInitialized =
    useAuthStore(
      (state) => state.setInitialized
    );


  const setError =
    useAuthStore(
      (state) => state.setError
    );


  const clearError =
    useAuthStore(
      (state) => state.clearError
    );


  const reset =
    useAuthStore(
      (state) => state.reset
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const handleLogin = useCallback(
    (
      authenticatedUser: NonNullable<typeof user>
    ) => {

      login(
        authenticatedUser
      );

    },
    [login]
  );


  const handleLogout = useCallback(
    () => {

      logout();

    },
    [logout]
  );


  const handleSetUser = useCallback(
    (
      authenticatedUser: typeof user
    ) => {

      setUser(
        authenticatedUser
      );

    },
    [setUser]
  );


  const handleClearError = useCallback(
    () => {

      clearError();

    },
    [clearError]
  );


  const handleReset = useCallback(
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
    // State
    // ------------------------------------------------------------------------

    user,

    isAuthenticated,

    isLoading,

    isInitialized,

    error,


    // ------------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------------

    login:
      handleLogin,

    logout:
      handleLogout,

    setUser:
      handleSetUser,

    setLoading,

    setInitialized,

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

export default useAuth;
