import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import RouteForm from "./src/screens/RouteForm";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./src/screens/MapScreen";

type Coords = {
  lng: number;
  lat: number;
};

type RootStackParamList = {
  RouteForm: undefined;
  MapScreen: { Origin: Coords; Destination: Coords };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RouteForm">
        <Stack.Screen name="RouteForm" component={RouteForm} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
