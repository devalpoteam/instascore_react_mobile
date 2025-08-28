//src/features/auth/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColor } from "@/design/colorHelper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginAsync } from "@/features/auth/store/authSlice";
import { useNavigation } from "@react-navigation/native";
import { useResponsive } from "@/shared/hooks/useResponsive";
import ForgotPasswordModal from "@/features/auth/components/ForgotPasswordModal";
import GoogleLoginWebView from "@/features/auth/components/GoogleLoginWebView";

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  const responsive = useResponsive();

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

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      await dispatch(loginAsync({ email, password })).unwrap();
    } catch (error) {
    }
  };

  const handleGoogleLogin = async () => {
    setShowGoogleModal(true);
  };

  const navigateToRegister = () => {
    navigation.navigate("Register" as never);
  };

  const showDevCredentials = () => {
    setShowDevModal(true);
  };

  const selectCredentials = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setShowDevModal(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
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

      <View
        style={{
          flex: 1,
          backgroundColor: getColor.background.lighter,
          padding: 20,
          justifyContent: "center",
        }}
      >
        {/* BOTÓN DEV */}
        <TouchableOpacity
          onPress={showDevCredentials}
          style={{
            position: "absolute",
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
          <Text
            style={{
              color: getColor.background.primary,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            DEV
          </Text>
        </TouchableOpacity>

        {/* LOGO */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Image
            source={require("../../../../assets/images/logo.png")}
            style={{ width: 250, height: 150 }}
            resizeMode="contain"
          />
        </View>

        {/* CONTENEDOR PRINCIPAL */}
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
          {/* ERROR GLOBAL */}
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

          {/* EMAIL LABEL */}
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

          {/* EMAIL INPUT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: emailError
                ? getColor.error[500]
                : getColor.gray[300],
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
              placeholder="Ingresa tu email"
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
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={false}
            />
          </View>

          {/* EMAIL ERROR */}
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

          {/* PASSWORD LABEL */}
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

          {/* PASSWORD INPUT */}
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
              placeholder="Ingresa tu contraseña"
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
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={false}
              onSubmitEditing={handleLogin}
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

          {/* PASSWORD ERROR */}
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

          {/* ¿OLVIDASTE TU CONTRASEÑA? */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={{
              alignSelf: "flex-end",
              marginBottom: responsive.isIOS ? 18 : 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: getColor.primary[500],
                fontWeight: "500",
                fontFamily: "Nunito",
              }}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* BOTÓN LOGIN */}
          <TouchableOpacity
            style={{
              backgroundColor: isLoading
                ? getColor.gray[300]
                : getColor.primary[500],
              borderRadius: 8,
              padding: 15,
              alignItems: "center",
              marginBottom: 16,
              opacity: isLoading ? 0.6 : 1,
              shadowColor: getColor.primary[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handleLogin}
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
              {isLoading ? "CARGANDO..." : "INICIAR SESIÓN"}
            </Text>
          </TouchableOpacity>

          {/* BOTÓN GOOGLE */}
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: getColor.background.primary,
              borderWidth: 1,
              borderColor: getColor.gray[300],
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
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
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: getColor.gray[700],
                fontFamily: "Nunito",
              }}
            >
              {isLoading ? "Conectando..." : "Continuar con Google"}
            </Text>
          </TouchableOpacity>

          {/* SEPARADOR */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: getColor.gray[300],
              }}
            />
            <View style={{ paddingHorizontal: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: getColor.gray[500],
                }}
              >
                o
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: getColor.gray[300],
              }}
            />
          </View>

          {/* ENLACE DE REGISTRO */}
          <TouchableOpacity onPress={navigateToRegister}>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: getColor.gray[600],
                fontFamily: "Nunito",
              }}
            >
              ¿No tienes cuenta?{" "}
              <Text
                style={{
                  fontSize: 16,
                  color: getColor.primary[500],
                  fontWeight: "600",
                  fontFamily: "Nunito",
                }}
              >
                Regístrate aquí
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DEV CREDENTIALS MODAL */}
      <Modal
        visible={showDevModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDevModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: getColor.background.primary,
            borderRadius: 16,
            padding: 20,
            width: '90%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: getColor.primary[600],
                fontFamily: 'Nunito',
              }}>
                Credenciales de Desarrollo
              </Text>
              <TouchableOpacity
                onPress={() => setShowDevModal(false)}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: getColor.gray[100],
                }}
              >
                <Ionicons name="close" size={20} color={getColor.gray[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Usuario Premium */}
              <TouchableOpacity
                style={{
                  backgroundColor: getColor.primary[50],
                  borderWidth: 2,
                  borderColor: getColor.primary[200],
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
                onPress={() => selectCredentials("premium@test.com", "123456")}
                activeOpacity={0.8}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Ionicons name="star" size={20} color={getColor.primary[500]} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: getColor.primary[600],
                    marginLeft: 8,
                    fontFamily: 'Nunito',
                  }}>
                    Usuario Premium
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: getColor.gray[600],
                  marginBottom: 4,
                  fontFamily: 'Nunito',
                }}>
                  Email: premium@test.com
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: getColor.gray[600],
                  fontFamily: 'Nunito',
                }}>
                  Contraseña: 123456
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: getColor.primary[500],
                  marginTop: 8,
                  fontStyle: 'italic',
                  fontFamily: 'Nunito',
                }}>
                  Acceso completo a todas las funcionalidades
                </Text>
              </TouchableOpacity>

              {/* Usuario Free */}
              <TouchableOpacity
                style={{
                  backgroundColor: getColor.gray[50],
                  borderWidth: 2,
                  borderColor: getColor.gray[200],
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
                onPress={() => selectCredentials("dev@test.com", "123456")}
                activeOpacity={0.8}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Ionicons name="person" size={20} color={getColor.gray[500]} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: getColor.gray[700],
                    marginLeft: 8,
                    fontFamily: 'Nunito',
                  }}>
                    Usuario Free
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: getColor.gray[600],
                  marginBottom: 4,
                  fontFamily: 'Nunito',
                }}>
                  Email: dev@test.com
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: getColor.gray[600],
                  fontFamily: 'Nunito',
                }}>
                  Contraseña: 123456
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: getColor.gray[500],
                  marginTop: 8,
                  fontStyle: 'italic',
                  fontFamily: 'Nunito',
                }}>
                  Funcionalidades limitadas
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={{
              fontSize: 12,
              color: getColor.gray[400],
              textAlign: 'center',
              marginTop: 12,
              fontFamily: 'Nunito',
            }}>
              Toca cualquier opción para usar esas credenciales
            </Text>
          </View>
        </View>
      </Modal>

      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={handleCloseForgotPasswordModal}
      />

      {/* GOOGLE LOGIN MODAL */}
      <GoogleLoginWebView 
        visible={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </>
  );
}