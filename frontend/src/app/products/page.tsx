/**
 * ============================================================================
 * Layboka AI
 * Products Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/products/page.tsx
 *
 * Route:
 * /products
 *
 * Purpose:
 * - Display merchant products
 * - Manage AI generated products
 * - Provide access to product generation
 *
 * ============================================================================
 */

'use client';

import Link from 'next/link';

import DashboardLayout
  from '@/components/layout/DashboardLayout';

import ProductTable, {
  type ProductItem,
} from '@/components/products/ProductTable';


// ============================================================================
// PAGE
// ============================================================================

export default function ProductsPage() {


  function handleView(
    product: ProductItem
  ) {

    console.log(
      'View product:',
      product
    );

  }



  function handleEdit(
    product: ProductItem
  ) {

    console.log(
      'Edit product:',
      product
    );

  }



  return (

    <DashboardLayout>


      <div

        className="space-y-8"

      >


        {/* ================================================================
            PAGE HEADER
        ================================================================= */}

        <div

          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"

        >

          <div>

            <p

              className="mb-2 text-sm font-medium text-[#FF3B2F]"

            >

              Product Management

            </p>


            <h1

              className="text-3xl font-bold tracking-tight text-white"

            >

              Products

            </h1>


            <p

              className="mt-2 max-w-2xl text-sm leading-6 text-white/50"

            >

              Manage your Shopify products and create new
              products using Layboka AI.

            </p>


          </div>



          {/* ============================================================
              GENERATE BUTTON
          ============================================================= */}

          <Link

            href="/products/generate"

            className={[

              'inline-flex',

              'items-center',

              'justify-center',

              'rounded-xl',

              'bg-[#FF3B2F]',

              'px-5',

              'py-3',

              'text-sm',

              'font-semibold',

              'text-white',

              'transition',

              'hover:bg-[#FF5147]',

              'focus:outline-none',

              'focus:ring-2',

              'focus:ring-[#FF3B2F]/40',

            ].join(' ')}

          >

            Generate Product

          </Link>


        </div>



        {/* ================================================================
            PRODUCT TABLE
        ================================================================= */}

        <ProductTable

          onView={
            handleView
          }

          onEdit={
            handleEdit
          }

        />


      </div>


    </DashboardLayout>

  );

}
