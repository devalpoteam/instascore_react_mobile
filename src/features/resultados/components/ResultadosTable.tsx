// src/features/resultados/components/ResultadosTable.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { 
  ResultadosCategoria, 
  GimnastaResultado,
  EquipoResultado,
  formatearPuntaje,
  getAparatoDisplayNameResults,
  mockEquiposResultados
} from '../data/mockLiveResultsData';

interface ResultadosTableProps {
  resultados: ResultadosCategoria;
  aparatoSeleccionado: string;
  vistaSeleccionada: 'aparatos' | 'allaround' | 'equipos';
  isPro: boolean;
  onUpgrade: () => void;
}

// ✅ HELPER FUNCTION PARA CONSTRUIR DISPLAY DE CATEGORÍA
const construirCategoriaDisplay = (gimnasta: GimnastaResultado): string => {
  // Si el gimnasta tiene los campos actualizados, usarlos
  if (gimnasta.competenciaDisplay) {
    return gimnasta.competenciaDisplay;
  }
  
  // Fallback para datos legacy - construir manualmente
  const { categoria, nivel, franja } = gimnasta;
  
  // Si tiene nivel (Kinder, USAG)
  if (nivel && (categoria === 'Kinder' || categoria === 'USAG')) {
    const numeroNivel = nivel.replace('Nivel ', '');
    return `${categoria} ${numeroNivel} ${franja}`;
  }
  
  // Si no tiene nivel
  return `${categoria} ${franja}`;
};

// ✅ HELPER FUNCTION PARA OBTENER GÉNERO
const getGeneroFromTipo = (tipo: string): string => {
  return tipo === 'GAF' ? 'F' : 'M';
};

export default function ResultadosTable({
  resultados,
  aparatoSeleccionado,
  vistaSeleccionada,
  isPro,
  onUpgrade
}: ResultadosTableProps) {
  const responsive = useResponsive();

  // ✅ VISTA DE EQUIPOS CON TABLA REAL
  if (vistaSeleccionada === 'equipos') {
    // Filtrar equipos según tipo de usuario
    const equiposToShow = isPro ? mockEquiposResultados : mockEquiposResultados.slice(0, 3);

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

    const renderEquipoRow = (equipo: EquipoResultado, index: number) => {
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
              Mejores {equipo.gimnastasQueCuentan} de {equipo.totalGimnastas}
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
              {equipo.totalGimnastas} gimnastas
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
                {equipo.puntajeEquipo.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    const renderUpgradePromptEquipos = () => {
      if (isPro || mockEquiposResultados.length <= 3) return null;

      const equiposRestantes = mockEquiposResultados.length - 3;

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

  // ✅ VISTA NORMAL - GIMNASTAS INDIVIDUALES
  // Filtrar gimnastas según tipo de usuario
  const gimnastasToShow = isPro ? resultados.gimnastas : resultados.gimnastas.slice(0, 3);

  // Ordenar gimnastas según vista seleccionada
  const sortGimnastas = (gimnastas: GimnastaResultado[]) => {
    if (vistaSeleccionada === 'aparatos') {
      // Ordenar por puntaje del aparato seleccionado
      return [...gimnastas].sort((a, b) => {
        const puntajeA = a.puntajes[aparatoSeleccionado] || 0;
        const puntajeB = b.puntajes[aparatoSeleccionado] || 0;
        return puntajeB - puntajeA; // Descendente
      });
    } else {
      // Ordenar por All Around
      return [...gimnastas].sort((a, b) => b.allAround - a.allAround);
    }
  };

  const gimnastasOrdenados = sortGimnastas(gimnastasToShow);

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
        {vistaSeleccionada === 'aparatos' 
          ? getAparatoDisplayNameResults(aparatoSeleccionado).toUpperCase()
          : 'TOTAL'
        }
      </Text>
    </View>
  );

  const renderGimnastaRow = (gimnasta: GimnastaResultado, index: number) => {
    const isEven = index % 2 === 0;
    const puntaje = vistaSeleccionada === 'aparatos' 
      ? gimnasta.puntajes[aparatoSeleccionado] 
      : gimnasta.allAround;

    const isNewScore = gimnasta.puntajes[aparatoSeleccionado] !== null && 
                      aparatoSeleccionado === resultados.aparatoActual;

    // ✅ CONSTRUIR DISPLAY DE CATEGORÍA CORRECTAMENTE
    const categoriaDisplay = construirCategoriaDisplay(gimnasta);

    return (
      <View
        key={gimnasta.id}
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
            {index + 1}
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
            {gimnasta.nombre}
          </Text>
          {/* ✅ INFORMACIÓN DE CATEGORÍA ACTUALIZADA */}
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
          }}>
            {categoriaDisplay}
            {gimnasta.subdivision && ` • Subdiv. ${gimnasta.subdivision}`}
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
            {gimnasta.club}
          </Text>
        </View>

        {/* Puntaje */}
        <View style={{
          flex: 1.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: isNewScore ? getColor.secondary[100] : 'transparent',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderWidth: isNewScore ? 1 : 0,
            borderColor: getColor.secondary[300],
          }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '700',
              color: puntaje === null ? getColor.gray[400] : 
                     isNewScore ? getColor.secondary[700] : getColor.gray[800],
              fontFamily: 'Nunito',
              textAlign: 'center',
            }}>
              {vistaSeleccionada === 'aparatos' 
                ? formatearPuntaje(puntaje as number | null)
                : puntaje?.toFixed(1) || '--'
              }
            </Text>
            {isNewScore && (
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.secondary[600],
                fontFamily: 'Nunito',
                textAlign: 'center',
                fontWeight: '500',
              }}>
                NUEVO
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderUpgradePrompt = () => {
    if (isPro || resultados.gimnastas.length <= 3) return null;

    const gimnastasRestantes = resultados.gimnastas.length - 3;

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
          Ver {gimnastasRestantes} gimnastas más
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
        {gimnastasOrdenados.map((gimnasta, index) => 
          renderGimnastaRow(gimnasta, index)
        )}
        {renderUpgradePrompt()}
      </ScrollView>
    </View>
  );
}