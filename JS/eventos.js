const eventArchive = [
  { id: "amok", name: "Amok", poster: "../IMAGES/cartelera eventos/Amok.png" },
  { id: "bandidos", name: "Bandidos", poster: "../IMAGES/cartelera eventos/bandidos.png" },
  { id: "can-tarranc", name: "Can Tarranc", poster: "../IMAGES/cartelera eventos/can tarranc.png" },
  { id: "cel-social-club", name: "El Cel Social Club", poster: "../IMAGES/cartelera eventos/cel social club.png" },
  { id: "cocoa", name: "Cocoa", poster: "../IMAGES/cartelera eventos/cocoa.png" },
  { id: "dowtown", name: "Dowtown", poster: "../IMAGES/cartelera eventos/dowtown.png" },
  { id: "fin-ano-barcelona", name: "Fin de Año · Barcelona", poster: "../IMAGES/cartelera eventos/fin año_ barcelona.png" },
  { id: "fin-ano-madrid", name: "Fin de Año · Madrid", poster: "../IMAGES/cartelera eventos/finAño_madrid.png" },
  { id: "la-fabrica", name: "La Fábrica", poster: "../IMAGES/cartelera eventos/la fabrica.png" },
  { id: "marmarela", name: "Marmarela", poster: "../IMAGES/cartelera eventos/Marmarela.png" },
  { id: "occo", name: "Occo", poster: "../IMAGES/cartelera eventos/occo.png" },
  { id: "pelicano", name: "Pelicano", poster: "../IMAGES/cartelera eventos/pelicano.png" },
  { id: "villa-shark", name: "Villa Shark", poster: "../IMAGES/cartelera eventos/villa shark.png" },
  { id: "wsf-andorra", name: "WSF Andorra", poster: "../IMAGES/cartelera eventos/wsf.png" },
  { id: "x-equis", name: "X Equis", poster: "../IMAGES/cartelera eventos/x equis.png" },
].map((event) => ({
  ...event,
  date: null,
  time: null,
  location: null,
  description: "Cartel guardado en el archivo visual de SHARK EVENTS. Los datos de una próxima edición están pendientes de confirmación.",
  additionalInfo: "No se ha añadido enlace de entradas porque no hay una URL confirmada.",
  ticketsUrl: null,
}));

const demoSharkyImage = "../IMAGES/Catalogo_sharkys/shark_rosa.png";
const calendarDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const makeElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const makeEventLink = (event, className = "") => {
  const link = makeElement("a", className);
  link.href = `evento.html?id=${encodeURIComponent(event.id)}`;
  link.setAttribute("aria-label", `Ver detalle de ${event.name}`);
  return link;
};

const getValidTicketUrl = (value) => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value.trim())) {
    return null;
  }
  try {
    const url = new URL(value.trim());
    return url.hostname ? url.href : null;
  } catch (error) {
    return null;
  }
};

const renderEventPreview = (event) => {
  const card = makeElement("article", "event-preview-card");
  const link = makeEventLink(event, "event-preview-card__link");
  const image = makeElement("img", "event-preview-card__image");
  image.src = event.poster;
  image.alt = `Cartel de ${event.name}`;
  image.loading = "lazy";
  const content = makeElement("div", "event-preview-card__content");
  content.append(
    makeElement("h3", "event-preview-card__title", event.name),
    makeElement("p", "event-preview-card__meta", "Cartel de archivo · fecha por confirmar"),
  );
  link.append(image, content);
  card.append(link);
  return card;
};

document.querySelectorAll("[data-event-preview]").forEach((list) => {
  const count = Number(list.dataset.limit);
  const events = Number.isFinite(count) && count > 0 ? eventArchive.slice(0, count) : eventArchive;
  events.forEach((event) => list.append(renderEventPreview(event)));
});

