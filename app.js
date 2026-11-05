/**
 * ============================================================================
 * ARCHIVO 3: app.js - MOTOR MAESTRO MULTIRUBRO + DOLARAPI + 3D DESPIECE
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

// Lista blanca de correos administradores que jamás serán tratados como clientes normales
const MASTER_ADMIN_EMAILS = ["yakuzafadeco@gmail.com"];

let dbRealtime = null;
let dbFirestore = null;
let authFirebase = null;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  dbRealtime = firebase.database();
  dbFirestore = firebase.firestore();
  authFirebase = firebase.auth();
} catch (err) {
  console.warn("Modo local de respaldo activo:", err);
}

/* ============================================================================
   2. CONFIGURACIÓN MAESTRA ESCALABLE (REGLA 6)
   ============================================================================ */
let STORE_CONFIG = {
  businessMode: "services", // "services" (Citas/Uñas/Barbería) o "products" (Tienda/Ropa/Comida)
  brandName: "kalon nails",
  brandSpaced: "K A L O N",
  
  // Punto 1: Moneda ($ o €) y sincronización con https://ve.dolarapi.com/v1/dolares/oficial
  currencyCode: "USD", // "USD" o "EUR"
  currencySymbol: "$", // "$" o "€"
  autoSyncDolarApi: true,
  euroMultiplier: 1.09, // Factor de conversión cuando se selecciona Euro (€)
  exchangeRateBs: 45.50,
  
  // Punto 2: Configuración de duración y textos del Preloader inicial
  preloader: {
    enabled: true,
    subtitle: "ESTUDIO DE UÑAS & ARTE 3D",
    durationSeconds: 2.2
  },

  referralDiscountPercent: 10,
  whatsappNumber: "584120000000",

  theme: {
    accentColor: "#c9a86a",
    bgDark: "#0a0a0a"
  },

  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "",
    youtube: "",
    whatsapp: "https://wa.me/584120000000"
  },

  paymentMethodsInfo: {
    "Pago Móvil": "Banco: Mercantil (0105) • Tel: 0412-0000000 • CI: V-00.000.000 (Calculado a tasa oficial BCV)",
    "Efectivo Divisas": "Pago en efectivo ($ / €) directamente al momento de tu atención en Panorama o a domicilio.",
    "Zelle / Binance": "Correo Zelle / Binance Pay: pagos@kalonnails.com (Titular: Kalon Studio)",
    "Transferencia / Punto": "Coordinamos los datos de transferencia directamente al abrir tu chat de WhatsApp."
  },

  deliveryZones: [
    { label: "El Junquito - Sector Panorama / Km 11-13", fee: 3 },
    { label: "El Junquito - Pueblo / Km 14 al Km 23", fee: 5 },
    { label: "El Junquito - Km 4 al Km 10 / La Yaguara", fee: 5 },
    { label: "Caracas - Zonas Céntricas / Oeste / Este", fee: 8 }
  ],

  marqueeMessages: [
    "ESTUDIO EN EL JUNQUITO (SECTOR PANORAMA) Y SERVICIO VIP A DOMICILIO",
    "ÚNETE AL CLUB VIP Y GANA 10% DE DESCUENTO INVITANDO AMIGAS",
    "ESPECIALISTAS EN POLYGEL, SOFT GEL, KAPPING Y MANICURA RUSA",
    "INSPECCIONA NUESTROS TRABAJOS EN 3D Y VIDEOS EN TIEMPO REAL"
  ],

  navigation: [
    { label: "INICIO", href: "#main-content", hasSubmenu: false },
    { label: "MODELO 3D & DESPIECE", href: "#showcase-3d", hasSubmenu: false },
    { label: "VIDEOS & REELS", href: "#reels-section", hasSubmenu: false },
    { label: "DESTACADOS & PROMOS", href: "#colecciones", hasSubmenu: true },
    { label: "ESPECIALIDADES", href: "#categorias", hasSubmenu: true },
    { label: "CATÁLOGO COMPLETO", href: "#novedades", hasSubmenu: true },
    { label: "MAPA INTERACTIVO (PUNTOS)", href: "#lookbook", hasSubmenu: false },
    { label: "RESEÑAS DE CLIENTES", href: "#testimonios", hasSubmenu: false },
    { label: "UBICACIÓN & DOMICILIO", href: "#ubicacion", hasSubmenu: false }
  ],

  hero: {
    kicker: "ARTE Y PRECISIÓN EN TUS MANOS",
    titleMain: "DISEÑOS EXCLUSIVOS EN CADA",
    titleAccent: "detalle",
    lead: "Estructuras en Polygel, Soft Gel y Manicura Rusa de alta durabilidad. Atención en El Junquito (Panorama) o vamos hasta la comodidad de tu casa.",
    ctaText: "EXPLORAR EN 3D",
    bgImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80",
    badges: [
      { icon: "ri-shield-check-line", text: "Herramientas 100% Esterilizadas" },
      { icon: "ri-e-bike-2-line", text: "Estudio en Panorama + Servicio a Domicilio" }
    ]
  },

  // Punto 8: Visor 3D con ángulos de cámara por capa para efecto Desarmado y Auto-Centrado
  model3D: {
    subtitle: "INTERACCIÓN 360° • DESPIECE TÉCNICO",
    title: "Escultura & Materiales en 3D",
    desc: "Gira las manos con tu dedo o presiona 'Desarmar Capas' para ver cada material por separado y vuelve a centrarlo cuando quieras.",
    glbUrl: "./unas-demo.glb",
    systemPrice: 25,
    systemTitle: "SISTEMA ESCULPIDO AZUL COBALTO 3D (POLYGEL)",
    techSpecs: [
      {
        layer: "1. PREPARACIÓN & CUTÍCULA",
        name: "Manicura Rusa Combinada + Deshidratador pH",
        detail: "Limpieza profunda del bolsillo de la cutícula con brocas diamantadas suaves y nivelación de pH libre de ácido.",
        orbit: "-35deg 65deg 75%"
      },
      {
        layer: "2. BASE ADHERENTE & PROTECCIÓN",
        name: "Rubber Base Gel Flexible (Capa Amortiguadora)",
        detail: "Base elástica vitaminada que protege la uña natural y absorbe impactos sin quebrar la estructura.",
        orbit: "25deg 70deg 72%"
      },
      {
        layer: "3. ESTRUCTURA & ESCULPIDO",
        name: "Polygel Acrigel de Alta Densidad (Grado Salón)",
        detail: "Combina la fuerza del acrílico con la ligereza del gel. Curvatura C estilizada y duración de 21 a 30 días.",
        orbit: "-15deg 55deg 68%"
      },
      {
        layer: "4. COLOR, RELIEVE & BRILLO ESPEJO",
        name: "Esmalte Gel Azul Cobalto + Top Coat Cristal UV",
        detail: "Pigmento mineral de alta cobertura curado en lámpara LED/UV y sellado con Top Coat Diamond anti-rayaduras.",
        orbit: "10deg 80deg 65%"
      }
    ]
  },

  promoReels: [
    {
      id: "reel-1",
      tag: "POLYGEL EN VIVO",
      title: "Acabado Espejo & Relieve",
      price: 22,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-showing-her-manicured-nails-42622-large.mp4",
      poster: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "reel-2",
      tag: "MANICURA RUSA",
      title: "Preparación & Brillo Gel",
      price: 15,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-manicurist-painting-nails-with-pink-polish-41614-large.mp4",
      poster: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "reel-3",
      tag: "SOFT GEL VIP",
      title: "Diseño Francés & Cuidado",
      price: 18,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-nail-technician-filing-a-clients-nails-41611-large.mp4",
      poster: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=500&q=80"
    }
  ],

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
      content: "Seleccionas tus opciones en la web, eliges 'A Domicilio', adjuntas tu ubicación GPS y vamos directo hasta tu hogar."
    },
    {
      title: "¿CÓMO GANAR DESCUENTOS CON EL CLUB VIP?",
      content: "Toca el ícono de la corona arriba, crea tu cuenta gratis y comparte tu enlace de referido por WhatsApp. Tus amigas reciben 10% de descuento y tú sumas puntos canjeables."
    },
    {
      title: "GARANTÍA Y BIOSEGURIDAD",
      content: "Todos nuestros trabajos cuentan con garantía de aplicación de 5 días y materiales hipoalergénicos certificados."
    }
  ]
};

