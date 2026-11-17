// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const sections = document.querySelectorAll(".section");

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

// Gallery slider + lightbox
(() => {
  const track = document.querySelector(".gallery-track");
  if (!track) return;

  const items = Array.from(track.querySelectorAll(".gallery-item"));
  const arrows = document.querySelectorAll(".gallery-arrow");
  const progress = document.querySelector(".gallery-progress span");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateSlider = () => {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    if (progress) progress.style.width = `${Math.max(8, ratio * 100)}%`;
    arrows.forEach((btn) => {
      const dir = Number(btn.dataset.dir);
      btn.disabled = dir < 0 ? track.scrollLeft <= 4 : track.scrollLeft >= max - 4;
    });
  };

  arrows.forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = (items[0].offsetWidth + 18) * 2;
      track.scrollBy({ left: Number(btn.dataset.dir) * step, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  track.addEventListener("scroll", () => requestAnimationFrame(updateSlider), { passive: true });
  window.addEventListener("resize", updateSlider);
  updateSlider();

  // Lightbox
  const box = document.querySelector(".lightbox");
  if (!box || typeof box.showModal !== "function") return;

  const img = box.querySelector(".lightbox-img");
  const count = box.querySelector(".lightbox-count");
  let index = 0;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = item.dataset.full;
    img.alt = item.querySelector("img").alt;
    count.textContent = `${index + 1} / ${items.length}`;
    [index + 1, index - 1].forEach((n) => {
      new Image().src = items[(n + items.length) % items.length].dataset.full;
    });
  };

  const open = (i) => {
    show(i);
    document.body.style.overflow = "hidden";
    box.showModal();
  };

  items.forEach((item, i) => item.addEventListener("click", () => open(i)));

  box.querySelector(".lightbox-close").addEventListener("click", () => box.close());
  box.querySelector(".lightbox-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lightbox-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("close", () => { document.body.style.overflow = ""; });

  // Click on the dark area closes, click on the image does not
  box.addEventListener("click", (e) => {
    if (e.target === box) box.close();
  });

  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe on touch devices
  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });
})();
