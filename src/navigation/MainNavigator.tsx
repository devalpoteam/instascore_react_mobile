// src/navigation/MainNavigator.tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/features/auth/store/authSlice'
import { colors } from '@/design/colors' // ✅ Importar colores InstaScore

const Tab = createBottomTabNavigator()

// Pantalla temporal de Campeonatos con botón de logout
const CampeonatosScreen = () => {
  const dispatch = useAppDispatch()
  const handleLogout = () => {
    dispatch(logout())
  }
  
  return (
    <View style={{
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20,
      backgroundColor: colors.background.brand // ✅ Fondo InstaScore
    }}>
      <Text style={{
        fontSize: 18, 
        marginBottom: 20,
        color: colors.primary[500] // ✅ Color InstaScore
      }}>
        Pantalla de Campeonatos
      </Text>
      <Text style={{
        textAlign: 'center', 
        marginBottom: 30,
        color: colors.gray[600] // ✅ Color InstaScore
      }}>
        Esta es una pantalla temporal para pruebas. Cuando hayas implementado la funcionalidad completa,
        esta pantalla será reemplazada por la verdadera lista de campeonatos.
      </Text>
     
      {/* Botón de Logout con colores InstaScore */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: colors.secondary[500], // ✅ Naranja InstaScore
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: 'center',
          width: '80%',
          marginTop: 20
        }}
      >
        <Text style={{color: 'white', fontWeight: 'bold'}}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
    </View>
  )
}

// Pantalla temporal de Resultados
const ResultadosScreen = () => (
  <View style={{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.background.brand // ✅ Fondo InstaScore
  }}>
    <Text style={{
      fontSize: 18,
      color: colors.primary[500] // ✅ Color InstaScore
    }}>
      Resultados
    </Text>
  </View>
)

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500], // ✅ Azul InstaScore
        tabBarInactiveTintColor: colors.gray[400], // ✅ Gris InstaScore
        tabBarStyle: {
          backgroundColor: colors.background.primary, // ✅ Blanco
          borderTopWidth: 1,
          borderTopColor: colors.gray[200], // ✅ Gris claro InstaScore
        },
      }}
    >
      <Tab.Screen name="Campeonatos" component={CampeonatosScreen} />
      <Tab.Screen name="Resultados" component={ResultadosScreen} />
    </Tab.Navigator>
  )
}