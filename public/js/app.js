import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const app = initializeApp({
    apiKey: "AIzaSyCZbxd5wdlanweKZxexXcBjDKcvsK5664s",
    authDomain: "myfinance-ad735.firebaseapp.com",
    projectId: "myfinance-ad735",
    storageBucket: "myfinance-ad735.appspot.com",
    messagingSenderId: "841642619613",
    appId: "1:841642619613:web:c10cdc9d643d0a6097e134",
    measurementId: "G-VNCJTDFD9E"
});

export const db = getFirestore(app);
export const auth = getAuth(app);