
"use strict";

const KEYS = {
    personal: "resumeCraftPersonalDetails",
    education: "resumeCraftEducation",
    experience: "resumeCraftExperience",
    certificates: "resumeCraftCertificates",
    template: "resumeCraftSelectedTemplate",
    resumes: "resumeCraftResumes"
};

const TEMPLATE_IDS = [
    "blue-minimal",
    "black-white",
    "brown-modern",
    "ats-clean",
    "yellow-sidebar"
];

function readStorage(key, fallback = {}) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function getText(...values) {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }

        if (typeof value === "number") {
            return String(value);
        }
    }

    return "";
}

function getArray(value) {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.education)) return value.education;
    if (value && Array.isArray(value.educationList)) {
        return value.educationList;
    }
    return [];
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "";
}

function addHeading(parent, text) {
    const heading = document.createElement("h4");
    heading.textContent = text;
    parent.appendChild(heading);
}

function addParagraph(parent, text, className = "") {
    if (!text) return;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    if (className) paragraph.className = className;

    parent.appendChild(paragraph);
}

function addBulletList(parent, values) {
    const items = Array.isArray(values)
        ? values
        : typeof values === "string"
            ? values.split(/[\n,]+/)
            : [];

    const cleaned = items
        .map(item => typeof item === "string"
            ? item.trim()
            : "")
        .filter(Boolean);

    if (!cleaned.length) return;

    const list = document.createElement("ul");

    cleaned.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill;
        list.appendChild(li);
    });

    parent.appendChild(list);
}

function addEntry(parent, title, details = [], description = "") {
    if (!title && !details.some(Boolean) && !description) return;

    const entry = document.createElement("div");
    entry.className = "resume-entry";

    if (title) {
        const heading = document.createElement("h4");
        heading.textContent = title;
        entry.appendChild(heading);
    }

    details.filter(Boolean).forEach(detail => {
        addParagraph(entry, detail, "entry-meta");
    });

    if (description) {
        description.split(/\n+/)
            .map(line => line.trim())
            .filter(Boolean)
            .forEach(line => addParagraph(entry, line));
    }

    parent.appendChild(entry);
}

function toggleSection(sectionId, contentId) {
    const section = document.getElementById(sectionId);
    const content = document.getElementById(contentId);

    if (section && content) {
        section.hidden = !content.textContent.trim();
    }
}

function applySelectedTemplate() {
    const selected = localStorage.getItem(KEYS.template);
    const template = TEMPLATE_IDS.includes(selected)
        ? selected
        : "blue-minimal";

    document.getElementById("resumePaper").dataset.template = template;

    return template;
}

