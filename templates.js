
const cards = document.querySelectorAll(".template-card");
const continueBtn = document.getElementById("continueBtn");
const hint = document.getElementById("selectionHint");

let selected =
  localStorage.getItem("resumeCraftSelectedTemplate") || "";

function chooseTemplate(id) {
  selected = id;

  localStorage.setItem("resumeCraftSelectedTemplate", id);

  cards.forEach(card => {
    const active = card.dataset.template === id;

    card.classList.toggle("selected", active);
    card.setAttribute("aria-pressed", String(active));
  });

  continueBtn.disabled = false;
  hint.textContent = "Template selected! Continue to enter your details.";
}

cards.forEach(card => {
  card.addEventListener("click", () => {
    chooseTemplate(card.dataset.template);
  });
});

if (selected) {
  chooseTemplate(selected);
}

continueBtn.addEventListener("click", () => {
  if (selected) {
    window.location.href = "personal-details.html";
  }
});


setTheme(localStorage.getItem("resumeCraftTheme") === "dark");

themeToggle.addEventListener("click", () => {
  setTheme(
    !document.documentElement.classList.contains("dark-mode")
  );
});



document.addEventListener("DOMContentLoaded", function () {
    const templateCards = document.querySelectorAll("[data-template]");
    const resumePaper = document.getElementById("resumePaper");

    if (!resumePaper) {
        console.error("Cannot find #resumePaper in template.html");
        return;
    }

    function applyTemplate(card) {
        const template = card.dataset.template;

        // Highlight the selected card
        templateCards.forEach(function (item) {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        // Apply the selected design to the existing preview
        resumePaper.dataset.template = template;

        // Save the selection
        localStorage.setItem("resumeCraftSelectedTemplate", template);

        // Enable Continue
        const continueBtn = document.getElementById("continueBtn");
        if (continueBtn) {
            continueBtn.disabled = false;
        }

        const selectionHint = document.getElementById("selectionHint");
        if (selectionHint) {
            selectionHint.textContent = "Template selected!";
        }
    }

    templateCards.forEach(function (card) {
        card.addEventListener("click", function () {
            applyTemplate(card);
        });
    });

    // Restore the saved selection
    const savedTemplate = localStorage.getItem("resumeCraftSelectedTemplate");

    if (savedTemplate) {
        const savedCard = Array.from(templateCards).find(
            card => card.dataset.template === savedTemplate
        );

        if (savedCard) {
            applyTemplate(savedCard);
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const preview = document.getElementById("resumePaper");

    document.addEventListener("click", function (event) {
        const card = event.target.closest("[data-template]");

        if (!card) return;

        console.log("Template clicked:", card.dataset.template);

        document.querySelectorAll("[data-template]").forEach(function (item) {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        if (preview) {
            preview.dataset.template = card.dataset.template;
            preview.style.borderTop = "8px solid #ff6b61";
        }

        localStorage.setItem(
            "resumeCraftSelectedTemplate",
            card.dataset.template
        );
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const templateCards = document.querySelectorAll("[data-template]");
    const resumePaper = document.getElementById("resumePaper");

    if (!resumePaper) {
        console.error("resumePaper element not found!");
        return;
    }

    templateCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const selectedTemplate = card.dataset.template;

            // Highlight the clicked card
            templateCards.forEach(function (item) {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            // Apply the selected template to the right preview
            resumePaper.className = "resume-paper";
            resumePaper.classList.add(selectedTemplate);

            // Save the selection
            localStorage.setItem(
                "resumeCraftSelectedTemplate",
                selectedTemplate
            );

            console.log("Selected template:", selectedTemplate);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const templateCards = document.querySelectorAll(".template-card");
    const resumePaper = document.getElementById("resumePaper");
    const continueBtn = document.getElementById("continueBtn");
    const selectionHint = document.getElementById("selectionHint");

    const templateNames = [
        "blue-minimal",
        "black-white",
        "brown-modern",
        "ats-clean",
        "yellow-sidebar"
    ];

    function selectTemplate(card) {
        const selectedTemplate = card.dataset.template;

        if (!templateNames.includes(selectedTemplate)) return;

        // Highlight the selected template card
        templateCards.forEach(function (item) {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        // Apply the selected design to the right-side preview
        templateNames.forEach(function (name) {
            resumePaper.classList.remove(name);
        });

        resumePaper.classList.add(selectedTemplate);

        // Remember the selected template
        localStorage.setItem(
            "resumeCraftSelectedTemplate",
            selectedTemplate
        );

        // Enable the Continue button
        if (continueBtn) {
            continueBtn.disabled = false;
        }

        if (selectionHint) {
            selectionHint.textContent =
                "Selected: " +
                card.querySelector(".card-title").textContent;
        }
    }

   
document.addEventListener("click", function (event) {
    const card = event.target.closest(".template-card");
    if (!card) return;

    const preview = document.getElementById("resumePaper");

    if (!preview) {
        alert("ERROR: resumePaper was not found!");
        return;
    }

    const template = card.dataset.template;

    // Force a visible change, independent of your CSS classes
    preview.style.setProperty(
        "border",
        "6px solid #ff6b61",
        "important"
    );

    preview.style.setProperty(
        "background",
        template === "black-white" ? "#eeeeee" : "#fff0ec",
        "important"
    );

    preview.style.setProperty(
        "color",
        "#292d38",
        "important"
    );

    preview.dataset.template = template;

    alert("Clicked: " + template);
});


    // Restore the previously selected template
    const savedTemplate = localStorage.getItem(
        "resumeCraftSelectedTemplate"
    );

    if (savedTemplate) {
        const savedCard = Array.from(templateCards).find(function (card) {
            return card.dataset.template === savedTemplate;
        });

        if (savedCard) {
            selectTemplate(savedCard);
        }
    }
});


//personal js
const $ = id => document.getElementById(id);

const templateId =
  localStorage.getItem("resumeCraftSelectedTemplate") || "blue-minimal";

const paper = $("resumePaper");
paper.dataset.template = templateId;

// Show the photo option only for designs that support it.
const photoTemplates = ["brown-modern", "yellow-sidebar"];

if (!photoTemplates.includes(templateId)) {
  $("photoSection").hidden = true;
}

let photoData = "";

const model = {
  education: [],
  experience: [],
  skill: [],
  certificate: [],
  language: []
};

const config = {
  education: {
    list: "educationList",
    fields: [
      ["degree", "Degree / qualification"],
      ["school", "School / university"],
      ["year", "Dates / year"],
      ["details", "Details / achievements"]
    ]
  },
  experience: {
    list: "experienceList",
    fields: [
      ["role", "Job title"],
      ["company", "Company"],
      ["dates", "Dates"],
      ["location", "Location"],
      ["details", "Responsibilities / achievements"]
    ]
  },
  skill: {
    list: "skillList",
    fields: [["name", "Skill name"]]
  },
  certificate: {
    list: "certificateList",
    fields: [
      ["name", "Certificate name"],
      ["issuer", "Issuing organization"],
      ["year", "Year"]
    ]
  },
  language: {
    list: "languageList",
    fields: [
      ["name", "Language"],
      ["level", "Proficiency"]
    ]
  }
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function values() {
  return {
    fullName: $("fullName").value,
    jobTitle: $("jobTitle").value,
    email: $("email").value,
    phone: $("phone").value,
    location: $("location").value,
    website: $("website").value,
    summary: $("summary").value,
    photoData
  };
}

function save() {
  try {
    localStorage.setItem(
      "resumeCraftPersonalDetails",
      JSON.stringify(values())
    );

    localStorage.setItem(
      "resumeCraftResumeSections",
      JSON.stringify(model)
    );
  } catch (error) {
    console.warn("Unable to save resume data.", error);
  }
}

function addEntry(type, values = {}) {
  const cfg = config[type];
  const item = {};

  cfg.fields.forEach(([key]) => {
    item[key] = values[key] || "";
  });

  model[type].push(item);

  const card = document.createElement("div");
  card.className = "entry-card";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-entry";
  remove.textContent = "Remove ×";

  const grid = document.createElement("div");
  grid.className = "entry-grid";

  cfg.fields.forEach(([key, label]) => {
    const wrapper = document.createElement("label");
    wrapper.textContent = label;

    const input = document.createElement("input");
    input.dataset.key = key;
    input.value = item[key];
    input.placeholder = label;

    input.addEventListener("input", () => {
      item[key] = input.value;
      save();
      renderPreview();
    });

    wrapper.appendChild(input);
    grid.appendChild(wrapper);
  });

  remove.addEventListener("click", () => {
    const index = model[type].indexOf(item);

    if (index !== -1) {
      model[type].splice(index, 1);
    }

    card.remove();
    save();
    renderPreview();
  });

  card.append(remove, grid);
  $(cfg.list).appendChild(card);
}

function setText(id, value, fallback = "") {
  $(id).textContent = value || fallback;
}

function renderList(type, target, renderItem) {
  const element = $(target);
  element.replaceChildren();

  const items = model[type].filter(item =>
    Object.values(item).some(value => String(value).trim())
  );

  if (!items.length) {
    const placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = "Add your " + type + " details here.";
    element.appendChild(placeholder);
    return;
  }

  items.forEach(item => {
    const node = document.createElement("div");
    node.className = "resume-entry";
    node.innerHTML = renderItem(item);
    element.appendChild(node);
  });
}

function renderPreview() {
  const d = values();

  setText("pName", d.fullName, "Your Name");
  setText("pTitle", d.jobTitle, "Professional Title");

  const contact = [d.email, d.phone, d.location].filter(Boolean);
  setText("pContact", contact.join(" · "), "Email · Phone · City");
  setText("pWebsite", d.website);
  setText("pSummary", d.summary, "Your professional summary will appear here.");

  $("resumePhoto").src = photoData || "";
  $("resumePhoto").hidden = !photoData;

  renderList("experience", "pExperience", item => `
    <div class="resume-entry-top">
      <span>${escapeHTML(item.role || "Job title")}
      ${item.company ? " — " + escapeHTML(item.company) : ""}</span>
      <span>${escapeHTML(item.dates)}</span>
    </div>
    ${item.location ? `<div class="resume-entry-sub">${escapeHTML(item.location)}</div>` : ""}
    ${item.details ? `<p>${escapeHTML(item.details)}</p>` : ""}
  `);

  renderList("education", "pEducation", item => `
    <div class="resume-entry-top">
      <span>${escapeHTML(item.degree || "Qualification")}</span>
      <span>${escapeHTML(item.year)}</span>
    </div>
    <div class="resume-entry-sub">${escapeHTML(item.school)}</div>
    ${item.details ? `<p>${escapeHTML(item.details)}</p>` : ""}
  `);

  const skills = $("pSkills");
  skills.replaceChildren();

  const skillItems = model.skill.map(item => item.name).filter(Boolean);

  if (!skillItems.length) {
    const li = document.createElement("li");
    li.textContent = "Your skills will appear here.";
    skills.appendChild(li);
  } else {
    skillItems.forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill;
      skills.appendChild(li);
    });
  }

  renderList("certificate", "pCertificates", item => `
    <div class="resume-entry-top">
      <span>${escapeHTML(item.name || "Certificate")}</span>
      <span>${escapeHTML(item.year)}</span>
    </div>
    <div class="resume-entry-sub">${escapeHTML(item.issuer)}</div>
  `);

  const languages = $("pLanguages");
  languages.replaceChildren();

  model.language.filter(item => item.name).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name + (item.level ? ` (${item.level})` : "");
    languages.appendChild(li);
  });
}

function load() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("resumeCraftPersonalDetails") || "{}"
    );

    [
      "fullName", "jobTitle", "email", "phone",
      "location", "website", "summary"
    ].forEach(id => {
      $(id).value = saved[id] || "";
    });

    photoData = saved.photoData || "";

    if (photoData) {
      $("photoPreview").src = photoData;
      $("photoPreview").hidden = false;
    }

    const savedSections = JSON.parse(
      localStorage.getItem("resumeCraftResumeSections") || "{}"
    );

    Object.keys(config).forEach(type => {
      (savedSections[type] || []).forEach(item => addEntry(type, item));
    });
  } catch (error) {
    console.warn("Unable to restore saved resume.", error);
  }

  renderPreview();
}

document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    addEntry(button.dataset.add);
    save();
  });
});

[
  "fullName", "jobTitle", "email", "phone",
  "location", "website", "summary"
].forEach(id => {
  $(id).addEventListener("input", () => {
    save();
    renderPreview();
  });
});

$("photo").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Please choose an image smaller than 5 MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    photoData = reader.result;
    $("photoPreview").src = photoData;
    $("photoPreview").hidden = false;
    save();
    renderPreview();
  };

  reader.readAsDataURL(file);
});

