// src/features/home/screens/HomeScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import { homeService } from '@/services/api/home/homeServices';

interface CampeonatoHome {
  id: string;
  nombre: string;
  estado: 'activo' | 'configuracion' | 'finalizado';
  lugar: string;
  fecha: string;
  delegaciones: number;
  participantes: number;
  categorias: number;
}

const carouselImages = [
  require('../../../../assets/images/carousel/gimnasta1.jpg'),
  require('../../../../assets/images/carousel/gimnasta2.jpg'),
  require('../../../../assets/images/carousel/gimnasta3.jpg'),
  require('../../../../assets/images/carousel/gimnasta4.jpg'),
  require('../../../../assets/images/carousel/gimnasta5.jpg'),
];

export default function HomeScreen() {
  const responsive = useResponsive();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const [campeonatoEnVivo, setCampeonatoEnVivo] = useState<CampeonatoHome | null>(null);
  const [campeonatoProximo, setCampeonatoProximo] = useState<CampeonatoHome | null>(null);
  const [campeonatoFinalizado, setCampeonatoFinalizado] = useState<CampeonatoHome | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselImages.length;
        flatListRef.current?.scrollToIndex({ 
          index: nextIndex, 
          animated: true 
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadCampeonatos();
  }, []);

  const loadCampeonatos = async () => {
    try {
      setError(null);
      const data = await homeService.getCampeonatosHome();
      setCampeonatoEnVivo(data.enVivo);
      setCampeonatoProximo(data.proximo);
      setCampeonatoFinalizado(data.finalizado);
    } catch (err: any) {
      console.error('Error loading campeonatos:', err);
      setError(err.message || 'Error al cargar campeonatos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCampeonatos();
    setRefreshing(false);
  };


  const getScrollViewPaddingBottom = () => {
    if (responsive.isTablet) return 40;
    if (responsive.isIOS) return responsive.insets.bottom > 0 ? 25 : 20;
    return 20;
  };

  const renderCarouselImage = ({ item, index }: { item: any; index: number }) => (
    <View style={{ width: screenWidth }}>
      <Image
        source={item}
        style={{
          width: screenWidth,
          height: responsive.isTablet ? 300 : 250,
          resizeMode: 'cover',
        }}
      />
    </View>
  );

  const CampeonatoInfo = ({ 
    campeonato, 
    estado,
    estadoColor,
    isLive = false
  }: { 
    campeonato: CampeonatoHome | null; 
    estado: string;
    estadoColor: string;
    isLive?: boolean;
  }) => {
    if (!campeonato) {
      return (
        <View style={{
          backgroundColor: getColor.gray[50],
          borderRadius: 16,
          padding: responsive.spacing.lg,
          marginBottom: responsive.spacing.md,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: getColor.gray[200],
        }}>
          <Ionicons name="information-circle-outline" size={48} color={getColor.gray[400]} />
          <Text style={{
            fontSize: responsive.fontSize.base,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            marginTop: responsive.spacing.sm,
            textAlign: 'center',
          }}>
            No hay campeonato disponible
          </Text>
        </View>
      );
    }

    return (
      <View style={{
        backgroundColor: getColor.background.primary,
        borderRadius: 20,
        padding: responsive.spacing.lg,
        marginBottom: responsive.spacing.md,
        borderWidth: isLive ? 2 : 1,
        borderColor: isLive ? getColor.secondary[200] : getColor.gray[200],
        shadowColor: isLive ? getColor.secondary[400] : getColor.gray[400],
        shadowOffset: { width: 0, height: isLive ? 6 : 3 },
        shadowOpacity: isLive ? 0.15 : 0.08,
        shadowRadius: isLive ? 12 : 6,
        elevation: isLive ? 8 : 4,
        ...(isLive && {
          transform: [{ scale: 1.02 }],
        }),
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: responsive.spacing.sm,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.xl,
            fontWeight: '700',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.xl * 1.2,
            flex: 1,
            marginRight: responsive.spacing.sm,
          }}>
            {campeonato.nombre}
          </Text>
          
          {estado === "EN VIVO" ? (
            <View style={{
              backgroundColor: `${estadoColor}15`,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: `${estadoColor}30`,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: estadoColor,
                marginRight: 6,
              }} />
              <Text style={{
                fontSize: responsive.fontSize.xs,
                fontWeight: '600',
                color: estadoColor,
                fontFamily: 'Nunito',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                {estado}
              </Text>
            </View>
          ) : (
            <View style={{
              backgroundColor: `${estadoColor}15`,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: `${estadoColor}30`,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons 
                name={estado === "PRÓXIMO" ? "calendar-outline" : "checkmark-circle-outline"} 
                size={14} 
                color={estadoColor} 
                style={{ marginRight: 6 }}
              />
              <Text style={{
                fontSize: responsive.fontSize.xs,
                fontWeight: '600',
                color: estadoColor,
                fontFamily: 'Nunito',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                {estado}
              </Text>
            </View>
          )}
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: responsive.spacing.md,
        }}>
          <Ionicons 
            name="location" 
            size={16} 
            color={getColor.gray[500]} 
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: responsive.fontSize.base,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            flex: 1,
          }}>
            {campeonato.lugar}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: responsive.spacing.sm,
        }}>
          <View style={{
            backgroundColor: getColor.primary[50],
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons 
              name="people-outline" 
              size={14} 
              color={getColor.primary[500]} 
              style={{ marginRight: 4 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.xs,
              fontWeight: '600',
              color: getColor.primary[700],
              fontFamily: 'Nunito',
            }}>
              {campeonato.participantes} gimnastas
            </Text>
          </View>

          <View style={{
            backgroundColor: getColor.secondary[50],
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons 
              name="trophy-outline" 
              size={14} 
              color={getColor.secondary[600]} 
              style={{ marginRight: 4 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.xs,
              fontWeight: '600',
              color: getColor.secondary[700],
              fontFamily: 'Nunito',
            }}>
              {campeonato.categorias} categorías
            </Text>
          </View>

          <View style={{
            backgroundColor: getColor.gray[100],
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons 
              name="flag-outline" 
              size={14} 
              color={getColor.gray[600]} 
              style={{ marginRight: 4 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.xs,
              fontWeight: '600',
              color: getColor.gray[700],
              fontFamily: 'Nunito',
            }}>
              {campeonato.delegaciones} delegaciones
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <BaseLayout>
        <Header showLogo={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
          }}>
            Cargando campeonatos...
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (error && !refreshing) {
    return (
      <BaseLayout>
        <Header showLogo={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle-outline" size={64} color={getColor.error[500]} />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            color: getColor.error[500],
            fontFamily: 'Nunito',
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 16,
          }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadCampeonatos}
            style={{
              backgroundColor: getColor.primary[500],
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
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
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header 
        showLogo={true}
      />

      <ScrollView
        style={{ flex: 1 }}
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
        
        <View style={{ position: 'relative' }}>
          <FlatList
            ref={flatListRef}
            data={carouselImages}
            renderItem={renderCarouselImage}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(newIndex);
            }}
          />
          
          <View style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {carouselImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: currentImageIndex === index 
                    ? getColor.background.primary 
                    : `${getColor.background.primary}60`,
                  marginHorizontal: 4,
                  shadowColor: getColor.gray[900],
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                onPress={() => {
                  setCurrentImageIndex(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
              />
            ))}
          </View>
        </View>

        <View style={{
          padding: responsive.spacing.md,
          paddingBottom: getScrollViewPaddingBottom(),
        }}>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsive.spacing.lg,
            marginTop: responsive.spacing.sm,
          }}>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: getColor.secondary[300],
            }} />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: responsive.spacing.md,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: getColor.secondary[500],
                marginRight: 6,
              }} />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '500',
                color: getColor.secondary[600],
                fontFamily: 'Nunito',
                letterSpacing: 1,
              }}>
                EN VIVO
              </Text>
            </View>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: getColor.secondary[300],
            }} />
          </View>

          <CampeonatoInfo
            campeonato={campeonatoEnVivo}
            estado="EN VIVO"
            estadoColor={getColor.secondary[500]}
            isLive={true}
          />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsive.spacing.lg,
            marginTop: responsive.spacing.xl,
          }}>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: getColor.success[300],
            }} />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: responsive.spacing.md,
            }}>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={getColor.success[600]} 
                style={{ marginRight: 6 }}
              />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '500',
                color: getColor.success[600],
                fontFamily: 'Nunito',
                letterSpacing: 1,
              }}>
                PRÓXIMOS
              </Text>
            </View>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: getColor.success[300],
            }} />
          </View>

          <CampeonatoInfo
            campeonato={campeonatoProximo}
            estado="PRÓXIMO"
            estadoColor={getColor.success[500]}
          />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsive.spacing.lg,
            marginTop: responsive.spacing.xl,
          }}>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: getColor.gray[300],
            }} />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: responsive.spacing.md,
            }}>
              <Ionicons 
                name="checkmark-circle-outline" 
                size={16} 
                color={getColor.gray[600]} 
                style={{ marginRight: 6 }}
              />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '500',
                color: getColor.gray[600],
                fontFamily: 'Nunito',
                letterSpacing: 1,
              }}>
                FINALIZADOS
              </Text>
            </View>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: getColor.gray[300],
            }} />
          </View>

          <CampeonatoInfo
            campeonato={campeonatoFinalizado}
            estado="FINALIZADO"
            estadoColor={getColor.gray[500]}
          />
        </View>
      </ScrollView>
    </BaseLayout>
  );
}