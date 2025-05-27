   
    import { auth } from "../js/app.js";
    import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

   function myMenuFunction() {
    var i = document.getElementById("navMenu");
    if(i.className === "nav-menu") {
        i.className += " responsive";
    } else {
        i.className = "nav-menu";
    }
   }
 

    var a = document.getElementById("loginBtn");
    var b = document.getElementById("registerBtn");
    var x = document.getElementById("login");
    var y = document.getElementById("register");
    function login() {
        x.style.left = "4px";
        y.style.right = "-520px";
        a.className += " white-btn";
        b.className = "btn";
        x.style.opacity = 1;
        y.style.opacity = 0;
    }
    function register() {
        x.style.left = "-510px";
        y.style.right = "5px";
        a.className = "btn";
        b.className += " white-btn";
        x.style.opacity = 0;
        y.style.opacity = 1;
    }

       //* Adicione o SDK do Firebase 
   

        
        document.getElementById('recoverForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('recoverEmail').value.trim();
            const messageElement = document.getElementById('recoverMessage');
            
            if (!email) {
                showMessage(messageElement, 'Por favor, insira seu e-mail', 'error');
                return;
            }
            
            try {
                await sendPasswordResetEmail(auth, email);
                showMessage(messageElement, 'E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.', 'success');
            } catch (error) {
                console.error('Erro ao enviar e-mail de recuperação:', error);
                let errorMessage = 'Erro ao enviar e-mail de recuperação';
                
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Nenhum usuário encontrado com este e-mail';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'E-mail inválido';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
                        break;
                }
                
                showMessage(messageElement, errorMessage, 'error');
            }
        });
        
        function showMessage(element, message, type) {
            element.textContent = message;
            element.style.display = 'block';
            element.style.color = type === 'success' ? 'green' : 'red';
            element.style.marginTop = '15px';
            element.style.textAlign = 'center';
        }
    
