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
      IdCampeonato: string;
      IdCategoria: string;
      IdNivel: string;
      IdFranja: string;
      IdDivision: string;
      nivel: string;
      franja: string;
      division: string;
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

// ✅ INTERFACE ACTUALIZADA CON LOS NUEVOS IDs DE LA API
interface CategoriaAgrupada {
  grupo: string;
  // ✅ NUEVOS CAMPOS ID REALES DE LA BASE DE DATOS
  idCampeonato: string;
  idCategoria: string;
  idNivel: string;
  idFranja: string;
  idDivision: string;
  nivel: string;
  franja: string;
  division: string;
  disciplina: 'GAF' | 'GAM';
  numeroParticipantes: number;
  numeroCategoria: number;
  // ✅ ID COMPUESTO PARA IDENTIFICACIÓN ÚNICA EN LA APP
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

  getParticipantesPorSubdivision: async (idFranja: string): Promise<number> => {
    try {
      const response = await apiClient.get<Array<{
        Nombrefranja: string;
        Subdivision: string;
        numeroParticipantes: number;
      }>>(
        `/api/Divisiones/ParticipantesPorSubdivision?idFranja=${idFranja}`
      );
      
      // Sumar todos los participantes de todas las subdivisiones
      const totalParticipantes = response.data?.reduce((total, subdivision) => {
        return total + (subdivision.numeroParticipantes || 0);
      }, 0) || 0;
      
      return totalParticipantes;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar participantes por subdivisión');
    }
  },

  // ✅ MÉTODO ACTUALIZADO PARA MANEJAR LOS NUEVOS IDs
  getCategoriasAgrupadas: async (campeonatoId: string): Promise<CategoriaAgrupada[]> => {
    try {
      const response = await apiClient.get<CategoriaAgrupadaApiResponse>(
        `${API_CONFIG.ENDPOINTS.LIVE.CATEGORIAS_AGRUPADAS}/${campeonatoId}`
      );

      const categorias: CategoriaAgrupada[] = [];
      
      Object.entries(response.data.categorias).forEach(([grupo, categoriasGrupo]) => {
        categoriasGrupo.forEach((categoria) => {
          categorias.push({
            grupo: categoria.grupo,
            // ✅ MAPEAR LOS NUEVOS CAMPOS ID
            idCampeonato: categoria.IdCampeonato,
            idCategoria: categoria.IdCategoria,
            idNivel: categoria.IdNivel,
            idFranja: categoria.IdFranja,
            idDivision: categoria.IdDivision,
            nivel: categoria.nivel,
            franja: categoria.franja,
            division: categoria.division,
            disciplina: mapearDisciplina(categoria.disciplina),
            numeroParticipantes: categoria.numeroParticipantes,
            numeroCategoria: categoria.numeroCategoria,
            id: `${categoria.IdCampeonato}_${categoria.IdCategoria}_${categoria.IdNivel}_${categoria.IdFranja}_${categoria.IdDivision}`,
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

// ✅ EXPORTAR EL TIPO ACTUALIZADO
export type { CategoriaAgrupada };