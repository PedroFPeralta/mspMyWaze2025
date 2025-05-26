// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDroR-Fx1DU7EAOCZuzJXJsYwpKS9MvO-k",
  authDomain: "msp-mywaze2025.firebaseapp.com",
  projectId: "msp-mywaze2025",
  storageBucket: "msp-mywaze2025.firebasestorage.app",
  messagingSenderId: "183893990743",
  appId: "1:183893990743:web:4eccf82c524a25ef50b212"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);