/**
 * ============================================================================
 * StoreForge AI
 * Shopify Webhook Service
 * ============================================================================
 *
 * File:
 *   backend/src/modules/shopify/webhook.service.js
 *
 * Purpose:
 *   Shopify webhook processing and store synchronization.
 *
 * Handles:
 *
 *   APP_UNINSTALLED
 *   SHOP_UPDATE
 *   APP_SUBSCRIPTIONS_UPDATE
 *
 * Security:
 *   - Verifies Shopify HMAC
 *   - Uses timing-safe comparison
 *   - Does not trust shop information from the request body
 *
 * Compatible with:
 *
 *   backend/src/modules/stores/store.model.js
 *
 * Existing Store fields:
 *
 *   userId
 *   storeName
 *   shopDomain
 *   accessToken
 *   scope
 *   shopifyPlan
 *   currency
 *   timezone
 *   email
 *   country
 *   status
 *   installedAt
 *   uninstalledAt
 *
 * ============================================================================
 */

'use strict';

const crypto = require('crypto');

const Store = require('../stores/store.model');


// ============================================================================
// CONFIGURATION
// ============================================================================

const SHOPIFY_API_SECRET =
  process.env.SHOPIFY_API_SECRET ||
  process.env.SHOPIFY_API_SECRET_KEY ||
  process.env.SHOPIFY_CLIENT_SECRET;


// ============================================================================
// VALIDATION
// ============================================================================

function validateConfiguration() {
  if (!SHOPIFY_API_SECRET) {
    const error = new Error(
      'SHOPIFY_API_SECRET is not configured.'
    );

    error.code =
      'SHOPIFY_WEBHOOK_CONFIG_MISSING';

    throw error;
  }
}


// ============================================================================
// NORMALIZE SHOP DOMAIN
// ============================================================================

function normalizeShopDomain(shop) {
  if (!shop) {
    return null;
  }

  return String(shop)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0];
}


// ============================================================================
// VERIFY SHOPIFY WEBHOOK HMAC
// ============================================================================
//
// Shopify signs the RAW request body.
//
// IMPORTANT:
// The Express webhook route must preserve the raw request body.
// Do NOT verify the HMAC against JSON.stringify(req.body).
//
// Use:
//   express.raw({ type: 'application/json' })
//
// on the webhook endpoint.
//

function verifyWebhookHmac(
  rawBody,
  receivedHmac
) {
  validateConfiguration();

  if (!rawBody) {
    return false;
  }

  if (!receivedHmac) {
    return false;
  }

  const bodyBuffer =
    Buffer.isBuffer(rawBody)
      ? rawBody
      : Buffer.from(rawBody);

  const calculatedHmac =
    crypto
      .createHmac(
        'sha256',
        SHOPIFY_API_SECRET
      )
      .update(bodyBuffer)
      .digest('base64');

  const receivedBuffer =
    Buffer.from(
      String(receivedHmac)
    );

  const calculatedBuffer =
    Buffer.from(calculatedHmac);

  if (
    receivedBuffer.length !==
    calculatedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedBuffer,
    calculatedBuffer
  );
}


// ============================================================================
// PARSE WEBHOOK BODY
// ============================================================================

function parseWebhookBody(rawBody) {
  if (!rawBody) {
    return {};
  }

  if (
    typeof rawBody === 'object' &&
    !Buffer.isBuffer(rawBody)
  ) {
    return rawBody;
  }

  try {
    return JSON.parse(
      Buffer.isBuffer(rawBody)
        ? rawBody.toString('utf8')
        : String(rawBody)
    );
  } catch (error) {
    const parseError =
      new Error(
        'Invalid Shopify webhook JSON.'
      );

    parseError.code =
      'INVALID_WEBHOOK_BODY';

    throw parseError;
  }
}


// ============================================================================
// GET SHOP FROM WEBHOOK HEADERS
// ============================================================================

function getShopFromHeaders(headers = {}) {
  return normalizeShopDomain(
    headers['x-shopify-shop-domain'] ||
    headers['X-Shopify-Shop-Domain']
  );
}


// ============================================================================
// GET WEBHOOK TOPIC
// ============================================================================

function getWebhookTopic(headers = {}) {
  return (
    headers['x-shopify-topic'] ||
    headers['X-Shopify-Topic'] ||
    ''
  )
    .trim()
    .toLowerCase();
}


