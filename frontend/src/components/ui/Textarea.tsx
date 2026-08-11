/**
 * ============================================================================
 * Layboka AI
 * Textarea Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Textarea.tsx
 *
 * Purpose:
 * - Shared textarea component
 * - Consistent forms across the application
 * - Supports labels, errors, hints, icons and character counts
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
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {

  /**
   * Textarea label.
   */
  label?: string;

  /**
   * Optional helper text displayed below the textarea.
   */
  hint?: string;

  /**
   * Validation error.
   */
  error?: string;

  /**
   * Optional icon displayed before the textarea.
   */
  leftIcon?: ReactNode;

  /**
   * Shows a loading state.
   */
  loading?: boolean;

  /**
   * Shows a character counter.
   */
  showCount?: boolean;

  /**
   * Makes the textarea occupy the full available width.
   */
  fullWidth?: boolean;

  /**
   * Additional wrapper class.
   */
  containerClassName?: string;

}


// ============================================================================
// TEXTAREA
// ============================================================================

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      id,

      label,

      hint,

      error,

      leftIcon,

      loading = false,

      showCount = false,

      fullWidth = true,

      disabled,

      className = '',

      containerClassName = '',

      required,

      maxLength,

      value,

      defaultValue,

      rows = 5,

      ...props
    },

    ref

  ) => {

    const generatedId = useId();

    const textareaId =
      id || `textarea-${generatedId}`;


    const hasError =
      Boolean(error);


    /*
     * Character count.
     *
     * This intentionally supports both controlled and uncontrolled
     * textareas without adding internal state.
     */
    const currentLength =
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : undefined;


    const textareaClasses = [

      'min-h-[120px]',

      'w-full',

      'resize-y',

      'rounded-xl',

      'border',

      'bg-white',

      'px-3.5',

      'py-3',

      'text-sm',

      'leading-6',

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
            htmlFor={textareaId}
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
        {/* TEXTAREA WRAPPER */}
        {/* ================================================================ */}

        <div className="relative">


          {/* LEFT ICON */}

          {leftIcon && (

            <span
              className={[
                'pointer-events-none',
                'absolute',
                'left-3.5',
                'top-4',
                'z-10',
                'text-gray-400',
              ].join(' ')}
              aria-hidden="true"
            >
              {leftIcon}
            </span>

          )}


          {/* TEXTAREA */}

          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled || loading}
            required={required}
            rows={rows}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : hint
                  ? `${textareaId}-hint`
                  : undefined
            }
            className={textareaClasses}
            {...props}
          />


          {/* ============================================================ */}
          {/* LOADING */}
          {/* ============================================================ */}

          {loading && (

            <span
              className={[
                'absolute',
                'right-3.5',
                'top-4',
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

        </div>


        {/* ================================================================ */}
        {/* FOOTER */}
        {/* ================================================================ */}

        {(error || hint || showCount) && (

          <div
            className={[
              'mt-1.5',
              'flex',
              'items-start',
              'justify-between',
              'gap-3',
            ].join(' ')}
          >

            {/* ERROR / HINT */}

            <div className="min-w-0">

              {error ? (

                <p
                  id={`${textareaId}-error`}
                  className={[
                    'text-xs',
                    'font-medium',
                    'text-red-600',
                  ].join(' ')}
                  role="alert"
                >
                  {error}
                </p>

              ) : hint ? (

                <p
                  id={`${textareaId}-hint`}
                  className={[
                    'text-xs',
                    'text-gray-500',
                  ].join(' ')}
                >
                  {hint}
                </p>

              ) : null}

            </div>


            {/* CHARACTER COUNT */}

            {showCount && maxLength && (

              <span
                className={[
                  'shrink-0',
                  'text-xs',
                  'text-gray-500',
                ].join(' ')}
                aria-live="polite"
              >
                {currentLength ?? 0}/{maxLength}
              </span>

            )}

          </div>

        )}

      </div>

    );

  }
);


// ============================================================================
// DISPLAY NAME
// ============================================================================

Textarea.displayName = 'Textarea';


// ============================================================================
// EXPORT
// ============================================================================

export default Textarea;
