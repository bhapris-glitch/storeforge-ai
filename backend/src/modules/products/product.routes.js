/**
 * ============================================================================
 * StoreForge AI
 * Product Routes
 * ============================================================================
 *
 * File:
 * backend/src/modules/products/product.routes.js
 *
 * Base URL:
 * /api/products
 *
 * ============================================================================
 */

'use strict';

const express = require('express');

const router = express.Router();


// ============================================================================
// CONTROLLER
// ============================================================================

const {
  createProductDraft,
  getProduct,
  listProducts,
  updateProduct,
  generateProductWithAI,
  updateStatus,
  setShopifyProductId,
  updateShopifySyncStatus,
  buildShopifyPayload,
  getProductStats,
  deleteProduct
} = require('./product.controller');


// ============================================================================
// AUTH MIDDLEWARE
// ============================================================================

const authMiddleware =
  require('../../middleware/auth');


// ============================================================================
// AUTHENTICATION
// ============================================================================
//
// Every product endpoint requires an authenticated StoreForge user.
//

router.use(
  authMiddleware
);


// ============================================================================
// PRODUCT LIST
// ============================================================================
//
// GET /api/products/:storeId
//
// Query parameters:
//
// ?page=1
// ?limit=20
// ?status=generated
// ?search=shirt
//

router.get(
  '/:storeId',
  listProducts
);


// ============================================================================
// PRODUCT STATISTICS
// ============================================================================
//
// GET /api/products/:storeId/stats
//

router.get(
  '/:storeId/stats',
  getProductStats
);


// ============================================================================
// AI PRODUCT GENERATION
// ============================================================================
//
// POST /api/products/:storeId/generate
//
// Body:
//
// {
//   "productIdea": "Premium organic cotton t-shirt",
//   "targetMarket": "US",
//   "niche": "Sustainable fashion",
//   "tone": "Premium",
//   "language": "en"
// }
//

router.post(
  '/:storeId/generate',
  generateProductWithAI
);


// ============================================================================
// CREATE PRODUCT DRAFT
// ============================================================================
//
// POST /api/products/:storeId
//

router.post(
  '/:storeId',
  createProductDraft
);


// ============================================================================
// GET SINGLE PRODUCT
// ============================================================================
//
// GET /api/products/:storeId/:productId
//

router.get(
  '/:storeId/:productId',
  getProduct
);


// ============================================================================
// UPDATE PRODUCT
// ============================================================================
//
// PATCH /api/products/:storeId/:productId
//

router.patch(
  '/:storeId/:productId',
  updateProduct
);


// ============================================================================
// UPDATE PRODUCT STATUS
// ============================================================================
//
// PATCH /api/products/:storeId/:productId/status
//
// Body:
//
// {
//   "status": "ready"
// }
//

router.patch(
  '/:storeId/:productId/status',
  updateStatus
);


// ============================================================================
// SET SHOPIFY PRODUCT ID
// ============================================================================
//
// PATCH /api/products/:storeId/:productId/shopify
//

router.patch(
  '/:storeId/:productId/shopify',
  setShopifyProductId
);


// ============================================================================
// UPDATE SHOPIFY SYNC STATUS
// ============================================================================
//
// PATCH /api/products/:storeId/:productId/shopify-sync
//

router.patch(
  '/:storeId/:productId/shopify-sync',
  updateShopifySyncStatus
);


// ============================================================================
// BUILD SHOPIFY PAYLOAD
// ============================================================================
//
// GET /api/products/:storeId/:productId/shopify-payload
//
// This prepares the Shopify payload.
// It does NOT publish the product.
//

router.get(
  '/:storeId/:productId/shopify-payload',
  buildShopifyPayload
);


// ============================================================================
// DELETE PRODUCT
// ============================================================================
//
// DELETE /api/products/:storeId/:productId
//

router.delete(
  '/:storeId/:productId',
  deleteProduct
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
