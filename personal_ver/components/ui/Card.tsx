import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors } from '../../constants/Colors';

interface CardProps extends ViewProps {
  level?: 'lowest' | 'low' | 'mid' | 'highest';
  asymmetric?: boolean;
}

export function Card({ style, level = 'lowest', asymmetric = true, children, ...rest }: CardProps) {
  const getBackgroundColor = () => {
    switch (level) {
      case 'lowest': return Colors.light.surfaceLowest;
      case 'low': return Colors.light.surfaceContainerLow;
      case 'mid': return Colors.light.surfaceContainerMid;
      case 'highest': return Colors.light.surfaceContainerHighest;
      default: return Colors.light.surfaceLowest;
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: getBackgroundColor() },
        asymmetric ? styles.asymmetric : styles.symmetric,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    // "Ambient Shadows" approach instead of heavy drop shadow.
    // However, specs say "A surface-container-lowest card placed on a surface-container-low background provides all the lift required."
    // So shadows might not be needed for cards, only floating elements.
  },
  asymmetric: {
    borderTopLeftRadius: 32,    // xl
    borderTopRightRadius: 16,   // md
    borderBottomRightRadius: 32, // xl
    borderBottomLeftRadius: 16,  // md
  },
  symmetric: {
    borderRadius: 24,
  },
});
