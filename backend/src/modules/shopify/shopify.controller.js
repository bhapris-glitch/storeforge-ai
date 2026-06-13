// ================================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/shopify/shopify.controller.js
// ================================================================
const {
  getInstallUrl,
  exchangeCodeForToken,
  connectStore,
  getConnectedStore
} = require("./shopify.service");

/*
|--------------------------------------------------------------------------
| Generate Install URL
|--------------------------------------------------------------------------
|
| GET /api/shopify/install?shop=store.myshopify.com
|
*/

const install = async (
  req,
  res,
  next
) => {
  try {
    const { shop } = req.query;

    const installUrl =
      await getInstallUrl(shop);

    return res.status(200).json({
      success: true,
      installUrl
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| OAuth Callback
|--------------------------------------------------------------------------
|
| Shopify redirects here after install.
|
*/

const callback = async (
  req,
  res,
  next
) => {
  try {
    const {
      shop,
      code,
      state
    } = req.query;

    const tokenResponse =
      await exchangeCodeForToken({
        shop,
        code
      });

    const store =
      await connectStore({
        userId: null,
        shopDomain: shop,
        accessToken:
          tokenResponse.accessToken
      });

    return res.status(200).json({
      success: true,
      message:
        "Shopify store connected",
      data: store,
      state
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Connected Store
|--------------------------------------------------------------------------
*/

const getStore = async (
  req,
  res,
  next
) => {
  try {
    const store =
      await getConnectedStore(
        req.user.id,
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  install,
  callback,
  getStore
};
