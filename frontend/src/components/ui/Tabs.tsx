/**
 * ============================================================================
 * Layboka AI
 * Tabs Component
 * ============================================================================
 *
 * File:
 * frontend/src/components/ui/Tabs.tsx
 *
 * Purpose:
 * - Shared tab navigation
 * - Dashboard sections
 * - Product details
 * - Analytics views
 * - Settings pages
 * - Billing sections
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
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';


// ============================================================================
// TYPES
// ============================================================================

export interface TabItem {

  /**
   * Unique tab identifier.
   */
  id: string;

  /**
   * Visible tab label.
   */
  label: ReactNode;

  /**
   * Optional icon.
   */
  icon?: ReactNode;

  /**
   * Optional badge/count.
   */
  badge?: ReactNode;

  /**
   * Disable this tab.
   */
  disabled?: boolean;

}


export type TabsVariant =
  | 'underline'
  | 'pill'
  | 'contained';


export type TabsSize =
  | 'sm'
  | 'md'
  | 'lg';


export interface TabsProps {

  /**
   * Available tabs.
   */
  items: TabItem[];

  /**
   * Currently selected tab.
   *
   * When supplied, Tabs operates as a controlled component.
   */
  value?: string;

  /**
   * Initial selected tab for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Called whenever active tab changes.
   */
  onChange?: (value: string) => void;

  /**
   * Visual style.
   */
  variant?: TabsVariant;

  /**
   * Tab size.
   */
  size?: TabsSize;

  /**
   * Full width tabs.
   */
  fullWidth?: boolean;

  /**
   * Optional tab content.
   *
   * Keys must match TabItem.id.
   */
  children?: ReactNode;

  /**
   * Additional class for root.
   */
  className?: string;

}


// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles: Record<
  TabsSize,
  string
> = {

  sm: [
    'px-3',
    'py-1.5',
    'text-xs',
  ].join(' '),

  md: [
    'px-3.5',
    'py-2',
    'text-sm',
  ].join(' '),

  lg: [
    'px-4',
    'py-2.5',
    'text-sm',
  ].join(' '),

};


// ============================================================================
// TAB
// ============================================================================

