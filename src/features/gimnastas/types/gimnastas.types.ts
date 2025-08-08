// src/features/gimnastas/types/gimnastas.types.ts
// TIPOS ACTUALIZADOS CON LA NUEVA ESTRUCTURA JERÁRQUICA

import {
  CategoriaBase,
  NivelTecnico,
  FranjaCompetencia,
  TipoGimnasia,
  AparatoGAF,
  AparatoGAM,
  AparatoGeneral
} from '@/core/types/competition.types';

// ===== INTERFACE PRINCIPAL DE GIMNASTA =====
export interface GimnastaProfile {
  // Identificación
  id: string;
  nombre: string;
  club: string;
  rut: string;
  año: number;
  
  // ✅ ESTRUCTURA JERÁRQUICA CORREGIDA
  categoria: CategoriaBase;           // "Kinder", "USAG", "Juvenil", etc.
  nivelTecnico?: NivelTecnico;        // "Nivel 1", "Nivel 2" (solo si aplica)
  franja: FranjaCompetencia;          // "F1", "M2", etc.
  tipo: TipoGimnasia;                 // GAF o GAM
  subdivision?: string;               // "A", "B" para grupos grandes
  
  // Contexto del campeonato actual
  campeonato: string;
  campeonatoId: string;
  
  // Resultados en el campeonato actual
  puntajes: Record<string, number>;   // Flexible para cualquier aparato
  allAround: number;
  posicion: number;
  posicionAparatos: Record<string, number>;
  
  // Metadatos
  fechaRegistro?: string;
  activo: boolean;
}

// ===== INTERFACE PARA LISTAS DE GIMNASTAS =====
export interface GimnastaListItem {
  // Identificación básica
  id: string;
  nombre: string;
  club: string;
  rut: string;
  año: number;
  
  // ✅ ESTRUCTURA JERÁRQUICA CORREGIDA
  categoria: CategoriaBase;
  nivelTecnico?: NivelTecnico;
  franja: FranjaCompetencia;
  tipo: TipoGimnasia;
  
  // Mejores resultados históricos (para ranking general)
  mejorPosicion: number;
  mejorAllAround: number;
  mejorCampeonato?: string;
  
  // Último campeonato (más reciente)
  ultimoCampeonato: {
    id: string;
    nombre: string;
    // ✅ ESTRUCTURA ACTUALIZADA
    categoria: CategoriaBase;
    nivelTecnico?: NivelTecnico;
    franja: FranjaCompetencia;
    tipo: TipoGimnasia;
    posicion: number;
    allAround: number;
    fecha: string;
    // Nombre display para mostrar en UI
    competenciaDisplay: string; // "Kinder 2 F1", "USAG 3 F2", "Juvenil F1"
  };
  
  // Historial para búsqueda y filtros
  historialCampeonatos: string[];           // IDs de campeonatos
  categoriasCompetidas: CategoriaBase[];    // Categorías donde ha competido
  nivelesCompetidos: NivelTecnico[];        // Niveles técnicos donde ha competido
  franjasCompetidas: FranjaCompetencia[];   // Franjas donde ha competido
  clubesHistorial: string[];                // Clubes donde ha estado
  
  // Metadatos para optimización
  searchString: string;         // String precomputado para búsqueda
  esMedallista: boolean;        // Tiene al menos un podium (1-3)
  activo: boolean;              // Compitió en últimos 6 meses
  
  // Estadísticas resumidas
  totalCampeonatos: number;
  totalPodiums: number;
  promedioAllAround?: number;
}

// ===== HISTORIAL DE COMPETENCIAS =====
export interface GimnastaHistorial {
  campeonatoId: string;
  campeonatoNombre: string;
  fecha: string;
  lugar: string;
  
  // ✅ ESTRUCTURA JERÁRQUICA CORREGIDA
  categoria: CategoriaBase;
  nivelTecnico?: NivelTecnico;
  franja: FranjaCompetencia;
  tipo: TipoGimnasia;
  competenciaDisplay: string;   // Para mostrar en UI
  
  // Resultados
  posicion: number;
  allAround: number;
  puntajes: Record<string, number>;
  posicionAparatos: Record<string, number>;
  
  // Contexto
  totalParticipantes: number;
  subdivision?: string;
}

// ===== FILTROS DE BÚSQUEDA =====
export interface GimnastaFilters {
  // Búsqueda general
  searchTerm: string;
  
  // ✅ FILTROS ACTUALIZADOS CON NUEVA ESTRUCTURA
  categoria: CategoriaBase | 'todos';
  nivelTecnico: NivelTecnico | 'todos';
  franja: FranjaCompetencia | 'todos';
  tipo: TipoGimnasia | 'todos';
  
  // Filtros adicionales
  campeonatoId: string | null;
  club: string | null;
  soloMedallistas: boolean;
  soloActivos: boolean;
  
  // Filtros de edad/año
  añoMinimo?: number;
  añoMaximo?: number;
}

// ===== ESTADÍSTICAS DE GIMNASTA =====
export interface GimnastaEstadisticas {
  gimnastaId: string;
  
  // Estadísticas generales
  totalCampeonatos: number;
  totalPodiums: number;          // Posiciones 1-3
  totalTop10: number;           // Posiciones 1-10
  mejorPosicion: number;
  mejorAllAround: number;
  promedioAllAround: number;
  
