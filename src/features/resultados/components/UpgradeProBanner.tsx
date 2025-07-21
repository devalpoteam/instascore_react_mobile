// src/features/resultados/components/UpgradeProBanner.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface UpgradeProBannerProps {
  onUpgrade: () => void;
  onDismiss: () => void; // ✅ NUEVA PROP PARA CERRAR
}

export default function UpgradeProBanner({ onUpgrade, onDismiss }: UpgradeProBannerProps) {
  const responsive = useResponsive();

  return (
    <View style={{
      backgroundColor: getColor.primary[50],
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: getColor.primary[200],
      paddingHorizontal: responsive.spacing.md,
      paddingVertical: responsive.spacing.md,
      marginVertical: responsive.spacing.sm,
    }}>
      {/* Botón cerrar */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          padding: 4,
        }}
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="close" 
          size={20} 
          color={getColor.gray[500]} 
        />
      </TouchableOpacity>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flex: 1, marginRight: responsive.spacing.md, paddingRight: 20 }}>
          <Text style={{
            fontSize: responsive.fontSize.base,
            fontWeight: '600',
            color: getColor.primary[600],
            fontFamily: 'Nunito',
            marginBottom: 4,
          }}>
            Solo viendo TOP 3
          </Text>
          
          <Text style={{
            fontSize: responsive.fontSize.sm,
            color: getColor.gray[600],
            fontFamily: 'Nunito',
            lineHeight: responsive.fontSize.sm * 1.3,
          }}>
            Actualiza a Pro para ver todos los resultados
          </Text>
        </View>
        
        {/* Botón upgrade más pequeño */}
        <TouchableOpacity
          style={{
            backgroundColor: getColor.secondary[500],
            borderRadius: 12,
            paddingHorizontal: responsive.spacing.md,
            paddingVertical: responsive.spacing.sm,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Text style={{
            fontSize: responsive.fontSize.sm,
            fontWeight: '600',
            color: getColor.background.primary,
            fontFamily: 'Nunito',
          }}>
            Actualizar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}