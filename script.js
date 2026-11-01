
document.addEventListener("DOMContentLoaded", function () {



    // =========================
    // 2. MOBILE NAVIGATION
    // =========================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.textContent = isOpen ? "✕" : "☰";

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        // Close menu when a navigation link is clicked
        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

        // Close menu when the user presses Escape
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                navLinks.classList.remove("open");
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }

        });

    }


    // =========================
    // 3. SCROLL REVEAL ANIMATION
    // =========================

    const revealElements = document.querySelectorAll(".reveal");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });

    }


    // =========================
    // 4. ACTIVE NAVIGATION LINK
    // =========================

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navItems = document.querySelectorAll(
        ".nav-links .nav-link"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        const currentId = entry.target.id;

                        navItems.forEach(function (link) {

                            const isActive =
                                link.getAttribute("href") === "#" + currentId;

                            link.classList.toggle("active", isActive);

                        });

                    }

                });

            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });

    }


    // =========================
    // 5. CURRENT FOOTER YEAR
    // =========================

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // =========================
    // 6. CLOSE MENU ON RESIZE
    // =========================

    window.addEventListener("resize", function () {

        if (window.innerWidth > 850 && navLinks && menuToggle) {

            navLinks.classList.remove("open");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");

        }

    });

});

// Show the signed-in user's name in the homepage navbar

const signLink = document.getElementById("signinLink");
const userMenu = document.getElementById("userMenu");
const welcomeName = document.getElementById("welcomeName");
const signoutBtn = document.getElementById("signoutBtn");

function updateUserAccount() {
    let user = null;

    try {
        const savedUser =
            sessionStorage.getItem("resumeCraftCurrentUser") ||
            sessionStorage.getItem("resumeDemoUser");

        user = savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        user = null;
    }

    if (user && user.name) {
        if (signLink)signLink.hidden = true;
        if (userMenu) userMenu.hidden = false;
        if (welcomeName) welcomeName.textContent = user.name;
    } else {
        if (signLink) signLink.hidden = false;
        if (userMenu) userMenu.hidden = true;
    }
}

updateUserAccount();

if (signoutBtn) {
    signoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("resumeCraftCurrentUser");
        sessionStorage.removeItem("resumeDemoUser");

        updateUserAccount();
        window.location.href = "index.html";
    });
}

