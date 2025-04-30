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
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.querySelector('.register-container');

  // Funções auxiliares atualizadas
  function showError(input, message) {
    const inputBox = input.closest('.input-box');
    
    if (!inputBox) {
      console.error('Container do input não encontrado');
      return;
    }

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
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const emailInput = loginForm.querySelector('input[type="text"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');
      
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
    const registerSubmitHandler = async function(e) {
      e.preventDefault();
      
      const inputs = registerForm.querySelectorAll('.input-field');
      const [name, last_name, email, senha, confirmacaoSenha] = Array.from(inputs).map(input => {
        const value = input.value.trim();
        clearError(input);
        return value;
      });

      let valid = true;
      
      if (!name) {
        showError(inputs[0], 'name é obrigatório');
        valid = false;
      }
      
      if (!last_name) {
        showError(inputs[1], 'last_name é obrigatório');
        valid = false;
      }
      
      if (!email) {
        showError(inputs[2], 'E-mail é obrigatório');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError(inputs[2], 'E-mail inválido');
        valid = false;
      }
      
      if (!senha) {
        showError(inputs[3], 'Senha é obrigatória');
        valid = false;
      } else if (senha.length < 6) {
        showError(inputs[3], 'Mínimo 6 caracteres');
        valid = false;
      }
      
      if (senha !== confirmacaoSenha) {
        showError(inputs[4], 'Senhas não coincidem');
        valid = false;
      }
      
      if (!valid) return;
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        
        await updateProfile(userCredential.user, {
          displayName: `${name} ${last_name}`
        });
        
        await setDoc(doc(db, 'user', userCredential.user.uid), {
          name,
          last_name,
          email,
          create_at: serverTimestamp()
        });
        
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.code === 'auth/email-already-in-use') {
          showError(inputs[2], 'E-mail já cadastrado');
        } else if (error.code === 'auth/weak-password') {
          showError(inputs[3], 'Senha muito fraca');
        } else {
          showError(inputs[0], 'Erro ao cadastrar');
        }
      }
    };

    // Encontra o botão de submit no register-container
    const registerSubmit = registerForm.querySelector('input[type="submit"]');
    if (registerSubmit) {
      registerSubmit.addEventListener('click', registerSubmitHandler);
    }
  }
});