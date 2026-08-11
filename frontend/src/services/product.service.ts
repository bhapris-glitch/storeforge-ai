/**
 * ============================================================================
 * StoreForge AI
 * Product Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/product.service.ts
 *
 * Purpose:
 * - List products
 * - Get a single product
 * - Create product drafts
 * - Generate products with AI
 * - Update products
 * - Delete products
 *
 * NOT FOR:
 * - Chatbot
 * - Sales agent
 * - Customer conversations
 *
 * ============================================================================
 */

'use client';

import {
  productApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface ProductSEO {
  title?: string;

  description?: string;

  keywords?: string[];

  handle?: string;
}


export interface ProductMarketing {
  shortDescription?: string;

  sellingPoints?: string[];

  benefits?: string[];

  features?: string[];

  useCases?: string[];

  targetAudience?: string;

  callToAction?: string;
}


export interface ProductPricing {
  price?: number;

  compareAtPrice?: number;

  costPerItem?: number;

  currency?: string;

  pricingStrategy?: string;
}


export interface Product {
  id: string;

  _id?: string;

  storeId?: string;

  userId?: string;

  title: string;

  productType?: string;

  category?: string;

  subcategory?: string;

  vendor?: string;

  description?: string;

  shortDescription?: string;

  tags?: string[];

  images?: string[];

  materials?: string[];

  colors?: string[];

  sizes?: string[];

  specifications?: Record<
    string,
    unknown
  >;

  pricing?: ProductPricing;

  marketing?: ProductMarketing;

  seo?: ProductSEO;

  status?: string;

  shopifyProductId?: string;

  shopifySyncStatus?: string;

  createdAt?: string;

  updatedAt?: string;
}


// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateProductData {
  title: string;

  productType?: string;

  category?: string;

  subcategory?: string;

  vendor?: string;

  description?: string;

  shortDescription?: string;

  tags?: string[];

  images?: string[];

  materials?: string[];

  colors?: string[];

  sizes?: string[];

  specifications?: Record<
    string,
    unknown
  >;

  pricing?: ProductPricing;

  marketing?: ProductMarketing;

  seo?: ProductSEO;
}


export interface GenerateProductData {

  productIdea: string;

  targetMarket?: string;

  niche?: string;

  tone?: string;

  language?: string;

  storeName?: string;

  model?: string;

  temperature?: number;

  maxTokens?: number;
}


export interface UpdateProductData
  extends Partial<CreateProductData> {

  status?: string;

}


// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ProductResponse {

  success?: boolean;

  message?: string;

  product?: Product;

  data?:
    | Product
    | {
        product?: Product;
      };

}


export interface ProductsResponse {

  success?: boolean;

  message?: string;

  products?: Product[];

  data?:
    | Product[]
    | {
        products?: Product[];
      };

}


export interface GenerateProductResponse {

  success?: boolean;

  message?: string;

  product?: Product;

  data?: {

    product?: Product;

    tokensUsed?: number;

    model?: string;

    provider?: string;

    generationTimeMs?: number;

  };

}


// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function extractProduct(
  response: ProductResponse
): Product | null {

  if (response.product) {

    return response.product;

  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (
      'product' in response.data &&
      response.data.product
    ) {

      return response.data.product;

    }


    if (
      'id' in response.data ||
      '_id' in response.data
    ) {

      return response.data as Product;

    }

  }


  return null;

}


function extractProducts(
  response: ProductsResponse
): Product[] {

  if (
    Array.isArray(
      response.products
    )
  ) {

    return response.products;

  }


  if (
    response.data &&
    Array.isArray(
      response.data
    )
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(
      response.data
    ) &&
    Array.isArray(
      response.data.products
    )
  ) {

    return response.data.products;

  }


  return [];

}


// ============================================================================
// GET PRODUCTS
// ============================================================================

export async function getProducts(
  storeId: string
): Promise<Product[]> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await productApi.list<ProductsResponse>(
      storeId
    );


  return extractProducts(
    response
  );

}


// ============================================================================
// GET SINGLE PRODUCT
// ============================================================================

export async function getProduct(
  storeId: string,
  productId: string
): Promise<Product> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!productId) {

    throw new Error(
      'Product ID is required.'
    );

  }


  const response =
    await productApi.get<ProductResponse>(
      storeId,
      productId
    );


  const product =
    extractProduct(
      response
    );


  if (!product) {

    throw new Error(
      'Product was not returned by the server.'
    );

  }


  return product;

}


// ============================================================================
// CREATE PRODUCT
// ============================================================================

export async function createProduct(
  storeId: string,
  data: CreateProductData
): Promise<Product> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!data.title?.trim()) {

    throw new Error(
      'Product title is required.'
    );

  }


  const response =
    await productApi.create<ProductResponse>(
      storeId,
      data as Record<string, unknown>
    );


  const product =
    extractProduct(
      response
    );


  if (!product) {

    throw new Error(
      'Product was not returned after creation.'
    );

  }


  return product;

}


// ============================================================================
// GENERATE PRODUCT WITH AI
// ============================================================================
//
// This is the main StoreForge product-generation operation.
//
// The frontend sends the product idea to the backend.
// The backend handles the actual AI provider/API.
//

export async function generateProduct(
  storeId: string,
  data: GenerateProductData
): Promise<GenerateProductResponse> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (
    !data.productIdea?.trim()
  ) {

    throw new Error(
      'Product idea is required.'
    );

  }


  return productApi.generate<GenerateProductResponse>(
    storeId,
    data as Record<string, unknown>
  );

}


// ============================================================================
// UPDATE PRODUCT
// ============================================================================

export async function updateProduct(
  storeId: string,
  productId: string,
  data: UpdateProductData
): Promise<Product> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!productId) {

    throw new Error(
      'Product ID is required.'
    );

  }


  const response =
    await productApi.update<ProductResponse>(
      storeId,
      productId,
      data as Record<string, unknown>
    );


  const product =
    extractProduct(
      response
    );


  if (!product) {

    throw new Error(
      'Product was not returned after update.'
    );

  }


  return product;

}


// ============================================================================
// DELETE PRODUCT
// ============================================================================

export async function deleteProduct(
  storeId: string,
  productId: string
): Promise<void> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!productId) {

    throw new Error(
      'Product ID is required.'
    );

  }


  await productApi.delete(
    storeId,
    productId
  );

}


// ============================================================================
// PRODUCT STATUS
// ============================================================================

export function isProductReady(
  product: Product
): boolean {

  return (
    product.status === 'ready' ||
    product.status === 'generated' ||
    product.status === 'completed'
  );

}


// ============================================================================
// SHOPIFY SYNC STATUS
// ============================================================================

export function isProductSynced(
  product: Product
): boolean {

  return (
    product.shopifySyncStatus === 'synced' ||
    Boolean(
      product.shopifyProductId
    )
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const productService = {

  getProducts,

  getProduct,

  createProduct,

  generateProduct,

  updateProduct,

  deleteProduct,

  isProductReady,

  isProductSynced

};


export default productService;
