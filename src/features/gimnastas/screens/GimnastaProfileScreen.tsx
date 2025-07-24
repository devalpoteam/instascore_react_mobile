// src/features/gimnastas/screens/GimnastaProfileScreen.tsx - CON DATOS DINÁMICOS REALES
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import { shadowStyles } from '@/styles/shadowStyles';
import { MainStackParamList } from '@/navigation/MainNavigator';

// ✅ IMPORTAR DATOS REALES
import { mockGimnastasList } from '../data/mockGimnastasList';
import { GimnastaListItem } from '../types/gimnastasList.types';

// Tipos de navegación
type GimnastaProfileRouteProp = RouteProp<MainStackParamList, 'GimnastaProfile'>;
type GimnastaProfileNavigationProp = NavigationProp<MainStackParamList>;

// Tipos para los aparatos (simplificado)
type AparatoGAF = 'salto' | 'asimetricas' | 'viga' | 'suelo';

export default function GimnastaProfileScreen() {
  const route = useRoute<GimnastaProfileRouteProp>();
  const navigation = useNavigation<GimnastaProfileNavigationProp>();
  const responsive = useResponsive();
  
  // ✅ OBTENER GIMNASTA REAL POR ID
  const { gimnastaId } = route.params;
  
  const gimnasta = useMemo(() => {
    return mockGimnastasList.find(g => g.id === gimnastaId);
  }, [gimnastaId]);

  // Si no se encuentra el gimnasta, mostrar error
  if (!gimnasta) {
    return (
      <BaseLayout>
        <Header 
          title="Error"
          subtitle="Gimnasta no encontrado"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showLogo={false}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: responsive.spacing.xl,
        }}>
          <Ionicons 
            name="alert-circle" 
            size={64} 
            color={getColor.error[500]} 
            style={{ marginBottom: responsive.spacing.lg }}
          />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '600',
            color: getColor.error[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
            marginBottom: responsive.spacing.sm,
          }}>
            Gimnasta no encontrado
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.base,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            textAlign: 'center',
            lineHeight: responsive.fontSize.base * 1.4,
          }}>
            No se pudo encontrar información{'\n'}para el ID: {gimnastaId}
          </Text>
        </View>
      </BaseLayout>
    );
  }

  // ✅ GENERAR DATOS MOCK PARA MÚLTIPLES CAMPEONATOS BASADOS EN EL GIMNASTA REAL
  const generateMockCampeonatos = (baseGimnasta: GimnastaListItem) => {
    // Generar puntajes realistas basados en el mejor All Around del gimnasta
    const generatePuntajes = (baseAllAround: number, variation: number = 0.3) => {
      const baseScore = baseAllAround / 4; // Promedio por aparato
      const variationRange = baseScore * variation;
      
      return {
        salto: Math.round((baseScore + (Math.random() - 0.5) * variationRange) * 10) / 10,
        asimetricas: Math.round((baseScore + (Math.random() - 0.5) * variationRange) * 10) / 10,
        viga: Math.round((baseScore + (Math.random() - 0.5) * variationRange) * 10) / 10,
        suelo: Math.round((baseScore + (Math.random() - 0.5) * variationRange) * 10) / 10,
      } as Record<AparatoGAF, number>;
    };

    const generatePosicionAparatos = () => {
      const posiciones = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
      return {
        salto: posiciones[0],
        asimetricas: posiciones[1], 
        viga: posiciones[2],
        suelo: posiciones[3],
      } as Record<AparatoGAF, number>;
    };

    // Campeonato principal (el de la lista)
    const puntajesPrincipal = generatePuntajes(baseGimnasta.mejorAllAround);
    const allAroundPrincipal = Object.values(puntajesPrincipal).reduce((sum, score) => sum + score, 0);

    const campeonatos = [
      {
        campeonatoId: baseGimnasta.ultimoCampeonato.id,
        campeonatoNombre: baseGimnasta.ultimoCampeonato.nombre,
        categoria: baseGimnasta.ultimoCampeonato.categoria,
        nivel: baseGimnasta.ultimoCampeonato.nivel,
        franja: baseGimnasta.ultimoCampeonato.nivel,
        subdivision: "A",
        puntajes: puntajesPrincipal,
        allAround: Math.round(allAroundPrincipal * 10) / 10,
        posicion: baseGimnasta.ultimoCampeonato.posicion,
        posicionAparatos: generatePosicionAparatos(),
      }
    ];

    // Generar campeonatos adicionales si tiene historial
    if (baseGimnasta.historialCampeonatos.length > 1) {
      const campeonatosAdicionales = [
        "Copa Regional Centro 2024",
        "Torneo Nacional 2024", 
        "Campeonato Escolar 2024"
      ];

      for (let i = 1; i < Math.min(baseGimnasta.historialCampeonatos.length, 4); i++) {
        const puntajes = generatePuntajes(baseGimnasta.mejorAllAround, 0.4);
        const allAround = Object.values(puntajes).reduce((sum, score) => sum + score, 0);
        
        campeonatos.push({
          campeonatoId: baseGimnasta.historialCampeonatos[i] || `mock_${i}`,
          campeonatoNombre: campeonatosAdicionales[i - 1] || `Campeonato ${i}`,
          categoria: baseGimnasta.ultimoCampeonato.categoria,
          nivel: baseGimnasta.ultimoCampeonato.nivel,
          franja: baseGimnasta.ultimoCampeonato.nivel,
          subdivision: i % 2 === 0 ? "A" : "B",
          puntajes,
          allAround: Math.round(allAround * 10) / 10,
          posicion: Math.floor(Math.random() * 8) + 1,
          posicionAparatos: generatePosicionAparatos(),
        });
      }
    }

    return campeonatos;
  };

  const campeonatos = useMemo(() => generateMockCampeonatos(gimnasta), [gimnasta]);
  const [campeonatoSeleccionado, setCampeonatoSeleccionado] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const campeonatoActual = campeonatos[campeonatoSeleccionado];

  const getAparatoDisplayName = (aparato: AparatoGAF) => {
    const names: Record<AparatoGAF, string> = {
      salto: 'Salto',
      asimetricas: 'Asimétricas',
      viga: 'Viga',
      suelo: 'Suelo',
    };
    return names[aparato] || aparato;
  };

  const getPositionColor = (posicion: number) => {
    if (posicion === 1) return getColor.secondary[500]; // Oro
    if (posicion === 2) return getColor.gray[400];      // Plata
    if (posicion === 3) return '#CD7F32';               // Bronce
    return getColor.gray[600];
  };

  const handleCampeonatoChange = (index: number) => {
    setCampeonatoSeleccionado(index);
    setDropdownVisible(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // ✅ OBTENER INICIALES PARA EL AVATAR
  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <BaseLayout>
      <Header 
        title="Perfil del Gimnasta"
        subtitle={`${gimnasta.club}`}
        showBack={true}
        onBackPress={handleGoBack}
        showLogo={false}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: responsive.spacing['3xl'],
        }}
      >
        {/* Dropdown de Campeonatos */}
        {campeonatos.length > 1 && (
          <View style={{
            marginHorizontal: responsive.spacing.md,
            marginTop: responsive.spacing.md,
            zIndex: 10,
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: getColor.background.primary,
                borderRadius: 12,
                padding: responsive.spacing.md,
                ...shadowStyles.neutral.sm,
                borderWidth: 1,
                borderColor: getColor.primary[200],
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => setDropdownVisible(!dropdownVisible)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: '600',
                  color: getColor.primary[600],
                  fontFamily: 'Nunito',
                }}>
                  {campeonatoActual.campeonatoNombre}
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  marginTop: 2,
                }}>
                  {campeonatoActual.categoria} {campeonatoActual.nivel} • Posición #{campeonatoActual.posicion}
                </Text>
              </View>
              
              <Ionicons 
                name={dropdownVisible ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={getColor.primary[500]} 
              />
            </TouchableOpacity>

            {/* Opciones del dropdown */}
            {dropdownVisible && (
              <View style={{
                backgroundColor: getColor.background.primary,
                borderRadius: 12,
                marginTop: responsive.spacing.xs,
                ...shadowStyles.neutral.base,
                borderWidth: 1,
                borderColor: getColor.gray[200],
                overflow: 'hidden',
              }}>
                {campeonatos.map((campeonato, index) => (
                  <TouchableOpacity
                    key={campeonato.campeonatoId}
                    style={{
                      padding: responsive.spacing.md,
                      borderBottomWidth: index < campeonatos.length - 1 ? 1 : 0,
                      borderBottomColor: getColor.gray[100],
                      backgroundColor: index === campeonatoSeleccionado ? getColor.primary[50] : 'transparent',
                    }}
                    onPress={() => handleCampeonatoChange(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      fontSize: responsive.fontSize.base,
                      fontWeight: index === campeonatoSeleccionado ? '700' : '600',
                      color: index === campeonatoSeleccionado ? getColor.primary[600] : getColor.gray[800],
                      fontFamily: 'Nunito',
                    }}>
                      {campeonato.campeonatoNombre}
                    </Text>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      color: getColor.gray[500],
                      fontFamily: 'Nunito',
                      marginTop: 2,
                    }}>
                      {campeonato.categoria} {campeonato.nivel} • #{campeonato.posicion} lugar • {campeonato.allAround.toFixed(1)} pts
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Hero Section - CON DATOS REALES */}
        <View style={{
          backgroundColor: getColor.background.primary,
          marginHorizontal: responsive.spacing.md,
          marginTop: responsive.spacing.lg,
          borderRadius: 20,
          padding: responsive.spacing.xl,
          ...shadowStyles.instascore.base,
          borderWidth: 1,
          borderColor: getColor.primary[100],
        }}>
          {/* Avatar y nombre */}
          <View style={{
            alignItems: 'center',
            marginBottom: responsive.spacing.lg,
          }}>
            {/* ✅ AVATAR CON INICIALES REALES */}
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: gimnasta.esMedallista ? getColor.primary[500] : getColor.gray[300],
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: responsive.spacing.md,
            }}>
              <Text style={{
                fontSize: responsive.fontSize['2xl'],
                fontWeight: '700',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}>
                {getInitials(gimnasta.nombre)}
              </Text>
            </View>
            
            {/* ✅ NOMBRE REAL */}
            <Text style={{
              fontSize: responsive.fontSize['2xl'],
              fontWeight: '700',
              color: getColor.primary[600],
              fontFamily: 'Nunito',
              textAlign: 'center',
              marginBottom: responsive.spacing.xs,
            }}>
              {gimnasta.nombre}
            </Text>

            {/* Badge de posición - DINÁMICO */}
            <View style={{
              backgroundColor: getPositionColor(campeonatoActual.posicion),
              borderRadius: 20,
              paddingHorizontal: responsive.spacing.md,
              paddingVertical: responsive.spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons 
                name="trophy" 
                size={16} 
                color={getColor.background.primary} 
                style={{ marginRight: responsive.spacing.xs }}
              />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '700',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}>
                {campeonatoActual.posicion}° Lugar General
              </Text>
            </View>

            {/* ✅ BADGES ADICIONALES */}
            <View style={{
              flexDirection: 'row',
              marginTop: responsive.spacing.sm,
              gap: responsive.spacing.xs,
            }}>
              {gimnasta.esMedallista && (
                <View style={{
                  backgroundColor: getColor.secondary[500],
                  borderRadius: 12,
                  paddingHorizontal: responsive.spacing.sm,
                  paddingVertical: 4,
                }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    fontWeight: '600',
                    color: getColor.background.primary,
                    fontFamily: 'Nunito',
                  }}>
                    🏆 Medallista
                  </Text>
                </View>
              )}
              {gimnasta.activo && (
                <View style={{
                  backgroundColor: getColor.success[500],
                  borderRadius: 12,
                  paddingHorizontal: responsive.spacing.sm,
                  paddingVertical: 4,
                }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    fontWeight: '600',
                    color: getColor.background.primary,
                    fontFamily: 'Nunito',
                  }}>
                    ⚡ Activo
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* ✅ INFORMACIÓN BÁSICA REAL */}
          <View style={{
            backgroundColor: getColor.gray[50],
            borderRadius: 16,
            padding: responsive.spacing.lg,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: responsive.spacing.md,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  marginBottom: 4,
                }}>
                  Año de Nacimiento
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: '600',
                  color: getColor.gray[800],
                  fontFamily: 'Nunito',
                }}>
                  {gimnasta.año}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  marginBottom: 4,
                }}>
                  Categoría
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: '600',
                  color: getColor.gray[800],
                  fontFamily: 'Nunito',
                }}>
                  {campeonatoActual.categoria} {campeonatoActual.nivel}
                </Text>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  marginBottom: 4,
                }}>
                  Club/Delegación
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: '600',
                  color: getColor.gray[800],
                  fontFamily: 'Nunito',
                }}>
                  {gimnasta.club}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  marginBottom: 4,
                }}>
                  Mejor All Around
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: '600',
                  color: getColor.secondary[600],
                  fontFamily: 'Nunito',
                }}>
                  {gimnasta.mejorAllAround.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* All Around Score - DINÁMICO */}
        <View style={{
          backgroundColor: getColor.secondary[500],
          marginHorizontal: responsive.spacing.md,
          marginTop: responsive.spacing.md,
          borderRadius: 16,
          padding: responsive.spacing.lg,
          ...shadowStyles.orange.base,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            fontWeight: '600',
            color: getColor.background.primary,
            fontFamily: 'Nunito',
            marginBottom: responsive.spacing.xs,
          }}>
            PUNTAJE ALL AROUND - {campeonatoActual.campeonatoNombre.toUpperCase()}
          </Text>
          <Text style={{
            fontSize: responsive.fontSize['4xl'],
            fontWeight: '700',
            color: getColor.background.primary,
            fontFamily: 'Nunito',
          }}>
            {campeonatoActual.allAround.toFixed(1)}
          </Text>
        </View>

        {/* Puntajes por Aparato */}
        <View style={{
          marginHorizontal: responsive.spacing.md,
          marginTop: responsive.spacing.md,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '700',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            marginBottom: responsive.spacing.md,
            textAlign: 'center',
          }}>
            📈 RENDIMIENTO POR APARATO
          </Text>

          {(Object.entries(campeonatoActual.puntajes) as [AparatoGAF, number][]).map(([aparato, puntaje]) => {
            const posicionAparato = campeonatoActual.posicionAparatos[aparato];
            const porcentaje = (puntaje / 10) * 100; // Asumiendo puntaje máximo de 10
            
            return (
              <View
                key={aparato}
                style={{
                  backgroundColor: getColor.background.primary,
                  borderRadius: 12,
                  padding: responsive.spacing.md,
                  marginBottom: responsive.spacing.sm,
                  shadowColor: getColor.gray[400],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: getColor.gray[100],
                }}
              >
                {/* Header del aparato */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: responsive.spacing.sm,
                }}>
                  <Text style={{
                    fontSize: responsive.fontSize.lg,
                    fontWeight: '700',
                    color: getColor.primary[600],
                    fontFamily: 'Nunito',
                  }}>
                    {getAparatoDisplayName(aparato)}
                  </Text>

                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsive.spacing.xs,
                  }}>
                    <Text style={{
                      fontSize: responsive.fontSize.xl,
                      fontWeight: '700',
                      color: getColor.gray[800],
                      fontFamily: 'Nunito',
                    }}>
                      {puntaje.toFixed(1)}
                    </Text>
                    <View style={{
                      backgroundColor: getPositionColor(posicionAparato),
                      borderRadius: 16,
                      paddingHorizontal: responsive.spacing.xs,
                      paddingVertical: 4,
                      minWidth: 32,
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: responsive.fontSize.xs,
                        fontWeight: '700',
                        color: getColor.background.primary,
                        fontFamily: 'Nunito',
                      }}>
                        #{posicionAparato}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Barra de progreso */}
                <View style={{
                  backgroundColor: getColor.gray[200],
                  borderRadius: 8,
                  height: 8,
                  overflow: 'hidden',
                  marginBottom: responsive.spacing.xs,
                }}>
                  <View style={{
                    backgroundColor: getColor.secondary[500],
                    height: '100%',
                    width: `${porcentaje}%`,
                    borderRadius: 8,
                  }} />
                </View>

                {/* Indicadores de escala */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[400],
                    fontFamily: 'Nunito',
                  }}>
                    0.0
                  </Text>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[400],
                    fontFamily: 'Nunito',
                  }}>
                    5.0
                  </Text>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[400],
                    fontFamily: 'Nunito',
                  }}>
                    10.0
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </BaseLayout>
  );
}