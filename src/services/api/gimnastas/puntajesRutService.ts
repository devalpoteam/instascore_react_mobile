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
    categoriaId?: string;
    nivelId?: string;
    franjaId?: string;
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
    categoriaId?: string;
    nivelId?: string;
    franjaId?: string;
  };
}

class PuntajesRutService {
  async getCampeonatosPorRut(rut: string): Promise<CampeonatoParticipacion[]> {
    try {
      // Usar el endpoint que devuelve todos los participantes por campeonato
      const response = await apiClient.get<Record<string, any[]>>(
        `${API_CONFIG.ENDPOINTS.GIMNASTAS.TODOS}`
      );

      const campeonatosParticipante: CampeonatoParticipacion[] = [];

      // Buscar en todos los campeonatos por el RUT específico
      Object.entries(response.data).forEach(([campeonatoId, participantes]) => {
        const participante = participantes.find(p => p.rut === rut);
        if (participante) {
          campeonatosParticipante.push({
            campeonatoId: campeonatoId,
            nombre: participante.nombreCampeonato,
            fechaInicio: participante.fecha,
            fechaFin: participante.fecha,
            estado: new Date(participante.fecha).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long' 
            }).replace(/^\w/, c => c.toUpperCase()),
            participante: {
              idParticipante: participante.id,
              nombre: participante.nombre,
              delegacion: participante.club,
              categoriaId: undefined, // Se obtendrá del perfil específico
              nivelId: undefined,
              franjaId: undefined,
            }
          });
        }
      });

      return campeonatosParticipante;
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
        categoriaId: apiData.participante.categoriaId,
        nivelId: apiData.participante.nivelId,
        franjaId: apiData.participante.franjaId,
      }
    };
  }
}

export const puntajesRutService = new PuntajesRutService();
export type { CampeonatoParticipacion };