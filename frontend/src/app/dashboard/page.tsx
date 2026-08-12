/**
 * ============================================================================
 * Layboka AI
 * Dashboard Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/dashboard/page.tsx
 *
 * Route:
 * /dashboard
 *
 * Purpose:
 * - Merchant dashboard overview
 * - Store performance summary
 * - AI sales analytics
 *
 * ============================================================================
 */

'use client';


import DashboardLayout from '@/components/layout/DashboardLayout';

import StatsCards from '@/components/dashboard/StatsCards';

import RecentActivity from '@/components/dashboard/RecentActivity';

import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';


// ============================================================================
// PAGE
// ============================================================================

export default function DashboardPage() {


  return (

    <DashboardLayout>


      <div

        className="space-y-8"

      >


        {/* ================================================================
            PAGE HEADER
        ================================================================= */}

        <div>

          <h1

            className="text-3xl font-bold text-white"

          >

            Dashboard

          </h1>


          <p

            className="mt-2 text-sm text-white/50"

          >

            Monitor your AI store performance and customer activity.

          </p>


        </div>



        {/* ================================================================
            QUICK STATS
        ================================================================= */}

        <StatsCards />



        {/* ================================================================
            ANALYTICS
        ================================================================= */}

        <AnalyticsOverview />



        {/* ================================================================
            RECENT ACTIVITY
        ================================================================= */}

        <RecentActivity />


      </div>


    </DashboardLayout>

  );

}
