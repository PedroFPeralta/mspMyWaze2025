import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FIREBASE_AUTH } from "../firebase";
import { getFavoriteLocations, saveFavoriteLocation } from "../SavedLocationsService";


const auth = FIREBASE_AUTH;

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "FavoriteLocationsList">;

type Location = {
  locationName: string;
  type: string;
  coordinates: { latitude: string; longitude: string; } | string;
};

export default function FavoriteLocationsScreen({ navigation }: RegisterScreenProps) {
  const [locationName, setLocationName] = useState("");
  const [type, setType] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: string; longitude: string }>({
    latitude: "",
    longitude: "",
  });

  const [locations, setLocations] = useState<Location[]>([
    // { locationName: "Nova FCT", type: "School", coordinates: { latitude: "15º", longitude: "10" } },
  ]);

  useEffect(() => {
    const loadUserLocations = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const saved = await getFavoriteLocations(userId);
        setLocations(saved);
      }
    };

    loadUserLocations();
  }, []);

  const [isRegisterModalVis, setRegisterModalVis] = useState(false);
  const [isEditModalVis, setEditModalVis] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);

  const addLocation = async () => {
    if (locationName && coordinates.latitude && coordinates.longitude && type) {
      const newLocation = { locationName, type, coordinates };

      try {
        await saveFavoriteLocation(auth.currentUser?.uid, newLocation);

        setLocations((prev) => [...prev, newLocation]);

        setLocationName("");
        setType("");
        setCoordinates({ latitude: "", longitude: "" });
        setRegisterModalVis(false);
      } catch (error) {
        console.error("Error saving Favorite Locations:", error);
      }
    }
  };

  const openEditModal = (index: number) => {
    const location = locations[index];
    setLocationName(location.locationName);
    setType(location.type);
    if (typeof location.coordinates === "string") {
      setCoordinates({ latitude: "", longitude: "" });
    } else {
      setCoordinates(location.coordinates);
    }
    setSelectedLocationIndex(index);
    setEditModalVis(true);
  };

  const openRegisterModal = () => {
    setLocationName("");
    setType("");
    setCoordinates({ latitude: "", longitude: "" });
    setSelectedLocationIndex(null);
    setRegisterModalVis(true);
  }

  const editLocation = () => {
    if (selectedLocationIndex !== null) {
      const updatedLocations = [...locations];
      updatedLocations[selectedLocationIndex] = { locationName, type, coordinates };
      setLocations(updatedLocations);
      setLocationName("");
      setType("");
      setCoordinates({ latitude: "", longitude: "" });
      setSelectedLocationIndex(null);
      setEditModalVis(false);
    }
  };

  // const getlocationItemName = (type: string) => {
  //   switch (type.toLowerCase()) {
  //     case "car":
  //       return "car";
  //     case "motorbike":
  //     case "bike":
  //       return "motorbike";
  //     case "truck":
  //       return "truck";
  //     default:
  //       return "car-off"; // fallback icon
  //   }
  // };

  const deleteCar = (plateToDelete: string) => {
    setLocations((prevLocations) => prevLocations.filter((location) => location.locationName !== locationName));
  };

  const renderItem = ({ item, index }: { item: Location; index: number }) => (
    <TouchableOpacity onPress={() => openEditModal(index)} style={styles.carItem}>
      <MaterialCommunityIcons name={"map-marker"} size={28} color="#333" style={styles.locationItem} />

      <View style={styles.carInfo}>
        <Text style={styles.carPlate}>{item.locationName}</Text>
        <Text>
          {typeof item.coordinates === "string"
            ? item.coordinates
            : `${item.coordinates.latitude} - ${item.coordinates.longitude}`}
        </Text>

      </View>

      <TouchableOpacity onPress={() => deleteCar(item.locationName)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => openRegisterModal()}>
        <Text style={styles.buttonText}>Save Location</Text>
      </TouchableOpacity>

      <FlatList data={locations} keyExtractor={(item) => item.locationName} renderItem={renderItem} style={styles.list} />

      <Modal visible={isRegisterModalVis} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save New Location</Text>

            <TextInput placeholder="Location" value={locationName} onChangeText={setLocationName} style={styles.input} />

            <TextInput
              placeholder="Type"
              value={type}
              onChangeText={setType}
              style={styles.input}
            />

            <TextInput
              placeholder="Latitude"
              value={coordinates.latitude}
              onChangeText={(text) => setCoordinates((prev) => ({ ...prev, latitude: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Longitude"
              value={coordinates.longitude}
              onChangeText={(text) => setCoordinates((prev) => ({ ...prev, longitude: text }))}
              style={styles.input}
            />


            <TouchableOpacity style={styles.button} onPress={addLocation}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#999" }]}
              onPress={() => setRegisterModalVis(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={isEditModalVis} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Location</Text>

            <TextInput
              placeholder="Location"
              value={locationName}
              onChangeText={setLocationName}
              editable={selectedLocationIndex === null} // Editable only for register modal
              style={[styles.input, selectedLocationIndex !== null && { backgroundColor: "#eee" }]}
            />
            <TextInput
              placeholder="Type"
              value={type}
              onChangeText={setType}
              style={styles.input}
            />
            <TextInput
              placeholder="Latitude"
              value={coordinates.latitude}
              onChangeText={(text) => setCoordinates((prev) => ({ ...prev, latitude: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Longitude"
              value={coordinates.longitude}
              onChangeText={(text) => setCoordinates((prev) => ({ ...prev, longitude: text }))}
              style={styles.input}
            />


            <TouchableOpacity style={styles.button} onPress={editLocation}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#999" }]}
              onPress={() => setEditModalVis(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "whitesmoke",
  },
  locationItem: {
    marginRight: 10,
  },
  carItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
  carInfo: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  carPlate: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    width: "100%",
  },
  list: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
