function login() {
  var a = document.getElementById("loginBtn");
  var b = document.getElementById("registerBtn");
  var x = document.getElementById("login");
  var y = document.getElementById("register");
  x.style.left = "4px";
  y.style.right = "-520px";
  a.className += " white-btn";
  b.className = "btn";
  x.style.opacity = 1;
  y.style.opacity = 0;
}

function register() {
  var a = document.getElementById("loginBtn");
  var b = document.getElementById("registerBtn");
  var x = document.getElementById("login");
  var y = document.getElementById("register");
  x.style.left = "-510px";
  y.style.right = "5px";
  a.className = "btn";
  b.className += " white-btn";
  x.style.opacity = 0;
  y.style.opacity = 1;
}

window.login = login;
window.register = register;

// Remove inline onclick from HTML for menu-hamburger
// Use only this event listener for hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuHamburger = document.getElementById('menu-hamburger');
  const navMenu = document.getElementById('navMenu');
  if (menuHamburger && navMenu) {
    menuHamburger.addEventListener('click', function() {
      menuHamburger.classList.toggle('active');
      navMenu.classList.toggle('responsive');
    });
  }
});

// Remove or comment out myMenuFunction to avoid conflicts
// function myMenuFunction() {}
