/**
 * ============================================================================
 * Layboka AI
 * Progress Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Progress.tsx
 *
 * Purpose:
 * - AI generation progress
 * - Shopify synchronization
 * - Theme generation
 * - Product generation
 * - Upload/process states
 * - Billing usage limits
 *
 * Design:
 * - Near-black green: #0B1710
 * - Deep near-black: #07100A
 * - Brand accent: #FF3B2F
 *
 * ============================================================================
 */

'use client';

import {
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type ProgressVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';


export type ProgressSize =
  | 'sm'
  | 'md'
  | 'lg';


export interface ProgressProps {

  /**
   * Current progress value.
   * Expected range: 0 - 100.
   */
  value?: number;

  /**
   * Optional maximum value.
   */
  max?: number;

  /**
   * Visual variant.
   */
  variant?: ProgressVariant;

  /**
   * Progress bar height.
   */
  size?: ProgressSize;

  /**
   * Show percentage text.
   */
  showValue?: boolean;

  /**
   * Label displayed above progress.
   */
  label?: ReactNode;

  /**
   * Custom value displayed beside label.
   */
  valueLabel?: ReactNode;

  /**
   * Animated indeterminate state.
   */
  indeterminate?: boolean;

  /**
   * Rounded progress bar.
   */
  rounded?: boolean;

  /**
   * Additional class.
   */
  className?: string;
}


// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<
  ProgressVariant,
  string
> = {

  primary:
    'bg-[#FF3B2F]',

  success:
    'bg-emerald-500',

  warning:
    'bg-yellow-400',

  danger:
    'bg-red-500',

  neutral:
    'bg-white/40',

};


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<
  ProgressSize,
  string
> = {

  sm:
    'h-1.5',

  md:
    'h-2',

  lg:
    'h-3',

};


// ============================================================================
// PROGRESS
// ============================================================================

export default function Progress({

  value = 0,

  max = 100,

  variant = 'primary',

  size = 'md',

  showValue = false,

  label,

  valueLabel,

  indeterminate = false,

  rounded = true,

  className = '',

}: ProgressProps) {


  // ========================================================================
  // NORMALIZE VALUE
  // ========================================================================

  const safeMax =
    max > 0
      ? max
      : 100;


  const safeValue =
    Math.min(
      Math.max(value, 0),
      safeMax
    );


  const percentage =
    Math.round(
      (safeValue / safeMax) * 100
    );


  // ========================================================================
  // RENDER
  // ========================================================================

  return (

    <div
      className={[
        'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >


      {/* ================================================================ */}
      {/* LABEL */}
      {/* ================================================================ */}

      {(label ||
        showValue ||
        valueLabel) && (

        <div
          className={[
            'mb-2',
            'flex',
            'items-center',
            'justify-between',
            'gap-3',
            'text-sm',
          ].join(' ')}
        >

          {label && (

            <span
              className="min-w-0 text-white/70"
            >
              {label}
            </span>

          )}


          {(showValue ||
            valueLabel) && (

            <span
              className={[
                'shrink-0',
                'font-medium',
                'text-white',
              ].join(' ')}
            >

              {valueLabel ??
                `${percentage}%`}

            </span>

          )}

        </div>

      )}


      {/* ================================================================ */}
      {/* TRACK */}
      {/* ================================================================ */}

      <div

        className={[
          'relative',
          'w-full',
          'overflow-hidden',
          'bg-white/10',
          sizeStyles[size],
          rounded
            ? 'rounded-full'
            : 'rounded-md',
        ].join(' ')}

        role="progressbar"

        aria-valuemin={0}

        aria-valuemax={safeMax}

        aria-valuenow={
          indeterminate
            ? undefined
            : safeValue
        }

      >


        {/* ============================================================ */}
        {/* INDICATOR */}
        {/* ============================================================ */}

        {indeterminate ? (

          <div

            className={[
              'absolute',
              'inset-y-0',
              'w-1/3',
              'animate-progress-indeterminate',
              variantStyles[variant],
              rounded
                ? 'rounded-full'
                : 'rounded-md',
            ].join(' ')}

            style={{
              animation:
                'layboka-progress 1.4s ease-in-out infinite',
            }}

          />

        ) : (

          <div

            className={[
              'h-full',
              'transition-[width]',
              'duration-500',
              'ease-out',
              variantStyles[variant],
              rounded
                ? 'rounded-full'
                : 'rounded-md',
            ].join(' ')}

            style={{
              width: `${percentage}%`,
            }}

          />

        )}

      </div>


      {/* ================================================================ */}
      {/* ANIMATION */}
      {/* ================================================================ */}

      {indeterminate && (

        <style jsx>{`

          @keyframes layboka-progress {

            0% {
              left: -35%;
            }

            50% {
              left: 50%;
            }

            100% {
              left: 100%;
            }

          }

        `}</style>

      )}

    </div>

  );

}
