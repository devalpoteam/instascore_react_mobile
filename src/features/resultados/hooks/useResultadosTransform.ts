// src/features/resultados/hooks/useResultadosTransform.ts
import { useMemo } from 'react';
import { ResultadoIndividual } from '../../../services/api/resultados/resultadosService';

interface GimnastaAgrupado {
  id: string;
  nombre: string;
  delegacion: string;
  nivel: string;
  franja: string;
  subdivision: string;
  puntajes: Record<string, number>;
  allAround: number;
  posicionGeneral: number;
  posicionesPorAparato: Record<string, number>;
}

interface ResultadosTransformados {
  aparatos: string[];
  gimnastas: GimnastaAgrupado[];
  gimnastasAllAround: GimnastaAgrupado[];
  gimnastasPorAparato: Record<string, GimnastaAgrupado[]>;
}

export const useResultadosTransform = (resultados: ResultadoIndividual[]): ResultadosTransformados => {
  return useMemo(() => {
    if (!resultados.length) {
      return {
        aparatos: [],
        gimnastas: [],
        gimnastasAllAround: [],
        gimnastasPorAparato: {}
      };
    }

    const aparatos = [...new Set(resultados.map(r => r.aparato))].sort();
    
    const gimnastaMap = new Map<string, GimnastaAgrupado>();

    resultados.forEach((resultado) => {
      const key = `${resultado.gimnasta}_${resultado.delegacion}_${resultado.subdivision}`;
      
      if (!gimnastaMap.has(key)) {
        gimnastaMap.set(key, {
          id: key.replace(/\s+/g, '_'),
          nombre: resultado.gimnasta,
          delegacion: resultado.delegacion,
          nivel: resultado.nivel,
          franja: resultado.franja,
          subdivision: resultado.subdivision,
          puntajes: {},
          allAround: 0,
          posicionGeneral: 0,
          posicionesPorAparato: {}
        });
      }

      const gimnasta = gimnastaMap.get(key)!;
      gimnasta.puntajes[resultado.aparato] = resultado.puntaje;
      gimnasta.posicionesPorAparato[resultado.aparato] = resultado.puesto;
      gimnasta.allAround += resultado.puntaje;
    });

    const gimnastas = Array.from(gimnastaMap.values());

    const gimnastasAllAround = [...gimnastas]
      .sort((a, b) => b.allAround - a.allAround)
      .map((gimnasta, index) => ({
        ...gimnasta,
        posicionGeneral: index + 1
      }));

    const gimnastasPorAparato: Record<string, GimnastaAgrupado[]> = {};
    aparatos.forEach(aparato => {
      gimnastasPorAparato[aparato] = gimnastas
        .filter(g => g.puntajes[aparato] !== undefined)
        .sort((a, b) => a.posicionesPorAparato[aparato] - b.posicionesPorAparato[aparato]);
    });

    return {
      aparatos,
      gimnastas: gimnastasAllAround,
      gimnastasAllAround,
      gimnastasPorAparato
    };
  }, [resultados]);
};

export type { GimnastaAgrupado, ResultadosTransformados };