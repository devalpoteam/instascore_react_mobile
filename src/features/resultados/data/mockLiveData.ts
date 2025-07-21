// src/features/resultados/data/mockLiveData.ts

export type TipoGimnasia = 'GAF' | 'GAM';
export type AparatoGAF = 'salto' | 'asimetricas' | 'viga' | 'suelo';
export type AparatoGAM = 'suelo' | 'arzones' | 'anillas' | 'salto' | 'paralelas' | 'barra';
export type AparatoGeneral = AparatoGAF | AparatoGAM;

export interface CategoriaActiva {
  id: string;
  nombre: string; // "Kinder F1", "Mini F2", etc.
  tipo: TipoGimnasia;
  aparatoActual: AparatoGeneral;
  aparatoNumero: number; // 1, 2, 3, 4 (para rotaciones)
  totalAparatos: number; // 4 para GAF, 6 para GAM
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

// ✅ DATOS MOCK REALISTAS - BASADOS EN DOCUMENTACIÓN
export const mockCampeonatosEnVivo: CampeonatoEnVivo[] = [
  {
    id: '1',
    nombre: 'Copa Valparaíso 2024',
    lugar: 'Gimnasio Municipal Valparaíso',
    horaInicio: '09:00',
    totalCategorias: 8,
    categoriasFinalizadas: 3,
    participantesTotales: 124,
    categoriasActivas: [
      {
        id: 'cat1',
        nombre: 'Kinder F1',
        tipo: 'GAF',
        aparatoActual: 'salto',
        aparatoNumero: 1,
        totalAparatos: 4,
        participantesActivos: 16
      },
      {
        id: 'cat2', 
        nombre: 'Mini F2',
        tipo: 'GAF',
        aparatoActual: 'viga',
        aparatoNumero: 3,
        totalAparatos: 4,
        participantesActivos: 14
      }
    ]
  },
  {
    id: '2',
    nombre: 'Campeonato Nacional Juvenil',
    lugar: 'Centro Deportivo Nacional',
    horaInicio: '10:30',
    totalCategorias: 12,
    categoriasFinalizadas: 1,
    participantesTotales: 89,
    categoriasActivas: [
      {
        id: 'cat3',
        nombre: 'Juvenil Masculino',
        tipo: 'GAM',
        aparatoActual: 'arzones',
        aparatoNumero: 2,
        totalAparatos: 6,
        participantesActivos: 8
      },
      {
        id: 'cat4',
        nombre: 'Senior Femenino',
        tipo: 'GAF',
        aparatoActual: 'asimetricas',
        aparatoNumero: 2,
        totalAparatos: 4,
        participantesActivos: 12
      }
    ]
  },
  {
    id: '3',
    nombre: 'Torneo Interclubes Santiago',
    lugar: 'Polideportivo Las Condes',
    horaInicio: '08:30',
    totalCategorias: 6,
    categoriasFinalizadas: 4,
    participantesTotales: 67,
    categoriasActivas: [
      {
        id: 'cat5',
        nombre: 'Infantil GAM',
        tipo: 'GAM',
        aparatoActual: 'barra',
        aparatoNumero: 6,
        totalAparatos: 6,
        participantesActivos: 6
      }
    ]
  },
  {
    id: '4',
    nombre: 'Copa Regional Centro',
    lugar: 'Gimnasio Regional Rancagua',
    horaInicio: '14:00',
    totalCategorias: 5,
    categoriasFinalizadas: 0,
    participantesTotales: 45,
    categoriasActivas: [
      {
        id: 'cat6',
        nombre: 'Pre Kinder',
        tipo: 'GAF',
        aparatoActual: 'suelo',
        aparatoNumero: 4,
        totalAparatos: 4,
        participantesActivos: 10
      },
      {
        id: 'cat7',
        nombre: 'Kinder Masculino',
        tipo: 'GAM',
        aparatoActual: 'suelo',
        aparatoNumero: 1,
        totalAparatos: 6,
        participantesActivos: 8
      }
    ]
  }
];

// ✅ HELPER FUNCTIONS
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