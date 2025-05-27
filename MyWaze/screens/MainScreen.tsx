import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Map from '../components/Map'; // Assuming you have a Map component
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  route: MainScreenRouteProp;
}

type MainScreenRouteProp = RouteProp<RootStackParamList, "MainScreen">;

type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainScreen"
>;


export default function MapScreen() {
  return (
    <View style={styles.container}>
        <TouchableOpacity style= {styles.optionsButton} >
            <FontAwesome name="cog" size={30} color="white" />
        </TouchableOpacity>
        <View style = {styles.map}>
            <Map/>
        </View>
        <View style={styles.bottomBar}>
            <View style = {styles.currentSpeedLimit}>
                
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    backgroundColor: '#A3D5FF',
    ...StyleSheet.absoluteFillObject, // This will make the map fill the entire screen
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
    top: 15, 
    left: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18, // Makes it circular
    zIndex: 1, // Ensures the button is above the map
    },
  bottomBar: {

  }
});