// src/design/colorHelper.ts - VERSIÓN SIMPLE Y SIN ERRORES DE TYPESCRIPT
// ✅ ÚNICA fuente de verdad: coincide con tailwind.config.js

export const getColor = {
  // Primarios - COMPLETO con todos los tonos
  primary: {
    25: '#F4F3FF',
    50: '#E8E6FF',
    100: '#C7C2FF', 
    200: '#A29AFF',
    300: '#7D72FF',
    400: '#2916BD',
    500: '#1105AD', // Color oficial del manual
    600: '#0D049D',
    700: '#0A0485',
    800: '#070366',
    900: '#050247',
  },
  
  // Secundarios - COMPLETO
  secondary: {
    25: '#FFFCF0',
    50: '#FFF8E6',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#F7B422', 
    500: '#F5A201', // Color oficial del manual
    600: '#E8920C',
    700: '#D2830B',
    800: '#BC740A',
    900: '#A66509',
  },
  
  // Grises
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Estados - COMPLETO
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857', // ✅ El que faltaba!
    800: '#065F46',
    900: '#064E3B',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    lighter: '#F5EED5',
    brand: '#E8E6FF',
  },
  
  // Comunes
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ✅ OPCIONAL: Función simple para debugging sin TypeScript complicado
export const logMissingColor = (colorPath: string): void => {
  if (__DEV__) {
    console.warn(`⚠️ Intentando usar color: ${colorPath}`);
  }
};

// ✅ Ejemplo de uso:
// import { getColor } from '@/design/colorHelper';
// 
// backgroundColor: getColor.primary[500]    // ✅ '#1105AD'
// color: getColor.success[700]              // ✅ '#047857'
// borderColor: getColor.primary[25]         // ✅ '#F4F3FF'