/* ============================================================================
   3. SINCRONIZACIÓN CON DOLARAPI OFICIAL ($ / €) Y FORMATEO (PUNTO 1)
   ============================================================================ */
let liveUsdOfficialRate = 0;

async function syncOfficialExchangeRate() {
  if (STORE_CONFIG.autoSyncDolarApi === false) return;
  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    if (!response.ok) return;
    const data = await response.json();
    if (data && data.promedio && Number(data.promedio) > 0) {
      liveUsdOfficialRate = Number(data.promedio);
      const isEuro = STORE_CONFIG.currencyCode === "EUR";
      const factor = isEuro ? Number(STORE_CONFIG.euroMultiplier || 1.09) : 1;
      STORE_CONFIG.exchangeRateBs = Number((liveUsdOfficialRate * factor).toFixed(2));

      // Refresca precios en las tarjetas y el carrito con la tasa oficial recién descargada
      renderProductCarousel(STORE_CONFIG.setsProducts, "#sets-carousel", true);
      if (STORE_CONFIG.arrivalFilters && STORE_CONFIG.arrivalFilters.length > 0) {
        const activeCat = $("#filter-pills-container .filter-pill-btn.is-active").data("category") || STORE_CONFIG.arrivalFilters[0];
        filterArrivalsByCategory(activeCat);
      }
      renderPromoReels();
      renderCartUI();
    }
  } catch (err) {
    console.warn("Usando tasa guardada en configuración:", err);
  }
}

function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return _.escape(str.trim()).replace(/[<>/"'`;()]/g, "");
}

function getActiveSymbol() {
  return STORE_CONFIG.currencyCode === "EUR" ? "€" : (STORE_CONFIG.currencySymbol || "$");
}

function formatCurrency(amount) {
  return `${getActiveSymbol()} ${Number(amount).toLocaleString("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatBs(foreignAmount) {
  const rate = Number(STORE_CONFIG.exchangeRateBs || 0);
  if (!rate || rate <= 0) return "";
  const bs = Number(foreignAmount) * rate;
  return `Bs. ${bs.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function applyDynamicTheme() {
  if (!STORE_CONFIG.theme) return;
  const root = document.documentElement;
  if (STORE_CONFIG.theme.accentColor) {
    root.style.setProperty("--accent-gold", STORE_CONFIG.theme.accentColor);
  }
  if (STORE_CONFIG.theme.bgDark) {
    root.style.setProperty("--bg-dark", STORE_CONFIG.theme.bgDark);
  }
}

/* ============================================================================
   4. HISTORIAL DEL BOTÓN "ATRÁS" DEL CELULAR / TABLET (PUNTO 5)
   ============================================================================ */
let isOverlayOpenInHistory = false;

function pushOverlayHistoryState(overlayName) {
  if (!isOverlayOpenInHistory) {
    window.history.pushState({ overlay: overlayName }, "");
    isOverlayOpenInHistory = true;
  }
}

function closeAllOverlaysUI() {
  $("#side-drawer, #side-cart").removeClass("is-open").attr("aria-hidden", "true");
  $("#drawer-backdrop").removeClass("is-active");
  $("#vip-modal, #legal-modal").removeClass("is-open").attr("aria-hidden", "true");
}

window.addEventListener("popstate", function () {
  if (
    $("#side-drawer").hasClass("is-open") ||
    $("#side-cart").hasClass("is-open") ||
    $("#vip-modal").hasClass("is-open") ||
    $("#legal-modal").hasClass("is-open")
  ) {
    isOverlayOpenInHistory = false;
    closeAllOverlaysUI();
  }
});

/* ============================================================================
   5. ACCESO SECRETO AL PANEL ADMIN CON 3 TOQUES EN EL NOMBRE (PUNTO 6)
   ============================================================================ */
function initSecretAdminTrigger() {
  let tapCount = 0;
  let tapTimer = null;

  $("#header-logo, #footer-secret-trigger").on("click", function (e) {
    e.preventDefault();
    tapCount += 1;

    if (tapTimer) clearTimeout(tapTimer);

    if (tapCount >= 3) {
      tapCount = 0;
      window.location.href = "admin.html";
      return;
    }

    tapTimer = setTimeout(() => {
      if (tapCount === 1 && $(this).attr("id") === "header-logo") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      tapCount = 0;
    }, 950);
  });
}

/* ============================================================================
   6. DESPIECE / DESARMADO DEL MODELO 3D Y AUTO-CENTRADO (PUNTO 8)
   ============================================================================ */
let is3DExploded = false;

function toggleExplode3DModel(forceState, targetOrbit) {
  const viewer = document.getElementById("main-3d-model");
  const $card = $("#viewer-3d-card");
  const $overlay = $("#exploded-layers-overlay");
  const $btn = $("#explode-3d-btn");

  if (!viewer) return;

  is3DExploded = typeof forceState === "boolean" ? forceState : !is3DExploded;

  if (is3DExploded) {
    $card.addClass("is-exploded");
    $btn.html('<i class="ri-stack-fill"></i> Unir Capas');
    viewer.removeAttribute("auto-rotate");

    // Si el archivo .glb incluye animación de separación, la reproduce
    if (viewer.availableAnimations && viewer.availableAnimations.length > 0) {
      viewer.animationName = viewer.availableAnimations[0];
      viewer.play({ repetitions: 1 });
    }

    // Mueve la cámara al ángulo de inspección de las capas
    viewer.cameraOrbit = targetOrbit || "-25deg 62deg 72%";
    viewer.fieldOfView = "22deg";

    // Construye y anima las etiquetas flotantes de despiece con Anime.js
    const specs = (STORE_CONFIG.model3D && STORE_CONFIG.model3D.techSpecs) || [];
    const chipsHtml = specs
      .map(
        (sp, idx) => `
        <div class="exploded-chip" data-idx="${idx}">
          <strong>${sanitizeInput(sp.layer)}</strong>
          <span>${sanitizeInput(sp.name)}</span>
        </div>
      `
      )
      .join("");
    $overlay.html(chipsHtml).attr("aria-hidden", "false");

    anime({
      targets: "#exploded-layers-overlay .exploded-chip",
      opacity: [0, 1],
      translateX: (el, i) => (i % 2 === 0 ? [-28, 0] : [28, 0]),
      scale: [0.88, 1],
      delay: anime.stagger(110),
      duration: 480,
      easing: "easeOutCubic"
    });
  } else {
    reset3DModelToCenter();
  }
}

function reset3DModelToCenter() {
  const viewer = document.getElementById("main-3d-model");
  const $card = $("#viewer-3d-card");
  const $overlay = $("#exploded-layers-overlay");
  const $btn = $("#explode-3d-btn");

  is3DExploded = false;
  $card.removeClass("is-exploded");
  $btn.html('<i class="ri-stack-line"></i> Desarmar Capas');

  if (viewer) {
    if (typeof viewer.pause === "function") viewer.pause();
    viewer.currentTime = 0;
    viewer.cameraOrbit = "0deg 75deg 105%";
    viewer.fieldOfView = "30deg";
    if (typeof viewer.resetTurntableRotation === "function") {
      viewer.resetTurntableRotation();
    }
    viewer.setAttribute("auto-rotate", "");
  }

  anime({
    targets: "#exploded-layers-overlay .exploded-chip",
    opacity: 0,
    scale: 0.85,
    duration: 240,
    easing: "easeInQuad",
    complete: function () {
      $overlay.empty().attr("aria-hidden", "true");
    }
  });
}

function init3DAutoRecenterOnScroll() {
  const sectionEl = document.getElementById("showcase-3d");
  if (!sectionEl || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Cuando el usuario baja o sube y sale de la sección 3D, vuelve a centrar el objeto automáticamente
        if (!entry.isIntersecting && is3DExploded) {
          reset3DModelToCenter();
        }
      });
    },
    { threshold: 0.15 }
  );
  observer.observe(sectionEl);
}