function renderResume() {
    const personal = readStorage(KEYS.personal, {});
    const educationData = readStorage(KEYS.education, {});
    const experienceData = readStorage(KEYS.experience, {});
    const certificateData = readStorage(KEYS.certificates, {});

    // 1. Personal Details
    setText(
        "pName",
        getText(personal.name, personal.fullName, personal.fullname)
        || "Your Name"
    );

    setText(
        "pTitle",
        getText(personal.jobTitle, personal.title, personal.profession)
    );

    setText(
        "pContact",
        [
            getText(personal.email),
            getText(personal.phone, personal.mobile),
            getText(personal.location, personal.address)
        ].filter(Boolean).join(" | ")
    );

    setText(
        "pWebsite",
        [
            getText(personal.website, personal.portfolio),
            getText(personal.linkedin),
            getText(personal.github)
        ].filter(Boolean).join(" | ")
    );

    setText(
        "pSummary",
        getText(personal.summary, personal.professionalSummary)
    );

    const photo = document.getElementById("resumePhoto");
    const photoUrl = getText(
        personal.photo,
        personal.photoUrl,
        personal.profilePhoto
    );

    if (photoUrl) {
        photo.src = photoUrl;
        photo.hidden = false;
        photo.onerror = () => {
            photo.hidden = true;
        };
    } else {
        photo.removeAttribute("src");
        photo.hidden = true;
    }

    // 2. Work Experience
    const experienceContainer = document.getElementById("pExperience");
    experienceContainer.replaceChildren();

    const experiences = Array.isArray(experienceData.experiences)
        ? experienceData.experiences
        : [];

    experiences.forEach(item => {
        addEntry(
            experienceContainer,
            getText(item.jobTitle, item.role, item.title),
            [
                [
                    getText(item.company, item.organization),
                    getText(item.location)
                ].filter(Boolean).join(" | "),

                [
                    getText(item.startDate, item.startYear),
                    getText(item.endDate, item.endYear)
                ].filter(Boolean).join(" – ")
            ],
            getText(
                item.description,
                item.responsibilities,
                item.achievements
            )
        );
    });

    // 3. Education
    const educationContainer = document.getElementById("pEducation");
    educationContainer.replaceChildren();

    const educationItems = getArray(educationData);

    educationItems.forEach(item => {
        addEntry(
            educationContainer,
            getText(
                item.degree,
                item.qualification,
                item.standard
            ),
            [
                getText(item.institution, item.school),
                getText(
                    item.fieldOfStudy,
                    item.grade,
                    item.cgpa,
                    item.percentage
                ),
                [
                    getText(item.startYear, item.startDate),
                    getText(item.endYear, item.endDate)
                ].filter(Boolean).join(" – ")
            ]
        );
    });

    // 4. Technical Skills and Soft Skills
    const skillsContainer = document.getElementById("pSkills");
    skillsContainer.replaceChildren();

    const technicalSkills = experienceData.technicalSkills || [];
    const softSkills = experienceData.softSkills || [];

    if (
        (Array.isArray(technicalSkills)
            ? technicalSkills.length > 0
            : Boolean(String(technicalSkills).trim()))
    ) {
        addHeading(skillsContainer, "Technical Skills");
        addBulletList(skillsContainer, technicalSkills);
    }

    if (
        (Array.isArray(softSkills)
            ? softSkills.length > 0
            : Boolean(String(softSkills).trim()))
    ) {
        addHeading(skillsContainer, "Soft Skills");
        addBulletList(skillsContainer, softSkills);
    }

    // 5. Projects
    const projectsContainer = document.getElementById("pProjects");
    projectsContainer.replaceChildren();

    const projects = experienceData.projects;

    if (Array.isArray(projects)) {
        projects.forEach(project => {
            if (typeof project === "string") {
                addParagraph(projectsContainer, project);
            } else if (project && typeof project === "object") {
                addEntry(
                    projectsContainer,
                    getText(project.name, project.title),
                    [],
                    getText(project.description, project.details)
                );
            }
        });
    } else if (typeof projects === "string") {
        projects.split(/\n+/)
            .map(line => line.trim())
            .filter(Boolean)
            .forEach(line => addParagraph(projectsContainer, line));
    }

    // 6. Certificates
    const certificatesContainer =
        document.getElementById("pCertificates");

    certificatesContainer.replaceChildren();

    const certificates = Array.isArray(certificateData.certificates)
        ? certificateData.certificates
        : [];

    certificates.forEach(item => {
        addEntry(
            certificatesContainer,
            getText(
                item.name,
                item.certificateName,
                item.title
            ),
            [
                getText(item.issuer, item.organization, item.issuedBy),
                getText(item.date, item.issueDate, item.year)
            ]
        );
    });

    // 7. Languages
    const languagesContainer = document.getElementById("pLanguages");
    languagesContainer.replaceChildren();

    const languages = Array.isArray(certificateData.languages)
        ? certificateData.languages
        : [];

    languages.forEach(item => {
        if (typeof item === "string") {
            addParagraph(languagesContainer, item);
        } else if (item && typeof item === "object") {
            addEntry(
                languagesContainer,
                getText(item.language, item.name),
                [getText(item.proficiency, item.level)]
            );
        }
    });

    // Hide sections that have no content.
    toggleSection("summarySection", "pSummary");
    toggleSection("experienceSection", "pExperience");
    toggleSection("educationSection", "pEducation");
    toggleSection("skillsSection", "pSkills");
    toggleSection("projectsSection", "pProjects");
    toggleSection("certificatesSection", "pCertificates");
    toggleSection("languagesSection", "pLanguages");

    // Apply the actual selected template ID.
    applySelectedTemplate();
}

