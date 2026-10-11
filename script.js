// ==========================================================
// BOSTON BARBERSHOP — script.js
// ==========================================================

// Сообщаем CSS, что JavaScript работает (нужно для анимаций появления)
document.documentElement.classList.add("js");

// ВАШ НОМЕР WhatsApp: только цифры, с кодом страны, без плюса и пробелов.
// Пример для Казахстана: "77011234567"
let WHATSAPP_NUMBER = "7XXXXXXXXXX";

// ---------- Находим нужные элементы на странице ----------
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const navLinks = document.querySelectorAll('a[href^="#"]');

// ---------- 1. Шапка меняет вид при прокрутке ----------
function updateHeader() {
  if (window.scrollY > 40) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

// ---------- 2. Мобильное меню ----------
function openMenu() {
  nav.classList.add("is-open");
  burger.classList.add("is-active");
  burger.setAttribute("aria-expanded", "true");
  document.body.classList.add("no-scroll");
}

function closeMenu() {
  nav.classList.remove("is-open");
  burger.classList.remove("is-active");
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
}

burger.addEventListener("click", function () {
  if (nav.classList.contains("is-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// ---------- 3. Плавная прокрутка к секциям ----------
navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href");
    if (targetId.length < 2) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();

    const headerHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

    window.scrollTo({ top: top, behavior: "smooth" });
  });
});

// ---------- 4. Анимация появления блоков ----------
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add("is-visible");
  });
}

// ---------- 5. Галерея: увеличение фото, стрелки, клавиши ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const galleryList = Array.from(document.querySelectorAll(".gallery__item"));
let currentIndex = 0;

function setPhoto(index) {
  // Если дошли до края, переходим на другой конец (по кругу)
  currentIndex = (index + galleryList.length) % galleryList.length;
  const item = galleryList[currentIndex];
  const img = item.querySelector("img");
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = img ? img.alt : "Enlarged gallery photo";
}

function openLightbox(index) {
  setPhoto(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

galleryList.forEach(function (item, index) {
  item.addEventListener("click", function () {
    openLightbox(index);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", function () {
    setPhoto(currentIndex - 1);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", function () {
    setPhoto(currentIndex + 1);
  });
}

// Закрытие по клику на тёмный фон
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Клавиши: Esc, ← и →
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeLightbox();
    closeMenu();
  }

  if (lightbox.classList.contains("is-open")) {
    if (event.key === "ArrowLeft") setPhoto(currentIndex - 1);
    if (event.key === "ArrowRight") setPhoto(currentIndex + 1);
  }
});

// ---------- 6. Форма записи ----------
const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const successMessage = document.getElementById("form-success");

// Возвращает сегодняшнюю дату в формате ГГГГ-ММ-ДД (по времени компьютера)
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Запрещаем выбирать прошедшие даты
dateInput.min = getTodayString();

function showError(input, message) {
  const errorBox = document.getElementById(input.id + "-error");
  errorBox.textContent = message;
  input.classList.add("has-error");
}

function clearError(input) {
  const errorBox = document.getElementById(input.id + "-error");
  errorBox.textContent = "";
  input.classList.remove("has-error");
}

function validateName() {
  const value = nameInput.value.trim();
  if (value.length < 2) {
    showError(nameInput, "Please enter your name (at least 2 characters).");
    return false;
  }
  clearError(nameInput);
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  const digits = value.replace(/\D/g, "");
  const onlyAllowedChars = /^[+\d\s()-]+$/.test(value);

  if (value === "") {
    showError(phoneInput, "Please enter your phone number.");
    return false;
  }
  if (!onlyAllowedChars || digits.length < 10 || digits.length > 15) {
    showError(phoneInput, "Please enter a valid phone number (10-15 digits).");
    return false;
  }
  clearError(phoneInput);
  return true;
}

function validateService() {
  if (serviceInput.value === "") {
    showError(serviceInput, "Please choose a service.");
    return false;
  }
  clearError(serviceInput);
  return true;
}

