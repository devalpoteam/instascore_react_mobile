// src/design-system/components/InstaScoreInput.tsx
// Input oficial siguiendo Manual de Marca InstaScore

import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInputProps,
  Pressable, // ✅ NUEVO: Mejor para gestión de teclado
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '@/shared/hooks/useResponsive';

// Tipos locales
type InputType = 'email' | 'password' | 'text' | 'number' | 'phone';
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

// Design tokens básicos (ajusta según tu archivo tokens.ts)
const designTokens = {
  colors: {
    primary: {
      500: '#1105AD',
    },
    secondary: {
      500: '#F5A201',
    },
    neutral: {
      100: '#F5F5F5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      700: '#404040',
      800: '#262626',
    },
    background: {
      primary: '#FFFFFF',
    },
    status: {
      error: {
        500: '#EF4444',
      }
    }
  }
};

interface InstaScoreInputProps extends TextInputProps {
  // Contenido y estado
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  
  // Estados
  error?: string;
  disabled?: boolean;
  required?: boolean;
  
  // Tipos especiales
  type?: InputType;
  
  // Iconos
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  
  // Layout
  fullWidth?: boolean;
  multiline?: boolean;
  
  // Styling
  className?: string;
  style?: object;
  inputStyle?: object;
  
  // Accesibilidad
  testID?: string;
}

