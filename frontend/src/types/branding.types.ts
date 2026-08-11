/**
 * ============================================================================
 * StoreForge AI
 * Branding Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/branding.types.ts
 *
 * Purpose:
 * - Shared branding types
 * - Brand identity
 * - Colors
 * - Typography
 * - Logo configuration
 * - Branding API request/response types
 *
 * ============================================================================
 */


// ============================================================================
// BRAND COLORS
// ============================================================================

export interface BrandColors {

  primary?: string;

  secondary?: string;

  accent?: string;

  background?: string;

  surface?: string;

  text?: string;

  textSecondary?: string;

  border?: string;

  success?: string;

  warning?: string;

  error?: string;

  info?: string;

}


// ============================================================================
// BRAND FONTS
// ============================================================================

export interface BrandFonts {

  heading?: string;

  body?: string;

  button?: string;

  mono?: string;

}


// ============================================================================
// BRAND LOGO
// ============================================================================

export interface BrandLogo {

  url?: string | null;

  lightUrl?: string | null;

  darkUrl?: string | null;

  faviconUrl?: string | null;

  alt?: string;

  width?: number;

  height?: number;

}


// ============================================================================
// BRAND SOCIAL LINKS
// ============================================================================

export interface BrandSocialLinks {

  facebook?: string;

  instagram?: string;

  twitter?: string;

  linkedin?: string;

  youtube?: string;

  tiktok?: string;

  pinterest?: string;

}


// ============================================================================
// BRAND CONTACT
// ============================================================================

export interface BrandContact {

  email?: string;

  phone?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  postalCode?: string;

}


// ============================================================================
// BRANDING
// ============================================================================

export interface Branding {

  id: string;

  _id?: string;

  storeId: string;

  brandName?: string;

  tagline?: string;

  description?: string;

  colors?: BrandColors;

  fonts?: BrandFonts;

  logo?: BrandLogo;

  socialLinks?: BrandSocialLinks;

  contact?: BrandContact;

  industry?: string;

  brandVoice?: string;

  targetAudience?: string;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// BRANDING UPDATE
// ============================================================================

export type BrandingUpdate =
  Partial<Branding>;


// ============================================================================
// BRAND COLORS UPDATE
// ============================================================================

export type BrandColorsUpdate =
  Partial<BrandColors>;


// ============================================================================
// BRAND FONTS UPDATE
// ============================================================================

export type BrandFontsUpdate =
  Partial<BrandFonts>;


// ============================================================================
// BRAND LOGO UPDATE
// ============================================================================

export type BrandLogoUpdate =
  Partial<BrandLogo>;


// ============================================================================
// BRANDING GENERATION REQUEST
// ============================================================================

export interface GenerateBrandingRequest {

  storeId: string;

  brandName?: string;

  industry?: string;

  targetAudience?: string;

  description?: string;

  preferredStyle?: string;

  preferredColors?: string[];

}


// ============================================================================
// BRANDING RESPONSE
// ============================================================================

export interface BrandingResponse {

  branding: Branding;

  message?: string;

}


// ============================================================================
// BRANDING GENERATION RESPONSE
// ============================================================================

export interface BrandingGenerationResponse {

  branding: Branding;

  generated?: boolean;

  message?: string;

}


// ============================================================================
// BRANDING STATE
// ============================================================================

export interface BrandingState {

  branding: Branding | null;

  isLoading: boolean;

  isSaving: boolean;

  isLoaded: boolean;

  error: string | null;

}
