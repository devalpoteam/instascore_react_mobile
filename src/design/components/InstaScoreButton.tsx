// src/design-system/components/InstaScoreButton.tsx
// Botón oficial siguiendo Manual de Marca InstaScore

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { useResponsive, getAdaptiveShadow } from '@/shared/hooks/useResponsive';

// Tipos locales (ajusta las rutas según tu estructura)
type ComponentSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

// Design tokens básicos (ajusta según tu archivo tokens.ts)
const designTokens = {
  colors: {
    primary: {
      50: '#E8E6FF',
      500: '#1105AD',
      600: '#0D049D',
    },
    secondary: {
      500: '#F5A201',
    },
    neutral: {
      100: '#F5F5F5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
    },
  },
  opacity: {
    disabled: 0.38,
  }
};

interface InstaScoreButtonProps {
  // Contenido
  title: string;
  
  // Comportamiento
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  
  // Variantes según Manual de Marca
  variant?: ButtonVariant;
  
  // Tamaños
  size?: ComponentSize;
  
  // Layout
  fullWidth?: boolean;
  
  // Iconos (opcional)
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Styling
  className?: string;
  style?: object;
  
  // Accesibilidad
  accessibilityLabel?: string;
  testID?: string;
}

export const InstaScoreButton: React.FC<InstaScoreButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  style = {},
  accessibilityLabel,
  testID,
}) => {
  const responsive = useResponsive();
  
  // Obtener estilos base según el tamaño
  const getSizeStyles = () => {
    const buttonHeight = responsive.getButtonHeight(size);
    const padding = {
      sm: responsive.spacing.sm,
      md: responsive.spacing.md,
      lg: responsive.spacing.lg,
    };
    
    return {
      height: buttonHeight,
      paddingHorizontal: padding[size],
      borderRadius: responsive.isTablet ? 12 : 8,
    };
  };
  
  // Obtener estilos según la variante
  const getVariantStyles = () => {
    const baseStyle = {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
    };
    
    // ✅ ARREGLADO: getAdaptiveShadow ahora siempre retorna objeto
    const shadowStyle = getAdaptiveShadow('base',false)
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? designTokens.colors.neutral[300] 
            : designTokens.colors.primary[500],
          ...shadowStyle,  // ✅ Ahora funciona sin errores
        };
        
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? designTokens.colors.neutral[300] 
            : designTokens.colors.secondary[500],
          ...shadowStyle,  // ✅ Ahora funciona sin errores
        };
        
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled 
            ? designTokens.colors.neutral[300] 
            : designTokens.colors.primary[500],
        };
        
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: disabled 
            ? designTokens.colors.neutral[100] 
            : designTokens.colors.primary[50],
        };
        
      default:
        return baseStyle;
    }
  };
  
  // Obtener estilos de texto
  const getTextStyles = () => {
    const baseTextStyle = {
      fontFamily: 'Nunito', // Siguiendo el manual de marca
      fontWeight: '600' as FontWeight,
      fontSize: responsive.fontSize.base,
      textAlign: 'center' as const,
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled ? designTokens.colors.neutral[500] : '#FFFFFF',
        };
        
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? designTokens.colors.neutral[500] : '#FFFFFF',
        };
        
      case 'outline':
        return {
          ...baseTextStyle,
          color: disabled 
            ? designTokens.colors.neutral[400] 
            : designTokens.colors.primary[500],
        };
        
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled 
            ? designTokens.colors.neutral[400] 
            : designTokens.colors.primary[600],
        };
        
      default:
        return baseTextStyle;
    }
  };
  
  // Obtener color del loading indicator
  const getLoadingColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return designTokens.colors.primary[500];
      default:
        return designTokens.colors.primary[500];
    }
  };
  
  // Estados de interacción
  const getActiveOpacity = () => {
    return disabled ? 1 : 0.7;
  };
  
  // Estilos combinados
  const buttonStyles = [
    getSizeStyles(),
    getVariantStyles(),
    fullWidth && { width: '100%' },
    disabled && { opacity: designTokens.opacity.disabled },
    style,
  ];
  
  const textStyles = getTextStyles();
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={getActiveOpacity()}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
      className={className}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getLoadingColor()}
          style={{ marginRight: title ? responsive.spacing.xs : 0 }}
        />
      ) : leftIcon ? (
        <View style={{ marginRight: responsive.spacing.xs }}>
          {leftIcon}
        </View>
      ) : null}
      
      {(loading && title) || !loading ? (
        <Text style={textStyles} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
      
      {!loading && rightIcon && (
        <View style={{ marginLeft: responsive.spacing.xs }}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Componente de botón específico para acciones primarias de InstaScore
export const InstaScorePrimaryButton: React.FC<Omit<InstaScoreButtonProps, 'variant'>> = (props) => {
  return <InstaScoreButton {...props} variant="primary" />;
};

// Componente de botón específico para acciones secundarias
export const InstaScoreSecondaryButton: React.FC<Omit<InstaScoreButtonProps, 'variant'>> = (props) => {
  return <InstaScoreButton {...props} variant="secondary" />;
};

// Componente de botón outline
export const InstaScoreOutlineButton: React.FC<Omit<InstaScoreButtonProps, 'variant'>> = (props) => {
  return <InstaScoreButton {...props} variant="outline" />;
};

// Componente de botón ghost
export const InstaScoreGhostButton: React.FC<Omit<InstaScoreButtonProps, 'variant'>> = (props) => {
  return <InstaScoreButton {...props} variant="ghost" />;
};

export default InstaScoreButton;