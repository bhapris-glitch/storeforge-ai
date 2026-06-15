//===========================================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/shopify/shopify.webhook.controller.js
// =====================================================≠=====================
/*
|--------------------------------------------------------------------------
| Shopify Webhook Controller
|--------------------------------------------------------------------------
|
| Handles incoming Shopify webhook events.
| The request is verified by verifyWebhook middleware before reaching here.
|
*/

const handleWebhook = async (
  req,
  res,
  next
) => {
  try {
    const topic =
      req.get("X-Shopify-Topic");

    const shop =
      req.get("X-Shopify-Shop-Domain");

    const webhookId =
      req.get("X-Shopify-Webhook-Id");

    /*
    |--------------------------------------------------------------------------
    | Raw Payload
    |--------------------------------------------------------------------------
    */

    const payload = JSON.parse(
      req.body.toString("utf8")
    );

    console.log(
      "=================================="
    );

    console.log(
      "Shopify Webhook Received"
    );

    console.log(
      "Topic:",
      topic
    );

    console.log(
      "Shop:",
      shop
    );

    console.log(
      "Webhook ID:",
      webhookId
    );

    console.log(
      "=================================="
    );

    /*
    |--------------------------------------------------------------------------
    | Event Router
    |--------------------------------------------------------------------------
    */

    switch (topic) {
      /*
      ------------------------------------------------------------
      App
      ------------------------------------------------------------
      */

      case "app/uninstalled":
        await handleAppUninstalled(
          shop,
          payload
        );
        break;

      /*
      ------------------------------------------------------------
      Products
      ------------------------------------------------------------
      */

      case "products/create":
        await handleProductCreate(
          shop,
          payload
        );
        break;

      case "products/update":
        await handleProductUpdate(
          shop,
          payload
        );
        break;

      case "products/delete":
        await handleProductDelete(
          shop,
          payload
        );
        break;

      /*
      ------------------------------------------------------------
      Orders
      ------------------------------------------------------------
      */

      case "orders/create":
        await handleOrderCreate(
          shop,
          payload
        );
        break;

      case "orders/updated":
        await handleOrderUpdated(
          shop,
          payload
        );
        break;

      /*
      ------------------------------------------------------------
      Customers
      ------------------------------------------------------------
      */

      case "customers/create":
        await handleCustomerCreate(
          shop,
          payload
        );
        break;

      case "customers/update":
        await handleCustomerUpdate(
          shop,
          payload
        );
        break;

      /*
      ------------------------------------------------------------
      Unknown Topic
      ------------------------------------------------------------
      */

      default:
        console.log(
          "Unhandled Shopify Topic:",
          topic
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Shopify requires HTTP 200 quickly
    |--------------------------------------------------------------------------
    */

    return res
      .status(200)
      .send("OK");
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Handlers
|--------------------------------------------------------------------------
*/

async function handleAppUninstalled(
  shop,
  payload
) {
  console.log(
    "[APP_UNINSTALLED]",
    shop
  );

  // TODO:
  // Mark store as uninstalled
  // Remove access token
  // Cancel scheduled jobs
}

async function handleProductCreate(
  shop,
  payload
) {
  console.log(
    "[PRODUCT_CREATED]",
    payload.id
  );

  // TODO:
  // Sync product
}

async function handleProductUpdate(
  shop,
  payload
) {
  console.log(
    "[PRODUCT_UPDATED]",
    payload.id
  );

  // TODO:
  // Update product
}

async function handleProductDelete(
  shop,
  payload
) {
  console.log(
    "[PRODUCT_DELETED]",
    payload.id
  );

  // TODO:
  // Delete synced product
}

async function handleOrderCreate(
  shop,
  payload
) {
  console.log(
    "[ORDER_CREATED]",
    payload.id
  );

  // TODO:
  // Analytics
  // AI recommendations
}

async function handleOrderUpdated(
  shop,
  payload
) {
  console.log(
    "[ORDER_UPDATED]",
    payload.id
  );
}

async function handleCustomerCreate(
  shop,
  payload
) {
  console.log(
    "[CUSTOMER_CREATED]",
    payload.id
  );
}

async function handleCustomerUpdate(
  shop,
  payload
) {
  console.log(
    "[CUSTOMER_UPDATED]",
    payload.id
  );
}

module.exports = {
  handleWebhook
};
