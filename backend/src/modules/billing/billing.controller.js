// ============================================================================
// StoreForge AI
// Billing Controller
// ============================================================================

'use strict';

const billingService = require('./billing.service');


// ============================================================================
// HELPERS
// ============================================================================

function getUserId(req) {
  return (
    req.user?._id ||
    req.user?.id ||
    req.auth?.userId ||
    null
  );
}


function getUser(req) {
  return (
    req.user ||
    req.auth?.user ||
    null
  );
}


function sendError(res, error) {
  const status =
    error.statusCode ||
    error.status ||
    400;

  return res.status(status).json({
    success: false,
    message:
      error.message ||
      'Billing request failed.',
  });
}


// ============================================================================
// GET PLANS
// GET /api/billing/plans
// ============================================================================

async function getPlans(req, res) {
  try {
    const plans =
      billingService.getPlans();

    return res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET CURRENT SUBSCRIPTION
// GET /api/billing/subscription
// ============================================================================

async function getSubscription(req, res) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const result =
      await billingService.getSubscription(
        userId
      );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// CREATE CHECKOUT SESSION
// POST /api/billing/checkout
// ============================================================================

async function createCheckoutSession(
  req,
  res
) {
  try {
    const user =
      getUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const {
      plan,
      successUrl,
      cancelUrl,
      storeId,
    } = req.body || {};

    if (!plan) {
      return res.status(400).json({
        success: false,
        message:
          'Billing plan is required.',
      });
    }

    const result =
      await billingService.createCheckoutSession({
        user,
        plan,
        successUrl,
        cancelUrl,
        storeId,
      });

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// CANCEL SUBSCRIPTION
// POST /api/billing/cancel
// ============================================================================

async function cancelSubscription(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const billing =
      await billingService.cancelSubscription(
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        'Subscription scheduled for cancellation at the end of the current billing period.',
      billing,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// RESUME SUBSCRIPTION
// POST /api/billing/resume
// ============================================================================

async function resumeSubscription(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const billing =
      await billingService.resumeSubscription(
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        'Subscription cancellation has been reversed.',
      billing,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// CHANGE PLAN
// POST /api/billing/change-plan
// ============================================================================

async function changePlan(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const {
      plan,
    } = req.body || {};

    if (!plan) {
      return res.status(400).json({
        success: false,
        message:
          'New billing plan is required.',
      });
    }

    const billing =
      await billingService.changePlan(
        userId,
        plan
      );

    return res.status(200).json({
      success: true,
      message:
        'Subscription plan updated successfully.',
      billing,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET PLAN LIMITS
// GET /api/billing/limits
// ============================================================================

async function getLimits(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const result =
      await billingService.getSubscription(
        userId
      );

    const plan =
      result.plan?.id ||
      result.subscription?.plan ||
      'starter';

    const limits =
      billingService.getPlanLimits(
        plan
      );

    return res.status(200).json({
      success: true,
      plan,
      limits,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// CHECK FEATURE
// POST /api/billing/feature
// ============================================================================

async function checkFeature(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    const {
      feature,
    } = req.body || {};

    if (!feature) {
      return res.status(400).json({
        success: false,
        message:
          'Feature is required.',
      });
    }

    const result =
      await billingService.getSubscription(
        userId
      );

    const plan =
      result.subscription?.plan ||
      'starter';

    const allowed =
      billingService.hasFeature(
        plan,
        feature
      );

    return res.status(200).json({
      success: true,
      plan,
      feature,
      allowed,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getPlans,
  getSubscription,
  createCheckoutSession,
  cancelSubscription,
  resumeSubscription,
  changePlan,
  getLimits,
  checkFeature,
};
