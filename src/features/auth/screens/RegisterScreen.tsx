// src/features/auth/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {View, Text, TextInput, KeyboardAvoidingView, Platform, Alert, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "@/design/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {  registerStart, registerSuccess, registerFailure } from "@/features/auth/store/authSlice";
import { useNavigation } from "@react-navigation/native";
import { useResponsive } from "@/shared/hooks/useResponsive";

// Opciones para el selector de sexo
const genderOptions = [
  { value: "M", label: "Masculino", icon: "man-outline" },
  { value: "F", label: "Femenino", icon: "woman-outline" },
];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  // ✅ ESTADO LOCAL PARA VALIDACIONES + REDUX PARA AUTH
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de errores individuales para validaciones
  const [nameError, setNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const responsive = useResponsive();

  // 🔧 VALIDACIONES LOCALES
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("El nombre es requerido");
      return false;
    }
    if (name.trim().length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateGender = (gender: string): boolean => {
    if (!gender) {
      setGenderError("Selecciona tu sexo");
      return false;
    }
    setGenderError("");
    return true;
  };

  const validateAge = (age: string): boolean => {
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum)) {
      setAgeError("La edad es requerida");
      return false;
    }
    if (ageNum < 5 || ageNum > 120) {
      setAgeError("Edad debe estar entre 5 y 120 años");
      return false;
    }
    setAgeError("");
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("El correo es requerido");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Ingresa un correo válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleRegister = async () => {
    console.log("📝 Register attempt with Redux");

    // Limpiar errores previos
    setNameError("");
    setGenderError("");
    setAgeError("");
    setEmailError("");
    setPasswordError("");

    // Validar todos los campos
    const isNameValid = validateName(name);
    const isGenderValid = validateGender(gender);
    const isAgeValid = validateAge(age);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (
      !isNameValid ||
      !isGenderValid ||
      !isAgeValid ||
      !isEmailValid ||
      !isPasswordValid
    ) {
      return;
    }

    dispatch(registerStart());

    try {
      // Simular registro exitoso
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        email: email,
        name: name,
        gender: gender,
        age: parseInt(age, 10),
        isPro: false,
        role: "user",
      };

      dispatch(
        registerSuccess({
          token: "mock-jwt-token-new-user",
          user: mockUser,
        })
      );

      console.log("✅ Register successful");
      Alert.alert("Éxito", "Cuenta creada exitosamente!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login" as never),
        },
      ]);
    } catch (err: any) {
      console.error("❌ Register error:", err);
      dispatch(registerFailure(err.message || "Error al crear la cuenta"));
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login" as never);
  };

  const showDevCredentials = () => {
    console.log("🛠️ Dev credentials for register");
    setName("Usuario Test");
    setGender("M");
    setAge("25");
    setEmail("test@register.com");
    setPassword("123456");
  };

  // 🎯 HANDLERS PARA INPUTS
  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) setNameError("");
  };

  const handleAgeChange = (text: string) => {
    setAge(text);
    if (ageError) setAgeError("");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.primary}
        translucent={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: colors.background.lighter }}
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
              position: "absolute",
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
            <Text
              style={{
                color: colors.background.primary,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              DEV
            </Text>
          </TouchableOpacity>

          {/* LOGO Y ENCABEZADO */}
          <View
            style={{
              alignItems: "center",
              marginBottom: responsive.isIOS ? 8 : 15,
            }}
          >
            <Image
              source={require("../../../../assets/images/logo.png")}
              style={{ width: 180, height: 120 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: colors.primary[500],
                textAlign: "center",
                marginTop: responsive.isIOS ? -10 : 5,
                fontFamily: "Nunito",
              }}
            >
              Bienvenido a InstaScore
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.gray[600],
                textAlign: "center",
                marginTop: 5,
                marginBottom: responsive.isIOS ? 4 : 0,
                fontFamily: "Nunito",
              }}
            >
              Crea tu cuenta y comienza a seguir los eventos
            </Text>
          </View>

          {/* ✅ CONTENEDOR PRINCIPAL CON SOMBRA OFICIAL */}
          <View
            style={{
              width: "100%",
              backgroundColor: colors.background.primary,
              padding: 20,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.gray[300],
              ...shadows.instascore,
            }}
          >
            {/* ERROR GLOBAL */}
            {authError && (
              <View
                style={{
                  backgroundColor: colors.error[100],
                  borderWidth: 1,
                  borderColor: colors.error[500],
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.error[500],
                    textAlign: "center",
                  }}
                >
                  {authError}
                </Text>
              </View>
            )}

            {/* NOMBRE COMPLETO */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.gray[700],
                marginBottom: 8,
                fontFamily: "Nunito",
              }}
            >
              Nombre completo *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: nameError ? colors.error[500] : colors.gray[300],
                borderRadius: 8,
                backgroundColor: colors.background.primary,
                marginBottom: nameError ? 4 : 16,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={nameError ? colors.error[500] : colors.gray[500]}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Ingresa tu nombre completo"
                value={name}
                onChangeText={handleNameChange}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 16,
                  fontFamily: "Nunito",
                  color: colors.gray[900],
                }}
                placeholderTextColor={colors.gray[400]}
                autoCapitalize="words"
              />
            </View>
            {nameError && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {nameError}
              </Text>
            )}

            {/* SEXO */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.gray[700],
                marginBottom: 8,
                fontFamily: "Nunito",
              }}
            >
              Sexo *
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: genderError ? 4 : 16,
              }}
            >
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={{
                    flex: 1,
                    marginHorizontal: 4,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor:
                      gender === option.value
                        ? colors.primary[500]
                        : colors.background.primary,
                    borderWidth: 1,
                    borderColor:
                      gender === option.value
                        ? colors.primary[500]
                        : colors.gray[300],
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setGender(option.value);
                    if (genderError) setGenderError("");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={
                      gender === option.value
                        ? colors.background.primary
                        : colors.gray[600]
                    }
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        gender === option.value
                          ? colors.background.primary
                          : colors.gray[600],
                      fontFamily: "Nunito",
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {genderError && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {genderError}
              </Text>
            )}

            {/* EDAD */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.gray[700],
                marginBottom: 8,
                fontFamily: "Nunito",
              }}
            >
              Edad *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: ageError ? colors.error[500] : colors.gray[300],
                borderRadius: 8,
                backgroundColor: colors.background.primary,
                marginBottom: ageError ? 4 : 16,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={ageError ? colors.error[500] : colors.gray[500]}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Ingresa tu edad"
                value={age}
                onChangeText={handleAgeChange}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 16,
                  fontFamily: "Nunito",
                  color: colors.gray[900],
                }}
                placeholderTextColor={colors.gray[400]}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            {ageError && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {ageError}
              </Text>
            )}

            {/* EMAIL */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.gray[700],
                marginBottom: 8,
                fontFamily: "Nunito",
              }}
            >
              Correo Electrónico *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: emailError ? colors.error[500] : colors.gray[300],
                borderRadius: 8,
                backgroundColor: colors.background.primary,
                marginBottom: emailError ? 4 : 16,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailError ? colors.error[500] : colors.gray[500]}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={handleEmailChange}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 16,
                  fontFamily: "Nunito",
                  color: colors.gray[900],
                }}
                placeholderTextColor={colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {emailError}
              </Text>
            )}

            {/* CONTRASEÑA */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.gray[700],
                marginBottom: 8,
                fontFamily: "Nunito",
              }}
            >
              Contraseña *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: passwordError
                  ? colors.error[500]
                  : colors.gray[300],
                borderRadius: 8,
                backgroundColor: colors.background.primary,
                marginBottom: passwordError ? 4 : 8,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordError ? colors.error[500] : colors.gray[500]}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  padding: 15,
                  fontSize: 16,
                  fontFamily: "Nunito",
                  color: colors.gray[900],
                }}
                placeholderTextColor={colors.gray[400]}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 5 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>
            </View>
            {passwordError && (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error[500],
                  marginBottom: 8,
                  fontFamily: "Nunito",
                }}
              >
                {passwordError}
              </Text>
            )}

            {/* HINT DE CONTRASEÑA */}
            <Text
              style={{
                fontSize: 12,
                color: colors.gray[500],
                marginBottom: 24,
                fontFamily: "Nunito",
              }}
            >
              Debe contener al menos 6 caracteres
            </Text>

            {/* ✅ BOTÓN REGISTRO CON COLORES OFICIALES */}
            <TouchableOpacity
              style={{
                backgroundColor: isLoading
                  ? colors.gray[300]
                  : colors.secondary[500], // ✅ NARANJA OFICIAL
                borderRadius: 8,
                padding: 15,
                alignItems: "center",
                marginBottom: 16,
                opacity: isLoading ? 0.6 : 1,
                ...shadows.orange, // ✅ SOMBRA NARANJA OFICIAL
              }}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: colors.background.primary,
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "Nunito",
                }}
              >
                {isLoading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
              </Text>
            </TouchableOpacity>

            {/* ✅ ENLACE A LOGIN CON COLORES OFICIALES */}
            <TouchableOpacity onPress={navigateToLogin}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  color: colors.gray[600],
                  fontFamily: "Nunito",
                }}
              >
                ¿Ya tienes cuenta?{" "}
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.primary[500], // ✅ AZUL OFICIAL INSTASCORE
                    fontWeight: "600",
                    fontFamily: "Nunito",
                  }}
                >
                  Inicia sesión
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
