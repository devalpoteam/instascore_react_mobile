// src/features/settings/screens/NotificationHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { shadowStyles } from '@/styles/shadowStyles';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { 
  NotificationHistoryItem, 
  NotificationHistoryScreenState 
} from '../types/settings.types';
import { 
  mockNotificationHistory,
  getNotificationIcon,
  getNotificationColor,
  getUnreadCount,
  getNotificationsByFilter
} from '../data/mockSettingsData';

type MainNavigationProp = NavigationProp<MainStackParamList>;

export default function NotificationHistoryScreen() {
  const navigation = useNavigation<MainNavigationProp>();
  const responsive = useResponsive();

  // Estado de la pantalla
  const [state, setState] = useState<NotificationHistoryScreenState>({
    notifications: [],
    isLoading: true,
    isRefreshing: false,
    filter: 'all',
  });

  // Cargar notificaciones al montar
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setState(prev => ({
        ...prev,
        notifications: mockNotificationHistory,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRefresh = async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadNotifications();
    setState(prev => ({ ...prev, isRefreshing: false }));
  };

  const handleNotificationPress = (notification: NotificationHistoryItem) => {
    // Marcar como leída si no lo estaba
    if (!notification.isRead) {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        ),
      }));
    }

    // Navegación según tipo de notificación
    if (notification.data?.campeonatoId && notification.data?.categoriaId) {
      // Navegar a resultados específicos
      Alert.alert(
        'Navegar a Resultados',
        `Ver los resultados de ${notification.title}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Ver Resultados', 
            onPress: () => {
              console.log('Navigating to results:', notification.data);
              // TODO: navigation.navigate('LiveResults', { ... });
            }
          },
        ]
      );
    } else if (notification.data?.gimnastaId) {
      // Navegar a perfil del gimnasta
      navigation.navigate('GimnastaProfile', { 
        gimnastaId: notification.data.gimnastaId 
      });
    } else {
      // Mostrar detalles de la notificación
      Alert.alert(notification.title, notification.body);
    }
  };

  const handleMarkAllAsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
    }));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar Historial',
      'Estás seguro de que quieres eliminar todas las notificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar Todo', 
          style: 'destructive',
          onPress: () => {
            setState(prev => ({ ...prev, notifications: [] }));
          }
        },
      ]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? 'Ahora' : `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderNotificationItem = (notification: NotificationHistoryItem) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        {
          backgroundColor: getColor.background.primary,
          marginHorizontal: responsive.spacing.md,
          marginBottom: responsive.spacing.sm,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: notification.isRead ? getColor.gray[200] : getColor.primary[200],
          opacity: notification.isRead ? 0.85 : 1,
        },
        shadowStyles.neutral.sm
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={{
        flexDirection: 'row',
        padding: responsive.spacing.lg,
        alignItems: 'flex-start',
      }}>
        {/* Ícono de notificación */}
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: getNotificationColor(notification.type) + '15',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: responsive.spacing.md,
          borderWidth: 1,
          borderColor: getNotificationColor(notification.type) + '30',
        }}>
          <Ionicons 
            name={getNotificationIcon(notification.type) as any} 
            size={20} 
            color={getNotificationColor(notification.type)} 
          />
        </View>

        {/* Contenido */}
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: responsive.spacing.xs,
          }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: notification.isRead ? '500' : '700',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
              flex: 1,
              marginRight: responsive.spacing.sm,
              lineHeight: responsive.fontSize.base * 1.3,
            }}>
              {notification.title}
            </Text>
            
            {/* Badge de no leída */}
            {!notification.isRead && (
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getColor.primary[500],
                marginTop: 4,
              }} />
            )}
          </View>

          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.sm * 1.4,
            marginBottom: responsive.spacing.sm,
          }}>
            {notification.body}
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[400],
              fontFamily: 'Nunito',
              fontWeight: '500',
            }}>
              {formatTimestamp(notification.timestamp)}
            </Text>

            <Ionicons 
              name="chevron-forward" 
              size={14} 
              color={getColor.gray[400]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterTabs = () => {
    const filters = [
      { key: 'all', label: 'Todas', count: state.notifications.length },
      { key: 'unread', label: 'No leídas', count: getUnreadCount(state.notifications) },
      { key: 'today', label: 'Hoy', count: getNotificationsByFilter(state.notifications, 'today').length },
    ] as const;

    return (
      <View style={{
        flexDirection: 'row',
        marginHorizontal: responsive.spacing.md,
        marginBottom: responsive.spacing.lg,
        backgroundColor: getColor.gray[100],
        borderRadius: 12,
        padding: 4,
        ...shadowStyles.neutral.sm,
      }}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={{
              flex: 1,
              paddingVertical: responsive.spacing.sm,
              paddingHorizontal: responsive.spacing.xs,
              borderRadius: 8,
              backgroundColor: state.filter === filter.key ? getColor.primary[500] : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setState(prev => ({ ...prev, filter: filter.key }))}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: responsive.fontSize.sm,
              fontWeight: '600',
              color: state.filter === filter.key ? getColor.background.primary : getColor.gray[600],
              fontFamily: 'Nunito',
            }}>
              {filter.label}
              {filter.count > 0 && (
                <Text style={{ fontWeight: '400' }}> ({filter.count})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsive.spacing['3xl'],
      paddingHorizontal: responsive.spacing.lg,
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: getColor.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsive.spacing.lg,
        borderWidth: 1,
        borderColor: getColor.gray[200],
      }}>
        <Ionicons 
          name="notifications-outline" 
          size={36} 
          color={getColor.gray[400]} 
        />
      </View>
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        Sin notificaciones
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.sm,
        color: getColor.gray[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
        lineHeight: responsive.fontSize.sm * 1.4,
        maxWidth: 260,
      }}>
        Las notificaciones de campeonatos y resultados aparecerán aquí
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsive.spacing['2xl'],
    }}>
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: getColor.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsive.spacing.lg,
        borderWidth: 1,
        borderColor: getColor.primary[100],
      }}>
        <Ionicons 
          name="notifications-outline" 
          size={28} 
          color={getColor.primary[400]} 
        />
      </View>
      <Text style={{
        fontSize: responsive.fontSize.base,
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        fontWeight: '500',
      }}>
        Cargando notificaciones...
      </Text>
    </View>
  );

  // Filtrar notificaciones según el filtro seleccionado
  const filteredNotifications = getNotificationsByFilter(state.notifications, state.filter);
  const unreadCount = getUnreadCount(state.notifications);

  return (
    <BaseLayout>
      <Header
        title="Notificaciones"
        subtitle={unreadCount > 0 ? `${unreadCount} sin leer` : 'Al día'}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showLogo={false}
        rightComponent={
          state.notifications.length > 0 ? (
            <TouchableOpacity
              style={{
                paddingHorizontal: responsive.spacing.md,
                paddingVertical: responsive.spacing.sm,
                backgroundColor: getColor.primary[50],
                borderRadius: 20,
                borderWidth: 1,
                borderColor: getColor.primary[100],
              }}
              onPress={unreadCount > 0 ? handleMarkAllAsRead : handleClearAll}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: responsive.fontSize.xs,
                fontWeight: '600',
                color: getColor.primary[600],
                fontFamily: 'Nunito',
              }}>
                {unreadCount > 0 ? 'Marcar leídas' : 'Limpiar'}
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Espaciado después del header */}
      <View style={{ height: responsive.spacing.lg }} />

      {state.isLoading ? (
        renderLoadingState()
      ) : state.notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Filtros */}
          {renderFilterTabs()}

          {/* Lista de notificaciones */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={state.isRefreshing}
                onRefresh={handleRefresh}
                tintColor={getColor.primary[500]}
                colors={[getColor.primary[500]]}
              />
            }
            contentContainerStyle={{
              paddingBottom: responsive.spacing.xl,
            }}
          >
            {filteredNotifications.length === 0 ? (
              <View style={{
                paddingVertical: responsive.spacing['2xl'],
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  fontWeight: '500',
                }}>
                  No hay notificaciones para "{
                    state.filter === 'all' ? 'todas' : 
                    state.filter === 'unread' ? 'no leídas' : 
                    'hoy'
                  }"
                </Text>
              </View>
            ) : (
              filteredNotifications.map(renderNotificationItem)
            )}
          </ScrollView>
        </>
      )}
    </BaseLayout>
  );
}