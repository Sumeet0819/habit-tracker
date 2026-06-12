import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from './src/screens/DashboardScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { WellnessScreen } from './src/screens/WellnessScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ScheduleEditorScreen } from './src/screens/ScheduleEditorScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { initDb } from './src/data/database';
import { CustomTabBar } from './src/components/CustomTabBar';
import { useThemeColors } from './src/theme/colors';
import { useThemeStore } from './src/store/useThemeStore';

// Initialize DB synchronously at module level — before any screen renders.
// This ensures the table exists the moment any component queries it.
initDb();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.Background },
        animation: 'shift',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Wellness" component={WellnessScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = useThemeColors();

  const navigationTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: colors.Background,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={customTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.Background } }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen 
            name="ScheduleEditor" 
            component={ScheduleEditorScreen} 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="EditProfile" 
            component={EditProfileScreen} 
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

