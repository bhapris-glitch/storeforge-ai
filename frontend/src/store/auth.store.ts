/**
 * ============================================================================
 * StoreForge AI
 * Authentication Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/auth.store.ts
 *
 * Purpose:
 * - Maintain client-side authentication state
 * - Store current authenticated user
 * - Track authentication loading state
 * - Track authentication initialization
 * - Login/logout state transitions
 *
 * IMPORTANT:
 * - Do NOT store JWT/access tokens in localStorage.
 * - Authentication credentials should be handled by secure HTTP-only cookies.
 * - Backend middleware remains the source of truth for authorization.
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// USER TYPE
// ============================================================================

export interface AuthUser {

  id: string;

  _id?: string;

  name?: string;

  email: string;

  role?: string;

  status?: string;

  avatar?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// STORE TYPE
// ============================================================================

interface AuthState {

  /**
   * Currently authenticated user.
   */
  user: AuthUser | null;


  /**
   * Whether the user is authenticated.
   */
  isAuthenticated: boolean;


  /**
   * Whether authentication state is currently loading.
   */
  isLoading: boolean;


  /**
   * Whether the initial session check has completed.
   */
  isInitialized: boolean;


  /**
   * Authentication error.
   */
  error: string | null;


  /**
   * Set authenticated user.
   */
  setUser: (
    user: AuthUser | null
  ) => void;


  /**
   * Mark user as authenticated.
   */
  login: (
    user: AuthUser
  ) => void;


  /**
   * Clear authentication state.
   */
  logout: () => void;


  /**
   * Set loading state.
   */
  setLoading: (
    loading: boolean
  ) => void;


  /**
   * Mark authentication initialization as complete.
   */
  setInitialized: (
    initialized: boolean
  ) => void;


  /**
   * Set authentication error.
   */
  setError: (
    error: string | null
  ) => void;


  /**
   * Clear authentication error.
   */
  clearError: () => void;


  /**
   * Reset the complete authentication state.
   */
  reset: () => void;

}


// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {

  user: null,

  isAuthenticated: false,

  isLoading: false,

  isInitialized: false,

  error: null

} satisfies Pick<
  AuthState,
  | 'user'
  | 'isAuthenticated'
  | 'isLoading'
  | 'isInitialized'
  | 'error'
>;


// ============================================================================
// AUTH STORE
// ============================================================================

export const useAuthStore =
  create<AuthState>((set) => ({

    ...initialState,


    // ========================================================================
    // SET USER
    // ========================================================================

    setUser: (
      user
    ) => {

      set({

        user,

        isAuthenticated:
          Boolean(user),

        error: null

      });

    },


    // ========================================================================
    // LOGIN
    // ========================================================================

    login: (
      user
    ) => {

      set({

        user,

        isAuthenticated: true,

        isLoading: false,

        error: null

      });

    },


    // ========================================================================
    // LOGOUT
    // ========================================================================

    logout: () => {

      set({

        user: null,

        isAuthenticated: false,

        isLoading: false,

        error: null

      });

    },


    // ========================================================================
    // LOADING
    // ========================================================================

    setLoading: (
      loading
    ) => {

      set({

        isLoading: loading

      });

    },


    // ========================================================================
    // INITIALIZED
    // ========================================================================

    setInitialized: (
      initialized
    ) => {

      set({

        isInitialized: initialized

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

export const authSelectors = {

  user: (
    state: AuthState
  ) => state.user,


  isAuthenticated: (
    state: AuthState
  ) => state.isAuthenticated,


  isLoading: (
    state: AuthState
  ) => state.isLoading,


  isInitialized: (
    state: AuthState
  ) => state.isInitialized,


  error: (
    state: AuthState
  ) => state.error

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useAuthStore;
