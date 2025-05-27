import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";

export default function Map() {
    const [location, setLocation] = useState<any>(null);
    const [following, setFollowing] = useState(true);

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* You can add your map component here */}
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