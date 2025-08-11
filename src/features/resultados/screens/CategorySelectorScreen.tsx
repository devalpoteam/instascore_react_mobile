// src/features/resultados/screens/CategorySelectorScreen.tsx
// ✅ ACTUALIZADA PARA SOPORTAR CAMPEONATOS FINALIZADOS Y EN VIVO

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

// Data actualizada
import { 
  CampeonatoEnVivo,
  mockCampeonatosEnVivo,
  getAparatoDisplayName,
  getGeneroSimple,
  construirNombreCategoria
} from '../data/mockLiveData';

// Navigation types
type MainNavigatorParamList = {
  Home: undefined;
  Campeonatos: undefined;
  CampeonatoDetail: { campeonatoId: string };
  Resultados: { campeonatoId?: string };
  CategorySelector: { campeonatoId: string; isFinished?: boolean }; // ✅ ACTUALIZADO
  LiveResults: { campeonatoId: string; categoriaId: string; isFinished?: boolean }; // ✅ ACTUALIZADO
  Gimnastas: undefined;
  Ajustes: undefined;
};

type CategorySelectorRouteProp = RouteProp<MainNavigatorParamList, 'CategorySelector'>;
type CategorySelectorNavigationProp = NavigationProp<MainNavigatorParamList>;

export default function CategorySelectorScreen() {
  const route = useRoute<CategorySelectorRouteProp>();
  const navigation = useNavigation<CategorySelectorNavigationProp>();
  const responsive = useResponsive();

  // ✅ EXTRAER PARÁMETROS ACTUALIZADOS
  const { campeonatoId, isFinished = false } = route.params;
  
  const [campeonato, setCampeonato] = useState<CampeonatoEnVivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCampeonato();
  }, [campeonatoId]);

  const loadCampeonato = async () => {
    try {
      setIsLoading(true);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buscar campeonato por ID
      const foundCampeonato = mockCampeonatosEnVivo.find(c => c.id === campeonatoId);
      setCampeonato(foundCampeonato || null);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading campeonato:', error);
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCampeonato();
    setIsRefreshing(false);
  };

  const handleCategoriaPress = (categoriaId: string) => {
    console.log(`🎯 Navegar a resultados de categoría (${isFinished ? 'finalizado' : 'en vivo'}):`, categoriaId);
    navigation.navigate('LiveResults', { 
      campeonatoId, 
      categoriaId,
      isFinished // ✅ PASAR EL ESTADO
    });
  };

  // ✅ FUNCIÓN HELPER PARA OBTENER TEXTOS DINÁMICOS
  const getDisplayTexts = () => {
    if (isFinished) {
      return {
        headerTitle: "Resultados Finales",
        statusLabel: "FINALIZADO",
        statusColor: getColor.gray[600],
        statusBgColor: getColor.gray[200],
        sectionTitle: "🏆 Resultados por Categoría",
        sectionSubtitle: "Toca una categoría para ver los resultados finales",
        categoryBadge: "FINALIZADO",
        categoryBadgeColor: getColor.gray[500]
      };
    } else {
      return {
        headerTitle: "Categorías En Vivo",
        statusLabel: "RESULTADOS EN VIVO",
        statusColor: getColor.background.primary,
        statusBgColor: getColor.secondary[500],
        sectionTitle: "🏆 Categorías Compitiendo",
        sectionSubtitle: "Toca una categoría para ver resultados en tiempo real",
        categoryBadge: "EN VIVO",
        categoryBadgeColor: getColor.secondary[500]
      };
    }
  };

  const displayTexts = getDisplayTexts();

  if (isLoading) {
    return (
      <BaseLayout>
        <Header 
          title={displayTexts.headerTitle}
          showLogo={false}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: responsive.spacing.xl,
        }}>
          <Ionicons 
            name={isFinished ? "trophy" : "radio"} 
            size={48} 
            color={isFinished ? getColor.gray[600] : getColor.secondary[500]} // ✅ CAMBIADO: de gray[500] a gray[600] (más oscuro)
            style={{ marginBottom: responsive.spacing.md }}
          />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '600',
            color: isFinished ? getColor.gray[700] : getColor.secondary[500], // ✅ CAMBIADO: de gray[600] a gray[700] (más oscuro)
            fontFamily: 'Nunito',
            textAlign: 'center',
          }}>
            {isFinished ? 'Cargando resultados...' : 'Cargando categorías...'}
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (!campeonato) {
    return (
      <BaseLayout>
        <Header 
          title="Error"
          showLogo={false}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: responsive.spacing.xl,
        }}>
          <Text>Campeonato no encontrado</Text>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title={displayTexts.headerTitle}
        subtitle={campeonato.nombre}
        showLogo={false}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={isFinished ? getColor.gray[500] : getColor.secondary[500]}
            colors={[isFinished ? getColor.gray[500] : getColor.secondary[500]]}
          />
        }
      >
        {/* ✅ HERO SECTION ADAPTADO AL ESTADO */}
        <View style={{
          backgroundColor: isFinished ? getColor.gray[100] : getColor.secondary[50], // ✅ CAMBIADO: de gray[50] a gray[100] (más oscuro)
          paddingHorizontal: responsive.spacing.md,
          paddingVertical: responsive.spacing.xl,
        }}>
          {/* Status indicator dinámico */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: responsive.spacing.lg,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: displayTexts.statusBgColor,
              borderRadius: 20,
              paddingHorizontal: responsive.spacing.md,
              paddingVertical: responsive.spacing.sm,
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: displayTexts.statusColor,
                marginRight: 6,
              }} />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '700',
                color: displayTexts.statusColor,
                fontFamily: 'Nunito',
              }}>
                {displayTexts.statusLabel}
              </Text>
            </View>
          </View>

          {/* Stats cards */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: responsive.spacing.sm,
            marginBottom: responsive.spacing.md,
          }}>
            <View style={{
              flex: 1,
              backgroundColor: getColor.background.primary,
              borderRadius: 12,
              padding: responsive.spacing.md,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: responsive.fontSize['2xl'],
                fontWeight: '700',
                color: isFinished ? getColor.gray[700] : getColor.secondary[600], // ✅ CAMBIADO: de gray[600] a gray[700] (más oscuro)
                fontFamily: 'Nunito',
              }}>
                {campeonato.categoriasActivas.length}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[600],
                fontFamily: 'Nunito',
                textAlign: 'center',
              }}>
                {isFinished ? 'Categorías Finalizadas' : 'Categorías Activas'}
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: getColor.background.primary,
              borderRadius: 12,
              padding: responsive.spacing.md,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: responsive.fontSize['2xl'],
                fontWeight: '700',
                color: getColor.primary[600],
                fontFamily: 'Nunito',
              }}>
                {campeonato.participantesTotales}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[600],
                fontFamily: 'Nunito',
                textAlign: 'center',
              }}>
                {isFinished ? 'Atletas Participantes' : 'Atletas Total'}
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: getColor.background.primary,
              borderRadius: 12,
              padding: responsive.spacing.md,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: responsive.fontSize['2xl'],
                fontWeight: '700',
                color: getColor.success[500],
                fontFamily: 'Nunito',
              }}>
                {campeonato.horaInicio}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[600],
                fontFamily: 'Nunito',
                textAlign: 'center',
              }}>
                {isFinished ? 'Hora de Inicio' : 'Hora Inicio'}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getColor.background.primary,
            borderRadius: 8,
            padding: responsive.spacing.sm,
          }}>
            <Ionicons name="location" size={16} color={getColor.gray[500]} />
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[600],
              fontFamily: 'Nunito',
              marginLeft: 4,
            }}>
              {campeonato.lugar}
            </Text>
          </View>
        </View>

        {/* Section title adaptado */}
        <View style={{
          paddingHorizontal: responsive.spacing.md,
          paddingTop: responsive.spacing.xl,
          paddingBottom: responsive.spacing.md,
        }}>
          <Text style={{
            fontSize: responsive.fontSize['2xl'],
            fontWeight: '700',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            textAlign: 'center',
            marginBottom: responsive.spacing.xs,
          }}>
            {displayTexts.sectionTitle}
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.base,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
          }}>
            {displayTexts.sectionSubtitle}
          </Text>
        </View>

        {/* Lista de categorías */}
        <View style={{
          paddingHorizontal: responsive.spacing.md,
          paddingBottom: responsive.spacing.xl,
        }}>
          {campeonato.categoriasActivas.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              style={{
                backgroundColor: getColor.background.primary,
                borderRadius: 16,
                padding: responsive.spacing.lg,
                marginBottom: responsive.spacing.md,
                borderWidth: 1,
                borderColor: getColor.gray[200],
                shadowColor: isFinished ? getColor.gray[500] : getColor.primary[500], // ✅ CAMBIADO: de gray[400] a gray[500] (más oscuro)
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={() => handleCategoriaPress(categoria.id)}
              activeOpacity={0.95}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{ flex: 1 }}>
                  {/* Header con nombre completo de categoría */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}>
                    <Text style={{
                      fontSize: responsive.fontSize.lg,
                      fontWeight: '700',
                      color: getColor.primary[600],
                      fontFamily: 'Nunito',
                      marginRight: responsive.spacing.sm,
                    }}>
                      {construirNombreCategoria(categoria, 'completo')}
                    </Text>
                    
                    {/* ✅ BADGE ADAPTADO AL ESTADO */}
                    <View style={{
                      backgroundColor: displayTexts.categoryBadgeColor,
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}>
                      <Text style={{
                        fontSize: responsive.fontSize.xs,
                        fontWeight: '600',
                        color: getColor.background.primary,
                        fontFamily: 'Nunito',
                      }}>
                        {displayTexts.categoryBadge}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Género */}
                  <Text style={{
                    fontSize: responsive.fontSize.sm,
                    color: getColor.gray[500],
                    fontFamily: 'Nunito',
                    marginBottom: responsive.spacing.xs,
                  }}>
                    {getGeneroSimple(categoria.tipo)}
                  </Text>

                  {/* ✅ STATUS ROW ADAPTADO */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsive.spacing.sm,
                  }}>
                    {/* Aparato actual (si no está finalizado) */}
                    {!isFinished && (
                      <View style={{
                        backgroundColor: getColor.secondary[500],
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}>
                        <Text style={{
                          fontSize: responsive.fontSize.xs,
                          fontWeight: '600',
                          color: getColor.background.primary,
                          fontFamily: 'Nunito',
                        }}>
                          {getAparatoDisplayName(categoria.aparatoActual, categoria.tipo)}
                        </Text>
                      </View>
                    )}

                    {/* Participantes */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Ionicons name="people" size={12} color={getColor.gray[400]} />
                      <Text style={{
                        fontSize: responsive.fontSize.xs,
                        color: getColor.gray[500],
                        fontFamily: 'Nunito',
                        marginLeft: 2,
                      }}>
                        {categoria.participantesActivos} {isFinished ? 'participaron' : 'activos'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Arrow indicator */}
                <View style={{
                  backgroundColor: getColor.primary[500],
                  borderRadius: 16,
                  padding: 8,
                }}>
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={getColor.background.primary} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </BaseLayout>
  );
}