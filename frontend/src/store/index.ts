/**
 * ============================================================================
 * StoreForge AI
 * Store Index
 * ============================================================================
 *
 * File:
 * frontend/src/store/index.ts
 *
 * Purpose:
 * - Central export point for Zustand stores
 * - Simplifies imports across the application
 *
 * ============================================================================
 */


// ============================================================================
// AUTH STORE
// ============================================================================

export {

  default as useAuthStore,

  authSelectors

} from './auth.store';



// ============================================================================
// USER STORE
// ============================================================================

export {

  default as useUserStore,

  userSelectors

} from './user.store';



// ============================================================================
// STORE MANAGEMENT
// ============================================================================

export {

  default as useStoreStore,

  storeSelectors

} from './store.store';



// ============================================================================
// BRANDING STORE
// ============================================================================

export {

  default as useBrandingStore,

  brandingSelectors

} from './branding.store';



// ============================================================================
// PRODUCT STORE
// ============================================================================

export {

  default as useProductStore,

  productSelectors

} from './product.store';



// ============================================================================
// THEME STORE
// ============================================================================

export {

  default as useThemeStore,

  themeSelectors

} from './theme.store';



// ============================================================================
// BILLING STORE
// ============================================================================

export {

  default as useBillingStore,

  billingSelectors

} from './billing.store';



// ============================================================================
// DASHBOARD STORE
// ============================================================================

export {

  default as useDashboardStore,

  dashboardSelectors

} from './dashboard.store';



// ============================================================================
// TYPES
// ============================================================================

export type {

  AuthUser

} from './auth.store';



export type {

  UserProfile,

  UserProfileUpdate

} from './user.store';



export type {

  Store

} from './store.store';



export type {

  Branding,

  BrandColors,

  BrandFonts,

  BrandLogo

} from './branding.store';



export type {

  Product,

  ProductDraft

} from './product.store';



export type {

  Theme,

  ThemeDraft,

  ThemeColors,

  ThemeTypography,

  ThemeSection

} from './theme.store';



export type {

  BillingPlan,

  Subscription,

  BillingHistoryItem,

  SubscriptionStatus

} from './billing.store';



export type {

  DashboardMetrics,

  DashboardActivity,

  AITaskStatus

} from './dashboard.store';
