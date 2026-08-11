/**
 * ============================================================================
 * StoreForge AI
 * Brand Service
 * ============================================================================
 *
 * File:
 * backend/src/modules/branding/brand.service.js
 *
 * Purpose:
 * - Create brand profiles
 * - Update brand profiles
 * - Retrieve brand profiles
 * - Delete brand profiles
 * - Validate store ownership
 * - Prepare normalized brand context for AI theme generation
 *
 * ============================================================================
 */

'use strict';

const mongoose = require('mongoose');

const Brand = require('./brand.model');

const Store = require('../stores/store.model');


// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_KEYWORDS = 30;

const MAX_ASSETS = 50;


// ============================================================================
// HELPERS
// ============================================================================

const isValidObjectId = (value) => {

  return mongoose.Types.ObjectId.isValid(value);

};


const normalizeString = (
  value,
  maxLength = null
) => {

  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  if (
    typeof value !== 'string'
  ) {
    return String(value)
      .trim()
      .slice(
        0,
        maxLength || 100000
      );
  }

  const normalized =
    value.trim();

  return maxLength
    ? normalized.slice(
        0,
        maxLength
      )
    : normalized;

};


const normalizeStringArray = (
  value,
  maxItems = MAX_KEYWORDS,
  maxLength = 100
) => {

  if (!Array.isArray(value)) {
    return undefined;
  }

  return [
    ...new Set(

      value
        .filter(
          item =>
            item !== null &&
            item !== undefined
        )
        .map(
          item =>
            normalizeString(
              item,
              maxLength
            )
        )
        .filter(Boolean)

    )
  ].slice(
    0,
    maxItems
  );

};


const cleanObject = (
  object
) => {

  if (
    !object ||
    typeof object !== 'object' ||
    Array.isArray(object)
  ) {
    return object;
  }

  const cleaned = {};

  for (
    const [key, value]
    of Object.entries(object)
  ) {

    if (
      value === undefined ||
      value === null
    ) {
      continue;
    }

    if (
      typeof value === 'string'
    ) {

      const normalized =
        value.trim();

      if (normalized) {
        cleaned[key] = normalized;
      }

      continue;
    }

    cleaned[key] = value;

  }

  return cleaned;

};


// ============================================================================
// STORE OWNERSHIP
// ============================================================================

const ensureStoreOwnership = async (
  userId,
  storeId
) => {

  if (
    !isValidObjectId(userId)
  ) {

    throw new Error(
      'Invalid user ID.'
    );

  }


  if (
    !isValidObjectId(storeId)
  ) {

    throw new Error(
      'Invalid store ID.'
    );

  }


  const store =
    await Store.findOne({

      _id: storeId,

      userId

    }).lean();


  if (!store) {

    const error =
      new Error(
        'Store not found or access denied.'
      );

    error.statusCode = 404;

    throw error;

  }


  return store;

};


// ============================================================================
// BUILD BRAND UPDATE DATA
// ============================================================================

