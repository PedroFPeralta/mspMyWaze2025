import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Map from '../components/Map'; // Assuming you have a Map component
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from '../components/SearchBar';
import CurrentSpeed from '../components/CurrentSpeed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { FIREBASE_AUTH } from '../firebase';
import {fetchUserSavedLocations } from '../SavedLocationsService';

type MainScreenProps = NativeStackScreenProps<RootStackParamList, "MainScreen">;

export default function MapScreen({ navigation }: MainScreenProps) {
  // Insets for the safe area handling of elements with absolute positioning
  const insets = useSafeAreaInsets();
  // Firebase Authentication
  const auth = FIREBASE_AUTH;
  
  async function handleSavedLocations() {
      var v = await fetchUserSavedLocations(auth.currentUser?.uid);
      console.log("Got the following locations:");
      console.log(v);
  }

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={[styles.optionsButton, { top: insets.top + 10, left: 10 }]} onPress={() => navigation.navigate("Settings")}>
            <FontAwesome name="bars" size={30} color="white" />
        </TouchableOpacity>
        <Map/>
        <View style={styles.speed}>
          <CurrentSpeed/>
        </View>
        <View style={styles.bottomBar}>
            <SearchBar/>
            <ScrollView horizontal={true} style= {styles.savedLocations}>
              <TouchableOpacity>
                <View style = {styles.savedLocation}>
                  <FontAwesome style={styles.savedLocationIcon} name="home" size={24} color="black" />
                  <Text style={styles.savedLocationText}>Home</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View style = {styles.savedLocation}>
                  <FontAwesome style={styles.savedLocationIcon} name="briefcase" size={24} color="black" />
                  <Text style={styles.savedLocationText}>Work</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
              <View style = {styles.savedLocation}>
                  <FontAwesome style={styles.savedLocationIcon} name="save" size={24} color="black" />
                  <Text style={styles.savedLocationText}>NOVA FCT</Text>
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress = {() => handleSavedLocations()}>
              <View style = {styles.savedLocation}>
                  <FontAwesome style={styles.savedLocationIcon} name="bookmark-o" size={24} color="black" />
                  <Text style={styles.savedLocationText}>More</Text>
              </View>
              </TouchableOpacity>

            </ScrollView>
        </View>
    </SafeAreaView>
  );
}

async function requestLocationPermission() {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
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
  },
  savedLocations: {
    width: '100%',
    height: 100,
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 10,
  },
  savedLocation: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  savedLocationIcon: {
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
  },
  savedLocationText: {
    fontSize: 16,
    borderColor: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    color: 'black',
  }
});