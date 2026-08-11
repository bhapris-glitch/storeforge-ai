/**
 * ============================================================================
 * StoreForge AI
 * Shopify Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/shopify.service.ts
 *
 * Purpose:
 * - Start Shopify OAuth installation
 * - Check Shopify connection status
 * - Get connected Shopify stores
 * - Manage Shopify integration state
 *
 * ============================================================================
 */

'use client';

import {
  shopifyApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface ShopifyStore {

  id: string;

  _id?: string;

  storeId?: string;

  shopDomain: string;

  shopName?: string;

  email?: string;

  country?: string;

  currency?: string;

  status?: string;

  isConnected?: boolean;

  accessToken?: string;

  installedAt?: string;

  createdAt?: string;

  updatedAt?: string;

}



export interface ShopifyInstallData {

  shop: string;

  storeId?: string;

  redirectUri?: string;

}



export interface ShopifyInstallResponse {

  success?: boolean;

  message?: string;

  installUrl?: string;

  authUrl?: string;

  redirectUrl?: string;

  data?: {

    installUrl?: string;

    authUrl?: string;

    redirectUrl?: string;

  };

}



export interface ShopifyStoresResponse {

  success?: boolean;

  message?: string;

  stores?: ShopifyStore[];

  data?:
    | ShopifyStore[]
    | {
        stores?: ShopifyStore[];
      };

}



export interface ShopifyStatusResponse {

  success?: boolean;

  message?: string;

  connected?: boolean;

  status?: string;

  store?: ShopifyStore;

  data?: {

    connected?: boolean;

    status?: string;

    store?: ShopifyStore;

  };

}


// ============================================================================
// HELPERS
// ============================================================================

function extractInstallUrl(
  response: ShopifyInstallResponse
): string | null {

  return (
    response.installUrl ||
    response.authUrl ||
    response.redirectUrl ||
    response.data?.installUrl ||
    response.data?.authUrl ||
    response.data?.redirectUrl ||
    null
  );

}



function extractStores(
  response: ShopifyStoresResponse
): ShopifyStore[] {

  if (
    Array.isArray(response.stores)
  ) {

    return response.stores;

  }


  if (
    Array.isArray(response.data)
  ) {

    return response.data;

  }


  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.stores)
  ) {

    return response.data.stores;

  }


  return [];

}


// ============================================================================
// START SHOPIFY INSTALLATION
// ============================================================================
//
// Flow:
//
// Dashboard
//    ↓
// User enters Shopify store URL
//    ↓
// Backend creates OAuth URL
//    ↓
// Frontend redirects merchant to Shopify
//
// ============================================================================

export async function installShopify(
  data: ShopifyInstallData
): Promise<string> {


  if (
    !data.shop
  ) {

    throw new Error(
      'Shopify store domain is required.'
    );

  }


  const response =
    await shopifyApi.install<ShopifyInstallResponse>(
      data as Record<string, unknown>
    );


  const url =
    extractInstallUrl(
      response
    );


  if (!url) {

    throw new Error(
      'Shopify installation URL was not generated.'
    );

  }


  return url;

}


// ============================================================================
// REDIRECT TO SHOPIFY
// ============================================================================

export async function startShopifyInstall(
  shop: string
): Promise<void> {


  const installUrl =
    await installShopify(
      {
        shop
      }
    );


  window.location.href =
    installUrl;

}


// ============================================================================
// GET CONNECTED STORES
// ============================================================================

export async function getShopifyStores()
: Promise<ShopifyStore[]> {


  const response =
    await shopifyApi.stores<ShopifyStoresResponse>();


  return extractStores(
    response
  );

}


// ============================================================================
// CHECK SHOPIFY CONNECTION STATUS
// ============================================================================

export async function getShopifyStatus(
  storeId: string
): Promise<ShopifyStatusResponse> {


  if (
    !storeId
  ) {

    throw new Error(
      'Store ID is required.'
    );

  }


  return shopifyApi.status<ShopifyStatusResponse>(
    storeId
  );

}


// ============================================================================
// STATUS HELPERS
// ============================================================================

export function isShopifyConnected(
  response: ShopifyStatusResponse
): boolean {

  return Boolean(

    response.connected ||

    response.data?.connected ||

    response.store?.isConnected ||

    response.status === 'connected'

  );

}



export function getShopifyStatusText(
  store?: ShopifyStore
): string {


  if (!store) {

    return 'Not connected';

  }


  if (
    store.isConnected ||
    store.status === 'connected'
  ) {

    return 'Connected';

  }


  if (
    store.status === 'pending'
  ) {

    return 'Installation pending';

  }


  if (
    store.status === 'failed'
  ) {

    return 'Connection failed';

  }


  return 'Disconnected';

}


// ============================================================================
// SHOP DOMAIN NORMALIZER
// ============================================================================
//
// Accepts:
//
// mystore.myshopify.com
// https://mystore.myshopify.com
// mystore
//
// Returns:
//
// mystore.myshopify.com
//
// ============================================================================

export function normalizeShopDomain(
  shop: string
): string {


  let domain =
    shop
      .trim()
      .replace(
        /^https?:\/\//,
        ''
      )
      .replace(
        /\/.*$/,
        ''
      );


  if (
    !domain.includes('.')
  ) {

    domain =
      `${domain}.myshopify.com`;

  }


  return domain;

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const shopifyService = {

  installShopify,

  startShopifyInstall,

  getShopifyStores,

  getShopifyStatus,

  isShopifyConnected,

  getShopifyStatusText,

  normalizeShopDomain

};


export default shopifyService;
