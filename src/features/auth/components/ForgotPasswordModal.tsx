// src/features/auth/components/ForgotPasswordModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [step, setStep] = useState<'input' | 'success'>('input');
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  
  const responsive = useResponsive();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const inputRef = useRef<TextInput>(null);

  // ✅ ANIMACIONES MEJORADAS
  useEffect(() => {
    if (visible) {
      setShouldAutoFocus(false);
      
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 6,
        }),
      ]).start(() => {
        if (Platform.OS === 'android') {
          setShouldAutoFocus(true);
        }
      });
    } else {
      setEmail('');
      setEmailError('');
      setStep('input');
      setIsLoading(false);
      setShouldAutoFocus(false);
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  // 🔧 VALIDACIÓN DE EMAIL
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
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

  // 📧 HANDLE ENVIAR EMAIL
  const handleSendEmail = async () => {
    console.log('📧 Sending forgot password email for:', email);
    
    if (!validateEmail(email)) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (email === 'error@test.com') {
        throw new Error('Este correo no está registrado en el sistema');
      }
      
      console.log('✅ Email sent successfully');
      setStep('success');
      
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (err: any) {
      console.error('❌ Send email error:', err);
      setEmailError(err.message || 'Error al enviar el correo');
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 HANDLERS
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleBackdropPress = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const fillDevEmail = () => {
    console.log('🛠️ Fill dev email');
    setEmail('dev@test.com');
    setEmailError('');
  };

  // 🎨 ESTILOS DINÁMICOS
  const { width: screenWidth } = Dimensions.get('window');
  const modalWidth = responsive.isTablet ? screenWidth * 0.7 : screenWidth * 0.92;
  const modalMaxWidth = responsive.isTablet ? 480 : 380;

  const modalTransform = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
      {
        scale: scaleAnim,
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 🌫️ BACKDROP CON GRADIENTE SUTIL */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(17, 5, 173, 0.25)', // ✅ Tinte azul InstaScore
              justifyContent: 'center',
              alignItems: 'center',
              opacity: opacityAnim,
            }}
          >
            {/* 📱 CONTENEDOR PRINCIPAL */}
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  {
                    width: modalWidth,
                    maxWidth: modalMaxWidth,
                    backgroundColor: getColor.background.primary,
                    borderRadius: 24,
                    margin: 20,
                    overflow: 'hidden', // ✅ Para efectos internos
                    shadowColor: getColor.primary[500],
                    shadowOffset: { width: 0, height: 20 },
                    shadowOpacity: 0.3,
                    shadowRadius: 25,
                    elevation: 15,
                  },
                  modalTransform,
                ]}
              >
                {/* 🎨 HEADER CON FONDO DEGRADADO */}
                <View
                  style={{
                    backgroundColor: getColor.background.lighter, // ✅ Fondo crema
                    paddingTop: 32,
                    paddingBottom: 24,
                    paddingHorizontal: 24,
                    position: 'relative',
                  }}
                >
                  {/* ❌ BOTÓN CERRAR FLOTANTE */}
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: getColor.background.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: getColor.gray[400],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                      zIndex: 10,
                    }}
                    onPress={handleClose}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={isLoading ? getColor.gray[300] : getColor.gray[600]}
                    />
                  </TouchableOpacity>

                  {step === 'input' ? (
                    <>
                      {/* 🔑 ICONO PRINCIPAL CON DISEÑO MODERNO */}
                      <View
                        style={{
                          width: 88,
                          height: 88,
                          borderRadius: 44,
                          backgroundColor: getColor.primary[500], // ✅ Azul sólido
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginBottom: 20,
                          shadowColor: getColor.primary[500],
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.4,
                          shadowRadius: 12,
                          elevation: 6,
                        }}
                      >
                        <Ionicons
                          name="mail"
                          size={36}
                          color={getColor.background.primary} // ✅ Icono blanco
                        />
                      </View>

                      {/* 📝 TÍTULOS CON TIPOGRAFÍA MEJORADA */}
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: '700',
                          color: getColor.primary[500], // ✅ Azul InstaScore
                          textAlign: 'center',
                          marginBottom: 8,
                          fontFamily: 'Montserrat', // ✅ Fuente de marca
                        }}
                      >
                        Recuperar Acceso
                      </Text>
                      
                      <Text
                        style={{
                          fontSize: 16,
                          color: getColor.gray[600],
                          textAlign: 'center',
                          lineHeight: 22,
                          fontFamily: 'Nunito',
                          paddingHorizontal: 8,
                        }}
                      >
                        Ingresa tu correo y te enviaremos las instrucciones para crear una nueva contraseña
                      </Text>
                    </>
                  ) : (
                    // ✅ SUCCESS HEADER
                    <>
                      <View
                        style={{
                          width: 88,
                          height: 88,
                          borderRadius: 44,
                          backgroundColor: getColor.success[500],
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginBottom: 20,
                          shadowColor: getColor.success[500],
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.4,
                          shadowRadius: 12,
                          elevation: 6,
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={48}
                          color={getColor.background.primary}
                        />
                      </View>

                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: '700',
                          color: getColor.success[500],
                          textAlign: 'center',
                          marginBottom: 8,
                          fontFamily: 'Montserrat',
                        }}
                      >
                        ¡Correo Enviado!
                      </Text>
                      
                      <Text
                        style={{
                          fontSize: 16,
                          color: getColor.gray[600],
                          textAlign: 'center',
                          lineHeight: 22,
                          fontFamily: 'Nunito',
                        }}
                      >
                        Revisa tu bandeja de entrada
                      </Text>
                    </>
                  )}
                </View>

                {/* 📋 CONTENIDO PRINCIPAL */}
                <View style={{ padding: 24 }}>
                  {step === 'input' ? (
                    <>
                      {/* 📧 EMAIL INPUT CON DISEÑO MEJORADO */}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: getColor.gray[700],
                          marginBottom: 12,
                          fontFamily: 'Nunito',
                        }}
                      >
                        Correo Electrónico
                      </Text>

                      <View
                        style={{
                          backgroundColor: getColor.background.secondary, // ✅ Fondo gris suave
                          borderRadius: 16,
                          borderWidth: 2,
                          borderColor: emailError ? getColor.error[500] : getColor.gray[200],
                          marginBottom: emailError ? 8 : 20,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            paddingVertical: 4,
                          }}
                        >
                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: emailError ? getColor.error[100] : getColor.primary[50],
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: 12,
                            }}
                          >
                            <Ionicons
                              name="mail-outline"
                              size={20}
                              color={emailError ? getColor.error[500] : getColor.primary[500]}
                            />
                          </View>
                          
                          <TextInput
                            ref={inputRef}
                            placeholder="tu@correo.com"
                            value={email}
                            onChangeText={handleEmailChange}
                            style={{
                              flex: 1,
                              paddingVertical: 16,
                              fontSize: 16,
                              fontFamily: 'Nunito',
                              color: getColor.gray[900],
                              fontWeight: '500',
                            }}
                            placeholderTextColor={getColor.gray[400]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus={Platform.OS === 'android' ? shouldAutoFocus : false}
                            editable={!isLoading}
                            returnKeyType="send"
                            onSubmitEditing={handleSendEmail}
                          />
                        </View>
                      </View>

                      {/* ❌ ERROR MESSAGE */}
                      {emailError && (
                        <View
                          style={{
                            backgroundColor: getColor.error[100],
                            borderRadius: 12,
                            padding: 12,
                            marginBottom: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons
                            name="alert-circle"
                            size={16}
                            color={getColor.error[500]}
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: getColor.error[500],
                              fontFamily: 'Nunito',
                              fontWeight: '500',
                            }}
                          >
                            {emailError}
                          </Text>
                        </View>
                      )}

                      {/* 🔘 BOTONES CON DISEÑO MODERNO */}
                      <View style={{ gap: 12 }}>
                        {/* BOTÓN PRINCIPAL */}
                        <TouchableOpacity
                          style={{
                            backgroundColor: isLoading ? getColor.gray[300] : getColor.primary[500],
                            borderRadius: 16,
                            paddingVertical: 18,
                            alignItems: 'center',
                            shadowColor: getColor.primary[500],
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: isLoading ? 0 : 0.3,
                            shadowRadius: 10,
                            elevation: isLoading ? 0 : 4,
                          }}
                          onPress={handleSendEmail}
                          disabled={isLoading}
                          activeOpacity={0.9}
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
                            <Text
                              style={{
                                color: getColor.background.primary,
                                fontSize: 16,
                                fontWeight: '600',
                                fontFamily: 'Nunito',
                              }}
                            >
                              {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* BOTÓN SECUNDARIO */}
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderColor: getColor.gray[200],
                            borderRadius: 16,
                            paddingVertical: 16,
                            alignItems: 'center',
                          }}
                          onPress={handleClose}
                          disabled={isLoading}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={{
                              color: getColor.gray[600],
                              fontSize: 16,
                              fontWeight: '500',
                              fontFamily: 'Nunito',
                            }}
                          >
                            Volver al Login
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    // ✅ SUCCESS CONTENT
                    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: getColor.gray[600],
                          textAlign: 'center',
                          lineHeight: 24,
                          marginBottom: 12,
                          fontFamily: 'Nunito',
                        }}
                      >
                        Hemos enviado las instrucciones a:
                      </Text>

                      <View
                        style={{
                          backgroundColor: getColor.success[100],
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          marginBottom: 20,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: getColor.success[500],
                            textAlign: 'center',
                            fontFamily: 'Nunito',
                          }}
                        >
                          {email}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontSize: 14,
                          color: getColor.gray[500],
                          textAlign: 'center',
                          fontStyle: 'italic',
                          fontFamily: 'Nunito',
                        }}
                      >
                        Esta ventana se cerrará automáticamente en unos segundos...
                      </Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}