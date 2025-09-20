// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { rootReducer } from 'src/store/rootReducer'

// Transform para excluir el campo error del estado auth
const authTransform = createTransform(
  // outbound transform
  (inboundState: any) => {
    const { error, isLoading, ...rest } = inboundState;
    return rest; // No persistir error ni isLoading
  },
  // inbound transform
  (outboundState: any) => {
    return {
      ...outboundState,
      error: null, // Siempre inicializar error como null
      isLoading: false // Siempre inicializar isLoading como false
    };
  },
  { whitelist: ['auth'] }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'], // Solo persistir auth y settings
  transforms: [authTransform]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch