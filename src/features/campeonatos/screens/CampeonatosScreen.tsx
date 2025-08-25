// src/features/campeonatos/screens/CampeonatosScreen.tsx 
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  RefreshControl, 
  Alert,
  Text
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

import CampeonatoCard from '../components/CampeonatoCard';
import CampeonatosFilters from '../components/CampeonatosFilters';

import { 
  Campeonato, 
  CampeonatoFilters, 
  CampeonatosScreenState 
} from '../types/campeonatos.types';
import { campeonatosService } from '@/services/api/campeonatos/campeonatosService';

import { MainStackParamList } from '@/navigation/MainNavigator';

type CampeonatosScreenNavigationProp = NavigationProp<MainStackParamList>;

export default function CampeonatosScreen() {
  const navigation = useNavigation<CampeonatosScreenNavigationProp>();
  const responsive = useResponsive();

  const [state, setState] = useState<CampeonatosScreenState>({
    campeonatos: [],
    filteredCampeonatos: [],
    filters: {
      searchTerm: '',
      estado: 'todos',
      sortBy: 'fecha',
      sortOrder: 'desc',
      soloActivos: false,
      conTransmision: false,
      soloProximos: false
    },
    isLoading: true,
    isRefreshing: false,
    error: null,
    availableRegions: [],
    availableCities: [],
    availableTypes: [],
  });

  useEffect(() => {
    loadCampeonatos();
  }, []);

  const filteredCampeonatos = useMemo(() => {
    let filtered = [...state.campeonatos];

    if (state.filters.searchTerm) {
      filtered = filtered.filter(campeonato =>
        campeonato.nombre.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
        campeonato.lugar.toLowerCase().includes(state.filters.searchTerm.toLowerCase())
      );
    }

    if (state.filters.estado !== 'todos') {
      filtered = filtered.filter(campeonato => campeonato.estado === state.filters.estado);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (state.filters.sortBy) {
        case 'fecha':
          comparison = new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
          break;
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'estado':
          const estadoOrder = { 'activo': 0, 'configuracion': 1, 'finalizado': 2 };
          comparison = estadoOrder[a.estado] - estadoOrder[b.estado];
          break;
      }

      return state.filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.campeonatos, state.filters]);

  const loadCampeonatos = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const campeonatos = await campeonatosService.getCampeonatos();
      
      setState(prev => ({
        ...prev,
        campeonatos,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error loading campeonatos:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Error al cargar los campeonatos',
        isLoading: false,
      }));
      
      Alert.alert(
        'Error',
        'No se pudieron cargar los campeonatos. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRefresh = async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadCampeonatos();
    setState(prev => ({ ...prev, isRefreshing: false }));
  };

  const handleFiltersChange = (newFilters: CampeonatoFilters) => {
    setState(prev => ({
      ...prev,
      filters: newFilters,
    }));
  };

  const handleCampeonatoPress = (campeonato: Campeonato) => {
    console.log('Navegar a detalle de campeonato:', campeonato.nombre);
    navigation.navigate('CampeonatoDetail', { campeonatoId: campeonato.id });
  };

  const handleViewResults = (campeonato: Campeonato) => {
    console.log('Ver resultados de campeonato:', campeonato.nombre, 'Estado:', campeonato.estado);
    
    const isFinished = campeonato.estado === 'finalizado';
    const accionTexto = isFinished ? 'resultados finales' : 'resultados en vivo';
    console.log(`Navegar a ${accionTexto} del campeonato:`, campeonato.nombre);
    
    navigation.navigate('CategorySelector', { 
      campeonatoId: campeonato.id,
      isFinished: isFinished
    });
  };

  const renderCampeonatoCard = ({ item }: { item: Campeonato }) => (
    <CampeonatoCard
      campeonato={item}
      onPress={handleCampeonatoPress}
      onViewResults={handleViewResults}
    />
  );

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: responsive.spacing.xl,
    }}>
      <Ionicons 
        name="trophy-outline" 
        size={64} 
        color={getColor.gray[400]} 
        style={{ marginBottom: responsive.spacing.md }}
      />
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        {state.filters.searchTerm || state.filters.estado !== 'todos'
          ? 'No se encontraron campeonatos'
          : 'No hay campeonatos disponibles'
        }
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.base,
        color: getColor.gray[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
        lineHeight: responsive.fontSize.base * 1.4,
      }}>
        {state.filters.searchTerm || state.filters.estado !== 'todos'
          ? 'Intenta ajustar los filtros de búsqueda'
          : 'Los campeonatos aparecerán aquí cuando estén disponibles'
        }
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: responsive.spacing.xl,
    }}>
      <Ionicons 
        name="refresh-outline" 
        size={48} 
        color={getColor.primary[500]} 
        style={{ marginBottom: responsive.spacing.md }}
      />
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.primary[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
      }}>
        Cargando campeonatos...
      </Text>
    </View>
  );

  if (state.isLoading && !state.isRefreshing) {
    return (
      <BaseLayout>
        <Header 
          title="Campeonatos"
          subtitle="Lista de competencias"
          showLogo={false}
        />
        {renderLoadingState()}
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title="Campeonatos"
        subtitle={`${filteredCampeonatos.length} competencias`}
        showLogo={false}
      />
      
      <CampeonatosFilters
        filters={state.filters}
        onFiltersChange={handleFiltersChange}
        totalCount={filteredCampeonatos.length}
      />

      <FlatList
        data={filteredCampeonatos}
        renderItem={renderCampeonatoCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: responsive.spacing.sm,
          paddingBottom: responsive.spacing.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={handleRefresh}
            tintColor={getColor.primary[500]}
            colors={[getColor.primary[500]]}
            progressBackgroundColor={getColor.background.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
      />
    </BaseLayout>
  );
}