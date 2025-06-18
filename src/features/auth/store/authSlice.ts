// src/features/auth/store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string
  email: string
  name: string
  gender?: string
  age?: number
  isPro: boolean
  role?: string
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  isPro: boolean
  isLoading: boolean
  error: string | null
  isRegistering: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isPro: false,
  isLoading: false,
  error: null,
  isRegistering: false
}

// Async thunk para cerrar sesión
export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      // Eliminar token de AsyncStorage
      await AsyncStorage.removeItem('token');
      return null;
    } catch (error) {
      return rejectWithValue('Error al cerrar sesión');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{token: string, user: User}>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      state.isPro = action.payload.user.isPro
      state.isLoading = false
      state.error = null
      
      // Guardar token en AsyncStorage
      AsyncStorage.setItem('token', action.payload.token)
        .catch(err => console.error('Error saving token:', err));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.isPro = false
      state.isLoading = false
      state.error = action.payload
    },
    
    // Register actions
    registerStart: (state) => {
      state.isLoading = true
      state.isRegistering = true
      state.error = null
    },
    registerSuccess: (state, action: PayloadAction<{token: string, user: User}>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      state.isPro = action.payload.user.isPro
      state.isLoading = false
      state.isRegistering = false
      state.error = null
      
      // Guardar token en AsyncStorage
      AsyncStorage.setItem('token', action.payload.token)
        .catch(err => console.error('Error saving token:', err));
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.isRegistering = false
      state.error = action.payload
    },
    
    // Logout action
    logout: (state) => {
      // Eliminar token de AsyncStorage
      AsyncStorage.removeItem('token')
        .catch(err => console.error('Error removing token:', err));
        
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.isPro = false
      state.isLoading = false
      state.error = null
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isPro = false;
    });
  }
})

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart,
  registerSuccess,
  registerFailure,
  logout, 
  clearError 
} = authSlice.actions

export default authSlice.reducer