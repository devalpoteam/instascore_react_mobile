// src/features/auth/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {View, Text, TextInput, KeyboardAvoidingView, Platform, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColor } from "@/design/colorHelper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerAsync } from "@/features/auth/store/authSlice";
import { useNavigation } from "@react-navigation/native";
import { useResponsive } from "@/shared/hooks/useResponsive";

const genderOptions = [
  { value: "M", label: "Masculino", icon: "man-outline" },
  { value: "F", label: "Femenino", icon: "woman-outline" },
];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const responsive = useResponsive();

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
    setNameError("");
    setGenderError("");
    setAgeError("");
    setEmailError("");
    setPasswordError("");

    const isNameValid = validateName(name);
    const isGenderValid = validateGender(gender);
    const isAgeValid = validateAge(age);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isGenderValid || !isAgeValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    dispatch(registerAsync({
      email,
      password,
      fullName: name,
      Sexo: gender,
      Edad: age
    }));
  };

  const navigateToLogin = () => {
    navigation.navigate("Login" as never);
  };


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
        backgroundColor={getColor.background.primary}
        translucent={false}
      />

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
                color: getColor.primary[500],
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
                color: getColor.gray[600],
                textAlign: "center",
                marginTop: 5,
                marginBottom: responsive.isIOS ? 4 : 0,
                fontFamily: "Nunito",
              }}
            >
              Crea tu cuenta y comienza a seguir los eventos
            </Text>
          </View>

          <View
            style={{
              width: "100%",
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
            }}
          >
            {authError && (
              <View
                style={{
                  backgroundColor: getColor.error[100],
                  borderWidth: 1,
                  borderColor: getColor.error[500],
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: getColor.error[500],
                    textAlign: "center",
                  }}
                >
                  {authError}
                </Text>
              </View>
            )}

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: getColor.gray[700],
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
                borderColor: nameError ? getColor.error[500] : getColor.gray[300],
                borderRadius: 8,
                backgroundColor: getColor.background.primary,
                marginBottom: nameError ? 4 : 16,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={nameError ? getColor.error[500] : getColor.gray[500]}
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
                  color: getColor.gray[900],
                }}
                placeholderTextColor={getColor.gray[400]}
                autoCapitalize="words"
              />
            </View>
            {nameError && (
              <Text
                style={{
                  fontSize: 12,
                  color: getColor.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {nameError}
              </Text>
            )}

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: getColor.gray[700],
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
                        ? getColor.primary[500]
                        : getColor.background.primary,
                    borderWidth: 1,
                    borderColor:
                      gender === option.value
                        ? getColor.primary[500]
                        : getColor.gray[300],
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
                        ? getColor.background.primary
                        : getColor.gray[600]
                    }
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        gender === option.value
                          ? getColor.background.primary
                          : getColor.gray[600],
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
                  color: getColor.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {genderError}
              </Text>
            )}

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: getColor.gray[700],
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
                borderColor: ageError ? getColor.error[500] : getColor.gray[300],
                borderRadius: 8,
                backgroundColor: getColor.background.primary,
                marginBottom: ageError ? 4 : 16,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={ageError ? getColor.error[500] : getColor.gray[500]}
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
                  color: getColor.gray[900],
                }}
                placeholderTextColor={getColor.gray[400]}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            {ageError && (
              <Text
                style={{
                  fontSize: 12,
                  color: getColor.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {ageError}
              </Text>
            )}

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: getColor.gray[700],
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
                borderColor: emailError ? getColor.error[500] : getColor.gray[300],
                borderRadius: 8,
                backgroundColor: getColor.background.primary,
                marginBottom: emailError ? 4 : 16,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailError ? getColor.error[500] : getColor.gray[500]}
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
                  color: getColor.gray[900],
                }}
                placeholderTextColor={getColor.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {emailError && (
              <Text
                style={{
                  fontSize: 12,
                  color: getColor.error[500],
                  marginBottom: 16,
                  fontFamily: "Nunito",
                }}
              >
                {emailError}
              </Text>
            )}

            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: getColor.gray[700],
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
                  ? getColor.error[500]
                  : getColor.gray[300],
                borderRadius: 8,
                backgroundColor: getColor.background.primary,
                marginBottom: passwordError ? 4 : 8,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordError ? getColor.error[500] : getColor.gray[500]}
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
                  color: getColor.gray[900],
                }}
                placeholderTextColor={getColor.gray[400]}
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
                  color={getColor.gray[500]}
                />
              </TouchableOpacity>
            </View>
            {passwordError && (
              <Text
                style={{
                  fontSize: 12,
                  color: getColor.error[500],
                  marginBottom: 8,
                  fontFamily: "Nunito",
                }}
              >
                {passwordError}
              </Text>
            )}

            <Text
              style={{
                fontSize: 12,
                color: getColor.gray[500],
                marginBottom: 24,
                fontFamily: "Nunito",
              }}
            >
              Debe contener al menos 6 caracteres
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: isLoading
                  ? getColor.gray[300]
                  : getColor.secondary[500],
                borderRadius: 8,
                padding: 15,
                alignItems: "center",
                marginBottom: 16,
                opacity: isLoading ? 0.6 : 1,
                shadowColor: getColor.secondary[500],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: getColor.background.primary,
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "Nunito",
                }}
              >
                {isLoading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToLogin}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  color: getColor.gray[600],
                  fontFamily: "Nunito",
                }}
              >
                ¿Ya tienes cuenta?{" "}
                <Text
                  style={{
                    fontSize: 16,
                    color: getColor.primary[500],
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