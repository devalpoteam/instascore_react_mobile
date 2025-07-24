// src/features/gimnastas/types/gimnastasList.types.ts

export interface GimnastaListItem {
  id: string;
  nombre: string;
  club: string;
  rut: string;
  año: number;
  
  // Mejor resultado histórico (para mostrar en la lista)
  mejorPosicion: number;
  mejorAllAround: number;
  
  // Último campeonato (más reciente)
  ultimoCampeonato: {
    id: string;
    nombre: string;
    categoria: string;
    nivel: string;
    posicion: number;
    allAround: number;
    fecha: string; // Para ordenar por más reciente
  };
  
  // Para búsqueda y filtros
  historialCampeonatos: string[]; // IDs de campeonatos donde participó
  categoriasCompetidas: string[]; // ["Kinder", "Mini", "Juvenil"]
  clubes: string[]; // En caso de que haya cambiado de club
  
  // Metadata para optimización
  searchString: string; // nombre + club + campeonatos (para búsqueda rápida)
  esMedallista: boolean; // true si tiene al menos una posición 1-3
  activo: boolean; // true si compitió en los últimos 6 meses
}

export interface GimnastaFilters {
  searchTerm: string;
  campeonatoId: string | null;
  categoria: string | null;
  soloMedallistas: boolean;
  soloActivos: boolean;
  club: string | null;
}

export interface GimnastasListState {
  gimnastas: GimnastaListItem[];
  filteredGimnastas: GimnastaListItem[];
  filters: GimnastaFilters;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
}

// Props para componentes
export interface GimnastaCardProps {
  gimnasta: GimnastaListItem;
  onPress: (gimnasta: GimnastaListItem) => void;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export interface FilterChipsProps {
  filters: GimnastaFilters;
  onFilterChange: (filters: Partial<GimnastaFilters>) => void;
  availableCampeonatos: Array<{id: string, nombre: string, count: number}>;
  availableCategorias: Array<{categoria: string, count: number}>;
  availableClubes: Array<{club: string, count: number}>;
}

export interface GimnastasListScreenProps {
  // Props de navegación si las necesitamos
  onGimnastaSelect?: (gimnastaId: string) => void;
}

// Tipos para la API/Service
export interface GetGimnastasRequest {
  page?: number;
  limit?: number;
  search?: string;
  campeonatoId?: string;
  categoria?: string;
  soloMedallistas?: boolean;
  club?: string;
}

export interface GetGimnastasResponse {
  gimnastas: GimnastaListItem[];
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}