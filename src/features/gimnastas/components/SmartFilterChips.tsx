// src/features/gimnastas/components/SmartFilterChips.tsx - SOLO FILTROS CONFIABLES
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

// Tipos simplificados para filtros híbridos
export interface SmartFilters {
  soloMedallistas: boolean;
  soloActivos: boolean;
  campeonatoId: string | null;
  club: string | null;
}

interface SmartFilterChipsProps {
  filters: SmartFilters;
  onFilterChange: (filters: Partial<SmartFilters>) => void;
  availableCampeonatos: Array<{id: string, nombre: string, count: number}>;
  availableClubes: Array<{club: string, count: number}>;
}

export default function SmartFilterChips({
  filters,
  onFilterChange,
  availableCampeonatos,
  availableClubes,
}: SmartFilterChipsProps) {
  const responsive = useResponsive();

  const handleChipPress = (filterType: keyof SmartFilters, value: string | boolean | null) => {
    // Si es el mismo filtro, lo removemos (toggle off)
    if (
      (filterType === 'campeonatoId' && filters.campeonatoId === value) ||
      (filterType === 'club' && filters.club === value) ||
      (filterType === 'soloMedallistas' && filters.soloMedallistas === value) ||
      (filterType === 'soloActivos' && filters.soloActivos === value)
    ) {
      // Reset del filtro
      onFilterChange({
        [filterType]: filterType === 'soloMedallistas' || filterType === 'soloActivos' ? false : null
      });
    } else {
      // Aplicar el filtro
      onFilterChange({ [filterType]: value });
    }
  };

  const isFilterActive = (filterType: keyof SmartFilters, value: string | boolean): boolean => {
    switch (filterType) {
      case 'campeonatoId':
        return filters.campeonatoId === value;
      case 'club':
        return filters.club === value;
      case 'soloMedallistas':
        return filters.soloMedallistas === true;
      case 'soloActivos':
        return filters.soloActivos === true;
      default:
        return false;
    }
  };

  const hasActiveFilters = 
    filters.campeonatoId || 
    filters.club || 
    filters.soloMedallistas || 
    filters.soloActivos;

  const Chip = ({ 
    label, 
    count, 
    isActive, 
    onPress, 
    icon 
  }: { 
    label: string; 
    count?: number; 
    isActive: boolean; 
    onPress: () => void;
    icon?: string;
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isActive ? getColor.primary[500] : getColor.background.primary,
        borderRadius: 20,
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
        marginRight: responsive.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isActive ? getColor.primary[500] : getColor.gray[200],
        shadowColor: isActive ? getColor.primary[500] : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.2 : 0,
        shadowRadius: 4,
        elevation: isActive ? 3 : 0,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={isActive ? getColor.background.primary : getColor.gray[600]} 
          style={{ marginRight: responsive.spacing.xs }}
        />
      )}
      <Text style={{
        fontSize: responsive.fontSize.sm,
        fontWeight: '600',
        color: isActive ? getColor.background.primary : getColor.gray[700],
        fontFamily: 'Nunito',
      }}>
        {label}
      </Text>
      {count !== undefined && (
        <Text style={{
          fontSize: responsive.fontSize.xs,
          fontWeight: '600',
          color: isActive ? getColor.primary[100] : getColor.gray[500],
          fontFamily: 'Nunito',
          marginLeft: responsive.spacing.xs,
        }}>
          ({count})
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{
      backgroundColor: 'transparent',
      paddingTop: responsive.spacing.md,
      paddingBottom: responsive.spacing.md,
    }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: responsive.spacing.md,
        }}
      >
        {/* Chip especial: Limpiar filtros */}
        {hasActiveFilters && (
          <TouchableOpacity
            style={{
              backgroundColor: getColor.secondary[500],
              borderRadius: 20,
              paddingHorizontal: responsive.spacing.md,
              paddingVertical: responsive.spacing.sm,
              marginRight: responsive.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => onFilterChange({
              campeonatoId: null,
              club: null,
              soloMedallistas: false,
              soloActivos: false,
            })}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="refresh" 
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
              Limpiar
            </Text>
          </TouchableOpacity>
        )}

        {/* ✅ FILTROS ESPECIALES - CONFIABLES */}
        <Chip
          label="🏆 Medallistas"
          icon="trophy"
          isActive={isFilterActive('soloMedallistas', true)}
          onPress={() => handleChipPress('soloMedallistas', true)}
        />

        <Chip
          label="⚡ Activos"
          icon="flash"
          isActive={isFilterActive('soloActivos', true)}
          onPress={() => handleChipPress('soloActivos', true)}
        />

        {/* ✅ CAMPEONATOS - DATOS ESTRUCTURADOS CONFIABLES */}
        {availableCampeonatos
          .sort((a, b) => b.count - a.count)
          .slice(0, 3) // Solo los 3 principales
          .map((campeonato) => (
            <Chip
              key={campeonato.id}
              label={campeonato.nombre.replace(' 2025', '').replace(' 2024', '')}
              count={campeonato.count}
              icon="calendar"
              isActive={isFilterActive('campeonatoId', campeonato.id)}
              onPress={() => handleChipPress('campeonatoId', campeonato.id)}
            />
          ))}

        {/* ✅ CLUBES/DELEGACIONES - DATOS ESTRUCTURADOS CONFIABLES */}
        {availableClubes
          .sort((a, b) => b.count - a.count)
          .slice(0, 3) // Solo los 3 principales
          .map((club) => (
            <Chip
              key={club.club}
              label={club.club.split(' ')[0]} // Solo primera palabra para espacio
              count={club.count}
              icon="flag"
              isActive={isFilterActive('club', club.club)}
              onPress={() => handleChipPress('club', club.club)}
            />
          ))}
      </ScrollView>
    </View>
  );
}