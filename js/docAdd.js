import { db } from './app.js';
import { collection, addDoc } from "firebase/firestore";

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
