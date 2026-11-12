/* LO MONACO · Home: pinta los bloques dinámicos a partir de datos.js */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$;
  var arrow = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // Cuota mínima del catálogo para el antetítulo del hero
  var minP = Math.min.apply(null, LM.ORDEN.map(function (k) { return LM.desde(k).p; }));
  $$('[data-cuota-desde]').forEach(function (el) { el.textContent = LM.eur(LM.cuotaPlazo(minP, 36) || 0); });
  $$('[data-stars]').forEach(function (el) { el.innerHTML = LM.stars(LM.CONFIG.valoracion.media); });
  $$('[data-rating]').forEach(function (el) { el.innerHTML = LM.rating(); });

  // V4 · Cambio 3: reseñas del hero en carrusel (fundido, se para al pasar el ratón o con el foco)
  var hr = $('#h4-res');
  if (hr) {
    hr.innerHTML = LM.HERO_RESENAS.map(function (r, i) {
      return '<q' + (i ? ' class="is-wait"' : '') + '>' + LM.mark(r, r.x) + '</q>';
    }).join('');
    var qs = $$('q', hr), qi = 0, pausa = false, fig = hr.closest('.h4-res');
    fig.addEventListener('mouseenter', function () { pausa = true; });
    fig.addEventListener('mouseleave', function () { pausa = false; });
    fig.addEventListener('focusin', function () { pausa = true; });
    fig.addEventListener('focusout', function () { pausa = false; });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(function () {
      if (pausa || document.hidden) return;
      var a = qs[qi]; qi = (qi + 1) % qs.length; var b = qs[qi];
      a.classList.add('is-out'); b.classList.remove('is-wait', 'is-out');
      setTimeout(function () { a.classList.remove('is-out'); a.classList.add('is-wait'); }, 700);
    }, 5000);
  }

  // Parallax suave: la foto del banner baja más despacio que la página al hacer scroll
  var hh = $('.h4'), foto = hh && $('.h-hero-img', hh);
  if (foto && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var px = 0;
    var mover = function () {
      px = 0;
      var y = Math.min(scrollY, hh.offsetHeight + hh.offsetTop);
      foto.style.transform = 'translate3d(0,' + (y * 0.28).toFixed(1) + 'px,0)';
    };
    addEventListener('scroll', function () { if (!px) px = requestAnimationFrame(mover); }, { passive: true });
    mover();
  }

  // Los 4 colchones [C3]
  var g = $('#h-productos');
  if (g) {
    // Paco, 05/11: la tarjeta estándar del ecommerce (comun/componentes.js · LM.tarjeta), con precio para 150 × 190
    g.innerHTML = LM.ORDEN.map(function (k) { return LM.tarjeta(k); }).join('');
    g.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]'); if (!a) return;
      var c = e.target.closest('[data-testid^="product-card-"]');
      if (c) LM.track('select_item', { item_list_name: 'home', item_id: LM.PRODUCTOS[c.getAttribute('data-testid').replace('product-card-', '')].id });
    });
  }

  var fc = $('#h-faq-call');
  if (fc) fc.innerHTML = '<p class="lm-sub">¿Tienes otra duda? Te respondemos por teléfono.</p>' + LM.llamar('home-faq');

  // UGC: vídeos reales de clientes (YouTube Shorts) intercalados con opiniones verificadas
  var u = $('#h-ugc');
  if (u) {
    var r = LM.RESENAS, h = '';
    LM.UGC.forEach(function (v, i) { h += LM.short(v); if (r[i]) h += LM.resena(r[i]); });
    u.innerHTML = h;
  }

  // Dudas frecuentes de la home: las que más bloquean la compra
  var fq = $('#h-faq');
  if (fq) { var all = LM.faqs(); fq.innerHTML = LM.faqHTML([all[3], all[1], all[5], all[6]]); }

  var C = LM.CONFIG;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compromisos (cambio 12): ahora en comun/compromisos.js, compartido con la categoría

  // Configurador de packs (cambio 13): ahora en comun/packs.js, compartido con la categoría

  LM.fill(document);
  LM.reveal();
})();
