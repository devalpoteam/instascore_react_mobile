// src/features/auth/store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService } from '../../../services/api/login/loginServices';
import { registerService } from '../../../services/api/login/registerServices';

interface User {
  id: string
  email: string
  name: string
  isPro: boolean
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  userId: string | null
  isPro: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  userId: null,
  isPro: false,
  isLoading: false,
  error: null
}

const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (err) {
    console.error('Error saving token:', err);
  }
};

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {

      const response = await loginService.login(credentials);
      await saveToken(response.token);
      return {
        token: response.token,
        userId: response.userId,
        user: {
          id: response.userId,
          email: credentials.email,
          name: credentials.email,
          isPro: response.premium
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async (userData: { email: string; password: string; fullName: string; Sexo: string; Edad: string }, { rejectWithValue, dispatch }) => {
    try {
      // 1. Registrar usuario
      const registerResponse = await registerService.register(userData);
      
      // 2. Auto-login después del registro exitoso
      const loginResponse = await loginService.login({
        email: userData.email,
        password: userData.password
      });
      
      await saveToken(loginResponse.token);
      
      return {
        token: loginResponse.token,
        userId: loginResponse.userId,
        user: {
          id: loginResponse.userId,
          email: userData.email,
          name: userData.fullName,
          isPro: loginResponse.premium
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const user = state.auth.user;
      
      if (user?.email) {
        // Call server logout endpoint
        await loginService.logout({
          email: user.email,
          password: '' // Server might not need password for logout
        });
      }
      
      // Remove token from storage
      await AsyncStorage.removeItem('token');
    } catch (error: any) {
      // Even if server logout fails, still remove token locally
      await AsyncStorage.removeItem('token');
      console.warn('Server logout failed, but local logout completed:', error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{token: string, userId: string, user: User}>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userId = action.payload.userId;
      state.isPro = action.payload.user.isPro;
      state.isLoading = false;
      state.error = null;
      
      saveToken(action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.userId = null;
      state.isPro = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{token: string, userId: string, user: User}>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userId = action.payload.userId;
      state.isPro = action.payload.user.isPro;
      state.isLoading = false;
      state.error = null;
      
      saveToken(action.payload.token);
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.userId = null;
      state.isPro = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      AsyncStorage.removeItem('token').catch(err => console.error('Error removing token:', err));
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.userId = null;
      state.isPro = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.isPro = action.payload.user.isPro;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.userId = null;
        state.isPro = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.isPro = action.payload.user.isPro;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.userId = null;
        state.isPro = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.userId = null;
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