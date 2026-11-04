/**
 * ============================================================================
 * ARCHIVO 3: app.js - MOTOR ESCALABLE, SEGURO Y MULTILIBRERÍA
 * Librerías integradas: jQuery, Lodash (_), Anime.js (anime), D3.js (d3), React
 * ============================================================================
 */

"use strict";

/* ============================================================================
   1. CONFIGURACIÓN MAESTRA ESCALABLE (REGLA 6)
   Modifica este bloque para adaptar la página a CUALQUIER rubro en 5 minutos
   (Joyería, Barbería & Streetwear, Gastronomía, Calzado, Tecnología, etc.)
   ============================================================================ */
const STORE_CONFIG = {
  brandName: "kalon",
  brandSpaced: "K A L O N",
  currencySymbol: "$",
  whatsappNumber: "573134052039", // Cambia por tu número con código de país
  
  // Textos del cintillo superior en movimiento (Segundo 0:08 del video 1)
  marqueeMessages: [
    "ENVÍO GRATIS EN COMPRAS SUPERIORES A $150.000",
    "DISEÑOS EXCLUSIVOS DE GRADO PREMIUM",
    "MATERIALES HIPOALERGÉNICOS Y RESISTENTES AL AGUA",
    "ATENCIÓN PERSONALIZADA Y GARANTÍA CERTIFICADA"
  ],

  // Menú lateral desplegable (Segundos 0:34 - 0:35 del video 1)
  navigation: [
    { label: "INICIO", href: "#main-content", hasSubmenu: false },
    { label: "EXPLORAR EN 3D", href: "#showcase-3d", hasSubmenu: false },
    { label: "COLECCIÓN PRINCIPAL", href: "#colecciones", hasSubmenu: true },
    { label: "CATEGORÍAS", href: "#categorias", hasSubmenu: true },
    { label: "NOVEDADES", href: "#novedades", hasSubmenu: true },
    { label: "ESCAPARATE INTERACTIVO", href: "#lookbook", hasSubmenu: false },
    { label: "CUIDADOS Y CALIDAD", href: "#cuidados", hasSubmenu: false },
    { label: "TESTIMONIOS", href: "#testimonios", hasSubmenu: false },
    { label: "VISÍTANOS / CONTACTO", href: "#ubicacion", hasSubmenu: false }
  ],

  // Portada Principal / Hero (Segundos 0:08 - 0:09 del video 1)
  hero: {
    kicker: "DISEÑOS DE LUJO PARA",
    titleMain: "REFLEJAR TU ESENCIA EN CADA",
    titleAccent: "detalle",
    lead: "La unión perfecta entre arte, comodidad y autenticidad en cada pieza.",
    ctaText: "COMPRAR AHORA",
    bgImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    badges: [
      { icon: "ri-shield-check-line", text: "Materiales Hipoalergénicos" },
      { icon: "ri-drop-line", text: "Resistentes al agua y uso diario" }
    ]
  },

  // Visor 3D Interactivo (Puedes poner cualquier archivo .glb tuyo o de GitHub)
  model3D: {
    subtitle: "INTERACCIÓN 360° EN TIEMPO REAL",
    title: "Explora cada ángulo en 3D",
    desc: "Gira con tu dedo o cursor nuestro modelo interactivo antes de comprar.",
    // URL de modelo .glb (Puedes reemplazarlo por una joya, máquina de barbería, gorra, etc.)
    glbUrl: "https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb"
  },

  // Carrusel de Sets / Colecciones Destacadas (Segundos 0:10 - 0:16 del video 1)
  setsProducts: [
    {
      id: "set-opalo",
      title: "SET ÓPALO TITANIO",
      oldPrice: 155000,
      price: 124000,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-black",
      title: "SET BLACK TITANIO",
      oldPrice: 155600,
      price: 124500,
      inStock: false, // Se mostrará como AGOTADO igual que en el segundo 0:11 del video 1
      isOffer: true,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-purpura",
      title: "SET PÚRPURA TITANIO",
      oldPrice: 118000,
      price: 94400,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-olive",
      title: "SET OLIVE TITANIO",
      oldPrice: 202000,
      price: 171500,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-monarca",
      title: "SET MONARCA TITANIO",
      oldPrice: 239500,
      price: 203500,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // Bloques de Categorías Visuales (Segundos 0:17 - 0:20 del video 1)
  categories: [
    {
      id: "cat-1",
      name: "Piercing Ear",
      image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
      filterTarget: "EAR"
    },
    {
      id: "cat-2",
      name: "Piercing Face",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
      filterTarget: "FACE"
    },
    {
      id: "cat-3",
      name: "Piercing Body",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
      filterTarget: "BODY"
    }
  ],

  // Filtros y Productos de "Novedades" (Segundos 0:21 - 0:22 del video 1)
  arrivalFilters: ["CUIDADOS", "BODY", "EAR", "FACE"],
  arrivalsProducts: [
    {
      id: "nov-hilos",
      title: "HILOS DE LIMPIEZA",
      category: "CUIDADOS",
      oldPrice: 25000,
      price: 18000,
      inStock: true,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nov-spray",
      title: "SPRAY AFTERCARE PRO",
      category: "CUIDADOS",
      oldPrice: 45000,
      price: 36000,
      inStock: true,
      image: "https://images.unsplash.com/photo-1608248597359-0e6d526a6c18?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nov-body-gold",
      title: "CURVED BARBELL GOLD",
      category: "BODY",
      oldPrice: 95000,
      price: 78000,
      inStock: true,
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nov-ear-helix",
      title: "ARO HELIX ZIRCONIA",
      category: "EAR",
      oldPrice: 82000,
      price: 68000,
      inStock: true,
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nov-face-septum",
      title: "CLICKER SEPTUM TITANIO",
      category: "FACE",
      oldPrice: 89000,
      price: 72000,
      inStock: true,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // Escaparate Interactivo D3.js "Toca cada punto" (Segundos 0:22 - 0:24 del video 1)
  lookbook: {
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
    hotspots: [
      { id: "hs-1", x: 38, y: 28, title: "Labret Marquise Gold", price: 65000 },
      { id: "hs-2", x: 64, y: 36, title: "stud Tragus Titanio", price: 48000 },
      { id: "hs-3", x: 52, y: 54, title: "Aro Conch Brillante", price: 79000 },
      { id: "hs-4", x: 46, y: 74, title: "Candonga Lóbulo Minimal", price: 55000 }
    ]
  },

  // Sección de Cuidados y 4 Garantías (Segundos 0:24 - 0:26 del video 1)
  carePromo: {
    kicker: "AFTERCARE PROFESIONAL",
    title: "Tus piezas también merecen cuidados.",
    desc: "Todo lo necesario para un mantenimiento seguro, limpieza profesional y durabilidad diaria.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    benefits: [
      { icon: "ri-shield-star-line", text: "Higiene segura donde estés" },
      { icon: "ri-award-line", text: "Materiales estériles y certificados" },
      { icon: "ri-sparkling-line", text: "Limpieza suave y efectiva" },
      { icon: "ri-heart-pulse-line", text: "Adaptación y cuidado óptimo" }
    ]
  },

  // Testimonios (Segundo 0:27 del video 1)
  testimonials: [
    {
      name: "Valentina M.",
      quote: "La calidad del titanio es increíble, cero alergias y el brillo se mantiene intacto.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Camila R.",
      quote: "Me encantó la asesoría por WhatsApp y lo rápido que llegó mi set completo.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Daniela G.",
      quote: "Diseños súper delicados y elegantes, exactamente como se ven en el catálogo.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // Ubicación y Contacto (Segundo 0:28 del video 1)
  location: {
    title: "Visítanos en nuestra sede",
    city: "ATENCIÓN EXCLUSIVA Y ASESORÍA",
    address: "Calle Principal #26A-16, Zona Comercial",
    hours: "Lunes – Sábado • 10AM – 6PM",
    phone: "+57 313 405 2039"
  },

  // Acordeones del Pie de Página (Segundos 0:29 - 0:31 del video 1)
  footerAccordions: [
    {
      title: "SOPORTE",
      content: "Preguntas frecuentes, guía de tallas, envíos nacionales, cambios y garantías de satisfacción."
    },
    {
      title: "CATEGORÍAS",
      content: "Sets completos, Línea de Titanio Grado Implante, Cuidados Profesionales y Accesorios."
    },
    {
      title: "CONTÁCTANOS",
      content: "Atención personalizada vía WhatsApp, correo electrónico oficial y agendamiento de citas."
    }
  ]
};

/* ============================================================================
   2. UTILIDADES DE SEGURIDAD (REGLA 5) Y FORMATO DE MONEDA
   ============================================================================ */

// Sanitiza cualquier texto ingresado por el usuario para evitar ataques XSS
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return _.escape(str.trim()).replace(/[<>/"'`;()]/g, "");
}

// Formatea precios numéricos a formato legible ($ 124.000)
function formatCurrency(amount) {
  return `${STORE_CONFIG.currencySymbol} ${Number(amount).toLocaleString("es-CO")}`;
}

/* ============================================================================
   3. ESTADO DEL CARRITO DE COMPRAS (Persistencia segura en localStorage)
   ============================================================================ */
let cartState = [];

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("kalon_secure_cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) cartState = parsed;
    }
  } catch (e) {
    cartState = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem("kalon_secure_cart", JSON.stringify(cartState));
  } catch (e) {
    // Fallback silencioso en modo incógnito restringido
  }
}

function addToCart(product) {
  const existing = _.find(cartState, { id: product.id });
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image || STORE_CONFIG.lookbook.image,
      qty: 1
    });
  }
  saveCartToStorage();
  renderCartUI();

  // Animación elástica del contador con Anime.js
  anime({
    targets: "#cart-count",
    scale: [1, 1.45, 1],
    duration: 450,
    easing: "easeOutElastic(1, .6)"
  });
}

function removeFromCart(productId) {
  cartState = _.reject(cartState, { id: productId });
  saveCartToStorage();
  renderCartUI();
}

function renderCartUI() {
  const totalCount = _.sumBy(cartState, "qty");
  const totalPrice = _.sumBy(cartState, (item) => item.price * item.qty);

  $("#cart-count").text(totalCount);
  $("#cart-total-price").text(formatCurrency(totalPrice));

  const $container = $("#cart-items-container");
  $container.empty();

  if (cartState.length === 0) {
    $container.html('<p style="color: var(--text-muted); text-align:center; margin-top: 2rem;">Tu bolsa está vacía.</p>');
    return;
  }

  cartState.forEach((item) => {
    $container.append(`
      <div class="cart-item">
        <img src="${item.image}" alt="${sanitizeInput(item.title)}">
        <div class="cart-item-info">
          <div class="cart-item-title">${sanitizeInput(item.title)}</div>
          <div class="cart-item-price">${item.qty} x ${formatCurrency(item.price)}</div>
        </div>
        <button class="icon-btn remove-cart-item" data-id="${item.id}" aria-label="Eliminar">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    `);
  });
}

/* ============================================================================
   4. RENDERIZADO DINÁMICO DE SECCIONES (jQuery + Lodash)
   ============================================================================ */

function initStorefrontContent() {
  // Marca y textos generales
  $("#preloader-brand").text(STORE_CONFIG.brandSpaced);
  $("#header-logo").text(STORE_CONFIG.brandName);
  $("#footer-brand-name").text(STORE_CONFIG.brandName.toUpperCase());

  // 1. Barra Marquee Superior
  const marqueeItems = [...STORE_CONFIG.marqueeMessages, ...STORE_CONFIG.marqueeMessages]
    .map((msg) => `<span>${sanitizeInput(msg)}</span><span class="dot">•</span>`)
    .join("");
  $("#marquee-track").html(marqueeItems);

  // 2. Menú Lateral Drawer
  const navHtml = STORE_CONFIG.navigation
    .map(
      (item) => `
      <div class="drawer-nav-item">
        <a href="${item.href}" class="drawer-nav-link">
          <span>${sanitizeInput(item.label)}</span>
          ${item.hasSubmenu ? '<i class="ri-arrow-down-s-line"></i>' : ""}
        </a>
      </div>
    `
    )
    .join("");
  $("#drawer-nav-list").html(navHtml);

  // 3. Portada Hero
  $("#hero-bg-media").css("background-image", `url('${STORE_CONFIG.hero.bgImage}')`);
  $("#hero-kicker").text(STORE_CONFIG.hero.kicker);
  $("#hero-title-main").text(STORE_CONFIG.hero.titleMain);
  $("#hero-title-accent").text(STORE_CONFIG.hero.titleAccent);
  $("#hero-lead").text(STORE_CONFIG.hero.lead);
  $("#hero-cta-btn").text(STORE_CONFIG.hero.ctaText);

  const badgesHtml = STORE_CONFIG.hero.badges
    .map(
      (b) => `
      <div class="trust-badge-item">
        <i class="${b.icon}"></i>
        <span>${sanitizeInput(b.text)}</span>
      </div>
    `
    )
    .join("");
  $("#hero-badges").html(badgesHtml);

  // 4. Configuración del Modelo 3D Interactivo
  $("#3d-subtitle").text(STORE_CONFIG.model3D.subtitle);
  $("#3d-title").text(STORE_CONFIG.model3D.title);
  $("#3d-desc").text(STORE_CONFIG.model3D.desc);
  $("#main-3d-model").attr("src", STORE_CONFIG.model3D.glbUrl);

  // 5. Carrusel de Sets / Colecciones
  renderProductCarousel(STORE_CONFIG.setsProducts, "#sets-carousel", true);
  renderCarouselDots(STORE_CONFIG.setsProducts.length, "#sets-dots");

  // 6. Bloques de Categorías
  const catsHtml = STORE_CONFIG.categories
    .map(
      (cat) => `
      <article class="category-card" data-filter="${cat.filterTarget}">
        <img src="${cat.image}" alt="${sanitizeInput(cat.name)}" loading="lazy">
        <div class="category-overlay">
          <h3 class="category-name">${sanitizeInput(cat.name)}</h3>
          <span class="category-link">ver más →</span>
        </div>
      </article>
    `
    )
    .join("");
  $("#categories-grid").html(catsHtml);

  // 7. Píldoras de Filtro en "Novedades"
  const pillsHtml = STORE_CONFIG.arrivalFilters
    .map(
      (filterName, idx) => `
      <button class="filter-pill-btn ${idx === 0 ? "is-active" : ""}" data-category="${filterName}">
        ${sanitizeInput(filterName)}
      </button>
    `
    )
    .join("");
  $("#filter-pills-container").html(pillsHtml);

  // Render inicial de Novedades con la primera categoría activa
  filterArrivalsByCategory(STORE_CONFIG.arrivalFilters[0]);

  // 8. Sección Cuidados y Beneficios
  $("#care-kicker").text(STORE_CONFIG.carePromo.kicker);
  $("#care-title").text(STORE_CONFIG.carePromo.title);
  $("#care-desc").text(STORE_CONFIG.carePromo.desc);
  $("#care-img").attr("src", STORE_CONFIG.carePromo.image);

  const benefitsHtml = STORE_CONFIG.carePromo.benefits
    .map(
      (b) => `
      <div class="benefit-box">
        <i class="${b.icon}"></i>
        <span>${sanitizeInput(b.text)}</span>
      </div>
    `
    )
    .join("");
  $("#benefits-grid").html(benefitsHtml);

  // 9. Testimonios
  const testimonialsHtml = STORE_CONFIG.testimonials
    .map(
      (t) => `
      <article class="testimonial-card">
        <img src="${t.image}" alt="${sanitizeInput(t.name)}" loading="lazy">
        <div class="testimonial-quote">
          "${sanitizeInput(t.quote)}"
          <span class="testimonial-author">— ${sanitizeInput(t.name)}</span>
        </div>
      </article>
    `
    )
    .join("");
  $("#testimonials-carousel").html(testimonialsHtml);

  // 10. Ubicación y Cita por WhatsApp
  $("#loc-title").text(STORE_CONFIG.location.title);
  $("#loc-city").text(STORE_CONFIG.location.city);
  $("#loc-details").html(`
    <li>
      <i class="ri-map-pin-line"></i>
      <div>
        <span class="location-label">DIRECCIÓN</span>
        <span>${sanitizeInput(STORE_CONFIG.location.address)}</span>
      </div>
    </li>
    <li>
      <i class="ri-time-line"></i>
      <div>
        <span class="location-label">HORARIO DE ATENCIÓN</span>
        <span>${sanitizeInput(STORE_CONFIG.location.hours)}</span>
      </div>
    </li>
    <li>
      <i class="ri-phone-line"></i>
      <div>
        <span class="location-label">CITAS Y ASESORÍA</span>
        <span>${sanitizeInput(STORE_CONFIG.location.phone)}</span>
      </div>
    </li>
  `);

  const citaMsg = encodeURIComponent(`Hola ${STORE_CONFIG.brandName.toUpperCase()}, quiero agendar una cita o recibir asesoría personalizada.`);
  $("#loc-whatsapp-btn").attr("href", `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${citaMsg}`);

  // 11. Acordeones del Footer
  const accordionsHtml = STORE_CONFIG.footerAccordions
    .map(
      (acc) => `
      <div class="footer-accordion-item">
        <button class="footer-accordion-trigger" type="button">
          <span>${sanitizeInput(acc.title)}</span>
          <i class="ri-arrow-right-s-line"></i>
        </button>
        <div class="footer-accordion-content">
          <p>${sanitizeInput(acc.content)}</p>
        </div>
      </div>
    `
    )
    .join("");
  $("#footer-accordions").html(accordionsHtml);
}

// Genera tarjetas de producto usando Lodash para calcular porcentajes de descuento
function renderProductCarousel(productsArray, containerSelector, showOfferTag = false) {
  const html = _.map(productsArray, (prod) => {
    const discountPercent =
      prod.oldPrice && prod.oldPrice > prod.price
        ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100)
        : 0;

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-media">
          <div class="badge-stack">
            ${showOfferTag && prod.isOffer ? '<span class="tag-badge tag-offer">OFERTA</span>' : ""}
            ${!prod.inStock ? '<span class="tag-badge tag-soldout">AGOTADO</span>' : ""}
          </div>
          ${discountPercent > 0 ? `<span class="tag-discount">-${discountPercent}%</span>` : ""}
          <img src="${prod.image}" alt="${sanitizeInput(prod.title)}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${sanitizeInput(prod.title)}</h3>
          <div class="product-pricing">
            ${prod.oldPrice ? `<span class="price-old">${formatCurrency(prod.oldPrice)}</span>` : ""}
            <span class="price-current">${formatCurrency(prod.price)}</span>
          </div>
          <button 
            type="button" 
            class="btn-card-action add-to-cart-btn" 
            data-id="${prod.id}"
            ${!prod.inStock ? "disabled" : ""}>
            ${prod.inStock ? "AGREGAR AL CARRITO →" : "AGOTADO — VER DETALLES"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  $(containerSelector).html(html);
}

function renderCarouselDots(count, dotsSelector) {
  let dotsHtml = "";
  for (let i = 0; i < count; i++) {
    dotsHtml += `<span class="dot-indicator ${i === 0 ? "is-active" : ""}"></span>`;
  }
  $(dotsSelector).html(dotsHtml);
}

// Filtra productos en "Novedades" con Lodash y los anima con Anime.js
function filterArrivalsByCategory(categoryName) {
  const filtered = _.filter(STORE_CONFIG.arrivalsProducts, { category: categoryName });
  renderProductCarousel(filtered, "#arrivals-carousel", false);

  anime({
    targets: "#arrivals-carousel .product-card",
    opacity: [0, 1],
    translateY: [18, 0],
    delay: anime.stagger(90),
    duration: 500,
    easing: "easeOutQuad"
  });
}

/* ============================================================================
   5. ESCAPARATE INTERACTIVO CON D3.JS (Segundos 0:22 - 0:24 del video 1)
   ============================================================================ */
function initD3LookbookHotspots() {
  $("#lookbook-img").attr("src", STORE_CONFIG.lookbook.image);

  const layer = d3.select("#hotspots-layer");
  layer.selectAll("*").remove();

  // D3 vincula las coordenadas X/Y porcentuales con cada joya/producto
  layer
    .selectAll(".hotspot-dot")
    .data(STORE_CONFIG.lookbook.hotspots)
    .enter()
    .append("button")
    .attr("type", "button")
    .attr("class", "hotspot-dot")
    .attr("aria-label", (d) => `Ver ${d.title}`)
    .style("left", (d) => `${d.x}%`)
    .style("top", (d) => `${d.y}%`)
    .on("click", function (event, d) {
      const $popover = $("#hotspot-popover");
      $popover
        .html(`
          <div>
            <strong style="display:block; font-size:0.85rem;">${sanitizeInput(d.title)}</strong>
            <span style="color:var(--accent-gold); font-size:0.82rem;">${formatCurrency(d.price)}</span>
          </div>
          <button type="button" class="btn-gold hotspot-buy-btn" data-id="${d.id}" style="padding:0.55rem 0.9rem; font-size:0.7rem;">
            AGREGAR +
          </button>
        `)
        .addClass("is-visible")
        .attr("aria-hidden", "false");

      // Animación suave de aparición con Anime.js
      anime({
        targets: "#hotspot-popover",
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutCubic"
      });
    });
}

/* ============================================================================
   6. ANIMACIÓN DE ENTRADA CON ANIME.JS (Segundos 0:06 - 0:07 del video 1)
   ============================================================================ */
function runPreloaderAnimation() {
  const tl = anime.timeline({
    easing: "easeOutExpo"
  });

  tl.add({
    targets: ".preloader-subtitle",
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 600
  })
    .add(
      {
        targets: ".preloader-title",
        opacity: [0, 1],
        letterSpacing: ["0.65em", "0.4em"],
        duration: 900
      },
      "-=300"
    )
    .add(
      {
        targets: ".preloader-line",
        width: ["0%", "75%"],
        duration: 700
      },
      "-=500"
    )
    .add({
      targets: "#preloader",
      opacity: [1, 0],
      duration: 650,
      delay: 350,
      complete: function () {
        $("#preloader").css("display", "none");
      }
    });
}

/* ============================================================================
   7. WIDGET INTERACTIVO EN REACT (Armador de Kit con Descuento)
   ============================================================================ */
function mountReactCustomKitBuilder() {
  const rootEl = document.getElementById("react-custom-kit-root");
  if (!rootEl || typeof React === "undefined" || typeof ReactDOM === "undefined") return;

  const e = React.createElement;

  function CustomKitWidget() {
    const [selectedCount, setSelectedCount] = React.useState(2);
    const baseUnitPrice = 55000;
    const discountRate = selectedCount === 3 ? 0.15 : selectedCount === 4 ? 0.22 : 0.1;
    const finalPrice = Math.round(selectedCount * baseUnitPrice * (1 - discountRate));

    function handleAddKit() {
      addToCart({
        id: `custom-kit-${selectedCount}`,
        title: `KIT PERSONALIZADO (${selectedCount} PIEZAS)`,
        price: finalPrice,
        image: STORE_CONFIG.lookbook.image
      });
      $("#side-cart").addClass("is-open");
      $("#drawer-backdrop").addClass("is-active");
    }

    return e(
      "div",
      { className: "react-kit-box" },
      e("span", { className: "section-subtitle" }, "ARMADOR INTERACTIVO (REACT)"),
      e("h3", { className: "section-title", style: { fontSize: "1.65rem" } }, "Crea tu propio Set"),
      e(
        "p",
        { className: "section-desc", style: { marginBottom: "1rem" } },
        "Elige cuántas piezas deseas combinar y obtén hasta 22% de descuento automático."
      ),
      e(
        "div",
        { style: { display: "flex", justifyContent: "center", gap: "0.6rem", marginBottom: "1.1rem" } },
        [2, 3, 4].map((num) =>
          e(
            "button",
            {
              key: num,
              type: "button",
              className: `filter-pill-btn ${selectedCount === num ? "is-active" : ""}`,
              onClick: () => setSelectedCount(num)
            },
            `${num} Piezas (-${num === 2 ? 10 : num === 3 ? 15 : 22}%)`
          )
        )
      ),
      e(
        "div",
        { style: { marginBottom: "1rem", fontSize: "1rem" } },
        "Total de tu Kit: ",
        e("strong", { style: { color: "var(--accent-gold)" } }, formatCurrency(finalPrice))
      ),
      e(
        "button",
        { type: "button", className: "btn-gold btn-full", onClick: handleAddKit },
        "AGREGAR KIT PERSONALIZADO AL CARRITO"
      )
    );
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(e(CustomKitWidget));
}

/* ============================================================================
   8. EVENTOS DE INTERFAZ, BUSCADOR EN VIVO Y SEGURIDAD DE COOKIES (jQuery)
   ============================================================================ */
$(document).ready(function () {
  loadCartFromStorage();
  initStorefrontContent();
  initD3LookbookHotspots();
  renderCartUI();
  runPreloaderAnimation();
  mountReactCustomKitBuilder();

  // Abrir y cerrar menú lateral (Drawer) y Carrito
  $("#open-menu-btn").on("click", function () {
    $("#side-drawer").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  $("#open-cart-btn").on("click", function () {
    $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  $("#close-menu-btn, #close-cart-btn, #drawer-backdrop, .drawer-nav-link").on("click", function () {
    $("#side-drawer, #side-cart").removeClass("is-open").attr("aria-hidden", "true");
    $("#drawer-backdrop").removeClass("is-active");
  });

  // Buscador en vivo con Debounce de Lodash y Sanitización XSS (Regla 5)
  const allCatalog = [...STORE_CONFIG.setsProducts, ...STORE_CONFIG.arrivalsProducts];
  $("#live-search-input").on(
    "input",
    _.debounce(function () {
      const cleanQuery = sanitizeInput($(this).val()).toLowerCase();
      const $resultsBox = $("#search-results-box");
      $resultsBox.empty();

      if (cleanQuery.length < 2) return;

      const matches = _.filter(allCatalog, (item) => item.title.toLowerCase().includes(cleanQuery));
      if (matches.length === 0) {
        $resultsBox.html('<div class="search-result-item">Sin resultados encontrados.</div>');
        return;
      }

      matches.forEach((m) => {
        $resultsBox.append(`
          <div class="search-result-item">
            <span>${sanitizeInput(m.title)}</span>
            <strong>${formatCurrency(m.price)}</strong>
          </div>
        `);
      });
    }, 220)
  );

  // Control de pausa/giro del Objeto 3D
  $("#toggle-3d-rotate").on("click", function () {
    const viewer = document.getElementById("main-3d-model");
    if (!viewer) return;
    if (viewer.hasAttribute("auto-rotate")) {
      viewer.removeAttribute("auto-rotate");
      $(this).html('<i class="ri-play-line"></i> Reanudar Giro 3D');
    } else {
      viewer.setAttribute("auto-rotate", "");
      $(this).html('<i class="ri-pause-line"></i> Pausar Giro 3D');
    }
  });

  // Cambio de filtro en Novedades
  $(document).on("click", "#filter-pills-container .filter-pill-btn", function () {
    $("#filter-pills-container .filter-pill-btn").removeClass("is-active");
    $(this).addClass("is-active");
    const category = $(this).data("category");
    filterArrivalsByCategory(category);
  });

  // Clic en tarjeta de Categoría lleva directo al filtro correspondiente
  $(document).on("click", ".category-card", function () {
    const targetFilter = $(this).data("filter");
    if (targetFilter) {
      $(`#filter-pills-container .filter-pill-btn[data-category="${targetFilter}"]`).trigger("click");
      document.getElementById("novedades").scrollIntoView({ behavior: "smooth" });
    }
  });

  // Agregar al carrito desde tarjetas de productos
  $(document).on("click", ".add-to-cart-btn", function () {
    const prodId = $(this).data("id");
    const found = _.find(allCatalog, { id: prodId });
    if (found && found.inStock) {
      addToCart(found);
      const $btn = $(this);
      const originalText = $btn.text();
      $btn.text("✓ AGREGADO A TU BOLSA");
      setTimeout(() => $btn.text(originalText), 1200);
    }
  });

  // Agregar al carrito desde un punto dorado D3.js
  $(document).on("click", ".hotspot-buy-btn", function () {
    const hsId = $(this).data("id");
    const hsItem = _.find(STORE_CONFIG.lookbook.hotspots, { id: hsId });
    if (hsItem) {
      addToCart({
        id: hsItem.id,
        title: hsItem.title,
        price: hsItem.price,
        image: STORE_CONFIG.lookbook.image
      });
    }
  });

  // Eliminar ítem del carrito
  $(document).on("click", ".remove-cart-item", function () {
    const id = $(this).data("id");
    removeFromCart(id);
  });

  // Enviar pedido completo por WhatsApp de forma segura
  $("#checkout-whatsapp-btn").on("click", function () {
    if (cartState.length === 0) return;
    const lines = cartState.map((i) => `• ${i.qty}x ${i.title} (${formatCurrency(i.price * i.qty)})`).join("\n");
    const total = _.sumBy(cartState, (i) => i.price * i.qty);
    const message = encodeURIComponent(
      `Hola ${STORE_CONFIG.brandName.toUpperCase()}, quiero realizar el siguiente pedido:\n\n${lines}\n\n*Total: ${formatCurrency(total)}*`
    );
    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  });

  // Acordeones del Footer (Segundos 0:29 - 0:31 del video 1)
  $(document).on("click", ".footer-accordion-trigger", function () {
    const $content = $(this).next(".footer-accordion-content");
    $content.slideToggle(220);
  });

  // Suscripción de Newsletter con validación y sanitización
  $("#newsletter-form").on("submit", function (e) {
    e.preventDefault();
    const rawEmail = $("#newsletter-email").val();
    const cleanEmail = sanitizeInput(rawEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      $("#newsletter-feedback").text("Por favor ingresa un correo electrónico válido.");
      return;
    }
    $("#newsletter-feedback").text("¡Gracias por suscribirte! Recibirás nuestras novedades.");
    $("#newsletter-email").val("");
  });

  // Sistema Legal de Cookies (Segundos 0:08 - 0:43 del video 1 - Regla 5)
  try {
    const cookieConsent = localStorage.getItem("kalon_cookie_consent");
    if (cookieConsent) {
      $("#cookie-banner").addClass("is-hidden");
    }
  } catch (e) {}

  $("#cookie-essential-btn, #cookie-accept-btn").on("click", function () {
    const decision = $(this).attr("id") === "cookie-accept-btn" ? "accepted_all" : "essential_only";
    try {
      localStorage.setItem("kalon_cookie_consent", decision);
    } catch (e) {}
    $("#cookie-banner").fadeOut(250);
  });

  // Abrir y cerrar Modal de Política de Cookies y Habeas Data
  $("#cookie-policy-link, #open-legal-modal").on("click", function () {
    $("#legal-modal").addClass("is-open").attr("aria-hidden", "false");
  });

  $("#close-legal-modal, #legal-modal").on("click", function (e) {
    if (e.target === this || $(e.target).closest("#close-legal-modal").length) {
      $("#legal-modal").removeClass("is-open").attr("aria-hidden", "true");
    }
  });
});
