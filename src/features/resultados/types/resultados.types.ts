// src/features/resultados/types/resultados.types.ts
// TIPOS ACTUALIZADOS PARA RESULTADOS Y COMPETENCIAS EN VIVO

import {
  CategoriaBase,
  NivelTecnico,
  FranjaCompetencia,
  TipoGimnasia,
  AparatoGeneral,
  CampeonatoEstado
} from '@/core/types/competition.types';

// ===== GIMNASTA EN RESULTADOS =====
export interface GimnastaResultado {
  // Identificación
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
  subdivision?: string;
  
  // Para display en UI
  competenciaDisplay: string;   // "Kinder 2 F1", "USAG 3 F2", "Juvenil F1"
  
  // Resultados actuales
  puntajes: {
    [aparato: string]: number | null; // null = no ha competido aún en este aparato
  };
  allAround: number;
  posicion: number;
  posicionAparatos: {
    [aparato: string]: number;
  };
  
  // Estado de competencia
  haCompetidoHoy: boolean;
  aparatosPendientes: string[];
  ultimoAparatoCompetido?: string;
  
  // Metadatos
  dorsal?: string;              // Número de competencia
  orden?: number;               // Orden de rotación
}

// ===== CATEGORÍA ACTIVA EN COMPETENCIA =====
export interface CategoriaActiva {
  // Identificación
  id: string;
  
  // ✅ ESTRUCTURA JERÁRQUICA CORREGIDA  
  categoria: CategoriaBase;
  nivelTecnico?: NivelTecnico;
  franja: FranjaCompetencia;
  tipo: TipoGimnasia;
  
  // Para display
  nombreCompleto: string;       // "Kinder Nivel 2 F1"
  nombreCorto: string;          // "Kinder 2 F1"
  nombreDisplay: string;        // Para UI: "Kinder F1"
  
  // Estado actual de competencia
  aparatoActual: AparatoGeneral;
  aparatoNumero: number;        // 1, 2, 3, 4 (rotación actual)
  aparatos: AparatoGeneral[];   // Lista completa de aparatos para esta categoría
  totalAparatos: number;        // Total de aparatos (3, 4, o 6)
  
  // Participantes
  participantesActivos: number; // Compitiendo ahora
  participantesTotales: number;
  participantesPendientes: number; // Por competir en este aparato
  
  // Estado de la categoría
  iniciada: boolean;
  finalizada: boolean;
  enPausa: boolean;
  
  // Metadatos
  horaInicio?: string;
  horaEstimadaFinalizacion?: string;
  subdivision?: string;
}

// ===== CAMPEONATO EN VIVO =====
export interface CampeonatoEnVivo {
  // Información básica
  id: string;
  nombre: string;
  lugar: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  estado: CampeonatoEstado;
  
  // Categorías en competencia
  categoriasActivas: CategoriaActiva[];
  categoriasFinalizadas: CategoriaActiva[];
  categoriasPendientes: CategoriaActiva[];
  
  // Estadísticas generales
  totalCategorias: number;
  totalParticipantes: number;
  totalDelegaciones: number;
  
  // Estado general del campeonato
  enVivo: boolean;
  pausado: boolean;
  
  // Metadatos
  descripcion?: string;
  organizador?: string;
  contacto?: string;
  ultimaActualizacion: string;
}

// ===== RESULTADOS DE UNA CATEGORÍA ESPECÍFICA =====
export interface ResultadosCategoria {
  // Información del campeonato
  campeonatoId: string;
  campeonatoNombre: string;
  campeonatoLugar: string;
  campeonatoFecha: string;
  
  // ✅ INFORMACIÓN DE LA CATEGORÍA CORREGIDA
  categoriaId: string;
  categoria: CategoriaBase;
  nivelTecnico?: NivelTecnico;
  franja: FranjaCompetencia;
  tipo: TipoGimnasia;
  
  // Para display
  categoriaNombreCompleto: string;    // "Kinder Nivel 2 F1"
  categoriaNombreCorto: string;       // "Kinder 2 F1"
  categoriaNombreDisplay: string;     // "Kinder F1"
  
  // Configuración de aparatos
  aparatos: AparatoGeneral[];
  aparatoActual: AparatoGeneral;
  aparatoNumero: number;
  totalAparatos: number;
  
  // Resultados
  gimnastas: GimnastaResultado[];
  
  // Estado
  iniciada: boolean;
  finalizada: boolean;
  enVivo: boolean;
  
