// src/features/campeonatos/types/campeonatos.types.ts
// TIPOS ACTUALIZADOS CON LA NUEVA ESTRUCTURA JERÁRQUICA

import { CampeonatoEstado } from '@/core/types/competition.types';

// ===== INTERFACE PRINCIPAL DE CAMPEONATO =====
export interface Campeonato {
  // Identificación básica
  id: string;
  nombre: string;
  lugar: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  estado: CampeonatoEstado;
  activo: boolean;
  
  // Estadísticas generales
  categorias: number;           // Número total de categorías
  participantes: number;        // Número total de participantes
  delegaciones: number;         // Número de clubes/delegaciones
  
  // Información adicional
  descripcion?: string;
  organizador?: string;
  contacto?: string;
  
  // ✅ NUEVOS CAMPOS PARA MEJOR GESTIÓN
  tipoCompetencia?: 'regional' | 'nacional' | 'internacional' | 'interclubes' | 'escolar';
  modalidades?: ('GAF' | 'GAM')[];  // Qué modalidades incluye
  edadMinima?: number;              // Edad mínima de participantes
  edadMaxima?: number;              // Edad máxima de participantes
  
  // Estados detallados
  inscripcionesAbiertas?: boolean;
  resultadosPublicados?: boolean;
  transmisionEnVivo?: boolean;
  
  // Metadatos
  fechaCreacion?: string;
  ultimaActualizacion?: string;
}

// ===== DETALLES EXTENDIDOS DE CAMPEONATO =====
export interface CampeonatoDetallado extends Campeonato {
  // ✅ CATEGORÍAS CON ESTRUCTURA JERÁRQUICA
  categoriasDetalle: CategoriaCompetencia[];
  
  // Participantes organizados
  delegacionesDetalle: DelegacionParticipante[];
  
  // Cronograma
  cronograma: EventoCronograma[];
  
  // Estadísticas detalladas
  estadisticas: EstadisticasCampeonato;
  
  // Configuración
  configuracion: ConfiguracionCampeonato;
}

// ===== CATEGORÍA DE COMPETENCIA =====
export interface CategoriaCompetencia {
  // Identificación
  id: string;
  
  // ✅ JERARQUÍA CORRECTA
  categoria: string;              // "Kinder", "USAG", "Juvenil", etc.
  nivel?: string;                 // "Nivel 1", "Nivel 2", etc. (opcional)
  franja: string;                 // "F1", "F2", "M1", etc.
  modalidad: 'GAF' | 'GAM';       // Gimnasia Artística Femenina/Masculina
  
  // Para display
  nombreCompleto: string;         // "Kinder Nivel 1 F1"
  nombreCorto: string;            // "Kinder 1 F1"
  nombreDisplay: string;          // Para UI: "Kinder F1"
  
  // Configuración de aparatos
  aparatos: string[];             // Lista de aparatos para esta categoría
  totalAparatos: number;          // Número total de aparatos
  
  // Participación
  participantes: number;
  equipos: number;
  delegaciones: string[];         // IDs de delegaciones participantes
  
  // Estado de competencia
  estado: 'pendiente' | 'en_curso' | 'finalizada';
  aparatoActual?: string;         // Si está en curso
  aparatoNumero?: number;         // Rotación actual (1, 2, 3, etc.)
  
  // Cronograma
  horaInicio?: string;
  horaEstimadaFin?: string;
  fechaCompetencia: string;
  
  // Configuración específica
  subdivision?: string;           // "A", "B" para dividir grupos grandes
  formatoCompetencia: 'individual' | 'equipos' | 'mixto';
  
  // Metadatos
  orden: number;                  // Orden de competencia en el campeonato
  activa: boolean;
}

// ===== DELEGACIÓN PARTICIPANTE =====
export interface DelegacionParticipante {
  id: string;
  nombre: string;
  club: string;
  region?: string;
  ciudad?: string;
  
  // Participantes
  gimnastas: GimnastaParticipante[];
  entrenadores: string[];
  responsable: string;
  contacto?: string;
  
  // Categorías en las que participa
  categoriasParticipantes: string[]; // IDs de categorías
  
  // Estadísticas
  totalParticipantes: number;
  medallasEsperadas?: number;
  
  // Estado
  inscripcionConfirmada: boolean;
  documentosCompletos: boolean;
  pagosAlDia: boolean;
}

// ===== GIMNASTA PARTICIPANTE =====
export interface GimnastaParticipante {
  id: string;
  nombre: string;
  rut: string;
  año: number;
  
  // ✅ CATEGORÍA CON JERARQUÍA
  categoria: string;
  nivel?: string;
  franja: string;
  modalidad: 'GAF' | 'GAM';
  competenciaDisplay: string;     // "Kinder 2 F1"
  
  // Información adicional
  subdivision?: string;
  dorsal?: string;               // Número de competencia
  orden?: number;                // Orden de rotación
  
