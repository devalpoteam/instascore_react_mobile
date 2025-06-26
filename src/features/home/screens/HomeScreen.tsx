// src/features/home/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

// Mock data - será reemplazado por APIs
const mockCampeonatos = [
  { id: '1', nombre: 'Copa Valparaíso 2024', activo: true },
  { id: '2', nombre: 'Gimnasia Artística Valparaíso', activo: false },
];

const mockStats = {
  categorias: 7,
  delegaciones: 6,
  participantes: 161,
};

export default function HomeScreen() {
  const responsive = useResponsive();
  const [selectedCampeonato, setSelectedCampeonato] = useState(mockCampeonatos[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCampeonatoSelect = (campeonato: typeof mockCampeonatos[0]) => {
    setSelectedCampeonato(campeonato);
    setShowStats(true);
  };

  const handleNotificationPress = () => {
    console.log('🔔 Notifications pressed');
    // Aquí se implementará la lógica de notificaciones
  };

  // Calcular padding bottom dinámico para el ScrollView
  const getScrollViewPaddingBottom = () => {
    if (responsive.isTablet) return 40;
    if (responsive.isIOS) return responsive.insets.bottom > 0 ? 25 : 20;
    return 20;
  };

  return (
    <BaseLayout>
      {/* Header con logo - SIN SUBTÍTULO */}
      <Header 
        showLogo={true}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: responsive.spacing.md,
          paddingBottom: getScrollViewPaddingBottom(), // Espaciado dinámico para BottomNav
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={getColor.primary[500]}
            colors={[getColor.primary[500]]}
          />
        }
      >
        
        {/* SELECTOR DE CAMPEONATO */}
        <View style={{
          backgroundColor: getColor.background.primary,
          borderRadius: 12,
          padding: responsive.spacing.lg,
          marginBottom: responsive.spacing.lg,
          borderWidth: 1,
          borderColor: getColor.gray[200],
          shadowColor: getColor.primary[500],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '600',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            marginBottom: responsive.spacing.md,
          }}>
            Seleccionar Campeonato
          </Text>
          
          {mockCampeonatos.map((campeonato) => (
            <TouchableOpacity
              key={campeonato.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: responsive.spacing.md,
                borderRadius: 8,
                backgroundColor: selectedCampeonato?.id === campeonato.id 
                  ? getColor.primary[50] 
                  : 'transparent',
                borderWidth: 1,
                borderColor: selectedCampeonato?.id === campeonato.id 
                  ? getColor.primary[500] 
                  : getColor.gray[200],
                marginBottom: responsive.spacing.sm,
              }}
              onPress={() => handleCampeonatoSelect(campeonato)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: campeonato.activo 
                  ? getColor.success[500] 
                  : getColor.gray[400],
                marginRight: 12,
              }} />
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: selectedCampeonato?.id === campeonato.id ? '600' : '400',
                  color: selectedCampeonato?.id === campeonato.id 
                    ? getColor.primary[600] 
                    : getColor.gray[700],
                  fontFamily: 'Nunito',
                }}>
                  {campeonato.nombre}
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.sm,
                  color: getColor.gray[500],
                  fontFamily: 'Nunito',
                  marginTop: 2,
                }}>
                  {campeonato.activo ? 'En curso' : 'Finalizado'}
                </Text>
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={selectedCampeonato?.id === campeonato.id 
                  ? getColor.primary[500] 
                  : getColor.gray[400]} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* ESTADÍSTICAS DEL CAMPEONATO */}
        {showStats && selectedCampeonato && (
          <View style={{ marginBottom: responsive.spacing.lg }}>
            <Text style={{
              fontSize: responsive.fontSize.xl,
              fontWeight: '600',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
              marginBottom: responsive.spacing.md,
              textAlign: 'center',
            }}>
              {selectedCampeonato.nombre}
            </Text>
            
            {/* GRID DE ESTADÍSTICAS */}
            <View style={{
              gap: responsive.spacing.md,
            }}>
              
              {/* Card Categorías */}
              <View style={{
                backgroundColor: getColor.primary[500], // Azul oficial
                borderRadius: 16,
                padding: responsive.spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: responsive.isTablet ? 140 : 120,
                shadowColor: getColor.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}>
                <Text style={{
                  fontSize: responsive.fontSize['4xl'],
                  fontWeight: '700',
                  color: getColor.background.primary,
                  fontFamily: 'Montserrat', // Fuente de marca para números
                  lineHeight: responsive.fontSize['4xl'] * 1.1,
                }}>
                  {mockStats.categorias}
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.lg,
                  fontWeight: '500',
                  color: getColor.background.primary,
                  fontFamily: 'Nunito',
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                  Categorías
                </Text>
              </View>

              {/* Card Delegaciones */}
              <View style={{
                backgroundColor: getColor.primary[500], // Azul oficial
                borderRadius: 16,
                padding: responsive.spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: responsive.isTablet ? 140 : 120,
                shadowColor: getColor.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}>
                <Text style={{
                  fontSize: responsive.fontSize['4xl'],
                  fontWeight: '700',
                  color: getColor.background.primary,
                  fontFamily: 'Montserrat', // Fuente de marca para números
                  lineHeight: responsive.fontSize['4xl'] * 1.1,
                }}>
                  {mockStats.delegaciones}
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.lg,
                  fontWeight: '500',
                  color: getColor.background.primary,
                  fontFamily: 'Nunito',
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                  Delegaciones
                </Text>
              </View>

              {/* Card Participantes */}
              <View style={{
                backgroundColor: getColor.primary[500], // Azul oficial
                borderRadius: 16,
                padding: responsive.spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: responsive.isTablet ? 140 : 120,
                shadowColor: getColor.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}>
                <Text style={{
                  fontSize: responsive.fontSize['4xl'],
                  fontWeight: '700',
                  color: getColor.background.primary,
                  fontFamily: 'Montserrat', // Fuente de marca para números
                  lineHeight: responsive.fontSize['4xl'] * 1.1,
                }}>
                  {mockStats.participantes}
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.lg,
                  fontWeight: '500',
                  color: getColor.background.primary,
                  fontFamily: 'Nunito',
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                  Participantes
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ACCIONES RÁPIDAS */}
        <View style={{
          backgroundColor: getColor.background.primary,
          borderRadius: 12,
          padding: responsive.spacing.lg,
          borderWidth: 1,
          borderColor: getColor.gray[200],
          shadowColor: getColor.primary[500],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '600',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            marginBottom: responsive.spacing.md,
          }}>
            Acciones Rápidas
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: responsive.spacing.sm,
          }}>
            
            {/* Botón Resultados en Vivo */}
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: getColor.secondary[500], // Naranja oficial
              borderRadius: 12,
              padding: responsive.spacing.md,
              alignItems: 'center',
              shadowColor: getColor.secondary[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Ionicons 
                name="play-circle" 
                size={28} 
                color={getColor.background.primary} 
              />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '600',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
                marginTop: 8,
                textAlign: 'center',
              }}>
                Resultados{'\n'}en Vivo
              </Text>
            </TouchableOpacity>

            {/* Botón Ver Gimnastas */}
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: getColor.background.primary,
              borderRadius: 12,
              padding: responsive.spacing.md,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: getColor.primary[500],
            }}>
              <Ionicons 
                name="people" 
                size={28} 
                color={getColor.primary[500]} 
              />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '600',
                color: getColor.primary[500],
                fontFamily: 'Nunito',
                marginTop: 8,
                textAlign: 'center',
              }}>
                Ver{'\n'}Gimnastas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </BaseLayout>
  );
}