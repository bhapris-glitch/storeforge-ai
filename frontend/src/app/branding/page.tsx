/**
 * ============================================================================
 * Layboka AI
 * Branding Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/branding/page.tsx
 *
 * Route:
 * /branding
 *
 * Purpose:
 * - Configure merchant brand identity
 * - Connect branding settings with the branding store/service
 * - Prepare branding data for AI theme/store generation
 *
 * ============================================================================
 */

'use client';

import {
  useState,
} from 'react';

import DashboardLayout
  from '@/components/layout/DashboardLayout';

import BrandingForm, {
  type BrandingData,
} from '@/components/branding/BrandingForm';


// ============================================================================
// PAGE
// ============================================================================

export default function BrandingPage() {


  const [
    saving,
    setSaving,
  ] = useState(false);



  // ========================================================================
  // SAVE BRANDING
  // ========================================================================

  async function handleSubmit(
    data: BrandingData
  ) {

    try {

      setSaving(true);


      /*
       * The actual API/store integration will be connected
       * through branding.store.ts and branding.service.ts.
       *
       * Keeping this page-level handler allows the UI to remain
       * independent from the backend implementation.
       */

      console.log(
        'Branding data:',
        data
      );


      // Temporary UI delay.
      // Replace with the branding store action when connected.
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            600
          )
      );


    } catch (error) {

      console.error(
        'Failed to save branding:',
        error
      );


    } finally {

      setSaving(false);

    }

  }



  return (

    <DashboardLayout>


      <div

        className="mx-auto w-full max-w-5xl space-y-8"

      >


        {/* ================================================================
            PAGE HEADER
        ================================================================= */}

        <div>

          <p

            className="mb-2 text-sm font-medium text-[#FF3B2F]"

          >

            Store Identity

          </p>


          <h1

            className="text-3xl font-bold tracking-tight text-white"

          >

            Branding

          </h1>


          <p

            className="mt-2 max-w-2xl text-sm leading-6 text-white/50"

          >

            Configure your brand identity so Layboka AI can
            create consistent storefronts, products and themes.

          </p>


        </div>



        {/* ================================================================
            BRANDING FORM
        ================================================================= */}

        <BrandingForm

          loading={saving}

          onSubmit={
            handleSubmit
          }

        />


      </div>


    </DashboardLayout>

  );

}
