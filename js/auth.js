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

document.addEventListener('DOMContentLoaded', function () {
  // Verifica se auth e db foram carregados
  if (!auth || !db) {
    console.error('Serviços Firebase não disponíveis!');
    alert('Erro de configuração. Recarregue a página.');
    return;
  }

  // Monitora estado de autenticação
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuário autenticado:', user);
    } else {
      console.log('Usuário não autenticado');
    }
  });

  // Funções auxiliares
  function showError(input, message) {
    const inputBox = input.closest('.input-box');
    if (!inputBox) return;

    clearError(input);

    const errorElement = document.createElement('small');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.display = 'block';
    errorElement.style.marginTop = '5px';

    inputBox.appendChild(errorElement);
    input.classList.add('error');
  }

  function clearError(input) {
    const inputBox = input.closest('.input-box');
    if (!inputBox) return;

    const errorElement = inputBox.querySelector('.error-message');
    if (errorElement) errorElement.remove();

    input.classList.remove('error');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="text"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value.trim();

      // Validação
      let valid = true;
      if (!email) {
        showError(loginForm.querySelector('input[type="text"]'), 'E-mail é obrigatório');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError(loginForm.querySelector('input[type="text"]'), 'E-mail inválido');
        valid = false;
      }

      if (!password) {
        showError(loginForm.querySelector('input[type="password"]'), 'Senha é obrigatória');
        valid = false;
      }

      if (!valid) return;

      // Tentativa de login
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Erro no login:', error);

        switch (error.code) {
          case 'auth/invalid-email':
            showError(loginForm.querySelector('input[type="text"]'), 'Formato de e-mail inválido');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            showError(loginForm.querySelector('input[type="text"]'), 'Credenciais inválidas');
            break;
          default:
            showError(loginForm.querySelector('input[type="text"]'), 'Erro ao fazer login');
        }
      }
    });
  }

  // Cadastro
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Obter valores dos campos
      const name = registerForm.querySelector('input[name="name"]').value.trim();
      const last_name = registerForm.querySelector('input[name="last_name"]').value.trim();
      const email = registerForm.querySelector('input[name="email"]').value.trim();
      const senha = registerForm.querySelector('input[name="senha"]').value.trim();
      const confirmacaoSenha = registerForm.querySelector('input[name="confirmacaoSenha"]').value.trim();

      // Validação
      let valid = true;

      if (!name) {
        showError(registerForm.querySelector('input[name="name"]'), 'Nome é obrigatório');
        valid = false;
      }

      if (!last_name) {
        showError(registerForm.querySelector('input[name="last_name"]'), 'Sobrenome é obrigatório');
        valid = false;
      }

      if (!email) {
        showError(registerForm.querySelector('input[name="email"]'), 'E-mail é obrigatório');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError(registerForm.querySelector('input[name="email"]'), 'E-mail inválido');
        valid = false;
      }

      if (!senha) {
        showError(registerForm.querySelector('input[name="senha"]'), 'Senha é obrigatória');
        valid = false;
      } else if (senha.length < 6) {
        showError(registerForm.querySelector('input[name="senha"]'), 'Mínimo 6 caracteres');
        valid = false;
      }

      if (senha !== confirmacaoSenha) {
        showError(registerForm.querySelector('input[name="confirmacaoSenha"]'), 'Senhas não coincidem');
        valid = false;
      }

      if (!valid) return;

      // Tentativa de cadastro
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

        // Atualizar perfil do usuário
        await updateProfile(userCredential.user, {
          displayName: `${name} ${last_name}`
        });

        // Salvar dados adicionais no Firestore
        await setDoc(doc(db, 'user', userCredential.user.uid), {
          name,
          last_name,
          email,
          createdAt: serverTimestamp()
        });

        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Erro no cadastro:', error);

        if (error.code === 'auth/email-already-in-use') {
          showError(registerForm.querySelector('input[name="email"]'), 'E-mail já cadastrado');
        } else if (error.code === 'auth/weak-password') {
          showError(registerForm.querySelector('input[name="senha"]'), 'Senha muito fraca');
        } else {
          showError(registerForm.querySelector('input[name="name"]'), 'Erro ao cadastrar: ' + error.message);
        }
      }
    });
  }
});