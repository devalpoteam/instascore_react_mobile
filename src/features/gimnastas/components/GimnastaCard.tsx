// src/features/gimnastas/components/GimnastaCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { type GimnastaListItem } from '@/services/api/gimnastas/gimnastasService';

interface GimnastaCardProps {
  gimnasta: GimnastaListItem;
  onPress: (gimnasta: GimnastaListItem) => void;
}

export default function GimnastaCard({ gimnasta, onPress }: GimnastaCardProps) {
  const responsive = useResponsive();

  const handlePress = () => {
    onPress(gimnasta);
  };

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatCampeonatoName = (nombre: string) => {
    return nombre
      .replace('Copa ', '')
      .replace('Torneo ', '')
      .replace('Campeonato ', '')
      .replace(' 2025', '')
      .replace(' 2024', '');
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: getColor.background.primary,
        marginHorizontal: responsive.spacing.md,
        marginBottom: responsive.spacing.sm,
        borderRadius: 16,
        padding: responsive.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: getColor.gray[400],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: getColor.gray[100],
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: getColor.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsive.spacing.md,
      }}>
        <Text style={{
          fontSize: responsive.fontSize.base,
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
        }}>
          {getInitials(gimnasta.nombre)}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: responsive.fontSize.lg,
          fontWeight: '700',
          color: getColor.gray[800],
          fontFamily: 'Nunito',
          marginBottom: 4,
        }}>
          {gimnasta.nombre}
        </Text>

        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.primary[600],
          fontFamily: 'Nunito',
          marginBottom: 4,
        }}>
          {formatCampeonatoName(gimnasta.ultimoCampeonato.nombre)} • {gimnasta.categoria} {gimnasta.nivel}
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name="flag-outline" 
            size={14} 
            color={getColor.gray[500]} 
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            fontWeight: '500',
            flex: 1,
          }}>
            {gimnasta.club}
          </Text>
        </View>
      </View>

      <View style={{
        marginLeft: responsive.spacing.sm,
      }}>
        <Ionicons 
          name="chevron-forward" 
          size={18}
          color={getColor.gray[400]} 
        />
      </View>
    </TouchableOpacity>
  );
}