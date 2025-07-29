// src/features/profile/components/ProfileHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '@/design/colorHelper';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { ProfileHeaderProps } from '../types/profile.types';
import { getGenderDisplayName } from '../data/mockProfileData';

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const responsive = useResponsive();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <View style={{
      backgroundColor: getColor.background.primary,
      paddingHorizontal: responsive.spacing.lg,
      paddingVertical: responsive.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: getColor.gray[200],
      alignItems: 'center',
    }}>
      {/* Avatar */}
      <View style={{
        width: responsive.isTablet ? 100 : 80,
        height: responsive.isTablet ? 100 : 80,
        borderRadius: responsive.isTablet ? 50 : 40,
        backgroundColor: user.isPro ? getColor.primary[500] : getColor.gray[400],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsive.spacing.lg,
        borderWidth: 4,
        borderColor: getColor.background.primary,
        shadowColor: user.isPro ? getColor.primary[500] : getColor.gray[400],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      }}>
        <Text style={{
          fontSize: responsive.fontSize['3xl'],
          fontWeight: '700',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
        }}>
          {getInitials(user.name)}
        </Text>
      </View>

      {/* Nombre */}
      <Text style={{
        fontSize: responsive.fontSize['2xl'],
        fontWeight: '700',
        color: getColor.gray[800],
        fontFamily: 'Nunito',
        textAlign: 'center',
        marginBottom: responsive.spacing.sm,
      }}>
        {user.name}
      </Text>

      {/* Badge Pro/Básico */}
      <View style={{
        backgroundColor: user.isPro ? getColor.secondary[500] : getColor.gray[400],
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.xs,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.spacing.lg,
      }}>
        <Ionicons 
          name={user.isPro ? "star" : "person"} 
          size={14} 
          color={getColor.background.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={{
          fontSize: responsive.fontSize.sm,
          fontWeight: '600',
          color: getColor.background.primary,
          fontFamily: 'Nunito',
        }}>
          {user.isPro ? 'USUARIO PRO' : 'USUARIO BÁSICO'}
        </Text>
      </View>

      {/* Información personal */}
      <View style={{
        width: '100%',
        backgroundColor: getColor.gray[50],
        borderRadius: 16,
        padding: responsive.spacing.lg,
      }}>
        {/* Email */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: responsive.spacing.md,
        }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: getColor.primary[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsive.spacing.md,
          }}>
            <Ionicons 
              name="mail" 
              size={18} 
              color={getColor.primary[600]} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: responsive.fontSize.xs,
              color: getColor.gray[500],
              fontFamily: 'Nunito',
              marginBottom: 2,
            }}>
              Correo electrónico
            </Text>
            <Text style={{
              fontSize: responsive.fontSize.sm,
              fontWeight: '500',
              color: getColor.gray[800],
              fontFamily: 'Nunito',
            }}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Edad */}
        {user.age && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsive.spacing.md,
          }}>
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: getColor.secondary[100],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: responsive.spacing.md,
            }}>
              <Ionicons 
                name="calendar" 
                size={18} 
                color={getColor.secondary[600]} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[500],
                fontFamily: 'Nunito',
                marginBottom: 2,
              }}>
                Edad
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '500',
                color: getColor.gray[800],
                fontFamily: 'Nunito',
              }}>
                {user.age} años
              </Text>
            </View>
          </View>
        )}

        {/* Género */}
        {user.gender && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: getColor.success[100],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: responsive.spacing.md,
            }}>
              <Ionicons 
                name="person" 
                size={18} 
                color={getColor.success[600]} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: responsive.fontSize.xs,
                color: getColor.gray[500],
                fontFamily: 'Nunito',
                marginBottom: 2,
              }}>
                Género
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: '500',
                color: getColor.gray[800],
                fontFamily: 'Nunito',
              }}>
                {getGenderDisplayName(user.gender)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}