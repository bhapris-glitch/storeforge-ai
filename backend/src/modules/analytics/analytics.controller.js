// ============================================================================
// StoreForge AI
// Analytics Controller
// ============================================================================

'use strict';

const analyticsService =
  require('./analytics.service');


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


function getStoreId(req) {
  return (
    req.params?.storeId ||
    req.query?.storeId ||
    req.body?.storeId ||
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
      'Analytics request failed.',
  });
}


function getDateRange(req) {
  return {
    startDate:
      req.query?.startDate ||
      req.body?.startDate ||
      null,

    endDate:
      req.query?.endDate ||
      req.body?.endDate ||
      null,
  };
}


// ============================================================================
// RECORD EVENT
// POST /api/analytics/events
// ============================================================================

async function recordEvent(req, res) {
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

    const event =
      await analyticsService.recordEvent({
        ...(req.body || {}),
        userId,
        storeId:
          req.body?.storeId ||
          getStoreId(req),
      });

    return res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// RECORD AI USAGE
// POST /api/analytics/ai-usage
// ============================================================================

async function recordAIUsage(req, res) {
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
      storeId,
      eventType,
      tokens,
      processingTime,
      metadata,
    } = req.body || {};

    const event =
      await analyticsService.recordAIUsage({
        userId,
        storeId,
        eventType,
        tokens,
        processingTime,
        metadata,
      });

    return res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET SUMMARY
// GET /api/analytics/summary
// ============================================================================

async function getSummary(req, res) {
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
      startDate,
      endDate,
    } = getDateRange(req);

    const summary =
      await analyticsService.getSummary({
        userId,
        storeId:
          getStoreId(req),
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET DAILY ANALYTICS
// GET /api/analytics/daily
// ============================================================================

async function getDailyAnalytics(
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
      startDate,
      endDate,
    } = getDateRange(req);

    const analytics =
      await analyticsService.getDailyAnalytics({
        userId,
        storeId:
          getStoreId(req),
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET EVENT COUNTS
// GET /api/analytics/events/counts
// ============================================================================

async function getEventCounts(
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
      startDate,
      endDate,
    } = getDateRange(req);

    const counts =
      await analyticsService.getEventCounts({
        userId,
        storeId:
          getStoreId(req),
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET CATEGORY SUMMARY
// GET /api/analytics/categories
// ============================================================================

async function getCategorySummary(
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
      startDate,
      endDate,
    } = getDateRange(req);

    const categories =
      await analyticsService.getCategorySummary({
        userId,
        storeId:
          getStoreId(req),
        startDate,
        endDate,
      });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET RECENT EVENTS
// GET /api/analytics/recent
// ============================================================================

async function getRecentEvents(
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

    const limit =
      Number(req.query?.limit) || 20;

    const events =
      await analyticsService.getRecentEvents({
        userId,
        storeId:
          getStoreId(req),
        limit,
      });

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// GET ANALYTICS FOR A STORE
// GET /api/analytics/store/:storeId
// ============================================================================

async function getStoreAnalytics(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    const storeId =
      req.params?.storeId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message:
          'Store ID is required.',
      });
    }

    const {
      startDate,
      endDate,
    } = getDateRange(req);

    const [
      summary,
      daily,
      categories,
      recent,
    ] = await Promise.all([
      analyticsService.getSummary({
        userId,
        storeId,
        startDate,
        endDate,
      }),

      analyticsService.getDailyAnalytics({
        userId,
        storeId,
        startDate,
        endDate,
      }),

      analyticsService.getCategorySummary({
        userId,
        storeId,
        startDate,
        endDate,
      }),

      analyticsService.getRecentEvents({
        userId,
        storeId,
        limit:
          Number(req.query?.limit) || 20,
      }),
    ]);

    return res.status(200).json({
      success: true,

      storeId,

      summary,

      daily,

      categories,

      recent,
    });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
}


// ============================================================================
// DELETE STORE ANALYTICS
// DELETE /api/analytics/store/:storeId
// ============================================================================

async function deleteStoreAnalytics(
  req,
  res
) {
  try {
    const userId =
      getUserId(req);

    const storeId =
      req.params?.storeId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'Authentication required.',
      });
    }

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message:
          'Store ID is required.',
      });
    }

    const result =
      await analyticsService.deleteStoreAnalytics(
        userId,
        storeId
      );

    return res.status(200).json({
      success: true,

      message:
        'Store analytics deleted successfully.',

      deletedCount:
        result.deletedCount || 0,
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
  recordEvent,
  recordAIUsage,

  getSummary,
  getDailyAnalytics,
  getEventCounts,
  getCategorySummary,
  getRecentEvents,

  getStoreAnalytics,
  deleteStoreAnalytics,
};
