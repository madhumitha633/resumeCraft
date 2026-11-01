const $ = id => document.getElementById(id);

// Get the selected template from the previous page
const templateId =
    localStorage.getItem("resumeCraftSelectedTemplate")
    || "blue-minimal";

// Apply the selected template to the right-side preview
const paper = $("resumePaper");

if (paper) {
    paper.dataset.template = templateId;
    paper.classList.add(templateId);
}

// Show the photo option only for templates that support photos
const photoTemplates = [
    "brown-modern",
    "yellow-sidebar"
];

const photoSection = $("photoSection");

if (photoSection) {
    photoSection.hidden = !photoTemplates.includes(templateId);
}








document.addEventListener("DOMContentLoaded", function () {
    const $ = id => document.getElementById(id);

    // ========================================
    // 1. GET HTML ELEMENTS
    // ========================================
    const resumePaper = $("resumePaper");
    const resumeForm = $("resumeForm");
    const nextBtn = $("nextBtn");
    const printBtn = $("printBtn");
    const saveMessage = $("saveMessage");

    const fieldIds = [
        "fullName",
        "jobTitle",
        "email",
        "phone",
        "location",
        "website",
        "summary"
    ];

    // ========================================
    // 2. RESTORE SELECTED TEMPLATE
    // ========================================
    const templateId =
        localStorage.getItem("resumeCraftSelectedTemplate") ||
        "blue-minimal";

    if (resumePaper) {
        resumePaper.dataset.template = templateId;

        // Supports CSS written using either classes
        // or data-template attributes.
        [
            "blue-minimal",
            "black-white",
            "brown-modern",
            "ats-clean",
            "yellow-sidebar"
        ].forEach(id => resumePaper.classList.remove(id));

        resumePaper.classList.add(templateId);
    }

    // Show photo upload only for supported templates.
    const photoTemplates = ["brown-modern", "yellow-sidebar"];

    if ($("photoSection")) {
        $("photoSection").hidden =
            !photoTemplates.includes(templateId);
    }

    // ========================================
    // 3. RESTORE SAVED PERSONAL DETAILS
    // ========================================
    let personalData = {};
    let photoData = "";

    try {
        personalData = JSON.parse(
            localStorage.getItem("resumeCraftPersonalDetails") || "{}"
        );
    } catch (error) {
        console.error("Could not load personal details:", error);
    }

    fieldIds.forEach(id => {
        const input = $(id);

        if (input && personalData[id] !== undefined) {
            input.value = personalData[id];
        }
    });

    photoData = personalData.photoData || "";

    if (photoData) {
        if ($("photoPreview")) {
            $("photoPreview").src = photoData;
            $("photoPreview").hidden = false;
        }

        if ($("resumePhoto")) {
            $("resumePhoto").src = photoData;
            $("resumePhoto").hidden = false;
        }
    }

    // ========================================
    // 4. SAFE TEXT HELPERS
    // ========================================
    function setText(id, value, fallback = "") {
        const element = $(id);

        if (element) {
            element.textContent = value || fallback;
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    // ========================================
    // 5. SAVE PERSONAL DETAILS
    // ========================================
    function getPersonalDetails() {
        const details = {};

        fieldIds.forEach(id => {
            if ($(id)) {
                details[id] = $(id).value.trim();
            }
        });

        details.photoData = photoData;

        return details;
    }

    function savePersonalDetails(showMessage = false) {
        try {
            const details = getPersonalDetails();

            localStorage.setItem(
                "resumeCraftPersonalDetails",
                JSON.stringify(details)
            );

            if (showMessage && saveMessage) {
                saveMessage.textContent =
                    "Your personal details have been saved!";
            }

            return true;
        } catch (error) {
            console.error("Could not save resume:", error);

            if (saveMessage) {
                saveMessage.textContent =
                    "Unable to save. Check your browser storage.";
            }

            return false;
        }
    }

    // ========================================
    // 6. RENDER SAVED LISTS IN THE PREVIEW
    // ========================================
    function readArray(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function renderEntries(targetId, items, formatter, placeholder) {
        const target = $(targetId);

        if (!target) return;

        target.replaceChildren();

        const validItems = items.filter(item =>
            Object.values(item).some(value =>
                String(value ?? "").trim() !== ""
            )
        );

        if (!validItems.length) {
            const p = document.createElement("p");
            p.className = "placeholder";
            p.textContent = placeholder;
            target.appendChild(p);
            return;
        }

        validItems.forEach(item => {
            const wrapper = document.createElement("div");
            wrapper.className = "resume-entry";
            wrapper.innerHTML = formatter(item);
            target.appendChild(wrapper);
        });
    }

    // ========================================
    // 7. REFRESH THE LIVE RESUME PREVIEW
    // ========================================
    function renderPreview() {
        const details = getPersonalDetails();

        setText("pName", details.fullName, "Your Name");
        setText("pTitle", details.jobTitle, "Professional Title");

        const contact = [
            details.email,
            details.phone,
            details.location
        ].filter(Boolean);

        setText(
            "pContact",
            contact.join(" · "),
            "email@example.com · Phone · City"
        );

        setText("pWebsite", details.website);

        setText(
            "pSummary",
            details.summary,
            "Your professional summary will appear here."
        );

        if ($("pSummary")) {
            $("pSummary").classList.toggle(
                "placeholder",
                !details.summary
            );
        }

        if ($("resumePhoto")) {
            $("resumePhoto").src = photoData || "";
            $("resumePhoto").hidden = !photoData;
        }

        // Education page saves to resumeCraftEducation.
        const education = readArray("resumeCraftEducation");

        renderEntries(
            "pEducation",
            education,
            item => `
                <div class="resume-entry-top">
                    <strong>${escapeHTML(
                        item.degree || item.qualification || "Qualification"
                    )}</strong>
                    <span>${escapeHTML(
                        item.startDate
                            ? item.startDate + " – " +
                              (item.currentlyStudying
                                  ? "Present"
                                  : item.endDate || "")
                            : item.year || ""
                    )}</span>
                </div>
                <div class="resume-entry-sub">${escapeHTML(
                    item.institution || item.school || ""
                )}</div>
                ${item.fieldOfStudy
                    ? `<p>${escapeHTML(item.fieldOfStudy)}</p>` : ""}
                ${item.location
                    ? `<p>${escapeHTML(item.location)}</p>` : ""}
                ${item.grade
                    ? `<p>${escapeHTML(item.grade)}</p>` : ""}
                ${item.description || item.details
                    ? `<p>${escapeHTML(item.description || item.details)}</p>`
                    : ""}
            `,
            "Add your education details here."
        );

        // Experience page may use either a separate key
        // or the shared resume sections key.
        const savedSections = (() => {
            try {
                return JSON.parse(
                    localStorage.getItem("resumeCraftResumeSections") || "{}"
                );
            } catch {
                return {};
            }
        })();

        const experience = readArray("resumeCraftExperience");
        const experienceItems = experience.length
            ? experience
            : (savedSections.experience || []);

        renderEntries(
            "pExperience",
            experienceItems,
            item => `
                <div class="resume-entry-top">
                    <strong>${escapeHTML(
                        item.role || item.jobTitle || item.position || "Job title"
                    )}</strong>
                    <span>${escapeHTML(
                        item.dates ||
                        [item.startDate, item.endDate].filter(Boolean).join(" – ")
                    )}</span>
                </div>
                <div class="resume-entry-sub">${escapeHTML(
                    item.company || item.employer || ""
                )}</div>
                ${item.location
                    ? `<p>${escapeHTML(item.location)}</p>` : ""}
                ${item.details || item.description
                    ? `<p>${escapeHTML(item.details || item.description)}</p>`
                    : ""}
            `,
            "Add your experience details here."
        );

        // Skills
        const savedSkills = readArray("resumeCraftSkills");
        const skills = savedSkills.length
            ? savedSkills
            : (savedSections.skill || savedSections.skills || []);

        const skillList = $("pSkills");

        if (skillList) {
            skillList.replaceChildren();

            const skillNames = skills
                .map(item => typeof item === "string"
                    ? item
                    : item.name || item.skill || "")
                .filter(Boolean);

            if (!skillNames.length) {
                const li = document.createElement("li");
                li.textContent = "Your skills will appear here.";
                skillList.appendChild(li);
            } else {
                skillNames.forEach(name => {
                    const li = document.createElement("li");
                    li.textContent = name;
                    skillList.appendChild(li);
                });
            }
        }

        // Certificates
        const certificates = readArray("resumeCraftCertificates");
        const certificateItems = certificates.length
            ? certificates
            : (savedSections.certificate || savedSections.certificates || []);

        renderEntries(
            "pCertificates",
            certificateItems,
            item => `
                <div class="resume-entry-top">
                    <strong>${escapeHTML(
                        item.name || item.certificate || "Certificate"
                    )}</strong>
                    <span>${escapeHTML(item.year || "")}</span>
                </div>
                <div class="resume-entry-sub">${escapeHTML(
                    item.issuer || item.organization || ""
                )}</div>
            `,
            "Add your certificates here."
        );

        // Languages
        const languages = readArray("resumeCraftLanguages");
        const languageItems = languages.length
            ? languages
            : (savedSections.language || savedSections.languages || []);

        const languageList = $("pLanguages");

        if (languageList) {
            languageList.replaceChildren();

            const validLanguages = languageItems.filter(item =>
                typeof item === "string" ? item.trim() : item.name
            );

            if (!validLanguages.length) {
                const li = document.createElement("li");
                li.textContent = "Add your languages here.";
                languageList.appendChild(li);
            } else {
                validLanguages.forEach(item => {
                    const li = document.createElement("li");

                    li.textContent = typeof item === "string"
                        ? item
                        : item.name +
                          (item.level ? ` (${item.level})` : "");

                    languageList.appendChild(li);
                });
            }
        }
    }

    // ========================================
    // 8. UPDATE AUTOMATICALLY WHEN TYPING
    // ========================================
    fieldIds.forEach(id => {
        const input = $(id);

        if (input) {
            input.addEventListener("input", () => {
                savePersonalDetails();
                renderPreview();
            });
        }
    });

    // ========================================
    // 9. PROFILE PHOTO UPLOAD
    // ========================================
    if ($("photo")) {
        $("photo").addEventListener("change", event => {
            const file = event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                event.target.value = "";
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("Please select an image smaller than 2 MB.");
                event.target.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                photoData = reader.result;

                if ($("photoPreview")) {
                    $("photoPreview").src = photoData;
                    $("photoPreview").hidden = false;
                }

                savePersonalDetails();
                renderPreview();
            };

            reader.readAsDataURL(file);
        });
    }

   if ($("removePhoto")) {
    $("removePhoto").addEventListener("click", () => {

        // Clear the photo variable
        photoData = "";

        // Clear the selected file
        if ($("photo")) {
            $("photo").value = "";
        }

        // Hide the photo in Personal Details
        if ($("photoPreview")) {
            $("photoPreview").src = "";
            $("photoPreview").hidden = true;
        }

        // Hide the photo in the resume preview
        if ($("resumePhoto")) {
            $("resumePhoto").src = "";
            $("resumePhoto").hidden = true;
        }

        // Remove the photo from BOTH localStorage keys
        localStorage.removeItem("resumeCraftProfilePhoto");

        // Save personal details without the photo
        savePersonalDetails();

        // Refresh the preview
        renderPreview();
    });
}
    // ========================================
    // 10. SAVE & NEXT
    // ========================================
    if (resumeForm) {
        resumeForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!resumeForm.reportValidity()) return;

            if (savePersonalDetails(true)) {
                localStorage.setItem("resumeCraftCurrentStep", "3");
                window.location.href = "education.html";
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", event => {
            event.preventDefault();

            if (resumeForm && !resumeForm.reportValidity()) {
                resumeForm.reportValidity();
                return;
            }

            if (savePersonalDetails(true)) {
                localStorage.setItem("resumeCraftCurrentStep", "3");
                window.location.href = "education.html";
            }
        });
    }

    // ========================================
    // 11. PRINT / SAVE PDF
    // ========================================
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            savePersonalDetails();
            window.print();
        });
    }

    // ========================================
    // 12. INITIAL PREVIEW
    // ========================================
    renderPreview();
});




const profilePhoto = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("photoPreview");

if (profilePhoto && photoPreview) {
    profilePhoto.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            this.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            photoPreview.src = event.target.result;
            photoPreview.hidden = false;

            // Save the photo for the resume preview
            localStorage.setItem(
                "resumeCraftProfilePhoto",
                event.target.result
            );
        };

        reader.readAsDataURL(file);
    });
}





const profilePhotoInput = document.getElementById("profilePhoto");
const resumePhoto = document.getElementById("resumePhoto");

if (profilePhotoInput && resumePhoto) {
    // Restore the previously saved photo
    const savedPhoto = localStorage.getItem("resumeCraftProfilePhoto");

    if (savedPhoto) {
        resumePhoto.src = savedPhoto;
        resumePhoto.style.display = "block";
    }

    // Update the resume when a new photo is selected
    profilePhotoInput.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const imageData = event.target.result;

            localStorage.setItem("resumeCraftProfilePhoto", imageData);

            resumePhoto.src = imageData;
            resumePhoto.style.display = "block";
        };

        reader.readAsDataURL(file);
    });
}