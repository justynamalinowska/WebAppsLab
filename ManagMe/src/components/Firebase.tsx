import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9EWu2cLzY2hMurzZJXf9TRiYwvi73Rs4",
  authDomain: "manageme-959f1.firebaseapp.com",
  projectId: "manageme-959f1",
  storageBucket: "manageme-959f1.firebasestorage.app",
  messagingSenderId: "374077358331",
  appId: "1:374077358331:web:90218f2d03e494b6adb05e",
  measurementId: "G-3S36CG1CVP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);