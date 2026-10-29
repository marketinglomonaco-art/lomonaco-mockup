/* LO MONACO · Ficha de colchón, común a los 4 modelos [F1–F25]. El modelo sale de <body data-producto="…"> */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG;
  var K = document.body.getAttribute('data-producto') || 'latex', P = LM.PRODUCTOS[K];
  // 29/10: en la ficha de pack (body[data-pack]) la galería y la caja de compra las monta comun/pack.js; aquí solo el resto
  var PACK = document.body.hasAttribute('data-pack');
  var BASES = [
    { k: 'solo', t: 'Solo colchón', d: 'Para tu cama o canapé actual', tabla: LM.PRECIOS[K], pid: P.id },
    { k: 'canape', t: 'Pack con canapé', d: P.packs.canape.d, tabla: LM.PRECIOS[P.packs.canape.tabla], pid: P.packs.canape.pid },
    { k: 'base', t: 'Pack con base tapizada', d: P.packs.base.d, tabla: LM.PRECIOS[P.packs.base.tabla], pid: P.packs.base.pid }
  ];
  var st = { medida: LM.medidaInicial(), base: 'solo', recogida: false };
  if (!LM.PRECIOS[K][st.medida]) st.medida = C.medidaInicial.v;
  function B() { return BASES.filter(function (b) { return b.k === st.base; })[0]; }
  function actual() { return B().tabla[st.medida]; }

  if (!PACK) {
  /* Cabecera de la compra [F1, F3] */
  $('#p-tag').textContent = P.etiqueta;
  $('#p-vp').textContent = P.vp;
  $('#p-facts').innerHTML = [P.altura + ' de alto', 'Firmeza ' + P.firmeza + '%', P.nucleo].map(function (f) { return '<li>' + f + '</li>'; }).join('');

  /* Galería [F2]: una foto grande y debajo dos columnas (en móvil, carrusel).
     Fotos nuevas del Natura Látex; en el resto de modelos se usan como provisionales. */
  // Ficha · comentario 3 (29/10): las 7 fotos nuevas de Paco en las 4 fichas. La 2 y la 3 llevan el botón de vídeo
  var alts = ['sobre un canapé de madera, con almohadas', 'esquina con la cinta Lomonaco', 'esquina sobre canapé de madera',
    'lateral con el nombre del modelo', 'detalle de la etiqueta', 'detalle del asa lateral', 'superficie acolchada de cerca'];
  var fotos = alts.map(function (alt, i) { return { f: '../img/producto-0' + (i + 1), g: i ? 947 : 1400, h: i ? 947 : 1200, alt: alt, video: i === 1 || i === 2 }; });
  // Paco, 29/10: la foto grande es la nueva de cada modelo (antes salía el Gran Natura en las 4 fichas)
  if (P.fotoNueva) fotos[0] = { f: P.fotoNueva, g: 1024, h: 1024, alt: 'esquina con el nombre del modelo', sq: true };
  var PLAY = '<span class="p-vid" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span class="p-vid-k" aria-hidden="true">Vídeo</span>';
  var gal = $('#p-gal');
  gal.innerHTML = fotos.map(function (x, i) {
    return '<figure' + (i ? '' : ' class="is-main' + (x.sq ? ' is-square' : '') + '"') + (x.video ? ' data-video' : '') + '><img src="' + x.f + '-' + x.g + '.webp" srcset="' + x.f + '-560.webp 560w, ' + x.f + '-' + x.g + '.webp ' + x.g + 'w"' +
      ' sizes="' + (i ? '(max-width: 900px) 100vw, 32vw' : '(max-width: 900px) 100vw, 64vw') + '" width="' + x.g + '" height="' + x.h + '"' +
      ' alt="' + P.titulo + ': ' + x.alt + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '>' +
      (x.video ? '<button type="button" class="p-vid-b" aria-label="Ver el vídeo: ' + x.alt + '">' + PLAY + '</button>' : '') + '</figure>';
  }).join(''); // 29/10: sin avisos bajo la galería (Paco). Fotos de otro modelo y vídeos siguen pendientes en el LEEME
  var count = $('#p-gal-count');
  function contar() { var i = Math.round(gal.scrollLeft / (gal.clientWidth || 1)); count.textContent = (i + 1) + ' / ' + fotos.length; }
  gal.addEventListener('scroll', contar, { passive: true }); contar();

  /* Precio, medida, base [F4, F5, F8, F9, F10] */
  function renderPrice() {
    var d = actual(), box = $('#p-buy');
    $('#p-price').innerHTML = d ? LM.precio(d, { medida: st.medida, cls: 'lm-price--big' }) : '';
    var total = d ? d.p + (st.recogida ? LM.RECOGIDA.p : 0) : 0;
    $('#p-cta').textContent = 'Añadir al carrito · ' + LM.eur(total);
    $('#p-stick-m').textContent = B().t + ' · ' + LM.medidaTxt(st.medida);
    $('#p-stick-p').textContent = LM.eur(total);
    box.removeAttribute('aria-busy');
    LM.fill($('#p-price'));
    if (window.fijarCaja) fijarCaja();
  }
  function renderBases() {
    var solo = LM.PRECIOS[K][st.medida];
    $('#p-base').innerHTML = BASES.map(function (b) {
      var d = b.tabla[st.medida], dis = !d;
      var diff = d && b.k !== 'solo' ? '+' + LM.eur(d.p - solo.p) : (d ? LM.eur(d.p) : 'No disponible en ' + LM.medidaTxt(st.medida));
      // Paco, 29/10: «Solo colchón» lleva la foto de la almohada y destaca que se regalan (120 € el par)
      var R = b.k === 'solo' && LM.REGALO_SOLO;
      return '<label class="p-card' + (R ? ' p-card--regalo' : '') + (dis ? ' is-na' : '') + '"><input type="radio" name="base" value="' + b.k + '"' + (st.base === b.k ? ' checked' : '') + (dis ? ' disabled' : '') + '>' +
        (R ? '<img class="p-card-img" src="' + R.img + '" alt="Almohada Lomonaco" width="240" height="160" loading="lazy">' : '') +
        '<span><b>' + b.t + '</b><small>' + b.d + '</small></span><em>' + diff + '</em>' +
        (R ? '<span class="p-card-gift">' + LM.ico('gift') + '<span><strong>' + R.t + '</strong> · ' + R.d + '</span></span>' : '') +
        '</label>';
    }).join('');
  }
  var sel = LM.selector($('#p-size'), {
    medida: st.medida,
    tabla: function () { return B().tabla; },
    onChange: function (m) { st.medida = m; renderBases(); renderPrice(); }
  });
  // El asistente «Ayúdame a elegir» (comun/asistente.js) usa esto para dejar puesta la medida recomendada
  LM.elegirMedida = function (m) { sel.choose(m); };
  LM.medidaDisponible = function (m) { var d = B().tabla[m]; return !!(d && d.s); };

  $('#p-base').addEventListener('change', function (e) {
    st.base = e.target.value; $('#p-buy').setAttribute('aria-busy', 'true');
    sel.refresh(); setTimeout(renderPrice, 150);
    LM.track('select_item', { item_id: B().pid, item_variant: st.base });
  });
  $$('input[name="recogida"]').forEach(function (r) { r.addEventListener('change', function () { st.recogida = this.value === 'si'; renderPrice(); }); });
  $('#p-recogida-p').textContent = '+' + LM.eur(LM.RECOGIDA.p);

  /* Compra [F6, F11] y segunda vía [F12] */
  function comprar(src) {
    var d = actual(); if (!d) return;
    LM.cart.add({ id: d.id, pid: B().pid, nombre: B().k === 'solo' ? P.titulo : B().t + ' ' + P.nombre, medida: st.medida,
      extra: st.recogida ? 'Con retirada del colchón viejo' : '', precio: d.p + (st.recogida ? LM.RECOGIDA.p : 0) }, src);
  }
  $('#p-cta').addEventListener('click', function () { comprar('main'); });
  $('#p-stick-cta').addEventListener('click', function () { comprar('sticky'); });
  $('#p-call').innerHTML = LM.llamar('ficha') +
    '<a class="lm-live-link" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i><span><b>¿Quieres verlo antes?</b> Te lo enseñamos por videollamada</span></a>';
  $('#p-trust').innerHTML = LM.confianza(P, { link: '#condiciones' });

  /* Escritorio: la caja de compra acompaña a la galería. Si es más alta que la pantalla,
     sube hasta enseñar su parte de abajo (botón incluido) y ahí se queda fija. */
  var box = $('#p-buy');
  function fijar() { box.style.top = 'min(var(--cab, 52px), ' + (innerHeight - box.offsetHeight - 16) + 'px)'; }
  window.fijarCaja = fijar;
  addEventListener('resize', fijar); setTimeout(fijar, 50);

  /* Barra fija cuando el botón principal sale de la pantalla */
  var stick = $('#p-stick');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) {
    var off = !en[0].isIntersecting; // visible mientras el botón principal no esté en pantalla
    stick.classList.toggle('is-on', off); stick.setAttribute('aria-hidden', !off);
    $('#p-stick-cta').tabIndex = off ? 0 : -1;
    document.body.classList.toggle('lm-has-stick', off);
  }).observe($('#p-cta'));

    renderBases(); renderPrice();
  }

  /* Cuerpo [F13–F19] */
  $('#p-ben').innerHTML = P.beneficios.map(function (b) { return '<li><span class="h-ic">' + LM.ico(b[0]) + '</span><b>' + b[1] + '</b><p>' + b[2] + '</p></li>'; }).join('');
  $('#p-firm-txt').textContent = P.sensacionLarga;
  $('#p-dur').textContent = P.durTxt;
  $('#p-firm').innerHTML = LM.firmeza(P) + '<div class="p-scale" aria-hidden="true"><span>Más suave</span><span>Más firme</span></div>' +
    '<p class="lm-note">Datos de firmeza y adaptabilidad de la ficha actual.</p>';
  scrub();

  var rows = [['Sensación', 'sensacionTxt'], ['Firmeza', 'firmeza', '%'], ['Adaptabilidad', 'adaptabilidad', '%'], ['Por dentro', 'nucleo'], ['Altura', 'altura'], ['Para quién', 'paraQuien']];
  var cols = [K].concat(LM.ORDEN.filter(function (k) { return k !== K; }));
  $('#p-table').innerHTML = '<thead><tr><th scope="col"></th>' + cols.map(function (k) {
    var p = LM.PRODUCTOS[k];
    return '<th scope="col"' + (k === K ? ' class="is-me"' : '') + '><a href="' + LM.href(p.url) + '"><img src="' + p.img + '" alt="" width="96" height="96" loading="lazy">' + p.nombre + (k === K ? ' <span class="lm-pill lm-pill--acc">Estás aquí</span>' : '') + '</a></th>';
  }).join('') + '</tr></thead><tbody>' + rows.map(function (r) {
    return '<tr><th scope="row">' + r[0] + '</th>' + cols.map(function (k) { return '<td' + (k === K ? ' class="is-me"' : '') + '>' + LM.PRODUCTOS[k][r[1]] + (r[2] || '') + '</td>'; }).join('') + '</tr>';
  }).join('') + '<tr><th scope="row">Precio en ' + LM.medidaTxt(st.medida) + '</th>' + cols.map(function (k) {
    var d = LM.PRECIOS[k][st.medida]; return '<td' + (k === K ? ' class="is-me"' : '') + '>' + (d ? LM.precio(d, { cuota: false }) : 'No disponible') + '</td>';
  }).join('') + '</tr></tbody>';
  $('.p-cmp .c-table-wrap').addEventListener('scroll', function once() { LM.track('compare_use', { source: 'ficha' }); this.removeEventListener('scroll', once); });

  $('#p-revs').innerHTML = LM.RESENAS.slice(1, 7).map(LM.resena).join('');
  $('#p-dura-q').innerHTML = LM.resena(LM.RESENAS[0]);

  /* Cierre [F21–F25] */
  var ess = [['truck', 'Entrega', LM.c('entrega')], ['moon', 'Prueba', LM.c('prueba')], ['back', 'Devolución', LM.c('devolucion')], ['shield', 'Garantía', LM.c('garantia')], ['card', 'Pago', 'Tarjeta, Bizum o ' + LM.c('financiacion', 'corto')]];
  $('#p-ess').innerHTML = ess.map(function (e) { return '<li>' + LM.ico(e[0]) + '<span><small>' + e[1] + '</small><b>' + e[2] + '</b></span></li>'; }).join('');
  $('#p-faq').innerHTML = LM.faqHTML(LM.faqs(P));
  $('#p-faq-call').innerHTML = LM.llamar('ficha-faq', { label: '¿No encuentras tu duda? Llámanos' });

  $('#p-reco').innerHTML = LM.ORDEN.filter(function (k) { return k !== K; }).map(function (k) {
    var p = LM.PRODUCTOS[k], d = LM.PRECIOS[k][st.medida] || LM.desde(k);
    return '<a class="p-reco-c" href="' + LM.href(p.url) + '"><img src="' + p.img + '" alt="" width="160" height="160" loading="lazy"><span><small>' + p.etiqueta + '</small><b>' + p.titulo + '</b><span>' + p.sensacionTxt + '</span>' + LM.precio(d, { cuota: false }) + '</span></a>';
  }).join('');
  var F = LM.FICHAS;
  if ($('#p-xsell')) $('#p-xsell').innerHTML = [
    { n: 'Pack ' + P.nombre + ' + canapé', d: P.packs.canape.d, p: BASES[1].tabla[st.medida] || LM.desdeTabla(BASES[1].tabla), img: P.packs.canape.img, base: 'canape' },
    { n: 'Pack ' + P.nombre + ' + base', d: P.packs.base.d, p: BASES[2].tabla[st.medida] || LM.desdeTabla(BASES[2].tabla), img: P.packs.base.img, base: 'base' },
    { n: F.almLatex.n, d: F.almLatex.d, p: F.almLatex, img: F.almLatex.img, url: F.almLatex.url },
    { n: F.almVisco.n, d: F.almVisco.d, p: F.almVisco, img: F.almVisco.img, url: F.almVisco.url }
  ].map(function (x) {
    return '<article class="lm-card h-pk"><div class="lm-card-img"><img src="' + x.img + '" alt="" width="760" height="470" loading="lazy"></div><div class="lm-card-b"><h3>' + x.n + '</h3><p class="lm-card-d">' + x.d + '</p>' +
      '<div class="lm-card-f">' + LM.precio({ p: x.p.p, r: x.p.r }, { cuota: false, desde: !!x.url }) +
      (x.base ? '<button class="lm-btn lm-btn--line" type="button" data-pick-base="' + x.base + '">Elegir este pack</button>' : '<a class="lm-link" href="' + LM.href(x.url) + '">Ver almohada</a>') + '</div></div></article>';
  }).join('');
  if ($('#p-xsell')) $('#p-xsell').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick-base]'); if (!b) return;
    var r = $('input[name="base"][value="' + b.getAttribute('data-pick-base') + '"]');
    if (r && !r.disabled) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    $('#base').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  var tech = [['Modelo', P.titulo], ['Altura', P.altura], ['Núcleo', P.nucleo], ['Capas', P.capas.map(function (c) { return c[0]; }).join(' · ')],
    ['Firmeza', P.firmeza + '% (escala de la web actual)'], ['Adaptabilidad', P.adaptabilidad + '%'], ['Medidas', LM.MEDIDAS.map(function (m) { return m.replace('x', '×'); }).join(', ') + ' cm'],
    ['Garantía', LM.c('garantia')], ['Referencia', 'ID ' + P.id]];
  $('#p-tech').innerHTML = tech.map(function (t) { return '<div><dt>' + t[0] + '</dt><dd>' + t[1] + '</dd></div>'; }).join('');

  /* Por dentro [F15]: el vídeo avanza con el scroll y los textos explican cada capa.
     P2: el vídeo solo se descarga al acercarse; con «reducir movimiento» se ve la imagen final y los textos en lista. */
  function scrub() {
    var sec = $('#por-dentro'); if (!sec) return;
    var pin = $('.p-scrub-pin', sec), v = $('.p-scrub-v', sec), list = $('#p-scrub-steps'), bar = $('#p-scrub-prog');
    var pasos = [{ a: 0, b: .15, k: 'Por dentro', t: 'Así es tu ' + P.nombre + '.', p: 'Lo abrimos capa a capa.', h2: true, aviso: true }]
      .concat(P.capas.map(function (c, i) { return { a: .17 + i * .17, b: .17 + (i + 1) * .17, k: 'Capa 0' + (i + 1) + ' de 0' + P.capas.length, t: c[0], p: c[1] }; }))
      .concat([{ a: .87, b: 1.01, k: P.altura + ' de descanso', t: 'Cuatro capas. Un solo objetivo.', p: 'Que duermas fresco y te levantes descansado. Firmeza ' + P.firmeza + '% y adaptabilidad ' + P.adaptabilidad + '%.', cta: true }]);
    list.innerHTML = pasos.map(function (s, i) {
      var tag = s.h2 ? 'h2 id="p-scrub-t"' : 'h3';
      // Comentario 6: cada tarjeta lleva un botón para pasar a la siguiente capa
      var sig = s.cta ? '' : '<button type="button" class="p-scrub-next" data-ir="' + (i + 1) + '">' + (i ? 'Siguiente capa' : 'Empezar') +
        ' <svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg></button>';
      return '<li class="p-scrub-step' + (s.cta ? ' is-end' : '') + '" data-i="' + i + '"><p class="lm-eyebrow">' + s.k + '</p><' + tag + ' class="p-scrub-t">' + s.t + '</' + tag.split(' ')[0] + '>' +
        '<p class="p-scrub-p">' + s.p + '</p>' +
        // 29/10: el aviso de «desliza» va dentro de la primera tarjeta (antes flotaba aparte)
        (s.aviso ? '<p class="p-scrub-aviso"><span class="p-scrub-mouse" aria-hidden="true"><i></i></span><span>Desliza aquí dentro para abrir el colchón<small>Fuera del recuadro, la página sigue bajando</small></span></p>' : '') +
        (s.cta ? '<a class="lm-btn" href="#p-size">Elegir mi medida</a>' : sig) + '</li>';
    }).join('');
    var items = $$('.p-scrub-step', list);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      sec.classList.add('is-static'); v.poster = v.getAttribute('data-poster-fin'); return;
    }
    // Comentario 7 (29/10): la animación ya no secuestra el scroll de la página.
    // Vive en un recuadro: la rueda o el dedo DENTRO del recuadro abren el colchón; FUERA, la página baja con normalidad.
    // Al llegar al final (o al principio) el recuadro suelta el scroll y la página continúa.
    var dur = 0, p = 0, obj = 0, raf = 0, last = -1, pedido = false;
    var track = $('#p-scrub-track');
    var RECORRIDO = 2400, RECORRIDO_TACTIL = 1100; // px de rueda / de dedo para abrirlo entero
    function cargar() {
      if (pedido) return; pedido = true;
      var url = v.getAttribute(innerWidth < 768 ? 'data-src-sm' : 'data-src-lg');
      v.addEventListener('loadedmetadata', function () { dur = v.duration || 0; var pr = v.play(); if (pr) pr.then(function () { v.pause(); pintar(); }).catch(function () {}); }, { once: true });
      function directo() { v.preload = 'auto'; v.src = url; v.load(); }
      // En memoria el vídeo siempre se puede rebobinar, aunque el servidor no admita peticiones parciales
      if (window.fetch && location.protocol !== 'file:') fetch(url).then(function (r) { if (!r.ok) throw r; return r.blob(); })
        .then(function (bl) { v.src = URL.createObjectURL(bl); v.load(); }).catch(directo);
      else directo();
    }
    function limitar(x) { return Math.min(1, Math.max(0, x)); }
    function pintar() {
      if (dur && !v.seeking) { var t = Math.min(1, p / .85) * (dur - .05); if (Math.abs(v.currentTime - t) > .02) v.currentTime = t; }
      var on = -1; pasos.forEach(function (s, i) { if (p >= s.a && p < s.b) on = i; });
      if (on !== last) {
        items.forEach(function (el, i) { el.classList.toggle('is-on', i === on); });
        if (track) $$('#p-scrub-stops button').forEach(function (bt, i) { bt.classList.toggle('is-on', i === on); bt.classList.toggle('is-pasado', i < on); });
        last = on;
      }
      bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      sec.classList.toggle('is-empezado', p > .02);
      if (track) { track.style.setProperty('--p', (p * 100).toFixed(2) + '%'); track.setAttribute('aria-valuenow', Math.round(p * 100)); }
    }
    function bucle() {
      raf = 0; p += (obj - p) * .16; if (Math.abs(obj - p) < .0008) p = obj;
      pintar(); if (p !== obj) raf = requestAnimationFrame(bucle);
    }
    function ir(x) { cargar(); obj = limitar(x); if (!raf) raf = requestAnimationFrame(bucle); }
    // Solo captura cuando el recuadro está bien a la vista; si no, deja que la página lo traiga
    function aLaVista() { var r = pin.getBoundingClientRect(); return r.top < innerHeight * .32 && r.bottom > innerHeight * .68; }
    pin.addEventListener('wheel', function (e) {
      var dy = e.deltaY * (e.deltaMode === 1 ? 40 : 1);
      if (!aLaVista() || Math.abs(e.deltaX) > Math.abs(dy)) return;
      if ((dy > 0 && obj < 1) || (dy < 0 && obj > 0)) { e.preventDefault(); ir(obj + dy / RECORRIDO); }
    }, { passive: false });
    var ty = null;
    pin.addEventListener('touchstart', function (e) { ty = e.target.closest('.p-scrub-ctrl, button, a') ? null : e.touches[0].clientY; }, { passive: true });
    pin.addEventListener('touchmove', function (e) {
      if (ty === null || !aLaVista()) return;
      var y = e.touches[0].clientY, dy = ty - y; ty = y;
      if ((dy > 0 && obj < 1) || (dy < 0 && obj > 0)) { e.preventDefault(); ir(obj + dy / RECORRIDO_TACTIL); }
    }, { passive: false });
    pin.addEventListener('touchend', function () { ty = null; });

    list.addEventListener('click', function (e) {
      var bt = e.target.closest('[data-ir]'); if (!bt) return;
      ir(pasos[+bt.getAttribute('data-ir')].a + .02);
      LM.track('capas_siguiente', { a: +bt.getAttribute('data-ir') });
    });
    // Opción B: panel deslizable (parece un control; mueve el vídeo)
    if (track) {
      $('#p-scrub-stops').innerHTML = pasos.map(function (s, i) {
        // 29/10: panel en vertical (de arriba abajo), pensado para el pulgar en móvil
        return '<button type="button" style="top:' + (Math.min(s.a, .97) * 100).toFixed(1) + '%" data-ir="' + i + '" aria-label="' + s.t + '"><i></i><span>' + (i === 0 ? 'Inicio' : s.cta ? 'Todo' : s.t) + '</span></button>';
      }).join('');
      var arrastrando = false;
      function aP(y) { var r = track.getBoundingClientRect(); return limitar((y - r.top) / r.height); }
      track.addEventListener('pointerdown', function (e) {
        var stop = e.target.closest('[data-ir]');
        if (stop) { ir(pasos[+stop.getAttribute('data-ir')].a + .02); return; }
        arrastrando = true; track.setPointerCapture(e.pointerId); track.classList.add('is-drag'); ir(aP(e.clientY)); LM.track('capas_deslizar', {});
      });
      track.addEventListener('pointermove', function (e) { if (arrastrando) ir(aP(e.clientY)); });
      track.addEventListener('pointerup', function () { arrastrando = false; track.classList.remove('is-drag'); });
      track.addEventListener('keydown', function (e) {
        var k = { ArrowDown: .05, ArrowRight: .05, ArrowUp: -.05, ArrowLeft: -.05 }[e.key]; if (!k) return;
        e.preventDefault(); ir(obj + k);
      });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { if (en[0].isIntersecting) cargar(); }, { rootMargin: '150% 0px' }).observe(sec);
    else cargar();
    pintar();
  }

  $$('[data-rating]').forEach(function (el) { el.innerHTML = LM.rating(); });
  LM.fill(document);
  if (!PACK) LM.track('view_item', { item_id: actual().id, item_variant: st.medida, price: actual().p, currency: 'EUR' });
})();
