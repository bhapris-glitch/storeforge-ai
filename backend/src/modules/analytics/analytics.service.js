// ============================================================================
// StoreForge AI
// Analytics Service
// ============================================================================

'use strict';

const Analytics = require('./analytics.model');


// ============================================================================
// RECORD EVENT
// ============================================================================

async function recordEvent(data = {}) {
  const {
    userId,
    storeId = null,
    eventType,
    category = 'system',
    action = null,
    entityType = null,
    entityId = null,
    usage = {},
    revenue = {},
    conversion = false,
    source = null,
    device = null,
    ipAddress = null,
    userAgent = null,
    metadata = {},
  } = data;

  if (!userId) {
    throw new Error(
      'userId is required to record an analytics event.'
    );
  }

  if (!eventType) {
    throw new Error(
      'eventType is required to record an analytics event.'
    );
  }

  return Analytics.create({
    userId,
    storeId,
    eventType,
    category,
    action,
    entityType,
    entityId,

    usage: {
      aiTokens:
        Number(usage.aiTokens || 0),

      aiRequests:
        Number(usage.aiRequests || 0),

      processingTime:
        Number(usage.processingTime || 0),
    },

    revenue: {
      amount:
        Number(revenue.amount || 0),

      currency:
        revenue.currency || 'usd',
    },

    conversion: Boolean(conversion),

    source,
    device,
    ipAddress,
    userAgent,
    metadata,
  });
}


// ============================================================================
// RECORD AI USAGE
// ============================================================================

async function recordAIUsage({
  userId,
  storeId = null,
  eventType = 'ai.request',
  tokens = 0,
  processingTime = 0,
  metadata = {},
} = {}) {
  return recordEvent({
    userId,
    storeId,
    eventType,
    category: 'ai',

    usage: {
      aiTokens: Number(tokens || 0),
      aiRequests: 1,
      processingTime:
        Number(processingTime || 0),
    },

    metadata,
  });
}


// ============================================================================
// RECORD STORE EVENT
// ============================================================================

async function recordStoreEvent({
  userId,
  storeId,
  eventType,
  action = null,
  metadata = {},
} = {}) {
  return recordEvent({
    userId,
    storeId,
    eventType,
    category: 'store',
    action,
    metadata,
  });
}


// ============================================================================
// RECORD PRODUCT EVENT
// ============================================================================

async function recordProductEvent({
  userId,
  storeId = null,
  eventType,
  action = null,
  entityId = null,
  metadata = {},
} = {}) {
  return recordEvent({
    userId,
    storeId,
    eventType,
    category: 'product',
    action,
    entityType: 'product',
    entityId,
    metadata,
  });
}


// ============================================================================
// RECORD THEME EVENT
// ============================================================================

async function recordThemeEvent({
  userId,
  storeId = null,
  eventType,
  action = null,
  entityId = null,
  metadata = {},
} = {}) {
  return recordEvent({
    userId,
    storeId,
    eventType,
    category: 'theme',
    action,
    entityType: 'theme',
    entityId,
    metadata,
  });
}


// ============================================================================
// RECORD DEPLOYMENT EVENT
// ============================================================================

async function recordDeploymentEvent({
  userId,
  storeId = null,
  eventType,
  action = null,
  entityId = null,
  metadata = {},
} = {}) {
  return recordEvent({
    userId,
    storeId,
    eventType,
    category: 'deployment',
    action,
    entityType: 'deployment',
    entityId,
    metadata,
  });
}


// ============================================================================
// RECORD BILLING EVENT
// ============================================================================

async function recordBillingEvent({
  userId,
  storeId = null,
  eventType,
  amount = 0,
  currency = 'usd',
  metadata = {},
} = {}) {
  return recordEvent({
    userId,
    storeId,
    eventType,
    category: 'billing',

    revenue: {
      amount: Number(amount || 0),
      currency,
    },

    conversion:
      eventType === 'subscription.created' ||
      eventType === 'payment.succeeded',

    metadata,
  });
}


// ============================================================================
// GET EVENT COUNTS
// ============================================================================

async function getEventCounts({
  userId,
  storeId = null,
  startDate = null,
  endDate = null,
} = {}) {
  const match = {};

  if (userId) {
    match.userId = userId;
  }

  if (storeId) {
    match.storeId = storeId;
  }

  if (startDate || endDate) {
    match.createdAt = {};

    if (startDate) {
      match.createdAt.$gte =
        new Date(startDate);
    }

    if (endDate) {
      match.createdAt.$lte =
        new Date(endDate);
    }
  }

  const results =
    await Analytics.aggregate([
      {
        $match: match,
      },

      {
        $group: {
          _id: '$eventType',
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

  return results;
}


// ============================================================================
// GET DAILY ANALYTICS
// ============================================================================

async function getDailyAnalytics({
  userId,
  storeId = null,
  startDate = null,
  endDate = null,
} = {}) {
  const match = {};

  if (userId) {
    match.userId = userId;
  }

  if (storeId) {
    match.storeId = storeId;
  }

  if (startDate || endDate) {
    match.createdAt = {};

    if (startDate) {
      match.createdAt.$gte =
        new Date(startDate);
    }

    if (endDate) {
      match.createdAt.$lte =
        new Date(endDate);
    }
  }

  return Analytics.aggregate([
    {
      $match: match,
    },

    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },

          month: {
            $month: '$createdAt',
          },

          day: {
            $dayOfMonth: '$createdAt',
          },
        },

        events: {
          $sum: 1,
        },

        aiRequests: {
          $sum: '$usage.aiRequests',
        },

        aiTokens: {
          $sum: '$usage.aiTokens',
        },

        revenue: {
          $sum: '$revenue.amount',
        },

        conversions: {
          $sum: {
            $cond: [
              '$conversion',
              1,
              0,
            ],
          },
        },
      },
    },

    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
      },
    },
  ]);
}