const buildBrandData = (
  data = {}
) => {

  const allowedFields = [

    'brandName',

    'tagline',

    'description',

    'logo',

    'favicon',

    'colors',

    'typography',

    'designStyle',

    'designPreferences',

    'brandVoice',

    'targetAudience',

    'socialLinks',

    'assets',

    'aiProfile',

    'isComplete',

    'source',

    'lastAIUpdateAt'

  ];


  const result = {};


  for (
    const field
    of allowedFields
  ) {

    if (
      data[field] === undefined
    ) {
      continue;
    }


    result[field] =
      data[field];

  }


  // --------------------------------------------------------------------------
  // STRING NORMALIZATION
  // --------------------------------------------------------------------------

  if (
    result.brandName !== undefined
  ) {

    result.brandName =
      normalizeString(
        result.brandName,
        120
      );

  }


  if (
    result.tagline !== undefined
  ) {

    result.tagline =
      normalizeString(
        result.tagline,
        300
      );

  }


  if (
    result.description !== undefined
  ) {

    result.description =
      normalizeString(
        result.description,
        3000
      );

  }


  if (
    result.designStyle !== undefined
  ) {

    result.designStyle =
      normalizeString(
        result.designStyle,
        100
      );

  }


  // --------------------------------------------------------------------------
  // BRAND VOICE
  // --------------------------------------------------------------------------

  if (
    result.brandVoice
  ) {

    result.brandVoice =
      cleanObject(
        result.brandVoice
      );


    if (
      result.brandVoice.keywords
    ) {

      result.brandVoice.keywords =
        normalizeStringArray(
          result.brandVoice.keywords,
          MAX_KEYWORDS,
          100
        );

    }


    if (
      result.brandVoice.avoidWords
    ) {

      result.brandVoice.avoidWords =
        normalizeStringArray(
          result.brandVoice.avoidWords,
          MAX_KEYWORDS,
          100
        );

    }

  }


  // --------------------------------------------------------------------------
  // TARGET AUDIENCE
  // --------------------------------------------------------------------------

  if (
    result.targetAudience
  ) {

    result.targetAudience =
      cleanObject(
        result.targetAudience
      );


    if (
      result.targetAudience.interests
    ) {

      result.targetAudience.interests =
        normalizeStringArray(
          result.targetAudience.interests,
          MAX_KEYWORDS,
          100
        );

    }

  }


  // --------------------------------------------------------------------------
  // AI PROFILE
  // --------------------------------------------------------------------------

  if (
    result.aiProfile
  ) {

    result.aiProfile =
      cleanObject(
        result.aiProfile
      );


    if (
      result.aiProfile.visualKeywords
    ) {

      result.aiProfile.visualKeywords =
        normalizeStringArray(
          result.aiProfile.visualKeywords,
          MAX_KEYWORDS,
          100
        );

    }


    if (
      result.aiProfile.recommendedPalette
    ) {

      result.aiProfile.recommendedPalette =
        normalizeStringArray(
          result.aiProfile.recommendedPalette,
          20,
          30
        );

    }

  }


  // --------------------------------------------------------------------------
  // ASSETS
  // --------------------------------------------------------------------------

  if (
    Array.isArray(result.assets)
  ) {

    result.assets =
      result.assets
        .slice(
          0,
          MAX_ASSETS
        )
        .map(
          asset => {

            if (
              !asset ||
              typeof asset !== 'object'
            ) {
              return null;
            }

            return cleanObject({

              type:
                normalizeString(
                  asset.type,
                  50
                ),

              url:
                normalizeString(
                  asset.url,
                  2000
                ),

              alt:
                normalizeString(
                  asset.alt,
                  200
                ),

              name:
                normalizeString(
                  asset.name,
                  200
                )

            });

          }
        )
        .filter(Boolean);

  }


  return result;

};


// ============================================================================
// CREATE BRAND
// ============================================================================

const createBrand = async (
  userId,
  storeId,
  data = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const existing =
    await Brand.findOne({

      userId,

      storeId

    });


  if (existing) {

    const error =
      new Error(
        'Brand profile already exists for this store.'
      );

    error.statusCode = 409;

    throw error;

  }


  const brandData =
    buildBrandData(
      data
    );


  const brand =
    await Brand.create({

      userId,

      storeId,

      ...brandData

    });


  return brand;

};


// ============================================================================
// GET BRAND
// ============================================================================

const getBrand = async (
  userId,
  storeId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const brand =
    await Brand.findOne({

      userId,

      storeId

    });


  return brand;

};


// ============================================================================
// GET BRAND OR CREATE EMPTY PROFILE
// ============================================================================

const getOrCreateBrand = async (
  userId,
  storeId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  let brand =
    await Brand.findOne({

      userId,

      storeId

    });


  if (brand) {
    return brand;
  }


  brand =
    await Brand.create({

      userId,

      storeId,

      source: 'manual'

    });


  return brand;

};


// ============================================================================
// UPDATE BRAND
// ============================================================================

