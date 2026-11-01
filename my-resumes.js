
const STORAGE_KEY = "resumeCraftResumes";

function currentUser() {
    const stored =
        sessionStorage.getItem("resumeCraftCurrentUser") ||
        sessionStorage.getItem("resumeDemoUser");

    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

function loadResumes() {
    const user = currentUser();
    const list = document.getElementById("resumeList");

    if (!user || !user.email) {
        list.innerHTML =
            "<p class='empty'>Please sign in to view your resumes.</p>";
        return;
    }

    const allResumes = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const userResumes = allResumes.filter(
        resume =>
            resume.userEmail &&
            resume.userEmail.toLowerCase() === user.email.toLowerCase()
    );

    list.innerHTML = "";

    if (userResumes.length === 0) {
        list.innerHTML = `
            <div class="empty">
                <h3>No resumes saved yet</h3>
                <p>Create your first resume to see it here.</p>
               <button> <a href="template.html" id="button">Choose a template</a></button>
            </div>`;
        return;
    }

    userResumes.forEach(resume => {
        const card = document.createElement("article");
        card.className = "resume-card";

        const title = document.createElement("h3");
        title.textContent = resume.title || "My Resume";

        const template = document.createElement("p");
        template.textContent =
            "Template: " + (resume.template || "blue-minimal");

        const updated = document.createElement("p");
        updated.textContent = "Last saved: " +
            (resume.updatedAt
                ? new Date(resume.updatedAt).toLocaleString()
                : "Unknown");

        const actions = document.createElement("div");
        actions.className = "actions";

        const openButton = document.createElement("button");
        openButton.className = "open-btn";
        openButton.textContent = "Open Resume";

        openButton.addEventListener("click", () => {
            localStorage.setItem(
                "resumeCraftPersonalDetails",
                JSON.stringify(resume.personal || {})
            );

            localStorage.setItem(
                "resumeCraftEducation",
                JSON.stringify(resume.education || {})
            );

            localStorage.setItem(
                "resumeCraftExperience",
                JSON.stringify(resume.experience || {})
            );

            localStorage.setItem(
                "resumeCraftCertificates",
                JSON.stringify(resume.certificates || {})
            );

            localStorage.setItem(
                "resumeCraftSelectedTemplate",
                resume.template || "blue-minimal"
            );

            sessionStorage.setItem(
                "resumeCraftEditingId",
                resume.id
            );

            window.location.href = "resume-preview.html";
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Delete "${resume.title || "My Resume"}"? This cannot be undone.`
            );

            if (!confirmed) return;

            const remaining = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            ).filter(item => item.id !== resume.id);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

            if (sessionStorage.getItem("resumeCraftEditingId") === resume.id) {
                sessionStorage.removeItem("resumeCraftEditingId");
            }

            loadResumes();
        });

        actions.append(openButton, deleteButton);
        card.append(title, template, updated, actions);
        list.appendChild(card);
    });
}

loadResumes();