// ============================================================================
// GET SUMMARY
// ============================================================================

async function getSummary({
  userId,
  storeId = null,
  startDate = null,
  endDate = null,
} = {}) {
  const match = {};

  if (userId) {
    match.userId = userId;
  }

  if (storeId) {
    match.storeId = storeId;
  }

  if (startDate || endDate) {
    match.createdAt = {};

    if (startDate) {
      match.createdAt.$gte =
        new Date(startDate);
    }

    if (endDate) {
      match.createdAt.$lte =
        new Date(endDate);
    }
  }

  const result =
    await Analytics.aggregate([
      {
        $match: match,
      },

      {
        $group: {
          _id: null,

          totalEvents: {
            $sum: 1,
          },

          aiRequests: {
            $sum: '$usage.aiRequests',
          },

          aiTokens: {
            $sum: '$usage.aiTokens',
          },

          totalRevenue: {
            $sum: '$revenue.amount',
          },

          conversions: {
            $sum: {
              $cond: [
                '$conversion',
                1,
                0,
              ],
            },
          },

          deployments: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$category',
                    'deployment',
                  ],
                },
                1,
                0,
              ],
            },
          },

          products: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$category',
                    'product',
                  ],
                },
                1,
                0,
              ],
            },
          },

          themes: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$category',
                    'theme',
                  ],
                },
                1,
                0,
              ],
            },
          },

          stores: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$category',
                    'store',
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalEvents: 1,
          aiRequests: 1,
          aiTokens: 1,
          totalRevenue: 1,
          conversions: 1,
          deployments: 1,
          products: 1,
          themes: 1,
          stores: 1,
        },
      },
    ]);

  return (
    result[0] || {
      totalEvents: 0,
      aiRequests: 0,
      aiTokens: 0,
      totalRevenue: 0,
      conversions: 0,
      deployments: 0,
      products: 0,
      themes: 0,
      stores: 0,
    }
  );
}


// ============================================================================
// GET CATEGORY SUMMARY
// ============================================================================

async function getCategorySummary({
  userId,
  storeId = null,
  startDate = null,
  endDate = null,
} = {}) {
  const match = {};

  if (userId) {
    match.userId = userId;
  }

  if (storeId) {
    match.storeId = storeId;
  }

  if (startDate || endDate) {
    match.createdAt = {};

    if (startDate) {
      match.createdAt.$gte =
        new Date(startDate);
    }

    if (endDate) {
      match.createdAt.$lte =
        new Date(endDate);
    }
  }

  return Analytics.aggregate([
    {
      $match: match,
    },

    {
      $group: {
        _id: '$category',

        count: {
          $sum: 1,
        },

        aiRequests: {
          $sum: '$usage.aiRequests',
        },

        aiTokens: {
          $sum: '$usage.aiTokens',
        },

        revenue: {
          $sum: '$revenue.amount',
        },

        conversions: {
          $sum: {
            $cond: [
              '$conversion',
              1,
              0,
            ],
          },
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },
  ]);
}


// ============================================================================
// GET RECENT EVENTS
// ============================================================================

async function getRecentEvents({
  userId,
  storeId = null,
  limit = 20,
} = {}) {
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  if (storeId) {
    query.storeId = storeId;
  }

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

  return Analytics.find(query)
    .sort({
      createdAt: -1,
    })
    .limit(safeLimit)
    .lean();
}


// ============================================================================
// DELETE STORE ANALYTICS
// ============================================================================

async function deleteStoreAnalytics(
  userId,
  storeId
) {
  if (!userId) {
    throw new Error(
      'userId is required.'
    );
  }

  if (!storeId) {
    throw new Error(
      'storeId is required.'
    );
  }

  return Analytics.deleteMany({
    userId,
    storeId,
  });
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  recordEvent,

  recordAIUsage,
  recordStoreEvent,
  recordProductEvent,
  recordThemeEvent,
  recordDeploymentEvent,
  recordBillingEvent,

  getEventCounts,
  getDailyAnalytics,
  getSummary,
  getCategorySummary,
  getRecentEvents,

  deleteStoreAnalytics,
};
