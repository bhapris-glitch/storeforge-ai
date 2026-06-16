// ==========================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/themes/asset.service.js
// ============================================================
const axios = require("axios");

const Store = require("../stores/store.model");
const Theme = require("./theme.model");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getStoreAndTheme = async (
  themeId,
  userId
) => {
  const theme = await Theme.findOne({
    _id: themeId,
    userId,
    status: {
      $ne: "deleted"
    }
  });

  if (!theme) {
    throw new Error("Theme not found");
  }

  const store = await Store.findById(
    theme.storeId
  );

  if (!store) {
    throw new Error("Store not found");
  }

  if (!store.accessToken) {
    throw new Error(
      "Shopify store is not connected"
    );
  }

  return {
    theme,
    store
  };
};

const getHeaders = (
  accessToken
) => ({
  "X-Shopify-Access-Token":
    accessToken,
  "Content-Type":
    "application/json"
});

const getAssetEndpoint = (
  shopDomain
) => {
  const apiVersion =
    process.env
      .SHOPIFY_API_VERSION ||
    "2025-10";

  return `https://${shopDomain}/admin/api/${apiVersion}`;
};

/*
|--------------------------------------------------------------------------
| List Theme Assets
|--------------------------------------------------------------------------
*/

const listAssets = async (
  themeId,
  userId
) => {
  const {
    theme,
    store
  } = await getStoreAndTheme(
    themeId,
    userId
  );

  if (!theme.shopifyThemeId) {
    throw new Error(
      "Theme has not been deployed to Shopify."
    );
  }

  const response =
    await axios.get(
      `${getAssetEndpoint(
        store.shopDomain
      )}/themes/${
        theme.shopifyThemeId
      }/assets.json`,
      {
        headers: getHeaders(
          store.accessToken
        )
      }
    );

  return response.data.assets;
};

/*
|--------------------------------------------------------------------------
| Upload Asset
|--------------------------------------------------------------------------
*/

const uploadAsset =
  async ({
    themeId,
    userId,
    key,
    value,
    attachment
  }) => {
    const {
      theme,
      store
    } =
      await getStoreAndTheme(
        themeId,
        userId
      );

    if (!theme.shopifyThemeId) {
      throw new Error(
        "Theme has not been deployed to Shopify."
      );
    }

    const payload = {
      asset: {
        key
      }
    };

    if (value) {
      payload.asset.value =
        value;
    }

    if (attachment) {
      payload.asset.attachment =
        attachment;
    }

    const response =
      await axios.put(
        `${getAssetEndpoint(
          store.shopDomain
        )}/themes/${
          theme.shopifyThemeId
        }/assets.json`,
        payload,
        {
          headers:
            getHeaders(
              store.accessToken
            )
        }
      );

    return response.data.asset;
  };

/*
|--------------------------------------------------------------------------
| Delete Asset
|--------------------------------------------------------------------------
*/

const deleteAsset =
  async ({
    themeId,
    userId,
    key
  }) => {
    const {
      theme,
      store
    } =
      await getStoreAndTheme(
        themeId,
        userId
      );

    if (!theme.shopifyThemeId) {
      throw new Error(
        "Theme has not been deployed to Shopify."
      );
    }

    await axios.delete(
      `${getAssetEndpoint(
        store.shopDomain
      )}/themes/${
        theme.shopifyThemeId
      }/assets.json`,
      {
        headers: getHeaders(
          store.accessToken
        ),
        data: {
          asset: {
            key
          }
        }
      }
    );

    return true;
  };

/*
|--------------------------------------------------------------------------
| Upload CSS
|--------------------------------------------------------------------------
*/

const uploadCSS =
  async ({
    themeId,
    userId,
    css
  }) => {

    return uploadAsset({
      themeId,
      userId,
      key:
        "assets/storeforge.css",
      value: css
    });

  };

/*
|--------------------------------------------------------------------------
| Upload JavaScript
|--------------------------------------------------------------------------
*/

const uploadJavaScript =
  async ({
    themeId,
    userId,
    javascript
  }) => {

    return uploadAsset({
      themeId,
      userId,
      key:
        "assets/storeforge.js",
      value: javascript
    });

  };

/*
|--------------------------------------------------------------------------
| Upload JSON Template
|--------------------------------------------------------------------------
*/

const uploadJSON =
  async ({
    themeId,
    userId,
    filename,
    json
  }) => {

    return uploadAsset({
      themeId,
      userId,
      key:
        `templates/${filename}`,
      value:
        JSON.stringify(
          json,
          null,
          2
        )
    });

  };

/*
|--------------------------------------------------------------------------
| Upload Liquid File
|--------------------------------------------------------------------------
*/

const uploadLiquid =
  async ({
    themeId,
    userId,
    filename,
    liquid
  }) => {

    return uploadAsset({
      themeId,
      userId,
      key:
        filename,
      value:
        liquid
    });

  };

/*
|--------------------------------------------------------------------------
| Upload Image
|--------------------------------------------------------------------------
|
| attachment should be a Base64 string.
|
*/

const uploadImage =
  async ({
    themeId,
    userId,
    filename,
    attachment
  }) => {

    return uploadAsset({
      themeId,
      userId,
      key:
        `assets/${filename}`,
      attachment
    });

  };

/*
|--------------------------------------------------------------------------
| Optimize Assets
|--------------------------------------------------------------------------
|
| Placeholder for future AI optimization.
|
*/

const optimizeAssets =
  async (
    themeId,
    userId
  ) => {

    await getStoreAndTheme(
      themeId,
      userId
    );

    return {
      success: true,
      message:
        "Asset optimization queued."
    };

  };

module.exports = {
  listAssets,
  uploadAsset,
  deleteAsset,
  uploadCSS,
  uploadJavaScript,
  uploadJSON,
  uploadLiquid,
  uploadImage,
  optimizeAssets
};
