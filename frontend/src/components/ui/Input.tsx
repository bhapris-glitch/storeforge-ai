/**
 * ============================================================================
 * Layboka AI
 * Input Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Input.tsx
 *
 * Purpose:
 * - Shared text input component
 * - Consistent forms across the application
 * - Supports labels, errors, hints, icons and loading states
 *
 * ============================================================================
 */

'use client';

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {

  /**
   * Input label.
   */
  label?: string;

  /**
   * Optional text displayed below the input.
   */
  hint?: string;

  /**
   * Validation error.
   */
  error?: string;

  /**
   * Icon displayed before the input.
   */
  leftIcon?: ReactNode;

  /**
   * Icon displayed after the input.
   */
  rightIcon?: ReactNode;

  /**
   * Makes the input occupy the full available width.
   */
  fullWidth?: boolean;

  /**
   * Shows a loading indicator.
   */
  loading?: boolean;

  /**
   * Additional wrapper class.
   */
  containerClassName?: string;

}


// ============================================================================
// INPUT
// ============================================================================

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      id,

      label,

      hint,

      error,

      leftIcon,

      rightIcon,

      fullWidth = true,

      loading = false,

      disabled,

      className = '',

      containerClassName = '',

      required,

      ...props
    },

    ref

  ) => {

    const inputId =
      id ||
      (label
        ? `input-${label
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '')}`
        : undefined);


    const hasError =
      Boolean(error);


    const inputClasses = [

      'h-11',

      'w-full',

      'rounded-xl',

      'border',

      'bg-white',

      'px-3.5',

      'text-sm',

      'text-[#0B1710]',

      'placeholder:text-gray-400',

      'outline-none',

      'transition-all',

      'duration-200',

      'focus:ring-2',

      'disabled:cursor-not-allowed',

      'disabled:bg-gray-50',

      'disabled:text-gray-400',

      'disabled:opacity-70',

      leftIcon
        ? 'pl-10'
        : '',

      rightIcon || loading
        ? 'pr-10'
        : '',

      hasError
        ? [
            'border-red-500',
            'focus:border-red-500',
            'focus:ring-red-500/20',
          ].join(' ')
        : [
            'border-gray-200',
            'hover:border-gray-300',
            'focus:border-[#FF3B2F]',
            'focus:ring-[#FF3B2F]/20',
          ].join(' '),

      className,

    ]
      .filter(Boolean)
      .join(' ');


    return (

      <div
        className={[
          fullWidth
            ? 'w-full'
            : '',

          containerClassName,

        ]
          .filter(Boolean)
          .join(' ')}
      >

        {/* ================================================================ */}
        {/* LABEL */}
        {/* ================================================================ */}

        {label && (

          <label
            htmlFor={inputId}
            className={[
              'mb-1.5',
              'block',
              'text-sm',
              'font-medium',
              'text-[#0B1710]',
            ].join(' ')}
          >

            {label}

            {required && (

              <span
                className="ml-1 text-[#FF3B2F]"
                aria-hidden="true"
              >
                *
              </span>

            )}

          </label>

        )}


        {/* ================================================================ */}
        {/* INPUT WRAPPER */}
        {/* ================================================================ */}

        <div className="relative">

          {/* LEFT ICON */}

          {leftIcon && (

            <span
              className={[
                'pointer-events-none',
                'absolute',
                'left-3.5',
                'top-1/2',
                '-translate-y-1/2',
                'text-gray-400',
              ].join(' ')}
              aria-hidden="true"
            >
              {leftIcon}
            </span>

          )}


          {/* INPUT */}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled || loading}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            className={inputClasses}
            {...props}
          />


          {/* LOADING */}

          {loading && (

            <span
              className={[
                'absolute',
                'right-3.5',
                'top-1/2',
                '-translate-y-1/2',
                'h-4',
                'w-4',
                'animate-spin',
                'rounded-full',
                'border-2',
                'border-gray-300',
                'border-t-[#FF3B2F]',
              ].join(' ')}
              aria-label="Loading"
            />

          )}


          {/* RIGHT ICON */}

          {!loading && rightIcon && (

            <span
              className={[
                'pointer-events-none',
                'absolute',
                'right-3.5',
                'top-1/2',
                '-translate-y-1/2',
                'text-gray-400',
              ].join(' ')}
              aria-hidden="true"
            >
              {rightIcon}
            </span>

          )}

        </div>


        {/* ================================================================ */}
        {/* ERROR */}
        {/* ================================================================ */}

        {error && (

          <p
            id={`${inputId}-error`}
            className={[
              'mt-1.5',
              'text-xs',
              'font-medium',
              'text-red-600',
            ].join(' ')}
            role="alert"
          >
            {error}
          </p>

        )}


        {/* ================================================================ */}
        {/* HINT */}
        {/* ================================================================ */}

        {!error && hint && (

          <p
            id={`${inputId}-hint`}
            className={[
              'mt-1.5',
              'text-xs',
              'text-gray-500',
            ].join(' ')}
          >
            {hint}
          </p>

        )}

      </div>

    );

  }
);


// ============================================================================
// DISPLAY NAME
// ============================================================================

Input.displayName = 'Input';


// ============================================================================
// EXPORT
// ============================================================================

export default Input;
