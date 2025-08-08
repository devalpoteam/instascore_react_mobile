// src/features/resultados/data/mockLiveResultsData.ts
// VERSIÓN CORREGIDA - Compatible con tipos existentes

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
  competenciaDisplay?: string;
  posicion: number;
  posicionAparatos: {
    [aparato: string]: number;
  };
}

export interface ResultadosCategoria {
  campeonatoId: string;
  campeonatoNombre: string;
  categoriaId: string;
  categoriaNombreCorto: string;
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

// Nueva interfaz para equipos
export interface EquipoResultado {
  id: string;
  nombre: string; // Nombre del club/delegación
  club: string;
  totalGimnastas: number;
  gimnastasQueCuentan: number; // Mejores N
  puntajeEquipo: number; // Suma de los mejores puntajes
  posicion: number;
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

// Función para generar RUT chileno válido
function generarRUT(): string {
  const numero = Math.floor(Math.random() * 99999999) + 1000000;
  const rutSinDV = numero.toString();
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    suma += parseInt(rutSinDV[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dv = 11 - (suma % 11);
  const digitoVerificador = dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
  
  return `${numero}-${digitoVerificador}`;
}

// ✅ DATOS MOCK REALISTAS - KINDER F1 GAF (4 aparatos)
export const mockResultadosKinderF1: ResultadosCategoria = {
  campeonatoId: "1",
  campeonatoNombre: "Copa Valparaíso 2024",
  categoriaId: "cat1",
  categoriaNombreCorto: "Kinder F1",
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
      rut: generarRUT(),
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
      rut: generarRUT(),
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
      rut: generarRUT(),
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
    }
  ].concat(
    // Generar más gimnastas para usuarios Pro
    Array.from({ length: 13 }, (_, index) => ({
      id: (index + 4).toString(),
      nombre: nombres[index + 3] || `Gimnasta ${index + 4}`,
      club: clubes[index % clubes.length],
      rut: generarRUT(),
      año: 2015 + Math.floor(Math.random() * 3),
      categoria: "Kinder",
      nivel: "F1",
      franja: "F1",
      subdivision: index % 2 === 0 ? "A" : "B",
      puntajes: {
        salto: generarPuntaje("salto", "Kinder"),
        asimetricas: generarPuntaje("asimetricas", "Kinder"),
        viga: generarPuntaje("viga", "Kinder"),
        suelo: generarPuntaje("suelo", "Kinder"),
      },
      allAround: Math.round((
        generarPuntaje("salto", "Kinder") + 
        generarPuntaje("asimetricas", "Kinder") + 
        generarPuntaje("viga", "Kinder") + 
        generarPuntaje("suelo", "Kinder")
      ) * 10) / 10,
      posicion: index + 4,
      posicionAparatos: {
        salto: Math.floor(Math.random() * 16) + 1,
        asimetricas: Math.floor(Math.random() * 16) + 1,
        viga: Math.floor(Math.random() * 16) + 1,
        suelo: Math.floor(Math.random() * 16) + 1,
      },
    }))
  )
};

// ✅ DATOS MOCK - JUVENIL MASCULINO GAM (6 aparatos)
export const mockResultadosJuvenilGAM: ResultadosCategoria = {
  campeonatoId: "2",
  campeonatoNombre: "Campeonato Nacional Juvenil",
  categoriaId: "cat3",
  categoriaNombreCorto: "Juvenil Masculino",
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
      rut: generarRUT(),
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
      rut: generarRUT(),
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
      rut: generarRUT(),
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

// ✅ DATOS MOCK PARA EQUIPOS
export const mockEquiposResultados: EquipoResultado[] = [
  {
    id: 'eq1',
    nombre: 'Delegación de Matías',
    club: 'Delegación de Matías',
    totalGimnastas: 4,
    gimnastasQueCuentan: 3,
    puntajeEquipo: 98.5,
    posicion: 1
  },
  {
    id: 'eq2',
    nombre: 'Club Gimnástico Valparaíso',
    club: 'Club Gimnástico Valparaíso', 
    totalGimnastas: 3,
    gimnastasQueCuentan: 3,
    puntajeEquipo: 96.8,
    posicion: 2
  },
  {
    id: 'eq3',
    nombre: 'Academia Deportiva Santiago',
    club: 'Academia Deportiva Santiago',
    totalGimnastas: 4,
    gimnastasQueCuentan: 3,
    puntajeEquipo: 94.2,
    posicion: 3
  },
  {
    id: 'eq4',
    nombre: 'Escuela de Gimnasia Elite',
    club: 'Escuela de Gimnasia Elite',
    totalGimnastas: 3,
    gimnastasQueCuentan: 3,
    puntajeEquipo: 92.1,
    posicion: 4
  },
  {
    id: 'eq5',
    nombre: 'Club Artístico Las Condes',
    club: 'Club Artístico Las Condes',
    totalGimnastas: 2,
    gimnastasQueCuentan: 2,
    puntajeEquipo: 89.7,
    posicion: 5
  },
  {
    id: 'eq6',
    nombre: 'Gimnasia Integral Viña',
    club: 'Gimnasia Integral Viña',
    totalGimnastas: 3,
    gimnastasQueCuentan: 3,
    puntajeEquipo: 87.3,
    posicion: 6
  }
];

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