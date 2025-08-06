// src/features/settings/data/mockSettingsData.ts
import { NotificationSettings, NotificationHistoryItem } from '../types/settings.types';

// ✅ CONFIGURACIÓN POR DEFECTO DE NOTIFICACIONES
export const defaultNotificationSettings: NotificationSettings = {
  masterEnabled: true,
  categoryResults: true,
  championshipStart: true,
  championshipEnd: true,
  favoriteCompeting: true,
  favoriteResults: true,
  scheduleReminders: false,
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
  frequency: 'immediate',
};

// ✅ CONFIGURACIÓN PARA USUARIO PRO
export const proNotificationSettings: NotificationSettings = {
  ...defaultNotificationSettings,
  favoriteCompeting: true,
  favoriteResults: true,
  scheduleReminders: true,
  frequency: 'immediate',
};

// ✅ CONFIGURACIÓN PARA USUARIO BÁSICO (más limitada)
export const basicNotificationSettings: NotificationSettings = {
  ...defaultNotificationSettings,
  favoriteCompeting: false, // Limitado en versión básica
  scheduleReminders: false, // Solo Pro
  frequency: 'summary', // Menos inmediatas
};

// ✅ HISTORIAL MOCK DE NOTIFICACIONES
export const mockNotificationHistory: NotificationHistoryItem[] = [
  {
    id: '1',
    title: '🏆 Resultados Finales',
    body: 'Categoría Kinder F1 - Ver ganadores',
    type: 'category_result',
    timestamp: '2025-01-29T14:30:00Z',
    isRead: false,
    data: {
      campeonatoId: '1',
      categoriaId: 'cat1',
    },
  },
  {
    id: '2',
    title: '⭐ Tu favorita está compitiendo',
    body: 'Ana María Aguilar está por competir en Viga',
    type: 'favorite_competing',
    timestamp: '2025-01-29T13:45:00Z',
    isRead: true,
    data: {
      gimnastaId: '001',
      campeonatoId: '1',
    },
  },
  {
    id: '3',
    title: '🏟️ Campeonato Iniciado',
    body: 'Copa Valparaíso 2025 ha comenzado',
    type: 'championship_start',
    timestamp: '2025-01-29T09:00:00Z',
    isRead: true,
    data: {
      campeonatoId: '1',
    },
  },
  {
    id: '4',
    title: '💫 Resultado de Favorita',
    body: 'Ana María Aguilar obtuvo 8.5 puntos en Salto - 1er lugar',
    type: 'favorite_result',
    timestamp: '2025-01-29T12:15:00Z',
    isRead: true,
    data: {
      gimnastaId: '001',
      campeonatoId: '1',
      categoriaId: 'cat1',
    },
  },
  {
    id: '5',
    title: '⏰ Recordatorio',
    body: 'La categoría Mini F2 comenzará en 15 minutos',
    type: 'schedule_reminder',
    timestamp: '2025-01-29T10:45:00Z',
    isRead: true,
    data: {
      campeonatoId: '1',
      categoriaId: 'cat2',
    },
  },
  {
    id: '6',
    title: '🎉 Campeonato Finalizado',
    body: 'Copa Valparaíso 2025 ha terminado - Ver resultados completos',
    type: 'championship_end',
    timestamp: '2025-01-28T18:00:00Z',
    isRead: true,
    data: {
      campeonatoId: '1',
    },
  },
];

// ✅ FUNCIONES HELPER
export const getNotificationIcon = (type: NotificationHistoryItem['type']): string => {
  const iconMap = {
    category_result: 'trophy',
    championship_start: 'play-circle',
    championship_end: 'checkmark-circle',
    favorite_competing: 'heart',
    favorite_result: 'star',
    schedule_reminder: 'alarm',
  };
  return iconMap[type] || 'notifications';
};

export const getNotificationColor = (type: NotificationHistoryItem['type']): string => {
  const colorMap = {
    category_result: '#F5A201', // Secondary
    championship_start: '#10B981', // Success
    championship_end: '#3B82F6', // Info
    favorite_competing: '#F5A201', // Secondary
    favorite_result: '#F59E0B', // Warning
    schedule_reminder: '#6366F1', // Indigo
  };
  return colorMap[type] || '#1105AD'; // Primary
};

export const getUnreadCount = (notifications: NotificationHistoryItem[]): number => {
  return notifications.filter(notification => !notification.isRead).length;
};

export const getNotificationsByFilter = (
  notifications: NotificationHistoryItem[],
  filter: 'all' | 'unread' | 'today' | 'this_week'
): NotificationHistoryItem[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  switch (filter) {
    case 'unread':
      return notifications.filter(n => !n.isRead);
    
    case 'today':
      return notifications.filter(n => {
        const notificationDate = new Date(n.timestamp);
        return notificationDate >= today;
      });
    
    case 'this_week':
      return notifications.filter(n => {
        const notificationDate = new Date(n.timestamp);
        return notificationDate >= weekAgo;
      });
    
    case 'all':
    default:
      return notifications;
  }
};

// ✅ SIMULADOR DE NUEVAS NOTIFICACIONES (para demo)
export const generateMockNotification = (type: NotificationHistoryItem['type']): NotificationHistoryItem => {
  const messages = {
    category_result: {
      title: '🏆 Resultados Finales',
      body: 'Categoría Juvenil F2 - Ver ganadores',
    },
    championship_start: {
      title: '🏟️ Campeonato Iniciado',
      body: 'Torneo Nacional 2025 ha comenzado',
    },
    championship_end: {
      title: '🎉 Campeonato Finalizado',
      body: 'Torneo Nacional 2025 ha terminado',
    },
    favorite_competing: {
      title: '⭐ Tu favorita está compitiendo',
      body: 'Isabella Morales está por competir en Suelo',
    },
    favorite_result: {
      title: '💫 Resultado de Favorita',
      body: 'Isabella Morales obtuvo 8.2 puntos en Suelo - 2do lugar',
    },
    schedule_reminder: {
      title: '⏰ Recordatorio',
      body: 'La categoría Infantil M1 comenzará en 10 minutos',
    },
  };

  return {
    id: `mock_${Date.now()}`,
    title: messages[type].title,
    body: messages[type].body,
    type,
    timestamp: new Date().toISOString(),
    isRead: false,
    data: {
      campeonatoId: '2',
      categoriaId: 'cat_mock',
      gimnastaId: type.includes('favorite') ? '002' : undefined,
    },
  };
};