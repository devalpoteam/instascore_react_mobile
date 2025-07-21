// src/features/resultados/components/AparatoTabs.tsx
import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { getAparatoDisplayNameResults } from '../data/mockLiveResultsData';

interface AparatoTabsProps {
  aparatos: string[];
  aparatoSeleccionado: string;
  aparatoActual: string; // El aparato que se está compitiendo ahora
  onAparatoChange: (aparato: string) => void;
}

export default function AparatoTabs({
  aparatos,
  aparatoSeleccionado,
  aparatoActual,
  onAparatoChange
}: AparatoTabsProps) {
  const responsive = useResponsive();

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: getColor.gray[200],
    }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: responsive.spacing.md,
          paddingVertical: responsive.spacing.sm,
        }}
      >
        <View style={{
          flexDirection: 'row',
          gap: responsive.spacing.sm,
        }}>
          {aparatos.map((aparato) => {
            const isSelected = aparato === aparatoSeleccionado;
            const isActive = aparato === aparatoActual;
            
            return (
              <TouchableOpacity
                key={aparato}
                style={{
                  backgroundColor: isSelected 
                    ? getColor.secondary[500] 
                    : getColor.gray[100],
                  borderRadius: 20,
                  paddingHorizontal: responsive.spacing.md,
                  paddingVertical: responsive.spacing.sm,
                  borderWidth: isActive ? 2 : 0,
                  borderColor: isActive ? getColor.secondary[600] : 'transparent',
                  shadowColor: isSelected ? getColor.secondary[500] : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.2 : 0,
                  shadowRadius: 4,
                  elevation: isSelected ? 3 : 0,
                  position: 'relative',
                }}
                onPress={() => onAparatoChange(aparato)}
                activeOpacity={0.8}
              >
                {/* Indicador de aparato activo */}
                {isActive && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: getColor.secondary[500],
                    borderWidth: 2,
                    borderColor: getColor.background.primary,
                  }} />
                )}
                
                <Text style={{
                  fontSize: responsive.fontSize.sm,
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected 
                    ? getColor.background.primary 
                    : getColor.gray[700],
                  fontFamily: 'Nunito',
                  textAlign: 'center',
                }}>
                  {getAparatoDisplayNameResults(aparato)}
                </Text>
                
                {/* Texto indicativo para aparato activo */}
                {isActive && !isSelected && (
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.secondary[600],
                    fontFamily: 'Nunito',
                    textAlign: 'center',
                    fontWeight: '600',
                    marginTop: 2,
                  }}>
                    EN VIVO
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}