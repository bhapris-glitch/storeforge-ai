/**
 * ============================================================================
 * Layboka AI
 * Avatar Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Avatar.tsx
 *
 * Purpose:
 * - User avatars
 * - Team members
 * - Store owners
 * - AI profile/avatar
 * - Dashboard account menus
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
  useMemo,
  useState,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export type AvatarSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';


export type AvatarStatus =
  | 'online'
  | 'offline'
  | 'away'
  | 'busy';


export interface AvatarProps {

  /**
   * Image URL.
   */
  src?: string;

  /**
   * Alternative text.
   */
  alt?: string;

  /**
   * Name used to generate initials.
   */
  name?: string;

  /**
   * Explicit initials.
   */
  initials?: string;

  /**
   * Avatar size.
   */
  size?: AvatarSize;

  /**
   * Online/status indicator.
   */
  status?: AvatarStatus;

  /**
   * Optional custom fallback.
   */
  fallback?: ReactNode;

  /**
   * Optional badge displayed in the bottom-right.
   */
  badge?: ReactNode;

  /**
   * Additional classes.
   */
  className?: string;
}


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<
  AvatarSize,
  {
    wrapper: string;
    text: string;
    status: string;
  }
> = {

  xs: {
    wrapper: 'h-6 w-6',
    text: 'text-[9px]',
    status: 'h-1.5 w-1.5 border',
  },

  sm: {
    wrapper: 'h-8 w-8',
    text: 'text-[11px]',
    status: 'h-2 w-2 border',
  },

  md: {
    wrapper: 'h-10 w-10',
    text: 'text-xs',
    status: 'h-2.5 w-2.5 border-2',
  },

  lg: {
    wrapper: 'h-12 w-12',
    text: 'text-sm',
    status: 'h-3 w-3 border-2',
  },

  xl: {
    wrapper: 'h-16 w-16',
    text: 'text-base',
    status: 'h-3.5 w-3.5 border-2',
  },

  '2xl': {
    wrapper: 'h-24 w-24',
    text: 'text-2xl',
    status: 'h-5 w-5 border-2',
  },

};


// ============================================================================
// STATUS COLORS
// ============================================================================

const statusStyles: Record<
  AvatarStatus,
  string
> = {

  online:
    'bg-emerald-500',

  offline:
    'bg-gray-400',

  away:
    'bg-yellow-400',

  busy:
    'bg-red-500',

};


// ============================================================================
// INITIALS
// ============================================================================

function getInitials(
  name?: string,
  explicitInitials?: string
): string {

  if (explicitInitials) {

    return explicitInitials
      .slice(0, 2)
      .toUpperCase();

  }


  if (!name) {

    return 'L';

  }


  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (words.length === 1) {

    return words[0]
      .slice(0, 2)
      .toUpperCase();

  }


  return (

    words[0][0] +
    words[words.length - 1][0]

  ).toUpperCase();

}


// ============================================================================
// AVATAR
// ============================================================================

export default function Avatar({

  src,

  alt,

  name,

  initials,

  size = 'md',

  status,

  fallback,

  badge,

  className = '',

}: AvatarProps) {


  const [
    imageError,
    setImageError,
  ] = useState(false);


  const styles =
    sizeStyles[size];


  const generatedInitials =
    useMemo(
      () =>
        getInitials(
          name,
          initials
        ),
      [
        name,
        initials,
      ]
    );


  const shouldShowImage =
    Boolean(src) &&
    !imageError;


  return (

    <div
      className={[
        'relative',
        'inline-flex',
        'shrink-0',
        styles.wrapper,
        className,
      ].join(' ')}
    >


      {/* ================================================================ */}
      {/* AVATAR */}
      {/* ================================================================ */}

      <div
        className={[
          'flex',
          'h-full',
          'w-full',
          'items-center',
          'justify-center',
          'overflow-hidden',
          'rounded-full',
          'ring-1',
          'ring-black/5',
        ].join(' ')}
      >


        {shouldShowImage ? (

          <img
            src={src}
            alt={
              alt ||
              name ||
              'Avatar'
            }
            className={[
              'h-full',
              'w-full',
              'object-cover',
            ].join(' ')}
            onError={() =>
              setImageError(true)
            }
          />

        ) : fallback ? (

          <div
            className={[
              'flex',
              'h-full',
              'w-full',
              'items-center',
              'justify-center',
              'bg-[#0B1710]',
              'text-white',
            ].join(' ')}
          >
            {fallback}
          </div>

        ) : (

          <div
            className={[
              'flex',
              'h-full',
              'w-full',
              'items-center',
              'justify-center',
              'bg-[#0B1710]',
              'font-semibold',
              'text-white',
              styles.text,
            ].join(' ')}
            aria-label={
              name ||
              'Avatar'
            }
          >

            {generatedInitials}

          </div>

        )}

      </div>


      {/* ================================================================ */}
      {/* STATUS */}
      {/* ================================================================ */}

      {status && (

        <span
          className={[
            'absolute',
            'bottom-0',
            'right-0',
            'rounded-full',
            'border-white',
            statusStyles[status],
            styles.status,
          ].join(' ')}
          aria-label={status}
        />

      )}


      {/* ================================================================ */}
      {/* BADGE */}
      {/* ================================================================ */}

      {badge && (

        <span
          className={[
            'absolute',
            '-right-1',
            '-top-1',
            'z-10',
          ].join(' ')}
        >
          {badge}
        </span>

      )}

    </div>

  );

}
