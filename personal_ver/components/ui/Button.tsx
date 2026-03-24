import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export function Button({ label, variant = 'primary', style, ...rest }: ButtonProps) {
  if (variant === 'tertiary') {
    return (
      <TouchableOpacity activeOpacity={0.7} style={[styles.tertiaryButton, style]} {...rest}>
        <Text variant="labelMd" color={Colors.light.primary}>{label}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity activeOpacity={0.8} style={[styles.secondaryButton, style]} {...rest}>
        <Text variant="labelMd" color={Colors.light.primary}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.primaryButton, style]} {...rest}>
      {/* Inner Glow simulation */}
      <View style={styles.innerGlow} />
      <Text variant="labelMd" color={Colors.light.onPrimary}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 9999,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: Colors.light.surfaceLowest,
    borderWidth: 1,
    borderColor: Colors.light.primaryContainer,
    borderRadius: 9999,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 9999,
  },
  tertiaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