export const InstaScoreInput = forwardRef<TextInput, InstaScoreInputProps>(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    disabled = false,
    required = false,
    type = 'text',
    leftIcon,
    rightIcon,
    onRightIconPress,
    fullWidth = true,
    multiline = false,
    className = '',
    style = {},
    inputStyle = {},
    testID,
    ...textInputProps
  }, ref) => {
    const responsive = useResponsive();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Configuración según el tipo
    const getInputConfig = () => {
      const configs = {
        email: {
          keyboardType: 'email-address' as const,
          autoCapitalize: 'none' as const,
          autoCorrect: false,
          autoComplete: 'email' as const,
          textContentType: 'emailAddress' as const, // ✅ AGREGADO
        },
        password: {
          secureTextEntry: !showPassword,
          autoCapitalize: 'none' as const,
          autoCorrect: false,
          autoComplete: 'password' as const,
          textContentType: 'password' as const, // ✅ AGREGADO
        },
        number: {
          keyboardType: 'numeric' as const,
        },
        phone: {
          keyboardType: 'phone-pad' as const,
          autoComplete: 'tel' as const,
          textContentType: 'telephoneNumber' as const, // ✅ AGREGADO
        },
        text: {
          autoComplete: 'off' as const,
        },
      };
      
      return configs[type] || configs.text;
    };
    
    // Estilos del contenedor
    const getContainerStyles = () => ({
      width: fullWidth ? '100%' : 'auto',
      marginBottom: responsive.spacing.sm,
    });
    
    // Estilos del label
    const getLabelStyles = () => ({
      fontSize: responsive.fontSize.sm,
      fontFamily: 'Nunito',
      fontWeight: '500' as FontWeight,
      color: error 
        ? designTokens.colors.status.error[500]
        : designTokens.colors.neutral[700],
      marginBottom: responsive.spacing.xs,
    });
    
    // Estilos del input container
    const getInputContainerStyles = () => {
      const baseStyle = {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: disabled 
          ? designTokens.colors.neutral[100]
          : designTokens.colors.background.primary,
        borderWidth: 1,
        borderColor: error
          ? designTokens.colors.status.error[500]
          : isFocused
          ? designTokens.colors.primary[500]
          : designTokens.colors.neutral[300],
        borderRadius: responsive.isTablet ? 12 : 8,
        paddingHorizontal: responsive.spacing.md,
      };

      if (multiline) {
        return {
          ...baseStyle,
          minHeight: responsive.getInputHeight() * 2,
          paddingVertical: responsive.spacing.sm,
        };
      }

      return {
        ...baseStyle,
        height: responsive.getInputHeight(),
        paddingVertical: 0,
      };
    };
    
    // Estilos del input
    const getInputStyles = () => ({
      flex: 1,
      fontSize: responsive.fontSize.base,
      fontFamily: 'Nunito',
      color: disabled 
        ? designTokens.colors.neutral[400]
        : designTokens.colors.neutral[800],
      paddingLeft: leftIcon ? responsive.spacing.sm : 0,
      paddingRight: (rightIcon || type === 'password') ? responsive.spacing.sm : 0,
      // Ajustes específicos por plataforma
      ...(Platform.OS === 'ios' && {
        paddingVertical: multiline ? responsive.spacing.xs : 0,
      }),
      ...(Platform.OS === 'android' && {
        paddingVertical: 0,
        textAlignVertical: multiline ? 'top' as const : 'center' as const,
      }),
      minHeight: multiline ? responsive.getInputHeight() : undefined,
      ...inputStyle,
    });
    
    // Estilos del error
    const getErrorStyles = () => ({
      fontSize: responsive.fontSize.xs,
      fontFamily: 'Nunito',
      color: designTokens.colors.status.error[500],
      marginTop: responsive.spacing.xs,
    });
    
    // Color de los iconos
    const getIconColor = () => {
      if (disabled) return designTokens.colors.neutral[400];
      if (error) return designTokens.colors.status.error[500];
      if (isFocused) return designTokens.colors.primary[500];
      return designTokens.colors.neutral[500];
    };
    
    // ✅ ARREGLADO: Manejar el icono derecho SIN ocultar teclado
    const handleRightIconPress = () => {
      if (type === 'password') {
        setShowPassword(!showPassword);
        // ✅ CRÍTICO: Mantener el foco en el input
        if (ref && typeof ref === 'object' && ref.current) {
          // Pequeño delay para asegurar que el cambio de estado se procese
          setTimeout(() => {
            ref.current?.focus();
          }, 50);
        }
      } else if (onRightIconPress) {
        onRightIconPress();
      }
    };
    
    // Determinar el icono derecho
    const getRightIconName = (): keyof typeof Ionicons.glyphMap => {
      if (type === 'password') {
        return showPassword ? 'eye-off-outline' : 'eye-outline';
      }
      return rightIcon || 'close-outline';
    };
    
    const hasRightIcon = rightIcon || onRightIconPress || type === 'password';
    
    return (
      <View style={[getContainerStyles(), style]} className={className}>
        {/* Label */}
        {label && (
          <Text style={getLabelStyles()}>
            {label}
            {required && (
              <Text style={{ color: designTokens.colors.status.error[500] }}>
                {' *'}
              </Text>
            )}
          </Text>
        )}
        
        {/* Input Container */}
        <View style={getInputContainerStyles()}>
          {/* Icono izquierdo */}
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={responsive.fontSize.lg}
              color={getIconColor()}
              style={{ marginRight: responsive.spacing.xs }}
            />
          )}
          
          {/* Input */}
          <TextInput
            ref={ref}
            style={getInputStyles()}
            placeholder={placeholder}
            placeholderTextColor={designTokens.colors.neutral[400]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={!disabled}
            multiline={multiline}
            testID={testID}
            // ✅ CRÍTICO: Props para mantener teclado
            blurOnSubmit={false}
            returnKeyType={type === 'password' ? 'done' : 'next'}
            enablesReturnKeyAutomatically={false}
            {...getInputConfig()}
            {...textInputProps}
          />
          
          {/* ✅ ARREGLADO: Icono derecho con Pressable */}
          {hasRightIcon && (
            <Pressable
              onPress={handleRightIconPress}
              disabled={disabled}
              style={({ pressed }) => ({
                padding: responsive.spacing.xs,
                marginLeft: responsive.spacing.xs,
                opacity: pressed ? 0.7 : 1,
              })}
              // ✅ CRÍTICO: No interferir con el teclado
              android_disableSound={true}
              unstable_pressDelay={0}
            >
              <Ionicons
                name={getRightIconName()}
                size={responsive.fontSize.lg}
                color={getIconColor()}
              />
            </Pressable>
          )}
        </View>
        
        {/* Error message */}
        {error && (
          <Text style={getErrorStyles()}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

// Variantes específicas del input
export const InstaScoreEmailInput: React.FC<Omit<InstaScoreInputProps, 'type'>> = (props) => {
  return (
    <InstaScoreInput
      {...props}
      type="email"
      leftIcon="mail-outline"
      placeholder="Correo electrónico"
    />
  );
};

export const InstaScorePasswordInput: React.FC<Omit<InstaScoreInputProps, 'type'>> = (props) => {
  return (
    <InstaScoreInput
      {...props}
      type="password"
      leftIcon="lock-closed-outline"
      placeholder="Contraseña"
    />
  );
};

export const InstaScoreSearchInput: React.FC<Omit<InstaScoreInputProps, 'type'>> = (props) => {
  return (
    <InstaScoreInput
      {...props}
      type="text"
      leftIcon="search-outline"
      placeholder="Buscar..."
    />
  );
};

export const InstaScoreNumberInput: React.FC<Omit<InstaScoreInputProps, 'type'>> = (props) => {
  return (
    <InstaScoreInput
      {...props}
      type="number"
      leftIcon="calculator-outline"
    />
  );
};

// Hook para validaciones comunes
export const useInputValidation = () => {
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo es requerido';
    if (!emailRegex.test(email)) return 'Ingresa un correo válido';
    return undefined;
  };
  
  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return undefined;
  };
  
  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} es requerido`;
    return undefined;
  };
  
  return {
    validateEmail,
    validatePassword,
    validateRequired,
  };
};

InstaScoreInput.displayName = 'InstaScoreInput';

export default InstaScoreInput;