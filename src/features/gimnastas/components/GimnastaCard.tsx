// src/features/gimnastas/components/GimnastaCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { GimnastaCardProps } from '../types/gimnastasList.types';

export default function GimnastaCard({ gimnasta, onPress }: GimnastaCardProps) {
  const responsive = useResponsive();

  const getPositionColor = (posicion: number) => {
    if (posicion === 1) return getColor.secondary[500]; // Oro
    if (posicion === 2) return getColor.gray[400];      // Plata
    if (posicion === 3) return '#CD7F32';               // Bronce
    return getColor.gray[600];
  };

  const getPositionEmoji = (posicion: number) => {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return `#${posicion}`;
  };

  const handlePress = () => {
    onPress(gimnasta);
  };

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatCampeonatoName = (nombre: string) => {
    return nombre
      .replace('Copa ', '')
      .replace('Torneo ', '')
      .replace('Campeonato ', '')
      .replace(' 2025', '')
      .replace(' 2024', '');
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: getColor.background.primary,
        marginHorizontal: responsive.spacing.md,
        marginBottom: responsive.spacing.sm,
        borderRadius: 16,
        padding: responsive.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        // Sombra sutil
        shadowColor: getColor.gray[400],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: getColor.gray[100],
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar con iniciales */}
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: gimnasta.esMedallista ? getColor.primary[500] : getColor.gray[300],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsive.spacing.md,
      }}>
        <Text style={{
          fontSize: responsive.fontSize.base,
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
        }}>
          {getInitials(gimnasta.nombre)}
        </Text>
      </View>

      {/* Información principal */}
      <View style={{ flex: 1 }}>
        {/* Nombre del gimnasta */}
        <Text style={{
          fontSize: responsive.fontSize.base,
          fontWeight: '700',
          color: getColor.gray[800],
          fontFamily: 'Nunito',
          marginBottom: 2,
        }}>
          {gimnasta.nombre}
        </Text>

        {/* Último campeonato y categoría */}
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.primary[600],
          fontFamily: 'Nunito',
          marginBottom: 2,
        }}>
          {formatCampeonatoName(gimnasta.ultimoCampeonato.nombre)} • {gimnasta.ultimoCampeonato.categoria} {gimnasta.ultimoCampeonato.nivel}
        </Text>

        {/* Club */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name="flag-outline" 
            size={12} 
            color={getColor.gray[500]} 
            style={{ marginRight: 4 }}
          />
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            flex: 1,
          }}>
            {gimnasta.club}
          </Text>
        </View>
      </View>

      {/* ✅ SECCIÓN DE PUNTAJE */}
      <View style={{
        alignItems: 'center',
        marginLeft: responsive.spacing.md,
        minWidth: 70,
      }}>
        {/* ✅ ALL AROUND CON MEDALLA INTEGRADA */}
        <View style={{
          backgroundColor: getColor.primary[50],
          borderRadius: 8,
          paddingHorizontal: responsive.spacing.sm,
          paddingVertical: 6,
          marginBottom: responsive.spacing.xs,
          alignItems: 'center',
          minWidth: 60,
          borderWidth: 1,
          borderColor: getColor.primary[200],
          position: 'relative',
        }}>
          {/* ✅ MEDALLA EN LA ESQUINA SUPERIOR DERECHA */}
          <View style={{
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: getPositionColor(gimnasta.mejorPosicion),
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: getColor.background.primary,
          }}>
            <Text style={{
              fontSize: 8,
              fontWeight: '700',
              color: getColor.background.primary,
              fontFamily: 'Nunito',
            }}>
              {getPositionEmoji(gimnasta.mejorPosicion)}
            </Text>
          </View>

          <Text style={{
            fontSize: 10,
            fontWeight: '600',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            marginBottom: 1,
          }}>
            ALL AROUND
          </Text>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '700',
            color: getColor.primary[700],
            fontFamily: 'Nunito',
          }}>
            {gimnasta.mejorAllAround.toFixed(1)}
          </Text>
        </View>

        {/* Indicadores de estado */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
        }}>
          {gimnasta.activo && (
            <View style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: getColor.success[500],
            }} />
          )}
          {gimnasta.esMedallista && !gimnasta.activo && (
            <Ionicons 
              name="trophy" 
              size={8}
              color={getColor.secondary[500]} 
            />
          )}
        </View>
      </View>

      {/* Flecha indicadora */}
      <View style={{
        marginLeft: responsive.spacing.sm,
      }}>
        <Ionicons 
          name="chevron-forward" 
          size={18}
          color={getColor.gray[400]} 
        />
      </View>
    </TouchableOpacity>
  );
}