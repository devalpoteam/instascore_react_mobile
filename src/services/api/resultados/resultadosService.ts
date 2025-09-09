// src/services/api/resultados/resultadosService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface ResultadoIndividualAPI {
  aparato: string;
  gimnasta: string;
  delegacion: string;
  categoria: string;
  nivel: string;
  franja: string;
  subdivision: string;
  puntaje: number;
  puesto: number;
  IdCampeonato: string;
  IdCategoria: string;
  IdNivel: string;
  IdFranja: string;
  nombreCampeonato: string;
  IdParticipante: string;
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
  categoria: string;
  nivel: string;
  franja: string;
  subdivision: string;
  puntaje: number;
  puesto: number;
  idCampeonato: string;
  idCategoria: string;
  idNivel: string;
  idFranja: string;
  nombreCampeonato: string;
  idParticipante: string;
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
  participanteId?: string;
  modalidad?: 'aparato' | 'all around';
}

interface RankingCompletoAPI {
  idParticipante: string;
  nombre: string;
  delegacion: string;
  categoria: string;
  nivel: string;
  franja: string;
  aparato: string;
  puntaje: number;
  puesto: number;
  subdivision: string;
  campeonatoId: string;
  nombreCampeonato: string;
}

interface GetRankingParams {
  campeonatoId: string;
  participanteId: string;
}

export const resultadosService = {
  async getResultadosIndividuales({
    campeonatoId, categoriaId, nivelId, franjaId, participanteId, modalidad = 'aparato'
  }: GetResultadosParams): Promise<ResultadoIndividual[]> {
    try {
      const queryParams = new URLSearchParams({
        campeonatoId,
        modalidad,          // <<--- USAR EL PARAMETRO
        categoriaId,
        nivelId,
        franjaId
      });

      if (participanteId) {
        queryParams.append('participanteId', participanteId);
      }

      const response = await apiClient.get<ResultadoIndividualAPI[]>(
        `${API_CONFIG.ENDPOINTS.RESULTADOS.INDIVIDUALES}?${queryParams.toString()}`
      );

      return response.data.map(resultado => ({
        aparato: resultado.aparato,
        gimnasta: resultado.gimnasta,
        delegacion: resultado.delegacion,
        categoria: resultado.categoria,
        nivel: resultado.nivel,
        franja: resultado.franja,
        subdivision: resultado.subdivision,
        puntaje: resultado.puntaje,
        puesto: resultado.puesto,
        idCampeonato: resultado.IdCampeonato,
        idCategoria: resultado.IdCategoria,
        idNivel: resultado.IdNivel,
        idFranja: resultado.IdFranja,
        nombreCampeonato: resultado.nombreCampeonato,
        idParticipante: resultado.IdParticipante
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
  },

  async getRankingCompleto({ campeonatoId, participanteId }: GetRankingParams): Promise<ResultadoIndividual[]> {
    try {
      const queryParams = new URLSearchParams({
        campeonatoId,
        participanteId
      });

      const url = `${API_CONFIG.ENDPOINTS.RESULTADOS.RANKING_COMPLETO}?${queryParams.toString()}`;
      console.log('Making request to:', url);

      const response = await apiClient.get<RankingCompletoAPI[]>(url);
      
      console.log('Raw API response:', response.data);

      return response.data.map(resultado => ({
        aparato: resultado.aparato,
        gimnasta: resultado.nombre,
        delegacion: resultado.delegacion,
        categoria: resultado.categoria,
        nivel: resultado.nivel,
        franja: resultado.franja,
        subdivision: resultado.subdivision,
        puntaje: resultado.puntaje,
        puesto: resultado.puesto,
        idCampeonato: resultado.campeonatoId,
        idCategoria: '',
        idNivel: '',
        idFranja: '',
        nombreCampeonato: resultado.nombreCampeonato,
        idParticipante: resultado.idParticipante
      }));
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar ranking completo');
    }
  }
};

export type { ResultadoIndividual, ResultadoEquipo, GetResultadosParams, GetRankingParams };