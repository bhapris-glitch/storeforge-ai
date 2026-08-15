// ============================================================================
// StoreForge AI
// Billing Service
// ============================================================================

'use strict';

const Billing = require('./billing.model');
const { getStripeClient, getStripeCurrency } = require('../../config/stripe');


// ============================================================================
// PLAN CONFIGURATION
// ============================================================================

const PLANS = {
  starter: {
    name: 'Starter',
    price: 25,
    currency: 'usd',
    interval: 'month',

    limits: {
      stores: 1,
      productsPerMonth: 25,
      storeGenerations: 1,
      themeGenerations: 3,
      contentGenerations: 100,
      deployments: 3,
    },

    features: [
      'AI Store Creation',
      'AI Theme Generation',
      'AI Product Generation',
      'AI SEO Generation',
      'AI Content Generation',
      'Shopify Integration',
      'Shopify Theme Deployment',
      'Store Builder',
      'Branding',
      'Basic Analytics',
      'Basic AI Recommendations',
    ],
  },

  growth: {
    name: 'Growth',
    price: 59,
    currency: 'usd',
    interval: 'month',

    limits: {
      stores: 3,
      productsPerMonth: 100,
      storeGenerations: 3,
      themeGenerations: 10,
      contentGenerations: 500,
      deployments: 15,
    },

    features: [
      'Everything in Starter',
      'Advanced Analytics',
      'Advanced AI Recommendations',
      'Advanced SEO',
      'Conversion Optimization',
      'Upsell & Cross-sell',
      'Abandoned Cart AI',
      'Email Automation',
      'Priority Processing',
      'Priority Support',
    ],
  },

  premium: {
    name: 'Premium',
    price: 149,
    currency: 'usd',
    interval: 'month',

    limits: {
      stores: 10,
      productsPerMonth: 500,
      storeGenerations: 10,
      themeGenerations: 50,
      contentGenerations: 2500,
      deployments: 100,
    },

    features: [
      'Everything in Growth',
      'Full AI Store Creation',
      'Advanced AI Optimization',
      'Advanced Marketing Automation',
      'Advanced Conversion Optimization',
      'Advanced Analytics',
      'Advanced AI Recommendations',
      'Advanced Email Automation',
      'Highest AI Usage',
      'Dedicated Support',
    ],
  },

  enterprise: {
    name: 'Enterprise',
    price: null,
    currency: 'usd',
    interval: 'month',

    limits: {
      stores: null,
      productsPerMonth: null,
      storeGenerations: null,
      themeGenerations: null,
      contentGenerations: null,
      deployments: null,
    },

    features: [
      'Everything in Premium',
      'Custom Limits',
      'Custom AI Configuration',
      'Dedicated Support',
      'Custom Integrations',
      'Contact Sales',
    ],
  },
};


// ============================================================================
// HELPERS
// ============================================================================

function getPlan(plan) {
  const normalizedPlan = String(plan || '')
    .trim()
    .toLowerCase();

  return PLANS[normalizedPlan] || null;
}


function requirePlan(plan) {
  const planConfig = getPlan(plan);

  if (!planConfig) {
    throw new Error(`Invalid billing plan: ${plan}`);
  }

  return planConfig;
}


function getStripePriceId(plan) {
  const envKey = `STRIPE_PRICE_${String(plan).toUpperCase()}`;

  return process.env[envKey] || null;
}


function getPlanPrice(plan) {
  return requirePlan(plan).price;
}


function normalizeAmount(amount) {
  return Math.round(Number(amount) * 100);
}


// ============================================================================
// PLAN LIST
// ============================================================================

function getPlans() {
  return Object.entries(PLANS).map(
    ([id, plan]) => ({
      id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      limits: plan.limits,
      features: plan.features,
      contactSales: id === 'enterprise',
    })
  );
}


// ============================================================================
// STRIPE CUSTOMER
// ============================================================================

