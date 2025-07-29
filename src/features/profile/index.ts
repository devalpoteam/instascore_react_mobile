// src/features/profile/index.ts
// Screens
export { default as ProfileScreen } from './screens/ProfileScreen';

// Components
export { default as ProfileHeader } from './components/ProfileHeader';
export { default as FavoritesSection } from './components/FavoritesSection';
export { default as SettingsSection } from './components/SettingsSection';

// Types
export type {
  UserProfile,
  FavoriteGimnasta,
  ProfileHeaderProps,
  FavoritesSectionProps,
  SettingsSectionProps,
  SettingsItemProps,
  ProfileScreenState,
} from './types/profile.types';

// Data and utilities
export {
  mockUserProfile,
  mockUserProfileBasic,
  mockFavoriteGimnastas,
  getActiveFavorites,
  getGenderDisplayName,
} from './data/mockProfileData';