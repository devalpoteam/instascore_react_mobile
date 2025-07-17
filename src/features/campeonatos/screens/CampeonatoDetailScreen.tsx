// src/features/campeonatos/screens/CampeonatoDetailScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';
import CampeonatoStatusBadge from '../components/CampeonatoStatusBadge';
import { Campeonato } from '../types/campeonatos.types';
import { mockCampeonatos } from '../data/mockCampeonatos';

type CampeonatoDetailRouteProp = RouteProp<
  { CampeonatoDetail: { campeonatoId: string } },
  'CampeonatoDetail'
>;

export default function CampeonatoDetailScreen() {
  const route = useRoute<CampeonatoDetailRouteProp>();
  const navigation = useNavigation();
  const responsive = useResponsive();
  const { width } = Dimensions.get('window');

  // En una implementación real, esto vendría de Redux/API
  // Por ahora simulamos con mock data
  const campeonatoId = route.params?.campeonatoId || '1';
  const campeonato = mockCampeonatos.find(c => c.id === campeonatoId) || mockCampeonatos[0];

  const formatFecha = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (fechaInicio === fechaFin) {
      return format(inicio, 'd \'de\' MMMM \'de\' yyyy', { locale: es });
    }
    
    if (inicio.getMonth() === fin.getMonth()) {
      return `${format(inicio, 'd', { locale: es })} al ${format(fin, 'd \'de\' MMMM \'de\' yyyy', { locale: es })}`;
    }
    
    return `${format(inicio, 'd \'de\' MMM', { locale: es })} al ${format(fin, 'd \'de\' MMM \'de\' yyyy', { locale: es })}`;
  };

  const formatDuracion = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 día';
    return `${diffDays} días`;
  };

  const handleViewResults = () => {
    console.log('📊 Ver resultados de campeonato:', campeonato.nombre);
    
    const mensaje = campeonato.estado === 'activo' 
      ? `Ir a resultados en vivo de: ${campeonato.nombre}`
      : `Ver resultados finales de: ${campeonato.nombre}`;
      
    Alert.alert(
      'Resultados',
      mensaje,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: campeonato.estado === 'activo' ? 'Ver En Vivo' : 'Ver Resultados', 
          onPress: () => {
            // TODO: navigation.navigate('Resultados', { campeonatoId: campeonato.id });
          }
        }
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Compartir Campeonato',
      `Compartir información de: ${campeonato.nombre}`,
      [{ text: 'OK' }]
    );
  };

  const canViewResults = campeonato.estado === 'activo' || campeonato.estado === 'finalizado';

  const InfoCard = ({ 
    title, 
    children, 
    icon 
  }: { 
    title: string; 
    children: React.ReactNode; 
    icon?: string; 
  }) => (
    <View style={{
      backgroundColor: getColor.background.primary,
      borderRadius: 16,
      padding: responsive.spacing.lg,
      marginBottom: responsive.spacing.md,
      marginHorizontal: responsive.spacing.md,
      borderWidth: 1,
      borderColor: getColor.gray[200],
      shadowColor: getColor.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.spacing.md,
      }}>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={getColor.primary[500]} 
            style={{ marginRight: responsive.spacing.sm }}
          />
        )}
        <Text style={{
          fontSize: responsive.fontSize.lg,
          fontWeight: '600',
          color: getColor.primary[600],
          fontFamily: 'Nunito',
        }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  const InfoItem = ({ 
    icon, 
    label, 
    value, 
    color 
  }: { 
    icon: string; 
    label: string; 
    value: string; 
    color?: string; 
  }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: responsive.spacing.sm,
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color ? `${color}20` : getColor.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsive.spacing.md,
      }}>
        <Ionicons 
          name={icon as any} 
          size={18} 
          color={color || getColor.gray[600]} 
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: responsive.fontSize.sm,
          color: getColor.gray[500],
          fontFamily: 'Nunito',
          marginBottom: 2,
        }}>
          {label}
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          fontWeight: '600',
          color: getColor.gray[800],
          fontFamily: 'Nunito',
        }}>
          {value}
        </Text>
      </View>
    </View>
  );

  const StatCard = ({ 
    icon, 
    value, 
    label, 
    color 
  }: { 
    icon: string; 
    value: number; 
    label: string; 
    color: string; 
  }) => (
    <View style={{
      flex: 1,
      backgroundColor: `${color}10`,
      borderRadius: 16,
      padding: responsive.spacing.md,
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: `${color}30`,
    }}>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${color}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={color} 
        />
      </View>
      <Text style={{
        fontSize: responsive.fontSize['2xl'],
        fontWeight: '700',
        color: color,
        fontFamily: 'Nunito',
        marginBottom: 4,
      }}>
        {value}
      </Text>
      <Text style={{
        fontSize: responsive.fontSize.sm,
        fontWeight: '500',
        color: getColor.gray[600],
        fontFamily: 'Nunito',
        textAlign: 'center',
      }}>
        {label}
      </Text>
    </View>
  );

  return (
    <BaseLayout>
      <Header 
        title="Detalle"
        subtitle="Información del campeonato"
        showLogo={false}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: responsive.spacing.md,
          paddingBottom: 100, // Espacio para botones fijos
        }}
      >
        {/* Hero Section */}
        <View style={{
          backgroundColor: getColor.background.primary,
          borderRadius: 20,
          padding: responsive.spacing.xl,
          marginBottom: responsive.spacing.md,
          marginHorizontal: responsive.spacing.md,
          borderWidth: 1,
          borderColor: getColor.gray[200],
          shadowColor: getColor.primary[500],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: responsive.spacing.md,
          }}>
            <View style={{ flex: 1, marginRight: responsive.spacing.md }}>
              <Text style={{
                fontSize: responsive.fontSize['2xl'],
                fontWeight: '700',
                color: getColor.primary[600],
                fontFamily: 'Nunito',
                lineHeight: responsive.fontSize['2xl'] * 1.2,
                marginBottom: responsive.spacing.xs,
              }}>
                {campeonato.nombre}
              </Text>
            </View>
            <CampeonatoStatusBadge estado={campeonato.estado} size="md" />
          </View>

          {campeonato.descripcion && (
            <Text style={{
              fontSize: responsive.fontSize.base,
              color: getColor.gray[600],
              fontFamily: 'Nunito',
              lineHeight: responsive.fontSize.base * 1.5,
            }}>
              {campeonato.descripcion}
            </Text>
          )}
        </View>

        {/* Información General */}
        <InfoCard title="Información General" icon="information-circle-outline">
          <InfoItem 
            icon="location" 
            label="Lugar" 
            value={campeonato.lugar}
            color={getColor.primary[500]}
          />
          <InfoItem 
            icon="calendar" 
            label="Fechas" 
            value={formatFecha(campeonato.fechaInicio, campeonato.fechaFin)}
            color={getColor.secondary[500]}
          />
          <InfoItem 
            icon="time" 
            label="Hora de inicio" 
            value={campeonato.horaInicio}
            color={getColor.success[500]}
          />
          <InfoItem 
            icon="hourglass" 
            label="Duración" 
            value={formatDuracion(campeonato.fechaInicio, campeonato.fechaFin)}
            color={getColor.warning[500]}
          />
        </InfoCard>

        {/* Estadísticas */}
        <InfoCard title="Estadísticas de Participación" icon="stats-chart-outline">
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: responsive.spacing.sm,
          }}>
            <StatCard 
              icon="trophy"
              value={campeonato.categorias}
              label="Categorías"
              color={getColor.primary[500]}
            />
            <StatCard 
              icon="people"
              value={campeonato.participantes}
              label="Participantes"
              color={getColor.secondary[500]}
            />
            <StatCard 
              icon="flag"
              value={campeonato.delegaciones}
              label="Delegaciones"
              color={getColor.success[500]}
            />
          </View>
        </InfoCard>

        {/* Estado del Campeonato */}
        <InfoCard title="Estado del Campeonato" icon="pulse-outline">
          <View style={{
            backgroundColor: campeonato.estado === 'activo' 
              ? getColor.success[50] 
              : campeonato.estado === 'configuracion'
              ? getColor.warning[50]
              : getColor.gray[50],
            borderRadius: 12,
            padding: responsive.spacing.md,
            borderWidth: 1,
            borderColor: campeonato.estado === 'activo' 
              ? getColor.success[200] 
              : campeonato.estado === 'configuracion'
              ? getColor.warning[200]
              : getColor.gray[200],
          }}>
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: '600',
              color: campeonato.estado === 'activo' 
                ? getColor.success[700] 
                : campeonato.estado === 'configuracion'
                ? getColor.warning[700]
                : getColor.gray[700],
              fontFamily: 'Nunito',
              marginBottom: responsive.spacing.xs,
            }}>
              {campeonato.estado === 'activo' && '🔴 Campeonato en curso'}
              {campeonato.estado === 'configuracion' && '⚙️ En configuración'}
              {campeonato.estado === 'finalizado' && '✅ Campeonato finalizado'}
            </Text>
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[600],
              fontFamily: 'Nunito',
              lineHeight: responsive.fontSize.sm * 1.4,
            }}>
              {campeonato.estado === 'activo' && 'Los resultados se están actualizando en tiempo real'}
              {campeonato.estado === 'configuracion' && 'El campeonato está siendo configurado por los organizadores'}
              {campeonato.estado === 'finalizado' && 'Todos los resultados están disponibles para consulta'}
            </Text>
          </View>
        </InfoCard>
      </ScrollView>

      {/* Botones de Acción Fijos */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: getColor.background.primary,
        paddingHorizontal: responsive.spacing.md,
        paddingTop: responsive.spacing.md,
        paddingBottom: responsive.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: getColor.gray[200],
        shadowColor: getColor.gray[500],
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          gap: responsive.spacing.md,
        }}>
          {/* Botón Compartir */}
          <TouchableOpacity
            style={{
              flex: 0.3,
              backgroundColor: getColor.background.primary,
              borderWidth: 2,
              borderColor: getColor.gray[300],
              borderRadius: 16,
              paddingVertical: responsive.spacing.md,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="share-outline" 
              size={22} 
              color={getColor.gray[600]} 
            />
          </TouchableOpacity>

          {/* Botón Principal */}
          <TouchableOpacity
            style={{
              flex: 0.7,
              backgroundColor: canViewResults 
                ? (campeonato.estado === 'activo' ? getColor.secondary[500] : getColor.primary[500])
                : getColor.gray[400],
              borderRadius: 16,
              paddingVertical: responsive.spacing.md,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: canViewResults 
                ? (campeonato.estado === 'activo' ? getColor.secondary[500] : getColor.primary[500])
                : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: canViewResults ? 0.3 : 0,
              shadowRadius: 8,
              elevation: canViewResults ? 6 : 0,
            }}
            onPress={canViewResults ? handleViewResults : undefined}
            activeOpacity={canViewResults ? 0.8 : 1}
            disabled={!canViewResults}
          >
            <Ionicons 
              name={
                campeonato.estado === 'activo' 
                  ? 'play-circle' 
                  : campeonato.estado === 'finalizado'
                  ? 'bar-chart'
                  : 'settings'
              } 
              size={22} 
              color={getColor.background.primary} 
              style={{ marginRight: responsive.spacing.sm }}
            />
            <Text style={{
              fontSize: responsive.fontSize.lg,
              fontWeight: '700',
              color: getColor.background.primary,
              fontFamily: 'Nunito',
            }}>
              {campeonato.estado === 'activo' && 'VER EN VIVO'}
              {campeonato.estado === 'finalizado' && 'VER RESULTADOS'}
              {campeonato.estado === 'configuracion' && 'EN CONFIGURACIÓN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseLayout>
  );
}