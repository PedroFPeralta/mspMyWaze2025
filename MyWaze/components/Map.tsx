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
    setDistance: (distance: number | null) => void;
    setVia: (via: string) => void;
};

export default function Map({ destination, setSpeed, setEta, setDistance, setVia}: Props) {
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

    // --- Centralized Route Starter Function ---
    const startDrivingRoute = async (
        origin: { latitude: number; longitude: number },
        dest: { latitude: number; longitude: number }
    ) => {
        if (!origin || !dest || !preferences) return;

        try {
            let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;
            if (preferences.avoid_tolls) url += "&exclude=toll";

            const response = await fetch(url);
            const data = await response.json();

            if (data.routes?.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(([lon, lat]) => ({
                    latitude: lat,
                    longitude: lon,
                }));

                setRouteCoordinates(coordinates);
                setEta(route.duration);
                setDistance(route.distance);
                const legs = route.legs;
                var viaText = "";
                for (let i = 0; i < legs.length; i++) {
                    viaText += legs[i].summary + " ";
                }
                console.log("via be: ", viaText);
                setVia(viaText); // Assuming 'via' is an array of waypoints
                console.log("Route started:", route.summary);
            }
        } catch (error) {
            console.error("Error starting driving route:", error);
        }
    };

    // --- Centralized Route Starter Function with a Stop (hard coded) ---
    const startDrivingRouteWithStop = async (
        origin: { latitude: number; longitude: number },
        stop: { latitude: number; longitude: number },
        dest: { latitude: number; longitude: number }
    ) => {
        if (!origin || !dest || !stop || !preferences) return;

        try {
            let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${stop.longitude},${stop.latitude};${dest.longitude},${dest.latitude}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;
            if (preferences.avoid_tolls) url += "&exclude=toll";

            const response = await fetch(url);
            const data = await response.json();

            if (data.routes?.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(([lon, lat]) => ({
                    latitude: lat,
                    longitude: lon,
                }));

                setRouteCoordinates(coordinates);
                setEta(route.duration);
                setDistance(route.distance);
                const legs = route.legs;
                var viaText = "";
                for (let i = 0; i < legs.length; i++) {
                    viaText += legs[i].summary + " ";
                }
                console.log("via be: ", viaText);
                setVia(viaText); // Assuming 'via' is an array of waypoints
                console.log("Route started:", route.summary);
            }
        } catch (error) {
            console.error("Error starting driving route:", error);
        }
    };


    async function endTrip(){
        // logic for when the user reaches destination
        
    }


    // Fetch user preferences from Firestore
    const fetchPreferences = async () => {
      try {
        const fe = await fetchUserPreferences(user_id);
        setPreferences(fe); // Set to first element or undefined

      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };
  

    useEffect(() => {
        if (user_id) fetchPreferences();
    }, [user_id]);

    useEffect(() => {
        if (!location || !destination) {
            setRouteCoordinates([]);
            return;
        }

        const hasArrived =
            destination.latitude === location.latitude &&
            destination.longitude === location.longitude;

        if (hasArrived) {
            endTrip();
        } else {
            console.log("Starting route...");
            //startDrivingRoute(location, destination);
            startDrivingRouteWithStop( // Working with a stop
                location,
                { latitude: 38.53756861973558, longitude: -8.889270647631218 }, // Example stop
                destination
            );
        }
    }, [location, destination, preferences]);

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