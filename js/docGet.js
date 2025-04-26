import { db } from './app.js';
import { getDoc, doc } from 'firebase/firestore';


async function loadProfileData() {
    try {
      const userId = "GOgkjvRY6yj0mYJI9pYb";
      const userDocRef = doc(db, "profile", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profileData = {
          ...userDoc.data(),
          // Mantém os valores padrão se não vierem do Firestore
          email: userDoc.data().email}
          console.log("teste", profileData)
      } else {
        console.log("Documento não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      this._profileData.name = "Erro ao carregar perfil";
    }
  }

loadProfileData();
/*
const nameList = document.querySelector('[data-js="name-list"]')

const querySnapshot = await getDocs(collection(db, "user"))
  .then(querySnapshot => {
    const nameLis = querySnapshot.docs.reduce((acc, doc) => {
      const {name, age, email} = doc.data()

      acc += `${name}</h5>
      <ul>
        <li> Idade: ${age}</li>
        <li> E-mail: ${email}</li>
      </ul>
      `
      return acc
    }, '')
    
    nameList.innerHTML = nameLis
  })
  .catch(err => {
    console.log(err.message)
  });*/