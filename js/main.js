// Scroll reveal animation
const reveals = document.querySelectorAll(".fade-up");

function revealElements() {
  reveals.forEach((item) => {
    const top = item.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 100) {
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealElements);
window.addEventListener("load", revealElements);


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
    navMenu.classList.remove("show");
    menuToggle.classList.remove("active");
  }
});