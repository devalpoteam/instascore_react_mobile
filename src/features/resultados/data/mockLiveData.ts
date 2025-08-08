// src/features/resultados/data/mockLiveData.ts
// VERSIÓN ACTUALIZADA - Compatible con estructura jerárquica completa

export type TipoGimnasia = 'GAF' | 'GAM';
export type AparatoGAF = 'salto' | 'asimetricas' | 'viga' | 'suelo';
export type AparatoGAM = 'suelo' | 'arzones' | 'anillas' | 'salto' | 'paralelas' | 'barra';
export type AparatoGeneral = AparatoGAF | AparatoGAM;

export interface CategoriaActiva {
  id: string;
  // ✅ ESTRUCTURA JERÁRQUICA COMPLETA
  categoria: string;        // "Kinder", "USAG", "Juvenil", etc.
  nivel?: string;           // "Nivel 1", "Nivel 2", etc. (opcional)
  franja: string;           // "F1", "F2", "M1", etc.
  tipo: TipoGimnasia;       // GAF o GAM
  
  // ✅ NOMBRES PARA DISPLAY
  nombreCompleto: string;   // "Kinder Nivel 1 F1"
  nombreCorto: string;      // "Kinder 1 F1" 
  nombreDisplay: string;    // "Kinder F1" (para UI compacta)
  
  // Estado actual de competencia
  aparatoActual: AparatoGeneral;
  aparatoNumero: number;    // 1, 2, 3, 4 (para rotaciones)
  totalAparatos: number;    // 4 para GAF, 6 para GAM
  participantesActivos: number;
}

export interface CampeonatoEnVivo {
  id: string;
  nombre: string;
  lugar: string;
  horaInicio: string;
  categoriasActivas: CategoriaActiva[];
  totalCategorias: number;
  categoriasFinalizadas: number;
  participantesTotales: number;
}

// ✅ DATOS MOCK ACTUALIZADOS CON ESTRUCTURA JERÁRQUICA COMPLETA
export const mockCampeonatosEnVivo: CampeonatoEnVivo[] = [
  {
    id: '1',
    nombre: 'Copa Valparaíso 2025',
    lugar: 'Polideportivo de Viña del Mar',
    horaInicio: '09:00',
    totalCategorias: 12,
    categoriasFinalizadas: 3,
    participantesTotales: 178,
    categoriasActivas: [
      {
        id: 'cat1',
        categoria: 'Kinder',
        nivel: 'Nivel 1',
        franja: 'F1',
        tipo: 'GAF',
        nombreCompleto: 'Kinder Nivel 1 F1',
        nombreCorto: 'Kinder 1 F1',
        nombreDisplay: 'Kinder F1',
        aparatoActual: 'salto',
        aparatoNumero: 1,
        totalAparatos: 3, // Kinder Nivel 1 solo tiene 3 aparatos
        participantesActivos: 16
      },
      {
        id: 'cat2',
        categoria: 'Kinder',
        nivel: 'Nivel 2',
        franja: 'F1',
        tipo: 'GAF',
        nombreCompleto: 'Kinder Nivel 2 F1',
        nombreCorto: 'Kinder 2 F1',
        nombreDisplay: 'Kinder 2 F1',
        aparatoActual: 'viga',
        aparatoNumero: 3,
        totalAparatos: 4,
        participantesActivos: 18
      },
      {
        id: 'cat3',
        categoria: 'USAG',
        nivel: 'Nivel 3',
        franja: 'F2',
        tipo: 'GAF',
        nombreCompleto: 'USAG Nivel 3 F2',
        nombreCorto: 'USAG 3 F2',
        nombreDisplay: 'USAG 3 F2',
        aparatoActual: 'suelo',
        aparatoNumero: 4,
        totalAparatos: 4,
        participantesActivos: 13
      },
      {
        id: 'cat4',
        categoria: 'Juvenil',
        nivel: undefined, // No tiene nivel
        franja: 'M1',
        tipo: 'GAM',
        nombreCompleto: 'Juvenil M1',
        nombreCorto: 'Juvenil M1',
        nombreDisplay: 'Juvenil M1',
        aparatoActual: 'arzones',
        aparatoNumero: 2,
        totalAparatos: 6,
        participantesActivos: 12
      }
    ]
  },
  {
    id: '2',
    nombre: 'Torneo Nacional Juvenil 2025',
    lugar: 'Centro Deportivo Nacional Santiago',
    horaInicio: '10:30',
    totalCategorias: 8,
    categoriasFinalizadas: 1,
    participantesTotales: 156,
    categoriasActivas: [
      {
        id: 'cat5',
        categoria: 'USAG',
        nivel: 'Nivel 5',
        franja: 'F1',
        tipo: 'GAF',
        nombreCompleto: 'USAG Nivel 5 F1',
        nombreCorto: 'USAG 5 F1',
        nombreDisplay: 'USAG 5 F1',
        aparatoActual: 'asimetricas',
        aparatoNumero: 2,
        totalAparatos: 4,
        participantesActivos: 14
      },
      {
        id: 'cat6',
        categoria: 'Senior',
        nivel: undefined,
        franja: 'F1',
        tipo: 'GAF',
        nombreCompleto: 'Senior F1',
        nombreCorto: 'Senior F1',
        nombreDisplay: 'Senior F1',
        aparatoActual: 'viga',
        aparatoNumero: 3,
        totalAparatos: 4,
        participantesActivos: 12
      }
    ]
  },
  {
    id: '3',
    nombre: 'Copa Regional Centro',
    lugar: 'Gimnasio Regional Rancagua',
    horaInicio: '14:00',
    totalCategorias: 6,
    categoriasFinalizadas: 1,
    participantesTotales: 89,
    categoriasActivas: [
      {
        id: 'cat7',
        categoria: 'Pre Kinder',
        nivel: undefined,
        franja: 'F1',
        tipo: 'GAF',
        nombreCompleto: 'Pre Kinder F1',
        nombreCorto: 'Pre Kinder F1',
        nombreDisplay: 'Pre Kinder F1',
        aparatoActual: 'suelo',
        aparatoNumero: 3,
        totalAparatos: 3, // Pre Kinder solo tiene 3 aparatos
        participantesActivos: 10
      },
      {
        id: 'cat8',
        categoria: 'Mini',
        nivel: undefined,
        franja: 'F2',
        tipo: 'GAF',
        nombreCompleto: 'Mini F2',
        nombreCorto: 'Mini F2',
        nombreDisplay: 'Mini F2',
        aparatoActual: 'salto',
        aparatoNumero: 1,
        totalAparatos: 4,
        participantesActivos: 14
      },
      {
        id: 'cat9',
        categoria: 'Infantil',
        nivel: undefined,
        franja: 'M1',
        tipo: 'GAM',
        nombreCompleto: 'Infantil M1',
        nombreCorto: 'Infantil M1',
        nombreDisplay: 'Infantil M1',
        aparatoActual: 'barra',
        aparatoNumero: 6,
        totalAparatos: 6,
        participantesActivos: 8
      }
    ]
  },
  {
    id: '4',
    nombre: 'Campeonato Escolar Primavera',
    lugar: 'Gimnasio Municipal Luis Cruz Martínez',
    horaInicio: '08:30',
    totalCategorias: 5,
    categoriasFinalizadas: 2,
    participantesTotales: 67,
    categoriasActivas: [
      {
        id: 'cat10',
        categoria: 'Kinder',
        nivel: 'Nivel 1',
        franja: 'M1',
        tipo: 'GAM',
        nombreCompleto: 'Kinder Nivel 1 M1',
        nombreCorto: 'Kinder 1 M1',
        nombreDisplay: 'Kinder 1 M1',
        aparatoActual: 'suelo',
        aparatoNumero: 1,
        totalAparatos: 6,
        participantesActivos: 8
      },
      {
        id: 'cat11',
        categoria: 'USAG',
        nivel: 'Nivel 2',
        franja: 'F1',
        tipo: 'GAF',
        nombreCompleto: 'USAG Nivel 2 F1',
        nombreCorto: 'USAG 2 F1',
        nombreDisplay: 'USAG 2 F1',
        aparatoActual: 'asimetricas',
        aparatoNumero: 2,
        totalAparatos: 4,
        participantesActivos: 12
      }
    ]
  }
];

