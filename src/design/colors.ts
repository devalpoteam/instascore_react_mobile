// src/design/colors.ts
// Colores oficiales InstaScore para React Native (basados en el Manual de Marca)

export const colors = {
  // Marca principal
  instascore: {
    blue: {
      50: '#E8E6FF',
      100: '#C7C2FF',
      400: '#2916BD',
      500: '#1105AD', // Color oficial del manual
      600: '#0D049D',
    },
    orange: {
      50: '#FFF8E6',
      100: '#FFECB3',
      400: '#F7B422',
      500: '#F5A201', // Color oficial del manual
      600: '#E8920C',
    }
  },
  
  // Alias para facilidad de uso
  primary: {
    50: '#E8E6FF',
    100: '#C7C2FF',
    400: '#2916BD',
    500: '#1105AD',
    600: '#0D049D',
  },
  secondary: {
    50: '#FFF8E6',
    100: '#FFECB3',
    400: '#F7B422',
    500: '#F5A201',
    600: '#E8920C',
  },
  
  // Neutros
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
  
  // Estados del sistema
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
  },
  
  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    brand: '#E8E6FF',
  }
};

// Sombras para React Native (equivalente a las de Tailwind)
export const shadows = {
  instascoreSm: {
    shadowColor: '#1105AD',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  instascore: {
    shadowColor: '#1105AD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instascoreMd: {
    shadowColor: '#1105AD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  instascoreLg: {
    shadowColor: '#1105AD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  orange: {
    shadowColor: '#F5A201',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  orangeLg: {
    shadowColor: '#F5A201',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Ejemplo de uso:
/*
import { colors, shadows } from '@/design/colors';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary[500],
    ...shadows.instascore,
  },
  secondaryButton: {
    backgroundColor: colors.secondary[500],
    ...shadows.orange,
  },
});
*/