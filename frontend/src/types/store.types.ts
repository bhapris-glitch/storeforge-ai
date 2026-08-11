/**
 * ============================================================================
 * StoreForge AI
 * Store Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/store.types.ts
 *
 * Purpose:
 * - Shared store/merchant types
 * - Shopify connection state
 * - Store settings
 * - Store API request/response types
 *
 * IMPORTANT:
 * - Never expose Shopify Admin API access tokens in frontend state/types.
 * - Backend remains responsible for Shopify credentials and authorization.
 *
 * ============================================================================
 */


// ============================================================================
// STORE PLATFORM
// ============================================================================

export type StorePlatform =

  | 'shopify'
  | 'woocommerce'
  | 'custom';


// ============================================================================
// STORE STATUS
// ============================================================================

export type StoreStatus =

  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'disconnected'
  | 'error';


// ============================================================================
// SHOPIFY CONNECTION STATUS
// ============================================================================

export type ShopifyConnectionStatus =

  | 'connected'
  | 'disconnected'
  | 'pending'
  | 'error';


// ============================================================================
// STORE
// ============================================================================

export interface Store {

  id: string;

  _id?: string;

  name: string;

  domain: string;

  platform: StorePlatform;

  status?: StoreStatus;

  ownerId?: string;

  description?: string;

  logoUrl?: string;

  faviconUrl?: string;

  currency?: string;

  timezone?: string;

  country?: string;

  language?: string;

  email?: string;

  phone?: string;

  websiteUrl?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// SHOPIFY STORE
// ============================================================================

export interface ShopifyStore
  extends Store {

  platform: 'shopify';

  shopifyDomain?: string;

  shopifyShopId?: string;

  shopifyStoreName?: string;

  shopifyAdminUrl?: string;

  shopifyStorefrontUrl?: string;

  shopifyConnectionStatus?: ShopifyConnectionStatus;

  shopifyInstalledAt?: string;

  shopifyLastSyncedAt?: string;

}


// ============================================================================
// STORE SETTINGS
// ============================================================================

export interface StoreSettings {

  currency?: string;

  timezone?: string;

  language?: string;

  autoSync?: boolean;

  syncProducts?: boolean;

  syncOrders?: boolean;

  syncCustomers?: boolean;

  notificationsEnabled?: boolean;

  analyticsEnabled?: boolean;

}


// ============================================================================
// STORE SETTINGS UPDATE
// ============================================================================

export type StoreSettingsUpdate =
  Partial<StoreSettings>;


// ============================================================================
// CREATE STORE REQUEST
// ============================================================================

export interface CreateStoreRequest {

  name: string;

  domain: string;

  platform: StorePlatform;

  country?: string;

  currency?: string;

  timezone?: string;

  language?: string;

}


// ============================================================================
// UPDATE STORE REQUEST
// ============================================================================

export interface UpdateStoreRequest {

  name?: string;

  domain?: string;

  description?: string;

  logoUrl?: string | null;

  faviconUrl?: string | null;

  currency?: string;

  timezone?: string;

  country?: string;

  language?: string;

  email?: string;

  phone?: string;

  websiteUrl?: string;

}


// ============================================================================
// STORE RESPONSE
// ============================================================================

export interface StoreResponse {

  store: Store;

  message?: string;

}


// ============================================================================
// STORES RESPONSE
// ============================================================================

export interface StoresResponse {

  stores: Store[];

  message?: string;

}


// ============================================================================
// STORE SETTINGS RESPONSE
// ============================================================================

export interface StoreSettingsResponse {

  settings: StoreSettings;

  message?: string;

}


// ============================================================================
// SHOPIFY CONNECTION RESPONSE
// ============================================================================

export interface ShopifyConnectionResponse {

  connected: boolean;

  status?: ShopifyConnectionStatus;

  shop?: ShopifyStore | null;

  message?: string;

}


// ============================================================================
// STORE STATE
// ============================================================================

export interface StoreState {

  stores: Store[];

  currentStore: Store | null;

  isLoading: boolean;

  isLoaded: boolean;

  error: string | null;

}
