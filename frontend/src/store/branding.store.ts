/**
 * ============================================================================
 * StoreForge AI
 * Branding Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/branding.store.ts
 *
 * Purpose:
 * - Maintain branding configuration in frontend state
 * - Manage colors, typography, logo and brand identity
 * - Support AI-generated branding
 * - Track branding loading/error state
 *
 * IMPORTANT:
 * - This store does not persist secrets.
 * - Backend remains the source of truth.
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// TYPES
// ============================================================================

export interface BrandColors {

  primary?: string;

  secondary?: string;

  accent?: string;

  background?: string;

  surface?: string;

  text?: string;

  heading?: string;

}


export interface BrandFonts {

  heading?: string;

  body?: string;

}


export interface BrandLogo {

  url?: string;

  alt?: string;

}


export interface Branding {

  id?: string;

  _id?: string;

  storeId?: string;

  brandName?: string;

  tagline?: string;

  description?: string;

  colors?: BrandColors;

  fonts?: BrandFonts;

  logo?: BrandLogo;

  brandVoice?: string;

  style?: string;

  industry?: string;

  targetAudience?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// STATE
// ============================================================================

interface BrandingState {

  branding: Branding | null;

  isLoading: boolean;

  isSaving: boolean;

  isLoaded: boolean;

  error: string | null;


  setBranding: (
    branding: Branding | null
  ) => void;


  updateBranding: (
    updates: Partial<Branding>
  ) => void;


  updateColors: (
    colors: Partial<BrandColors>
  ) => void;


  updateFonts: (
    fonts: Partial<BrandFonts>
  ) => void;


  updateLogo: (
    logo: Partial<BrandLogo>
  ) => void;


  setLoading: (
    loading: boolean
  ) => void;


  setSaving: (
    saving: boolean
  ) => void;


  setLoaded: (
    loaded: boolean
  ) => void;


  setError: (
    error: string | null
  ) => void;


  clearError: () => void;


  clearBranding: () => void;


  reset: () => void;

}


// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {

  branding: null,

  isLoading: false,

  isSaving: false,

  isLoaded: false,

  error: null

} satisfies Pick<
  BrandingState,
  | 'branding'
  | 'isLoading'
  | 'isSaving'
  | 'isLoaded'
  | 'error'
>;


// ============================================================================
// STORE
// ============================================================================

export const useBrandingStore =
  create<BrandingState>((set) => ({

    ...initialState,


    // ========================================================================
    // SET BRANDING
    // ========================================================================

    setBranding: (
      branding
    ) => {

      set({

        branding,

        isLoaded: Boolean(branding),

        error: null

      });

    },


    // ========================================================================
    // UPDATE BRANDING
    // ========================================================================

    updateBranding: (
      updates
    ) => {

      set((state) => ({

        branding: state.branding
          ? {
              ...state.branding,
              ...updates
            }
          : updates,

        error: null

      }));

    },


    // ========================================================================
    // UPDATE COLORS
    // ========================================================================

    updateColors: (
      colors
    ) => {

      set((state) => ({

        branding: {

          ...(state.branding || {}),

          colors: {

            ...(state.branding?.colors || {}),

            ...colors

          }

        },

        error: null

      }));

    },


    // ========================================================================
    // UPDATE FONTS
    // ========================================================================

    updateFonts: (
      fonts
    ) => {

      set((state) => ({

        branding: {

          ...(state.branding || {}),

          fonts: {

            ...(state.branding?.fonts || {}),

            ...fonts

          }

        },

        error: null

      }));

    },


    // ========================================================================
    // UPDATE LOGO
    // ========================================================================

    updateLogo: (
      logo
    ) => {

      set((state) => ({

        branding: {

          ...(state.branding || {}),

          logo: {

            ...(state.branding?.logo || {}),

            ...logo

          }

        },

        error: null

      }));

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
    // SAVING
    // ========================================================================

    setSaving: (
      saving
    ) => {

      set({

        isSaving:
          saving

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
    // CLEAR BRANDING
    // ========================================================================

    clearBranding: () => {

      set({

        branding: null,

        isLoaded: false,

        isSaving: false,

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

export const brandingSelectors = {

  branding: (
    state: BrandingState
  ) => state.branding,


  isLoading: (
    state: BrandingState
  ) => state.isLoading,


  isSaving: (
    state: BrandingState
  ) => state.isSaving,


  isLoaded: (
    state: BrandingState
  ) => state.isLoaded,


  error: (
    state: BrandingState
  ) => state.error

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useBrandingStore;
