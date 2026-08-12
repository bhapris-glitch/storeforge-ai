/**
 * ============================================================================
 * Layboka AI
 * AI Product Generator Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/products/generate/page.tsx
 *
 * Route:
 * /products/generate
 *
 * Purpose:
 * - Generate Shopify products using AI
 * - Collect product generation instructions
 * - Prepare generated product data for Shopify
 *
 * ============================================================================
 */

'use client';

import {
  useState,
} from 'react';

import Link from 'next/link';

import DashboardLayout
  from '@/components/layout/DashboardLayout';

import Card
  from '@/components/ui/Card';

import Button
  from '@/components/ui/Button';

import Input
  from '@/components/ui/Input';

import Select
  from '@/components/ui/Select';

import Textarea
  from '@/components/ui/Textarea';

import Badge
  from '@/components/ui/Badge';


// ============================================================================
// OPTIONS
// ============================================================================

const categoryOptions = [

  {
    label: 'Fashion',
    value: 'fashion',
  },

  {
    label: 'Electronics',
    value: 'electronics',
  },

  {
    label: 'Beauty',
    value: 'beauty',
  },

  {
    label: 'Home & Lifestyle',
    value: 'home',
  },

  {
    label: 'Food & Beverage',
    value: 'food',
  },

];



const toneOptions = [

  {
    label: 'Professional',
    value: 'professional',
  },

  {
    label: 'Luxury',
    value: 'luxury',
  },

  {
    label: 'Friendly',
    value: 'friendly',
  },

  {
    label: 'Bold & Persuasive',
    value: 'persuasive',
  },

];


// ============================================================================
// PAGE
// ============================================================================

export default function GenerateProductPage() {


  const [

    productName,

    setProductName,

  ] = useState('');



  const [

    category,

    setCategory,

  ] = useState('');



  const [

    tone,

    setTone,

  ] = useState('');



  const [

    description,

    setDescription,

  ] = useState('');



  const [

    price,

    setPrice,

  ] = useState('');



  const [

    loading,

    setLoading,

  ] = useState(false);



  const [

    generated,

    setGenerated,

  ] = useState(false);



  // ========================================================================
  // GENERATE PRODUCT
  // ========================================================================

  async function handleGenerate() {


    try {

      setLoading(true);

      setGenerated(false);


      /*
       * AI service integration will be connected through:
       *
       * frontend/src/services/ai.service.ts
       *
       * and product.store.ts.
       */


      await new Promise(

        (resolve) =>

          setTimeout(
            resolve,
            900
          )

      );


      setGenerated(true);


    } catch (error) {

      console.error(
        'Product generation failed:',
        error
      );


    } finally {

      setLoading(false);

    }

  }



  return (

    <DashboardLayout>


      <div

        className="mx-auto w-full max-w-6xl space-y-8"

      >


        {/* ================================================================
            HEADER
        ================================================================= */}

        <div

          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"

        >

          <div>

            <Link

              href="/products"

              className="text-sm text-white/40 transition hover:text-white"

            >

              ← Back to Products

            </Link>


            <p

              className="mt-5 text-sm font-medium text-[#FF3B2F]"

            >

              AI Product Generator

            </p>


            <h1

              className="mt-1 text-3xl font-bold tracking-tight text-white"

            >

              Create a Product

            </h1>


            <p

              className="mt-2 max-w-2xl text-sm leading-6 text-white/50"

            >

              Give Layboka AI a few details and generate
              conversion-focused product content.

            </p>


          </div>


          <Badge

            variant="primary"

          >

            AI Powered

          </Badge>


        </div>



        {/* ================================================================
            WORKSPACE
        ================================================================= */}

        <div

          className="grid gap-6 lg:grid-cols-5"

        >


          {/* ============================================================
              FORM
          ============================================================= */}

          <Card

            variant="dark"

            className="lg:col-span-3"

            title="Product Details"

            description="Tell AI what you want to sell."

          >

            <div

              className="space-y-5"

            >


              <Input

                label="Product Name"

                placeholder="Example: Premium Wireless Headphones"

                value={productName}

                onChange={(event) =>

                  setProductName(
                    event.target.value
                  )

                }

              />



              <div

                className="grid gap-5 sm:grid-cols-2"

              >

                <Select

                  label="Category"

                  options={categoryOptions}

                  value={category}

                  onChange={
                    setCategory
                  }

                />


                <Select

                  label="Content Tone"

                  options={toneOptions}

                  value={tone}

                  onChange={
                    setTone
                  }

                />

              </div>



              <Input

                label="Price"

                placeholder="$99"

                value={price}

                onChange={(event) =>

                  setPrice(
                    event.target.value
                  )

                }

              />



              <Textarea

                label="Product Instructions"

                placeholder="Describe the product, target customer, key benefits, materials, features, or anything else AI should know."

                rows={7}

                value={description}

                onChange={(event) =>

                  setDescription(
                    event.target.value
                  )

                }

              />



              <Button

                className="w-full"

                loading={loading}

                onClick={
                  handleGenerate
                }

              >

                Generate Product with AI

              </Button>


            </div>

          </Card>



          {/* ============================================================
              PREVIEW
          ============================================================= */}

          <Card

            variant="dark"

            className="lg:col-span-2"

            title="AI Preview"

            description="Your generated product will appear here."

          >

            {!generated ? (

              <div

                className="flex min-h-[420px] flex-col items-center justify-center text-center"

              >

                <div

                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF3B2F]/10 text-[#FF3B2F]"

                >

                  ✦

                </div>


                <h3

                  className="mt-5 font-semibold text-white"

                >

                  Ready to generate

                </h3>


                <p

                  className="mt-2 max-w-xs text-sm leading-6 text-white/40"

                >

                  Enter your product information
                  and let Layboka AI create the
                  product content.

                </p>


              </div>

            ) : (

              <div

                className="space-y-5"

              >


                <div

                  className="flex items-center justify-between"

                >

                  <Badge

                    variant="success"

                  >

                    Generated

                  </Badge>


                  <span

                    className="text-xs text-white/40"

                  >

                    AI optimized

                  </span>


                </div>



                <div

                  className="flex h-40 items-center justify-center rounded-2xl bg-[#102019]"

                >

                  <span

                    className="text-xs text-white/25"

                  >

                    Product Image

                  </span>

                </div>



                <div>

                  <h3

                    className="text-lg font-semibold text-white"

                  >

                    {productName ||

                      'AI Generated Product'}

                  </h3>


                  <p

                    className="mt-2 text-sm leading-6 text-white/50"

                  >

                    Premium product designed for
                    modern ecommerce customers.

                  </p>

                </div>



                <div

                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4"

                >

                  <p

                    className="text-xs uppercase tracking-wider text-white/30"

                  >

                    Suggested Price

                  </p>


                  <p

                    className="mt-1 text-xl font-bold text-[#FF3B2F]"

                  >

                    {price || '$99'}

                  </p>

                </div>



                <Button

                  variant="secondary"

                  className="w-full"

                >

                  Save Product

                </Button>


              </div>

            )}

          </Card>


        </div>


      </div>


    </DashboardLayout>

  );

}
