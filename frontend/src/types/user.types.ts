/**
 * ============================================================================
 * StoreForge AI
 * User Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/user.types.ts
 *
 * Purpose:
 * - Shared user/profile types
 * - User profile update types
 * - User preferences
 * - User API response types
 *
 * IMPORTANT:
 * - Do not store passwords, access tokens, API keys, or Shopify secrets here.
 * - Sensitive authentication data remains backend-controlled.
 *
 * ============================================================================
 */


// ============================================================================
// USER ROLE
// ============================================================================

export type UserRole =
  | 'user'
  | 'admin'
  | 'super_admin';


// ============================================================================
// USER PROFILE
// ============================================================================

export interface UserProfile {

  id: string;

  _id?: string;

  email: string;

  firstName?: string;

  lastName?: string;

  name?: string;

  role?: UserRole;

  avatarUrl?: string;

  phone?: string;

  companyName?: string;

  jobTitle?: string;

  timezone?: string;

  locale?: string;

  emailVerified?: boolean;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// USER PROFILE UPDATE
// ============================================================================

export interface UserProfileUpdate {

  firstName?: string;

  lastName?: string;

  name?: string;

  phone?: string;

  companyName?: string;

  jobTitle?: string;

  timezone?: string;

  locale?: string;

  avatarUrl?: string | null;

}


// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface UserPreferences {

  language?: string;

  timezone?: string;

  currency?: string;

  dateFormat?: string;

  timeFormat?: '12h' | '24h';

  theme?: 'light' | 'dark' | 'system';

  emailNotifications?: boolean;

  productUpdates?: boolean;

  marketingEmails?: boolean;

}


// ============================================================================
// USER PREFERENCES UPDATE
// ============================================================================

export type UserPreferencesUpdate =
  Partial<UserPreferences>;


// ============================================================================
// USER API RESPONSE
// ============================================================================

export interface UserResponse {

  user: UserProfile;

  message?: string;

}


// ============================================================================
// USER PREFERENCES RESPONSE
// ============================================================================

export interface UserPreferencesResponse {

  preferences: UserPreferences;

  message?: string;

}


// ============================================================================
// USER STATE
// ============================================================================

export interface UserState {

  profile: UserProfile | null;

  preferences: UserPreferences | null;

  isLoading: boolean;

  isLoaded: boolean;

  error: string | null;

}
