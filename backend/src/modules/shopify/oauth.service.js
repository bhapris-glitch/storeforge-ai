/**
 * ============================================================================
 * StoreForge AI
 * Shopify OAuth Service
 * ============================================================================
 *
 * File:
 *   backend/src/modules/shopify/oauth.service.js
 *
 * Purpose:
 *   Handles the Shopify OAuth installation flow.
 *
 * Flow:
 *
 *   StoreForge
 *       |
 *       | generateInstallUrl()
 *       v
 *   Shopify OAuth
 *       |
 *       | merchant approves
 *       v
 *   callback
 *       |
 *       | exchange code
 *       v
 *   Shopify access token
 *       |
 *       v
 *   Store MongoDB record
 *
 * Compatible with the existing Store model:
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

const SHOPIFY_API_KEY =
  process.env.SHOPIFY_API_KEY ||
  process.env.SHOPIFY_API_KEY_CLIENT_ID ||
  process.env.SHOPIFY_CLIENT_ID;

const SHOPIFY_API_SECRET =
  process.env.SHOPIFY_API_SECRET ||
  process.env.SHOPIFY_API_SECRET_KEY ||
  process.env.SHOPIFY_CLIENT_SECRET;

const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION ||
  '2025-10';

const SHOPIFY_SCOPES =
  process.env.SHOPIFY_SCOPES ||
  [
    'read_products',
    'write_products',
    'read_product_listings',
    'read_inventory',
    'write_inventory',
    'read_orders',
    'write_orders',
    'read_customers',
    'write_customers',
    'read_themes',
    'write_themes'
  ].join(',');

const SHOPIFY_REDIRECT_URI =
  process.env.SHOPIFY_REDIRECT_URI ||
  process.env.SHOPIFY_CALLBACK_URL;

const SHOPIFY_STATE_SECRET =
  process.env.SHOPIFY_STATE_SECRET ||
  SHOPIFY_API_SECRET;


// ============================================================================
// VALIDATION
// ============================================================================

function validateConfiguration() {
  const missing = [];

  if (!SHOPIFY_API_KEY) {
    missing.push('SHOPIFY_API_KEY');
  }

  if (!SHOPIFY_API_SECRET) {
    missing.push('SHOPIFY_API_SECRET');
  }

  if (!SHOPIFY_REDIRECT_URI) {
    missing.push('SHOPIFY_REDIRECT_URI');
  }

  if (!SHOPIFY_STATE_SECRET) {
    missing.push('SHOPIFY_STATE_SECRET');
  }

  if (missing.length > 0) {
    const error = new Error(
      `Missing Shopify OAuth configuration: ${missing.join(', ')}`
    );

    error.code = 'SHOPIFY_OAUTH_CONFIG_MISSING';

    throw error;
  }
}


// ============================================================================
// SHOP DOMAIN NORMALIZATION
// ============================================================================

function normalizeShopDomain(shop) {
  if (!shop) {
    return null;
  }

  let domain = String(shop)
    .trim()
    .toLowerCase();

  domain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0];

  return domain;
}


// ============================================================================
// SHOP DOMAIN VALIDATION
// ============================================================================
//
// StoreForge initially supports Shopify *.myshopify.com stores.
//
// Custom storefront domains are NOT used as the OAuth shop identifier.
// Shopify OAuth should receive the merchant's Shopify admin domain.
//

function isValidShopDomain(shop) {
  if (!shop) {
    return false;
  }

  const normalized =
    normalizeShopDomain(shop);

  if (!normalized) {
    return false;
  }

  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(
    normalized
  );
}


// ============================================================================
// HMAC-SAFE STRING COMPARISON
// ============================================================================

function safeEqual(a, b) {
  const bufferA =
    Buffer.from(String(a));

  const bufferB =
    Buffer.from(String(b));

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    bufferA,
    bufferB
  );
}


// ============================================================================
// STATE TOKEN
// ============================================================================
//
// State protects the OAuth callback against CSRF.
//
// Structure:
//
//   base64url(payload).signature
//
// Payload contains:
//   - userId
//   - shop
//   - issued timestamp
//   - random nonce
//

function createOAuthState({
  userId,
  shop
}) {
  validateConfiguration();

  if (!userId) {
    throw new Error(
      'User ID is required for Shopify OAuth state.'
    );
  }

  if (!shop) {
    throw new Error(
      'Shop domain is required for Shopify OAuth state.'
    );
  }

  const payload = {
    userId: String(userId),
    shop: normalizeShopDomain(shop),
    iat: Date.now(),
    nonce: crypto
      .randomBytes(32)
      .toString('hex')
  };

  const encodedPayload =
    Buffer.from(
      JSON.stringify(payload)
    ).toString('base64url');

  const signature =
    crypto
      .createHmac(
        'sha256',
        SHOPIFY_STATE_SECRET
      )
      .update(encodedPayload)
      .digest('base64url');

  return `${encodedPayload}.${signature}`;
}


// ============================================================================
// VERIFY OAUTH STATE
// ============================================================================

function verifyOAuthState(
  state,
  expectedShop = null
) {
  validateConfiguration();

  if (!state || typeof state !== 'string') {
    const error = new Error(
      'Invalid OAuth state.'
    );

    error.code = 'INVALID_OAUTH_STATE';

    throw error;
  }

  const parts =
    state.split('.');

  if (parts.length !== 2) {
    const error = new Error(
      'Malformed OAuth state.'
    );

    error.code = 'INVALID_OAUTH_STATE';

    throw error;
  }

  const [
    encodedPayload,
    providedSignature
  ] = parts;

  const expectedSignature =
    crypto
      .createHmac(
        'sha256',
        SHOPIFY_STATE_SECRET
      )
      .update(encodedPayload)
      .digest('base64url');

  if (
    !safeEqual(
      providedSignature,
      expectedSignature
    )
  ) {
    const error = new Error(
      'OAuth state signature is invalid.'
    );

    error.code = 'INVALID_OAUTH_STATE';

    throw error;
  }

  let payload;

  try {
    payload = JSON.parse(
      Buffer.from(
        encodedPayload,
        'base64url'
      ).toString('utf8')
    );
  } catch (error) {
    const stateError = new Error(
      'OAuth state payload is invalid.'
    );

    stateError.code =
      'INVALID_OAUTH_STATE';

    throw stateError;
  }

  // --------------------------------------------------------------------------
  // STATE EXPIRATION
  // --------------------------------------------------------------------------

  const maxAge =
    10 * 60 * 1000;

  if (
    !payload.iat ||
    Date.now() - payload.iat > maxAge
  ) {
    const error = new Error(
      'OAuth state has expired.'
    );

    error.code = 'EXPIRED_OAUTH_STATE';

    throw error;
  }

  // --------------------------------------------------------------------------
  // USER
  // --------------------------------------------------------------------------

  if (!payload.userId) {
    const error = new Error(
      'OAuth state does not contain a user.'
    );

    error.code = 'INVALID_OAUTH_STATE';

    throw error;
  }

  // --------------------------------------------------------------------------
  // SHOP
  // --------------------------------------------------------------------------

  if (!isValidShopDomain(payload.shop)) {
    const error = new Error(
      'OAuth state contains an invalid Shopify domain.'
    );

    error.code = 'INVALID_OAUTH_STATE';

    throw error;
  }

  // --------------------------------------------------------------------------
  // EXPECTED SHOP
  // --------------------------------------------------------------------------

  if (expectedShop) {
    const normalizedExpectedShop =
      normalizeShopDomain(expectedShop);

    if (
      payload.shop !== normalizedExpectedShop
    ) {
      const error = new Error(
        'OAuth shop does not match the installation request.'
      );

      error.code = 'SHOP_MISMATCH';

      throw error;
    }
  }

  return payload;
}


// ============================================================================
// BUILD SHOPIFY AUTHORIZATION URL
// ============================================================================

function generateInstallUrl({
  shop,
  userId
}) {
  validateConfiguration();

  const normalizedShop =
    normalizeShopDomain(shop);

  if (!isValidShopDomain(normalizedShop)) {
    const error = new Error(
      'A valid Shopify .myshopify.com domain is required.'
    );

    error.code = 'INVALID_SHOP_DOMAIN';

    throw error;
  }

  if (!userId) {
    const error = new Error(
      'User ID is required.'
    );

    error.code = 'USER_ID_REQUIRED';

    throw error;
  }

  const state =
    createOAuthState({
      userId,
      shop: normalizedShop
    });

  const scopes =
    SHOPIFY_SCOPES
      .split(',')
      .map((scope) => scope.trim())
      .filter(Boolean)
      .join(',');

  const params =
    new URLSearchParams({
      client_id: SHOPIFY_API_KEY,
      scope: scopes,
      redirect_uri: SHOPIFY_REDIRECT_URI,
      state
    });

  const authorizationUrl =
    `https://${normalizedShop}/admin/oauth/authorize?${params.toString()}`;

  return {
    authorizationUrl,
    shop: normalizedShop,
    state
  };
}


// ============================================================================
// EXCHANGE AUTHORIZATION CODE FOR ACCESS TOKEN
// ============================================================================

async function exchangeCodeForAccessToken({
  shop,
  code
}) {
  validateConfiguration();

  const normalizedShop =
    normalizeShopDomain(shop);

  if (!isValidShopDomain(normalizedShop)) {
    const error = new Error(
      'Invalid Shopify shop domain.'
    );

    error.code = 'INVALID_SHOP_DOMAIN';

    throw error;
  }

  if (!code) {
    const error = new Error(
      'Shopify authorization code is required.'
    );

    error.code = 'AUTHORIZATION_CODE_REQUIRED';

    throw error;
  }

  const tokenUrl =
    `https://${normalizedShop}/admin/oauth/access_token`;

  const response =
    await fetch(
      tokenUrl,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Accept:
            'application/json'
        },

        body: JSON.stringify({
          client_id:
            SHOPIFY_API_KEY,

          client_secret:
            SHOPIFY_API_SECRET,

          code
        })
      }
    );

  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.errors
        ? JSON.stringify(data.errors)
        : 'Shopify token exchange failed.';

    const error =
      new Error(message);

    error.code =
      'SHOPIFY_TOKEN_EXCHANGE_FAILED';

    error.statusCode =
      response.status;

    throw error;
  }

  if (!data?.access_token) {
    const error =
      new Error(
        'Shopify did not return an access token.'
      );

    error.code =
      'SHOPIFY_ACCESS_TOKEN_MISSING';

    throw error;
  }

  return {
    accessToken:
      data.access_token,

    scope:
      data.scope || ''
  };
}


// ============================================================================
// SHOPIFY ADMIN API REQUEST
// ============================================================================

async function shopifyAdminRequest({
  shop,
  accessToken,
  endpoint,
  method = 'GET',
  body = null
}) {
  if (!shop) {
    throw new Error(
      'Shop domain is required.'
    );
  }

  if (!accessToken) {
    throw new Error(
      'Shopify access token is required.'
    );
  }

  const normalizedShop =
    normalizeShopDomain(shop);

  if (!isValidShopDomain(normalizedShop)) {
    throw new Error(
      'Invalid Shopify shop domain.'
    );
  }

  const url =
    `https://${normalizedShop}/admin/api/${SHOPIFY_API_VERSION}${endpoint}`;

  const headers = {
    'X-Shopify-Access-Token':
      accessToken,

    Accept:
      'application/json'
  };

  if (body !== null) {
    headers['Content-Type'] =
      'application/json';
  }

  const response =
    await fetch(
      url,
      {
        method,

        headers,

        body:
          body !== null
            ? JSON.stringify(body)
            : undefined
      }
    );

  let data = null;

  try {
    data =
      await response.json();
  } catch (error) {
    // Shopify may return an empty response.
  }

  if (!response.ok) {
    const error =
      new Error(
        `Shopify Admin API request failed with status ${response.status}.`
      );

    error.code =
      'SHOPIFY_ADMIN_API_ERROR';

    error.statusCode =
      response.status;

    error.shopifyResponse =
      data;

    throw error;
  }

  return data;
}


// ============================================================================
// GET SHOP INFORMATION
// ============================================================================

async function getShopInformation({
  shop,
  accessToken
}) {
  const data =
    await shopifyAdminRequest({
      shop,
      accessToken,
      endpoint: '/shop.json'
    });

  return data?.shop || null;
}


// ============================================================================
// SAVE / UPDATE STORE
// ============================================================================
//
// Compatible with the existing Store model.
//

async function saveShopifyStore({
  userId,
  shop,
  accessToken,
  scope,
  shopInfo
}) {
  if (!userId) {
    throw new Error(
      'User ID is required.'
    );
  }

  const normalizedShop =
    normalizeShopDomain(shop);

  if (!isValidShopDomain(normalizedShop)) {
    throw new Error(
      'Invalid Shopify shop domain.'
    );
  }

  if (!accessToken) {
    throw new Error(
      'Shopify access token is required.'
    );
  }

  const shopData =
    shopInfo || {};

  const storeData = {
    userId,

    storeName:
      shopData.name ||
      normalizedShop
        .replace('.myshopify.com', '')
        .replace(/-/g, ' '),

    shopDomain:
      normalizedShop,

    accessToken,

    scope:
      scope || '',

    shopifyPlan:
      shopData.plan_name ||
      '',

    currency:
      shopData.currency ||
      'USD',

    timezone:
      shopData.iana_timezone ||
      shopData.timezone ||
      '',

    email:
      shopData.email ||
      '',

    country:
      shopData.country_name ||
      shopData.country ||
      '',

    status:
      'active',

    installedAt:
      new Date(),

    uninstalledAt:
      null
  };

  const store =
    await Store.findOneAndUpdate(
      {
        shopDomain:
          normalizedShop
      },

      {
        $set: storeData
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

  return store;
}


// ============================================================================
// COMPLETE OAUTH CALLBACK
// ============================================================================

async function completeOAuth({
  shop,
  code,
  state
}) {
  validateConfiguration();

  const normalizedShop =
    normalizeShopDomain(shop);

  if (!isValidShopDomain(normalizedShop)) {
    const error = new Error(
      'Invalid Shopify shop domain.'
    );

    error.code =
      'INVALID_SHOP_DOMAIN';

    throw error;
  }

  // --------------------------------------------------------------------------
  // VERIFY STATE
  // --------------------------------------------------------------------------

  const stateData =
    verifyOAuthState(
      state,
      normalizedShop
    );

  // --------------------------------------------------------------------------
  // EXCHANGE CODE
  // --------------------------------------------------------------------------

  const tokenData =
    await exchangeCodeForAccessToken({
      shop:
        normalizedShop,

      code
    });

  // --------------------------------------------------------------------------
  // GET SHOP INFORMATION
  // --------------------------------------------------------------------------

  const shopInfo =
    await getShopInformation({
      shop:
        normalizedShop,

      accessToken:
        tokenData.accessToken
    });

  // --------------------------------------------------------------------------
  // SAVE STORE
  // --------------------------------------------------------------------------

  const store =
    await saveShopifyStore({
      userId:
        stateData.userId,

      shop:
        normalizedShop,

      accessToken:
        tokenData.accessToken,

      scope:
        tokenData.scope,

      shopInfo
    });

  return {
    store,
    userId:
      stateData.userId,

    shop:
      normalizedShop,

    shopInfo
  };
}


// ============================================================================
// GET STORED SHOPIFY CREDENTIALS
// ============================================================================
//
// accessToken is normally excluded by the Store model. This method explicitly
// selects it for internal Shopify API operations only.
//
// NEVER return this object directly to the frontend.
//

async function getShopCredentials({
  storeId,
  userId
}) {
  if (!storeId) {
    throw new Error(
      'Store ID is required.'
    );
  }

  const filter = {
    _id:
      storeId
  };

  if (userId) {
    filter.userId =
      userId;
  }

  const store =
    await Store.findOne(filter)
      .select(
        '+accessToken'
      );

  if (!store) {
    const error =
      new Error(
        'Store not found.'
      );

    error.code =
      'STORE_NOT_FOUND';

    throw error;
  }

  if (!store.accessToken) {
    const error =
      new Error(
        'Shopify store is not connected.'
      );

    error.code =
      'SHOPIFY_NOT_CONNECTED';

    throw error;
  }

  return {
    storeId:
      store._id,

    shopDomain:
      store.shopDomain,

    accessToken:
      store.accessToken,

    scope:
      store.scope
  };
}


// ============================================================================
// CHECK SHOPIFY CONNECTION
// ============================================================================

async function checkConnection({
  storeId,
  userId
}) {
  const credentials =
    await getShopCredentials({
      storeId,
      userId
    });

  try {
    const shopInfo =
      await getShopInformation({
        shop:
          credentials.shopDomain,

        accessToken:
          credentials.accessToken
      });

    return {
      connected: true,
      shop:
        credentials.shopDomain,
      shopInfo
    };
  } catch (error) {
    if (
      error.statusCode === 401 ||
      error.statusCode === 403
    ) {
      await Store.findByIdAndUpdate(
        storeId,
        {
          $set: {
            status:
              'suspended'
          }
        }
      );

      return {
        connected: false,
        shop:
          credentials.shopDomain
      };
    }

    throw error;
  }
}


// ============================================================================
// DISCONNECT STORE
// ============================================================================
//
// Shopify uninstall webhooks should also call the appropriate webhook service.
// This method handles the local StoreForge record.
//

async function disconnectStore({
  storeId,
  userId
}) {
  const filter = {
    _id:
      storeId
  };

  if (userId) {
    filter.userId =
      userId;
  }

  const store =
    await Store.findOneAndUpdate(
      filter,

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
    const error =
      new Error(
        'Store not found.'
      );

    error.code =
      'STORE_NOT_FOUND';

    throw error;
  }

  return store;
}


// ============================================================================
// RECONNECT STORE
// ============================================================================

async function reconnectStore({
  storeId,
  userId
}) {
  const filter = {
    _id:
      storeId
  };

  if (userId) {
    filter.userId =
      userId;
  }

  const store =
    await Store.findOne(filter);

  if (!store) {
    const error =
      new Error(
        'Store not found.'
      );

    error.code =
      'STORE_NOT_FOUND';

    throw error;
  }

  if (!store.shopDomain) {
    const error =
      new Error(
        'Store does not have a Shopify domain.'
      );

    error.code =
      'SHOPIFY_DOMAIN_MISSING';

    throw error;
  }

  return generateInstallUrl({
    shop:
      store.shopDomain,

    userId:
      store.userId
  });
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  normalizeShopDomain,
  isValidShopDomain,

  createOAuthState,
  verifyOAuthState,

  generateInstallUrl,

  exchangeCodeForAccessToken,

  shopifyAdminRequest,

  getShopInformation,

  saveShopifyStore,

  completeOAuth,

  getShopCredentials,

  checkConnection,

  disconnectStore,

  reconnectStore
};
