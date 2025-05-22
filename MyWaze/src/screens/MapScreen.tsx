import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

interface Props {
  route: MapScreenRouteProp;
}

type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;

type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Map"
>;

const MapScreen = ({ route }: Props) => {
  const { origin, destination } = route.params || {};

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<MapView | null>(null);

  const navigation = useNavigation<MapScreenNavigationProp>();

  useEffect(() => {
    if (!origin || !destination) {
      setLoading(false);
      return;
    }
    const fetchRoute = async () => {
      try {
        const accessToken = "pk.eyJ1IjoicG10LWxvcGVzIiwiYSI6ImNtOXJsaTQzdjFzZ3MybHI3emd4bmsweWYifQ.z-0_UT1w3xkJuXu3LgFM7w";
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=polyline&access_token=${accessToken}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const points = polyline.decode(data.routes[0].geometry);
          const coordinates = points.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));

          setRouteCoordinates(coordinates);
        } else {
          console.error("No routes found in API response", data);
        }
      } catch (error) {
        console.error("Error fetching route: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination]);

  const handleMapReady = () => {
    if (!origin || !destination) return;
    if (mapRef.current && routeCoordinates.length > 0) {
      // Fit the map to the coordinates (origin + destination + route)
      mapRef.current.fitToCoordinates(
        [
          { latitude: origin[1], longitude: origin[0] },
          { latitude: destination[1], longitude: destination[0] },
          ...routeCoordinates,
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Optional padding
          animated: true, // Smooth animation
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <MapView
          style={styles.map}
          ref={mapRef}
          onMapReady={handleMapReady}
          initialRegion={{
            latitude: 38.659969, // FCT coordinates
            longitude: -9.202948,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {origin && destination && (
            <>
              <Marker
                coordinate={{ latitude: origin[1], longitude: origin[0] }}
                title="Origin"
              />
              <Marker
                coordinate={{
                  latitude: destination[1],
                  longitude: destination[0],
                }}
                title="Destination"
              />
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={4}
                  strokeColor="blue"
                />
              )}
            </>
          )}
        </MapView>
      )}
      {!origin && !destination && (
        <View style={styles.buttonContainer}>
          <Button
            title="Plan Route"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
});
