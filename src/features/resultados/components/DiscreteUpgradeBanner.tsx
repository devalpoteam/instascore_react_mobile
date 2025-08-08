// src/features/resultados/components/DiscreteUpgradeBanner.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  LayoutAnimation, 
  UIManager, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DiscreteUpgradeBannerProps {
  onUpgrade: () => void;
  onDismiss: () => void;
}

interface ProFeature {
  icon: any; // Cambio para aceptar cualquier icono de Ionicons
  title: string;
  description: string;
}

// Beneficios Pro basados en la documentación de InstaScore
const PRO_FEATURES: ProFeature[] = [
  {
    icon: 'trophy',
    title: 'Resultados Completos',
    description: 'Ver TODAS las posiciones, no solo el TOP 3',
  },
  {
    icon: 'search',
    title: 'Búsqueda de Gimnastas',
    description: 'Buscar cualquier gimnasta por nombre específico',
  },
  {
    icon: 'filter',
    title: 'Filtros Avanzados',
    description: 'Filtrar por delegación, club, aparato, categoría',
  },
  {
    icon: 'people',
    title: 'Resultados por Equipos',
    description: 'Ver rankings y suma total por delegaciones',
  },
  {
    icon: 'medal',
    title: 'All Around Completo',
    description: 'Clasificación general con suma de todos los aparatos',
  },
  {
    icon: 'time',
    title: 'Historial de Gimnastas',
    description: 'Historial completo de competencias anteriores',
  },
];

export default function DiscreteUpgradeBanner({ 
  onUpgrade, 
  onDismiss 
}: DiscreteUpgradeBannerProps) {
  const responsive = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    // Animación suave del layout
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    setIsExpanded(!isExpanded);
  };

  const renderFeature = (feature: ProFeature, index: number) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: responsive.spacing.sm,
        paddingHorizontal: responsive.spacing.xs,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: getColor.background.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: responsive.spacing.sm,
          marginTop: 2,
        }}
      >
        <Ionicons
          name={feature.icon}
          size={12}
          color={getColor.primary[600]}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: responsive.fontSize.xs,
            fontWeight: '600',
            color: getColor.background.primary,
            fontFamily: 'Nunito',
            marginBottom: 2,
          }}
        >
          {feature.title}
        </Text>
        <Text
          style={{
            fontSize: responsive.fontSize.xs - 1,
            color: getColor.background.primary,
            fontFamily: 'Nunito',
            opacity: 0.9,
            lineHeight: (responsive.fontSize.xs - 1) * 1.3,
          }}
        >
          {feature.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: getColor.primary[500],
        marginHorizontal: responsive.spacing.md,
        marginTop: responsive.spacing.sm,
        borderRadius: 8,
        padding: responsive.spacing.sm,
        shadowColor: getColor.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header principal */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {/* Icono */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: getColor.background.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: responsive.spacing.sm,
          }}
        >
          <Ionicons name="star" size={16} color={getColor.primary[500]} />
        </View>

        {/* Texto principal */}
        <View style={{ flex: 1, marginRight: responsive.spacing.sm }}>
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.background.primary,
              fontFamily: 'Nunito',
              fontWeight: '500',
            }}
          >
            Actualiza a Pro para ver todos los resultados y funciones avanzadas
          </Text>
          
          {/* Botón "Más/Menos Información" underlineado */}
          <TouchableOpacity
            onPress={toggleExpanded}
            style={{ marginTop: 4 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.background.primary,
                fontFamily: 'Nunito',
                fontWeight: '500',
                textDecorationLine: 'underline',
                opacity: 0.9,
              }}
            >
              {isExpanded ? 'Menos Información' : 'Más Información...'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón upgrade */}
        <TouchableOpacity
          style={{
            backgroundColor: getColor.background.primary,
            borderRadius: 6,
            paddingHorizontal: responsive.spacing.sm,
            paddingVertical: 4,
            marginRight: responsive.spacing.xs,
          }}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.primary[600],
              fontFamily: 'Nunito',
              fontWeight: '600',
            }}
          >
            Upgrade
          </Text>
        </TouchableOpacity>

        {/* Botón cerrar */}
        <TouchableOpacity
          onPress={onDismiss}
          style={{
            padding: 4,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={16} color={getColor.background.primary} />
        </TouchableOpacity>
      </View>

      {/* Contenido expandible - Lista de beneficios */}
      {isExpanded && (
        <View style={{ marginTop: responsive.spacing.md }}>
          {/* Separator */}
          <View
            style={{
              height: 1,
              backgroundColor: getColor.background.primary,
              opacity: 0.3,
              marginBottom: responsive.spacing.md,
            }}
          />

          {/* Lista de beneficios Pro */}
          <View style={{ marginBottom: responsive.spacing.md }}>
            {PRO_FEATURES.map((feature, index) => renderFeature(feature, index))}
          </View>

          {/* Botón CTA adicional cuando expandido */}
          <TouchableOpacity
            style={{
              backgroundColor: getColor.secondary[500],
              borderRadius: 6,
              paddingVertical: responsive.spacing.sm,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            }}
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '700',
                color: getColor.background.primary,
                fontFamily: 'Nunito',
              }}
            >
              🚀 Actualizar a InstaScore Pro
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}