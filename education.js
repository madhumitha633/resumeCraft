
document.addEventListener("DOMContentLoaded", initEducationPage);

function initEducationPage() {
    const EDUCATION_KEY = "resumeCraftEducation";

    const $ = id => document.getElementById(id);

    const educationList = $("certificateList");

    if (!educationList) return;

    // ==============================
    // READ LOCAL STORAGE
    // ==============================

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? {};
        } catch {
            return {};
        }
    }

    // ==============================
    // HELPER FUNCTIONS
    // ==============================

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
            if (Array.isArray(data?.[key])) {
                return data[key];
            }
        }

        return [];
    }

    function addLine(parent, value, bold = false) {
        if (!value) return;

        const p = document.createElement("p");
        p.textContent = value;

        if (bold) {
            p.style.fontWeight = "bold";
        }

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

        if (section) {
            section.hidden = !hasContent;
        }
    }

    // ==============================
    // EDUCATION CARD
    // ==============================

    function createEducationCard(item = {}) {
        const card = document.createElement("div");

        card.className = "entry-card";

        card.innerHTML = `
            <div class="item-header">
                <h3>Education</h3>

                
            </div>

            <div class="field-grid">

                <div class="field">
                    <label>Degree</label>

                    <input
                        data-field="degree"
                        type="text"
                        placeholder="e.g. B.Tech, HSC, SSLC">
                </div>

                <div class="field">
                    <label>Institution</label>

                    <input
                        data-field="institution"
                        type="text"
                        placeholder="e.g. SRM University">
                </div>

                <div class="field">
                    <label>CGPA / Marks</label>

                    <input
                        data-field="grade"
                        type="text"
                        placeholder="e.g. 8.7 CGPA or 85%">
                </div>

                <div class="field">
                    <label>Start Year</label>

                    <input
                        data-field="startYear"
                        type="number"
                        placeholder="e.g. 2023">
                </div>

                <div class="field">
                    <label>End Year</label>

                    <input
                        data-field="endYear"
                        type="number"
                        placeholder="e.g. 2027">
                    
   
                        
                </div>
           </div>
            <button
                    type="button"
                    class="remove-entry-btn">
                    Remove
                </button>
        `;

        // Restore saved values

        card.querySelector('[data-field="degree"]').value =
            item.degree || item.qualification || "";

        card.querySelector('[data-field="institution"]').value =
            item.institution || item.school || "";

        card.querySelector('[data-field="grade"]').value =
            item.grade || item.cgpa || item.marks || "";

        card.querySelector('[data-field="startYear"]').value =
            item.startYear || item.startDate || "";

        card.querySelector('[data-field="endYear"]').value =
            item.endYear ||
            item.endDate ||
            item.completionDate ||
            "";

        // Automatically save when typing

        card.querySelectorAll("input").forEach(field => {
            field.addEventListener("input", saveAll);
            field.addEventListener("change", saveAll);
        });

        // Remove education card

        card.querySelector(".remove-entry-btn")
            .addEventListener("click", () => {

                card.remove();

                // Keep one empty card available

                if (!educationList.querySelector(".entry-card")) {
                    educationList.appendChild(
                        createEducationCard()
                    );
                }

                saveAll();
            });

        return card;
    }

    // ==============================
    // COLLECT EDUCATION DATA
    // ==============================

    function collectEducation() {
        return [
            ...educationList.querySelectorAll(".entry-card")
        ].map(card => ({
            degree: card.querySelector(
                '[data-field="degree"]'
            ).value.trim(),

            institution: card.querySelector(
                '[data-field="institution"]'
            ).value.trim(),

            grade: card.querySelector(
                '[data-field="grade"]'
            ).value.trim(),

            startYear: card.querySelector(
                '[data-field="startYear"]'
            ).value,

            endYear: card.querySelector(
                '[data-field="endYear"]'
            ).value
        })).filter(item =>
            item.degree ||
            item.institution ||
            item.grade ||
            item.startYear ||
            item.endYear
        );
    }

    // ==============================
    // SAVE EDUCATION
    // ==============================

    function saveAll() {
        const education = collectEducation();

        localStorage.setItem(
            EDUCATION_KEY,
            JSON.stringify(education)
        );

        renderEducationPreview(education);

        renderPreviousPages();

        if ($("saveMessage")) {
            $("saveMessage").textContent =
                "Education changes saved automatically.";
        }
    }

    // ==============================
    // RENDER EDUCATION PREVIEW
    // ==============================

    function renderEducationPreview(data = read(EDUCATION_KEY)) {
        const output = $("pEducation");

        if (!output) return;

        output.replaceChildren();

        const education = array(
            data,
            "education",
            "educationList",
            "entries"
        );

        education.forEach(item => {
            const entry = document.createElement("div");

            entry.className = "resume-entry";

            const degree = text(
                item,
                "degree",
                "qualification",
                "standard"
            );

            const institution = text(
                item,
                "institution",
                "school",
                "college",
                "university"
            );

            const start = text(
                item,
                "startYear",
                "startDate",
                "fromDate"
            );

            const end = text(
                item,
                "endYear",
                "endDate",
                "completionDate",
                "year"
            );

            const years = [start, end]
                .filter(Boolean)
                .join(" – ");

            const grade = text(
                item,
                "grade",
                "cgpa",
                "gpa",
                "marks",
                "percentage"
            );

            addLine(entry, degree, true);
            addLine(entry, institution);
            addLine(entry, years);

            if (grade) {
                addLine(entry, `CGPA / Marks: ${grade}`);
            }

            if (entry.children.length) {
                output.appendChild(entry);
            }
        });

        setSectionVisibility(
            "educationBlock",
            output.children.length > 0
        );
    }

    // ==============================
    // RENDER PREVIOUS PAGE DATA
    // ==============================

    function renderPreviousPages() {
        const personal = read("resumeCraftPersonalDetails");
        const experience = read("resumeCraftExperience");
        const certificates = read("resumeCraftCertificates");

        // PERSONAL DETAILS

        const name = text(
            personal,
            "fullName",
            "name",
            "firstName"
        );

        const title = text(
            personal,
            "jobTitle",
            "title",
            "profession",
            "careerTitle"
        );

        const email = text(personal, "email");

        const phone = text(
            personal,
            "phone",
            "mobile",
            "phoneNumber"
        );

        const city = text(
            personal,
            "city",
            "location",
            "address"
        );

        const website = text(
            personal,
            "website",
            "linkedin",
            "portfolio"
        );

        const summary = text(
            personal,
            "summary",
            "professionalSummary",
            "objective",
            "careerObjective"
        );

        if ($("pName")) {
            $("pName").textContent = name || "Your Name";
        }

        if ($("pTitle")) {
            $("pTitle").textContent =
                title || "Professional Title";
        }

        if ($("pContact")) {
            $("pContact").textContent =
                [email, phone, city]
                    .filter(Boolean)
                    .join(" · ") ||
                "email@example.com · Phone · City";
        }

        if ($("pWebsite")) {
            $("pWebsite").textContent = website;
        }

        if ($("pSummary")) {
            $("pSummary").textContent =
                summary ||
                "Your professional summary will appear here.";
        }

        // PROFILE PHOTO

        const photoValue = text(
            personal,
            "photo",
            "photoData",
            "profilePhoto",
            "image"
        ) || localStorage.getItem("resumeCraftProfilePhoto");

        if ($("resumePhoto")) {
            if (photoValue) {
                $("resumePhoto").src = photoValue;
                $("resumePhoto").hidden = false;
            } else {
                $("resumePhoto").hidden = true;
            }
        }

        // EXPERIENCE

        const expOutput = $("pExperience");

        if (expOutput) {
            expOutput.replaceChildren();

            const expItems = array(
                experience,
                "experiences",
                "experience",
                "entries"
            );

            expItems.forEach(item => {
                const entry = document.createElement("div");

                entry.className = "resume-entry";

                addLine(
                    entry,
                    text(
                        item,
                        "jobTitle",
                        "title",
                        "position",
                        "role"
                    ),
                    true
                );

                addLine(
                    entry,
                    [
                        text(
                            item,
                            "company",
                            "organization",
                            "companyName"
                        ),
                        text(item, "location")
                    ].filter(Boolean).join(" · ")
                );

                addLine(
                    entry,
                    [
                        text(item, "startDate", "startYear"),
                        text(item, "endDate", "endYear")
                    ].filter(Boolean).join(" – ")
                );

                addBulletLines(
                    entry,
                    text(item, "description", "responsibilities")
                );

                if (entry.children.length) {
                    expOutput.appendChild(entry);
                }
            });

            setSectionVisibility(
                "experienceBlock",
                expOutput.children.length > 0
            );
        }

        // SKILLS

        const skillsOutput = $("pSkills");

        if (skillsOutput) {
            skillsOutput.replaceChildren();

            function toList(value) {
                if (Array.isArray(value)) {
                    return value;
                }

                if (typeof value === "string") {
                    return value
                        .split(",")
                        .map(item => item.trim())
                        .filter(Boolean);
                }

                return [];
            }

            const technical = toList(
                experience.technicalSkills ||
                experience.technical
            );

            const soft = toList(
                experience.softSkills ||
                experience.soft
            );

            [...technical, ...soft].forEach(skill => {
                const li = document.createElement("li");

                li.textContent = skill;

                skillsOutput.appendChild(li);
            });

            setSectionVisibility(
                "skillsBlock",
                skillsOutput.children.length > 0
            );
        }

        // CERTIFICATES

        const certOutput = $("pCertificates");

        if (certOutput) {
            certOutput.replaceChildren();

            const certItems = array(
                certificates,
                "certificates"
            );

            certItems.forEach(item => {
                const entry = document.createElement("div");

                entry.className = "resume-entry";

                addLine(
                    entry,
                    text(
                        item,
                        "name",
                        "certificateName"
                    ),
                    true
                );

                addLine(
                    entry,
                    text(
                        item,
                        "organization",
                        "issuer"
                    )
                );

                addLine(
                    entry,
                    text(
                        item,
                        "date",
                        "issueDate"
                    )
                );

                addLine(
                    entry,
                    text(item, "description")
                );

                if (entry.children.length) {
                    certOutput.appendChild(entry);
                }
            });

            setSectionVisibility(
                "certificatesBlock",
                certOutput.children.length > 0
            );
        }

        // LANGUAGES

        const langOutput = $("pLanguages");

        if (langOutput) {
            langOutput.replaceChildren();

            array(certificates, "languages").forEach(item => {
                const language = text(
                    item,
                    "language",
                    "name"
                );

                const proficiency = text(
                    item,
                    "proficiency",
                    "level"
                );

                if (!language && !proficiency) return;

                const li = document.createElement("li");

                li.textContent = [
                    language,
                    proficiency
                ].filter(Boolean).join(" — ");

                langOutput.appendChild(li);
            });

            setSectionVisibility(
                "languagesBlock",
                langOutput.children.length > 0
            );
        }
    }

    // ==============================
    // ADD EDUCATION BUTTON
    // ==============================

    $("addCertificateBtn")?.addEventListener("click", () => {
        educationList.appendChild(
            createEducationCard()
        );

        saveAll();
    });

    // ==============================
    // RESTORE SAVED EDUCATION
    // ==============================

    function restore() {
        const data = read(EDUCATION_KEY);

        let education = array(
            data,
            "education",
            "educationList",
            "entries"
        );

        // Support older saved education objects

        if (
            !education.length &&
            !Array.isArray(data) &&
            (
                data.degree ||
                data.institution ||
                data.school ||
                data.qualification
            )
        ) {
            education = [data];
        }

        educationList.replaceChildren();

        if (education.length) {
            education.forEach(item => {
                educationList.appendChild(
                    createEducationCard(item)
                );
            });
        } else {
            educationList.appendChild(
                createEducationCard()
            );
        }

        renderEducationPreview(education);

        renderPreviousPages();
    }

    // ==============================
    // SAVE & NEXT
    // ==============================

    $("previewBtn")?.addEventListener("click", () => {
        saveAll();

        window.location.href = "certificate.html";
    });

    // ==============================
    // PRINT / SAVE PDF
    // ==============================

    $("printBtn")?.addEventListener("click", () => {
        saveAll();

        window.print();
    });

    // ==============================
    // INITIALIZE
    // ==============================

    restore();
}
