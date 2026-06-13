// ============================================================
// storeforge-ai/backend/src/config/shopify.js
// Layboka AI 
// ============================================================
const crypto = require("crypto");

/*
|--------------------------------------------------------------------------
| Shopify Configuration
|--------------------------------------------------------------------------
*/

const shopifyConfig = {
  apiKey:
    process.env.SHOPIFY_API_KEY,

  apiSecret:
    process.env.SHOPIFY_API_SECRET,

  scopes:
    process.env.SHOPIFY_SCOPES ||
    "",

  appUrl:
    process.env.SHOPIFY_APP_URL ||
    ""
};

/*
|--------------------------------------------------------------------------
| Build OAuth URL
|--------------------------------------------------------------------------
*/

const buildInstallUrl = (
  shop
) => {
  const redirectUri =
    `${shopifyConfig.appUrl}/api/shopify/callback`;

  return `https://${shop}/admin/oauth/authorize?client_id=${shopifyConfig.apiKey}&scope=${shopifyConfig.scopes}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};

/*
|--------------------------------------------------------------------------
| Verify Shopify HMAC
|--------------------------------------------------------------------------
*/

const verifyHmac = (
  query
) => {
  const {
    hmac,
    signature,
    ...params
  } = query;

  const message =
    Object.keys(params)
      .sort()
      .map(
        (key) =>
          `${key}=${params[key]}`
      )
      .join("&");

  const generatedHmac =
    crypto
      .createHmac(
        "sha256",
        shopifyConfig.apiSecret
      )
      .update(message)
      .digest("hex");

  return (
    generatedHmac === hmac
  );
};

/*
|--------------------------------------------------------------------------
| Generate Nonce State
|--------------------------------------------------------------------------
*/

const generateState = () => {
  return crypto
    .randomBytes(16)
    .toString("hex");
};

module.exports = {
  shopifyConfig,
  buildInstallUrl,
  verifyHmac,
  generateState
};
