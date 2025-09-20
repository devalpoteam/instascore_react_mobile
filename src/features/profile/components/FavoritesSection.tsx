// src/features/profile/components/FavoritesSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { FavoritesSectionProps, FavoriteGimnasta } from '../types/profile.types';

export default function FavoritesSection({ 
  favorites, 
  isLoading = false, 
  onFavoritePress, 
  onRemoveFavorite, 
  onViewAll 
}: FavoritesSectionProps) {
  const responsive = useResponsive();

  const renderFavoriteCard = (favorite: FavoriteGimnasta) => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    };

    // ✅ USAR DATOS REALES DEL GIMNASTA
    const getMejorPosicionDisplay = (posicion: number) => {
      if (posicion === 1) return '🥇';
      if (posicion === 2) return '🥈';
      if (posicion === 3) return '🥉';
      return `#${posicion}`;
    };

    const getStatusColor = (gimnasta: FavoriteGimnasta) => {
      if (gimnasta.esMedallista) return getColor.secondary[500];
      if (gimnasta.activo) return getColor.success[500];
      return getColor.gray[400];
    };

    return (
      <TouchableOpacity
        key={favorite.id}
        style={{
          backgroundColor: getColor.background.primary,
          borderRadius: 16,
          padding: responsive.spacing.lg,
          marginRight: responsive.spacing.md,
          width: responsive.isTablet ? 240 : 200,
          minHeight: 140,
          borderWidth: 1,
          borderColor: getColor.gray[200],
          shadowColor: getColor.gray[300],
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
        }}
        onPress={() => onFavoritePress(favorite)}
        activeOpacity={0.8}
      >
        {/* Header con avatar y remove button */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: responsive.spacing.md,
        }}>
          {/* Avatar con iniciales reales */}
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: getStatusColor(favorite),
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: responsive.spacing.xs,
            }}>
              <Text style={{
                fontSize: responsive.fontSize.base,
                fontWeight: '700',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}>
                {getInitials(favorite.nombre)}
              </Text>
            </View>
            
            {/* Status con datos reales */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: favorite.activo ? getColor.success[50] : getColor.gray[50],
              borderRadius: 8,
              paddingHorizontal: responsive.spacing.xs,
              paddingVertical: 2,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: favorite.activo ? getColor.success[500] : getColor.gray[400],
                marginRight: 4,
              }} />
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: favorite.activo ? getColor.success[600] : getColor.gray[500],
                fontFamily: 'Nunito',
                fontWeight: '500',
              }}>
                {favorite.activo ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>

          {/* Remove button */}
          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: getColor.secondary[50],
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => onRemoveFavorite(favorite.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="heart" 
              size={18} 
              color={getColor.secondary[500]} 
            />
          </TouchableOpacity>
        </View>

        {/* Información principal */}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {/* Nombre real */}
          <Text style={{
            fontSize: responsive.fontSize.sm,
            fontWeight: '700',
            color: getColor.gray[800],
            fontFamily: 'Nunito',
            marginBottom: responsive.spacing.xs,
            lineHeight: responsive.fontSize.sm * 1.3,
          }}
          numberOfLines={2}
          >
            {favorite.nombre}
          </Text>

          {/* Mejor posición y badges */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsive.spacing.xs,
            gap: responsive.spacing.xs,
          }}>
            {/* Badge de mejor posición */}
            <View style={{
              backgroundColor: favorite.mejorPosicion <= 3 ? getColor.secondary[500] : getColor.primary[50],
              borderRadius: 8,
              paddingHorizontal: responsive.spacing.sm,
              paddingVertical: 4,
            }}>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: favorite.mejorPosicion <= 3 ? getColor.background.primary : getColor.primary[600],
                fontFamily: 'Nunito',
                fontWeight: '600',
              }}>
                {getMejorPosicionDisplay(favorite.mejorPosicion)} Mejor
              </Text>
            </View>

            {/* Badge de medallista */}
            {favorite.esMedallista && (
              <View style={{
                backgroundColor: getColor.secondary[100],
                borderRadius: 8,
                paddingHorizontal: responsive.spacing.xs,
                paddingVertical: 2,
              }}>
                <Text style={{
                  fontSize: 10,
                  color: getColor.secondary[700],
                  fontFamily: 'Nunito',
                  fontWeight: '600',
                }}>
                  🏆
                </Text>
              </View>
            )}
          </View>

          {/* Categoría y nivel reales */}
          <View style={{
            backgroundColor: getColor.primary[50],
            borderRadius: 8,
            paddingHorizontal: responsive.spacing.sm,
            paddingVertical: 4,
            alignSelf: 'flex-start',
            marginBottom: responsive.spacing.xs,
          }}>
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.primary[600],
              fontFamily: 'Nunito',
              fontWeight: '600',
            }}>
              {favorite.ultimoCampeonato.categoria} {favorite.ultimoCampeonato.nivel}
            </Text>
          </View>

          {/* Club real */}
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.xs * 1.3,
          }}
          numberOfLines={2}
          >
            {favorite.club}
          </Text>

          {/* Último campeonato */}
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[400],
            fontFamily: 'Nunito',
            marginTop: 4,
          }}
          numberOfLines={1}
          >
            🏟️ {favorite.ultimoCampeonato.nombre}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsive.spacing.xl * 1.5,
      paddingHorizontal: responsive.spacing.lg,
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: getColor.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsive.spacing.lg,
      }}>
        <Ionicons 
          name="heart-outline" 
          size={36} 
          color={getColor.gray[400]} 
        />
      </View>
      <Text style={{
        fontSize: responsive.fontSize.lg,
        fontWeight: '600',
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        Sin favoritos aún
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.sm,
        color: getColor.gray[500],
        fontFamily: 'Nunito',
        textAlign: 'center',
        lineHeight: responsive.fontSize.sm * 1.4,
        maxWidth: 240,
      }}>
        Marca gimnastas como favoritos para seguir sus resultados y recibir notificaciones
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: responsive.spacing.lg,
        paddingVertical: responsive.spacing.md,
      }}
    >
      {[1, 2, 3].map((_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: getColor.gray[100],
            borderRadius: 16,
            padding: responsive.spacing.lg,
            marginRight: responsive.spacing.md,
            width: responsive.isTablet ? 220 : 180,
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: getColor.gray[200],
            marginBottom: responsive.spacing.md,
          }} />
          <View style={{
            width: '80%',
            height: 12,
            borderRadius: 6,
            backgroundColor: getColor.gray[200],
            marginBottom: responsive.spacing.xs,
          }} />
          <View style={{
            width: '60%',
            height: 10,
            borderRadius: 5,
            backgroundColor: getColor.gray[200],
          }} />
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      marginBottom: responsive.spacing.md,
    }}>
      {/* Header de la sección */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsive.spacing.lg,
        paddingTop: responsive.spacing.lg,
        paddingBottom: responsive.spacing.md,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: getColor.secondary[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsive.spacing.md,
          }}>
            <Ionicons 
              name="heart" 
              size={20} 
              color={getColor.secondary[600]} 
            />
          </View>
          
          <View>
            <Text style={{
              fontSize: responsive.fontSize.lg,
              fontWeight: '700',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
            }}>
              Mis Favoritos
            </Text>
            {favorites.length > 0 && (
              <Text style={{
                fontSize: responsive.fontSize.sm,
                color: getColor.gray[500],
                fontFamily: 'Nunito',
                marginTop: 2,
              }}>
                {favorites.length} gimnasta{favorites.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        {favorites.length > 3 && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: getColor.primary[50],
              paddingHorizontal: responsive.spacing.md,
              paddingVertical: responsive.spacing.sm,
              borderRadius: 20,
            }}
            onPress={onViewAll}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.primary[600],
              fontFamily: 'Nunito',
              fontWeight: '600',
              marginRight: 4,
            }}>
              Ver todos
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={14} 
              color={getColor.primary[600]} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido de favoritos */}
      {isLoading ? (
        renderLoadingState()
      ) : favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: responsive.spacing.lg,
            paddingBottom: responsive.spacing.lg,
          }}
        >
          {favorites.slice(0, 5).map(renderFavoriteCard)}
          
          {favorites.length > 5 && (
            <TouchableOpacity
              style={{
                width: responsive.isTablet ? 140 : 120,
                height: 120,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: getColor.primary[200],
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: getColor.primary[25],
              }}
              onPress={onViewAll}
              activeOpacity={0.8}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: getColor.primary[100],
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: responsive.spacing.sm,
              }}>
                <Ionicons 
                  name="add" 
                  size={24} 
                  color={getColor.primary[600]} 
                />
              </View>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.primary[600],
                fontFamily: 'Nunito',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                +{favorites.length - 5} más
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}