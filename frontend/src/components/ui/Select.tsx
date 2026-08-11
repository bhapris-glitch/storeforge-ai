/**
 * ============================================================================
 * Layboka AI
 * Select Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Select.tsx
 *
 * Purpose:
 * - Shared select/dropdown component
 * - Consistent forms across the application
 * - Supports labels, errors, hints, icons and loading states
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
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface SelectOption {

  value: string;

  label: string;

  disabled?: boolean;

}


export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {

  /**
   * Input label.
   */
  label?: string;

  /**
   * Available select options.
   */
  options?: SelectOption[];

  /**
   * Optional text displayed below the select.
   */
  hint?: string;

  /**
   * Validation error.
   */
  error?: string;

  /**
   * Optional icon displayed before the select.
   */
  leftIcon?: ReactNode;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Makes the select occupy the full available width.
   */
  fullWidth?: boolean;

  /**
   * Additional wrapper class.
   */
  containerClassName?: string;

}


// ============================================================================
// SELECT
// ============================================================================

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      id,

      label,

      options = [],

      hint,

      error,

      leftIcon,

      loading = false,

      fullWidth = true,

      disabled,

      className = '',

      containerClassName = '',

      required,

      children,

      ...props
    },

    ref

  ) => {

    const selectId =
      id ||
      (label
        ? `select-${label
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '')}`
        : undefined);


    const hasError =
      Boolean(error);


    const selectClasses = [

      'h-11',

      'w-full',

      'appearance-none',

      'rounded-xl',

      'border',

      'bg-white',

      'px-3.5',

      'pr-10',

      'text-sm',

      'text-[#0B1710]',

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
            htmlFor={selectId}
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
        {/* SELECT WRAPPER */}
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
                'z-10',
                'text-gray-400',
              ].join(' ')}
              aria-hidden="true"
            >
              {leftIcon}
            </span>

          )}


          {/* SELECT */}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled || loading}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${selectId}-error`
                : hint
                  ? `${selectId}-hint`
                  : undefined
            }
            className={selectClasses}
            {...props}
          >

            {children
              ? children
              : options.map(
                  (option) => (

                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>

                  )
                )}

          </select>


          {/* ============================================================ */}
          {/* DROPDOWN ICON */}
          {/* ============================================================ */}

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

            {loading ? (

              <span
                className={[
                  'block',
                  'h-4',
                  'w-4',
                  'animate-spin',
                  'rounded-full',
                  'border-2',
                  'border-gray-300',
                  'border-t-[#FF3B2F]',
                ].join(' ')}
              />

            ) : (

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>

            )}

          </span>

        </div>


        {/* ================================================================ */}
        {/* ERROR */}
        {/* ================================================================ */}

        {error && (

          <p
            id={`${selectId}-error`}
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
            id={`${selectId}-hint`}
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

Select.displayName = 'Select';


// ============================================================================
// EXPORT
// ============================================================================

export default Select;
