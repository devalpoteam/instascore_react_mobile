// src/features/resultados/components/LiveCampeonatoCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { 
  CampeonatoEnVivo, 
  getAparatoDisplayName
} from '../data/mockLiveData';

interface LiveCampeonatoCardProps {
  campeonato: CampeonatoEnVivo;
  onPress?: (campeonato: CampeonatoEnVivo) => void;
  onViewLive?: (campeonato: CampeonatoEnVivo) => void;
}

export default function LiveCampeonatoCard({
  campeonato,
  onPress,
  onViewLive
}: LiveCampeonatoCardProps) {
  const responsive = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Estado del acordeón

  const handleCardPress = () => {
    onPress?.(campeonato);
  };

  const handleLivePress = () => {
    onViewLive?.(campeonato);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Indicador pulsante para "EN VIVO"
  const LiveIndicator = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: getColor.secondary[500],
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: getColor.secondary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    }}>
      <View style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: getColor.background.primary,
        marginRight: 6,
      }} />
      <Text style={{
        fontSize: responsive.fontSize.xs,
        fontWeight: '700',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
        letterSpacing: 0.5,
      }}>
        EN VIVO
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: getColor.background.primary,
        borderRadius: 20,
        marginBottom: responsive.spacing.md,
        marginHorizontal: responsive.spacing.md,
        borderWidth: 2,
        borderColor: getColor.secondary[200],
        shadowColor: getColor.secondary[400],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
      }}
    >
      {/* Header siempre visible - clickeable para toggle */}
      <TouchableOpacity
        style={{
          padding: responsive.spacing.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1, marginRight: responsive.spacing.sm }}>
          <Text style={{
            fontSize: responsive.fontSize.xl,
            fontWeight: '700',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.xl * 1.2,
            marginBottom: 4,
          }}>
            {campeonato.nombre}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons 
              name="location" 
              size={14} 
              color={getColor.gray[500]} 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[600],
              fontFamily: 'Nunito',
              flex: 1,
            }}>
              {campeonato.lugar}
            </Text>
          </View>
        </View>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: responsive.spacing.sm,
        }}>
          <LiveIndicator />
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={getColor.secondary[500]} 
          />
        </View>
      </TouchableOpacity>

      {/* Contenido expandible */}
      {isExpanded && (
        <View style={{
          paddingHorizontal: responsive.spacing.lg,
          paddingBottom: responsive.spacing.lg,
        }}>
          {/* Información adicional */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsive.spacing.md,
          }}>
            <Ionicons 
              name="time" 
              size={14} 
              color={getColor.gray[500]} 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[600],
              fontFamily: 'Nunito',
            }}>
              Inicio: {campeonato.horaInicio}
            </Text>
          </View>

          {/* Categorías activas */}
          <View style={{ marginBottom: responsive.spacing.md }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
              marginBottom: responsive.spacing.sm,
            }}>
              🔴 Categorías en Competencia
            </Text>
            
            {campeonato.categoriasActivas.map((categoria, index) => (
              <View
                key={categoria.id}
                style={{
                  backgroundColor: getColor.secondary[50],
                  borderRadius: 12,
                  padding: responsive.spacing.sm,
                  marginBottom: index < campeonato.categoriasActivas.length - 1 ? responsive.spacing.xs : 0,
                  borderLeftWidth: 4,
                  borderLeftColor: getColor.secondary[500],
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: responsive.fontSize.sm,
                      fontWeight: '600',
                      color: getColor.gray[800],
                      fontFamily: 'Nunito',
                      marginBottom: 2,
                    }}>
                      {categoria.tipo} {categoria.nombre}
                    </Text>
                    
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: responsive.fontSize.sm,
                        color: getColor.secondary[700],
                        fontFamily: 'Nunito',
                        fontWeight: '500',
                      }}>
                        {getAparatoDisplayName(categoria.aparatoActual, categoria.tipo)}
                      </Text>
                      <Text style={{
                        fontSize: responsive.fontSize.xs,
                        color: getColor.gray[500],
                        fontFamily: 'Nunito',
                        marginLeft: 8,
                      }}>
                        ({categoria.aparatoNumero}/{categoria.totalAparatos})
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{
                    backgroundColor: getColor.secondary[100],
                    borderRadius: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      fontWeight: '600',
                      color: getColor.secondary[700],
                      fontFamily: 'Nunito',
                    }}>
                      {categoria.participantesActivos} atletas
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Botón de acción principal */}
          <TouchableOpacity
            style={{
              backgroundColor: getColor.secondary[500],
              borderRadius: 16,
              paddingVertical: responsive.spacing.md,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: getColor.secondary[500],
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 5,
            }}
            onPress={handleLivePress}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="play-circle" 
              size={22} 
              color={getColor.background.primary} 
              style={{ marginRight: responsive.spacing.sm }}
            />
            <Text style={{
              fontSize: responsive.fontSize.lg,
              fontWeight: '700',
              color: getColor.background.primary,
              fontFamily: 'Nunito',
              letterSpacing: 0.5,
            }}>
              VER RESULTADOS EN VIVO
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}