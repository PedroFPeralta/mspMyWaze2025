import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import Map from "../components/Map"; // Assuming you have a Map component
import { RootStackParamList } from "../App";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import CurrentSpeed from "../components/CurrentSpeed";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { PermissionsAndroid, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FIREBASE_AUTH } from "../firebase";
import { fetchUserSavedLocations } from "../SavedLocationsService";
import { fetchUserPreferences } from "../UserPreferencesService";
import NavigateToDestination from "../components/NavigateToDestination";

type MainScreenProps = NativeStackScreenProps<RootStackParamList, "MainScreen">;

export default function MapScreen({ navigation, route }: MainScreenProps) {
  // Insets for the safe area handling of elements with absolute positioning
  const insets = useSafeAreaInsets();
  // Firebase Authentication
  const auth = FIREBASE_AUTH;
  const user_id = auth.currentUser?.uid;
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  }>(); // State to hold the destination coordinates
  const [
    navigateToDestinationModalVisibility,
    setNavigateToDestinationModalVisibility,
  ] = useState<boolean>(false);
  const [destinationText, setDestinationText] = useState<string>("NOVA FCT1"); // Example destination text
  const { destinationCoords } = route.params ?? {};

  console.log("Prop Coords: " + destinationCoords);

  // This function is here to handle the fetching of saved locations when the "More" button is pressed
  // When the user presses the "More" button, it will fetch the saved locations from the Firebase database and should navigate to a new screen or display them in some way.
  // Make the new screen accept a list of saved locations as a prop and display them in a list.
  async function handleSavedLocations() {
    var v = await fetchUserSavedLocations(auth.currentUser?.uid);
    console.log("Got the following locations:");
    console.log(v);
  }

  function driveToLocation(
    drivingPreferences?: any,
    ddestination?: { latitude: number; longitude: number }
  ) {
    // Example coordinates for Hotel Laitau
    const NOVAFCT = {
      latitude: 38.6613200247002,
      longitude: -9.205461561463805,
    };

    setDestination(NOVAFCT);
  }

  function etaFormat(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
  const [speedLimit, setSpeedLimit] = useState<string>("50"); // Example speed limit
  const [speedLimitExceeded, setSpeedLimitExceeded] = useState<boolean>(false); // Example speed limit exceeded status
  const [eta, setEta] = useState<number>();
  const [etaText, setEtaText] = useState<string>("00:00");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [via, setVia] = useState<string>("");

  function handleDriveToLocation() {
    setNavigateToDestinationModalVisibility(true); // Close the modal
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.optionsButton, { top: insets.top + 10, left: 10 }]}
        onPress={() => navigation.navigate("Settings")}
      >
        <FontAwesome name="bars" size={30} color="white" />
      </TouchableOpacity>
      <Map
        destination={destination} 
        setSpeed={(speed: number | null) => {
          setCurrentSpeed(speed);
          console.log("Current Speed:", speed);
        }}
        setEta={(eta: number | null) => {
          console.log("eta is : ", eta);
          if (eta !== null) {
            console.log("inside");
            setEta(eta);
            setEtaText(etaFormat(eta));
          }
        }}
        setDistance={(distance: number | null) => {
          console.log("Distance is: ", distance);
          if (distance !== null) {
            setDistanceKm(distance / 1000); // Convert to kilometers
          }
        }}
        setVia={(via: string) => {
          console.log("Via is: ", via);
          setVia(via);
        }}
      />
      <View style={styles.speed}>
        <CurrentSpeed
          speed={currentSpeed}
          speedLimit={speedLimit} 
          speedLimitExceeded={speedLimitExceeded} 
        />
      </View>
      <View style={[styles.eta, { top: insets.top + 10 }]}>
        <Text style={[styles.etaText, { fontSize: 14 }]}>ETA</Text>
        <Text style={styles.etaText}>{etaText}</Text>
      </View>
      <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("Route")}
        activeOpacity={0.8}
      >
        <Text style={styles.searchText}>Search Destination</Text>
      </TouchableOpacity>
        <ScrollView horizontal={true}   contentContainerStyle={{justifyContent: 'center',alignItems: 'center',flexGrow: 1}} style={styles.savedLocations}>
          <TouchableOpacity onPress={() => handleDriveToLocation()}>
            <View style={[styles.savedLocation, {marginLeft: 10}]}>
              <FontAwesome
                style={styles.savedLocationIcon}
                name="home"
                size={26}
                color="black"
              />
              <Text style={styles.savedLocationText}>Home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.savedLocation}>
              <FontAwesome
                style={styles.savedLocationIcon}
                name="briefcase"
                size={26}
                color="black"
              />
              <Text style={styles.savedLocationText}>Work</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setNavigateToDestinationModalVisibility(true);
            }}
          >
            <View style={styles.savedLocation}>
              <FontAwesome
                style={styles.savedLocationIcon}
                name="save"
                size={26}
                color="black"
              />
              <Text style={styles.savedLocationText}>NOVA FCT</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("FavoriteLocationsList")}>
            <View style={styles.savedLocation}>
              <FontAwesome
                style={styles.savedLocationIcon}
                name="bookmark-o"
                size={26}
                color="black"
              />
              <Text style={styles.savedLocationText}>More</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <NavigateToDestination
        destination={destinationText}
        distance={distanceKm ? distanceKm : 0}
        duration={etaText}
        visibility={navigateToDestinationModalVisibility} // Control the visibility of the modal
        onCancel={() => setNavigateToDestinationModalVisibility(false)} // Function to call when the user cancels the navigation
        onConfirm={() => {
          driveToLocation();
          setNavigateToDestinationModalVisibility(false);
        }} // Function to call when the user confirms the navigation
        via={via}
        //onConfirm={() => driveToLocation()} // Function to call when the user confirms the navigation
      />
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
  },
  map: {
    flex: 1,
    backgroundColor: "#A3D5FF",
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
    backgroundColor: "#A3D5FF",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18, // Makes it circular
    zIndex: 1, // Ensures the button is above the map
    borderColor: "black",
    borderWidth: 2
  },
  bottomBar: {
    position: "absolute",
    paddingTop: 10,
    paddingBottom: 10,
    bottom: 0,
    width: "100%",
    height: 160,
    backgroundColor: "#A3D5FF",
    borderTopWidth: 2,
    borderTopColor: "black",
    zIndex: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  searchBar: {
    alignSelf: 'center',
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  searchText: {
    color: '#555',
    fontSize: 16,
  },
  currentSpeedLimit: {
    width: 10,
    height: 10,
    backgroundColor: "red",
  },
  speed: {
    position: "absolute",
    bottom: 310,
    left: -10,
  },
  eta: {
    position: "absolute",
    alignSelf: "center",
    width: 70,
    height: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A3D5FF",
    borderRadius: 18,
    zIndex: 1,
    borderWidth: 2,
    borderColor: "black"
  },
  etaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  savedLocations: {
    width: "100%",
    height: 100,
    marginTop: 10,
    display: "flex",
    alignContent: "center",
  },
  savedLocation: {
    height: "75%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  savedLocationIcon: {
    marginRight: 10,
  },
  savedLocationText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  navigateToDestinationModal: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
