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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/features/auth/store/authSlice';
import { useNavigation } from '@react-navigation/native';
import { shadowStyles } from '@/styles/shadowStyles'; // ✅ IMPORTAR SOMBRAS

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  // ESTADO LOCAL PARA VALIDACIONES + REDUX PARA AUTH
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // VALIDACIONES LOCALES SIMPLES
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

  //  HANDLE LOGIN CON REDUX
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
   
    Alert.alert('Info', 'Google login no implementado aún');
  };

  const navigateToRegister = () => {

    navigation.navigate('Register' as never);
  };

  const showDevCredentials = () => {

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
      
      <View className="flex-1 bg-white p-5 justify-center">
        
        {/* BOTÓN DEV */}
        <TouchableOpacity
          onPress={showDevCredentials}
          className="absolute top-12 right-5 z-10 bg-gray-600 rounded-2xl px-3 py-1.5"
          style={shadowStyles.neutral.sm} // ✅ SOMBRA NATIVA
          activeOpacity={0.7}
        >
          <Text className="text-white text-xs font-bold">
            DEV
          </Text>
        </TouchableOpacity>

        {/* LOGO */}
        <View className="items-center mb-10">
          <Image
            source={require("../../../../assets/images/logo.png")}
            className="w-64 h-36"
            resizeMode="contain"
          />
        </View>

        {/* ✅ CONTENEDOR PRINCIPAL CON SOMBRA NATIVA */}
        <View 
          className="w-full bg-white p-5 rounded-xl border border-gray-300"
          style={shadowStyles.instascore.base} // ✅ SOMBRA NATIVA INSTASCORE
        >
          
          {/* ERROR GLOBAL */}
          {authError && (
            <View 
              className="bg-red-50 border border-red-500 p-3 rounded-lg mb-4"
              style={shadowStyles.neutral.sm} // ✅ SOMBRA SUTIL PARA ERROR
            >
              <Text className="text-sm text-red-500 text-center">
                {authError}
              </Text>
            </View>
          )}

          {/* EMAIL LABEL */}
          <Text className="text-base font-medium text-gray-700 mb-2 font-nunito">
            Correo Electrónico *
          </Text>

          {/* EMAIL INPUT CON ICONO */}
          <View className={`flex-row items-center border rounded-lg bg-white px-4 ${
            emailError ? 'border-red-500' : 'border-gray-300'
          } ${emailError ? 'mb-1' : 'mb-4'}`}>
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color={emailError ? '#EF4444' : '#737373'} 
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Ingresa tu email"
              value={email}
              onChangeText={handleEmailChange}
              className="flex-1 py-4 text-base text-gray-900 font-nunito"
              placeholderTextColor="#A3A3A3"
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
            <Text className="text-xs text-red-500 mb-4 font-nunito">
              {emailError}
            </Text>
          )}

          {/* PASSWORD LABEL */}
          <Text className="text-base font-medium text-gray-700 mb-2 font-nunito">
            Contraseña *
          </Text>

          {/* ✅ PASSWORD INPUT CON ICONO */}
          <View className={`flex-row items-center border rounded-lg bg-white px-4 ${
            passwordError ? 'border-red-500' : 'border-gray-300'
          } ${passwordError ? 'mb-1' : 'mb-6'}`}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={passwordError ? '#EF4444' : '#737373'} 
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
              className="flex-1 py-4 text-base text-gray-900 font-nunito"
              placeholderTextColor="#A3A3A3"
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
            <Text className="text-xs text-red-500 mb-6 font-nunito">
              {passwordError}
            </Text>
          )}

          {/* ✅ BOTÓN LOGIN CON SOMBRA NATIVA */}
          <TouchableOpacity
            className={`${
              isLoading ? 'bg-gray-300' : 'bg-instascore-blue'
            } rounded-lg p-4 items-center mb-4 ${
              isLoading ? 'opacity-60' : ''
            }`}
            style={!isLoading ? shadowStyles.instascore.base : undefined} // ✅ SOMBRA SOLO SI NO ESTÁ LOADING
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold font-nunito">
              {isLoading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
            </Text>
          </TouchableOpacity>

          {/* ✅ BOTÓN GOOGLE CON SOMBRA SUTIL */}
          <TouchableOpacity
            className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex-row items-center justify-center mb-5"
            style={shadowStyles.neutral.sm} // ✅ SOMBRA SUTIL PARA BOTÓN SECUNDARIO
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: "https://developers.google.com/identity/images/g-logo.png",
              }}
              className="w-5 h-5 mr-2"
              resizeMode="contain"
            />
            <Text className="text-base font-medium text-gray-700 font-nunito">
              {isLoading ? "Conectando..." : "Continuar con Google"}
            </Text>
          </TouchableOpacity>

          {/* SEPARADOR */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300" />
            <View className="px-4">
              <Text className="text-sm text-gray-500">o</Text>
            </View>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* ENLACE DE REGISTRO CON COLORES OFICIALES */}
          <TouchableOpacity onPress={navigateToRegister}>
            <Text className="text-base text-center text-gray-600 font-nunito">
              ¿No tienes cuenta?{" "}
              <Text className="text-base text-instascore-blue font-semibold font-nunito">
                Regístrate aquí
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}