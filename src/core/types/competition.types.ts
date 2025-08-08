// src/core/types/competition.types.ts
// TIPOS BASE PARA EL SISTEMA DE COMPETENCIAS DE GIMNASIA

// ===== CATEGORÍAS BASE =====
export type CategoriaBase = 
  | 'Pre Kinder'
  | 'Kinder' 
  | 'Mini'
  | 'Infantil'
  | 'Juvenil'
  | 'Senior'
  | 'USAG';

// ===== NIVELES TÉCNICOS =====
export type NivelTecnico = 
  | 'Nivel 1'
  | 'Nivel 2'
  | 'Nivel 3'
  | 'Nivel 4'
  | 'Nivel 5'
  | 'Nivel 6'
  | 'Nivel 7'
  | 'Nivel 8'
  | 'Nivel 9'
  | 'Nivel 10';

// ===== FRANJAS DE COMPETENCIA =====
export type FranjaCompetencia = 
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5'  // Femenino
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5'  // Masculino
  | 'A' | 'B' | 'C' | 'D';             // Subdivisiones

// ===== TIPOS DE GIMNASIA =====
export type TipoGimnasia = 'GAF' | 'GAM';

// ===== APARATOS =====
export type AparatoGAF = 'salto' | 'asimetricas' | 'viga' | 'suelo';
export type AparatoGAM = 'suelo' | 'arzones' | 'anillas' | 'salto' | 'paralelas' | 'barra';
export type AparatoGeneral = AparatoGAF | AparatoGAM;

// ===== ESTADO DE CAMPEONATO =====
export type CampeonatoEstado = 'configuracion' | 'activo' | 'finalizado';

// ===== INTERFACE PRINCIPAL DE COMPETENCIA =====
export interface CompetenciaCompleta {
  // Identificación única
  id: string;
  
  // ✅ JERARQUÍA CORRECTA
  categoria: CategoriaBase;           // "Kinder", "USAG", "Juvenil", etc.
  nivelTecnico?: NivelTecnico;        // "Nivel 1", "Nivel 2" (solo para Kinder/USAG)
  franja: FranjaCompetencia;          // "F1", "M2", etc.
  tipo: TipoGimnasia;                 // GAF o GAM
  
  // Configuración de aparatos
  aparatos: AparatoGeneral[];         // Lista de aparatos según el nivel
  subdivision?: string;               // "A", "B" para dividir grupos grandes
  
  // Metadatos de edad (opcional)
  edadMinima?: number;
  edadMaxima?: number;
  
  // Para mostrar en UI
  nombreCompleto: string;  // "Kinder Nivel 1 F1", "USAG Nivel 3 M2", "Juvenil F1"
  nombreCorto: string;     // "Kinder 1 F1", "USAG 3 M2", "Juvenil F1"
  nombreDisplay: string;   // Para mostrar en cards: "Kinder F1", "USAG 3 M2"
  
  // Estado de competencia
  participantes: number;
  activa: boolean;
}

// ===== HELPER FUNCTIONS =====

/**
 * Construye el nombre completo de una competencia
 */
export const construirNombreCompetencia = (
  categoria: CategoriaBase,
  nivelTecnico: NivelTecnico | null,
  franja: FranjaCompetencia,
  formato: 'completo' | 'corto' | 'display' = 'completo'
): string => {
  const tieneNivel = nivelTecnico && (categoria === 'Kinder' || categoria === 'USAG');
  
  switch (formato) {
    case 'completo':
      return tieneNivel 
        ? `${categoria} ${nivelTecnico} ${franja}`
        : `${categoria} ${franja}`;
        
    case 'corto':
      return tieneNivel
        ? `${categoria} ${nivelTecnico.replace('Nivel ', '')} ${franja}`
        : `${categoria} ${franja}`;
        
    case 'display':
      return tieneNivel
        ? `${categoria} ${nivelTecnico.replace('Nivel ', '')} ${franja}`
        : `${categoria} ${franja}`;
        
    default:
      return tieneNivel 
        ? `${categoria} ${nivelTecnico} ${franja}`
        : `${categoria} ${franja}`;
  }
};

/**
 * Determina qué aparatos se usan según la categoría y nivel
 */
export const obtenerAparatosPorNivel = (
  categoria: CategoriaBase,
  nivelTecnico: NivelTecnico | null,
  tipo: TipoGimnasia
): AparatoGeneral[] => {
  
  // Para categorías con niveles técnicos específicos
  if (categoria === 'Kinder' || categoria === 'USAG') {
    const numeroNivel = nivelTecnico ? parseInt(nivelTecnico.replace('Nivel ', '')) : 1;
    
    if (tipo === 'GAF') {
      // Nivel 1: solo 3 aparatos básicos
      if (numeroNivel === 1) {
        return ['salto', 'viga', 'suelo'];
      }
      // Nivel 2+: todos los aparatos
      return ['salto', 'asimetricas', 'viga', 'suelo'];
    } else {
      // GAM siempre todos los aparatos
      return ['suelo', 'arzones', 'anillas', 'salto', 'paralelas', 'barra'];
    }
  }
  
  // Para categorías avanzadas (sin nivel específico), todos los aparatos
  if (tipo === 'GAF') {
    return ['salto', 'asimetricas', 'viga', 'suelo'];
  }
  return ['suelo', 'arzones', 'anillas', 'salto', 'paralelas', 'barra'];
};

/**
 * Obtiene el nombre display de un aparato
 */
export const getAparatoDisplayName = (aparato: AparatoGeneral): string => {
  const nombres: Record<AparatoGeneral, string> = {
    // GAF
    salto: 'Salto',
    asimetricas: 'Asimétricas',
    viga: 'Viga',
    suelo: 'Suelo',
    // GAM
    arzones: 'Arzones',
    anillas: 'Anillas',
    paralelas: 'Paralelas',
    barra: 'Barra'
  };
  
  return nombres[aparato] || aparato;
};

