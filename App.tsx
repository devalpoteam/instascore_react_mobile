// App.tsx
import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { View, Text, ActivityIndicator } from 'react-native'
import { store, persistor } from '@/store'
import RootNavigator from '@/navigation/RootNavigator'
import { APP_CONFIG } from '@/core/constants'

// Loading component para PersistGate
const LoadingComponent = () => (
  <View className="flex-1 justify-center items-center bg-gray-50">
    <ActivityIndicator size="large" color="#3498db" />
    <Text className="mt-4 text-gray-600">
      Cargando {APP_CONFIG.NAME}...
    </Text>
  </View>
)

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <RootNavigator />
        <StatusBar style="auto" />
      </PersistGate>
    </Provider>
  )
}