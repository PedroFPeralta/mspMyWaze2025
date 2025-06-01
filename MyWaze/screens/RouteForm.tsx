import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import { fetchUserHistory, saveUserTrip } from "../RecentHistoryService";
import { FIREBASE_AUTH } from "../firebase";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Route"
>;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicG10LWxvcGVzIiwiYSI6ImNtOXJsaTQzdjFzZ3MybHI3emd4bmsweWYifQ.z-0_UT1w3xkJuXu3LgFM7w"; // Replace with your Mapbox token

const RouteForm = () => {
  const [end, setEnd] = useState("");
  const [endSuggestions, setEndSuggestions] = useState<Array<any>>([]);
  const [endCoords, setEndCoords] = useState([]);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const auth = FIREBASE_AUTH;
  const user_id = auth.currentUser?.uid;

  //transport type
  const [selectedTransportMode, setSelectedTransportMode] = useState<'car' | 'public_transport' | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await fetchUserHistory(user_id);
      setRecentHistory(data ?? []);
      console.log("history fetch: " + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  };

  const saveTrip = async (location) => {
    try {
      const data = await saveUserTrip(user_id, location);
    } catch (error) {
      console.error("Error saving user history:", error);
    }
  };

  React.useEffect(() => {
    if (user_id) {
      fetchHistory();
    }
  }, [user_id]);

  // Function to search for Mapbox suggestions
  const fetchSuggestions = async (query: string, setSuggestions: Function) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            autocomplete: true,
            language: "pt",
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error("Error when looking for suggestions:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions(end, setEndSuggestions);
  }, [end]);

  const handleConfirmRoute = () => {
    if (!end) return alert("Fill destinaton field!");

    //save name long lat
    let location = {
      locationName: end,
      coords: {
        long: endCoords[0],
        lat: endCoords[1],
      },
    };

    saveTrip(location);

    //call service to save location in database;
    navigation.navigate("MainScreen", {
      destinationCoords: [endCoords[0], endCoords[1]],
    });
    Keyboard.dismiss();
  };

  const renderSuggestion = (
    item: any,
    setField: Function,
    clearSuggestions: Function,
    setCoords: Function
  ) => (
    <TouchableOpacity
      style={styles.suggestion}
      onPress={() => {
        setField(item.place_name);
        setCoords(item.geometry.coordinates);
        clearSuggestions([]);
        Keyboard.dismiss();
      }}
    >
      <Text>{item.place_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🏁 Destination</Text>
      <TextInput
        style={styles.input}
        value={end}
        onChangeText={setEnd}
        placeholder="Ex: Avenida da Liberdade"
      />
      {endSuggestions.length > 0 && (
        <FlatList
          data={endSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            renderSuggestion(item, setEnd, setEndSuggestions, setEndCoords)
          }
        />
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* transport type */}
      <View style={styles.transportModeContainer}>
      <TouchableOpacity style={[
          styles.transportButton,
          selectedTransportMode === 'car' && styles.selectedTransportButton,
        ]} onPress={() => setSelectedTransportMode('car')}>
        <Text style={[
          styles.transportButtonText,
          selectedTransportMode === 'car' && styles.selectedButtonText,
          ]}> My car </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[
        styles.transportButton,
        selectedTransportMode === 'public_transport' && styles.selectedTransportButton,
        ]} onPress={() => setSelectedTransportMode('public_transport')}>
        <Text style={[
          styles.transportButtonText,
          selectedTransportMode === 'public_transport' && styles.selectedButtonText,
          ]}> Public Transport </Text>
      </TouchableOpacity>
    </View>
    {/* ------------------------------------------------------------------------- */}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleConfirmRoute}>
          <Text style={{ color: "#fff" }}>📍 Confirm</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          marginVertical: 16,
        }}
      />

      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
        Recent history
      </Text>

      {recentHistory.map((location, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestion}
          onPress={() => {
            navigation.navigate("MainScreen", {
              destinationCoords: [location.coords.long, location.coords.lat],
            });
          }}
        >
          <Text>{location.locationName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RouteForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    marginTop: 40,
  },
  label: {
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  buttonAlt: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
  },
  //transport type
transportModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  transportButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedTransportButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  transportButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff',
  },
});
