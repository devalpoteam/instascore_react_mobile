// src/features/gimnastas/types/gimnastas.types.ts

// Tipos específicos para aparatos
export type AparatoGAF = 'salto' | 'asimetricas' | 'viga' | 'suelo';
export type AparatoGAM = 'suelo' | 'arzones' | 'anillas' | 'salto' | 'paralelas' | 'barra';

export interface GimnastaProfile {
  id: string;
  nombre: string;
  club: string;
  rut: string;
  año: number;
  categoria: string;
  nivel: string;
  franja: string;
  subdivision: string;
  campeonato: string;
  puntajes: Record<AparatoGAF, number>;
  allAround: number;
  posicion: number;
  posicionAparatos: Record<AparatoGAF, number>;
}

export interface GimnastaListItem {
  id: string;
  nombre: string;
  club: string;
  categoria: string;
  nivel: string;
  posicion: number;
  allAround: number;
  campeonato: string;
}

export interface GimnastaHistorial {
  campeonatoId: string;
  campeonatoNombre: string;
  fecha: string;
  categoria: string;
  posicion: number;
  allAround: number;
  puntajes: {
    [aparato: string]: number;
  };
}

export interface GimnastaSearchFilters {
  searchTerm: string;
  categoria: string;
  club: string;
  campeonato: string;
}