// ==================================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/shopify/shopify.service.js
// ==================================================================
const Store = require(
  "../stores/store.model"
);

const {
  buildInstallUrl
} = require(
  "../../config/shopify"
);

/*
|--------------------------------------------------------------------------
| Generate Shopify Install URL
|--------------------------------------------------------------------------
*/

const getInstallUrl = async (
  shop
) => {
  if (!shop) {
    throw new Error(
      "Shop domain is required"
    );
  }

  return buildInstallUrl(shop);
};

/*
|--------------------------------------------------------------------------
| Exchange OAuth Code
|--------------------------------------------------------------------------
|
| Placeholder
| Real implementation will be added
| after Shopify Partner App setup.
|
*/

const exchangeCodeForToken =
  async ({
    shop,
    code
  }) => {
    if (!shop || !code) {
      throw new Error(
        "Shop and code are required"
      );
    }

    return {
      accessToken:
        "SHOPIFY_ACCESS_TOKEN_PLACEHOLDER"
    };
  };

/*
|--------------------------------------------------------------------------
| Save Shopify Store
|--------------------------------------------------------------------------
*/

const connectStore = async ({
  userId,
  shopDomain,
  accessToken
}) => {
  let store =
    await Store.findOne({
      shopDomain
    });

  if (store) {
    store.accessToken =
      accessToken;

    store.status =
      "active";

    store.installedAt =
      new Date();

    await store.save();

    return store;
  }

  store =
    await Store.create({
      userId,
      storeName: shopDomain,
      shopDomain,
      accessToken,
      status: "active",
      installedAt:
        new Date()
    });

  return store;
};

/*
|--------------------------------------------------------------------------
| Get Connected Store
|--------------------------------------------------------------------------
*/

const getConnectedStore =
  async (
    userId,
    storeId
  ) => {
    const store =
      await Store.findOne({
        _id: storeId,
        userId
      });

    if (!store) {
      throw new Error(
        "Store not found"
      );
    }

    return store;
  };

module.exports = {
  getInstallUrl,
  exchangeCodeForToken,
  connectStore,
  getConnectedStore
};
