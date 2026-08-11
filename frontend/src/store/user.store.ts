/**
 * ============================================================================
 * StoreForge AI
 * User Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/user.store.ts
 *
 * Purpose:
 * - Maintain the current user's profile
 * - Update profile information
 * - Track profile loading/error state
 *
 * Authentication state is handled by:
 * frontend/src/store/auth.store.ts
 *
 * IMPORTANT:
 * - This store does NOT store passwords.
 * - This store does NOT store JWT/access tokens.
 * - Backend authorization remains the source of truth.
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// USER TYPE
// ============================================================================

export interface UserProfile {

  id: string;

  _id?: string;

  name?: string;

  email: string;

  role?: string;

  status?: string;

  avatar?: string;

  phone?: string;

  companyName?: string;

  timezone?: string;

  country?: string;

  currency?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// UPDATE TYPE
// ============================================================================

export type UserProfileUpdate = Partial<
  Pick<
    UserProfile,
    | 'name'
    | 'avatar'
    | 'phone'
    | 'companyName'
    | 'timezone'
    | 'country'
    | 'currency'
  >
>;


// ============================================================================
// STORE TYPE
// ============================================================================

interface UserState {

  /**
   * Current user profile.
   */
  profile: UserProfile | null;


  /**
   * Whether profile information is loading.
   */
  isLoading: boolean;


  /**
   * Whether the profile has been loaded.
   */
  isLoaded: boolean;


  /**
   * Profile-related error.
   */
  error: string | null;


  /**
   * Set the complete user profile.
   */
  setProfile: (
    profile: UserProfile | null
  ) => void;


  /**
   * Update selected profile fields.
   */
  updateProfile: (
    updates: UserProfileUpdate
  ) => void;


  /**
   * Set loading state.
   */
  setLoading: (
    loading: boolean
  ) => void;


  /**
   * Mark profile as loaded.
   */
  setLoaded: (
    loaded: boolean
  ) => void;


  /**
   * Set profile error.
   */
  setError: (
    error: string | null
  ) => void;


  /**
   * Clear profile error.
   */
  clearError: () => void;


  /**
   * Clear the profile.
   */
  clearProfile: () => void;


  /**
   * Reset the complete user store.
   */
  reset: () => void;

}


// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {

  profile: null,

  isLoading: false,

  isLoaded: false,

  error: null

} satisfies Pick<
  UserState,
  | 'profile'
  | 'isLoading'
  | 'isLoaded'
  | 'error'
>;


// ============================================================================
// USER STORE
// ============================================================================

export const useUserStore =
  create<UserState>((set) => ({

    ...initialState,


    // ========================================================================
    // SET PROFILE
    // ========================================================================

    setProfile: (
      profile
    ) => {

      set({

        profile,

        isLoaded: Boolean(profile),

        error: null

      });

    },


    // ========================================================================
    // UPDATE PROFILE
    // ========================================================================

    updateProfile: (
      updates
    ) => {

      set((state) => {

        if (!state.profile) {

          return state;

        }


        return {

          profile: {

            ...state.profile,

            ...updates

          },

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

        isLoading: loading

      });

    },


    // ========================================================================
    // LOADED
    // ========================================================================

    setLoaded: (
      loaded
    ) => {

      set({

        isLoaded: loaded

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
    // CLEAR PROFILE
    // ========================================================================

    clearProfile: () => {

      set({

        profile: null,

        isLoaded: false,

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

export const userSelectors = {

  profile: (
    state: UserState
  ) => state.profile,


  isLoading: (
    state: UserState
  ) => state.isLoading,


  isLoaded: (
    state: UserState
  ) => state.isLoaded,


  error: (
    state: UserState
  ) => state.error

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useUserStore;
