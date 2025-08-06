// src/features/auth/screens/ResetPasswordScreen.tsx
import React, { useState } from "react";
import { View, Image, TouchableOpacity, TextInput, StatusBar, Alert, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/store/authSlice';
import { useNavigation } from '@react-navigation/native';
import { useResponsive } from "@/shared/hooks/useResponsive";

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  
  // ✅ ESTADO LOCAL PARA VALIDACIONES + REDUX PARA AUTH
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados de errores individuales
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const responsive = useResponsive();

  // 🔧 VALIDACIONES LOCALES SIMPLES
  const validateNewPassword = (password: string): boolean => {
    if (!password) {
      setNewPasswordError('La nueva contraseña es requerida');
      return false;
    }
    if (password.length < 6) {
      setNewPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setNewPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPass: string, newPass: string): boolean => {
    if (!confirmPass) {
      setConfirmPasswordError('Confirma tu nueva contraseña');
      return false;
    }
    if (confirmPass !== newPass) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // 🔐 HANDLE RESET PASSWORD CON REDUX
  const handleResetPassword = async () => {
    console.log('🔑 Reset password attempt with Redux');
    
    // Limpiar errores previos
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Validar campos de contraseña
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, newPassword);

    if (!isNewPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    dispatch(loginStart()); // Usar el mismo loading state

    try {
      // Simular reset exitoso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Password reset successful');
      
      Alert.alert(
        'Contraseña Actualizada', 
        'Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
        [
          {
            text: 'Continuar',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
      
    } catch (err: any) {
      console.error('❌ Reset password error:', err);
      dispatch(loginFailure(err.message || 'Error al cambiar la contraseña'));
    }
  };

  // 🔧 OTROS HANDLERS SIMPLES
  const navigateToLogin = () => {
    console.log('🔙 Navigate back to login');
    navigation.navigate('Login' as never);
  };

  const showDevCredentials = () => {
    console.log('🛠️ Dev credentials for reset');
    setNewPassword('newpass123');
    setConfirmPassword('newpass123');
  };

  // 🎯 HANDLERS PARA INPUTS
  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (newPasswordError) setNewPasswordError('');
    // Re-validar confirmación si ya hay texto
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) setConfirmPasswordError('');
    // Validar en tiempo real
    if (text !== newPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError('');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={getColor.background.primary} translucent={false} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: getColor.background.lighter }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            justifyContent: responsive.isIOS ? "flex-start" : "center",
            paddingTop: responsive.isIOS ? 25 : 20,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* BOTÓN DEV */}
          <TouchableOpacity
            onPress={showDevCredentials}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              zIndex: 10,
              backgroundColor: getColor.gray[600],
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            activeOpacity={0.7}
          >
            <Text style={{ 
              color: getColor.background.primary, 
              fontSize: 12, 
              fontWeight: 'bold' 
            }}>
              DEV
            </Text>
          </TouchableOpacity>

          {/* BOTÓN VOLVER */}
          <TouchableOpacity
            onPress={navigateToLogin}
            style={{
              position: 'absolute',
              top: 50,
              left: 20,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: getColor.background.primary,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: getColor.gray[400],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={getColor.primary[500]}
            />
          </TouchableOpacity>

          {/* LOGO Y ENCABEZADO */}
          <View style={{ alignItems: 'center', marginBottom: responsive.isIOS ? 10 : 20 }}>
            <Image
              source={require("../../../../assets/images/logo.png")}
              style={{ width: 200, height: 130 }}
              resizeMode="contain"
            />
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: getColor.primary[500],
              textAlign: 'center',
              marginTop: responsive.isIOS ? -10 : 5,
              fontFamily: 'Montserrat', // ✅ Fuente de marca
            }}>
              Restablecer Contraseña
            </Text>
            <Text style={{
              fontSize: 16,
              color: getColor.gray[600],
              textAlign: 'center',
              marginTop: 5,
              marginBottom: responsive.isIOS ? 4 : 0,
              fontFamily: 'Nunito',
              paddingHorizontal: 20,
            }}>
              Ingresa tu nueva contraseña
            </Text>
          </View>

          {/* ✅ CONTENEDOR PRINCIPAL CON SOMBRA OFICIAL */}
          <View style={{
            width: '100%',
            backgroundColor: getColor.background.primary,
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: getColor.gray[300],
            shadowColor: getColor.primary[500],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            
            {/* ERROR GLOBAL */}
            {authError && (
              <View style={{
                backgroundColor: getColor.error[100],
                borderWidth: 1,
                borderColor: getColor.error[500],
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}>
                <Text style={{
                  fontSize: 14,
                  color: getColor.error[500],
                  textAlign: 'center',
                  fontFamily: 'Nunito'
                }}>
                  {authError}
                </Text>
              </View>
            )}

            {/* NUEVA CONTRASEÑA LABEL */}
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: getColor.gray[700],
              marginBottom: 8,
              fontFamily: 'Nunito'
            }}>
              Nueva Contraseña *
            </Text>

            {/* NUEVA CONTRASEÑA INPUT CON ICONO */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: newPasswordError ? getColor.error[500] : getColor.gray[300],
              borderRadius: 8,
              backgroundColor: getColor.background.primary,
              marginBottom: newPasswordError ? 4 : 16,
              paddingHorizontal: 15,
            }}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={newPasswordError ? getColor.error[500] : getColor.gray[500]} 
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                secureTextEntry={!showNewPassword}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 16,
                  fontFamily: 'Nunito',
                  color: getColor.gray[900],
                }}
                placeholderTextColor={getColor.gray[400]}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="next"
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={{ padding: 5 }}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={getColor.gray[500]}
                />
              </TouchableOpacity>
            </View>

            {/* NUEVA CONTRASEÑA ERROR */}
            {newPasswordError && (
              <Text style={{
                fontSize: 12,
                color: getColor.error[500],
                marginBottom: 16,
                fontFamily: 'Nunito'
              }}>
                {newPasswordError}
              </Text>
            )}

            {/* CONFIRMAR CONTRASEÑA LABEL */}
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: getColor.gray[700],
              marginBottom: 8,
              fontFamily: 'Nunito'
            }}>
              Confirmar Nueva Contraseña *
            </Text>

            {/* CONFIRMAR CONTRASEÑA INPUT CON ICONO */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: confirmPasswordError ? getColor.error[500] : 
                           (confirmPassword && confirmPassword === newPassword) ? getColor.success[500] :
                           getColor.gray[300],
              borderRadius: 8,
              backgroundColor: getColor.background.primary,
              marginBottom: confirmPasswordError ? 4 : 8,
              paddingHorizontal: 15,
            }}>
              <Ionicons 
                name="checkmark-circle-outline" 
                size={20} 
                color={confirmPasswordError ? getColor.error[500] : 
                       (confirmPassword && confirmPassword === newPassword) ? getColor.success[500] :
                       getColor.gray[500]} 
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Repite tu nueva contraseña"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 16,
                  fontFamily: 'Nunito',
                  color: getColor.gray[900],
                }}
                placeholderTextColor={getColor.gray[400]}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="done"
                editable={!isLoading}
                onSubmitEditing={handleResetPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ padding: 5 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={getColor.gray[500]}
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRMAR CONTRASEÑA ERROR */}
            {confirmPasswordError && (
              <Text style={{
                fontSize: 12,
                color: getColor.error[500],
                marginBottom: 8,
                fontFamily: 'Nunito'
              }}>
                {confirmPasswordError}
              </Text>
            )}

            {/* SUCCESS MESSAGE */}
            {confirmPassword && confirmPassword === newPassword && newPassword.length >= 6 && (
              <Text style={{
                fontSize: 12,
                color: getColor.success[500],
                marginBottom: 24,
                fontFamily: 'Nunito'
              }}>
                ✓ Las contraseñas coinciden
              </Text>
            )}

            {/* HINT DE CONTRASEÑA */}
            {!confirmPassword || confirmPassword !== newPassword ? (
              <Text style={{
                fontSize: 12,
                color: getColor.gray[500],
                marginBottom: 24,
                fontFamily: 'Nunito'
              }}>
                La contraseña debe tener al menos 6 caracteres
              </Text>
            ) : null}

            {/* ✅ BOTÓN RESET CON COLORES OFICIALES */}
            <TouchableOpacity
              style={{
                backgroundColor: isLoading ? getColor.gray[300] : getColor.secondary[500], // ✅ NARANJA OFICIAL
                borderRadius: 8,
                padding: 15,
                alignItems: 'center',
                marginBottom: 16,
                opacity: isLoading ? 0.6 : 1,
                shadowColor: getColor.secondary[500],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleResetPassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isLoading && (
                  <Ionicons
                    name="hourglass-outline"
                    size={18}
                    color={getColor.background.primary}
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={{
                  color: getColor.background.primary,
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Nunito'
                }}>
                  {isLoading ? 'CAMBIANDO CONTRASEÑA...' : 'CAMBIAR CONTRASEÑA'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* ✅ ENLACE A LOGIN CON COLORES OFICIALES */}
            <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
              <Text style={{
                fontSize: 16,
                textAlign: 'center',
                color: getColor.gray[600],
                fontFamily: 'Nunito'
              }}>
                ¿Recordaste tu contraseña?{" "}
                <Text style={{
                  fontSize: 16,
                  color: getColor.primary[500], // ✅ AZUL OFICIAL INSTASCORE
                  fontWeight: '600',
                  fontFamily: 'Nunito'
                }}>
                  Volver al login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}