/* ============================================================================
   7. ESTADO DEL CARRITO, REFERIDOS VIP, DOMICILIO Y GPS
   ============================================================================ */
let cartState = [];
let deliveryMode = "estudio";
let deliveryFee = 0;
let deliveryZoneLabel = "En Sede (Panorama, El Junquito)";
let clientGpsUrl = "";
let appliedReferralCode = "";
let activeDiscountPercent = 0;
let currentVipProfile = null;

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("kalon_master_cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) cartState = parsed;
    }
    const savedRef = localStorage.getItem("kalon_referral_code");
    if (savedRef) {
      appliedReferralCode = sanitizeInput(savedRef);
      activeDiscountPercent = Number(STORE_CONFIG.referralDiscountPercent || 10);
      $("#cart-referral-code").val(appliedReferralCode);
      $("#referral-feedback-msg").text(`✓ Código ${appliedReferralCode} activo (-${activeDiscountPercent}%)`);
    }
  } catch (e) {
    cartState = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem("kalon_master_cart", JSON.stringify(cartState));
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

function calculateCartTotals() {
  const rawSubtotal = _.sumBy(cartState, (item) => item.price * item.qty);
  const discountAmount = activeDiscountPercent > 0 ? (rawSubtotal * activeDiscountPercent) / 100 : 0;
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const activeFee = deliveryMode === "domicilio" ? Number(deliveryFee) : 0;
  const grandTotal = discountedSubtotal + activeFee;

  return { rawSubtotal, discountAmount, activeFee, grandTotal };
}

function renderCartUI() {
  const totalCount = _.sumBy(cartState, "qty");
  const { discountAmount, grandTotal } = calculateCartTotals();

  $("#cart-count").text(totalCount);
  $("#cart-currency-label").text(`Total (${STORE_CONFIG.currencyCode || "USD"}):`);
  $("#cart-total-price").text(
    discountAmount > 0 ? `${formatCurrency(grandTotal)} (-${activeDiscountPercent}% VIP)` : formatCurrency(grandTotal)
  );
  $("#cart-total-bs").text(formatBs(grandTotal));

  const $container = $("#cart-items-container");
  $container.empty();

  if (cartState.length === 0) {
    $container.html('<p style="color: var(--text-muted); text-align:center; margin: 1.2rem 0; font-size:0.8rem;">Tu bolsa está vacía.</p>');
    return;
  }

  cartState.forEach((item) => {
    $container.append(`
      <div class="cart-item">
        <img src="${item.image}" alt="${sanitizeInput(item.title)}">
        <div class="cart-item-info">
          <div class="cart-item-title">${sanitizeInput(item.title)}</div>
          <div class="cart-item-price">${item.qty} x ${formatCurrency(item.price)} <span style="color:var(--text-muted); font-size:0.68rem;">(${formatBs(item.price)})</span></div>
        </div>
        <button class="icon-btn remove-cart-item" data-id="${item.id}" aria-label="Eliminar">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    `);
  });
}

/* ============================================================================
   8. CLUB VIP SEGURO (NO CONVIERTE CUENTAS DE ADMIN EN CLIENTES - PUNTO 4)
   ============================================================================ */
function checkUrlReferralParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref");
    if (refParam) {
      const cleanRef = sanitizeInput(refParam).toUpperCase();
      if (cleanRef.length >= 3) {
        appliedReferralCode = cleanRef;
        activeDiscountPercent = Number(STORE_CONFIG.referralDiscountPercent || 10);
        localStorage.setItem("kalon_referral_code", cleanRef);
        $("#cart-referral-code").val(cleanRef);
        $("#vip-invited-by").val(cleanRef);
        $("#referral-feedback-msg").text(`🎉 Invitación ${cleanRef} activada: Tienes ${activeDiscountPercent}% de descuento.`);
        renderCartUI();
      }
    }
  } catch (e) {}
}

