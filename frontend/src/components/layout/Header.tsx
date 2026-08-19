/**
 * ============================================================================
 * Layboka AI
 * Header Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/layout/Header.tsx
 *
 * Purpose:
 * - Dashboard top navigation
 * - Mobile sidebar trigger
 * - Page title area
 * - Notifications
 * - User profile menu
 *
 * Design:
 * - Near-black green: #0B1710
 * - Deep background: #07100A
 * - Brand accent: #FF3B2F
 *
 * ============================================================================
 */

'use client';

import {
  useState,
  type ReactNode,
} from 'react';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Dropdown from '@/components/ui/Dropdown';

import { DropdownItem } from '@/components/ui/Dropdown';
// ============================================================================
// TYPES
// ============================================================================

export interface HeaderProps {

  /**
   * Current page title.
   */
  title?: string;


  /**
   * Optional page description.
   */
  description?: string;


  /**
   * Mobile menu trigger.
   */
  onMenuClick?: () => void;


  /**
   * Optional custom actions.
   */
  actions?: ReactNode;

}


// ============================================================================
// ICONS
// ============================================================================

function MenuIcon() {

  return (

    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M4 6h16" />

      <path d="M4 12h16" />

      <path d="M4 18h16" />

    </svg>

  );

}



function BellIcon() {

  return (

    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
      />

      <path
        d="M13.7 21a2 2 0 0 1-3.4 0"
      />

    </svg>

  );

}



function ChevronIcon() {

  return (

    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="m6 9 6 6 6-6" />

    </svg>

  );

}



// ============================================================================
// USER MENU ITEMS
// ============================================================================

 const userMenuItems = [

  {
    label: 'Profile',
    value: 'profile',
  },

  {
    label: 'Account Settings',
    value: 'settings',
  },

  {
    label: 'Billing',
    value: 'billing',
  },

  {
    label: 'Logout',
    value: 'logout',
  },

 ];

// ============================================================================
// HEADER
// ============================================================================

export default function Header({

  title = 'Dashboard',

  description,

  onMenuClick,

  actions,

}: HeaderProps) {


  const [
    notificationCount,
  ] = useState(3);



  return (

    <header

      className={[
        'flex',
        'h-20',
        'items-center',
        'justify-between',
        'border-b',
        'border-white/10',
        'bg-[#07100A]',
        'px-4',
        'md:px-6',
      ].join(' ')}

    >


      {/* ================================================================ */}
      {/* LEFT SECTION */}
      {/* ================================================================ */}

      <div
        className={[
          'flex',
          'items-center',
          'gap-4',
        ].join(' ')}
      >


        {/* Mobile Menu */}

        <button

          type="button"

          onClick={onMenuClick}

          className={[
            'flex',
            'h-10',
            'w-10',
            'items-center',
            'justify-center',
            'rounded-xl',
            'text-white/60',
            'transition',
            'hover:bg-white/5',
            'hover:text-white',
            'lg:hidden',
          ].join(' ')}

          aria-label="Open menu"

        >

          <MenuIcon />

        </button>



        <div>

          <h1
            className={[
              'text-lg',
              'font-semibold',
              'text-white',
            ].join(' ')}
          >

            {title}

          </h1>


          {description && (

            <p
              className={[
                'hidden',
                'text-sm',
                'text-white/50',
                'sm:block',
              ].join(' ')}
            >

              {description}

            </p>

          )}

        </div>


      </div>



      {/* ================================================================ */}
      {/* RIGHT SECTION */}
      {/* ================================================================ */}

      <div

        className={[
          'flex',
          'items-center',
          'gap-3',
        ].join(' ')}

      >


        {/* Custom Actions */}

        {actions}



        {/* Notifications */}

        <button

          type="button"

          className={[
            'relative',
            'flex',
            'h-10',
            'w-10',
            'items-center',
            'justify-center',
            'rounded-xl',
            'text-white/60',
            'transition',
            'hover:bg-white/5',
            'hover:text-white',
          ].join(' ')}

          aria-label="Notifications"

        >

          <BellIcon />


          {notificationCount > 0 && (

            <span

              className={[
                'absolute',
                'right-1.5',
                'top-1.5',
                'flex',
                'h-4',
                'min-w-4',
                'items-center',
                'justify-center',
                'rounded-full',
                'bg-[#FF3B2F]',
                'px-1',
                'text-[10px]',
                'font-bold',
                'text-white',
              ].join(' ')}

            >

              {notificationCount}

            </span>

          )}

        </button>



        {/* User */}

        <Dropdown

          trigger={

            <button

              type="button"

              className={[
                'flex',
                'items-center',
                'gap-2',
                'rounded-xl',
                'p-1.5',
                'transition',
                'hover:bg-white/5',
              ].join(' ')}

            >

              <Avatar

                name="Merchant Account"

                size="sm"

                status="online"

              />


              <div

                className={[
                  'hidden',
                  'text-left',
                  'md:block',
                ].join(' ')}

              >

                <p
                  className="text-sm font-medium text-white"
                >
                  Merchant
                </p>


                <Badge

                  variant="primary"

                  size="sm"

                >

                  Premium

                </Badge>

              </div>


              <ChevronIcon />

            </button>

          }

          items={userMenuItems}

    />


      </div>


    </header>

  );

}
