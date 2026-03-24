import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Theme colors based on the reference design
  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#042f2e' : '#ffffff';
  const activeColor = isDark ? '#5eead4' : '#14b8a6';
  const inactiveColor = isDark ? '#115e59' : '#94a3b8';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={26} name={focused ? 'restaurant' : 'restaurant-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={26} name={focused ? 'star' : 'star-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeHomeWrapper : null}>
              <Ionicons size={28} name={focused ? 'home' : 'home-outline'} color={focused ? (isDark ? '#042f2e' : '#fff') : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={26} name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeHomeWrapper: {
    backgroundColor: '#14b8a6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10, // Elevates the active home icon slightly
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  }
});