const updateBrand = async (
  userId,
  storeId,
  data = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const brandData =
    buildBrandData(
      data
    );


  const brand =
    await Brand.findOneAndUpdate(

      {
        userId,

        storeId

      },

      {
        $set:
          brandData
      },

      {
        new: true,

        runValidators: true,

        upsert: true,

        setDefaultsOnInsert: true

      }

    );


  return brand;

};


// ============================================================================
// UPDATE BRAND FROM AI
// ============================================================================

const updateBrandFromAI = async (
  userId,
  storeId,
  aiData = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const brandData =
    buildBrandData({

      ...aiData,

      source: 'ai',

      lastAIUpdateAt:
        new Date()

    });


  const brand =
    await Brand.findOneAndUpdate(

      {
        userId,

        storeId

      },

      {
        $set:
          brandData
      },

      {
        new: true,

        runValidators: true,

        upsert: true,

        setDefaultsOnInsert: true

      }

    );


  return brand;

};


// ============================================================================
// UPDATE BRAND COMPLETION STATUS
// ============================================================================

const updateCompletionStatus = async (
  userId,
  storeId,
  isComplete
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const brand =
    await Brand.findOneAndUpdate(

      {
        userId,

        storeId

      },

      {
        $set: {

          isComplete:
            Boolean(isComplete)

        }

      },

      {
        new: true,

        runValidators: true,

        upsert: true,

        setDefaultsOnInsert: true

      }

    );


  return brand;

};


// ============================================================================
// DELETE BRAND
// ============================================================================

const deleteBrand = async (
  userId,
  storeId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const brand =
    await Brand.findOneAndDelete({

      userId,

      storeId

    });


  if (!brand) {

    const error =
      new Error(
        'Brand profile not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return brand;

};


// ============================================================================
// BUILD AI BRAND CONTEXT
// ============================================================================
//
// Converts the database brand profile into a clean object that can be passed
// to aiPlanner.service.js / aiDesign.service.js / aiContent.service.js.
//
// IMPORTANT:
// Do not send internal database metadata to the AI model.
//

const buildAIContext = async (
  userId,
  storeId
) => {

  const brand =
    await getBrand(
      userId,
      storeId
    );


  if (!brand) {
    return null;
  }


  return {

    brandName:
      brand.brandName || '',

    tagline:
      brand.tagline || '',

    description:
      brand.description || '',

    logo:
      brand.logo?.url || '',

    favicon:
      brand.favicon || '',


    colors: {

      primary:
        brand.colors?.primary || '',

      secondary:
        brand.colors?.secondary || '',

      accent:
        brand.colors?.accent || '',

      background:
        brand.colors?.background || '',

      surface:
        brand.colors?.surface || '',

      text:
        brand.colors?.text || '',

      mutedText:
        brand.colors?.mutedText || ''

    },


    typography: {

      headingFont:
        brand.typography?.headingFont || '',

      bodyFont:
        brand.typography?.bodyFont || '',

      headingWeight:
        brand.typography?.headingWeight || null,

      bodyWeight:
        brand.typography?.bodyWeight || null

    },


    designStyle:
      brand.designStyle || '',


    designPreferences:
      brand.designPreferences || {},


    brandVoice:
      brand.brandVoice || {},


    targetAudience:
      brand.targetAudience || {},


    socialLinks:
      brand.socialLinks || {},


    assets:
      Array.isArray(brand.assets)
        ? brand.assets
        : [],


    aiProfile:
      brand.aiProfile || {}

  };

};


// ============================================================================
// GET BRAND FOR THEME GENERATOR
// ============================================================================
//
// Alias intentionally provided so the theme-generation services can use a
// clear semantic method name.
//

const getBrandContext =
  buildAIContext;


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  createBrand,

  getBrand,

  getOrCreateBrand,

  updateBrand,

  updateBrandFromAI,

  updateCompletionStatus,

  deleteBrand,

  buildAIContext,

  getBrandContext,

  ensureStoreOwnership

};
