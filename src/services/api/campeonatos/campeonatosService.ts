// src/services/api/campeonatos/campeonatosService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface CampeonatoApiResponse {
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

export const campeonatosService = {
  async getCampeonatos() {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.HOME.CAMPEONATOS
      );

      return response.data.map(transformarCampeonato);
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar campeonatos');
    }
  }
};

const transformarCampeonato = (api: CampeonatoApiResponse) => {
  return {
    id: api.id,
    nombre: api.nombre,
    lugar: api.lugar || 'Lugar por definir',
    fechaInicio: api.fechaInicio.split('T')[0],
    fechaFin: api.fechaFin.split('T')[0],
    horaInicio: '09:00',
    estado: mapearEstado(api.estado),
    categorias: api.numeroCategorias,
    participantes: api.numeroParticipantes,
    delegaciones: api.numeroDelegaciones,
    activo: mapearEstado(api.estado) === 'activo',
    organizador: 'Escuela de Gimnasia de Valparaíso',
    tipoCompetencia: 'regional',
    modalidades: ['GAF', 'GAM'],
    edadMinima: 5,
    edadMaxima: 25,
    inscripcionesAbiertas: false,
    resultadosPublicados: mapearEstado(api.estado) === 'finalizado',
    transmisionEnVivo: mapearEstado(api.estado) === 'activo',
    fechaCreacion: new Date().toISOString().split('T')[0],
    ultimaActualizacion: new Date().toISOString(),
  };
};

const mapearEstado = (estadoApi: string) => {
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