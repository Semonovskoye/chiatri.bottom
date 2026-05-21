function copyCode(button) {
  const codeBox = button.closest(".code-box");

  const activeCode =
    codeBox.querySelector(".code-panel.active code") ||
    codeBox.querySelector("code");

  if (!activeCode) return;

  const code = activeCode.textContent.trim();

  navigator.clipboard.writeText(code).then(() => {
    const oldText = button.innerText;
    button.innerText = "Copied!";

    setTimeout(() => {
      button.innerText = oldText;
    }, 1500);
  });
}

function showCodeTab(button, panelName) {
  const codeBox = button.closest(".code-box");

  codeBox.querySelectorAll(".code-tab").forEach(tab => {
    tab.classList.remove("active");
  });

  codeBox.querySelectorAll(".code-panel").forEach(panel => {
    panel.classList.remove("active");
  });

  button.classList.add("active");

  const selectedPanel = codeBox.querySelector(
    `.code-panel[data-code-panel="${panelName}"]`
  );

  if (selectedPanel) {
    selectedPanel.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const codeBlocks = document.querySelectorAll("code[data-code-file]");

  for (const codeBlock of codeBlocks) {
    const file = codeBlock.dataset.codeFile;

    try {
      const response = await fetch(file);
      const text = await response.text();

      codeBlock.textContent = text.trim();
    } catch (error) {
      codeBlock.textContent = `Could not load ${file}`;
      console.error(error);
    }
  }
});

function setupDisplayMoreButtons() {
  document.querySelectorAll(".code-box.collapsible").forEach(codeBox => {
    const codeViews = codeBox.querySelectorAll(".code-view");

    if (codeViews.length > 0) {
      codeViews.forEach(codeView => {
        addDisplayMoreButton(codeView, codeView);
      });
    } else {
      addDisplayMoreButton(codeBox, codeBox);
    }
  });
}

function addDisplayMoreButton(container, target) {
  if (container.querySelector(":scope > .display-more-btn")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "display-more-btn";
  button.innerText = "Display more";

  button.addEventListener("click", () => {
    const expanded = target.classList.toggle("expanded");
    button.innerText = expanded ? "Display less" : "Display more";
  });

  container.appendChild(button);
}

document.addEventListener("DOMContentLoaded", async () => {
  const codeBlocks = document.querySelectorAll("code[data-code-file]");

  for (const codeBlock of codeBlocks) {
    const file = codeBlock.dataset.codeFile;

    try {
      const response = await fetch(file);
      const text = await response.text();

      codeBlock.textContent = text.trim();
    } catch (error) {
      codeBlock.textContent = `Could not load ${file}`;
      console.error(error);
    }
  }

  setupDisplayMoreButtons();
});

function toggleTutorial(button) {
  const card = button.closest(".tutorial-card");
  const body = card.querySelector(".tutorial-body");

  if (!body) return;

  const isOpening = !body.classList.contains("open");

  if (isOpening) {
    body.classList.add("open");
    button.innerText = "Hide video tutorial";

    const iframe = card.querySelector("iframe[data-src]");

    if (iframe && !iframe.src) {
      iframe.src = iframe.dataset.src;
    }
  } else {
    body.classList.remove("open");
    button.innerText = "Display video tutorial";

    const iframe = card.querySelector("iframe");
    const video = card.querySelector("video");

    if (iframe) {
      iframe.src = "";
    }

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 50);
}

function showGrade(grade, button) {
  const section = button.closest(".grade-section");

  if (!section) return;

  section.querySelectorAll(".grade-tab").forEach(tab => {
    tab.classList.remove("active");
  });

  section.querySelectorAll(".grade-content").forEach(content => {
    content.classList.remove("active");
  });

  button.classList.add("active");

  const selectedContent = section.querySelector(
    `.grade-content[data-grade="${grade}"]`
  );

  if (selectedContent) {
    selectedContent.classList.add("active");
  }

  localStorage.setItem("selectedGrade", grade);

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 50);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedGrade = localStorage.getItem("selectedGrade");

  if (!savedGrade) return;

  const button = document.querySelector(
    `.grade-tab[onclick*="${savedGrade}"]`
  );

  if (button) {
    showGrade(savedGrade, button);
  }
});

const THEME_STORAGE_KEY = "chiangu-theme-mode";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(mode) {
  const selectedMode = mode || "system";
  const resolvedTheme = selectedMode === "system" ? getSystemTheme() : selectedMode;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = selectedMode;

  localStorage.setItem(THEME_STORAGE_KEY, selectedMode);

  document.querySelectorAll('input[name="theme-mode"]').forEach(input => {
    input.checked = input.value === selectedMode;
  });

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 50);
}

function setupThemeSettings() {
  const toggle = document.getElementById("settings-toggle");
  const panel = document.getElementById("settings-panel");
  const savedMode = localStorage.getItem(THEME_STORAGE_KEY) || "system";

  applyTheme(savedMode);

  if (toggle && panel) {
    toggle.addEventListener("click", event => {
      event.stopPropagation();
      panel.hidden = !panel.hidden;
    });

    document.addEventListener("click", event => {
      if (!event.target.closest(".settings-widget")) {
        panel.hidden = true;
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        panel.hidden = true;
      }
    });
  }

  document.querySelectorAll('input[name="theme-mode"]').forEach(input => {
    input.addEventListener("change", () => {
      applyTheme(input.value);
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const currentMode = localStorage.getItem(THEME_STORAGE_KEY) || "system";

    if (currentMode === "system") {
      applyTheme("system");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupThemeSettings();

  await loadExternalCodeBlocks();
  setupDisplayMoreButtons();
  setupVantaBackground();
});
