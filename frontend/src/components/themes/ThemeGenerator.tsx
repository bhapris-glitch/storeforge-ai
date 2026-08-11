/**
 * ============================================================================
 * Layboka AI
 * Theme Generator Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/themes/ThemeGenerator.tsx
 *
 * Purpose:
 * - AI powered Shopify theme generation
 * - Merchant theme customization
 * - Preview generated theme configuration
 *
 * Features:
 * - Store category selection
 * - Design style selection
 * - Color preference
 * - AI generation status
 * - Theme preview
 *
 * ============================================================================
 */

'use client';

import {
  useState,
} from 'react';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';


// ============================================================================
// TYPES
// ============================================================================

export interface ThemeGeneratorData {

  industry: string;

  style: string;

  description: string;

  primaryColor: string;

}


export interface ThemeGeneratorProps {

  onGenerate?: (
    data: ThemeGeneratorData
  ) => void;

  loading?: boolean;

}


// ============================================================================
// OPTIONS
// ============================================================================

const industryOptions = [

  {
    label: 'Fashion Store',
    value: 'fashion',
  },

  {
    label: 'Electronics Store',
    value: 'electronics',
  },

  {
    label: 'Beauty Store',
    value: 'beauty',
  },

  {
    label: 'Food Store',
    value: 'food',
  },

  {
    label: 'Home & Lifestyle',
    value: 'home',
  },

];


const styleOptions = [

  {
    label: 'Modern Minimal',
    value: 'minimal',
  },

  {
    label: 'Luxury Premium',
    value: 'luxury',
  },

  {
    label: 'Bold & Creative',
    value: 'creative',
  },

  {
    label: 'Clean Ecommerce',
    value: 'clean',
  },

];


// ============================================================================
// ICON
// ============================================================================

function SparkIcon() {

  return (

    <svg

      width="22"

      height="22"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

    >

      <path d="M12 2l2.5 7L22 12l-7.5 3L12 22l-2.5-7L2 12l7.5-3L12 2z"/>

    </svg>

  );

}


// ============================================================================
// COMPONENT
// ============================================================================

export default function ThemeGenerator({

  onGenerate,

  loading = false,

}: ThemeGeneratorProps) {


  const [

    form,

    setForm,

  ] = useState<ThemeGeneratorData>({

    industry: '',

    style: '',

    description: '',

    primaryColor: '#FF3B2F',

  });



  const [

    generated,

    setGenerated,

  ] = useState(false);



  function updateField(

    key: keyof ThemeGeneratorData,

    value: string

  ) {

    setForm(

      previous => ({

        ...previous,

        [key]: value,

      })

    );

  }



  function submit() {


    setGenerated(false);


    onGenerate?.(form);


    setTimeout(

      () => {

        setGenerated(true);

      },

      800

    );

  }



  return (

    <Card

      variant="dark"

      title="AI Theme Generator"

      description="Generate a Shopify theme based on your brand"

      action={

        <Badge

          variant="primary"

          size="sm"

        >

          AI Powered

        </Badge>

      }

    >

      <div

        className="space-y-6"

      >


        {/* Industry */}

        <Select

          label="Store Industry"

          options={industryOptions}

          value={form.industry}

          onChange={(value)=>

            updateField(

              'industry',

              value

            )

          }

        />



        {/* Style */}

        <Select

          label="Design Style"

          options={styleOptions}

          value={form.style}

          onChange={(value)=>

            updateField(

              'style',

              value

            )

          }

        />



        {/* Description */}

        <Textarea

          label="Theme Description"

          placeholder="Example: Premium fashion store with luxury feel"

          rows={5}

          value={form.description}

          onChange={(event)=>

            updateField(

              'description',

              event.target.value

            )

          }

        />



        {/* Color */}

        <div>

          <label

            className="mb-2 block text-sm text-white"

          >

            Brand Color

          </label>


          <div

            className="flex items-center gap-3"

          >

            <input

              type="color"

              value={form.primaryColor}

              onChange={(event)=>

                updateField(

                  'primaryColor',

                  event.target.value

                )

              }

              className="h-10 w-12 rounded-lg"

            />


            <span

              className="text-sm text-white/60"

            >

              {form.primaryColor}

            </span>


          </div>

        </div>



        {/* Generate Button */}

        <Button

          onClick={submit}

          loading={loading}

          className="w-full"

        >

          <span

            className="flex items-center justify-center gap-2"

          >

            <SparkIcon />

            Generate AI Theme

          </span>


        </Button>



        {/* Preview */}

        {generated && (

          <div

            className="mt-6 rounded-2xl border border-white/10 bg-[#0B1710] p-5"

          >

            <div

              className="mb-4 flex items-center justify-between"

            >

              <h3

                className="font-semibold text-white"

              >

                Generated Theme Preview

              </h3>


              <Badge

                variant="success"

                size="sm"

              >

                Ready

              </Badge>


            </div>



            <div

              className="space-y-3"

            >

              <div

                className="h-20 rounded-xl bg-gradient-to-r from-[#FF3B2F]/30 to-white/5"

              />


              <div

                className="h-4 w-3/4 rounded bg-white/10"

              />


              <div

                className="h-4 w-1/2 rounded bg-white/10"

              />


            </div>


          </div>

        )}


      </div>


    </Card>

  );

}
