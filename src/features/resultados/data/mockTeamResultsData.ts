// src/features/resultados/data/mockTeamResultsData.ts
import { ResultadosCategoria } from './mockLiveResultsData';

export interface GimnastaEquipo {
  id: string;
  nombre: string;
  allAround: number;
  posicionIndividual: number;
  puntajes: Record<string, number>;
  contribuyeAlEquipo: boolean; // Los mejores N puntajes cuentan
}

export interface ResultadoEquipo {
  id: string;
  nombre: string; // Nombre del club/delegación
  club: string;
  delegacion: string;
  
  // Integrantes del equipo
  gimnastas: GimnastaEquipo[];
  
  // Resultados del equipo
  puntajeEquipo: number; // Suma de los mejores puntajes
  posicionEquipo: number;
  
  // Por aparato (opcional para vista detallada)
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
  gimnastasQueCuentan: number; // Ej: mejores 3 de 5
  totalGimnastas: number;
}

// Mock data para equipos - Kinder F1
export const mockEquiposKinderF1: ResultadoEquipo[] = [
  {
    id: 'equipo1',
    nombre: 'Delegación de Matías',
    club: 'Delegación de Matías',
    delegacion: 'Delegación de Matías',
    puntajeEquipo: 98.5,
    posicionEquipo: 1,
    gimnastasQueCuentan: 3,
    totalGimnastas: 4,
    gimnastas: [
      {
        id: '1',
        nombre: 'Rosalía Agustín Franch',
        allAround: 33.5,
        posicionIndividual: 1,
        contribuyeAlEquipo: true,
        puntajes: { salto: 8.5, asimetricas: 8.2, viga: 8.0, suelo: 8.8 }
      },
      {
        id: '4',
        nombre: 'Catalina Moreno Silva',
        allAround: 32.8,
        posicionIndividual: 4,
        contribuyeAlEquipo: true,
        puntajes: { salto: 8.3, asimetricas: 8.1, viga: 8.1, suelo: 8.3 }
      },
      {
        id: '7',
        nombre: 'Valentina Torres López',
        allAround: 32.2,
        posicionIndividual: 7,
        contribuyeAlEquipo: true,
        puntajes: { salto: 8.1, asimetricas: 7.9, viga: 8.0, suelo: 8.2 }
      },
      {
        id: '12',
        nombre: 'Sofía Mendoza Castro',
        allAround: 30.5,
        posicionIndividual: 12,
        contribuyeAlEquipo: false,
        puntajes: { salto: 7.8, asimetricas: 7.5, viga: 7.6, suelo: 7.6 }
      }
    ],
    puntajesAparatos: {
      salto: {
        puntajeEquipo: 24.9,
        posicionEquipo: 1,
        mejoresPuntajes: [
          { gimnastaId: '1', nombre: 'Rosalía Agustín Franch', puntaje: 8.5 },
          { gimnastaId: '4', nombre: 'Catalina Moreno Silva', puntaje: 8.3 },
          { gimnastaId: '7', nombre: 'Valentina Torres López', puntaje: 8.1 }
        ]
      },
      asimetricas: {
        puntajeEquipo: 24.2,
        posicionEquipo: 1,
        mejoresPuntajes: [
          { gimnastaId: '1', nombre: 'Rosalía Agustín Franch', puntaje: 8.2 },
          { gimnastaId: '4', nombre: 'Catalina Moreno Silva', puntaje: 8.1 },
          { gimnastaId: '7', nombre: 'Valentina Torres López', puntaje: 7.9 }
        ]
      },
      viga: {
        puntajeEquipo: 24.1,
        posicionEquipo: 2,
        mejoresPuntajes: [
          { gimnastaId: '4', nombre: 'Catalina Moreno Silva', puntaje: 8.1 },
          { gimnastaId: '1', nombre: 'Rosalía Agustín Franch', puntaje: 8.0 },
          { gimnastaId: '7', nombre: 'Valentina Torres López', puntaje: 8.0 }
        ]
      },
      suelo: {
        puntajeEquipo: 25.3,
        posicionEquipo: 1,
        mejoresPuntajes: [
          { gimnastaId: '1', nombre: 'Rosalía Agustín Franch', puntaje: 8.8 },
          { gimnastaId: '4', nombre: 'Catalina Moreno Silva', puntaje: 8.3 },
          { gimnastaId: '7', nombre: 'Valentina Torres López', puntaje: 8.2 }
        ]
      }
    }
  },
  {
    id: 'equipo2',
    nombre: 'Club Gimnástico Valparaíso',
    club: 'Club Gimnástico Valparaíso',
    delegacion: 'Club Gimnástico Valparaíso',
    puntajeEquipo: 96.8,
    posicionEquipo: 2,
    gimnastasQueCuentan: 3,
    totalGimnastas: 3,
    gimnastas: [
      {
        id: '2',
        nombre: 'Aurelia Benavente Estrada',
        allAround: 32.7,
        posicionIndividual: 2,
        contribuyeAlEquipo: true,
        puntajes: { salto: 8.2, asimetricas: 8.4, viga: 7.8, suelo: 8.3 }
      },
      {
        id: '6',
        nombre: 'Isabella Ruiz Hernández',
        allAround: 32.1,
        posicionIndividual: 6,
        contribuyeAlEquipo: true,
        puntajes: { salto: 8.0, asimetricas: 8.0, viga: 8.2, suelo: 7.9 }
      },
      {
        id: '9',
        nombre: 'Camila Vargas Rojas',
        allAround: 32.0,
        posicionIndividual: 9,
        contribuyeAlEquipo: true,
        puntajes: { salto: 7.9, asimetricas: 7.8, viga: 8.1, suelo: 8.2 }
      }
    ],
    puntajesAparatos: {
      salto: {
        puntajeEquipo: 24.1,
        posicionEquipo: 2,
        mejoresPuntajes: [
          { gimnastaId: '2', nombre: 'Aurelia Benavente Estrada', puntaje: 8.2 },
          { gimnastaId: '6', nombre: 'Isabella Ruiz Hernández', puntaje: 8.0 },
          { gimnastaId: '9', nombre: 'Camila Vargas Rojas', puntaje: 7.9 }
        ]
      },
      asimetricas: {
        puntajeEquipo: 24.2,
        posicionEquipo: 2,
        mejoresPuntajes: [
          { gimnastaId: '2', nombre: 'Aurelia Benavente Estrada', puntaje: 8.4 },
          { gimnastaId: '6', nombre: 'Isabella Ruiz Hernández', puntaje: 8.0 },
          { gimnastaId: '9', nombre: 'Camila Vargas Rojas', puntaje: 7.8 }
        ]
      },
      viga: {
        puntajeEquipo: 24.1,
        posicionEquipo: 1,
        mejoresPuntajes: [
          { gimnastaId: '6', nombre: 'Isabella Ruiz Hernández', puntaje: 8.2 },
          { gimnastaId: '9', nombre: 'Camila Vargas Rojas', puntaje: 8.1 },
          { gimnastaId: '2', nombre: 'Aurelia Benavente Estrada', puntaje: 7.8 }
        ]
      },
      suelo: {
        puntajeEquipo: 24.4,
        posicionEquipo: 2,
        mejoresPuntajes: [
          { gimnastaId: '2', nombre: 'Aurelia Benavente Estrada', puntaje: 8.3 },
          { gimnastaId: '9', nombre: 'Camila Vargas Rojas', puntaje: 8.2 },
          { gimnastaId: '6', nombre: 'Isabella Ruiz Hernández', puntaje: 7.9 }
        ]
      }
    }
  },
  {
    id: 'equipo3',
    nombre: 'Academia Deportiva Santiago',
    club: 'Academia Deportiva Santiago',
    delegacion: 'Academia Deportiva Santiago',
    puntajeEquipo: 94.2,
    posicionEquipo: 3,
    gimnastasQueCuentan: 3,
    totalGimnastas: 4,
    gimnastas: [
      {
        id: '3',
        nombre: 'Amanda Desiderio Izquierdo',
        allAround: 32.3,
        posicionIndividual: 3,
        contribuyeAlEquipo: true,
        puntajes: { salto: 8.1, asimetricas: 7.9, viga: 8.2, suelo: 8.1 }
      },
      {
        id: '8',
        nombre: 'Javiera González',
        allAround: 31.2,
        posicionIndividual: 8,
        contribuyeAlEquipo: true,
        puntajes: { salto: 7.8, asimetricas: 7.7, viga: 7.9, suelo: 7.8 }
      },
      {
        id: '11',
        nombre: 'Antonia Silva',
        allAround: 30.7,
        posicionIndividual: 11,
        contribuyeAlEquipo: true,
        puntajes: { salto: 7.7, asimetricas: 7.6, viga: 7.7, suelo: 7.7 }
      },
      {
        id: '15',
        nombre: 'Esperanza Flores',
        allAround: 29.8,
        posicionIndividual: 15,
        contribuyeAlEquipo: false,
        puntajes: { salto: 7.4, asimetricas: 7.3, viga: 7.5, suelo: 7.6 }
      }
    ],
    puntajesAparatos: {
      salto: {
        puntajeEquipo: 23.6,
        posicionEquipo: 3,
        mejoresPuntajes: [
          { gimnastaId: '3', nombre: 'Amanda Desiderio Izquierdo', puntaje: 8.1 },
          { gimnastaId: '8', nombre: 'Javiera González', puntaje: 7.8 },
          { gimnastaId: '11', nombre: 'Antonia Silva', puntaje: 7.7 }
        ]
      },
      asimetricas: {
        puntajeEquipo: 23.2,
        posicionEquipo: 3,
        mejoresPuntajes: [
          { gimnastaId: '3', nombre: 'Amanda Desiderio Izquierdo', puntaje: 7.9 },
          { gimnastaId: '8', nombre: 'Javiera González', puntaje: 7.7 },
          { gimnastaId: '11', nombre: 'Antonia Silva', puntaje: 7.6 }
        ]
      },
      viga: {
        puntajeEquipo: 23.8,
        posicionEquipo: 3,
        mejoresPuntajes: [
          { gimnastaId: '3', nombre: 'Amanda Desiderio Izquierdo', puntaje: 8.2 },
          { gimnastaId: '8', nombre: 'Javiera González', puntaje: 7.9 },
          { gimnastaId: '11', nombre: 'Antonia Silva', puntaje: 7.7 }
        ]
      },
      suelo: {
        puntajeEquipo: 23.6,
        posicionEquipo: 3,
        mejoresPuntajes: [
          { gimnastaId: '3', nombre: 'Amanda Desiderio Izquierdo', puntaje: 8.1 },
          { gimnastaId: '8', nombre: 'Javiera González', puntaje: 7.8 },
          { gimnastaId: '11', nombre: 'Antonia Silva', puntaje: 7.7 }
        ]
      }
    }
  }
];

export const formatearPuntajeEquipo = (puntaje: number): string => {
  return puntaje.toFixed(1);
};