$("removePhoto").addEventListener("click", () => {
  photoData = "";
  $("photo").value = "";
  $("photoPreview").hidden = true;
  $("resumePhoto").hidden = true;
  save();
});

$("resumeForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!$("resumeForm").reportValidity()) return;

  save();
  localStorage.setItem("resumeCraftCurrentStep", "3");

  alert("Resume details saved! You can print or save the preview as PDF.");
});

$("printBtn").addEventListener("click", () => window.print());

const themeToggle = $("themeToggle");

function setTheme(dark) {
  document.documentElement.classList.toggle("dark-mode", dark);

  localStorage.setItem(
    "resumeCraftTheme",
    dark ? "dark" : "light"
  );

  themeToggle.textContent = dark ? "☀ Light mode" : "☾ Dark mode";
}

setTheme(localStorage.getItem("resumeCraftTheme") === "dark");

themeToggle.addEventListener("click", () => {
  setTheme(!document.documentElement.classList.contains("dark-mode"));
});

load();

const saveBtn = document.getElementById("saveBtn");
const nextBtn = document.getElementById("nextBtn");
const saveMessage = document.getElementById("saveMessage");

function savePersonalDetails() {
    const fieldIds = [
        "fullName",
        "jobTitle",
        "email",
        "phone",
        "location",
        "website",
        "summary"
    ];

    const details = {};

    fieldIds.forEach(id => {
        const field = document.getElementById(id);

        if (field) {
            details[id] = field.value.trim();
        }
    });

    // Preserve existing details, such as the profile photo.
    try {
        const existing = JSON.parse(
            localStorage.getItem("resumeCraftPersonalDetails") || "{}"
        );

        localStorage.setItem(
            "resumeCraftPersonalDetails",
            JSON.stringify({ ...existing, ...details })
        );

        saveMessage.textContent = "✓ Your personal details have been saved!";
        return true;
    } catch (error) {
        saveMessage.textContent = "Unable to save. Please try again.";
        return false;
    }
}

if (saveBtn && nextBtn && saveMessage) {
    saveBtn.addEventListener("click", savePersonalDetails);

    nextBtn.addEventListener("click", () => {
        if (savePersonalDetails()) {
            window.location.href = "education.html";
        }
    });
}




