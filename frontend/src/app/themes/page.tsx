/**
 * ============================================================================
 * Layboka AI
 * Themes Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/themes/page.tsx
 *
 * Route:
 * /themes
 *
 * Purpose:
 * - AI theme generation
 * - Theme customization
 * - Theme generation workspace
 *
 * ============================================================================
 */

'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

import ThemeGenerator from '@/components/themes/ThemeGenerator';


// ============================================================================
// PAGE
// ============================================================================

export default function ThemesPage() {


  function handleGenerate(data: {

    industry: string;

    style: string;

    description: string;

    primaryColor: string;

  }) {


    /*
     * AI theme generation will be connected through:
     *
     * frontend/src/services/ai.service.ts
     *
     * and:
     *
     * frontend/src/store/theme.store.ts
     *
     */


    console.log(
      'Generate theme:',
      data
    );

  }



  return (

    <DashboardLayout>


      <div

        className="mx-auto w-full max-w-6xl space-y-8"

      >


        {/* ================================================================
            HEADER
        ================================================================= */}

        <div>

          <p

            className="mb-2 text-sm font-medium text-[#FF3B2F]"

          >

            Store Design

          </p>


          <h1

            className="text-3xl font-bold tracking-tight text-white"

          >

            AI Themes

          </h1>


          <p

            className="mt-2 max-w-2xl text-sm leading-6 text-white/50"

          >

            Generate a modern Shopify storefront based on
            your industry, brand and design preferences.

          </p>


        </div>



        {/* ================================================================
            THEME GENERATOR
        ================================================================= */}

        <ThemeGenerator

          onGenerate={
            handleGenerate
          }

        />


      </div>


    </DashboardLayout>

  );

}
