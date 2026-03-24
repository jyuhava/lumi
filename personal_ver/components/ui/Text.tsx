import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle, StyleSheet } from 'react-native';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';

interface TextProps extends RNTextProps {
  variant?: keyof typeof Typography;
  color?: string;
  style?: StyleProp<TextStyle>;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function Text({ 
  style, 
  variant = 'bodyLg', 
  color = Colors.light.onSurface, 
  align = 'auto',
  ...rest 
}: TextProps) {
  const typographyStyle = Typography[variant];
  
  return (
    <RNText
      style={[
        { color },
        { textAlign: align },
        typographyStyle,
        style,
      ]}
      {...rest}
    />
  );
}
