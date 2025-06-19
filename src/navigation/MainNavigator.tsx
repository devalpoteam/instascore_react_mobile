// src/navigation/MainNavigator.tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/features/auth/store/authSlice'


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
      
    }}>
      <Text style={{
        fontSize: 18, 
        marginBottom: 20,
       
      }}>
        Pantalla de Campeonatos
      </Text>
      <Text style={{
        textAlign: 'center', 
        marginBottom: 30,
        
      }}>
        Esta es una pantalla temporal para pruebas. Cuando hayas implementado la funcionalidad completa,
        esta pantalla será reemplazada por la verdadera lista de campeonatos.
      </Text>
     
      {/* Botón de Logout con colores InstaScore */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
        
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

  }}>
    <Text style={{
      fontSize: 18,
      
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
        tabBarStyle: {
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen name="Campeonatos" component={CampeonatosScreen} />
      <Tab.Screen name="Resultados" component={ResultadosScreen} />
    </Tab.Navigator>
  )
}