/**
 * ============================================================================
 * StoreForge AI
 * Theme Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/theme.service.ts
 *
 * Purpose:
 * - List themes
 * - Get a single theme
 * - Create a theme
 * - Update a theme
 * - Deploy a theme
 *
 * StoreForge theme functionality only.
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
  themeApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface ThemeSettings {
  primaryColor?: string;

  secondaryColor?: string;

  accentColor?: string;

  backgroundColor?: string;

  textColor?: string;

  headingFont?: string;

  bodyFont?: string;

  borderRadius?: string;

  buttonStyle?: string;

  layoutStyle?: string;
}


export interface Theme {
  id: string;

  _id?: string;

  storeId?: string;

  userId?: string;

  name: string;

  description?: string;

  status?: string;

  type?: string;

  settings?: ThemeSettings;

  previewUrl?: string;

  thumbnailUrl?: string;

  shopifyThemeId?: string;

  shopifyThemeName?: string;

  isPublished?: boolean;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}


// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateThemeData {

  name: string;

  description?: string;

  type?: string;

  settings?: ThemeSettings;

}


export interface UpdateThemeData {

  name?: string;

  description?: string;

  status?: string;

  type?: string;

  settings?: ThemeSettings;

  previewUrl?: string;

  thumbnailUrl?: string;

}


export interface GenerateThemeData {

  storeName?: string;

  businessType?: string;

  niche?: string;

  targetAudience?: string;

  brandStyle?: string;

  designStyle?: string;

  primaryColor?: string;

  secondaryColor?: string;

  accentColor?: string;

  requirements?: string;

  language?: string;

}


// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ThemeResponse {

  success?: boolean;

  message?: string;

  theme?: Theme;

  data?:
    | Theme
    | {
        theme?: Theme;
      };

}


export interface ThemesResponse {

  success?: boolean;

  message?: string;

  themes?: Theme[];

  data?:
    | Theme[]
    | {
        themes?: Theme[];
      };

}


export interface DeployThemeResponse {

  success?: boolean;

  message?: string;

  theme?: Theme;

  deploymentId?: string;

  data?: {

    theme?: Theme;

    deploymentId?: string;

    status?: string;

  };

}


// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function extractTheme(
  response: ThemeResponse
): Theme | null {

  if (response.theme) {

    return response.theme;

  }


  if (
    response.data &&
    !Array.isArray(response.data)
  ) {

    if (
      'theme' in response.data &&
      response.data.theme
    ) {

      return response.data.theme;

    }


    if (
      'id' in response.data ||
      '_id' in response.data
    ) {

      return response.data as Theme;

    }

  }


  return null;

}


function extractThemes(
  response: ThemesResponse
): Theme[] {

  if (
    Array.isArray(
      response.themes
    )
  ) {

    return response.themes;

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
      response.data.themes
    )
  ) {

    return response.data.themes;

  }


  return [];

}


// ============================================================================
// GET ALL THEMES
// ============================================================================

export async function getThemes(
  storeId: string
): Promise<Theme[]> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  const response =
    await themeApi.list<ThemesResponse>(
      storeId
    );


  return extractThemes(
    response
  );

}


// ============================================================================
// GET SINGLE THEME
// ============================================================================

export async function getTheme(
  storeId: string,
  themeId: string
): Promise<Theme> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!themeId) {

    throw new Error(
      'Theme ID is required.'
    );

  }


  const response =
    await themeApi.get<ThemeResponse>(
      storeId,
      themeId
    );


  const theme =
    extractTheme(
      response
    );


  if (!theme) {

    throw new Error(
      'Theme was not returned by the server.'
    );

  }


  return theme;

}


// ============================================================================
// CREATE THEME
// ============================================================================

export async function createTheme(
  storeId: string,
  data: CreateThemeData
): Promise<Theme> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!data.name?.trim()) {

    throw new Error(
      'Theme name is required.'
    );

  }


  const response =
    await themeApi.create<ThemeResponse>(
      storeId,
      data as Record<string, unknown>
    );


  const theme =
    extractTheme(
      response
    );


  if (!theme) {

    throw new Error(
      'Theme was not returned after creation.'
    );

  }


  return theme;

}


// ============================================================================
// UPDATE THEME
// ============================================================================

export async function updateTheme(
  storeId: string,
  themeId: string,
  data: UpdateThemeData
): Promise<Theme> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!themeId) {

    throw new Error(
      'Theme ID is required.'
    );

  }


  const response =
    await themeApi.update<ThemeResponse>(
      storeId,
      themeId,
      data as Record<string, unknown>
    );


  const theme =
    extractTheme(
      response
    );


  if (!theme) {

    throw new Error(
      'Theme was not returned after update.'
    );

  }


  return theme;

}


// ============================================================================
// DEPLOY THEME
// ============================================================================
//
// The backend handles Shopify deployment.
// The frontend only starts the deployment and receives its result.
//

export async function deployTheme(
  storeId: string,
  themeId: string
): Promise<DeployThemeResponse> {

  if (!storeId) {

    throw new Error(
      'Store ID is required.'
    );

  }


  if (!themeId) {

    throw new Error(
      'Theme ID is required.'
    );

  }


  return themeApi.deploy<DeployThemeResponse>(
    storeId,
    themeId
  );

}


// ============================================================================
// THEME STATUS HELPERS
// ============================================================================

export function isThemeReady(
  theme: Theme
): boolean {

  return (
    theme.status === 'ready' ||
    theme.status === 'generated' ||
    theme.status === 'completed'
  );

}


export function isThemePublished(
  theme: Theme
): boolean {

  return Boolean(
    theme.isPublished ||
    theme.status === 'published'
  );

}


export function isThemeActive(
  theme: Theme
): boolean {

  return Boolean(
    theme.isActive ||
    theme.status === 'active'
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const themeService = {

  getThemes,

  getTheme,

  createTheme,

  updateTheme,

  deployTheme,

  isThemeReady,

  isThemePublished,

  isThemeActive

};


export default themeService;