// Save a snapshot of this resume.
function saveResume() {
    const personal = readStorage(KEYS.personal, {});
    const existing = readStorage(KEYS.resumes, []);
    const resumes = Array.isArray(existing) ? existing : [];

    const editingId = sessionStorage.getItem("resumeCraftEditingId");

    const savedResume = {
        id: editingId || (
            crypto.randomUUID
                ? crypto.randomUUID()
                : String(Date.now())
        ),
        title: getText(
            personal.name,
            personal.fullName,
            personal.fullname
        ) || "Untitled Resume",
        template: applySelectedTemplate(),
        personal: readStorage(KEYS.personal, {}),
        education: readStorage(KEYS.education, {}),
        experience: readStorage(KEYS.experience, {}),
        certificates: readStorage(KEYS.certificates, {}),
        updatedAt: new Date().toISOString()
    };

    const existingIndex = resumes.findIndex(
        resume => resume.id === savedResume.id
    );

    if (existingIndex >= 0) {
        resumes[existingIndex] = savedResume;
    } else {
        resumes.unshift(savedResume);
    }

    localStorage.setItem(KEYS.resumes, JSON.stringify(resumes));
    sessionStorage.setItem("resumeCraftEditingId", savedResume.id);

    document.getElementById("message").textContent =
        "Your resume has been saved successfully!";
}

document.getElementById("saveResumeBtn").addEventListener(
    "click",
    saveResume
);

document.getElementById("printBtn").addEventListener(
    "click",
    () => window.print()
);

document.getElementById("downloadBtn").addEventListener(
    "click",
    () => window.print()
);

// Browser print dialog: choose "Save as PDF" to download.
renderResume();

const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", function () {
    window.print();
});

const RESUMES_KEY = "resumeCraftResumes";

function getCurrentUser() {
    const user =
        sessionStorage.getItem("resumeCraftCurrentUser") ||
        sessionStorage.getItem("resumeDemoUser");

    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

function saveResumeForUser() {
    const user = getCurrentUser();

    if (!user || !user.email) {
        alert("Please sign in before saving your resume.");
        window.location.href = "signin.html";
        return;
    }

    const personal = JSON.parse(
        localStorage.getItem("resumeCraftPersonalDetails") || "{}"
    );

    const resume = {
        id: sessionStorage.getItem("resumeCraftEditingId") ||
            (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
        userEmail: user.email.toLowerCase(),
        title: personal.name || personal.fullName || "My Resume",
        template: localStorage.getItem("resumeCraftSelectedTemplate") || "blue-minimal",
        personal: JSON.parse(localStorage.getItem("resumeCraftPersonalDetails") || "{}"),
        education: JSON.parse(localStorage.getItem("resumeCraftEducation") || "{}"),
        experience: JSON.parse(localStorage.getItem("resumeCraftExperience") || "{}"),
        certificates: JSON.parse(localStorage.getItem("resumeCraftCertificates") || "{}"),
        updatedAt: new Date().toISOString()
    };

    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || "[]");
    const index = resumes.findIndex(item => item.id === resume.id);

    if (index >= 0) {
        resumes[index] = resume;
    } else {
        resumes.push(resume);
    }

    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    sessionStorage.setItem("resumeCraftEditingId", resume.id);

    alert("Resume saved successfully!");
}

document.getElementById("saveResumeBtn")?.addEventListener(
    "click",
    saveResumeForUser
);
