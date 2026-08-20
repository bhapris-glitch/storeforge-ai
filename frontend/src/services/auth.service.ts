/**
 * ============================================================================
 * StoreForge AI
 * Authentication Service
 * ============================================================================
 *
 * File:
 * frontend/src/services/auth.service.ts
 *
 * Purpose:
 * - Login
 * - Registration
 * - Logout
 * - Current authenticated user
 *
 * Authentication is handled by the StoreForge backend.
 *
 * ============================================================================
 */

'use client';

import {
  authApi
} from '@/lib/api';


// ============================================================================
// TYPES
// ============================================================================

export interface LoginData {
  email: string;
  password: string;
}


export interface RegisterData {
  name: string;
  email: string;
  password: string;
}


export interface AuthUser {
  id: string;
  _id?: string;

  name?: string;

  email: string;

  role?: string;

  status?: string;

  avatar?: string;

  createdAt?: string;

  updatedAt?: string;
}


export interface AuthResponse {
  success?: boolean;

  message?: string;

  user?: AuthUser;

  token?: string;

  accessToken?: string;

  data?: {
    user?: AuthUser;
    token?: string;
    accessToken?: string;
  };
}


// ============================================================================
// LOGIN
// ============================================================================

export async function login(
  data: LoginData
): Promise<AuthResponse> {

  const response =
  await authApi.login<AuthResponse>(
    data as unknown as Record<string, unknown>
  );


  return response;

}


// ============================================================================
// REGISTER
// ============================================================================

export async function register(
  data: RegisterData
): Promise<AuthResponse> {

  const response =
    await authApi.register<AuthResponse>(
      data
    );


  return response;

}


// ============================================================================
// LOGOUT
// ============================================================================

export async function logout(): Promise<void> {

  try {

    await authApi.logout();

  } finally {

    /*
     * The backend should invalidate/clear the HTTP-only authentication
     * cookie.
     *
     * Remove legacy browser tokens as well so older authentication flows
     * cannot leave stale credentials behind.
     */

    if (
      typeof window !== 'undefined'
    ) {

      localStorage.removeItem(
        'storeforge_token'
      );

      localStorage.removeItem(
        'token'
      );

    }

  }

}


// ============================================================================
// CURRENT USER
// ============================================================================

export async function getCurrentUser(): Promise<AuthUser> {

  const response =
    await authApi.me<AuthResponse>();


  const user =
    response.user ||
    response.data?.user;


  if (!user) {

    throw new Error(
      'Authenticated user was not returned by the server.'
    );

  }


  return user;

}


// ============================================================================
// AUTHENTICATION CHECK
// ============================================================================

export async function checkAuthentication(): Promise<boolean> {

  try {

    await getCurrentUser();

    return true;

  } catch {

    return false;

  }

}


// ============================================================================
// TOKEN EXTRACTION
// ============================================================================
//
// Normally StoreForge should use an HTTP-only cookie, so the browser should
// NOT need access to the JWT.
//
// This helper only supports older/development backend responses that return
// a token directly.
//

export function extractToken(
  response: AuthResponse
): string | null {

  const token =
    response.token ||
    response.accessToken ||
    response.data?.token ||
    response.data?.accessToken;


  return token || null;

}


// ============================================================================
// LEGACY TOKEN STORAGE
// ============================================================================
//
// Prefer HTTP-only cookies in production.
//
// This helper exists for compatibility with a backend that still returns
// a JWT in the login/register response.
//

export function storeLegacyToken(
  token: string | null
): void {

  if (
    typeof window === 'undefined'
  ) {

    return;

  }


  if (!token) {

    return;

  }


  localStorage.setItem(
    'storeforge_token',
    token
  );

}


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const authService = {

  login,

  register,

  logout,

  getCurrentUser,

  checkAuthentication,

  extractToken,

  storeLegacyToken

};


export default authService;
