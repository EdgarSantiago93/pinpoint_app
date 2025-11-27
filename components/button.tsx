import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export type ButtonVariant = 'filled' | 'outline' | 'light' | 'text';

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export type ButtonProps = TouchableOpacityProps & {
  variant?: ButtonVariant;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  /**
   * Icon component to display before the title text
   */
  icon?: ReactNode;
};

export function Button({
  variant = 'filled',
  title,
  loading = false,
  disabled = false,
  icon,
  style,
  ...props
}: ButtonProps) {
  const colors = Colors['light'];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: colors.tint,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.tint,
        };
      case 'light':
        return {
          ...baseStyle,
          backgroundColor: hexToRgba(colors.tint, 0.2), // 20% opacity
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingVertical: 8,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: '600',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          color: 'white', // Dark text on light tint background
        };
      case 'outline':
        return {
          ...baseStyle,
          color: colors.tint,
        };
      case 'light':
        return {
          ...baseStyle,
          color: colors.tint,
        };
      case 'text':
        return {
          ...baseStyle,
          color: colors.tint,
        };
      default:
        return baseStyle;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), isDisabled && styles.disabled, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <View style={{ paddingVertical: 2 }}>
          <ActivityIndicator
            size="small"
            color={variant === 'filled' ? 'white' : colors.tint}
          />
        </View>
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <ThemedText style={getTextStyle()}>{title}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});