function validateDate() {
  if (dateInput.value === "") {
    showError(dateInput, "Please choose a date.");
    return false;
  }
  if (dateInput.value < getTodayString()) {
    showError(dateInput, "You can't book a date in the past.");
    return false;
  }
  clearError(dateInput);
  return true;
}

function validateTime() {
  if (timeInput.value === "") {
    showError(timeInput, "Please choose a time.");
    return false;
  }

  // Если выбран сегодняшний день, время не должно быть прошедшим
  if (dateInput.value === getTodayString()) {
    const now = new Date();
    const chosenHour = parseInt(timeInput.value.split(":")[0], 10);
    const chosenMinutes = chosenHour * 60;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (chosenMinutes <= nowMinutes) {
      showError(timeInput, "This time has already passed today.");
      return false;
    }
  }

  clearError(timeInput);
  return true;
}

nameInput.addEventListener("blur", validateName);
phoneInput.addEventListener("blur", validatePhone);
serviceInput.addEventListener("change", validateService);
dateInput.addEventListener("change", function () {
  validateDate();
  if (timeInput.value !== "") validateTime();
});
timeInput.addEventListener("change", validateTime);

// Отправка формы
form.addEventListener("submit", function (event) {
  event.preventDefault();

  successMessage.textContent = "";

  const results = [
    validateName(),
    validatePhone(),
    validateService(),
    validateDate(),
    validateTime(),
  ];
  const allValid = results.every(function (ok) {
    return ok;
  });

  if (!allValid) {
    const firstError = form.querySelector(".has-error");
    if (firstError) firstError.focus();
    return;
  }

  // Пока номер WhatsApp не указан, сообщение не отправляем
  if (WHATSAPP_NUMBER.indexOf("X") !== -1) {
    successMessage.textContent =
      "The form is correct, but the shop's WhatsApp number is not set yet (see script.js).";
    return;
  }

  // Собираем текст сообщения
  const message =
    "Hello! I would like to book an appointment.\n" +
    "Name: " + nameInput.value.trim() + "\n" +
    "Phone: " + phoneInput.value.trim() + "\n" +
    "Service: " + serviceInput.value + "\n" +
    "Date: " + dateInput.value + "\n" +
    "Time: " + timeInput.value;

  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank");

  successMessage.textContent = "WhatsApp is opening. Press \"Send\" there to complete your request.";

  form.reset();
  dateInput.min = getTodayString();
});

// ---------- 7. Год в подвале ----------
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ---------- 8. Подсветка активного пункта меню ----------
const menuLinks = document.querySelectorAll(".nav__link");
const trackedSections = document.querySelectorAll("main section[id]");

