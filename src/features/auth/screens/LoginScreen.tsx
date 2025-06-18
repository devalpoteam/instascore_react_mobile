// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, Alert, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import Button from "@/shared/components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigation/AuthNavigator";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Función para mostrar/ocultar contraseña
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  // Función para ocultar el teclado
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Usuarios mock de desarrollo
  const devUsers = {
    "dev-free@instascore.com": {
      id: "dev-1",
      email: "dev-free@instascore.com",
      name: "Usuario Free (Dev)",
      isPro: false,
      role: "user"
    },
    "dev-pro@instascore.com": {
      id: "dev-2", 
      email: "dev-pro@instascore.com",
      name: "Usuario Pro (Dev)",
      isPro: true,
      role: "user"
    },
    "dev-admin@instascore.com": {
      id: "dev-3",
      email: "dev-admin@instascore.com", 
      name: "Usuario Admin (Dev)",
      isPro: true,
      role: "admin"
    }
  };

  const handleLogin = async () => {
    // Ocultar teclado al intentar iniciar sesión
    Keyboard.dismiss();
    
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    dispatch(loginStart());

    try {
      // Verificar si es una cuenta de desarrollo
      const devUser = devUsers[email.toLowerCase() as keyof typeof devUsers];
      
      if (devUser && password === "123456") {
        // Login con cuenta de desarrollo
        setTimeout(() => {
          dispatch(
            loginSuccess({
              token: `mock-dev-token-${devUser.role}`,
              user: devUser,
            })
          );
        }, 1000);
        return;
      }

      // Login normal (mock)
      setTimeout(() => {
        const mockUser = {
          id: "1",
          email: email,
          name: "Usuario Demo",
          isPro: false,
          role: "user"
        };

        dispatch(
          loginSuccess({
            token: "mock-jwt-token",
            user: mockUser,
          })
        );
      }, 1500);
    } catch (err: any) {
      dispatch(loginFailure(err.message || "Error de autenticación"));
    }
  };

  const handleGoogleLogin = async () => {
    // Ocultar teclado al intentar iniciar sesión con Google
    Keyboard.dismiss();
    
    dispatch(loginStart());

    try {
      // Mock Google login
      setTimeout(() => {
        const mockGoogleUser = {
          id: "2",
          email: "usuario@gmail.com",
          name: "Usuario Google",
          isPro: true, // Mock user Pro para probar
          role: "user"
        };

        dispatch(
          loginSuccess({
            token: "mock-google-jwt-token",
            user: mockGoogleUser,
          })
        );
      }, 2000);
    } catch (err: any) {
      dispatch(loginFailure("Error al iniciar sesión con Google"));
    }
  };

  const navigateToRegister = () => {
    // Ocultar teclado al navegar
    Keyboard.dismiss();
    
    navigation.navigate("Register");
  };

  const showDevCredentials = () => {
    // Ocultar teclado al mostrar credenciales
    Keyboard.dismiss();
    
    Alert.alert(
      "🔧 Cuentas de Desarrollo",
      "Usa estas credenciales para probar:\n\n" +
      "👤 FREE:\n" +
      "dev-free@instascore.com\n" +
      "123456\n\n" +
      "⭐ PRO:\n" +
      "dev-pro@instascore.com\n" +
      "123456\n\n" +
      "👑 ADMIN:\n" +
      "dev-admin@instascore.com\n" +
      "123456",
      [
        {
          text: "Cerrar",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        className="flex-1"
        style={{ backgroundColor: "#F5EED5" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Botón DEV - para ver credenciales de pruebas */}
        <TouchableOpacity
          onPress={showDevCredentials}
          className="absolute top-12 right-4 z-10 bg-gray-600 rounded-full px-3 py-1"
          activeOpacity={0.7}
        >
          <Text className="text-white text-xs font-bold">DEV</Text>
        </TouchableOpacity>

        <View className="flex-1 justify-center items-center px-8">
          {/* Logo */}
          <View className="items-center mb-4">
            <Image
              source={require("../../../../assets/images/logo.png")}
              style={{
                width: 250,
                height: 150,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Formulario */}
          <View className="w-full max-w-sm">
            {error && (
              <View className="bg-red-100 border border-red-300 p-3 rounded-lg mb-4">
                <Text className="text-red-600 text-center text-sm">{error}</Text>
              </View>
            )}

            {/* Campo Email */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Correo Electrónico
              </Text>
              <View className="relative flex-row items-center bg-white border border-gray-300 rounded-lg px-3 h-[50px]">
                <Text className="text-gray-400 mr-2 text-lg">👤</Text>
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Ingresa tu email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ 
                    flex: 1,
                    fontSize: 16,
                    height: 50,
                    // Ajuste específico para iOS para centrar texto verticalmente
                    ...(Platform.OS === 'ios' && {
                      lineHeight: 20,
                      paddingTop: 15,
                      paddingBottom: 10,
                      transform: [{ translateY: -2 }]
                    })
                  }}
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View className="mb-6">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Contraseña
              </Text>
              <View className="relative flex-row items-center bg-white border border-gray-300 rounded-lg px-3 h-[50px]">
                <Text className="text-gray-400 mr-2 text-lg">🔒</Text>
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ 
                    flex: 1,
                    fontSize: 16,
                    height: 50,
                    // Ajuste específico para iOS para centrar texto verticalmente
                    ...(Platform.OS === 'ios' && {
                      lineHeight: 20,
                      paddingTop: 15,
                      paddingBottom: 10,
                      transform: [{ translateY: -2 }]
                    })
                  }}
                />
                <TouchableOpacity onPress={toggleSecureEntry}>
                  <Text className="text-gray-400 text-lg">👁</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Iniciar Sesión */}
            <Button
              title="INICIAR SESIÓN"
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              className="w-full mb-4"
            />

            {/* Botón Google */}
            <TouchableOpacity
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex-row items-center justify-center mb-6 shadow-sm"
              onPress={handleGoogleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {/* Logo SVG de Google */}
              <View style={{ width: 20, height: 20, marginRight: 12 }}>
                <Image
                  source={{
                    uri: "https://developers.google.com/identity/images/g-logo.png",
                  }}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-gray-700 font-medium text-base">
                {isLoading ? "Conectando..." : "Continuar con Google"}
              </Text>
            </TouchableOpacity>

            {/* Separador */}
            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500 text-sm">o</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Texto de registro */}
            <TouchableOpacity onPress={navigateToRegister}>
              <Text className="text-center text-gray-600 text-sm">
                ¿No tienes cuenta?{" "}
                <Text className="text-instascore-blue font-medium">
                  Regístrate aquí
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}