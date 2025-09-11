import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface ImmersiveHelperProps {
  enabled?: boolean;
  children: React.ReactNode;
}

const ImmersiveHelper: React.FC<ImmersiveHelperProps> = ({ 
  enabled = true, 
  children 
}) => {
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android' && enabled) {
        // Configurar StatusBar para modo inmersivo en Android
        StatusBar.setHidden(false);
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent', true);
        
        return () => {
          // Restaurar configuración normal al salir
          StatusBar.setHidden(false);
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor('#ffffff', true);
        };
      }
    }, [enabled])
  );

  return <>{children}</>;
};

export default ImmersiveHelper;