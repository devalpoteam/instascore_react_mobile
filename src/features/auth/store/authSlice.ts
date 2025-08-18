// src/features/auth/store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService } from '../../../services/api/login/loginServices';

interface User {
  id: string
  email: string
  name: string
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
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
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
      if (credentials.email === 'dev@test.com') {
        const token = 'dev-token-123';
        await saveToken(token);
        return {
          token,
          user: {
            id: 'dev-user-id',
            email: 'dev@test.com',
            name: 'Usuario Dev',
            isPro: false,
            role: 'user'
          }
        };
      }

      const response = await loginService.login(credentials);
      await saveToken(response.token);
      return {
        token: response.token,
        user: {
          id: '',
          email: credentials.email,
          name: credentials.email,
          isPro: false,
          role: 'user'
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async () => {
    await AsyncStorage.removeItem('token');
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
    loginSuccess: (state, action: PayloadAction<{token: string, user: User}>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isPro = action.payload.user.isPro;
      state.isLoading = false;
      state.error = null;
      
      saveToken(action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isPro = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      AsyncStorage.removeItem('token').catch(err => console.error('Error removing token:', err));
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
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
        state.isPro = action.payload.user.isPro;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.isPro = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
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
  logout, 
  clearError 
} = authSlice.actions

export default authSlice.reducer