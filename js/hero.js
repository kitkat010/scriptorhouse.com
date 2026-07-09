const heroSlides = document.querySelectorAll(".hero-slide");
let currentHeroSlide = 0;

setInterval(() => {
  heroSlides[currentHeroSlide].classList.remove("active");

  currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;

  heroSlides[currentHeroSlide].classList.add("active");
}, 5000);