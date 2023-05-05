// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ4lVcR-D7v1qmEkivJcc7LLOW8dqb6qk",
  authDomain: "appointment-setter-52307.firebaseapp.com",
  projectId: "appointment-setter-52307",
  storageBucket: "appointment-setter-52307.appspot.com",
  messagingSenderId: "976349519248",
  appId: "1:976349519248:web:4edb9d518a8f7a14032715"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);