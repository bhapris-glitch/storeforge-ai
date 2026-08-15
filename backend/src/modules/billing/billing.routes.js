// ============================================================================
// StoreForge AI
// Billing Routes
// ============================================================================

'use strict';

const express = require('express');

const billingController = require('./billing.controller');

const auth = require('../../middleware/auth');

const router = express.Router();


// ============================================================================
// PUBLIC BILLING ROUTES
// ============================================================================

// Get available plans
router.get(
  '/plans',
  billingController.getPlans
);


// ============================================================================
// AUTHENTICATED BILLING ROUTES
// ============================================================================

// Current subscription
router.get(
  '/subscription',
  auth,
  billingController.getSubscription
);


// Create Stripe Checkout Session
router.post(
  '/checkout',
  auth,
  billingController.createCheckoutSession
);


// Cancel subscription at period end
router.post(
  '/cancel',
  auth,
  billingController.cancelSubscription
);


// Resume a scheduled cancellation
router.post(
  '/resume',
  auth,
  billingController.resumeSubscription
);


// Change Starter / Growth / Premium plan
router.post(
  '/change-plan',
  auth,
  billingController.changePlan
);


// Current plan limits
router.get(
  '/limits',
  auth,
  billingController.getLimits
);


// Check whether the current plan has a feature
router.post(
  '/feature',
  auth,
  billingController.checkFeature
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
