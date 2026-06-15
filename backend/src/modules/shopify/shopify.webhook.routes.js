// storeforge-ai/backend/src/modules/shopify/shopify.webhook.routes.js
const express = require("express");

const router = express.Router();

const verifyWebhook = require(
  "../../middleware/verifyWebhook"
);

const {
  handleWebhook
} = require(
  "./shopify.webhook.controller"
);

/*
|--------------------------------------------------------------------------
| Shopify Webhooks
|--------------------------------------------------------------------------
|
| POST /api/shopify/webhooks
|
| This endpoint receives webhook events from Shopify.
| The request body must remain raw (Buffer), which is configured
| in backend/app.js using express.raw().
|
*/

router.post(
  "/",
  verifyWebhook,
  handleWebhook
);

module.exports = router;
