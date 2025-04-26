import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RouteForm from "./src/screens/RouteForm";
import MapScreen from "./src/screens/MapScreen";

export type RootStackParamList = {
  Home: undefined;
  Map: {
    origin: [number, number]; // [longitude, latitude]
    destination: [number, number]; // [longitude, latitude]
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={RouteForm}
          options={{ title: "Welcome" }}
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
