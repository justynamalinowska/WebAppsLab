// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9EWu2cLzY2hMurzZJXf9TRiYwvi73Rs4",
  authDomain: "manageme-959f1.firebaseapp.com",
  projectId: "manageme-959f1",
  storageBucket: "manageme-959f1.firebasestorage.app",
  messagingSenderId: "374077358331",
  appId: "1:374077358331:web:90218f2d03e494b6adb05e",
  measurementId: "G-3S36CG1CVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);