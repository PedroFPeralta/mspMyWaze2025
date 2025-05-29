import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

export const createVehicle = async (userId, vehicle) => {
  const { licence_plate, gas_type, vehicle_type } = vehicle;
  const docRef = doc(FIRESTORE_DB, "users", userId, "vehicles", licence_plate);
  await setDoc(docRef, {
    user_id: userId,
    licence_plate,
    gas_type,
    vehicle_type,
  });
};

export const fetchVehicles = async (userId) => {
  const vehiclesRef = collection(FIRESTORE_DB, "users", userId, "vehicles");
  const snapshot = await getDocs(vehiclesRef);
  return snapshot.docs.map((doc) => ({
    plate: doc.id,
    type: doc.data().vehicle_type,
    fuel: doc.data().gas_type,
  }));
};

export const deleteVehicle = async (userId, licencePlate) => {
  const docRef = doc(FIRESTORE_DB, "users", userId, "vehicles", licencePlate);
  await deleteDoc(docRef);
};
