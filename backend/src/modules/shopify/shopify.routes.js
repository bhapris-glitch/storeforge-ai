/**
 * ============================================================================
 * StoreForge AI
 * Shopify Routes
 * ============================================================================
 *
 * File:
 * backend/src/modules/shopify/shopify.routes.js
 *
 * Routes:
 *
 * GET  /api/shopify/install
 * GET  /api/shopify/callback
 * GET  /api/shopify/store/:id
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
  install,
  callback,
  getStore
} = require('./shopify.controller');


// ============================================================================
// MIDDLEWARE
// ============================================================================

const authMiddleware =
  require('../../middleware/auth');


// ============================================================================
// SHOPIFY INSTALL
// ============================================================================
//
// GET
// /api/shopify/install?shop=store.myshopify.com
//
// Authentication is required because the OAuth state contains
// the StoreForge user ID.
//

router.get(
  '/install',
  authMiddleware,
  install
);


// ============================================================================
// SHOPIFY OAUTH CALLBACK
// ============================================================================
//
// GET
// /api/shopify/callback
//
// Shopify calls this endpoint after the merchant approves
// the application.
//
// IMPORTANT:
// Do NOT put authMiddleware here.
//
// Shopify redirects the merchant from Shopify to this URL,
// and there may be no StoreForge JWT attached to the request.
// The OAuth state generated during /install identifies the user.
//

router.get(
  '/callback',
  callback
);


// ============================================================================
// GET CONNECTED STORE
// ============================================================================
//
// GET
// /api/shopify/store/:id
//
// Returns the authenticated user's connected store.
//

router.get(
  '/store/:id',
  authMiddleware,
  getStore
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
