/**
 * ============================================================================
 * Layboka AI
 * Root Application Layout
 * ============================================================================
 *
 * File:
 * frontend/src/app/layout.tsx
 *
 * Purpose:
 * - Root Next.js App Router layout
 * - Loads global CSS
 * - Sets application metadata
 * - Provides the base HTML structure
 *
 * ============================================================================
 */

import type { Metadata } from 'next';
import './globals.css';


// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {

  title: {
    default: 'Layboka AI',
    template: '%s | Layboka AI',
  },

  description:
    'AI-powered commerce platform for creating, growing and optimizing online stores.',

  keywords: [
    'Layboka AI',
    'AI ecommerce',
    'AI Shopify',
    'AI store builder',
    'AI product generator',
    'AI theme generator',
  ],

  applicationName:
    'Layboka AI',

  authors: [
    {
      name: 'Layboka AI',
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  viewport:
    'width=device-width, initial-scale=1',

};


// ============================================================================
// ROOT LAYOUT
// ============================================================================

export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html
      lang="en"
      suppressHydrationWarning
    >

      <body>

        {children}

      </body>

    </html>

  );

}
