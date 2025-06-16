// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform, Alert, Image, TouchableOpacity } from 'react-native'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import Button from '@/shared/components/ui/Button'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(state => state.auth)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    dispatch(loginStart())

    try {
      setTimeout(() => {
        const mockUser = {
          id: '1',
          email: email,
          name: 'Usuario Demo',
          isPro: false
        }
        
        dispatch(loginSuccess({
          token: 'mock-jwt-token',
          user: mockUser
        }))
      }, 1500)

    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Error de autenticación'))
    }
  }

  const handleGoogleLogin = async () => {
    dispatch(loginStart())

    try {
      // Mock Google login
      setTimeout(() => {
        const mockGoogleUser = {
          id: '2',
          email: 'usuario@gmail.com',
          name: 'Usuario Google',
          isPro: true // Mock user Pro para probar
        }
        
        dispatch(loginSuccess({
          token: 'mock-google-jwt-token',
          user: mockGoogleUser
        }))
      }, 2000)

    } catch (err: any) {
      dispatch(loginFailure('Error al iniciar sesión con Google'))
    }
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      style={{ backgroundColor: '#F5EED5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-4">
          <Image 
            source={require('../../../../assets/images/logo.png')}
            style={{ 
              width: 250, 
              height: 150, 
            }}
            resizeMode="contain"
          />
        </View>

        {/* Formulario */}
        <View className="w-full max-w-sm">
          {error && (
            <View className="bg-red-100 border border-red-300 p-3 rounded-lg mb-4">
              <Text className="text-red-600 text-center text-sm">{error}</Text>
            </View>
          )}

          {/* Campo Email */}
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Correo Electrónico
            </Text>
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-base"
                placeholder="Ingresa tu email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                spellCheck={false}
              />
              <View className="absolute left-3 top-3">
                <Text className="text-gray-400">👤</Text>
              </View>
            </View>
          </View>

          {/* Campo Contraseña */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm font-medium mb-2">
              Contraseña
            </Text>
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-10 py-3 text-base"
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
              />
              <View className="absolute left-3 top-3">
                <Text className="text-gray-400">🔒</Text>
              </View>
              <View className="absolute right-3 top-3">
                <Text className="text-gray-400">👁</Text>
              </View>
            </View>
          </View>

          {/* Botón Iniciar Sesión */}
          <Button
            title="INICIAR SESIÓN"
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            className="w-full mb-4"
          />

          {/* Botón Google */}
          <TouchableOpacity
            className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex-row items-center justify-center mb-6 shadow-sm"
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            {/* Logo SVG de Google */}
            <View style={{ width: 20, height: 20, marginRight: 12 }}>
              <Image
                source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-gray-700 font-medium text-base">
              {isLoading ? 'Conectando...' : 'Continuar con Google'}
            </Text>
          </TouchableOpacity>

          {/* Separador */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">o</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Texto de registro */}
          <Text className="text-center text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Text className="text-instascore-blue font-medium">
              Regístrate aquí
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}