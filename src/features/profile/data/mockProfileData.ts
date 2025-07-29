// src/features/profile/data/mockProfileData.ts
import { UserProfile, FavoriteGimnasta } from "../types/profile.types";
import { mockGimnastasList } from "@/features/gimnastas/data/mockGimnastasList";

export const mockUserProfile: UserProfile = {
  id: "1",
  name: "María José González",
  email: "maria.gonzalez@email.com",
  gender: "femenino",
  age: 28,
  isPro: true,
};

export const mockUserProfileBasic: UserProfile = {
  id: "2",
  name: "Carlos Mendoza",
  email: "carlos.mendoza@email.com",
  gender: "masculino",
  age: 35,
  isPro: false,
};

// ✅ FAVORITOS CON DATOS MÁS VARIADOS Y REPRESENTATIVOS - VERSIÓN ESTÁTICA
const staticFavoriteGimnastas: FavoriteGimnasta[] = [
  // 1. Una medallista destacada (primera posición)
  {
    ...mockGimnastasList[0], // Mejor rankeada
    dateAdded: "2025-01-15",
    notificationsEnabled: true,
  },

  // 2. Una gimnasta de categoría diferente (buscar una de Mini o Infantil)
  {
    ...(mockGimnastasList.find(
      (g) => g.ultimoCampeonato.categoria === "Mini"
    ) || mockGimnastasList[15]),
    dateAdded: "2025-01-10",
    notificationsEnabled: true,
  },

  // 3. Una gimnasta juvenil/senior para variedad de edad
  {
    ...(mockGimnastasList.find(
      (g) => g.ultimoCampeonato.categoria === "Juvenil"
    ) || mockGimnastasList[25]),
    dateAdded: "2025-01-05",
    notificationsEnabled: false,
  },

  // 4. Una gimnasta de club diferente (buscar variedad en clubes)
  {
    ...(mockGimnastasList.find((g) => g.club.includes("Santiago")) ||
      mockGimnastasList[10]),
    dateAdded: "2024-12-20",
    notificationsEnabled: true,
  },

  // 5. Una gimnasta que no sea medallista pero activa (posición media)
  {
    ...(mockGimnastasList.find(
      (g) => !g.esMedallista && g.activo && g.mejorPosicion >= 5
    ) || mockGimnastasList[35]),
    dateAdded: "2024-12-15",
    notificationsEnabled: false,
  },
];

// ✅ VERSIÓN PARA USUARIOS BÁSICOS (más selectiva) - VERSIÓN ESTÁTICA
const staticFavoriteGimnastasBasic: FavoriteGimnasta[] = [
  // Solo las 2 mejores/más interesantes
  {
    ...mockGimnastasList[0], // La mejor
    dateAdded: "2025-01-15",
    notificationsEnabled: true,
  },
  {
    // Una de categoría diferente para variedad
    ...(mockGimnastasList.find(
      (g) =>
        g.ultimoCampeonato.categoria !==
        mockGimnastasList[0].ultimoCampeonato.categoria
    ) || mockGimnastasList[5]),
    dateAdded: "2025-01-10",
    notificationsEnabled: true,
  },
];

