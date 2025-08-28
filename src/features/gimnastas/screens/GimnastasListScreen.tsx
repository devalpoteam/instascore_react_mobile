// src/features/gimnastas/screens/GimnastasListScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import SmartSearchBar from '../components/SmartSearchBar';
import GimnastaCard from '../components/GimnastaCard';
import { fuzzySearch } from '../utils/enhancedSearch';

import { gimnastasService, type GimnastaListItem } from '@/services/api/gimnastas/gimnastasService';
import { MainStackParamList } from '@/navigation/MainNavigator';

type GimnastasListNavigationProp = NavigationProp<MainStackParamList>;

interface GimnastasState {
  gimnastas: GimnastaListItem[];
  filteredGimnastas: GimnastaListItem[];
  searchTerm: string;
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

  const [state, setState] = useState<GimnastasState>({
    gimnastas: [],
    filteredGimnastas: [],
    searchTerm: '',
    isLoading: true,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    totalCount: 0,
  });

  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadGimnastas();
  }, []);

  const loadGimnastas = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const gimnastasFromService = await gimnastasService.getTodosGimnastas();
      
      setState(prev => ({
        ...prev,
        gimnastas: gimnastasFromService,
        filteredGimnastas: gimnastasFromService.slice(0, 25),
        totalCount: gimnastasFromService.length,
        hasMore: gimnastasFromService.length > 25,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al cargar gimnastas',
        gimnastas: [],
        filteredGimnastas: [],
        totalCount: 0,
        hasMore: false,
      }));
    }
  };

  const performSearch = useMemo(() => {
    return (searchTerm: string) => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      setTimeout(() => {
        let resultados = fuzzySearch(state.gimnastas, searchTerm, 0.2);
        
        setState(prev => ({
          ...prev,
          filteredGimnastas: resultados.slice(0, 25),
          totalCount: resultados.length,
          hasMore: resultados.length > 25,
          currentPage: 1,
          isLoading: false,
        }));
      }, 300);
    };
  }, [state.gimnastas]);

  const handleSearchChange = (searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    setSearchDebounceTimer(timer);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    performSearch(suggestion);
  };

  const loadMore = () => {
    if (state.isLoadingMore || !state.hasMore) return;

    setState(prev => ({ ...prev, isLoadingMore: true }));

    setTimeout(() => {
      let allResults = fuzzySearch(state.gimnastas, state.searchTerm, 0.2);
      
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

  const handleRetry = () => {
    loadGimnastas();
  };

  const renderErrorState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsive.spacing['3xl'],
    }}>
      <Ionicons 
        name="alert-circle" 
        size={64} 
        color={getColor.error[500]} 
        style={{ marginBottom: responsive.spacing.lg }}
      />
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.error[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        Error al cargar gimnastas
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.base,
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        textAlign: 'center',
        lineHeight: responsive.fontSize.base * 1.4,
        marginBottom: responsive.spacing.md,
      }}>
        {state.error}
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: getColor.primary[500],
          paddingHorizontal: responsive.spacing.lg,
          paddingVertical: responsive.spacing.sm,
          borderRadius: 8,
        }}
        onPress={handleRetry}
        activeOpacity={0.7}
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
  );

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
          ? 'Intenta con otro término de búsqueda'
          : 'Los gimnastas aparecerán aquí cuando estén disponibles'
        }
      </Text>
      
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
            Prueba buscar:
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.primary[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
            lineHeight: responsive.fontSize.sm * 1.4,
          }}>
            "Julieta", "USAG", "Delegacion de Matias"
          </Text>
        </View>
      )}
    </View>
  );

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
        Cargando gimnastas...
      </Text>
    </View>
  );

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

  return (
    <BaseLayout>
      <Header 
        title="Gimnastas"
        subtitle={`${state.totalCount} participantes`}
        showBack={false}
        showLogo={false}
      />

      <SmartSearchBar
        value={state.searchTerm}
        onChangeText={handleSearchChange}
        onSuggestionSelect={handleSuggestionSelect}
        gimnastas={state.gimnastas}
        placeholder="Buscar gimnasta, club, categoría o campeonato..."
        isLoading={false}
      />

      {state.error ? (
        renderErrorState()
      ) : state.isLoading && !state.filteredGimnastas.length ? (
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
            paddingTop: responsive.spacing.sm,
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