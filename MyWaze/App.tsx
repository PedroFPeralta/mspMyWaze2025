import React from "react";
import { SafeAreaView, Settings, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteForm from "./screens/RouteForm";
import MapScreen from "./screens/MapScreen";
import RegisterScreen from "./screens/Register";
import LoginScreen from "./screens/Login";
import SettingsScreen from "./screens/Settings";
import CarListScreen from "./screens/CarListScreen";

// Stack Navigator Screens and their parameters
export type RootStackParamList = {
  Home: undefined;
  Map: {
    origin?: [number, number]; // [longitude, latitude]
    destination?: [number, number]; // [longitude, latitude]
  };
  Register: undefined;
  Login: undefined;
  Settings: undefined;
  CarList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Home" component={RouteForm} options={{ title: "Welcome" }}></Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Map" component={MapScreen} options={{ title: "Map" }}></Stack.Screen>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }}></Stack.Screen>
        <Stack.Screen name="CarList" component={CarListScreen} options={{ title: "CarList" }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