  // Por aparato (para gimnastas GAF/GAM específicos)
  estadisticasAparatos: {
    [aparato: string]: {
      mejorPuntaje: number;
      promedioPuntaje: number;
      mejorPosicion: number;
      totalCompetencias: number;
    };
  };
  
  // Progresión temporal
  evolucionAllAround: {
    fecha: string;
    campeonato: string;
    allAround: number;
    posicion: number;
  }[];
  
  // Por categoría/nivel
  estadisticasPorNivel: {
    categoria: CategoriaBase;
    nivelTecnico?: NivelTecnico;
    franja: FranjaCompetencia;
    campeonatos: number;
    mejorPosicion: number;
    mejorAllAround: number;
  }[];
}

// ===== PROPS PARA COMPONENTES =====
export interface GimnastaCardProps {
  gimnasta: GimnastaListItem;
  onPress: (gimnasta: GimnastaListItem) => void;
  showStats?: boolean;
  compact?: boolean;
}

export interface GimnastaProfileHeaderProps {
  gimnasta: GimnastaProfile;
  estadisticas?: GimnastaEstadisticas;
}

export interface GimnastaHistorialProps {
  gimnastaId: string;
  historial: GimnastaHistorial[];
  isLoading?: boolean;
}

// ===== TIPOS PARA API/SERVICIO =====
export interface GetGimnastasRequest {
  // Paginación
  page?: number;
  limit?: number;
  
  // Búsqueda
  search?: string;
  
  // ✅ FILTROS ACTUALIZADOS
  categoria?: CategoriaBase;
  nivelTecnico?: NivelTecnico;
  franja?: FranjaCompetencia;
  tipo?: TipoGimnasia;
  
  // Filtros adicionales
  campeonatoId?: string;
  club?: string;
  soloMedallistas?: boolean;
  soloActivos?: boolean;
  añoMinimo?: number;
  añoMaximo?: number;
  
  // Ordenamiento
  sortBy?: 'nombre' | 'mejorPosicion' | 'mejorAllAround' | 'ultimaCompetencia';
  sortOrder?: 'asc' | 'desc';
}

export interface GetGimnastasResponse {
  gimnastas: GimnastaListItem[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  
  // Metadatos para filtros
  availableFilters: {
    categorias: { categoria: CategoriaBase; count: number }[];
    niveles: { nivelTecnico: NivelTecnico; count: number }[];
    franjas: { franja: FranjaCompetencia; count: number }[];
    clubes: { club: string; count: number }[];
    campeonatos: { id: string; nombre: string; count: number }[];
  };
}

export interface GetGimnastaProfileRequest {
  gimnastaId: string;
  includeHistorial?: boolean;
  includeEstadisticas?: boolean;
}

export interface GetGimnastaProfileResponse {
  gimnasta: GimnastaProfile;
  historial?: GimnastaHistorial[];
  estadisticas?: GimnastaEstadisticas;
}

// ===== TIPOS PARA ESTADO DE COMPONENTES =====
export interface GimnastasListState {
  gimnastas: GimnastaListItem[];
  filteredGimnastas: GimnastaListItem[];
  filters: GimnastaFilters;
  
  // Estados de carga
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Paginación
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  
  // Metadatos para filtros
  availableFilters: GetGimnastasResponse['availableFilters'];
}

export interface GimnastaProfileState {
  gimnasta: GimnastaProfile | null;
  historial: GimnastaHistorial[];
  estadisticas: GimnastaEstadisticas | null;
  
  isLoading: boolean;
  error: string | null;
  
  // Tabs de la pantalla
  activeTab: 'perfil' | 'historial' | 'estadisticas';
}

// ===== FUNCIONES HELPER =====

/**
 * Construye el string de búsqueda para un gimnasta
 */
export const construirSearchString = (gimnasta: GimnastaListItem): string => {
  const elementos = [
    gimnasta.nombre,
    gimnasta.club,
    gimnasta.categoria,
    gimnasta.nivelTecnico || '',
    gimnasta.franja,
    gimnasta.ultimoCampeonato.nombre,
    gimnasta.ultimoCampeonato.competenciaDisplay
  ];
  
  return elementos
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
};

/**
 * Construye el nombre display de la competencia
 */
export const construirCompetenciaDisplay = (
  categoria: CategoriaBase,
  nivelTecnico: NivelTecnico | undefined,
  franja: FranjaCompetencia
): string => {
  if (nivelTecnico && (categoria === 'Kinder' || categoria === 'USAG')) {
    const numeroNivel = nivelTecnico.replace('Nivel ', '');
    return `${categoria} ${numeroNivel} ${franja}`;
  }
  return `${categoria} ${franja}`;
};

/**
 * Determina si un gimnasta es medallista
 */
export const esMedallista = (mejorPosicion: number): boolean => {
  return mejorPosicion >= 1 && mejorPosicion <= 3;
};

/**
 * Determina si un gimnasta está activo
 */
export const estaActivo = (ultimaCompetenciaFecha: string, mesesLimite: number = 6): boolean => {
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);
  
  const ultimaFecha = new Date(ultimaCompetenciaFecha);
  return ultimaFecha >= fechaLimite;
};