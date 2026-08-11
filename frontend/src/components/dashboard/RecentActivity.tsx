/**
 * ============================================================================
 * Layboka AI
 * Recent Activity Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/dashboard/RecentActivity.tsx
 *
 * Purpose:
 * - Dashboard activity timeline
 * - AI operations tracking
 * - Shopify events
 * - User actions history
 *
 * Examples:
 * - AI theme generated
 * - Product content created
 * - Store connected
 * - Subscription upgraded
 *
 * ============================================================================
 */

'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';


// ============================================================================
// TYPES
// ============================================================================

export type ActivityType =
  | 'store'
  | 'theme'
  | 'product'
  | 'billing'
  | 'system';


export interface ActivityItem {

  id: string;

  title: string;

  description: string;

  time: string;

  type: ActivityType;

}


export interface RecentActivityProps {

  activities?: ActivityItem[];

}



// ============================================================================
// ICONS
// ============================================================================

function StoreIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M3 9l1-5h16l1 5" />

      <path d="M5 9v11h14V9" />

    </svg>

  );

}


function SparkIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3 2-7z" />

    </svg>

  );

}


function ProductIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M20 7l-8-4-8 4 8 4 8-4z" />

      <path d="M4 7v10l8 4 8-4V7" />

    </svg>

  );

}


function BillingIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 10h18" />

    </svg>

  );

}


function SystemIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 8v4" />

      <path d="M12 16h.01" />

    </svg>

  );

}


// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultActivities: ActivityItem[] = [

  {
    id: '1',
    title: 'AI Theme Generated',
    description:
      'Luxury fashion Shopify theme created successfully.',
    time:
      '5 minutes ago',
    type:
      'theme',
  },


  {
    id: '2',
    title: 'Store Connected',
    description:
      'New Shopify store connected with Layboka AI.',
    time:
      '25 minutes ago',
    type:
      'store',
  },


  {
    id: '3',
    title: 'Product Content Generated',
    description:
      '50 product descriptions generated using AI.',
    time:
      '1 hour ago',
    type:
      'product',
  },


  {
    id: '4',
    title: 'Subscription Upgraded',
    description:
      'Merchant upgraded to Premium plan.',
    time:
      '3 hours ago',
    type:
      'billing',
  },

];



// ============================================================================
// HELPERS
// ============================================================================

function getActivityIcon(
  type: ActivityType
) {

  switch(type) {

    case 'store':
      return <StoreIcon />;

    case 'theme':
      return <SparkIcon />;

    case 'product':
      return <ProductIcon />;

    case 'billing':
      return <BillingIcon />;

    default:
      return <SystemIcon />;

  }

}



function getBadgeVariant(
  type: ActivityType
) {

  switch(type) {

    case 'billing':
      return 'success';

    case 'product':
      return 'primary';

    case 'theme':
      return 'warning';

    default:
      return 'neutral';

  }

}


// ============================================================================
// COMPONENT
// ============================================================================

export default function RecentActivity({

  activities = defaultActivities,

}: RecentActivityProps) {


  return (

    <Card

      variant="dark"

      className="mt-6"

    >

      <div

        className="mb-5 flex items-center justify-between"

      >

        <div>

          <h2

            className="text-lg font-semibold text-white"

          >

            Recent Activity

          </h2>


          <p

            className="mt-1 text-sm text-white/40"

          >

            Latest AI platform events

          </p>

        </div>


        <Badge

          variant="primary"

          size="sm"

        >

          Live

        </Badge>


      </div>



      <div

        className="space-y-5"

      >

        {activities.map(

          (activity, index) => (

            <div

              key={activity.id}

              className="flex gap-4"

            >

              {/* Timeline */}

              <div

                className="flex flex-col items-center"

              >

                <div

                  className={[

                    'flex',

                    'h-9',

                    'w-9',

                    'items-center',

                    'justify-center',

                    'rounded-xl',

                    'bg-[#FF3B2F]/10',

                    'text-[#FF3B2F]',

                  ].join(' ')}

                >

                  {getActivityIcon(
                    activity.type
                  )}

                </div>


                {index !== activities.length - 1 && (

                  <div

                    className="mt-2 h-full w-px bg-white/10"

                  />

                )}

              </div>



              {/* Content */}

              <div

                className="flex-1"

              >

                <div

                  className="flex flex-wrap items-center justify-between gap-2"

                >

                  <h3

                    className="text-sm font-medium text-white"

                  >

                    {activity.title}

                  </h3>


                  <Badge

                    variant={
                      getBadgeVariant(
                        activity.type
                      )
                    }

                    size="sm"

                  >

                    {activity.type}

                  </Badge>


                </div>


                <p

                  className="mt-1 text-sm text-white/50"

                >

                  {activity.description}

                </p>


                <p

                  className="mt-2 text-xs text-white/30"

                >

                  {activity.time}

                </p>


              </div>


            </div>

          )

        )}

      </div>


    </Card>

  );

}
