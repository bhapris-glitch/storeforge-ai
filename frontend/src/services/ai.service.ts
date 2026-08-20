/**
 * ============================================================================
 * StoreForge AI
 * AI Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/ai.service.ts
 *
 * Purpose:
 * - Communicate with backend AI module
 * - Generate AI-powered store assets
 * - Request AI suggestions
 *
 * Backend:
 * modules/ai/ai.service.js
 *
 * ============================================================================
 */

'use client';

import {
  aiApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface AIGenerationResponse<T = unknown> {

  success?: boolean;

  message?: string;

  result?: T;

  data?: T;

}


export interface StoreAnalysis {

  businessType?: string;

  niche?: string;

  targetAudience?: string;

  suggestedStyle?: string;

  suggestions?: string[];

}


export interface BrandingSuggestion {

  brandName?: string;

  tagline?: string;

  colors?: {

    primary?: string;

    secondary?: string;

    accent?: string;

  };

  fonts?: {

    heading?: string;

    body?: string;

  };

  brandVoice?: string;

}


export interface ProductSuggestion {

  title?: string;

  description?: string;

  features?: string[];

  benefits?: string[];

  tags?: string[];

  seoKeywords?: string[];

}


export interface ThemeSuggestion {

  style?: string;

  layout?: string;

  colors?: {

    primary?: string;

    secondary?: string;

    background?: string;

  };

  sections?: string[];

}


// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface AnalyzeStoreData {

  storeName?: string;

  industry?: string;

  description?: string;

  products?: string[];

  targetAudience?: string;

}


export interface GenerateBrandData {

  businessType?: string;

  niche?: string;

  audience?: string;

  style?: string;

  requirements?: string;

}


export interface GenerateProductAIData {

  productIdea: string;

  niche?: string;

  audience?: string;

  tone?: string;

  language?: string;

}


export interface GenerateThemeAIData {

  businessType?: string;

  niche?: string;

  brandStyle?: string;

  requirements?: string;

}


// ============================================================================
// STORE ANALYSIS
// ============================================================================

export async function analyzeStore(
  data: AnalyzeStoreData
): Promise<StoreAnalysis> {


  const response =
    await aiApi.analyze<AIGenerationResponse<StoreAnalysis>>(
      data as Record<string, unknown>
    );


  return (
    response.result ||
    response.data ||
    {}
  );

}


// ============================================================================
// BRAND GENERATION
// ============================================================================

export async function generateBrand(
  data: GenerateBrandData
): Promise<BrandingSuggestion> {


  const response =
    await aiApi.brand<AIGenerationResponse<BrandingSuggestion>>(
      data as Record<string, unknown>
    );


  return (
    response.result ||
    response.data ||
    {}
  );

}


// ============================================================================
// PRODUCT GENERATION
// ============================================================================
//
// This generates product content.
// Actual database saving is handled by product.service.
//

export async function generateProduct(
  data: GenerateProductAIData
): Promise<ProductSuggestion> {


  if (
    !data.productIdea?.trim()
  ) {

    throw new Error(
      'Product idea is required.'
    );

  }


  const response =
  await aiApi.product<AIGenerationResponse<ProductSuggestion>>(
    data as unknown as Record<string, unknown>
  );


  return (
    response.result ||
    response.data ||
    {}
  );

}


// ============================================================================
// THEME GENERATION
// ============================================================================

export async function generateTheme(
  data: GenerateThemeAIData
): Promise<ThemeSuggestion> {


  const response =
    await aiApi.theme<AIGenerationResponse<ThemeSuggestion>>(
      data as Record<string, unknown>
    );


  return (
    response.result ||
    response.data ||
    {}
  );

}


// ============================================================================
// GENERIC AI REQUEST
// ============================================================================
//
// Used for future AI features without creating a new frontend method.
//

export async function generate(
  prompt: string,
  context?: Record<string, unknown>
): Promise<unknown> {


  if (
    !prompt?.trim()
  ) {

    throw new Error(
      'Prompt is required.'
    );

  }


  const response =
  await aiApi.generateContent<AIGenerationResponse>(
    {
      prompt,
      context
    }
  );


  return (
    response.result ||
    response.data ||
    null
  );

}


// ============================================================================
// AI STATUS
// ============================================================================

export async function getAIStatus()
: Promise<unknown> {


  return aiApi.status();

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const aiService = {

  analyzeStore,

  generateBrand,

  generateProduct,

  generateTheme,

  generate,

  getAIStatus

};


export default aiService;
