import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Map from '../components/Map'; // Assuming you have a Map component
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from '../components/SearchBar';
import CurrentSpeed from '../components/CurrentSpeed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  route: MainScreenRouteProp;
}

type MainScreenRouteProp = RouteProp<RootStackParamList, "MainScreen">;

type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainScreen"
>;


export default function MapScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={[styles.optionsButton, { top: insets.top + 10, left: 10 }]}>
            <FontAwesome name="cog" size={30} color="white" />
        </TouchableOpacity>
        <View style = {styles.map}>
            <Map/>
        </View>
        <View style={styles.speed}>
          <CurrentSpeed/>
        </View>
        <View style={styles.bottomBar}>
            <SearchBar/>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "red",
    borderWidth: 1,
  },
  map: {
    flex: 1,
    backgroundColor: '#A3D5FF',
    //...StyleSheet.absoluteFillObject, // This will make the map fill the entire screen
    zIndex: -1, // Ensure the map is behind other components
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  optionsButton: {
    width: 50, 
    height: 50, 
    backgroundColor: "purple", 
    position: "absolute", 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18, // Makes it circular
    zIndex: 1, // Ensures the button is above the map
    },
  bottomBar: {
    position: 'absolute',
    padding: 10,
    bottom: 0,
    width: "100%",
    height: 150,
    backgroundColor: "grey",
    borderColor: '#white',
    borderWidth: 1,
    zIndex: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  currentSpeedLimit: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
  },
  speed: {
    position: 'absolute',
    bottom: 300,
    left: -10,
  }
});