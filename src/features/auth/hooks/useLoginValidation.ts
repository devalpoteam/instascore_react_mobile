// src/features/auth/hooks/useLoginValidation.ts
import { useState } from 'react';

export const useLoginValidation = () => {
  // ERRORES DE VALIDACIÓN
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // VALIDACIÓN DE EMAIL
  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("El correo es requerido");
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Ingresa un correo válido");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  // VALIDACIÓN DE PASSWORD
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  // VALIDACIÓN COMPLETA
  const validateForm = (email: string, password: string): boolean => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    return isEmailValid && isPasswordValid;
  };

  // LIMPIAR ERRORES
  const clearEmailError = () => setEmailError("");
  const clearPasswordError = () => setPasswordError("");
  const clearAllErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  return {
    // Errores
    emailError,
    passwordError,
    
    // Validaciones
    validateEmail,
    validatePassword,
    validateForm,
    
    // Limpiar errores
    clearEmailError,
    clearPasswordError,
    clearAllErrors,
  };
};