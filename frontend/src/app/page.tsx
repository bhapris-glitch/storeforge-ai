/**
 * ============================================================================
 * Layboka AI
 * Root Landing Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/page.tsx
 *
 * Route:
 * /
 *
 * Purpose:
 * - Main Layboka AI entry page
 * - SaaS landing page foundation
 * - Navigation to dashboard and pricing
 *
 * ============================================================================
 */

'use client';

import Link from 'next/link';


// ============================================================================
// ICONS
// ============================================================================

function ArrowIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M5 12h14" />

      <path d="m13 6 6 6-6 6" />

    </svg>

  );

}


function SparkIcon() {

  return (

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M12 2l2.5 7L22 12l-7.5 3L12 22l-2.5-7L2 12l7.5-3L12 2z" />

    </svg>

  );

}


// ============================================================================
// PAGE
// ============================================================================

export default function HomePage() {

  return (

    <main className="min-h-screen bg-[#07100A] text-white">


      {/* ================================================================== */}
      {/* NAVIGATION */}
      {/* ================================================================== */}

      <header className="border-b border-white/5">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3B2F]">

              <SparkIcon />

            </div>


            <span className="text-lg font-bold tracking-tight">

              Layboka AI

            </span>

          </Link>



          {/* Navigation */}

          <nav className="hidden items-center gap-8 md:flex">

            <Link
              href="/pricing"
              className="text-sm text-white/60 transition hover:text-white"
            >

              Pricing

            </Link>


            <Link
              href="/about"
              className="text-sm text-white/60 transition hover:text-white"
            >

              About

            </Link>


            <Link
              href="/login"
              className="text-sm text-white/60 transition hover:text-white"
            >

              Login

            </Link>

          </nav>



          {/* CTA */}

          <Link
            href="/dashboard"
            className="rounded-xl bg-[#FF3B2F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FF5147]"
          >

            Get Started

          </Link>

        </div>

      </header>



      {/* ================================================================== */}
      {/* HERO */}
      {/* ================================================================== */}

      <section className="relative overflow-hidden">

        {/* Background glow */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#FF3B2F]/5 blur-[120px]"
        />



        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center lg:px-8 lg:pb-32 lg:pt-32">


          {/* Badge */}

          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[#FF3B2F]/20 bg-[#FF3B2F]/5 px-4 py-2 text-sm text-white/70">

            <span className="h-2 w-2 rounded-full bg-[#FF3B2F]" />

            AI-powered commerce platform

          </div>



          {/* Heading */}

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">

            Build and grow your store with{' '}

            <span className="text-[#FF3B2F]">

              AI

            </span>

          </h1>



          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">

            Create your store, generate products, build themes and
            turn your ecommerce ideas into a high-converting business
            with Layboka AI.

          </p>



          {/* Buttons */}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF3B2F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF5147]"
            >

              Start Building

              <ArrowIcon />

            </Link>


            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >

              View Pricing

            </Link>

          </div>



          {/* Product preview */}

          <div className="mx-auto mt-20 max-w-4xl">

            <div className="rounded-2xl border border-white/10 bg-[#0B1710] p-2 shadow-2xl shadow-black/30">

              <div className="rounded-xl border border-white/5 bg-[#07100A] p-6 sm:p-8">

                <div className="flex items-center gap-2 border-b border-white/5 pb-5">

                  <div className="h-3 w-3 rounded-full bg-white/10" />

                  <div className="h-3 w-3 rounded-full bg-white/10" />

                  <div className="h-3 w-3 rounded-full bg-white/10" />

                </div>


                <div className="grid gap-5 pt-8 sm:grid-cols-3">

                  <div className="h-32 rounded-xl bg-white/[0.03]" />

                  <div className="h-32 rounded-xl bg-[#FF3B2F]/10" />

                  <div className="h-32 rounded-xl bg-white/[0.03]" />

                </div>


                <div className="mt-5 h-4 w-2/3 rounded bg-white/5" />

                <div className="mt-3 h-3 w-1/2 rounded bg-white/[0.03]" />

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* ================================================================== */}
      {/* FEATURES */}
      {/* ================================================================== */}

      <section className="border-t border-white/5">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="grid gap-5 md:grid-cols-3">


            <FeatureCard

              title="AI Store Creation"

              description="Build a complete ecommerce store faster with AI-powered generation."

            />


            <FeatureCard

              title="AI Product Generation"

              description="Generate product titles, descriptions and content designed to convert."

            />


            <FeatureCard

              title="AI Theme Generation"

              description="Create modern storefront designs based on your brand and industry."

            />


          </div>

        </div>

      </section>



      {/* ================================================================== */}
      {/* CTA */}
      {/* ================================================================== */}

      <section className="border-t border-white/5">

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">

            Your next store starts with AI.

          </h2>


          <p className="mx-auto mt-4 max-w-xl text-white/50">

            Build faster, launch smarter and grow with Layboka AI.

          </p>


          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FF3B2F] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#FF5147]"
          >

            Get Started

            <ArrowIcon />

          </Link>

        </div>

      </section>



      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}

      <footer className="border-t border-white/5">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <p>

            © {new Date().getFullYear()} Layboka AI. All rights reserved.

          </p>


          <div className="flex gap-6">

            <Link
              href="/pricing"
              className="transition hover:text-white"
            >

              Pricing

            </Link>


            <Link
              href="/about"
              className="transition hover:text-white"
            >

              About

            </Link>


            <Link
              href="/terms"
              className="transition hover:text-white"
            >

              Terms

            </Link>

          </div>

        </div>

      </footer>


    </main>

  );

}


// ============================================================================
// FEATURE CARD
// ============================================================================

function FeatureCard({

  title,

  description,

}: {

  title: string;

  description: string;

}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-[#0B1710] p-6 transition hover:border-white/15">

      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF3B2F]/10 text-[#FF3B2F]">

        <SparkIcon />

      </div>


      <h3 className="font-semibold text-white">

        {title}

      </h3>


      <p className="mt-2 text-sm leading-6 text-white/45">

        {description}

      </p>

    </div>

  );

}
