/**
 * ============================================================================
 * Layboka AI
 * Badge Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Badge.tsx
 *
 * Purpose:
 * - Status indicators
 * - Subscription plans
 * - AI generation states
 * - Shopify connection status
 * - Analytics labels
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

export type BadgeVariant =

  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'outline';


export type BadgeSize =

  | 'sm'
  | 'md'
  | 'lg';


export interface BadgeProps {

  /**
   * Badge content.
   */
  children: ReactNode;


  /**
   * Badge color style.
   */
  variant?: BadgeVariant;


  /**
   * Badge size.
   */
  size?: BadgeSize;


  /**
   * Optional icon.
   */
  icon?: ReactNode;


  /**
   * Rounded pill style.
   */
  rounded?: boolean;


  /**
   * Additional classes.
   */
  className?: string;

}


// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<
  BadgeVariant,
  string
> = {


  primary: [

    'bg-[#FF3B2F]/10',

    'text-[#FF3B2F]',

    'border',

    'border-[#FF3B2F]/20',

  ].join(' '),



  secondary: [

    'bg-[#0B1710]',

    'text-white',

    'border',

    'border-white/10',

  ].join(' '),



  success: [

    'bg-emerald-500/10',

    'text-emerald-600',

    'border',

    'border-emerald-500/20',

  ].join(' '),



  warning: [

    'bg-yellow-500/10',

    'text-yellow-700',

    'border',

    'border-yellow-500/20',

  ].join(' '),



  danger: [

    'bg-red-500/10',

    'text-red-600',

    'border',

    'border-red-500/20',

  ].join(' '),



  info: [

    'bg-blue-500/10',

    'text-blue-600',

    'border',

    'border-blue-500/20',

  ].join(' '),



  neutral: [

    'bg-gray-100',

    'text-gray-700',

    'border',

    'border-gray-200',

  ].join(' '),



  outline: [

    'bg-transparent',

    'text-[#0B1710]',

    'border',

    'border-gray-300',

  ].join(' '),

};


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<
  BadgeSize,
  string
> = {


  sm: [

    'px-2',

    'py-0.5',

    'text-[11px]',

  ].join(' '),



  md: [

    'px-2.5',

    'py-1',

    'text-xs',

  ].join(' '),



  lg: [

    'px-3',

    'py-1.5',

    'text-sm',

  ].join(' '),

};


// ============================================================================
// BADGE
// ============================================================================

export default function Badge({

  children,

  variant = 'neutral',

  size = 'md',

  icon,

  rounded = true,

  className = '',

}: BadgeProps) {


  return (

    <span

      className={[

        'inline-flex',

        'items-center',

        'gap-1.5',

        'font-medium',

        'leading-none',

        'transition-colors',

        variantStyles[variant],

        sizeStyles[size],

        rounded
          ? 'rounded-full'
          : 'rounded-md',

        className,

      ].join(' ')}

    >


      {icon && (

        <span
          className="shrink-0"
          aria-hidden="true"
        >

          {icon}

        </span>

      )}



      {children}


    </span>

  );

}
