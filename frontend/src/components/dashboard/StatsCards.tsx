/**
 * ============================================================================
 * Layboka AI
 * Stats Cards Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/dashboard/StatsCards.tsx
 *
 * Purpose:
 * - Dashboard overview metrics
 * - AI platform statistics
 * - Store performance summary
 *
 * Displays:
 * - Generated Stores
 * - AI Themes Created
 * - Products Generated
 * - Monthly Revenue
 *
 * ============================================================================
 */

'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';


// ============================================================================
// TYPES
// ============================================================================

export interface StatItem {

  title: string;

  value: string;

  description: string;

  trend?: string;

  trendType?:
    | 'positive'
    | 'negative'
    | 'neutral';

  icon: React.ReactNode;

}


export interface StatsCardsProps {

  stats?: StatItem[];

}


// ============================================================================
// ICONS
// ============================================================================

function StoreIcon() {

  return (

    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M3 9l1-5h16l1 5" />

      <path d="M5 9v11h14V9" />

      <path d="M9 20v-6h6v6" />

    </svg>

  );

}



function ThemeIcon() {

  return (

    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />

    </svg>

  );

}



function ProductIcon() {

  return (

    <svg
      width="22"
      height="22"
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

const defaultStats: StatItem[] = [

  {

    title:
      'AI Stores Created',

    value:
      '248',

    description:
      'Total generated stores',

    trend:
      '+12%',

    trendType:
      'positive',

    icon:
      <StoreIcon />,

  },


  {

    title:
      'AI Themes Generated',

    value:
      '1,420',

    description:
      'Themes created',

    trend:
      '+24%',

    trendType:
      'positive',

    icon:
      <ThemeIcon />,

  },


  {

    title:
      'Products Generated',

    value:
      '8,560',

    description:
      'AI product content',

    trend:
      '+18%',

    trendType:
      'positive',

    icon:
      <ProductIcon />,

  },


  {

    title:
      'Monthly Revenue',

    value:
      '$24,890',

    description:
      'Platform revenue',

    trend:
      '+9%',

    trendType:
      'positive',

    icon:
      <RevenueIcon />,

  },

];


// ============================================================================
// TREND BADGE
// ============================================================================

function TrendBadge({

  value,

  type = 'neutral',

}: {

  value: string;

  type?:
    | 'positive'
    | 'negative'
    | 'neutral';

}) {


  const variant =

    type === 'positive'

      ? 'success'

      : type === 'negative'

        ? 'danger'

        : 'neutral';



  return (

    <Badge

      variant={variant}

      size="sm"

    >

      {value}

    </Badge>

  );

}


// ============================================================================
// COMPONENT
// ============================================================================

export default function StatsCards({

  stats = defaultStats,

}: StatsCardsProps) {


  return (

    <div

      className={[

        'grid',

        'grid-cols-1',

        'gap-4',

        'sm:grid-cols-2',

        'xl:grid-cols-4',

      ].join(' ')}

    >

      {stats.map(

        (stat) => (

          <Card

            key={stat.title}

            variant="dark"

            className="group"

          >

            <div

              className={[

                'flex',

                'items-start',

                'justify-between',

              ].join(' ')}

            >


              {/* Icon */}

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

                  'transition',

                  'group-hover:bg-[#FF3B2F]',

                  'group-hover:text-white',

                ].join(' ')}

              >

                {stat.icon}

              </div>



              {/* Trend */}

              {stat.trend && (

                <TrendBadge

                  value={stat.trend}

                  type={stat.trendType}

                />

              )}


            </div>



            <div

              className="mt-5"

            >

              <p

                className="text-sm text-white/50"

              >

                {stat.title}

              </p>


              <h3

                className={[

                  'mt-2',

                  'text-3xl',

                  'font-bold',

                  'tracking-tight',

                  'text-white',

                ].join(' ')}

              >

                {stat.value}

              </h3>


              <p

                className="mt-2 text-xs text-white/40"

              >

                {stat.description}

              </p>


            </div>


          </Card>

        )

      )}

    </div>

  );

}
