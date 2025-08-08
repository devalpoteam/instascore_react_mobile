// src/features/gimnastas/data/mockGimnastasList.ts
// DATOS MOCK ACTUALIZADOS CON JERARQUÍA CORRECTA DE COMPETENCIAS

import { GimnastaListItem } from '../types/gimnastasList.types';

// Arrays de datos base para generar combinaciones realistas
const nombres = [
  "Ana María", "Beatriz", "Carmen", "Diana", "Elena", "Fernanda", "Gabriela", "Helena",
  "Isabella", "Javiera", "Karla", "Lucía", "Magdalena", "Natalia", "Olivia", "Paulina",
  "Regina", "Sofía", "Tamara", "Valentina", "Ximena", "Yasmín", "Zoe", "Amanda",
  "Camila", "Daniela", "Esperanza", "Florencia", "Gloria", "Isadora", "Josefa",
  "Antonia", "Benjamín", "Carlos", "Diego", "Eduardo", "Fernando", "Gonzalo", "Hugo",
  "Ignacio", "Joaquín", "Kevin", "Luis", "Manuel", "Nicolás", "Oscar", "Pablo",
  "Rodrigo", "Sebastián", "Tomás", "Vicente", "Williams", "Xavier", "Yerko", "Zacarías"
];

const apellidos = [
  "Aguilar", "Benavente", "Carrasco", "Díaz", "Espinoza", "Fernández", "García", "Hernández",
  "Ibarra", "Jiménez", "López", "Martínez", "Núñez", "Ortega", "Pérez", "Quintana",
  "Ramírez", "Sánchez", "Torres", "Urrutia", "Valdés", "Werner", "Yáñez", "Zapata",
  "Alvarez", "Bravo", "Castro", "Delgado", "Escobar", "Flores", "González", "Herrera",
  "Iglesias", "Jara", "King", "Lara", "Morales", "Navarro", "Olivares", "Pinto",
  "Rojas", "Silva", "Tapia", "Uribe", "Vargas", "Wilson", "Ximena", "Zavala"
];

const clubes = [
  "Delegación de Matías", "Club Gimnástico Valparaíso", "Academia Deportiva Santiago",
  "Escuela de Gimnasia Elite", "Club Artístico Las Condes", "Gimnasia Integral Viña",
  "Centro Deportivo Maipú", "Academia Nacional", "Club Deportivo Providencia",
  "Escuela Municipal", "Club Regional Norte", "Academia San Patricio",
  "Centro de Alto Rendimiento", "Club Universidad", "Gimnasia Artística Sur",
  "Escuela de Talentos", "Club Metropolitan", "Academia Los Andes", "Club Cordillera",
  "Escuela Integral", "Club Ciudad", "Academia Central", "Club Deportivo Oriente",
  "Escuela Regional", "Club Nacional Chile"
];

const campeonatos = [
  { id: "1", nombre: "Copa Valparaíso 2025", fecha: "2025-06-15" },
  { id: "2", nombre: "Torneo Nacional Juvenil 2025", fecha: "2025-05-20" },
  { id: "3", nombre: "Copa Regional Centro 2024", fecha: "2024-11-10" },
  { id: "4", nombre: "Campeonato Nacional 2024", fecha: "2024-09-15" },
  { id: "5", nombre: "Copa de Primavera 2024", fecha: "2024-10-05" },
  { id: "6", nombre: "Torneo Interclubes 2024", fecha: "2024-08-20" },
  { id: "7", nombre: "Copa Regional Sur 2024", fecha: "2024-07-30" },
  { id: "8", nombre: "Campeonato Escolar 2024", fecha: "2024-06-25" },
];

