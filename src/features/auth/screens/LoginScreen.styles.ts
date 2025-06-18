// src/features/auth/screens/LoginScreen.styles.ts
import { ViewStyle, ImageStyle } from 'react-native';

// 🎨 COLORES LOCALES PARA INSTASCORE
export const COLORS = {
  primary: '#1105AD',
  secondary: '#F5A201', 
  background: '#FFFFFF', // ✅ FONDO BLANCO PRINCIPAL
  neutral: {
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
  },
  status: {
    error: '#EF4444',
    errorLight: '#FEE2E2',
  }
};

// 🏗️ FACTORY DE ESTILOS CORREGIDO
export const createLoginStyles = (responsive: any) => {
  
  // ✅ CONTENEDOR PRINCIPAL QUE FUERZA FONDO BLANCO
  const mainContainerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
    height: '100%',
  };

  // ✅ CONTENEDOR DE KEYBOARD AVOIDING VIEW
  const keyboardContainerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  };

  // ✅ ESTILO ESPECÍFICO PARA SCROLLVIEW
  const scrollViewStyle: ViewStyle = {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
  };

  const scrollContainerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    minHeight: '100%',
    width: '100%',
    paddingBottom: 50, // ✅ Espacio extra para teclado
  };

  const contentContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsive?.spacing?.lg || 20,
    paddingVertical: responsive?.spacing?.xl || 40,
    backgroundColor: COLORS.background,
    width: '100%',
    minHeight: '100%', // ✅ Asegura altura mínima
  };

  const logoContainerStyle: ViewStyle = {
    alignItems: 'center',
    marginBottom: responsive?.spacing?.xl || 32,
    backgroundColor: 'transparent',
  };

  const formContainerStyle: ViewStyle = {
    width: '100%' as any,
    maxWidth: responsive?.isTablet ? 400 : 350,
    backgroundColor: COLORS.background, // ✅ Fondo blanco explícito
  };

  const devButtonStyle: ViewStyle = {
    position: 'absolute',
    top: responsive?.insets?.top ? responsive.insets.top + (responsive?.spacing?.md || 16) : 50,
    right: responsive?.spacing?.md || 16,
    zIndex: 10,
    backgroundColor: COLORS.neutral[600],
    borderRadius: responsive?.isTablet ? 24 : 20,
    paddingHorizontal: responsive?.spacing?.sm || 12,
    paddingVertical: responsive?.spacing?.xs || 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  };

  const googleButtonStyle: ViewStyle = {
    width: '100%' as any,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: responsive?.isTablet ? 12 : 8,
    paddingVertical: responsive?.spacing?.md || 12,
    paddingHorizontal: responsive?.spacing?.md || 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsive?.spacing?.lg || 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  };

  const googleIconStyle: ImageStyle = {
    width: 20,
    height: 20,
    marginRight: responsive?.spacing?.sm || 8,
  };

  const separatorContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsive?.spacing?.md || 16,
    backgroundColor: 'transparent',
  };

  const separatorLineStyle: ViewStyle = {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[300],
  };

  const separatorTextStyle: ViewStyle = {
    paddingHorizontal: responsive?.spacing?.md || 16,
    backgroundColor: 'transparent',
  };

  const errorContainerStyle: ViewStyle = {
    backgroundColor: COLORS.status.errorLight,
    borderWidth: 1,
    borderColor: COLORS.status.error,
    padding: responsive?.spacing?.sm || 12,
    borderRadius: responsive?.isTablet ? 12 : 8,
    marginBottom: responsive?.spacing?.md || 16,
  };

  const logoImageStyle: ImageStyle = {
    width: responsive?.isTablet ? 300 : 250,
    height: responsive?.isTablet ? 180 : 150,
  };

  return {
    mainContainerStyle, // ✅ NUEVO
    keyboardContainerStyle, // ✅ NUEVO
    scrollViewStyle,
    scrollContainerStyle,
    contentContainerStyle,
    logoContainerStyle,
    formContainerStyle,
    devButtonStyle,
    googleButtonStyle,
    googleIconStyle,
    separatorContainerStyle,
    separatorLineStyle,
    separatorTextStyle,
    errorContainerStyle,
    logoImageStyle,
  };
};