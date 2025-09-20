// src/features/campeonatos/components/CampeonatoStatusBadge.tsx
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

type CampeonatoEstado = 'activo' | 'configuracion' | 'finalizado';

interface CampeonatoStatusBadgeProps {
  estado: CampeonatoEstado;
  size?: 'sm' | 'md';
}

export default function CampeonatoStatusBadge({ 
  estado, 
  size = 'md' 
}: CampeonatoStatusBadgeProps) {
  const responsive = useResponsive();

  const getStatusConfig = (estado: CampeonatoEstado) => {
    switch (estado) {
      case 'activo':
        return {
          backgroundColor: getColor.secondary[500],
          textColor: getColor.background.primary,
          label: 'En Vivo',
          emoji: '🔴',
          iconName: 'ellipse' as const,
          iconColor: getColor.secondary[700]
        };
      case 'configuracion':
        return {
          backgroundColor: getColor.success[500],
          textColor: getColor.background.primary,
          label: 'Próximo',
          emoji: '🟢',
          iconName: 'ellipse' as const,
          iconColor: getColor.success[700]
        };
      case 'finalizado':
        return {
          backgroundColor: getColor.gray[500],
          textColor: getColor.background.primary,
          label: 'Finalizado',
          emoji: '🔵',
          iconName: 'ellipse' as const,
          iconColor: getColor.gray[700]
        };
      default:
        return {
          backgroundColor: getColor.gray[300],
          textColor: getColor.gray[700],
          label: 'Desconocido',
          emoji: '⚪',
          iconName: 'ellipse' as const,
          iconColor: getColor.gray[500]
        };
    }
  };

  const config = getStatusConfig(estado);
  const isSmall = size === 'sm';

  const renderIcon = () => {
    if (Platform.OS === 'ios') {
      return (
        <Text style={{
          fontSize: isSmall ? 8 : 10,
          marginRight: 4,
        }}>
          {config.emoji}
        </Text>
      );
    } else {
      return (
        <Ionicons
          name={config.iconName}
          size={isSmall ? 8 : 10}
          color={config.iconColor}
          style={{ marginRight: 4 }}
        />
      );
    }
  };

  return (
    <View style={{
      backgroundColor: config.backgroundColor,
      borderRadius: isSmall ? 12 : 16,
      paddingHorizontal: isSmall ? 8 : 12,
      paddingVertical: isSmall ? 4 : 6,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: config.backgroundColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    }}>
      {renderIcon()}
      
      <Text style={{
        fontSize: isSmall ? responsive.fontSize.xs : responsive.fontSize.sm,
        fontWeight: '600',
        color: config.textColor,
        fontFamily: 'Nunito',
      }}>
        {config.label}
      </Text>
    </View>
  );
}