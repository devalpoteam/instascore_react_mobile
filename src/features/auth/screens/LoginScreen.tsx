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

// 🎨 COLORES DIRECTOS (sin imports problemáticos)
const COLORS = {
  primary: '#1105AD',
  secondary: '#F5A201', 
  background: '#FFFFFF',
  neutral: {
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
  },
  status: {
    error: '#EF4444',
    errorLight: '#FEE2E2',
  }
};

export default function LoginScreen() {
  // ✅ SOLO ESTADO LOCAL - SIN REDUX NI HOOKS PROBLEMÁTICOS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  // 🔐 HANDLE LOGIN SIMPLE (SIN KEYBOARD.DISMISS)
  const handleLogin = async () => {
    console.log('🔐 Login attempt - SIN Keyboard.dismiss()');
    
    // Limpiar errores previos
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validar
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Login successful');
      Alert.alert('Éxito', 'Login exitoso!');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔧 OTROS HANDLERS SIMPLES
  const handleGoogleLogin = () => {
    console.log('🔍 Google login - SIN Keyboard.dismiss()');
    Alert.alert('Info', 'Google login no implementado aún');
  };

  const navigateToRegister = () => {
    console.log('📝 Navigate to register - SIN Keyboard.dismiss()');
    Alert.alert('Info', 'Registro no implementado aún');
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 20, justifyContent: 'center' }}>
        
        {/* BOTÓN DEV */}
        <TouchableOpacity
          onPress={showDevCredentials}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 10,
            backgroundColor: COLORS.neutral[600],
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
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

        {/* ✅ CONTENEDOR SIMPLE - SIN InstaScoreCard QUE TIENE TouchableOpacity */}
        <View style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: COLORS.neutral[300],
          // Sombra simple
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
          
          {/*  ERROR GLOBAL */}
          {error && (
            <View style={{
              backgroundColor: COLORS.status.errorLight,
              borderWidth: 1,
              borderColor: COLORS.status.error,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 14,
                color: COLORS.status.error,
                textAlign: 'center'
              }}>
                {error}
              </Text>
            </View>
          )}

          {/* EMAIL LABEL */}
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: COLORS.neutral[700],
            marginBottom: 8,
            fontFamily: 'Nunito'
          }}>
            Correo Electrónico *
          </Text>

          {/* ✅ EMAIL INPUT */}
          <TextInput
            placeholder="Ingresa tu email"
            value={email}
            onChangeText={handleEmailChange}
            style={{
              borderWidth: 1,
              borderColor: emailError ? COLORS.status.error : COLORS.neutral[300],
              borderRadius: 8,
              padding: 15,
              fontSize: 16,
              backgroundColor: '#FFFFFF',
              marginBottom: emailError ? 4 : 16,
              fontFamily: 'Nunito',
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            blurOnSubmit={false}
            enablesReturnKeyAutomatically={false}
          />

          {/* EMAIL ERROR */}
          {emailError && (
            <Text style={{
              fontSize: 12,
              color: COLORS.status.error,
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
            color: COLORS.neutral[700],
            marginBottom: 8,
            fontFamily: 'Nunito'
          }}>
            Contraseña *
          </Text>

          {/* ✅ PASSWORD INPUT */}
          <TextInput
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
            style={{
              borderWidth: 1,
              borderColor: passwordError ? COLORS.status.error : COLORS.neutral[300],
              borderRadius: 8,
              padding: 15,
              fontSize: 16,
              backgroundColor: '#FFFFFF',
              marginBottom: passwordError ? 4 : 24,
              fontFamily: 'Nunito',
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            blurOnSubmit={false}
            enablesReturnKeyAutomatically={false}
            onSubmitEditing={handleLogin}
          />

          {/* PASSWORD ERROR */}
          {passwordError && (
            <Text style={{
              fontSize: 12,
              color: COLORS.status.error,
              marginBottom: 24,
              fontFamily: 'Nunito'
            }}>
              {passwordError}
            </Text>
          )}

          {/* ✅ BOTÓN LOGIN SIMPLE - SIN InstaScoreButton */}
          <TouchableOpacity
            style={{
              backgroundColor: isLoading ? COLORS.neutral[300] : COLORS.primary,
              borderRadius: 8,
              padding: 15,
              alignItems: 'center',
              marginBottom: 16,
              opacity: isLoading ? 0.6 : 1,
            }}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={{
              color: '#FFFFFF',
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
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: COLORS.neutral[300],
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
              color: COLORS.neutral[700],
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
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.neutral[300] }} />
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14, color: COLORS.neutral[500] }}>o</Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.neutral[300] }} />
          </View>

          {/* ✅ ENLACE DE REGISTRO SIMPLE */}
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={{
              fontSize: 16,
              textAlign: 'center',
              color: COLORS.neutral[600],
              fontFamily: 'Nunito'
            }}>
              ¿No tienes cuenta?{" "}
              <Text style={{
                fontSize: 16,
                color: COLORS.primary,
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