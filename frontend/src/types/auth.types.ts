/**
 * ============================================================================
 * StoreForge AI
 * Authentication Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/auth.types.ts
 *
 * Purpose:
 * - Shared authentication types
 * - Login/register request and response types
 * - Authenticated user/session types
 *
 * IMPORTANT:
 * - Tokens/secrets are not exposed through frontend types.
 * - Authentication is handled by the backend.
 * - Prefer secure HTTP-only cookies for session authentication.
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
// AUTH USER
// ============================================================================

export interface AuthUser {

  id: string;

  _id?: string;

  email: string;

  firstName?: string;

  lastName?: string;

  name?: string;

  role?: UserRole;

  avatarUrl?: string;

  emailVerified?: boolean;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


// ============================================================================
// LOGIN REQUEST
// ============================================================================

export interface LoginRequest {

  email: string;

  password: string;

}


// ============================================================================
// REGISTER REQUEST
// ============================================================================

export interface RegisterRequest {

  email: string;

  password: string;

  firstName?: string;

  lastName?: string;

  name?: string;

}


// ============================================================================
// AUTH RESPONSE
// ============================================================================

export interface AuthResponse {

  user: AuthUser;

  message?: string;

}


// ============================================================================
// SESSION RESPONSE
// ============================================================================

export interface SessionResponse {

  authenticated: boolean;

  user: AuthUser | null;

}


// ============================================================================
// LOGOUT RESPONSE
// ============================================================================

export interface LogoutResponse {

  success: boolean;

  message?: string;

}


// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

export interface VerifyEmailRequest {

  token: string;

}


export interface VerifyEmailResponse {

  success: boolean;

  message?: string;

}


// ============================================================================
// RESEND VERIFICATION
// ============================================================================

export interface ResendVerificationRequest {

  email: string;

}


export interface ResendVerificationResponse {

  success: boolean;

  message?: string;

}


// ============================================================================
// FORGOT PASSWORD
// ============================================================================

export interface ForgotPasswordRequest {

  email: string;

}


export interface ForgotPasswordResponse {

  success: boolean;

  message?: string;

}


// ============================================================================
// RESET PASSWORD
// ============================================================================

export interface ResetPasswordRequest {

  token: string;

  password: string;

  confirmPassword?: string;

}


export interface ResetPasswordResponse {

  success: boolean;

  message?: string;

}


// ============================================================================
// CHANGE PASSWORD
// ============================================================================

export interface ChangePasswordRequest {

  currentPassword: string;

  newPassword: string;

  confirmPassword?: string;

}


export interface ChangePasswordResponse {

  success: boolean;

  message?: string;

}


// ============================================================================
// AUTH STATE
// ============================================================================

export interface AuthState {

  user: AuthUser | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  isInitialized: boolean;

  error: string | null;

}


// ============================================================================
// AUTH ERROR
// ============================================================================

export interface AuthError {

  message: string;

  code?: string;

  statusCode?: number;

}


// ============================================================================
// API AUTH ERROR RESPONSE
// ============================================================================

export interface AuthErrorResponse {

  success?: false;

  message: string;

  error?: string;

  code?: string;

  statusCode?: number;

}
