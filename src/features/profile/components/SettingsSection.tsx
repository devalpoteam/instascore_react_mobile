// src/features/profile/components/SettingsSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { SettingsItemProps, SettingsSectionProps } from '../types/profile.types';

function SettingsItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  iconColor = getColor.gray[600],
  showBadge = false,
  badgeText
}: SettingsItemProps) {
  const responsive = useResponsive();

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsive.spacing.lg,
        paddingVertical: responsive.spacing.lg,
        backgroundColor: getColor.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: getColor.gray[100],
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Ícono */}
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: `${iconColor}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsive.spacing.md,
      }}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>

      {/* Contenido */}
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: subtitle ? 4 : 0,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '600',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            flex: 1,
          }}>
            {title}
          </Text>
          
          {showBadge && badgeText && (
            <View style={{
              backgroundColor: getColor.secondary[500],
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
              marginLeft: responsive.spacing.sm,
            }}>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                fontWeight: '600',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}>
                {badgeText}
              </Text>
            </View>
          )}
        </View>
        
        {subtitle && (
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.sm * 1.3,
          }}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Flecha */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={getColor.gray[400]} 
      />
    </TouchableOpacity>
  );
}

export default function SettingsSection({
  onNotificationSettings,
  onSubscriptionManage,
  onLogout,
  isPro
}: SettingsSectionProps) {
  const responsive = useResponsive();

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      borderRadius: 16,
      marginHorizontal: responsive.spacing.lg,
      marginVertical: responsive.spacing.lg, // CAMBIADO: más espacio vertical
      marginBottom: responsive.spacing.xl, // AGREGADO: más espacio en la parte inferior
      borderWidth: 1,
      borderColor: getColor.gray[200],
      shadowColor: getColor.gray[400],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden',
    }}>
      {/* CAMBIADO: Configuraciones en lugar de Notificaciones */}
      <SettingsItem
        icon="settings-outline"
        title="Configuraciones"
        subtitle="Editar datos y cambiar contraseña"
        type="navigation"
        onPress={onNotificationSettings}
        iconColor={getColor.primary[500]}
      />

      <SettingsItem
        icon={isPro ? "star" : "star-outline"}
        title={isPro ? "Gestionar suscripción" : "Actualizar a Pro"}
        subtitle={isPro ? "Plan Pro activo" : "Desbloquear todas las funciones"}
        type="navigation"
        onPress={onSubscriptionManage}
        iconColor={isPro ? getColor.secondary[500] : getColor.warning[500]}
        showBadge={isPro}
        badgeText={isPro ? 'PRO' : undefined}
      />

      {/* Cerrar sesión - separado visualmente */}
      <View style={{
        borderTopWidth: 8,
        borderTopColor: getColor.gray[100],
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: responsive.spacing.lg,
            paddingVertical: responsive.spacing.xl,
            backgroundColor: getColor.background.primary,
          }}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${getColor.error[500]}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsive.spacing.md,
          }}>
            <Ionicons 
              name="log-out-outline" 
              size={22} 
              color={getColor.error[500]} 
            />
          </View>

          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '600',
            color: getColor.error[500],
            fontFamily: 'Nunito',
            flex: 1,
          }}>
            Cerrar sesión
          </Text>

          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={getColor.error[400]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}