// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BaseLayout from '@/shared/components/layout/BaseLayout';
import Header from '@/shared/components/layout/Header';

// Importar la nueva HomeScreen
import HomeScreen from '@/features/home/screens/HomeScreen';

const Stack = createStackNavigator();

// Pantalla temporal de Resultados en Vivo
const ResultadosLiveScreen = () => {
  const responsive = useResponsive();
  
  return (
    <BaseLayout>
      <Header 
        title="Resultados en Vivo"
        subtitle="Seguimiento en tiempo real"
        showLogo={false} // Asegurar que no muestre logo
      />
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Ionicons 
          name="play-circle" 
          size={64} 
          color={getColor.secondary[500]} 
          style={{ marginBottom: 20 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.xl,
          fontWeight: '600',
          color: getColor.primary[500],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          Resultados en Vivo
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Aquí se mostrarán los resultados{'\n'}en tiempo real del campeonato
        </Text>
      </View>
    </BaseLayout>
  );
};

// Pantalla temporal de Campeonatos
const CampeonatosScreen = () => {
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <BaseLayout>
      <Header 
        title="Campeonatos"
        subtitle="Lista de competencias"
        showLogo={false} // Asegurar que no muestre logo
      />
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
      }}>
        <Ionicons 
          name="trophy" 
          size={64} 
          color={getColor.primary[500]} 
          style={{ marginBottom: 20 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.xl,
          fontWeight: '600',
          color: getColor.primary[500],
          fontFamily: 'Nunito',
          marginBottom: 12,
        }}>
          Lista de Campeonatos
        </Text>
        <Text style={{
          textAlign: 'center', 
          marginBottom: 30,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          fontSize: responsive.fontSize.base,
          lineHeight: 24,
        }}>
          Esta pantalla mostrará todos los{'\n'}campeonatos disponibles
        </Text>
       
        {/* Botón de Logout con estilo consistente */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: getColor.secondary[500],
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            width: '80%',
            marginTop: 20,
            shadowColor: getColor.secondary[500],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
          activeOpacity={0.8}
        >
          <Text style={{
            color: getColor.background.primary, 
            fontWeight: '600',
            fontSize: responsive.fontSize.base,
            fontFamily: 'Nunito',
          }}>
            CERRAR SESIÓN
          </Text>
        </TouchableOpacity>
      </View>
    </BaseLayout>
  );
};

// Pantalla temporal de Gimnastas
const GimnastasScreen = () => {
  const responsive = useResponsive();
  
  return (
    <BaseLayout>
      <Header 
        title="Gimnastas"
        subtitle="Perfiles y búsqueda"
        showLogo={false} // Asegurar que no muestre logo
      />
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Ionicons 
          name="people" 
          size={64} 
          color={getColor.primary[500]} 
          style={{ marginBottom: 20 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.xl,
          fontWeight: '600',
          color: getColor.primary[500],
          fontFamily: 'Nunito',
          textAlign: 'center',
          marginBottom: 12,
        }}>
          Gimnastas
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Búsqueda y perfiles de{'\n'}gimnastas participantes
        </Text>
      </View>
    </BaseLayout>
  );
};

// Pantalla temporal de Ajustes
const AjustesScreen = () => {
  const responsive = useResponsive();
  
  return (
    <BaseLayout>
      <Header 
        title="Configuración"
        subtitle="Ajustes y perfil"
        showLogo={false} // Asegurar que no muestre logo
      />
      <View style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Ionicons 
          name="settings" 
          size={64} 
          color={getColor.primary[500]} 
          style={{ marginBottom: 20 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.xl,
          fontWeight: '600',
          color: getColor.primary[500],
          fontFamily: 'Nunito',
          marginBottom: 12,
        }}>
          Configuración
        </Text>
        <Text style={{
          fontSize: responsive.fontSize.base,
          color: getColor.gray[600],
          fontFamily: 'Nunito',
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Ajustes de perfil y{'\n'}configuración de la app
        </Text>
      </View>
    </BaseLayout>
  );
};

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: getColor.background.lighter },
        // 🚀 SIN TRANSICIONES - PERO SIN GLITCHES
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 0,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 0,
            },
          },
        },
        cardStyleInterpolator: () => ({
          cardStyle: {
            opacity: 1, // Siempre visible, sin animación
          },
        }),
      }}
      initialRouteName="Home"
    >
      {/* Dashboard Principal - Nueva pantalla */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />
      
      {/* Resultados en Vivo - Según imagen de referencia */}
      <Stack.Screen 
        name="Resultados" 
        component={ResultadosLiveScreen}
      />
      
      {/* Campeonatos - Según imagen de referencia */}
      <Stack.Screen 
        name="Campeonatos" 
        component={CampeonatosScreen}
      />
      
      {/* Gimnastas - Según imagen de referencia */}
      <Stack.Screen 
        name="Gimnastas" 
        component={GimnastasScreen}
      />
      
      {/* Ajustes - Según imagen de referencia */}
      <Stack.Screen 
        name="Ajustes" 
        component={AjustesScreen}
      />
    </Stack.Navigator>
  );
}