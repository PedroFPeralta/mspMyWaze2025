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

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Route"
>;

// Context for destination setting
type DestinationCoords = [number, number] | undefined;

interface DestinationContextType {
  destinationCoords: DestinationCoords;
  setDestinationCoords: (value: DestinationCoords) => void;
}

const DestinationContext = createContext<DestinationContextType | undefined>(
  undefined
);

export const DestinationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [destinationCoords, setDestinationCoords] =
    useState<DestinationCoords>(undefined);

  return (
    <DestinationContext.Provider
      value={{ destinationCoords, setDestinationCoords }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinationCoords = (): DestinationContextType => {
  const context = useContext(DestinationContext);
  if (!context)
    throw new Error("useDestination must be used within a DestinationProvider");
  return context;
};

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicG10LWxvcGVzIiwiYSI6ImNtOXJsaTQzdjFzZ3MybHI3emd4bmsweWYifQ.z-0_UT1w3xkJuXu3LgFM7w"; // Replace with your Mapbox token

const RouteForm = () => {
  const [end, setEnd] = useState("");
  const [endSuggestions, setEndSuggestions] = useState<Array<any>>([]);
  const [endCoords, setEndCoords] = useState([]);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { destinationCoords, setDestinationCoords } = useDestinationCoords();

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
    console.log("Destination:", end);

    setDestinationCoords([endCoords[0], endCoords[1]]);
    //call service to save location in database;
    navigation.navigate("MainScreen");
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
});
