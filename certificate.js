
document.addEventListener("DOMContentLoaded", initCertificatePage);

function initCertificatePage() {
    const CERT_KEY = "resumeCraftCertificates";

    const $ = id => document.getElementById(id);

    const certificateList = $("certificateList");
    const languageList = $("languageList");

    if (!certificateList || !languageList) return;

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? {};
        } catch {
            return {};
        }
    }

    function text(data, ...keys) {
        if (!data || typeof data !== "object") return "";

        for (const key of keys) {
            const value = data[key];

            if (
                value !== undefined &&
                value !== null &&
                typeof value !== "object" &&
                String(value).trim() !== ""
            ) {
                return String(value);
            }
        }

        return "";
    }

    function array(data, ...keys) {
        if (Array.isArray(data)) return data;

        for (const key of keys) {
            if (Array.isArray(data?.[key])) return data[key];
        }

        return [];
    }

    function addLine(parent, value, bold = false) {
        if (!value) return;

        const p = document.createElement("p");
        p.textContent = value;

        if (bold) p.style.fontWeight = "bold";

        parent.appendChild(p);
    }

    function addBulletLines(parent, value) {
        if (!value) return;

        value.split(/\r?\n/).forEach(line => {
            if (!line.trim()) return;

            const p = document.createElement("p");
            p.textContent = line.trim().startsWith("•")
                ? line.trim()
                : "• " + line.trim();

            p.style.whiteSpace = "pre-wrap";
            parent.appendChild(p);
        });
    }

    function setSectionVisibility(id, hasContent) {
        const section = $(id);
        if (section) section.hidden = !hasContent;
    }

    // -------------------------------
    // CERTIFICATE CARD
    // -------------------------------

    function createCertificateCard(item = {}) {
        const card = document.createElement("div");
        card.className = "entry-card";

        card.innerHTML = `
            <div class="field">
                <label>Certificate Name</label>
                <input data-field="name" type="text"
                    placeholder="e.g. Java Programming">
            </div>

            <div class="field">
                <label>Issuing Organization</label>
                <input data-field="organization" type="text"
                    placeholder="e.g. Coursera">
            </div>

            <div class="field">
                <label>Issue Date</label>
                <input data-field="date" type="date">
            </div>

            <div class="field">
                <label>Description</label>
                <textarea data-field="description" rows="3"
                    placeholder="Describe your certification..."></textarea>
            </div>

            <button type="button" class="remove-entry-btn">
                Remove
            </button>
        `;

        card.querySelector('[data-field="name"]').value =
            item.name || "";

        card.querySelector('[data-field="organization"]').value =
            item.organization || "";

        card.querySelector('[data-field="date"]').value =
            item.date || "";

        card.querySelector('[data-field="description"]').value =
            item.description || "";

        card.querySelectorAll("input, textarea").forEach(field => {
            field.addEventListener("input", saveAll);
            field.addEventListener("change", saveAll);
        });

        card.querySelector(".remove-entry-btn").addEventListener("click", () => {
            card.remove();
            saveAll();
        });

        return card;
    }

    // -------------------------------
    // LANGUAGE CARD
    // -------------------------------

    function createLanguageCard(item = {}) {
        const card = document.createElement("div");
        card.className = "entry-card";

        card.innerHTML = `
            <div class="field">
                <label>Language</label>
                <input data-field="language" type="text"
                    placeholder="e.g. English">
            </div>

            <div class="field">
                <label>Proficiency</label>
                <select data-field="proficiency">
                    <option value="">Select proficiency</option>
                    <option>Native</option>
                    <option>Fluent</option>
                    <option>Advanced</option>
                    <option>Intermediate</option>
                    <option>Basic</option>
                </select>
            </div>

            <button type="button" class="remove-entry-btn">
                Remove
            </button>
        `;

        card.querySelector('[data-field="language"]').value =
            item.language || "";

        card.querySelector('[data-field="proficiency"]').value =
            item.proficiency || "";

        card.querySelectorAll("input, select").forEach(field => {
            field.addEventListener("input", saveAll);
            field.addEventListener("change", saveAll);
        });

        card.querySelector(".remove-entry-btn").addEventListener("click", () => {
            card.remove();
            saveAll();
        });

        return card;
    }

    // -------------------------------
    // COLLECT AND SAVE
    // -------------------------------

    function collectData() {
        const certificates = [
            ...certificateList.querySelectorAll(".entry-card")
        ].map(card => ({
            name: card.querySelector('[data-field="name"]').value.trim(),
            organization: card.querySelector('[data-field="organization"]').value.trim(),
            date: card.querySelector('[data-field="date"]').value,
            description: card.querySelector('[data-field="description"]').value.trim()
        })).filter(item =>
            item.name || item.organization || item.date || item.description
        );

        const languages = [
            ...languageList.querySelectorAll(".entry-card")
        ].map(card => ({
            language: card.querySelector('[data-field="language"]').value.trim(),
            proficiency: card.querySelector('[data-field="proficiency"]').value
        })).filter(item => item.language || item.proficiency);

        return { certificates, languages };
    }

    function saveAll() {
        const data = collectData();

        localStorage.setItem(CERT_KEY, JSON.stringify(data));

        renderCertificates(data);
        renderPreviousPages();

        if ($("saveMessage")) {
            $("saveMessage").textContent = "Changes saved automatically.";
        }
    }

    // -------------------------------
    // RENDER CERTIFICATES + LANGUAGES
    // -------------------------------

    function renderCertificates(data = read(CERT_KEY)) {
        const certOutput = $("pCertificates");
        const langOutput = $("pLanguages");

        certOutput.replaceChildren();
        langOutput.replaceChildren();

        const certificates = array(data, "certificates");

        certificates.forEach(item => {
            const entry = document.createElement("div");
            entry.className = "resume-entry";

            addLine(entry, text(item, "name", "certificateName"), true);
            addLine(entry, text(item, "organization", "issuer"));

            const rawDate = text(item, "date", "issueDate");
            if (rawDate) {
                const date = document.createElement("p");

                // Format YYYY-MM-DD without timezone conversion.
                const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                date.textContent = match
                    ? `${match[3]}/${match[2]}/${match[1]}`
                    : rawDate;

                entry.appendChild(date);
            }

            addLine(entry, text(item, "description"));

            if (entry.children.length) {
                certOutput.appendChild(entry);
            }
        });

        array(data, "languages").forEach(item => {
            const language = text(item, "language", "name");
            const proficiency = text(item, "proficiency", "level");

            if (!language && !proficiency) return;

            const li = document.createElement("li");
            li.textContent = [language, proficiency]
                .filter(Boolean)
                .join(" — ");

            langOutput.appendChild(li);
        });

        setSectionVisibility(
            "certificatesBlock",
            certOutput.children.length > 0
        );

        setSectionVisibility(
            "languagesBlock",
            langOutput.children.length > 0
        );
    }

    // -------------------------------
    // RENDER PREVIOUS PAGES
    // -------------------------------

    function renderPreviousPages() {
        const personal = read("resumeCraftPersonalDetails");
        const education = read("resumeCraftEducation");
        const experience = read("resumeCraftExperience");

        // Personal details
        const name = text(personal,
            "fullName", "name", "firstName");

        const title = text(personal,
            "jobTitle", "title", "profession", "careerTitle");

        const email = text(personal, "email");
        const phone = text(personal, "phone", "mobile", "phoneNumber");
        const city = text(personal, "city", "location", "address");
        const website = text(personal,
            "website", "linkedin", "portfolio");

        const summary = text(personal,
            "summary", "professionalSummary", "objective", "careerObjective");

        if (name) $("pName").textContent = name;
        if (title) $("pTitle").textContent = title;

        const contact = [email, phone, city].filter(Boolean).join(" · ");
        if (contact) $("pContact").textContent = contact;

        $("pWebsite").textContent = website;

        if (summary) {
            $("pSummary").textContent = summary;
            setSectionVisibility("summaryBlock", true);
        }

        // Photo: supports a data URL saved in localStorage.
        const photoValue = text(personal,
            "photo", "photoData", "profilePhoto", "image");

        if (photoValue && $("resumePhoto")) {
            $("resumePhoto").src = photoValue;
            $("resumePhoto").hidden = false;
        }

        // Education
        const eduOutput = $("pEducation");
        eduOutput.replaceChildren();

        let eduItems = array(education,
            "education", "educationList", "entries");

        if (!eduItems.length &&
            (education.degree || education.institution ||
             education.school || education.qualification)) {
            eduItems = [education];
        }

        eduItems.forEach(item => {
            addLine(eduOutput,
                text(item, "degree", "qualification", "standard"), true);

            addLine(eduOutput,
                text(item, "institution", "school", "college", "university"));

            const start = text(item, "startDate", "fromDate", "startYear");
            const end = text(item, "endDate", "completionDate", "endYear", "year");

            addLine(eduOutput, [start, end].filter(Boolean).join(" – "));

            const marks = text(item, "cgpa", "gpa", "marks", "percentage");
            addLine(eduOutput, marks ? `CGPA / Marks: ${marks}` : "");
        });

        setSectionVisibility(
            "educationBlock",
            eduOutput.children.length > 0
        );

        // Experience
        const expOutput = $("pExperience");
        expOutput.replaceChildren();

        const expItems = array(experience,
            "experiences", "experience", "entries");

        expItems.forEach(item => {
            addLine(expOutput,
                text(item, "jobTitle", "title", "position"), true);

            addLine(expOutput, [
                text(item, "company", "organization"),
                text(item, "location")
            ].filter(Boolean).join(" · "));

            addLine(expOutput, [
                text(item, "startDate"),
                text(item, "endDate")
            ].filter(Boolean).join(" – "));

            addBulletLines(expOutput,
                text(item, "description", "responsibilities"));
        });

        setSectionVisibility(
            "experienceBlock",
            expOutput.children.length > 0
        );

        // Skills
        const skillsOutput = $("pSkills");
        skillsOutput.replaceChildren();

        const skillGroups = [
            ["Technical Skills", text(experience, "technicalSkills", "technical")],
            ["Soft Skills", text(experience, "softSkills", "soft")],
            ["Projects", text(experience, "projects", "projectDetails")]
        ];

        skillGroups.forEach(([label, value]) => {
            if (!value) return;

            const li = document.createElement("li");
            li.textContent = `${label}: ${value}`;
            li.style.whiteSpace = "pre-wrap";
            skillsOutput.appendChild(li);
        });

        setSectionVisibility(
            "skillsBlock",
            skillsOutput.children.length > 0
        );
    }

    // -------------------------------
    // ADD BUTTONS
    // -------------------------------

    $("addCertificateBtn").addEventListener("click", () => {
        certificateList.appendChild(createCertificateCard());
    });

    $("addLanguageBtn").addEventListener("click", () => {
        languageList.appendChild(createLanguageCard());
    });

    // -------------------------------
    // RESTORE SAVED DATA
    // -------------------------------

    function restore() {
        const data = read(CERT_KEY);

        certificateList.replaceChildren();
        languageList.replaceChildren();

        const certificates = array(data, "certificates");
        const languages = array(data, "languages");

        if (certificates.length) {
            certificates.forEach(item => {
                certificateList.appendChild(createCertificateCard(item));
            });
        } else {
            certificateList.appendChild(createCertificateCard());
        }

        if (languages.length) {
            languages.forEach(item => {
                languageList.appendChild(createLanguageCard(item));
            });
        } else {
            languageList.appendChild(createLanguageCard());
        }

        renderPreviousPages();
        renderCertificates(data);
    }

    // -------------------------------
    // FINISH AND PREVIEW
    // -------------------------------

    $("previewBtn").addEventListener("click", () => {
        saveAll();
        window.location.href = "resume-preview.html";
    });

    $("printBtn")?.addEventListener("click", () => {
        window.print();
    });

    restore();
}




document.addEventListener("DOMContentLoaded", function () {
    const photoInput = document.getElementById("profilePhoto");
    const savedPhoto = localStorage.getItem("resumeCraftProfilePhoto");

    // Show the saved photo in the current page's preview
    function displayPhoto(photo) {
        const photoElements = document.querySelectorAll(
            "#resumePhoto, .resume-photo"
        );

        photoElements.forEach(function (img) {
            img.src = photo;
            img.style.display = "block";
        });
    }

    if (savedPhoto) {
        displayPhoto(savedPhoto);
    }

    // Save a newly uploaded photo for all pages
    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const file = this.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image.");
                this.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const imageData = event.target.result;

                try {
                    localStorage.setItem(
                        "resumeCraftProfilePhoto",
                        imageData
                    );

                    displayPhoto(imageData);
                } catch (error) {
                    alert("The image is too large to save. Please choose a smaller photo.");
                }
            };

            reader.readAsDataURL(file);
        });
    }
});