async function getOrCreateStripeCustomer({
  user,
  billing = null,
}) {
  const stripe = getStripeClient();

  if (billing?.stripeCustomerId) {
    return stripe.customers.retrieve(
      billing.stripeCustomerId
    );
  }

  const email = user?.email;

  if (!email) {
    throw new Error(
      'A user email is required to create a Stripe customer.'
    );
  }

  const customer = await stripe.customers.create({
    email,
    name: user.name || undefined,

    metadata: {
      userId: String(user._id),
    },
  });

  return customer;
}


// ============================================================================
// CHECKOUT SESSION
// ============================================================================

async function createCheckoutSession({
  user,
  plan,
  successUrl,
  cancelUrl,
  storeId = null,
}) {
  const planConfig = requirePlan(plan);

  if (plan === 'enterprise') {
    throw new Error(
      'Enterprise billing requires contacting sales.'
    );
  }

  const stripe = getStripeClient();

  let billing = await Billing.findOne({
    userId: user._id,
  });

  const customer =
    await getOrCreateStripeCustomer({
      user,
      billing,
    });

  const priceId =
    getStripePriceId(plan);

  const sessionConfig = {
    mode: 'subscription',

    customer: customer.id,

    line_items: priceId
      ? [
          {
            price: priceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: getStripeCurrency(),

              product_data: {
                name:
                  `StoreForge AI ${planConfig.name}`,
              },

              unit_amount:
                normalizeAmount(
                  planConfig.price
                ),

              recurring: {
                interval:
                  planConfig.interval,
              },
            },

            quantity: 1,
          },
        ],

    success_url:
      successUrl ||
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?success=true`,

    cancel_url:
      cancelUrl ||
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?canceled=true`,

    metadata: {
      userId: String(user._id),
      plan,
      storeId: storeId
        ? String(storeId)
        : '',
    },

    subscription_data: {
      metadata: {
        userId: String(user._id),
        plan,
        storeId: storeId
          ? String(storeId)
          : '',
      },
    },
  };

  const session =
    await stripe.checkout.sessions.create(
      sessionConfig
    );

  if (!billing) {
    billing = new Billing({
      userId: user._id,
      storeId,
      stripeCustomerId: customer.id,
      stripeCheckoutSessionId: session.id,
      plan,
      interval: planConfig.interval,
      amount: normalizeAmount(
        planConfig.price
      ),
      currency: planConfig.currency,
      status: 'incomplete',
    });
  } else {
    billing.storeId = storeId || billing.storeId;
    billing.stripeCustomerId = customer.id;
    billing.stripeCheckoutSessionId = session.id;
    billing.plan = plan;
    billing.interval = planConfig.interval;
    billing.amount = normalizeAmount(
      planConfig.price
    );
    billing.currency = planConfig.currency;
    billing.status = 'incomplete';
  }

  await billing.save();

  return {
    sessionId: session.id,
    url: session.url,
    plan,
  };
}


// ============================================================================
// GET CURRENT SUBSCRIPTION
// ============================================================================

async function getSubscription(userId) {
  const billing = await Billing.findOne({
    userId,
  }).sort({
    createdAt: -1,
  });

  if (!billing) {
    return {
      subscription: null,
      plan: null,
      active: false,
    };
  }

  const plan =
    getPlan(billing.plan);

  return {
    subscription: billing,
    plan,
    active: billing.isActive(),
  };
}


// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================

