// src/services/api/gimnastas/gimnastasService.ts - VERSION CORREGIDA
import apiClient from '../apiClient';
import API_CONFIG from '../../../core/config/api.config';

interface GimnastaApiResponse {
  campeonatoId: string;
  id: string;
  nombre: string;
  año: number;
  club: string;
  categoria: string;
  franja: string;
  nivel: string;
  nombreCampeonato: string;
  fecha: string;
}

interface GimnastaListItem {
  id: string;
  nombre: string;
  club: string;
  año: number;
  categoria: string;
  nivel: string;
  franja: string;
  ultimoCampeonato: {
    id: string;
    nombre: string;
    categoria: string;
    nivel: string;
    fecha: string;
  };
  historialCampeonatos: string[];
  searchString: string;
  esMedallista: boolean;
}

interface GimnastasApiResponseGrouped {
  [campeonatoId: string]: GimnastaApiResponse[];
}

// ✅ INTERFACES CORREGIDAS PARA API REAL
interface GimnastaPerfilApiResponse {
  id: string;
  nombre: string;
  delegacion: string;        // ← API usa "delegacion", no "club"
  anioNacimiento: number;    // ← API usa "anioNacimiento", no "año"
  ultimoCampeonato: {
    fecha: string;
    categoria: string;
    nivel: string;
    franja: string;
    posicionFinal: number;
    allAround: number;
  };
}

interface GimnastaPerfil {
  id: string;
  nombre: string;
  club: string;              // ← Mapeamos "delegacion" → "club"
  año: number;               // ← Mapeamos "anioNacimiento" → "año"
  categoria: string;
  nivel: string;
  franja: string;
  ultimoCampeonato: {
    fecha: string;
    categoria: string;
    nivel: string;
    franja: string;
    posicion: number;        // ← Mapeamos "posicionFinal" → "posicion"
    allAround: number;
  };
}

export const gimnastasService = {
  /**
   * Obtiene todos los gimnastas registrados en la aplicación
   * Retorna una lista plana de todos los gimnastas
   */
  getTodosGimnastas: async (): Promise<GimnastaListItem[]> => {
    try {
      const response = await apiClient.get<GimnastasApiResponseGrouped>(
        API_CONFIG.ENDPOINTS.GIMNASTAS.TODOS
      );

      // Convertir el objeto agrupado en una lista plana
      const gimnastasPlana: GimnastaApiResponse[] = [];
      Object.values(response.data).forEach(gimnastasPorCampeonato => {
        gimnastasPlana.push(...gimnastasPorCampeonato);
      });

      // Agrupar por gimnasta individual (por nombre + club)
      const gimnastasAgrupados = agruparPorGimnasta(gimnastasPlana);

      // Convertir a formato de la app
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

  /**
   * Busca gimnastas por término de búsqueda
   * (Por ahora usa la lista completa y filtra localmente)
   */
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
  },

  /**
   * ✅ FUNCIÓN CORREGIDA - Obtiene el perfil detallado de un gimnasta específico
   */
  getGimnastaPerfil: async (gimnastaId: string): Promise<GimnastaPerfil> => {
    try {
      const response = await apiClient.get<GimnastaPerfilApiResponse>(
        `${API_CONFIG.ENDPOINTS.GIMNASTAS.PERFIL}/${gimnastaId}/perfil`
      );

      const gimnasta = response.data;

      // ✅ MAPEO CORREGIDO - Transformar nombres de campos de API → App
      return {
        id: gimnasta.id,
        nombre: gimnasta.nombre,
        club: gimnasta.delegacion,           // ← CORREGIDO: "delegacion" → "club"
        año: gimnasta.anioNacimiento,        // ← CORREGIDO: "anioNacimiento" → "año"
        categoria: gimnasta.ultimoCampeonato.categoria,
        nivel: gimnasta.ultimoCampeonato.nivel,
        franja: gimnasta.ultimoCampeonato.franja,
        ultimoCampeonato: {
          fecha: gimnasta.ultimoCampeonato.fecha,
          categoria: gimnasta.ultimoCampeonato.categoria,
          nivel: gimnasta.ultimoCampeonato.nivel,
          franja: gimnasta.ultimoCampeonato.franja,
          posicion: gimnasta.ultimoCampeonato.posicionFinal,  // ← CORREGIDO
          allAround: gimnasta.ultimoCampeonato.allAround,
        }
      };
    } catch (error: any) {
      console.error('Error en getGimnastaPerfil:', error);
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('Error al cargar perfil del gimnasta');
    }
  }
};

/**
 * Agrupa los gimnastas por individuo (mismo nombre + club)
 * para consolidar su historial de campeonatos
 */
const agruparPorGimnasta = (gimnastas: GimnastaApiResponse[]): GimnastaApiResponse[][] => {
  const grupos: { [key: string]: GimnastaApiResponse[] } = {};
  
  gimnastas.forEach(gimnasta => {
    // Crear clave única por gimnasta (nombre + club)
    const clave = `${gimnasta.nombre}_${gimnasta.club}`.toLowerCase();
    
    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(gimnasta);
  });

  return Object.values(grupos);
};

/**
 * Convierte un grupo de registros de gimnasta a formato de la app
 */
const convertirAGimnastaApp = (grupo: GimnastaApiResponse[]): GimnastaListItem => {
  // Ordenar por fecha más reciente
  const gimnastaOrdenado = grupo.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  
  const masReciente = gimnastaOrdenado[0];
  
  // Construir string de búsqueda
  const elementosBusqueda = [
    masReciente.nombre,
    masReciente.club,
    masReciente.categoria,
    masReciente.nivel,
    masReciente.franja,
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
    club: masReciente.club,
    año: masReciente.año,
    
    categoria: masReciente.categoria,
    nivel: masReciente.nivel,
    franja: masReciente.franja,
    
    ultimoCampeonato: {
      id: masReciente.campeonatoId,
      nombre: masReciente.nombreCampeonato,
      categoria: masReciente.categoria,
      nivel: `${masReciente.categoria} ${masReciente.nivel}`,
      fecha: masReciente.fecha
    },
    
    historialCampeonatos: [...new Set(grupo.map(g => g.campeonatoId))],
    
    searchString,
    
    // Valor por defecto
    esMedallista: false,
  };
};

// Exportar tipos para uso en otros archivos
export type { GimnastaListItem, GimnastaPerfil };