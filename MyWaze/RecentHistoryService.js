import { collection, addDoc, getDocs, getDoc, query, where, setDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

export const fetchUserHistory = async (userId) => {
  try {
    const docRef = doc(FIRESTORE_DB, "user_history", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const history = docSnap.data().history || [];
      return history.slice(0, 5); // Ensures max 5
    }

    return [];
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
};


export const saveUserTrip = async (userId, locationName) => {
  try {
    const docRef = doc(FIRESTORE_DB, "user_history", userId);
    const docSnap = await getDoc(docRef);

    let history = [];

    if (docSnap.exists()) {
      history = docSnap.data().history || [];
    }

    // Add to front, remove duplicates, trim to 5
    history = [locationName, ...history.filter(item => item !== locationName)].slice(0, 5);

    await setDoc(docRef, { history });

    return docRef.id;
  } catch (error) {
    console.error("Error saving recent trip:", error);
    throw error;
  }
};



