/**
 * ============================================================================
 * Layboka AI
 * Billing Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/billing/page.tsx
 *
 * Route:
 * /billing
 *
 * Purpose:
 * - Display current subscription
 * - Show billing status
 * - Provide upgrade/manage billing actions
 *
 * Plans:
 * - Starter: $25/month
 * - Growth: $59/month
 * - Premium: $149/month
 * - Enterprise: Contact Sales
 *
 * ============================================================================
 */

'use client';

import Link from 'next/link';

import DashboardLayout from '@/components/layout/DashboardLayout';

import SubscriptionCard, {
  type SubscriptionData,
} from '@/components/billing/SubscriptionCard';


// ============================================================================
// SUBSCRIPTION DATA
// ============================================================================

const subscription: SubscriptionData = {

  plan: 'Premium',

  price: '$149 / month',

  status: 'active',

  renewalDate: 'September 12, 2026',

  features: [
    'AI Store Creation',
    'AI Theme Generation',
    'AI Product Generation',
    'AI SEO Optimization',
    'Advanced Analytics',
    'Priority AI Support',
  ],

};


// ============================================================================
// PAGE
// ============================================================================

export default function BillingPage() {


  function handleUpgrade() {

    console.log(
      'Open upgrade plans'
    );

  }



  function handleManage() {

    console.log(
      'Open billing management'
    );

  }



  return (

    <DashboardLayout>


      <div className="mx-auto w-full max-w-6xl space-y-8">


        {/* ==================================================================
            HEADER
        ================================================================== */}

        <div>

          <p className="mb-2 text-sm font-medium text-[#FF3B2F]">

            Subscription

          </p>


          <h1 className="text-3xl font-bold tracking-tight text-white">

            Billing

          </h1>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">

            Manage your Layboka AI subscription, billing and plan.

          </p>

        </div>



        {/* ==================================================================
            CURRENT SUBSCRIPTION
        ================================================================== */}

        <SubscriptionCard

          subscription={subscription}

          onUpgrade={handleUpgrade}

          onManage={handleManage}

        />



        {/* ==================================================================
            PLANS
        ================================================================== */}

        <section>

          <div className="mb-5">

            <h2 className="text-xl font-semibold text-white">

              Available Plans

            </h2>


            <p className="mt-1 text-sm text-white/40">

              Choose the plan that fits your store.

            </p>

          </div>



          <div className="grid gap-4 md:grid-cols-3">


            {/* Starter */}

            <PlanCard

              name="Starter"

              price="$25"

              description="For stores getting started with AI."

              features={[
                'AI Product Generation',
                'AI Theme Generation',
                'Basic Analytics',
              ]}

            />



            {/* Growth */}

            <PlanCard

              name="Growth"

              price="$59"

              description="For growing ecommerce businesses."

              features={[
                'Everything in Starter',
                'Advanced AI Tools',
                'Advanced Analytics',
                'AI SEO Optimization',
              ]}

            />



            {/* Premium */}

            <PlanCard

              name="Premium"

              price="$149"

              description="For high-growth stores."

              features={[
                'Everything in Growth',
                'AI Store Creation',
                'Priority Support',
                'Advanced AI Sales Tools',
              ]}

              highlighted

            />


          </div>



          {/* Enterprise */}

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B1710] p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="font-semibold text-white">

                  Enterprise

                </h3>


                <p className="mt-1 text-sm text-white/40">

                  Custom solutions for larger businesses and teams.

                </p>

              </div>


              <Link

                href="/enterprise"

                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"

              >

                Contact Sales

              </Link>

            </div>

          </div>


        </section>


      </div>


    </DashboardLayout>

  );

}


// ============================================================================
// PLAN CARD
// ============================================================================

function PlanCard({

  name,

  price,

  description,

  features,

  highlighted = false,

}: {

  name: string;

  price: string;

  description: string;

  features: string[];

  highlighted?: boolean;

}) {


  return (

    <div

      className={[

        'relative',

        'rounded-2xl',

        'border',

        highlighted

          ? 'border-[#FF3B2F]/40'

          : 'border-white/10',

        'bg-[#0B1710]',

        'p-6',

      ].join(' ')}

    >


      {highlighted && (

        <div className="absolute right-5 top-5 rounded-full bg-[#FF3B2F]/10 px-3 py-1 text-xs font-medium text-[#FF3B2F]">

          Recommended

        </div>

      )}



      <h3 className="font-semibold text-white">

        {name}

      </h3>


      <div className="mt-4">

        <span className="text-3xl font-bold text-white">

          {price}

        </span>


        <span className="ml-1 text-sm text-white/40">

          / month

        </span>

      </div>


      <p className="mt-3 min-h-12 text-sm leading-6 text-white/40">

        {description}

      </p>


      <div className="mt-6 space-y-3">

        {features.map((feature) => (

          <div

            key={feature}

            className="flex items-center gap-2 text-sm text-white/60"

          >

            <span className="text-[#FF3B2F]">

              ✓

            </span>


            {feature}

          </div>

        ))}

      </div>


      <button

        type="button"

        className={[

          'mt-7',

          'w-full',

          'rounded-xl',

          'px-4',

          'py-3',

          'text-sm',

          'font-semibold',

          'transition',

          highlighted

            ? 'bg-[#FF3B2F] text-white hover:bg-[#FF5147]'

            : 'border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]',

        ].join(' ')}

      >

        {highlighted ? 'Upgrade to Premium' : `Choose ${name}`}

      </button>


    </div>

  );

}
