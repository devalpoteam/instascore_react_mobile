// src/features/resultados/components/ResultadosTable.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { ResultadoIndividual, ResultadoEquipo } from '@/services/api/resultados/resultadosService';

// Helper functions locales
const getAparatoDisplayNameResults = (aparato: string): string => {
  const aparatosDisplay: Record<string, string> = {
    salto: "Salto", asimetricas: "Asimétricas", viga: "Viga", suelo: "Suelo",
    arzones: "Arzones", anillas: "Anillas", paralelas: "Paralelas", barra: "Barra",
  };
  return aparatosDisplay[aparato] || aparato;
};

const formatearPuntaje = (puntaje: number | null): string => {
  if (puntaje === null) return "--";
  return puntaje.toString();
};

interface ResultadosTableProps {
  resultados: ResultadoIndividual[];
  equipos?: ResultadoEquipo[];
  aparatoSeleccionado: string;
  vistaSeleccionada: 'aparatos' | 'allaround' | 'equipos';
  isPro: boolean;
  onUpgrade: () => void;
}

// Helper function para construir display de categoría usando ResultadoIndividual
const construirCategoriaDisplay = (resultado: ResultadoIndividual): string => {
  const categoria = resultado.categoria || "Sin categoría";
  const nivel = resultado.nivel || "Sin nivel";
  const franja = resultado.franja || "";
  
  return franja ? `${categoria} - ${nivel} - ${franja}` : `${categoria} - ${nivel}`;
};

