// App.tsx
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert } from 'react-native';
import Button from '@/shared/components/ui/Button';  // ✅ Import absoluto
import { APP_CONFIG } from '@/core/constants';

export default function App() {
  const handlePress = () => {
    Alert.alert('¡Funciona!', `${APP_CONFIG.NAME} v${APP_CONFIG.VERSION} totalmente configurado`);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      <Text className="text-3xl font-bold text-primary mb-2">
        {APP_CONFIG.NAME}
      </Text>
      <Text className="text-base text-gray-600 mb-8 text-center">
        Versión {APP_CONFIG.VERSION} - Arquitectura Completa
      </Text>
      
      <Button 
        title="Probar Configuración" 
        onPress={handlePress}
        className="mb-4"
      />
      
      <Button 
        title="Botón Secundario" 
        onPress={handlePress}
        variant="secondary"
      />
      
      <View className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <Text className="text-success text-center leading-6 font-medium">
          ✅ NativeWind funcionando{'\n'}
          ✅ Imports absolutos: @/shared{'\n'}
          ✅ Constantes: @/core/constants{'\n'}
          ✅ TypeScript + Tailwind{'\n'}
          ✅ Listo para Redux y navegación
        </Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}