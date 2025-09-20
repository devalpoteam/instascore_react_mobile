// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import authSlice from 'src/features/auth/store/authSlice'

export const rootReducer = combineReducers({
  auth: authSlice,
  // Más reducers se añadirán aquí
})