// src/shared/components/layout/BaseLayout.tsx
import React from 'react';
import { View, StatusBar } from 'react-native';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import BottomNavigation from './BottomNavigation';

interface BaseLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
}

export default function BaseLayout({ 
  children, 
  showBottomNav = true,
  backgroundColor = getColor.background.lighter,
  statusBarStyle = 'dark-content'
}: BaseLayoutProps) {
  const responsive = useResponsive();

  return (
    <>
      <StatusBar 
        barStyle={statusBarStyle}
        backgroundColor={getColor.background.primary} 
        translucent={false} 
      />
      
      <View style={{ 
        flex: 1, 
        backgroundColor: backgroundColor 
      }}>
        {/* Contenido principal con padding bottom cuando hay bottom nav */}
        <View style={{ 
          flex: 1,
          paddingBottom: showBottomNav ? 0 : 0, // El BottomNavigation maneja su propio espaciado
        }}>
          {children}
        </View>
        
        {/* Bottom Navigation */}
        {showBottomNav && <BottomNavigation />}
      </View>
    </>
  );
}