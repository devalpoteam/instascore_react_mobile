// src/design-system/types.ts
// Tipos centralizados para el Design System de InstaScore

// TIPOS BÁSICOS PRIMERO
// Font weights permitidos por React Native
export type FontWeight = 
  | '100' 
  | '200' 
  | '300' 
  | '400' 
  | '500' 
  | '600' 
  | '700' 
  | '800' 
  | '900' 
  | 'normal' 
  | 'bold';

// Tamaños de componentes
export type ComponentSize = 'sm' | 'md' | 'lg';

// Variantes de botones
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

// Tipos de input
export type InputType = 'email' | 'password' | 'text' | 'number' | 'phone';

// Variantes de texto
export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

// Sombras
export type ShadowVariant = 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl';

// Status de estados
export type StatusVariant = 'success' | 'warning' | 'error' | 'info';

// Breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// INTERFACES DESPUÉS (que usan los tipos de arriba)
// Props comunes de componentes
export interface BaseComponentProps {
  className?: string;
  style?: object;
  testID?: string;
}

// Props de componentes con tamaño
export interface SizeableComponentProps extends BaseComponentProps {
  size?: ComponentSize;
}

// Props de componentes con estado disabled
export interface DisableableComponentProps extends BaseComponentProps {
  disabled?: boolean;
}

// Props de componentes con loading
export interface LoadableComponentProps extends BaseComponentProps {
  loading?: boolean;
}

// Props de componentes interactivos
export interface InteractiveComponentProps 
  extends BaseComponentProps, DisableableComponentProps, LoadableComponentProps {
  onPress?: () => void;
}

// Props de input con validación
export interface ValidatableInputProps extends BaseComponentProps {
  error?: string;
  required?: boolean;
}

// Responsive props
export interface ResponsiveProps {
  isSmall?: boolean;
  isMedium?: boolean;
  isLarge?: boolean;
  isTablet?: boolean;
  isLandscape?: boolean;
}

// Props de accesibilidad
export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

// Icon props type
export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

// Layout props
export interface LayoutProps {
  fullWidth?: boolean;
  centered?: boolean;
  flex?: number;
}

// Animation props
export interface AnimationProps {
  animated?: boolean;
  duration?: number;
  delay?: number;
}

// TIPOS QUE DEPENDEN DE IMPORTS (al final)
// Nota: Estos se comentan por ahora para evitar errores de importación circular
// Se pueden descomentar una vez que tokens.ts esté creado

/*
// Colores del design system
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type TypographyToken = keyof typeof designTokens.typography;

// Theme context type
export interface ThemeContextType {
  colors: typeof designTokens.colors;
  spacing: typeof designTokens.spacing;
  typography: typeof designTokens.typography;
  shadows: typeof designTokens.shadows;
  borderRadius: typeof designTokens.borderRadius;
}
*/