document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".faq-sidebar a");
  const categories = document.querySelectorAll(".faq-category");
  const faqItems = document.querySelectorAll(".faq-item");
  const searchInput = document.getElementById("faqSearchInput");

  /* =========================
     SIDEBAR CLICK
  ========================= */

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href").replace("#", "");
      const targetCategory = document.querySelector(
        `.faq-category[data-category="${targetId}"]`
      );

      if (!targetCategory) return;

      sidebarLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      targetCategory.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  /* =========================
     ACCORDION
  ========================= */

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question-btn");

    button.addEventListener("click", () => {
      const parentCategory = item.closest(".faq-category");

      parentCategory.querySelectorAll(".faq-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      item.classList.toggle("active");
    });
  });

  /* =========================
     ACTIVE SIDEBAR ON SCROLL
  ========================= */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = entry.target.dataset.category;

          sidebarLinks.forEach((link) => {
            link.classList.remove("active");

            if (link.getAttribute("href") === `#${category}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      root: null,
      threshold: 0.35
    }
  );

  categories.forEach((category) => {
    observer.observe(category);
  });

  /* =========================
     SEARCH
  ========================= */

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase().trim();

      if (keyword === "") {
        categories.forEach((category) => {
          category.style.display = "block";

          category.querySelectorAll(".faq-item").forEach((item) => {
            item.style.display = "block";
            item.classList.remove("active");
          });
        });

        const firstCategory = document.querySelector(
          '.faq-category[data-category="general"]'
        );

        if (firstCategory) {
          const firstItem = firstCategory.querySelector(".faq-item");
          if (firstItem) firstItem.classList.add("active");
        }

        sidebarLinks.forEach((link) => {
          link.style.display = "block";
          link.classList.remove("active");
        });

        const generalLink = document.querySelector('.faq-sidebar a[href="#general"]');
        if (generalLink) generalLink.classList.add("active");

        return;
      }

      let firstMatchedCategory = null;

      categories.forEach((category) => {
        let categoryHasMatch = false;

        category.querySelectorAll(".faq-item").forEach((item) => {
          const question = item
            .querySelector(".faq-question-btn")
            .innerText.toLowerCase();

          const answer = item
            .querySelector(".faq-answer")
            .innerText.toLowerCase();

          const hasMatch =
            question.includes(keyword) || answer.includes(keyword);

          if (hasMatch) {
            item.style.display = "block";
            item.classList.add("active");
            categoryHasMatch = true;
          } else {
            item.style.display = "none";
            item.classList.remove("active");
          }
        });

        if (categoryHasMatch) {
          category.style.display = "block";

          if (!firstMatchedCategory) {
            firstMatchedCategory = category;
          }
        } else {
          category.style.display = "none";
        }
      });

      sidebarLinks.forEach((link) => {
        const target = link.getAttribute("href").replace("#", "");
        const matchingCategory = document.querySelector(
          `.faq-category[data-category="${target}"]`
        );

        if (matchingCategory && matchingCategory.style.display !== "none") {
          link.style.display = "block";
        } else {
          link.style.display = "none";
        }

        link.classList.remove("active");
      });

      if (firstMatchedCategory) {
        const categoryName = firstMatchedCategory.dataset.category;
        const activeLink = document.querySelector(
          `.faq-sidebar a[href="#${categoryName}"]`
        );

        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  /* =========================
     DEFAULT ACTIVE
  ========================= */

  const firstSidebar = document.querySelector('.faq-sidebar a[href="#general"]');
  const firstFaq = document.querySelector(
    '.faq-category[data-category="general"] .faq-item'
  );

  if (firstSidebar) firstSidebar.classList.add("active");
  if (firstFaq) firstFaq.classList.add("active");
});