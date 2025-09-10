import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import { store, persistor } from '@/store';
import RootNavigator from '@/navigation/RootNavigator';
import { SplashScreen } from '@/shared/components/common';

function AppContent() {
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (url.includes('google-auth-callback')) {
        // Extraer token de la URL
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const token = urlParams.get('token');
        
        if (token) {
          // Dispatch login success
          store.dispatch({
            type: 'auth/loginSuccess',
            payload: {
              token,
              user: {
                id: 'google-user',
                email: 'google-user@gmail.com',
                name: 'Usuario Google',
                isPro: false
              }
            }
          });
        }
      }
    };

    // Manejar deep link cuando la app se abre desde cerrada
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Manejar deep link cuando la app ya está abierta
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  return <RootNavigator />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onAnimationFinish={() => setShowSplash(false)} />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
