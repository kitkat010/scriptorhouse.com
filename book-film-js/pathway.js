const pathwaySteps = document.querySelectorAll(".timeline-step");

const pathwayObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pathwaySteps.forEach((step, index) => {
          setTimeout(() => {
            step.classList.add("active");
          }, index * 720);
        });

        pathwayObserver.disconnect();
      }
    });
  },
  {
    threshold: 0.35
  }
);

const pathwaySection = document.querySelector(".film-pathway-section");

if (pathwaySection) {
  pathwayObserver.observe(pathwaySection);
}