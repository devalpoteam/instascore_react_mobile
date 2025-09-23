// src/features/resultados/screens/LiveResultsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getColor } from "@/design/colorHelper";
import { useResponsive } from "@/shared/hooks/useResponsive";
import { useAppSelector } from "@/store/hooks";
import BaseLayout from "@/shared/components/layout/BaseLayout";
import Header from "@/shared/components/layout/Header";

import CompactResultCard from "../components/CompactResultCard";
import UpgradeBanner from "../components/UpgradeBanner";
import CompactTeamCard from "../components/CompactTeamCard";

import { resultadosService, ResultadoIndividual, ResultadoEquipo } from "@/services/api/resultados/resultadosService";
import { liveService, CategoriaAgrupada } from "@/services/api/live/liveServices";
import { campeonatoDetailService } from "@/services/api/campeonatos/campeonatoDetailService";

type LiveResultsRouteProp = RouteProp<
  { 
    LiveResults: { 
      campeonatoId: string; 
      categoriaId: string; 
      nivelId: string;
      franjaId: string;
      isFinished?: boolean 
    } 
  },
  "LiveResults"
>;

interface LiveResultsState {
  resultadosCompletos: ResultadoIndividual[];
  resultadosAllAround: ResultadoIndividual[];
  equipos: ResultadoEquipo[];
  aparatos: string[];
  aparatoSeleccionado: string;
  vistaSeleccionada: "aparatos" | "allaround" | "equipos";
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  showUpgradeBanner: boolean;
  showAparatoDropdown: boolean;
  campeonatoNombre: string;
  categoriaNombre: string;
  categoriaDetalle?: any;
}