function initVipAuthListener() {
  if (!authFirebase || !dbFirestore) return;

  authFirebase.onAuthStateChanged(async (user) => {
    if (!user) {
      currentVipProfile = null;
      $("#vip-profile-view").hide();
      $("#vip-auth-view").fadeIn(200);
      return;
    }

    const docRef = dbFirestore.collection("usuarios_vip").doc(user.uid);
    const snap = await docRef.get().catch(() => null);

    // IMPORTANTE (Punto 4): Solo lee el perfil si ya existe en usuarios_vip; NO crea un documento automático
    // al recargar la página para no degradar cuentas de Administrador a Cliente VIP.
    if (snap && snap.exists) {
      currentVipProfile = snap.data();
      $("#vip-auth-view").hide();
      $("#vip-profile-view").fadeIn(200);

      $("#vip-member-name").text(currentVipProfile.name || user.email);
      $("#vip-points-val").text(currentVipProfile.points || 100);
      $("#vip-referrals-val").text(currentVipProfile.referralsCount || 0);
      $("#vip-discount-val").text(`${currentVipProfile.discountPercent || 10}%`);
      $("#vip-my-code").text(currentVipProfile.referralCode || "VIP-10");

      if (!$("#booking-client-name").val()) {
        $("#booking-client-name").val(currentVipProfile.name);
      }
      activeDiscountPercent = Number(currentVipProfile.discountPercent || 10);
      renderCartUI();
    }
  });
}

/* ============================================================================
   9. SINCRONIZACIÓN EN VIVO CON FIREBASE
   ============================================================================ */
function syncStoreWithFirebase() {
  if (!dbRealtime) return;

  const configRef = dbRealtime.ref("store_config");
  configRef.on("value", (snapshot) => {
    const cloudData = snapshot.val();
    if (cloudData) {
      STORE_CONFIG = _.merge({}, STORE_CONFIG, cloudData);
      if (cloudData.setsProducts) STORE_CONFIG.setsProducts = cloudData.setsProducts;
      if (cloudData.arrivalsProducts) STORE_CONFIG.arrivalsProducts = cloudData.arrivalsProducts;
      if (cloudData.promoReels) STORE_CONFIG.promoReels = cloudData.promoReels;
      if (cloudData.lookbook && cloudData.lookbook.hotspots) {
        STORE_CONFIG.lookbook.hotspots = cloudData.lookbook.hotspots;
      }
      if (cloudData.model3D && cloudData.model3D.techSpecs) {
        STORE_CONFIG.model3D.techSpecs = cloudData.model3D.techSpecs;
      }

      applyDynamicTheme();
      initStorefrontContent();
      initD3LookbookHotspots();
      syncOfficialExchangeRate();
      renderCartUI();
    } else {
      configRef.set(STORE_CONFIG).catch(() => {});
      syncOfficialExchangeRate();
    }
  });

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
            renderTestimonialsList([...cloudReviews, ...STORE_CONFIG.testimonials]);
          }
        },
        () => {}
      );
  }
}

/* ============================================================================
   10. RENDERIZADO DE CONTENIDO, REDES, VIDEOS REELS Y MODO DE NEGOCIO
   ============================================================================ */