async function cancelSubscription(userId) {
  const billing =
    await Billing.findOne({
      userId,
    });

  if (!billing) {
    throw new Error(
      'No billing subscription found.'
    );
  }

  if (!billing.stripeSubscriptionId) {
    throw new Error(
      'No Stripe subscription is associated with this billing record.'
    );
  }

  const stripe = getStripeClient();

  const subscription =
    await stripe.subscriptions.update(
      billing.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

  billing.cancelAtPeriodEnd =
    subscription.cancel_at_period_end;

  billing.currentPeriodEnd =
    subscription.current_period_end
      ? new Date(
          subscription.current_period_end * 1000
        )
      : billing.currentPeriodEnd;

  await billing.save();

  return billing;
}


// ============================================================================
// RESUME SUBSCRIPTION
// ============================================================================

async function resumeSubscription(userId) {
  const billing =
    await Billing.findOne({
      userId,
    });

  if (!billing) {
    throw new Error(
      'No billing subscription found.'
    );
  }

  if (!billing.stripeSubscriptionId) {
    throw new Error(
      'No Stripe subscription is associated with this billing record.'
    );
  }

  const stripe = getStripeClient();

  const subscription =
    await stripe.subscriptions.update(
      billing.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

  billing.cancelAtPeriodEnd = false;

  billing.currentPeriodEnd =
    subscription.current_period_end
      ? new Date(
          subscription.current_period_end * 1000
        )
      : billing.currentPeriodEnd;

  await billing.save();

  return billing;
}


// ============================================================================
// CHANGE PLAN
// ============================================================================

async function changePlan(
  userId,
  newPlan
) {
  const planConfig =
    requirePlan(newPlan);

  if (newPlan === 'enterprise') {
    throw new Error(
      'Enterprise billing requires contacting sales.'
    );
  }

  const billing =
    await Billing.findOne({
      userId,
    });

  if (!billing) {
    throw new Error(
      'No active billing subscription found.'
    );
  }

  if (!billing.stripeSubscriptionId) {
    throw new Error(
      'No Stripe subscription is associated with this billing record.'
    );
  }

  const stripe = getStripeClient();

  const subscription =
    await stripe.subscriptions.retrieve(
      billing.stripeSubscriptionId
    );

  const priceId =
    getStripePriceId(newPlan);

  if (!priceId) {
    throw new Error(
      `STRIPE_PRICE_${newPlan.toUpperCase()} is not configured.`
    );
  }

  const item =
    subscription.items.data[0];

  if (!item) {
    throw new Error(
      'Stripe subscription has no subscription item.'
    );
  }

  const updated =
    await stripe.subscriptions.update(
      billing.stripeSubscriptionId,
      {
        items: [
          {
            id: item.id,
            price: priceId,
          },
        ],

        proration_behavior:
          'create_prorations',

        metadata: {
          userId: String(userId),
          plan: newPlan,
        },
      }
    );

  billing.stripePriceId = priceId;
  billing.plan = newPlan;
  billing.amount =
    normalizeAmount(
      planConfig.price
    );

  billing.interval =
    planConfig.interval;

  billing.status =
    updated.status;

  billing.cancelAtPeriodEnd =
    updated.cancel_at_period_end;

  await billing.save();

  return billing;
}


// ============================================================================
// CHECK PLAN LIMIT
// ============================================================================

function getPlanLimits(plan) {
  return requirePlan(plan).limits;
}


function hasFeature(
  plan,
  feature
) {
  const planConfig =
    requirePlan(plan);

  return planConfig.features.some(
    item =>
      item.toLowerCase() ===
      String(feature)
        .toLowerCase()
  );
}


// ============================================================================
// UPDATE FROM STRIPE SUBSCRIPTION
// ============================================================================

async function syncSubscription(
  stripeSubscription,
  extra = {}
) {
  if (!stripeSubscription) {
    throw new Error(
      'Stripe subscription is required.'
    );
  }

  const metadata =
    stripeSubscription.metadata || {};

  const userId =
    metadata.userId ||
    extra.userId;

  if (!userId) {
    throw new Error(
      'Stripe subscription is missing userId metadata.'
    );
  }

  const plan =
    metadata.plan ||
    extra.plan ||
    'starter';

  const planConfig =
    requirePlan(plan);

  const item =
    stripeSubscription.items?.data?.[0];

  const priceId =
    item?.price?.id ||
    null;

  const amount =
    item?.price?.unit_amount ??
    normalizeAmount(
      planConfig.price
    );

  const currency =
    item?.price?.currency ||
    planConfig.currency;

  const interval =
    item?.price?.recurring?.interval ||
    planConfig.interval;

  const update = {
    userId,

    storeId:
      metadata.storeId ||
      extra.storeId ||
      null,

    stripeCustomerId:
      stripeSubscription.customer,

    stripeSubscriptionId:
      stripeSubscription.id,

    stripePriceId:
      priceId,

    plan,

    interval,

    amount,

    currency,

    status:
      stripeSubscription.status,

    cancelAtPeriodEnd:
      Boolean(
        stripeSubscription.cancel_at_period_end
      ),

    currentPeriodStart:
      stripeSubscription.current_period_start
        ? new Date(
            stripeSubscription.current_period_start *
              1000
          )
        : null,

    currentPeriodEnd:
      stripeSubscription.current_period_end
        ? new Date(
            stripeSubscription.current_period_end *
              1000
          )
        : null,

    trialStart:
      stripeSubscription.trial_start
        ? new Date(
            stripeSubscription.trial_start *
              1000
          )
        : null,

    trialEnd:
      stripeSubscription.trial_end
        ? new Date(
            stripeSubscription.trial_end *
              1000
          )
        : null,

    canceledAt:
      stripeSubscription.canceled_at
        ? new Date(
            stripeSubscription.canceled_at *
              1000
          )
        : null,
  };

  return Billing.findOneAndUpdate(
    {
      userId,
    },
    {
      $set: update,
    },
    {
      new: true,
      upsert: true,
    }
  );
}


// ============================================================================
// WEBHOOK EVENT PROCESSING
// ============================================================================

async function processStripeEvent(
  event
) {
  if (!event || !event.type) {
    throw new Error(
      'Invalid Stripe event.'
    );
  }

  const existing =
    await Billing.findOne({
      lastStripeEventId: event.id,
    });

  if (existing) {
    return {
      duplicate: true,
      billing: existing,
    };
  }

  let billing = null;

  switch (event.type) {

    case 'checkout.session.completed': {
      const session =
        event.data.object;

      const userId =
        session.metadata?.userId;

      if (!userId) {
        throw new Error(
          'Checkout session is missing userId metadata.'
        );
      }

      billing =
        await Billing.findOneAndUpdate(
          {
            userId,
          },
          {
            $set: {
              stripeCustomerId:
                session.customer,

              stripeSubscriptionId:
                session.subscription,

              stripeCheckoutSessionId:
                session.id,

              lastStripeEventId:
                event.id,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

      break;
    }


    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {

      const subscription =
        event.data.object;

      billing =
        await syncSubscription(
          subscription
        );

      billing.lastStripeEventId =
        event.id;

      await billing.save();

      break;
    }


    case 'invoice.paid': {

      const invoice =
        event.data.object;

      billing =
        await Billing.findOneAndUpdate(
          {
            stripeCustomerId:
              invoice.customer,
          },
          {
            $set: {
              lastStripeEventId:
                event.id,
            },
          },
          {
            new: true,
          }
        );

      break;
    }


    case 'invoice.payment_failed': {

      const invoice =
        event.data.object;

      billing =
        await Billing.findOneAndUpdate(
          {
            stripeCustomerId:
              invoice.customer,
          },
          {
            $set: {
              status: 'past_due',
              lastStripeEventId:
                event.id,
            },
          },
          {
            new: true,
          }
        );

      break;
    }


    default:
      return {
        handled: false,
        eventType: event.type,
      };
  }

  return {
    handled: true,
    eventType: event.type,
    billing,
  };
}


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  PLANS,

  getPlans,
  getPlan,
  getPlanPrice,
  getPlanLimits,
  hasFeature,

  getOrCreateStripeCustomer,

  createCheckoutSession,

  getSubscription,

  cancelSubscription,
  resumeSubscription,
  changePlan,

  syncSubscription,

  processStripeEvent,
};
