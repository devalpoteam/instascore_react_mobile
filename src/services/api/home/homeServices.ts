// src/services/api/home/homeServices.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface CampeonatoApiResponse {
  id: string;
  nombre: string;
  estado: string;
  lugar: string;
  fecha: string;
  numeroDelegaciones: number;
  numeroParticipantes: number;
  numeroCategorias: number;
}

interface CampeonatoHome {
  id: string;
  nombre: string;
  estado: 'activo' | 'configuracion' | 'finalizado';
  lugar: string;
  fecha: string;
  delegaciones: number;
  participantes: number;
  categorias: number;
}

interface CampeonatosHomeResponse {
  enVivo: CampeonatoHome | null;
  proximo: CampeonatoHome | null;
  finalizado: CampeonatoHome | null;
}

export const homeService = {
  getCampeonatosHome: async (): Promise<CampeonatosHomeResponse> => {
    try {
      const response = await apiClient.get<CampeonatoApiResponse[]>(
        API_CONFIG.ENDPOINTS.HOME.CAMPEONATOS
      );

      const campeonatos = response.data.map(campeonato => ({
        id: campeonato.id,
        nombre: campeonato.nombre,
        estado: mapearEstado(campeonato.estado),
        lugar: campeonato.lugar,
        fecha: campeonato.fecha,
        delegaciones: campeonato.numeroDelegaciones,
        participantes: campeonato.numeroParticipantes,
        categorias: campeonato.numeroCategorias,
      }));

      const enVivo = encontrarCampeonatoEnVivo(campeonatos);
      const proximo = encontrarCampeonatoProximo(campeonatos);
      const finalizado = encontrarCampeonatoFinalizado(campeonatos);

      return { enVivo, proximo, finalizado };
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar campeonatos');
    }
  }
};

const mapearEstado = (estadoApi: string): 'activo' | 'configuracion' | 'finalizado' => {
  switch (estadoApi) {
    case 'Campeonato':
      return 'activo';
    case 'En Corrección':
      return 'configuracion';
    case 'Finalizado':
      return 'finalizado';
    default:
      return 'configuracion';
  }
};

const encontrarCampeonatoEnVivo = (campeonatos: CampeonatoHome[]): CampeonatoHome | null => {
  const activos = campeonatos.filter(c => c.estado === 'activo');
  if (activos.length === 0) return null;
  
  return activos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
};

const encontrarCampeonatoProximo = (campeonatos: CampeonatoHome[]): CampeonatoHome | null => {
  const configuracion = campeonatos.filter(c => c.estado === 'configuracion');
  if (configuracion.length === 0) return null;
  
  return configuracion.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0];
};

const encontrarCampeonatoFinalizado = (campeonatos: CampeonatoHome[]): CampeonatoHome | null => {
  const finalizados = campeonatos.filter(c => c.estado === 'finalizado');
  if (finalizados.length === 0) return null;
  
  return finalizados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
};