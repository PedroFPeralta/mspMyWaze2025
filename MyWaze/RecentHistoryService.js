import { collection, addDoc, getDocs, getDoc, query, where, setDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

export const fetchUserHistory = async (userId) => {
  try {
    const docRef = doc(FIRESTORE_DB, "user_history", userId);
    const docSnap = await getDoc(docRef);

    console.log("User history fetched:", userId);
    return docSnap.data();
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
};

export const saveUserTrip = async (userId, location) => {
  try {
    const docRef = doc(FIRESTORE_DB, "user_history", userId); 
    await setDoc(docRef, location);
    return docRef.id; 
  } catch (error) {
    console.error("Error saving recent trip:", error);
    throw error;
  }
}