// ✅ FUNCIÓN PARA GENERAR FAVORITOS DINÁMICOS MÁS VARIADOS
export const generateVariedFavorites = (
  isPro: boolean = true
): FavoriteGimnasta[] => {
  const allGimnastas = [...mockGimnastasList];

  // Filtrar por diferentes criterios para obtener variedad
  const medallistas = allGimnastas.filter((g) => g.esMedallista);
  const activos = allGimnastas.filter((g) => g.activo && !g.esMedallista);
  const diferentes_categorias = allGimnastas.filter(
    (g) =>
      g.ultimoCampeonato.categoria !== "Kinder" &&
      g.ultimoCampeonato.categoria !== "Pre Kinder"
  );
  const clubes_variados = allGimnastas.filter(
    (g) =>
      g.club.includes("Santiago") ||
      g.club.includes("Valparaíso") ||
      g.club.includes("Elite")
  );

  let favoritos: FavoriteGimnasta[] = [];

  if (isPro) {
    // Para usuarios Pro: 5 favoritos con máxima variedad
    favoritos = [
      // 1 medallista top
      ...(medallistas.length > 0
        ? [
            {
              ...medallistas[0],
              dateAdded: "2025-01-15",
              notificationsEnabled: true,
            },
          ]
        : []),

      // 1 de categoría avanzada
      ...(diferentes_categorias.length > 0
        ? [
            {
              ...diferentes_categorias[
                Math.floor(
                  Math.random() * Math.min(5, diferentes_categorias.length)
                )
              ],
              dateAdded: "2025-01-10",
              notificationsEnabled: true,
            },
          ]
        : []),

      // 1 activo no medallista
      ...(activos.length > 0
        ? [
            {
              ...activos[
                Math.floor(Math.random() * Math.min(10, activos.length))
              ],
              dateAdded: "2025-01-05",
              notificationsEnabled: false,
            },
          ]
        : []),

      // 1 de club diferente
      ...(clubes_variados.length > 0
        ? [
            {
              ...clubes_variados[
                Math.floor(Math.random() * Math.min(5, clubes_variados.length))
              ],
              dateAdded: "2024-12-20",
              notificationsEnabled: true,
            },
          ]
        : []),

      // 1 random para completar
      {
        ...allGimnastas[
          Math.floor(Math.random() * Math.min(50, allGimnastas.length)) + 20
        ],
        dateAdded: "2024-12-15",
        notificationsEnabled: false,
      },
    ];
  } else {
    // Para usuarios básicos: 2 favoritos selectos
    favoritos = [
      // 1 medallista
      ...(medallistas.length > 0
        ? [
            {
              ...medallistas[0],
              dateAdded: "2025-01-15",
              notificationsEnabled: true,
            },
          ]
        : []),

      // 1 activo diferente
      {
        ...allGimnastas[
          Math.floor(Math.random() * Math.min(20, allGimnastas.length)) + 5
        ],
        dateAdded: "2025-01-10",
        notificationsEnabled: true,
      },
    ];
  }

  // Filtrar duplicados por ID y tomar solo la cantidad necesaria
  const uniqueFavoritos = favoritos.filter(
    (fav, index, arr) => arr.findIndex((f) => f.id === fav.id) === index
  );

  return uniqueFavoritos.slice(0, isPro ? 5 : 2);
};

// ✅ EXPORTAR LAS VERSIONES DINÁMICAS (se generan cada vez)
export const mockFavoriteGimnastas: FavoriteGimnasta[] =
  generateVariedFavorites(true);
export const mockFavoriteGimnastasBasic: FavoriteGimnasta[] =
  generateVariedFavorites(false);

// ✅ TAMBIÉN EXPORTAR LAS VERSIONES ESTÁTICAS (si se prefiere consistencia)
export const mockFavoriteGimnastasStatic: FavoriteGimnasta[] =
  staticFavoriteGimnastas;
export const mockFavoriteGimnastasBasicStatic: FavoriteGimnasta[] =
  staticFavoriteGimnastasBasic;

// Helper functions
export const getActiveFavorites = (favorites: FavoriteGimnasta[]) =>
  favorites.filter((fav) => fav.activo);

export const getMedallistaFavorites = (favorites: FavoriteGimnasta[]) =>
  favorites.filter((fav) => fav.esMedallista);

export const getGenderDisplayName = (gender?: string): string => {
  switch (gender) {
    case "masculino":
      return "Masculino";
    case "femenino":
      return "Femenino";
    case "otro":
      return "Otro";
    default:
      return "No especificado";
  }
};

// ✅ FUNCIÓN PARA AGREGAR GIMNASTA A FAVORITOS
export const addGimnastaToFavorites = (
  gimnastaId: string
): FavoriteGimnasta | null => {
  const gimnasta = mockGimnastasList.find((g) => g.id === gimnastaId);
  if (!gimnasta) return null;

  return {
    ...gimnasta,
    dateAdded: new Date().toISOString().split("T")[0],
    notificationsEnabled: true,
  };
};

// ✅ FUNCIÓN PARA OBTENER FAVORITOS POR IDS
export const getFavoritesByIds = (
  favoriteIds: string[]
): FavoriteGimnasta[] => {
  return favoriteIds
    .map((id) => mockGimnastasList.find((g) => g.id === id))
    .filter(Boolean)
    .map((gimnasta) => ({
      ...gimnasta!,
      dateAdded: "2025-01-01", // Fecha por defecto
      notificationsEnabled: true,
    }));
};
