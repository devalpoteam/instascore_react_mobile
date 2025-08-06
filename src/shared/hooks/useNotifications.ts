// src/shared/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { 
  NotificationHistoryItem,
  mockNotificationHistory,
  getUnreadCount
} from '@/features/settings/data/mockSettingsData';

type MainNavigationProp = NavigationProp<MainStackParamList>;

// ✅ HOOK PERSONALIZADO PARA GESTIONAR NOTIFICACIONES GLOBALMENTE
export const useNotifications = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar notificaciones al iniciar
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotificationHistory);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA MANEJAR CLICK EN ÍCONO DE NOTIFICACIONES
  const handleNotificationPress = () => {
    navigation.navigate('NotificationHistory');
  };

  // ✅ MARCAR NOTIFICACIÓN COMO LEÍDA
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // ✅ MARCAR TODAS COMO LEÍDAS
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // ✅ AGREGAR NUEVA NOTIFICACIÓN (para demo)
  const addNotification = (notification: Omit<NotificationHistoryItem, 'id' | 'timestamp'>) => {
    const newNotification: NotificationHistoryItem = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // ✅ LIMPIAR TODAS LAS NOTIFICACIONES
  const clearAll = () => {
    setNotifications([]);
  };

  // ✅ CALCULAR CONTADOR DE NO LEÍDAS
  const unreadCount = getUnreadCount(notifications);

  return {
    // Estado
    notifications,
    unreadCount,
    isLoading,
    
    // Acciones
    handleNotificationPress,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearAll,
    loadNotifications,
  };
};