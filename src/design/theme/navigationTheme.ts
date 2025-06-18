// src/design/theme/navigationTheme.ts
// Tema oficial de React Navigation para InstaScore

import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

// ============================================================================
// COLORES OFICIALES INSTASCORE
// ============================================================================
const INSTASCORE_COLORS = {
  primary: '#1105AD',        // Azul oficial
  secondary: '#F5A201',      // Naranja oficial
  background: '#FFFFFF',     // Fondo principal
  surface: '#FAFAFA',        // Superficie secundaria
  neutral: {
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
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
};

// ============================================================================
// TEMA CLARO INSTASCORE
// ============================================================================
export const InstaScoreLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // ✅ SOLO PROPIEDADES ESTÁNDAR DE REACT NAVIGATION
    primary: INSTASCORE_COLORS.primary,
    background: INSTASCORE_COLORS.background,
    card: INSTASCORE_COLORS.background,
    text: INSTASCORE_COLORS.neutral[800],
    border: INSTASCORE_COLORS.neutral[200],
    notification: INSTASCORE_COLORS.secondary,
  },
};

// ============================================================================
// TEMA OSCURO INSTASCORE (Para futuro)
// ============================================================================
export const InstaScoreDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    // ✅ SOLO PROPIEDADES ESTÁNDAR DE REACT NAVIGATION
    primary: INSTASCORE_COLORS.primary,
    background: INSTASCORE_COLORS.neutral[900],
    card: INSTASCORE_COLORS.neutral[800],
    text: INSTASCORE_COLORS.neutral[100],
    border: INSTASCORE_COLORS.neutral[700],
    notification: INSTASCORE_COLORS.secondary,
  },
};

// ============================================================================
// CONFIGURACIÓN DE STACK NAVIGATORS
// ============================================================================
export const getStackNavigatorOptions = (theme: Theme) => ({
  headerStyle: {
    backgroundColor: theme.colors.card,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitleStyle: {
    fontFamily: 'Nunito',
    fontWeight: '600' as const,
    fontSize: 18,
    color: theme.colors.text,
  },
  headerTintColor: theme.colors.primary,
  headerBackTitleVisible: false,
  cardStyle: {
    backgroundColor: theme.colors.background,
  },
});

// ============================================================================
// CONFIGURACIÓN DE TAB NAVIGATORS
// ============================================================================
export const getTabNavigatorOptions = (theme: Theme) => ({
  tabBarStyle: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
    elevation: 8,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.text + '60', // 60% opacity
  tabBarLabelStyle: {
    fontFamily: 'Nunito',
    fontWeight: '500' as const,
    fontSize: 12,
  },
  tabBarIconStyle: {
    marginBottom: -2,
  },
});

// ============================================================================
// CONFIGURACIÓN DE DRAWER (Para futuro)
// ============================================================================
export const getDrawerNavigatorOptions = (theme: Theme) => ({
  drawerStyle: {
    backgroundColor: theme.colors.card,
    width: 280,
  },
  drawerActiveTintColor: theme.colors.primary,
  drawerInactiveTintColor: theme.colors.text,
  drawerLabelStyle: {
    fontFamily: 'Nunito',
    fontWeight: '500' as const,
    fontSize: 16,
  },
  drawerItemStyle: {
    marginVertical: 2,
  },
});

// ============================================================================
// CONFIGURACIONES ESPECÍFICAS PARA INSTASCORE
// ============================================================================

// Configuración para pantallas de autenticación
export const getAuthStackOptions = (theme: Theme) => ({
  ...getStackNavigatorOptions(theme),
  headerShown: false, // Sin header en auth
  cardStyle: {
    backgroundColor: theme.colors.background,
  },
  cardStyleInterpolator: ({ current }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
});

// Configuración para pantallas principales
export const getMainStackOptions = (theme: Theme) => ({
  ...getStackNavigatorOptions(theme),
  headerShown: true,
  animation: 'slide_from_right' as const,
});

// Configuración para modales
export const getModalStackOptions = (theme: Theme) => ({
  ...getStackNavigatorOptions(theme),
  presentation: 'modal' as const,
  headerShown: true,
  headerStyle: {
    ...getStackNavigatorOptions(theme).headerStyle,
    backgroundColor: theme.colors.card, // ✅ USAR SOLO PROPIEDADES ESTÁNDAR
  },
});

// ============================================================================
// HOOK PARA USAR EL TEMA CORRECTO
// ============================================================================
export const useInstaScoreTheme = (isDark: boolean = false): Theme => {
  return isDark ? InstaScoreDarkTheme : InstaScoreLightTheme;
};

// ============================================================================
// UTILIDADES PARA COLORES PERSONALIZADOS INSTASCORE
// ============================================================================
export const getInstaScoreColors = () => INSTASCORE_COLORS;

// Función para obtener colores adicionales que no están en React Navigation
export const getExtendedColors = (isDark: boolean = false) => ({
  surface: isDark ? INSTASCORE_COLORS.neutral[800] : INSTASCORE_COLORS.surface,
  onSurface: isDark ? INSTASCORE_COLORS.neutral[200] : INSTASCORE_COLORS.neutral[700],
  accent: INSTASCORE_COLORS.secondary,
  success: INSTASCORE_COLORS.status.success,
  warning: INSTASCORE_COLORS.status.warning,
  error: INSTASCORE_COLORS.status.error,
  info: INSTASCORE_COLORS.status.info,
});

// ============================================================================
// UTILIDADES PARA COLORES DE ESTADO EN NAVEGACIÓN
// ============================================================================
export const getStatusBarStyle = (theme: Theme) => {
  // Para iOS principalmente
  return theme.dark ? 'light-content' : 'dark-content';
};

export const getNavigationBarColor = (theme: Theme) => {
  // Para Android principalmente
  return theme.colors.card;
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
  light: InstaScoreLightTheme,
  dark: InstaScoreDarkTheme,
  useTheme: useInstaScoreTheme,
  stack: getStackNavigatorOptions,
  tab: getTabNavigatorOptions,
  drawer: getDrawerNavigatorOptions,
  auth: getAuthStackOptions,
  main: getMainStackOptions,
  modal: getModalStackOptions,
  // ✅ NUEVAS UTILIDADES PARA COLORES
  colors: getInstaScoreColors,
  extendedColors: getExtendedColors,
};