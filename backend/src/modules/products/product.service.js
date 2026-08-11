/**
 * ============================================================================
 * StoreForge AI
 * Product Service
 * ============================================================================
 *
 * File:
 * backend/src/modules/products/product.service.js
 *
 * Purpose:
 * - Create AI product drafts
 * - Retrieve products
 * - Update generated products
 * - Generate product content through the AI service
 * - Prepare products for Shopify
 * - Track Shopify synchronization
 * - Publish/archive product records
 *
 * IMPORTANT:
 * This service belongs to StoreForge's product generator.
 * It is NOT the chatbot product service.
 *
 * ============================================================================
 */

'use strict';

const mongoose = require('mongoose');

const ProductAI = require('./productAI.model');

const Store = require('../stores/store.model');


// ============================================================================
// OPTIONAL AI SERVICE
// ============================================================================
//
// The service is loaded lazily so that the Product module does not crash
// during application startup if the AI module is being developed separately.
//
// Expected future location:
//
// backend/src/modules/ai/ai.service.js
//
// The actual AI generation method is detected at runtime.
//

let aiService = null;

const loadAIService = () => {

  if (aiService) {
    return aiService;
  }

  try {

    aiService =
      require('../ai/ai.service');

    return aiService;

  } catch (error) {

    return null;

  }

};


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

  const normalized =
    String(value).trim();

  if (!normalized) {
    return undefined;
  }

  return maxLength
    ? normalized.slice(0, maxLength)
    : normalized;

};


