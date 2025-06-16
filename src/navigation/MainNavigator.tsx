// src/navigation/MainNavigator.tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text } from 'react-native'

const Tab = createBottomTabNavigator()

// Pantallas temporales
const CampeonatosScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Campeonatos</Text>
  </View>
)

const ResultadosScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Resultados</Text>
  </View>
)

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Campeonatos" component={CampeonatosScreen} />
      <Tab.Screen name="Resultados" component={ResultadosScreen} />
    </Tab.Navigator>
  )
}