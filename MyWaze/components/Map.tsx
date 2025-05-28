import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../firebase";
import { fetchUserPreferences } from "../UserPreferencesService";

type Props = {
    destination?: { latitude: number; longitude: number };
    setSpeed: (speed: number | null) => void;
    setEta: (eta: number | null) => void;
};

export default function Map({ destination, setSpeed, setEta }: Props) {
    const [location, setLocation] = useState<any>(null);
    const [following, setFollowing] = useState(true);
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicG10LWxvcGVzIiwiYSI6ImNtOXJsaTQzdjFzZ3MybHI3emd4bmsweWYifQ.z-0_UT1w3xkJuXu3LgFM7w';
    const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
    
    const auth = FIREBASE_AUTH;
    const user_id = auth.currentUser?.uid;
    const [preferences, setPreferences] = useState<any>();

    // Hotel Laitau
    var coordinates = {
        latitude: 37.78825,
        longitude: -122.4324,
    };
    
    async function drivingRoute (origin, destination) {
        var url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

        preferences.avoid_tolls ? url += "&exclude=toll" : "";

        const response = await fetch(url);
        const data = await response.json();

        const coordinates = data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0],
        }));

        const eta = data.routes[0].duration;

        setRouteCoordinates(coordinates);
        setEta(eta);
    }    

    async function endTrip(){
        // logic for when the user reaches destination
        
    }


    // Fetch user preferences from Firestore
    const fetchPreferences = async () => {
      try {
        const fe = await fetchUserPreferences(user_id);
        setPreferences(fe); // Set to first element or undefined
        console.log("User Preferences:", fe);
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };
  

    useEffect(() => {
        if (user_id) {
            fetchPreferences();
            console.log("useEffect(): ", preferences)
        }

        if (destination) {
            if(destination.latitude == location.latitude && destination.longitude == location.longitude){
                endTrip();
            }else{
                drivingRoute({ latitude: location.latitude, longitude: location.longitude },destination);
            }
        }else{
            // Emptty so it doesn't show a route when no destination is set (aka during initial load or whenever not driving)
            setRouteCoordinates([]);
        }

    }, [destination, user_id, location]);

    async function getRouteDuration(origin, destination){
        try {
            var url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

            preferences.avoid_tolls ? url += "&exclude=toll" : "";

            const response = await fetch(url);
            const data = await response.json();

            const coordinates = data.routes[0].geometry.coordinates.map(coord => ({
                latitude: coord[1],
                longitude: coord[0],
            }));
                if (data.routes && data.routes.length > 0) {
                    return data.routes[0].duration; // in seconds
                }
        } catch (error) {
                console.error("Failed to fetch route:", error);
            }

        return 0;
    };

    // Fecth the user's current location when the component mounts
    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            /*
            drivingRoute(
                { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
                { latitude: 38.52917176800818, longitude: -8.898812088449557 } // Example destination
            );*/
        })();

        const locationSubscription = Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 1000,
                distanceInterval: 5,
            },
            async (newLocation) => {
                setLocation(newLocation.coords);
                setSpeed(newLocation.coords.speed || null); // Set speed to null if not available

                console.log(newLocation);
                /*if (following) {
                    drivingRoute(
                        { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
                        destination
                    );
                }*/
            }
        );
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {location && (
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    followsUserLocation={following}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                <Marker
                    coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    }}
                    title="You are here"
                />
                <Polyline
                    coordinates={routeCoordinates}
                    strokeWidth={4}
                    strokeColor="#1E90FF"
                    />
                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    marker: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'blue',
    },
});