/**
 * ============================================================================
 * Layboka AI
 * Analytics Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/analytics/page.tsx
 *
 * Route:
 * /analytics
 *
 * Purpose:
 * - Merchant analytics dashboard
 * - AI sales performance
 * - Store conversion insights
 *
 * ============================================================================
 */

'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';


// ============================================================================
// PAGE
// ============================================================================

export default function AnalyticsPage() {


  return (

    <DashboardLayout>


      <div

        className="space-y-8"

      >


        {/* ================================================================
            PAGE HEADER
        ================================================================= */}

        <div>

          <p

            className="mb-2 text-sm font-medium text-[#FF3B2F]"

          >

            Store Intelligence

          </p>


          <h1

            className="text-3xl font-bold tracking-tight text-white"

          >

            Analytics

          </h1>


          <p

            className="mt-2 max-w-2xl text-sm leading-6 text-white/50"

          >

            Understand how your store and Layboka AI
            are converting visitors into customers.

          </p>


        </div>



        {/* ================================================================
            ANALYTICS OVERVIEW
        ================================================================= */}

        <AnalyticsOverview />


      </div>


    </DashboardLayout>

  );

}
