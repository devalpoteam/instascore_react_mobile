// src/features/resultados/data/mockLiveResultsData.ts

import { TipoGimnasia, AparatoGAF, AparatoGAM } from "./mockLiveData";

export interface GimnastaResultado {
  id: string;
  nombre: string;
  club: string;
  rut: string;
  año: number;
  categoria: string;
  nivel: string;
  franja: string;
  subdivision: string;
  puntajes: {
    [aparato: string]: number | null; // null = no ha competido aún
  };
  allAround: number;
  posicion: number;
  posicionAparatos: {
    [aparato: string]: number;
  };
}

export interface ResultadosCategoria {
  campeonatoId: string;
  campeonatoNombre: string;
  categoriaId: string;
  categoriaNombre: string;
  tipo: TipoGimnasia;
  nivel: string;
  franja: string;
  aparatos: string[];
  aparatoActual: string;
  aparatoNumero: number;
  totalAparatos: number;
  gimnastas: GimnastaResultado[];
  ultimaActualizacion: string;
}

// Mock de clubes/delegaciones
const clubes = [
  "Delegación de Matías",
  "Delegación de Agustín",
  "Club Gimnástico Valparaíso",
  "Academia Deportiva Santiago",
  "Escuela de Gimnasia Elite",
  "Club Artístico Las Condes",
  "Gimnasia Integral Viña",
  "Centro Deportivo Maipú",
];

// Mock de nombres de gimnastas
const nombres = [
  "Rosalía Agustín Franch",
  "Aurelia Benavente Estrada",
  "Amanda Desiderio Izquierdo",
  "Leonor Segovia Garay",
  "Benigno Arnau Carlos",
  "Paula Alegre Cepeda",
  "Sonia Crespo Cornejo",
  "Aurora González Carreras",
  "Agapita Garay-Alvarado",
  "Mariano del Ramírez",
  "Rosaura Peralta Solsona",
  "Catalina Moreno Silva",
  "Valentina Torres López",
  "Isabella Ruiz Hernández",
  "Sofía Mendoza Castro",
  "Camila Vargas Rojas",
];

// Función para generar puntajes realistas
const generarPuntaje = (aparato: string, nivel: string): number => {
  let min = 6.0;
  let max = 9.5;

  // Ajustar rangos según nivel
  if (nivel.includes("1") || nivel.includes("Kinder")) {
    min = 7.0;
    max = 9.0;
  } else if (nivel.includes("2") || nivel.includes("3")) {
    min = 7.5;
    max = 9.3;
  }

  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// ✅ DATOS MOCK REALISTAS - KINDER F1 GAF (4 aparatos)
export const mockResultadosKinderF1: ResultadosCategoria = {
  campeonatoId: "1",
  campeonatoNombre: "Copa Valparaíso 2024",
  categoriaId: "cat1",
  categoriaNombre: "Kinder F1",
  tipo: "GAF",
  nivel: "Kinder",
  franja: "F1",
  aparatos: ["salto", "asimetricas", "viga", "suelo"],
  aparatoActual: "salto",
  aparatoNumero: 1,
  totalAparatos: 4,
  ultimaActualizacion: new Date().toISOString(),
  gimnastas: [
    {
      id: "1",
      nombre: "Rosalía Agustín Franch",
      club: "Delegación de Matías",
      rut: "64785821-3",
      año: 2016,
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: "A",
      puntajes: {
        salto: 8.5,
        asimetricas: 8.2,
        viga: 8.0,
        suelo: 8.8,
      },
      allAround: 33.5, // Suma de todos los aparatos
      posicion: 1,
      posicionAparatos: {
        salto: 1,
        asimetricas: 2,
        viga: 3,
        suelo: 1,
      },
    },
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
      puntajes: {
        salto: 8.2,
        asimetricas: 8.4,
        viga: 7.8,
        suelo: 8.3,
      },
      allAround: 32.7, // Suma de todos los aparatos
      posicion: 2,
      posicionAparatos: {
        salto: 2,
        asimetricas: 1,
        viga: 4,
        suelo: 3,
      },
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
      puntajes: {
        salto: 8.1,
        asimetricas: 7.9,
        viga: 8.2,
        suelo: 8.1,
      },
      allAround: 32.3, // Suma de todos los aparatos
      posicion: 3,
      posicionAparatos: {
        salto: 3,
        asimetricas: 3,
        viga: 2,
        suelo: 4,
      },
    },
    // Más gimnastas para usuarios Pro
    {
      id: "4",
      nombre: "Leonor Segovia Garay",
      club: "Escuela de Gimnasia Elite",
      rut: "10880249-9",
      año: 2015,
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: "A",
      puntajes: {
        salto: 7.9,
        asimetricas: 7.7,
        viga: 7.9,
        suelo: 8.4,
      },
      allAround: 31.9, // Suma de todos los aparatos
      posicion: 4,
      posicionAparatos: {
        salto: 4,
        asimetricas: 5,
        viga: 5,
        suelo: 2,
      },
    },
    {
      id: "5",
      nombre: "Paula Alegre Cepeda",
      club: "Club Artístico Las Condes",
      rut: "75246028-9",
      año: 2016,
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: "B",
      puntajes: {
        salto: 7.8,
        asimetricas: 8.0,
        viga: 7.5,
        suelo: 7.9,
      },
      allAround: 31.2, // Suma de todos los aparatos
      posicion: 5,
      posicionAparatos: {
        salto: 5,
        asimetricas: 4,
        viga: 7,
        suelo: 6,
      },
    },
    {
      id: "6",
      nombre: "Sonia Crespo Cornejo",
      club: "Gimnasia Integral Viña",
      rut: "48611181-2",
      año: 2015,
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: "A",
      puntajes: {
        salto: 7.7,
        asimetricas: 7.8,
        viga: 7.7,
        suelo: 8.0,
      },
      allAround: 31.2, // Suma de todos los aparatos
      posicion: 6,
      posicionAparatos: {
        salto: 6,
        asimetricas: 6,
        viga: 6,
        suelo: 5,
      },
    },
    {
      id: "7",
      nombre: "Aurora González Carreras",
      club: "Centro Deportivo Maipú",
      rut: "81674278-5",
      año: 2016,
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: "B",
      puntajes: {
        salto: 7.5,
        asimetricas: 7.6,
        viga: 8.1,
        suelo: 7.6,
      },
      allAround: 30.8, // Suma de todos los aparatos
      posicion: 7,
      posicionAparatos: {
        salto: 7,
        asimetricas: 7,
        viga: 1,
        suelo: 7,
      },
    },
    {
      id: "8",
      nombre: "Catalina Moreno Silva",
      club: "Delegación de Matías",
      rut: "92594607-3",
      año: 2015,
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: "A",
      puntajes: {
        salto: 7.4,
        asimetricas: 7.4,
        viga: 7.6,
        suelo: 7.7,
      },
      allAround: 30.1, // Suma de todos los aparatos
      posicion: 8,
      posicionAparatos: {
        salto: 8,
        asimetricas: 8,
        viga: 8,
        suelo: 8,
      },
    },
  ],
};

