import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteForm from "./src/screens/RouteForm";
import MapScreen from "./src/screens/MapScreen";
import RegisterScreen from "./screens/register";
import LoginScreen from "./screens/login";

// Stack Navigator Screens and their parameters
export type RootStackParamList = {
  Home: undefined;
  Map: {
    origin?: [number, number]; // [longitude, latitude]
    destination?: [number, number]; // [longitude, latitude]
  };
  Register: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Home"
          component={RouteForm}
          options={{ title: "Welcome" }}
        ></Stack.Screen>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Map" }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
