/**
 * ============================================================================
 * StoreForge AI
 * Theme Types
 * ============================================================================
 *
 * File:
 * frontend/src/types/theme.types.ts
 *
 * Purpose:
 * - Shared theme types
 * - Theme appearance/configuration
 * - Colors and typography
 * - Theme sections
 * - Theme editor drafts
 * - AI theme-generation types
 * - Theme API request/response types
 *
 * IMPORTANT:
 * - This is for the SaaS store/theme creation system.
 * - No chatbot/customer-conversation types belong here.
 *
 * ============================================================================
 */


// ============================================================================
// THEME STATUS
// ============================================================================

export type ThemeStatus =

  | 'draft'
  | 'active'
  | 'published'
  | 'archived';


// ============================================================================
// THEME DEVICE
// ============================================================================

export type ThemeDevice =

  | 'desktop'
  | 'tablet'
  | 'mobile';


// ============================================================================
// THEME COLORS
// ============================================================================

export interface ThemeColors {

  primary?: string;

  secondary?: string;

  accent?: string;

  background?: string;

  surface?: string;

  text?: string;

  textSecondary?: string;

  heading?: string;

  border?: string;

  button?: string;

  buttonText?: string;

  link?: string;

  success?: string;

  warning?: string;

  error?: string;

  info?: string;

}


// ============================================================================
// THEME TYPOGRAPHY
// ============================================================================

export interface ThemeTypography {

  headingFont?: string;

  bodyFont?: string;

  buttonFont?: string;

  headingWeight?: number | string;

  bodyWeight?: number | string;

  headingSize?: string;

  bodySize?: string;

  lineHeight?: string;

  letterSpacing?: string;

}


// ============================================================================
// THEME SECTION
// ============================================================================

export interface ThemeSection {

  id: string;

  type: string;

  name?: string;

  enabled?: boolean;

  position?: number;

  settings?: Record<string, unknown>;

}


// ============================================================================
// THEME HEADER
// ============================================================================

export interface ThemeHeader {

  enabled?: boolean;

  logoPosition?: 'left' | 'center' | 'right';

  sticky?: boolean;

  showSearch?: boolean;

  showCart?: boolean;

  showAccount?: boolean;

  showNavigation?: boolean;

  settings?: Record<string, unknown>;

}


// ============================================================================
// THEME FOOTER
// ============================================================================

export interface ThemeFooter {

  enabled?: boolean;

  showNewsletter?: boolean;

  showSocialLinks?: boolean;

  showPaymentIcons?: boolean;

  columns?: number;

  settings?: Record<string, unknown>;

}


// ============================================================================
// THEME SETTINGS
// ============================================================================

export interface ThemeSettings {

  borderRadius?: string;

  containerWidth?: string;

  spacing?: string;

  buttonStyle?: 'square' | 'rounded' | 'pill';

  cardStyle?: 'flat' | 'bordered' | 'shadow';

  animation?: boolean;

  animationStyle?: string;

  showBreadcrumbs?: boolean;

  showReviews?: boolean;

  customCSS?: string;

  customJS?: string;

  [key: string]: unknown;

}


// ============================================================================
// THEME
// ============================================================================

export interface Theme {

  id: string;

  _id?: string;

  storeId: string;

  name: string;

  description?: string;

  status?: ThemeStatus;

  thumbnailUrl?: string | null;

  previewUrl?: string | null;

  version?: string;

  colors?: ThemeColors;

  typography?: ThemeTypography;

  header?: ThemeHeader;

  footer?: ThemeFooter;

  sections?: ThemeSection[];

  settings?: ThemeSettings;

  isDefault?: boolean;

  isPublished?: boolean;

  createdAt?: string;

  updatedAt?: string;

  publishedAt?: string | null;

}


// ============================================================================
// THEME DRAFT
// ============================================================================

export interface ThemeDraft {

  name?: string;

  description?: string;

  colors?: ThemeColors;

  typography?: ThemeTypography;

  header?: ThemeHeader;

  footer?: ThemeFooter;

  sections?: ThemeSection[];

  settings?: ThemeSettings;

}


// ============================================================================
// THEME CREATE REQUEST
// ============================================================================

export interface CreateThemeRequest {

  storeId: string;

  name: string;

  description?: string;

  colors?: ThemeColors;

  typography?: ThemeTypography;

  header?: ThemeHeader;

  footer?: ThemeFooter;

  sections?: ThemeSection[];

  settings?: ThemeSettings;

}


// ============================================================================
// THEME UPDATE REQUEST
// ============================================================================

export type UpdateThemeRequest =

  Partial<Omit<CreateThemeRequest, 'storeId'>>;


// ============================================================================
// THEME LIST QUERY
// ============================================================================

export interface ThemeListQuery {

  storeId: string;

  page?: number;

  limit?: number;

  status?: ThemeStatus;

  search?: string;

  sortBy?: 'createdAt' | 'updatedAt' | 'name';

  sortOrder?: 'asc' | 'desc';

}


// ============================================================================
// THEME PAGINATION
// ============================================================================

export interface ThemePagination {

  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

}


// ============================================================================
// THEMES RESPONSE
// ============================================================================

export interface ThemesResponse {

  themes: Theme[];

  pagination?: ThemePagination;

  message?: string;

}


// ============================================================================
// SINGLE THEME RESPONSE
// ============================================================================

export interface ThemeResponse {

  theme: Theme;

  message?: string;

}


// ============================================================================
// AI THEME GENERATION REQUEST
// ============================================================================

export interface GenerateThemeRequest {

  storeId: string;

  businessName?: string;

  industry?: string;

  description?: string;

  targetAudience?: string;

  style?: string;

  designStyle?: string;

  preferredColors?: string[];

  preferredFonts?: string[];

  language?: string;

  includeSections?: boolean;

}


// ============================================================================
// AI THEME GENERATION RESULT
// ============================================================================

export interface ThemeGenerationResult {

  name?: string;

  description?: string;

  colors?: ThemeColors;

  typography?: ThemeTypography;

  header?: ThemeHeader;

  footer?: ThemeFooter;

  sections?: ThemeSection[];

  settings?: ThemeSettings;

}


// ============================================================================
// AI THEME GENERATION RESPONSE
// ============================================================================

export interface ThemeGenerationResponse {

  theme?: Theme;

  result?: ThemeGenerationResult;

  generated?: boolean;

  message?: string;

}


// ============================================================================
// THEME GENERATION STATE
// ============================================================================

export interface ThemeGenerationState {

  isGenerating: boolean;

  progress?: number;

  result: ThemeDraft | null;

  error: string | null;

}


// ============================================================================
// THEME PREVIEW STATE
// ============================================================================

export interface ThemePreviewState {

  isPreviewing: boolean;

  device: ThemeDevice;

  previewUrl?: string | null;

}


// ============================================================================
// THEME STATE
// ============================================================================

export interface ThemeState {

  themes: Theme[];

  selectedTheme: Theme | null;

  draft: ThemeDraft | null;

  isLoading: boolean;

  isSaving: boolean;

  isLoaded: boolean;

  isPreviewing: boolean;

  generation: ThemeGenerationState;

  error: string | null;

}