  // Estado
  inscrito: boolean;
  documentosCompletos: boolean;
  aptoBairreau: boolean;
  
  // Metadatos
  experienciaPreviaCompetencias?: number;
  mejorPuntajeHistorico?: number;
}

// ===== EVENTO DEL CRONOGRAMA =====
export interface EventoCronograma {
  id: string;
  tipo: 'competencia' | 'calentamiento' | 'ceremonia' | 'descanso' | 'almuerzo';
  titulo: string;
  descripcion?: string;
  
  // Tiempo
  fechaInicio: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada: number;       // En minutos
  
  // Relacionado con categorías
  categoriaId?: string;
  aparato?: string;
  
  // Ubicación
  lugar?: string;
  sala?: string;
  
  // Estado
  completado: boolean;
  enCurso: boolean;
  
  // Orden
  orden: number;
}

// ===== ESTADÍSTICAS DEL CAMPEONATO =====
export interface EstadisticasCampeonato {
  // Participación general
  totalGimnastas: number;
  totalDelegaciones: number;
  totalCategorias: number;
  
  // Por modalidad
  participantesGAF: number;
  participantesGAM: number;
  
  // Por categoría base
  distribucionCategorias: {
    categoria: string;
    participantes: number;
    porcentaje: number;
  }[];
  
  // Por región/ciudad
  distribucionRegional: {
    region: string;
    delegaciones: number;
    gimnastas: number;
  }[];
  
  // Edades
  edadPromedio: number;
  edadMinima: number;
  edadMaxima: number;
  
  // Clubes
  clubConMasParticipantes: string;
  maxParticipantesPorClub: number;
  
  // Progreso
  categoriasFinalizadas: number;
  porcentajeProgreso: number;
  
  // Rendimiento (si hay resultados)
  promedioAllAround?: number;
  mejorPuntaje?: {
    gimnasta: string;
    categoria: string;
    puntaje: number;
    aparato?: string;
  };
}

// ===== CONFIGURACIÓN DEL CAMPEONATO =====
export interface ConfiguracionCampeonato {
  // Reglas de competencia
  formatoPuntuacion: 'FIG' | 'USAG' | 'Nacional';
  decimalesPuntaje: number;
  puntajeMaximo: number;
  puntajeMinimo: number;
  
  // Equipos
  integrantesPorEquipo: number;
  puntajesQueCuentan: number;      // Ej: mejores 3 de 5
  
  // Cronometraje
  tiempoCalentamiento: number;     // En minutos
  tiempoRotacion: number;          // En minutos
  tiempoDescanso: number;          // En minutos
  
  // Premiación
  premiarTop: number;              // Premiar top N (ej: 3 para podium)
  medallasPorCategoria: boolean;
  medallasPorAparato: boolean;
  medallasAllAround: boolean;
  medallasEquipos: boolean;
  
  // Transmisión
  transmisionEnVivo: boolean;
  resultadosPublicos: boolean;
  notificacionesPush: boolean;
  
  // Configuraciones técnicas
  aparatosPorCategoria: {
    [categoria: string]: string[];
  };
  ordenAparatos: {
    GAF: string[];
    GAM: string[];
  };
}

// ===== FILTROS PARA CAMPEONATOS =====
export interface CampeonatoFilters {
  // Búsqueda general
  searchTerm: string;
  
  // Estados
  estado: 'todos' | CampeonatoEstado;
  soloActivos: boolean;
  conTransmision: boolean;
  
  // Fechas
  fechaDesde?: string;
  fechaHasta?: string;
  soloProximos: boolean;
  
  // Tipo
  tipoCompetencia?: 'regional' | 'nacional' | 'internacional' | 'interclubes' | 'escolar' | 'todos';
  modalidades?: ('GAF' | 'GAM')[];
  
  // Ubicación
  region?: string;
  ciudad?: string;
  
  // Ordenamiento
  sortBy: 'fecha' | 'nombre' | 'estado' | 'participantes';
  sortOrder: 'asc' | 'desc';
}

