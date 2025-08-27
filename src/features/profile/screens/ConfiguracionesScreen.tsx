// src/features/profile/screens/ConfiguracionesScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/store/hooks';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';

// Layout components
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

const genderOptions = [
  { value: "M", label: "Masculino", icon: "man-outline" },
  { value: "F", label: "Femenino", icon: "woman-outline" },
];

export default function ConfiguracionesScreen() {
  const navigation = useNavigation();
  const responsive = useResponsive();
  
  const { unreadCount, handleNotificationPress } = useNotifications();
  const { user: authUser } = useAppSelector(state => state.auth);

  // Estados para los formularios
  const [personalData, setPersonalData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    age: authUser?.age ? authUser.age.toString() : '',
    gender: authUser?.gender || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handlers
  const handleSavePersonalData = () => {
    Alert.alert(
      'Datos guardados',
      'Tus datos personales han sido actualizados correctamente',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    Alert.alert(
      'Contraseña cambiada',
      'Tu contraseña ha sido actualizada correctamente',
      [{ 
        text: 'OK', 
        onPress: () => {
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
      }]
    );
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    secureTextEntry?: boolean,
    keyboardType?: 'default' | 'email-address' | 'numeric',
    icon?: string
  ) => (
    <View style={{ marginBottom: responsive.spacing.md }}>
      <Text style={{
        fontSize: responsive.fontSize.sm,
        fontWeight: '600',
        color: getColor.gray[700],
        fontFamily: 'Nunito',
        marginBottom: responsive.spacing.xs,
      }}>
        {label}
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: responsive.spacing.md,
        borderRadius: 12,
        backgroundColor: getColor.gray[50],
        borderWidth: 1,
        borderColor: getColor.gray[200],
      }}>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={getColor.gray[500]} 
            style={{ marginRight: responsive.spacing.sm }}
          />
        )}
        <TextInput
          style={{
            flex: 1,
            fontSize: responsive.fontSize.base,
            fontFamily: 'Nunito',
            color: getColor.gray[800],
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={getColor.gray[400]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  const renderGenderSelector = () => (
    <View style={{ marginBottom: responsive.spacing.md }}>
      <Text style={{
        fontSize: responsive.fontSize.sm,
        fontWeight: '600',
        color: getColor.gray[700],
        fontFamily: 'Nunito',
        marginBottom: responsive.spacing.xs,
      }}>
        Género
      </Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: responsive.spacing.sm,
      }}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              backgroundColor: personalData.gender === option.value 
                ? getColor.primary[500] 
                : getColor.gray[50],
              borderWidth: 1,
              borderColor: personalData.gender === option.value 
                ? getColor.primary[500] 
                : getColor.gray[200],
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            onPress={() => setPersonalData({ ...personalData, gender: option.value })}
            activeOpacity={0.8}
          >
            <Ionicons
              name={option.icon as any}
              size={20}
              color={personalData.gender === option.value 
                ? getColor.background.primary 
                : getColor.gray[600]}
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.sm,
              fontWeight: '600',
              color: personalData.gender === option.value 
                ? getColor.background.primary 
                : getColor.gray[600],
              fontFamily: 'Nunito',
            }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderButton = (title: string, onPress: () => void, color: string) => (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsive.spacing.md,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={{
        fontSize: responsive.fontSize.base,
        fontWeight: '600',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderSectionTitle = (title: string, color: string, icon: string) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: responsive.spacing.lg,
      marginBottom: responsive.spacing.md,
      marginTop: responsive.spacing.sm,
    }}>
      <View style={{
        flex: 1,
        height: 1,
        backgroundColor: `${color}30`,
      }} />
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: responsive.spacing.md,
        backgroundColor: getColor.background.primary,
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.xs,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `${color}20`,
      }}>
        <View style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          marginRight: 8,
        }} />
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={color} 
          style={{ marginRight: 6 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.sm,
          fontWeight: '600',
          color: color,
          fontFamily: 'Nunito',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}>
          {title}
        </Text>
      </View>
      <View style={{
        flex: 1,
        height: 1,
        backgroundColor: `${color}30`,
      }} />
    </View>
  );

  const renderSection = (children: React.ReactNode) => (
    <View style={{
      backgroundColor: getColor.background.primary,
      borderRadius: 16,
      padding: responsive.spacing.lg,
      marginHorizontal: responsive.spacing.lg,
      marginBottom: responsive.spacing.lg,
      shadowColor: getColor.gray[400],
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    }}>
      {children}
    </View>
  );

  return (
    <BaseLayout>
      <Header 
        title="Configuraciones"
        subtitle="Gestiona tu información personal"
        showLogo={false}
        showBackButton={true}
        onNotificationPress={handleNotificationPress}
        notificationCount={unreadCount}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: responsive.spacing.md,
          paddingBottom: responsive.spacing.xl,
        }}
      >
        {/* Datos Personales */}
        {renderSectionTitle('Información Personal', getColor.primary[500], 'person-outline')}
        {renderSection(
          <View>
            {renderInput(
              'Nombre completo',
              personalData.name,
              (text) => setPersonalData({ ...personalData, name: text }),
              'Tu nombre completo',
              false,
              'default',
              'person-outline'
            )}

            {renderInput(
              'Correo electrónico',
              personalData.email,
              (text) => setPersonalData({ ...personalData, email: text }),
              'tu@email.com',
              false,
              'email-address',
              'mail-outline'
            )}

            {renderInput(
              'Edad',
              personalData.age,
              (text) => setPersonalData({ ...personalData, age: text }),
              'Tu edad',
              false,
              'numeric',
              'calendar-outline'
            )}

            {renderGenderSelector()}

            {renderButton(
              'Guardar cambios',
              handleSavePersonalData,
              getColor.primary[500]
            )}
          </View>
        )}

        {/* Cambiar Contraseña */}
        {renderSectionTitle('Seguridad', getColor.warning[500], 'shield-checkmark-outline')}
        {renderSection(
          <View>
            {renderInput(
              'Contraseña actual',
              passwordData.currentPassword,
              (text) => setPasswordData({ ...passwordData, currentPassword: text }),
              'Tu contraseña actual',
              true,
              'default',
              'lock-closed-outline'
            )}

            {renderInput(
              'Nueva contraseña',
              passwordData.newPassword,
              (text) => setPasswordData({ ...passwordData, newPassword: text }),
              'Mínimo 6 caracteres',
              true,
              'default',
              'key-outline'
            )}

            {renderInput(
              'Confirmar contraseña',
              passwordData.confirmPassword,
              (text) => setPasswordData({ ...passwordData, confirmPassword: text }),
              'Repite la nueva contraseña',
              true,
              'default',
              'checkmark-circle-outline'
            )}

            {renderButton(
              'Cambiar contraseña',
              handleChangePassword,
              getColor.warning[500]
            )}
          </View>
        )}
      </ScrollView>
    </BaseLayout>
  );
}