/**
 * ============================================================================
 * StoreForge AI
 * Product Store
 * ============================================================================
 *
 * File:
 * frontend/src/store/product.store.ts
 *
 * Purpose:
 * - Maintain products for the active store
 * - Manage selected product
 * - Manage AI product-generation state
 * - Manage product editing state
 * - Track loading/saving/generation states
 *
 * IMPORTANT:
 * - Backend/database remains the source of truth.
 * - This store contains UI/application state only.
 *
 * ============================================================================
 */

'use client';

import { create } from 'zustand';


// ============================================================================
// TYPES
// ============================================================================

export interface Product {

  id: string;

  _id?: string;

  storeId?: string;

  title: string;

  description?: string;

  shortDescription?: string;

  price?: number;

  compareAtPrice?: number;

  currency?: string;

  sku?: string;

  barcode?: string;

  images?: string[];

  category?: string;

  tags?: string[];

  vendor?: string;

  productType?: string;

  inventoryQuantity?: number;

  status?: string;

  handle?: string;

  seoTitle?: string;

  seoDescription?: string;

  seoKeywords?: string[];

  createdAt?: string;

  updatedAt?: string;

}


export interface ProductDraft
  extends Partial<Product> {

  id?: string;

}


// ============================================================================
// AI GENERATION STATE
// ============================================================================

export interface ProductGenerationState {

  isGenerating: boolean;

  error: string | null;

  result: ProductDraft | null;

}


// ============================================================================
// STORE STATE
// ============================================================================

interface ProductState {

  /**
   * Products belonging to the active store.
   */
  products: Product[];


  /**
   * Currently selected product.
   */
  selectedProduct: Product | null;


  /**
   * Current product draft being edited.
   */
  draft: ProductDraft | null;


  /**
   * Product list loading state.
   */
  isLoading: boolean;


  /**
   * Product save state.
   */
  isSaving: boolean;


  /**
   * Whether product data has been loaded.
   */
  isLoaded: boolean;


  /**
   * AI product generation state.
   */
  generation: ProductGenerationState;


  /**
   * General product error.
   */
  error: string | null;


  // --------------------------------------------------------------------------
  // Product list
  // --------------------------------------------------------------------------

  setProducts: (
    products: Product[]
  ) => void;


  addProduct: (
    product: Product
  ) => void;


  updateProduct: (
    productId: string,
    updates: Partial<Product>
  ) => void;


  removeProduct: (
    productId: string
  ) => void;


  // --------------------------------------------------------------------------
  // Selection
  // --------------------------------------------------------------------------

  setSelectedProduct: (
    product: Product | null
  ) => void;


  selectProduct: (
    productId: string
  ) => void;


  // --------------------------------------------------------------------------
  // Draft
  // --------------------------------------------------------------------------

  setDraft: (
    draft: ProductDraft | null
  ) => void;


  updateDraft: (
    updates: ProductDraft
  ) => void;


  clearDraft: () => void;


  // --------------------------------------------------------------------------
  // Loading / saving
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
    result: ProductDraft
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

const initialGenerationState: ProductGenerationState = {

  isGenerating: false,

  error: null,

  result: null

};


const initialState = {

  products: [],

  selectedProduct: null,

  draft: null,

  isLoading: false,

  isSaving: false,

  isLoaded: false,

  generation: initialGenerationState,

  error: null

} satisfies Pick<
  ProductState,
  | 'products'
  | 'selectedProduct'
  | 'draft'
  | 'isLoading'
  | 'isSaving'
  | 'isLoaded'
  | 'generation'
  | 'error'
>;


// ============================================================================
// STORE
// ============================================================================

export const useProductStore =
  create<ProductState>((set) => ({

    ...initialState,


    // ========================================================================
    // SET PRODUCTS
    // ========================================================================

    setProducts: (
      products
    ) => {

      set((state) => {

        let selectedProduct =
          state.selectedProduct;


        /*
         * Automatically select the first product
         * if nothing is currently selected.
         */

        if (
          !selectedProduct &&
          products.length > 0
        ) {

          selectedProduct =
            products[0];

        }


        /*
         * Keep the selected product synchronized
         * with the latest product list.
         */

        if (
          selectedProduct
        ) {

          const updatedProduct =
            products.find(
              (product) =>
                product.id ===
                selectedProduct?.id
            );


          if (
            updatedProduct
          ) {

            selectedProduct =
              updatedProduct;

          }

        }


        return {

          products,

          selectedProduct,

          isLoaded: true,

          error: null

        };

      });

    },


    // ========================================================================
    // ADD PRODUCT
    // ========================================================================

    addProduct: (
      product
    ) => {

      set((state) => ({

        products: [

          ...state.products,

          product

        ],

        selectedProduct:
          state.selectedProduct ||
          product,

        error: null

      }));

    },


    // ========================================================================
    // UPDATE PRODUCT
    // ========================================================================

    updateProduct: (
      productId,
      updates
    ) => {

      set((state) => {

        const products =
          state.products.map(
            (product) => {

              if (
                product.id !==
                productId
              ) {

                return product;

              }


              return {

                ...product,

                ...updates

              };

            }
          );


        let selectedProduct =
          state.selectedProduct;


        if (
          selectedProduct?.id ===
          productId
        ) {

          selectedProduct = {

            ...selectedProduct,

            ...updates

          };

        }


        return {

          products,

          selectedProduct

        };

      });

    },


    // ========================================================================
    // REMOVE PRODUCT
    // ========================================================================

    removeProduct: (
      productId
    ) => {

      set((state) => {

        const products =
          state.products.filter(
            (product) =>
              product.id !== productId
          );


        let selectedProduct =
          state.selectedProduct;


        if (
          selectedProduct?.id ===
          productId
        ) {

          selectedProduct =
            products[0] ||
            null;

        }


        return {

          products,

          selectedProduct,

          draft:
            state.draft?.id === productId
              ? null
              : state.draft

        };

      });

    },


    // ========================================================================
    // SET SELECTED PRODUCT
    // ========================================================================

    setSelectedProduct: (
      product
    ) => {

      set({

        selectedProduct:
          product,

        error: null

      });

    },


    // ========================================================================
    // SELECT PRODUCT BY ID
    // ========================================================================

    selectProduct: (
      productId
    ) => {

      set((state) => {

        const product =
          state.products.find(
            (item) =>
              item.id === productId
          );


        if (!product) {

          return {

            error:
              'Product not found.'

          };

        }


        return {

          selectedProduct:
            product,

          draft: {
            ...product
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
    // CLEAR DRAFT
    // ========================================================================

    clearDraft: () => {

      set({

        draft: null

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

        generation:
          initialGenerationState

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

export const productSelectors = {

  products: (
    state: ProductState
  ) => state.products,


  selectedProduct: (
    state: ProductState
  ) => state.selectedProduct,


  draft: (
    state: ProductState
  ) => state.draft,


  isLoading: (
    state: ProductState
  ) => state.isLoading,


  isSaving: (
    state: ProductState
  ) => state.isSaving,


  isLoaded: (
    state: ProductState
  ) => state.isLoaded,


  generation: (
    state: ProductState
  ) => state.generation,


  isGenerating: (
    state: ProductState
  ) => state.generation.isGenerating,


  error: (
    state: ProductState
  ) => state.error

};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default useProductStore;