const archiveContainer = document.querySelector("[data-event-archive]");
if (archiveContainer) {
  eventArchive.forEach((event) => {
    const card = makeElement("article", "event-archive-card");
    const link = makeEventLink(event, "event-archive-card__poster");
    const image = makeElement("img");
    image.src = event.poster;
    image.alt = `Cartel de ${event.name}`;
    image.loading = "lazy";
    link.append(image);

    const body = makeElement("div", "event-archive-card__body");
    const title = makeElement("h3");
    const detailLink = makeElement("a", "event-archive-card__title-link", event.name);
    detailLink.href = `evento.html?id=${encodeURIComponent(event.id)}`;
    title.append(detailLink);
    body.append(
      title,
      makeElement("p", "", "Próxima fecha: por confirmar"),
      makeElement("p", "", "Ubicación: por confirmar"),
    );
    const action = makeEventLink(event, "event-archive-card__action");
    action.append(document.createTextNode("Ver detalle "), makeElement("span", "", "→"));
    card.append(link, body, action);
    archiveContainer.append(card);
  });
}

const calendar = document.querySelector(".calendar");
if (calendar) {
  let selectedDate = new Date();
  selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  let currentView = "month";

  const heading = calendar.querySelector("[data-calendar-heading]");
  const weekdays = calendar.querySelector("[data-calendar-weekdays]");
  const grid = calendar.querySelector("[data-calendar-grid]");
  const selectionDate = calendar.querySelector("[data-calendar-selection-date]");
  const selectionEvents = calendar.querySelector("[data-calendar-selection-events]");
  const weekdayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const eventsOnDate = (date) => eventArchive.filter((event) => {
    if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      return false;
    }
    return event.date === [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  });

  const startOfWeek = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start;
  };

  const visibleDates = () => {
    if (currentView === "day") {
      return [selectedDate];
    }
    if (currentView === "week") {
      const start = startOfWeek(selectedDate);
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
      });
    }

    const firstOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const count = Math.ceil((offset + daysInMonth) / 7) * 7;
    return Array.from({ length: count }, (_, index) => new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      index - offset + 1,
    ));
  };

  const visibleHeading = (dates) => {
    if (currentView === "day") {
      return calendarDateFormatter.format(selectedDate);
    }
    if (currentView === "week") {
      return `${calendarDateFormatter.format(dates[0])} – ${calendarDateFormatter.format(dates[6])}`;
    }
    return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(selectedDate);
  };

  const renderSelection = () => {
    selectionDate.textContent = calendarDateFormatter.format(selectedDate);
    selectionEvents.replaceChildren();
    const events = eventsOnDate(selectedDate);
    if (!events.length) {
      selectionEvents.append(makeElement("p", "calendar__empty", "No hay eventos con fecha confirmada para este día."));
      return;
    }
    events.forEach((event) => {
      const link = makeEventLink(event, "calendar-event");
      const image = makeElement("img");
      image.src = event.poster;
      image.alt = "";
      link.append(
        image,
        makeElement("span", "", event.name),
        makeElement("span", "calendar-event__meta", event.location || "Ubicación por confirmar"),
      );
      selectionEvents.append(link);
    });
  };

  const renderCalendar = () => {
    const dates = visibleDates();
    heading.textContent = visibleHeading(dates);
    grid.className = `calendar__grid calendar__grid--${currentView}`;
    weekdays.replaceChildren();
    weekdays.hidden = currentView === "day";
    if (currentView !== "day") {
      weekdayNames.forEach((name) => weekdays.append(makeElement("span", "", name)));
    }
    grid.replaceChildren();

    dates.forEach((date) => {
      const dateEvents = eventsOnDate(date);
      const button = makeElement("button", "calendar__day");
      button.type = "button";
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", calendarDateFormatter.format(date));
      button.setAttribute("aria-pressed", String(date.toDateString() === selectedDate.toDateString()));
      if (currentView === "month" && date.getMonth() !== selectedDate.getMonth()) {
        button.classList.add("is-outside-month");
      }
      if (date.toDateString() === selectedDate.toDateString()) {
        button.classList.add("is-selected");
      }
      button.append(makeElement("span", "calendar__day-number", String(date.getDate())));
      if (dateEvents.length) {
        button.classList.add("has-events");
        button.append(makeElement("span", "calendar__event-dot", `${dateEvents.length} eventos`));
      }
      button.addEventListener("click", () => {
        selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        renderCalendar();
      });
      grid.append(button);
    });
    renderSelection();
  };

  calendar.querySelectorAll("[data-calendar-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const amount = Number(button.dataset.calendarStep);
      if (currentView === "month") {
        selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + amount, 1);
      } else {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + amount * (currentView === "week" ? 7 : 1));
        selectedDate = nextDate;
      }
      renderCalendar();
    });
  });

  calendar.querySelectorAll("[data-calendar-view]").forEach((button) => {
    button.addEventListener("click", () => {
      currentView = button.dataset.calendarView;
      calendar.querySelectorAll("[data-calendar-view]").forEach((viewButton) => {
        viewButton.setAttribute("aria-pressed", String(viewButton === button));
      });
      renderCalendar();
    });
  });

  renderCalendar();
}

