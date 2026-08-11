/**
 * ============================================================================
 * StoreForge AI
 * useTheme Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useTheme.ts
 *
 * Purpose:
 * - Provide a clean React interface for theme state
 * - Manage AI-generated themes
 * - Manage selected theme
 * - Manage theme editor draft
 * - Manage preview mode
 * - Manage theme generation state
 *
 * IMPORTANT:
 * - This hook does not call APIs directly.
 * - API operations belong in theme.service.ts.
 * - Shopify deployment belongs in deployment.service.ts.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useThemeStore
} from '@/store';

import type {
  Theme,
  ThemeDraft,
  ThemeColors,
  ThemeTypography,
  ThemeSection
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useTheme() {


  // ==========================================================================
  // STATE
  // ==========================================================================

  const themes =
    useThemeStore(
      (state) => state.themes
    );


  const selectedTheme =
    useThemeStore(
      (state) => state.selectedTheme
    );


  const draft =
    useThemeStore(
      (state) => state.draft
    );


  const isLoading =
    useThemeStore(
      (state) => state.isLoading
    );


  const isSaving =
    useThemeStore(
      (state) => state.isSaving
    );


  const isLoaded =
    useThemeStore(
      (state) => state.isLoaded
    );


  const isPreviewing =
    useThemeStore(
      (state) => state.isPreviewing
    );


  const generation =
    useThemeStore(
      (state) => state.generation
    );


  const error =
    useThemeStore(
      (state) => state.error
    );



  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setThemes =
    useThemeStore(
      (state) => state.setThemes
    );


  const addTheme =
    useThemeStore(
      (state) => state.addTheme
    );


  const updateTheme =
    useThemeStore(
      (state) => state.updateTheme
    );


  const removeTheme =
    useThemeStore(
      (state) => state.removeTheme
    );


  const setSelectedTheme =
    useThemeStore(
      (state) => state.setSelectedTheme
    );


  const selectTheme =
    useThemeStore(
      (state) => state.selectTheme
    );


  const setDraft =
    useThemeStore(
      (state) => state.setDraft
    );


  const updateDraft =
    useThemeStore(
      (state) => state.updateDraft
    );


  const updateDraftColors =
    useThemeStore(
      (state) => state.updateDraftColors
    );


  const updateDraftTypography =
    useThemeStore(
      (state) => state.updateDraftTypography
    );


  const updateDraftSections =
    useThemeStore(
      (state) => state.updateDraftSections
    );


  const updateDraftSettings =
    useThemeStore(
      (state) => state.updateDraftSettings
    );


  const clearDraft =
    useThemeStore(
      (state) => state.clearDraft
    );


  const setPreviewing =
    useThemeStore(
      (state) => state.setPreviewing
    );


  const setLoading =
    useThemeStore(
      (state) => state.setLoading
    );


  const setSaving =
    useThemeStore(
      (state) => state.setSaving
    );


  const setLoaded =
    useThemeStore(
      (state) => state.setLoaded
    );


  const startGeneration =
    useThemeStore(
      (state) => state.startGeneration
    );


  const setGenerationResult =
    useThemeStore(
      (state) => state.setGenerationResult
    );


  const setGenerationError =
    useThemeStore(
      (state) => state.setGenerationError
    );


  const clearGeneration =
    useThemeStore(
      (state) => state.clearGeneration
    );


  const setError =
    useThemeStore(
      (state) => state.setError
    );


  const clearError =
    useThemeStore(
      (state) => state.clearError
    );


  const reset =
    useThemeStore(
      (state) => state.reset
    );



  // ==========================================================================
  // CALLBACKS
  // ==========================================================================


  const handleSetThemes =
    useCallback(
      (
        value: Theme[]
      ) => {

        setThemes(value);

      },
      [setThemes]
    );



  const handleAddTheme =
    useCallback(
      (
        theme: Theme
      ) => {

        addTheme(theme);

      },
      [addTheme]
    );



  const handleUpdateTheme =
    useCallback(
      (
        themeId: string,
        updates: Partial<Theme>
      ) => {

        updateTheme(
          themeId,
          updates
        );

      },
      [updateTheme]
    );



  const handleRemoveTheme =
    useCallback(
      (
        themeId: string
      ) => {

        removeTheme(themeId);

      },
      [removeTheme]
    );



  const handleSetSelectedTheme =
    useCallback(
      (
        theme: Theme | null
      ) => {

        setSelectedTheme(theme);

      },
      [setSelectedTheme]
    );



  const handleSelectTheme =
    useCallback(
      (
        themeId: string
      ) => {

        selectTheme(themeId);

      },
      [selectTheme]
    );



  // ==========================================================================
  // DRAFT
  // ==========================================================================


  const handleSetDraft =
    useCallback(
      (
        value: ThemeDraft | null
      ) => {

        setDraft(value);

      },
      [setDraft]
    );



  const handleUpdateDraft =
    useCallback(
      (
        updates: ThemeDraft
      ) => {

        updateDraft(updates);

      },
      [updateDraft]
    );



  const handleUpdateColors =
    useCallback(
      (
        colors: Partial<ThemeColors>
      ) => {

        updateDraftColors(colors);

      },
      [updateDraftColors]
    );



  const handleUpdateTypography =
    useCallback(
      (
        typography: Partial<ThemeTypography>
      ) => {

        updateDraftTypography(
          typography
        );

      },
      [updateDraftTypography]
    );



  const handleUpdateSections =
    useCallback(
      (
        sections: ThemeSection[]
      ) => {

        updateDraftSections(
          sections
        );

      },
      [updateDraftSections]
    );



  const handleUpdateSettings =
    useCallback(
      (
        settings: Record<string, unknown>
      ) => {

        updateDraftSettings(
          settings
        );

      },
      [updateDraftSettings]
    );



  const handleClearDraft =
    useCallback(
      () => {

        clearDraft();

      },
      [clearDraft]
    );



  // ==========================================================================
  // AI GENERATION
  // ==========================================================================


  const handleStartGeneration =
    useCallback(
      () => {

        startGeneration();

      },
      [startGeneration]
    );



  const handleGenerationResult =
    useCallback(
      (
        result: ThemeDraft
      ) => {

        setGenerationResult(result);

      },
      [setGenerationResult]
    );



  const handleGenerationError =
    useCallback(
      (
        generationError: string | null
      ) => {

        setGenerationError(
          generationError
        );

      },
      [setGenerationError]
    );



  const handleClearGeneration =
    useCallback(
      () => {

        clearGeneration();

      },
      [clearGeneration]
    );



  // ==========================================================================
  // ERROR / RESET
  // ==========================================================================


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
    // Theme data
    // ------------------------------------------------------------------------

    themes,

    selectedTheme,

    activeTheme:
      selectedTheme,



    // ------------------------------------------------------------------------
    // Editor
    // ------------------------------------------------------------------------

    draft,



    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    isLoading,

    isSaving,

    isLoaded,

    isPreviewing,

    error,



    // ------------------------------------------------------------------------
    // Generation
    // ------------------------------------------------------------------------

    generation,

    isGenerating:
      generation.isGenerating,

    generationError:
      generation.error,

    generationResult:
      generation.result,



    // ------------------------------------------------------------------------
    // Theme actions
    // ------------------------------------------------------------------------

    setThemes:
      handleSetThemes,

    addTheme:
      handleAddTheme,

    updateTheme:
      handleUpdateTheme,

    removeTheme:
      handleRemoveTheme,



    // ------------------------------------------------------------------------
    // Selection
    // ------------------------------------------------------------------------

    setSelectedTheme:
      handleSetSelectedTheme,

    selectTheme:
      handleSelectTheme,



    // ------------------------------------------------------------------------
    // Draft editor
    // ------------------------------------------------------------------------

    setDraft:
      handleSetDraft,

    updateDraft:
      handleUpdateDraft,

    updateDraftColors:
      handleUpdateColors,

    updateDraftTypography:
      handleUpdateTypography,

    updateDraftSections:
      handleUpdateSections,

    updateDraftSettings:
      handleUpdateSettings,

    clearDraft:
      handleClearDraft,



    // ------------------------------------------------------------------------
    // Preview
    // ------------------------------------------------------------------------

    setPreviewing,



    // ------------------------------------------------------------------------
    // Loading
    // ------------------------------------------------------------------------

    setLoading,

    setSaving,

    setLoaded,



    // ------------------------------------------------------------------------
    // AI generation
    // ------------------------------------------------------------------------

    startGeneration:
      handleStartGeneration,

    setGenerationResult:
      handleGenerationResult,

    setGenerationError:
      handleGenerationError,

    clearGeneration:
      handleClearGeneration,



    // ------------------------------------------------------------------------
    // Error/reset
    // ------------------------------------------------------------------------

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

export default useTheme;
