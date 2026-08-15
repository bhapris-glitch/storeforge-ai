/**
 * ============================================================================
 * StoreForge AI
 * Express Application
 * ============================================================================
 *
 * File:
 * backend/src/app.js
 *
 * ============================================================================
 */

'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');


// ============================================================================
// ROUTES
// ============================================================================

const authRoutes =
  require('./modules/auth/auth.routes');

const storeRoutes =
  require('./modules/stores/store.routes');

const shopifyRoutes =
  require('./modules/shopify/shopify.routes');

const shopifyWebhookRoutes =
  require('./modules/shopify/shopify.webhook.routes');

const themeRoutes =
  require('./modules/themes/theme.routes');

const brandRoutes =
  require('./modules/branding/brand.routes');

const productRoutes =
  require('./modules/products/product.routes');

const analyticsRoutes =
  require('./modules/analytics/analytics.routes');

const adminRoutes =
  require('./modules/admin/admin.routes');


// ============================================================================
// BILLING
// ============================================================================

const billingRoutes =
  require('./modules/billing/billing.routes');

const billingWebhookController =
  require('./modules/billing/billing.webhook.controller');


// ============================================================================
// ERROR HANDLER
// ============================================================================

const errorHandler =
  require('./middleware/errorHandler');


// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();


// ============================================================================
// SECURITY
// ============================================================================

app.use(
  helmet()
);


// ============================================================================
// CORS
// ============================================================================

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:3000',

    credentials: true,
  })
);


// ============================================================================
// COMPRESSION
// ============================================================================

app.use(
  compression()
);


// ============================================================================
// SHOPIFY WEBHOOK RAW BODY
// ============================================================================
//
// IMPORTANT:
//
// Shopify HMAC verification requires the exact raw request body.
//
// This MUST be registered before express.json().
//
// ============================================================================

app.use(
  '/api/shopify/webhooks',
  express.raw({
    type: 'application/json',
    limit: '10mb',
  })
);


// ============================================================================
// STRIPE BILLING WEBHOOK RAW BODY
// ============================================================================
//
// IMPORTANT:
//
// Stripe signature verification also requires the exact raw request body.
//
// This MUST be registered before express.json().
//
// Do NOT put auth middleware on this endpoint.
// Stripe calls this endpoint directly.
//
// ============================================================================

app.post(
  '/api/billing/webhook',
  express.raw({
    type: 'application/json',
    limit: '2mb',
  }),
  billingWebhookController.handleStripeWebhook
);


// ============================================================================
// NORMAL BODY PARSERS
// ============================================================================

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);


// ============================================================================
// HTTP LOGGER
// ============================================================================

if (
  process.env.NODE_ENV !== 'test'
) {
  app.use(
    morgan(
      process.env.NODE_ENV === 'production'
        ? 'combined'
        : 'dev'
    )
  );
}


// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get(
  '/',
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        'StoreForge AI API Running',

      version:
        process.env.APP_VERSION ||
        '1.0.0',

      environment:
        process.env.NODE_ENV ||
        'development',
    });
  }
);


// ============================================================================
// API HEALTH CHECK
// ============================================================================

app.get(
  '/api/health',
  (req, res) => {
    return res.status(200).json({
      success: true,

      service:
        'storeforge-ai',

      status:
        'healthy',

      timestamp:
        new Date().toISOString(),
    });
  }
);


// ============================================================================
// AUTH ROUTES
// ============================================================================
//
// /api/auth
//
// ============================================================================

app.use(
  '/api/auth',
  authRoutes
);


// ============================================================================
// PRODUCT ROUTES
// ============================================================================
//
// /api/products
//
// ============================================================================

app.use(
  '/api/products',
  productRoutes
);


// ============================================================================
// STORE ROUTES
// ============================================================================
//
// /api/stores
//
// ============================================================================

app.use(
  '/api/stores',
  storeRoutes
);


// ============================================================================
// BRANDING ROUTES
// ============================================================================
//
// /api/branding
//
// Examples:
//
// POST   /api/branding/:storeId
// GET    /api/branding/:storeId
// PATCH  /api/branding/:storeId
// DELETE /api/branding/:storeId
//
// ============================================================================

app.use(
  '/api/branding',
  brandRoutes
);


// ============================================================================
// THEME ROUTES
// ============================================================================
//
// /api/themes
//
// ============================================================================

app.use(
  '/api/themes',
  themeRoutes
);


// ============================================================================
// BILLING ROUTES
// ============================================================================
//
// /api/billing
//
// Available:
//
// GET  /api/billing/plans
// GET  /api/billing/subscription
// POST /api/billing/checkout
// POST /api/billing/cancel
// POST /api/billing/resume
// POST /api/billing/change-plan
// GET  /api/billing/limits
// POST /api/billing/feature
//
// The webhook is registered separately above because it requires
// express.raw() before express.json().
//
// ============================================================================

app.use(
  '/api/billing',
  billingRoutes
);

// ============================================================================
// ANALYTICS ROUTES
// ============================================================================

app.use(
  '/api/analytics',
  analyticsRoutes
);


// ============================================================================
// ADMIN ROUTES
// ============================================================================

app.use(
  '/api/admin',
  adminRoutes
);


// ============================================================================
// SHOPIFY WEBHOOK ROUTES
// ============================================================================
//
// IMPORTANT:
//
// Raw-body middleware is already registered above.
//
// Flow:
//
// Shopify
//   ↓
// express.raw()
//   ↓
// shopify.webhook.routes.js
//   ↓
// verifyWebhook
//   ↓
// shopify.webhook.controller.js
//   ↓
// webhook.service.js
//
// ============================================================================

app.use(
  '/api/shopify/webhooks',
  shopifyWebhookRoutes
);


// ============================================================================
// SHOPIFY NORMAL ROUTES
// ============================================================================
//
// /api/shopify
//
// Examples:
//
// GET /api/shopify/install
// GET /api/shopify/callback
// GET /api/shopify/store/:id
//
// ============================================================================

app.use(
  '/api/shopify',
  shopifyRoutes
);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,

      message:
        'Route not found',

      path:
        req.originalUrl,
    });
  }
);


// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
//
// Must be the LAST middleware.
//
// ============================================================================

app.use(
  errorHandler
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = app;
