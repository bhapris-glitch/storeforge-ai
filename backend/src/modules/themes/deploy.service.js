// storeforge-ai/backend/src/modules/themes/deploy.service.js
const axios = require("axios");

const Theme = require("./theme.model");
const Store = require("../stores/store.model");

const {
  generateThemeFiles
} = require("./liquid.service");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getApiVersion = () => {
  return (
    process.env.SHOPIFY_API_VERSION ||
    "2025-10"
  );
};

const getHeaders = (
  accessToken
) => ({
  "X-Shopify-Access-Token":
    accessToken,
  "Content-Type":
    "application/json"
});

const getThemeAndStore =
  async (
    themeId,
    userId
  ) => {
    const theme =
      await Theme.findOne({
        _id: themeId,
        userId,
        status: {
          $ne: "deleted"
        }
      });

    if (!theme) {
      throw new Error(
        "Theme not found"
      );
    }

    const store =
      await Store.findById(
        theme.storeId
      );

    if (!store) {
      throw new Error(
        "Store not found"
      );
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

/*
|--------------------------------------------------------------------------
| Create Shopify Theme
|--------------------------------------------------------------------------
*/

const createShopifyTheme =
  async (
    themeId,
    userId
  ) => {

    const {
      theme,
      store
    } =
      await getThemeAndStore(
        themeId,
        userId
      );

    const response =
      await axios.post(
        `https://${store.shopDomain}/admin/api/${getApiVersion()}/themes.json`,
        {
          theme: {
            name:
              theme.name,
            role:
              "unpublished"
          }
        },
        {
          headers:
            getHeaders(
              store.accessToken
            )
        }
      );

    theme.shopifyThemeId =
      response.data.theme.id;

    theme.role =
      response.data.theme.role;

    theme.deploymentStatus =
      "building";

    await theme.save();

    return theme;
  };

/*
|--------------------------------------------------------------------------
| Upload Theme Files
|--------------------------------------------------------------------------
*/

const uploadThemeFiles =
  async (
    themeId,
    userId
  ) => {

    await generateThemeFiles(
      themeId,
      userId
    );

    return true;
  };

/*
|--------------------------------------------------------------------------
| Publish Theme
|--------------------------------------------------------------------------
*/

const publishTheme =
  async (
    themeId,
    userId
  ) => {

    const {
      theme,
      store
    } =
      await getThemeAndStore(
        themeId,
        userId
      );

    if (
      !theme.shopifyThemeId
    ) {
      throw new Error(
        "Theme has not been deployed."
      );
    }

    await axios.put(
      `https://${store.shopDomain}/admin/api/${getApiVersion()}/themes/${theme.shopifyThemeId}.json`,
      {
        theme: {
          id:
            theme.shopifyThemeId,
          role: "main"
        }
      },
      {
        headers:
          getHeaders(
            store.accessToken
          )
      }
    );

    theme.role = "main";

    theme.deploymentStatus =
      "published";

    theme.publishedAt =
      new Date();

    theme.deployments += 1;

    await theme.save();

    return theme;
  };

/*
|--------------------------------------------------------------------------
| Deploy Theme
|--------------------------------------------------------------------------
*/

const deployTheme =
  async (
    themeId,
    userId
  ) => {

    const theme =
      await createShopifyTheme(
        themeId,
        userId
      );

    await uploadThemeFiles(
      theme._id,
      userId
    );

    theme.deploymentStatus =
      "ready";

    await theme.save();

    return theme;
  };

/*
|--------------------------------------------------------------------------
| Rollback Theme
|--------------------------------------------------------------------------
*/

const rollbackTheme =
  async (
    themeId,
    userId
  ) => {

    const {
      theme
    } =
      await getThemeAndStore(
        themeId,
        userId
      );

    theme.deploymentStatus =
      "draft";

    await theme.save();

    return theme;
  };

/*
|--------------------------------------------------------------------------
| Delete Shopify Theme
|--------------------------------------------------------------------------
*/

const deleteShopifyTheme =
  async (
    themeId,
    userId
  ) => {

    const {
      theme,
      store
    } =
      await getThemeAndStore(
        themeId,
        userId
      );

    if (
      !theme.shopifyThemeId
    ) {
      return true;
    }

    await axios.delete(
      `https://${store.shopDomain}/admin/api/${getApiVersion()}/themes/${theme.shopifyThemeId}.json`,
      {
        headers:
          getHeaders(
            store.accessToken
          )
      }
    );

    theme.shopifyThemeId =
      "";

    theme.role =
      "development";

    theme.deploymentStatus =
      "draft";

    await theme.save();

    return true;
  };

module.exports = {

  deployTheme,

  createShopifyTheme,

  uploadThemeFiles,

  publishTheme,

  rollbackTheme,

  deleteShopifyTheme

};
