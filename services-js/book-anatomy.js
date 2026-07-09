const bookParts = {
  editorial: {
    title: "Editorial Review",
    text:
      "Every manuscript benefits from careful review before publication. Editorial review helps identify what the work may need before it moves into production.",
    list: [
      "Manuscript readiness",
      "Structure and clarity",
      "Reader experience",
      "Professional refinement"
    ]
  },

  cover: {
    title: "Cover Design",
    text:
      "A book cover is often the first impression a reader has of the work. Strong visual presentation helps support credibility and market readiness.",
    list: [
      "Cover concept direction",
      "Genre-appropriate presentation",
      "Visual market fit",
      "Professional design coordination"
    ]
  },

  layout: {
    title: "Interior Layout",
    text:
      "Interior layout affects how readers experience the book. Clean formatting, spacing, typography, and structure help the book feel professionally prepared.",
    list: [
      "Readable page structure",
      "Typography consistency",
      "Print layout preparation",
      "eBook formatting support"
    ]
  },

  preparation: {
    title: "Publishing Preparation",
    text:
      "Publishing preparation helps organize the book for release across the selected format and publishing path.",
    list: [
      "Paperback preparation",
      "Hardcover preparation",
      "eBook preparation",
      "Production readiness"
    ]
  },

  distribution: {
    title: "Distribution & Availability",
    text:
      "Distribution support helps prepare the book for availability through supported publishing and retail channels when applicable.",
    list: [
      "Print-on-demand setup",
      "Retail listing preparation",
      "Metadata guidance",
      "Availability planning"
    ]
  },

  positioning: {
    title: "Author Positioning",
    text:
      "Author positioning helps clarify how the book, message, and author presence are introduced to readers and the market.",
    list: [
      "Book description direction",
      "Audience positioning",
      "Author brand presentation",
      "Market messaging"
    ]
  }
};

const bookNodes = document.querySelectorAll(".book-node");
const bookInfoTitle = document.getElementById("bookInfoTitle");
const bookInfoText = document.getElementById("bookInfoText");
const bookInfoList = document.getElementById("bookInfoList");

bookNodes.forEach((node) => {
  node.addEventListener("click", () => {
    const selectedPart = node.dataset.bookPart;
    const content = bookParts[selectedPart];

    if (!content) return;

    bookNodes.forEach((item) => {
      item.classList.remove("active");
    });

    node.classList.add("active");

    bookInfoTitle.style.opacity = "0";
    bookInfoText.style.opacity = "0";
    bookInfoList.style.opacity = "0";

    setTimeout(() => {
      bookInfoTitle.textContent = content.title;
      bookInfoText.textContent = content.text;

      bookInfoList.innerHTML = content.list
        .map((item) => `<li>${item}</li>`)
        .join("");

      bookInfoTitle.style.opacity = "1";
      bookInfoText.style.opacity = "1";
      bookInfoList.style.opacity = "1";
    }, 180);
  });
});