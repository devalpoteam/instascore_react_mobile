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