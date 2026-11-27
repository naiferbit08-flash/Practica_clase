const sharkies = [
  {
    id: "sharky-rosa",
    name: "Sharky rosa",
    image: "../IMAGES/Catalogo_sharkys/shark_rosa.png",
    alt: "Sharky rosa en una fiesta",
    description: "El modelo rosa de la colección Sharky.",
    gallery: [],
  },
  {
    id: "sharky-corazones",
    name: "Sharky corazones",
    image: "../IMAGES/Catalogo_sharkys/shark_corazones.png",
    alt: "Sharky blanco con corazones rosas",
    description: "El Sharky blanco con corazones rosas.",
    gallery: [
      {
        image: "../IMAGES/equipo_fiestas_ambiente/Captura de pantalla 2026-11-26 192738.png",
        alt: "Sharky de corazones en una cabina de DJ",
      },
      {
        image: "../IMAGES/general/Captura de pantalla 2026-11-26 194722.png",
        alt: "Sharky de corazones en una fiesta",
      },
    ],
  },
  {
    id: "sharky-barca",
    name: "Sharky Barça",
    image: "../IMAGES/Catalogo_sharkys/shark_barça.png",
    alt: "Sharky con franjas azulgrana",
    description: "El modelo azulgrana de la colección Sharky.",
    gallery: [],
  },
  {
    id: "sharky-marciano",
    name: "Sharky marciano",
    image: "../IMAGES/Catalogo_sharkys/shark_marciano.png",
    alt: "Sharky verde de aspecto alienígena",
    description: "El modelo verde de aspecto alienígena.",
    gallery: [
      {
        image: "../IMAGES/general/Captura de pantalla 2026-11-26 192334.png",
        alt: "Asistentes con un Sharky marciano verde",
      },
    ],
  },
  {
    id: "sharky-dorado",
    name: "Sharky dorado",
    image: "../IMAGES/Catalogo_sharkys/shark_dorado.png",
    alt: "Sharky dorado sobre un fondo claro",
    description: "El modelo dorado de la colección Sharky.",
    gallery: [],
  },
  {
    id: "sharky-marron",
    name: "Sharky marrón",
    image: "../IMAGES/Catalogo_sharkys/Shark_marron.png",
    alt: "Sharky marrón claro en exterior",
    description: "El modelo marrón de la colección Sharky.",
    gallery: [],
  },
  {
    id: "sharky-azul",
    name: "Sharky azul",
    image: "../IMAGES/Catalogo_sharkys/Shark_azul.png",
    alt: "Sharky azul claro",
    description: "El modelo azul de la colección Sharky.",
    gallery: [],
  },
  {
    id: "llavero-sharky",
    name: "Llavero Sharky",
    image: "../IMAGES/Catalogo_sharkys/llavero_shark.png",
    alt: "Llavero Sharky blanco",
    description: "La versión mini de Sharky para llevar contigo.",
    gallery: [],
  },
  {
    id: "sharky-rojo",
    name: "Sharky rojo",
    image: "../IMAGES/Catalogo_sharkys/Shark_rojo.png",
    alt: "Sharky rojo levantado sobre una multitud",
    description: "El modelo rojo de la colección Sharky.",
    gallery: [],
  },
];

const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const createSharkyCard = (sharky) => {
  const card = createElement("article", "sharky-card");
  const media = createElement("div", "sharky-card__media");
  const image = createElement("img");
  image.src = sharky.image;
  image.alt = sharky.alt;
  image.loading = "lazy";
  media.append(image);

  const content = createElement("div", "sharky-card__content");
  const name = createElement("h3", "sharky-card__title");
  const nameLink = createElement("a", "", sharky.name);
  nameLink.href = `sharky.html?id=${encodeURIComponent(sharky.id)}`;
  name.append(nameLink);

  const discover = createElement("a", "sharky-card__link", "Descubrir Sharky");
  discover.href = nameLink.href;
  discover.append(createElement("span", "", "→"));
  content.append(name, discover);
  card.append(media, content);
  return card;
};

document.querySelectorAll("[data-sharky-catalog], [data-sharky-featured]").forEach((list) => {
  const isFeatured = list.hasAttribute("data-sharky-featured");
  const count = Number(list.dataset.limit);
  const items = isFeatured && Number.isFinite(count) && count > 0 ? sharkies.slice(0, count) : sharkies;
  items.forEach((sharky) => list.append(createSharkyCard(sharky)));
});

const detail = document.querySelector("[data-sharky-detail]");
if (detail) {
  const requestedId = new URLSearchParams(window.location.search).get("id");
  const sharky = sharkies.find((item) => item.id === requestedId);

  if (!sharky) {
    const section = createElement("div", "sharky-detail__not-found");
    section.append(
      createElement("p", "eyebrow", "Ficha Sharky"),
      createElement("h1", "", "No encontramos este Sharky"),
      createElement("p", "sharky-detail__description", "Vuelve al catálogo para descubrir los modelos disponibles."),
    );
    const back = createElement("a", "button button--secondary sharky-detail__back", "Volver al catálogo");
    back.href = "catalogo.html";
    section.append(back);
    detail.append(section);
  } else {
    document.title = `${sharky.name} | SHARKY WEB`;
    const media = createElement("figure", "sharky-detail__media");
    const image = createElement("img", "sharky-detail__main-image");
    image.src = sharky.image;
    image.alt = sharky.alt;
    media.append(image);

    const content = createElement("div", "sharky-detail__content");
    content.append(
      createElement("p", "eyebrow", "Ficha Sharky"),
      createElement("h1", "", sharky.name),
      createElement("p", "sharky-detail__description", sharky.description),
    );

    const where = createElement("section", "sharky-detail__where");
    where.append(
      createElement("h2", "", "¿Dónde ha estado?"),
      createElement("p", "", "Las fiestas asociadas a este modelo se añadirán cuando podamos confirmarlas."),
    );
    const back = createElement("a", "button button--secondary sharky-detail__back", "Volver al catálogo");
    back.href = "catalogo.html";
    content.append(where, back);
    detail.append(media, content);

    if (sharky.gallery.length) {
      const gallery = createElement("section", "sharky-detail__gallery");
      gallery.append(createElement("h2", "", "Más momentos de este Sharky"));
      const galleryGrid = createElement("div", "sharky-detail__gallery-grid");
      sharky.gallery.forEach((photo) => {
        const galleryImage = createElement("img");
        galleryImage.src = photo.image;
        galleryImage.alt = photo.alt;
        galleryImage.loading = "lazy";
        galleryGrid.append(galleryImage);
      });
      gallery.append(galleryGrid);
      detail.append(gallery);
    }
  }
}