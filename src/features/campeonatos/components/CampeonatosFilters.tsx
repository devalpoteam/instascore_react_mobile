// src/features/campeonatos/components/CampeonatosFilters.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColor } from "@/design/colorHelper";
import { useResponsive } from "@/shared/hooks/useResponsive";
import {
  CampeonatoFiltersProps,
  CampeonatoEstado,
} from "../types/campeonatos.types";

export default function CampeonatosFilters({
  filters,
  onFiltersChange,
  totalCount,
}: CampeonatoFiltersProps) {
  const responsive = useResponsive();

  const filterOptions: Array<{
    key: "todos" | CampeonatoEstado;
    label: string;
    icon: string;
  }> = [
    { key: "todos", label: "Todos", icon: "apps-outline" },
    { key: "activo", label: "En Curso", icon: "play-circle-outline" },
    { key: "configuracion", label: "Config.", icon: "settings-outline" },
    {
      key: "finalizado",
      label: "Finalizados",
      icon: "checkmark-circle-outline",
    },
  ];

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({
      ...filters,
      searchTerm,
    });
  };

  const handleFilterSelect = (estado: "todos" | CampeonatoEstado) => {
    onFiltersChange({
      ...filters,
      estado,
    });
  };

  return (
    <View
      style={{
        backgroundColor: getColor.background.primary,
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: getColor.gray[200],
      }}
    >
      {/* Barra de búsqueda */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: getColor.gray[100],
          borderRadius: 12,
          paddingHorizontal: responsive.spacing.md,
          marginBottom: responsive.spacing.md,
          borderWidth: 1,
          borderColor: filters.searchTerm
            ? getColor.primary[300]
            : getColor.gray[200],
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={
            filters.searchTerm ? getColor.primary[500] : getColor.gray[400]
          }
          style={{ marginRight: responsive.spacing.sm }}
        />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: responsive.spacing.sm,
            fontSize: responsive.fontSize.base,
            fontFamily: "Nunito",
            color: getColor.gray[800],
          }}
          placeholder="Buscar campeonatos..."
          placeholderTextColor={getColor.gray[400]}
          value={filters.searchTerm}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filters.searchTerm ? (
          <TouchableOpacity
            onPress={() => handleSearchChange("")}
            style={{ padding: 4 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={getColor.gray[400]}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Chips de filtros */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: responsive.spacing.xs,
        }}
      >
        {filterOptions.map((option) => {
          const isSelected = filters.estado === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              style={{
                flex: 1,
                marginHorizontal: 2,
                backgroundColor: isSelected
                  ? getColor.primary[500]
                  : getColor.background.primary,
                borderWidth: 1.5,
                borderColor: isSelected
                  ? getColor.primary[500]
                  : getColor.gray[300],
                borderRadius: 20,
                paddingVertical: responsive.spacing.sm,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: responsive.isTablet ? "row" : "column",
                minHeight: responsive.isTablet ? 44 : 50,
                shadowColor: isSelected ? getColor.primary[500] : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.2 : 0,
                shadowRadius: 4,
                elevation: isSelected ? 3 : 0,
              }}
              onPress={() => handleFilterSelect(option.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={option.icon as any}
                size={responsive.isTablet ? 18 : 16}
                color={
                  isSelected ? getColor.background.primary : getColor.gray[600]
                }
                style={{
                  marginBottom: responsive.isTablet ? 0 : 2,
                  marginRight: responsive.isTablet ? 6 : 0,
                }}
              />
              <Text
                style={{
                  fontSize: responsive.isTablet
                    ? responsive.fontSize.sm
                    : responsive.fontSize.xs,
                  fontWeight: isSelected ? "600" : "500",
                  color: isSelected
                    ? getColor.background.primary
                    : getColor.gray[600],
                  fontFamily: "Nunito",
                  textAlign: "center",
                  lineHeight: responsive.isTablet
                    ? responsive.fontSize.sm * 1.2
                    : responsive.fontSize.xs * 1.3,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
