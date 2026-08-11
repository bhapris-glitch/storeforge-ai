/**
 * ============================================================================
 * Layboka AI
 * Modal Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Modal.tsx
 *
 * Purpose:
 * - Shared modal/dialog component
 * - Used for confirmations, forms, previews and settings
 * - Accessible with keyboard and overlay controls
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
  Fragment,
  useEffect,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface ModalProps {

  /**
   * Controls modal visibility.
   */
  open: boolean;

  /**
   * Close callback.
   */
  onClose: () => void;

  /**
   * Modal title.
   */
  title?: string;

  /**
   * Optional description below title.
   */
  description?: string;

  /**
   * Modal content.
   */
  children: ReactNode;

  /**
   * Footer content.
   */
  footer?: ReactNode;

  /**
   * Modal size.
   */
  size?: ModalSize;

  /**
   * Close modal when clicking outside.
   */
  closeOnOverlayClick?: boolean;

  /**
   * Show close button.
   */
  showCloseButton?: boolean;

  /**
   * Additional class.
   */
  className?: string;

}


export type ModalSize =

  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<
  ModalSize,
  string
> = {

  sm:
    'max-w-md',

  md:
    'max-w-lg',

  lg:
    'max-w-2xl',

  xl:
    'max-w-4xl',

  full:
    'max-w-[95vw]',

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
// MODAL
// ============================================================================

export default function Modal({

  open,

  onClose,

  title,

  description,

  children,

  footer,

  size = 'md',

  closeOnOverlayClick = true,

  showCloseButton = true,

  className = '',

}: ModalProps) {


  // ========================================================================
  // ESCAPE KEY + BODY LOCK
  // ========================================================================

  useEffect(

    () => {

      if (!open) return;


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


      document.body.style.overflow =
        'hidden';


      return () => {

        document.removeEventListener(
          'keydown',
          handleEscape
        );


        document.body.style.overflow =
          '';

      };


    },

    [
      open,
      onClose,
    ]

  );


  if (!open) {
    return null;
  }


  return (

    <Fragment>


      {/* ================================================================ */}
      {/* OVERLAY */}
      {/* ================================================================ */}

      <div

        className={[
          'fixed',
          'inset-0',
          'z-50',
          'flex',
          'items-center',
          'justify-center',
          'bg-[#07100A]/70',
          'backdrop-blur-sm',
          'p-4',
        ].join(' ')}

        onMouseDown={() => {

          if (closeOnOverlayClick) {

            onClose();

          }

        }}

        role="presentation"

      >



        {/* ============================================================ */}
        {/* MODAL BOX */}
        {/* ============================================================ */}

        <div

          className={[
            'relative',
            'w-full',
            sizeStyles[size],
            'overflow-hidden',
            'rounded-2xl',
            'bg-white',
            'shadow-2xl',
            'animate-in',
            'fade-in',
            'zoom-in-95',
            'duration-200',
            className,
          ].join(' ')}

          role="dialog"

          aria-modal="true"

          aria-label={title}

          onMouseDown={(event) => {

            event.stopPropagation();

          }}

        >



          {/* ============================================================ */}
          {/* HEADER */}
          {/* ============================================================ */}

          {(title || showCloseButton) && (

            <div

              className={[
                'flex',
                'items-start',
                'justify-between',
                'gap-4',
                'border-b',
                'border-gray-100',
                'px-6',
                'py-5',
              ].join(' ')}

            >

              <div>

                {title && (

                  <h2

                    className={[
                      'text-lg',
                      'font-semibold',
                      'text-[#0B1710]',
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
                      'text-gray-500',
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
                    'rounded-lg',
                    'p-2',
                    'text-gray-400',
                    'transition',
                    'hover:bg-gray-100',
                    'hover:text-[#0B1710]',
                  ].join(' ')}

                  aria-label="Close modal"

                >

                  <CloseIcon />

                </button>

              )}

            </div>

          )}



          {/* ============================================================ */}
          {/* CONTENT */}
          {/* ============================================================ */}

          <div
            className={[
              'px-6',
              'py-5',
              'max-h-[70vh]',
              'overflow-y-auto',
            ].join(' ')}
          >

            {children}

          </div>



          {/* ============================================================ */}
          {/* FOOTER */}
          {/* ============================================================ */}

          {footer && (

            <div

              className={[
                'border-t',
                'border-gray-100',
                'px-6',
                'py-4',
              ].join(' ')}

            >

              {footer}

            </div>

          )}


        </div>


      </div>


    </Fragment>

  );

}
