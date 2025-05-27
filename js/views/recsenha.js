// ../js/views/recover.js

import { auth } from "../app.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Displays a message to the user
 * @param {HTMLElement} element - The element where the message will be shown
 * @param {string} message - The message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = type === 'success' ? '#28a745' : '#dc3545';
    element.style.marginTop = '15px';
    element.style.textAlign = 'center';
    element.style.padding = '10px';
    element.style.borderRadius = '4px';
    element.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    
    // Clear message after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Handles the password recovery form submission
 * @param {Event} e - Form submit event
 */
async function handleRecoverSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('recoverEmail')?.value.trim();
    const messageElement = document.getElementById('recoverMessage');
    
    if (!email) {
        showMessage(messageElement, 'Por favor, insira seu e-mail', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageElement, 'Por favor, insira um e-mail válido', 'error');
        return;
    }
    
    try {
        // Send password reset email
        await sendPasswordResetEmail(auth, email);
        showMessage(
            messageElement, 
            'Se este e-mail estiver cadastrado, você receberá um link de recuperação. Verifique sua caixa de entrada.', 
            'success'
        );
        
        // Clear the email field after successful submission
        if (document.getElementById('recoverEmail')) {
            document.getElementById('recoverEmail').value = '';
        }
    } catch (error) {
        console.error('Password recovery error:', error);
        let errorMessage = 'Erro ao processar sua solicitação';
        
        switch(error.code) {
            case 'auth/invalid-email':
                errorMessage = 'E-mail inválido';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
                break;
            case 'auth/user-not-found':
                // Firebase might not always return this for security reasons
                errorMessage = 'Se este e-mail estiver cadastrado, você receberá um link de recuperação';
                break;
            default:
                errorMessage = 'Ocorreu um erro ao enviar o e-mail de recuperação';
        }
        
        showMessage(messageElement, errorMessage, 'error');
    }
}

/**
 * Sets up the password recovery form
 */
export function setupRecoverForm() {
    const recoverForm = document.getElementById('recoverForm');
    
    if (recoverForm) {
        recoverForm.addEventListener('submit', handleRecoverSubmit);
        
        // You can add additional setup here if needed
        console.log('Password recovery form initialized');
    } else {
        console.warn('Password recovery form not found');
    }
}

// Initialize when imported as a module
document.addEventListener('DOMContentLoaded', setupRecoverForm);