// ============================================================================
// GET WEBHOOK ID
// ============================================================================

function getWebhookId(headers = {}) {
  return (
    headers['x-shopify-webhook-id'] ||
    headers['X-Shopify-Webhook-Id'] ||
    headers['X-Shopify-Webhook-ID'] ||
    null
  );
}


// ============================================================================
// GET API VERSION
// ============================================================================

function getShopifyApiVersion(headers = {}) {
  return (
    headers['x-shopify-api-version'] ||
    headers['X-Shopify-Api-Version'] ||
    null
  );
}


// ============================================================================
// FIND STORE
// ============================================================================

async function findStoreByShopDomain(
  shopDomain
) {
  const normalizedShop =
    normalizeShopDomain(shopDomain);

  if (!normalizedShop) {
    return null;
  }

  return Store.findOne({
    shopDomain:
      normalizedShop
  });
}


// ============================================================================
// HANDLE APP UNINSTALLED
// ============================================================================
//
// When a merchant removes StoreForge from Shopify:
//
//   accessToken → removed
//   status      → uninstalled
//   uninstalledAt → current time
//
// We intentionally do NOT delete the Store document.
// This preserves historical store information and allows the merchant
// to reconnect later.
//

async function handleAppUninstalled({
  shopDomain
}) {
  const normalizedShop =
    normalizeShopDomain(shopDomain);

  if (!normalizedShop) {
    const error =
      new Error(
        'Shopify shop domain is required.'
      );

    error.code =
      'SHOP_DOMAIN_REQUIRED';

    throw error;
  }

  const store =
    await Store.findOneAndUpdate(
      {
        shopDomain:
          normalizedShop
      },

      {
        $set: {
          status:
            'uninstalled',

          accessToken:
            null,

          uninstalledAt:
            new Date()
        }
      },

      {
        new: true
      }
    );

  if (!store) {
    return {
      success: true,
      found: false,
      shopDomain:
        normalizedShop
    };
  }

  return {
    success: true,
    found: true,
    storeId:
      store._id,
    shopDomain:
      store.shopDomain,
    status:
      store.status
  };
}


// ============================================================================
// HANDLE SHOP UPDATE
// ============================================================================
//
// Shopify can send shop information changes.
//
// We update only fields represented by the current Store model.
//

async function handleShopUpdate({
  shopDomain,
  payload = {}
}) {
  const normalizedShop =
    normalizeShopDomain(shopDomain);

  if (!normalizedShop) {
    const error =
      new Error(
        'Shopify shop domain is required.'
      );

    error.code =
      'SHOP_DOMAIN_REQUIRED';

    throw error;
  }

  const store =
    await Store.findOne({
      shopDomain:
        normalizedShop
    });

  if (!store) {
    return {
      success: true,
      found: false,
      shopDomain:
        normalizedShop
    };
  }

  const update = {};

  if (payload.name) {
    update.storeName =
      String(payload.name).trim();
  }

  if (payload.email) {
    update.email =
      String(payload.email)
        .trim()
        .toLowerCase();
  }

  if (payload.currency) {
    update.currency =
      String(payload.currency)
        .trim()
        .toUpperCase();
  }

  if (
    payload.iana_timezone ||
    payload.timezone
  ) {
    update.timezone =
      payload.iana_timezone ||
      payload.timezone;
  }

  if (
    payload.country_name ||
    payload.country
  ) {
    update.country =
      payload.country_name ||
      payload.country;
  }

  if (
    payload.plan_name
  ) {
    update.shopifyPlan =
      payload.plan_name;
  }

  const updatedStore =
    await Store.findOneAndUpdate(
      {
        shopDomain:
          normalizedShop
      },

      {
        $set:
          update
      },

      {
        new: true,
        runValidators: true
      }
    );

  return {
    success: true,
    found: true,
    storeId:
      updatedStore._id,
    shopDomain:
      updatedStore.shopDomain
  };
}


// ============================================================================
// HANDLE SUBSCRIPTION UPDATE
// ============================================================================
//
// StoreForge does not treat Shopify's subscription as its own billing system.
// This handler records the Shopify plan when available.
//
// StoreForge billing will be handled separately by:
//   modules/billing/
//