// ✅ HELPER FUNCTIONS ACTUALIZADAS
export const getAparatoDisplayName = (aparato: AparatoGeneral, tipo: TipoGimnasia): string => {
  const aparatosGAF: Record<AparatoGAF, string> = {
    salto: 'Salto',
    asimetricas: 'Asimétricas', 
    viga: 'Viga',
    suelo: 'Suelo'
  };

  const aparatosGAM: Record<AparatoGAM, string> = {
    suelo: 'Suelo',
    arzones: 'Arzones',
    anillas: 'Anillas', 
    salto: 'Salto',
    paralelas: 'Paralelas',
    barra: 'Barra'
  };

  if (tipo === 'GAF') {
    return aparatosGAF[aparato as AparatoGAF] || aparato;
  } else {
    return aparatosGAM[aparato as AparatoGAM] || aparato;
  }
};

export const getAparatoIcon = (aparato: AparatoGeneral): string => {
  const iconMap: Record<AparatoGeneral, string> = {
    // GAF
    salto: 'arrow-up-circle-outline',
    asimetricas: 'git-branch-outline', 
    viga: 'remove-outline',
    suelo: 'square-outline',
    // GAM  
    arzones: 'ellipse-outline',
    anillas: 'radio-button-off-outline',
    paralelas: 'pause-outline',
    barra: 'remove-outline'
  };

  return iconMap[aparato] || 'help-circle-outline';
};

// ✅ NUEVA FUNCIÓN PARA CONSTRUIR NOMBRES DE DISPLAY
export const construirNombreCategoria = (
  categoria: CategoriaActiva,
  formato: 'completo' | 'corto' | 'display' = 'completo'
): string => {
  switch (formato) {
    case 'completo':
      return categoria.nombreCompleto;
    case 'corto':
      return categoria.nombreCorto;
    case 'display':
      return categoria.nombreDisplay;
    default:
      return categoria.nombreCompleto;
  }
};

// ✅ FUNCIÓN PARA OBTENER EL TIPO DE GIMNASIA EN ESPAÑOL
export const getTipoGimnasiaDisplay = (tipo: TipoGimnasia): string => {
  return tipo === 'GAF' ? 'Gimnasia Artística Femenina' : 'Gimnasia Artística Masculina';
};

// ✅ FUNCIÓN PARA OBTENER EL GÉNERO SIMPLE
export const getGeneroSimple = (tipo: TipoGimnasia): string => {
  return tipo === 'GAF' ? 'Femenino' : 'Masculino';
};