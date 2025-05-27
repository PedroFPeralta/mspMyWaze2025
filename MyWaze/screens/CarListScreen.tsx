import React, { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "CarList">;

type Car = {
  plate: string;
  type: string;
  fuel: string;
};

export default function CarListScreen({ navigation }: RegisterScreenProps) {
  const [plate, setPlate] = useState("");
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");

  const [cars, setCars] = useState<Car[]>([
    { plate: "00-AA-01", type: "car", fuel: "gasoline" },
    { plate: "11-BB-22", type: "motorbike", fuel: "electric" },
  ]);

  const [isRegisterModalVis, setRegisterModalVis] = useState(false);

  const addCar = () => {
    if (plate && type && fuel) {
      setCars((prev) => [...prev, { plate, type, fuel }]);
      setPlate("");
      setType("");
      setFuel("");
      setRegisterModalVis(false);
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

  const deleteCar = (plateToDelete: string) => {
    setCars((prevCars) => prevCars.filter((car) => car.plate !== plateToDelete));
  };

  const renderItem = ({ item }: { item: Car }) => (
    <View style={styles.carItem}>
      <MaterialCommunityIcons name={getVehicleIconName(item.type)} size={28} color="#333" style={styles.vehicleIcon} />

      <View style={styles.carInfo}>
        <Text style={styles.carPlate}>{item.plate}</Text>
        <Text>{`${item.type} - ${item.fuel}`}</Text>
      </View>

      <TouchableOpacity onPress={() => deleteCar(item.plate)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
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
