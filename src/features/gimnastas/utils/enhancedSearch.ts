// src/features/gimnastas/utils/enhancedSearch.ts - BÚSQUEDA FUZZY INTELIGENTE
import { GimnastaListItem } from '../types/gimnastasList.types';

// Función para normalizar texto (quitar acentos, espacios extra, etc.)
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Descomponer acentos
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[-_\s]+/g, ' ') // Normalizar espacios y guiones
    .trim();
};

// Función para calcular distancia de Levenshtein simplificada
export const calculateSimilarity = (str1: string, str2: string): number => {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  // Si hay coincidencia exacta después de normalizar
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return 1;
  }
  
  // Verificar coincidencias de palabras
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');
  
  let matches = 0;
  for (const word2 of words2) {
    for (const word1 of words1) {
      if (word1.includes(word2) || word2.includes(word1)) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

// Función principal de búsqueda fuzzy
export const fuzzySearch = (
  gimnastas: GimnastaListItem[],
  searchTerm: string,
  threshold: number = 0.3
): GimnastaListItem[] => {
  if (!searchTerm.trim()) return gimnastas;
  
  const normalizedSearch = normalizeText(searchTerm);
  const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
  
  return gimnastas
    .map(gimnasta => {
      let maxScore = 0;
      
      // Buscar en nombre
      const nameScore = calculateSimilarity(gimnasta.nombre, searchTerm);
      maxScore = Math.max(maxScore, nameScore);
      
      // Buscar en club
      const clubScore = calculateSimilarity(gimnasta.club, searchTerm);
      maxScore = Math.max(maxScore, clubScore * 0.8); // Peso menor para club
      
      // Buscar en categoría + nivel
      const categoriaCompleta = `${gimnasta.ultimoCampeonato.categoria} ${gimnasta.ultimoCampeonato.nivel}`;
      const categoriaScore = calculateSimilarity(categoriaCompleta, searchTerm);
      maxScore = Math.max(maxScore, categoriaScore * 0.7);
      
      // Buscar en campeonato
      const campeonatoScore = calculateSimilarity(gimnasta.ultimoCampeonato.nombre, searchTerm);
      maxScore = Math.max(maxScore, campeonatoScore * 0.6);
      
      // Búsqueda por palabras clave especiales
      if (searchWords.some(word => 
        ['medal', 'medall', 'oro', 'plata', 'bronce', 'podium'].includes(word) && gimnasta.esMedallista
      )) {
        maxScore = Math.max(maxScore, 0.9);
      }
      
      if (searchWords.some(word => 
        ['activ', 'recient', 'nuevo'].includes(word) && gimnasta.activo
      )) {
        maxScore = Math.max(maxScore, 0.8);
      }
      
      return { ...gimnasta, searchScore: maxScore };
    })
    .filter(gimnasta => gimnasta.searchScore >= threshold)
    .sort((a, b) => {
      // Ordenar por score descendente, luego por si es medallista, luego alfabético
      if (b.searchScore !== a.searchScore) {
        return b.searchScore - a.searchScore;
      }
      if (a.esMedallista !== b.esMedallista) {
        return a.esMedallista ? -1 : 1;
      }
      return a.nombre.localeCompare(b.nombre);
    });
};

// Función para generar sugerencias de búsqueda
export const generateSearchSuggestions = (
  gimnastas: GimnastaListItem[],
  searchTerm: string,
  maxSuggestions: number = 5
): string[] => {
  if (!searchTerm.trim() || searchTerm.length < 2) return [];
  
  const suggestions = new Set<string>();
  const normalizedSearch = normalizeText(searchTerm);
  
  gimnastas.forEach(gimnasta => {
    // Sugerencias de nombres
    if (normalizeText(gimnasta.nombre).includes(normalizedSearch)) {
      suggestions.add(gimnasta.nombre);
    }
    
    // Sugerencias de clubes
    if (normalizeText(gimnasta.club).includes(normalizedSearch)) {
      suggestions.add(gimnasta.club);
    }
    
    // Sugerencias de categorías
    const categoria = `${gimnasta.ultimoCampeonato.categoria} ${gimnasta.ultimoCampeonato.nivel}`;
    if (normalizeText(categoria).includes(normalizedSearch)) {
      suggestions.add(categoria);
    }
    
    // Sugerencias de campeonatos
    if (normalizeText(gimnasta.ultimoCampeonato.nombre).includes(normalizedSearch)) {
      suggestions.add(gimnasta.ultimoCampeonato.nombre);
    }
  });
  
  return Array.from(suggestions).slice(0, maxSuggestions);
};

// Función para extraer filtros inteligentes del texto de búsqueda
export const extractSmartFilters = (searchTerm: string) => {
  const normalized = normalizeText(searchTerm);
  const words = normalized.split(' ');
  
  const filters = {
    soloMedallistas: false,
    soloActivos: false,
    extractedSearchTerm: searchTerm,
  };
  
  // Detectar palabras clave para medallistas
  const medallistaKeywords = ['medal', 'medall', 'oro', 'plata', 'bronce', 'podium', 'ganador', 'campeon'];
  if (words.some(word => medallistaKeywords.some(keyword => word.includes(keyword)))) {
    filters.soloMedallistas = true;
    // Remover estas palabras del término de búsqueda
    filters.extractedSearchTerm = searchTerm.replace(/\b(medal\w*|oro|plata|bronce|podium|ganador\w*|campeon\w*)\b/gi, '').trim();
  }
  
  // Detectar palabras clave para activos
  const activoKeywords = ['activ', 'recient', 'nuevo', 'actual'];
  if (words.some(word => activoKeywords.some(keyword => word.includes(keyword)))) {
    filters.soloActivos = true;
    filters.extractedSearchTerm = filters.extractedSearchTerm.replace(/\b(activ\w*|recient\w*|nuevo\w*|actual\w*)\b/gi, '').trim();
  }
  
  return filters;
};