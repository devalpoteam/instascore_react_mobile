// src/services/api/gimnastas/gimnastasService.ts
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface GimnastaApiResponse {
  campeonatoId: string;
  id: string;
  nombre: string;
  año: number;
  rut: string;
  club: string;
  subdivision: string;
  categoria: string;
  franja: string;
  nivel: string;
  nombreCampeonato: string;
  fecha: string;
}

interface GimnastaListItem {
  id: string;
  nombre: string;
  rut: string;
  club: string;
  año: number;
  categoria: string;
  nivel: string;
  franja: string;
  subdivision: string;
  ultimoCampeonato: {
    id: string;
    nombre: string;
    categoria: string;
    nivel: string;
    fecha: string;
  };
  historialCampeonatos: string[];
  searchString: string;
}

interface GimnastasApiResponseGrouped {
  [campeonatoId: string]: GimnastaApiResponse[];
}

export const gimnastasService = {
  getTodosGimnastas: async (): Promise<GimnastaListItem[]> => {
    try {
      const response = await apiClient.get<GimnastasApiResponseGrouped>(
        API_CONFIG.ENDPOINTS.GIMNASTAS.TODOS
      );

      const gimnastasPlana: GimnastaApiResponse[] = [];
      
      Object.entries(response.data).forEach(([campeonatoId, gimnastasPorCampeonato]) => {
        if (Array.isArray(gimnastasPorCampeonato)) {
          gimnastasPlana.push(...gimnastasPorCampeonato);
        }
      });

      const gimnastasAgrupados = agruparPorGimnasta(gimnastasPlana);
      const gimnastasApp = gimnastasAgrupados.map(grupo => 
        convertirAGimnastaApp(grupo)
      );

      return gimnastasApp;
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar lista de gimnastas');
    }
  },

  buscarGimnastas: async (searchTerm: string): Promise<GimnastaListItem[]> => {
    try {
      const todosGimnastas = await gimnastasService.getTodosGimnastas();
      
      if (!searchTerm.trim()) {
        return todosGimnastas;
      }

      const termino = searchTerm.toLowerCase().trim();
      return todosGimnastas.filter(gimnasta => 
        gimnasta.searchString.includes(termino)
      );
    } catch (error: any) {
      throw new Error('Error al buscar gimnastas');
    }
  }
};

const agruparPorGimnasta = (gimnastas: GimnastaApiResponse[]): GimnastaApiResponse[][] => {
  const grupos: { [key: string]: GimnastaApiResponse[] } = {};
  
  gimnastas.forEach(gimnasta => {
    const clave = gimnasta.rut || `${gimnasta.nombre}_${gimnasta.club}`.toLowerCase();
    
    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(gimnasta);
  });

  return Object.values(grupos);
};

const convertirAGimnastaApp = (grupo: GimnastaApiResponse[]): GimnastaListItem => {
  const gimnastaOrdenado = grupo.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  
  const masReciente = gimnastaOrdenado[0];
  
  const elementosBusqueda = [
    masReciente.nombre,
    masReciente.club,
    masReciente.categoria,
    masReciente.nivel,
    masReciente.franja,
    masReciente.rut,
    ...grupo.map(g => g.nombreCampeonato)
  ];
  
  const searchString = elementosBusqueda
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return {
    id: masReciente.id,
    nombre: masReciente.nombre,
    rut: masReciente.rut,
    club: masReciente.club,
    año: masReciente.año,
    categoria: masReciente.categoria,
    nivel: masReciente.nivel,
    franja: masReciente.franja,
    subdivision: masReciente.subdivision,
    ultimoCampeonato: {
      id: masReciente.campeonatoId,
      nombre: masReciente.nombreCampeonato,
      categoria: masReciente.categoria,
      nivel: `${masReciente.categoria} ${masReciente.nivel}`,
      fecha: masReciente.fecha,
    },
    historialCampeonatos: [...new Set(grupo.map(g => g.campeonatoId))],
    searchString,
  };
};

export type { GimnastaListItem, GimnastaApiResponse };