  // Metadatos
  subdivision?: string;
  totalParticipantes: number;
  ultimaActualizacion: string;
  
  // Configuración de visualización
  modoVisualizacion: 'aparatos' | 'allaround' | 'equipos';
}

// ===== RESULTADO POR EQUIPOS =====
export interface ResultadoEquipo {
  // Identificación del equipo
  id: string;
  nombre: string;              // Nombre del club/delegación
  club: string;
  delegacion: string;
  
  // ✅ CATEGORÍA DEL EQUIPO
  categoria: CategoriaBase;
  nivelTecnico?: NivelTecnico;
  franja: FranjaCompetencia;
  tipo: TipoGimnasia;
  competenciaDisplay: string;
  
  // Integrantes
  gimnastas: {
    gimnastaId: string;
    nombre: string;
    allAround: number;
    posicionIndividual: number;
    contribuyeAlEquipo: boolean;  // Los mejores N puntajes cuentan
  }[];
  
  // Resultados del equipo
  puntajeEquipo: number;        // Suma de los mejores puntajes
  posicionEquipo: number;
  
  // Por aparato
  puntajesAparatos: {
    [aparato: string]: {
      puntajeEquipo: number;
      posicionEquipo: number;
      mejoresPuntajes: {
        gimnastaId: string;
        nombre: string;
        puntaje: number;
      }[];
    };
  };
  
  // Configuración
  gimnastasQueCuentan: number;   // Ej: mejores 3 de 5
  totalGimnastas: number;
}

// ===== ACTUALIZACIÓN EN TIEMPO REAL =====
export interface ActualizacionTiempoReal {
  // Tipo de actualización
  tipo: 'puntaje_nuevo' | 'ranking_actualizado' | 'categoria_finalizada' | 'aparato_cambiado';
  
  // Datos de la actualización
  campeonatoId: string;
  categoriaId: string;
  timestamp: string;
  
  // Datos específicos según el tipo
  data: {
    gimnastaId?: string;
    aparato?: AparatoGeneral;
    puntaje?: number;
    nuevasPosiciones?: { gimnastaId: string; posicion: number }[];
    categoriaNuevoEstado?: 'iniciada' | 'finalizada' | 'pausada';
    nuevoAparato?: AparatoGeneral;
  };
  
  // Metadatos
  esUltimaActualizacion: boolean;
  requiereRecarga: boolean;     // Si necesita recargar toda la vista
}

// ===== FILTROS Y CONFIGURACIÓN =====
export interface ResultadosFilters {
  // ✅ FILTROS ACTUALIZADOS
  categoria: CategoriaBase | 'todas';
  nivelTecnico: NivelTecnico | 'todos';
  franja: FranjaCompetencia | 'todas';
  tipo: TipoGimnasia | 'todos';
  
  // Estado
  soloEnVivo: boolean;
  soloFinalizadas: boolean;
  
  // Búsqueda
  searchTerm: string;
  
  // Visualización
  modoVisualizacion: 'aparatos' | 'allaround' | 'equipos';
  soloTop: number | null;       // null = todos, 3 = solo top 3, etc.
}

export interface ResultadosConfig {
  // Configuración de usuario
  modoVisualizacionPreferido: 'aparatos' | 'allaround' | 'equipos';
  actualizacionAutomatica: boolean;
  notificacionesPush: boolean;
  
  // Configuración de la app
  intervaloActualizacion: number;   // milliseconds
  limitePorPagina: number;
  mostrarPuntajesDecimales: boolean;
}

// ===== PROPS PARA COMPONENTES =====
export interface LiveCampeonatoCardProps {
  campeonato: CampeonatoEnVivo;
  onPress?: (campeonato: CampeonatoEnVivo) => void;
  onViewLive?: (campeonato: CampeonatoEnVivo) => void;
  compact?: boolean;
}

export interface CategorySelectorProps {
  campeonatoId: string;
  categoriasDisponibles: CategoriaActiva[];
  onCategoriaSelect: (categoria: CategoriaActiva) => void;
  isLoading?: boolean;
}

export interface LiveResultsProps {
  campeonatoId: string;
  categoriaId: string;
  modoVisualizacion?: 'aparatos' | 'allaround' | 'equipos';
  soloTop?: number;
}

export interface ResultadosTableProps {
  resultados: ResultadosCategoria;
  modoVisualizacion: 'aparatos' | 'allaround' | 'equipos';
  soloTop?: number;
  isPro: boolean;
  onGimnastaPress?: (gimnasta: GimnastaResultado) => void;
}

