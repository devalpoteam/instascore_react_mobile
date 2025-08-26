// src/services/api/resultados/resultadosService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface ResultadoIndividualAPI {
  aparato: string;
  gimnasta: string;
  delegacion: string;
  nivel: string;
  franja: string;
  subdivision: string;
  puntaje: number;
  puesto: number;
}

interface ResultadoEquipoAPI {
  aparato: string;
  delegacion: string;
  cantidadGimnastas: number;
  cantidadMejores: number;
  allAroundEquipo: number;
  categoria: string;
  nivel: string;
  puesto: number;
}

interface ResultadoIndividual {
  aparato: string;
  gimnasta: string;
  delegacion: string;
  nivel: string;
  franja: string;
  subdivision: string;
  puntaje: number;
  puesto: number;
}

interface ResultadoEquipo {
  id: string;
  nombre: string;
  categoria: string;
  nivel: string;
  cantidadGimnastas: number;
  cantidadMejores: number;
  puntajeEquipo: number;
  posicion: number;
}

interface GetResultadosParams {
  campeonatoId: string;
  categoriaId: string;
  nivelId: string;
  franjaId: string;
}

export const resultadosService = {
  async getResultadosIndividuales({ campeonatoId, categoriaId, nivelId, franjaId }: GetResultadosParams): Promise<ResultadoIndividual[]> {
    try {
      const queryParams = new URLSearchParams({
        campeonatoId,
        modalidad: 'aparato',
        categoriaId,
        nivelId,
        franjaId
      });

      const response = await apiClient.get<ResultadoIndividualAPI[]>(
        `${API_CONFIG.ENDPOINTS.RESULTADOS.INDIVIDUALES}?${queryParams.toString()}`
      );

      return response.data.map(resultado => ({
        aparato: resultado.aparato,
        gimnasta: resultado.gimnasta,
        delegacion: resultado.delegacion,
        nivel: resultado.nivel,
        franja: resultado.franja,
        subdivision: resultado.subdivision,
        puntaje: resultado.puntaje,
        puesto: resultado.puesto
      }));
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar resultados individuales');
    }
  },

  async getResultadosEquipos({ campeonatoId, categoriaId, nivelId, franjaId }: GetResultadosParams): Promise<ResultadoEquipo[]> {
    try {
      const queryParams = new URLSearchParams({
        campeonatoId,
        categoriaId,
        nivelId,
        franjaId
      });

      const response = await apiClient.get<ResultadoEquipoAPI[]>(
        `${API_CONFIG.ENDPOINTS.RESULTADOS.EQUIPOS}?${queryParams.toString()}`
      );

      return response.data.map(equipo => ({
        id: `${equipo.delegacion}_${equipo.categoria}_${equipo.nivel}`.replace(/\s+/g, '_'),
        nombre: equipo.delegacion,
        categoria: equipo.categoria,
        nivel: equipo.nivel,
        cantidadGimnastas: equipo.cantidadGimnastas,
        cantidadMejores: equipo.cantidadMejores,
        puntajeEquipo: equipo.allAroundEquipo,
        posicion: equipo.puesto
      }));
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar resultados de equipos');
    }
  }
};

export type { ResultadoIndividual, ResultadoEquipo, GetResultadosParams };