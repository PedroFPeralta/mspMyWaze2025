import { collection, addDoc, getDocs, getDoc, query, where, setDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebase";

export const fetchUserPreferences = async (userId) => {
  try {
    const docRef = doc(FIRESTORE_DB, "user_preferences", userId);
    const docSnap = await getDoc(docRef);

    console.log("User preferences fetched:", userId);
    return docSnap.data();
  } catch (error) {
    console.error("Error fetching route preferences:", error);
    return [];
  }
};

export const saveUserPreferences = async (userId, preferences) => {
  try {
    const docRef = doc(FIRESTORE_DB, "user_preferences", userId); // 'userId' as doc ID
    await setDoc(docRef, preferences, { merge: true }); // Use merge to update existing preferences
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID for reference
  } catch (error) {
    console.error("Error saving route preferences:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

export const createUserPreferences = async (userId) => {
    const preferences = {
        avoid_tolls: false,
        avoid_motorways: true,
        avoid_ferries: false,
    }
    try {
        const docRef = doc(FIRESTORE_DB, "user_preferences", userId); // 'userId' as doc ID
        await setDoc(docRef, preferences);
        console.log("User preferences created with ID: ", docRef.id);
        return preferences; // Return the document ID for reference
    } catch (error) {
        console.error("Error creating user preferences:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

