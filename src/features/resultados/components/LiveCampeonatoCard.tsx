import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface LiveCampeonatoCardProps {
  campeonato: {
    id: string;
    nombre: string;
    lugar: string;
    horaInicio: string;
    categoriasActivas?: any[];
    totalCategorias?: number;
    categoriasFinalizadas?: number;
    participantesTotales?: number;
  };
  onPress?: (campeonato: any) => void;
  onViewLive?: (campeonato: any) => void;
}

export default function LiveCampeonatoCard({
  campeonato,
  onPress,
  onViewLive
}: LiveCampeonatoCardProps) {
  const responsive = useResponsive();

  const handleCardPress = () => {
    onPress?.(campeonato);
  };

  const handleLivePress = () => {
    onViewLive?.(campeonato);
  };

  // Indicador pulsante para "EN VIVO"
  const LiveIndicator = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: getColor.secondary[500],
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: getColor.secondary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    }}>
      <View style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: getColor.background.primary,
        marginRight: 6,
      }} />
      <Text style={{
        fontSize: responsive.fontSize.xs,
        fontWeight: '700',
        color: getColor.background.primary,
        fontFamily: 'Nunito',
        letterSpacing: 0.5,
      }}>
        EN VIVO
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: getColor.background.primary,
        borderRadius: 20,
        marginBottom: responsive.spacing.md,
        marginHorizontal: responsive.spacing.md,
        borderWidth: 2,
        borderColor: getColor.secondary[200],
        shadowColor: getColor.secondary[400],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
      }}
    >
      {/* Header con información básica - clickeable para ver detalles */}
      <TouchableOpacity
        style={{
          padding: responsive.spacing.lg,
        }}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        {/* Título y indicador EN VIVO */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: responsive.spacing.sm,
        }}>
          <View style={{ flex: 1, marginRight: responsive.spacing.sm }}>
            <Text style={{
              fontSize: responsive.fontSize.xl,
              fontWeight: '700',
              color: getColor.primary[600],
              fontFamily: 'Nunito',
              lineHeight: responsive.fontSize.xl * 1.2,
              marginBottom: 4,
            }}>
              {campeonato.nombre}
            </Text>
          </View>
          
          <LiveIndicator />
        </View>

        {/* Información del lugar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: responsive.spacing.sm,
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

        {/* Información de la hora */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name="time" 
            size={16} 
            color={getColor.gray[500]} 
            style={{ marginRight: 6 }}
          />
          <Text style={{
            fontSize: responsive.fontSize.base,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
          }}>
            Inicio: {campeonato.horaInicio}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón de acción principal - Separado del área clickeable */}
      <View style={{ 
        paddingHorizontal: responsive.spacing.lg, 
        paddingBottom: responsive.spacing.lg 
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: getColor.secondary[500],
            borderRadius: 16,
            paddingVertical: responsive.spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            shadowColor: getColor.secondary[500],
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          }}
          onPress={handleLivePress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="play-circle" 
            size={22} 
            color={getColor.background.primary} 
            style={{ marginRight: responsive.spacing.sm }}
          />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: '700',
            color: getColor.background.primary,
            fontFamily: 'Nunito',
            letterSpacing: 0.5,
          }}>
            VER RESULTADOS EN VIVO
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}