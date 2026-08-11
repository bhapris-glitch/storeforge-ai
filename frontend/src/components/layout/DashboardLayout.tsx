/**
 * ============================================================================
 * Layboka AI
 * Dashboard Layout Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/layout/DashboardLayout.tsx
 *
 * Purpose:
 * - Main authenticated dashboard wrapper
 * - Combines Sidebar + Header
 * - Handles responsive layout
 * - Provides dashboard content area
 *
 * Structure:
 *
 * Desktop:
 *
 * ┌──────────────┬──────────────────────┐
 * │              │ Header               │
 * │  Sidebar     ├──────────────────────┤
 * │              │ Content              │
 * └──────────────┴──────────────────────┘
 *
 * Mobile:
 *
 * Header
 * Content
 * Sidebar Drawer
 *
 * ============================================================================
 */

'use client';

import {
  useState,
  type ReactNode,
} from 'react';

import Sidebar from './Sidebar';
import Header from './Header';


// ============================================================================
// TYPES
// ============================================================================

export interface DashboardLayoutProps {

  /**
   * Page content.
   */
  children: ReactNode;


  /**
   * Header title.
   */
  title?: string;


  /**
   * Header description.
   */
  description?: string;


  /**
   * Header actions.
   */
  actions?: ReactNode;

}


// ============================================================================
// CLOSE ICON
// ============================================================================

function CloseIcon() {

  return (

    <svg

      width="24"

      height="24"

      viewBox="0 0 24 24"

      fill="none"

      stroke="currentColor"

      strokeWidth="2"

      strokeLinecap="round"

      strokeLinejoin="round"

    >

      <path d="M18 6L6 18" />

      <path d="M6 6L18 18" />

    </svg>

  );

}


// ============================================================================
// DASHBOARD LAYOUT
// ============================================================================

export default function DashboardLayout({

  children,

  title,

  description,

  actions,

}: DashboardLayoutProps) {


  const [

    mobileSidebarOpen,

    setMobileSidebarOpen,

  ] = useState(false);



  return (

    <div

      className={[

        'flex',

        'min-h-screen',

        'bg-[#07100A]',

      ].join(' ')}

    >


      {/* ================================================================ */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================================ */}

      <aside

        className={[

          'hidden',

          'lg:block',

          'lg:fixed',

          'lg:inset-y-0',

          'lg:left-0',

          'lg:z-40',

        ].join(' ')}

      >

        <Sidebar />

      </aside>



      {/* ================================================================ */}
      {/* MOBILE SIDEBAR OVERLAY */}
      {/* ================================================================ */}

      {mobileSidebarOpen && (

        <div

          className={[

            'fixed',

            'inset-0',

            'z-50',

            'lg:hidden',

          ].join(' ')}

        >


          <div

            className={[

              'absolute',

              'inset-0',

              'bg-black/60',

              'backdrop-blur-sm',

            ].join(' ')}

            onClick={() =>
              setMobileSidebarOpen(false)
            }

          />



          <div

            className={[

              'relative',

              'h-full',

              'w-72',

              'animate-in',

              'slide-in-from-left',

              'duration-200',

            ].join(' ')}

          >

            <button

              type="button"

              onClick={() =>
                setMobileSidebarOpen(false)
              }

              className={[

                'absolute',

                'right-3',

                'top-3',

                'z-10',

                'flex',

                'h-9',

                'w-9',

                'items-center',

                'justify-center',

                'rounded-xl',

                'bg-white/10',

                'text-white',

                'hover:bg-white/20',

              ].join(' ')}

              aria-label="Close sidebar"

            >

              <CloseIcon />

            </button>


            <Sidebar />

          </div>


        </div>

      )}



      {/* ================================================================ */}
      {/* MAIN AREA */}
      {/* ================================================================ */}

      <main

        className={[

          'flex',

          'min-h-screen',

          'flex-1',

          'flex-col',

          'lg:ml-72',

        ].join(' ')}

      >


        <Header

          title={title}

          description={description}

          actions={actions}

          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }

        />



        {/* ============================================================ */}
        {/* CONTENT */}
        {/* ============================================================ */}

        <div

          className={[

            'flex-1',

            'overflow-y-auto',

            'p-4',

            'md:p-6',

            'xl:p-8',

          ].join(' ')}

        >

          {children}

        </div>


      </main>


    </div>

  );

}
