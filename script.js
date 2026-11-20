document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Theme toggle (remembers choice) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Typing effect ---------- */
  const roles = ["Software Developer", "Full-Stack Learner", "API Builder", "Problem Solver"];
  const typedEl = document.getElementById("typed");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = roles[roleIdx];
    typedEl.textContent = word.slice(0, charIdx);

    if (!deleting && charIdx < word.length) {
      charIdx++;
      setTimeout(type, 90);
    } else if (!deleting) {
      deleting = true;
      setTimeout(type, 1400);
    } else if (charIdx > 0) {
      charIdx--;
      setTimeout(type, 45);
    } else {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(type, 300);
    }
  }
  type();

  /* ---------- Profile photo fallback ---------- */
  const img = document.getElementById("profileImg");
  const fallback = document.getElementById("photoFallback");
  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "flex";
  });

  /* ---------- Scroll reveal + animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    const target = Number(el.dataset.count);
    let current = 0;
    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 250);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav nav a");

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) =>
        l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
      );
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Project filters ---------- */
  const filterBtns = document.querySelectorAll("#filters .chip");
  const cards = document.querySelectorAll("#projectGrid .card");

  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        card.classList.toggle("hidden", filter !== "all" && !tags.includes(filter));
      });
      clearSkillHighlight();
    })
  );

  /* ---------- Skill click highlights matching projects ---------- */
  const skillBtns = document.querySelectorAll("#skillList .skill");

  function clearSkillHighlight() {
    skillBtns.forEach((b) => b.classList.remove("active"));
    cards.forEach((c) => c.classList.remove("dim", "match"));
  }

  skillBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const wasActive = btn.classList.contains("active");
      clearSkillHighlight();
      if (wasActive) return;

      btn.classList.add("active");
      const skill = btn.dataset.skill.toLowerCase();

      cards.forEach((card) => {
        const used = [...card.querySelectorAll(".tags li")].some(
          (li) => li.textContent.trim().toLowerCase() === skill
        );
        card.classList.add(used ? "match" : "dim");
      });

      document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
    })
  );

  /* ---------- Expandable experience ---------- */
  document.querySelectorAll(".job-head").forEach((head) =>
    head.addEventListener("click", () => {
      const job = head.parentElement;
      const open = job.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
    })
  );

  /* ---------- Contact form (opens email app) ---------- */
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const msg = document.getElementById("cMsg").value.trim();

    const subject = encodeURIComponent("Portfolio enquiry from " + name);
    const body = encodeURIComponent(msg + "\n\nFrom: " + name + " (" + email + ")");
    window.location.href = "mailto:liamabr31@gmail.com?subject=" + subject + "&body=" + body;
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
