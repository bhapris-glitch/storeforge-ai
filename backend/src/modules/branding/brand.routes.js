/**
 * ============================================================================
 * StoreForge AI
 * Brand Routes
 * ============================================================================
 *
 * File:
 * backend/src/modules/branding/brand.routes.js
 *
 * Base URL:
 * /api/branding
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
  createBrand,
  getBrand,
  getOrCreateBrand,
  updateBrand,
  updateBrandFromAI,
  updateCompletionStatus,
  deleteBrand,
  getBrandContext
} = require('./brand.controller');


// ============================================================================
// MIDDLEWARE
// ============================================================================

const authMiddleware =
  require('../../middleware/auth');


// ============================================================================
// ALL BRAND ROUTES REQUIRE AUTHENTICATION
// ============================================================================

router.use(
  authMiddleware
);


// ============================================================================
// CREATE BRAND
// ============================================================================
//
// POST /api/branding/:storeId
//

router.post(
  '/:storeId',
  createBrand
);


// ============================================================================
// GET BRAND
// ============================================================================
//
// GET /api/branding/:storeId
//

router.get(
  '/:storeId',
  getBrand
);


// ============================================================================
// GET OR CREATE BRAND PROFILE
// ============================================================================
//
// GET /api/branding/:storeId/profile
//
// Used by the frontend branding page.
//

router.get(
  '/:storeId/profile',
  getOrCreateBrand
);


// ============================================================================
// UPDATE BRAND
// ============================================================================
//
// PATCH /api/branding/:storeId
//

router.patch(
  '/:storeId',
  updateBrand
);


// ============================================================================
// UPDATE BRAND FROM AI
// ============================================================================
//
// PATCH /api/branding/:storeId/ai
//

router.patch(
  '/:storeId/ai',
  updateBrandFromAI
);


// ============================================================================
// UPDATE COMPLETION STATUS
// ============================================================================
//
// PATCH /api/branding/:storeId/completion
//

router.patch(
  '/:storeId/completion',
  updateCompletionStatus
);


// ============================================================================
// GET AI BRAND CONTEXT
// ============================================================================
//
// GET /api/branding/:storeId/ai-context
//
// Used by the AI theme-generation pipeline.
//

router.get(
  '/:storeId/ai-context',
  getBrandContext
);


// ============================================================================
// DELETE BRAND
// ============================================================================
//
// DELETE /api/branding/:storeId
//

router.delete(
  '/:storeId',
  deleteBrand
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