/**
 * Valida si una combinación de categoría/nivel/franja es válida
 */
export const esCombinacinValida = (
  categoria: CategoriaBase,
  nivelTecnico: NivelTecnico | null,
  franja: FranjaCompetencia,
  tipo: TipoGimnasia
): boolean => {
  // Validaciones básicas
  
  // Kinder y USAG requieren nivel técnico
  if ((categoria === 'Kinder' || categoria === 'USAG') && !nivelTecnico) {
    return false;
  }
  
  // Categorías avanzadas no usan nivel técnico específico
  if (['Juvenil', 'Senior', 'Mini', 'Infantil'].includes(categoria) && nivelTecnico) {
    return false;
  }
  
  // Validar coherencia de franja con tipo
  const esFranjaFemenina = franja.startsWith('F');
  const esFranjaMasculina = franja.startsWith('M');
  
  if (tipo === 'GAF' && esFranjaMasculina) return false;
  if (tipo === 'GAM' && esFranjaFemenina) return false;
  
  return true;
};

/**
 * Genera un ID único para una competencia
 */
export const generarIdCompetencia = (
  categoria: CategoriaBase,
  nivelTecnico: NivelTecnico | null,
  franja: FranjaCompetencia
): string => {
  const baseId = categoria.toLowerCase().replace(' ', '');
  const nivelId = nivelTecnico ? nivelTecnico.toLowerCase().replace('nivel ', 'n') : '';
  const franjaId = franja.toLowerCase();
  
  return `${baseId}${nivelId}${franjaId}`;
};

// ===== CONFIGURACIONES PREDEFINIDAS =====

export const CONFIGURACIONES_COMPETENCIA: CompetenciaCompleta[] = [
  // ===== KINDER =====
  {
    id: generarIdCompetencia('Kinder', 'Nivel 1', 'F1'),
    categoria: 'Kinder',
    nivelTecnico: 'Nivel 1',
    franja: 'F1',
    tipo: 'GAF',
    aparatos: obtenerAparatosPorNivel('Kinder', 'Nivel 1', 'GAF'),
    edadMinima: 5,
    edadMaxima: 7,
    nombreCompleto: construirNombreCompetencia('Kinder', 'Nivel 1', 'F1', 'completo'),
    nombreCorto: construirNombreCompetencia('Kinder', 'Nivel 1', 'F1', 'corto'),
    nombreDisplay: construirNombreCompetencia('Kinder', 'Nivel 1', 'F1', 'display'),
    participantes: 0,
    activa: false
  },
  {
    id: generarIdCompetencia('Kinder', 'Nivel 2', 'F1'),
    categoria: 'Kinder',
    nivelTecnico: 'Nivel 2',
    franja: 'F1',
    tipo: 'GAF',
    aparatos: obtenerAparatosPorNivel('Kinder', 'Nivel 2', 'GAF'),
    edadMinima: 5,
    edadMaxima: 7,
    nombreCompleto: construirNombreCompetencia('Kinder', 'Nivel 2', 'F1', 'completo'),
    nombreCorto: construirNombreCompetencia('Kinder', 'Nivel 2', 'F1', 'corto'),
    nombreDisplay: construirNombreCompetencia('Kinder', 'Nivel 2', 'F1', 'display'),
    participantes: 0,
    activa: false
  },
  
  // ===== USAG =====
  {
    id: generarIdCompetencia('USAG', 'Nivel 3', 'F2'),
    categoria: 'USAG',
    nivelTecnico: 'Nivel 3',
    franja: 'F2',
    tipo: 'GAF',
    aparatos: obtenerAparatosPorNivel('USAG', 'Nivel 3', 'GAF'),
    edadMinima: 8,
    edadMaxima: 11,
    nombreCompleto: construirNombreCompetencia('USAG', 'Nivel 3', 'F2', 'completo'),
    nombreCorto: construirNombreCompetencia('USAG', 'Nivel 3', 'F2', 'corto'),
    nombreDisplay: construirNombreCompetencia('USAG', 'Nivel 3', 'F2', 'display'),
    participantes: 0,
    activa: false
  },
  
  // ===== JUVENIL (sin nivel técnico) =====
  {
    id: generarIdCompetencia('Juvenil', null, 'F1'),
    categoria: 'Juvenil',
    franja: 'F1',
    tipo: 'GAF',
    aparatos: obtenerAparatosPorNivel('Juvenil', null, 'GAF'),
    edadMinima: 12,
    edadMaxima: 16,
    nombreCompleto: construirNombreCompetencia('Juvenil', null, 'F1', 'completo'),
    nombreCorto: construirNombreCompetencia('Juvenil', null, 'F1', 'corto'),
    nombreDisplay: construirNombreCompetencia('Juvenil', null, 'F1', 'display'),
    participantes: 0,
    activa: false
  },
  {
    id: generarIdCompetencia('Juvenil', null, 'M1'),
    categoria: 'Juvenil',
    franja: 'M1',
    tipo: 'GAM',
    aparatos: obtenerAparatosPorNivel('Juvenil', null, 'GAM'),
    edadMinima: 12,
    edadMaxima: 16,
    nombreCompleto: construirNombreCompetencia('Juvenil', null, 'M1', 'completo'),
    nombreCorto: construirNombreCompetencia('Juvenil', null, 'M1', 'corto'),
    nombreDisplay: construirNombreCompetencia('Juvenil', null, 'M1', 'display'),
    participantes: 0,
    activa: false
  }
];