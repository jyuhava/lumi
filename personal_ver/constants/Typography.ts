import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 56, // 3.5rem equivalent roughly
    letterSpacing: -2.24, // -0.04em
    lineHeight: 64,
  },
  displaySm: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 36,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  headlineMd: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 28, // 1.75rem equivalent roughly
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  titleLg: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 22,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelSm: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
};