// ✅ DATOS MOCK - JUVENIL MASCULINO GAM (6 aparatos)
export const mockResultadosJuvenilGAM: ResultadosCategoria = {
  campeonatoId: "2",
  campeonatoNombre: "Campeonato Nacional Juvenil",
  categoriaId: "cat3",
  categoriaNombre: "Juvenil Masculino",
  tipo: "GAM",
  nivel: "Juvenil",
  franja: "M1",
  aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"],
  aparatoActual: "arzones",
  aparatoNumero: 2,
  totalAparatos: 6,
  ultimaActualizacion: new Date().toISOString(),
  gimnastas: [
    {
      id: "9",
      nombre: "Benigno Arnau Carlos",
      club: "Club Gimnástico Valparaíso",
      rut: "10880249-9",
      año: 2010,
      categoria: "Juvenil",
      nivel: "M1",
      franja: "M1",
      subdivision: "A",
      puntajes: {
        suelo: 8.1,
        arzones: 7.9,
        anillas: 8.3,
        salto: 8.4,
        paralelas: 8.0,
        barra: 8.2,
      },
      allAround: 48.9, // Suma de los 6 aparatos
      posicion: 1,
      posicionAparatos: {
        suelo: 2,
        arzones: 1,
        anillas: 1,
        salto: 1,
        paralelas: 2,
        barra: 1,
      },
    },
    {
      id: "10",
      nombre: "Mariano del Ramírez",
      club: "Academia Deportiva Santiago",
      rut: "79771262-4",
      año: 2009,
      categoria: "Juvenil",
      nivel: "M1",
      franja: "M1",
      subdivision: "B",
      puntajes: {
        suelo: 8.3,
        arzones: 7.6,
        anillas: 8.1,
        salto: 8.2,
        paralelas: 8.2,
        barra: 7.9,
      },
      allAround: 48.3, // Suma de los 6 aparatos
      posicion: 2,
      posicionAparatos: {
        suelo: 1,
        arzones: 2,
        anillas: 2,
        salto: 2,
        paralelas: 1,
        barra: 3,
      },
    },
    {
      id: "11",
      nombre: "Diego Fernández López",
      club: "Escuela de Gimnasia Elite",
      rut: "65432198-7",
      año: 2010,
      categoria: "Juvenil",
      nivel: "M1",
      franja: "M1",
      subdivision: "A",
      puntajes: {
        suelo: 7.8,
        arzones: 7.4,
        anillas: 7.9,
        salto: 8.0,
        paralelas: 7.8,
        barra: 8.0,
      },
      allAround: 46.9, // Suma de los 6 aparatos
      posicion: 3,
      posicionAparatos: {
        suelo: 3,
        arzones: 3,
        anillas: 3,
        salto: 3,
        paralelas: 3,
        barra: 2,
      },
    },
  ],
};

// Helper function para aparatos display
export const getAparatoDisplayNameResults = (aparato: string): string => {
  const aparatosDisplay: Record<string, string> = {
    salto: "Salto",
    asimetricas: "Asimétricas",
    viga: "Viga",
    suelo: "Suelo",
    arzones: "Arzones",
    anillas: "Anillas",
    paralelas: "Paralelas",
    barra: "Barra",
  };
  return aparatosDisplay[aparato] || aparato;
};

// Helper para formatear puntaje
export const formatearPuntaje = (puntaje: number | null): string => {
  if (puntaje === null) return "--";
  return puntaje.toFixed(1);
};
