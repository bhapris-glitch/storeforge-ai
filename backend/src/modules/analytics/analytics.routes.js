// ============================================================================
// StoreForge AI
// Analytics Routes
// ============================================================================

'use strict';

const express = require('express');

const analyticsController =
  require('./analytics.controller');

const auth =
  require('../../middleware/auth');

const router =
  express.Router();


// ============================================================================
// AUTHENTICATED ANALYTICS ROUTES
// ============================================================================

// -----------------------------------------------------------------------------
// Record a generic analytics event
// POST /api/analytics/events
// -----------------------------------------------------------------------------

router.post(
  '/events',
  auth,
  analyticsController.recordEvent
);


// -----------------------------------------------------------------------------
// Record AI usage
// POST /api/analytics/ai-usage
// -----------------------------------------------------------------------------

router.post(
  '/ai-usage',
  auth,
  analyticsController.recordAIUsage
);


// -----------------------------------------------------------------------------
// Overall analytics summary
// GET /api/analytics/summary
// -----------------------------------------------------------------------------

router.get(
  '/summary',
  auth,
  analyticsController.getSummary
);


// -----------------------------------------------------------------------------
// Daily analytics
// GET /api/analytics/daily
// -----------------------------------------------------------------------------

router.get(
  '/daily',
  auth,
  analyticsController.getDailyAnalytics
);


// -----------------------------------------------------------------------------
// Event counts
// GET /api/analytics/events/counts
// -----------------------------------------------------------------------------

router.get(
  '/events/counts',
  auth,
  analyticsController.getEventCounts
);


// -----------------------------------------------------------------------------
// Category summary
// GET /api/analytics/categories
// -----------------------------------------------------------------------------

router.get(
  '/categories',
  auth,
  analyticsController.getCategorySummary
);


// -----------------------------------------------------------------------------
// Recent analytics events
// GET /api/analytics/recent
// -----------------------------------------------------------------------------

router.get(
  '/recent',
  auth,
  analyticsController.getRecentEvents
);


// -----------------------------------------------------------------------------
// Store-specific analytics
// GET /api/analytics/store/:storeId
// -----------------------------------------------------------------------------

router.get(
  '/store/:storeId',
  auth,
  analyticsController.getStoreAnalytics
);


// -----------------------------------------------------------------------------
// Delete store analytics
// DELETE /api/analytics/store/:storeId
// -----------------------------------------------------------------------------

router.delete(
  '/store/:storeId',
  auth,
  analyticsController.deleteStoreAnalytics
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
