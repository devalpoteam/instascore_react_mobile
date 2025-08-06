// src/features/settings/types/settings.types.ts

export interface NotificationSettings {
  // Configuraciones principales
  masterEnabled: boolean;
  
  // Resultados y campeonatos
  categoryResults: boolean;
  championshipStart: boolean;
  championshipEnd: boolean;
  
  // Favoritos
  favoriteCompeting: boolean;
  favoriteResults: boolean;
  
  // Horarios
  scheduleReminders: boolean;
  
  // Configuraciones avanzadas
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  
  // Frecuencia
  frequency: 'immediate' | 'summary' | 'minimal';
}

export interface NotificationHistoryItem {
  id: string;
  title: string;
  body: string;
  type: 'category_result' | 'championship_start' | 'championship_end' | 'favorite_competing' | 'favorite_result' | 'schedule_reminder';
  timestamp: string;
  isRead: boolean;
  data?: {
    campeonatoId?: string;
    categoriaId?: string;
    gimnastaId?: string;
  };
}

export interface NotificationSettingsScreenState {
  settings: NotificationSettings;
  hasChanges: boolean;
  isLoading: boolean;
  isSaving: boolean;
}

export interface NotificationHistoryScreenState {
  notifications: NotificationHistoryItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  filter: 'all' | 'unread' | 'today' | 'this_week';
}

// Props para componentes
export interface NotificationSettingItemProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon: string;
  iconColor?: string;
  disabled?: boolean;
}

export interface NotificationHistoryItemProps {
  notification: NotificationHistoryItem;
  onPress: (notification: NotificationHistoryItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

export interface FrequencySelectorProps {
  selectedFrequency: NotificationSettings['frequency'];
  onFrequencyChange: (frequency: NotificationSettings['frequency']) => void;
  disabled?: boolean;
}