function initStorefrontContent() {
  applyDynamicTheme();

  const isProductStore = STORE_CONFIG.businessMode === "products";

  $("#cart-drawer-title").text(isProductStore ? "Tu Carrito de Compras" : "Tu Cita & Servicios");
  $("#booking-form-heading").html(
    isProductStore
      ? '<i class="ri-truck-line"></i> Datos de Envío & Facturación'
      : '<i class="ri-calendar-check-line"></i> Datos de tu Cita & Atención'
  );
  if (isProductStore) {
    $("#booking-datetime-row").hide();
    $("#label-mode-local").text("Retiro en Tienda");
    $("#label-mode-delivery").text("Delivery / Envío");
  } else {
    $("#booking-datetime-row").show();
    $("#label-mode-local").text("En Estudio (Panorama)");
    $("#label-mode-delivery").text("A Domicilio");
  }

  if (STORE_CONFIG.preloader && STORE_CONFIG.preloader.subtitle) {
    $("#preloader-sub").text(STORE_CONFIG.preloader.subtitle);
  }
  $("#preloader-brand").text(STORE_CONFIG.brandSpaced);
  $("#header-logo").text(STORE_CONFIG.brandName);
  $("#footer-brand-name").text(STORE_CONFIG.brandName.toUpperCase());

  // 1. Marquee Superior
  const marqueeItems = [...STORE_CONFIG.marqueeMessages, ...STORE_CONFIG.marqueeMessages]
    .map((msg) => `<span>${sanitizeInput(msg)}</span><span class="dot">•</span>`)
    .join("");
  $("#marquee-track").html(marqueeItems);

  // 2. Navegación y Redes Sociales Dinámicas
  const navHtml = (STORE_CONFIG.navigation || [])
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

  renderDynamicSocialLinks();

  // 3. Zonas de Domicilio e Instrucciones de Pago
  const sym = getActiveSymbol();
  const zonesHtml = [
    '<option value="0">Selecciona tu zona de domicilio...</option>',
    ...(STORE_CONFIG.deliveryZones || []).map(
      (z) => `<option value="${Number(z.fee)}">${sanitizeInput(z.label)} (+ ${sym}${z.fee})</option>`
    )
  ].join("");
  $("#booking-zone-select").html(zonesHtml);
  updatePaymentInstructionsUI();

  // 4. Portada Hero
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

  // 5. Visor 3D + Ficha Técnica de Materiales
  $("#3d-subtitle").text(STORE_CONFIG.model3D.subtitle);
  $("#3d-title").text(STORE_CONFIG.model3D.title);
  $("#3d-desc").text(STORE_CONFIG.model3D.desc);

  const viewerEl = document.getElementById("main-3d-model");
  if (viewerEl) {
    viewerEl.setAttribute("src", STORE_CONFIG.model3D.glbUrl);
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
      <div class="spec-item ${idx === 0 ? "is-active" : ""}" data-orbit="${spec.orbit || "-20deg 65deg 72%"}">
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

  // 6. Videos Cortos Publicitarios / Shoppable Reels
  renderPromoReels();

  // 7. Carrusel Principal y Especialidades
  renderProductCarousel(STORE_CONFIG.setsProducts, "#sets-carousel", true);
  renderCarouselDots((STORE_CONFIG.setsProducts || []).length, "#sets-dots");

  const catsHtml = (STORE_CONFIG.categories || [])
    .map(
      (cat) => `
      <article class="category-card" data-filter="${cat.filterTarget}">
        <img src="${cat.image}" alt="${sanitizeInput(cat.name)}" loading="lazy">
        <div class="category-overlay">
          <h3 class="category-name">${sanitizeInput(cat.name)}</h3>
          <span class="category-link">explorar →</span>
        </div>
      </article>
    `
    )
    .join("");
  $("#categories-grid").html(catsHtml);

  // 8. Filtros de Catálogo
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
  if (STORE_CONFIG.arrivalFilters && STORE_CONFIG.arrivalFilters.length > 0) {
    filterArrivalsByCategory(STORE_CONFIG.arrivalFilters[0]);
  }

  // 9. Garantías, Testimonios, Ubicación y Footer
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

  renderTestimonialsList(STORE_CONFIG.testimonials);

  $("#loc-title").text(STORE_CONFIG.location.title);
  $("#loc-city").text(STORE_CONFIG.location.city);
  $("#loc-details").html(`
    <li>
      <i class="ri-map-pin-line"></i>
      <div>
        <span class="location-label">SEDE & COBERTURA A DOMICILIO</span>
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
        <span class="location-label">WHATSAPP DIRECTO</span>
        <span>${sanitizeInput(STORE_CONFIG.location.phone)}</span>
      </div>
    </li>
  `);

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

function renderDynamicSocialLinks() {
  const s = STORE_CONFIG.socials || {};
  const iconMap = [
    { key: "instagram", icon: "ri-instagram-line", label: "Instagram" },
    { key: "tiktok", icon: "ri-tiktok-fill", label: "TikTok" },
    { key: "facebook", icon: "ri-facebook-circle-fill", label: "Facebook" },
    { key: "youtube", icon: "ri-youtube-fill", label: "YouTube" },
    { key: "whatsapp", icon: "ri-whatsapp-line", label: "WhatsApp" }
  ];

  const html = iconMap
    .filter((item) => s[item.key] && s[item.key].trim().length > 5)
    .map(
      (item) => `
      <a href="${s[item.key].trim()}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">
        <i class="${item.icon}"></i>
      </a>
    `
    )
    .join("");

  $("#footer-socials, #drawer-socials").html(html);
}

function renderPromoReels() {
  const reels = STORE_CONFIG.promoReels || [];
  if (reels.length === 0) {
    $("#reels-section").hide();
    return;
  }
  $("#reels-section").show();

  const html = reels
    .map(
      (r) => `
      <article class="reel-card">
        <span class="reel-badge-top">✦ ${sanitizeInput(r.tag || "REEL")}</span>
        <button type="button" class="reel-sound-btn" aria-label="Activar o silenciar audio">
          <i class="ri-volume-mute-line"></i>
        </button>
        <video 
          class="smart-reel-video"
          src="${r.videoUrl}" 
          poster="${r.poster || STORE_CONFIG.hero.bgImage}"
          muted 
          loop 
          playsinline 
          preload="metadata">
        </video>
        <div class="reel-overlay-bottom">
          <h3 class="reel-title">${sanitizeInput(r.title)}</h3>
          <div class="reel-price">${formatCurrency(r.price)} <span style="font-size:0.68rem; color:#ccc;">(${formatBs(r.price)})</span></div>
          <button type="button" class="btn-gold btn-full reel-buy-btn" data-id="${r.id}" style="padding:0.5rem; font-size:0.68rem;">
            LO QUIERO →
          </button>
        </div>
      </article>
    `
    )
    .join("");

  $("#reels-carousel").html(html);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.55 }
    );
    document.querySelectorAll(".smart-reel-video").forEach((v) => observer.observe(v));
  }
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
  const isProductStore = STORE_CONFIG.businessMode === "products";
  const btnLabelAvailable = isProductStore ? "AGREGAR AL CARRITO →" : "SELECCIONAR SERVICIO →";
  const btnLabelOut = isProductStore ? "AGOTADO" : "SIN CUPO HOY";

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
            ${!prod.inStock ? `<span class="tag-badge tag-soldout">${btnLabelOut}</span>` : ""}
          </div>
          ${discountPercent > 0 ? `<span class="tag-discount">-${discountPercent}%</span>` : ""}
          <img src="${prod.image}" alt="${sanitizeInput(prod.title)}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${sanitizeInput(prod.title)}</h3>
          <div class="product-pricing">
            ${prod.oldPrice ? `<span class="price-old">${formatCurrency(prod.oldPrice)}</span>` : ""}
            <span class="price-current">${formatCurrency(prod.price)}</span>
            <span class="price-bs-ref">(${formatBs(prod.price)})</span>
          </div>
          <button 
            type="button" 
            class="btn-card-action add-to-cart-btn" 
            data-id="${prod.id}"
            ${!prod.inStock ? "disabled" : ""}>
            ${prod.inStock ? btnLabelAvailable : btnLabelOut}
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

function updatePaymentInstructionsUI() {
  const method = $("#booking-payment-method").val();
  const infoMap = STORE_CONFIG.paymentMethodsInfo || {};
  const text = infoMap[method] || "Coordinamos los datos de pago por WhatsApp.";
  $("#payment-instructions-box").text(text);
}

/* ============================================================================
   11. ESCAPARATE INTERACTIVO CON D3.JS
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
            <span style="color:var(--accent-gold); font-size:0.82rem;">${formatCurrency(d.price)} (${formatBs(d.price)})</span>
          </div>
          <button type="button" class="btn-gold hotspot-buy-btn" data-id="${d.id}" style="padding:0.55rem 0.9rem; font-size:0.7rem;">
            AGREGAR +
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
   12. PRELOADER CONFIGURABLE CON ANIME.JS (PUNTO 2) Y COTIZADOR REACT
   ============================================================================ */
function runPreloaderAnimation() {
  if (STORE_CONFIG.preloader && STORE_CONFIG.preloader.enabled === false) {
    $("#preloader").hide();
    return;
  }

  const totalSec = Number((STORE_CONFIG.preloader && STORE_CONFIG.preloader.durationSeconds) || 2.2);
  const stepMs = Math.max(250, Math.round((totalSec * 1000) / 3.2));

  const tl = anime.timeline({ easing: "easeOutExpo" });

  tl.add({
    targets: ".preloader-subtitle",
    opacity: [0, 1],
    translateY: [10, 0],
    duration: stepMs
  })
    .add(
      {
        targets: ".preloader-title",
        opacity: [0, 1],
        letterSpacing: ["0.55em", "0.35em"],
        duration: stepMs * 1.2
      },
      "-=250"
    )
    .add(
      {
        targets: ".preloader-line",
        width: ["0%", "75%"],
        duration: stepMs
      },
      "-=400"
    )
    .add({
      targets: "#preloader",
      opacity: [1, 0],
      duration: 550,
      delay: Math.max(150, Math.round(stepMs * 0.4)),
      complete: function () {
        $("#preloader").css("display", "none");
      }
    });
}

