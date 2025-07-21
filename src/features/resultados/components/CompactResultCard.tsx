// src/features/resultados/components/CompactResultCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { GimnastaResultado, formatearPuntaje } from '../data/mockLiveResultsData';

interface CompactResultCardProps {
  gimnasta: GimnastaResultado;
  position: number;
  aparatoActual: string;
  vistaSeleccionada: 'aparatos' | 'allaround' | 'equipos';
  isHighlighted?: boolean;
}

export default function CompactResultCard({
  gimnasta,
  position,
  aparatoActual,
  vistaSeleccionada,
  isHighlighted = false
}: CompactResultCardProps) {
  const responsive = useResponsive();

  // Determinar qué puntaje mostrar
  const getPuntajeToShow = () => {
    if (vistaSeleccionada === 'aparatos') {
      return gimnasta.puntajes[aparatoActual];
    }
    return gimnasta.allAround;
  };

  const puntaje = getPuntajeToShow();
  const isNewScore = gimnasta.puntajes[aparatoActual] !== null && vistaSeleccionada === 'aparatos';

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

        {/* Info gimnasta */}
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
            {gimnasta.nombre}
          </Text>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[500],
              fontFamily: 'Nunito',
              marginBottom: 2,
            }}
          >
            {gimnasta.club}
          </Text>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[400],
              fontFamily: 'Nunito',
            }}
          >
            {gimnasta.categoria} {gimnasta.nivel} • Subdiv. {gimnasta.subdivision}
          </Text>
        </View>

        {/* Puntajes */}
        <View style={{ alignItems: 'flex-end' }}>
          {/* Puntaje principal */}
          <View
            style={{
              backgroundColor: isNewScore
                ? getColor.secondary[100]
                : 'transparent',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: isNewScore ? 1 : 0,
              borderColor: getColor.secondary[300],
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.lg,
                fontWeight: '700',
                color: puntaje === null ? getColor.gray[400] : 
                       isNewScore && vistaSeleccionada === 'aparatos' ? getColor.secondary[700] : 
                       getColor.primary[600],
                fontFamily: 'Nunito',
              }}
            >
              {vistaSeleccionada === 'aparatos' 
                ? formatearPuntaje(puntaje)
                : puntaje?.toFixed(1) || '--'
              }
            </Text>
            {isNewScore && vistaSeleccionada === 'aparatos' && puntaje !== null && (
              <Text
                style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.secondary[600],
                  fontFamily: 'Nunito',
                  fontWeight: '500',
                }}
              >
                NUEVO
              </Text>
            )}
          </View>

          {/* Total secundario */}
          {vistaSeleccionada === 'aparatos' && (
            <Text
              style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[400],
                fontFamily: 'Nunito',
                marginTop: 4,
              }}
            >
              Total: {gimnasta.allAround.toFixed(1)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}