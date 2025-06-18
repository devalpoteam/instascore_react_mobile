// src/design-system/tokens.ts
// Design Tokens Oficiales basados en Manual de Marca InstaScore

export const designTokens = {
  // Colores oficiales del Manual de Marca
  colors: {
    // Colores principales

    //AZUL
    primary: {
      500: '#1105AD', // Azul oscuro oficial - RGB: 17, 5, 173
      400: '#2916BD', // Variación más clara
      600: '#0D049D', // Variación más oscura
      50: '#E8E6FF',  // Muy claro para backgrounds
      100: '#C7C2FF', // Claro para estados hover
    },
    
    //NARANJA
    secondary: {
      500: '#F5A201', // Naranja oficial - RGB: 245, 162, 1
      400: '#F7B422', // Variación más clara
      600: '#E8920C', // Variación más oscura
      50: '#FFF8E6',  // Muy claro para backgrounds
      100: '#FFECB3', // Claro para estados hover
    },
    
    // Colores neutros para UI
    neutral: {
      50: '#FAFAFA',   // Fondo más claro
      100: '#F5F5F5',  // Fondo claro
      200: '#E5E5E5',  // Bordes claros
      300: '#D4D4D4',  // Bordes
      400: '#A3A3A3',  // Texto secundario
      500: '#737373',  // Texto terciario
      600: '#525252',  // Texto secundario oscuro
      700: '#404040',  // Texto principal
      800: '#262626',  // Texto muy oscuro
      900: '#171717',  // Negro
    },
    
    // Estados del sistema
    status: {
      success: {
        500: '#10B981',
        100: '#D1FAE5',
      },
      warning: {
        500: '#F59E0B',
        100: '#FEF3C7',
      },
      error: {
        500: '#EF4444',
        100: '#FEE2E2',
      },
      info: {
        500: '#3B82F6',
        100: '#DBEAFE',
      }
    },
    
    // Background oficiales
    background: {
      primary: '#F5EED5',     // Fondo principal
      secondary: '#FAFAFA',   // Fondo secundario
      tertiary: '#F5F5F5',    // Fondo terciario
      brand: '#E8E6FF',       // Fondo con tinte de marca
    },
    
    // Superficies (cards, modals, etc)
    surface: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      elevated: '#FFFFFF', // Con sombra
    }
  },
  
  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 64,
    '5xl': 80,
  },
  
  // Tipografía basada en Manual de Marca
  typography: {
    // Montserrat para elementos de marca y títulos principales
    brand: {
      fontFamily: 'Montserrat',
      weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      }
    },
    
    // Nunito para texto general y secundario
    body: {
      fontFamily: 'Nunito',
      weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      }
    },
    
    // Scale de tamaños
    size: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  // Sombras siguiendo las directrices del manual
  shadows: {
    none: 'none',
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
  },
  
  // Tamaños para elementos interactivos
  sizes: {
    button: {
      sm: { height: 32, paddingHorizontal: 12 },
      md: { height: 40, paddingHorizontal: 16 },
      lg: { height: 48, paddingHorizontal: 20 },
      xl: { height: 56, paddingHorizontal: 24 },
    },
    input: {
      sm: { height: 32 },
      md: { height: 40 },
      lg: { height: 48 },
    },
    icon: {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      '2xl': 40,
    }
  },
  
  // Opacidades
  opacity: {
    disabled: 0.38,
    inactive: 0.54,
    secondary: 0.74,
    primary: 0.87,
    full: 1.0,
  }
};

// Utility function para obtener colores con opacidad
export const getColorWithOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Breakpoints para responsive design
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Export types para TypeScript
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type TypographyToken = keyof typeof designTokens.typography;