// ============================================================================
// StoreForge AI
// backend/aap.js
// ============================================================================

'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');


// ============================================================================
// ROUTES
// ============================================================================

const authRoutes = require(
  './src/modules/auth/auth.routes'
);

const storeRoutes = require(
  './src/modules/stores/store.routes'
);

const shopifyRoutes = require(
  './src/modules/shopify/shopify.routes'
);

const shopifyWebhookRoutes = require(
  './src/modules/shopify/shopify.webhook.routes'
);

const themeRoutes = require(
  './src/modules/themes/theme.routes'
);


// ============================================================================
// ERROR HANDLER
// ============================================================================

const errorHandler = require(
  './src/middleware/errorHandler'
);


// ============================================================================
// APP
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
// PERFORMANCE
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
// Only the Shopify webhook endpoint receives a raw Buffer.
// Normal API requests continue to use express.json() below.
//

app.use(
  '/api/shopify/webhooks',
  express.raw({
    type: 'application/json',
    limit: '10mb'
  })
);


// ============================================================================
// BODY PARSER
// ============================================================================

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);


// ============================================================================
// LOGGER
// ============================================================================

app.use(
  morgan('dev')
);


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
        '1.0.0'

    });

  }
);


// ============================================================================
// API ROUTES
// ============================================================================

app.use(
  '/api/auth',
  authRoutes
);


app.use(
  '/api/stores',
  storeRoutes
);


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
// This route is mounted separately from the normal Shopify routes.
//
// Normal Shopify:
//   /api/shopify
//
// Shopify webhooks:
//   /api/shopify/webhooks
//
// The raw-body middleware above runs before this route.
//

app.use(
  '/api/shopify/webhooks',
  shopifyWebhookRoutes
);


// ============================================================================
// SHOPIFY NORMAL ROUTES
// ============================================================================
//
// Includes:
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

app.use(
  errorHandler
);


// ============================================================================
// EXPORT
// ============================================================================

module.exports = app;
