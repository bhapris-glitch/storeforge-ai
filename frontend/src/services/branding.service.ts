/**
 * ============================================================================
 * StoreForge AI
 * Branding Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/branding.service.ts
 *
 * Purpose:
 * - Fetch store branding
 * - Create branding
 * - Update branding
 *
 * ============================================================================
 */

'use client';

import {
  brandingApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface Brand {
  id: string;
  _id?: string;

  storeId?: string;
  userId?: string;

  brandName?: string;

  tagline?: string;

  description?: string;

  logo?: string;

  favicon?: string;

  primaryColor?: string;

  secondaryColor?: string;

  accentColor?: string;

  backgroundColor?: string;

  textColor?: string;

  fontHeading?: string;

  fontBody?: string;

  style?: string;

  tone?: string;

  industry?: string;

  targetAudience?: string;

  createdAt?: string;

  updatedAt?: string;
}


export interface CreateBrandData {
  brandName?: string;

  tagline?: string;

  description?: string;

  logo?: string;

  favicon?: string;

  primaryColor?: string;

  secondaryColor?: string;

  accentColor?: string;

  backgroundColor?: string;

  textColor?: string;

  fontHeading?: string;

  fontBody?: string;

  style?: string;

  tone?: string;

  industry?: string;

  targetAudience?: string;
}


export interface UpdateBrandData
  extends Partial<CreateBrandData> {}


export interface BrandResponse {
  success?: boolean;

  message?: string;

  brand?: Brand;

  data?:
    | Brand
    | {
        brand?: Brand;
      };
}


// ============================================================================
// RESPONSE HELPER
// ============================================================================

function extractBrand(
  response: BrandResponse
): Brand | null {

  if (response.brand) {

    return response.brand;

  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (
      'brand' in response.data &&
      response.data.brand
    ) {

      return response.data.brand;

    }


    if (
      'id' in response.data ||
      '_id' in response.data
    ) {

      return response.data as Brand;

    }

  }


  return null;

}


// ============================================================================
// GET BRANDING
// ============================================================================

export async function getBranding(
  storeId: string
): Promise<Brand | null> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await brandingApi.get<BrandResponse>(
      storeId
    );


  return extractBrand(
    response
  );

}


// ============================================================================
// CREATE BRANDING
// ============================================================================

export async function createBranding(
  storeId: string,
  data: CreateBrandData
): Promise<Brand> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await (brandingApi as typeof brandingApi & {
      create: <T = unknown>(storeId: string, data: Record<string, unknown>) => Promise<T>;
    }).create<BrandResponse>(
      storeId,
      data as Record<string, unknown>
    );


  const brand =
    extractBrand(
      response
    );


  if (!brand) {

    throw new Error(
      'Branding was not returned after creation.'
    );

  }


  return brand;

}


// ============================================================================
// UPDATE BRANDING
// ============================================================================

export async function updateBranding(
  storeId: string,
  data: UpdateBrandData
): Promise<Brand> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await brandingApi.update<BrandResponse>(
      storeId,
      data as Record<string, unknown>
    );


  const brand =
    extractBrand(
      response
    );


  if (!brand) {

    throw new Error(
      'Branding was not returned after update.'
    );

  }


  return brand;

}


// ============================================================================
// SAVE BRANDING
// ============================================================================
//
// Useful for the frontend branding editor.
//
// If branding already exists, update it.
// Otherwise create it.
//

export async function saveBranding(
  storeId: string,
  data: CreateBrandData
): Promise<Brand> {

  const existingBrand =
    await getBranding(
      storeId
    );


  if (existingBrand) {

    return updateBranding(
      storeId,
      data
    );

  }


  return createBranding(
    storeId,
    data
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const brandingService = {

  getBranding,

  createBranding,

  updateBranding,

  saveBranding

};


export default brandingService;
