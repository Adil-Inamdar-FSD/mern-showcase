// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "quick-bite-food-delivery-4d415.firebaseapp.com",
  projectId: "quick-bite-food-delivery-4d415",
  storageBucket: "quick-bite-food-delivery-4d415.firebasestorage.app",
  messagingSenderId: "145023387513",
  appId: "1:145023387513:web:4f6296a0ef91bc4791d1a8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
