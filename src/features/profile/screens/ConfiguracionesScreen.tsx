// src/features/profile/screens/ConfiguracionesScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/store/hooks';
import { userProfileService } from '@/services/api/users/userProfileService';
import { passwordService } from '@/services/api/users/passwordService';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';

// Layout components
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

const genderOptions = [
  { value: "masculino", label: "Masculino", icon: "man-outline" },
  { value: "femenino", label: "Femenino", icon: "woman-outline" },
];

export default function ConfiguracionesScreen() {
  const navigation = useNavigation();
  const responsive = useResponsive();
  
  const { user: authUser, userId } = useAppSelector(state => state.auth);

  // Estados para los formularios
  const [personalData, setPersonalData] = useState({
    fullName: '', // Vacío inicialmente
    email: '', // Vacío inicialmente  
    confirmEmail: '', // Vacío inicialmente
    age: '', // Vacío inicialmente
    gender: '', // Vacío inicialmente
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  // Cargar datos actuales del perfil para mostrar como referencia
  useEffect(() => {
    const loadCurrentProfile = async () => {
      if (!userId) return;
      
      try {
        const profile = await userProfileService.getProfile(userId);
        setCurrentProfile(profile);
      } catch (error) {
        console.error('Error loading current profile:', error);
      }
    };
    
    loadCurrentProfile();
  }, [userId]);

  // Inicializar los campos con los datos actuales del perfil
  useEffect(() => {
    if (currentProfile) {
      setPersonalData({
        fullName: currentProfile.fullName || '',
        email: currentProfile.email || '',
        confirmEmail: currentProfile.email || '',
        age: currentProfile.edad || '',
        gender: currentProfile.sexo === 'Masculino' ? 'masculino' : 
               currentProfile.sexo === 'Femenino' ? 'femenino' : '',
      });
    }
  }, [currentProfile]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handlers
  const handleSavePersonalData = async () => {
    // Verificar que se haya ingresado al menos un campo
    const hasChanges = personalData.fullName || personalData.email || personalData.age || personalData.gender;
    if (!hasChanges) {
      Alert.alert(
        'Sin cambios',
        'Ingresa al menos un campo para actualizar'
      );
      return;
    }

    // Validation: si hay email, debe coincidir con confirmEmail
    if (personalData.email || personalData.confirmEmail) {
      if (personalData.email !== personalData.confirmEmail) {
        Alert.alert(
          'Error de validación',
          'Los campos de correo electrónico no coinciden'
        );
        return;
      }

      // Validate email format si se proporciona
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (personalData.email && !emailRegex.test(personalData.email)) {
        Alert.alert(
          'Error de validación',
          'Por favor ingresa un email válido'
        );
        return;
      }
    }

    // Validate age si se proporciona
    if (personalData.age) {
      const age = parseInt(personalData.age);
      if (isNaN(age) || age < 1 || age > 150) {
        Alert.alert(
          'Error de validación',
          'Por favor ingresa una edad válida'
        );
        return;
      }
    }

    if (!userId || !currentProfile) {
      Alert.alert(
        'Error',
        'No se pudo identificar tu usuario. Por favor inicia sesión nuevamente.'
      );
      return;
    }

    try {
      setIsLoading(true);

      // Usar valores actuales como base y sobrescribir solo los campos modificados
      const updateData = {
        userId,
        userName: personalData.email || currentProfile.email,
        email: personalData.email || currentProfile.email,
        fullName: personalData.fullName || currentProfile.fullName,
        sexo: personalData.gender === 'masculino' ? 'Masculino' :
              personalData.gender === 'femenino' ? 'Femenino' : 
              (currentProfile?.sexo || 'Masculino'),
        edad: personalData.age || currentProfile.edad,
      };

      await userProfileService.updateProfile(updateData);

      Alert.alert(
        'Datos guardados',
        'Tus datos personales han sido actualizados correctamente',
        [{ text: 'OK', onPress: () => {
          // Limpiar el formulario después de guardar
          setPersonalData({
            fullName: '',
            email: '',
            confirmEmail: '',
            age: '',
            gender: '',
          });
          // Recargar perfil actual
          if (userId) {
            userProfileService.getProfile(userId).then(setCurrentProfile);
          }
        }}]
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudieron guardar los cambios. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!authUser?.email || !passwordData.currentPassword) {
      Alert.alert('Error', 'Se requiere el email y la contraseña actual');
      return;
    }

    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación');
        return;
      }

      await passwordService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        token: token
      });

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
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo cambiar la contraseña. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    secureTextEntry?: boolean,
    keyboardType?: 'default' | 'email-address' | 'numeric',
    icon?: string,
    maxLength?: number
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
        minHeight: 48,
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
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
            paddingVertical: 12,
            paddingHorizontal: 0,
            margin: 0,
            textAlignVertical: 'center',
            includeFontPadding: false,
            lineHeight: responsive.fontSize.base * 1.2,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={getColor.gray[400]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          scrollEnabled={true}
          showSoftInputOnFocus={true}
          returnKeyType="done"
          numberOfLines={1}
          maxLength={maxLength}
        />
      </View>
    </View>
  );

  const renderGenderSelector = () => {
    const currentGender = currentProfile?.sexo === 'Masculino' ? 'masculino' : 
                         currentProfile?.sexo === 'Femenino' ? 'femenino' : '';
    
    return (
      <View style={{ marginBottom: responsive.spacing.md }}>
        <Text style={{
          fontSize: responsive.fontSize.sm,
          fontWeight: '600',
          color: getColor.gray[700],
          fontFamily: 'Nunito',
          marginBottom: responsive.spacing.xs,
        }}>
          Género {currentProfile && `(actual: ${currentProfile.sexo})`}
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
  };

  const renderButton = (title: string, onPress: () => void, color: string, disabled?: boolean) => (
    <TouchableOpacity
      style={{
        backgroundColor: disabled ? getColor.gray[300] : color,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsive.spacing.md,
        flexDirection: 'row',
      }}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
    >
      {disabled && (
        <ActivityIndicator 
          size="small" 
          color={getColor.background.primary} 
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={{
        fontSize: responsive.fontSize.base,
        fontWeight: '600',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
      }}>
        {disabled ? 'Guardando...' : title}
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
        showBack={true}
        onBackPress={() => navigation.goBack()}
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
              personalData.fullName,
              (text) => {
                if (text.length <= 30) {
                  setPersonalData({ ...personalData, fullName: text });
                }
              },
              currentProfile?.fullName || 'Tu nombre completo',
              false,
              'default',
              'person-outline',
              30
            )}

            {renderInput(
              'Correo electrónico',
              personalData.email,
              (text) => setPersonalData({ ...personalData, email: text }),
              currentProfile?.email || 'tu@email.com',
              false,
              'email-address',
              'mail-outline'
            )}

            {renderInput(
              'Repetir correo',
              personalData.confirmEmail,
              (text) => setPersonalData({ ...personalData, confirmEmail: text }),
              currentProfile?.email || 'Confirma tu correo electrónico',
              false,
              'email-address',
              'mail-outline'
            )}

            {renderInput(
              'Edad',
              personalData.age,
              (text) => {
                // Solo permitir números
                const numericText = text.replace(/[^0-9]/g, '');
                setPersonalData({ ...personalData, age: numericText });
              },
              currentProfile?.edad || 'Tu edad',
              false,
              'numeric',
              'calendar-outline'
            )}

            {renderGenderSelector()}

            {renderButton(
              'Guardar cambios',
              handleSavePersonalData,
              getColor.primary[500],
              isLoading
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
              getColor.warning[500],
              isLoading
            )}
          </View>
        )}
      </ScrollView>
    </BaseLayout>
  );
}