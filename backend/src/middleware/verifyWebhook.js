//=======================================================
// Layboka AI 
// storeforge-ai/backend/src/middleware/verifyWebhook.js
//=========================================================
const crypto = require("crypto");

/*
|--------------------------------------------------------------------------
| Shopify Webhook Verification Middleware
|--------------------------------------------------------------------------
|
| Verifies the X-Shopify-Hmac-Sha256 header using the raw request body.
|
| IMPORTANT:
| - app.js must register express.raw() for /api/shopify/webhooks
| - req.body must be a Buffer (not parsed JSON)
|
*/

const verifyWebhook = (
  req,
  res,
  next
) => {
  try {
    const shopifyHmac =
      req.get(
        "X-Shopify-Hmac-Sha256"
      );

    if (!shopifyHmac) {
      return res.status(401).json({
        success: false,
        message:
          "Missing Shopify HMAC header"
      });
    }

    if (!Buffer.isBuffer(req.body)) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid webhook configuration. Raw request body expected."
      });
    }

    const generatedHmac =
      crypto
        .createHmac(
          "sha256",
          process.env.SHOPIFY_API_SECRET
        )
        .update(req.body)
        .digest("base64");

    const valid =
      crypto.timingSafeEqual(
        Buffer.from(generatedHmac),
        Buffer.from(shopifyHmac)
      );

    if (!valid) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Shopify webhook signature"
      });
    }

    next();
  } catch (error) {
    console.error(
      "Webhook Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Webhook verification failed"
    });
  }
};

module.exports = verifyWebhook;