// ===== PROPS PARA COMPONENTES =====
export interface CampeonatoListProps {
  campeonatos: Campeonato[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onCampeonatoPress?: (campeonato: Campeonato) => void;
  onViewResults?: (campeonato: Campeonato) => void;
}

export interface CampeonatoCardProps {
  campeonato: Campeonato;
  onPress?: (campeonato: Campeonato) => void;
  onViewResults?: (campeonato: Campeonato) => void;
  showStats?: boolean;
  compact?: boolean;
}

export interface CampeonatoDetailProps {
  campeonatoId: string;
  campeonato?: CampeonatoDetallado;
  isLoading?: boolean;
}

export interface CampeonatoFiltersProps {
  filters: CampeonatoFilters;
  onFiltersChange: (filters: CampeonatoFilters) => void;
  totalCount: number;
  availableRegions?: string[];
  availableCities?: string[];
}

export interface CategoriaCompetenciaCardProps {
  categoria: CategoriaCompetencia;
  onPress?: (categoria: CategoriaCompetencia) => void;
  onViewResults?: (categoria: CategoriaCompetencia) => void;
  showProgress?: boolean;
}

// ===== ESTADOS DE COMPONENTES =====
export interface CampeonatosScreenState {
  campeonatos: Campeonato[];
  filteredCampeonatos: Campeonato[];
  filters: CampeonatoFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Metadatos para filtros
  availableRegions: string[];
  availableCities: string[];
  availableTypes: string[];
}

export interface CampeonatoDetailScreenState {
  campeonato: CampeonatoDetallado | null;
  categoriaSeleccionada: CategoriaCompetencia | null;
  
  // Tabs de la pantalla
  activeTab: 'info' | 'categorias' | 'participantes' | 'cronograma' | 'estadisticas';
  
  // Estados
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// ===== TIPOS PARA API/SERVICIO =====
export interface GetCampeonatosRequest {
  // Paginación
  page?: number;
  limit?: number;
  
  // Filtros
  estado?: CampeonatoEstado;
  tipoCompetencia?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  modalidades?: string[];
  region?: string;
  
  // Búsqueda
  search?: string;
  
  // Ordenamiento
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  // Opciones
  includeStats?: boolean;
  soloActivos?: boolean;
}

export interface GetCampeonatosResponse {
  campeonatos: Campeonato[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  
  // Metadatos para filtros
  availableFilters: {
    estados: { estado: CampeonatoEstado; count: number }[];
    tipos: { tipo: string; count: number }[];
    regiones: { region: string; count: number }[];
    modalidades: { modalidad: string; count: number }[];
  };
}

export interface GetCampeonatoDetailRequest {
  campeonatoId: string;
  includeCategorias?: boolean;
  includeParticipantes?: boolean;
  includeCronograma?: boolean;
  includeEstadisticas?: boolean;
}

export interface GetCampeonatoDetailResponse {
  campeonato: CampeonatoDetallado;
}

// ===== FUNCIONES HELPER =====

/**
 * Determina si un campeonato está activo (en curso)
 */
export const esCampeonatoActivo = (campeonato: Campeonato): boolean => {
  const hoy = new Date();
  const fechaInicio = new Date(campeonato.fechaInicio);
  const fechaFin = new Date(campeonato.fechaFin);
  
  return campeonato.estado === 'activo' && 
         hoy >= fechaInicio && 
         hoy <= fechaFin;
};

/**
 * Determina si un campeonato es próximo (en las siguientes 2 semanas)
 */
export const esCampeonatoProximo = (campeonato: Campeonato): boolean => {
  const hoy = new Date();
  const fechaInicio = new Date(campeonato.fechaInicio);
  const dosSemanasAdelante = new Date();
  dosSemanasAdelante.setDate(hoy.getDate() + 14);
  
  return fechaInicio >= hoy && fechaInicio <= dosSemanasAdelante;
};

/**
 * Calcula el progreso de un campeonato (% de categorías finalizadas)
 */
export const calcularProgresoCampeonato = (campeonato: CampeonatoDetallado): number => {
  if (!campeonato.categoriasDetalle || campeonato.categoriasDetalle.length === 0) {
    return 0;
  }
  
  const finalizadas = campeonato.categoriasDetalle.filter(c => c.estado === 'finalizada').length;
  return Math.round((finalizadas / campeonato.categoriasDetalle.length) * 100);
};

/**
 * Obtiene el estado visual de un campeonato para la UI
 */
export const getEstadoVisual = (campeonato: Campeonato): {
  color: 'green' | 'blue' | 'gray' | 'orange';
  texto: string;
  icono: string;
} => {
  switch (campeonato.estado) {
    case 'activo':
      return {
        color: 'green',
        texto: 'En Curso',
        icono: 'play-circle'
      };
    case 'configuracion':
      return {
        color: 'orange',
        texto: 'Próximo',
        icono: 'calendar'
      };
    case 'finalizado':
      return {
        color: 'gray',
        texto: 'Finalizado',
        icono: 'checkmark-circle'
      };
    default:
      return {
        color: 'blue',
        texto: 'Desconocido',
        icono: 'help-circle'
      };
  }
};

/**
 * Formatea las fechas de un campeonato para mostrar
 */
export const formatearFechasCampeonato = (campeonato: Campeonato): string => {
  const fechaInicio = new Date(campeonato.fechaInicio);
  const fechaFin = new Date(campeonato.fechaFin);
  
  // Si es el mismo día
  if (fechaInicio.toDateString() === fechaFin.toDateString()) {
    return fechaInicio.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Si son días diferentes
  return `${fechaInicio.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short'
  })} - ${fechaFin.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })}`;
};