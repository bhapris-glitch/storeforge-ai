/**
 * ============================================================================
 * Layboka AI
 * Subscription Card Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/billing/SubscriptionCard.tsx
 *
 * Purpose:
 * - Display merchant subscription plan
 * - Show billing status
 * - Upgrade / manage subscription
 *
 * Plans:
 * - Starter $25/month
 * - Growth $59/month
 * - Premium $149/month
 * - Enterprise Contact Sales
 *
 * ============================================================================
 */

'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';


// ============================================================================
// TYPES
// ============================================================================

export type SubscriptionStatus =
  | 'active'
  | 'trial'
  | 'expired'
  | 'cancelled';


export interface SubscriptionData {

  plan: string;

  price: string;

  status: SubscriptionStatus;

  renewalDate?: string;

  features: string[];

}


export interface SubscriptionCardProps {

  subscription?: SubscriptionData;

  onUpgrade?: () => void;

  onManage?: () => void;

}



// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultSubscription: SubscriptionData = {

  plan:
    'Premium',

  price:
    '$149 / month',

  status:
    'active',

  renewalDate:
    'September 12, 2026',

  features: [

    'AI Store Creation',

    'AI Theme Generator',

    'AI Product Generator',

    'Advanced Analytics',

    'Priority AI Support',

  ],

};



// ============================================================================
// ICON
// ============================================================================

function CheckIcon() {

  return (

    <svg

      width="16"

      height="16"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

      strokeLinecap="round"

      strokeLinejoin="round"

    >

      <path d="M20 6L9 17l-5-5"/>

    </svg>

  );

}



// ============================================================================
// HELPERS
// ============================================================================

function getStatusVariant(

  status: SubscriptionStatus

) {


  switch(status) {


    case 'active':

      return 'success';


    case 'trial':

      return 'primary';


    case 'expired':

      return 'danger';


    default:

      return 'neutral';


  }

}



// ============================================================================
// COMPONENT
// ============================================================================

export default function SubscriptionCard({

  subscription = defaultSubscription,

  onUpgrade,

  onManage,

}: SubscriptionCardProps) {


  return (

    <Card

      variant="dark"

      className="relative overflow-hidden"

    >


      {/* Premium glow */}

      <div

        className={[

          'absolute',

          'right-0',

          'top-0',

          'h-40',

          'w-40',

          'rounded-full',

          'bg-[#FF3B2F]/10',

          'blur-3xl',

        ].join(' ')}

      />



      <div

        className="relative"

      >


        {/* Header */}

        <div

          className="flex items-start justify-between"

        >

          <div>

            <p

              className="text-sm text-white/50"

            >

              Current Plan

            </p>


            <h2

              className="mt-2 text-2xl font-bold text-white"

            >

              {subscription.plan}

            </h2>


            <p

              className="mt-1 text-xl font-semibold text-[#FF3B2F]"

            >

              {subscription.price}

            </p>


          </div>



          <Badge

            variant={

              getStatusVariant(

                subscription.status

              )

            }

          >

            {subscription.status}

          </Badge>


        </div>



        {/* Renewal */}

        {subscription.renewalDate && (

          <p

            className="mt-5 text-sm text-white/50"

          >

            Next billing date:

            <span

              className="ml-1 text-white"

            >

              {subscription.renewalDate}

            </span>


          </p>

        )}



        {/* Features */}

        <div

          className="mt-6 space-y-3"

        >

          {subscription.features.map(

            (feature) => (

              <div

                key={feature}

                className="flex items-center gap-3"

              >

                <span

                  className="text-[#FF3B2F]"

                >

                  <CheckIcon />

                </span>


                <span

                  className="text-sm text-white/70"

                >

                  {feature}

                </span>


              </div>

            )

          )}

        </div>



        {/* Actions */}

        <div

          className="mt-8 flex gap-3"

        >

          <Button

            className="flex-1"

            onClick={onUpgrade}

          >

            Upgrade Plan

          </Button>


          <Button

            variant="ghost"

            onClick={onManage}

          >

            Manage

          </Button>


        </div>


      </div>


    </Card>

  );

}
