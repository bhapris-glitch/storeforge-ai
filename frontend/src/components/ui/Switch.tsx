/**
 * ============================================================================
 * Layboka AI
 * Switch Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Switch.tsx
 *
 * Purpose:
 * - Shared toggle/switch component
 * - Used for settings, preferences and feature controls
 * - Supports labels, descriptions, errors and sizes
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
  type InputHTMLAttributes,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type SwitchSize =
  | 'sm'
  | 'md'
  | 'lg';


export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {

  /**
   * Switch label.
   */
  label?: ReactNode;

  /**
   * Supporting description.
   */
  description?: ReactNode;

  /**
   * Validation/error message.
   */
  error?: string;

  /**
   * Switch size.
   */
  size?: SwitchSize;

  /**
   * Places label on the left side.
   */
  labelPosition?: 'left' | 'right';

  /**
   * Additional wrapper class.
   */
  containerClassName?: string;

}


// ============================================================================
// SIZE CONFIG
// ============================================================================

const sizeStyles: Record<
  SwitchSize,
  {
    wrapper: string;
    toggle: string;
    circle: string;
    translate: string;
  }
> = {

  sm: {

    wrapper:
      'h-5 w-9',

    toggle:
      'h-4 w-4',

    circle:
      'left-0.5',

    translate:
      'translate-x-4',

  },


  md: {

    wrapper:
      'h-6 w-11',

    toggle:
      'h-5 w-5',

    circle:
      'left-0.5',

    translate:
      'translate-x-5',

  },


  lg: {

    wrapper:
      'h-7 w-14',

    toggle:
      'h-6 w-6',

    circle:
      'left-0.5',

    translate:
      'translate-x-7',

  },

};


// ============================================================================
// SWITCH
// ============================================================================

const Switch = forwardRef<
  HTMLInputElement,
  SwitchProps
>(
  (
    {
      id,

      label,

      description,

      error,

      size = 'md',

      labelPosition = 'right',

      checked,

      disabled,

      containerClassName = '',

      ...props
    },

    ref

  ) => {


    const switchId =
      id || 'switch';


    const styles =
      sizeStyles[size];


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
          htmlFor={switchId}
          className={[
            'flex',
            'items-center',
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
          {/* SWITCH */}
          {/* ============================================================ */}

          <span
            className={[
              'relative',
              'inline-flex',
              'shrink-0',
              'items-center',
              'rounded-full',
              'transition-all',
              'duration-200',

              checked
                ? [
                    'bg-[#FF3B2F]',
                    'shadow-sm',
                  ].join(' ')
                : [
                    'bg-gray-300',
                  ].join(' '),

            ].join(' ')}
            style={{
              width:
                size === 'sm'
                  ? '36px'
                  : size === 'lg'
                    ? '56px'
                    : '44px',

              height:
                size === 'sm'
                  ? '20px'
                  : size === 'lg'
                    ? '28px'
                    : '24px',
            }}
          >


            <input
              ref={ref}
              id={switchId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              className={[
                'absolute',
                'inset-0',
                'z-10',
                'h-full',
                'w-full',
                'cursor-pointer',
                'opacity-0',
              ].join(' ')}
              {...props}
            />


            <span
              className={[
                'absolute',
                'rounded-full',
                'bg-white',
                'shadow',
                'transition-transform',
                'duration-200',

                styles.circle,

                styles.toggle,

                checked
                  ? styles.translate
                  : '',

              ].join(' ')}
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

Switch.displayName = 'Switch';


// ============================================================================
// EXPORT
// ============================================================================

export default Switch;
