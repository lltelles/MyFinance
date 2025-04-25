import { db, auth } from "../js/app.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
  // Verifica se auth e db foram carregados
  if (!auth || !db) {
    console.error('Serviços Firebase não disponíveis!');
    alert('Erro de configuração. Recarregue a página.');
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is authenticated:', user);
    } else {
      console.log('User is not authenticated');
    }
  });

  // Elementos do formulário
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Funções auxiliares
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
      errorElement = document.createElement('small');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('error');
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (errorElement) errorElement.remove();
    input.classList.remove('error');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      let valid = true;
      if (!email) {
        showError(emailInput, 'E-mail é obrigatório');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError(emailInput, 'E-mail inválido');
        valid = false;
      }

      if (!password) {
        showError(passwordInput, 'Senha é obrigatória');
        valid = false;
      }

      if (!valid) return;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Erro login:', error);

        switch (error.code) {
          case 'auth/invalid-email':
            showError(emailInput, 'Formato de e-mail inválido');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            showError(emailInput, 'Credenciais inválidas');
            break;
          default:
            showError(emailInput, 'Erro ao fazer login');
        }
      }
    });
  }

  // Cadastro
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      let valid = true;
      if (!name) {
        showError(document.getElementById('name'), 'Nome é obrigatório');
        valid = false;
      }

      if (!email) {
        showError(document.getElementById('email'), 'E-mail é obrigatório');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError(document.getElementById('email'), 'E-mail inválido');
        valid = false;
      }

      if (!password) {
        showError(document.getElementById('password'), 'Senha é obrigatória');
        valid = false;
      } else if (password.length < 6) {
        showError(document.getElementById('password'), 'Mínimo 6 caracteres');
        valid = false;
      }

      if (password !== confirmPassword) {
        showError(document.getElementById('confirmPassword'), 'Senhas não coincidem');
        valid = false;
      }

      if (!valid) return;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
          displayName: name
        });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: name,
          email: email,
          createdAt: serverTimestamp()
        });

        window.location.href = 'index.html';
      } catch (error) {
        console.error('Erro cadastro:', error);

        switch (error.code) {
          case 'auth/email-already-in-use':
            showError(document.getElementById('email'), 'E-mail já cadastrado');
            break;
          case 'auth/weak-password':
            showError(document.getElementById('password'), 'Senha muito fraca');
            break;
          default:
            showError(document.getElementById('email'), 'Erro ao cadastrar');
        }
      }
    });
  }
});
