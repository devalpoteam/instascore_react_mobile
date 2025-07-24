// src/features/gimnastas/components/SmartSearchBar.tsx - BÚSQUEDA INTELIGENTE
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { generateSearchSuggestions } from '../utils/enhancedSearch';
import { GimnastaListItem } from '../types/gimnastasList.types';

interface SmartSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  gimnastas: GimnastaListItem[];
  placeholder?: string;
  isLoading?: boolean;
}

export default function SmartSearchBar({
  value,
  onChangeText,
  onSuggestionSelect,
  gimnastas,
  placeholder = "Buscar gimnasta, club, categoría o campeonato...",
  isLoading = false,
}: SmartSearchBarProps) {
  const responsive = useResponsive();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generar sugerencias cuando cambia el texto
  useEffect(() => {
    if (value.length >= 2) {
      const newSuggestions = generateSearchSuggestions(gimnastas, value, 5);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, gimnastas]);

  const handleClear = () => {
    onChangeText('');
    setShowSuggestions(false);
  };

  const handleSuggestionPress = (suggestion: string) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);
    if (text.length < 2) {
      setShowSuggestions(false);
    }
  };

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      paddingHorizontal: responsive.spacing.md,
      paddingVertical: responsive.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: getColor.gray[200],
    }}>
      {/* Input principal */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getColor.gray[100],
        borderRadius: 12,
        paddingHorizontal: responsive.spacing.md,
        borderWidth: 1,
        borderColor: value ? getColor.primary[300] : getColor.gray[200],
        minHeight: 44,
      }}>
        {/* Ícono de búsqueda inteligente */}
        <Ionicons 
          name={showSuggestions ? "search" : "search-outline"}
          size={20} 
          color={value ? getColor.primary[500] : getColor.gray[400]}
          style={{ marginRight: responsive.spacing.sm }}
        />

        {/* Input de texto mejorado */}
        <TextInput
          style={{
            flex: 1,
            paddingVertical: responsive.spacing.sm,
            fontSize: responsive.fontSize.base,
            fontFamily: 'Nunito',
            color: getColor.gray[800],
            textAlignVertical: 'center',
            lineHeight: responsive.fontSize.base * 1.2,
          }}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={getColor.gray[400]}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => {
            if (value.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {/* Indicadores de estado */}
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

      {/* ✅ SUGERENCIAS INTELIGENTES */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={{
          backgroundColor: getColor.background.primary,
          borderRadius: 12,
          marginTop: responsive.spacing.xs,
          paddingVertical: responsive.spacing.xs,
          borderWidth: 1,
          borderColor: getColor.gray[200],
          shadowColor: getColor.gray[400],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 200 }}
          >
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  paddingHorizontal: responsive.spacing.md,
                  paddingVertical: responsive.spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: getColor.gray[100],
                }}
                onPress={() => handleSuggestionPress(suggestion)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="search-outline" 
                  size={16} 
                  color={getColor.gray[400]} 
                  style={{ marginRight: responsive.spacing.sm }}
                />
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  color: getColor.gray[700],
                  fontFamily: 'Nunito',
                  flex: 1,
                }}>
                  {suggestion}
                </Text>
                <Ionicons 
                  name="arrow-up-outline" 
                  size={16} 
                  color={getColor.gray[300]} 
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ✅ INDICADORES DE BÚSQUEDA INTELIGENTE */}
      {value.length > 0 && !showSuggestions && (
        <View style={{
          marginTop: responsive.spacing.xs,
          paddingHorizontal: responsive.spacing.sm,
        }}>
          <Text style={{
            fontSize: responsive.fontSize.xs,
            color: getColor.gray[500],
            fontFamily: 'Nunito',
            fontStyle: 'italic',
          }}>
            💡 Prueba: "amanda val", "pre medal", "copa 2024", "activos"
          </Text>
        </View>
      )}
    </View>
  );
}