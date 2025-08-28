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
  });

  useEffect(() => {
    const loadInitialData = async () => {
      await loadResultados('aparato');
      await loadResultados('all around');
    };
    loadInitialData();
  }, [campeonatoId, categoriaId, nivelId, franjaId]);

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

      const aparatosUnicos = modalidad === 'aparato' 
        ? [...new Set(resultados.map(r => r.aparato))].sort()
        : [];

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

  const gimnastasToShow = isPro ? gimnastasActuales : gimnastasActuales.slice(0, 3);
  const equiposToShow = isPro ? state.equipos : state.equipos.slice(0, 3);

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
        <Header title={displayTexts.headerTitle} showBack={true} onBackPress={() => navigation.goBack()} />
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
        <Header title="Error" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Error: {state.error}</Text>
          <TouchableOpacity onPress={loadResultados} style={{ marginTop: 16, padding: 12, backgroundColor: getColor.primary[500], borderRadius: 8 }}>
            <Text style={{ color: "white" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title="Resultados"
        subtitle="Campeonato"
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
                      right: 0,
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
            onUpgrade={() => console.log("Navigate to upgrade")}
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
                {!isPro && state.equipos.length > 3 && (
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
                      +{state.equipos.length - 3} equipos más en Premium
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
                <Ionicons name="time-outline" size={48} color={getColor.gray[400]} />
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: "600",
                  color: getColor.gray[600],
                  textAlign: "center",
                  marginTop: responsive.spacing.md,
                  fontFamily: "Nunito",
                }}>
                  No hay puntajes disponibles en este momento. Vuelve más tarde.
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
                  isHighlighted={index === 0}
                />
              ))}

              {!isPro && gimnastasActuales.length > 3 && (
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
                    +{gimnastasActuales.length - 3} resultados más en Premium
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
              <Ionicons name="time-outline" size={48} color={getColor.gray[400]} />
              <Text style={{
                fontSize: responsive.fontSize.base,
                fontWeight: "600",
                color: getColor.gray[600],
                textAlign: "center",
                marginTop: responsive.spacing.md,
                fontFamily: "Nunito",
              }}>
                No hay puntajes disponibles en este momento. Vuelve más tarde.
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