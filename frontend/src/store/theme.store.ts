/**
 * ============================================================================
 * StoreForge AI
 * Theme Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/theme.store.ts
 *
 * Purpose:
 * - Maintain themes for the active store
 * - Manage selected theme
 * - Manage theme draft/editor state
 * - Manage AI theme-generation state
 * - Manage preview state
 * - Track theme saving/generation state
 *
 * IMPORTANT:
 * - Backend/database remains the source of truth.
 * - No Shopify access tokens are stored here.
 * - Deployment itself is handled by deployment.service.ts.
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// TYPES
// ============================================================================

export interface ThemeColors {

  primary?: string;

  secondary?: string;

  accent?: string;

  background?: string;

  surface?: string;

  text?: string;

  heading?: string;

}


export interface ThemeTypography {

  headingFont?: string;

  bodyFont?: string;

  headingWeight?: number;

  bodyWeight?: number;

}


export interface ThemeSection {

  id: string;

  type: string;

  title?: string;

  enabled?: boolean;

  settings?: Record<string, unknown>;

}


export interface Theme {

  id: string;

  _id?: string;

  storeId?: string;

  name: string;

  description?: string;

  status?: string;

  version?: string;

  thumbnailUrl?: string;

  previewUrl?: string;

  colors?: ThemeColors;

  typography?: ThemeTypography;

  sections?: ThemeSection[];

  settings?: Record<string, unknown>;

  isPublished?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// THEME DRAFT
// ============================================================================

export interface ThemeDraft
  extends Partial<Theme> {

  id?: string;

  name?: string;

}


// ============================================================================
// AI GENERATION
// ============================================================================

export interface ThemeGenerationState {

  isGenerating: boolean;

  error: string | null;

  result: ThemeDraft | null;

}


// ============================================================================
// STORE STATE
// ============================================================================

interface ThemeState {

  /**
   * Themes belonging to the active store.
   */
  themes: Theme[];


  /**
   * Currently selected theme.
   */
  selectedTheme: Theme | null;


  /**
   * Theme currently being edited.
   */
  draft: ThemeDraft | null;


  /**
   * Whether theme list/data is loading.
   */
  isLoading: boolean;


  /**
   * Whether theme changes are being saved.
   */
  isSaving: boolean;


  /**
   * Whether theme data has been loaded.
   */
  isLoaded: boolean;


  /**
   * Whether preview mode is active.
   */
  isPreviewing: boolean;


  /**
   * AI generation state.
   */
  generation: ThemeGenerationState;


  /**
   * General theme error.
   */
  error: string | null;


  // --------------------------------------------------------------------------
  // Theme list
  // --------------------------------------------------------------------------

  setThemes: (
    themes: Theme[]
  ) => void;


  addTheme: (
    theme: Theme
  ) => void;


  updateTheme: (
    themeId: string,
    updates: Partial<Theme>
  ) => void;


  removeTheme: (
    themeId: string
  ) => void;


  // --------------------------------------------------------------------------
  // Selection
  // --------------------------------------------------------------------------

  setSelectedTheme: (
    theme: Theme | null
  ) => void;


  selectTheme: (
    themeId: string
  ) => void;


  // --------------------------------------------------------------------------
  // Draft/editor
  // --------------------------------------------------------------------------

  setDraft: (
    draft: ThemeDraft | null
  ) => void;


  updateDraft: (
    updates: ThemeDraft
  ) => void;


  updateDraftColors: (
    colors: Partial<ThemeColors>
  ) => void;


  updateDraftTypography: (
    typography: Partial<ThemeTypography>
  ) => void;


  updateDraftSections: (
    sections: ThemeSection[]
  ) => void;


  updateDraftSettings: (
    settings: Record<string, unknown>
  ) => void;


  clearDraft: () => void;


  // --------------------------------------------------------------------------
  // Preview
  // --------------------------------------------------------------------------

  setPreviewing: (
    previewing: boolean
  ) => void;


  // --------------------------------------------------------------------------
  // Loading/saving
  // --------------------------------------------------------------------------

  setLoading: (
    loading: boolean
  ) => void;


  setSaving: (
    saving: boolean
  ) => void;


  setLoaded: (
    loaded: boolean
  ) => void;


  // --------------------------------------------------------------------------
  // AI generation
  // --------------------------------------------------------------------------

  startGeneration: () => void;


  setGenerationResult: (
    result: ThemeDraft
  ) => void;


  setGenerationError: (
    error: string | null
  ) => void;


  clearGeneration: () => void;


  // --------------------------------------------------------------------------
  // Errors
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

