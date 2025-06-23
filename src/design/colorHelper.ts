// src/design/colorHelper.ts
// Helper para obtener colores hex desde tailwind.config.js de forma consistente
// ✅ ÚNICA fuente de verdad: estos valores deben coincidir EXACTAMENTE con tailwind.config.js

export const getColor = {
  // Primarios (copiados exactamente del tailwind.config.js)
  primary: {
    50: '#E8E6FF',
    100: '#C7C2FF', 
    400: '#2916BD',
    500: '#1105AD', // Color oficial del manual
    600: '#0D049D',
  },
  
  // Secundarios (copiados exactamente del tailwind.config.js)
  secondary: {
    50: '#FFF8E6',
    100: '#FFECB3',
    400: '#F7B422', 
    500: '#F5A201', // Color oficial del manual
    600: '#E8920C',
  },
  
  // Grises (copiados exactamente del tailwind.config.js)
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
  
  // Estados (copiados exactamente del tailwind.config.js)
  error: {
    500: '#EF4444',
    100: '#FEE2E2',
  },
  success: {
    500: '#10B981',
    100: '#D1FAE5',
  },
  warning: {
    500: '#F59E0B',
    100: '#FEF3C7',
  },
  info: {
    500: '#3B82F6',
    100: '#DBEAFE',
  },
  
  // Backgrounds (copiados exactamente del tailwind.config.js)
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    lighter: '#F5EED5',
    brand: '#E8E6FF',
  },
  
  // Comunes
  white: '#FFFFFF',
  black: '#000000',
};

// ✅ Ejemplo de uso correcto:
// import { getColor } from '@/design/colorHelper';
// 
// // Para Ionicons:
// <Ionicons color={getColor.primary[500]} />
// 
// // Para StatusBar:
// <StatusBar backgroundColor={getColor.background.primary} />
// 
// // Para placeholderTextColor:
// placeholderTextColor={getColor.gray[400]}