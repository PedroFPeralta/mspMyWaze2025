import { collection, addDoc, getDocs, getDoc, query, where, setDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

export const fetchUserHistory = async (userId) => {
  try {
    const docRef = doc(FIRESTORE_DB, "saved_locations", userId, "location", "history");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("history doesn't exist")
    }

    return docSnap.data().historyList;
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
};


export const saveUserTrip = async (userId, location) => {
  try {
    const docRef = doc(FIRESTORE_DB, "saved_locations", userId, "location", "history");
    const docSnap = await getDoc(docRef);
    console.log("history0: " + JSON.stringify(docSnap.data(), null, 2));

    let historyList = [];

    if (!docSnap.exists()) {
      await createUserHistory(userId, location);
      return location;
    } else {
      historyList = docSnap.data().historyList || [];
      console.log("history1: " + JSON.stringify(historyList, null, 2));
    }

    // Remove duplicates based on name or coordinates
    historyList = historyList.filter(item => item.locationName !== location.locationName );

    console.log("history1.5: " + JSON.stringify(historyList, null, 2));

    // Add new location to the front and trim to last 5
    historyList = [location, ...historyList].slice(0, 5);

    await setDoc(docRef, { historyList });
    console.log("history2: " + JSON.stringify(historyList, null, 2));
    return historyList;
  } catch (error) {
    console.error("Error saving recent trip:", error);
    throw error;
  }
};


const createUserHistory = async ( userId, location ) => {
  try {
    const docRef = doc(FIRESTORE_DB, "saved_locations", userId, "location", "history");
    await setDoc(docRef, { history: [location] });
    console.log("User history created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating user history:", error);
    throw error;
  }
};




