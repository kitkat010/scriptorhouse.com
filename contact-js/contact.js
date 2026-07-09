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

});