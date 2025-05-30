import React from "react";
import { SafeAreaView, Settings, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteForm from "./screens/RouteForm";
import MapScreen from "./screens/MapScreen";
import RegisterScreen from "./screens/Register";
import LoginScreen from "./screens/Login";
import SettingsScreen from "./screens/Settings";
import NavigationPreferencesScreen from "./screens/NavigationPreferences";
import MainScreen from "./screens/MainScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DestinationProvider } from "./screens/RouteForm";
import CarListScreen from "./screens/CarListScreen";

// Stack Navigator Screens and their parameters
export type RootStackParamList = {
  Route: undefined;
  Map: {
    origin?: [number, number]; // [longitude, latitude]
    destination?: [number, number]; // [longitude, latitude]
  };
  Register: undefined;
  Login: undefined;
  Settings: undefined;
  NavigationPreferences: undefined;
  MainScreen: undefined;
  CarList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <DestinationProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Route"
              component={RouteForm}
              options={{ title: "Destination" }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: "Settings", animation: "slide_from_left" }}
            />
            <Stack.Screen
              name="NavigationPreferences"
              component={NavigationPreferencesScreen}
              options={{ title: "Navigation Preferences" }}
            />
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CarList"
              component={CarListScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DestinationProvider>
    </SafeAreaProvider>
  );
}
