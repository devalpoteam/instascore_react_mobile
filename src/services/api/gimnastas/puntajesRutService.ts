// src/services/api/gimnastas/puntajesRutService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface PuntajesRutApiResponse {
  campeonatoId: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  participante: {
    idParticipante: string;
    nombre: string;
    delegacion: string;
  };
}

interface CampeonatoParticipacion {
  campeonatoId: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  participante: {
    idParticipante: string;
    nombre: string;
    delegacion: string;
  };
}

class PuntajesRutService {
  async getCampeonatosPorRut(rut: string): Promise<CampeonatoParticipacion[]> {
    try {
      const response = await apiClient.get<PuntajesRutApiResponse[]>(
        `${API_CONFIG.ENDPOINTS.GIMNASTAS.PUNTAJES_POR_RUT}?rut=${rut}`
      );

      return response.data.map(item => this.mapApiResponseToCampeonato(item));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar campeonatos del participante';
      throw new Error(errorMessage);
    }
  }

  private mapApiResponseToCampeonato(apiData: PuntajesRutApiResponse): CampeonatoParticipacion {
    return {
      campeonatoId: apiData.campeonatoId,
      nombre: apiData.nombre,
      fechaInicio: apiData.fechaInicio,
      fechaFin: apiData.fechaFin,
      estado: apiData.estado,
      participante: {
        idParticipante: apiData.participante.idParticipante,
        nombre: apiData.participante.nombre,
        delegacion: apiData.participante.delegacion,
      }
    };
  }
}

export const puntajesRutService = new PuntajesRutService();
export type { CampeonatoParticipacion };