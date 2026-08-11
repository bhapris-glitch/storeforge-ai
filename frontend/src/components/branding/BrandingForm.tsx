/**
 * ============================================================================
 * Layboka AI
 * Branding Form Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/branding/BrandingForm.tsx
 *
 * Purpose:
 * - Merchant brand identity setup
 * - AI store branding configuration
 * - Theme personalization
 *
 * Fields:
 * - Brand name
 * - Logo
 * - Primary color
 * - Secondary color
 * - Industry
 * - Brand description
 *
 * ============================================================================
 */

'use client';

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';


// ============================================================================
// TYPES
// ============================================================================

export interface BrandingData {

  brandName: string;

  industry: string;

  description: string;

  primaryColor: string;

  secondaryColor: string;

  logo?: File | null;

}


export interface BrandingFormProps {

  initialData?: Partial<BrandingData>;

  onSubmit?: (
    data: BrandingData
  ) => void;

  loading?: boolean;

}


// ============================================================================
// INDUSTRY OPTIONS
// ============================================================================

const industryOptions = [

  {
    label: 'Fashion & Apparel',
    value: 'fashion',
  },

  {
    label: 'Electronics',
    value: 'electronics',
  },

  {
    label: 'Beauty & Cosmetics',
    value: 'beauty',
  },

  {
    label: 'Food & Beverage',
    value: 'food',
  },

  {
    label: 'Home & Lifestyle',
    value: 'home',
  },

  {
    label: 'Other',
    value: 'other',
  },

];


// ============================================================================
// COMPONENT
// ============================================================================

export default function BrandingForm({

  initialData,

  onSubmit,

  loading = false,

}: BrandingFormProps) {


  const [
    formData,
    setFormData,
  ] = useState<BrandingData>({

    brandName:
      initialData?.brandName || '',

    industry:
      initialData?.industry || '',

    description:
      initialData?.description || '',

    primaryColor:
      initialData?.primaryColor || '#FF3B2F',

    secondaryColor:
      initialData?.secondaryColor || '#1e3928',

    logo:
      null,

  });



  const [
    logoPreview,
    setLogoPreview,
  ] = useState<string | null>(
    null
  );



  // ========================================================================
  // INPUT HANDLER
  // ========================================================================

  function updateField(

    key: keyof BrandingData,

    value: string

  ) {

    setFormData(
      (previous) => ({

        ...previous,

        [key]: value,

      })
    );

  }



  // ========================================================================
  // LOGO UPLOAD
  // ========================================================================

  function handleLogoUpload(

    event: ChangeEvent<HTMLInputElement>

  ) {


    const file =
      event.target.files?.[0];


    if (!file) {

      return;

    }



    setFormData(
      (previous) => ({

        ...previous,

        logo: file,

      })
    );



    setLogoPreview(
      URL.createObjectURL(file)
    );

  }



  // ========================================================================
  // SUBMIT
  // ========================================================================

  function handleSubmit(

    event: FormEvent<HTMLFormElement>

  ) {

    event.preventDefault();

    onSubmit?.(formData);

  }



  return (

    <Card

      variant="dark"

      title="Brand Identity"

      description="Configure your AI generated store branding"

      action={

        <Badge

          variant="primary"

          size="sm"

        >

          AI Ready

        </Badge>

      }

    >


      <form

        onSubmit={handleSubmit}

        className="space-y-6"

      >


        {/* ================================================================ */}
        {/* LOGO */}
        {/* ================================================================ */}

        <div>

          <label

            className="mb-2 block text-sm font-medium text-white"

          >

            Brand Logo

          </label>



          <div

            className="flex items-center gap-4"

          >

            <div

              className={[

                'flex',

                'h-20',

                'w-20',

                'items-center',

                'justify-center',

                'overflow-hidden',

                'rounded-2xl',

                'border',

                'border-white/10',

                'bg-[#07100A]',

              ].join(' ')}

            >

              {logoPreview ? (

                <img

                  src={logoPreview}

                  alt="Brand logo preview"

                  className="h-full w-full object-cover"

                />

              ) : (

                <span

                  className="text-xs text-white/40"

                >

                  Logo

                </span>

              )}

            </div>



            <label

              className={[

                'cursor-pointer',

                'rounded-xl',

                'border',

                'border-white/10',

                'px-4',

                'py-2',

                'text-sm',

                'text-white/70',

                'transition',

                'hover:bg-white/5',

              ].join(' ')}

            >

              Upload Logo


              <input

                type="file"

                accept="image/*"

                hidden

                onChange={
                  handleLogoUpload
                }

              />

            </label>


          </div>


        </div>



        {/* ================================================================ */}
        {/* BRAND NAME */}
        {/* ================================================================ */}

        <Input

          label="Brand Name"

          placeholder="Enter your brand name"

          value={
            formData.brandName
          }

          onChange={
            (event) =>
              updateField(
                'brandName',
                event.target.value
              )
          }

        />



        {/* ================================================================ */}
        {/* INDUSTRY */}
        {/* ================================================================ */}

        <Select

          label="Industry"

          options={
            industryOptions
          }

          value={
            formData.industry
          }

          onChange={
            (value) =>
              updateField(
                'industry',
                value
              )
          }

        />



        {/* ================================================================ */}
        {/* DESCRIPTION */}
        {/* ================================================================ */}

        <Textarea

          label="Brand Description"

          placeholder="Describe your brand personality, customers and goals"

          value={
            formData.description
          }

          onChange={
            (event) =>
              updateField(
                'description',
                event.target.value
              )
          }

          rows={5}

        />



        {/* ================================================================ */}
        {/* COLORS */}
        {/* ================================================================ */}

        <div

          className={[

            'grid',

            'grid-cols-1',

            'gap-4',

            'md:grid-cols-2',

          ].join(' ')}

        >

          <div>

            <label

              className="mb-2 block text-sm text-white"

            >

              Primary Color

            </label>


            <div

              className="flex gap-3"

            >

              <input

                type="color"

                value={
                  formData.primaryColor
                }

                onChange={
                  (event) =>
                    updateField(
                      'primaryColor',
                      event.target.value
                    )
                }

                className="h-10 w-12 cursor-pointer rounded-lg bg-transparent"

              />


              <Input

                value={
                  formData.primaryColor
                }

                onChange={
                  (event) =>
                    updateField(
                      'primaryColor',
                      event.target.value
                    )
                }

              />

            </div>


          </div>



          <div>

            <label

              className="mb-2 block text-sm text-white"

            >

              Secondary Color

            </label>


            <div

              className="flex gap-3"

            >

              <input

                type="color"

                value={
                  formData.secondaryColor
                }

                onChange={
                  (event) =>
                    updateField(
                      'secondaryColor',
                      event.target.value
                    )
                }

                className="h-10 w-12 cursor-pointer rounded-lg bg-transparent"

              />


              <Input

                value={
                  formData.secondaryColor
                }

                onChange={
                  (event) =>
                    updateField(
                      'secondaryColor',
                      event.target.value
                    )
                }

              />

            </div>


          </div>


        </div>



        {/* ================================================================ */}
        {/* SUBMIT */}
        {/* ================================================================ */}

        <div

          className="flex justify-end"

        >

          <Button

            type="submit"

            loading={loading}

          >

            Save Branding

          </Button>


        </div>


      </form>


    </Card>

  );

}
