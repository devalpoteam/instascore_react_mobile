// TestKeyboard.tsx - COMPONENTE COMPLETAMENTE AISLADO
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Keyboard } from 'react-native';

export default function TestKeyboard() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      console.log('🔴 TECLADO OCULTO EN TEST AISLADO');
    });

    return () => keyboardDidHideListener.remove();
  }, []);

  return (
    <View style={{ flex: 1, padding: 50, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20, textAlign: 'center' }}>
        TEST AISLADO - SIN NAVEGACIÓN
      </Text>
      
      <TextInput
        placeholder="Test 1"
        value={text1}
        onChangeText={(text) => {
          console.log('🟡 Test1 changed:', text.length);
          setText1(text);
        }}
        style={{
          borderWidth: 2,
          borderColor: '#000',
          padding: 20,
          marginBottom: 20,
          fontSize: 18,
          backgroundColor: 'white'
        }}
        blurOnSubmit={false}
      />

      <TextInput
        placeholder="Test 2"
        value={text2}
        onChangeText={(text) => {
          console.log('🟡 Test2 changed:', text.length);
          setText2(text);
        }}
        style={{
          borderWidth: 2,
          borderColor: '#000',
          padding: 20,
          fontSize: 18,
          backgroundColor: 'white'
        }}
        blurOnSubmit={false}
      />
    </View>
  );
}