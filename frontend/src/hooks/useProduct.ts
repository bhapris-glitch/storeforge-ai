/**
 * ============================================================================
 * StoreForge AI
 * useProduct Hook
 * ============================================================================
 *
 * File:
 * frontend/src/hooks/useProduct.ts
 *
 * Purpose:
 * - Provide a clean React interface for product state
 * - Manage products for the active store
 * - Manage selected product
 * - Manage product drafts
 * - Manage AI product-generation state
 *
 * IMPORTANT:
 * - This hook does not call the API directly.
 * - API operations belong in product.service.ts.
 * - No chatbot/customer conversation logic belongs here.
 * - Backend remains the source of truth.
 *
 * ============================================================================
 */

'use client';

import { useCallback } from 'react';

import {
  useProductStore
} from '@/store';

import type {
  Product,
  ProductDraft
} from '@/store';


// ============================================================================
// HOOK
// ============================================================================

export function useProduct() {

  // ==========================================================================
  // STATE
  // ==========================================================================

  const products =
    useProductStore(
      (state) => state.products
    );


  const selectedProduct =
    useProductStore(
      (state) => state.selectedProduct
    );


  const draft =
    useProductStore(
      (state) => state.draft
    );


  const isLoading =
    useProductStore(
      (state) => state.isLoading
    );


  const isSaving =
    useProductStore(
      (state) => state.isSaving
    );


  const isLoaded =
    useProductStore(
      (state) => state.isLoaded
    );


  const generation =
    useProductStore(
      (state) => state.generation
    );


  const error =
    useProductStore(
      (state) => state.error
    );


  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const setProducts =
    useProductStore(
      (state) => state.setProducts
    );


  const addProduct =
    useProductStore(
      (state) => state.addProduct
    );


  const updateProduct =
    useProductStore(
      (state) => state.updateProduct
    );


  const removeProduct =
    useProductStore(
      (state) => state.removeProduct
    );


  const setSelectedProduct =
    useProductStore(
      (state) => state.setSelectedProduct
    );


  const selectProduct =
    useProductStore(
      (state) => state.selectProduct
    );


  const setDraft =
    useProductStore(
      (state) => state.setDraft
    );


  const updateDraft =
    useProductStore(
      (state) => state.updateDraft
    );


  const clearDraft =
    useProductStore(
      (state) => state.clearDraft
    );


  const setLoading =
    useProductStore(
      (state) => state.setLoading
    );


  const setSaving =
    useProductStore(
      (state) => state.setSaving
    );


  const setLoaded =
    useProductStore(
      (state) => state.setLoaded
    );


  const startGeneration =
    useProductStore(
      (state) => state.startGeneration
    );


  const setGenerationResult =
    useProductStore(
      (state) => state.setGenerationResult
    );


  const setGenerationError =
    useProductStore(
      (state) => state.setGenerationError
    );


  const clearGeneration =
    useProductStore(
      (state) => state.clearGeneration
    );


  const setError =
    useProductStore(
      (state) => state.setError
    );


  const clearError =
    useProductStore(
      (state) => state.clearError
    );


  const reset =
    useProductStore(
      (state) => state.reset
    );


  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

  const handleSetProducts =
    useCallback(
      (
        value: Product[]
      ) => {

        setProducts(value);

      },
      [setProducts]
    );


  const handleAddProduct =
    useCallback(
      (
        product: Product
      ) => {

        addProduct(product);

      },
      [addProduct]
    );


  const handleUpdateProduct =
    useCallback(
      (
        productId: string,
        updates: Partial<Product>
      ) => {

        updateProduct(
          productId,
          updates
        );

      },
      [updateProduct]
    );


  const handleRemoveProduct =
    useCallback(
      (
        productId: string
      ) => {

        removeProduct(
          productId
        );

      },
      [removeProduct]
    );


  const handleSetSelectedProduct =
    useCallback(
      (
        product: Product | null
      ) => {

        setSelectedProduct(
          product
        );

      },
      [setSelectedProduct]
    );


  const handleSelectProduct =
    useCallback(
      (
        productId: string
      ) => {

        selectProduct(
          productId
        );

      },
      [selectProduct]
    );


  const handleSetDraft =
    useCallback(
      (
        value: ProductDraft | null
      ) => {

        setDraft(value);

      },
      [setDraft]
    );


  const handleUpdateDraft =
    useCallback(
      (
        updates: ProductDraft
      ) => {

        updateDraft(
          updates
        );

      },
      [updateDraft]
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
        result: ProductDraft
      ) => {

        setGenerationResult(
          result
        );

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
    // Products
    // ------------------------------------------------------------------------

    products,

    selectedProduct,

    activeProduct:
      selectedProduct,


    // ------------------------------------------------------------------------
    // Editor
    // ------------------------------------------------------------------------

    draft,


    // ------------------------------------------------------------------------
    // Loading / state
    // ------------------------------------------------------------------------

    isLoading,

    isSaving,

    isLoaded,


    // ------------------------------------------------------------------------
    // AI generation
    // ------------------------------------------------------------------------

    generation,

    isGenerating:
      generation.isGenerating,

    generationError:
      generation.error,

    generationResult:
      generation.result,


    // ------------------------------------------------------------------------
    // General error
    // ------------------------------------------------------------------------

    error,


    // ------------------------------------------------------------------------
    // Product actions
    // ------------------------------------------------------------------------

    setProducts:
      handleSetProducts,

    addProduct:
      handleAddProduct,

    updateProduct:
      handleUpdateProduct,

    removeProduct:
      handleRemoveProduct,


    // ------------------------------------------------------------------------
    // Selection
    // ------------------------------------------------------------------------

    setSelectedProduct:
      handleSetSelectedProduct,

    selectProduct:
      handleSelectProduct,


    // ------------------------------------------------------------------------
    // Draft
    // ------------------------------------------------------------------------

    setDraft:
      handleSetDraft,

    updateDraft:
      handleUpdateDraft,

    clearDraft:
      handleClearDraft,


    // ------------------------------------------------------------------------
    // Loading / saving
    // ------------------------------------------------------------------------

    setLoading,

    setSaving,

    setLoaded,


    // ------------------------------------------------------------------------
    // AI generation actions
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
    // Error / reset
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

export default useProduct;
