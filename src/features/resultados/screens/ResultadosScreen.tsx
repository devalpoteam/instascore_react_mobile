// src/features/resultados/screens/ResultadosScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import LiveCampeonatoCard from '../components/LiveCampeonatoCard';

import { liveService } from '@/services/api/live/liveServices';

// Types
interface CampeonatoEnVivo {
  id: string;
  nombre: string;
  lugar: string;
  horaInicio: string;
  categoriasActivas: any[];
  totalCategorias: number;
  categoriasFinalizadas: number;
  participantesTotales: number;
}

// Navigation types
type MainNavigatorParamList = {
  Home: undefined;
  Campeonatos: undefined;
  CampeonatoDetail: { campeonatoId: string };
  Resultados: { campeonatoId?: string };
  CategorySelector: { campeonatoId: string };
  LiveResults: { campeonatoId: string; categoriaId: string };
  Gimnastas: undefined;
  Ajustes: undefined;
};

type ResultadosScreenNavigationProp = NavigationProp<MainNavigatorParamList>;

interface ResultadosScreenState {
  campeonatosEnVivo: CampeonatoEnVivo[];
  filteredCampeonatos: CampeonatoEnVivo[];
  searchTerm: string;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export default function ResultadosScreen() {
  const navigation = useNavigation<ResultadosScreenNavigationProp>();
  const responsive = useResponsive();

  const [state, setState] = useState<ResultadosScreenState>({
    campeonatosEnVivo: [],
    filteredCampeonatos: [],
    searchTerm: '',
    isLoading: true,
    isRefreshing: false,
    error: null,
  });

  useEffect(() => {
    loadCampeonatosEnVivo();
  }, []);

  useEffect(() => {
    filterCampeonatos();
  }, [state.searchTerm, state.campeonatosEnVivo]);

  const loadCampeonatosEnVivo = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const campeonatos = await liveService.getCampeonatosActivos();
      
      setState(prev => ({
        ...prev,
        campeonatosEnVivo: campeonatos,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error loading campeonatos en vivo:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Error al cargar los campeonatos en vivo',
        isLoading: false,
      }));
    }
  };

  const filterCampeonatos = () => {
    const { campeonatosEnVivo, searchTerm } = state;
    
    if (!searchTerm.trim()) {
      setState(prev => ({ ...prev, filteredCampeonatos: campeonatosEnVivo }));
      return;
    }

    const filtered = campeonatosEnVivo.filter(campeonato => {
      const searchLower = searchTerm.toLowerCase();
      
      const matchesCampeonato = campeonato.nombre.toLowerCase().includes(searchLower);
      const matchesLugar = campeonato.lugar.toLowerCase().includes(searchLower);
      
      return matchesCampeonato || matchesLugar;
    });

    setState(prev => ({ ...prev, filteredCampeonatos: filtered }));
  };

  const handleRefresh = async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadCampeonatosEnVivo();
    setState(prev => ({ ...prev, isRefreshing: false }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));
  };

  const clearSearch = () => {
    setState(prev => ({ ...prev, searchTerm: '' }));
  };

  const handleCampeonatoPress = (campeonato: CampeonatoEnVivo) => {
    console.log('Navegar a detalle de campeonato desde En Vivo:', campeonato.nombre);
    navigation.navigate('CampeonatoDetail', { campeonatoId: campeonato.id });
  };

  const handleViewLive = (campeonato: CampeonatoEnVivo) => {
    console.log('Ver resultados EN VIVO de:', campeonato.nombre);
    navigation.navigate('CategorySelector', { 
      campeonatoId: campeonato.id 
    });
  };

  const renderLiveCampeonatoCard = ({ item }: { item: CampeonatoEnVivo }) => (
    <LiveCampeonatoCard
      campeonato={item}
      onPress={handleCampeonatoPress}
      onViewLive={handleViewLive}
    />
  );

  const renderEmptyState = () => {
    const hasSearchTerm = state.searchTerm.trim().length > 0;
    
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsive.spacing.xl,
      }}>
        <Ionicons 
          name={hasSearchTerm ? "search-outline" : "radio-outline"} 
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
          {hasSearchTerm ? 'No se encontraron resultados' : 'No hay campeonatos en vivo'}
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[500],
          fontFamily: 'Nunito',
          textAlign: 'center',
          lineHeight: responsive.fontSize.base * 1.4,
        }}>
          {hasSearchTerm 
            ? `No encontramos campeonatos que coincidan con "${state.searchTerm}"`
            : 'Los campeonatos activos aparecerán aquí para seguimiento en tiempo real'
          }
        </Text>
      </View>
    );
  };

  const renderLoadingState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: responsive.spacing.xl,
    }}>
      <Ionicons 
        name="radio" 
        size={48} 
        color={getColor.secondary[500]} 
        style={{ marginBottom: responsive.spacing.md }}
      />
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.secondary[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
      }}>
        Buscando campeonatos en vivo...
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: responsive.spacing.xl,
    }}>
      <Ionicons 
        name="alert-circle-outline" 
        size={64} 
        color={getColor.error[500]} 
        style={{ marginBottom: responsive.spacing.md }}
      />
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.error[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        {state.error}
      </Text>
      <TouchableOpacity
        onPress={loadCampeonatosEnVivo}
        style={{
          backgroundColor: getColor.primary[500],
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: responsive.spacing.md,
        }}
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

  const renderSearchBar = () => (
    <View
      style={{
        backgroundColor: getColor.background.primary,
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: getColor.gray[200],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: getColor.gray[100],
          borderRadius: 12,
          paddingHorizontal: responsive.spacing.md,
          borderWidth: 1,
          borderColor: state.searchTerm
            ? getColor.secondary[300]
            : getColor.gray[200],
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={
            state.searchTerm ? getColor.secondary[500] : getColor.gray[400]
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
          value={state.searchTerm}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {state.searchTerm ? (
          <TouchableOpacity
            onPress={clearSearch}
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
    </View>
  );

  if (state.isLoading && !state.isRefreshing) {
    return (
      <BaseLayout>
        <Header 
          title="En Vivo"
          subtitle="Resultados en tiempo real"
          showLogo={false}
        />
        {renderLoadingState()}
      </BaseLayout>
    );
  }

  if (state.error && !state.isRefreshing) {
    return (
      <BaseLayout>
        <Header 
          title="En Vivo"
          subtitle="Error al cargar"
          showLogo={false}
        />
        {renderErrorState()}
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        title="En Vivo"
        subtitle={`${state.filteredCampeonatos.length} campeonatos activos`}
        showLogo={false}
      />
      
      {renderSearchBar()}

      <FlatList
        data={state.filteredCampeonatos}
        renderItem={renderLiveCampeonatoCard}
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
            tintColor={getColor.secondary[500]}
            colors={[getColor.secondary[500]]}
            progressBackgroundColor={getColor.background.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={8}
        initialNumToRender={3}
      />
    </BaseLayout>
  );
}