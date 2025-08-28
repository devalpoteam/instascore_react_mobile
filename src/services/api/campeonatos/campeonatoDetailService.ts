// src/services/api/campeonatos/campeonatoDetailService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface CampeonatoDetailApiResponse {
  id: string;
  nombre: string;
  lugar: string | null;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  numeroDelegaciones: number;
  numeroParticipantes: number;
  numeroCategorias: number;
}

interface CampeonatoDetail {
  id: string;
  nombre: string;
  lugar: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  estado: 'activo' | 'configuracion' | 'finalizado';
  categorias: number;
  participantes: number;
  delegaciones: number;
}

export const campeonatoDetailService = {
  getCampeonatoById: async (id: string): Promise<CampeonatoDetail> => {
    try {
      const response = await apiClient.get<CampeonatoDetailApiResponse>(
        `${API_CONFIG.ENDPOINTS.HOME.CAMPEONATOS}/GetById?id=${id}`
      );

      return transformarCampeonatoDetail(response.data);
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      
      if (error.response?.status === 404) {
        throw new Error('Campeonato no encontrado');
      }
      
      throw new Error('Error al cargar el campeonato');
    }
  }
};

const transformarCampeonatoDetail = (api: CampeonatoDetailApiResponse): CampeonatoDetail => {
  return {
    id: api.id,
    nombre: api.nombre,
    lugar: api.lugar || 'Lugar por definir',
    fechaInicio: api.fechaInicio.split('T')[0],
    fechaFin: api.fechaFin.split('T')[0],
    horaInicio: extractHoraInicio(api.fechaInicio),
    estado: mapearEstado(api.estado),
    categorias: api.numeroCategorias,
    participantes: api.numeroParticipantes,
    delegaciones: api.numeroDelegaciones,
  };
};

const mapearEstado = (estadoApi: string): 'activo' | 'configuracion' | 'finalizado' => {
  switch (estadoApi) {
    case 'Campeonato':
      return 'activo';
    case 'En corrección':
      return 'configuracion';
    case 'Finalizado':
      return 'finalizado';
    default:
      return 'configuracion';
  }
};

const extractHoraInicio = (fechaInicio: string): string => {
  try {
    const fecha = new Date(fechaInicio);
    return fecha.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return '09:00';
  }
};