const normalizeStringArray = (
  value,
  maxItems = 50,
  maxLength = 200
) => {

  if (!Array.isArray(value)) {
    return undefined;
  }

  return [
    ...new Set(

      value
        .filter(
          item =>
            item !== undefined &&
            item !== null
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


const normalizeNumber = (
  value,
  min = 0
) => {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined;
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(number) ||
    number < min
  ) {
    return undefined;
  }

  return number;

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

    const error =
      new Error(
        'Invalid user ID.'
      );

    error.statusCode = 400;

    throw error;

  }


  if (
    !isValidObjectId(storeId)
  ) {

    const error =
      new Error(
        'Invalid store ID.'
      );

    error.statusCode = 400;

    throw error;

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
// BUILD PRODUCT DATA
// ============================================================================

const buildProductData = (
  data = {}
) => {

  const result = {};


  // --------------------------------------------------------------------------
  // BASIC INFORMATION
  // --------------------------------------------------------------------------

  if (
    data.title !== undefined
  ) {

    result.title =
      normalizeString(
        data.title,
        255
      );

  }


  if (
    data.productType !== undefined
  ) {

    result.productType =
      normalizeString(
        data.productType,
        150
      );

  }


  if (
    data.vendor !== undefined
  ) {

    result.vendor =
      normalizeString(
        data.vendor,
        150
      );

  }


  if (
    data.category !== undefined
  ) {

    result.category =
      normalizeString(
        data.category,
        150
      );

  }


  if (
    data.subcategory !== undefined
  ) {

    result.subcategory =
      normalizeString(
        data.subcategory,
        150
      );

  }


  if (
    data.description !== undefined
  ) {

    result.description =
      normalizeString(
        data.description,
        20000
      );

  }


  // --------------------------------------------------------------------------
  // TAGS
  // --------------------------------------------------------------------------

  if (
    data.tags !== undefined
  ) {

    result.tags =
      normalizeStringArray(
        data.tags,
        50,
        100
      );

  }


  // --------------------------------------------------------------------------
  // PRICING
  // --------------------------------------------------------------------------

  if (
    data.pricing
  ) {

    result.pricing = {};

    if (
      data.pricing.price !== undefined
    ) {

      result.pricing.price =
        normalizeNumber(
          data.pricing.price
        );

    }


    if (
      data.pricing.compareAtPrice !== undefined
    ) {

      result.pricing.compareAtPrice =
        normalizeNumber(
          data.pricing.compareAtPrice
        );

    }


    if (
      data.pricing.costPerItem !== undefined
    ) {

      result.pricing.costPerItem =
        normalizeNumber(
          data.pricing.costPerItem
        );

    }


    if (
      data.pricing.currency !== undefined
    ) {

      result.pricing.currency =
        normalizeString(
          data.pricing.currency,
          10
        )?.toUpperCase();

    }


    if (
      data.pricing.pricingStrategy !== undefined
    ) {

      result.pricing.pricingStrategy =
        normalizeString(
          data.pricing.pricingStrategy,
          100
        );

    }

  }


  // --------------------------------------------------------------------------
  // MARKETING
  // --------------------------------------------------------------------------

  if (
    data.marketing
  ) {

    result.marketing = {};


    const marketingFields = [
      'shortDescription',
      'targetAudience',
      'callToAction'
    ];


    for (
      const field
      of marketingFields
    ) {

      if (
        data.marketing[field] !== undefined
      ) {

        result.marketing[field] =
          normalizeString(
            data.marketing[field],
            field === 'shortDescription'
              ? 1000
              : field === 'targetAudience'
                ? 2000
                : 300
          );

      }

    }


    const marketingArrays = [
      'sellingPoints',
      'benefits',
      'features',
      'useCases'
    ];


    for (
      const field
      of marketingArrays
    ) {

      if (
        data.marketing[field] !== undefined
      ) {

        result.marketing[field] =
          normalizeStringArray(
            data.marketing[field],
            30,
            500
          );

      }

    }

  }


  // --------------------------------------------------------------------------
  // SEO
  // --------------------------------------------------------------------------

  if (
    data.seo
  ) {

    result.seo = {};


    if (
      data.seo.title !== undefined
    ) {

      result.seo.title =
        normalizeString(
          data.seo.title,
          255
        );

    }


    if (
      data.seo.description !== undefined
    ) {

      result.seo.description =
        normalizeString(
          data.seo.description,
          500
        );

    }


    if (
      data.seo.handle !== undefined
    ) {

      result.seo.handle =
        normalizeString(
          data.seo.handle,
          255
        );

    }


    if (
      data.seo.keywords !== undefined
    ) {

      result.seo.keywords =
        normalizeStringArray(
          data.seo.keywords,
          30,
          100
        );

    }

  }


  // --------------------------------------------------------------------------
  // PRODUCT DETAILS
  // --------------------------------------------------------------------------

  for (
    const field
    of [
      'materials',
      'colors',
      'sizes'
    ]
  ) {

    if (
      data[field] !== undefined
    ) {

      result[field] =
        normalizeStringArray(
          data[field],
          50,
          200
        );

    }

  }


  // --------------------------------------------------------------------------
  // SPECIFICATIONS
  // --------------------------------------------------------------------------

  if (
    data.specifications !== undefined &&
    data.specifications !== null &&
    typeof data.specifications === 'object'
  ) {

    result.specifications =
      data.specifications;

  }


  // --------------------------------------------------------------------------
  // IMAGES
  // --------------------------------------------------------------------------

  if (
    Array.isArray(data.images)
  ) {

    result.images =
      data.images
        .slice(0, 50)
        .map(image => {

          if (
            !image ||
            typeof image !== 'object'
          ) {
            return null;
          }

          return {

            url:
              normalizeString(
                image.url,
                2000
              ),

            altText:
              normalizeString(
                image.altText,
                500
              ),

            position:
              normalizeNumber(
                image.position
              )

          };

        })
        .filter(
          image =>
            image &&
            image.url
        );

  }


  // --------------------------------------------------------------------------
  // VARIANTS
  // --------------------------------------------------------------------------

  if (
    Array.isArray(data.variants)
  ) {

    result.variants =
      data.variants
        .slice(0, 100)
        .map(variant => {

          if (
            !variant ||
            typeof variant !== 'object'
          ) {
            return null;
          }

          return {

            title:
              normalizeString(
                variant.title,
                250
              ),

            option1:
              normalizeString(
                variant.option1,
                100
              ),

            option2:
              normalizeString(
                variant.option2,
                100
              ),

            option3:
              normalizeString(
                variant.option3,
                100
              ),

            price:
              normalizeNumber(
                variant.price
              ),

            compareAtPrice:
              normalizeNumber(
                variant.compareAtPrice
              ),

            sku:
              normalizeString(
                variant.sku,
                100
              ),

            barcode:
              normalizeString(
                variant.barcode,
                100
              ),

            inventoryQuantity:
              normalizeNumber(
                variant.inventoryQuantity
              ),

            taxable:
              variant.taxable !== undefined
                ? Boolean(variant.taxable)
                : true,

            requiresShipping:
              variant.requiresShipping !== undefined
                ? Boolean(variant.requiresShipping)
                : true

          };

        })
        .filter(Boolean);

  }


  // --------------------------------------------------------------------------
  // OPTIONS
  // --------------------------------------------------------------------------

  if (
    Array.isArray(data.options)
  ) {

    result.options =
      data.options
        .slice(0, 10)
        .map(option => {

          if (
            !option ||
            typeof option !== 'object'
          ) {
            return null;
          }

          return {

            name:
              normalizeString(
                option.name,
                100
              ),

            values:
              normalizeStringArray(
                option.values,
                100,
                100
              ) || []

          };

        })
        .filter(
          option =>
            option &&
            option.name
        );

  }


  return result;

};


// ============================================================================
// CREATE PRODUCT DRAFT
// ============================================================================

const createProductDraft = async (
  userId,
  storeId,
  data = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const productData =
    buildProductData(
      data
    );


  if (
    !productData.title
  ) {

    const error =
      new Error(
        'Product title is required.'
      );

    error.statusCode = 400;

    throw error;

  }


  const product =
    await ProductAI.create({

      userId,

      storeId,

      ...productData,

      status: 'draft',

      shopifySync: {

        status:
          'not_synced'

      }

    });


  return product;

};


// ============================================================================
// GET PRODUCT
// ============================================================================

const getProduct = async (
  userId,
  storeId,
  productId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  if (
    !isValidObjectId(productId)
  ) {

    const error =
      new Error(
        'Invalid product ID.'
      );

    error.statusCode = 400;

    throw error;

  }


  const product =
    await ProductAI.findOne({

      _id: productId,

      userId,

      storeId

    });


  if (!product) {

    const error =
      new Error(
        'Product not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return product;

};


// ============================================================================
// LIST PRODUCTS
// ============================================================================

const listProducts = async (
  userId,
  storeId,
  options = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const page =
    Math.max(
      Number(options.page) || 1,
      1
    );


  const limit =
    Math.min(
      Math.max(
        Number(options.limit) || 20,
        1
      ),
      100
    );


  const skip =
    (page - 1) * limit;


  const filter = {

    userId,

    storeId

  };


  if (
    options.status
  ) {

    filter.status =
      options.status;

  }


  if (
    options.search
  ) {

    const search =
      normalizeString(
        options.search,
        100
      );


    if (search) {

      filter.$text = {

        $search:
          search

      };

    }

  }


  const [
    products,
    total
  ] = await Promise.all([

    ProductAI.find(filter)
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    ProductAI.countDocuments(
      filter
    )

  ]);


  return {

    products,

    pagination: {

      page,

      limit,

      total,

      pages:
        Math.ceil(
          total / limit
        )

    }

  };

};


// ============================================================================
// UPDATE PRODUCT
// ============================================================================

const updateProduct = async (
  userId,
  storeId,
  productId,
  data = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  if (
    !isValidObjectId(productId)
  ) {

    const error =
      new Error(
        'Invalid product ID.'
      );

    error.statusCode = 400;

    throw error;

  }


  const productData =
    buildProductData(
      data
    );


  const product =
    await ProductAI.findOneAndUpdate(

      {

        _id: productId,

        userId,

        storeId

      },

      {

        $set:
          productData

      },

      {

        new: true,

        runValidators: true

      }

    );


  if (!product) {

    const error =
      new Error(
        'Product not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return product;

};


// ============================================================================
// GENERATE PRODUCT WITH AI
// ============================================================================
//
// This method prepares the generation request and delegates actual AI work
// to modules/ai/ai.service.js.
//
// The method supports several common AI service method names so the Product
// module remains decoupled from the exact AI implementation.
//

const generateProductWithAI = async (
  userId,
  storeId,
  generationInput = {}
) => {

  const store =
    await ensureStoreOwnership(
      userId,
      storeId
    );


  const productIdea =
    normalizeString(
      generationInput.productIdea,
      5000
    );


  if (!productIdea) {

    const error =
      new Error(
        'Product idea is required.'
      );

    error.statusCode = 400;

    throw error;

  }


  // --------------------------------------------------------------------------
  // CREATE GENERATION RECORD
  // --------------------------------------------------------------------------

  const product =
    await ProductAI.create({

      userId,

      storeId,

      title:
        generationInput.title
          ? normalizeString(
              generationInput.title,
              255
            )
          : 'AI Generated Product',

      generationInput: {

        productIdea,

        targetMarket:
          normalizeString(
            generationInput.targetMarket,
            1000
          ),

        niche:
          normalizeString(
            generationInput.niche,
            500
          ),

        tone:
          normalizeString(
            generationInput.tone,
            200
          ),

        language:
          normalizeString(
            generationInput.language,
            50
          ) || 'en'

      },

      status:
        'generating'

    });


  const service =
    loadAIService();


  if (!service) {

    await ProductAI.updateOne(

      {
        _id:
          product._id
      },

      {
        $set: {

          status:
            'failed'

        }

      }

    );


    const error =
      new Error(
        'AI service is not available.'
      );

    error.statusCode = 503;

    throw error;

  }


  try {

    // ------------------------------------------------------------------------
    // BUILD AI REQUEST
    // ------------------------------------------------------------------------

    const context = {

      storeId,

      storeName:
        store.name ||
        store.shopName ||
        '',

      productIdea,

      targetMarket:
        generationInput.targetMarket || '',

      niche:
        generationInput.niche || '',

      tone:
        generationInput.tone || '',

      language:
        generationInput.language || 'en'

    };


    // ------------------------------------------------------------------------
    // DETERMINE AI METHOD
    // ------------------------------------------------------------------------

    let generated;


    if (
      typeof service.generateProduct ===
      'function'
    ) {

      generated =
        await service.generateProduct(
          context
        );

    } else if (
      typeof service.generateProductContent ===
      'function'
    ) {

      generated =
        await service.generateProductContent(
          context
        );

    } else if (
      typeof service.generate ===
      'function'
    ) {

      generated =
        await service.generate(
          context
        );

    } else {

      const error =
        new Error(
          'No product generation method is available in ai.service.js.'
        );

      error.statusCode = 503;

      throw error;

    }


    // ------------------------------------------------------------------------
    // HANDLE DIFFERENT AI RESPONSE SHAPES
    // ------------------------------------------------------------------------

    const aiProduct =
      generated?.product ||
      generated?.data ||
      generated;


    if (
      !aiProduct ||
      typeof aiProduct !== 'object'
    ) {

      throw new Error(
        'AI returned an invalid product response.'
      );

    }


    const normalized =
      buildProductData(
        aiProduct
      );


    // ------------------------------------------------------------------------
    // UPDATE GENERATION RECORD
    // ------------------------------------------------------------------------

    const updated =
      await ProductAI.findByIdAndUpdate(

        product._id,

        {

          $set: {

            ...normalized,

            status:
              'generated',

            aiGeneration: {

              model:
                generated?.model ||
                generated?.metadata?.model,

              provider:
                generated?.provider ||
                generated?.metadata?.provider,

              promptVersion:
                generated?.promptVersion ||
                generated?.metadata?.promptVersion,

              generationId:
                generated?.generationId ||
                generated?.metadata?.generationId,

              tokensUsed:
                generated?.tokensUsed ||
                generated?.usage?.totalTokens,

              generationTimeMs:
                generated?.generationTimeMs,

              generatedAt:
                new Date()

            }

          }

        },

        {

          new: true,

          runValidators: true

        }

      );


    return updated;

  } catch (error) {

    await ProductAI.findByIdAndUpdate(

      product._id,

      {

        $set: {

          status:
            'failed'

        }

      }

    );


    throw error;

  }

};


// ============================================================================
// UPDATE GENERATION STATUS
// ============================================================================

const updateStatus = async (
  userId,
  storeId,
  productId,
  status
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const allowedStatuses = [

    'draft',

    'generating',

    'generated',

    'review',

    'ready',

    'published',

    'failed',

    'archived'

  ];


  if (
    !allowedStatuses.includes(
      status
    )
  ) {

    const error =
      new Error(
        'Invalid product status.'
      );

    error.statusCode = 400;

    throw error;

  }


  const update = {

    status

  };


  if (
    status === 'published'
  ) {

    update.publishedAt =
      new Date();

  }


  if (
    status === 'archived'
  ) {

    update.archivedAt =
      new Date();

  }


  const product =
    await ProductAI.findOneAndUpdate(

      {

        _id: productId,

        userId,

        storeId

      },

      {

        $set:
          update

      },

      {

        new: true,

        runValidators: true

      }

    );


  if (!product) {

    const error =
      new Error(
        'Product not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return product;

};


// ============================================================================
// SET SHOPIFY PRODUCT ID
// ============================================================================

const setShopifyProductId = async (
  userId,
  storeId,
  productId,
  shopifyProductId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  if (
    !isValidObjectId(productId)
  ) {

    const error =
      new Error(
        'Invalid product ID.'
      );

    error.statusCode = 400;

    throw error;

  }


  const normalizedId =
    normalizeString(
      shopifyProductId,
      100
    );


  if (!normalizedId) {

    const error =
      new Error(
        'Shopify product ID is required.'
      );

    error.statusCode = 400;

    throw error;

  }


  const product =
    await ProductAI.findOneAndUpdate(

      {

        _id: productId,

        userId,

        storeId

      },

      {

        $set: {

          shopifyProductId:
            normalizedId,

          'shopifySync.status':
            'synced',

          'shopifySync.lastSyncedAt':
            new Date(),

          'shopifySync.lastError':
            null

        }

      },

      {

        new: true,

        runValidators: true

      }

    );


  if (!product) {

    const error =
      new Error(
        'Product not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return product;

};


// ============================================================================
// UPDATE SHOPIFY SYNC STATUS
// ============================================================================

const updateShopifySyncStatus = async (
  userId,
  storeId,
  productId,
  syncData = {}
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const allowedStatuses = [

    'not_synced',

    'pending',

    'syncing',

    'synced',

    'failed'

  ];


  const status =
    syncData.status;


  if (
    !allowedStatuses.includes(
      status
    )
  ) {

    const error =
      new Error(
        'Invalid Shopify sync status.'
      );

    error.statusCode = 400;

    throw error;

  }


  const update = {

    'shopifySync.status':
      status

  };


  if (
    syncData.lastSyncedAt
  ) {

    update[
      'shopifySync.lastSyncedAt'
    ] =
      syncData.lastSyncedAt;

  }


  if (
    syncData.lastError !== undefined
  ) {

    update[
      'shopifySync.lastError'
    ] =
      normalizeString(
        syncData.lastError,
        2000
      ) || null;

  }


  if (
    syncData.shopifyProductId
  ) {

    update.shopifyProductId =
      normalizeString(
        syncData.shopifyProductId,
        100
      );

  }


  const product =
    await ProductAI.findOneAndUpdate(

      {

        _id: productId,

        userId,

        storeId

      },

      {

        $set:
          update

      },

      {

        new: true,

        runValidators: true

      }

    );


  if (!product) {

    const error =
      new Error(
        'Product not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return product;

};


// ============================================================================
// DELETE PRODUCT
// ============================================================================

const deleteProduct = async (
  userId,
  storeId,
  productId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  if (
    !isValidObjectId(productId)
  ) {

    const error =
      new Error(
        'Invalid product ID.'
      );

    error.statusCode = 400;

    throw error;

  }


  const product =
    await ProductAI.findOneAndDelete({

      _id: productId,

      userId,

      storeId

    });


  if (!product) {

    const error =
      new Error(
        'Product not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  return product;

};


// ============================================================================
// PREPARE SHOPIFY PAYLOAD
// ============================================================================
//
// Converts StoreForge's internal AI product structure into a clean object
// suitable for the Shopify integration layer.
//
// The actual Shopify API call belongs in the Shopify module.
//

const buildShopifyPayload = async (
  userId,
  storeId,
  productId
) => {

  const product =
    await getProduct(
      userId,
      storeId,
      productId
    );


  return {

    title:
      product.title,

    body_html:
      product.description || '',

    vendor:
      product.vendor || '',

    product_type:
      product.productType || '',

    tags:
      Array.isArray(product.tags)
        ? product.tags.join(', ')
        : '',

    status:
      'DRAFT',

    variants:
      Array.isArray(product.variants)
        ? product.variants.map(
            variant => ({

              title:
                variant.title,

              option1:
                variant.option1,

              option2:
                variant.option2,

              option3:
                variant.option3,

              price:
                variant.price !== undefined
                  ? String(
                      variant.price
                    )
                  : undefined,

              compare_at_price:
                variant.compareAtPrice !== undefined
                  ? String(
                      variant.compareAtPrice
                    )
                  : undefined,

              sku:
                variant.sku,

              barcode:
                variant.barcode,

              inventory_quantity:
                variant.inventoryQuantity,

              taxable:
                variant.taxable,

              requires_shipping:
                variant.requiresShipping

            })
          )
        : [],

    options:
      Array.isArray(product.options)
        ? product.options.map(
            option => ({

              name:
                option.name,

              values:
                option.values

            })
          )
        : [],

    images:
      Array.isArray(product.images)
        ? product.images.map(
            image => ({

              src:
                image.url,

              alt:
                image.altText

            })
          )
        : []

  };

};


// ============================================================================
// GET PRODUCT STATISTICS
// ============================================================================

const getProductStats = async (
  userId,
  storeId
) => {

  await ensureStoreOwnership(
    userId,
    storeId
  );


  const stats =
    await ProductAI.aggregate([

      {
        $match: {

          userId:
            new mongoose.Types.ObjectId(
              userId
            ),

          storeId:
            new mongoose.Types.ObjectId(
              storeId
            )

        }

      },

      {
        $group: {

          _id:
            '$status',

          count:
            {
              $sum: 1
            }

        }

      }

    ]);


  const result = {

    total: 0,

    draft: 0,

    generating: 0,

    generated: 0,

    review: 0,

    ready: 0,

    published: 0,

    failed: 0,

    archived: 0

  };


  for (
    const item
    of stats
  ) {

    result[item._id] =
      item.count;

    result.total +=
      item.count;

  }


  return result;

};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  createProductDraft,

  getProduct,

  listProducts,

  updateProduct,

  generateProductWithAI,

  updateStatus,

  setShopifyProductId,

  updateShopifySyncStatus,

  deleteProduct,

  buildShopifyPayload,

  getProductStats,

  ensureStoreOwnership

};
