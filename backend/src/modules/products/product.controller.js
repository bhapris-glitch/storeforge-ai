/**
 * ============================================================================
 * StoreForge AI
 * Product Controller
 * ============================================================================
 *
 * File:
 * backend/src/modules/products/product.controller.js
 *
 * Purpose:
 * - Handle HTTP requests for AI-generated products
 * - Validate request parameters
 * - Call product.service.js
 * - Return consistent JSON responses
 *
 * ============================================================================
 */

'use strict';

const productService =
  require('./product.service');


// ============================================================================
// HELPERS
// ============================================================================

const getUserId = (req) => {

  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId
  );

};


const getStoreId = (req) => {

  return (
    req.params.storeId ||
    req.body?.storeId
  );

};


const sendSuccess = (
  res,
  data,
  statusCode = 200
) => {

  return res.status(statusCode).json({

    success: true,

    data

  });

};


const sendError = (
  res,
  error
) => {

  const statusCode =
    error.statusCode ||
    error.status ||
    500;


  return res.status(statusCode).json({

    success: false,

    message:
      error.message ||
      'Something went wrong.'

  });

};


// ============================================================================
// CREATE PRODUCT DRAFT
// ============================================================================
//
// POST /api/products/:storeId
//
// Body:
// {
//   "title": "Premium Cotton T-Shirt",
//   "productType": "T-Shirt",
//   "vendor": "StoreForge",
//   "description": "...",
//   "tags": ["cotton", "fashion"],
//   "pricing": {
//      "price": 29.99,
//      "currency": "USD"
//   }
// }
//

const createProductDraft = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    if (!storeId) {

      return res.status(400).json({

        success: false,

        message:
          'Store ID is required.'

      });

    }


    const product =
      await productService.createProductDraft(

        userId,

        storeId,

        req.body || {}

      );


    return sendSuccess(

      res,

      {
        product
      },

      201

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// GET PRODUCT
// ============================================================================
//
// GET /api/products/:storeId/:productId
//

const getProduct = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const product =
      await productService.getProduct(

        userId,

        storeId,

        productId

      );


    return sendSuccess(

      res,

      {
        product
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// LIST PRODUCTS
// ============================================================================
//
// GET /api/products/:storeId
//
// Query:
// ?page=1
// ?limit=20
// ?status=generated
// ?search=shirt
//

const listProducts = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const result =
      await productService.listProducts(

        userId,

        storeId,

        {

          page:
            req.query.page,

          limit:
            req.query.limit,

          status:
            req.query.status,

          search:
            req.query.search

        }

      );


    return sendSuccess(

      res,

      result

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// UPDATE PRODUCT
// ============================================================================
//
// PATCH /api/products/:storeId/:productId
//

const updateProduct = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const product =
      await productService.updateProduct(

        userId,

        storeId,

        productId,

        req.body || {}

      );


    return sendSuccess(

      res,

      {
        product
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// GENERATE PRODUCT WITH AI
// ============================================================================
//
// POST /api/products/:storeId/generate
//
// Body:
//
// {
//   "productIdea": "Premium organic cotton t-shirt",
//   "targetMarket": "US",
//   "niche": "Sustainable fashion",
//   "tone": "Premium",
//   "language": "en"
// }
//

const generateProductWithAI = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    if (
      !req.body ||
      !req.body.productIdea
    ) {

      return res.status(400).json({

        success: false,

        message:
          'productIdea is required.'

      });

    }


    const product =
      await productService.generateProductWithAI(

        userId,

        storeId,

        req.body

      );


    return sendSuccess(

      res,

      {
        product
      },

      201

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// UPDATE PRODUCT STATUS
// ============================================================================
//
// PATCH /api/products/:storeId/:productId/status
//
// Body:
//
// {
//   "status": "ready"
// }
//

const updateStatus = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const {
      status
    } =
      req.body || {};


    if (!status) {

      return res.status(400).json({

        success: false,

        message:
          'Product status is required.'

      });

    }


    const product =
      await productService.updateStatus(

        userId,

        storeId,

        productId,

        status

      );


    return sendSuccess(

      res,

      {
        product
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// SET SHOPIFY PRODUCT ID
// ============================================================================
//
// PATCH /api/products/:storeId/:productId/shopify
//
// Body:
//
// {
//   "shopifyProductId": "123456789"
// }
//

const setShopifyProductId = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const {
      shopifyProductId
    } =
      req.body || {};


    if (!shopifyProductId) {

      return res.status(400).json({

        success: false,

        message:
          'Shopify product ID is required.'

      });

    }


    const product =
      await productService.setShopifyProductId(

        userId,

        storeId,

        productId,

        shopifyProductId

      );


    return sendSuccess(

      res,

      {
        product
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// UPDATE SHOPIFY SYNC STATUS
// ============================================================================
//
// PATCH /api/products/:storeId/:productId/shopify-sync
//

const updateShopifySyncStatus = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const product =
      await productService.updateShopifySyncStatus(

        userId,

        storeId,

        productId,

        req.body || {}

      );


    return sendSuccess(

      res,

      {
        product
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// BUILD SHOPIFY PAYLOAD
// ============================================================================
//
// GET /api/products/:storeId/:productId/shopify-payload
//
// This does NOT publish the product.
//
// It only converts the StoreForge product into a Shopify-ready payload.
//

const buildShopifyPayload = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const payload =
      await productService.buildShopifyPayload(

        userId,

        storeId,

        productId

      );


    return sendSuccess(

      res,

      {
        payload
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// GET PRODUCT STATISTICS
// ============================================================================
//
// GET /api/products/:storeId/stats
//

const getProductStats = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const stats =
      await productService.getProductStats(

        userId,

        storeId

      );


    return sendSuccess(

      res,

      {
        stats
      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// DELETE PRODUCT
// ============================================================================
//
// DELETE /api/products/:storeId/:productId
//

const deleteProduct = async (
  req,
  res
) => {

  try {

    const userId =
      getUserId(req);

    const {
      storeId,
      productId
    } = req.params;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message:
          'Authentication required.'

      });

    }


    const product =
      await productService.deleteProduct(

        userId,

        storeId,

        productId

      );


    return sendSuccess(

      res,

      {

        message:
          'Product deleted successfully.',

        product

      }

    );

  } catch (error) {

    return sendError(
      res,
      error
    );

  }

};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  createProductDraft,

  getProduct,

  listProducts,

  updateProduct,

  generateProductWithAI,

  updateStatus,

  setShopifyProductId,

  updateShopifySyncStatus,

  buildShopifyPayload,

  getProductStats,

  deleteProduct

};
