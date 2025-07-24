// src/features/gimnastas/data/mockGimnastas.ts
import { GimnastaProfile, AparatoGAF } from '../types/gimnastas.types';

export const mockGimnastaProfile: GimnastaProfile = {
  id: "1",
  nombre: "Rosalía Agustín Franch",
  club: "Delegación de Matías",
  rut: "64785821-3",
  año: 2016,
  categoria: "Kinder",
  nivel: "F1",
  franja: "F1",
  subdivision: "A",
  campeonato: "Copa Valparaíso 2025",
  puntajes: {
    salto: 8.5,
    asimetricas: 8.2,
    viga: 8.0,
    suelo: 8.8,
  } as Record<AparatoGAF, number>,
  allAround: 33.5,
  posicion: 1,
  posicionAparatos: {
    salto: 1,
    asimetricas: 2,
    viga: 3,
    suelo: 1,
  } as Record<AparatoGAF, number>,
};

export const mockGimnastasAdicionales: GimnastaProfile[] = [
  {
    id: "2",
    nombre: "Aurelia Benavente Estrada",
    club: "Club Gimnástico Valparaíso",
    rut: "39414500-9",
    año: 2015,
    categoria: "Kinder",
    nivel: "F1",
    franja: "F1",
    subdivision: "A",
    campeonato: "Copa Valparaíso 2025",
    puntajes: {
      salto: 8.2,
      asimetricas: 8.4,
      viga: 7.8,
      suelo: 8.3,
    } as Record<AparatoGAF, number>,
    allAround: 32.7,
    posicion: 2,
    posicionAparatos: {
      salto: 2,
      asimetricas: 1,
      viga: 4,
      suelo: 3,
    } as Record<AparatoGAF, number>,
  },
  {
    id: "3",
    nombre: "Amanda Desiderio Izquierdo",
    club: "Academia Deportiva Santiago",
    rut: "71519924-9",
    año: 2016,
    categoria: "Kinder",
    nivel: "F1",
    franja: "F1",
    subdivision: "B",
    campeonato: "Copa Valparaíso 2025",
    puntajes: {
      salto: 8.1,
      asimetricas: 7.9,
      viga: 8.2,
      suelo: 8.1,
    } as Record<AparatoGAF, number>,
    allAround: 32.3,
    posicion: 3,
    posicionAparatos: {
      salto: 3,
      asimetricas: 3,
      viga: 2,
      suelo: 4,
    } as Record<AparatoGAF, number>,
  },
];

export const getRandomGimnasta = (): GimnastaProfile => {
  const allGimnastas = [mockGimnastaProfile, ...mockGimnastasAdicionales];
  const randomIndex = Math.floor(Math.random() * allGimnastas.length);
  return allGimnastas[randomIndex];
};