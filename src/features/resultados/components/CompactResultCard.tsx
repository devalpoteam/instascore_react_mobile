// src/features/resultados/components/CompactResultCard.tsx
import React from "react";
import { View, Text } from "react-native";
import { getColor } from "@/design/colorHelper";
import { useResponsive } from "@/shared/hooks/useResponsive";

interface CompactResultCardProps {
  resultado: {
    aparato: string;
    gimnasta: string;
    delegacion: string;
    nivel: string;
    franja: string;
    subdivision: string;
    puntaje: number;
    puesto: number;
  };
  position: number;
  aparatoActual: string;
  vistaSeleccionada: "aparatos" | "allaround" | "equipos";
  allAroundScore?: number;
  isHighlighted?: boolean;
}

export default function CompactResultCard({
  resultado,
  position,
  aparatoActual,
  vistaSeleccionada,
  allAroundScore,
  isHighlighted = false,
}: CompactResultCardProps) {
  const responsive = useResponsive();

  const formatearPuntaje = (puntaje: number | null): string => {
    if (puntaje === null) return "--";
    return puntaje.toString();
  };

  const getPositionColor = () => {
    if (position === 1) return getColor.secondary[500];
    if (position === 2) return getColor.gray[400];
    if (position === 3) return getColor.warning[500];
    return getColor.gray[300];
  };

  const getPositionEmoji = () => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return "";
  };

  const construirNombreCategoria = () => {
    const nivel = resultado.nivel || "Sin nivel";
    const franja = resultado.franja || "";
    return franja ? `${nivel} - ${franja}` : nivel;
  };

  return (
    <View
      style={{
        backgroundColor: isHighlighted
          ? getColor.secondary[50]
          : getColor.background.primary,
        borderRadius: 12,
        padding: responsive.spacing.md,
        marginBottom: responsive.spacing.sm,
        borderWidth: isHighlighted ? 2 : 1,
        borderColor: isHighlighted
          ? getColor.secondary[300]
          : getColor.gray[200],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isHighlighted ? 0.15 : 0.05,
        shadowRadius: isHighlighted ? 4 : 2,
        elevation: isHighlighted ? 3 : 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginRight: responsive.spacing.md,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: getPositionColor(),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: "700",
                color: getColor.background.primary,
                fontFamily: "Nunito",
              }}
            >
              {position}
            </Text>
          </View>
          {position <= 3 && (
            <Text style={{ fontSize: 12, marginTop: 2 }}>
              {getPositionEmoji()}
            </Text>
          )}
        </View>

        <View style={{ flex: 1, marginRight: responsive.spacing.md }}>
          <Text
            style={{
              fontSize: responsive.fontSize.base,
              fontWeight: "600",
              color: getColor.gray[800],
              fontFamily: "Nunito",
              marginBottom: 2,
            }}
          >
            {resultado.gimnasta}
          </Text>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[500],
              fontFamily: "Nunito",
              marginBottom: 2,
            }}
          >
            {resultado.delegacion}
          </Text>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[400],
              fontFamily: "Nunito",
            }}
          >
            {construirNombreCategoria()} • Subdiv. {resultado.subdivision}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <View
            style={{
              backgroundColor: "transparent",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.lg,
                fontWeight: "700",
                color: getColor.primary[600],
                fontFamily: "Nunito",
              }}
            >
              {formatearPuntaje(resultado.puntaje)}
            </Text>
          </View>

          {vistaSeleccionada === "aparatos" && allAroundScore && (
            <Text
              style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[500],
                fontFamily: "Nunito",
                fontWeight: "700",
                marginTop: 2,
                textAlign: "center",
              }}
            >
              AA: {allAroundScore.toString()}
            </Text>
          )}

          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[400],
              fontFamily: "Nunito",
              marginTop: 4,
            }}
          >
            {resultado.aparato}
          </Text>
        </View>
      </View>
    </View>
  );
}