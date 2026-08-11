/**
 * ============================================================================
 * StoreForge AI
 * Store Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/store.service.ts
 *
 * Purpose:
 * - Fetch merchant stores
 * - Fetch a single store
 * - Create a store
 * - Update a store
 * - Delete a store
 *
 * ============================================================================
 */

'use client';

import {
  storeApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface Store {
  id: string;
  _id?: string;

  userId?: string;

  name: string;

  shopifyDomain?: string;

  shopifyShopId?: string;

  customDomain?: string;

  platform?: string;

  status?: string;

  isConnected?: boolean;

  currency?: string;

  country?: string;

  timezone?: string;

  logo?: string;

  createdAt?: string;

  updatedAt?: string;
}


export interface CreateStoreData {
  name: string;

  shopifyDomain?: string;

  customDomain?: string;

  platform?: string;

  currency?: string;

  country?: string;

  timezone?: string;
}


export interface UpdateStoreData {
  name?: string;

  customDomain?: string;

  currency?: string;

  country?: string;

  timezone?: string;

  logo?: string;

  status?: string;
}


export interface StoreResponse {
  success?: boolean;

  message?: string;

  store?: Store;

  data?: Store | {
    store?: Store;
  };
}


export interface StoresResponse {
  success?: boolean;

  message?: string;

  stores?: Store[];

  data?: Store[] | {
    stores?: Store[];
  };
}


// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function extractStore(
  response: StoreResponse
): Store | null {

  if (response.store) {
    return response.store;
  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (response.data.store) {
      return response.data.store;
    }

    if (
      'id' in response.data ||
      '_id' in response.data
    ) {

      return response.data as Store;

    }

  }


  return null;

}


function extractStores(
  response: StoresResponse
): Store[] {

  if (Array.isArray(response.stores)) {
    return response.stores;
  }


  if (
    response.data &&
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
// GET ALL STORES
// ============================================================================

export async function getStores(): Promise<Store[]> {

  const response =
    await storeApi.list<StoresResponse>();


  return extractStores(
    response
  );

}


// ============================================================================
// GET SINGLE STORE
// ============================================================================

export async function getStore(
  storeId: string
): Promise<Store> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await storeApi.get<StoreResponse>(
      storeId
    );


  const store =
    extractStore(
      response
    );


  if (!store) {

    throw new Error(
      'Store was not returned by the server.'
    );

  }


  return store;

}


// ============================================================================
// CREATE STORE
// ============================================================================

export async function createStore(
  data: CreateStoreData
): Promise<Store> {

  if (!data.name?.trim()) {

    throw new Error(
      'Store name is required.'
    );

  }


  const response =
    await storeApi.create<StoreResponse>(
      data as Record<string, unknown>
    );


  const store =
    extractStore(
      response
    );


  if (!store) {

    throw new Error(
      'Store was not returned after creation.'
    );

  }


  return store;

}


// ============================================================================
// UPDATE STORE
// ============================================================================

export async function updateStore(
  storeId: string,
  data: UpdateStoreData
): Promise<Store> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await storeApi.update<StoreResponse>(
      storeId,
      data as Record<string, unknown>
    );


  const store =
    extractStore(
      response
    );


  if (!store) {

    throw new Error(
      'Store was not returned after update.'
    );

  }


  return store;

}


// ============================================================================
// DELETE STORE
// ============================================================================

export async function deleteStore(
  storeId: string
): Promise<void> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  await storeApi.delete(
    storeId
  );

}


// ============================================================================
// STORE CONNECTION STATUS
// ============================================================================

export function isStoreConnected(
  store: Store
): boolean {

  return Boolean(
    store.isConnected ||
    store.status === 'connected' ||
    store.status === 'active'
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const storeService = {

  getStores,

  getStore,

  createStore,

  updateStore,

  deleteStore,

  isStoreConnected

};


export default storeService;
