/*=========================================
CONTACT PAGE
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=====================================
      FILM ROUTING
    =====================================*/

    const inquiryType = document.getElementById("inquiryType");
    const filmPanel = document.getElementById("filmRoutingMessage");

    if (inquiryType && filmPanel) {

        inquiryType.addEventListener("change", function () {

            if (this.value === "film-production") {

                filmPanel.classList.add("active");

            } else {

                filmPanel.classList.remove("active");

            }

        });

    }

    /*=====================================
      SCROLL REVEAL
    =====================================*/

    const reveals = document.querySelectorAll(".fade-up");

    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {
        threshold: .15
    });

    reveals.forEach(item => revealObserver.observe(item));

    /*=====================================
      HERO PARALLAX
    =====================================*/

    const concierge = document.querySelector(".concierge-card");

    window.addEventListener("scroll", () => {

        if (!concierge) return;

        if (window.innerWidth <= 992) {
            concierge.style.transform = "";
            return;
        }

        const y = window.scrollY * 0.18;

        concierge.style.transform =
            `translateY(${y}px)`;

    });

    /*=====================================
      INPUT GLOW
    =====================================*/

    const inputs = document.querySelectorAll(

        ".premium-form-card input," +

        ".premium-form-card textarea," +

        ".premium-form-card select"

    );

    inputs.forEach(input => {

        input.addEventListener("focus", () => {

            input.parentElement.classList.add("focused");

        });

        input.addEventListener("blur", () => {

            input.parentElement.classList.remove("focused");

        });

    });

    /*=====================================
      CARD TILT
    =====================================*/

    const cards = document.querySelectorAll(".routing-card");

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;

            const rotateX = ((y / rect.height) - .5) * -6;

            const rotateY = ((x / rect.width) - .5) * 6;

            card.style.transform =

                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-10px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

    /*=====================================
      BUTTON RIPPLE
    =====================================*/

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(btn => {

        btn.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            ripple.className = "btn-ripple";

            const rect = this.getBoundingClientRect();

            ripple.style.left =

                (e.clientX - rect.left) + "px";

            ripple.style.top =

                (e.clientY - rect.top) + "px";

            this.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 650);

        });

    });

    /*=====================================
      AJAX FORM SUBMISSION (send-mail.php)
    =====================================*/

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm && formStatus) {

        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Set loading state
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending Inquiry...</span> <i class="fa-solid fa-spinner fa-spin" style="margin-left:8px;"></i>`;

            // Reset status banner
            formStatus.style.display = "none";
            formStatus.className = "form-status-alert";
            formStatus.innerHTML = "";

            try {
                const formData = new FormData(contactForm);

                const response = await fetch("send-mail.php", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                });

                const result = await response.json();

                if (response.ok && result.status === "success") {
                    // Success
                    formStatus.className = "form-status-alert form-status-success";
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> <div><strong>Inquiry Sent!</strong><p>${result.message || "Thank you! Your message has been received."}</p></div>`;
                    formStatus.style.display = "flex";

                    // Reset form fields
                    contactForm.reset();
                    if (filmPanel) filmPanel.classList.remove("active");

                    // Smooth scroll to alert
                    formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
                } else {
                    // Validation or server error
                    throw new Error(result.message || "An error occurred while submitting your message.");
                }

            } catch (err) {
                // Error display
                formStatus.className = "form-status-alert form-status-error";
                formStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <div><strong>Submission Notice</strong><p>${err.message || "Unable to send message. Please try again or email us directly at info@scriptorhouse.com."}</p></div>`;
                formStatus.style.display = "flex";
                formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });

    }



});