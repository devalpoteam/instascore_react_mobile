// src/features/resultados/components/TeamResultsView.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { ResultadoEquipo } from '@/services/api/resultados/resultadosService';

// Helper function para formatear puntajes de equipo
const formatearPuntajeEquipo = (puntaje: number): string => {
  return puntaje.toString();
};

interface TeamResultsViewProps {
  equipos: ResultadoEquipo[];
  aparatos: string[];
  isPro: boolean;
  onUpgrade: () => void;
}

export default function TeamResultsView({ 
  equipos, 
  aparatos, 
  isPro, 
  onUpgrade 
}: TeamResultsViewProps) {
  const responsive = useResponsive();
  const [vistaDetallada, setVistaDetallada] = useState(false);
  const [equipoExpandido, setEquipoExpandido] = useState<string | null>(null);

  const equiposToShow = isPro ? equipos : equipos.slice(0, 1);

  const renderTeamCard = (equipo: ResultadoEquipo, index: number) => {
    const isExpanded = equipoExpandido === equipo.id;
    const isTop3 = index < 3;

    return (
      <View
        key={equipo.id}
        style={{
          backgroundColor: getColor.background.primary,
          borderRadius: 16,
          marginBottom: responsive.spacing.md,
          borderWidth: isTop3 ? 2 : 1,
          borderColor: isTop3 
            ? (index === 0 ? getColor.secondary[400] : 
               index === 1 ? getColor.gray[400] : getColor.warning[400])
            : getColor.gray[200],
          shadowColor: isTop3 ? getColor.secondary[400] : getColor.gray[300],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: isTop3 ? 4 : 2,
        }}
      >
        {/* Header del equipo */}
        <TouchableOpacity
          style={{
            padding: responsive.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => setEquipoExpandido(isExpanded ? null : equipo.id)}
          activeOpacity={0.7}
        >
          {/* Posición y info del equipo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {/* Posición */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isTop3 
                ? (index === 0 ? getColor.secondary[500] : 
                   index === 1 ? getColor.gray[400] : getColor.warning[500])
                : getColor.gray[300],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: responsive.spacing.md,
            }}>
              <Text style={{
                fontSize: responsive.fontSize.lg,
                fontWeight: '700',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}>
                {equipo.posicion}
              </Text>
            </View>

            {/* Info del equipo */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: responsive.fontSize.lg,
                fontWeight: '600',
                color: getColor.gray[800],
                fontFamily: 'Nunito',
                marginBottom: 2,
              }}>
                {equipo.nombre}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.sm,
                color: getColor.gray[500],
                fontFamily: 'Nunito',
              }}>
                {equipo.cantidadGimnastas} gimnastas • Cuentan mejores {equipo.cantidadMejores}
              </Text>
            </View>
          </View>

          {/* Puntaje total */}
          <View style={{ alignItems: 'flex-end', marginRight: responsive.spacing.sm }}>
            <Text style={{
              fontSize: responsive.fontSize['2xl'],
              fontWeight: '700',
              color: isTop3 ? getColor.secondary[600] : getColor.gray[700],
              fontFamily: 'Nunito',
            }}>
              {formatearPuntajeEquipo(equipo.puntajeEquipo)}
            </Text>
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[500],
              fontFamily: 'Nunito',
            }}>
              TOTAL
            </Text>
          </View>

          {/* Icono expandir */}
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={getColor.gray[400]}
          />
        </TouchableOpacity>

        {/* Medallas/Emojis para top 3 */}
        {isTop3 && (
          <View style={{
            position: 'absolute',
            top: responsive.spacing.sm,
            right: responsive.spacing.sm,
          }}>
            <Text style={{ fontSize: 24 }}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </Text>
          </View>
        )}

        {/* Contenido expandible simplificado */}
        {isExpanded && (
          <View style={{
            paddingHorizontal: responsive.spacing.lg,
            paddingBottom: responsive.spacing.lg,
            borderTopWidth: 1,
            borderTopColor: getColor.gray[100],
          }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              color: getColor.gray[700],
              fontFamily: 'Nunito',
              textAlign: 'center',
            }}>
              Detalles del equipo {equipo.nombre}
            </Text>
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[500],
              fontFamily: 'Nunito',
              textAlign: 'center',
              marginTop: responsive.spacing.xs,
            }}>
              Categoría: {equipo.categoria} • Nivel: {equipo.nivel}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderUpgradePrompt = () => {
    if (isPro || equipos.length <= 1) return null;

    const equiposRestantes = equipos.length - 1;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: getColor.primary[50],
          borderWidth: 2,
          borderColor: getColor.primary[200],
          borderStyle: 'dashed',
          borderRadius: 16,
          paddingVertical: responsive.spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: responsive.spacing.md,
        }}
        onPress={onUpgrade}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="people" 
          size={32} 
          color={getColor.primary[500]} 
          style={{ marginBottom: responsive.spacing.sm }}
        />
        <Text style={{
          fontSize: responsive.fontSize.lg,
          fontWeight: '600',
          color: getColor.primary[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          Ver {equiposRestantes} equipos más
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
        }}>
          Actualiza a Pro para ver todos los equipos
        </Text>
      </TouchableOpacity>
    );
  };

  if (!isPro) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsive.spacing.xl,
      }}>
        <Ionicons 
          name="people" 
          size={64} 
          color={getColor.primary[400]} 
          style={{ marginBottom: responsive.spacing.lg }}
        />
        <Text style={{
          fontSize: responsive.fontSize.xl,
          fontWeight: '600',
          color: getColor.primary[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginBottom: responsive.spacing.sm,
        }}>
          🚀 Función Pro
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginBottom: responsive.spacing.lg,
          lineHeight: responsive.fontSize.base * 1.4,
        }}>
          Los resultados por equipos están disponibles solo para usuarios Pro
        </Text>
        
        <TouchableOpacity
          style={{
            backgroundColor: getColor.primary[500],
            borderRadius: 12,
            paddingVertical: responsive.spacing.md,
            paddingHorizontal: responsive.spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="star" 
            size={20} 
            color={getColor.background.primary} 
            style={{ marginRight: responsive.spacing.sm }}
          />
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '600',
            color: getColor.background.primary,
            fontFamily: 'Nunito',
          }}>
            Actualizar a Pro
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
      }}
    >
      {/* Header de equipos */}
      <View style={{
        backgroundColor: getColor.secondary[50],
        borderRadius: 12,
        padding: responsive.spacing.md,
        marginBottom: responsive.spacing.md,
      }}>
        <Text style={{
          fontSize: responsive.fontSize.lg,
          fontWeight: '600',
          color: getColor.secondary[700],
          fontFamily: 'Nunito',
          textAlign: 'center',
        }}>
          🏆 Resultados por Equipos
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.secondary[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginTop: 2,
        }}>
          {equipos.length} equipos compitiendo
        </Text>
      </View>

      {/* Lista de equipos */}
      {equiposToShow.map((equipo, index) => renderTeamCard(equipo, index))}
      
      {/* Prompt para upgrade */}
      {renderUpgradePrompt()}
    </ScrollView>
  );
}