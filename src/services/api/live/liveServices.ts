// src/services/api/live/liveServices.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

// Interfaces locales para la API
interface CampeonatoActivoApiResponse {
  id: string;
  nombre: string;
  estado: string;
  lugar: string;
  hora: string;
}

interface CategoriaAgrupadaApiResponse {
  categorias: {
    [grupo: string]: {
      grupo: string;
      nivel: string;
      franja: string;
      disciplina: string;
      numeroParticipantes: number;
      numeroCategoria: number;
    }[];
  };
}

interface CampeonatoDetalleApiResponse {
  id: string;
  nombre: string;
  estado: string;
  lugar: string;
  fecha: string;
  numeroDelegaciones: number;
  numeroParticipantes: number;
  numeroCategorias: number;
}

// Interfaces para la app
interface CampeonatoEnVivo {
  id: string;
  nombre: string;
  lugar: string;
  horaInicio: string;
  categoriasActivas: CategoriaActiva[];
  totalCategorias: number;
  categoriasFinalizadas: number;
  participantesTotales: number;
}

interface CategoriaActiva {
  id: string;
  nombre: string;
  tipo: 'GAF' | 'GAM';
  aparatoActual: string;
  aparatoNumero: number;
  totalAparatos: number;
  participantesActivos: number;
}

interface CategoriaAgrupada {
  grupo: string;
  nivel: string;
  franja: string;
  disciplina: 'GAF' | 'GAM';
  numeroParticipantes: number;
  numeroCategoria: number;
  id: string;
}

export const liveService = {
  getCampeonatosActivos: async (): Promise<CampeonatoEnVivo[]> => {
    try {
      const response = await apiClient.get<CampeonatoActivoApiResponse[]>(
        API_CONFIG.ENDPOINTS.LIVE.CAMPEONATOS_ACTIVOS
      );

      const campeonatos = response.data.map(campeonato => ({
        id: campeonato.id,
        nombre: campeonato.nombre,
        lugar: campeonato.lugar,
        horaInicio: extraerHora(campeonato.hora),
        categoriasActivas: [],
        totalCategorias: 0,
        categoriasFinalizadas: 0,
        participantesTotales: 0,
      }));

      return campeonatos;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar campeonatos en vivo');
    }
  },

  getCategoriasAgrupadas: async (campeonatoId: string): Promise<CategoriaAgrupada[]> => {
    try {
      const response = await apiClient.get<CategoriaAgrupadaApiResponse>(
        `${API_CONFIG.ENDPOINTS.LIVE.CATEGORIAS_AGRUPADAS}/${campeonatoId}`
      );

      const categorias: CategoriaAgrupada[] = [];
      
      Object.entries(response.data.categorias).forEach(([grupo, categoriasGrupo]) => {
        categoriasGrupo.forEach((categoria, index) => {
          categorias.push({
            grupo: categoria.grupo,
            nivel: categoria.nivel,
            franja: categoria.franja,
            disciplina: mapearDisciplina(categoria.disciplina),
            numeroParticipantes: categoria.numeroParticipantes,
            numeroCategoria: categoria.numeroCategoria,
            id: `${campeonatoId}_${grupo}_${index}`,
          });
        });
      });

      return categorias;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar categorías del campeonato');
    }
  },

  getCampeonatoDetalle: async (campeonatoId: string): Promise<CampeonatoDetalleApiResponse> => {
    try {
      const response = await apiClient.get<CampeonatoDetalleApiResponse>(
        `${API_CONFIG.ENDPOINTS.LIVE.CAMPEONATO_BY_ID}/${campeonatoId}`
      );

      return response.data;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar detalle del campeonato');
    }
  }
};

// Funciones auxiliares
const extraerHora = (fechaCompleta: string): string => {
  try {
    const fecha = new Date(fechaCompleta);
    return fecha.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } catch (error) {
    return fechaCompleta;
  }
};

const mapearDisciplina = (disciplina: string): 'GAF' | 'GAM' => {
  return disciplina === 'GAM' ? 'GAM' : 'GAF';
};