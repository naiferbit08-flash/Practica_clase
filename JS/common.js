(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");

  if (!header || !toggle) {
    return;
  }

  const navigationId = toggle.getAttribute("aria-controls");
  const navigation = navigationId ? document.getElementById(navigationId) : null;

  if (!navigation) {
    return;
  }

  const closeMenu = () => {
    header.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    header.classList.toggle("is-menu-open", !isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const requestedPage = window.location.pathname.split("/").pop() || "index.html";
  const currentPage = {
    "sharky.html": "catalogo.html",
    "evento.html": "eventos.html",
  }[requestedPage] || requestedPage;
  navigation.querySelectorAll(".site-nav__link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  window.matchMedia("(min-width: 851px)").addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
})();
