const processFolders = document.querySelectorAll(".process-folder");

const processObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const folder = entry.target;
      const status = folder.querySelector(".folder-status");

      if (entry.isIntersecting) {
        folder.classList.add("active");
        if (status) status.textContent = "On Process";
      } else {
        folder.classList.remove("active");
        if (status) status.textContent = "Pending Review";
      }
    });
  },
  {
    threshold: 0.38,
    rootMargin: "-18% 0px -18% 0px"
  }
);

processFolders.forEach((folder) => {
  processObserver.observe(folder);
});