export default function LiveResultsScreen() {
  const route = useRoute<LiveResultsRouteProp>();
  const navigation = useNavigation();
  const responsive = useResponsive();
  const { isPro } = useAppSelector((state) => state.auth);

  const { 
    campeonatoId, 
    categoriaId, 
    nivelId, 
    franjaId, 
    isFinished = false 
  } = route.params || {
    campeonatoId: "1",
    categoriaId: "cat1",
    nivelId: "nivel1",
    franjaId: "franja1",
    isFinished: false
  };

  const [state, setState] = useState<LiveResultsState>({
    resultadosCompletos: [],
    resultadosAllAround: [],
    equipos: [],
    aparatos: [],
    aparatoSeleccionado: "",
    vistaSeleccionada: "aparatos",
    isLoading: true,
    isRefreshing: false,
    error: null,
    showUpgradeBanner: !isPro,
    showAparatoDropdown: false,
    campeonatoNombre: "",
    categoriaNombre: "",
    categoriaDetalle: undefined,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      await loadCampeonatoYCategoria();
      await loadResultados('aparato');
      await loadResultados('all around');
    };
    loadInitialData();
  }, [campeonatoId, categoriaId, nivelId, franjaId]);

  const orderAparatosPorDisciplina = (aparatos: string[], disciplina?: string): string[] => {
    const aparatosGAF = ['Salto', 'Asimétricas', 'Viga', 'Suelo'];
    const aparatosGAM = ['Suelo', 'Arzones', 'Anillas', 'Salto', 'Paralelas', 'Barra'];

    // DEBUG: Log para verificar el valor de disciplina
    console.log('🔍 DEBUG - orderAparatosPorDisciplina:');
    console.log('  disciplina recibida:', disciplina);
    console.log('  aparatos originales:', aparatos);
    console.log('  categoriaDetalle completo:', state.categoriaDetalle);

    // Mapeo para normalizar nombres de aparatos
    const normalizarAparato = (aparato: string): string => {
      const normalizaciones: { [key: string]: string } = {
        // GAF - Gimnasia Artística Femenina
        'Asimetricas': 'Asimétricas',
        'Asimétrica': 'Asimétricas',
        'Asimetrica': 'Asimétricas',
        'Paralelas Asimetricas': 'Asimétricas',
        'Paralelas Asimétricas': 'Asimétricas',

        // GAM - Gimnasia Artística Masculina
        'Paralela': 'Paralelas',
        'Paralelas Simétricas': 'Paralelas',
        'Paralelas Simetricas': 'Paralelas',
        'Anilla': 'Anillas',
        'Arzon': 'Arzones',
        'Arzón': 'Arzones',
        'Caballo con Arzon': 'Arzones',
        'Caballo con Arzón': 'Arzones',
        'Caballo': 'Arzones',
        'Barra Fija': 'Barra',
        'Barra fija': 'Barra'
      };
      return normalizaciones[aparato] || aparato;
    };

    // Determinar disciplina: si no hay disciplina específica, intentar detectar por aparatos
    let disciplinaFinal = disciplina;

    if (!disciplinaFinal) {
      // Intentar detectar disciplina por los aparatos presentes
      const aparatosGAFPresentes = aparatos.filter(a => aparatosGAF.includes(normalizarAparato(a))).length;
      const aparatosGAMPresentes = aparatos.filter(a => aparatosGAM.includes(normalizarAparato(a))).length;

      if (aparatosGAFPresentes > aparatosGAMPresentes) {
        disciplinaFinal = 'GAF';
        console.log('🔍 Disciplina auto-detectada como GAF por aparatos presentes');
      } else if (aparatosGAMPresentes > 0) {
        disciplinaFinal = 'GAM';
        console.log('🔍 Disciplina auto-detectada como GAM por aparatos presentes');
      } else {
        // Por defecto usar GAF si no se puede detectar
        disciplinaFinal = 'GAF';
        console.log('🔍 Usando GAF por defecto');
      }
    }

    const esGAF = disciplinaFinal === 'GAF' || disciplinaFinal.toLowerCase().includes('femenino');
    const ordenReferencia = esGAF ? aparatosGAF : aparatosGAM;

    console.log('  disciplina final usada:', disciplinaFinal);
    console.log('  es GAF?:', esGAF);
    console.log('  orden de referencia:', ordenReferencia);

    const resultado = aparatos.sort((a, b) => {
      const aparatoA = normalizarAparato(a);
      const aparatoB = normalizarAparato(b);

      const indexA = ordenReferencia.indexOf(aparatoA);
      const indexB = ordenReferencia.indexOf(aparatoB);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return a.localeCompare(b);
    });

    console.log('  resultado final ordenado:', resultado);
    return resultado;
  };

  const loadCampeonatoYCategoria = async () => {
    try {
      const [campeonato, categorias] = await Promise.all([
        campeonatoDetailService.getCampeonatoById(campeonatoId),
        liveService.getCategoriasAgrupadas(campeonatoId)
      ]);

      const categoriaEncontrada = categorias.find(cat => 
        cat.idCategoria === categoriaId && 
        cat.idNivel === nivelId && 
        cat.idFranja === franjaId
      );

      const categoriaNombre = categoriaEncontrada 
        ? `${categoriaEncontrada.grupo} ${categoriaEncontrada.nivel} ${categoriaEncontrada.franja}`
        : "Categoría";

      setState(prev => ({
        ...prev,
        campeonatoNombre: campeonato.nombre,
        categoriaNombre: categoriaNombre,
        categoriaDetalle: categoriaEncontrada
      }));
    } catch (error) {
      console.error('Error loading campeonato y categoria:', error);
    }
  };

  const loadResultados = async (modalidad: 'aparato' | 'all around' = 'aparato') => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [resultados, equipos] = await Promise.all([
        resultadosService.getResultadosIndividuales({
          campeonatoId,
          categoriaId,
          nivelId,
          franjaId,
          modalidad
        }),
        resultadosService.getResultadosEquipos({
          campeonatoId,
          categoriaId,
          nivelId,
          franjaId
        })
      ]);

      // DEBUG: Verificar los datos de resultados
      console.log('🔍 Debug orden olímpico:', {
        modalidad,
        disciplina: state.categoriaDetalle?.disciplina,
        aparatosSinOrden: [...new Set(resultados.map(r => r.aparato))]
      });

      const aparatosUnicos = modalidad === 'aparato'
        ? orderAparatosPorDisciplina(
            [...new Set(resultados.map(r => r.aparato).filter(a => a !== null && a !== undefined))],
            state.categoriaDetalle?.disciplina
          )
        : [];

      console.log('🥇 Aparatos ordenados:', aparatosUnicos);


      setState((prev) => ({
        ...prev,
        resultadosCompletos: modalidad === 'aparato' ? resultados : prev.resultadosCompletos,
        resultadosAllAround: modalidad === 'all around' ? resultados : prev.resultadosAllAround,
        equipos,
        aparatos: modalidad === 'aparato' ? aparatosUnicos : prev.aparatos,
        aparatoSeleccionado: modalidad === 'aparato' ? (aparatosUnicos[0] || "") : prev.aparatoSeleccionado,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Error al cargar los resultados",
        isLoading: false,
      }));
    }
  };

  const handleRefresh = async () => {
    setState((prev) => ({ ...prev, isRefreshing: true }));
    await loadCampeonatoYCategoria();
    await loadResultados('aparato');
    await loadResultados('all around');
    setState((prev) => ({ ...prev, isRefreshing: false }));
  };

  const handleVistaChange = (vista: "aparatos" | "allaround" | "equipos") => {
    setState((prev) => ({ ...prev, vistaSeleccionada: vista }));
  };

  const handleDismissBanner = () => {
    setState((prev) => ({ ...prev, showUpgradeBanner: false }));
  };

  const handleAparatoSelect = (aparato: string) => {
    setState((prev) => ({ 
      ...prev, 
      aparatoSeleccionado: aparato,
      showAparatoDropdown: false 
    }));
  };

  const gimnastasDelAparato = state.resultadosCompletos.filter(
    r => r.aparato === state.aparatoSeleccionado
  );

  const gimnastasAllAround = state.resultadosAllAround;

  const gimnastasActuales = state.vistaSeleccionada === 'allaround' 
    ? gimnastasAllAround 
    : gimnastasDelAparato;

  // Apply different limits based on view type
  const gimnastasLimit = state.vistaSeleccionada === 'allaround' ? 3 : 1;
  const equiposLimit = 1;
  
  const gimnastasToShow = isPro ? gimnastasActuales : gimnastasActuales.slice(0, gimnastasLimit);
  const equiposToShow = isPro ? state.equipos : state.equipos.slice(0, equiposLimit);

  const getDisplayTexts = () => {
    if (isFinished) {
      return {
        headerTitle: "Resultados Finales",
        loadingText: "Cargando resultados finales...",
        statusBadge: "FINALIZADO",
        statusColor: getColor.gray[500],
        indicatorIcon: "trophy" as const,
        lastUpdateText: "Resultados oficiales finales"
      };
    } else {
      return {
        headerTitle: "Resultados En Vivo",
        loadingText: "Cargando resultados...",
        statusBadge: "EN VIVO",
        statusColor: getColor.secondary[500],
        indicatorIcon: "radio" as const,
        lastUpdateText: "Última actualización"
      };
    }
  };

  const displayTexts = getDisplayTexts();

  if (state.isLoading && !state.isRefreshing) {
    return (
      <BaseLayout>
        <Header 
          title={state.categoriaNombre || displayTexts.headerTitle} 
          subtitle={state.campeonatoNombre}
          showBack={true} 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: responsive.spacing.xl,
        }}>
          <Ionicons name={displayTexts.indicatorIcon} size={48} color={displayTexts.statusColor} />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: "600",
            color: displayTexts.statusColor,
            fontFamily: "Nunito",
            textAlign: "center",
            marginTop: responsive.spacing.md,
          }}>
            {displayTexts.loadingText}
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (state.error) {
    return (
      <BaseLayout>
        <Header 
          title={state.categoriaNombre || "Error"} 
          subtitle={state.campeonatoNombre}
          showBack={true} 
          onBackPress={() => navigation.goBack()} 
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Error: {state.error}</Text>
          <TouchableOpacity onPress={() => loadResultados()} style={{ marginTop: 16, padding: 12, backgroundColor: getColor.primary[500], borderRadius: 8 }}>
            <Text style={{ color: "white" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title={state.categoriaNombre || "Resultados"}
        subtitle={state.campeonatoNombre || "Campeonato"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={{
        backgroundColor: isFinished ? getColor.gray[50] : getColor.secondary[50],
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: isFinished ? getColor.gray[200] : getColor.secondary[200],
      }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {state.vistaSeleccionada === 'equipos' ? (
              <>
                <Ionicons
                  name="people"
                  size={30}
                  color={isFinished ? getColor.gray[600] : getColor.secondary[700]}
                  style={{ marginRight: responsive.spacing.sm }}
                />
                <View>
                  <Text style={{
                    fontSize: responsive.fontSize.lg,
                    fontWeight: "800",
                    color: isFinished ? getColor.gray[700] : getColor.secondary[700],
                    fontFamily: "Nunito",
                  }}>
                    Por Equipos
                  </Text>
                </View>
              </>
            ) : state.vistaSeleccionada === 'allaround' ? (
              <>
                <Ionicons
                  name="trophy"
                  size={30}
                  color={isFinished ? getColor.gray[600] : getColor.secondary[700]}
                  style={{ marginRight: responsive.spacing.sm }}
                />
                <View>
                  <Text style={{
                    fontSize: responsive.fontSize.lg,
                    fontWeight: "800",
                    color: isFinished ? getColor.gray[700] : getColor.secondary[700],
                    fontFamily: "Nunito",
                  }}>
                    All Around
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Ionicons
                  name="trophy"
                  size={30}
                  color={isFinished ? getColor.gray[600] : getColor.secondary[700]}
                  style={{ marginRight: responsive.spacing.sm }}
                />
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    onPress={() => setState(prev => ({ ...prev, showAparatoDropdown: !prev.showAparatoDropdown }))}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: getColor.background.primary,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: getColor.gray[200],
                    }}
                  >
                    <Text style={{
                      fontSize: responsive.fontSize.lg,
                      fontWeight: "800",
                      color: isFinished ? getColor.gray[700] : getColor.secondary[700],
                      fontFamily: "Nunito",
                      marginRight: 8,
                    }}>
                      {state.aparatoSeleccionado || 'Seleccionar aparato'}
                    </Text>
                    <Ionicons
                      name={state.showAparatoDropdown ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={getColor.gray[500]}
                    />
                  </TouchableOpacity>

                  {state.showAparatoDropdown && (
                    <View style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: 160,
                      backgroundColor: getColor.background.primary,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: getColor.gray[200],
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                      zIndex: 1000,
                      marginTop: 4,
                    }}>
                      {state.aparatos.map((aparato) => (
                        <TouchableOpacity
                          key={aparato}
                          onPress={() => handleAparatoSelect(aparato)}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 12,
                            borderBottomWidth: aparato === state.aparatos[state.aparatos.length - 1] ? 0 : 1,
                            borderBottomColor: getColor.gray[100],
                          }}
                        >
                          <Text style={{
                            fontSize: responsive.fontSize.base,
                            color: aparato === state.aparatoSeleccionado ? getColor.secondary[600] : getColor.gray[700],
                            fontWeight: aparato === state.aparatoSeleccionado ? '600' : '400',
                            fontFamily: "Nunito",
                          }}>
                            {aparato}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
          </View>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: displayTexts.statusColor,
            borderRadius: 12,
            paddingHorizontal: responsive.spacing.sm,
            paddingVertical: 4,
          }}>
            <View style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: getColor.background.primary,
              marginRight: 4,
            }} />
            <Text style={{
              fontSize: responsive.fontSize.xs,
              fontWeight: "600",
              color: getColor.background.primary,
              fontFamily: "Nunito",
            }}>
              {displayTexts.statusBadge}
            </Text>
          </View>
        </View>
      </View>

      <View style={{
        flexDirection: "row",
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
        backgroundColor: getColor.background.primary,
        gap: responsive.spacing.xs,
      }}>
        {[
          { key: "aparatos" as const, label: "Por Aparatos", icon: "radio" as const },
          { key: "allaround" as const, label: "All Around", icon: "trophy" as const },
          { key: "equipos" as const, label: "Por Equipos", icon: "people" as const },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: state.vistaSeleccionada === option.key 
                ? (isFinished ? getColor.gray[500] : getColor.secondary[500])
                : getColor.gray[100],
              borderRadius: 8,
              paddingVertical: responsive.spacing.sm,
            }}
            onPress={() => handleVistaChange(option.key)}
          >
            <Ionicons
              name={option.icon as any}
              size={14}
              color={state.vistaSeleccionada === option.key 
                ? getColor.background.primary 
                : getColor.gray[600]
              }
              style={{ marginRight: 4 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.xs,
              fontWeight: "600",
              color: state.vistaSeleccionada === option.key 
                ? getColor.background.primary 
                : getColor.gray[600],
              fontFamily: "Nunito",
            }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={handleRefresh}
            tintColor={displayTexts.statusColor}
            colors={[displayTexts.statusColor]}
          />
        }
      >
        {!isPro && state.showUpgradeBanner && (
          <UpgradeBanner
            onUpgrade={() => 
              Alert.alert(
                "Instascore Pro",
                "Para suscribirse a Instascore Pro, debe contactarse con un administrador.",
                [{ text: "Entendido", style: "default" }]
              )
            }
            onDismiss={handleDismissBanner}
          />
        )}

        <View style={{ padding: responsive.spacing.md }}>
          {state.vistaSeleccionada === 'equipos' ? (
            equiposToShow.length > 0 ? (
              <>
                {equiposToShow.map((equipo, index) => (
                  <CompactTeamCard
                    key={equipo.id}
                    equipo={equipo}
                    position={index + 1}
                  />
                ))}
                {!isPro && state.equipos.length > 1 && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: getColor.gray[50],
                      borderRadius: 12,
                      padding: responsive.spacing.lg,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: getColor.gray[200],
                      borderStyle: "dashed",
                      marginTop: responsive.spacing.sm,
                    }}
                    onPress={() => Alert.alert("Upgrade", "Actualiza a Premium para ver todos los equipos")}
                  >
                    <Ionicons name="people" size={24} color={getColor.gray[400]} />
                    <Text style={{
                      fontSize: responsive.fontSize.sm,
                      color: getColor.gray[500],
                      textAlign: "center",
                      marginTop: responsive.spacing.xs,
                      fontFamily: "Nunito",
                    }}>
                      +{state.equipos.length - 1} equipos más en Premium
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={{
                backgroundColor: getColor.gray[50],
                borderRadius: 12,
                padding: responsive.spacing.xl,
                alignItems: "center",
                marginTop: responsive.spacing.lg,
              }}>
                <Ionicons 
                  name={isFinished ? "document-outline" : "time-outline"} 
                  size={48} 
                  color={getColor.gray[400]} 
                />
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: "600",
                  color: getColor.gray[600],
                  textAlign: "center",
                  marginTop: responsive.spacing.md,
                  fontFamily: "Nunito",
                }}>
                  {isFinished 
                    ? "No hay datos disponibles para este campeonato."
                    : "No hay puntajes disponibles en este momento. Vuelve más tarde."
                  }
                </Text>
              </View>
            )
          ) : gimnastasActuales.length > 0 ? (
            <>
              {gimnastasToShow.map((resultado, index) => (
                <CompactResultCard
                  key={`${resultado.gimnasta}_${resultado.delegacion}_${resultado.aparato}_${resultado.puesto}_${resultado.puntaje}`}
                  resultado={resultado}
                  position={resultado.puesto}
                  aparatoActual={state.aparatoSeleccionado}
                  vistaSeleccionada={state.vistaSeleccionada}
                  allAroundScore={resultado.allaround}
                  isHighlighted={index === 0}
                />
              ))}

              {!isPro && gimnastasActuales.length > gimnastasLimit && (
                <TouchableOpacity
                  style={{
                    backgroundColor: getColor.gray[50],
                    borderRadius: 12,
                    padding: responsive.spacing.lg,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: getColor.gray[200],
                    borderStyle: "dashed",
                    marginTop: responsive.spacing.sm,
                  }}
                  onPress={() => Alert.alert("Upgrade", "Actualiza a Premium para ver todos los resultados")}
                >
                  <Ionicons name="lock-closed" size={24} color={getColor.gray[400]} />
                  <Text style={{
                    fontSize: responsive.fontSize.sm,
                    color: getColor.gray[500],
                    textAlign: "center",
                    marginTop: responsive.spacing.xs,
                    fontFamily: "Nunito",
                  }}>
                    +{gimnastasActuales.length - gimnastasLimit} resultados más en Premium
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={{
              backgroundColor: getColor.gray[50],
              borderRadius: 12,
              padding: responsive.spacing.xl,
              alignItems: "center",
              marginTop: responsive.spacing.lg,
            }}>
              <Ionicons 
                name={isFinished ? "document-outline" : "time-outline"} 
                size={48} 
                color={getColor.gray[400]} 
              />
              <Text style={{
                fontSize: responsive.fontSize.base,
                fontWeight: "600",
                color: getColor.gray[600],
                textAlign: "center",
                marginTop: responsive.spacing.md,
                fontFamily: "Nunito",
              }}>
                {isFinished 
                  ? "No hay datos disponibles para este campeonato."
                  : "No hay puntajes disponibles en este momento. Vuelve más tarde."
                }
              </Text>
            </View>
          )}
        </View>

        <View style={{
          padding: responsive.spacing.md,
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: getColor.gray[100],
        }}>
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[400],
            fontFamily: "Nunito",
          }}>
            {isFinished 
              ? displayTexts.lastUpdateText
              : `${displayTexts.lastUpdateText}: ${new Date().toLocaleTimeString()}`
            }
          </Text>
        </View>
      </ScrollView>
    </BaseLayout>
  );
}