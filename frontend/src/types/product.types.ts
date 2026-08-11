/**
 * ============================================================================
 * StoreForge AI
 * Product Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/product.types.ts
 *
 * Purpose:
 * - Shared product types
 * - Product catalog data
 * - Product variants
 * - Product media
 * - Product inventory
 * - Product creation/update requests
 * - AI product-generation types
 * - Product API responses
 *
 * IMPORTANT:
 * - This is for the SaaS store/product creation system.
 * - No chatbot/customer-conversation types belong here.
 *
 * ============================================================================
 */


// ============================================================================
// PRODUCT STATUS
// ============================================================================

export type ProductStatus =

  | 'draft'
  | 'active'
  | 'archived'
  | 'scheduled'
  | 'out_of_stock';


// ============================================================================
// PRODUCT TYPE
// ============================================================================

export type ProductType =

  | 'physical'
  | 'digital'
  | 'service'
  | 'subscription';


// ============================================================================
// PRODUCT MEDIA
// ============================================================================

export interface ProductMedia {

  id?: string;

  url: string;

  alt?: string;

  type?: 'image' | 'video';

  position?: number;

}


// ============================================================================
// PRODUCT OPTION
// ============================================================================

export interface ProductOption {

  id?: string;

  name: string;

  values: string[];

  position?: number;

}


// ============================================================================
// PRODUCT VARIANT
// ============================================================================

export interface ProductVariant {

  id?: string;

  sku?: string;

  title?: string;

  price: number;

  compareAtPrice?: number | null;

  currency?: string;

  barcode?: string;

  inventoryQuantity?: number;

  inventoryPolicy?: 'deny' | 'continue';

  weight?: number;

  weightUnit?: 'g' | 'kg' | 'oz' | 'lb';

  options?: Record<string, string>;

  imageUrl?: string | null;

  available?: boolean;

}


// ============================================================================
// PRODUCT SEO
// ============================================================================

export interface ProductSEO {

  title?: string;

  description?: string;

  keywords?: string[];

  slug?: string;

}


// ============================================================================
// PRODUCT
// ============================================================================

export interface Product {

  id: string;

  _id?: string;

  storeId: string;

  title: string;

  description?: string;

  shortDescription?: string;

  handle?: string;

  status?: ProductStatus;

  type?: ProductType;

  vendor?: string;

  brand?: string;

  category?: string;

  tags?: string[];

  price?: number;

  compareAtPrice?: number | null;

  costPrice?: number | null;

  currency?: string;

  sku?: string;

  barcode?: string;

  inventoryQuantity?: number;

  trackInventory?: boolean;

  allowBackorder?: boolean;

  weight?: number;

  weightUnit?: 'g' | 'kg' | 'oz' | 'lb';

  media?: ProductMedia[];

  images?: string[];

  options?: ProductOption[];

  variants?: ProductVariant[];

  seo?: ProductSEO;

  publishedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// PRODUCT DRAFT
// ============================================================================

export interface ProductDraft {

  title?: string;

  description?: string;

  shortDescription?: string;

  handle?: string;

  status?: ProductStatus;

  type?: ProductType;

  vendor?: string;

  brand?: string;

  category?: string;

  tags?: string[];

  price?: number;

  compareAtPrice?: number | null;

  costPrice?: number | null;

  currency?: string;

  sku?: string;

  barcode?: string;

  inventoryQuantity?: number;

  trackInventory?: boolean;

  allowBackorder?: boolean;

  weight?: number;

  weightUnit?: 'g' | 'kg' | 'oz' | 'lb';

  media?: ProductMedia[];

  images?: string[];

  options?: ProductOption[];

  variants?: ProductVariant[];

  seo?: ProductSEO;

}


// ============================================================================
// CREATE PRODUCT REQUEST
// ============================================================================

export interface CreateProductRequest {

  storeId: string;

  title: string;

  description?: string;

  shortDescription?: string;

  handle?: string;

  status?: ProductStatus;

  type?: ProductType;

  vendor?: string;

  brand?: string;

  category?: string;

  tags?: string[];

  price?: number;

  compareAtPrice?: number | null;

  costPrice?: number | null;

  currency?: string;

  sku?: string;

  barcode?: string;

  inventoryQuantity?: number;

  trackInventory?: boolean;

  allowBackorder?: boolean;

  weight?: number;

  weightUnit?: 'g' | 'kg' | 'oz' | 'lb';

  media?: ProductMedia[];

  options?: ProductOption[];

  variants?: ProductVariant[];

  seo?: ProductSEO;

}


// ============================================================================
// UPDATE PRODUCT REQUEST
// ============================================================================

export type UpdateProductRequest =
  Partial<Omit<CreateProductRequest, 'storeId'>>;


// ============================================================================
// PRODUCT LIST QUERY
// ============================================================================

export interface ProductListQuery {

  storeId: string;

  page?: number;

  limit?: number;

  search?: string;

  status?: ProductStatus;

  category?: string;

  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'price';

  sortOrder?: 'asc' | 'desc';

}


// ============================================================================
// PRODUCT PAGINATION
// ============================================================================

export interface ProductPagination {

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

}


// ============================================================================
// PRODUCT LIST RESPONSE
// ============================================================================

export interface ProductsResponse {

  products: Product[];

  pagination?: ProductPagination;

  message?: string;

}


// ============================================================================
// SINGLE PRODUCT RESPONSE
// ============================================================================

export interface ProductResponse {

  product: Product;

  message?: string;

}


// ============================================================================
// AI PRODUCT GENERATION REQUEST
// ============================================================================

export interface GenerateProductRequest {

  storeId: string;

  productName?: string;

  category?: string;

  industry?: string;

  targetAudience?: string;

  keywords?: string[];

  productDescription?: string;

  tone?: string;

  language?: string;

  currency?: string;

  includeSEO?: boolean;

  includeTags?: boolean;

  includeVariants?: boolean;

}


// ============================================================================
// AI PRODUCT GENERATION RESULT
// ============================================================================

export interface ProductGenerationResult {

  title?: string;

  description?: string;

  shortDescription?: string;

  handle?: string;

  category?: string;

  tags?: string[];

  vendor?: string;

  seo?: ProductSEO;

  variants?: ProductVariant[];

}


// ============================================================================
// AI PRODUCT GENERATION RESPONSE
// ============================================================================

export interface ProductGenerationResponse {

  product?: Product;

  result?: ProductGenerationResult;

  generated?: boolean;

  message?: string;

}


// ============================================================================
// PRODUCT GENERATION STATE
// ============================================================================

export interface ProductGenerationState {

  isGenerating: boolean;

  progress?: number;

  result: ProductDraft | null;

  error: string | null;

}


// ============================================================================
// PRODUCT STATE
// ============================================================================

export interface ProductState {

  products: Product[];

  selectedProduct: Product | null;

  draft: ProductDraft | null;

  isLoading: boolean;

  isSaving: boolean;

  isLoaded: boolean;

  generation: ProductGenerationState;

  error: string | null;

}
