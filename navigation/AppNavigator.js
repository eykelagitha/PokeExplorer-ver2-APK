import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FF7A3C' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#FF7A3C',
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>🔍</Text> }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>★</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({
            title: route.params?.pokemon?.name ?? 'Detail',
            headerStyle: { backgroundColor: '#FF7A3C' },
            headerTintColor: '#fff',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
