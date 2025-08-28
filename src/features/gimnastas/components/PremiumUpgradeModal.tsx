// src/features/gimnastas/components/PremiumUpgradeModal.tsx
import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface PremiumUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PremiumUpgradeModal({ visible, onClose, onUpgrade }: PremiumUpgradeModalProps) {
  const responsive = useResponsive();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  const { width: screenWidth } = Dimensions.get('window');
  const modalWidth = responsive.isTablet ? screenWidth * 0.6 : screenWidth * 0.9;
  const modalMaxWidth = responsive.isTablet ? 460 : 360;

  const handleBackdropPress = () => {
    onClose();
  };

  const premiumFeatures = [
    {
      icon: 'person-circle-outline',
      title: 'Perfiles Completos',
      description: 'Accede al historial detallado de cada gimnasta'
    },
    {
      icon: 'analytics-outline',
      title: 'Estadísticas Avanzadas',
      description: 'Ve métricas de rendimiento por aparato'
    },
    {
      icon: 'trophy-outline',
      title: 'Historial de Competencias',
      description: 'Revisa todos los campeonatos participados'
    },
    {
      icon: 'heart-outline',
      title: 'Gimnastas Favoritos',
      description: 'Guarda y sigue a tus gimnastas preferidos'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Blur Background */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: opacityAnim,
          }}
        >
          {/* Modal Container */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                width: modalWidth,
                maxWidth: modalMaxWidth,
                backgroundColor: getColor.background.primary,
                borderRadius: 24,
                margin: 20,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.25,
                shadowRadius: 25,
                elevation: 15,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ],
              }}
            >
              {/* Header */}
              <View
                style={{
                  backgroundColor: getColor.primary[500],
                  paddingTop: 40,
                  paddingBottom: 30,
                  paddingHorizontal: 24,
                  position: 'relative',
                }}
              >
                {/* Close Button */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                  }}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={getColor.background.primary}
                  />
                </TouchableOpacity>

                {/* Premium Icon */}
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: getColor.secondary[500],
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginBottom: 16,
                    shadowColor: getColor.secondary[500],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Ionicons
                    name="star"
                    size={36}
                    color={getColor.background.primary}
                  />
                </View>

                {/* Title */}
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: getColor.background.primary,
                    textAlign: 'center',
                    marginBottom: 8,
                    fontFamily: 'Montserrat',
                  }}
                >
                  ¡Hazte Premium!
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: getColor.background.primary,
                    textAlign: 'center',
                    opacity: 0.9,
                    lineHeight: 22,
                    fontFamily: 'Nunito',
                  }}
                >
                  Desbloquea perfiles completos de gimnastas
                </Text>
              </View>

              {/* Content */}
              <View style={{ padding: 24 }}>
                {/* Features List */}
                <View style={{ marginBottom: 24 }}>
                  {premiumFeatures.map((feature, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                        paddingHorizontal: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: getColor.primary[50],
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 16,
                        }}
                      >
                        <Ionicons
                          name={feature.icon as any}
                          size={20}
                          color={getColor.primary[500]}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: getColor.gray[900],
                            marginBottom: 2,
                            fontFamily: 'Nunito',
                          }}
                        >
                          {feature.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: getColor.gray[600],
                            lineHeight: 18,
                            fontFamily: 'Nunito',
                          }}
                        >
                          {feature.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Buttons */}
                <View style={{ gap: 12 }}>
                  {/* Upgrade Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: getColor.secondary[500],
                      borderRadius: 16,
                      paddingVertical: 18,
                      alignItems: 'center',
                      shadowColor: getColor.secondary[500],
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      elevation: 4,
                    }}
                    onPress={onUpgrade}
                    activeOpacity={0.9}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons
                        name="star"
                        size={18}
                        color={getColor.background.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: getColor.background.primary,
                          fontSize: 16,
                          fontWeight: '700',
                          fontFamily: 'Nunito',
                        }}
                      >
                        Actualizar a Premium
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Maybe Later Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: getColor.gray[200],
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: 'center',
                    }}
                    onPress={onClose}
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
                      Tal vez después
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}