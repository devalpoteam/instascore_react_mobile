// src/features/gimnastas/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { SearchBarProps } from '../types/gimnastasList.types';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar gimnasta...",
  isLoading = false,
}: SearchBarProps) {
  const responsive = useResponsive();

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      paddingHorizontal: responsive.spacing.md,
      paddingVertical: responsive.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: getColor.gray[200],
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getColor.gray[100],
        borderRadius: 12,
        paddingHorizontal: responsive.spacing.md,
        borderWidth: 1,
        borderColor: value ? getColor.primary[300] : getColor.gray[200],
        minHeight: 44, // ✅ ALTURA MÍNIMA FIJA para consistencia
      }}>
        {/* Ícono de búsqueda */}
        <Ionicons 
          name="search-outline" 
          size={20} 
          color={value ? getColor.primary[500] : getColor.gray[400]}
          style={{ marginRight: responsive.spacing.sm }}
        />

        {/* Input de texto */}
        <TextInput
          style={{
            flex: 1,
            paddingVertical: responsive.spacing.sm, // ✅ SM igual que ResultadosScreen
            fontSize: responsive.fontSize.base,
            fontFamily: 'Nunito',
            color: getColor.gray[800],
            textAlignVertical: 'center',
            lineHeight: responsive.fontSize.base * 1.2, // ✅ LINEHEIGHT para centrar mejor el texto
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={getColor.gray[400]}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Loading indicator o botón clear */}
        {isLoading ? (
          <View style={{
            width: 20,
            height: 20,
            marginLeft: responsive.spacing.sm,
          }}>
            <Ionicons 
              name="refresh" 
              size={20} 
              color={getColor.primary[500]} 
            />
          </View>
        ) : value.length > 0 ? (
          <TouchableOpacity
            onPress={handleClear}
            style={{ padding: 4 }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="close-circle" 
              size={20} 
              color={getColor.gray[400]} 
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}