// src/features/resultados/screens/CategorySelectorScreen.tsx
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

import { liveService, CategoriaAgrupada } from '@/services/api/live/liveServices';

interface CampeonatoDetalle {
  id: string;
  nombre: string;
  estado: string;
  lugar: string;
  fecha: string;
  numeroDelegaciones: number;
  numeroParticipantes: number;
  numeroCategorias: number;
}

type MainNavigatorParamList = {
  Home: undefined;
  Campeonatos: undefined;
  CampeonatoDetail: { campeonatoId: string };
  Resultados: { campeonatoId?: string };
  CategorySelector: { campeonatoId: string; isFinished?: boolean };
  LiveResults: { 
    campeonatoId: string; 
    categoriaId: string; 
    nivelId: string;
    franjaId: string;
    divisionId?: string;
    isFinished?: boolean 
  };
  Gimnastas: undefined;
  Ajustes: undefined;
};

type CategorySelectorRouteProp = RouteProp<MainNavigatorParamList, 'CategorySelector'>;
type CategorySelectorNavigationProp = NavigationProp<MainNavigatorParamList>;

export default function CategorySelectorScreen() {
  const route = useRoute<CategorySelectorRouteProp>();
  const navigation = useNavigation<CategorySelectorNavigationProp>();
  const responsive = useResponsive();

  const { campeonatoId, isFinished = false } = route.params;
  
  const [campeonato, setCampeonato] = useState<CampeonatoDetalle | null>(null);
  const [categorias, setCategorias] = useState<CategoriaAgrupada[]>([]);
  const [participantesPorFranja, setParticipantesPorFranja] = useState<Record<string, number>>({});
  const [categoriasAgrupadas, setCategoriasAgrupadas] = useState<{[key: string]: CategoriaAgrupada[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [campeonatoId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [campeonatoData, categoriasData] = await Promise.all([
        liveService.getCampeonatoDetalle(campeonatoId),
        liveService.getCategoriasAgrupadas(campeonatoId)
      ]);
      
      setCampeonato(campeonatoData);
      setCategorias(categoriasData);
      
      const agrupadas = categoriasData.reduce((acc, categoria) => {
        if (!acc[categoria.grupo]) {
          acc[categoria.grupo] = [];
        }
        acc[categoria.grupo].push(categoria);
        return acc;
      }, {} as {[key: string]: CategoriaAgrupada[]});
      
      Object.keys(agrupadas).forEach(grupo => {
        agrupadas[grupo].sort((a, b) => {
          if (a.nivel !== b.nivel) {
            return a.nivel.localeCompare(b.nivel);
          }
          if (a.franja !== b.franja) {
            return a.franja.localeCompare(b.franja);
          }
          return a.division.localeCompare(b.division);
        });
      });
      
      setCategoriasAgrupadas(agrupadas);
      const participantesPromises = categoriasData.map(categoria => 
        liveService.getParticipantesPorSubdivision(categoria.idFranja, categoria.division)
          .then(count => ({ categoriaId: categoria.id, count }))
          .catch(error => {
            console.warn(`Error loading participants for categoria ${categoria.id}:`, error);
            return { categoriaId: categoria.id, count: categoria.numeroParticipantes };
          })
      );
      
      const participantesResults = await Promise.all(participantesPromises);
      const participantesMap = participantesResults.reduce((acc, { categoriaId, count }) => {
        acc[categoriaId] = count;
        return acc;
      }, {} as Record<string, number>);
      
      setParticipantesPorFranja(participantesMap);
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Error al cargar datos del campeonato');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleCategoriaPress = (categoria: CategoriaAgrupada) => {
    console.log(`Navegar a resultados de categoría (${isFinished ? 'finalizado' : 'en vivo'}):`, categoria.id);
    navigation.navigate('LiveResults', { 
      campeonatoId: categoria.idCampeonato, 
      categoriaId: categoria.idCategoria,
      nivelId: categoria.idNivel,
      franjaId: categoria.idFranja,
      divisionId: categoria.idDivision,
      isFinished
    });
  };

  const getDisplayTexts = () => {
    if (isFinished) {
      return {
        headerTitle: "Resultados Finales",
        statusLabel: "FINALIZADO",
        statusColor: getColor.gray[600],
        statusBgColor: getColor.gray[200],
        sectionTitle: "Resultados por Categoría",
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
        sectionTitle: "Categorías Compitiendo",
        sectionSubtitle: "Toca una categoría para ver resultados en tiempo real",
        categoryBadge: "EN VIVO",
        categoryBadgeColor: getColor.secondary[500]
      };
    }
  };

  const getGeneroSimple = (disciplina: 'GAF' | 'GAM'): string => {
    return disciplina === 'GAF' ? 'Femenino' : 'Masculino';
  };

  const construirNombreCategoria = (categoria: CategoriaAgrupada): string => {
    return `${categoria.grupo} ${categoria.nivel} ${categoria.franja}`;
  };


  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubdivisionPress = (categoria: CategoriaAgrupada) => {
    console.log('Selected subdivision:', categoria.id);
    navigation.navigate('LiveResults', { 
      campeonatoId: categoria.idCampeonato,
      categoriaId: categoria.idCategoria,
      nivelId: categoria.idNivel,
      franjaId: categoria.idFranja,
      divisionId: categoria.idDivision,
      isFinished
    });
  };

  const getSubdivisionColor = (subdivision: string) => {
    const colors = {
      'A': { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
      'B': { bg: '#ECFDF5', text: '#065F46', border: '#BBF7D0' },
      'C': { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
      'D': { bg: '#FCE7F3', text: '#BE185D', border: '#FBCFE8' },
      'E': { bg: '#F3E8FF', text: '#7C3AED', border: '#DDD6FE' },
      'F': { bg: '#FFF2F1', text: '#DC2626', border: '#FECACA' },
    };
    return colors[subdivision as keyof typeof colors] || colors['A'];
  };

  const getGenderInfo = (categoriasGrupo: CategoriaAgrupada[]) => {
    const disciplina = categoriasGrupo[0]?.disciplina;
    return disciplina === 'GAF' 
      ? { icon: 'woman', color: getColor.secondary[500], label: 'GAF' }
      : { icon: 'man', color: getColor.primary[500], label: 'GAM' };
  };

  const getSubdivisionDots = (categoriasGrupo: CategoriaAgrupada[]) => {
    const uniqueSubdivisions = [...new Set(categoriasGrupo.map(cat => cat.division))].sort();
    return uniqueSubdivisions;
  };

  const getTotalParticipantesPorCategoria = (categoriasGrupo: CategoriaAgrupada[]) => {
    return categoriasGrupo.reduce((total, categoria) => {
      const participantes = participantesPorFranja[categoria.id] ?? categoria.numeroParticipantes;
      return total + participantes;
    }, 0);
  };

  const displayTexts = getDisplayTexts();

  if (isLoading && !isRefreshing) {
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
            color={isFinished ? getColor.gray[600] : getColor.secondary[500]}
            style={{ marginBottom: responsive.spacing.md }}
          />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '600',
            color: isFinished ? getColor.gray[700] : getColor.secondary[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
          }}>
            {isFinished ? 'Cargando resultados...' : 'Cargando categorías...'}
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (error && !isRefreshing) {
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
          <Ionicons 
            name="alert-circle-outline" 
            size={64} 
            color={getColor.error[500]} 
            style={{ marginBottom: responsive.spacing.md }}
          />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '600',
            color: getColor.error[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
            marginBottom: responsive.spacing.sm,
          }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadData}
            style={{
              backgroundColor: getColor.primary[500],
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: responsive.spacing.md,
            }}
          >
            <Text style={{
              color: getColor.background.primary,
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              fontFamily: 'Nunito',
            }}>
              Reintentar
            </Text>
          </TouchableOpacity>
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
        <View style={{
          backgroundColor: isFinished ? getColor.gray[100] : getColor.secondary[50],
          paddingHorizontal: responsive.spacing.md,
          paddingVertical: responsive.spacing.xl,
        }}>
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
                color: isFinished ? getColor.gray[700] : getColor.secondary[600],
                fontFamily: 'Nunito',
              }}>
                {categorias.length}
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
                {campeonato.numeroParticipantes}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[600],
                fontFamily: 'Nunito',
                textAlign: 'center',
              }}>
                Participantes
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
                {campeonato.numeroDelegaciones}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[600],
                fontFamily: 'Nunito',
                textAlign: 'center',
              }}>
                Delegaciones
              </Text>
            </View>
          </View>

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

        <View style={{
          paddingHorizontal: responsive.spacing.md,
          paddingBottom: responsive.spacing.xl,
        }}>
          {Object.entries(categoriasAgrupadas)
            .sort(([grupoA], [grupoB]) => grupoA.localeCompare(grupoB))
            .map(([grupoNombre, categoriasGrupo]) => {
            const isExpanded = expandedCategories.has(grupoNombre);
            
            return (
              <View
                key={grupoNombre}
                style={{
                  backgroundColor: getColor.background.primary,
                  borderRadius: 16,
                  marginBottom: responsive.spacing.sm,
                  borderWidth: 1,
                  borderColor: getColor.gray[200],
                  shadowColor: getColor.gray[400],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  overflow: 'hidden',
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: responsive.spacing.lg,
                    backgroundColor: isExpanded ? getColor.primary[50] : getColor.background.primary,
                  }}
                  onPress={() => toggleCategory(grupoNombre)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <Text style={{
                        fontSize: responsive.fontSize.lg,
                        fontWeight: '700',
                        color: getColor.primary[600],
                        fontFamily: 'Nunito',
                        marginRight: 8,
                      }}>
                        {grupoNombre}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}>
                      <Ionicons name="people" size={12} color={getColor.gray[500]} />
                      <Text style={{
                        fontSize: responsive.fontSize.sm,
                        color: getColor.gray[500],
                        fontFamily: 'Nunito',
                        marginLeft: 4,
                      }}>
                        {getTotalParticipantesPorCategoria(categoriasGrupo)} participantes
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: responsive.fontSize.sm,
                        color: getColor.gray[500],
                        fontFamily: 'Nunito',
                        marginRight: 8,
                      }}>
                        Subdivisiones:
                      </Text>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        {getSubdivisionDots(categoriasGrupo).map((subdivision, index) => (
                          <View
                            key={subdivision}
                            style={{
                              backgroundColor: getSubdivisionColor(subdivision).bg,
                              borderColor: getSubdivisionColor(subdivision).border,
                              borderWidth: 1,
                              borderRadius: 8,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              marginRight: index < getSubdivisionDots(categoriasGrupo).length - 1 ? 4 : 0,
                            }}
                          >
                            <Text style={{
                              fontSize: responsive.fontSize.xs,
                              color: getSubdivisionColor(subdivision).text,
                              fontFamily: 'Nunito',
                              fontWeight: '600',
                            }}>
                              {subdivision}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={getColor.primary[500]}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={{
                    backgroundColor: getColor.gray[50],
                    borderTopWidth: 1,
                    borderTopColor: getColor.gray[200],
                  }}>
                    {categoriasGrupo.map((categoria, index) => (
                      <TouchableOpacity
                        key={categoria.id}
                        style={{
                          paddingHorizontal: responsive.spacing.lg,
                          paddingVertical: responsive.spacing.md,
                          borderBottomWidth: index < categoriasGrupo.length - 1 ? 1 : 0,
                          borderBottomColor: getColor.gray[200],
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onPress={() => handleSubdivisionPress(categoria)}
                        activeOpacity={0.6}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}>
                            <Text style={{
                              fontSize: responsive.fontSize.base,
                              color: getColor.gray[700],
                              fontFamily: 'Nunito',
                              marginRight: 8,
                            }}>
                              {categoria.nivel} {categoria.franja}
                            </Text>
                            <View style={{
                              backgroundColor: getSubdivisionColor(categoria.division).bg,
                              borderColor: getSubdivisionColor(categoria.division).border,
                              borderWidth: 1,
                              borderRadius: 12,
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                            }}>
                              <Text style={{
                                fontSize: responsive.fontSize.sm,
                                color: getSubdivisionColor(categoria.division).text,
                                fontFamily: 'Nunito',
                                fontWeight: '600',
                              }}>
                                Subdiv. {categoria.division}
                              </Text>
                            </View>
                          </View>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <Ionicons name="people" size={12} color={getColor.gray[400]} />
                            <Text style={{
                              fontSize: responsive.fontSize.xs,
                              color: getColor.gray[500],
                              fontFamily: 'Nunito',
                              marginLeft: 4,
                            }}>
                              {participantesPorFranja[categoria.id] ?? categoria.numeroParticipantes} {isFinished ? 'participaron' : 'participantes'}
                            </Text>
                          </View>
                        </View>
                        
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={getColor.gray[400]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </BaseLayout>
  );
}