// src/features/gimnastas/data/mockGimnastasList.ts
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

const categorias = ["Pre Kinder", "Kinder", "Mini", "Infantil", "Juvenil", "Senior"];
const niveles = ["F1", "F2", "F3", "M1", "M2", "M3"];

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

// Función para generar puntajes realistas
function generarPuntaje(categoria: string): number {
  const baseMin = categoria.includes("Kinder") ? 6.0 : categoria.includes("Mini") ? 7.0 : 8.0;
  const baseMax = categoria.includes("Kinder") ? 9.0 : categoria.includes("Mini") ? 9.5 : 10.0;
  return Math.round((Math.random() * (baseMax - baseMin) + baseMin) * 10) / 10;
}

// Función principal para generar gimnastas
function generarGimnasta(id: number): GimnastaListItem {
  const nombre = `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
  const club = clubes[Math.floor(Math.random() * clubes.length)];
  const año = 2008 + Math.floor(Math.random() * 12); // Entre 2008-2020
  
  // Seleccionar categoría basada en la edad aproximada
  const edad = 2025 - año;
  let categoria: string;
  if (edad <= 6) categoria = "Pre Kinder";
  else if (edad <= 8) categoria = "Kinder";
  else if (edad <= 10) categoria = "Mini";
  else if (edad <= 12) categoria = "Infantil";
  else if (edad <= 16) categoria = "Juvenil";
  else categoria = "Senior";
  
  const nivel = niveles[Math.floor(Math.random() * niveles.length)];
  
  // Generar historial de campeonatos (1-4 campeonatos)
  const numCampeonatos = Math.floor(Math.random() * 4) + 1;
  const campeonatosParticipados = [...campeonatos]
    .sort(() => 0.5 - Math.random())
    .slice(0, numCampeonatos)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
  // Último campeonato (más reciente)
  const ultimoCampeonato = campeonatosParticipados[0];
  const posicionUltimo = Math.floor(Math.random() * 15) + 1; // Posiciones 1-15
  const allAroundUltimo = generarPuntaje(categoria) * 4; // Simulando 4 aparatos
  
  // Mejor posición histórica
  const mejorPosicion = Math.min(posicionUltimo, Math.floor(Math.random() * posicionUltimo) + 1);
  const mejorAllAround = allAroundUltimo + Math.random() * 2; // Puede ser mejor que el último
  
  // Flags especiales
  const esMedallista = mejorPosicion <= 3;
  const activo = new Date(ultimoCampeonato.fecha).getTime() > Date.now() - (6 * 30 * 24 * 60 * 60 * 1000); // Últimos 6 meses
  
  // String de búsqueda optimizada
  const searchString = `${nombre} ${club} ${ultimoCampeonato.nombre} ${categoria}`.toLowerCase();
  
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
      categoria,
      nivel,
      posicion: posicionUltimo,
      allAround: Math.round(allAroundUltimo * 10) / 10,
      fecha: ultimoCampeonato.fecha
    },
    historialCampeonatos: campeonatosParticipados.map(c => c.id),
    categoriasCompetidas: [categoria], // Por simplicidad, una categoría por ahora
    clubes: [club], // Por simplicidad, un club por ahora
    searchString,
    esMedallista,
    activo
  };
}

// Generar 500 gimnastas
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

// Datos agregados para filtros
export const disponibleParaFiltros = {
  campeonatos: campeonatos.map(c => ({
    id: c.id,
    nombre: c.nombre,
    count: mockGimnastasList.filter(g => g.historialCampeonatos.includes(c.id)).length
  })),
  
  categorias: categorias.map(cat => ({
    categoria: cat,
    count: mockGimnastasList.filter(g => g.categoriasCompetidas.includes(cat)).length
  })).filter(c => c.count > 0),
  
  clubes: [...new Set(mockGimnastasList.map(g => g.club))]
    .map(club => ({
      club,
      count: mockGimnastasList.filter(g => g.club === club).length
    }))
    .sort((a, b) => b.count - a.count)
};

// Función de búsqueda optimizada
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