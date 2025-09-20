// src/features/campeonatos/components/CampeonatoCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { CampeonatoCardProps } from '../types/campeonatos.types';
import CampeonatoStatusBadge from './CampeonatoStatusBadge';

export default function CampeonatoCard({
  campeonato,
  onPress,
  onViewResults
}: CampeonatoCardProps) {
  const responsive = useResponsive();

  const formatFecha = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (fechaInicio === fechaFin) {
      return format(inicio, 'd MMM yyyy', { locale: es });
    }
    
    if (inicio.getMonth() === fin.getMonth()) {
      return `${format(inicio, 'd', { locale: es })}-${format(fin, 'd MMM yyyy', { locale: es })}`;
    }
    
    return `${format(inicio, 'd MMM', { locale: es })} - ${format(fin, 'd MMM yyyy', { locale: es })}`;
  };

  const handleCardPress = () => {
    onPress?.(campeonato);
  };

  const handleResultsPress = () => {
    onViewResults?.(campeonato);
  };

  const canViewResults = campeonato.estado === 'activo' || campeonato.estado === 'finalizado';

  return (
    <TouchableOpacity
      style={{
        backgroundColor: getColor.background.primary,
        borderRadius: 16,
        padding: responsive.spacing.lg,
        marginBottom: responsive.spacing.md,
        marginHorizontal: responsive.spacing.md,
        borderWidth: 1,
        borderColor: getColor.gray[200],
        shadowColor: getColor.primary[500],
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
      }}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      {/* Header con título y estado */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: responsive.spacing.sm,
      }}>
        <View style={{ flex: 1, marginRight: responsive.spacing.sm }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '700',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.lg * 1.2,
          }}>
            {campeonato.nombre}
          </Text>
        </View>
        <CampeonatoStatusBadge estado={campeonato.estado} size="sm" />
      </View>

      {/* Información del lugar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.spacing.xs,
      }}>
        <Ionicons 
          name="location-outline" 
          size={16} 
          color={getColor.gray[500]} 
          style={{ marginRight: 8 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          flex: 1,
        }}>
          {campeonato.lugar}
        </Text>
      </View>

      {/* Información de fecha y hora */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.spacing.md,
      }}>
        <Ionicons 
          name="calendar-outline" 
          size={16} 
          color={getColor.gray[500]} 
          style={{ marginRight: 8 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          flex: 1,
        }}>
          {formatFecha(campeonato.fechaInicio, campeonato.fechaFin)} • {campeonato.horaInicio}
        </Text>
      </View>

      {/* Estadísticas en chips */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: responsive.spacing.md,
        gap: 8,
      }}>
        <View style={{
          backgroundColor: getColor.primary[50],
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name="trophy-outline" 
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
            {campeonato.categorias} categorías
          </Text>
        </View>

        <View style={{
          backgroundColor: getColor.secondary[50],
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name="people-outline" 
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
            {campeonato.participantes} participantes
          </Text>
        </View>

        <View style={{
          backgroundColor: getColor.gray[100],
          borderRadius: 20,
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

      {/* Botones de acción */}
      <View style={{
        flexDirection: 'row',
        gap: responsive.spacing.sm,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: getColor.primary[500], // ✅ Azul sólido como "En Vivo"
            borderRadius: 12,
            paddingVertical: responsive.spacing.sm,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            shadowColor: getColor.primary[500], // ✅ Sombra azul
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleCardPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={18} 
            color={getColor.background.primary} // ✅ Ícono blanco
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: responsive.fontSize.sm,
            fontWeight: '600',
            color: getColor.background.primary, // ✅ Texto blanco
            fontFamily: 'Nunito',
          }}>
            Ver Detalles
          </Text>
        </TouchableOpacity>

        {canViewResults && (
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: getColor.secondary[500],
              borderRadius: 12,
              paddingVertical: responsive.spacing.sm,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: getColor.secondary[500],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handleResultsPress}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={campeonato.estado === 'activo' ? 'play-circle-outline' : 'bar-chart-outline'} 
              size={18} 
              color={getColor.background.primary} 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              fontSize: responsive.fontSize.sm,
              fontWeight: '600',
              color: getColor.background.primary,
              fontFamily: 'Nunito',
            }}>
              {campeonato.estado === 'activo' ? 'En Vivo' : 'Resultados'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}