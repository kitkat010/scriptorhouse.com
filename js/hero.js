document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("countdownOverlay");
  const numberEl = document.getElementById("countdownNumber");
  const heroContent = document.querySelector(".hero-content");

  if (!overlay || !numberEl) return;

  // Make sure hero text is hidden initially during the countdown
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(40px)";
    heroContent.style.transition = "opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1), transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)";
  }

  let count = 3;
  numberEl.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      numberEl.textContent = count;
    } else {
      clearInterval(interval);
      overlay.classList.add("fade-out");
      
      // Reveal the main hero text as the overlay starts fading out
      setTimeout(() => {
        if (heroContent) {
          heroContent.style.opacity = "1";
          heroContent.style.transform = "translateY(0)";
          heroContent.classList.add("show");
        }
      }, 300);

      // Remove overlay DOM element after transition completes
      setTimeout(() => {
        overlay.style.display = "none";
      }, 1000);
    }
  }, 1000);
});