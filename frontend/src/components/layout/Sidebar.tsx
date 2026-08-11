/**
 * ============================================================================
 * Layboka AI
 * Sidebar Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/layout/Sidebar.tsx
 *
 * Purpose:
 * - Main dashboard navigation
 * - Desktop sidebar
 * - Mobile responsive sidebar content
 *
 * Includes:
 * - Dashboard
 * - AI Store Creation
 * - AI Theme Generator
 * - AI Product Generator
 * - Branding
 * - Products
 * - Analytics
 * - Billing
 * - Settings
 *
 * Design:
 * - Near-black green: #0B1710
 * - Deep background: #07100A
 * - Brand: #FF3B2F
 *
 * ============================================================================
 */

'use client';

import Link from 'next/link';
import {
  usePathname,
} from 'next/navigation';

import {
  ReactNode,
} from 'react';

import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';


// ============================================================================
// TYPES
// ============================================================================

interface SidebarItem {

  label: string;

  href: string;

  icon: ReactNode;

  badge?: string;

}


// ============================================================================
// ICONS
// ============================================================================

function DashboardIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
      />

    </svg>

  );

}


function StoreIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M3 9l1-5h16l1 5" />

      <path d="M5 9v11h14V9" />

      <path d="M9 20v-6h6v6" />

    </svg>

  );

}


function SparklesIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />

      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />

    </svg>

  );

}


function ProductIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M20 7l-8-4-8 4 8 4 8-4z" />

      <path d="M4 7v10l8 4 8-4V7" />

      <path d="M12 11v10" />

    </svg>

  );

}


function ChartIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <path d="M3 3v18h18" />

      <path d="M7 16l4-5 3 3 5-7" />

    </svg>

  );

}


function BillingIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 10h18" />

    </svg>

  );

}


function SettingsIcon() {

  return (

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >

      <circle
        cx="12"
        cy="12"
        r="3"
      />

      <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V21a2 2 0 0 1-4 0v-.09a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-2 .36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 2.65 14H2.5a2 2 0 0 1 0-4h.09a1.8 1.8 0 0 0 1.65-1.1 1.8 1.8 0 0 0-.36-2l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 2 .36h.09A1.8 1.8 0 0 0 10 2.79V2.5a2 2 0 0 1 4 0v.09a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 2v.09A1.8 1.8 0 0 0 21.35 10h.15a2 2 0 0 1 0 4h-.09a1.8 1.8 0 0 0-2.01 1z" />

    </svg>

  );

}


// ============================================================================
// NAVIGATION
// ============================================================================

const navigation: SidebarItem[] = [

  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />,
  },

  {
    label: 'AI Store Creation',
    href: '/store-builder',
    icon: <StoreIcon />,
  },

  {
    label: 'AI Theme Generator',
    href: '/themes',
    icon: <SparklesIcon />,
  },

  {
    label: 'AI Product Generator',
    href: '/products/generate',
    icon: <ProductIcon />,
  },

  {
    label: 'Branding',
    href: '/branding',
    icon: <SparklesIcon />,
  },

  {
    label: 'Products',
    href: '/products',
    icon: <ProductIcon />,
  },

  {
    label: 'Analytics',
    href: '/analytics',
    icon: <ChartIcon />,
  },

  {
    label: 'Billing',
    href: '/billing',
    icon: <BillingIcon />,
  },

  {
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon />,
  },

];


// ============================================================================
// SIDEBAR
// ============================================================================

export default function Sidebar() {

  const pathname =
    usePathname();


  return (

    <aside
      className={[
        'flex',
        'h-full',
        'w-72',
        'flex-col',
        'border-r',
        'border-white/10',
        'bg-[#07100A]',
      ].join(' ')}
    >


      {/* ================================================================ */}
      {/* LOGO */}
      {/* ================================================================ */}

      <div
        className={[
          'flex',
          'h-20',
          'items-center',
          'border-b',
          'border-white/10',
          'px-6',
        ].join(' ')}
      >

        <div>

          <h1
            className={[
              'text-xl',
              'font-bold',
              'text-white',
            ].join(' ')}
          >
            Layboka
            <span
              className="text-[#FF3B2F]"
            >
              AI
            </span>
          </h1>


          <p
            className="text-xs text-white/40"
          >
            AI Commerce Platform
          </p>

        </div>

      </div>


      {/* ================================================================ */}
      {/* MENU */}
      {/* ================================================================ */}

      <nav
        className={[
          'flex-1',
          'space-y-1',
          'overflow-y-auto',
          'px-4',
          'py-5',
        ].join(' ')}
      >

        {navigation.map(
          (item) => {

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );


            return (

              <Link

                key={item.href}

                href={item.href}

                className={[
                  'flex',
                  'items-center',
                  'gap-3',
                  'rounded-xl',
                  'px-3',
                  'py-2.5',
                  'text-sm',
                  'font-medium',
                  'transition-all',

                  active
                    ? [
                        'bg-[#FF3B2F]/10',
                        'text-[#FF3B2F]',
                      ].join(' ')
                    : [
                        'text-white/60',
                        'hover:bg-white/5',
                        'hover:text-white',
                      ].join(' '),

                ].join(' ')}

              >

                {item.icon}

                <span>
                  {item.label}
                </span>

              </Link>

            );

          }
        )}

      </nav>


      {/* ================================================================ */}
      {/* USER AREA */}
      {/* ================================================================ */}

      <div
        className={[
          'border-t',
          'border-white/10',
          'p-4',
        ].join(' ')}
      >

        <div
          className={[
            'flex',
            'items-center',
            'gap-3',
            'rounded-xl',
            'bg-[#0B1710]',
            'p-3',
          ].join(' ')}
        >

          <Avatar
            name="Merchant"
            size="md"
          />


          <div
            className="min-w-0"
          >

            <p
              className="truncate text-sm font-medium text-white"
            >
              Merchant Account
            </p>


            <Badge
              size="sm"
              variant="primary"
            >
              Premium
            </Badge>

          </div>

        </div>

      </div>


    </aside>

  );

}
