/**
 * ============================================================================
 * Layboka AI
 * Checkbox Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Checkbox.tsx
 *
 * Purpose:
 * - Shared checkbox component
 * - Used in forms, settings, permissions and preferences
 * - Supports label, description, error and indeterminate state
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
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {

  /**
   * Checkbox label.
   */
  label?: ReactNode;

  /**
   * Supporting description text.
   */
  description?: ReactNode;

  /**
   * Validation error.
   */
  error?: string;

  /**
   * Indeterminate checkbox state.
   */
  indeterminate?: boolean;

  /**
   * Checkbox position.
   */
  labelPosition?: 'left' | 'right';

  /**
   * Additional wrapper class.
   */
  containerClassName?: string;

}


// ============================================================================
// CHECK ICON
// ============================================================================

function CheckIcon() {

  return (

    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >

      <path
        d="M2 6.2L4.6 8.7L10 3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

    </svg>

  );

}


// ============================================================================
// MINUS ICON
// ============================================================================

function MinusIcon() {

  return (

    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >

      <path
        d="M2.5 6H9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

    </svg>

  );

}


// ============================================================================
// CHECKBOX
// ============================================================================

const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(
  (
    {
      id,

      label,

      description,

      error,

      indeterminate = false,

      labelPosition = 'right',

      checked,

      disabled,

      className = '',

      containerClassName = '',

      ...props
    },

    ref

  ) => {


    const checkboxId =
      id ||
      'checkbox';


    return (

      <div
        className={[
          'space-y-1',
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >

        <label
          htmlFor={checkboxId}
          className={[
            'flex',
            'items-start',
            'gap-3',
            'cursor-pointer',
            disabled
              ? 'cursor-not-allowed opacity-60'
              : '',
            labelPosition === 'left'
              ? 'flex-row-reverse justify-between'
              : '',
          ].join(' ')}
        >


          {/* ============================================================ */}
          {/* CHECKBOX */}
          {/* ============================================================ */}

          <span
            className={[
              'relative',
              'mt-0.5',
              'flex',
              'h-5',
              'w-5',
              'shrink-0',
              'items-center',
              'justify-center',
              'rounded-md',
              'border',
              'transition-all',
              'duration-200',

              checked || indeterminate
                ? [
                    'border-[#FF3B2F]',
                    'bg-[#FF3B2F]',
                  ].join(' ')
                : [
                    'border-gray-300',
                    'bg-white',
                    'hover:border-[#FF3B2F]',
                  ].join(' '),

            ].join(' ')}
          >

            {checked && !indeterminate && (
              <CheckIcon />
            )}

            {indeterminate && (
              <MinusIcon />
            )}


            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              className={[
                'absolute',
                'inset-0',
                'h-full',
                'w-full',
                'cursor-pointer',
                'opacity-0',
              ].join(' ')}
              {...props}
            />

          </span>


          {/* ============================================================ */}
          {/* CONTENT */}
          {/* ============================================================ */}

          {(label || description) && (

            <span
              className="flex-1"
            >

              {label && (

                <span
                  className={[
                    'block',
                    'text-sm',
                    'font-medium',
                    'text-[#0B1710]',
                  ].join(' ')}
                >
                  {label}
                </span>

              )}


              {description && (

                <span
                  className={[
                    'mt-0.5',
                    'block',
                    'text-xs',
                    'text-gray-500',
                  ].join(' ')}
                >
                  {description}
                </span>

              )}

            </span>

          )}

        </label>


        {/* ================================================================ */}
        {/* ERROR */}
        {/* ================================================================ */}

        {error && (

          <p
            className={[
              'text-xs',
              'font-medium',
              'text-red-600',
              'ml-8',
            ].join(' ')}
            role="alert"
          >
            {error}
          </p>

        )}

      </div>

    );

  }
);


// ============================================================================
// DISPLAY NAME
// ============================================================================

Checkbox.displayName = 'Checkbox';


// ============================================================================
// EXPORT
// ============================================================================

export default Checkbox;
