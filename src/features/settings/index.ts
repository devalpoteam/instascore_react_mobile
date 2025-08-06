// src/features/settings/index.ts

// Screens
export { default as NotificationSettingsScreen } from './screens/NotificationSettingsScreen';

// Types
export type {
  NotificationSettings,
  NotificationHistoryItem,
  NotificationSettingsScreenState,
  NotificationHistoryScreenState,
  NotificationSettingItemProps,
  NotificationHistoryItemProps,
  FrequencySelectorProps,
} from './types/settings.types';

// TODO: Export components when created
// export { default as NotificationSettingItem } from './components/NotificationSettingItem';
// export { default as FrequencySelector } from './components/FrequencySelector';

// TODO: Export data/services when created  
// export { mockNotificationSettings, mockNotificationHistory } from './data/mockSettingsData';
// export { notificationService } from './services/notificationService';