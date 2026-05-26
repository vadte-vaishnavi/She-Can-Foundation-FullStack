// Store all contact form entries in the browser.
const STORAGE_KEY = "sheCanFoundationMessages";

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const messagesGrid = document.getElementById("messagesGrid");
const successToast = document.getElementById("successToast");
const clearMessages = document.getElementById("clearMessages");
const authModal = document.getElementById("authModal");
const openLogin = document.getElementById("openLogin");
const closeModal = document.getElementById("closeModal");
const tabButtons = document.querySelectorAll(".tab-btn");
const authForms = document.querySelectorAll(".auth-form");

function getMessages() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function setError(input, message) {
  const formGroup = input.parentElement;
  const errorMessage = formGroup.querySelector(".error-message");

  formGroup.classList.add("error");
  errorMessage.textContent = message;
}

function clearError(input) {
  const formGroup = input.parentElement;
  const errorMessage = formGroup.querySelector(".error-message");

  formGroup.classList.remove("error");
  errorMessage.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContactForm() {
  const name = contactForm.name;
  const email = contactForm.email;
  const message = contactForm.message;
  let isValid = true;

  [name, email, message].forEach(clearError);

  if (name.value.trim() === "") {
    setError(name, "Please enter your name.");
    isValid = false;
  }

  if (email.value.trim() === "") {
    setError(email, "Please enter your email.");
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (message.value.trim() === "") {
    setError(message, "Please write a message.");
    isValid = false;
  }

  return isValid;
}

function renderMessages() {
  const messages = getMessages();

  if (messages.length === 0) {
    messagesGrid.innerHTML = `
      <div class="empty-state">
        <h3>No messages yet</h3>
        <p>Submitted contact forms will appear here and stay after refresh.</p>
      </div>
    `;
    return;
  }

  messagesGrid.innerHTML = messages
    .map((entry) => {
      const name = escapeHTML(entry.name);
      const email = escapeHTML(entry.email);
      const message = escapeHTML(entry.message);

      return `
      <article class="message-card">
        <h3>${name}</h3>
        <a href="mailto:${email}">${email}</a>
        <p>${message}</p>
      </article>
    `;
    })
    .join("");
}

function showToast(message = "Form Submitted Successfully") {
  successToast.textContent = message;
  successToast.classList.add("show");

  setTimeout(() => {
    successToast.classList.remove("show");
  }, 2500);
}

function openAuthModal() {
  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden", "true");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateContactForm()) {
    return;
  }

  const newEntry = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim()
  };

  const messages = getMessages();
  messages.unshift(newEntry);
  saveMessages(messages);
  renderMessages();
  contactForm.reset();
  showToast();
});

clearMessages.addEventListener("click", () => {
  saveMessages([]);
  renderMessages();
});

openLogin.addEventListener("click", openAuthModal);
closeModal.addEventListener("click", closeAuthModal);

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;

    tabButtons.forEach((tab) => tab.classList.remove("active"));
    authForms.forEach((form) => form.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(`${selectedTab}Form`).classList.add("active");
  });
});

authForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    closeAuthModal();
    showToast("Authentication UI simulated");
  });
});

// Animate sections as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((section) => {
  observer.observe(section);
});

renderMessages();
