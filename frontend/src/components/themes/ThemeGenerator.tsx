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
  useEffect,
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
      aria-hidden="true"
    >
      <path d="M12 2l2.5 7L22 12l-7.5 3L12 22l-2.5-7L2 12l7.5-3L12 2z" />
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
  const [form, setForm] = useState<ThemeGeneratorData>({
    industry: '',
    style: '',
    description: '',
    primaryColor: '#FF3B2F',
  });

  const [generated, setGenerated] = useState(false);

  const [error, setError] = useState('');

  // ==========================================================================
  // CLEAR OLD PREVIEW WHEN FORM CHANGES
  // ==========================================================================

  useEffect(() => {
    setGenerated(false);
  }, [
    form.industry,
    form.style,
    form.description,
    form.primaryColor,
  ]);

  // ==========================================================================
  // UPDATE FIELD
  // ==========================================================================

  function updateField(
    key: keyof ThemeGeneratorData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError('');
  }

  // ==========================================================================
  // SUBMIT
  // ==========================================================================

  function submit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Prevent duplicate generation requests
    if (loading) {
      return;
    }

    // Reset previous state
    setGenerated(false);
    setError('');

    // Validate industry
    if (!form.industry) {
      setError('Please select a store industry.');
      return;
    }

    // Validate design style
    if (!form.style) {
      setError('Please select a design style.');
      return;
    }

    // Validate description length
    if (form.description.length > 500) {
      setError(
        'Theme description must be 500 characters or less.'
      );
      return;
    }

    // Validate color
    const colorPattern =
      /^#[0-9A-Fa-f]{6}$/;

    if (!colorPattern.test(form.primaryColor)) {
      setError('Please select a valid brand color.');
      return;
    }

    // Send data to parent
    onGenerate?.(form);

    /*
     * Do not use setTimeout here to simulate AI generation.
     *
     * The parent component should control the actual loading state
     * and generated result when the API request completes.
     *
     * This fallback only marks the preview as generated when there
     * is no loading state being controlled by the parent.
     */
    if (!loading) {
      setGenerated(true);
    }
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
      <form
        onSubmit={submit}
        className="space-y-6"
        noValidate
      >
        {/* ==================================================================
            INDUSTRY
        ================================================================== */}

        <Select
          label="Store Industry"
          options={industryOptions}
          value={form.industry}
          onChange={(event) =>
            updateField(
              'industry',
              event.target.value
            )
          }
        />

        {/* ==================================================================
            STYLE
        ================================================================== */}

        <Select
          label="Design Style"
          options={styleOptions}
          value={form.style}
          onChange={(event) =>
            updateField(
              'style',
              event.target.value
            )
          }
        />

        {/* ==================================================================
            DESCRIPTION
        ================================================================== */}

        <Textarea
          label="Theme Description"
          placeholder="Example: Premium fashion store with luxury feel"
          rows={5}
          maxLength={500}
          value={form.description}
          onChange={(event) =>
            updateField(
              'description',
              event.target.value
            )
          }
        />

        <div className="text-right text-xs text-white/40">
          {form.description.length}/500
        </div>

        {/* ==================================================================
            COLOR
        ================================================================== */}

        <div>
          <label
            htmlFor="theme-brand-color"
            className="mb-2 block text-sm text-white"
          >
            Brand Color
          </label>

          <div className="flex items-center gap-3">
            <input
              id="theme-brand-color"
              name="primaryColor"
              type="color"
              value={form.primaryColor}
              onChange={(event) =>
                updateField(
                  'primaryColor',
                  event.target.value.toUpperCase()
                )
              }
              aria-label="Select brand color"
              className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />

            <span className="text-sm text-white/60">
              {form.primaryColor}
            </span>
          </div>
        </div>

        {/* ==================================================================
            ERROR
        ================================================================== */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* ==================================================================
            GENERATE BUTTON
        ================================================================== */}

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <SparkIcon />

            {loading
              ? 'Generating AI Theme...'
              : 'Generate AI Theme'}
          </span>
        </Button>

        {/* ==================================================================
            PREVIEW
        ================================================================== */}

        {generated && !loading && (
          <div
            className="mt-6 rounded-2xl border border-white/10 bg-[#0B1710] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                Generated Theme Preview
              </h3>

              <Badge
                variant="success"
                size="sm"
              >
                Ready
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Theme header preview */}
              <div
                className="h-20 rounded-xl"
                style={{
                  background: `linear-gradient(
                    to right,
                    ${form.primaryColor}55,
                    rgba(255,255,255,0.05)
                  )`,
                }}
              />

              {/* Preview content */}
              <div className="h-4 w-3/4 rounded bg-white/10" />

              <div className="h-4 w-1/2 rounded bg-white/10" />

              {/* Selected configuration */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant="primary"
                  size="sm"
                >
                  {form.industry}
                </Badge>

                <Badge
                  variant="primary"
                  size="sm"
                >
                  {form.style}
                </Badge>

                <Badge
                  variant="primary"
                  size="sm"
                >
                  {form.primaryColor}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
