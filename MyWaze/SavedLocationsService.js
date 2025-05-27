import { collection, addDoc, getDocs, getDoc, query, where, setDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

// Path: saved_locations/<user_id>/locations/<location_document_id>

export const fetchUserSavedLocations = async (userId) => {
  try {
    console.log("User saved locations fetched:", userId);
    const locationRef = collection(FIRESTORE_DB, "saved_locations", userId, "locations"); // locations is a sub-collection of saved_locations/<user_id>
    const docs = await getDocs(locationRef);
    const savedLocations= [];

    docs.forEach((doc) => {
        savedLocations.push({
            name: doc.data().name,
            type: doc.data().type,
            coordinates: {
                latitude: doc.data().coordinates.latitude,
                longitude: doc.data().coordinates.longitude,
            }});
        });

    console.log("Fetched saved locations:", savedLocations);
    return savedLocations; // Return the array of saved locations
  } catch (error) {
    console.error("Error fetching Saved Locations:", error);
    return [];
  }
};

