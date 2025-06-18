// src/design/components/InstaScoreText.tsx
import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useResponsive } from '@/shared/hooks/useResponsive';

// ✅ TIPOS EXPLÍCITOS Y CORRECTOS
type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

// Design tokens básicos
const designTokens = {
  colors: {
    primary: { 500: '#1105AD' },
    secondary: { 500: '#F5A201' },
    neutral: {
      400: '#A3A3A3',
      500: '#737373',
      700: '#404040',
      800: '#262626',
    },
  }
};

// ✅ INTERFACE BIEN TIPADA
interface InstaScoreTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  textAlign?: TextAlign;
  weight?: FontWeight;
  numberOfLines?: number;
  disabled?: boolean;
  style?: TextStyle;
  accessibilityLabel?: string;
  testID?: string;
}

export const InstaScoreText: React.FC<InstaScoreTextProps> = ({
  children,
  variant = 'body',
  color,
  textAlign = 'left',
  weight,
  numberOfLines,
  disabled = false,
  style = {},
  accessibilityLabel,
  testID,
}) => {
  const responsive = useResponsive();
  
  // ✅ FUNCIÓN CON TIPO EXPLÍCITO
  const getVariantStyles = (): TextStyle => {
    const styles: Record<TextVariant, TextStyle> = {
      h1: {
        fontSize: responsive.fontSize['4xl'],
        fontWeight: '700',
        fontFamily: 'Montserrat',
        lineHeight: responsive.fontSize['4xl'] * 1.2,
        color: designTokens.colors.neutral[800],
      },
      h2: {
        fontSize: responsive.fontSize['3xl'],
        fontWeight: '600',
        fontFamily: 'Montserrat',
        lineHeight: responsive.fontSize['3xl'] * 1.25,
        color: designTokens.colors.neutral[800],
      },
      h3: {
        fontSize: responsive.fontSize['2xl'],
        fontWeight: '600',
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize['2xl'] * 1.3,
        color: designTokens.colors.neutral[700],
      },
      h4: {
        fontSize: responsive.fontSize.xl,
        fontWeight: '600',
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.xl * 1.3,
        color: designTokens.colors.neutral[700],
      },
      body: {
        fontSize: responsive.fontSize.base,
        fontWeight: '400',
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.base * 1.5,
        color: designTokens.colors.neutral[700],
      },
      caption: {
        fontSize: responsive.fontSize.sm,
        fontWeight: '400',
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.sm * 1.4,
        color: designTokens.colors.neutral[500],
      },
      label: {
        fontSize: responsive.fontSize.sm,
        fontWeight: '500',
        fontFamily: 'Nunito',
        lineHeight: responsive.fontSize.sm * 1.4,
        color: designTokens.colors.neutral[700],
      },
    };
    
    return styles[variant];
  };
  
  // ✅ OBJETO DE ESTILOS (NO ARRAY) PARA EVITAR ERRORES
  const textStyles: TextStyle = {
    ...getVariantStyles(),
    ...(color && { color }),
    ...(textAlign && { textAlign }),
    ...(weight && { fontWeight: weight }),
    ...(disabled && { 
      opacity: 0.6,
      color: designTokens.colors.neutral[400]
    }),
    ...style, // Props style al final para permitir override
  };
  
  return (
    <Text
      style={textStyles}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </Text>
  );
};

// ✅ COMPONENTES ESPECÍFICOS BIEN TIPADOS
export const InstaScoreHeading: React.FC<Omit<InstaScoreTextProps, 'variant'> & { level: 1 | 2 | 3 | 4 }> = ({ level, ...props }) => {
  const variantMap = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;
  return <InstaScoreText {...props} variant={variantMap[level]} />;
};

export const InstaScoreBody: React.FC<Omit<InstaScoreTextProps, 'variant'>> = (props) => {
  return <InstaScoreText {...props} variant="body" />;
};

export const InstaScoreCaption: React.FC<Omit<InstaScoreTextProps, 'variant'>> = (props) => {
  return <InstaScoreText {...props} variant="caption" />;
};

export const InstaScoreLabel: React.FC<Omit<InstaScoreTextProps, 'variant'>> = (props) => {
  return <InstaScoreText {...props} variant="label" />;
};

// ✅ LOGO COMPONENT CON TIPOS CORRECTOS
export const InstaScoreLogo: React.FC<Omit<InstaScoreTextProps, 'variant' | 'children'>> = (props) => {
  const responsive = useResponsive();
  
  // ✅ ESTILO DIRECTO SIN PROBLEMAS DE TIPO
  const logoStyle: TextStyle = {
    fontSize: responsive.fontSize['3xl'],
    fontFamily: 'Montserrat',
    fontWeight: '800',
    textAlign: 'center',
    ...props.style, // Permitir override
  };
  
  return (
    <Text style={logoStyle} {...props}>
      <Text style={{ color: designTokens.colors.primary[500] }}>INSTA</Text>
      <Text style={{ color: designTokens.colors.secondary[500] }}>SCORE</Text>
    </Text>
  );
};

// ✅ DEFAULT EXPORT
export default InstaScoreText;