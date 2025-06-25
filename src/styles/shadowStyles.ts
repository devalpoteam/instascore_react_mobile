// src/styles/shadowStyles.ts
import { Platform } from 'react-native';

/**
 * Sistema de sombras optimizado para InstaScore
 * ✅ FUNCIONA INDEPENDIENTEMENTE DE NATIVEWIND
 * Compatible con iOS (shadowColor, shadowOffset) y Android (elevation)
 */
export const shadowStyles = {
  // Sombras principales InstaScore (azul corporativo)
  instascore: {
    sm: Platform.select({
      ios: {
        shadowColor: '#1105AD',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
        shadowColor: '#1105AD',
      },
    }),
    
    base: Platform.select({
      ios: {
        shadowColor: '#1105AD',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: '#1105AD',
      },
    }),
    
    md: Platform.select({
      ios: {
        shadowColor: '#1105AD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
        shadowColor: '#1105AD',
      },
    }),
    
    lg: Platform.select({
      ios: {
        shadowColor: '#1105AD',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
        shadowColor: '#1105AD',
      },
    }),
  },
  
  // Sombras naranja (secundarias)
  orange: {
    base: Platform.select({
      ios: {
        shadowColor: '#F5A201',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: '#F5A201',
      },
    }),
    
    lg: Platform.select({
      ios: {
        shadowColor: '#F5A201',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
        shadowColor: '#F5A201',
      },
    }),
  },
  
  // Sombras neutras para elementos generales
  neutral: {
    sm: Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
        shadowColor: '#000000',
      },
    }),
    
    base: Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: '#000000',
      },
    }),
    
    lg: Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
        shadowColor: '#000000',
      },
    }),
  },
};

// ✅ FUNCIONA INMEDIATAMENTE ASÍ:
// import { shadowStyles } from '@/styles/shadowStyles';
// <View style={shadowStyles.instascore.base} className="bg-white rounded-lg p-4">
//   <Text>Mi contenido con sombra</Text>
// </View>