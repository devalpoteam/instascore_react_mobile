// src/features/campeonatos/data/mockCampeonatos.ts
// DATOS MOCK ACTUALIZADOS CON LA NUEVA ESTRUCTURA JERÁRQUICA

import { 
  Campeonato, 
  CampeonatoDetallado,
  CategoriaCompetencia,
  DelegacionParticipante,
  GimnastaParticipante,
  EventoCronograma,
  EstadisticasCampeonato,
  ConfiguracionCampeonato
} from '../types/campeonatos.types';

// ===== CONFIGURACIONES DE COMPETENCIAS REALISTAS =====
const configuracionesCompetencias = [
  // Pre Kinder
  { categoria: "Pre Kinder", nivel: null, franja: "F1", modalidad: "GAF", aparatos: ["salto", "viga", "suelo"], display: "Pre Kinder F1" },
  { categoria: "Pre Kinder", nivel: null, franja: "M1", modalidad: "GAM", aparatos: ["suelo", "salto", "barra"], display: "Pre Kinder M1" },
  
  // Kinder con niveles
  { categoria: "Kinder", nivel: "Nivel 1", franja: "F1", modalidad: "GAF", aparatos: ["salto", "viga", "suelo"], display: "Kinder 1 F1" },
  { categoria: "Kinder", nivel: "Nivel 1", franja: "F2", modalidad: "GAF", aparatos: ["salto", "viga", "suelo"], display: "Kinder 1 F2" },
  { categoria: "Kinder", nivel: "Nivel 2", franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Kinder 2 F1" },
  { categoria: "Kinder", nivel: "Nivel 2", franja: "F2", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Kinder 2 F2" },
  { categoria: "Kinder", nivel: "Nivel 1", franja: "M1", modalidad: "GAM", aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"], display: "Kinder 1 M1" },
  
  // Mini
  { categoria: "Mini", nivel: null, franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Mini F1" },
  { categoria: "Mini", nivel: null, franja: "F2", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Mini F2" },
  { categoria: "Mini", nivel: null, franja: "M1", modalidad: "GAM", aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"], display: "Mini M1" },
  
  // USAG con niveles
  { categoria: "USAG", nivel: "Nivel 1", franja: "F1", modalidad: "GAF", aparatos: ["salto", "viga", "suelo"], display: "USAG 1 F1" },
  { categoria: "USAG", nivel: "Nivel 2", franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "USAG 2 F1" },
  { categoria: "USAG", nivel: "Nivel 3", franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "USAG 3 F1" },
  { categoria: "USAG", nivel: "Nivel 3", franja: "F2", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "USAG 3 F2" },
  { categoria: "USAG", nivel: "Nivel 4", franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "USAG 4 F1" },
  { categoria: "USAG", nivel: "Nivel 5", franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "USAG 5 F1" },
  { categoria: "USAG", nivel: "Nivel 5", franja: "M1", modalidad: "GAM", aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"], display: "USAG 5 M1" },
  
  // Categorías avanzadas
  { categoria: "Infantil", nivel: null, franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Infantil F1" },
  { categoria: "Infantil", nivel: null, franja: "M1", modalidad: "GAM", aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"], display: "Infantil M1" },
  { categoria: "Juvenil", nivel: null, franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Juvenil F1" },
  { categoria: "Juvenil", nivel: null, franja: "M1", modalidad: "GAM", aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"], display: "Juvenil M1" },
  { categoria: "Senior", nivel: null, franja: "F1", modalidad: "GAF", aparatos: ["salto", "asimetricas", "viga", "suelo"], display: "Senior F1" },
  { categoria: "Senior", nivel: null, franja: "M1", modalidad: "GAM", aparatos: ["suelo", "arzones", "anillas", "salto", "paralelas", "barra"], display: "Senior M1" },
];

const clubes = [
  "Delegación de Matías", "Club Gimnástico Valparaíso", "Academia Deportiva Santiago",
  "Escuela de Gimnasia Elite", "Club Artístico Las Condes", "Gimnasia Integral Viña",
  "Centro Deportivo Maipú", "Academia Nacional", "Club Deportivo Providencia",
  "Escuela Municipal", "Club Regional Norte", "Academia San Patricio"
];

const regiones = ["Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Biobío", "Araucanía"];

// ===== FUNCIÓN PARA GENERAR RUT =====
function generarRUT(): string {
  const numero = Math.floor(Math.random() * 99999999) + 10000000;
  const rutSinDV = numero.toString();
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    suma += parseInt(rutSinDV[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dv = 11 - (suma % 11);
  const digitoVerificador = dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
  
  return `${numero}-${digitoVerificador}`;
}

// ===== DATOS MOCK BÁSICOS DE CAMPEONATOS =====
export const mockCampeonatos: Campeonato[] = [
  {
    id: '1',
    nombre: 'Copa Valparaíso 2025',
    lugar: 'Polideportivo de Viña del Mar',
    fechaInicio: '2025-08-15',
    fechaFin: '2025-08-16',
    horaInicio: '09:00',
    estado: 'activo',
    categorias: 12,
    participantes: 178,
    delegaciones: 8,
    descripcion: 'Campeonato regional de gimnasia artística con participación de delegaciones de la V Región',
    activo: true,
    organizador: 'Escuela de Gimnasia de Valparaíso',
    tipoCompetencia: 'regional',
    modalidades: ['GAF', 'GAM'],
    edadMinima: 5,
    edadMaxima: 25,
    inscripcionesAbiertas: false,
    resultadosPublicados: false,
    transmisionEnVivo: true,
    fechaCreacion: '2025-06-01',
    ultimaActualizacion: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Torneo Nacional Juvenil 2025',
    lugar: 'Centro Deportivo Nacional Santiago',
    fechaInicio: '2025-09-20',
    fechaFin: '2025-09-22',
    horaInicio: '10:30',
    estado: 'configuracion',
    categorias: 8,
    participantes: 156,
    delegaciones: 15,
    descripcion: 'Campeonato nacional para categorías juveniles y senior',
    activo: false,
    organizador: 'Federación Chilena de Gimnasia',
    tipoCompetencia: 'nacional',
    modalidades: ['GAF', 'GAM'],
    edadMinima: 12,
    edadMaxima: 25,
    inscripcionesAbiertas: true,
    resultadosPublicados: false,
    transmisionEnVivo: true,
    fechaCreacion: '2025-07-15',
    ultimaActualizacion: new Date().toISOString(),
  },
  {
    id: '3',
    nombre: 'Campeonato Escolar Primavera',
    lugar: 'Gimnasio Municipal Luis Cruz Martínez',
    fechaInicio: '2025-10-07',
    fechaFin: '2025-10-07',
    horaInicio: '10:00',
    estado: 'configuracion',
    categorias: 6,
    participantes: 89,
    delegaciones: 5,
    descripcion: 'Campeonato escolar para categorías menores',
    activo: false,
    organizador: 'Municipalidad de Santiago',
    tipoCompetencia: 'escolar',
    modalidades: ['GAF'],
    edadMinima: 5,
    edadMaxima: 12,
    inscripcionesAbiertas: true,
    resultadosPublicados: false,
    transmisionEnVivo: false,
    fechaCreacion: '2025-08-01',
    ultimaActualizacion: new Date().toISOString(),
  },
  {
    id: '4',
    nombre: 'Copa Interclubes Santiago',
    lugar: 'Polideportivo Las Condes',
    fechaInicio: '2025-07-15',
    fechaFin: '2025-07-16',
    horaInicio: '08:30',
    estado: 'finalizado',
    categorias: 10,
    participantes: 134,
    delegaciones: 6,
    descripcion: 'Competencia amistosa entre los principales clubes de Santiago',
    activo: false,
    organizador: 'Liga Metropolitana de Gimnasia',
    tipoCompetencia: 'interclubes',
    modalidades: ['GAF', 'GAM'],
    edadMinima: 6,
    edadMaxima: 18,
    inscripcionesAbiertas: false,
    resultadosPublicados: true,
    transmisionEnVivo: false,
    fechaCreacion: '2025-05-10',
    ultimaActualizacion: '2025-07-16T18:00:00Z',
  }
];

// ===== CAMPEONATO DETALLADO - COPA VALPARAÍSO 2025 =====
export const mockCampeonatoDetallado: CampeonatoDetallado = {
  ...mockCampeonatos[0], // Copa Valparaíso 2025
  
  // ✅ CATEGORÍAS CON ESTRUCTURA JERÁRQUICA
  categoriasDetalle: [
    {
      id: 'cat1',
      categoria: 'Kinder',
      nivel: 'Nivel 1',
      franja: 'F1',
      modalidad: 'GAF',
      nombreCompleto: 'Kinder Nivel 1 F1',
      nombreCorto: 'Kinder 1 F1',
      nombreDisplay: 'Kinder F1',
      aparatos: ['salto', 'viga', 'suelo'],
      totalAparatos: 3,
      participantes: 16,
      equipos: 4,
      delegaciones: ['del1', 'del2', 'del3', 'del4'],
      estado: 'en_curso',
      aparatoActual: 'salto',
      aparatoNumero: 1,
      horaInicio: '09:00',
      horaEstimadaFin: '11:30',
      fechaCompetencia: '2025-08-15',
      formatoCompetencia: 'individual',
      orden: 1,
      activa: true
    },
    {
      id: 'cat2',
      categoria: 'Kinder',
      nivel: 'Nivel 2',
      franja: 'F1',
      modalidad: 'GAF',
      nombreCompleto: 'Kinder Nivel 2 F1',
      nombreCorto: 'Kinder 2 F1',
      nombreDisplay: 'Kinder 2 F1',
      aparatos: ['salto', 'asimetricas', 'viga', 'suelo'],
      totalAparatos: 4,
      participantes: 18,
      equipos: 5,
      delegaciones: ['del1', 'del2', 'del3', 'del5'],
      estado: 'en_curso',
      aparatoActual: 'viga',
      aparatoNumero: 3,
      horaInicio: '09:30',
      horaEstimadaFin: '12:15',
      fechaCompetencia: '2025-08-15',
      formatoCompetencia: 'individual',
      orden: 2,
      activa: true
    },
    {
      id: 'cat3',
      categoria: 'USAG',
      nivel: 'Nivel 3',
      franja: 'F2',
      modalidad: 'GAF',
      nombreCompleto: 'USAG Nivel 3 F2',
      nombreCorto: 'USAG 3 F2',
      nombreDisplay: 'USAG 3 F2',
      aparatos: ['salto', 'asimetricas', 'viga', 'suelo'],
      totalAparatos: 4,
      participantes: 13,
      equipos: 3,
      delegaciones: ['del2', 'del3', 'del6'],
      estado: 'en_curso',
      aparatoActual: 'suelo',
      aparatoNumero: 4,
      horaInicio: '10:00',
      horaEstimadaFin: '13:00',
      fechaCompetencia: '2025-08-15',
      formatoCompetencia: 'individual',
      orden: 3,
      activa: true
    },
    {
      id: 'cat4',
      categoria: 'Juvenil',
      franja: 'M1',
      modalidad: 'GAM',
      nombreCompleto: 'Juvenil M1',
      nombreCorto: 'Juvenil M1',
      nombreDisplay: 'Juvenil M1',
      aparatos: ['suelo', 'arzones', 'anillas', 'salto', 'paralelas', 'barra'],
      totalAparatos: 6,
      participantes: 12,
      equipos: 3,
      delegaciones: ['del1', 'del4', 'del7'],
      estado: 'pendiente',
      horaInicio: '14:00',
      horaEstimadaFin: '17:30',
      fechaCompetencia: '2025-08-15',
      formatoCompetencia: 'individual',
      orden: 4,
      activa: false
    }
  ],
  
  // ✅ DELEGACIONES PARTICIPANTES
  delegacionesDetalle: [
    {
      id: 'del1',
      nombre: 'Delegación de Matías',
      club: 'Delegación de Matías',
      region: 'Valparaíso',
      ciudad: 'Valparaíso',
      gimnastas: [
        {
          id: 'gym1',
          nombre: 'Rosalía Agustín Franch',
          rut: generarRUT(),
          año: 2018,
          categoria: 'Kinder',
          nivel: 'Nivel 1',
          franja: 'F1',
          modalidad: 'GAF',
          competenciaDisplay: 'Kinder 1 F1',
          subdivision: 'A',
          dorsal: '101',
          orden: 1,
          inscrito: true,
          documentosCompletos: true,
          aptoBairreau: true,
          experienciaPreviaCompetencias: 3,
          mejorPuntajeHistorico: 25.8
        }
        // ... más gimnastas
      ],
      entrenadores: ['María González', 'Pedro Silva'],
      responsable: 'María González',
      contacto: 'maria.gonzalez@delegacionmatias.cl',
      categoriasParticipantes: ['cat1', 'cat4'],
      totalParticipantes: 8,
      medallasEsperadas: 3,
      inscripcionConfirmada: true,
      documentosCompletos: true,
      pagosAlDia: true
    }
    // ... más delegaciones
  ],
  
  // ✅ CRONOGRAMA
  cronograma: [
    {
      id: 'crono1',
      tipo: 'calentamiento',
      titulo: 'Calentamiento General',
      descripcion: 'Calentamiento y preparación de gimnastas',
      fechaInicio: '2025-08-15',
      horaInicio: '08:30',
      horaFin: '09:00',
      duracionEstimada: 30,
      lugar: 'Gimnasio Principal',
      completado: true,
      enCurso: false,
      orden: 1
    },
    {
      id: 'crono2',
      tipo: 'competencia',
      titulo: 'Kinder Nivel 1 F1',
      descripcion: 'Competencia de Kinder Nivel 1 F1 - 3 aparatos',
      fechaInicio: '2025-08-15',
      horaInicio: '09:00',
      horaFin: '11:30',
      duracionEstimada: 150,
      categoriaId: 'cat1',
      lugar: 'Gimnasio Principal',
      completado: false,
      enCurso: true,
      orden: 2
    },
    {
      id: 'crono3',
      tipo: 'competencia',
      titulo: 'Kinder Nivel 2 F1',
      descripcion: 'Competencia de Kinder Nivel 2 F1 - 4 aparatos',
      fechaInicio: '2025-08-15',
      horaInicio: '09:30',
      horaFin: '12:15',
      duracionEstimada: 165,
      categoriaId: 'cat2',
      lugar: 'Gimnasio Principal',
      completado: false,
      enCurso: true,
      orden: 3
    }
  ],
  
  // ✅ ESTADÍSTICAS
  estadisticas: {
    totalGimnastas: 178,
    totalDelegaciones: 8,
    totalCategorias: 12,
    participantesGAF: 156,
    participantesGAM: 22,
    distribucionCategorias: [
      { categoria: 'Kinder', participantes: 45, porcentaje: 25.3 },
      { categoria: 'USAG', participantes: 38, porcentaje: 21.3 },
      { categoria: 'Mini', participantes: 32, porcentaje: 18.0 },
      { categoria: 'Juvenil', participantes: 28, porcentaje: 15.7 },
      { categoria: 'Infantil', participantes: 22, porcentaje: 12.4 },
      { categoria: 'Senior', participantes: 8, porcentaje: 4.5 },
      { categoria: 'Pre Kinder', participantes: 5, porcentaje: 2.8 }
    ],
    distribucionRegional: [
      { region: 'Valparaíso', delegaciones: 5, gimnastas: 98 },
      { region: 'Metropolitana', delegaciones: 2, gimnastas: 45 },
      { region: 'O\'Higgins', delegaciones: 1, gimnastas: 35 }
    ],
    edadPromedio: 9.8,
    edadMinima: 5,
    edadMaxima: 22,
    clubConMasParticipantes: 'Delegación de Matías',
    maxParticipantesPorClub: 28,
    categoriasFinalizadas: 3,
    porcentajeProgreso: 25,
    promedioAllAround: 28.5,
    mejorPuntaje: {
      gimnasta: 'Rosalía Agustín Franch',
      categoria: 'Kinder 1 F1',
      puntaje: 25.8,
      aparato: 'suelo'
    }
  },
  
  // ✅ CONFIGURACIÓN
  configuracion: {
    formatoPuntuacion: 'Nacional',
    decimalesPuntaje: 1,
    puntajeMaximo: 10.0,
    puntajeMinimo: 0.0,
    integrantesPorEquipo: 3,
    puntajesQueCuentan: 3,
    tiempoCalentamiento: 30,
    tiempoRotacion: 45,
    tiempoDescanso: 15,
    premiarTop: 3,
    medallasPorCategoria: true,
    medallasPorAparato: true,
    medallasAllAround: true,
    medallasEquipos: false,
    transmisionEnVivo: true,
    resultadosPublicos: true,
    notificacionesPush: true,
    aparatosPorCategoria: {
      'Kinder Nivel 1': ['salto', 'viga', 'suelo'],
      'Kinder Nivel 2': ['salto', 'asimetricas', 'viga', 'suelo'],
      'USAG': ['salto', 'asimetricas', 'viga', 'suelo'],
      'Juvenil GAM': ['suelo', 'arzones', 'anillas', 'salto', 'paralelas', 'barra']
    },
    ordenAparatos: {
      GAF: ['salto', 'asimetricas', 'viga', 'suelo'],
      GAM: ['suelo', 'arzones', 'anillas', 'salto', 'paralelas', 'barra']
    }
  }
};

// ===== DATOS AGREGADOS PARA FILTROS =====
export const metadatosCampeonatos = {
  // Estados disponibles
  estados: [
    { estado: 'activo' as const, count: 1 },
    { estado: 'configuracion' as const, count: 2 },
    { estado: 'finalizado' as const, count: 1 }
  ],
  
  // Tipos de competencia
  tipos: [
    { tipo: 'regional', count: 1 },
    { tipo: 'nacional', count: 1 },
    { tipo: 'escolar', count: 1 },
    { tipo: 'interclubes', count: 1 }
  ],
  
  // Regiones
  regiones: [
    { region: 'Valparaíso', count: 2 },
    { region: 'Metropolitana', count: 2 }
  ],
  
  // Modalidades
  modalidades: [
    { modalidad: 'GAF', count: 4 },
    { modalidad: 'GAM', count: 3 }
  ]
};

// ===== FUNCIÓN PARA GENERAR DATOS ADICIONALES =====
export const generarCampeonatosMock = (cantidad: number = 6): Campeonato[] => {
  const nombres = [
    'Copa Regional Norte', 'Torneo de Primavera', 'Campeonato Escolar Municipal',
    'Copa Internacional', 'Torneo de Verano', 'Campeonato Adulto Mayor'
  ];
  
  const lugares = [
    'Gimnasio Regional Antofagasta', 'Polideportivo Universidad de Chile',
    'Centro Deportivo Municipal', 'Arena Deportiva Internacional',
    'Complejo Deportivo Los Leones', 'Centro Comunitario Reñaca'
  ];
  
  return Array.from({ length: cantidad }, (_, index) => ({
    id: (mockCampeonatos.length + index + 1).toString(),
    nombre: nombres[index % nombres.length],
    lugar: lugares[index % lugares.length],
    fechaInicio: new Date(2025, 8 + index, 10 + index).toISOString().split('T')[0],
    fechaFin: new Date(2025, 8 + index, 11 + index).toISOString().split('T')[0],
    horaInicio: ['08:30', '09:00', '10:00', '14:00'][index % 4],
    estado: (['configuracion', 'activo', 'finalizado'] as const)[index % 3],
    categorias: Math.floor(Math.random() * 8) + 4,
    participantes: Math.floor(Math.random() * 150) + 50,
    delegaciones: Math.floor(Math.random() * 10) + 3,
    descripcion: `Campeonato ${index % 2 === 0 ? 'regional' : 'nacional'} de gimnasia artística`,
    activo: index % 3 === 1,
    organizador: clubes[index % clubes.length],
    tipoCompetencia: (['regional', 'nacional', 'escolar', 'interclubes'] as const)[index % 4],
    modalidades: index % 2 === 0 ? ['GAF'] : ['GAF', 'GAM'],
    edadMinima: 5,
    edadMaxima: 25,
    fechaCreacion: new Date(2025, 6, 1).toISOString(),
    ultimaActualizacion: new Date().toISOString(),
  }));
};

// Exportar campeonatos completos (básicos + generados)
export const todosMockCampeonatos = [...mockCampeonatos, ...generarCampeonatosMock(6)];