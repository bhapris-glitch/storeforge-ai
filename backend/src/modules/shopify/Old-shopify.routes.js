// ===============================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/shopify/shopify.routes.js
// ===============================================================
const express = require("express");

const router = express.Router();

const {
  install,
  callback,
  getStore
} = require("./shopify.controller");

const authMiddleware = require(
  "../../middleware/auth"
);

/*
|--------------------------------------------------------------------------
| Shopify Install
|--------------------------------------------------------------------------
|
| GET /api/shopify/install?shop=xxxx.myshopify.com
|
*/

router.get(
  "/install",
  install
);

/*
|--------------------------------------------------------------------------
| Shopify OAuth Callback
|--------------------------------------------------------------------------
|
| GET /api/shopify/callback
|
*/

router.get(
  "/callback",
  callback
);

/*
|--------------------------------------------------------------------------
| Connected Store
|--------------------------------------------------------------------------
|
| GET /api/shopify/store/:id
|
*/

router.get(
  "/store/:id",
  authMiddleware,
  getStore
);

module.exports = router;
