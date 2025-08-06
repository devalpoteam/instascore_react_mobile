// src/features/settings/screens/NotificationSettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import { MainStackParamList } from '@/navigation/MainNavigator';

// ✅ TIPOS SEGÚN DOCUMENTACIÓN - SOLO LO BÁSICO
interface NotificationPreferences {
  // CU-NOTIF-01: Notificación de Cierre de Categoría
  categoryResults: boolean;
  
  // CU-NOTIF-03: Notificación de Copa Finalizada  
  championshipEnd: boolean;
  
  // CU-NOTIF-02: Configurar preferencias (master switch)
  notificationsEnabled: boolean;
}

type MainNavigationProp = NavigationProp<MainStackParamList>;

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<MainNavigationProp>();
  const responsive = useResponsive();

  // ✅ ESTADO SIMPLIFICADO - SOLO LO DOCUMENTADO
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    notificationsEnabled: true,
    categoryResults: true,
    championshipEnd: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    // Simular guardado según CU-NOTIF-02
    Alert.alert(
      'Preferencias Guardadas',
      'Tus configuraciones de notificaciones han sido actualizadas',
      [
        { 
          text: 'OK', 
          onPress: () => {
            setHasChanges(false);
          }
        }
      ]
    );
  };

  const renderPreferenceItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string,
    disabled: boolean = false
  ) => (
    <View style={{
      backgroundColor: getColor.background.primary,
      marginHorizontal: responsive.spacing.md,
      marginBottom: responsive.spacing.sm,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: getColor.gray[200],
      opacity: disabled ? 0.5 : 1,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsive.spacing.lg,
      }}>
        {/* Ícono */}
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: `${getColor.primary[500]}20`,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: responsive.spacing.md,
        }}>
          <Ionicons name={icon as any} size={22} color={getColor.primary[500]} />
        </View>

        {/* Contenido */}
        <View style={{ flex: 1, marginRight: responsive.spacing.md }}>
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '600',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            marginBottom: 4,
          }}>
            {title}
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.sm * 1.3,
          }}>
            {subtitle}
          </Text>
        </View>

        {/* Switch */}
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: getColor.gray[300],
            true: getColor.primary[200],
          }}
          thumbColor={value ? getColor.primary[500] : getColor.gray[400]}
          ios_backgroundColor={getColor.gray[300]}
        />
      </View>
    </View>
  );

  return (
    <BaseLayout>
      <Header
        title="Configuración de Notificaciones"
        subtitle="Gestiona tus alertas"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showLogo={false}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: responsive.spacing.lg,
          paddingBottom: responsive.spacing['3xl'],
        }}
      >
        {/* Información descriptiva - CERRABLE */}
        {showInfoBanner && (
          <View style={{
            backgroundColor: getColor.primary[50],
            marginHorizontal: responsive.spacing.md,
            borderRadius: 12,
            padding: responsive.spacing.lg,
            marginBottom: responsive.spacing.xl,
            borderLeftWidth: 4,
            borderLeftColor: getColor.primary[500],
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <View style={{ flex: 1, marginRight: responsive.spacing.sm }}>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: '600',
                  color: getColor.primary[700],
                  fontFamily: 'Nunito',
                  marginBottom: responsive.spacing.xs,
                }}>
                  📱 Configuración de Notificaciones
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.sm,
                  color: getColor.primary[600],
                  fontFamily: 'Nunito',
                  lineHeight: responsive.fontSize.sm * 1.4,
                }}>
                  Configura qué notificaciones importantes quieres recibir durante los campeonatos.
                </Text>
              </View>
              
              {/* Botón cerrar */}
              <TouchableOpacity
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: getColor.primary[200],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setShowInfoBanner(false)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={14}
                  color={getColor.primary[600]}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* CU-NOTIF-02: Configuración Master */}
        {renderPreferenceItem(
          'Notificaciones Habilitadas',
          'Habilitar o deshabilitar todas las notificaciones push',
          preferences.notificationsEnabled,
          (value) => updatePreference('notificationsEnabled', value),
          'notifications'
        )}

        {/* Sección: Eventos de Campeonato */}
        <Text style={{
          fontSize: responsive.fontSize.lg,
          fontWeight: '700',
          color: getColor.primary[600],
          fontFamily: 'Nunito',
          marginLeft: responsive.spacing.lg,
          marginTop: responsive.spacing.lg,
          marginBottom: responsive.spacing.md,
        }}>
          🏆 Eventos de Campeonato
        </Text>

        {/* CU-NOTIF-01: Resultados de Categorías */}
        {renderPreferenceItem(
          'Resultados de Categorías',
          'Recibir notificación cuando se publican los resultados finales de una categoría',
          preferences.categoryResults,
          (value) => updatePreference('categoryResults', value),
          'trophy',
          !preferences.notificationsEnabled
        )}

        {/* CU-NOTIF-03: Copa Finalizada */}
        {renderPreferenceItem(
          'Finalización de Campeonatos',
          'Recibir notificación cuando un campeonato termina completamente',
          preferences.championshipEnd,
          (value) => updatePreference('championshipEnd', value),
          'checkmark-circle',
          !preferences.notificationsEnabled
        )}

        {/* Botón guardar */}
        {hasChanges && (
          <TouchableOpacity
            style={{
              backgroundColor: getColor.primary[500],
              borderRadius: 12,
              padding: responsive.spacing.lg,
              marginHorizontal: responsive.spacing.md,
              marginTop: responsive.spacing.xl,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleSavePreferences}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark"
              size={20}
              color={getColor.background.primary}
              style={{ marginRight: responsive.spacing.sm }}
            />
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              color: getColor.background.primary,
              fontFamily: 'Nunito',
            }}>
              Guardar Configuración
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </BaseLayout>
  );
}