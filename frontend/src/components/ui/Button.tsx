/**
 * ============================================================================
 * Layboka AI
 * Button Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Button.tsx
 *
 * Purpose:
 * - Shared button component
 * - Consistent UI across the entire application
 * - Supports loading, icons, variants and sizes
 *
 * ============================================================================
 */

'use client';

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'link';


export type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';


export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {

  /**
   * Visual button style.
   */
  variant?: ButtonVariant;

  /**
   * Button size.
   */
  size?: ButtonSize;

  /**
   * Shows loading spinner and disables the button.
   */
  loading?: boolean;

  /**
   * Optional text displayed while loading.
   */
  loadingText?: string;

  /**
   * Optional icon displayed before children.
   */
  leftIcon?: ReactNode;

  /**
   * Optional icon displayed after children.
   */
  rightIcon?: ReactNode;

  /**
   * Makes the button occupy the full available width.
   */
  fullWidth?: boolean;

  /**
   * Optional className for additional styling.
   */
  className?: string;

  /**
   * Button content.
   */
  children?: ReactNode;
}


// ============================================================================
// STYLE HELPERS
// ============================================================================

const baseStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'whitespace-nowrap',
  'rounded-xl',
  'font-medium',
  'transition-all',
  'duration-200',
  'select-none',
  'focus:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-offset-2',
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
].join(' ');


// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<ButtonVariant, string> = {

  primary: [
    'bg-[#FF3B2F]',
    'text-white',
    'shadow-sm',
    'hover:bg-[#e83228]',
    'hover:shadow-md',
    'active:scale-[0.98]',
    'focus-visible:ring-[#FF3B2F]',
  ].join(' '),


  secondary: [
  'bg-[#0B1710]',
  'text-white',
  'shadow-sm',
  'hover:bg-[#07100A]',
  'hover:shadow-md',
  'active:scale-[0.98]',
  'focus-visible:ring-[#0B1710]',
].join(' '),


  outline: [
    'border',
    'border-gray-200',
    'bg-white',
    'text-gray-900',
    'hover:border-gray-300',
    'hover:bg-gray-50',
    'active:scale-[0.98]',
    'focus-visible:ring-gray-300',
  ].join(' '),


  ghost: [
    'bg-transparent',
    'text-gray-700',
    'hover:bg-gray-100',
    'hover:text-gray-900',
    'active:scale-[0.98]',
    'focus-visible:ring-gray-300',
  ].join(' '),


  danger: [
    'bg-red-600',
    'text-white',
    'shadow-sm',
    'hover:bg-red-700',
    'hover:shadow-md',
    'active:scale-[0.98]',
    'focus-visible:ring-red-500',
  ].join(' '),


  success: [
    'bg-emerald-600',
    'text-white',
    'shadow-sm',
    'hover:bg-emerald-700',
    'hover:shadow-md',
    'active:scale-[0.98]',
    'focus-visible:ring-emerald-500',
  ].join(' '),


  link: [
    'bg-transparent',
    'p-0',
    'text-[#FF3B2F]',
    'hover:text-[#e83228]',
    'hover:underline',
    'rounded-none',
    'focus-visible:ring-[#FF3B2F]',
  ].join(' '),

};


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<ButtonSize, string> = {

  xs: [
    'min-h-8',
    'px-3',
    'text-xs',
  ].join(' '),


  sm: [
    'min-h-9',
    'px-3.5',
    'text-sm',
  ].join(' '),


  md: [
    'min-h-10',
    'px-4',
    'text-sm',
  ].join(' '),


  lg: [
    'min-h-11',
    'px-5',
    'text-base',
  ].join(' '),


  xl: [
    'min-h-12',
    'px-6',
    'text-base',
  ].join(' '),

};


// ============================================================================
// LOADING SPINNER
// ============================================================================

function LoadingSpinner() {

  return (
    <span
      aria-hidden="true"
      className={[
        'h-4',
        'w-4',
        'animate-spin',
        'rounded-full',
        'border-2',
        'border-current',
        'border-t-transparent',
      ].join(' ')}
    />
  );

}


// ============================================================================
// BUTTON
// ============================================================================

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      variant = 'primary',

      size = 'md',

      loading = false,

      loadingText,

      leftIcon,

      rightIcon,

      fullWidth = false,

      className = '',

      children,

      disabled,

      type = 'button',

      ...props
    },

    ref

  ) => {

    const isDisabled =
      disabled || loading;


    const classes = [

      baseStyles,

      variantStyles[variant],

      sizeStyles[variant === 'link' ? 'xs' : size],

      fullWidth
        ? 'w-full'
        : '',

      className,

    ]
      .filter(Boolean)
      .join(' ');


    return (

      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={classes}
        {...props}
      >

        {loading ? (

          <>

            <LoadingSpinner />

            {loadingText || children}

          </>

        ) : (

          <>

            {leftIcon && (
              <span
                className="shrink-0"
                aria-hidden="true"
              >
                {leftIcon}
              </span>
            )}


            {children}


            {rightIcon && (
              <span
                className="shrink-0"
                aria-hidden="true"
              >
                {rightIcon}
              </span>
            )}

          </>

        )}

      </button>

    );

  }
);


// ============================================================================
// DISPLAY NAME
// ============================================================================

Button.displayName = 'Button';


// ============================================================================
// EXPORT
// ============================================================================

export default Button;
