/**
 * ============================================================================
 * Layboka AI
 * Alert Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Alert.tsx
 *
 * Purpose:
 * - Success, warning, error and information messages
 * - Shopify connection notifications
 * - Billing/subscription notices
 * - AI generation status messages
 * - Dashboard system alerts
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
  type HTMLAttributes,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type AlertVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'primary';


export interface AlertProps
  extends HTMLAttributes<HTMLDivElement> {

  /**
   * Alert visual variant.
   */
  variant?: AlertVariant;

  /**
   * Optional alert title.
   */
  title?: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Optional dismiss button.
   */
  dismissible?: boolean;

  /**
   * Dismiss callback.
   */
  onDismiss?: () => void;

  /**
   * Alert content.
   */
  children: ReactNode;

}


// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    title: string;
    text: string;
  }
> = {

  success: {
    container: [
      'border-emerald-500/20',
      'bg-emerald-500/10',
    ].join(' '),

    icon: 'text-emerald-400',

    title: 'text-emerald-300',

    text: 'text-emerald-100/70',
  },


  warning: {
    container: [
      'border-yellow-500/20',
      'bg-yellow-500/10',
    ].join(' '),

    icon: 'text-yellow-400',

    title: 'text-yellow-300',

    text: 'text-yellow-100/70',
  },


  danger: {
    container: [
      'border-red-500/20',
      'bg-red-500/10',
    ].join(' '),

    icon: 'text-red-400',

    title: 'text-red-300',

    text: 'text-red-100/70',
  },


  info: {
    container: [
      'border-blue-500/20',
      'bg-blue-500/10',
    ].join(' '),

    icon: 'text-blue-400',

    title: 'text-blue-300',

    text: 'text-blue-100/70',
  },


  primary: {
    container: [
      'border-[#FF3B2F]/20',
      'bg-[#FF3B2F]/10',
    ].join(' '),

    icon: 'text-[#FF6A60]',

    title: 'text-[#FF8B83]',

    text: 'text-white/60',
  },

};


// ============================================================================
// DEFAULT ICONS
// ============================================================================

function SuccessIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>

  );

}


function WarningIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.8 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>

  );

}


function DangerIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 8v4" />

      <path d="M12 16h.01" />
    </svg>

  );

}


function InfoIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 11v5" />

      <path d="M12 8h.01" />
    </svg>

  );

}


function PrimaryIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M3 12h18" />
    </svg>

  );

}


function CloseIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>

  );

}


// ============================================================================
// DEFAULT ICON
// ============================================================================

function getDefaultIcon(
  variant: AlertVariant
): ReactNode {

  switch (variant) {

    case 'success':
      return <SuccessIcon />;

    case 'warning':
      return <WarningIcon />;

    case 'danger':
      return <DangerIcon />;

    case 'info':
      return <InfoIcon />;

    case 'primary':
      return <PrimaryIcon />;

    default:
      return <InfoIcon />;

  }

}


// ============================================================================
// ALERT
// ============================================================================

const Alert = forwardRef<
  HTMLDivElement,
  AlertProps
>(
  (
    {
      variant = 'info',

      title,

      icon,

      dismissible = false,

      onDismiss,

      children,

      className = '',

      ...props

    },
    ref
  ) => {

    const styles =
      variantStyles[variant];


    return (

      <div

        ref={ref}

        role={
          variant === 'danger'
            ? 'alert'
            : 'status'
        }

        className={[
          'flex',
          'w-full',
          'gap-3',
          'rounded-xl',
          'border',
          'px-4',
          'py-3.5',
          'shadow-sm',
          styles.container,
          className,
        ].join(' ')}

        {...props}

      >

        {/* ================================================================ */}
        {/* ICON */}
        {/* ================================================================ */}

        <div
          className={[
            'mt-0.5',
            'shrink-0',
            styles.icon,
          ].join(' ')}
        >

          {icon || getDefaultIcon(variant)}

        </div>


        {/* ================================================================ */}
        {/* CONTENT */}
        {/* ================================================================ */}

        <div
          className="min-w-0 flex-1"
        >

          {title && (

            <div
              className={[
                'text-sm',
                'font-semibold',
                styles.title,
              ].join(' ')}
            >

              {title}

            </div>

          )}


          <div
            className={[
              title
                ? 'mt-1'
                : '',
              'text-sm',
              'leading-5',
              styles.text,
            ].filter(Boolean).join(' ')}
          >

            {children}

          </div>

        </div>


        {/* ================================================================ */}
        {/* DISMISS */}
        {/* ================================================================ */}

        {dismissible && (

          <button

            type="button"

            onClick={onDismiss}

            className={[
              'mt-0.5',
              'shrink-0',
              'rounded-lg',
              'p-1',
              styles.icon,
              'transition-colors',
              'hover:bg-white/10',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[#FF3B2F]',
            ].join(' ')}

            aria-label="Dismiss alert"

          >

            <CloseIcon />

          </button>

        )}

      </div>

    );

  }
);


// ============================================================================
// DISPLAY NAME
// ============================================================================

Alert.displayName = 'Alert';


// ============================================================================
// EXPORT
// ============================================================================

export default Alert;
