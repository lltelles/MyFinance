import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp({
    apiKey: "AIzaSyCZbxd5wdlanweKZxexXcBjDKcvsK5664s",
    authDomain: "myfinance-ad735.firebaseapp.com",
    projectId: "myfinance-ad735",
    storageBucket: "myfinance-ad735.firebasestorage.app",
    messagingSenderId: "841642619613",
    appId: "1:841642619613:web:c10cdc9d643d0a6097e134",
    measurementId: "G-VNCJTDFD9E"
  });
export const db = getFirestore(app);