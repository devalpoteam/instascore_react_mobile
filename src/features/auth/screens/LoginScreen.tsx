// src/features/auth/screens/LoginScreen.tsx
import React, { useCallback, useMemo } from "react";
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  StatusBar
} from "react-native";

// HOOKS PERSONALIZADOS
import { useLoginLogic, useLoginValidation } from "../hooks";

// ESTILOS
import { createLoginStyles, COLORS } from "./LoginScreen.styles";

// 🎨 DESIGN SYSTEM
import {
  InstaScoreButton,
  InstaScoreEmailInput,
  InstaScorePasswordInput,
  InstaScoreText,
  InstaScoreCard,
  useResponsive,
} from "@/design";

export default function LoginScreen() {
  // LÓGICA DE AUTENTICACIÓN
  const {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
    handleGoogleLogin,
    navigateToRegister,
    showDevCredentials,
  } = useLoginLogic();

  // VALIDACIONES
  const {
    emailError,
    passwordError,
    validateForm,
    clearEmailError,
    clearPasswordError,
  } = useLoginValidation();

  // 🎨 RESPONSIVE Y ESTILOS
  const responsive = useResponsive();
  const styles = useMemo(() => createLoginStyles(responsive), [responsive]);

  // 🔐 HANDLERS OPTIMIZADOS CON useCallback
  const handleLoginWithValidation = useCallback(() => {
    if (validateForm(email, password)) {
      handleLogin();
    }
  }, [email, password, validateForm, handleLogin]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (emailError) clearEmailError();
  }, [setEmail, emailError, clearEmailError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (passwordError) clearPasswordError();
  }, [setPassword, passwordError, clearPasswordError]);

  return (
    <>
      {/* ✅ STATUS BAR CONFIGURADO */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.background} 
        translucent={false}
      />
      
      {/* ✅ CONTENEDOR PRINCIPAL CON FONDO FORZADO */}
      <View style={styles.mainContainerStyle}>
        <KeyboardAvoidingView
          style={styles.keyboardContainerStyle}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          {/* BOTÓN DEV */}
          <TouchableOpacity
            onPress={showDevCredentials}
            style={styles.devButtonStyle}
            activeOpacity={0.7}
          >
            <InstaScoreText variant="caption" color="#FFFFFF" weight="bold">
              DEV
            </InstaScoreText>
          </TouchableOpacity>

          {/* CONTENIDO PRINCIPAL */}
          <ScrollView 
            style={styles.scrollViewStyle}
            contentContainerStyle={styles.scrollContainerStyle}
            showsVerticalScrollIndicator={false}
            // ✅ CONFIGURACIÓN CRÍTICA PARA MANTENER TECLADO
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            scrollEventThrottle={16}
            bounces={false}
            automaticallyAdjustKeyboardInsets={false}
            automaticallyAdjustContentInsets={false}
          >
            <View style={styles.contentContainerStyle}>
              {/* LOGO */}
              <View style={styles.logoContainerStyle}>
                <Image
                  source={require("../../../../assets/images/logo.png")}
                  style={styles.logoImageStyle}
                  resizeMode="contain"
                />
              </View>

              {/* FORMULARIO */}
              <InstaScoreCard 
                style={styles.formContainerStyle} 
                variant="elevated"
              >
                {/* ERROR GLOBAL */}
                {error && (
                  <View style={styles.errorContainerStyle}>
                    <InstaScoreText 
                      variant="caption" 
                      color={COLORS.status.error}
                      textAlign="center"
                    >
                      {error}
                    </InstaScoreText>
                  </View>
                )}

                {/* INPUT EMAIL - CRÍTICO PARA TECLADO */}
                <InstaScoreEmailInput
                  label="Correo Electrónico"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChangeText={handleEmailChange}
                  error={emailError}
                  required
                  style={{ marginBottom: responsive?.spacing?.md || 16 }}
                  // ✅ CONFIGURACIÓN CRÍTICA PARA TECLADO
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically={false}
                  autoComplete="email"
                  importantForAutofill="yes"
                />

                {/* INPUT PASSWORD - CRÍTICO PARA TECLADO */}
                <InstaScorePasswordInput
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={handlePasswordChange}
                  error={passwordError}
                  required
                  style={{ marginBottom: responsive?.spacing?.lg || 24 }}
                  // ✅ CONFIGURACIÓN CRÍTICA PARA TECLADO
                  textContentType="password"
                  returnKeyType="done"
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically={false}
                  autoComplete="password"
                  importantForAutofill="yes"
                  onSubmitEditing={handleLoginWithValidation}
                />

                {/* BOTÓN LOGIN */}
                <InstaScoreButton
                  title="INICIAR SESIÓN"
                  onPress={handleLoginWithValidation}
                  disabled={isLoading}
                  loading={isLoading}
                  variant="primary"
                  size={responsive?.isTablet ? "lg" : "md"}
                  fullWidth
                  style={{ marginBottom: responsive?.spacing?.md || 16 }}
                />

                {/* BOTÓN GOOGLE */}
                <TouchableOpacity
                  style={styles.googleButtonStyle}
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri: "https://developers.google.com/identity/images/g-logo.png",
                    }}
                    style={styles.googleIconStyle}
                    resizeMode="contain"
                  />
                  <InstaScoreText 
                    variant="body" 
                    weight="500"
                    color={COLORS.neutral[700]}
                  >
                    {isLoading ? "Conectando..." : "Continuar con Google"}
                  </InstaScoreText>
                </TouchableOpacity>

                {/* SEPARADOR */}
                <View style={styles.separatorContainerStyle}>
                  <View style={styles.separatorLineStyle} />
                  <View style={styles.separatorTextStyle}>
                    <InstaScoreText variant="caption" color={COLORS.neutral[500]}>
                      o
                    </InstaScoreText>
                  </View>
                  <View style={styles.separatorLineStyle} />
                </View>

                {/* ENLACE DE REGISTRO */}
                <TouchableOpacity onPress={navigateToRegister}>
                  <InstaScoreText 
                    variant="body" 
                    textAlign="center"
                    color={COLORS.neutral[600]}
                  >
                    ¿No tienes cuenta?{" "}
                    <InstaScoreText 
                      variant="body" 
                      color={COLORS.primary}
                      weight="600"
                    >
                      Regístrate aquí
                    </InstaScoreText>
                  </InstaScoreText>
                </TouchableOpacity>
              </InstaScoreCard>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}