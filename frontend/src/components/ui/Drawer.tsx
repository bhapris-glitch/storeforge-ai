/**
 * ============================================================================
 * Layboka AI
 * Drawer Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Drawer.tsx
 *
 * Purpose:
 * - Shared sliding drawer component
 * - Mobile navigation
 * - Filters
 * - Settings panels
 * - Shopify connection flows
 * - Responsive dashboard controls
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
  useEffect,
  useId,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type DrawerSide =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';


export type DrawerSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';


export interface DrawerProps {

  /**
   * Controls drawer visibility.
   */
  open: boolean;

  /**
   * Close callback.
   */
  onClose: () => void;

  /**
   * Drawer content.
   */
  children: ReactNode;

  /**
   * Optional title.
   */
  title?: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Optional footer.
   */
  footer?: ReactNode;

  /**
   * Drawer opening direction.
   */
  side?: DrawerSide;

  /**
   * Drawer size.
   */
  size?: DrawerSize;

  /**
   * Close when clicking overlay.
   */
  closeOnOverlayClick?: boolean;

  /**
   * Show close button.
   */
  showCloseButton?: boolean;

  /**
   * Additional drawer class.
   */
  className?: string;

  /**
   * Optional content class.
   */
  contentClassName?: string;

}


// ============================================================================
// SIZE STYLES
// ============================================================================

const horizontalSizes: Record<
  DrawerSize,
  string
> = {

  sm: 'w-full sm:w-80',

  md: 'w-full sm:w-96',

  lg: 'w-full sm:w-[480px]',

  xl: 'w-full sm:w-[640px]',

  full: 'w-full',

};


const verticalSizes: Record<
  DrawerSize,
  string
> = {

  sm: 'h-64',

  md: 'h-80',

  lg: 'h-[480px]',

  xl: 'h-[640px]',

  full: 'h-full',

};


// ============================================================================
// CLOSE ICON
// ============================================================================

function CloseIcon() {

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

      <path d="M18 6L6 18" />

      <path d="M6 6L18 18" />

    </svg>

  );

}


// ============================================================================
// DRAWER
// ============================================================================

export default function Drawer({

  open,

  onClose,

  children,

  title,

  description,

  footer,

  side = 'right',

  size = 'md',

  closeOnOverlayClick = true,

  showCloseButton = true,

  className = '',

  contentClassName = '',

}: DrawerProps) {


  const titleId =
    useId();


  // ========================================================================
  // KEYBOARD + BODY LOCK
  // ========================================================================

  useEffect(() => {

    if (!open) {
      return;
    }


    const handleEscape =
      (event: KeyboardEvent) => {

        if (event.key === 'Escape') {

          onClose();

        }

      };


    document.addEventListener(
      'keydown',
      handleEscape
    );


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      'hidden';


    return () => {

      document.removeEventListener(
        'keydown',
        handleEscape
      );


      document.body.style.overflow =
        previousOverflow;

    };

  }, [
    open,
    onClose,
  ]);


  // ========================================================================
  // POSITION / SIZE
  // ========================================================================

  const isHorizontal =
    side === 'left' ||
    side === 'right';


  const positionClasses = {

    left: [
      'left-0',
      'top-0',
      'h-full',
      horizontalSizes[size],
      'border-r',
      'border-white/10',
    ].join(' '),


    right: [
      'right-0',
      'top-0',
      'h-full',
      horizontalSizes[size],
      'border-l',
      'border-white/10',
    ].join(' '),


    top: [
      'left-0',
      'top-0',
      'w-full',
      verticalSizes[size],
      'border-b',
      'border-white/10',
    ].join(' '),


    bottom: [
      'left-0',
      'bottom-0',
      'w-full',
      verticalSizes[size],
      'border-t',
      'border-white/10',
    ].join(' '),

  };


  const closedTransformClasses = {

    left:
      '-translate-x-full',

    right:
      'translate-x-full',

    top:
      '-translate-y-full',

    bottom:
      'translate-y-full',

  };


  if (!open) {
    return null;
  }


  return (

    <div
      className="fixed inset-0 z-[60]"
      aria-hidden={!open}
    >


      {/* ================================================================ */}
      {/* OVERLAY */}
      {/* ================================================================ */}

      <div
        className={[
          'absolute',
          'inset-0',
          'bg-[#07100A]/70',
          'backdrop-blur-sm',
          'animate-in',
          'fade-in',
          'duration-200',
        ].join(' ')}
        onMouseDown={() => {

          if (closeOnOverlayClick) {

            onClose();

          }

        }}
      />


      {/* ================================================================ */}
      {/* DRAWER */}
      {/* ================================================================ */}

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title
            ? titleId
            : undefined
        }
        className={[
          'absolute',
          'flex',
          'flex-col',
          'overflow-hidden',
          'bg-[#0B1710]',
          'text-white',
          'shadow-2xl',
          'transition-transform',
          'duration-300',
          'ease-out',
          positionClasses[side],
          className,
        ].join(' ')}
        onMouseDown={(event) => {

          event.stopPropagation();

        }}
      >


        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}

        {(title || description || showCloseButton) && (

          <header
            className={[
              'shrink-0',
              'border-b',
              'border-white/10',
              'px-5',
              'py-4',
            ].join(' ')}
          >

            <div
              className={[
                'flex',
                'items-start',
                'justify-between',
                'gap-4',
              ].join(' ')}
            >

              <div className="min-w-0">

                {title && (

                  <h2
                    id={titleId}
                    className={[
                      'text-base',
                      'font-semibold',
                      'tracking-tight',
                      'text-white',
                    ].join(' ')}
                  >
                    {title}
                  </h2>

                )}

                {description && (

                  <p
                    className={[
                      'mt-1',
                      'text-sm',
                      'leading-5',
                      'text-white/55',
                    ].join(' ')}
                  >
                    {description}
                  </p>

                )}

              </div>


              {showCloseButton && (

                <button
                  type="button"
                  onClick={onClose}
                  className={[
                    'shrink-0',
                    'rounded-lg',
                    'p-2',
                    'text-white/55',
                    'transition-colors',
                    'hover:bg-white/10',
                    'hover:text-white',
                    'focus:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-[#FF3B2F]',
                  ].join(' ')}
                  aria-label="Close drawer"
                >
                  <CloseIcon />
                </button>

              )}

            </div>

          </header>

        )}


        {/* ============================================================ */}
        {/* CONTENT */}
        {/* ============================================================ */}

        <div
          className={[
            'min-h-0',
            'flex-1',
            'overflow-y-auto',
            'overscroll-contain',
            contentClassName,
          ].join(' ')}
        >

          {children}

        </div>


        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}

        {footer && (

          <footer
            className={[
              'shrink-0',
              'border-t',
              'border-white/10',
              'bg-[#07100A]/50',
              'px-5',
              'py-4',
            ].join(' ')}
          >

            {footer}

          </footer>

        )}

      </aside>

    </div>

  );

}
