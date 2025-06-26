// src/shared/components/layout/BottomNavigation.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface TabItem {
  name: string;
  label: string;
  iconActive: string;
  iconInactive: string;
}

const tabItems: TabItem[] = [
  {
    name: 'Home',
    label: 'Inicio',
    iconActive: 'home',
    iconInactive: 'home-outline'
  },
  {
    name: 'Resultados',
    label: 'En Vivo',
    iconActive: 'play-circle',
    iconInactive: 'play-circle-outline'
  },
  {
    name: 'Campeonatos',
    label: 'Campeonato',
    iconActive: 'trophy',
    iconInactive: 'trophy-outline'
  },
  {
    name: 'Gimnastas',
    label: 'Gimnastas',
    iconActive: 'people',
    iconInactive: 'people-outline'
  },
  {
    name: 'Ajustes',
    label: 'Ajustes',
    iconActive: 'settings',
    iconInactive: 'settings-outline'
  }
];

export default function BottomNavigation() {
  const navigation = useNavigation();
  const responsive = useResponsive();
  
  // Obtener la ruta activa
  const currentRoute = useNavigationState(state => {
    if (!state || !state.routes || state.index === undefined) return null;
    return state.routes[state.index]?.name;
  });

  const handleTabPress = (tabName: string) => {
    navigation.navigate(tabName as never);
  };

  // Calcular altura dinámica según dispositivo - ANDROID AUMENTADO
  const getTabBarHeight = () => {
    if (responsive.isTablet) return 90;
    if (responsive.isIOS) return responsive.insets.bottom > 0 ? 85 : 75; // iPhone con/sin notch
    return 70; // Android - AUMENTADO de 65 a 70
  };

  // Calcular padding bottom dinámico - ANDROID AUMENTADO
  const getBottomPadding = () => {
    if (responsive.isTablet) return 12;
    if (responsive.isIOS) return responsive.insets.bottom > 0 ? responsive.insets.bottom : 8;
    return 12; // Android - AUMENTADO de 8 a 12
  };

  // Calcular tamaño de fuente dinámico
  const getFontSize = () => {
    if (responsive.isTablet) return responsive.fontSize.sm;
    if (responsive.isSmall) return 10; // Pantallas muy pequeñas
    return responsive.fontSize.xs;
  };

  // Calcular tamaño de ícono dinámico
  const getIconSize = (isActive: boolean) => {
    if (responsive.isTablet) return isActive ? 28 : 26;
    if (responsive.isSmall) return isActive ? 22 : 20;
    return isActive ? 24 : 22;
  };

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      borderTopWidth: 1,
      borderTopColor: getColor.gray[200],
      height: getTabBarHeight(),
      paddingBottom: getBottomPadding(),
      paddingTop: responsive.isTablet ? 12 : 6,
      paddingHorizontal: responsive.isSmall ? 4 : 8,
      shadowColor: getColor.primary[500],
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start', // Cambiar a flex-start para mejor control
    }}>
      {tabItems.map((tab) => {
        const isActive = currentRoute === tab.name;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start', // Alinear desde arriba
              paddingVertical: responsive.isTablet ? 8 : 4,
              paddingHorizontal: responsive.isSmall ? 2 : 4,
              minHeight: responsive.isTablet ? 60 : 45,
            }}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            {/* Contenedor del ícono */}
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: responsive.isTablet ? 36 : 28,
              height: responsive.isTablet ? 36 : 28,
              borderRadius: responsive.isTablet ? 18 : 14,
              backgroundColor: isActive ? getColor.primary[50] : 'transparent',
              marginBottom: responsive.isTablet ? 6 : 3,
            }}>
              <Ionicons
                name={isActive ? tab.iconActive as any : tab.iconInactive as any}
                size={getIconSize(isActive)}
                color={isActive ? getColor.primary[500] : getColor.gray[400]}
              />
            </View>
            
            {/* Label con mejor espaciado */}
            <Text 
              style={{
                fontSize: getFontSize(),
                fontWeight: isActive ? '600' : '400',
                fontFamily: 'Nunito',
                color: isActive ? getColor.primary[500] : getColor.gray[400],
                textAlign: 'center',
                lineHeight: getFontSize() * 1.2,
                maxWidth: responsive.isSmall ? 50 : 65, // Limitar ancho para evitar solapamiento
              }}
              numberOfLines={1}
              adjustsFontSizeToFit={responsive.isSmall} // Auto-ajustar en pantallas pequeñas
              minimumFontScale={0.8}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}