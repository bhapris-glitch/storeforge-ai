/**
 * ============================================================================
 * StoreForge AI
 * Brand Controller
 * ============================================================================
 *
 * File:
 * backend/src/modules/branding/brand.controller.js
 *
 * Purpose:
 * - Handle brand API requests
 * - Validate authenticated user/store access through brand.service.js
 * - Return consistent API responses
 *
 * Routes will be connected in:
 * backend/src/modules/branding/brand.routes.js
 *
 * ============================================================================
 */

'use strict';

const brandService = require('./brand.service');


// ============================================================================
// HELPERS
// ============================================================================

const getUserId = (req) => {

  return (
    req.user?.id ||
    req.user?._id
  );

};


const getStoreId = (req) => {

  return (
    req.params.storeId ||
    req.params.id ||
    req.body?.storeId
  );

};


// ============================================================================
// CREATE BRAND
// ============================================================================
//
// POST /api/branding/:storeId
//

const createBrand = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const brand =
      await brandService.createBrand(
        userId,
        storeId,
        req.body || {}
      );


    return res.status(201).json({

      success: true,

      message:
        'Brand profile created successfully.',

      data: brand

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// GET BRAND
// ============================================================================
//
// GET /api/branding/:storeId
//

const getBrand = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const brand =
      await brandService.getBrand(
        userId,
        storeId
      );


    return res.status(200).json({

      success: true,

      data: brand

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// GET OR CREATE BRAND
// ============================================================================
//
// GET /api/branding/:storeId/profile
//
// Useful for the frontend branding page.
//

const getOrCreateBrand = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const brand =
      await brandService.getOrCreateBrand(
        userId,
        storeId
      );


    return res.status(200).json({

      success: true,

      data: brand

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// UPDATE BRAND
// ============================================================================
//
// PATCH /api/branding/:storeId
//

const updateBrand = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const brand =
      await brandService.updateBrand(
        userId,
        storeId,
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        'Brand profile updated successfully.',

      data: brand

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// UPDATE BRAND FROM AI
// ============================================================================
//
// PATCH /api/branding/:storeId/ai
//
// Used by the AI branding/theme-generation pipeline.
//

const updateBrandFromAI = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const brand =
      await brandService.updateBrandFromAI(
        userId,
        storeId,
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        'AI brand profile updated successfully.',

      data: brand

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// UPDATE COMPLETION STATUS
// ============================================================================
//
// PATCH /api/branding/:storeId/completion
//

const updateCompletionStatus = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const isComplete =
      req.body?.isComplete;


    if (
      typeof isComplete !== 'boolean'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'isComplete must be a boolean.'

      });

    }


    const brand =
      await brandService.updateCompletionStatus(
        userId,
        storeId,
        isComplete
      );


    return res.status(200).json({

      success: true,

      message:
        'Brand completion status updated.',

      data: brand

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// DELETE BRAND
// ============================================================================
//
// DELETE /api/branding/:storeId
//

const deleteBrand = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    await brandService.deleteBrand(
      userId,
      storeId
    );


    return res.status(200).json({

      success: true,

      message:
        'Brand profile deleted successfully.'

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// GET AI BRAND CONTEXT
// ============================================================================
//
// GET /api/branding/:storeId/ai-context
//
// Returns the normalized brand context used by the AI theme-generation
// pipeline.
//

const getBrandContext = async (
  req,
  res,
  next
) => {

  try {

    const userId =
      getUserId(req);

    const storeId =
      getStoreId(req);


    const context =
      await brandService.getBrandContext(
        userId,
        storeId
      );


    return res.status(200).json({

      success: true,

      data: context

    });

  } catch (error) {

    next(error);

  }

};


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {

  createBrand,

  getBrand,

  getOrCreateBrand,

  updateBrand,

  updateBrandFromAI,

  updateCompletionStatus,

  deleteBrand,

  getBrandContext

};
