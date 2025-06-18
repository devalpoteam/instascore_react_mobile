// ============================================================================
// DESIGN TOKENS
// ============================================================================
export { designTokens, getColorWithOpacity } from './tokens';
export type { ColorToken, SpacingToken, TypographyToken } from './tokens';

// ============================================================================
// TYPES
// ============================================================================
export type {
  FontWeight,
  ComponentSize,
  ButtonVariant,
  InputType,
  TextVariant,
  ShadowVariant,
  StatusVariant,
  BaseComponentProps,
  SizeableComponentProps,
  DisableableComponentProps,
  LoadableComponentProps,
  InteractiveComponentProps,
  ValidatableInputProps,
  ResponsiveProps,
  AccessibilityProps,
  IconProps,
  LayoutProps,
  AnimationProps,
} from './types';

// ============================================================================
// HOOKS
// ============================================================================
export { 
  useResponsive, 
  useAdaptiveStyles, 
  getAdaptiveShadow 
} from '@/shared/hooks/useResponsive';
export type { ResponsiveConfig } from '@/shared/hooks/useResponsive';

// ============================================================================
// COMPONENTES PRINCIPALES
// ============================================================================

// Botones
export {
  InstaScoreButton,
  InstaScorePrimaryButton,
  InstaScoreSecondaryButton,
  InstaScoreOutlineButton,
  InstaScoreGhostButton,
} from './components/InstaScoreButton';

// Inputs
export {
  InstaScoreInput,
  InstaScoreEmailInput,
  InstaScorePasswordInput,
  InstaScoreSearchInput,
  InstaScoreNumberInput,
  useInputValidation,
} from './components/InstaScoreInput';

// Cards
export {
  InstaScoreCard,
  InstaScoreResultCard,
  InstaScoreStatsCard,
} from './components/InstaScoreCard';

// Tipografía
export {
  InstaScoreText,
  InstaScoreHeading,
  InstaScoreBody,
  InstaScoreCaption,
  InstaScoreLabel,
  InstaScoreLogo,
} from './components/InstaScoreText';

// ============================================================================
// TEMA DE NAVEGACIÓN
// ============================================================================
export {
  InstaScoreLightTheme,
  InstaScoreDarkTheme,
  getStackNavigatorOptions,
  getTabNavigatorOptions,
  getAuthStackOptions,
  getMainStackOptions,
  useInstaScoreTheme,
} from './theme/navigationTheme';

// ============================================================================
// UTILIDADES
// ============================================================================
export const INSTASCORE_CONSTANTS = {
  BRAND_NAME: 'InstaScore',
  PRIMARY_COLOR: '#1105AD',
  SECONDARY_COLOR: '#F5A201',
  MIN_TOUCH_TARGET: 44,
  ANIMATION_DURATION: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
} as const;