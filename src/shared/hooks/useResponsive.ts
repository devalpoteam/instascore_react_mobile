// src/hooks/useResponsive.ts
// Hook para diseño responsive inteligente en iOS y Android

import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// Tipos locales para evitar dependencias circulares
type ComponentSize = 'sm' | 'md' | 'lg';
type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
type ShadowVariant = 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl';

// Definir tokens básicos localmente para evitar imports circulares
const basicTokens = {
  colors: {
    primary: { 500: '#1105AD' },
    neutral: { 400: '#A3A3A3' },
  },
  shadows: {
    none: {},
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 5,
    }
  }
};

export interface ResponsiveConfig {
  // Dimensiones
  width: number;
  height: number;
  
  // Breakpoints
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  
  // Platform specific
  isIOS: boolean;
  isAndroid: boolean;
  
  // Safe areas
  insets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  
  // Espaciado adaptativo
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  
  // Tipografía adaptativa
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  
  // Utilidades
  wp: (percentage: number) => number;
  hp: (percentage: number) => number;
  normalize: (size: number) => number;
  getInputHeight: () => number;
  getButtonHeight: (size?: ComponentSize) => number;
  getCardPadding: () => number;
  getHeaderHeight: () => number;
}

export const useResponsive = (): ResponsiveConfig => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  // Breakpoints basados en las mejores prácticas mobile
  const breakpoints = {
    sm: 375,  // iPhone SE
    md: 414,  // iPhone Pro
    lg: 768,  // iPad mini
    xl: 1024, // iPad
  };
  
  // Detectar tipo de dispositivo
  const isSmall = width < breakpoints.sm;
  const isMedium = width >= breakpoints.sm && width < breakpoints.lg;
  const isLarge = width >= breakpoints.lg && width < breakpoints.xl;
  const isTablet = width >= breakpoints.lg;
  const isLandscape = width > height;
  
  // Platform detection
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';
  
  // Función para normalizar tamaños según el dispositivo
  const normalize = (size: number): number => {
    const scale = width / 375; // Base iPhone 11
    const newSize = size * scale;
    
    if (isTablet) {
      return Math.max(newSize * 1.1, size);
    }
    
    return Math.max(newSize, size * 0.85);
  };
  
  // Espaciado adaptativo basado en el dispositivo
  const spacing = {
    xs: isTablet ? 6 : isSmall ? 3 : 4,
    sm: isTablet ? 12 : isSmall ? 6 : 8,
    md: isTablet ? 24 : isSmall ? 12 : 16,
    lg: isTablet ? 32 : isSmall ? 18 : 24,
    xl: isTablet ? 48 : isSmall ? 24 : 32,
    '2xl': isTablet ? 64 : isSmall ? 32 : 40,
    '3xl': isTablet ? 80 : isSmall ? 40 : 48,
  };
  
  // Tipografía adaptativa
  const fontSize = {
    xs: normalize(12),
    sm: normalize(14),
    base: normalize(16),
    lg: normalize(18),
    xl: normalize(20),
    '2xl': normalize(24),
    '3xl': normalize(30),
    '4xl': normalize(36),
  };
  
  // Utility functions
  const wp = (percentage: number): number => (width * percentage) / 100;
  const hp = (percentage: number): number => (height * percentage) / 100;
  
  // Componente-specific dimensions
  const getInputHeight = (): number => {
    if (isTablet) return 52;
    if (isSmall) return 40;
    return 44; // iOS standard
  };
  
  const getButtonHeight = (size: ComponentSize = 'md'): number => {
    const heights = {
      sm: isTablet ? 36 : isSmall ? 32 : 36,
      md: isTablet ? 48 : isSmall ? 40 : 44,
      lg: isTablet ? 56 : isSmall ? 48 : 52,
    };
    return heights[size];
  };
  
  const getCardPadding = (): number => {
    return isTablet ? 24 : isSmall ? 12 : 16;
  };
  
  const getHeaderHeight = (): number => {
    if (isIOS) {
      return isTablet ? 64 : 56;
    }
    return isTablet ? 64 : 56;
  };
  
  return {
    // Dimensiones básicas
    width,
    height,
    
    // Breakpoints
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    isLandscape,
    
    // Platform
    isIOS,
    isAndroid,
    
    // Safe areas
    insets,
    
    // Espaciado adaptativo
    spacing,
    
    // Tipografía adaptativa
    fontSize,
    
    // Utilidades
    wp,
    hp,
    normalize,
    getInputHeight,
    getButtonHeight,
    getCardPadding,
    getHeaderHeight,
  };
};

// Hook específico para estilos adaptativos
export const useAdaptiveStyles = () => {
  const responsive = useResponsive();
  
  const getContainerStyle = () => ({
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
  });
  
  const getCardStyle = () => ({
    padding: responsive.getCardPadding(),
    borderRadius: responsive.isTablet ? 16 : 12,
    marginBottom: responsive.spacing.sm,
    ...basicTokens.shadows.base,
  });
  
  const getButtonStyle = (size: ComponentSize = 'md') => ({
    height: responsive.getButtonHeight(size),
    paddingHorizontal: responsive.spacing.md,
    borderRadius: responsive.isTablet ? 12 : 8,
  });
  
  const getInputStyle = () => ({
    height: responsive.getInputHeight(),
    paddingHorizontal: responsive.spacing.md,
    borderRadius: responsive.isTablet ? 12 : 8,
    fontSize: responsive.fontSize.base,
  });
  
  const getTextStyle = (variant: TextVariant) => {
    const styles = {
      h1: {
        fontSize: responsive.fontSize['3xl'],
        fontWeight: '700' as FontWeight,
        fontFamily: 'Montserrat',
        lineHeight: responsive.fontSize['3xl'] * 1.2,
      },
      h2: {
        fontSize: responsive.fontSize['2xl'],
        fontWeight: '600' as FontWeight,
        fontFamily: 'Montserrat',
        lineHeight: responsive.fontSize['2xl'] * 1.25,
      },
      h3: {
        fontSize: responsive.fontSize.xl,
        fontWeight: '600' as FontWeight,
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.xl * 1.3,
      },
      body: {
        fontSize: responsive.fontSize.base,
        fontWeight: '400' as FontWeight,
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.base * 1.5,
      },
      caption: {
        fontSize: responsive.fontSize.sm,
        fontWeight: '400' as FontWeight,
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.sm * 1.4,
      },
    };
    
    return styles[variant];
  };
  
  return {
    responsive,
    getContainerStyle,
    getCardStyle,
    getButtonStyle,
    getInputStyle,
    getTextStyle,
  };
};

// src/shared/hooks/useResponsive.ts - SOLO LA FUNCIÓN QUE NECESITAS ARREGLAR

// ✅ FUNCIÓN CORREGIDA - Reemplaza tu función actual por esta
export const getAdaptiveShadow = (elevation: ShadowVariant = 'base', isAndroid: boolean): object => {
  if (isAndroid) {
    const elevations: Record<ShadowVariant, number> = {
      none: 0,
      sm: 1,
      base: 2,
      md: 3,
      lg: 4,
      xl: 5,
    };
    return { elevation: elevations[elevation] };
  }
  
  // Para iOS, retornar sombras CSS
  const shadows = {
    none: {},
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    }
  };
  
  return shadows[elevation] || shadows.base;
};