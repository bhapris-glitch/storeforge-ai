/**
 * ============================================================================
 * StoreForge AI
 * Shopify Webhook Controller
 * ============================================================================
 *
 * File:
 * backend/src/modules/shopify/shopify.webhook.controller.js
 *
 * Purpose:
 * Handles Shopify webhook requests after webhook signature verification.
 *
 * Supported lifecycle events:
 *
 *   app/uninstalled
 *   shop/update
 *   app_subscriptions/update
 *
 * Product/order/customer events are acknowledged safely for now and will be
 * connected to their respective StoreForge modules later.
 *
 * ============================================================================
 */

'use strict';


// ============================================================================
// WEBHOOK SERVICE
// ============================================================================

const {
  verifyAndProcessWebhook,
  processWebhook,
  handleAppUninstalled,
  handleShopUpdate,
  handleSubscriptionUpdate
} = require('./webhook.service');


// ============================================================================
// COMMON HELPERS
// ============================================================================

function getRawBody(req) {
  /*
   * Shopify HMAC verification must use the original request body.
   *
   * Depending on the middleware configuration, req.body can be:
   *
   *   Buffer
   *   object
   *
   * If it is a Buffer, use it directly.
   */

  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (
    typeof req.rawBody !== 'undefined' &&
    req.rawBody !== null
  ) {
    return req.rawBody;
  }

  return req.body;
}


function getHeader(req, name) {
  return (
    req.headers[name.toLowerCase()] ||
    null
  );
}


// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================
//
// POST /api/shopify/webhooks
//
// This is the primary webhook entry point.
//
// The verifyAndProcessWebhook() method:
//
//   1. Reads Shopify HMAC
//   2. Verifies the raw body
//   3. Reads Shopify topic
//   4. Reads Shopify shop domain
//   5. Routes the webhook to the correct service handler
//

const handleWebhook = async (
  req,
  res,
  next
) => {

  try {

    const rawBody =
      getRawBody(req);


    const result =
      await verifyAndProcessWebhook({

        rawBody,

        headers:
          req.headers

      });


    /*
     * Shopify expects a successful webhook response quickly.
     */

    return res.status(200).json({

      success: true,

      received: true,

      handled:
        result.handled !== false,

      topic:
        result.topic,

      shopDomain:
        result.shopDomain,

      webhookId:
        result.webhookId || null

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// APP UNINSTALLED
// ============================================================================
//
// POST /api/shopify/webhooks
// Topic: app/uninstalled
//
// This handler is also exported separately so the controller can be used
// directly by a future topic-specific route if needed.
//

const appUninstalled = async (
  req,
  res,
  next
) => {

  try {

    const shopDomain =
      getHeader(
        req,
        'x-shopify-shop-domain'
      );


    if (!shopDomain) {

      return res.status(400).json({

        success: false,

        message:
          'Shopify shop domain header is required.'

      });

    }


    const result =
      await handleAppUninstalled({

        shopDomain

      });


    return res.status(200).json({

      success: true,

      received: true,

      event:
        'app/uninstalled',

      data:
        result

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// SHOP UPDATE
// ============================================================================
//
// Topic:
// shop/update
//
// Updates the existing StoreForge store information.
//

const shopUpdate = async (
  req,
  res,
  next
) => {

  try {

    const shopDomain =
      getHeader(
        req,
        'x-shopify-shop-domain'
      );


    if (!shopDomain) {

      return res.status(400).json({

        success: false,

        message:
          'Shopify shop domain header is required.'

      });

    }


    const payload =
      Buffer.isBuffer(req.body)

        ? JSON.parse(
            req.body.toString('utf8')
          )

        : (req.body || {});


    const result =
      await handleShopUpdate({

        shopDomain,

        payload

      });


    return res.status(200).json({

      success: true,

      received: true,

      event:
        'shop/update',

      data:
        result

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// APP SUBSCRIPTION UPDATE
// ============================================================================
//
// Topic:
// app_subscriptions/update
//
// This currently synchronizes the Shopify plan information available in the
// webhook. StoreForge's own SaaS billing remains handled by modules/billing.
//

const appSubscriptionUpdate = async (
  req,
  res,
  next
) => {

  try {

    const shopDomain =
      getHeader(
        req,
        'x-shopify-shop-domain'
      );


    if (!shopDomain) {

      return res.status(400).json({

        success: false,

        message:
          'Shopify shop domain header is required.'

      });

    }


    const payload =
      Buffer.isBuffer(req.body)

        ? JSON.parse(
            req.body.toString('utf8')
          )

        : (req.body || {});


    const result =
      await handleSubscriptionUpdate({

        shopDomain,

        payload

      });


    return res.status(200).json({

      success: true,

      received: true,

      event:
        'app_subscriptions/update',

      data:
        result

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// PRODUCT WEBHOOK
// ============================================================================
//
// These handlers intentionally acknowledge the webhook for now.
//
// Product synchronization will later be connected to:
//   modules/products/
//

const productWebhook = async (
  req,
  res,
  next
) => {

  try {

    return res.status(200).json({

      success: true,

      received: true,

      handled: false,

      message:
        'Product webhook received. Product synchronization will be handled by the products module.'

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// ORDER WEBHOOK
// ============================================================================
//
// Orders will later connect to analytics and store-generation related
// reporting where required.
//

const orderWebhook = async (
  req,
  res,
  next
) => {

  try {

    return res.status(200).json({

      success: true,

      received: true,

      handled: false,

      message:
        'Order webhook received. Order processing is not enabled in this module yet.'

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// CUSTOMER WEBHOOK
// ============================================================================
//
// Customer events will later connect to the appropriate customer/analytics
// functionality.
//

const customerWebhook = async (
  req,
  res,
  next
) => {

  try {

    return res.status(200).json({

      success: true,

      received: true,

      handled: false,

      message:
        'Customer webhook received. Customer processing is not enabled in this module yet.'

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// GENERIC TOPIC HANDLER
// ============================================================================
//
// Useful if your existing webhook route sends all topics to one controller.
//
// It verifies the webhook and lets webhook.service.js determine the topic.
//

const webhook = handleWebhook;


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  webhook,

  handleWebhook,

  appUninstalled,

  shopUpdate,

  appSubscriptionUpdate,

  productWebhook,

  orderWebhook,

  customerWebhook

};