const eventDetail = document.querySelector("[data-event-detail]");
if (eventDetail) {
  const requestedId = new URLSearchParams(window.location.search).get("id");
  const event = eventArchive.find((item) => item.id === requestedId);

  if (!event) {
    const message = makeElement("div", "event-detail__not-found");
    message.append(
      makeElement("p", "eyebrow", "Ficha de evento"),
      makeElement("h1", "", "No encontramos este evento"),
      makeElement("p", "", "Vuelve al calendario para consultar los carteles disponibles."),
    );
    const back = makeElement("a", "button button--secondary", "Volver al calendario");
    back.href = "eventos.html";
    message.append(back);
    eventDetail.append(message);
  } else {
    document.title = `${event.name} | SHARKY WEB`;
    const poster = makeElement("img", "event-detail__poster");
    poster.src = event.poster;
    poster.alt = `Cartel de ${event.name}`;

    const demo = makeElement("img", "event-detail__sharky");
    demo.src = demoSharkyImage;
    demo.alt = "Sharky rosa de demostración";

    const content = makeElement("div", "event-detail__content");
    content.append(
      makeElement("p", "eyebrow", "Archivo de fiestas"),
      makeElement("h1", "", event.name),
      makeElement("p", "event-detail__description", event.description),
    );

    const facts = makeElement("dl", "event-detail__facts");
    [
      ["Fecha", event.date || "Por confirmar"],
      ["Horario", event.time || "Por confirmar"],
      ["Ubicación", event.location || "Por confirmar"],
      ["Sharky", "Sharky rosa de demostración"],
    ].forEach(([label, value]) => {
      facts.append(makeElement("dt", "", label), makeElement("dd", "", value));
    });
    content.append(facts, makeElement("p", "event-detail__additional", event.additionalInfo));

    const back = makeElement("a", "button button--secondary", "Volver al calendario");
    back.href = "eventos.html";
    content.append(back);

    const layout = makeElement("div", "event-detail__layout");
    const images = makeElement("div", "event-detail__images");
    const posterFigure = makeElement("figure", "event-detail__poster-frame");
    posterFigure.append(poster);
    const demoFigure = makeElement("figure", "event-detail__demo-frame");
    demoFigure.append(demo, makeElement("figcaption", "", "Sharky rosa · imagen de demostración"));
    images.append(posterFigure, demoFigure);
    layout.append(images, content);
    eventDetail.append(layout);

    const ticketUrl = getValidTicketUrl(event.ticketsUrl);
    if (ticketUrl) {
      const ticketLink = makeElement("a", "button button--primary", "Comprar entradas");
      ticketLink.href = ticketUrl;
      ticketLink.target = "_blank";
      ticketLink.rel = "noopener noreferrer";
      content.append(ticketLink);
    }
  }
}