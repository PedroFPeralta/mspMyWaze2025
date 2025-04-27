<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/login';
import RegisterScreen from './screens/register';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User state changed:', user);
      setUser(user);
    });  
  }, []);

  return (
    <View style={styles.container}>
      <RegisterScreen />
    </View>
  );
=======
import React from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import RouteForm from "./src/screens/RouteForm";
import MapScreen from "./src/screens/MapScreen";
import RegisterScreen from "./screens/register";
import LoginScreen from "./screens/login";
import CarListScreen from "./src/screens/CarListScreen";
import {SettingsProvider} from "./src/storage/settingsProvider";

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
        <SettingsProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{title: "Register"}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="Home"
                        component={RouteForm}
                        options={{title: "Welcome"}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{title: "Login"}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="Map"
                        component={MapScreen}
                        options={{title: "Map"}}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="CarList"
                        component={CarListScreen}
                        options={{title: "CarList"}}
                    ></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </SettingsProvider>
    );
>>>>>>> Stashed changes
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
