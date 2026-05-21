const projects = [
  {
    title: "Система зачарований",
    category: "Minecraft",
    type: "Мод Minecraft",
    file: "assets/media/minecraft/images/minecraft1.png",
    mediaType: "image",
    description: "Кастомная система зачарований для мода Minecraft."
  },
  {
    title: "Система торговли",
    category: "Minecraft",
    type: "Мод Minecraft",
    file: "assets/media/minecraft/images/minecraft2.png",
    mediaType: "image",
    description: "Кастомный интерфейс торговли и логика прогрессии."
  },
  {
    title: "Система квестов",
    category: "Minecraft",
    type: "Мод Minecraft",
    file: "assets/media/minecraft/images/minecraft3.png",
    mediaType: "image",
    description: "Структура квестов, UI и система прогрессии."
  },
  {
    title: "Система скиллов",
    category: "Roblox",
    type: "Механика Roblox",
    file: "assets/media/roblox/videos/roblox1.mp4",
    mediaType: "video",
    description: "Прототип механики способностей и скиллов."
  },
  {
    title: "Плагин PC/Cloud Sync",
    category: "Roblox",
    type: "Плагин Roblox",
    file: "assets/media/roblox/videos/roblox2.mp4",
    mediaType: "video",
    description: "Плагин для синхронизации локальных файлов ПК и облачного workspace."
  },
  {
    title: "Система строительства",
    category: "Roblox",
    type: "Механика Roblox",
    file: "assets/media/roblox/videos/roblox3.mp4",
    mediaType: "video",
    description: "Интерактивная система строительства с логикой размещения объектов."
  },
  {
    title: "Магический посох",
    category: "Terraria",
    type: "Мод Terraria",
    file: "assets/media/terraria/videos/terraria1.mp4",
    mediaType: "video",
    description: "Кастомное поведение магического оружия."
  },
  {
    title: "Магическая коса",
    category: "Terraria",
    type: "Мод Terraria",
    file: "assets/media/terraria/videos/terraria2.mp4",
    mediaType: "video",
    description: "Кастомная коса с магической атакующей логикой."
  },
  {
    title: "Способность \"Сверхнова\"",
    category: "Terraria",
    type: "Мод Terraria",
    file: "assets/media/terraria/videos/terraria3.mp4",
    mediaType: "video",
    description: "Мощный кастомный эффект способности."
  }
];

const introLines = [
  "> ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ ПОРТФОЛИО...",
  "> ЗАГРУЗКА МОДУЛЕЙ...",
  "> МЕДИА-ИНДЕКС СИНХРОНИЗИРОВАН",
  "> ТОЧКА ДОСТУПА НАЙДЕНА",
  "> НАЖМИ ENTER / КЛИКНИ ДЛЯ ВХОДА"
];

const sessionKey = "gerfin-portfolio-entered";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  activeFilter: "All",
  filteredProjects: [...projects],
  activeIndex: 0,
  introComplete: false,
  introEntered: false,
  typingTimer: null,
  copyTimer: null
};

const app = document.getElementById("app");
const intro = document.getElementById("intro");
const introText = document.getElementById("introText");
const introAction = document.getElementById("introAction");
const projectGrid = document.getElementById("projectGrid");
const projectCount = document.getElementById("projectCount");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const lightbox = document.getElementById("lightbox");
const lightboxMedia = document.getElementById("lightboxMedia");
const lightboxType = document.getElementById("lightboxType");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const copyStatus = document.getElementById("copyStatus");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

function init() {
  bindReactiveSurfaces(document);
  renderProjects();
  bindFilterEvents();
  bindCopyEvents();
  bindLightboxEvents();
  bindGlobalKeys();
  setupIntro();
}

function setupIntro() {
  const hasEntered = sessionStorage.getItem(sessionKey) === "1";

  if (hasEntered) {
    intro.remove();
    revealApp(true);
    return;
  }

  if (prefersReducedMotion.matches) {
    completeIntroText();
    return;
  }

  typeIntroLine(0, 0, "");
}

function typeIntroLine(lineIndex, charIndex, currentText) {
  if (lineIndex >= introLines.length) {
    state.introComplete = true;
    introAction.hidden = false;
    return;
  }

  const line = introLines[lineIndex];
  const nextText = `${currentText}${line.slice(0, charIndex + 1)}`;
  introText.textContent = nextText;

  if (charIndex + 1 < line.length) {
    state.typingTimer = window.setTimeout(() => {
      typeIntroLine(lineIndex, charIndex + 1, currentText);
    }, 28);
    return;
  }

  const appended = `${currentText}${line}\n`;
  introText.textContent = appended;

  state.typingTimer = window.setTimeout(() => {
    typeIntroLine(lineIndex + 1, 0, appended);
  }, lineIndex === introLines.length - 1 ? 140 : 220);
}

function completeIntroText() {
  window.clearTimeout(state.typingTimer);
  introText.textContent = `${introLines.join("\n")}\n`;
  state.introComplete = true;
  introAction.hidden = false;
}

function revealApp(skipTransition) {
  app.setAttribute("aria-hidden", "false");
  app.classList.add("app--visible");
  document.body.classList.remove("boot-pending");

  if (!skipTransition) {
    window.setTimeout(() => {
      intro.classList.add("intro--hidden");
      window.setTimeout(() => intro.remove(), 650);
    }, 60);
  }
}