function mountReactCustomKitBuilder() {
  const rootEl = document.getElementById("react-custom-kit-root");
  if (!rootEl || typeof React === "undefined" || typeof ReactDOM === "undefined") return;

  const e = React.createElement;

  function CustomKitCalculator() {
    const [baseOpt, setBaseOpt] = React.useState({ name: "Polygel Esculpido", price: 22 });
    const [sizeOpt, setSizeOpt] = React.useState({ name: "Largo Medio (#1-#3)", extra: 0 });
    const [finishOpt, setFinishOpt] = React.useState({ name: "Francés / Efecto Espejo", extra: 3 });

    const total = baseOpt.price + sizeOpt.extra + finishOpt.extra;

    function handleAddCustom() {
      addToCart({
        id: `custom-pack-${Date.now()}`,
        title: `${baseOpt.name} (${sizeOpt.name} + ${finishOpt.name})`,
        price: total,
        image: STORE_CONFIG.lookbook.image
      });
      pushOverlayHistoryState("cart");
      $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
      $("#drawer-backdrop").addClass("is-active");
    }

    return e(
      "div",
      { className: "react-kit-box" },
      e("span", { className: "section-subtitle" }, "COTIZADOR INTERACTIVO (REACT)"),
      e("h3", { className: "section-title", style: { fontSize: "1.65rem" } }, "Personaliza a tu Medida"),
      e("p", { className: "section-desc", style: { marginBottom: "1rem" } }, "Combina opciones y calcula tu presupuesto al instante:"),
      e(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem", marginBottom: "0.8rem" } },
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
              className: `filter-pill-btn ${baseOpt.name === sys.name ? "is-active" : ""}`,
              onClick: () => setBaseOpt(sys)
            },
            `${sys.name} (${getActiveSymbol()}${sys.price})`
          )
        )
      ),
      e(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem", marginBottom: "0.8rem" } },
        [
          { name: "Largo Medio (#1-#3)", extra: 0 },
          { name: "Largo XL (#4-#6)", extra: 5 }
        ].map((len) =>
          e(
            "button",
            {
              key: len.name,
              type: "button",
              className: `filter-pill-btn ${sizeOpt.name === len.name ? "is-active" : ""}`,
              onClick: () => setSizeOpt(len)
            },
            `${len.name} (+${getActiveSymbol()}${len.extra})`
          )
        )
      ),
      e(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem", marginBottom: "1rem" } },
        [
          { name: "Tono Liso + Top Cristal", extra: 0 },
          { name: "Francés / Efecto Espejo", extra: 3 },
          { name: "Relieve 3D / Encapsulado", extra: 6 }
        ].map((art) =>
          e(
            "button",
            {
              key: art.name,
              type: "button",
              className: `filter-pill-btn ${finishOpt.name === art.name ? "is-active" : ""}`,
              onClick: () => setFinishOpt(art)
            },
            `${art.name} (+${getActiveSymbol()}${art.extra})`
          )
        )
      ),
      e(
        "div",
        { style: { marginBottom: "1rem", fontSize: "0.95rem" } },
        "Total Personalizado: ",
        e("strong", { style: { color: "var(--accent-gold)" } }, `${formatCurrency(total)} (${formatBs(total)})`)
      ),
      e(
        "button",
        { type: "button", className: "btn-gold btn-full", onClick: handleAddCustom },
        "AGREGAR COMBINACIÓN →"
      )
    );
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(e(CustomKitCalculator));
}

/* ============================================================================
   13. EVENTOS DE INTERFAZ, DESPIECE 3D, VIP, REELS, GPS Y CHECKOUT
   ============================================================================ */