export default function Tabs({

  items,

  value,

  defaultValue,

  onChange,

  variant = 'underline',

  size = 'md',

  fullWidth = false,

  children,

  className = '',

}: TabsProps) {


  const tabsId =
    useId();


  // ========================================================================
  // INITIAL VALUE
  // ========================================================================

  const firstAvailableTab =
    items.find(
      (item) => !item.disabled
    )?.id;


  const [
    internalValue,
    setInternalValue,
  ] = useState<string>(
    defaultValue ||
    firstAvailableTab ||
    ''
  );


  const activeValue =
    value !== undefined
      ? value
      : internalValue;


  // ========================================================================
  // ACTIVE TAB
  // ========================================================================

  const activeTab =
    items.find(
      (item) =>
        item.id === activeValue
    );


  // ========================================================================
  // CHANGE TAB
  // ========================================================================

  function selectTab(
    tabId: string
  ) {

    const tab =
      items.find(
        (item) =>
          item.id === tabId
      );


    if (!tab || tab.disabled) {
      return;
    }


    if (value === undefined) {

      setInternalValue(tabId);

    }


    onChange?.(tabId);

  }


  // ========================================================================
  // KEYBOARD NAVIGATION
  // ========================================================================

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) {

    const enabledTabs =
      items.filter(
        (item) =>
          !item.disabled
      );


    if (
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {

      return;

    }


    event.preventDefault();


    let nextIndex =
      currentIndex;


    if (
      event.key === 'ArrowRight'
    ) {

      nextIndex =
        (currentIndex + 1) %
        enabledTabs.length;

    }


    if (
      event.key === 'ArrowLeft'
    ) {

      nextIndex =
        (currentIndex - 1 +
          enabledTabs.length) %
        enabledTabs.length;

    }


    if (
      event.key === 'Home'
    ) {

      nextIndex = 0;

    }


    if (
      event.key === 'End'
    ) {

      nextIndex =
        enabledTabs.length - 1;

    }


    const nextTab =
      enabledTabs[nextIndex];


    if (!nextTab) {
      return;
    }


    selectTab(nextTab.id);


    requestAnimationFrame(() => {

      document
        .getElementById(
          `${tabsId}-${nextTab.id}`
        )
        ?.focus();

    });

  }


  // ========================================================================
  // ACTIVE PANEL ID
  // ========================================================================

  const panelId =
    `${tabsId}-panel-${activeValue}`;


  return (

    <div
      className={[
        'w-full',
        className,
      ].join(' ')}
    >


      {/* ================================================================ */}
      {/* TAB LIST */}
      {/* ================================================================ */}

      <div
        role="tablist"
        aria-label="Tabs"
        className={[
          'flex',
          fullWidth
            ? 'w-full'
            : 'w-fit',

          variant === 'underline'
            ? [
                'border-b',
                'border-white/10',
                'gap-1',
              ].join(' ')
            : '',

          variant === 'pill'
            ? [
                'gap-1',
                'rounded-xl',
                'bg-[#07100A]',
                'p-1',
              ].join(' ')
            : '',

          variant === 'contained'
            ? [
                'gap-1',
                'rounded-xl',
                'border',
                'border-white/10',
                'bg-[#07100A]',
                'p-1',
              ].join(' ')
            : '',

        ].filter(Boolean).join(' ')}
      >


        {items.map(
          (item, index) => {

            const isActive =
              item.id === activeValue;


            return (

              <button

                key={item.id}

                id={`${tabsId}-${item.id}`}

                type="button"

                role="tab"

                aria-selected={
                  isActive
                }

                aria-controls={
                  panelId
                }

                tabIndex={
                  isActive
                    ? 0
                    : -1
                }

                disabled={
                  item.disabled
                }

                onClick={() =>
                  selectTab(item.id)
                }

                onKeyDown={(event) =>
                  handleKeyDown(
                    event,
                    items
                      .filter(
                        (tab) =>
                          !tab.disabled
                      )
                      .findIndex(
                        (tab) =>
                          tab.id ===
                          item.id
                      )
                  )
                }

                className={[
                  'relative',
                  'inline-flex',
                  'items-center',
                  'justify-center',
                  'gap-2',
                  'font-medium',
                  'transition-all',
                  'duration-200',
                  'outline-none',

                  sizeStyles[size],

                  fullWidth
                    ? 'flex-1'
                    : '',

                  item.disabled
                    ? [
                        'cursor-not-allowed',
                        'opacity-40',
                      ].join(' ')
                    : '',

                  variant === 'underline'
                    ? [

                        'rounded-t-lg',

                        isActive
                          ? [
                              'text-[#FF3B2F]',
                              'bg-[#FF3B2F]/5',
                            ].join(' ')
                          : [
                              'text-white/50',
                              'hover:bg-white/5',
                              'hover:text-white',
                            ].join(' '),

                        'after:absolute',
                        'after:bottom-0',
                        'after:left-0',
                        'after:right-0',
                        'after:h-0.5',
                        'after:rounded-full',
                        isActive
                          ? 'after:bg-[#FF3B2F]'
                          : 'after:bg-transparent',

                      ].join(' ')
                    : '',

                  variant === 'pill'
                    ? [

                        'rounded-lg',

                        isActive
                          ? [
                              'bg-[#0B1710]',
                              'text-white',
                              'shadow-sm',
                            ].join(' ')
                          : [
                              'text-white/50',
                              'hover:bg-white/5',
                              'hover:text-white',
                            ].join(' '),

                      ].join(' ')
                    : '',

                  variant === 'contained'
                    ? [

                        'rounded-lg',

                        isActive
                          ? [
                              'bg-[#FF3B2F]',
                              'text-white',
                              'shadow-sm',
                            ].join(' ')
                          : [
                              'text-white/50',
                              'hover:bg-white/10',
                              'hover:text-white',
                            ].join(' '),

                      ].join(' ')
                    : '',

                  'focus-visible:ring-2',
                  'focus-visible:ring-[#FF3B2F]/50',

                ]
                  .filter(Boolean)
                  .join(' ')}

              >


                {/* ICON */}

                {item.icon && (

                  <span
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>

                )}


                {/* LABEL */}

                <span>
                  {item.label}
                </span>


                {/* BADGE */}

                {item.badge && (

                  <span
                    className={[
                      'inline-flex',
                      'items-center',
                      'justify-center',
                      'rounded-full',
                      'bg-white/10',
                      'px-1.5',
                      'py-0.5',
                      'text-[10px]',
                      'font-semibold',
                      isActive
                        ? 'text-white'
                        : 'text-white/60',
                    ].join(' ')}
                  >
                    {item.badge}
                  </span>

                )}

              </button>

            );

          }
        )}

      </div>


      {/* ================================================================ */}
      {/* TAB PANEL */}
      {/* ================================================================ */}

      {children && (

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={
            `${tabsId}-${activeValue}`
          }
          tabIndex={0}
          className="mt-5 outline-none"
        >

          {children}

        </div>

      )}


    </div>

  );

}
