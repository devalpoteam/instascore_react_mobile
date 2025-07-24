// src/features/gimnastas/screens/GimnastasListScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import SmartSearchBar from '../components/SmartSearchBar';
import SmartFilterChips, { SmartFilters } from '../components/SmartFilterChips';
import GimnastaCard from '../components/GimnastaCard';
import { fuzzySearch, extractSmartFilters } from '../utils/enhancedSearch';

// Data y types
import { 
  mockGimnastasList, 
  disponibleParaFiltros
} from '../data/mockGimnastasList';
import { GimnastaListItem } from '../types/gimnastasList.types';
import { MainStackParamList } from '@/navigation/MainNavigator';

type GimnastasListNavigationProp = NavigationProp<MainStackParamList>;

// ✅ ESTADO SIMPLIFICADO PARA FILTROS HÍBRIDOS
interface SmartGimnastasState {
  gimnastas: GimnastaListItem[];
  filteredGimnastas: GimnastaListItem[];
  searchTerm: string;
  filters: SmartFilters;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
}

export default function GimnastasListScreen() {
  const navigation = useNavigation<GimnastasListNavigationProp>();
  const responsive = useResponsive();

  // ✅ ESTADO MEJORADO
  const [state, setState] = useState<SmartGimnastasState>({
    gimnastas: mockGimnastasList,
    filteredGimnastas: mockGimnastasList.slice(0, 25),
    searchTerm: '',
    filters: {
      soloMedallistas: false,
      soloActivos: false,
      campeonatoId: null,
      club: null,
    },
    isLoading: false,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    totalCount: mockGimnastasList.length,
  });

  // Debounce para búsqueda
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // ✅ FUNCIÓN DE BÚSQUEDA INTELIGENTE
  const performSmartSearch = useMemo(() => {
    return (searchTerm: string, filters: SmartFilters) => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      setTimeout(() => {
        // Extraer filtros inteligentes del texto de búsqueda
        const smartFilters = extractSmartFilters(searchTerm);
        
        // Combinar filtros extraídos con filtros manuales
        const combinedFilters = {
          ...filters,
          soloMedallistas: filters.soloMedallistas || smartFilters.soloMedallistas,
          soloActivos: filters.soloActivos || smartFilters.soloActivos,
        };
        
        // Usar el término de búsqueda limpio (sin palabras clave de filtros)
        const cleanSearchTerm = smartFilters.extractedSearchTerm;
        
        // Aplicar búsqueda fuzzy
        let resultados = fuzzySearch(mockGimnastasList, cleanSearchTerm, 0.2);
        
        // Aplicar filtros adicionales
        if (combinedFilters.soloMedallistas) {
          resultados = resultados.filter(g => g.esMedallista);
        }
        
        if (combinedFilters.soloActivos) {
          resultados = resultados.filter(g => g.activo);
        }
        
        if (combinedFilters.campeonatoId) {
          resultados = resultados.filter(g => 
            g.historialCampeonatos.includes(combinedFilters.campeonatoId!)
          );
        }
        
        if (combinedFilters.club) {
          resultados = resultados.filter(g => g.club === combinedFilters.club);
        }
        
        if (smartFilters.soloMedallistas || smartFilters.soloActivos) {
          setState(prev => ({
            ...prev,
            filters: {
              ...prev.filters,
              soloMedallistas: prev.filters.soloMedallistas || smartFilters.soloMedallistas,
              soloActivos: prev.filters.soloActivos || smartFilters.soloActivos,
            },
            filteredGimnastas: resultados.slice(0, 25),
            totalCount: resultados.length,
            hasMore: resultados.length > 25,
            currentPage: 1,
            isLoading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            filteredGimnastas: resultados.slice(0, 25),
            totalCount: resultados.length,
            hasMore: resultados.length > 25,
            currentPage: 1,
            isLoading: false,
          }));
        }
      }, 300);
    };
  }, []);

  const handleSearchChange = (searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));

    // Debounce la búsqueda
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      performSmartSearch(searchTerm, state.filters);
    }, 300);

    setSearchDebounceTimer(timer);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    performSmartSearch(suggestion, state.filters);
  };

  const handleFilterChange = (filterUpdates: Partial<SmartFilters>) => {
    const newFilters = { ...state.filters, ...filterUpdates };
    setState(prev => ({ ...prev, filters: newFilters }));
    performSmartSearch(state.searchTerm, newFilters);
  };

  const loadMore = () => {
    if (state.isLoadingMore || !state.hasMore) return;

    setState(prev => ({ ...prev, isLoadingMore: true }));

    setTimeout(() => {
      const smartFilters = extractSmartFilters(state.searchTerm);
      const combinedFilters = {
        ...state.filters,
        soloMedallistas: state.filters.soloMedallistas || smartFilters.soloMedallistas,
        soloActivos: state.filters.soloActivos || smartFilters.soloActivos,
      };
      
      let allResults = fuzzySearch(mockGimnastasList, smartFilters.extractedSearchTerm, 0.2);
      
      // Aplicar filtros
      if (combinedFilters.soloMedallistas) {
        allResults = allResults.filter(g => g.esMedallista);
      }
      if (combinedFilters.soloActivos) {
        allResults = allResults.filter(g => g.activo);
      }
      if (combinedFilters.campeonatoId) {
        allResults = allResults.filter(g => 
          g.historialCampeonatos.includes(combinedFilters.campeonatoId!)
        );
      }
      if (combinedFilters.club) {
        allResults = allResults.filter(g => g.club === combinedFilters.club);
      }
      
      const nextPage = state.currentPage + 1;
      const startIndex = (nextPage - 1) * 25;
      const endIndex = startIndex + 25;
      const newResults = allResults.slice(startIndex, endIndex);

      setState(prev => ({
        ...prev,
        filteredGimnastas: [...prev.filteredGimnastas, ...newResults],
        currentPage: nextPage,
        hasMore: endIndex < allResults.length,
        isLoadingMore: false,
      }));
    }, 500);
  };

  const handleGimnastaPress = (gimnasta: GimnastaListItem) => {
    navigation.navigate('GimnastaProfile', { gimnastaId: gimnasta.id });
  };

  // Renderizar empty state mejorado
  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsive.spacing['3xl'],
    }}>
      <Ionicons 
        name="search-outline" 
        size={64} 
        color={getColor.gray[400]} 
        style={{ marginBottom: responsive.spacing.lg }}
      />
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        {state.searchTerm 
          ? 'No se encontraron gimnastas'
          : 'No hay gimnastas disponibles'
        }
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.base,
        color: getColor.gray[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
        lineHeight: responsive.fontSize.base * 1.4,
        marginBottom: responsive.spacing.md,
      }}>
        {state.searchTerm
          ? 'Intenta con otro término o ajusta los filtros'
          : 'Los gimnastas aparecerán aquí cuando estén disponibles'
        }
      </Text>
      
      {/* ✅ SUGERENCIAS DE BÚSQUEDA EN EMPTY STATE */}
      {!state.searchTerm && (
        <View style={{
          backgroundColor: getColor.primary[50],
          borderRadius: 12,
          padding: responsive.spacing.md,
          marginHorizontal: responsive.spacing.lg,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            fontWeight: '600',
            marginBottom: responsive.spacing.xs,
            textAlign: 'center',
          }}>
            💡 Prueba buscar:
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.primary[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
            lineHeight: responsive.fontSize.sm * 1.4,
          }}>
            "amanda", "medallistas", "copa 2024", "club valparaíso"
          </Text>
        </View>
      )}
    </View>
  );

  // Renderizar loading state
  const renderLoadingState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsive.spacing['3xl'],
    }}>
      <ActivityIndicator size="large" color={getColor.primary[500]} />
      <Text style={{
        fontSize: responsive.fontSize.base,
        color: getColor.primary[500],
        fontFamily: 'Nunito',
        marginTop: responsive.spacing.md,
      }}>
        Buscando gimnastas...
      </Text>
    </View>
  );

  // Renderizar footer de carga
  const renderFooter = () => {
    if (!state.isLoadingMore) return null;
    
    return (
      <View style={{
        paddingVertical: responsive.spacing.lg,
        alignItems: 'center',
      }}>
        <ActivityIndicator size="small" color={getColor.primary[500]} />
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.gray[500],
          fontFamily: 'Nunito',
          marginTop: responsive.spacing.xs,
        }}>
          Cargando más gimnastas...
        </Text>
      </View>
    );
  };

  // ✅ CONTADOR DE RESULTADOS
  const renderResultsCounter = () => {
    if (state.isLoading && !state.filteredGimnastas.length) return null;

    const hasActiveFilters = 
      state.searchTerm ||
      state.filters.campeonatoId ||
      state.filters.club ||
      state.filters.soloMedallistas ||
      state.filters.soloActivos;

    const searchInfo = state.searchTerm ? ` para "${state.searchTerm}"` : '';

    return (
      <View style={{
        marginHorizontal: responsive.spacing.md,
        marginBottom: responsive.spacing.md,
        marginTop: 2,
      }}>
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
        }}>
          {hasActiveFilters
            ? `${state.totalCount} gimnasta${state.totalCount !== 1 ? 's' : ''} encontrado${state.totalCount !== 1 ? 's' : ''}${searchInfo}`
            : `${state.totalCount} gimnastas registrados`
          }
        </Text>
      </View>
    );
  };

  return (
    <BaseLayout>
      <Header 
        title="Gimnastas"
        subtitle={`${state.totalCount} participantes`}
        showBack={false}
        showLogo={false}
      />

      {/* ✅ BÚSQUEDA INTELIGENTE */}
      <SmartSearchBar
        value={state.searchTerm}
        onChangeText={handleSearchChange}
        onSuggestionSelect={handleSuggestionSelect}
        gimnastas={mockGimnastasList}
        placeholder="Buscar gimnasta, club, categoría o campeonato..."
        isLoading={state.isLoading}
      />

      {/* ✅ FILTROS HÍBRIDOS SIMPLIFICADOS */}
      <SmartFilterChips
        filters={state.filters}
        onFilterChange={handleFilterChange}
        availableCampeonatos={disponibleParaFiltros.campeonatos}
        availableClubes={disponibleParaFiltros.clubes}
      />

      {/* Contador de resultados */}
      {renderResultsCounter()}

      {/* Lista de gimnastas */}
      {state.isLoading && !state.filteredGimnastas.length ? (
        renderLoadingState()
      ) : state.filteredGimnastas.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={state.filteredGimnastas}
          renderItem={({ item }) => (
            <GimnastaCard
              gimnasta={item}
              onPress={handleGimnastaPress}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: responsive.spacing['3xl'],
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({
            length: 85,
            offset: 85 * index,
            index,
          })}
        />
      )}
    </BaseLayout>
  );
}