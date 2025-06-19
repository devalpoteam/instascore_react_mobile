// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from "react";
import { 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  Alert,
  Text
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/design/colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/store/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  // ✅ ESTADO LOCAL PARA VALIDACIONES + REDUX PARA AUTH
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 🔧 VALIDACIONES LOCALES SIMPLES
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El correo es requerido');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Ingresa un correo válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 🔐 HANDLE LOGIN CON REDUX
  const handleLogin = async () => {
    console.log('🔐 Login attempt with Redux');
    
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');

    // Validar
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    dispatch(loginStart());

    try {
      // Simular login exitoso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        email: email,
        name: "Usuario Demo",
        isPro: false,
        role: "user"
      };

      dispatch(loginSuccess({
        token: "mock-jwt-token-login",
        user: mockUser,
      }));
      
      console.log('✅ Login successful');
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      dispatch(loginFailure(err.message || 'Error al iniciar sesión'));
    }
  };

  // 🔧 OTROS HANDLERS SIMPLES
  const handleGoogleLogin = () => {
    console.log('🔍 Google login - SIN Keyboard.dismiss()');
    Alert.alert('Info', 'Google login no implementado aún');
  };

  const navigateToRegister = () => {
    console.log('📝 Navigate to register');
    navigation.navigate('Register' as never); // ✅ NAVEGACIÓN A REGISTER
  };

  const showDevCredentials = () => {
    console.log('🛠️ Dev credentials - SIN Keyboard.dismiss()');
    setEmail('dev@test.com');
    setPassword('123456');
  };

  // 🎯 HANDLERS PARA INPUTS
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} translucent={false} />
      
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background.primary, 
        padding: 20, 
        justifyContent: 'center' 
      }}>
        
        {/* BOTÓN DEV */}
        <TouchableOpacity
          onPress={showDevCredentials}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 10,
            backgroundColor: colors.gray[600],
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ 
            color: colors.background.primary, 
            fontSize: 12, 
            fontWeight: 'bold' 
          }}>
            DEV
          </Text>
        </TouchableOpacity>

        {/* LOGO */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            source={require("../../../../assets/images/logo.png")}
            style={{ width: 250, height: 150 }}
            resizeMode="contain"
          />
        </View>

        {/* ✅ CONTENEDOR PRINCIPAL CON SOMBRA OFICIAL */}
        <View style={{
          width: '100%',
          backgroundColor: colors.background.primary,
          padding: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.gray[300],
          ...shadows.instascore, // ✅ SOMBRA OFICIAL INSTASCORE
        }}>
          
          {/* ERROR GLOBAL */}
          {authError && (
            <View style={{
              backgroundColor: colors.error[100],
              borderWidth: 1,
              borderColor: colors.error[500],
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 14,
                color: colors.error[500],
                textAlign: 'center'
              }}>
                {authError}
              </Text>
            </View>
          )}

          {/* EMAIL LABEL */}
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: colors.gray[700],
            marginBottom: 8,
            fontFamily: 'Nunito'
          }}>
            Correo Electrónico *
          </Text>

          {/* ✅ EMAIL INPUT CON ICONO */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: emailError ? colors.error[500] : colors.gray[300],
            borderRadius: 8,
            backgroundColor: colors.background.primary,
            marginBottom: emailError ? 4 : 16,
            paddingHorizontal: 15,
          }}>
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color={emailError ? colors.error[500] : colors.gray[500]} 
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Ingresa tu email"
              value={email}
              onChangeText={handleEmailChange}
              style={{
                flex: 1,
                padding: 15,
                fontSize: 16,
                fontFamily: 'Nunito',
                color: colors.gray[900],
              }}
              placeholderTextColor={colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={false}
            />
          </View>

          {/* EMAIL ERROR */}
          {emailError && (
            <Text style={{
              fontSize: 12,
              color: colors.error[500],
              marginBottom: 16,
              fontFamily: 'Nunito'
            }}>
              {emailError}
            </Text>
          )}

          {/* PASSWORD LABEL */}
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: colors.gray[700],
            marginBottom: 8,
            fontFamily: 'Nunito'
          }}>
            Contraseña *
          </Text>

          {/* ✅ PASSWORD INPUT CON ICONO */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: passwordError ? colors.error[500] : colors.gray[300],
            borderRadius: 8,
            backgroundColor: colors.background.primary,
            marginBottom: passwordError ? 4 : 24,
            paddingHorizontal: 15,
          }}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={passwordError ? colors.error[500] : colors.gray[500]} 
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
              style={{
                flex: 1,
                padding: 15,
                fontSize: 16,
                fontFamily: 'Nunito',
                color: colors.gray[900],
              }}
              placeholderTextColor={colors.gray[400]}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={false}
              onSubmitEditing={handleLogin}
            />
          </View>

          {/* PASSWORD ERROR */}
          {passwordError && (
            <Text style={{
              fontSize: 12,
              color: colors.error[500],
              marginBottom: 24,
              fontFamily: 'Nunito'
            }}>
              {passwordError}
            </Text>
          )}

          {/* ✅ BOTÓN LOGIN CON COLORES OFICIALES */}
          <TouchableOpacity
            style={{
              backgroundColor: isLoading ? colors.gray[300] : colors.primary[500], // ✅ AZUL OFICIAL
              borderRadius: 8,
              padding: 15,
              alignItems: 'center',
              marginBottom: 16,
              opacity: isLoading ? 0.6 : 1,
              ...shadows.instascore, // ✅ SOMBRA OFICIAL
            }}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={{
              color: colors.background.primary,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'Nunito'
            }}>
              {isLoading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
            </Text>
          </TouchableOpacity>

          {/* ✅ BOTÓN GOOGLE SIMPLE */}
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: colors.background.primary,
              borderWidth: 1,
              borderColor: colors.gray[300],
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: "https://developers.google.com/identity/images/g-logo.png",
              }}
              style={{ width: 20, height: 20, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.gray[700],
              fontFamily: 'Nunito'
            }}>
              {isLoading ? "Conectando..." : "Continuar con Google"}
            </Text>
          </TouchableOpacity>

          {/* ➖ SEPARADOR SIMPLE */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 16,
          }}>
            <View style={{ 
              flex: 1, 
              height: 1, 
              backgroundColor: colors.gray[300] 
            }} />
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ 
                fontSize: 14, 
                color: colors.gray[500] 
              }}>o</Text>
            </View>
            <View style={{ 
              flex: 1, 
              height: 1, 
              backgroundColor: colors.gray[300] 
            }} />
          </View>

          {/* ENLACE DE REGISTRO CON COLORES OFICIALES */}
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={{
              fontSize: 16,
              textAlign: 'center',
              color: colors.gray[600],
              fontFamily: 'Nunito'
            }}>
              ¿No tienes cuenta?{" "}
              <Text style={{
                fontSize: 16,
                color: colors.primary[500], // ✅ AZUL OFICIAL INSTASCORE
                fontWeight: '600',
                fontFamily: 'Nunito'
              }}>
                Regístrate aquí
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}