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

// Componentes optimizados
import CompactResultCard from "../components/CompactResultCard";
import DiscreteUpgradeBanner from "../components/DiscreteUpgradeBanner";

// Data
import {
  ResultadosCategoria,
  mockResultadosKinderF1,
  mockResultadosJuvenilGAM,
  getAparatoDisplayNameResults,
} from "../data/mockLiveResultsData";
import { getAparatoIcon, AparatoGeneral } from "../data/mockLiveData";

// Navigation types
type LiveResultsRouteProp = RouteProp<
  { LiveResults: { campeonatoId: string; categoriaId: string } },
  "LiveResults"
>;

interface LiveResultsState {
  resultados: ResultadosCategoria | null;
  vistaSeleccionada: "aparatos" | "allaround" | "equipos";
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  showUpgradeBanner: boolean;
}

export default function LiveResultsScreen() {
  const route = useRoute<LiveResultsRouteProp>();
  const navigation = useNavigation();
  const responsive = useResponsive();
  const { isPro } = useAppSelector((state) => state.auth);

  const { campeonatoId, categoriaId } = route.params || {
    campeonatoId: "1",
    categoriaId: "cat1",
  };

  const [state, setState] = useState<LiveResultsState>({
    resultados: null,
    vistaSeleccionada: "aparatos", // Foco en el aparato actual
    isLoading: true,
    isRefreshing: false,
    error: null,
    showUpgradeBanner: !isPro, // Solo mostrar si no es Pro
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadResultados();
  }, [campeonatoId, categoriaId]);

  // Simular WebSocket updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.resultados && !state.isLoading) {
        simulateWebSocketUpdate();
      }
    }, 15000); // Cada 15 segundos

    return () => clearInterval(interval);
  }, [state.resultados, state.isLoading]);

  const loadResultados = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await new Promise((resolve) => setTimeout(resolve, 800));

      const resultados = categoriaId === "cat1" 
        ? mockResultadosKinderF1 
        : mockResultadosJuvenilGAM;

      setState((prev) => ({
        ...prev,
        resultados,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Error al cargar los resultados",
        isLoading: false,
      }));
    }
  };

  const simulateWebSocketUpdate = () => {
    setState((prev) => {
      if (!prev.resultados) return prev;

      const updatedResultados = { ...prev.resultados };
      const randomIndex = Math.floor(Math.random() * updatedResultados.gimnastas.length);
      const randomGimnasta = { ...updatedResultados.gimnastas[randomIndex] };

      if (randomGimnasta.puntajes[updatedResultados.aparatoActual] === null) {
        const nuevoPuntaje = Math.round((Math.random() * 2 + 7) * 10) / 10;
        randomGimnasta.puntajes[updatedResultados.aparatoActual] = nuevoPuntaje;
        randomGimnasta.allAround += nuevoPuntaje;
        updatedResultados.gimnastas[randomIndex] = randomGimnasta;
        updatedResultados.ultimaActualizacion = new Date().toISOString();
      }

      return {
        ...prev,
        resultados: updatedResultados,
      };
    });
  };

  const handleRefresh = async () => {
    setState((prev) => ({ ...prev, isRefreshing: true }));
    await loadResultados();
    setState((prev) => ({ ...prev, isRefreshing: false }));
  };

  const handleVistaChange = (vista: "aparatos" | "allaround" | "equipos") => {
    if (vista === "equipos" && !isPro) {
      Alert.alert(
        "🚀 Función Pro",
        "Ver resultados por equipos está disponible solo para usuarios Pro.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Actualizar a Pro", onPress: () => console.log("Navigate to upgrade") },
        ]
      );
      return;
    }
    setState((prev) => ({ ...prev, vistaSeleccionada: vista }));
  };

  const handleDismissBanner = () => {
    setState((prev) => ({ ...prev, showUpgradeBanner: false }));
  };

  if (state.isLoading && !state.isRefreshing) {
    return (
      <BaseLayout>
        <Header title="Resultados En Vivo" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: responsive.spacing.xl,
        }}>
          <Ionicons name="radio" size={48} color={getColor.secondary[500]} />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: "600",
            color: getColor.secondary[500],
            fontFamily: "Nunito",
            textAlign: "center",
            marginTop: responsive.spacing.md,
          }}>
            Cargando resultados...
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (!state.resultados) {
    return (
      <BaseLayout>
        <Header title="Error" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Error al cargar resultados</Text>
        </View>
      </BaseLayout>
    );
  }

  const { resultados } = state;
  const gimnastasToShow = isPro ? resultados.gimnastas : resultados.gimnastas.slice(0, 3);
  
  const getAparatoIconSafe = (aparato: string) => {
    const aparatosValidos = [
      'salto', 'asimetricas', 'viga', 'suelo', // GAF
      'arzones', 'anillas', 'paralelas', 'barra' // GAM  
    ];
    
    if (aparatosValidos.includes(aparato)) {
      return getAparatoIcon(aparato as AparatoGeneral);
    }
    
    // Fallback para aparatos no reconocidos
    return 'help-circle-outline';
  };

  return (
    <BaseLayout>
      {/* Header simplificado */}
      <Header 
        title={resultados.categoriaNombre}
        subtitle={resultados.campeonatoNombre}
        showBack={true} 
        onBackPress={() => navigation.goBack()}
      />

      {/* Header de aparato actual compacto */}
      <View style={{
        backgroundColor: getColor.secondary[50],
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: getColor.secondary[200],
      }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          {/* Info del aparato */}
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Ionicons
              name={getAparatoIcon(resultados.aparatoActual as AparatoGeneral) as any}
              size={20}
              color={getColor.secondary[700]}
              style={{ marginRight: responsive.spacing.sm }}
            />
            <View>
              <Text style={{
                fontSize: responsive.fontSize.base,
                fontWeight: "700",
                color: getColor.secondary[700],
                fontFamily: "Nunito",
              }}>
                {getAparatoDisplayNameResults(resultados.aparatoActual)}
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.secondary[600],
                fontFamily: "Nunito",
              }}>
                Aparato {resultados.aparatoNumero} de {resultados.totalAparatos}
              </Text>
            </View>
          </View>

          {/* Indicador EN VIVO compacto */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: getColor.secondary[500],
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
              EN VIVO
            </Text>
          </View>
        </View>
      </View>

      {/* Selector de vista minimalista */}
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
          { key: "equipos" as const, label: "Por Equipos", icon: "people" as const, prOnly: true },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: state.vistaSeleccionada === option.key 
                ? getColor.secondary[500] 
                : getColor.gray[100],
              borderRadius: 8,
              paddingVertical: responsive.spacing.sm,
              opacity: option.prOnly && !isPro ? 0.6 : 1,
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
              {option.prOnly && !isPro && " 🔒"}
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
            tintColor={getColor.secondary[500]}
            colors={[getColor.secondary[500]]}
          />
        }
      >
        {/* Banner upgrade colapsable discreto */}
        {!isPro && state.showUpgradeBanner && (
          <DiscreteUpgradeBanner
            onUpgrade={() => console.log("Navigate to upgrade")}
            onDismiss={handleDismissBanner}
          />
        )}

        {/* Lista de resultados con cards compactas */}
        <View style={{ padding: responsive.spacing.md }}>
          {gimnastasToShow.map((gimnasta, index) => (
            <CompactResultCard
              key={gimnasta.id}
              gimnasta={gimnasta}
              position={index + 1}
              aparatoActual={resultados.aparatoActual}
              vistaSeleccionada={state.vistaSeleccionada}
              isHighlighted={index === 0}
            />
          ))}

          {/* Prompt para upgrade */}
          {!isPro && resultados.gimnastas.length > 3 && (
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
              onPress={() => Alert.alert("Upgrade", "Actualiza a Pro para ver todos los resultados")}
            >
              <Ionicons name="lock-closed" size={24} color={getColor.gray[400]} />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                color: getColor.gray[500],
                textAlign: "center",
                marginTop: responsive.spacing.xs,
                fontFamily: "Nunito",
              }}>
                +{resultados.gimnastas.length - 3} resultados más en Pro
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer con timestamp */}
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
            Última actualización: {new Date(resultados.ultimaActualizacion).toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
    </BaseLayout>
  );
}