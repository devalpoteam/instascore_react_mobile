// src/features/resultados/components/CompactTeamCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
// ✅ IMPORTAR LA INTERFAZ CORRECTA
import { ResultadoEquipo as EquipoResultado } from '../data/mockTeamResultsData'; // Asegúrate de que la ruta sea correcta

interface CompactTeamCardProps {
  equipo: EquipoResultado; // ✅ Usar la interfaz correcta
  position: number;
  isHighlighted?: boolean;
}

export default function CompactTeamCard({
  equipo,
  position,
  isHighlighted = false
}: CompactTeamCardProps) {
  const responsive = useResponsive();

  // Colores de posición
  const getPositionColor = () => {
    if (position === 1) return getColor.secondary[500];
    if (position === 2) return getColor.gray[400];
    if (position === 3) return getColor.warning[500];
    return getColor.gray[300];
  };

  const getPositionEmoji = () => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  return (
    <View
      style={{
        backgroundColor: isHighlighted ? getColor.secondary[50] : getColor.background.primary,
        borderRadius: 12,
        padding: responsive.spacing.md,
        marginBottom: responsive.spacing.sm,
        borderWidth: isHighlighted ? 2 : 1,
        borderColor: isHighlighted ? getColor.secondary[300] : getColor.gray[200],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isHighlighted ? 0.15 : 0.05,
        shadowRadius: isHighlighted ? 4 : 2,
        elevation: isHighlighted ? 3 : 1,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Posición */}
        <View style={{
          alignItems: 'center',
          marginRight: responsive.spacing.md,
        }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: getPositionColor(),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '700',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}
            >
              {position}
            </Text>
          </View>
          {position <= 3 && (
            <Text style={{ fontSize: 12, marginTop: 2 }}>
              {getPositionEmoji()}
            </Text>
          )}
        </View>

        {/* Info equipo */}
        <View style={{ flex: 1, marginRight: responsive.spacing.md }}>
          <Text
            style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
              marginBottom: 2,
            }}
          >
            {equipo.nombre}
          </Text>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[500],
              fontFamily: 'Nunito',
              marginBottom: 2,
            }}
          >
            {equipo.club}
          </Text>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[400],
              fontFamily: 'Nunito',
            }}
          >
            {equipo.totalGimnastas} gimnastas • Mejores {equipo.gimnastasQueCuentan}
          </Text>
        </View>

        {/* Puntaje */}
        <View style={{ alignItems: 'flex-end' }}>
          {/* Puntaje principal */}
          <View
            style={{
              backgroundColor: 'transparent',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.lg,
                fontWeight: '700',
                color: getColor.primary[600],
                fontFamily: 'Nunito',
              }}
            >
              {equipo.puntajeEquipo.toFixed(1)}
            </Text>
          </View>

          {/* Label */}
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[400],
              fontFamily: 'Nunito',
              marginTop: 4,
            }}
          >
            Total Equipo
          </Text>
        </View>
      </View>
    </View>
  );
}