$(document).ready(function () {
  loadCartFromStorage();
  initStorefrontContent();
  initD3LookbookHotspots();
  checkUrlReferralParam();
  renderCartUI();
  runPreloaderAnimation();
  mountReactCustomKitBuilder();
  initVipAuthListener();
  initSecretAdminTrigger();
  init3DAutoRecenterOnScroll();
  syncStoreWithFirebase();
  syncOfficialExchangeRate();

  // Abrir Menú Lateral, Carrito y Modales registrando en Historial para el botón "Atrás" (Punto 5)
  $("#open-menu-btn").on("click", function () {
    pushOverlayHistoryState("menu");
    $("#side-drawer").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  $("#open-cart-btn, #open-booking-drawer-btn").on("click", function () {
    pushOverlayHistoryState("cart");
    $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

  $("#close-menu-btn, #close-cart-btn, #drawer-backdrop, .drawer-nav-link").on("click", function () {
    closeAllOverlaysUI();
    if (isOverlayOpenInHistory) {
      isOverlayOpenInHistory = false;
      window.history.back();
    }
  });

  $("#open-vip-btn, #hero-vip-btn").on("click", function () {
    pushOverlayHistoryState("vip");
    $("#vip-modal").addClass("is-open").attr("aria-hidden", "false");
  });

  $("#close-vip-modal, #vip-modal").on("click", function (e) {
    if (e.target === this || $(e.target).closest("#close-vip-modal").length) {
      $("#vip-modal").removeClass("is-open").attr("aria-hidden", "true");
      if (isOverlayOpenInHistory) {
        isOverlayOpenInHistory = false;
        window.history.back();
      }
    }
  });

  // Botones de Desarmar / Capas 3D y Centrar (Punto 8)
  $("#explode-3d-btn").on("click", function () {
    toggleExplode3DModel();
  });

  $("#reset-3d-btn").on("click", function () {
    reset3DModelToCenter();
  });

  // Al tocar una etapa de material o una etiqueta flotante, enfoca esa capa en el 3D
  $(document).on("click", ".spec-header-btn", function () {
    const $parent = $(this).closest(".spec-item");
    $(".spec-item").removeClass("is-active");
    $parent.addClass("is-active");

    const orbit = $parent.data("orbit") || "-20deg 65deg 70%";
    toggleExplode3DModel(true, orbit);
  });

  $(document).on("click", ".exploded-chip", function () {
    const idx = Number($(this).data("idx") || 0);
    const $targetSpec = $(".spec-item").eq(idx);
    if ($targetSpec.length) {
      $(".spec-item").removeClass("is-active");
      $targetSpec.addClass("is-active");
      const viewer = document.getElementById("main-3d-model");
      if (viewer) {
        viewer.cameraOrbit = $targetSpec.data("orbit") || "15deg 65deg 68%";
      }
    }
  });

  // Registro voluntario de Cuenta VIP (Con protección para correos Admin - Punto 4)
  $("#vip-auth-form").on("submit", async function (e) {
    e.preventDefault();
    if (!authFirebase) return;

    const name = sanitizeInput($("#vip-user-name").val()) || "Miembro VIP";
    const email = $("#vip-user-email").val().trim().toLowerCase();
    const pass = $("#vip-user-pass").val();
    const invitedBy = sanitizeInput($("#vip-invited-by").val()).toUpperCase();
    const isMasterAdmin = MASTER_ADMIN_EMAILS.includes(email);

    $("#vip-auth-feedback").text("Activando tu tarjeta VIP...");

    try {
      const cred = await authFirebase.createUserWithEmailAndPassword(email, pass);
      const prefix = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5) || "VIP";
      const myCode = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

      const newProfile = {
        uid: cred.user.uid,
        name,
        email,
        referralCode: myCode,
        invitedBy: invitedBy || "",
        points: 150,
        referralsCount: 0,
        discountPercent: 10,
        isAdmin: isMasterAdmin,
        createdAt: new Date().toISOString()
      };

      if (dbFirestore) {
        await dbFirestore.collection("usuarios_vip").doc(cred.user.uid).set(newProfile);

        if (invitedBy.length >= 3) {
          const refSnap = await dbFirestore
            .collection("usuarios_vip")
            .where("referralCode", "==", invitedBy)
            .limit(1)
            .get();
          refSnap.forEach((doc) => {
            const d = doc.data();
            doc.ref.update({
              referralsCount: Number(d.referralsCount || 0) + 1,
              points: Number(d.points || 100) + 100
            });
          });
        }
      }
      $("#vip-auth-feedback").text("¡Cuenta VIP creada con éxito!");
      initVipAuthListener();
    } catch (err) {
      $("#vip-auth-feedback").text("Si ya tienes cuenta con ese correo, toca 'YA TENGO CUENTA'.");
    }
  });

  $("#vip-login-btn").on("click", async function () {
    if (!authFirebase) return;
    const email = $("#vip-user-email").val().trim().toLowerCase();
    const pass = $("#vip-user-pass").val();
    if (!email || !pass) {
      $("#vip-auth-feedback").text("Ingresa tu correo y contraseña arriba.");
      return;
    }
    $("#vip-auth-feedback").text("Iniciando sesión VIP...");
    try {
      const cred = await authFirebase.signInWithEmailAndPassword(email, pass);
      if (dbFirestore) {
        const docRef = dbFirestore.collection("usuarios_vip").doc(cred.user.uid);
        const snap = await docRef.get();
        if (!snap.exists) {
          const prefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5) || "VIP";
          await docRef.set({
            uid: cred.user.uid,
            name: prefix,
            email,
            referralCode: `${prefix}-${Math.floor(100 + Math.random() * 900)}`,
            points: 100,
            referralsCount: 0,
            discountPercent: 10,
            isAdmin: MASTER_ADMIN_EMAILS.includes(email),
            createdAt: new Date().toISOString()
          });
        }
      }
      $("#vip-auth-feedback").text("");
      initVipAuthListener();
    } catch (err) {
      $("#vip-auth-feedback").text("Correo o contraseña incorrectos.");
    }
  });

  $("#vip-logout-btn").on("click", function () {
    if (authFirebase) authFirebase.signOut();
  });

  $("#share-referral-wa-btn").on("click", function () {
    const code = $("#vip-my-code").text().trim();
    const baseUrl = window.location.origin + window.location.pathname;
    const shareLink = `${baseUrl}?ref=${encodeURIComponent(code)}`;
    const msg = encodeURIComponent(
      `✨ ¡Hola! Te regalo un *${STORE_CONFIG.referralDiscountPercent || 10}% de descuento* en *${STORE_CONFIG.brandName.toUpperCase()}* usando mi código VIP *${code}* o entrando directo a este enlace:\n\n👉 ${shareLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
  });

  $("#apply-referral-btn").on("click", function () {
    const code = sanitizeInput($("#cart-referral-code").val()).toUpperCase();
    if (code.length < 3) {
      $("#referral-feedback-msg").text("Ingresa un código válido.");
      return;
    }
    appliedReferralCode = code;
    activeDiscountPercent = Number(STORE_CONFIG.referralDiscountPercent || 10);
    localStorage.setItem("kalon_referral_code", code);
    $("#referral-feedback-msg").text(`✓ Código ${code} aplicado (-${activeDiscountPercent}% de descuento)`);
    renderCartUI();
  });

  // Sonido y Compra desde Videos Cortos (Reels)
  $(document).on("click", ".reel-sound-btn", function () {
    const videoEl = $(this).siblings("video")[0];
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    $(this).html(videoEl.muted ? '<i class="ri-volume-mute-line"></i>' : '<i class="ri-volume-up-line"></i>');
  });

  $(document).on("click", ".reel-buy-btn", function () {
    const reelId = $(this).data("id");
    const foundReel = _.find(STORE_CONFIG.promoReels, { id: reelId });
    if (foundReel) {
      addToCart({
        id: foundReel.id,
        title: foundReel.title,
        price: foundReel.price,
        image: foundReel.poster || STORE_CONFIG.hero.bgImage
      });
      pushOverlayHistoryState("cart");
      $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
      $("#drawer-backdrop").addClass("is-active");
    }
  });

  $("#book-3d-look-btn").on("click", function () {
    reset3DModelToCenter();
    addToCart({
      id: "sistema-3d-estrella",
      title: STORE_CONFIG.model3D.systemTitle,
      price: STORE_CONFIG.model3D.systemPrice,
      image: STORE_CONFIG.hero.bgImage
    });
    pushOverlayHistoryState("cart");
    $("#side-cart").addClass("is-open").attr("aria-hidden", "false");
    $("#drawer-backdrop").addClass("is-active");
  });

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
      deliveryZoneLabel = "En Sede (Panorama, El Junquito)";
    }
    renderCartUI();
  });

  $("#booking-zone-select").on("change", function () {
    deliveryFee = Number($(this).val() || 0);
    deliveryZoneLabel = $(this).find("option:selected").text();
    renderCartUI();
  });

  $("#booking-payment-method").on("change", updatePaymentInstructionsUI);

  $("#get-gps-btn").on("click", function () {
    const $status = $("#gps-status-msg");
    if (!("geolocation" in navigator)) {
      $status.text("Tu navegador no soporta GPS. Escribe tu dirección arriba.");
      return;
    }
    $status.text("Obteniendo coordenadas GPS...");
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        clientGpsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        $status.html('<i class="ri-checkbox-circle-fill"></i> Ubicación GPS exacta adjuntada.');
      },
      function () {
        $status.text("Permiso GPS denegado. Escribe tu punto de referencia arriba.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  $("#live-search-input").on(
    "input",
    _.debounce(function () {
      const allCatalog = [...(STORE_CONFIG.setsProducts || []), ...(STORE_CONFIG.arrivalsProducts || [])];
      const cleanQuery = sanitizeInput($(this).val()).toLowerCase();
      const $resultsBox = $("#search-results-box");
      $resultsBox.empty();

      if (cleanQuery.length < 2) return;

      const matches = _.filter(allCatalog, (item) => item.title.toLowerCase().includes(cleanQuery));
      if (matches.length === 0) {
        $resultsBox.html('<div class="search-result-item">Sin coincidencias.</div>');
        return;
      }

      matches.forEach((m) => {
        $resultsBox.append(`
          <div class="search-result-item add-to-cart-btn" data-id="${m.id}">
            <span>${sanitizeInput(m.title)}</span>
            <strong>${formatCurrency(m.price)}</strong>
          </div>
        `);
      });
    }, 220)
  );

  $("#toggle-3d-rotate").on("click", function () {
    const viewer = document.getElementById("main-3d-model");
    if (!viewer) return;
    if (viewer.hasAttribute("auto-rotate")) {
      viewer.removeAttribute("auto-rotate");
      $(this).html('<i class="ri-play-line"></i> Giro');
    } else {
      viewer.setAttribute("auto-rotate", "");
      $(this).html('<i class="ri-pause-line"></i> Giro');
    }
  });

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

  $(document).on("click", ".add-to-cart-btn", function () {
    const allCatalog = [...(STORE_CONFIG.setsProducts || []), ...(STORE_CONFIG.arrivalsProducts || [])];
    const prodId = $(this).data("id");
    const found = _.find(allCatalog, { id: prodId });
    if (found && found.inStock !== false) {
      addToCart(found);
      const $btn = $(this);
      if ($btn.hasClass("btn-card-action")) {
        const originalText = $btn.text();
        $btn.text("✓ AGREGADO");
        setTimeout(() => $btn.text(originalText), 1100);
      }
    }
  });

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

  $(document).on("click", ".remove-cart-item", function () {
    removeFromCart($(this).data("id"));
  });

  $("#checkout-whatsapp-btn").on("click", async function () {
    if (cartState.length === 0) {
      alert("Selecciona al menos un servicio o producto antes de confirmar.");
      return;
    }

    const clientName = sanitizeInput($("#booking-client-name").val()) || "Cliente Web";
    const clientPhone = sanitizeInput($("#booking-client-phone").val()) || "No indicado";
    const bookingDate = sanitizeInput($("#booking-date").val()) || "Por coordinar";
    const bookingTime = sanitizeInput($("#booking-time").val()) || "Por coordinar";
    const addressRef = sanitizeInput($("#booking-address-ref").val()) || "Sin referencia adicional";
    const paymentMethod = sanitizeInput($("#booking-payment-method").val()) || "Por acordar";

    const { discountAmount, activeFee, grandTotal } = calculateCartTotals();

    const bookingRecord = {
      clientName,
      clientPhone,
      bookingDate,
      bookingTime,
      modality: deliveryMode === "domicilio" ? "A Domicilio" : "En Sede (Panorama)",
      zone: deliveryMode === "domicilio" ? deliveryZoneLabel : "El Junquito - Sector Panorama",
      addressReference: addressRef,
      gpsMapLink: clientGpsUrl || "No adjuntado",
      paymentMethod,
      referralCodeUsed: appliedReferralCode || "Ninguno",
      discountApplied: discountAmount,
      items: cartState.map((i) => ({ title: i.title, qty: i.qty, price: i.price })),
      deliveryFee: activeFee,
      currencyCode: STORE_CONFIG.currencyCode || "USD",
      totalAmount: grandTotal,
      totalBsRef: formatBs(grandTotal),
      status: "Pendiente",
      createdAt: new Date().toISOString()
    };

    if (dbFirestore) {
      try {
        await dbFirestore.collection("citas_agendadas").add(bookingRecord);
        if (currentVipProfile && currentVipProfile.uid) {
          await dbFirestore
            .collection("usuarios_vip")
            .doc(currentVipProfile.uid)
            .update({
              points: Number(currentVipProfile.points || 100) + 50
            });
        }
      } catch (e) {}
    }

    const itemsLines = cartState.map((i) => `• ${i.qty}x ${i.title} (${formatCurrency(i.price * i.qty)})`).join("\n");
    const locationLines =
      deliveryMode === "domicilio"
        ? `🛵 *Modalidad:* A Domicilio\n📍 *Zona:* ${deliveryZoneLabel}\n🏠 *Referencia:* ${addressRef}\n🗺️ *Mapa GPS:* ${clientGpsUrl || "Se enviará por chat"}`
        : `🏪 *Modalidad:* En Sede (${STORE_CONFIG.location.title})`;

    const dateLine =
      STORE_CONFIG.businessMode === "products" ? "" : `📅 *Fecha y Hora:* ${bookingDate} a las ${bookingTime}\n`;
    const refLine = appliedReferralCode ? `🎁 *Código VIP Aplicado:* ${appliedReferralCode} (-${activeDiscountPercent}%)\n` : "";

    const whatsappMsg = encodeURIComponent(
      `✨ *NUEVA SOLICITUD — ${STORE_CONFIG.brandName.toUpperCase()}* ✨\n\n` +
        `👤 *Cliente:* ${clientName}\n` +
        `📱 *Teléfono:* ${clientPhone}\n` +
        dateLine +
        `💳 *Método de Pago:* ${paymentMethod}\n` +
        refLine +
        `\n${locationLines}\n\n` +
        `🛍️ *Detalle:*\n${itemsLines}\n\n` +
        `*Total (${STORE_CONFIG.currencyCode || "USD"}): ${formatCurrency(grandTotal)}*\n` +
        `*Equivalente BCV: ${formatBs(grandTotal)}*`
    );

    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${whatsappMsg}`, "_blank", "noopener,noreferrer");
  });

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
        $("#review-feedback").text("Reseña recibida.");
      }
    }
  });

  $(document).on("click", ".footer-accordion-trigger", function () {
    $(this).next(".footer-accordion-content").slideToggle(220);
  });

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
    $("#newsletter-feedback").text("¡Suscripción exitosa!");
    $("#newsletter-email").val("");
  });

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
    pushOverlayHistoryState("legal");
    $("#legal-modal").addClass("is-open").attr("aria-hidden", "false");
  });

  $("#close-legal-modal, #legal-modal").on("click", function (e) {
    if (e.target === this || $(e.target).closest("#close-legal-modal").length) {
      $("#legal-modal").removeClass("is-open").attr("aria-hidden", "true");
      if (isOverlayOpenInHistory) {
        isOverlayOpenInHistory = false;
        window.history.back();
      }
    }
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
