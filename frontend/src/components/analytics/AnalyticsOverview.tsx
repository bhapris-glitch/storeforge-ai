/**
 * ============================================================================
 * Layboka AI
 * Analytics Overview Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/analytics/AnalyticsOverview.tsx
 *
 * Purpose:
 * - Merchant analytics dashboard
 * - AI performance monitoring
 * - Revenue and conversion insights
 *
 * Metrics:
 * - Visitors
 * - AI conversations
 * - Conversion rate
 * - Revenue generated
 *
 * ============================================================================
 */

'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';


// ============================================================================
// TYPES
// ============================================================================

export interface AnalyticsMetric {

  title: string;

  value: string;

  change: string;

  description: string;

  trend:
    | 'up'
    | 'down'
    | 'neutral';

}


export interface AnalyticsOverviewProps {

  metrics?: AnalyticsMetric[];

}



// ============================================================================
// ICONS
// ============================================================================

function UsersIcon() {

  return (

    <svg

      width="22"

      height="22"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

    >

      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />

      <path d="M16 3.13a4 4 0 0 1 0 7.75" />

    </svg>

  );

}



function ChatIcon() {

  return (

    <svg

      width="22"

      height="22"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

    >

      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />

    </svg>

  );

}



function ChartIcon() {

  return (

    <svg

      width="22"

      height="22"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

    >

      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />

    </svg>

  );

}



function RevenueIcon() {

  return (

    <svg

      width="22"

      height="22"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

    >

      <line
        x1="12"
        y1="1"
        x2="12"
        y2="23"
      />

      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />

    </svg>

  );

}


// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultMetrics: AnalyticsMetric[] = [

  {

    title:
      'Store Visitors',

    value:
      '42,560',

    change:
      '+18%',

    description:
      'Monthly visitors',

    trend:
      'up',

  },


  {

    title:
      'AI Conversations',

    value:
      '12,840',

    change:
      '+24%',

    description:
      'Customer interactions',

    trend:
      'up',

  },


  {

    title:
      'Conversion Rate',

    value:
      '8.6%',

    change:
      '+2.4%',

    description:
      'AI assisted sales',

    trend:
      'up',

  },


  {

    title:
      'Revenue Generated',

    value:
      '$86,420',

    change:
      '+15%',

    description:
      'AI attributed revenue',

    trend:
      'up',

  },

];


// ============================================================================
// HELPERS
// ============================================================================

function getIcon(

  index: number

) {


  const icons = [

    <UsersIcon key="users" />,

    <ChatIcon key="chat" />,

    <ChartIcon key="chart" />,

    <RevenueIcon key="revenue" />,

  ];


  return icons[index % icons.length];

}


// ============================================================================
// COMPONENT
// ============================================================================

export default function AnalyticsOverview({

  metrics = defaultMetrics,

}: AnalyticsOverviewProps) {


  return (

    <div

      className="space-y-6"

    >


      {/* Metrics */}

      <div

        className={[

          'grid',

          'grid-cols-1',

          'gap-4',

          'sm:grid-cols-2',

          'xl:grid-cols-4',

        ].join(' ')}

      >

        {metrics.map(

          (metric, index) => (

            <Card

              key={metric.title}

              variant="dark"

            >

              <div

                className="flex items-start justify-between"

              >

                <div

                  className={[

                    'flex',

                    'h-11',

                    'w-11',

                    'items-center',

                    'justify-center',

                    'rounded-xl',

                    'bg-[#FF3B2F]/10',

                    'text-[#FF3B2F]',

                  ].join(' ')}

                >

                  {getIcon(index)}

                </div>


                <Badge

                  variant="success"

                  size="sm"

                >

                  {metric.change}

                </Badge>


              </div>



              <div

                className="mt-5"

              >

                <p

                  className="text-sm text-white/50"

                >

                  {metric.title}

                </p>


                <h3

                  className="mt-2 text-3xl font-bold text-white"

                >

                  {metric.value}

                </h3>


                <p

                  className="mt-2 text-xs text-white/40"

                >

                  {metric.description}

                </p>


              </div>


            </Card>

          )

        )}

      </div>



      {/* Performance Chart Placeholder */}

      <Card

        variant="dark"

      >

        <div

          className="flex items-center justify-between"

        >

          <div>

            <h2

              className="text-lg font-semibold text-white"

            >

              AI Sales Performance

            </h2>


            <p

              className="mt-1 text-sm text-white/40"

            >

              Revenue and conversion tracking

            </p>


          </div>


          <Badge

            variant="primary"

            size="sm"

          >

            Live Data

          </Badge>


        </div>



        <div

          className={[

            'mt-6',

            'flex',

            'h-56',

            'items-center',

            'justify-center',

            'rounded-2xl',

            'border',

            'border-white/10',

            'bg-[#0B1710]',

          ].join(' ')}

        >

          <p

            className="text-sm text-white/40"

          >

            Analytics graph will connect with dashboard analytics API

          </p>


        </div>


      </Card>


    </div>

  );

}
