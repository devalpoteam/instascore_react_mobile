// src/features/home/screens/HomeScreen.tsx - OPCIÓN 1: MODAL
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
import CampeonatoSelectorModal from '@/features/home/components/CampeonatoSelectorModal';

// Mock data expandido - 10 campeonatos - CORREGIDO
const mockCampeonatos = [
  { id: '1', nombre: 'Copa Valparaíso 2024', activo: true, fecha: '15-20 Nov' },
  { id: '2', nombre: 'Gimnasia Artística Valparaíso', activo: false, fecha: '5-10 Oct' },
  { id: '3', nombre: 'Campeonato Nacional Juvenil', activo: true, fecha: '25-30 Nov' },
  { id: '4', nombre: 'Copa Regional Centro', activo: false, fecha: '1-5 Sep' },
  { id: '5', nombre: 'Torneo Interclubes', activo: true, fecha: '10-15 Dic' },
  { id: '6', nombre: 'Campeonato Escolar', activo: false, fecha: '20-25 Ago' },
  { id: '7', nombre: 'Copa Internacional', activo: true, fecha: '5-10 Ene' },
  { id: '8', nombre: 'Torneo de Verano', activo: false, fecha: '15-20 Jul' },
  { id: '9', nombre: 'Campeonato Adulto Mayor', activo: true, fecha: '25-30 Dic' },
  { id: '10', nombre: 'Copa Primavera', activo: false, fecha: '10-15 Sep' },
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
  const [showModal, setShowModal] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
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
  };

  const getScrollViewPaddingBottom = () => {
    if (responsive.isTablet) return 40;
    if (responsive.isIOS) return responsive.insets.bottom > 0 ? 25 : 20;
    return 20;
  };

  return (
    <BaseLayout>
      <Header 
        showLogo={true}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: responsive.spacing.md,
          paddingBottom: getScrollViewPaddingBottom(),
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
        
        {/* SELECTOR DE CAMPEONATO CON MODAL */}
        <TouchableOpacity
          style={{
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
          }}
          onPress={() => setShowModal(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: responsive.fontSize.lg,
                fontWeight: '600',
                color: getColor.gray[800],
                fontFamily: 'Nunito',
                marginBottom: 4,
              }}>
                Campeonato Seleccionado
              </Text>
              
              {selectedCampeonato && (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: selectedCampeonato.activo ? getColor.success[500] : getColor.gray[400],
                      marginRight: 8,
                    }} />
                    <Text style={{
                      fontSize: responsive.fontSize.base,
                      color: getColor.primary[600],
                      fontFamily: 'Nunito',
                      fontWeight: '500',
                      flex: 1,
                    }}>
                      {selectedCampeonato.nombre}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: responsive.fontSize.sm,
                    color: getColor.gray[500],
                    fontFamily: 'Nunito',
                  }}>
                    {selectedCampeonato.activo ? 'En curso' : 'Finalizado'} • {selectedCampeonato.fecha}
                  </Text>
                </>
              )}
              
              <Text style={{
                fontSize: responsive.fontSize.sm,
                color: getColor.gray[400],
                fontFamily: 'Nunito',
                marginTop: 8,
              }}>
                Toca aquí para ver otros campeonatos • {mockCampeonatos.length} disponibles
              </Text>
            </View>
            
            <View style={{
              backgroundColor: getColor.primary[50],
              borderRadius: 20,
              padding: 8,
            }}>
              <Ionicons name="chevron-down" size={20} color={getColor.primary[500]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* MODAL DE SELECCIÓN */}
        <CampeonatoSelectorModal
          visible={showModal}
          campeonatos={mockCampeonatos}
          selectedCampeonato={selectedCampeonato}
          onSelect={handleCampeonatoSelect}
          onClose={() => setShowModal(false)}
        />

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
            
            <View style={{ gap: responsive.spacing.md }}>
              {/* Card Categorías */}
              <View style={{
                backgroundColor: getColor.primary[500],
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
                  fontFamily: 'Montserrat',
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
                backgroundColor: getColor.primary[500],
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
                  fontFamily: 'Montserrat',
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
                backgroundColor: getColor.primary[500],
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
                  fontFamily: 'Montserrat',
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
            
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: getColor.secondary[500],
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