function enterSite() {
  if (state.introEntered) {
    return;
  }

  state.introEntered = true;
  sessionStorage.setItem(sessionKey, "1");
  revealApp(false);
}

function renderProjects() {
  state.filteredProjects =
    state.activeFilter === "All"
      ? [...projects]
      : projects.filter((project) => project.category === state.activeFilter);

  projectGrid.innerHTML = "";
  projectCount.textContent = `${String(state.filteredProjects.length).padStart(2, "0")} модулей видно`;

  state.filteredProjects.forEach((project, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "project-card";
    card.dataset.category = project.category;
    card.dataset.status = project.mediaType === "video" ? "ВИДЕО" : "ИЗОБРАЖЕНИЕ";
    card.setAttribute("aria-label", `${project.title}, ${project.type}`);

    const mediaMarkup =
      project.mediaType === "image"
        ? `<img src="${project.file}" alt="${project.title}" loading="lazy">`
        : `<video src="${project.file}" muted loop playsinline preload="metadata" aria-label="Превью: ${project.title}"></video>`;

    card.innerHTML = `
      <div class="project-card__media">${mediaMarkup}</div>
      <div class="project-card__body">
        <div class="project-card__header">
          <div>
            <span class="project-card__type">${project.type}</span>
            <h3>${project.title}</h3>
          </div>
          <span class="project-card__badge">${project.category}</span>
        </div>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__statusline">
          <span class="project-card__badge">${project.mediaType === "video" ? "Превью готово" : "Изображение"}</span>
          <span class="project-card__badge">Модуль загружен</span>
        </div>
      </div>
    `;

    bindReactiveSurface(card);
    bindProjectCardEvents(card, project, index);
    projectGrid.appendChild(card);
  });
}

function bindProjectCardEvents(card, project, index) {
  const video = card.querySelector("video");

  if (video) {
    card.addEventListener("mouseenter", () => {
      const playAttempt = video.play();

      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
    });

    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });

    card.addEventListener("blur", () => {
      video.pause();
      video.currentTime = 0;
    });
  }

  card.addEventListener("click", () => {
    openLightbox(index);
  });
}

function bindFilterEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderProjects();
    });
  });
}

function openLightbox(index) {
  state.activeIndex = index;
  renderLightboxProject();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxMedia.innerHTML = "";
}

function stepLightbox(direction) {
  const length = state.filteredProjects.length;
  state.activeIndex = (state.activeIndex + direction + length) % length;
  renderLightboxProject();
}

function renderLightboxProject() {
  const project = state.filteredProjects[state.activeIndex];

  if (!project) {
    return;
  }

  lightboxType.textContent = `${project.category} // ${project.type}`;
  lightboxTitle.textContent = project.title;
  lightboxDescription.textContent = project.description;

  if (project.mediaType === "image") {
    lightboxMedia.innerHTML = `<img src="${project.file}" alt="${project.title}">`;
    return;
  }

  lightboxMedia.innerHTML = `
    <video src="${project.file}" controls autoplay muted loop playsinline>
      Ваш браузер не поддерживает встроенное видео.
    </video>
  `;
}

function bindLightboxEvents() {
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-close-lightbox")) {
      closeLightbox();
    }
  });
}

function bindCopyEvents() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");

      if (!value) {
        return;
      }

      try {
        await copyText(value);
        setCopyStatus("СКОПИРОВАНО В БУФЕР");
      } catch {
        setCopyStatus("ОШИБКА ДОСТУПА К БУФЕРУ");
      }
    });
  });
}

function setCopyStatus(message) {
  window.clearTimeout(state.copyTimer);
  copyStatus.textContent = message;
  copyStatus.classList.remove("is-flash");
  window.requestAnimationFrame(() => copyStatus.classList.add("is-flash"));
  state.copyTimer = window.setTimeout(() => {
    copyStatus.textContent = "ОЖИДАНИЕ КОМАНДЫ";
    copyStatus.classList.remove("is-flash");
  }, 1500);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand("copy");
  helper.remove();

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

function bindGlobalKeys() {
  document.addEventListener("keydown", (event) => {
    if (intro && document.body.contains(intro) && !state.introEntered) {
      if (event.key === "Enter") {
        if (!state.introComplete) {
          completeIntroText();
        } else {
          enterSite();
        }
      }
      return;
    }

    if (lightbox.classList.contains("is-open")) {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        stepLightbox(-1);
      } else if (event.key === "ArrowRight") {
        stepLightbox(1);
      }
    }
  });

  if (!intro) {
    return;
  }

  intro.addEventListener("click", () => {
    if (!state.introComplete) {
      completeIntroText();
      return;
    }

    enterSite();
  });
}

function bindReactiveSurfaces(root) {
  root.querySelectorAll("[data-reactive]").forEach(bindReactiveSurface);
}

function bindReactiveSurface(element) {
  if (!(element instanceof HTMLElement) || element.dataset.reactiveBound === "1") {
    return;
  }

  element.dataset.reactiveBound = "1";

  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty("--mx", `${x}%`);
    element.style.setProperty("--my", `${y}%`);
  });

  element.addEventListener("pointerleave", () => {
    element.style.removeProperty("--mx");
    element.style.removeProperty("--my");
  });
}

init();
