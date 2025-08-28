// src/features/campeonatos/hooks/useCampeonatoDetail.ts
import { useState, useEffect } from 'react';
import { campeonatoDetailService } from '../../../services/api/campeonatos/campeonatoDetailService';

interface CampeonatoDetail {
  id: string;
  nombre: string;
  lugar: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  estado: 'activo' | 'configuracion' | 'finalizado';
  categorias: number;
  participantes: number;
  delegaciones: number;
}

interface UseCampeonatoDetailReturn {
  campeonato: CampeonatoDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCampeonatoDetail = (campeonatoId: string | null): UseCampeonatoDetailReturn => {
  const [campeonato, setCampeonato] = useState<CampeonatoDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampeonato = async () => {
    if (!campeonatoId) {
      setError('ID de campeonato no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Cargando campeonato con ID:', campeonatoId);
      const campeonatoData = await campeonatoDetailService.getCampeonatoById(campeonatoId);
      
      console.log('✅ Campeonato cargado:', campeonatoData.nombre);
      setCampeonato(campeonatoData);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar el campeonato';
      console.error('❌ Error al cargar campeonato:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchCampeonato();
  };

  useEffect(() => {
    fetchCampeonato();
  }, [campeonatoId]);

  return {
    campeonato,
    loading,
    error,
    refetch
  };
};