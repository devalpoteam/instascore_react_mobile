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
  showNotifications?: boolean;
  showBack?: boolean;
  onNotificationPress?: () => void;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  // ✅ NUEVAS PROPS PARA NOTIFICACIONES
  notificationCount?: number; // Número de notificaciones no leídas
}

export default function Header({
  title = 'InstaScore',
  subtitle,
  showLogo = false, // Por defecto false para mantener compatibilidad
  logoWidth,
  logoHeight,
  showNotifications = true,
  showBack = false,
  onNotificationPress,
  onBackPress,
  rightComponent,
  backgroundColor = getColor.background.primary,
  // ✅ NUEVA PROP CON VALOR POR DEFECTO
  notificationCount = 0,
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
        
        {/* Right Side - Notifications o Custom Component */}
        <View>
          {rightComponent || (
            showNotifications && (
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: getColor.background.brand,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative', // ✅ Para posicionar el badge
                }}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="notifications-outline" 
                  size={22} 
                  color={getColor.primary[500]} 
                />
                
                {/* ✅ BADGE DE NOTIFICACIONES NO LEÍDAS */}
                {notificationCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: getColor.secondary[500],
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: getColor.background.primary,
                  }}>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      fontWeight: '700',
                      color: getColor.background.primary,
                      fontFamily: 'Nunito',
                      lineHeight: responsive.fontSize.xs,
                    }}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
  );
}