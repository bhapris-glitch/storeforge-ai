/**
 * ============================================================================
 * Layboka AI
 * Tooltip Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Tooltip.tsx
 *
 * Purpose:
 * - Shared tooltip component
 * - Icon explanations
 * - Dashboard helper information
 * - Feature hints
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
  useState,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type TooltipPosition =

  | 'top'
  | 'bottom'
  | 'left'
  | 'right';


export interface TooltipProps {

  /**
   * Element that triggers tooltip.
   */
  children: ReactNode;


  /**
   * Tooltip content.
   */
  content: ReactNode;


  /**
   * Tooltip position.
   */
  position?: TooltipPosition;


  /**
   * Delay before showing.
   */
  delay?: number;


  /**
   * Disable tooltip.
   */
  disabled?: boolean;


  /**
   * Additional class.
   */
  className?: string;

}


// ============================================================================
// POSITION STYLES
// ============================================================================

const positionStyles: Record<
  TooltipPosition,
  string
> = {

  top:
    'bottom-full left-1/2 -translate-x-1/2 mb-2',

  bottom:
    'top-full left-1/2 -translate-x-1/2 mt-2',

  left:
    'right-full top-1/2 -translate-y-1/2 mr-2',

  right:
    'left-full top-1/2 -translate-y-1/2 ml-2',

};


// ============================================================================
// ARROW POSITION
// ============================================================================

const arrowStyles: Record<
  TooltipPosition,
  string
> = {

  top:
    'top-full left-1/2 -translate-x-1/2 border-t-[#0B1710]',

  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-[#0B1710]',

  left:
    'left-full top-1/2 -translate-y-1/2 border-l-[#0B1710]',

  right:
    'right-full top-1/2 -translate-y-1/2 border-r-[#0B1710]',

};


// ============================================================================
// TOOLTIP
// ============================================================================

export default function Tooltip({

  children,

  content,

  position = 'top',

  delay = 300,

  disabled = false,

  className = '',

}: TooltipProps) {


  const [
    visible,
    setVisible,
  ] = useState(false);


  let timer:
    NodeJS.Timeout;



  function handleMouseEnter() {

    if (disabled) {
      return;
    }


    timer = setTimeout(
      () => {

        setVisible(true);

      },
      delay
    );

  }



  function handleMouseLeave() {

    clearTimeout(timer);

    setVisible(false);

  }



  if (disabled) {

    return (
      <>
        {children}
      </>
    );

  }



  return (

    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >


      {/* ================================================================ */}
      {/* TRIGGER */}
      {/* ================================================================ */}

      {children}



      {/* ================================================================ */}
      {/* TOOLTIP */}
      {/* ================================================================ */}

      {visible && (

        <div

          role="tooltip"

          className={[
            'absolute',
            'z-[100]',
            'max-w-xs',
            'rounded-lg',
            'bg-[#0B1710]',
            'px-3',
            'py-2',
            'text-xs',
            'font-medium',
            'text-white',
            'shadow-xl',
            'animate-in',
            'fade-in',
            'zoom-in-95',
            'duration-150',
            'whitespace-nowrap',
            positionStyles[position],
            className,
          ].join(' ')}

        >


          {content}



          {/* ============================================================ */}
          {/* ARROW */}
          {/* ============================================================ */}

          <span
            className={[
              'absolute',
              'h-0',
              'w-0',
              'border-[5px]',
              'border-transparent',
              arrowStyles[position],
            ].join(' ')}
          />


        </div>

      )}

    </div>

  );

}
