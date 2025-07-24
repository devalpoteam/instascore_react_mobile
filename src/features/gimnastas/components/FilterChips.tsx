// src/features/gimnastas/components/FilterChips.tsx - SEPARADO DEL BUSCADOR
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { FilterChipsProps } from '../types/gimnastasList.types';

export default function FilterChips({
  filters,
  onFilterChange,
  availableCampeonatos,
  availableCategorias,
  availableClubes,
}: FilterChipsProps) {
  const responsive = useResponsive();

  const handleChipPress = (filterType: string, value: string | boolean | null) => {
    // Si es el mismo filtro, lo removemos (toggle off)
    if (
      (filterType === 'campeonatoId' && filters.campeonatoId === value) ||
      (filterType === 'categoria' && filters.categoria === value) ||
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

  const isFilterActive = (filterType: string, value: string | boolean): boolean => {
    switch (filterType) {
      case 'campeonatoId':
        return filters.campeonatoId === value;
      case 'categoria':
        return filters.categoria === value;
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
    filters.categoria || 
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
      backgroundColor: 'transparent', // ✅ TRANSPARENTE para mostrar el fondo de la app
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
              categoria: null,
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

        {/* Filtros especiales */}
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

        {/* Categorías */}
        {availableCategorias.map((cat) => (
          <Chip
            key={cat.categoria}
            label={cat.categoria}
            count={cat.count}
            isActive={isFilterActive('categoria', cat.categoria)}
            onPress={() => handleChipPress('categoria', cat.categoria)}
          />
        ))}

        {/* Campeonatos principales (solo los 3 más grandes) */}
        {availableCampeonatos
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((campeonato) => (
            <Chip
              key={campeonato.id}
              label={campeonato.nombre.replace(' 2025', '').replace(' 2024', '')} // Nombre corto
              count={campeonato.count}
              icon="calendar"
              isActive={isFilterActive('campeonatoId', campeonato.id)}
              onPress={() => handleChipPress('campeonatoId', campeonato.id)}
            />
          ))}

        {/* Clubes principales (solo los 3 más grandes) */}
        {availableClubes
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((club) => (
            <Chip
              key={club.club}
              label={club.club.split(' ')[0]} // Solo primera palabra
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