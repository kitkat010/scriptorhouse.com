// Scroll reveal animation with Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".fade-up, .fade-left, .fade-right, .scale-up, .pop-in, .slide-left, .slide-right");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px", // Trigger when the element is 80px into the viewport
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Unobserve once animation is triggered
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
});


// Button glow mouse effect
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    button.style.setProperty("--x", x + "px");
    button.style.setProperty("--y", y + "px");
  });
});


// Close mobile menu when resizing back to desktop
window.addEventListener("resize", () => {
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");

  if (window.innerWidth > 992) {
    if (navMenu) navMenu.classList.remove("show");
    if (menuToggle) menuToggle.classList.remove("active");
  }
});


// Typed.js Library Wrapper
document.addEventListener("DOMContentLoaded", () => {
  const typewriterElements = document.querySelectorAll(".typewriter");

  typewriterElements.forEach((el) => {
    // Read the text strings or HTML from the element itself
    const originalHTML = el.innerHTML.trim();
    const strings = [originalHTML];

    // Homepage loops infinitely, sub-pages type once
    const isHomepage = !!document.getElementById("heroVideo");
    const loop = isHomepage;
    const backDelay = 2500;

    if (typeof Typed !== 'undefined') {
      // Clear content before Typed.js starts to prevent layout flash
      el.innerHTML = "";

      new Typed(el, {
        strings: strings,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: backDelay,
        loop: loop,
        contentType: 'html',
        showCursor: true,
        cursorChar: '|',
        onComplete: (self) => {
          if (!loop) {
            // Hide and remove the cursor after typing finishes
            setTimeout(() => {
              const cursor = el.nextElementSibling;
              if (cursor && cursor.classList.contains("typed-cursor")) {
                cursor.style.transition = "opacity 0.5s ease";
                cursor.style.opacity = "0";
                setTimeout(() => cursor.remove(), 500);
              }
            }, 800);
          }
        }
      });
    }
  });
});