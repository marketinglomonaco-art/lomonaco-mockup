/* LO MONACO · Home: pinta los bloques dinámicos a partir de datos.js */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$;
  var arrow = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // Cuota mínima del catálogo para el antetítulo del hero
  var minP = Math.min.apply(null, LM.ORDEN.map(function (k) { return LM.desde(k).p; }));
  $$('[data-cuota-desde]').forEach(function (el) { el.textContent = LM.eur(Math.round(LM.cuota(minP) * 100) / 100); });
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
    g.innerHTML = LM.ORDEN.map(function (k, i) {
      var p = LM.PRODUCTOS[k], d = LM.desde(k), href = LM.href(p.url);
      return '<article class="lm-card h-pc" data-testid="product-card-' + k + '">' +
        // V4 · Cambio 10: la misma foto en las 4 tarjetas y su foto «hover» (Photoshop de Paco)
        // Paco, 29/10: cada tarjeta lleva la foto nueva de su modelo
        '<div class="lm-card-img"><img src="../img/' + LM.FOTO_HOME[k] + '-760.webp" srcset="../img/' + LM.FOTO_HOME[k] + '-480.webp 480w, ../img/' + LM.FOTO_HOME[k] + '-760.webp 760w" sizes="(max-width: 600px) 100vw, 25vw" alt="Colchón ' + p.nombre + '" width="760" height="760" loading="lazy">' +
        '<img class="lm-detalle" src="../img/colchon-card-hover-760.webp" srcset="../img/colchon-card-hover-480.webp 480w, ../img/colchon-card-hover-760.webp 760w" sizes="(max-width: 600px) 100vw, 25vw" alt="" width="760" height="760" loading="lazy"><span class="lm-pill">' + p.etiqueta + '</span></div>' +
        '<div class="lm-card-b"><p class="lm-card-k">' + p.nucleo + ' · ' + p.altura + '</p>' +
        '<h3><a class="lm-stretch" href="' + href + '" data-select="' + p.id + '">' + p.titulo + '</a></h3>' +
        '<p class="lm-card-d">' + p.diferencia + '</p>' +
        LM.firmeza(p, { txt: false }) +
        '<div class="lm-card-f">' + LM.precio(d, { desde: true }) +
        '<span class="lm-btn lm-btn--full" aria-hidden="true">Ver colchón</span></div></div></article>';
    }).join('');
    g.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]'); if (!a) return;
      var c = e.target.closest('[data-testid^="product-card-"]');
      if (c) LM.track('select_item', { item_list_name: 'home', item_id: LM.PRODUCTOS[c.getAttribute('data-testid').replace('product-card-', '')].id });
    });
  }

  // Almohadas
  var al = $('#h-almohadas');
  if (al) al.innerHTML = ['almLatex', 'almVisco'].map(function (k) {
    var f = LM.FICHAS[k];
    return '<a class="h-ac" href="' + LM.href(f.url) + '"><img src="' + f.img + '" alt="" width="760" height="435" loading="lazy">' +
      '<span><b>' + f.n + '</b><small>' + f.d + '</small>' + LM.precio({ p: f.p, r: f.r }, { desde: true, cuota: false }) + '</span></a>';
  }).join('');

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
