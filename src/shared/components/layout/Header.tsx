// src/shared/components/layout/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean; // Nueva prop para mostrar logo
  logoWidth?: number; // Ancho personalizable del logo
  logoHeight?: number; // Alto personalizable del logo
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
}

export default function Header({
  title = 'InstaScore',
  subtitle,
  showLogo = false, // Por defecto false para mantener compatibilidad
  logoWidth,
  logoHeight,
  showBack = false,
  onBackPress,
  rightComponent,
  backgroundColor = getColor.background.primary,
}: HeaderProps) {
  const responsive = useResponsive();

  // Calcular tamaños del logo según el dispositivo y presencia de subtítulo
  const getLogoSize = () => {
    if (logoWidth && logoHeight) {
      return { width: logoWidth, height: logoHeight };
    }
    
    // Tamaños un poco más pequeños cuando NO hay subtítulo
    const hasSubtitle = Boolean(subtitle);
    
    if (responsive.isTablet) {
      return hasSubtitle 
        ? { width: 180, height: 60 } 
        : { width: 200, height: 68 }; // Reducido de 220x75
    } else if (responsive.isSmall) {
      return hasSubtitle 
        ? { width: 140, height: 50 } 
        : { width: 155, height: 58 }; // Reducido de 170x65
    } else {
      return hasSubtitle 
        ? { width: 160, height: 55 } 
        : { width: 175, height: 63 }; // Reducido de 190x70
    }
  };

  const logoSize = getLogoSize();

  return (
    <View style={{
      backgroundColor: backgroundColor,
      paddingHorizontal: responsive.spacing.md,
      paddingTop: responsive.insets.top || responsive.spacing.lg,
      paddingVertical: responsive.spacing.lg, // FIJO para todas las pestañas
      paddingBottom: responsive.spacing.md, // FIJO para todas las pestañas
      borderBottomWidth: 1,
      borderBottomColor: getColor.gray[200],
      shadowColor: getColor.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: responsive.isTablet ? 68 : 63, // ALTURA FIJA para todas las pestañas
      }}>
        
        {/* Left Side - Back button, Logo o Title */}
        <View style={{ 
          flex: 1, 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: showLogo ? 'flex-start' : 'flex-start' 
        }}>
          {showBack && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: getColor.background.brand,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: responsive.spacing.sm,
              }}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="arrow-back" 
                size={22} 
                color={getColor.primary[500]} 
              />
            </TouchableOpacity>
          )}
          
          {/* Logo o Título */}
          {showLogo ? (
            <View style={{ 
              flex: 1,
              alignItems: 'flex-start', // Más cerca del borde izquierdo
              justifyContent: subtitle ? 'flex-start' : 'center',
              marginLeft: -4, // Acercar más al borde izquierdo
            }}>
              <Image
                source={require('../../../../assets/images/logo.png')}
                style={{
                  width: logoSize.width,
                  height: logoSize.height,
                }}
                resizeMode="contain"
              />
              {subtitle && (
                <Text style={{
                  fontSize: responsive.fontSize.sm,
                  color: getColor.gray[600],
                  fontFamily: 'Nunito',
                  marginTop: 2,
                  textAlign: showBack ? 'left' : 'left',
                }}>
                  {subtitle}
                </Text>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: responsive.fontSize['2xl'],
                fontWeight: '700',
                color: getColor.primary[500],
                fontFamily: 'Montserrat',
              }}>
                {title}
              </Text>
              {subtitle && (
                <Text style={{
                  fontSize: responsive.fontSize.sm,
                  color: getColor.gray[600],
                  fontFamily: 'Nunito',
                  marginTop: 2,
                }}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}
        </View>
        
        {/* Right Side - Custom Component */}
        <View>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}