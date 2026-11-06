/* LO MONACO · Versión 3 · Entradas al hacer scroll [P2]
   - Solo opacidad, desplazamiento y recorte: no mueven el layout (CLS 0) ni cargan nada.
   - Cada elemento entra una vez; los grupos (tarjetas, pasos, preguntas) entran escalonados.
   - Nunca en la zona de compra de la ficha (precio, medida, botón) ni en la cabecera.
   - Con «reducir movimiento» o sin IntersectionObserver no se anima nada. */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var $$ = LM.$$;
  var FUERA = '.p-top, .lm-head, .lm-top, .lm-drawer, .lm-stick, .p-scrub, .lm-sheet';

  var GRUPOS = [
    // [selector, tipo, escalonado]
    ['.lm-sec .lm-eyebrow, .c-head .lm-eyebrow', 'up'],
    ['.lm-sec .lm-h2, .c-head .lm-h2', 'title'],
    ['.lm-sec .lm-sub, .c-head .lm-sub, .lm-head2 > .lm-link, .lm-head2 > p, .h-call-k, .h-call-cta, .h-faq-call, .c-guide-call', 'up'],
    // 29/10: la franja de iconos se ve desde el principio, sin animación (parecía un fallo de carga)
    ['.p-ess-in > li', 'up', 1],
    ['.h-prod-grid > *, .h-packs-grid > *, .h4c-track > *, .c-grid > *, .h-cats-track > li, .h-alm-cards > *, .h-ugc-track > *', 'card', 1],
    ['.p-ben-grid > li, .h-trial-steps > li, .c-steps > li, .p-cond > div, .p-reco-grid > *, .p-xsell-grid > *, .p-rev-grid > *, .h-safe > *, .h-call-steps > li, .p-tech-dl > div', 'up', 1],
    ['.lm-faqs > *', 'up', 1],
    ['.h-alm-img, .h-call-img, .h-trial-hero, .h4p-img', 'img'],
    ['.h4p-box, .h4p-head .lm-sub', 'up'],
    // 06/11: el cuestionario entra igual que el resto de bloques
    ['.h4q-pts > li', 'up', 1],
    ['.h4q-box', 'up'],
    ['.c-table-wrap, .p-firm-box, .p-dura-q, .c-seo-in, .lm-foot-help', 'up'],
    ['.lm-foot-cols > *', 'up', 1]
  ];

  var vistos = [];
  GRUPOS.forEach(function (g) {
    $$(g[0]).forEach(function (el) {
      if (el.closest(FUERA) || vistos.indexOf(el) > -1) return;
      vistos.push(el);
      el.classList.remove('lm-rv', 'is-in');   // sustituye a la aparición simple de la versión 2
      el.classList.add('lm-a', 'lm-a--' + g[1]);
      if (g[2]) {
        var i = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty('--d', Math.min(i, 6) * 90 + 'ms');
      }
    });
  });

  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      // También se muestra lo que ya ha quedado por encima (al entrar con un ancla o con scroll rápido)
      if (x.isIntersecting || x.boundingClientRect.bottom < 0) { x.target.classList.add('is-in'); io.unobserve(x.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
  vistos.forEach(function (el) { io.observe(el); });

  // Red de seguridad: con un scroll muy rápido un bloque puede «saltarse» sin que el observador lo vea.
  // Todo lo que ya está a la altura de la pantalla o por encima se muestra.
  var pendientes = vistos.slice(), espera = 0;
  function repaso() {
    espera = 0;
    var limite = innerHeight * 0.95;
    pendientes = pendientes.filter(function (el) {
      if (el.classList.contains('is-in')) return false;
      if (el.getBoundingClientRect().top < limite) { el.classList.add('is-in'); io.unobserve(el); return false; }
      return true;
    });
    if (!pendientes.length) removeEventListener('scroll', alScroll);
  }
  function alScroll() { if (!espera) espera = setTimeout(repaso, 120); }
  addEventListener('scroll', alScroll, { passive: true });

  // Hero de la home: entrada escalonada al cargar
  var hero = document.querySelector('.h-hero');
  if (hero) {
    var piezas = $$('.h-hero-h1, .h-hero-t, .h-hero-s, .h-hero-eye, .h-hero-q, .h-hero-cta, .h-seal, .h4-t, .h4-sello, .h4-res, .h4-cta', hero);
    piezas.forEach(function (el, i) {
      el.classList.add('lm-a', 'lm-a--hero'); el.style.setProperty('--d', 120 + i * 110 + 'ms');
    });
    // Al cargar: cada pieza recibe «is-in» (si no, la regla general de .lm-a la dejaría invisible)
    var listo = function () { hero.classList.add('is-loaded'); piezas.forEach(function (el) { el.classList.add('is-in'); }); };
    requestAnimationFrame(function () { requestAnimationFrame(listo); });
    setTimeout(listo, 120); // respaldo: nunca dejar el hero sin texto
  }
  /* Paco, 06/11 · Parallax en puntos concretos (no en todo):
     - el sello «Desde 15 €/mes» sube algo más rápido que la página, sobre la foto del hero (que ya baja más despacio);
     - la foto de los packs y la de la chica de compromisos se desplazan dentro de su marco.
     Se usa la propiedad «translate», aparte de «transform», para no pisar las animaciones de entrada. */
  var PLX = [];
  $$('.h4-sello').forEach(function (el) { PLX.push({ el: el, sello: true }); });
  $$('.h4p-img img, .h4c-card--img img').forEach(function (el) {
    el.parentNode.classList.add('lm-plx');
    PLX.push({ el: el, caja: el.parentNode, v: 0.14 });
  });
  if (PLX.length) {
    var plxPend = 0;
    var plx = function () {
      plxPend = 0;
      var vh = innerHeight;
      PLX.forEach(function (p) {
        if (p.sello) { if (scrollY < vh * 1.2) p.el.style.translate = '0 ' + (-scrollY * 0.16).toFixed(1) + 'px'; return; }
        var r = p.caja.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var d = (r.top + r.height / 2 - vh / 2) * p.v, max = r.height * 0.07;
        p.el.style.translate = '0 ' + Math.max(-max, Math.min(max, d)).toFixed(1) + 'px';
      });
    };
    addEventListener('scroll', function () { if (!plxPend) plxPend = requestAnimationFrame(plx); }, { passive: true });
    addEventListener('resize', plx);
    plx();
  }

  document.documentElement.classList.add('lm-anim');
})();