async function handleSubscriptionUpdate({
  shopDomain,
  payload = {}
}) {
  const normalizedShop =
    normalizeShopDomain(shopDomain);

  if (!normalizedShop) {
    const error =
      new Error(
        'Shopify shop domain is required.'
      );

    error.code =
      'SHOP_DOMAIN_REQUIRED';

    throw error;
  }

  const store =
    await Store.findOne({
      shopDomain:
        normalizedShop
    });

  if (!store) {
    return {
      success: true,
      found: false,
      shopDomain:
        normalizedShop
    };
  }

  const planName =
    payload?.app_subscription?.name ||
    payload?.name ||
    payload?.plan_name ||
    null;

  if (planName) {
    store.shopifyPlan =
      String(planName);
  }

  await store.save();

  return {
    success: true,
    found: true,
    storeId:
      store._id,
    shopDomain:
      store.shopDomain,
    shopifyPlan:
      store.shopifyPlan
  };
}


// ============================================================================
// PROCESS WEBHOOK
// ============================================================================
//
// Main entry point for the controller.
//
// Example:
//
// await processWebhook({
//   topic,
//   shopDomain,
//   rawBody,
//   headers
// });
//

async function processWebhook({
  topic,
  shopDomain,
  rawBody,
  headers = {}
}) {
  const webhookTopic =
    String(topic || '')
      .trim()
      .toLowerCase();

  const normalizedShop =
    normalizeShopDomain(shopDomain);

  if (!webhookTopic) {
    const error =
      new Error(
        'Shopify webhook topic is required.'
      );

    error.code =
      'WEBHOOK_TOPIC_REQUIRED';

    throw error;
  }

  if (!normalizedShop) {
    const error =
      new Error(
        'Shopify shop domain is required.'
      );

    error.code =
      'SHOP_DOMAIN_REQUIRED';

    throw error;
  }

  const payload =
    parseWebhookBody(rawBody);

  switch (webhookTopic) {

    // ------------------------------------------------------------------------
    // APP UNINSTALLED
    // ------------------------------------------------------------------------

    case 'app/uninstalled':
      return handleAppUninstalled({
        shopDomain:
          normalizedShop
      });


    // ------------------------------------------------------------------------
    // SHOP UPDATE
    // ------------------------------------------------------------------------

    case 'shop/update':
      return handleShopUpdate({
        shopDomain:
          normalizedShop,

        payload
      });


    // ------------------------------------------------------------------------
    // APP SUBSCRIPTION UPDATE
    // ------------------------------------------------------------------------

    case 'app_subscriptions/update':
    case 'app/subscriptions/update':
      return handleSubscriptionUpdate({
        shopDomain:
          normalizedShop,

        payload
      });


    // ------------------------------------------------------------------------
    // UNKNOWN WEBHOOK
    // ------------------------------------------------------------------------

    default:
      return {
        success: true,
        handled: false,
        topic:
          webhookTopic,
        shopDomain:
          normalizedShop
      };
  }
}


// ============================================================================
// VERIFY + PROCESS WEBHOOK
// ============================================================================
//
// Convenience method for the controller.
//
// It performs:
//   1. HMAC verification
//   2. Header extraction
//   3. Body parsing
//   4. Topic routing
//

async function verifyAndProcessWebhook({
  rawBody,
  headers = {}
}) {
  const receivedHmac =
    headers['x-shopify-hmac-sha256'] ||
    headers['X-Shopify-Hmac-Sha256'];

  const valid =
    verifyWebhookHmac(
      rawBody,
      receivedHmac
    );

  if (!valid) {
    const error =
      new Error(
        'Invalid Shopify webhook signature.'
      );

    error.code =
      'INVALID_WEBHOOK_HMAC';

    error.statusCode = 401;

    throw error;
  }

  const topic =
    getWebhookTopic(headers);

  const shopDomain =
    getShopFromHeaders(headers);

  const webhookId =
    getWebhookId(headers);

  const apiVersion =
    getShopifyApiVersion(headers);

  const result =
    await processWebhook({
      topic,
      shopDomain,
      rawBody,
      headers
    });

  return {
    ...result,

    webhookId,
    apiVersion,
    topic,
    shopDomain
  };
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  normalizeShopDomain,

  verifyWebhookHmac,

  parseWebhookBody,

  getShopFromHeaders,

  getWebhookTopic,

  getWebhookId,

  getShopifyApiVersion,

  findStoreByShopDomain,

  handleAppUninstalled,

  handleShopUpdate,

  handleSubscriptionUpdate,

  processWebhook,

  verifyAndProcessWebhook
};
