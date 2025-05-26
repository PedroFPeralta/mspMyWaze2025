import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

export const fetchUserPreferences = async (userId) => {
  try {
    const preferencesRef = collection(FIRESTORE_DB, "user_preferences");
    const q = query(preferencesRef, where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const preferences = querySnapshot.docs.map(doc => ({ id: doc.id, avoid_tolls: doc.avoid_tolls, avoid_motorways: doc.avoid_motorways, user_id: doc.user_id, ...doc.data() }));
    return preferences;
  } catch (error) {
    console.error("Error fetching route preferences:", error);
    return [];
  }
};