// ✅ JERARQUÍA CORRECTA DE COMPETENCIAS
const configuracionesCompetencias = [
  // === CATEGORÍA PRE KINDER ===
  { categoria: "Pre Kinder", nivel: null, franja: "F1", display: "Pre Kinder F1", edadMin: 4, edadMax: 5 },
  { categoria: "Pre Kinder", nivel: null, franja: "M1", display: "Pre Kinder M1", edadMin: 4, edadMax: 5 },
  
  // === CATEGORÍA KINDER ===
  { categoria: "Kinder", nivel: "Nivel 1", franja: "F1", display: "Kinder 1 F1", edadMin: 5, edadMax: 7 },
  { categoria: "Kinder", nivel: "Nivel 1", franja: "F2", display: "Kinder 1 F2", edadMin: 5, edadMax: 7 },
  { categoria: "Kinder", nivel: "Nivel 2", franja: "F1", display: "Kinder 2 F1", edadMin: 6, edadMax: 8 },
  { categoria: "Kinder", nivel: "Nivel 2", franja: "F2", display: "Kinder 2 F2", edadMin: 6, edadMax: 8 },
  { categoria: "Kinder", nivel: "Nivel 1", franja: "M1", display: "Kinder 1 M1", edadMin: 5, edadMax: 7 },
  { categoria: "Kinder", nivel: "Nivel 2", franja: "M1", display: "Kinder 2 M1", edadMin: 6, edadMax: 8 },
  
  // === CATEGORÍA MINI ===
  { categoria: "Mini", nivel: null, franja: "F1", display: "Mini F1", edadMin: 7, edadMax: 9 },
  { categoria: "Mini", nivel: null, franja: "F2", display: "Mini F2", edadMin: 7, edadMax: 9 },
  { categoria: "Mini", nivel: null, franja: "M1", display: "Mini M1", edadMin: 7, edadMax: 9 },
  
  // === CATEGORÍA USAG ===
  { categoria: "USAG", nivel: "Nivel 1", franja: "F1", display: "USAG 1 F1", edadMin: 6, edadMax: 8 },
  { categoria: "USAG", nivel: "Nivel 2", franja: "F1", display: "USAG 2 F1", edadMin: 7, edadMax: 9 },
  { categoria: "USAG", nivel: "Nivel 3", franja: "F1", display: "USAG 3 F1", edadMin: 8, edadMax: 10 },
  { categoria: "USAG", nivel: "Nivel 3", franja: "F2", display: "USAG 3 F2", edadMin: 8, edadMax: 11 },
  { categoria: "USAG", nivel: "Nivel 4", franja: "F1", display: "USAG 4 F1", edadMin: 9, edadMax: 12 },
  { categoria: "USAG", nivel: "Nivel 5", franja: "F1", display: "USAG 5 F1", edadMin: 10, edadMax: 14 },
  { categoria: "USAG", nivel: "Nivel 5", franja: "M1", display: "USAG 5 M1", edadMin: 10, edadMax: 14 },
  
  // === CATEGORÍAS AVANZADAS ===
  { categoria: "Infantil", nivel: null, franja: "F1", display: "Infantil F1", edadMin: 9, edadMax: 11 },
  { categoria: "Infantil", nivel: null, franja: "M1", display: "Infantil M1", edadMin: 9, edadMax: 11 },
  { categoria: "Juvenil", nivel: null, franja: "F1", display: "Juvenil F1", edadMin: 12, edadMax: 16 },
  { categoria: "Juvenil", nivel: null, franja: "M1", display: "Juvenil M1", edadMin: 12, edadMax: 16 },
  { categoria: "Senior", nivel: null, franja: "F1", display: "Senior F1", edadMin: 16, edadMax: 25 },
  { categoria: "Senior", nivel: null, franja: "M1", display: "Senior M1", edadMin: 16, edadMax: 25 },
];

