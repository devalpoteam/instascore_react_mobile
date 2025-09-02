// src/features/profile/types/profile.types.ts
import { GimnastaListItem } from '@/services/api/gimnastas/gimnastasService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender?: 'masculino' | 'femenino' | 'otro';
  age?: number;
  isPro: boolean;
}

// ✅ ACTUALIZADO: Ahora FavoriteGimnasta extiende de GimnastaListItem
export interface FavoriteGimnasta extends GimnastaListItem {
  // Campos adicionales específicos para favoritos
  dateAdded?: string; // Cuándo se agregó a favoritos
  notificationsEnabled?: boolean; // Si quiere notificaciones de este gimnasta
}

export interface ProfileHeaderProps {
  user: UserProfile;
}

export interface FavoritesSectionProps {
  favorites: FavoriteGimnasta[];
  isLoading?: boolean;
  onFavoritePress: (favorite: FavoriteGimnasta) => void;
  onRemoveFavorite: (favoriteId: string) => void;
  onViewAll: () => void;
}

export interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  type: 'navigation';
  onPress: () => void;
  iconColor?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export interface SettingsSectionProps {
  onNotificationSettings: () => void;
  onSubscriptionManage: () => void;
  onLogout: () => void;
  isPro: boolean;
}

export interface ProfileScreenState {
  user: UserProfile | null;
  favorites: FavoriteGimnasta[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}