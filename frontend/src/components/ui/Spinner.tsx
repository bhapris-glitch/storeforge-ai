/**
 * ============================================================================
 * Layboka AI
 * Spinner Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Spinner.tsx
 *
 * Purpose:
 * - Loading states
 * - API requests
 * - AI generation
 * - Shopify synchronization
 * - Dashboard data loading
 *
 * Design:
 * - Near-black green: #0B1710
 * - Deep near-black: #07100A
 * - Brand accent: #FF3B2F
 *
 * ============================================================================
 */

'use client';

import type {
  CSSProperties,
  ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type SpinnerSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';


export type SpinnerVariant =
  | 'primary'
  | 'white'
  | 'dark'
  | 'muted';


export interface SpinnerProps {

  /**
   * Spinner size.
   */
  size?: SpinnerSize;

  /**
   * Spinner color.
   */
  variant?: SpinnerVariant;

  /**
   * Optional accessible label.
   */
  label?: string;

  /**
   * Show label beside spinner.
   */
  showLabel?: boolean;

  /**
   * Additional classes.
   */
  className?: string;

  /**
   * Optional custom label/content.
   */
  children?: ReactNode;
}


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<
  SpinnerSize,
  string
> = {

  xs:
    'h-3 w-3 border-2',

  sm:
    'h-4 w-4 border-2',

  md:
    'h-5 w-5 border-2',

  lg:
    'h-7 w-7 border-[3px]',

  xl:
    'h-10 w-10 border-[3px]',

};


// ============================================================================
// COLOR STYLES
// ============================================================================

const variantStyles: Record<
  SpinnerVariant,
  string
> = {

  primary:
    'border-[#FF3B2F]/25 border-t-[#FF3B2F]',

  white:
    'border-white/25 border-t-white',

  dark:
    'border-[#0B1710]/20 border-t-[#0B1710]',

  muted:
    'border-white/10 border-t-white/50',

};


// ============================================================================
// SPINNER
// ============================================================================

export default function Spinner({

  size = 'md',

  variant = 'primary',

  label = 'Loading',

  showLabel = false,

  className = '',

  children,

}: SpinnerProps) {


  const animationStyle:
    CSSProperties = {

      animationDuration: '700ms',

    };


  return (

    <span

      className={[
        'inline-flex',
        'items-center',
        'gap-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}

      role="status"
      aria-label={label}

    >

      {/* ================================================================ */}
      {/* SPINNER */}
      {/* ================================================================ */}

      <span

        aria-hidden="true"

        className={[
          'inline-block',
          'shrink-0',
          'animate-spin',
          'rounded-full',
          'border-solid',
          sizeStyles[size],
          variantStyles[variant],
        ].join(' ')}

        style={animationStyle}

      />


      {/* ================================================================ */}
      {/* LABEL */}
      {/* ================================================================ */}

      {(showLabel || children) && (

        <span
          className="text-sm text-white/60"
        >

          {children || label}

        </span>

      )}

    </span>

  );

}
