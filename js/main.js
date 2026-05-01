// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Section reveal animations.
// CSS hides .section only when <body class="reveal"> is set, so no-JS users see everything.
const sections = document.querySelectorAll(".section");
const isLegalPage = document.body.classList.contains("legal-page");

if (sections.length && !isLegalPage && "IntersectionObserver" in window) {
  document.body.classList.add("reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((section) => observer.observe(section));
}

// Active nav link on scroll
const navLinks = document.querySelectorAll(".nav a");

if (navLinks.length && sections.length) {
  let scrollTicking = false;
  const updateActiveNav = () => {
    let current = "";
    sections.forEach((section) => {
      if (section.classList.contains("hidden")) return;
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
    scrollTicking = false;
  };
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateActiveNav);
      scrollTicking = true;
    }
  }, { passive: true });
}

// Mobile burger menu
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when a link is clicked
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
