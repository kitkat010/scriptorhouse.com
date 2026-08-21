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


// Typed.js Library Wrapper - wait for fonts before measuring heading heights
document.addEventListener("DOMContentLoaded", () => {
  const typewriterElements = document.querySelectorAll(".typewriter");

  const initTyped = () => {
    typewriterElements.forEach((el) => {
      const originalHTML = el.innerHTML.trim();
      const strings = [originalHTML];

      const isHomepage = !!document.getElementById("heroVideo");
      const loop = isHomepage;
      const backDelay = 2500;

      if (typeof Typed !== 'undefined') {
        // Measure height NOW — fonts are guaranteed loaded via document.fonts.ready
        // This locks the h1 space so the page never reflows while typing
        const naturalHeight = el.getBoundingClientRect().height;
        if (naturalHeight > 0) {
          el.style.minHeight = naturalHeight + 'px';
        }

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
  };

  // document.fonts.ready guarantees Playfair Display is applied before we
  // measure. Without this, offsetHeight reflects the fallback font and the
  // locked min-height is wrong, causing the visible wiggle.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initTyped);
  } else {
    // Older-browser fallback: small delay to let fonts settle
    setTimeout(initTyped, 200);
  }
});