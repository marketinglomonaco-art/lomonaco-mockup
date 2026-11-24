/* LO MONACO · Carrusel «Nuestros compromisos» (cambio 12 de la home).
   Compartido: home y categoría (Diseño 1 · Opción A, comentario 5). Si la página no tiene #h4c-track, no hace nada. */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Panel lateral sencillo para «Ver condiciones» (reutiliza el estilo de los paneles .lm-sheet) */
  function hoja(titulo, html) {
    var d = document.createElement('div');
    d.className = 'lm-sheet';
    d.innerHTML = '<div class="lm-sheet-bg" data-close></div><aside class="lm-sheet-p" role="dialog" aria-modal="true" aria-label="' + titulo + '" tabindex="-1">' +
      '<button class="lm-sheet-x" type="button" data-close aria-label="Cerrar">' + LM.ico('close') + '</button>' +
      '<p class="lm-eyebrow">Condiciones</p><h2>' + titulo + '</h2><div class="h4-hoja">' + html + '</div></aside>';
    var antes = document.activeElement;
    function cerrar() { d.remove(); document.documentElement.classList.remove('lm-noscroll'); if (antes) antes.focus(); }
    d.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) cerrar(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
    document.body.appendChild(d);
    document.documentElement.classList.add('lm-noscroll');
    $('.lm-sheet-p', d).focus();
  }

  /* ---------- V4 · Cambio 12: compromisos de marca en carrusel ---------- */
  var IC = {
    phone: '<svg class="ic-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/><path class="ic-wave" d="M15 3.5a6 6 0 0 1 5.5 5.5M15 7a2.6 2.6 0 0 1 2 2"/></svg>',
    truck: '<svg class="ic-truck" viewBox="0 0 24 24"><g class="ic-body"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3.5 3.5v2.5h-7.5"/></g><circle class="ic-wheel" cx="6.5" cy="17.5" r="1.8"/><circle class="ic-wheel" cx="17" cy="17.5" r="1.8"/><path class="ic-speed" d="M.5 9h-2M.5 12h-3"/></svg>',
    moon: '<svg class="ic-moon" viewBox="0 0 24 24"><path class="ic-draw" pathLength="1" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/><path class="ic-star" d="M17 3.5v3M15.5 5h3"/><path class="ic-star ic-star2" d="M21 8.5v2M20 9.5h2"/></svg>',
    back: '<svg class="ic-back" viewBox="0 0 24 24"><g class="ic-spin"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></g></svg>',
    shield: '<svg class="ic-shield" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path class="ic-draw" pathLength="1" d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
    users: '<svg class="ic-users" viewBox="0 0 24 24"><g class="ic-u1"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/></g><g class="ic-u2"><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/></g></svg>',
    gem: '<svg class="ic-gem" viewBox="0 0 24 24"><g class="ic-g"><path d="M6.5 3.5h11l4 5.5L12 21 2.5 9z"/><path d="M2.5 9h19M9 3.5 12 9l3-5.5M12 9v12"/></g><path class="ic-spark" d="M20.5 1.5v3M19 3h3"/></svg>',
    card: '<svg class="ic-card" viewBox="0 0 24 24"><g class="ic-c"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></g><text class="ic-3" x="17" y="16.6" text-anchor="middle">12</text></svg>'
  };
  function ic(n, extra) { return '<span class="h4c-ic' + (extra || '') + '" aria-hidden="true">' + IC[n] + '</span>'; }
  function verCond(k) { return '<button type="button" class="h4c-more" data-cond="' + k + '">Ver condiciones</button>'; }

  /* Paco, 18/11: solo 5 compromisos (los valores de la marca) y con más presencia: cada uno con su cifra grande.
     Sin carrusel: rejilla fija. La foto de la chica con el móvil va con «Te ayudamos a elegir», en grande.
     Fuera: envío, devolución (va dentro de las 150 noches), producto premium y financiación. Sale igual en todas las páginas */
  var ct = $('#h4c-track');
  if (ct) {
    function partir(v) { var i = v.indexOf(' '); return i < 0 ? [v, ''] : [v.slice(0, i), v.slice(i + 1)]; }
    function cifra(n, u) { return '<div class="h4c-fig"><b>' + n + '</b><span>' + u + '</span></div>'; }
    /* Paco, 18/11 (después): fuera la foto pegada a la primera tarjeta y menos protagonismo al test (enlace, no botón).
       Cada tarjeta lleva arriba su foto, como cabecera (fotos reales de la web) */
    function foto(n, a, b, alt) {
      return '<div class="h4c-k-head"><img src="../img/' + n + '-' + a + '.webp" srcset="../img/' + n + '-' + a + '.webp ' + a + 'w, ../img/' + n + '-' + b + '.webp ' + b + 'w" sizes="(max-width: 700px) 82vw, 330px" alt="' + alt + '" width="' + a + '" height="' + Math.round(a * 0.625) + '" loading="lazy"></div>';
    }
    function k(img, icono, fig, titulo, texto, extra) {
      return '<li class="h4c-k">' + img + '<div class="h4c-k-b">' + '<div class="h4c-k-top">' + fig + icono + '</div><h3>' + titulo + '</h3><p>' + texto + '</p>' + (extra || '') + '</div></li>';
    }
    var pr = partir(C.prueba.v), ga = partir(C.garantia.v), tr = partir(C.trayectoria.v), test = (document.getElementById('cuestionario') ? '' : 'index.html') + '#cuestionario';
    /* Paco, 24/11: textos de Paco revisados con el tono de «La marca de toda la vida» (cercano, tranquilo, sin tecnicismos)
       y en su orden: asesoramiento, 150 noches, compra protegida, tres décadas, financiación y garantía */
    ct.innerHTML = [
      // 1 · Asesoramiento experto: el test, como enlace
      k(foto('comp-ayuda', 800, 896, 'Una mujer sonríe mirando el móvil tumbada en su cama Lomonaco'), '', ic('phone'), 'Asesoramiento experto',
        'Cuéntanos cómo duermes y te ayudamos a encontrar tu colchón, como siempre lo hemos hecho: con trato cercano y sin compromiso.',
        '<a class="h4c-more" href="' + test + '" data-lead="home-ayuda-test">Haz el test de 1 minuto</a>' +
        '<a class="h4c-more h4c-more--tel" href="tel:' + C.telefono.tel + '" data-lead="home-ayuda" data-testid="call-home-ayuda">o llámanos al ' + LM.mark(C.telefono, C.telefono.v) + '</a>'),
      // 2 · 150 noches de prueba (con la devolución dentro)
      k(foto('comp-noches-medio', 800, 800, 'Una mujer en pijama toma un café sentada en su cama Lomonaco'), ic('moon'), cifra(pr[0], pr[1] + ' de prueba'), 'Pruébalo con calma en casa',
        'Duerme en él todas las noches que necesites hasta saber que es el tuyo. Si no te convence, pasamos a recogerlo.', verCond('devolucion')),
      // 3 · Compra protegida (Trusted Shops)
      k(foto('comp-compra', 800, 1116, 'Una mujer ríe con una taza sentada en su cama'), '<span class="h4c-ic h4c-ic--ts" aria-hidden="true"><img src="../img/trusted-shops.png" alt="" width="124" height="116" loading="lazy"></span>',
        cifra(C.valoracion.media, 'de 5 en ' + C.valoracion.plataforma), 'Compra protegida',
        'Trusted Shops certifica nuestra tienda y protege tu compra de principio a fin. Compras con la misma tranquilidad de siempre.', '<a class="h4c-more" href="' + C.valoracion.url + '" target="_blank" rel="noopener">Ver las opiniones</a>'),
      // 4 · Tres décadas de confianza
      k(foto('comp-vida-medio', 800, 800, 'Una pareja lee abrazada en la cama, sobre su colchón Lomonaco'), ic('users'), cifra(tr[0], tr[1] + ' contigo'), 'Tres décadas de confianza',
        'Desde 1996, más de ' + LM.c('clientes') + ' clientes descansan con LOMONACO. La marca de toda la vida, de padres a hijos.'),
      // 5 · Financiación a tu medida (datos de LM.CONFIG.financiacion)
      k(foto('comp-financia-medio', 800, 800, 'Una mujer mira el móvil recostada en su cama Lomonaco'), ic('card'), cifra('36', 'meses para pagar'), 'Financiación a tu medida',
        'Págalo poco a poco, hasta en 36 meses, o en 12 meses sin intereses en compras desde 1.200 €.' + LM.ast, '<a class="h4c-more" href="#lm-legal">Ver condiciones</a>'),
      // 6 · 10 años de garantía
      k(foto('comp-garantia', 800, 1200, 'Una pareja lee en la cama con luz de mañana, sobre su colchón Lomonaco'), ic('shield'), cifra(ga[0], ga[1] + ' de garantía'), 'Calidad que dura',
        'Confiamos en cómo hacemos nuestros colchones. Por eso todos tienen 10 años de garantía, para que duermas tranquilo.', verCond('garantia'))
    ].join('');

    ct.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cond]'); if (!b) return;
      var k = b.getAttribute('data-cond');
      if (k === 'devolucion') hoja('Devoluciones', '<p><b>' + LM.c('devolucion') + '.</b></p><p>' + LM.c('devolucionCond') + '</p><p><a href="https://www.grupolomonaco.com/devoluciones/">Ver la página de devoluciones</a></p>');
      else hoja('Garantía de ' + LM.c('garantia'), '<p>' + LM.c('garantiaCubre') + '</p>');
      LM.track('trust_preview_open', { source: 'home-compromisos-' + k });
    });

    // Paco, 18/11: sigue en carrusel. Flechas y puntos
    var lis = $$('.h4c-k', ct), dots = $('#h4c-dots'), arr = $$('.h4c-arr');
    if (dots) dots.innerHTML = lis.map(function (_, i) { return '<button type="button" tabindex="-1" data-i="' + i + '"></button>'; }).join('');
    var db = dots ? $$('button', dots) : [];
    function ir(i) { var li = lis[Math.max(0, Math.min(lis.length - 1, i))]; ct.scrollTo({ left: li.offsetLeft - lis[0].offsetLeft, behavior: motion ? 'smooth' : 'auto' }); }
    function actual() {
      var x = ct.scrollLeft, best = 0;
      lis.forEach(function (li, i) { if (Math.abs(li.offsetLeft - lis[0].offsetLeft - x) < Math.abs(lis[best].offsetLeft - lis[0].offsetLeft - x)) best = i; });
      return best;
    }
    function pintar() {
      var a = actual(), fin = ct.scrollLeft + ct.clientWidth >= ct.scrollWidth - 4;
      db.forEach(function (b, i) { b.classList.toggle('is-on', fin ? i === db.length - 1 : i === a); });
      if (arr.length) { arr[0].disabled = ct.scrollLeft < 4; arr[1].disabled = fin; }
    }
    arr.forEach(function (b) { b.addEventListener('click', function () { ir(actual() + +b.getAttribute('data-dir')); }); });
    if (dots) dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ir(+b.getAttribute('data-i')); });
    var pend = 0;
    ct.addEventListener('scroll', function () { if (!pend) pend = requestAnimationFrame(function () { pend = 0; pintar(); }); }, { passive: true });
    addEventListener('resize', pintar);
    pintar();
  }

})();
