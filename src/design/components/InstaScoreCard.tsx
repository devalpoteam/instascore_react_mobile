// src/design/components/InstaScoreCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useResponsive } from '@/shared/hooks/useResponsive';

// Tipos locales
type CardVariant = 'default' | 'elevated' | 'outlined';
type ComponentSize = 'sm' | 'md' | 'lg';

// Design tokens básicos
const designTokens = {
  colors: {
    primary: { 500: '#1105AD' },
    secondary: { 500: '#F5A201' },
    neutral: {
      100: '#F5F5F5',
      300: '#D4D4D4',
      700: '#404040',
    },
    background: { primary: '#FFFFFF' },
  }
};

interface InstaScoreCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: CardVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
}

export const InstaScoreCard: React.FC<InstaScoreCardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  disabled = false,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  style = {},
  accessibilityLabel,
  testID,
}) => {
  const responsive = useResponsive();
  
  const getSizeStyles = (): ViewStyle => {
    const padding = {
      sm: responsive.spacing.sm,
      md: responsive.spacing.md,
      lg: responsive.spacing.lg,
    };
    
    return {
      padding: padding[size],
      borderRadius: responsive.isTablet ? 16 : 12,
    };
  };
  
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: designTokens.colors.background.primary,
    };
    
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...(responsive.isAndroid 
            ? { elevation: 4 }
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }),
        };
        
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: designTokens.colors.neutral[300],
        };
        
      default:
        return {
          ...baseStyle,
          ...(responsive.isAndroid 
            ? { elevation: 2 }
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
              }),
        };
    }
  };
  
  const getTitleStyles = () => ({
    fontSize: responsive.fontSize.lg,
    fontFamily: 'Nunito',
    fontWeight: '600' as const,
    color: designTokens.colors.neutral[700],
    marginBottom: subtitle ? responsive.spacing.xs : 0,
  });
  
  const getSubtitleStyles = () => ({
    fontSize: responsive.fontSize.sm,
    fontFamily: 'Nunito',
    fontWeight: '400' as const,
    color: designTokens.colors.neutral[700],
    opacity: 0.7,
    marginBottom: children ? responsive.spacing.sm : 0,
  });
  

  const cardStyles: ViewStyle = {
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...(fullWidth && { width: '100%' }),
    ...(disabled && { opacity: 0.6 }),
    ...style,
  };
  
  const CardContent = () => (
    <View style={cardStyles} testID={testID}>
      {title && <Text style={getTitleStyles()}>{title}</Text>}
      {subtitle && <Text style={getSubtitleStyles()}>{subtitle}</Text>}
      {children}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
      >
        <CardContent />
      </TouchableOpacity>
    );
  }
  
  return <CardContent />;
};

export const InstaScoreResultCard: React.FC<Omit<InstaScoreCardProps, 'variant'>> = (props) => {
  return <InstaScoreCard {...props} variant="elevated" />;
};

export const InstaScoreStatsCard: React.FC<Omit<InstaScoreCardProps, 'variant'>> = (props) => {
  return <InstaScoreCard {...props} variant="outlined" />;
};

export default InstaScoreCard;