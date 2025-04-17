import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCZbxd5wdlanweKZxexXcBjDKcvsK5664s",
    authDomain: "myfinance-ad735.firebaseapp.com",
    projectId: "myfinance-ad735",
    storageBucket: "myfinance-ad735.firebasestorage.app",
    messagingSenderId: "841642619613",
    appId: "1:841642619613:web:c10cdc9d643d0a6097e134",
    measurementId: "G-VNCJTDFD9E"
  };

export async function docAdd(name, email, age) {
    
    try {
        const docRef = await addDoc(collection(db, "user"), {
            name,
            age,
            email
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function docGet() {
    const querySnapshot = await getDocs(collection(db, "user"));
    let i = 1;
    querySnapshot.forEach((doc) => {
        console.log(`${i++} -- ${doc.id} => ${JSON.stringify(doc.data(), null, 2)}`);
    });
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);