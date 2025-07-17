// src/features/campeonatos/types/campeonatos.types.ts
export interface Campeonato {
  id: string;
  nombre: string;
  lugar: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  estado: CampeonatoEstado;
  categorias: number;
  participantes: number;
  delegaciones: number;
  descripcion?: string;
  activo: boolean;
}

export type CampeonatoEstado = 'activo' | 'configuracion' | 'finalizado';

export interface CampeonatoFilters {
  searchTerm: string;
  estado: 'todos' | CampeonatoEstado;
  sortBy: 'fecha' | 'nombre' | 'estado';
  sortOrder: 'asc' | 'desc';
}

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
}

export interface CampeonatoFiltersProps {
  filters: CampeonatoFilters;
  onFiltersChange: (filters: CampeonatoFilters) => void;
  totalCount: number;
}

// Estados de la vista
export interface CampeonatosScreenState {
  campeonatos: Campeonato[];
  filteredCampeonatos: Campeonato[];
  filters: CampeonatoFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}