/**
 * ============================================================================
 * StoreForge AI
 * useBranding Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useBranding.ts
 *
 * Purpose:
 * - Provide a clean React interface for branding state
 * - Manage the active store's branding
 * - Update brand identity, colors, fonts and logo
 * - Manage branding loading/saving/error state
 *
 * IMPORTANT:
 * - This hook does not call the API directly.
 * - API operations belong in branding.service.ts.
 * - Backend remains the source of truth.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useBrandingStore
} from '@/store';

import type {
  Branding,
  BrandColors,
  BrandFonts,
  BrandLogo
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useBranding() {

  // ==========================================================================
  // STATE
  // ==========================================================================

  const branding =
    useBrandingStore(
      (state) => state.branding
    );


  const isLoading =
    useBrandingStore(
      (state) => state.isLoading
    );


  const isSaving =
    useBrandingStore(
      (state) => state.isSaving
    );


  const isLoaded =
    useBrandingStore(
      (state) => state.isLoaded
    );


  const error =
    useBrandingStore(
      (state) => state.error
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setBranding =
    useBrandingStore(
      (state) => state.setBranding
    );


  const updateBranding =
    useBrandingStore(
      (state) => state.updateBranding
    );


  const updateColors =
    useBrandingStore(
      (state) => state.updateColors
    );


  const updateFonts =
    useBrandingStore(
      (state) => state.updateFonts
    );


  const updateLogo =
    useBrandingStore(
      (state) => state.updateLogo
    );


  const setLoading =
    useBrandingStore(
      (state) => state.setLoading
    );


  const setSaving =
    useBrandingStore(
      (state) => state.setSaving
    );


  const setLoaded =
    useBrandingStore(
      (state) => state.setLoaded
    );


  const setError =
    useBrandingStore(
      (state) => state.setError
    );


  const clearError =
    useBrandingStore(
      (state) => state.clearError
    );


  const clearBranding =
    useBrandingStore(
      (state) => state.clearBranding
    );


  const reset =
    useBrandingStore(
      (state) => state.reset
    );


  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

  const handleSetBranding =
    useCallback(
      (
        value: Branding | null
      ) => {

        setBranding(value);

      },
      [setBranding]
    );


  const handleUpdateBranding =
    useCallback(
      (
        updates: Partial<Branding>
      ) => {

        updateBranding(
          updates
        );

      },
      [updateBranding]
    );


  const handleUpdateColors =
    useCallback(
      (
        colors: Partial<BrandColors>
      ) => {

        updateColors(
          colors
        );

      },
      [updateColors]
    );


  const handleUpdateFonts =
    useCallback(
      (
        fonts: Partial<BrandFonts>
      ) => {

        updateFonts(
          fonts
        );

      },
      [updateFonts]
    );


  const handleUpdateLogo =
    useCallback(
      (
        logo: Partial<BrandLogo>
      ) => {

        updateLogo(
          logo
        );

      },
      [updateLogo]
    );


  const handleClearError =
    useCallback(
      () => {

        clearError();

      },
      [clearError]
    );


  const handleClearBranding =
    useCallback(
      () => {

        clearBranding();

      },
      [clearBranding]
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
    // Branding
    // ------------------------------------------------------------------------

    branding,


    // Convenient alias for UI components.
    brand:
      branding,


    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    isLoading,

    isSaving,

    isLoaded,

    error,


    // ------------------------------------------------------------------------
    // Branding actions
    // ------------------------------------------------------------------------

    setBranding:
      handleSetBranding,

    updateBranding:
      handleUpdateBranding,

    updateColors:
      handleUpdateColors,

    updateFonts:
      handleUpdateFonts,

    updateLogo:
      handleUpdateLogo,


    // ------------------------------------------------------------------------
    // State actions
    // ------------------------------------------------------------------------

    setLoading,

    setSaving,

    setLoaded,

    setError,

    clearError:
      handleClearError,

    clearBranding:
      handleClearBranding,

    reset:
      handleReset

  };

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useBranding;
