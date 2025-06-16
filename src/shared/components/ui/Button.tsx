// src/shared/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'px-5 py-3 rounded-lg items-center my-2';
  
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-gray-100 border border-primary',
  };
  
  const textClasses = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-primary font-semibold text-base',
  };

  return (
    <TouchableOpacity 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onPress={onPress}
    >
      <Text className={textClasses[variant]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;