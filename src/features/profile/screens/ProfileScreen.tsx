// src/features/profile/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  RefreshControl, 
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { userProfileService, UserProfile as ApiUserProfile } from '@/services/api/users/userProfileService';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
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

type ProfileNavigationProp = NavigationProp<MainStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  
  
  // Redux state
  const { user: authUser, userId, isPro } = useAppSelector(state => state.auth);

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
      
      if (!userId) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No se pudo identificar tu usuario. Por favor inicia sesión nuevamente.',
        }));
        return;
      }

      // Call real API service
      const apiProfileData = await userProfileService.getProfile(userId);
      
      // Convert API response to local UserProfile format
      const profileData: UserProfile = {
        id: apiProfileData.userId,
        name: apiProfileData.fullName,
        email: apiProfileData.email,
        gender: apiProfileData.sexo === 'Masculino' ? 'masculino' : 
               apiProfileData.sexo === 'Femenino' ? 'femenino' : 'otro',
        age: parseInt(apiProfileData.edad),
        isPro: apiProfileData.premium,
      };

      setState(prev => ({
        ...prev,
        user: profileData,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al cargar el perfil. Intenta de nuevo.',
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

  if (!state.user && state.error) {
    return (
      <BaseLayout>
        <Header 
          title="Perfil"
          subtitle="Error al cargar"
          showLogo={false}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: responsive.spacing.xl,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            color: getColor.gray[600],
            textAlign: 'center',
            marginBottom: responsive.spacing.lg,
            fontFamily: 'Nunito',
          }}>
            {state.error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: getColor.primary[500],
              paddingHorizontal: responsive.spacing.lg,
              paddingVertical: responsive.spacing.md,
              borderRadius: 12,
            }}
            onPress={loadProfileData}
          >
            <Text style={{
              color: getColor.background.primary,
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              fontFamily: 'Nunito',
            }}>
              Intentar de nuevo
            </Text>
          </TouchableOpacity>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title="Perfil"
        subtitle={state.user.name}
        showLogo={false}
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