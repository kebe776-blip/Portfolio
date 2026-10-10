/* =============================================================
   PORTFOLIO — script.js
   JavaScript natif (aucun framework / aucune dépendance).
   Modules :
     1. Thème clair / sombre (persistant via localStorage)
     2. Menu mobile (ouverture, fermeture, accessibilité)
     3. En-tête « collant » au défilement
     4. Apparition des sections au défilement (IntersectionObserver)
      5. Lien de navigation actif
      6. Effet de dactylographie sur le titre
      7. Copie de l'adresse e-mail
      8. Bouton « retour en haut »
      9. Année courante dans le pied de page
   Compatible statique : aucun serveur ni clé API requis.
   ============================================================= */

(function () {
  "use strict";

  /* Sélecteurs utilitaires ------------------------------------------------ */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. THÈME CLAIR / SOMBRE
     Le thème est stocké dans localStorage ; un script inline dans le
     <head> n'étant pas présent, on applique le thème dès le chargement
     pour limiter le clignotement (FOUC).
     ------------------------------------------------------------------ */
  const THEME_KEY = "portfolio-theme";
  const root = document.documentElement; // élément <html>
  const themeToggle = $("#theme-toggle");

  /** Lit la préférence système puis le choix utilisateur. */
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  /** Applique un thème et met à jour les métadonnées. */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    // Couleur de la barre mobile (navigateurs supportant la meta)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#05070f" : "#eef2fb");

    // Libellé accessible du bouton
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"
      );
    }
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ------------------------------------------------------------------
     2. MENU MOBILE
     ------------------------------------------------------------------ */
  const burger = $("#burger");
  const mobileMenu = $("#mobile-menu");
  const overlay = $("#overlay");
  const menuClose = $("#menu-close");

  function isMenuOpen() {
    return mobileMenu && !mobileMenu.hasAttribute("hidden");
  }

  function openMenu() {
    if (!mobileMenu || !burger || !overlay) return;
    mobileMenu.hidden = false;
    overlay.hidden = false;
    // Force un reflow afin que la transition de transform s'applique
    void mobileMenu.offsetWidth;
    mobileMenu.classList.add("is-open");
    overlay.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fermer le menu");
    document.body.style.overflow = "hidden"; // bloque le défilement
    const firstLink = $(".mobile-menu__link", mobileMenu);
    if (firstLink) firstLink.focus();
  }

  function closeMenu(returnFocus = true) {
    if (!mobileMenu || !burger || !overlay) return;
    mobileMenu.classList.remove("is-open");
    overlay.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu");
    document.body.style.overflow = "";

    // On attend la fin de l'animation de fermeture avant de masquer le panneau.
    // Garde-fou : si l'utilisateur rouvre le menu pendant la transition,
    // on n'applique pas le masquage et on ignore les transitions d'enfants.
    const onEnd = (e) => {
      if (e && e.target !== mobileMenu) return;
      if (e && e.propertyName && e.propertyName !== "transform") return;
      if (mobileMenu.classList.contains("is-open")) return;
      mobileMenu.hidden = true;
      overlay.hidden = true;
      mobileMenu.removeEventListener("transitionend", onEnd);
    };
    if (reducedMotion) {
      mobileMenu.hidden = true;
      overlay.hidden = true;
    } else {
      mobileMenu.addEventListener("transitionend", onEnd);
    }

    if (returnFocus) burger.focus();
  }

  if (burger && mobileMenu && overlay) {
    burger.addEventListener("click", () => (isMenuOpen() ? closeMenu() : openMenu()));
    overlay.addEventListener("click", () => closeMenu());
    if (menuClose) menuClose.addEventListener("click", () => closeMenu());

    // Ferme le menu après avoir cliqué sur un lien
    $$(".mobile-menu__link").forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });

    // Fermeture avec la touche Échap + garde du focus dans le menu
    document.addEventListener("keydown", (e) => {
      if (!isMenuOpen()) return;

      if (e.key === "Escape") {
        closeMenu();
        return;
      }

      if (e.key === "Tab") {
        const focusables = $$("a[href], button:not([disabled])", mobileMenu);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Réinitialise l'état si l'on repasse en vue bureau
    window.matchMedia("(min-width: 801px)").addEventListener("change", (e) => {
      if (e.matches && isMenuOpen()) closeMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     3. EN-TÊTE COLLANT + BOUTON « RETOUR EN HAUT »
     ------------------------------------------------------------------ */
  const header = $("#header");
  const toTop = $("#to-top");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     4. APPARITION DES SECTIONS AU DÉFILEMENT
     ------------------------------------------------------------------ */
  const revealEls = $$(".reveal");

  if (revealEls.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // une seule animation
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------------------------
     5. LIEN DE NAVIGATION ACTIF
     ------------------------------------------------------------------ */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
          // Reflète aussi dans le menu mobile
          $$(".mobile-menu__link").forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ------------------------------------------------------------------
     6. EFFET DACTYLOGRAPHIE (héro)
     Le titre complet s'écrit, marque une pause, s'efface puis se
     réécrit en boucle ; désactivé si l'utilisateur réduit les animations.
     ------------------------------------------------------------------ */
  const typedTarget = $("#typed-text");
  const WORDS = ["Instituteur • Développeur VBA & Vibe Coder"];

  if (typedTarget && !reducedMotion) {
    let wordIndex = 0;
    let charIndex = WORDS[0].length;
    let deleting = false;

    const TYPE_SPEED = 75;
    const DELETE_SPEED = 40;
    const HOLD_TIME = 1900;

    function tick() {
      const word = WORDS[wordIndex];

      if (deleting) {
        charIndex = Math.max(0, charIndex - 1);
      } else {
        charIndex = Math.min(word.length, charIndex + 1);
      }

      typedTarget.textContent = word.slice(0, charIndex);

      let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = HOLD_TIME;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % WORDS.length;
        delay = 350;
      }

      window.setTimeout(tick, delay);
    }

    window.setTimeout(tick, HOLD_TIME);
  }

  /* ------------------------------------------------------------------
     7. COPIE DE L'ADRESSE E-MAIL
     ------------------------------------------------------------------ */
  const copyBtn = $("#copy-email");
  const copyFeedback = $("#copy-feedback");

  if (copyBtn && copyFeedback) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "";
      const original = copyBtn.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Repli pour les contextes non sécurisés (ex. ouverture en file://)
          const ta = document.createElement("textarea");
          ta.value = email;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (!ok) throw new Error("copie impossible");
        }
        copyFeedback.textContent = "Adresse e-mail copiée !";
        copyBtn.textContent = "Copié ✓";
      } catch (err) {
        copyFeedback.textContent = "Copie impossible — sélectionnez manuellement l'adresse.";
      }

      window.setTimeout(() => {
        copyFeedback.textContent = "";
        copyBtn.textContent = original;
      }, 2600);
    });
  }

  /* ------------------------------------------------------------------
     8. ANNÉE COURANTE (pied de page)
     ------------------------------------------------------------------ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
