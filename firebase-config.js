// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZG9Y5H6ZsjVLzINJTJNmbpeaLVNWB3FQ",
  authDomain: "twodo-c8b88.firebaseapp.com",
  projectId: "twodo-c8b88",
  storageBucket: "twodo-c8b88.firebasestorage.app",
  messagingSenderId: "605172469828",
  appId: "1:605172469828:web:7ceebf4546fe3aa11e6c11",
  measurementId: "G-ZFZGNVKR0K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
