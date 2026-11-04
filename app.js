/**
 * ============================================================================
 * ARCHIVO 3: app.js - MOTOR DEMO DE UÑAS (EL JUNQUITO - PANORAMA) + FIREBASE
 * Conectado a: Realtime Database, Cloud Firestore, Anime.js, D3.js, Lodash, React
 * ============================================================================
 */

"use strict";

/* ============================================================================
   1. CONEXIÓN OFICIAL A TU PROYECTO FIREBASE (mipaginawed-519fd)
   ============================================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyBJ_cmnwIqaE_2WW5tJVOGgebsquSLKBxs",
  authDomain: "mipaginawed-519fd.firebaseapp.com",
  databaseURL: "https://mipaginawed-519fd-default-rtdb.firebaseio.com",
  projectId: "mipaginawed-519fd",
  storageBucket: "mipaginawed-519fd.firebasestorage.app",
  messagingSenderId: "1024677348695",
  appId: "1:1024677348695:web:51d9c155ad9389c6ae2a12",
  measurementId: "G-968MQ61PQ6"
};

let dbRealtime = null;
let dbFirestore = null;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  dbRealtime = firebase.database();
  dbFirestore = firebase.firestore();
} catch (err) {
  console.warn("Modo local activo si Firebase aún no responde:", err);
}

/* ============================================================================
   2. CONFIGURACIÓN MAESTRA DEL RUBRO DE UÑAS (REGLA 6 - ESCALABLE)
   Si modificas algo desde admin.html, Firebase sobrescribe este objeto en vivo
   ============================================================================ */
