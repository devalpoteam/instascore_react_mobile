// src/features/auth/screens/RegisterScreenOption2.tsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Pressable,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerStart, registerSuccess, registerFailure } from "../store/authSlice";
import Button from "@/shared/components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";

// Opciones para el selector de sexo
const genderOptions = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" }
];

export default function RegisterScreenOption2({ navigation }: any) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  // Función para ocultar el teclado
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleRegister = async () => {
    // Ocultar el teclado
    Keyboard.dismiss();
    
    // Validación básica
    if (!name || !gender || !age || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    // Validación de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
      return;
    }

    // Validación de edad
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      Alert.alert("Error", "Por favor ingresa una edad válida (entre 5 y 120 años)");
      return;
    }

    // Longitud mínima de contraseña
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    dispatch(registerStart());

    try {
      // Mock del registro exitoso
      setTimeout(() => {
        const mockUser = {
          id: Math.random().toString(36).substring(2, 9), // ID aleatorio
          email: email,
          name: name,
          gender: gender,
          age: ageNum,
          isPro: false,
          role: "user"
        };

        dispatch(
          registerSuccess({
            token: "mock-jwt-token-new-user",
            user: mockUser,
          })
        );
      }, 1500);
    } catch (err: any) {
      dispatch(registerFailure(err.message || "Error al registrar usuario"));
    }
  };

  const navigateToLogin = () => {
    // Ocultar el teclado
    Keyboard.dismiss();
    navigation.navigate("Login");
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView className="flex-1 bg-[#F5EED5]">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingBottom: Platform.OS === "ios" ? 20 : 30,
              ...(Platform.OS === "ios" && { paddingTop: 5 })
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header with logo and gradient background */}
            <View className="items-center pt-3 px-6 mb-2">
              <Image
                source={require("../../../../assets/images/logo.png")}
                style={{
                  width: 120,
                  height: 75,
                }}
                resizeMode="contain"
              />
              <Text className={`text-xl font-bold text-instascore-blue mt-2 text-center ${Platform.OS === "ios" ? "mb-2" : "mb-2"}`}>
                Bienvenido a InstaScore
              </Text>
              <Text className={`text-sm text-gray-600 text-center mt-0 ${Platform.OS === "ios" ? "mb-2" : "mb-4"}`}>
                Crea tu cuenta y comienza a seguir los eventos
              </Text>
            </View>

            {/* Form fields - directly on the background */}
            <View className="px-5">
              {error && (
                <View className="bg-red-100 rounded-lg p-3 mb-4">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              )}

              {/* Nombre */}
              <View style={{ marginBottom: Platform.OS === "ios" ? 12 : 16 }}>
                <Text className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Nombre completo
                </Text>
                <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-4 h-[54px] shadow-sm">
                  <Text className="mr-2 text-base">👤</Text>
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="Ingresa tu nombre completo"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    style={{ 
                      flex: 1,
                      fontSize: 16,
                      height: 54,
                      // Ajustes para iOS para centrar el texto verticalmente
                      ...(Platform.OS === 'ios' && {
                        lineHeight: 20,
                        paddingTop: 18,
                        paddingBottom: 12,
                        transform: [{ translateY: -2 }]
                      })
                    }}
                  />
                </View>
              </View>

              {/* Sexo */}
              <View style={{ marginBottom: Platform.OS === "ios" ? 12 : 16 }}>
                <Text className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Sexo
                </Text>
                <View className="flex-row justify-between">
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      className={`flex-1 mx-1 py-3.5 rounded-2xl ${
                        gender === option.value
                          ? "bg-instascore-blue border-instascore-blue"
                          : "bg-white border border-gray-300"
                      } items-center shadow-sm`}
                      onPress={() => setGender(option.value)}
                    >
                      <Text 
                        className={`text-sm font-semibold ${
                          gender === option.value ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Edad */}
              <View style={{ marginBottom: Platform.OS === "ios" ? 12 : 16 }}>
                <Text className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Edad
                </Text>
                <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-4 h-[54px] shadow-sm">
                  <Text className="mr-2 text-base">🎂</Text>
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="Ingresa tu edad"
                    placeholderTextColor="#9ca3af"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    maxLength={3}
                    style={{ 
                      flex: 1,
                      fontSize: 16,
                      height: 54,
                      // Ajustes para iOS para centrar el texto verticalmente
                      ...(Platform.OS === 'ios' && {
                        lineHeight: 20,
                        paddingTop: 18,
                        paddingBottom: 12,
                        transform: [{ translateY: -2 }]
                      })
                    }}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={{ marginBottom: Platform.OS === "ios" ? 12 : 16 }}>
                <Text className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Correo Electrónico
                </Text>
                <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-4 h-[54px] shadow-sm">
                  <Text className="mr-2 text-base">✉️</Text>
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ 
                      flex: 1,
                      fontSize: 16,
                      height: 54,
                      // Ajustes para iOS para centrar el texto verticalmente
                      ...(Platform.OS === 'ios' && {
                        lineHeight: 20,
                        paddingTop: 18,
                        paddingBottom: 12,
                        transform: [{ translateY: -2 }]
                      })
                    }}
                  />
                </View>
              </View>

              {/* Contraseña */}
              <View style={{ marginBottom: Platform.OS === "ios" ? 12 : 8 }}>
                <Text className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                  Contraseña
                </Text>
                <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-4 h-[54px] shadow-sm">
                  <Text className="mr-2 text-base">🔒</Text>
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    style={{ 
                      flex: 1,
                      fontSize: 16,
                      height: 54,
                      // Ajustes para iOS para centrar el texto verticalmente
                      ...(Platform.OS === 'ios' && {
                        lineHeight: 20,
                        paddingTop: 18,
                        paddingBottom: 12,
                        transform: [{ translateY: -2 }]
                      })
                    }}
                  />
                  <TouchableOpacity onPress={toggleSecureEntry}>
                    <Text className="text-gray-500 text-lg">👁</Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-500 mt-1 ml-1">
                  Debe contener al menos 6 caracteres
                </Text>
              </View>

              {/* Espaciador adicional en iOS */}
              {Platform.OS === "ios" && <View style={{ height: 8.5 }} />}

              {/* Register Button */}
              <TouchableOpacity
                style={{ marginTop: Platform.OS === "ios" ? 2 : 20 }}
                className={`bg-instascore-orange rounded-2xl py-4 items-center shadow-md ${
                  isLoading ? "opacity-80" : ""
                }`}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">
                  {isLoading ? "Creando cuenta..." : "CREAR CUENTA"}
                </Text>
              </TouchableOpacity>

              {/* Espaciador adicional en iOS */}
              {Platform.OS === "ios" && <View style={{ height: 9.5 }} />}

              {/* Login link */}
              <View style={{ marginTop: Platform.OS === "ios" ? 3 : 20 }} className="flex-row justify-center">
                <Text className="text-gray-600 text-sm">¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text className="text-instascore-blue font-semibold text-sm">
                    Inicia sesión
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}