// Función para generar un RUT chileno válido
function generarRUT(): string {
  const numero = Math.floor(Math.random() * 99999999) + 1000000;
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

// Función para generar puntajes realistas según categoría
function generarPuntaje(categoria: string, nivel: string | null): number {
  let baseMin = 6.0;
  let baseMax = 9.5;
  
  if (categoria === "Pre Kinder") {
    baseMin = 6.5; baseMax = 8.5;
  } else if (categoria === "Kinder") {
    if (nivel === "Nivel 1") {
      baseMin = 7.0; baseMax = 8.8;
    } else {
      baseMin = 7.2; baseMax = 9.0;
    }
  } else if (categoria === "Mini") {
    baseMin = 7.5; baseMax = 9.2;
  } else if (categoria === "USAG") {
    const numeroNivel = nivel ? parseInt(nivel.replace('Nivel ', '')) : 3;
    baseMin = 7.0 + (numeroNivel * 0.2);
    baseMax = 8.5 + (numeroNivel * 0.3);
  } else if (categoria === "Infantil") {
    baseMin = 8.0; baseMax = 9.4;
  } else if (categoria === "Juvenil") {
    baseMin = 8.2; baseMax = 9.6;
  } else if (categoria === "Senior") {
    baseMin = 8.5; baseMax = 9.8;
  }
  
  return Math.round((Math.random() * (baseMax - baseMin) + baseMin) * 100) / 100;
}

// Función para determinar competencia según edad
function determinarCompetencia(edad: number): any {
  const competenciasValidas = configuracionesCompetencias.filter(comp => 
    edad >= comp.edadMin && edad <= comp.edadMax
  );
  
  if (competenciasValidas.length === 0) {
    // Fallback para edades fuera de rango
    if (edad < 5) return configuracionesCompetencias[0]; // Pre Kinder F1
    if (edad > 25) return configuracionesCompetencias[configuracionesCompetencias.length - 1]; // Senior M1
  }
  
  return competenciasValidas[Math.floor(Math.random() * competenciasValidas.length)];
}

// Función principal para generar gimnastas
function generarGimnasta(id: number): GimnastaListItem {
  const nombre = `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
  const club = clubes[Math.floor(Math.random() * clubes.length)];
  const año = 2008 + Math.floor(Math.random() * 15); // Entre 2008-2023
  const edad = 2025 - año;
  
  // ✅ DETERMINAR COMPETENCIA SEGÚN EDAD
  const competencia = determinarCompetencia(edad);
  
  // Generar historial de campeonatos (1-4 campeonatos)
  const numCampeonatos = Math.floor(Math.random() * 4) + 1;
  const campeonatosParticipados = [...campeonatos]
    .sort(() => 0.5 - Math.random())
    .slice(0, numCampeonatos)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
  // Último campeonato (más reciente)
  const ultimoCampeonato = campeonatosParticipados[0];
  const posicionUltimo = Math.floor(Math.random() * 20) + 1; // Posiciones 1-20
  
  // Generar puntajes realistas según la categoría
  const numAparatos = competencia.categoria === "Kinder" && competencia.nivel === "Nivel 1" ? 3 : 4;
  const allAroundUltimo = Array.from({length: numAparatos}, () => 
    generarPuntaje(competencia.categoria, competencia.nivel)
  ).reduce((sum, p) => sum + p, 0);
  
  // Mejor posición histórica (puede ser mejor que la última)
  const mejorPosicion = Math.min(posicionUltimo, Math.floor(Math.random() * posicionUltimo) + 1);
  const mejorAllAround = allAroundUltimo + (Math.random() * 2); // Puede ser mejor
  
  // Flags especiales
  const esMedallista = mejorPosicion <= 3;
  const activo = new Date(ultimoCampeonato.fecha).getTime() > Date.now() - (6 * 30 * 24 * 60 * 60 * 1000); // Últimos 6 meses
  
  // String de búsqueda optimizada
  const searchString = `${nombre} ${club} ${ultimoCampeonato.nombre} ${competencia.display}`.toLowerCase();
  
  return {
    id: id.toString().padStart(3, '0'),
    nombre,
    club,
    rut: generarRUT(),
    año,
    mejorPosicion,
    mejorAllAround: Math.round(mejorAllAround * 10) / 10,
    ultimoCampeonato: {
      id: ultimoCampeonato.id,
      nombre: ultimoCampeonato.nombre,
      categoria: competencia.categoria,
      nivel: competencia.display, // ✅ Usar display completo: "Kinder 2 F1"
      posicion: posicionUltimo,
      allAround: Math.round(allAroundUltimo * 10) / 10,
      fecha: ultimoCampeonato.fecha
    },
    historialCampeonatos: campeonatosParticipados.map(c => c.id),
    categoriasCompetidas: [competencia.categoria], // ✅ Categoría base
    clubes: [club],
    searchString,
    esMedallista,
    activo
  };
}

// Generar 500 gimnastas con distribución realista
export const mockGimnastasList: GimnastaListItem[] = Array.from(
  { length: 500 }, 
  (_, index) => generarGimnasta(index + 1)
).sort((a, b) => {
  // Ordenar por: medallistas primero, luego por mejor posición, luego alfabético
  if (a.esMedallista && !b.esMedallista) return -1;
  if (!a.esMedallista && b.esMedallista) return 1;
  if (a.mejorPosicion !== b.mejorPosicion) return a.mejorPosicion - b.mejorPosicion;
  return a.nombre.localeCompare(b.nombre);
});

// ✅ DATOS AGREGADOS PARA FILTROS CON NUEVA ESTRUCTURA
export const disponibleParaFiltros = {
  campeonatos: campeonatos.map(c => ({
    id: c.id,
    nombre: c.nombre,
    count: mockGimnastasList.filter(g => g.historialCampeonatos.includes(c.id)).length
  })),
  
  // ✅ CATEGORÍAS BASES (sin nivel técnico)
  categorias: [...new Set(mockGimnastasList.map(g => g.categoriasCompetidas[0]))]
    .map(cat => ({
      categoria: cat,
      count: mockGimnastasList.filter(g => g.categoriasCompetidas.includes(cat)).length
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => {
      const orden = ["Pre Kinder", "Kinder", "Mini", "USAG", "Infantil", "Juvenil", "Senior"];
      return orden.indexOf(a.categoria) - orden.indexOf(b.categoria);
    }),
  
  // ✅ NIVELES COMPLETOS (con jerarquía completa)
  nivelesCompletos: [...new Set(mockGimnastasList.map(g => g.ultimoCampeonato.nivel))]
    .map(nivel => ({
      nivel: nivel,
      count: mockGimnastasList.filter(g => g.ultimoCampeonato.nivel === nivel).length
    }))
    .filter(n => n.count > 0)
    .sort((a, b) => a.nivel.localeCompare(b.nivel)),
  
  clubes: [...new Set(mockGimnastasList.map(g => g.club))]
    .map(club => ({
      club,
      count: mockGimnastasList.filter(g => g.club === club).length
    }))
    .sort((a, b) => b.count - a.count)
};

// ✅ FUNCIÓN DE BÚSQUEDA OPTIMIZADA CON NUEVA ESTRUCTURA
export const buscarGimnastas = (
  gimnastas: GimnastaListItem[],
  searchTerm: string,
  filters: any = {}
): GimnastaListItem[] => {
  let resultado = [...gimnastas];
  
  // Filtro por término de búsqueda
  if (searchTerm.trim()) {
    const termino = searchTerm.toLowerCase().trim();
    resultado = resultado.filter(g => 
      g.searchString.includes(termino)
    );
  }
  
  // Aplicar otros filtros
  if (filters.campeonatoId) {
    resultado = resultado.filter(g => 
      g.historialCampeonatos.includes(filters.campeonatoId)
    );
  }
  
  if (filters.categoria) {
    resultado = resultado.filter(g => 
      g.categoriasCompetidas.includes(filters.categoria)
    );
  }
  
  // ✅ NUEVO: Filtro por nivel completo
  if (filters.nivelCompleto) {
    resultado = resultado.filter(g => 
      g.ultimoCampeonato.nivel === filters.nivelCompleto
    );
  }
  
  if (filters.soloMedallistas) {
    resultado = resultado.filter(g => g.esMedallista);
  }
  
  if (filters.soloActivos) {
    resultado = resultado.filter(g => g.activo);
  }
  
  if (filters.club) {
    resultado = resultado.filter(g => g.club === filters.club);
  }
  
  return resultado;
};

// ✅ ESTADÍSTICAS ADICIONALES
export const estadisticasGenerales = {
  totalGimnastas: mockGimnastasList.length,
  medallistas: mockGimnastasList.filter(g => g.esMedallista).length,
  activos: mockGimnastasList.filter(g => g.activo).length,
  
  // Distribución por categorías
  distribucionCategorias: disponibleParaFiltros.categorias,
  
  // Distribución por edades
  distribucionEdades: (() => {
    const edades = mockGimnastasList.map(g => 2025 - g.año);
    const grupos = {
      'Pre Escolar (4-5)': edades.filter(e => e >= 4 && e <= 5).length,
      'Escolar Menor (6-8)': edades.filter(e => e >= 6 && e <= 8).length,
      'Escolar Mayor (9-11)': edades.filter(e => e >= 9 && e <= 11).length,
      'Adolescente (12-16)': edades.filter(e => e >= 12 && e <= 16).length,
      'Adulto Joven (17+)': edades.filter(e => e >= 17).length,
    };
    return grupos;
  })(),
  
  // Top clubes
  topClubes: disponibleParaFiltros.clubes.slice(0, 10)
};