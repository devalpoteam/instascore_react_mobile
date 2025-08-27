// src/features/profile/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  RefreshControl, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { MainStackParamList } from '@/navigation/MainNavigator';

// Layout components
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

// Profile components
import ProfileHeader from '../components/ProfileHeader';
import SettingsSection from '../components/SettingsSection';

// Data and types
import { 
  UserProfile, 
  ProfileScreenState 
} from '../types/profile.types';
import { mockUserProfile } from '../data/mockProfileData';

type ProfileNavigationProp = NavigationProp<MainStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  
  // ✅ USAR HOOK DE NOTIFICACIONES
  const { unreadCount, handleNotificationPress } = useNotifications();
  
  // Redux state
  const { user: authUser, isPro } = useAppSelector(state => state.auth);

  // ✅ ESTADO SIMPLIFICADO - SIN FAVORITOS
  const [state, setState] = useState<Omit<ProfileScreenState, 'favorites'>>({
    user: null,
    isLoading: true,
    isRefreshing: false,
    error: null,
  });

  // Cargar datos del perfil
  useEffect(() => {
    loadProfileData();
  }, [authUser]);

  const loadProfileData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Usar datos mock (en producción vendría del backend)
      const profileData = {
        ...mockUserProfile,
        ...authUser, // Override con datos reales del auth
        isPro: isPro,
      } as UserProfile;

      setState(prev => ({
        ...prev,
        user: profileData,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const handleRefresh = async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadProfileData();
    setState(prev => ({ ...prev, isRefreshing: false }));
  };

  // Settings actions - CAMBIADO: configuraciones en lugar de notificaciones
  const handleConfiguraciones = () => {
    navigation.navigate('Configuraciones');
  };

  const handleSubscriptionManage = () => {
    const message = isPro 
      ? 'Gestionar tu suscripción Pro:\n\n• Ver estado actual\n• Cambiar plan\n• Cancelar suscripción'
      : 'Actualizar a Pro para:\n\n• Ver todos los resultados\n• Buscar gimnastas\n• Filtros avanzados\n• Sin publicidad';
      
    Alert.alert(
      isPro ? 'Gestionar Suscripción' : 'Actualizar a Pro',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: isPro ? 'Gestionar' : 'Actualizar', 
          onPress: () => {
            // TODO: Navegar a pantalla de suscripción
            console.log('Navegar a suscripción');
          }
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          }
        },
      ]
    );
  };

  // Loading state
  if (state.isLoading && !state.user) {
    return (
      <BaseLayout>
        <Header 
          title="Perfil"
          subtitle="Tu información personal"
          showLogo={false}
          onNotificationPress={handleNotificationPress}
          notificationCount={unreadCount}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: responsive.spacing.xl,
        }}>
          <ActivityIndicator size="large" color={getColor.primary[500]} />
        </View>
      </BaseLayout>
    );
  }

  if (!state.user) {
    return (
      <BaseLayout>
        <Header 
          title="Perfil"
          subtitle="Error al cargar"
          showLogo={false}
          onNotificationPress={handleNotificationPress}
          notificationCount={unreadCount}
        />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title="Perfil"
        subtitle={state.user.name}
        showLogo={false}
        onNotificationPress={handleNotificationPress}
        notificationCount={unreadCount}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={handleRefresh}
            tintColor={getColor.primary[500]}
            colors={[getColor.primary[500]]}
            progressBackgroundColor={getColor.background.primary}
          />
        }
        contentContainerStyle={{
          paddingBottom: responsive.spacing.xl,
        }}
      >
        {/* Header del perfil */}
        <ProfileHeader user={state.user} />

        {/* Sección de configuración - CAMBIADO: configuraciones en lugar de notificaciones */}
        <SettingsSection
          onNotificationSettings={handleConfiguraciones}
          onSubscriptionManage={handleSubscriptionManage}
          onLogout={handleLogout}
          isPro={state.user.isPro}
        />
      </ScrollView>
    </BaseLayout>
  );
}