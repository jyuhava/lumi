import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom || 16 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';
        let tabLabel = label.toString().toUpperCase();

        if (route.name === 'index') iconName = isFocused ? 'grid' : 'grid-outline';
        else if (route.name === 'weight') iconName = isFocused ? 'scale' : 'scale-outline';
        else if (route.name === 'activity') iconName = isFocused ? 'barbell' : 'barbell-outline';
        else if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

        if (route.name === 'index') tabLabel = 'HOME';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabItemWrapper}
          >
            {isFocused ? (
              <View style={styles.activePill}>
                <Ionicons name={iconName} size={22} color={Colors.light.surfaceLowest} style={styles.iconMargin} />
                <Text variant="labelSm" color={Colors.light.surfaceLowest}>{tabLabel}</Text>
              </View>
            ) : (
              <View style={styles.inactiveItem}>
                <Ionicons name={iconName} size={24} color={Colors.light.secondary} style={styles.iconMargin} />
                <Text variant="labelSm" color={Colors.light.secondary}>{tabLabel}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="weight" options={{ title: 'Weight' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surfaceLowest,
    position: 'absolute',
    bottom: 0,
    width: width,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    backgroundColor: Colors.light.primary, // Dark Teal primary color
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999, // Perfect pill
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  inactiveItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  iconMargin: {
    marginBottom: 4,
  }
});
