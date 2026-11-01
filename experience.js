
document.addEventListener("DOMContentLoaded", function () {

    const EXPERIENCE_KEY = "resumeCraftExperience";
    const PERSONAL_KEY = "resumeCraftPersonalDetails";
    const EDUCATION_KEY = "resumeCraftEducation";

    const experienceList = document.getElementById("certificateList");
    const addBtn = document.getElementById("addCertificateBtn");
    const nextBtn = document.getElementById("previewBtn");
    const saveMessage = document.getElementById("saveMessage");

    const technicalSkills = document.getElementById("technicalSkills");
    const softSkills = document.getElementById("softSkills");
    const projects = document.getElementById("projects");

    // Read saved data safely
    function readData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch {
            return {};
        }
    }

    // Add text safely to an element
    function addText(parent, tag, value) {
        if (!value) return;

        const element = document.createElement(tag);
        element.textContent = value;
        parent.appendChild(element);
    }

    // ----------------------------------------
    // PERSONAL DETAILS PREVIEW
    // ----------------------------------------

    function renderPersonalDetails() {

        const data = readData(PERSONAL_KEY);

        const name = data.name || data.fullName || data.fullname;
        const title = data.jobTitle || data.title || data.profession;
        const email = data.email || "";
        const phone = data.phone || data.mobile || "";
        const location = data.location || data.address || "";
        const website = data.website || data.portfolio || "";
        const linkedin = data.linkedin || "";
        const summary = data.summary || data.professionalSummary || "";

        const nameEl = document.getElementById("pName");
        const titleEl = document.getElementById("pTitle");
        const contactEl = document.getElementById("pContact");
        const websiteEl = document.getElementById("pWebsite");
        const summaryEl = document.getElementById("pSummary");

        if (nameEl && name) nameEl.textContent = name;
        if (titleEl && title) titleEl.textContent = title;

        const contacts = [email, phone, location].filter(Boolean);

        if (contactEl && contacts.length) {
            contactEl.textContent = contacts.join(" · ");
        }

        if (websiteEl) {
            websiteEl.textContent = [website, linkedin]
                .filter(Boolean)
                .join(" · ");
        }

        if (summaryEl && summary) {
            summaryEl.textContent = summary;
            summaryEl.classList.remove("placeholder");
        }

        const photoEl = document.getElementById("resumePhoto");

        const photo =
            data.photo ||
            data.photoUrl ||
            data.profilePhoto ||
            localStorage.getItem("resumeCraftProfilePhoto");

        if (photoEl && photo) {
            photoEl.src = photo;
            photoEl.hidden = false;
        }
    }

    // ----------------------------------------
    // EDUCATION PREVIEW
    // ----------------------------------------

    function renderEducation() {

        const output = document.getElementById("pEducation");
        const block = document.getElementById("educationBlock");

        if (!output) return;

        const data = readData(EDUCATION_KEY);

        let entries = [];

        if (Array.isArray(data)) {
            entries = data;
        } else if (Array.isArray(data.education)) {
            entries = data.education;
        } else if (Array.isArray(data.educationList)) {
            entries = data.educationList;
        } else if (data.degree || data.qualification || data.institution) {
            entries = [data];
        }

        output.replaceChildren();

        entries.forEach(function (item) {

            const entry = document.createElement("div");
            entry.className = "resume-entry";

            const degree =
                item.degree ||
                item.qualification ||
                item.standard ||
                item.course ||
                "";

            const institution =
                item.institution ||
                item.school ||
                item.college ||
                item.university ||
                "";

            const grade =
                item.cgpa ||
                item.percentage ||
                item.grade ||
                item.mark ||
                "";

            const years = [
                item.startYear,
                item.endYear
            ].filter(Boolean).join("–");

            addText(entry, "h4", degree);
            addText(entry, "p", institution);

            addText(
                entry,
                "p",
                [grade, years].filter(Boolean).join(" · ")
            );

            output.appendChild(entry);
        });

        if (block) {
            block.hidden = entries.length === 0;
        }
    }

    // ----------------------------------------
    // EXPERIENCE CARD
    // ----------------------------------------

    function createExperienceCard(item = {}) {

        const card = document.createElement("div");
        card.className = "entry-card";

        card.innerHTML = `
            <div class="field">
                <label>Job Title/Role</label>
                <input
                    type="text"
                    data-field="jobTitle"
                    placeholder="e.g. Java Developer">
            </div>

            <div class="field">
                <label>Company/Organization</label>
                <input
                    type="text"
                    data-field="company"
                    placeholder="e.g. ZOHO">
            </div>

            <div class="field">
                <label>Location</label>
                <input
                    type="text"
                    data-field="location"
                    placeholder="e.g. Chennai">
            </div>

            <div class="field">
                <label>Start Date</label>
                <input
                    type="text"
                    data-field="startDate">
            </div>

            <div class="field">
                <label>End Date</label>
                <input
                    type="text"
                    data-field="endDate"
                    placeholder="e.g. Feb 2026 or Present">
            </div>

            <div class="field">
                <label>Responsibilities / Achievements</label>
                <textarea
                    rows="4"
                    data-field="description"
                    placeholder="Describe your responsibilities and achievements."></textarea>
            </div>

            <button type="button" class="remove-entry-btn">
                Remove
            </button>
        `;

        card.querySelectorAll("[data-field]").forEach(function (field) {

            field.value = item[field.dataset.field] || "";

            field.addEventListener("input", function () {
                saveExperience();
                renderExperience();
            });
        });

        card.querySelector(".remove-entry-btn")
            .addEventListener("click", function () {

                card.remove();

                if (!experienceList.querySelector(".entry-card")) {
                    createExperienceCard();
                }

                saveExperience();
                renderExperience();
            });

        experienceList.appendChild(card);
    }

    // ----------------------------------------
    // COLLECT EXPERIENCE DATA
    // ----------------------------------------

    function collectExperiences() {

        const experiences = [];

        experienceList.querySelectorAll(".entry-card")
            .forEach(function (card) {

                const item = {};

                card.querySelectorAll("[data-field]")
                    .forEach(function (field) {

                        item[field.dataset.field] =
                            field.value.trim();
                    });

                if (Object.values(item).some(Boolean)) {
                    experiences.push(item);
                }
            });

        return experiences;
    }

    // ----------------------------------------
    // COLLECT SKILLS DATA
    // ----------------------------------------

    function collectSkills() {

        return {
            technicalSkills: technicalSkills
                ? technicalSkills.value.trim()
                : "",

            softSkills: softSkills
                ? softSkills.value.trim()
                : "",

            projects: projects
                ? projects.value.trim()
                : ""
        };
    }

    // ----------------------------------------
    // SAVE DATA
    // ----------------------------------------

    function saveExperience(showMessage = false) {

        const data = {
            experiences: collectExperiences(),
            ...collectSkills()
        };

        localStorage.setItem(
            EXPERIENCE_KEY,
            JSON.stringify(data)
        );

        if (showMessage && saveMessage) {
            saveMessage.textContent =
                "Experience and skills saved successfully!";
        }

        return data;
    }

    // ----------------------------------------
    // LIVE EXPERIENCE AND SKILLS PREVIEW
    // ----------------------------------------

    function renderExperience() {

        const data = {
            experiences: collectExperiences(),
            ...collectSkills()
        };

        const output = document.getElementById("pExperience");
        const skillsOutput = document.getElementById("pSkills");

        const experienceBlock =
            document.getElementById("experienceBlock");

        const skillsBlock =
            document.getElementById("skillsBlock");

        // Experience preview
        if (output) {

            output.replaceChildren();

            data.experiences.forEach(function (item) {

                const entry = document.createElement("div");
                entry.className = "resume-entry";

                addText(entry, "h4", item.jobTitle);
                addText(entry, "p", item.company);

                addText(
                    entry,
                    "p",
                    [
                        item.location,
                        item.startDate,
                        item.endDate
                    ].filter(Boolean).join(" · ")
                );

                if (item.description) {

                    const description =
                        document.createElement("div");

                    description.className = "resume-bullets";

                    item.description.split("\n").forEach(function (line) {

                        const cleanLine = line
                            .replace(/^\s*•\s*/, "")
                            .trim();

                        if (cleanLine) {
                            addText(
                                description,
                                "p",
                                "• " + cleanLine
                            );
                        }
                    });

                    entry.appendChild(description);
                }

                output.appendChild(entry);
            });

            if (experienceBlock) {
                experienceBlock.hidden =
                    data.experiences.length === 0;
            }
        }

        // Skills preview
        if (skillsOutput) {

            skillsOutput.replaceChildren();

            const skills = [
                ...data.technicalSkills.split(/[,;\n]+/),
                ...data.softSkills.split(/[,;\n]+/)
            ]
                .map(skill => skill.trim())
                .filter(Boolean);

            skills.forEach(function (skill) {
                addText(skillsOutput, "li", skill);
            });

            if (skillsBlock) {
                skillsBlock.hidden = skills.length === 0;
            }
        }

        // Project preview
        if (output && data.projects) {

            addText(output, "h3", "PROJECTS");

            data.projects.split("\n").forEach(function (line) {

                const cleanLine = line
                    .replace(/^\s*•\s*/, "")
                    .trim();

                if (cleanLine) {
                    addText(output, "p", "• " + cleanLine);
                }
            });
        }
    }

    // ----------------------------------------
    // SKILLS INPUT LISTENERS
    // ----------------------------------------

    [technicalSkills, softSkills, projects]
        .filter(Boolean)
        .forEach(function (field) {

            field.addEventListener("input", function () {
                saveExperience();
                renderExperience();
            });
        });

    // ----------------------------------------
    // RESTORE SAVED DATA
    // ----------------------------------------

    function restoreExperience() {

        const data = readData(EXPERIENCE_KEY);

        const experiences = Array.isArray(data.experiences)
            ? data.experiences
            : [];

        experienceList.replaceChildren();

        if (experiences.length > 0) {

            experiences.forEach(function (item) {
                createExperienceCard(item);
            });

        } else {

            createExperienceCard();
        }

        if (technicalSkills) {
            technicalSkills.value = data.technicalSkills || "";
        }

        if (softSkills) {
            softSkills.value = data.softSkills || "";
        }

        if (projects) {
            projects.value = data.projects || "";
        }
    }

    // ----------------------------------------
    // ADD EXPERIENCE BUTTON
    // ----------------------------------------

    if (addBtn) {

        addBtn.addEventListener("click", function () {

            createExperienceCard();

            saveExperience();
        });
    }

    // ----------------------------------------
    // SAVE & NEXT
    // ----------------------------------------

    if (nextBtn) {

        nextBtn.addEventListener("click", function () {

            saveExperience(true);

            window.location.href = "certificate.html";
        });
    }

    // ----------------------------------------
    // INITIALIZE
    // ----------------------------------------

    restoreExperience();

    renderPersonalDetails();
    renderEducation();
    renderExperience();

});
