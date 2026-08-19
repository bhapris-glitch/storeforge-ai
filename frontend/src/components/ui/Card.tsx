/**
 * ============================================================================
 * Layboka AI
 * Card Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Card.tsx
 *
 * Purpose:
 * - Shared content container
 * - Dashboard statistics
 * - AI generation panels
 * - Product cards
 * - Settings sections
 * - Billing and analytics sections
 *
 * Design:
 * - Primary surface: #0B1710
 * - Deep surface: #07100A
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

export type CardVariant =
  | 'default'
  | 'dark'
  | 'glass'
  | 'outline'
  | 'accent';


export type CardPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg';


// FIXED: removed native HTML title collision
export interface CardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'title'
  > {

  /**
   * Card visual style.
   */
  variant?: CardVariant;


  /**
   * Card internal spacing.
   */
  padding?: CardPadding;


  /**
   * Makes the card interactive.
   */
  clickable?: boolean;


  /**
   * Optional card title.
   */
  title?: ReactNode;


  /**
   * Optional description.
   */
  description?: ReactNode;


  /**
   * Optional header action.
   */
  action?: ReactNode;


  /**
   * Optional footer.
   */
  footer?: ReactNode;


  /**
   * Card content.
   */
  children?: ReactNode;

}


// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<
  CardVariant,
  string
> = {

  default: [
    'border',
    'border-white/10',
    'bg-[#0B1710]',
    'text-white',
  ].join(' '),


  dark: [
    'border',
    'border-white/10',
    'bg-[#07100A]',
    'text-white',
  ].join(' '),


  glass: [
    'border',
    'border-white/10',
    'bg-[#0B1710]/70',
    'text-white',
    'backdrop-blur-xl',
  ].join(' '),


  outline: [
    'border',
    'border-[#0B1710]/15',
    'bg-transparent',
    'text-[#0B1710]',
  ].join(' '),


  accent: [
    'border',
    'border-[#FF3B2F]/25',
    'bg-[#FF3B2F]/5',
    'text-white',
  ].join(' '),

};


// ============================================================================
// PADDING
// ============================================================================

const paddingStyles: Record<
  CardPadding,
  string
> = {

  none:
    'p-0',

  sm:
    'p-3',

  md:
    'p-5',

  lg:
    'p-6 md:p-7',

};


// ============================================================================
// CARD
// ============================================================================

const Card = forwardRef<
  HTMLDivElement,
  CardProps
>(
  (
    {
      variant = 'default',

      padding = 'md',

      clickable = false,

      title,

      description,

      action,

      footer,

      children,

      className = '',

      ...props

    },

    ref

  ) => {


    const hasHeader =
      Boolean(
        title ||
        description ||
        action
      );


    return (

      <div

        ref={ref}

        className={[

          'overflow-hidden',

          'rounded-2xl',

          'shadow-sm',

          'transition-all',

          'duration-200',

          variantStyles[variant],

          clickable
            ? [
                'cursor-pointer',
                'hover:-translate-y-0.5',
                'hover:border-white/20',
                'hover:shadow-lg',
              ].join(' ')
            : '',

          className,

        ]
          .filter(Boolean)
          .join(' ')}

        {...props}

      >


        {/* HEADER */}

        {hasHeader && (

          <div

            className={[

              'flex',

              'items-start',

              'justify-between',

              'gap-4',

              'border-b',

              'border-white/10',

              padding === 'none'
                ? 'px-5 py-4'
                : paddingStyles[padding],

            ].join(' ')}

          >


            <div className="min-w-0">


              {title && (

                <h3

                  className={[

                    'text-base',

                    'font-semibold',

                    'tracking-tight',

                    variant === 'outline'
                      ? 'text-[#0B1710]'
                      : 'text-white',

                  ].join(' ')}

                >

                  {title}

                </h3>

              )}



              {description && (

                <p

                  className={[

                    'mt-1',

                    'text-sm',

                    'leading-5',

                    variant === 'outline'
                      ? 'text-[#0B1710]/55'
                      : 'text-white/55',

                  ].join(' ')}

                >

                  {description}

                </p>

              )}


            </div>



            {action && (

              <div className="shrink-0">

                {action}

              </div>

            )}


          </div>

        )}



        {/* CONTENT */}

        <div

          className={paddingStyles[padding]}

        >

          {children}

        </div>



        {/* FOOTER */}

        {footer && (

          <div

            className={[

              'border-t',

              'border-white/10',

              padding === 'none'
                ? 'px-5 py-4'
                : paddingStyles[padding],

            ].join(' ')}

          >

            {footer}

          </div>

        )}


      </div>

    );

  }

);


Card.displayName = 'Card';


// ============================================================================
// CARD HEADER
// ============================================================================

export interface CardHeaderProps
  extends HTMLAttributes<HTMLDivElement> {

  children: ReactNode;

}


export const CardHeader = forwardRef<
  HTMLDivElement,
  CardHeaderProps
>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => (

    <div
      ref={ref}
      className={[
        'flex',
        'items-start',
        'justify-between',
        'gap-4',
        className,
      ].join(' ')}
      {...props}
    >

      {children}

    </div>

  )
);


CardHeader.displayName = 'CardHeader';


// ============================================================================
// CARD TITLE
// ============================================================================

export interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {

  children: ReactNode;

}


export const CardTitle = forwardRef<
  HTMLHeadingElement,
  CardTitleProps
>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => (

    <h3

      ref={ref}

      className={[

        'text-base',

        'font-semibold',

        'tracking-tight',

        'text-white',

        className,

      ].join(' ')}

      {...props}

    >

      {children}

    </h3>

  )
);


CardTitle.displayName = 'CardTitle';


// ============================================================================
// CARD DESCRIPTION
// ============================================================================

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {

  children: ReactNode;

}


export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => (

    <p

      ref={ref}

      className={[

        'mt-1',

        'text-sm',

        'leading-5',

        'text-white/55',

        className,

      ].join(' ')}

      {...props}

    >

      {children}

    </p>

  )
);


CardDescription.displayName = 'CardDescription';


// ============================================================================
// CARD CONTENT
// ============================================================================

export interface CardContentProps
  extends HTMLAttributes<HTMLDivElement> {

  children: ReactNode;

}


export const CardContent = forwardRef<
  HTMLDivElement,
  CardContentProps
>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => (

    <div

      ref={ref}

      className={[

        'px-5',

        'py-5',

        className,

      ].join(' ')}

      {...props}

    >

      {children}

    </div>

  )
);


CardContent.displayName = 'CardContent';


// ============================================================================
// CARD FOOTER
// ============================================================================

export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement> {

  children: ReactNode;

}


export const CardFooter = forwardRef<
  HTMLDivElement,
  CardFooterProps
>(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => (

    <div

      ref={ref}

      className={[

        'flex',

        'items-center',

        'justify-between',

        'gap-3',

        'border-t',

        'border-white/10',

        'px-5',

        'py-4',

        className,

      ].join(' ')}

      {...props}

    >

      {children}

    </div>

  )
);


CardFooter.displayName = 'CardFooter';


// ============================================================================
// EXPORT
// ============================================================================

export default Card;
