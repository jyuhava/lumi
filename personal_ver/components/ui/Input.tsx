import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, iconName, error, style, containerStyle, ...rest }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = React.useRef<TextInput>(null);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error
        ]}
      >
        {iconName && (
          <Ionicons 
            name={iconName} 
            size={20} 
            color={isFocused ? Colors.light.primary : Colors.light.secondary} 
            style={styles.icon} 
          />
        )}
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholderTextColor={Colors.light.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </TouchableOpacity>
      {error && <Text variant="labelSm" color="#ff4d4d" style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceLowest,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  focused: {
    // 2px glow of primary_container
    shadowColor: Colors.light.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1, // Fallback for pure glow
    borderColor: Colors.light.primaryContainer,
  },
  error: {
    borderColor: '#ff4d4d',
    borderWidth: 1,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.light.onSurface,
  },
  errorText: {
    marginTop: 4,
  },
});
