import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getAuth } from "firebase/auth";
import { createVehicle, fetchVehicles, deleteVehicle } from "../VehicleService"; // Adjust path if needed

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "CarList">;

type Car = {
  plate: string;
  type: string;
  fuel: string;
};

export default function CarListScreen({ navigation }: RegisterScreenProps) {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [cars, setCars] = useState<Car[]>([]);
  const [plate, setPlate] = useState("");
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");

  const [isRegisterModalVis, setRegisterModalVis] = useState(false);
  const [isEditModalVis, setEditModalVis] = useState(false);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number | null>(null);

  useEffect(() => {
    if (userId) {
      loadVehicles();
    }
  }, [userId]);

  const loadVehicles = async () => {
    const data = await fetchVehicles(userId);
    setCars(data);
  };

  const addCar = async () => {
    if (plate && type && fuel && userId) {
      const carData = {
        licence_plate: plate,
        gas_type: fuel,
        vehicle_type: type,
      };
      await createVehicle(userId, carData);
      await loadVehicles();
      setPlate("");
      setType("");
      setFuel("");
      setRegisterModalVis(false);
    }
  };

  const openEditModal = (index: number) => {
    const car = cars[index];
    setPlate(car.plate);
    setType(car.type);
    setFuel(car.fuel);
    setSelectedCarIndex(index);
    setEditModalVis(true);
  };

  const editCar = async () => {
    if (selectedCarIndex !== null && userId) {
      const carData = {
        licence_plate: plate,
        gas_type: fuel,
        vehicle_type: type,
      };
      await createVehicle(userId, carData); // same function used for update
      await loadVehicles();
      setSelectedCarIndex(null);
      setPlate("");
      setType("");
      setFuel("");
      setEditModalVis(false);
    }
  };

  const getVehicleIconName = (type: string) => {
    switch (type.toLowerCase()) {
      case "car":
        return "car";
      case "motorbike":
      case "bike":
        return "motorbike";
      case "truck":
        return "truck";
      default:
        return "car-off"; // fallback icon
    }
  };

  const deleteCar = async (plateToDelete: string) => {
    if (userId) {
      await deleteVehicle(userId, plateToDelete);
      await loadVehicles();
    }
  };

  const renderItem = ({ item, index }: { item: Car; index: number }) => (
    <TouchableOpacity onPress={() => openEditModal(index)} style={styles.carItem}>
      <MaterialCommunityIcons name={getVehicleIconName(item.type)} size={28} color="#333" style={styles.vehicleIcon} />

      <View style={styles.carInfo}>
        <Text style={styles.carPlate}>{item.plate}</Text>
        <Text>{`${item.type} - ${item.fuel}`}</Text>
      </View>

      <TouchableOpacity onPress={() => deleteCar(item.plate)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setRegisterModalVis(true)}>
        <Text style={styles.buttonText}>Register Car</Text>
      </TouchableOpacity>

      <FlatList data={cars} keyExtractor={(item) => item.plate} renderItem={renderItem} style={styles.list} />

      <Modal visible={isRegisterModalVis} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register New Car</Text>

            <TextInput placeholder="Plate" value={plate} onChangeText={setPlate} style={styles.input} />
            <TextInput
              placeholder="Type (car/motorbike/truck)"
              value={type}
              onChangeText={setType}
              style={styles.input}
            />
            <TextInput
              placeholder="Fuel (gasoline/diesel/electric)"
              value={fuel}
              onChangeText={setFuel}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={addCar}>
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
            <Text style={styles.modalTitle}>Edit Car</Text>

            <TextInput
              placeholder="Plate"
              value={plate}
              onChangeText={setPlate}
              editable={selectedCarIndex === null} // Editable only for register modal
              style={[styles.input, selectedCarIndex !== null && { backgroundColor: "#eee" }]}
            />
            <TextInput
              placeholder="Type (car/motorbike/truck)"
              value={type}
              onChangeText={setType}
              style={styles.input}
            />
            <TextInput
              placeholder="Fuel (gasoline/diesel/electric)"
              value={fuel}
              onChangeText={setFuel}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={editCar}>
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
  vehicleIcon: {
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