export default function ResultadosTable({
  resultados,
  equipos = [],
  aparatoSeleccionado,
  vistaSeleccionada,
  isPro,
  onUpgrade
}: ResultadosTableProps) {
  const responsive = useResponsive();

  // ✅ VISTA DE EQUIPOS CON TABLA REAL
  if (vistaSeleccionada === 'equipos') {
    // Filtrar equipos según tipo de usuario
    const equiposToShow = isPro ? equipos : equipos.slice(0, 1);

    const renderTableHeaderEquipos = () => (
      <View style={{
        backgroundColor: getColor.secondary[500],
        flexDirection: 'row',
        paddingVertical: responsive.spacing.sm,
        paddingHorizontal: responsive.spacing.sm,
      }}>
        <Text style={{
          flex: 0.8,
          fontSize: responsive.fontSize.sm,
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
          textAlign: 'center',
        }}>
          POS
        </Text>
        <Text style={{
          flex: 3,
          fontSize: responsive.fontSize.sm,
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
        }}>
          EQUIPO
        </Text>
        <Text style={{
          flex: 2,
          fontSize: responsive.fontSize.sm,
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
        }}>
          INTEGRANTES
        </Text>
        <Text style={{
          flex: 1.2,
          fontSize: responsive.fontSize.sm,
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
          textAlign: 'center',
        }}>
          TOTAL
        </Text>
      </View>
    );

    const renderEquipoRow = (equipo: ResultadoEquipo, index: number) => {
      const isEven = index % 2 === 0;

      return (
        <View
          key={equipo.id}
          style={{
            backgroundColor: isEven ? getColor.gray[50] : getColor.background.primary,
            flexDirection: 'row',
            paddingVertical: responsive.spacing.sm,
            paddingHorizontal: responsive.spacing.sm,
            borderLeftWidth: index < 3 ? 4 : 0,
            borderLeftColor: index === 0 ? getColor.secondary[500] : 
                            index === 1 ? getColor.gray[400] : 
                            index === 2 ? getColor.warning[500] : 'transparent',
          }}
        >
          {/* Posición */}
          <View style={{
            flex: 0.8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '700',
              color: index < 3 ? getColor.secondary[600] : getColor.gray[700],
              fontFamily: 'Nunito',
            }}>
              {equipo.posicion}
            </Text>
            {index < 3 && (
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.secondary[500],
                fontFamily: 'Nunito',
              }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </Text>
            )}
          </View>

          {/* Equipo */}
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Text style={{
              fontSize: responsive.fontSize.sm,
              fontWeight: '600',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
              marginBottom: 2,
            }}>
              {equipo.nombre}
            </Text>
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[500],
              fontFamily: 'Nunito',
            }}>
              Mejores {equipo.cantidadMejores} de {equipo.cantidadGimnastas}
            </Text>
          </View>

          {/* Integrantes */}
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[600],
              fontFamily: 'Nunito',
              lineHeight: responsive.fontSize.xs * 1.3,
            }}>
              {equipo.cantidadGimnastas} gimnastas
            </Text>
          </View>

          {/* Puntaje Total */}
          <View style={{
            flex: 1.2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{
              backgroundColor: 'transparent',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
              <Text style={{
                fontSize: responsive.fontSize.base,
                fontWeight: '700',
                color: getColor.gray[800],
                fontFamily: 'Nunito',
                textAlign: 'center',
              }}>
                {equipo.puntajeEquipo.toString()}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    const renderUpgradePromptEquipos = () => {
      if (isPro || equipos.length <= 1) return null;

      const equiposRestantes = equipos.length - 1;

      return (
        <TouchableOpacity
          style={{
            backgroundColor: getColor.primary[50],
            borderWidth: 2,
            borderColor: getColor.primary[200],
            borderStyle: 'dashed',
            paddingVertical: responsive.spacing.lg,
            marginHorizontal: responsive.spacing.sm,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="people" 
            size={24} 
            color={getColor.primary[500]} 
            style={{ marginBottom: 8 }}
          />
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '600',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            textAlign: 'center',
            marginBottom: 4,
          }}>
            Ver {equiposRestantes} equipos más
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            textAlign: 'center',
          }}>
            Actualiza a Pro para ver todos los equipos
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{
        backgroundColor: getColor.background.primary,
        marginHorizontal: responsive.spacing.md,
        marginVertical: responsive.spacing.sm,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: getColor.gray[200],
        shadowColor: getColor.gray[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        {renderTableHeaderEquipos()}
        
        <ScrollView style={{ maxHeight: 500 }}>
          {equiposToShow.map((equipo, index) => 
            renderEquipoRow(equipo, index)
          )}
          {renderUpgradePromptEquipos()}
        </ScrollView>
      </View>
    );
  }

  // ✅ VISTA NORMAL - RESULTADOS INDIVIDUALES
  // Filtrar resultados según tipo de usuario
  // Apply different limits based on view type for individual results
  const resultadosLimit = vistaSeleccionada === 'allaround' ? 3 : 1;
  const resultadosToShow = isPro ? resultados : resultados.slice(0, resultadosLimit);

  // Ordenar resultados según vista y aparato seleccionado
  const resultadosOrdenados = [...resultadosToShow]
    .filter(resultado => vistaSeleccionada === 'allaround' || resultado.aparato === aparatoSeleccionado)
    .sort((a, b) => a.puesto - b.puesto); // Ordenar por puesto ascendente

  const renderTableHeader = () => (
    <View style={{
      backgroundColor: getColor.secondary[500],
      flexDirection: 'row',
      paddingVertical: responsive.spacing.sm,
      paddingHorizontal: responsive.spacing.sm,
    }}>
      <Text style={{
        flex: 0.8,
        fontSize: responsive.fontSize.sm,
        fontWeight: '700',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
        textAlign: 'center',
      }}>
        POS
      </Text>
      <Text style={{
        flex: 3,
        fontSize: responsive.fontSize.sm,
        fontWeight: '700',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
      }}>
        GIMNASTA
      </Text>
      <Text style={{
        flex: 2,
        fontSize: responsive.fontSize.sm,
        fontWeight: '700',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
      }}>
        CLUB
      </Text>
      <Text style={{
        flex: 1.2,
        fontSize: responsive.fontSize.sm,
        fontWeight: '700',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
        textAlign: 'center',
      }}>
        {getAparatoDisplayNameResults(aparatoSeleccionado).toUpperCase()}
      </Text>
    </View>
  );

  const renderResultadoRow = (resultado: ResultadoIndividual, index: number) => {
    const isEven = index % 2 === 0;
    const categoriaDisplay = construirCategoriaDisplay(resultado);

    return (
      <View
        key={resultado.idParticipante}
        style={{
          backgroundColor: isEven ? getColor.gray[50] : getColor.background.primary,
          flexDirection: 'row',
          paddingVertical: responsive.spacing.sm,
          paddingHorizontal: responsive.spacing.sm,
          borderLeftWidth: index < 3 ? 4 : 0,
          borderLeftColor: index === 0 ? getColor.secondary[500] : 
                          index === 1 ? getColor.gray[400] : 
                          index === 2 ? getColor.warning[500] : 'transparent',
        }}
      >
        {/* Posición */}
        <View style={{
          flex: 0.8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '700',
            color: index < 3 ? getColor.secondary[600] : getColor.gray[700],
            fontFamily: 'Nunito',
          }}>
            {resultado.puesto}
          </Text>
          {index < 3 && (
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.secondary[500],
              fontFamily: 'Nunito',
            }}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </Text>
          )}
        </View>

        {/* Gimnasta */}
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            fontWeight: '600',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            marginBottom: 2,
          }}>
            {resultado.gimnasta}
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
          }}>
            {categoriaDisplay}
            {resultado.subdivision && ` • Subdiv. ${resultado.subdivision}`}
          </Text>
        </View>

        {/* Club */}
        <View style={{ flex: 2, justifyContent: 'center' }}>
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.xs * 1.3,
          }}>
            {resultado.delegacion}
          </Text>
        </View>

        {/* Puntaje */}
        <View style={{
          flex: 1.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: 'transparent',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '700',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
              textAlign: 'center',
            }}>
              {formatearPuntaje(resultado.puntaje)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderUpgradePrompt = () => {
    const limit = vistaSeleccionada === 'allaround' ? 3 : 1;
    if (isPro || resultados.length <= limit) return null;

    const resultadosRestantes = resultados.length - limit;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: getColor.primary[50],
          borderWidth: 2,
          borderColor: getColor.primary[200],
          borderStyle: 'dashed',
          paddingVertical: responsive.spacing.lg,
          marginHorizontal: responsive.spacing.sm,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onUpgrade}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="lock-closed" 
          size={24} 
          color={getColor.primary[500]} 
          style={{ marginBottom: 8 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.base,
          fontWeight: '600',
          color: getColor.primary[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          Ver {resultadosRestantes} resultados más
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
        }}>
          Actualiza a Pro para ver todos los resultados
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      marginHorizontal: responsive.spacing.md,
      marginVertical: responsive.spacing.sm,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: getColor.gray[200],
      shadowColor: getColor.gray[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      {renderTableHeader()}
      
      <ScrollView style={{ maxHeight: 500 }}>
        {resultadosOrdenados.map((resultado, index) => 
          renderResultadoRow(resultado, index)
        )}
        {renderUpgradePrompt()}
      </ScrollView>
    </View>
  );
}