function highlightActiveLink() {
  const line = window.scrollY + header.offsetHeight + 120;
  let currentId = "";

  trackedSections.forEach(function (section) {
    if (line >= section.offsetTop) {
      currentId = section.id;
    }
  });

  menuLinks.forEach(function (link) {
    if (link.getAttribute("href") === "#" + currentId) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

// ---------- 9. Кнопка «Наверх» ----------
const toTopButton = document.getElementById("to-top");

function updateToTop() {
  if (window.scrollY > 600) {
    toTopButton.classList.add("is-visible");
  } else {
    toTopButton.classList.remove("is-visible");
  }
}

toTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- 10. Счётчики-достижения ----------
const counters = document.querySelectorAll(".stat__number");

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  const suffix = element.dataset.suffix || "";
  const duration = 1800;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    element.textContent = value.toLocaleString("en-US") + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
} else {
  counters.forEach(function (counter) {
    counter.textContent =
      parseInt(counter.dataset.count, 10).toLocaleString("en-US") +
      (counter.dataset.suffix || "");
  });
}

// ---------- 11. Полоса прогресса прокрутки ----------
const progressBar = document.getElementById("progress");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = (ratio * 100) + "%";
}

// ---------- 12. Блик на кнопках следует за курсором ----------
document.querySelectorAll(".btn").forEach(function (button) {
  button.addEventListener("mousemove", function (event) {
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--x", (event.clientX - rect.left) + "px");
    button.style.setProperty("--y", (event.clientY - rect.top) + "px");
  });
});

// ---------- Всё, что должно обновляться при прокрутке ----------
function onScroll() {
  updateHeader();
  highlightActiveLink();
  updateToTop();
  updateProgress();
}

window.addEventListener("scroll", onScroll);
window.addEventListener("resize", updateProgress);
onScroll();

// ==========================================================
// 13. Услуги и цены берутся из файла data/services.json
// ==========================================================
const servicesList = document.querySelector(".services__list");

// 5000 -> "5 000"
function formatPrice(number) {
  return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
}

function renderServices(services) {
  // Список услуг на странице
  servicesList.textContent = "";

  services.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "service";

    const info = document.createElement("div");
    info.className = "service__info";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    info.appendChild(title);
    info.appendChild(description);

    const line = document.createElement("span");
    line.className = "service__line";

    const price = document.createElement("span");
    price.className = "service__price";
    price.textContent = formatPrice(item.price);

    li.appendChild(info);
    li.appendChild(line);
    li.appendChild(price);
    servicesList.appendChild(li);
  });

  // Выпадающий список в форме записи
  serviceInput.textContent = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose a service";
  serviceInput.appendChild(placeholder);

  services.forEach(function (item) {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = item.name + " — " + formatPrice(item.price);
    serviceInput.appendChild(option);
  });
}

fetch("data/services.json", { cache: "no-store" })
  .then(function (response) {
    if (!response.ok) throw new Error("services.json not found");
    return response.json();
  })
  .then(function (data) {
    if (data.services && data.services.length > 0) {
      renderServices(data.services);
    }
  })
  .catch(function (error) {
    // Если файл не загрузился, остаётся старый список из index.html
    console.warn("Services were not loaded from file:", error);
  });

// ==========================================================
// 14. Контакты и номер WhatsApp берутся из data/contact.json
// ==========================================================
fetch("data/contact.json", { cache: "no-store" })
  .then(function (response) {
    if (!response.ok) throw new Error("contact.json not found");
    return response.json();
  })
  .then(function (contact) {
    // Номер WhatsApp: оставляем только цифры
    const digits = String(contact.whatsapp || "").replace(/\D/g, "");
    if (digits.length >= 10) {
      WHATSAPP_NUMBER = digits;
    }

    // Карточки контактов: адрес, телефон, часы, соцсети (по порядку)
    const values = [contact.address, contact.phone, contact.hours, contact.social];
    const boxes = document.querySelectorAll(".contact__card .placeholder");

    boxes.forEach(function (box, index) {
      const value = (values[index] || "").trim();
      if (value !== "") {
        box.textContent = value;
        box.classList.remove("placeholder");
      }
    });
  })
  .catch(function (error) {
    console.warn("Contacts were not loaded from file:", error);
  });

// ==========================================================
// 15. Переключатель языка (EN / RU / KZ)
// ==========================================================
let currentLang = "en";

function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = "en";
  currentLang = lang;
  document.documentElement.lang = lang;

  // Подставляем переводы в элементы с data-i18n
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const value = TRANSLATIONS[lang][element.dataset.i18n];
    if (value !== undefined) {
      element.innerHTML = value;
    }
  });

  // Подсвечиваем активную кнопку языка
  document.querySelectorAll(".lang button").forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });

  // Запоминаем выбор
  try {
    localStorage.setItem("lang", lang);
  } catch (error) {
    // если браузер не разрешает сохранение, просто не запоминаем
  }
}

document.querySelectorAll(".lang button").forEach(function (button) {
  button.addEventListener("click", function () {
    applyLanguage(button.dataset.lang);
  });
});

// При загрузке берём сохранённый язык или английский
let savedLang = "en";
try {
  savedLang = localStorage.getItem("lang") || "en";
} catch (error) {
  savedLang = "en";
}
applyLanguage(savedLang);
