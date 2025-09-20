// src/features/home/components/CampeonatoSelectorModal.tsx - CON COLOR HELPER CORREGIDO
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper'; // ✅ AHORA FUNCIONA
import { useResponsive } from '@/shared/hooks/useResponsive';

interface Campeonato {
  id: string;
  nombre: string;
  activo: boolean;
  fecha: string;
  ubicacion?: string;
}

interface CampeonatoSelectorModalProps {
  visible: boolean;
  campeonatos: Campeonato[];
  selectedCampeonato: Campeonato | null;
  onSelect: (campeonato: Campeonato) => void;
  onClose: () => void;
}

export default function CampeonatoSelectorModal({
  visible,
  campeonatos,
  selectedCampeonato,
  onSelect,
  onClose,
}: CampeonatoSelectorModalProps) {
  const responsive = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'todos' | 'activos' | 'finalizados'>('todos');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Lógica de filtrado robusta
  const getFilteredCampeonatos = () => {
    let filtered = campeonatos;
    
    // Aplicar filtro de búsqueda
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(campeonato => 
        campeonato.nombre.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    
    // Aplicar filtro de estado
    if (filterActive === 'activos') {
      filtered = filtered.filter(campeonato => campeonato.activo === true);
    } else if (filterActive === 'finalizados') {
      filtered = filtered.filter(campeonato => campeonato.activo === false);
    }
    
    return filtered;
  };

  const filteredCampeonatos = getFilteredCampeonatos();
  const activosCount = campeonatos.filter(c => c.activo === true).length;
  const finalizadosCount = campeonatos.filter(c => c.activo === false).length;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible]);

  const handleSelect = (campeonato: Campeonato) => {
    onSelect(campeonato);
    onClose();
    setSearchQuery('');
    setFilterActive('todos');
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setFilterActive('todos');
  };

  const renderFilterButton = (filter: typeof filterActive, label: string, count: number) => {
    const isActive = filterActive === filter;
    return (
      <TouchableOpacity
        key={filter}
        style={{
          paddingHorizontal: responsive.spacing.md,
          paddingVertical: responsive.spacing.sm,
          borderRadius: 20,
          backgroundColor: isActive ? getColor.primary[500] : getColor.gray[100], // ✅ FUNCIONA
          marginRight: responsive.spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => setFilterActive(filter)}
        activeOpacity={0.7}
      >
        <Text style={{
          fontSize: responsive.fontSize.sm,
          fontWeight: isActive ? '600' : '400',
          color: isActive ? getColor.background.primary : getColor.gray[600], // ✅ FUNCIONA
          fontFamily: 'Nunito',
        }}>
          {label}
        </Text>
        <View style={{
          backgroundColor: isActive ? getColor.background.primary : getColor.gray[400], // ✅ FUNCIONA
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
          marginLeft: 6,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.xs,
            fontWeight: '600',
            color: isActive ? getColor.primary[500] : getColor.background.primary, // ✅ FUNCIONA
            fontFamily: 'Nunito',
          }}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCampeonato = ({ item, index }: { item: Campeonato; index: number }) => {
    const isSelected = selectedCampeonato?.id === item.id;
    
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: responsive.spacing.md,
          paddingHorizontal: responsive.spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: getColor.gray[100], // ✅ FUNCIONA
          backgroundColor: isSelected ? getColor.primary[50] : getColor.background.primary, // ✅ AHORA EXISTE primary[50]
          ...(isSelected && {
            borderLeftWidth: 4,
            borderLeftColor: getColor.primary[500], // ✅ FUNCIONA
          }),
        }}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        {/* Indicador de estado */}
        <View style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: item.activo ? getColor.success[500] : getColor.gray[400], // ✅ FUNCIONA
          marginRight: responsive.spacing.md,
          ...(item.activo && {
            shadowColor: getColor.success[500], // ✅ FUNCIONA
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
          }),
        }} />
        
        {/* Información del campeonato */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: isSelected ? '600' : '500',
            color: isSelected ? getColor.primary[600] : getColor.gray[800], // ✅ AHORA EXISTE primary[600]
            fontFamily: 'Nunito',
          }}>
            {item.nombre}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
          }}>
            <View style={{
              backgroundColor: item.activo ? getColor.success[100] : getColor.gray[100], // ✅ FUNCIONA
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
              marginRight: 8,
            }}>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                fontWeight: '600',
                color: item.activo ? getColor.success[700] : getColor.gray[600], // ✅ AHORA EXISTE success[700]
                fontFamily: 'Nunito',
              }}>
                {item.activo ? 'EN CURSO' : 'FINALIZADO'}
              </Text>
            </View>
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[500], // ✅ FUNCIONA
              fontFamily: 'Nunito',
            }}>
              {item.fecha}
            </Text>
          </View>
        </View>
        
        {/* Checkmark si está seleccionado */}
        {isSelected && (
          <View style={{
            backgroundColor: getColor.primary[500], // ✅ FUNCIONA
            borderRadius: 12,
            padding: 4,
          }}>
            <Ionicons 
              name="checkmark" 
              size={16} 
              color={getColor.background.primary} // ✅ FUNCIONA
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: responsive.spacing['3xl'],
    }}>
      <View style={{
        backgroundColor: getColor.gray[100], // ✅ FUNCIONA
        borderRadius: 40,
        padding: 20,
        marginBottom: responsive.spacing.lg,
      }}>
        <Ionicons name="search" size={40} color={getColor.gray[400]} />
      </View>
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.gray[600], // ✅ FUNCIONA
        fontFamily: 'Nunito',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        No se encontraron campeonatos
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.base,
        color: getColor.gray[400], // ✅ FUNCIONA
        fontFamily: 'Nunito',
        textAlign: 'center',
        lineHeight: 22,
      }}>
        Prueba cambiando los filtros o{'\n'}términos de búsqueda
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={handleClose}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={getColor.background.primary} // ✅ FUNCIONA
        translucent={false}
      />
      
      <View style={{
        flex: 1,
        backgroundColor: getColor.background.primary, // ✅ FUNCIONA
      }}>
        {/* Header */}
        <View style={{
          paddingTop: Platform.OS === 'ios' ? 20 : 16, // ✅ PUNTO MEDIO: Más que antes pero menos que original
          paddingHorizontal: responsive.spacing.lg,
          paddingBottom: responsive.spacing.md,
          backgroundColor: getColor.background.primary, // ✅ FUNCIONA
          borderBottomWidth: 1,
          borderBottomColor: getColor.gray[100], // ✅ FUNCIONA
          ...Platform.select({
            ios: {
              shadowColor: getColor.gray[500], // ✅ FUNCIONA
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }),
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: responsive.spacing.md,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: responsive.fontSize.xl,
                fontWeight: '700',
                color: getColor.gray[900], // ✅ FUNCIONA
                fontFamily: 'Montserrat',
              }}>
                Campeonatos
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.sm,
                color: getColor.gray[500], // ✅ FUNCIONA
                fontFamily: 'Nunito',
                marginTop: 2,
              }}>
                {campeonatos.length} total • {activosCount} activos
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: getColor.gray[100], // ✅ FUNCIONA
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={getColor.gray[600]} />
            </TouchableOpacity>
          </View>
          
          {/* Barra de búsqueda */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: getColor.gray[50], // ✅ FUNCIONA
            borderRadius: 16,
            paddingHorizontal: responsive.spacing.md,
            height: 48,
            marginBottom: responsive.spacing.md,
            borderWidth: 1,
            borderColor: searchQuery ? getColor.primary[500] : 'transparent', // ✅ FUNCIONA
          }}>
            <Ionicons name="search" size={20} color={getColor.gray[400]} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: responsive.spacing.sm,
                fontSize: responsive.fontSize.base,
                fontFamily: 'Nunito',
                color: getColor.gray[900], // ✅ FUNCIONA
              }}
              placeholder="Buscar por nombre..."
              placeholderTextColor={getColor.gray[400]} // ✅ FUNCIONA
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={{ padding: 4 }}
              >
                <Ionicons name="close-circle" size={20} color={getColor.gray[400]} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Filtros */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: responsive.isIOS ? -8 : 0,
            justifyContent: 'flex-start',
          }}>
            {renderFilterButton('todos', 'Todos', campeonatos.length)}
            {renderFilterButton('activos', 'Activos', activosCount)}
            {renderFilterButton('finalizados', 'Finalizados', finalizadosCount)}
          </View>
        </View>
        
        {/* Lista */}
        <FlatList
          data={filteredCampeonatos}
          keyExtractor={(item) => item.id}
          renderItem={renderCampeonato}
          style={{ 
            flex: 1,
            backgroundColor: getColor.background.primary, // ✅ FUNCIONA
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: getColor.background.primary, // ✅ FUNCIONA
          }}
        />
      </View>
    </Modal>
  );
}