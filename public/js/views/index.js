window.addEventListener("scroll", function(){
    let header = this.document.querySelector('#header')
    header.classList.toggle('rolagem',window.scrollY > 0)
})

document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu toggle
  const hamburger = document.getElementById('menu-hamburger');
  const menu = document.querySelector('.menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');
    });
    // Optional: close menu when clicking a menu item (mobile UX)
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href === "#") return; // ignora links vazios

    e.preventDefault();
    const targetID = href.substring(1);
    const target = document.getElementById(targetID);
    if (!target) return;

    const startPosition = window.pageYOffset;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    }

    requestAnimationFrame(animation);
  });
});