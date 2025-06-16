// src/shared/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'px-5 py-3 rounded-lg items-center my-2';
  
  const variantClasses = {
    primary: disabled ? 'bg-gray-300' : 'bg-instascore-blue',
    secondary: disabled 
      ? 'bg-gray-100 border border-gray-300' 
      : 'bg-gray-100 border border-instascore-blue',
  };
  
  const textClasses = {
    primary: disabled ? 'text-gray-500 font-semibold text-base' : 'text-white font-semibold text-base',
    secondary: disabled ? 'text-gray-400 font-semibold text-base' : 'text-instascore-blue font-semibold text-base',
  };

  return (
    <TouchableOpacity 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={disabled || loading ? 1 : 0.8}
    >
      <Text className={textClasses[variant]}>
        {loading ? 'Cargando...' : title}
      </Text>
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : '#1105ad'} 
          style={{ position: 'absolute', right: 16 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;