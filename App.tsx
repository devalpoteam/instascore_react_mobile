import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { View, Text, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context' // ✅ AGREGAR ESTO
import { store, persistor } from '@/store'
import RootNavigator from '@/navigation/RootNavigator'
import { APP_CONFIG } from '@/core/constants'

// Loading component para PersistGate
const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
    <ActivityIndicator size="large" color="#3498db" />
    <Text style={{ marginTop: 16, color: '#6b7280' }}>
      Cargando {APP_CONFIG.NAME}...
    </Text>
  </View>
)

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingComponent />} persistor={persistor}>
            <RootNavigator />
            <StatusBar style="auto" />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}