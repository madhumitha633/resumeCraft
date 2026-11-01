
document.addEventListener("DOMContentLoaded", function () {

    // 1. DISPLAY THE LOGGED-IN USER'S NAME
    let user = null;

    try {
        const savedUser =
            sessionStorage.getItem("resumeCraftCurrentUser") ||
            sessionStorage.getItem("resumeDemoUser");

        user = savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        user = null;
    }

    const userName = user?.name?.trim() || "User";
    const firstLetter = userName.charAt(0).toUpperCase();

    document.getElementById("welcomeName").textContent = userName;
    document.getElementById("sidebarName").textContent = userName;
    document.getElementById("topbarName").textContent = "Hi, " + userName;

    document.getElementById("sidebarAvatar").textContent = firstLetter;
    document.getElementById("topbarAvatar").textContent = firstLetter;

    document.getElementById("previewName1").textContent =
        userName.toUpperCase();

    document.getElementById("previewName2").textContent =
        userName.toUpperCase();


    // 2. GLOBAL DARK MODE
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeLabel = document.getElementById("themeLabel");

    function applyTheme() {
        const isDark =
            localStorage.getItem("resumeCraftTheme") === "dark";

        document.documentElement.classList.toggle("dark-mode", isDark);

        themeIcon.className = isDark
            ? "fa-regular fa-sun"
            : "fa-regular fa-moon";

        themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    applyTheme();

    themeToggle.addEventListener("click", function () {
        const isDark =
            document.documentElement.classList.contains("dark-mode");

        localStorage.setItem(
            "resumeCraftTheme",
            isDark ? "light" : "dark"
        );

        applyTheme();
    });


    // 3. MOBILE SIDEBAR
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });

    document.addEventListener("click", function (event) {
        if (
            window.innerWidth <= 850 &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            sidebar.classList.remove("open");
        });
    });


    // 4. RESUME CARD OPTIONS
    document.querySelectorAll("[data-options]").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation();

            const resumeId = button.dataset.options;
            const menu = document.getElementById("options-" + resumeId);

            document.querySelectorAll(".options-menu").forEach(function (item) {
                if (item !== menu) {
                    item.hidden = true;
                }
            });

            menu.hidden = !menu.hidden;
        });
    });

    document.querySelectorAll("[data-action]").forEach(function (button) {
        button.addEventListener("click", function () {
            const action = button.dataset.action;
            const resumeId = button.dataset.resume;
            const card = button.closest(".resume-card");

            if (action === "rename") {
                const title = card.querySelector(".resume-title");
                const newName = prompt(
                    "Enter a new resume name:",
                    title.textContent
                );

                if (newName && newName.trim()) {
                    title.textContent = newName.trim();
                }
            }

            if (action === "delete") {
                const confirmed = confirm(
                    "Are you sure you want to remove this resume card?"
                );

                if (confirmed) {
                    card.remove();
                }
            }

            const menu = document.getElementById("options-" + resumeId);

            if (menu) {
                menu.hidden = true;
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".resume-card-top")) {
            document.querySelectorAll(".options-menu").forEach(function (menu) {
                menu.hidden = true;
            });
        }
    });

});

