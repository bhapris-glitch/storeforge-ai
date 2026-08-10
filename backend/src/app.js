/**
 * ============================================================================
 * StoreForge AI
 * Express Application
 * ============================================================================
 *
 * File:
 * backend/src/app.js
 *
 * Purpose:
 * - Configure Express
 * - Configure security middleware
 * - Configure CORS
 * - Configure request parsing
 * - Configure Shopify raw webhook handling
 * - Mount application routes
 * - Handle 404 responses
 * - Handle global errors
 *
 * NOTE:
 * MongoDB connection and app.listen() belong in:
 *
 *   backend/src/server.js
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

const authRoutes = require('./modules/auth/auth.routes');

const storeRoutes = require('./modules/stores/store.routes');

const shopifyRoutes = require('./modules/shopify/shopify.routes');

const shopifyWebhookRoutes =
  require('./modules/shopify/shopify.webhook.routes');

const themeRoutes =
  require('./modules/themes/theme.routes');


// ============================================================================
// MIDDLEWARE
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

    credentials: true
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
// Shopify webhook HMAC verification requires the EXACT raw request body.
//
// Therefore this middleware MUST run before:
//
//     express.json()
//
// Do not move it below express.json().
//
// Only requests sent to:
//
//     /api/shopify/webhooks
//
// are parsed as raw Buffers.
//

app.use(
  '/api/shopify/webhooks',
  express.raw({
    type: 'application/json',
    limit: '10mb'
  })
);


// ============================================================================
// NORMAL JSON BODY PARSER
// ============================================================================
//
// All normal API requests use JSON.
//

app.use(
  express.json({
    limit: '10mb'
  })
);


// ============================================================================
// URL-ENCODED BODY PARSER
// ============================================================================

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);


// ============================================================================
// HTTP LOGGER
// ============================================================================

if (process.env.NODE_ENV !== 'test') {
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
//
// GET /
//
// Used by:
// - Railway
// - Render
// - Docker
// - Load balancers
// - Monitoring systems
//

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
        'development'

    });

  }
);


// ============================================================================
// API HEALTH CHECK
// ============================================================================
//
// GET /api/health
//

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
        new Date().toISOString()

    });

  }
);


// ============================================================================
// AUTH ROUTES
// ============================================================================
//
// /api/auth
//
// Examples:
//
// POST /api/auth/register
// POST /api/auth/login
//

app.use(
  '/api/auth',
  authRoutes
);


// ============================================================================
// STORE ROUTES
// ============================================================================
//
// /api/stores
//

app.use(
  '/api/stores',
  storeRoutes
);


// ============================================================================
// THEME ROUTES
// ============================================================================
//
// /api/themes
//

app.use(
  '/api/themes',
  themeRoutes
);


// ============================================================================
// SHOPIFY WEBHOOK ROUTES
// ============================================================================
//
// IMPORTANT:
//
// Keep this BEFORE the normal Shopify route.
//
// Final endpoint:
//
// POST /api/shopify/webhooks
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

app.use(
  '/api/shopify',
  shopifyRoutes
);


// ============================================================================
// 404 HANDLER
// ============================================================================
//
// Must remain AFTER all application routes.
//

app.use(
  (req, res) => {

    return res.status(404).json({

      success: false,

      message:
        'Route not found',

      path:
        req.originalUrl

    });

  }
);


// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
//
// Must be the LAST middleware.
//

app.use(
  errorHandler
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = app;
