// src/navigation/MainNavigator.tsx - ACTUALIZADO CON CAMPEONATO DETAIL
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

// Screens importadas
import HomeScreen from '@/features/home/screens/HomeScreen';
import CampeonatosScreen from '@/features/campeonatos/screens/CampeonatosScreen';
import CampeonatoDetailScreen from '@/features/campeonatos/screens/CampeonatoDetailScreen';

const Stack = createStackNavigator();

// Pantalla temporal de Resultados en Vivo
const ResultadosLiveScreen = () => {
  const responsive = useResponsive();
  
  return (
    <BaseLayout>
      <Header 
        title="Resultados en Vivo"
        subtitle="Seguimiento en tiempo real"
        showLogo={false}
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

// Pantalla temporal de Gimnastas
const GimnastasScreen = () => {
  const responsive = useResponsive();
  
  return (
    <BaseLayout>
      <Header 
        title="Gimnastas"
        subtitle="Perfiles y búsqueda"
        showLogo={false}
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
  const dispatch = useAppDispatch();
  const responsive = useResponsive();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <BaseLayout>
      <Header 
        title="Configuración"
        subtitle="Ajustes y perfil"
        showLogo={false}
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
          marginBottom: 30,
        }}>
          Ajustes de perfil y{'\n'}configuración de la app
        </Text>
       
        {/* Botón de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: getColor.secondary[500],
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            width: '80%',
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

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: getColor.background.lighter },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 250,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 200,
            },
          },
        },
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
      initialRouteName="Home"
    >
      {/* Dashboard Principal */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />
      
      {/* Resultados en Vivo - Temporal */}
      <Stack.Screen 
        name="Resultados" 
        component={ResultadosLiveScreen}
      />
      
      {/* ✅ CAMPEONATOS - IMPLEMENTADA COMPLETAMENTE */}
      <Stack.Screen 
        name="Campeonatos" 
        component={CampeonatosScreen}
      />
      
      {/* ✅ NUEVO: DETALLE DE CAMPEONATO */}
      <Stack.Screen 
        name="CampeonatoDetail" 
        component={CampeonatoDetailScreen}
      />
      
      {/* Gimnastas - Temporal */}
      <Stack.Screen 
        name="Gimnastas" 
        component={GimnastasScreen}
      />
      
      {/* Ajustes - Temporal */}
      <Stack.Screen 
        name="Ajustes" 
        component={AjustesScreen}
      />
    </Stack.Navigator>
  );
}