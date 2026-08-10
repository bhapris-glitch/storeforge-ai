/**
 * ============================================================================
 * StoreForge AI
 * Shopify Controller
 * ============================================================================
 *
 * File:
 * backend/src/modules/shopify/shopify.controller.js
 *
 * Handles:
 * - Shopify install URL generation
 * - OAuth callback
 * - Connected store retrieval
 *
 * ============================================================================
 */

'use strict';


const {
  generateInstallUrl,
  completeOAuth
} = require('./oauth.service');


const {
  getConnectedStore
} = require('./shopify.service');


// ============================================================================
// CONFIG
// ============================================================================

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  'http://localhost:3000';


// ============================================================================
// GENERATE SHOPIFY INSTALL URL
// ============================================================================
//
// GET /api/shopify/install?shop=store.myshopify.com
//
// User must be authenticated because OAuth state
// needs the StoreForge user ID.
//

const install = async (
  req,
  res,
  next
) => {

  try {

    const {
      shop
    } = req.query;


    const userId =
      req.user?.id ||
      req.user?._id;


    if (!userId) {

      return res.status(401).json({
        success:false,
        message:
          'Authentication required'
      });

    }


    const result =
      generateInstallUrl({

        shop,

        userId

      });


    return res.status(200).json({

      success:true,

      data: result

    });


  } catch(error){

    next(error);

  }

};



// ============================================================================
// SHOPIFY OAUTH CALLBACK
// ============================================================================
//
// GET /api/shopify/callback
//
// Shopify redirects here after merchant approval.
//
// Query:
// shop
// code
// state
//

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



    if (
      !shop ||
      !code ||
      !state
    ) {

      return res.status(400).json({

        success:false,

        message:
          'Missing Shopify OAuth parameters'

      });

    }



    const result =

      await completeOAuth({

        shop,

        code,

        state

      });



    const store =
      result.store;



    /*
    ------------------------------------------------
    Redirect merchant to dashboard
    ------------------------------------------------
    */


    return res.redirect(

      `${FRONTEND_URL}/dashboard/stores/${store._id}`

    );



  } catch(error){


    next(error);


  }


};




// ============================================================================
// GET CONNECTED STORE
// ============================================================================
//
// GET /api/shopify/store/:id
//

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

      success:true,

      data:store

    });



  } catch(error){


    next(error);


  }


};



// ============================================================================
// EXPORT
// ============================================================================

module.exports = {


  install,


  callback,


  getStore


};
