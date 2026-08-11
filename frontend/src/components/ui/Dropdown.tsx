/**
 * ============================================================================
 * Layboka AI
 * Dropdown Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Dropdown.tsx
 *
 * Purpose:
 * - Shared dropdown/menu component
 * - User profile menus
 * - Actions menus
 * - Store switcher menus
 * - Dashboard controls
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
  useRef,
  useState,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface DropdownItem {

  id: string;

  label: string;

  icon?: ReactNode;

  description?: string;

  danger?: boolean;

  disabled?: boolean;

  onClick?: () => void;

}


export interface DropdownProps {

  /**
   * Trigger element.
   */
  trigger: ReactNode;


  /**
   * Dropdown items.
   */
  items?: DropdownItem[];


  /**
   * Custom content.
   */
  children?: ReactNode;


  /**
   * Dropdown position.
   */
  placement?:
    | 'bottom-start'
    | 'bottom-end'
    | 'top-start'
    | 'top-end';


  /**
   * Dropdown width.
   */
  width?:
    | 'sm'
    | 'md'
    | 'lg';


  /**
   * Close after selecting item.
   */
  closeOnSelect?: boolean;


  /**
   * Additional class.
   */
  className?: string;

}


// ============================================================================
// WIDTH
// ============================================================================

const widthStyles = {

  sm:
    'w-40',

  md:
    'w-56',

  lg:
    'w-72',

};


// ============================================================================
// PLACEMENT
// ============================================================================

const placementStyles = {

  'bottom-start':
    'left-0 top-full mt-2',

  'bottom-end':
    'right-0 top-full mt-2',

  'top-start':
    'bottom-full left-0 mb-2',

  'top-end':
    'bottom-full right-0 mb-2',

};


// ============================================================================
// CHEVRON ICON
// ============================================================================

function ChevronIcon() {

  return (

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

  );

}


// ============================================================================
// DROPDOWN
// ============================================================================

export default function Dropdown({

  trigger,

  items = [],

  children,

  placement = 'bottom-end',

  width = 'md',

  closeOnSelect = true,

  className = '',

}: DropdownProps) {


  const [
    open,
    setOpen,
  ] = useState(false);


  const dropdownRef =
    useRef<HTMLDivElement>(null);



  // ========================================================================
  // OUTSIDE CLICK
  // ========================================================================

  useEffect(() => {


    const handleClick =
      (event: MouseEvent) => {

        if (

          dropdownRef.current &&

          !dropdownRef.current.contains(
            event.target as Node
          )

        ) {

          setOpen(false);

        }

      };


    document.addEventListener(
      'mousedown',
      handleClick
    );


    return () => {

      document.removeEventListener(
        'mousedown',
        handleClick
      );

    };


  }, []);



  // ========================================================================
  // ESC KEY
  // ========================================================================

  useEffect(() => {


    const handleEscape =
      (event: KeyboardEvent) => {

        if (
          event.key === 'Escape'
        ) {

          setOpen(false);

        }

      };


    document.addEventListener(
      'keydown',
      handleEscape
    );


    return () => {

      document.removeEventListener(
        'keydown',
        handleEscape
      );

    };


  }, []);



  return (

    <div
      ref={dropdownRef}
      className="relative inline-flex"
    >


      {/* ================================================================ */}
      {/* TRIGGER */}
      {/* ================================================================ */}

      <button

        type="button"

        onClick={() =>
          setOpen(
            (previous) => !previous
          )
        }

        className={[
          'inline-flex',
          'items-center',
          'gap-2',
        ].join(' ')}

        aria-expanded={open}

      >

        {trigger}

      </button>



      {/* ================================================================ */}
      {/* MENU */}
      {/* ================================================================ */}

      {open && (

        <div

          className={[
            'absolute',
            'z-50',
            placementStyles[placement],
            widthStyles[width],
            'overflow-hidden',
            'rounded-xl',
            'border',
            'border-white/10',
            'bg-[#0B1710]',
            'p-1.5',
            'shadow-2xl',
            'animate-in',
            'fade-in',
            'zoom-in-95',
            'duration-150',
            className,
          ].join(' ')}

          role="menu"

        >


          {items.length > 0 && (

            <div>

              {items.map(
                (item) => (

                  <button

                    key={item.id}

                    type="button"

                    disabled={
                      item.disabled
                    }

                    onClick={() => {

                      item.onClick?.();

                      if (
                        closeOnSelect
                      ) {

                        setOpen(false);

                      }

                    }}

                    className={[
                      'flex',
                      'w-full',
                      'items-center',
                      'gap-3',
                      'rounded-lg',
                      'px-3',
                      'py-2.5',
                      'text-left',
                      'transition-colors',

                      item.disabled
                        ? [
                            'cursor-not-allowed',
                            'opacity-50',
                          ].join(' ')
                        : '',

                      item.danger
                        ? [
                            'text-red-400',
                            'hover:bg-red-500/10',
                          ].join(' ')
                        : [
                            'text-white',
                            'hover:bg-white/10',
                          ].join(' '),

                    ]
                      .filter(Boolean)
                      .join(' ')}

                  >


                    {item.icon && (

                      <span
                        className="shrink-0 text-white/60"
                      >
                        {item.icon}
                      </span>

                    )}



                    <span
                      className="min-w-0"
                    >

                      <span
                        className="block text-sm font-medium"
                      >
                        {item.label}
                      </span>


                      {item.description && (

                        <span
                          className={[
                            'mt-0.5',
                            'block',
                            'text-xs',
                            'text-white/50',
                          ].join(' ')}
                        >

                          {item.description}

                        </span>

                      )}

                    </span>


                  </button>

                )

              )}

            </div>

          )}


          {children}

        </div>

      )}

    </div>

  );

}
