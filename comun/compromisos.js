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
    card: '<svg class="ic-card" viewBox="0 0 24 24"><g class="ic-c"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/></g><text class="ic-3" x="17" y="16.6" text-anchor="middle">3</text></svg>'
  };
  function ic(n, extra) { return '<span class="h4c-ic' + (extra || '') + '" aria-hidden="true">' + IC[n] + '</span>'; }
  function verCond(k) { return '<button type="button" class="h4c-more" data-cond="' + k + '">Ver condiciones</button>'; }

  var ct = $('#h4c-track');
  if (ct) {
    var cards = [
      // 1 · Te ayudamos a elegir (más ancha, con foto)
      '<li class="h4c-card h4c-card--call"><figure class="h4c-img"><img src="../img/llamada-movil-800.webp" srcset="../img/llamada-movil-800.webp 800w, ../img/llamada-movil-1200.webp 1200w" sizes="(max-width: 700px) 86vw, 30vw" width="800" height="597" alt="Una mujer mira su móvil sentada en la cama" loading="lazy"></figure>' +
        '<div class="h4c-b">' + ic('phone') + '<h3>Te ayudamos a elegir</h3>' +
        '<p>Cuéntanos cómo duermes y te recomendamos el colchón que encaja contigo. Sin compromiso.</p>' +
        '<ol class="h4c-q"><li><b>1</b>¿Cómo duermes? De lado, boca arriba o boca abajo.</li><li><b>2</b>¿Pasas calor por la noche?</li><li><b>3</b>¿Duermes solo o en pareja?</li></ol>' +
        // 29/10: la llamada pasa a ser un CTA (botón LM), sin caja gris
        '<div class="h4c-call"><a class="lm-btn h4c-cta" href="tel:' + C.telefono.tel + '" data-lead="home-ayuda" data-testid="call-home-ayuda">' + LM.ico('phone') + 'Llamar al ' + LM.mark(C.telefono, C.telefono.v) + '</a>' +
        '<p class="h4c-hor">' + C.horario.v + ' · <a href="https://wa.me/+34650282094" data-lead="whatsapp">o escríbenos por WhatsApp</a></p></div></div></li>',
      // 2 · Envío
      '<li class="h4c-card">' + ic('truck') + '<h3>Te lo llevamos a casa</h3><p>' + LM.c('envio') + '. Te llega en ' + LM.c('entrega') + '.</p></li>',
      // 3 · 14 noches (con foto y el número en grande)
      '<li class="h4c-card h4c-card--foto"><figure class="h4c-img"><img src="../img/prueba-800.webp" width="800" height="506" alt="Una persona se despierta y se estira en su cama" loading="lazy"><b class="h4c-big" aria-hidden="true">14</b></figure>' +
        '<div class="h4c-b">' + ic('moon') + '<h3>Pruébalo ' + LM.c('prueba') + ' en tu cama</h3><p>El cuerpo necesita unos días para acostumbrarse. Tómate tu tiempo.</p></div></li>',
      // 4 · Devolución
      '<li class="h4c-card">' + ic('back') + '<h3>Si no te convence, lo devuelves</h3><p>' + LM.c('devolucion') + '. Tienes las ' + LM.c('prueba') + ' de prueba para decidir.</p>' + verCond('devolucion') + '</li>',
      // 5 · Garantía
      '<li class="h4c-card">' + ic('shield') + '<h3>' + LM.c('garantia') + ' de garantía</h3><p>En todos nuestros colchones. Cubre los defectos de fabricación y el núcleo.</p>' + verCond('garantia') + '</li>',
      // 6 · Compra garantizada (sello Trusted Shops)
      '<li class="h4c-card"><span class="h4c-ic h4c-ic--ts" aria-hidden="true"><img src="../img/trusted-shops.png" alt="" width="124" height="116" loading="lazy"></span><h3>Compra garantizada</h3><p>' + LM.c('compraGarantizada') + '.</p>' + LM.rating('h4c-rate') + '</li>',
      // 7 · Trayectoria y clientes
      '<li class="h4c-card">' + ic('users') + '<h3>' + LM.c('trayectoria') + ' y <span class="h4c-count" data-n="750000">' + LM.c('clientes') + '</span> clientes</h3><p>La marca de toda la vida.</p></li>',
      // 8 · Producto premium
      '<li class="h4c-card">' + ic('gem') + '<h3>Producto premium</h3><p>Látex, muelles ensacados y viscoelástica, capa a capa. ' + LM.pend('certificados o materiales que lo respalden') + '</p></li>',
      // 9 · Facilidades de pago
      '<li class="h4c-card">' + ic('card') + '<h3>Facilidades de pago</h3><p>Págalo en ' + LM.c('financiacion', 'corto') + ' con SeQura. ' + LM.c('financiacionLarga') + '</p></li>'
    ];
    ct.innerHTML = cards.join('');

    ct.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cond]'); if (!b) return;
      var k = b.getAttribute('data-cond');
      if (k === 'devolucion') hoja('Devoluciones', '<p><b>' + LM.c('devolucion') + '.</b></p><p>' + LM.c('devolucionCond') + '</p><p><a href="https://www.grupolomonaco.com/devoluciones/">Ver la página de devoluciones</a></p>');
      else hoja('Garantía de ' + LM.c('garantia'), '<p>' + LM.c('garantiaCubre') + '</p>');
      LM.track('trust_preview_open', { source: 'home-compromisos-' + k });
    });

    // Iconos animados al entrar cada tarjeta; el número de clientes cuenta hasta 750.000
    function contar(el) {
      if (!motion || el.querySelector('.lm-chk')) return;
      var fin = +el.getAttribute('data-n'), t0 = null;
      function paso(t) {
        if (!t0) t0 = t; var k = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(fin * e).toLocaleString('es-ES');
        if (k < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    }
    var lis = $$('.h4c-card', ct);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (!x.isIntersecting) return;
          x.target.classList.add('is-in'); io.unobserve(x.target);
          var n = x.target.querySelector('.h4c-count'); if (n) contar(n);
        });
      }, { threshold: 0.45 });
      lis.forEach(function (li) { io.observe(li); });
    } else lis.forEach(function (li) { li.classList.add('is-in'); });

    // Flechas y puntos
    var dots = $('#h4c-dots');
    dots.innerHTML = lis.map(function (_, i) { return '<button type="button" tabindex="-1" data-i="' + i + '"></button>'; }).join('');
    var db = $$('button', dots), arr = $$('.h4c-arr');
    function ir(i) { var li = lis[Math.max(0, Math.min(lis.length - 1, i))]; ct.scrollTo({ left: li.offsetLeft - ct.firstElementChild.offsetLeft, behavior: motion ? 'smooth' : 'auto' }); }
    function actual() {
      var x = ct.scrollLeft, best = 0;
      lis.forEach(function (li, i) { if (Math.abs(li.offsetLeft - lis[0].offsetLeft - x) < Math.abs(lis[best].offsetLeft - lis[0].offsetLeft - x)) best = i; });
      return best;
    }
    function pintar() {
      var a = actual(), fin = ct.scrollLeft + ct.clientWidth >= ct.scrollWidth - 4;
      db.forEach(function (b, i) { b.classList.toggle('is-on', fin ? i === db.length - 1 : i === a); });
      arr[0].disabled = ct.scrollLeft < 4; arr[1].disabled = fin;
    }
    arr.forEach(function (b) { b.addEventListener('click', function () { ir(actual() + +b.getAttribute('data-dir')); }); });
    dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ir(+b.getAttribute('data-i')); });
    var pend = 0;
    ct.addEventListener('scroll', function () { if (!pend) pend = requestAnimationFrame(function () { pend = 0; pintar(); }); }, { passive: true });
    addEventListener('resize', pintar);
    pintar();
  }

})();