const initialGenerationState:
  ThemeGenerationState = {

    isGenerating: false,

    error: null,

    result: null

  };


const initialState = {

  themes: [],

  selectedTheme: null,

  draft: null,

  isLoading: false,

  isSaving: false,

  isLoaded: false,

  isPreviewing: false,

  generation:
    initialGenerationState,

  error: null

} satisfies Pick<
  ThemeState,
  | 'themes'
  | 'selectedTheme'
  | 'draft'
  | 'isLoading'
  | 'isSaving'
  | 'isLoaded'
  | 'isPreviewing'
  | 'generation'
  | 'error'
>;


// ============================================================================
// STORE
// ============================================================================

export const useThemeStore =
  create<ThemeState>((set) => ({

    ...initialState,


    // ========================================================================
    // SET THEMES
    // ========================================================================

    setThemes: (
      themes
    ) => {

      set((state) => {

        let selectedTheme =
          state.selectedTheme;


        /*
         * Automatically select the first theme
         * if nothing is currently selected.
         */

        if (
          !selectedTheme &&
          themes.length > 0
        ) {

          selectedTheme =
            themes[0];

        }


        /*
         * Synchronize the selected theme
         * with the newest theme list.
         */

        if (
          selectedTheme
        ) {

          const updatedTheme =
            themes.find(
              (theme) =>
                theme.id ===
                selectedTheme?.id
            );


          if (
            updatedTheme
          ) {

            selectedTheme =
              updatedTheme;

          }

        }


        return {

          themes,

          selectedTheme,

          isLoaded: true,

          error: null

        };

      });

    },


    // ========================================================================
    // ADD THEME
    // ========================================================================

    addTheme: (
      theme
    ) => {

      set((state) => ({

        themes: [

          ...state.themes,

          theme

        ],

        selectedTheme:
          state.selectedTheme ||
          theme,

        error: null

      }));

    },


    // ========================================================================
    // UPDATE THEME
    // ========================================================================

    updateTheme: (
      themeId,
      updates
    ) => {

      set((state) => {

        const themes =
          state.themes.map(
            (theme) => {

              if (
                theme.id !==
                themeId
              ) {

                return theme;

              }


              return {

                ...theme,

                ...updates

              };

            }
          );


        let selectedTheme =
          state.selectedTheme;


        if (
          selectedTheme?.id ===
          themeId
        ) {

          selectedTheme = {

            ...selectedTheme,

            ...updates

          };

        }


        return {

          themes,

          selectedTheme

        };

      });

    },


    // ========================================================================
    // REMOVE THEME
    // ========================================================================

    removeTheme: (
      themeId
    ) => {

      set((state) => {

        const themes =
          state.themes.filter(
            (theme) =>
              theme.id !== themeId
          );


        let selectedTheme =
          state.selectedTheme;


        if (
          selectedTheme?.id ===
          themeId
        ) {

          selectedTheme =
            themes[0] ||
            null;

        }


        return {

          themes,

          selectedTheme,

          draft:
            state.draft?.id === themeId
              ? null
              : state.draft

        };

      });

    },


    // ========================================================================
    // SET SELECTED THEME
    // ========================================================================

    setSelectedTheme: (
      theme
    ) => {

      set({

        selectedTheme:
          theme,

        error: null

      });

    },


    // ========================================================================
    // SELECT THEME
    // ========================================================================

    selectTheme: (
      themeId
    ) => {

      set((state) => {

        const theme =
          state.themes.find(
            (item) =>
              item.id === themeId
          );


        if (!theme) {

          return {

            error:
              'Theme not found.'

          };

        }


        return {

          selectedTheme:
            theme,

          draft: {
            ...theme
          },

          error: null

        };

      });

    },


    // ========================================================================
    // SET DRAFT
    // ========================================================================

    setDraft: (
      draft
    ) => {

      set({

        draft,

        error: null

      });

    },


    // ========================================================================
    // UPDATE DRAFT
    // ========================================================================

    updateDraft: (
      updates
    ) => {

      set((state) => ({

        draft: {

          ...(state.draft || {}),

          ...updates

        },

        error: null

      }));

    },


    // ========================================================================
    // UPDATE DRAFT COLORS
    // ========================================================================

    updateDraftColors: (
      colors
    ) => {

      set((state) => ({

        draft: {

          ...(state.draft || {}),

          colors: {

            ...(state.draft?.colors || {}),

            ...colors

          }

        },

        error: null

      }));

    },


    // ========================================================================
    // UPDATE DRAFT TYPOGRAPHY
    // ========================================================================

    updateDraftTypography: (
      typography
    ) => {

      set((state) => ({

        draft: {

          ...(state.draft || {}),

          typography: {

            ...(state.draft?.typography || {}),

            ...typography

          }

        },

        error: null

      }));

    },


    // ========================================================================
    // UPDATE DRAFT SECTIONS
    // ========================================================================

    updateDraftSections: (
      sections
    ) => {

      set((state) => ({

        draft: {

          ...(state.draft || {}),

          sections

        },

        error: null

      }));

    },


    // ========================================================================
    // UPDATE DRAFT SETTINGS
    // ========================================================================

    updateDraftSettings: (
      settings
    ) => {

      set((state) => ({

        draft: {

          ...(state.draft || {}),

          settings: {

            ...(state.draft?.settings || {}),

            ...settings

          }

        },

        error: null

      }));

    },


    // ========================================================================
    // CLEAR DRAFT
    // ========================================================================

    clearDraft: () => {

      set({

        draft: null

      });

    },


    // ========================================================================
    // PREVIEW
    // ========================================================================

    setPreviewing: (
      previewing
    ) => {

      set({

        isPreviewing:
          previewing

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
    // START AI GENERATION
    // ========================================================================

    startGeneration: () => {

      set({

        generation: {

          isGenerating: true,

          error: null,

          result: null

        },

        error: null

      });

    },


    // ========================================================================
    // GENERATION RESULT
    // ========================================================================

    setGenerationResult: (
      result
    ) => {

      set((state) => ({

        generation: {

          isGenerating: false,

          error: null,

          result

        },

        draft: {

          ...(state.draft || {}),

          ...result

        },

        error: null

      }));

    },


    // ========================================================================
    // GENERATION ERROR
    // ========================================================================

    setGenerationError: (
      error
    ) => {

      set({

        generation: {

          isGenerating: false,

          error,

          result: null

        },

        error

      });

    },


    // ========================================================================
    // CLEAR GENERATION
    // ========================================================================

    clearGeneration: () => {

      set({

        generation: {

          ...initialGenerationState

        }

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

        ...initialState,

        generation: {

          ...initialGenerationState

        }

      });

    }

  }));


// ============================================================================
// SELECTORS
// ============================================================================

export const themeSelectors = {

  themes: (
    state: ThemeState
  ) => state.themes,


  selectedTheme: (
    state: ThemeState
  ) => state.selectedTheme,


  draft: (
    state: ThemeState
  ) => state.draft,


  isLoading: (
    state: ThemeState
  ) => state.isLoading,


  isSaving: (
    state: ThemeState
  ) => state.isSaving,


  isLoaded: (
    state: ThemeState
  ) => state.isLoaded,


  isPreviewing: (
    state: ThemeState
  ) => state.isPreviewing,


  generation: (
    state: ThemeState
  ) => state.generation,


  isGenerating: (
    state: ThemeState
  ) => state.generation.isGenerating,


  error: (
    state: ThemeState
  ) => state.error

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useThemeStore;
