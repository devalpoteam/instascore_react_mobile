// src/services/api/gimnastas/gimnastaProfileService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface GimnastaPerfilApiResponse {
  id: string;
  nombre: string;
  rut: string;
  delegacion: string;
  anioNacimiento: number;
  ultimoCampeonato: {
    fecha: string;
    categoria: string;
    categoriaId: string;
    nivel: string;
    nivelId: string;
    franja: string;
    franjaId: string;
    puesto: number;
    AllAround: number;
  };
}

interface GimnastaPerfil {
  id: string;
  nombre: string;
  rut: string;
  club: string;
  año: number;
  categoria: string;
  nivel: string;
  franja: string;
  ultimoCampeonato: {
    fecha: string;
    categoria: string;
    nivel: string;
    franja: string;
    posicion: number;
    allAround: number;
  };
}

class GimnastaProfileService {
  async getGimnastaPerfil(gimnastaId: string): Promise<GimnastaPerfil> {
    try {
      const response = await apiClient.get<GimnastaPerfilApiResponse>(
        `${API_CONFIG.ENDPOINTS.GIMNASTAS.PERFIL}/${gimnastaId}/perfil`
      );

      return this.mapApiResponseToProfile(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar perfil del gimnasta';
      throw new Error(errorMessage);
    }
  }

  private mapApiResponseToProfile(apiData: GimnastaPerfilApiResponse): GimnastaPerfil {
    return {
      id: apiData.id,
      nombre: apiData.nombre,
      rut: apiData.rut,
      club: apiData.delegacion,
      año: apiData.anioNacimiento,
      categoria: apiData.ultimoCampeonato.categoria,
      nivel: apiData.ultimoCampeonato.nivel,
      franja: apiData.ultimoCampeonato.franja,
      ultimoCampeonato: {
        fecha: apiData.ultimoCampeonato.fecha,
        categoria: apiData.ultimoCampeonato.categoria,
        nivel: apiData.ultimoCampeonato.nivel,
        franja: apiData.ultimoCampeonato.franja,
        posicion: apiData.ultimoCampeonato.puesto,
        allAround: apiData.ultimoCampeonato.AllAround,
      }
    };
  }
}

export const gimnastaProfileService = new GimnastaProfileService();
export type { GimnastaPerfil };