export interface CompactResultCardProps {
  gimnasta: GimnastaResultado;
  position: number;
  aparatoActual: string;
  vistaSeleccionada: 'aparatos' | 'allaround' | 'equipos';
  isHighlighted?: boolean;
  onPress?: (gimnasta: GimnastaResultado) => void;
}

// ===== TIPOS PARA API/SERVICIO =====
export interface GetCampeonatosEnVivoRequest {
  limit?: number;
  soloActivos?: boolean;
  incluirFinalizados?: boolean;
}

export interface GetCampeonatosEnVivoResponse {
  campeonatos: CampeonatoEnVivo[];
  totalCount: number;
  ultimaActualizacion: string;
}

export interface GetResultadosCategoriaRequest {
  campeonatoId: string;
  categoriaId: string;
  modoVisualizacion?: 'aparatos' | 'allaround' | 'equipos';
  soloTop?: number;
  incluirHistorial?: boolean;
}

export interface GetResultadosCategoriaResponse {
  resultados: ResultadosCategoria;
  equipos?: ResultadoEquipo[];
  actualizacionesRecientes?: ActualizacionTiempoReal[];
}

export interface WebSocketSubscriptionParams {
  campeonatoId: string;
  categoriaId: string;
  tipoActualizaciones: ('puntajes' | 'rankings' | 'estado')[];
}

// ===== ESTADOS DE COMPONENTES =====
export interface ResultadosScreenState {
  campeonatosEnVivo: CampeonatoEnVivo[];
  filteredCampeonatos: CampeonatoEnVivo[];
  filters: Pick<ResultadosFilters, 'searchTerm' | 'soloEnVivo'>;
  
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // WebSocket
  isConnected: boolean;
  lastUpdate: string;
}

export interface LiveResultsScreenState {
  resultados: ResultadosCategoria | null;
  equipos: ResultadoEquipo[];
  
  // Configuración de vista
  vistaSeleccionada: 'aparatos' | 'allaround' | 'equipos';
  soloTop: number | null;
  
  // Estados
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // WebSocket
  isConnected: boolean;
  actualizacionesRecientes: ActualizacionTiempoReal[];
  
  // UI
  showUpgradeBanner: boolean;
}

export interface CategorySelectorScreenState {
  campeonato: CampeonatoEnVivo | null;
  categorias: CategoriaActiva[];
  
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// ===== HELPER FUNCTIONS =====

/**
 * Construye el nombre display para una categoría en resultados
 */
export const construirCategoriaDisplay = (
  categoria: CategoriaBase,
  nivelTecnico: NivelTecnico | undefined,
  franja: FranjaCompetencia,
  formato: 'completo' | 'corto' | 'display' = 'display'
): string => {
  const tieneNivel = nivelTecnico && (categoria === 'Kinder' || categoria === 'USAG');
  
  switch (formato) {
    case 'completo':
      return tieneNivel ? `${categoria} ${nivelTecnico} ${franja}` : `${categoria} ${franja}`;
    case 'corto':
      return tieneNivel ? `${categoria} ${nivelTecnico.replace('Nivel ', '')} ${franja}` : `${categoria} ${franja}`;
    case 'display':
      return tieneNivel ? `${categoria} ${nivelTecnico.replace('Nivel ', '')} ${franja}` : `${categoria} ${franja}`;
    default:
      return tieneNivel ? `${categoria} ${franja}` : `${categoria} ${franja}`;
  }
};

/**
 * Determina si un gimnasta está en el podium
 */
export const estaEnPodium = (posicion: number): boolean => {
  return posicion >= 1 && posicion <= 3;
};

/**
 * Formatea un puntaje para mostrar
 */
export const formatearPuntaje = (puntaje: number | null, decimales: number = 1): string => {
  if (puntaje === null || puntaje === undefined) return '--';
  return puntaje.toFixed(decimales);
};

/**
 * Calcula el progreso de una categoría
 */
export const calcularProgreso = (aparatoNumero: number, totalAparatos: number): number => {
  return Math.round((aparatoNumero / totalAparatos) * 100);
};

/**
 * Determina el color de posición para UI
 */
export const getColorPosicion = (posicion: number): 'gold' | 'silver' | 'bronze' | 'default' => {
  switch (posicion) {
    case 1: return 'gold';
    case 2: return 'silver'; 
    case 3: return 'bronze';
    default: return 'default';
  }
};