let STORE_CONFIG = {
  brandName: "kalon nails",
  brandSpaced: "K A L O N",
  currencySymbol: "$",
  whatsappNumber: "584120000000", // Cambia desde el Panel Admin por el número en Venezuela

  marqueeMessages: [
    "ESTUDIO EN EL JUNQUITO (SECTOR PANORAMA) Y SERVICIO VIP A DOMICILIO",
    "ESPECIALISTAS EN POLYGEL, SOFT GEL, KAPPING Y MANICURA RUSA",
    "MATERIALES HIPOALERGÉNICOS LIBRES DE MMA • DURACIÓN +21 DÍAS",
    "AGENDA TU CITA ONLINE Y ADJUNTA TU UBICACIÓN GPS EN 1 CLIC"
  ],

  navigation: [
    { label: "INICIO", href: "#main-content", hasSubmenu: false },
    { label: "MANOS 3D & MATERIALES", href: "#showcase-3d", hasSubmenu: false },
    { label: "SISTEMAS EN PROMO", href: "#colecciones", hasSubmenu: true },
    { label: "ESPECIALIDADES", href: "#categorias", hasSubmenu: true },
    { label: "CATÁLOGO DE SERVICIOS", href: "#novedades", hasSubmenu: true },
    { label: "DETALLE TÉCNICO (LOOKBOOK)", href: "#lookbook", hasSubmenu: false },
    { label: "BIOSEGURIDAD", href: "#cuidados", hasSubmenu: false },
    { label: "RESEÑAS DE CLIENTAS", href: "#testimonios", hasSubmenu: false },
    { label: "PANORAMA & DOMICILIO", href: "#ubicacion", hasSubmenu: false }
  ],

  hero: {
    kicker: "ARTE Y PRECISIÓN EN TUS MANOS",
    titleMain: "DISEÑOS EXCLUSIVOS EN CADA",
    titleAccent: "detalle",
    lead: "Estructuras en Polygel, Soft Gel y Manicura Rusa de alta durabilidad. Atención en El Junquito (Panorama) o vamos hasta la comodidad de tu casa.",
    ctaText: "EXPLORAR MANOS 3D & PRECIOS",
    bgImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80",
    badges: [
      { icon: "ri-shield-check-line", text: "Herramientas 100% Esterilizadas" },
      { icon: "ri-e-bike-2-line", text: "Estudio en Panorama + Servicio a Domicilio" }
    ]
  },

  // Configuración del Visor 3D + Ficha Técnica de Materiales de Uñas
  model3D: {
    subtitle: "INTERACCIÓN 360° • MODELO REAL",
    title: "Escultura & Materiales en 3D",
    desc: "Gira las manos con tu dedo para inspeccionar el relieve 3D, el sellado de cutícula y conoce qué productos exactos usamos.",
    // Carga tu archivo unas-demo.glb descargado; si no está en la carpeta aún, usa un respaldo seguro
    glbUrl: "./unas-demo.glb",
    systemPrice: 25,
    systemTitle: "SISTEMA ESCULPIDO AZUL COBALTO 3D (POLYGEL)",
    techSpecs: [
      {
        layer: "1. PREPARACIÓN & CUTÍCULA",
        name: "Manicura Rusa Combinada + Deshidratador pH",
        detail: "Limpieza profunda del bolsillo de la cutícula con brocas diamantadas de grano suave y nivelación de pH con Nail Prep sin ácido para evitar desprendimientos."
      },
      {
        layer: "2. BASE ADHERENTE & PROTECCIÓN",
        name: "Rubber Base Gel Flexible (Capa Amortiguadora)",
        detail: "Base elástica vitaminada que protege la uña natural, corrige estrías y absorbe impactos cotidianos sin quebrar la estructura."
      },
      {
        layer: "3. ESTRUCTURA & ESCULPIDO",
        name: "Polygel Acrigel de Alta Densidad (Grado Salón)",
        detail: "Combina la fuerza del acrílico con la ligereza y flexibilidad del gel. Cero olor a monómero fuerte, curvatura C estilizada y duración de 21 a 30 días."
      },
      {
        layer: "4. COLOR, RELIEVE & BRILLO ESPEJO",
        name: "Gel Semipermanente Azul Cobalto + Top Coat Cristal UV",
        detail: "Pigmento mineral de alta cobertura curado en lámpara LED/UV, texturizado artístico en relieve 3D y sellado con Top Coat Diamond anti-rayaduras."
      }
    ]
  },

  // Carrusel de Sistemas Destacados / Promociones
  setsProducts: [
    {
      id: "set-polygel-esculpido",
      title: "SISTEMA EN POLYGEL + ESMALTADO GEL",
      oldPrice: 30,
      price: 22,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-softgel-press",
      title: "SISTEMA SOFT GEL / EXTENSIONES TIPS GEL",
      oldPrice: 25,
      price: 18,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-kapping-rubber",
      title: "KAPPING / NIVELACIÓN RUBBER EN UÑA NATURAL",
      oldPrice: 20,
      price: 15,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "set-duo-manos-pies",
      title: "COMBO VIP: MANICURA RUSA + PEDISPA",
      oldPrice: 32,
      price: 25,
      inStock: true,
      isOffer: true,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // Bloques de Especialidades
  categories: [
    {
      id: "cat-polygel",
      name: "Sistemas en Polygel",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80",
      filterTarget: "POLYGEL"
    },
    {
      id: "cat-softgel",
      name: "Soft Gel & Kapping",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80",
      filterTarget: "SOFT GEL"
    },
    {
      id: "cat-rusa",
      name: "Manicura Rusa & Spa",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=700&q=80",
      filterTarget: "MANICURA RUSA"
    }
  ],

  // Filtros y Catálogo por Técnica
  arrivalFilters: ["POLYGEL", "SOFT GEL", "MANICURA RUSA", "ADICIONALES"],
  arrivalsProducts: [
    {
      id: "srv-polygel-natural",
      title: "POLYGEL TONO COVER / BABY BOOMER",
      category: "POLYGEL",
      oldPrice: 28,
      price: 22,
      inStock: true,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv-polygel-mantenimiento",
      title: "MANTENIMIENTO DE POLYGEL (15-21 DÍAS)",
      category: "POLYGEL",
      oldPrice: 20,
      price: 16,
      inStock: true,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv-softgel-decorado",
      title: "SOFT GEL + EFECTO CHROME / OJO DE GATO",
      category: "SOFT GEL",
      oldPrice: 24,
      price: 19,
      inStock: true,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv-rusa-semi",
      title: "MANICURA RUSA + SEMIPERMANENTE",
      category: "MANICURA RUSA",
      oldPrice: 16,
      price: 12,
      inStock: true,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "srv-retiro-seguro",
      title: "RETIRO SEGURO + HIDRATACIÓN QUERATINA",
      category: "ADICIONALES",
      oldPrice: 8,
      price: 5,
      inStock: true,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // Escaparate Interactivo D3.js ("Toca cada punto de la uña")
  lookbook: {
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    hotspots: [
      { id: "hs-cuticula", x: 34, y: 32, title: "Limpieza de Cutícula Rusa + Sellado", price: 12 },
      { id: "hs-polygel", x: 52, y: 48, title: "Esculpido en Polygel + Ápice Balanceado", price: 22 },
      { id: "hs-nailart", x: 66, y: 62, title: "Diseño Relieve 3D + Top Coat Cristal", price: 4 }
    ]
  },

  carePromo: {
    kicker: "BIOSEGURIDAD Y SALUD UNGUEAL",
    title: "Tus uñas naturales sanas y fuertes.",
    desc: "Usamos preparadores libres de ácidos agresivos, limas personalizadas y esterilización grado médico en estudio y a domicilio.",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80",
    benefits: [
      { icon: "ri-shield-star-line", text: "Esterilización en cada cita" },
      { icon: "ri-award-line", text: "Polygel y geles certificados" },
      { icon: "ri-e-bike-2-line", text: "Maletín completo a domicilio" },
      { icon: "ri-sparkling-line", text: "Brillo intacto por +21 días" }
    ]
  },

  testimonials: [
    {
      name: "Mariana G. (Panorama)",
      quote: "Me hizo el sistema en Polygel a domicilio aquí en Panorama y me duraron 25 días intactas sin levantarse nada.",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Estefanía R. (El Junquito Km 12)",
      quote: "Súper delicada con la cutícula, no lastima nada y lleva absolutamente todos los colores y lámpara a tu casa.",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80"
    }
  ],

  location: {
    title: "El Junquito — Sector Panorama",
    city: "ATENCIÓN EN ESTUDIO PRIVADO Y A DOMICILIO",
    address: "El Junquito, Sector Panorama (también cubrimos todo El Junquito y Caracas a domicilio)",
    hours: "Lunes a Sábado • 9:00 AM – 6:00 PM (Previa Cita)",
    phone: "+58 412-0000000"
  },

  footerAccordions: [
    {
      title: "¿CÓMO FUNCIONA EL SERVICIO A DOMICILIO?",
      content: "Seleccionas tus servicios en la web, eliges 'A Domicilio', adjuntas tu ubicación GPS y llevamos mesa portátil, lámpara UV/LED, extractor y todos los materiales hasta tu hogar."
    },
    {
      title: "DIFERENCIA ENTRE POLYGEL, SOFT GEL Y KAPPING",
      content: "El Polygel es ideal para esculpir largo con máxima resistencia; Soft Gel usa tips de gel completos de rápida aplicación; Kapping recubre el largo de tu propia uña natural para que no se parta."
    },
    {
      title: "GARANTÍA Y RECOMENDACIONES",
      content: "Todos nuestros sistemas cuentan con garantía de aplicación de 5 días. Recomendamos aplicar aceite de cutícula diariamente y usar guantes al manipular químicos fuertes."
    }
  ]
};

/* ============================================================================
   3. SEGURIDAD XSS (REGLA 5) Y FORMATEO DE PRECIOS
   ============================================================================ */
function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return _.escape(str.trim()).replace(/[<>/"'`;()]/g, "");
}

function formatCurrency(amount) {
  return `${STORE_CONFIG.currencySymbol} ${Number(amount).toLocaleString("es-VE")}`;
}

/* ============================================================================
   4. ESTADO DEL CARRITO, MODALIDAD DOMICILIO Y UBICACIÓN GPS
   ============================================================================ */
let cartState = [];
let deliveryMode = "estudio"; // "estudio" o "domicilio"
let deliveryFee = 0;
let deliveryZoneLabel = "Atención en Estudio (Panorama, El Junquito)";
let clientGpsUrl = "";

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("kalon_nails_cart");
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
    localStorage.setItem("kalon_nails_cart", JSON.stringify(cartState));
  } catch (e) {}
}

function addToCart(product) {
  const existing = _.find(cartState, { id: product.id });
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image: product.image || STORE_CONFIG.lookbook.image,
      qty: 1
    });
  }
  saveCartToStorage();
  renderCartUI();

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
  const servicesSubtotal = _.sumBy(cartState, (item) => item.price * item.qty);
  const activeDeliveryFee = deliveryMode === "domicilio" ? Number(deliveryFee) : 0;
  const grandTotal = servicesSubtotal + activeDeliveryFee;

  $("#cart-count").text(totalCount);
  $("#cart-total-price").text(formatCurrency(grandTotal));

  const $container = $("#cart-items-container");
  $container.empty();

  if (cartState.length === 0) {
    $container.html('<p style="color: var(--text-muted); text-align:center; margin: 1.2rem 0; font-size:0.82rem;">Aún no has seleccionado servicios de uñas.</p>');
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
   5. SINCRONIZACIÓN EN TIEMPO REAL CON FIREBASE (REALTIME DB + FIRESTORE)
   ============================================================================ */
function syncStoreWithFirebase() {
  if (!dbRealtime) return;

  const configRef = dbRealtime.ref("store_config");
  configRef.on("value", (snapshot) => {
    const cloudData = snapshot.val();
    if (cloudData) {
      // Combina los cambios hechos en el Panel Admin con la base
      STORE_CONFIG = _.merge({}, STORE_CONFIG, cloudData);
      initStorefrontContent();
      initD3LookbookHotspots();
    } else {
      // Si la base está en null (como en tu captura 4), guarda la configuración inicial
      configRef.set(STORE_CONFIG).catch(() => {});
    }
  });

  // Escucha reseñas en vivo desde Cloud Firestore
  if (dbFirestore) {
    dbFirestore
      .collection("resenas_clientas")
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot(
        (snap) => {
          const cloudReviews = [];
          snap.forEach((doc) => cloudReviews.push(doc.data()));
          if (cloudReviews.length > 0) {
            const combined = [...cloudReviews, ...STORE_CONFIG.testimonials];
            renderTestimonialsList(combined);
          }
        },
        () => {}
      );
  }
}

/* ============================================================================
   6. RENDERIZADO COMPLETO DE LA TIENDA Y FICHA TÉCNICA DE UÑAS 3D
   ============================================================================ */
function initStorefrontContent() {
  $("#preloader-brand").text(STORE_CONFIG.brandSpaced);
  $("#header-logo").text(STORE_CONFIG.brandName);
  $("#footer-brand-name").text(STORE_CONFIG.brandName.toUpperCase());

  // 1. Marquee Superior
  const marqueeItems = [...STORE_CONFIG.marqueeMessages, ...STORE_CONFIG.marqueeMessages]
    .map((msg) => `<span>${sanitizeInput(msg)}</span><span class="dot">•</span>`)
    .join("");
  $("#marquee-track").html(marqueeItems);

  // 2. Navegación Lateral
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

  const badgesHtml = (STORE_CONFIG.hero.badges || [])
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

  // 4. Visor 3D de las Manos + Ficha Técnica de Materiales (Polygel, Rubber, Esmalte, Top Coat)
  $("#3d-subtitle").text(STORE_CONFIG.model3D.subtitle);
  $("#3d-title").text(STORE_CONFIG.model3D.title);
  $("#3d-desc").text(STORE_CONFIG.model3D.desc);

  const viewerEl = document.getElementById("main-3d-model");
  if (viewerEl) {
    viewerEl.setAttribute("src", STORE_CONFIG.model3D.glbUrl);
    // Si el usuario aún no ha copiado unas-demo.glb a la carpeta, carga un modelo 3D de respaldo sin romper nada
    viewerEl.addEventListener(
      "error",
      function handleFallback() {
        viewerEl.setAttribute("src", "https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb");
      },
      { once: true }
    );
  }

  const specsHtml = (STORE_CONFIG.model3D.techSpecs || [])
    .map(
      (spec, idx) => `
      <div class="spec-item ${idx === 0 ? "is-active" : ""}">
        <button type="button" class="spec-header-btn">
          <div>
            <span class="spec-layer-tag">${sanitizeInput(spec.layer)}</span>
            <span>${sanitizeInput(spec.name)}</span>
          </div>
          <i class="ri-arrow-down-s-line"></i>
        </button>
        <div class="spec-body">
          ${sanitizeInput(spec.detail)}
        </div>
      </div>
    `
    )
    .join("");
  $("#nail-tech-specs").html(specsHtml);

  // 5. Carrusel de Sistemas Destacados
  renderProductCarousel(STORE_CONFIG.setsProducts, "#sets-carousel", true);
  renderCarouselDots(STORE_CONFIG.setsProducts.length, "#sets-dots");

  // 6. Bloques de Especialidades
  const catsHtml = (STORE_CONFIG.categories || [])
    .map(
      (cat) => `
      <article class="category-card" data-filter="${cat.filterTarget}">
        <img src="${cat.image}" alt="${sanitizeInput(cat.name)}" loading="lazy">
        <div class="category-overlay">
          <h3 class="category-name">${sanitizeInput(cat.name)}</h3>
          <span class="category-link">ver servicios →</span>
        </div>
      </article>
    `
    )
    .join("");
  $("#categories-grid").html(catsHtml);

  // 7. Filtros de Catálogo por Técnica
  const pillsHtml = (STORE_CONFIG.arrivalFilters || [])
    .map(
      (filterName, idx) => `
      <button class="filter-pill-btn ${idx === 0 ? "is-active" : ""}" data-category="${filterName}">
        ${sanitizeInput(filterName)}
      </button>
    `
    )
    .join("");
  $("#filter-pills-container").html(pillsHtml);
  filterArrivalsByCategory(STORE_CONFIG.arrivalFilters[0]);

  // 8. Bioseguridad y Beneficios
  $("#care-kicker").text(STORE_CONFIG.carePromo.kicker);
  $("#care-title").text(STORE_CONFIG.carePromo.title);
  $("#care-desc").text(STORE_CONFIG.carePromo.desc);
  $("#care-img").attr("src", STORE_CONFIG.carePromo.image);

  const benefitsHtml = (STORE_CONFIG.carePromo.benefits || [])
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

  // 9. Testimonios Iniciales
  renderTestimonialsList(STORE_CONFIG.testimonials);

  // 10. Ubicación en El Junquito (Panorama) y Domicilio
  $("#loc-title").text(STORE_CONFIG.location.title);
  $("#loc-city").text(STORE_CONFIG.location.city);
  $("#loc-details").html(`
    <li>
      <i class="ri-map-pin-line"></i>
      <div>
        <span class="location-label">UBICACIÓN BASE & COBERTURA</span>
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
      <i class="ri-whatsapp-line"></i>
      <div>
        <span class="location-label">CONTACTO DIRECTO</span>
        <span>${sanitizeInput(STORE_CONFIG.location.phone)}</span>
      </div>
    </li>
  `);

  // 11. Acordeones del Pie de Página
  const accordionsHtml = (STORE_CONFIG.footerAccordions || [])
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

function renderTestimonialsList(list) {
  const html = (list || [])
    .map(
      (t) => `
      <article class="testimonial-card">
        <img src="${t.image || STORE_CONFIG.lookbook.image}" alt="${sanitizeInput(t.name)}" loading="lazy">
        <div class="testimonial-quote">
          "${sanitizeInput(t.quote)}"
          <span class="testimonial-author">— ${sanitizeInput(t.name)} ${t.service ? `(${sanitizeInput(t.service)})` : ""}</span>
        </div>
      </article>
    `
    )
    .join("");
  $("#testimonials-carousel").html(html);
}

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
            ${showOfferTag && prod.isOffer ? '<span class="tag-badge tag-offer">PROMO</span>' : ""}
            ${!prod.inStock ? '<span class="tag-badge tag-soldout">SIN CUPO HOY</span>' : ""}
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
            ${prod.inStock ? "SELECCIONAR SERVICIO →" : "CONSULTAR DISPONIBILIDAD"}
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
   7. ESCAPARATE INTERACTIVO CON D3.JS (Puntos sobre las uñas)
   ============================================================================ */
function initD3LookbookHotspots() {
  $("#lookbook-img").attr("src", STORE_CONFIG.lookbook.image);

  const layer = d3.select("#hotspots-layer");
  layer.selectAll("*").remove();

  layer
    .selectAll(".hotspot-dot")
    .data(STORE_CONFIG.lookbook.hotspots || [])
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
            <strong style="display:block; font-size:0.84rem;">${sanitizeInput(d.title)}</strong>
            <span style="color:var(--accent-gold); font-size:0.82rem;">${formatCurrency(d.price)}</span>
          </div>
          <button type="button" class="btn-gold hotspot-buy-btn" data-id="${d.id}" style="padding:0.55rem 0.9rem; font-size:0.7rem;">
            SUMAR A MI CITA +
          </button>
        `)
        .addClass("is-visible")
        .attr("aria-hidden", "false");

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
   8. PRELOADER CON ANIME.JS Y CALCULADORA REACT DE DISEÑO DE UÑAS
   ============================================================================ */
function runPreloaderAnimation() {
  const tl = anime.timeline({ easing: "easeOutExpo" });

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
      delay: 300,
      complete: function () {
        $("#preloader").css("display", "none");
      }
    });
}

function mountReactCustomKitBuilder() {
  const rootEl = document.getElementById("react-custom-kit-root");
  if (!rootEl || typeof React === "undefined" || typeof ReactDOM === "undefined") return;

  const e = React.createElement;

  function CustomNailCalculator() {
    const [systemType, setSystemType] = React.useState({ name: "Polygel Esculpido", price: 22 });
    const [nailLength, setNailLength] = React.useState({ name: "Largo #2 - #3 (Salón)", extra: 0 });
    const [artLevel, setArtLevel] = React.useState({ name: "Francés / Brillo Espejo", extra: 3 });

    const total = systemType.price + nailLength.extra + artLevel.extra;

    function handleAddCustomSet() {
      addToCart({
        id: `custom-nails-${Date.now()}`,
        title: `${systemType.name} (${nailLength.name} + ${artLevel.name})`,
        price: total,
        image: STORE_CONFIG.lookbook.image
      });
      $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
      $("#drawer-backdrop").addClass("is-active");
    }

    return e(
      "div",
      { className: "react-kit-box" },
      e("span", { className: "section-subtitle" }, "COTIZADOR INTERACTIVO (REACT)"),
      e("h3", { className: "section-title", style: { fontSize: "1.65rem" } }, "Personaliza tu Set de Uñas"),
      e("p", { className: "section-desc", style: { marginBottom: "1rem" } }, "Elige material, largo y decoración para calcular tu cita al instante:"),
      e(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem", marginBottom: "0.85rem" } },
        [
          { name: "Polygel Esculpido", price: 22 },
          { name: "Soft Gel Tips", price: 18 },
          { name: "Kapping Rubber", price: 15 }
        ].map((sys) =>
          e(
            "button",
            {
              key: sys.name,
              type: "button",
              className: `filter-pill-btn ${systemType.name === sys.name ? "is-active" : ""}`,
              onClick: () => setSystemType(sys)
            },
            `${sys.name} ($${sys.price})`
          )
        )
      ),
      e(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem", marginBottom: "0.85rem" } },
        [
          { name: "Largo Corto/Medio (#1-#3)", extra: 0 },
          { name: "Largo XL (#4-#6)", extra: 5 }
        ].map((len) =>
          e(
            "button",
            {
              key: len.name,
              type: "button",
              className: `filter-pill-btn ${nailLength.name === len.name ? "is-active" : ""}`,
              onClick: () => setNailLength(len)
            },
            `${len.name} (+$${len.extra})`
          )
        )
      ),
      e(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem", marginBottom: "1rem" } },
        [
          { name: "Tono Liso + Top Cristal", extra: 0 },
          { name: "Francés / Ojo de Gato", extra: 3 },
          { name: "Relieve 3D / Encapsulado", extra: 6 }
        ].map((art) =>
          e(
            "button",
            {
              key: art.name,
              type: "button",
              className: `filter-pill-btn ${artLevel.name === art.name ? "is-active" : ""}`,
              onClick: () => setArtLevel(art)
            },
            `${art.name} (+$${art.extra})`
          )
        )
      ),
      e(
        "div",
        { style: { marginBottom: "1rem", fontSize: "1rem" } },
        "Valor de tu Set Personalizado: ",
        e("strong", { style: { color: "var(--accent-gold)" } }, formatCurrency(total))
      ),
      e(
        "button",
        { type: "button", className: "btn-gold btn-full", onClick: handleAddCustomSet },
        "AGREGAR ESTE SET A MI CITA →"
      )
    );
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(e(CustomNailCalculator));
}

/* ============================================================================
   9. EVENTOS PRINCIPALES, DOMICILIO GPS Y GUARDADO EN CLOUD FIRESTORE
   ============================================================================ */
$(document).ready(function () {
  loadCartFromStorage();
  initStorefrontContent();
  initD3LookbookHotspots();
  renderCartUI();
  runPreloaderAnimation();
  mountReactCustomKitBuilder();
  syncStoreWithFirebase();

  // Abrir y cerrar menú lateral y carrito/agenda
  $("#open-menu-btn").on("click", function () {
    $("#side-drawer").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  $("#open-cart-btn, #open-booking-drawer-btn").on("click", function () {
    $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  $("#close-menu-btn, #close-cart-btn, #drawer-backdrop, .drawer-nav-link").on("click", function () {
    $("#side-drawer, #side-cart").removeClass("is-open").attr("aria-hidden", "true");
    $("#drawer-backdrop").removeClass("is-active");
  });

  // Acordeón interactivo de la Ficha Técnica de Materiales al lado del 3D
  $(document).on("click", ".spec-header-btn", function () {
    const $parent = $(this).closest(".spec-item");
    $(".spec-item").removeClass("is-active");
    $parent.addClass("is-active");
  });

  // Botón para pedir el look exacto del modelo 3D de las manos
  $("#book-3d-look-btn").on("click", function () {
    addToCart({
      id: "sistema-3d-cobalto",
      title: STORE_CONFIG.model3D.systemTitle,
      price: STORE_CONFIG.model3D.systemPrice,
      image: STORE_CONFIG.hero.bgImage
    });
    $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  // Selector de Modalidad: En Estudio (Panorama) vs. A Domicilio
  $(".mode-btn").on("click", function () {
    $(".mode-btn").removeClass("is-active");
    $(this).addClass("is-active");
    deliveryMode = $(this).data("mode");

    if (deliveryMode === "domicilio") {
      $("#domicilio-fields").slideDown(220);
      deliveryFee = Number($("#booking-zone-select").val() || 0);
    } else {
      $("#domicilio-fields").slideUp(220);
      deliveryFee = 0;
      deliveryZoneLabel = "Atención en Estudio (Panorama, El Junquito)";
    }
    renderCartUI();
  });

  // Cambio de zona de domicilio en El Junquito / Caracas
  $("#booking-zone-select").on("change", function () {
    deliveryFee = Number($(this).val() || 0);
    deliveryZoneLabel = $(this).find("option:selected").text();
    renderCartUI();
  });

  // Botón de Captura de Ubicación GPS Exacta (Regla 5 - Bajo permiso del cliente)
  $("#get-gps-btn").on("click", function () {
    const $status = $("#gps-status-msg");
    if (!("geolocation" in navigator)) {
      $status.text("Tu navegador no soporta GPS. Escribe tu dirección arriba.");
      return;
    }

    $status.text("Obteniendo coordenadas GPS de tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        clientGpsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        $status.html(`<i class="ri-checkbox-circle-fill"></i> Ubicación GPS adjuntada con éxito.`);
      },
      function () {
        $status.text("Permiso de GPS denegado. Puedes escribir tu punto de referencia manualmente.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // Buscador en vivo con Debounce de Lodash
  $("#live-search-input").on(
    "input",
    _.debounce(function () {
      const allCatalog = [...STORE_CONFIG.setsProducts, ...STORE_CONFIG.arrivalsProducts];
      const cleanQuery = sanitizeInput($(this).val()).toLowerCase();
      const $resultsBox = $("#search-results-box");
      $resultsBox.empty();

      if (cleanQuery.length < 2) return;

      const matches = _.filter(allCatalog, (item) => item.title.toLowerCase().includes(cleanQuery));
      if (matches.length === 0) {
        $resultsBox.html('<div class="search-result-item">Sin servicios encontrados.</div>');
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

  // Control de giro del modelo 3D
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

  // Filtro de píldoras en catálogo
  $(document).on("click", "#filter-pills-container .filter-pill-btn", function () {
    $("#filter-pills-container .filter-pill-btn").removeClass("is-active");
    $(this).addClass("is-active");
    filterArrivalsByCategory($(this).data("category"));
  });

  $(document).on("click", ".category-card", function () {
    const targetFilter = $(this).data("filter");
    if (targetFilter) {
      $(`#filter-pills-container .filter-pill-btn[data-category="${targetFilter}"]`).trigger("click");
      document.getElementById("novedades").scrollIntoView({ behavior: "smooth" });
    }
  });

  // Agregar servicio al carrito
  $(document).on("click", ".add-to-cart-btn", function () {
    const allCatalog = [...STORE_CONFIG.setsProducts, ...STORE_CONFIG.arrivalsProducts];
    const prodId = $(this).data("id");
    const found = _.find(allCatalog, { id: prodId });
    if (found && found.inStock) {
      addToCart(found);
      const $btn = $(this);
      const originalText = $btn.text();
      $btn.text("✓ SERVICIO AGREGADO");
      setTimeout(() => $btn.text(originalText), 1200);
    }
  });

  // Agregar servicio desde un punto D3.js
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

  // Eliminar servicio del carrito
  $(document).on("click", ".remove-cart-item", function () {
    removeFromCart($(this).data("id"));
  });

  // CONFIRMAR CITA: Guarda en Cloud Firestore y envía el resumen + GPS a WhatsApp
  $("#checkout-whatsapp-btn").on("click", async function () {
    if (cartState.length === 0) {
      alert("Por favor selecciona al menos un servicio de uñas antes de agendar.");
      return;
    }

    const clientName = sanitizeInput($("#booking-client-name").val()) || "Clienta Web";
    const clientPhone = sanitizeInput($("#booking-client-phone").val()) || "No indicado";
    const bookingDate = sanitizeInput($("#booking-date").val()) || "Por coordinar";
    const bookingTime = sanitizeInput($("#booking-time").val()) || "Por coordinar";
    const addressRef = sanitizeInput($("#booking-address-ref").val()) || "Sin referencia adicional";

    const servicesSubtotal = _.sumBy(cartState, (i) => i.price * i.qty);
    const activeFee = deliveryMode === "domicilio" ? Number(deliveryFee) : 0;
    const totalAmount = servicesSubtotal + activeFee;

    const bookingRecord = {
      clientName,
      clientPhone,
      bookingDate,
      bookingTime,
      modality: deliveryMode === "domicilio" ? "Servicio a Domicilio" : "Estudio en Panorama (El Junquito)",
      zone: deliveryMode === "domicilio" ? deliveryZoneLabel : "El Junquito - Sector Panorama",
      addressReference: addressRef,
      gpsMapLink: clientGpsUrl || "No adjuntado",
      items: cartState.map((i) => ({ title: i.title, qty: i.qty, price: i.price })),
      deliveryFee: activeFee,
      totalAmount,
      status: "Pendiente",
      createdAt: new Date().toISOString()
    };

    // 1. Guarda la cita en tu Cloud Firestore (mipaginawed-519fd)
    if (dbFirestore) {
      try {
        await dbFirestore.collection("citas_agendadas").add(bookingRecord);
      } catch (e) {
        console.warn("Cita enviada directo a WhatsApp:", e);
      }
    }

    // 2. Construye el mensaje detallado para WhatsApp
    const itemsLines = cartState.map((i) => `• ${i.qty}x ${i.title} (${formatCurrency(i.price * i.qty)})`).join("\n");
    const locationLines =
      deliveryMode === "domicilio"
        ? `🛵 *Modalidad:* Servicio a Domicilio\n📍 *Zona:* ${deliveryZoneLabel}\n🏠 *Referencia:* ${addressRef}\n🗺️ *Ubicación GPS:* ${clientGpsUrl || "Se enviará por chat"}`
        : `🏪 *Modalidad:* En Estudio (El Junquito - Sector Panorama)`;

    const whatsappMsg = encodeURIComponent(
      `✨ *NUEVA CITA DE UÑAS — ${STORE_CONFIG.brandName.toUpperCase()}* ✨\n\n` +
        `👤 *Clienta:* ${clientName}\n` +
        `📱 *Teléfono:* ${clientPhone}\n` +
        `📅 *Fecha y Hora:* ${bookingDate} a las ${bookingTime}\n\n` +
        `${locationLines}\n\n` +
        `💅 *Servicios Solicitados:*\n${itemsLines}\n\n` +
        `*Total Estimado: ${formatCurrency(totalAmount)}*`
    );

    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${whatsappMsg}`, "_blank", "noopener,noreferrer");
  });

  // Formulario de Reseñas de Clientas conectado a Cloud Firestore
  $("#client-review-form").on("submit", async function (e) {
    e.preventDefault();
    const name = sanitizeInput($("#review-name").val());
    const service = sanitizeInput($("#review-service").val());
    const quote = sanitizeInput($("#review-comment").val());

    if (name.length < 2 || quote.length < 5) {
      $("#review-feedback").text("Por favor completa tu nombre y comentario.");
      return;
    }

    const newReview = {
      name,
      service,
      quote,
      image: STORE_CONFIG.lookbook.image,
      createdAt: new Date().toISOString()
    };

    if (dbFirestore) {
      try {
        await dbFirestore.collection("resenas_clientas").add(newReview);
        $("#review-feedback").text("¡Gracias! Tu reseña ya está publicada en vivo.");
        $("#client-review-form")[0].reset();
      } catch (err) {
        $("#review-feedback").text("Reseña recibida localmente.");
      }
    }
  });

  // Acordeones del Footer
  $(document).on("click", ".footer-accordion-trigger", function () {
    $(this).next(".footer-accordion-content").slideToggle(220);
  });

  // Newsletter
  $("#newsletter-form").on("submit", async function (e) {
    e.preventDefault();
    const cleanEmail = sanitizeInput($("#newsletter-email").val());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      $("#newsletter-feedback").text("Ingresa un correo electrónico válido.");
      return;
    }
    if (dbFirestore) {
      try {
        await dbFirestore.collection("club_vip_correos").add({
          email: cleanEmail,
          createdAt: new Date().toISOString()
        });
      } catch (err) {}
    }
    $("#newsletter-feedback").text("¡Bienvenida al Club VIP! Recibirás promos exclusivas.");
    $("#newsletter-email").val("");
  });

  // Banner Legal de Cookies
  try {
    if (localStorage.getItem("kalon_cookie_consent")) {
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

  $("#cookie-policy-link, #open-legal-modal").on("click", function () {
    $("#legal-modal").addClass("is-open").attr("aria-hidden", "false");
  });

  $("#close-legal-modal, #legal-modal").on("click", function (e) {
    if (e.target === this || $(e.target).closest("#close-legal-modal").length) {
      $("#legal-modal").removeClass("is-open").attr("aria-hidden", "true");
    }
  });
});

// Registro seguro del Service Worker para GitHub Pages
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
