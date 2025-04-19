import { collection, getDocs } from "firebase/firestore";
import { db } from './app.js';

export async function docGet() {
    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
}