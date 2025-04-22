import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

import { RouteProp } from "@react-navigation/native";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicG10LWxvcGVzIiwiYSI6ImNtOXJsaTQzdjFzZ3MybHI3emd4bmsweWYifQ.z-0_UT1w3xkJuXu3LgFM7w";

// I'm repeating the types here
type Coords = {
  lng: number;
  lat: number;
};

type RootStackParamList = {
  RouteForm: undefined;
  MapScreen: { Origin: Coords; Destination: Coords };
};

type MapScreenRouteProp = RouteProp<RootStackParamList, "MapScreen">;

interface MapScreenProps {
  route: MapScreenRouteProp;
}

const MapScreen = ({ route }: MapScreenProps) => {
  const { Origin, Destination } = route.params;
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${Origin.lng},${Origin.lat};${Destination.lng},${Destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const res = await axios.get(url);
        const coords: [number, number][] =
          res.data.routes[0].geometry.coordinates;
        setRouteCoords(
          coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        );
      } catch (err) {
        console.error("Failed to fetch route", err);
      }
    };

    fetchRoute();
  }, []);

  if (routeCoords.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: Origin.lat,
        longitude: Origin.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{ latitude: Origin.lat, longitude: Origin.lng }}
        title="Start"
      />
      <Marker
        coordinate={{ latitude: Destination.lat, longitude: Destination.lng }}
        title="End"
      />
      <Polyline
        coordinates={routeCoords}
        strokeColor="#0000FF"
        strokeWidth={4}
      />
    </MapView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
