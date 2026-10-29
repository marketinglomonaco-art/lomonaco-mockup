/* LO MONACO · Ficha de pack (29/10): colchón + canapé abatible o base tapizada, con regalos.
   Paco: comprando colchón y canapé (o base) juntos, se regalan almohadas, edredón y protector.
   Opción A: caja de compra clásica (como la ficha de colchón) con muestras de color y bloque de regalos.
   Opción B: «Monta tu pack» en 3 pasos numerados y un ticket con lo que te llevas.
   El resto de la página (beneficios, laboratorio, «Por dentro», opiniones, preguntas…) es el de la ficha de colchón. */
(function () {
  'use strict';
  if (!document.body.hasAttribute('data-pack')) return;
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, PB = LM.PACK_BASES;
  var K = document.body.getAttribute('data-producto') || 'latex', P = LM.PRODUCTOS[K];
  var B = document.body.getAttribute('data-variante') === 'b';
  var q = new URLSearchParams(location.search);
  var st = { medida: LM.medidaInicial(), base: q.get('base') === 'base' ? 'base' : 'canape', recogida: false, color: {} };
  st.color.canape = PB.canape.porDefecto; st.color.base = PB.base.porDefecto;
  function tabla(b) { return LM.PRECIOS[K + PB[b || st.base].tabla]; }
  if (!tabla()[st.medida]) st.medida = C.medidaInicial.v;
  function actual() { return tabla()[st.medida]; }
  function base() { return PB[st.base]; }
  function nombrePack() { return 'Pack ' + P.nombre + ' + ' + base().corto; }

  // Iconos de los regalos
  var IC = {
    almohada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8c0-1.5 1-2.5 2.5-2.5h11C19 5.5 20 6.5 20 8v8c0 1.5-1 2.5-2.5 2.5h-11C5 18.5 4 17.5 4 16z"/><path d="M4 8c2 1 2 7 0 8M20 8c-2 1-2 7 0 8"/></svg>',
    edredon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v10H3z"/><path d="M3 12h18M9 7v10M15 7v10"/></svg>',
    protector: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18v4H3z"/><path d="M12 3 7 5v3.5c0 2.6 2 4.4 5 5 3-.6 5-2.4 5-5V5z"/><path d="m9.8 8.3 1.6 1.6 3-3"/></svg>',
    regalo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1s3 1 5 1c2 0 5 1.5 5-1s-3.5-2-5 1"/></svg>'
  };
  var MINI = { canape: '../img/canape-760.webp', base: '../img/base-3d-760.webp' };

  /* Galería: la primera foto es la del pack con la base elegida; luego, las del colchón */
  var gal = $('#p-gal');
  var alts = ['esquina con la cinta Lomonaco', 'esquina sobre canapé de madera', 'lateral con el nombre del modelo', 'detalle de la etiqueta', 'detalle del asa lateral', 'superficie acolchada de cerca'];
  function galeria() {
    var f = base().img;
    gal.innerHTML = '<figure class="is-main pk-main"><img src="' + f + '-1200.webp" srcset="' + f + '-700.webp 700w, ' + f + '-1200.webp 1200w" sizes="(max-width: 900px) 100vw, 64vw" width="1200" height="896" alt="' + nombrePack() + '" fetchpriority="high">' +
      '<span class="pk-regalo-chip">' + IC.regalo + 'Almohadas, edredón y protector de regalo</span></figure>' +
      alts.map(function (a, i) { return '<figure><img src="../img/producto-0' + (i + 2) + '-947.webp" srcset="../img/producto-0' + (i + 2) + '-560.webp 560w, ../img/producto-0' + (i + 2) + '-947.webp 947w" sizes="(max-width: 900px) 100vw, 32vw" width="947" height="947" alt="' + P.titulo + ': ' + a + '" loading="lazy"></figure>'; }).join('');
  }
  galeria();
  var count = $('#p-gal-count');
  function contar() { var i = Math.round(gal.scrollLeft / (gal.clientWidth || 1)); count.textContent = (i + 1) + ' / ' + (alts.length + 1); }
  gal.addEventListener('scroll', contar, { passive: true }); contar();

  /* Caja de compra */
  $('#pk-vp').innerHTML = 'Colchón <b>' + P.nombre + '</b> + <span id="pk-vp-b">' + base().t.toLowerCase() + '</span>. Y de regalo: almohadas, edredón y protector.';
  var cfg = $('#pk-config');
  function muestras() {
    return '<div class="pk-sw' + (B ? ' pk-sw--tiles' : '') + '" role="radiogroup" aria-label="Color">' + base().colores.map(function (c) {
      var on = st.color[st.base] === c[0];
      return '<button type="button" role="radio" aria-checked="' + on + '" data-color="' + c[0] + '" style="--c:' + c[1] + '" title="' + c[0] + '"><i></i>' + (B ? '<span>' + c[0] + '</span>' : '<span class="lm-sr">' + c[0] + '</span>') + '</button>';
    }).join('') + '</div>' + (base().pend ? '<p class="pk-pend" data-solo-revision>' + LM.pend(base().pend) + '</p>' : '');
  }
  function opcionesBase() {
    return Object.keys(PB).map(function (k) {
      var d = tabla(k)[st.medida], on = st.base === k;
      return B
        ? '<button type="button" class="pk-tile" role="radio" aria-checked="' + on + '" data-base="' + k + '"' + (d ? '' : ' disabled') + '><img src="' + MINI[k] + '" alt="" width="380" height="250" loading="lazy"><b>' + PB[k].t + '</b><small>' + PB[k].d + '</small><em>' + (d ? LM.eur(d.p) : 'No disponible') + '</em></button>'
        : '<label class="p-card pk-card' + (d ? '' : ' is-na') + '"><input type="radio" name="pk-base" value="' + k + '"' + (on ? ' checked' : '') + (d ? '' : ' disabled') + '><img src="' + MINI[k] + '" alt="" width="64" height="64" loading="lazy"><span><b>' + PB[k].t + '</b><small>' + PB[k].d + '</small></span><em>' + (d ? LM.eur(d.p) : 'No disponible') + '</em></label>';
    }).join('');
  }
  function regalos() {
    return LM.REGALOS.map(function (r) { return '<li><span class="pk-gi">' + IC[r[2]] + '</span><span><b>' + r[0] + '</b><small>' + r[1] + '</small></span><em>Regalo</em></li>'; }).join('');
  }
  if (!B) {
    cfg.innerHTML =
      '<div class="p-size" id="p-size" data-testid="size-selector"></div>' +
      '<fieldset class="p-opt"><legend>¿Canapé o base?</legend><div class="p-opt-list" id="pk-bases"></div></fieldset>' +
      '<fieldset class="p-opt"><legend>Color: <b id="pk-color-n"></b></legend><div id="pk-colores"></div></fieldset>' +
      '<div class="pk-gift"><p class="pk-gift-k"><span class="pk-gi">' + IC.regalo + '</span>De regalo con tu pack</p><ul>' + regalos() + '</ul></div>';
  } else {
    cfg.innerHTML =
      '<div class="pk-build"><p class="pk-build-k">Monta tu pack en 3 pasos</p><ol class="pk-steps">' +
        '<li class="pk-step"><header><span class="pk-n">1</span><b>Tu medida</b><em id="pk-v1"></em></header><div class="p-size" id="p-size" data-testid="size-selector"></div></li>' +
        '<li class="pk-step"><header><span class="pk-n">2</span><b>Canapé o base</b><em id="pk-v2"></em></header><div class="pk-tiles" id="pk-bases" role="radiogroup" aria-label="Canapé o base"></div></li>' +
        '<li class="pk-step"><header><span class="pk-n">3</span><b>Color</b><em id="pk-v3"></em></header><div id="pk-colores"></div></li>' +
      '</ol></div>' +
      '<div class="pk-ticket"><p class="pk-ticket-k">Tu pack</p><ul id="pk-ticket"></ul></div>';
  }

  function pintar() {
    var d = actual();
    $('#pk-h1').textContent = nombrePack(); $('#pk-crumb').textContent = nombrePack();
    $('#pk-vp-b').textContent = base().t.toLowerCase();
    $('#p-price').innerHTML = d ? LM.precio(d, { medida: st.medida, cls: 'lm-price--big' }) : '<p class="c-na">Este pack no se hace en ' + LM.medidaTxt(st.medida) + '.</p>';
    $('#pk-bases').innerHTML = opcionesBase();
    $('#pk-colores').innerHTML = muestras();
    if (!B) $('#pk-color-n').textContent = st.color[st.base];
    else {
      $('#pk-v1').textContent = LM.medidaTxt(st.medida); $('#pk-v2').textContent = base().t; $('#pk-v3').textContent = st.color[st.base];
      $('#pk-ticket').innerHTML =
        '<li><span class="pk-ti">' + LM.ico('check') + '</span><span><b>Colchón ' + P.nombre + '</b><small>' + LM.medidaTxt(st.medida) + ' · ' + P.nucleo + '</small></span></li>' +
        '<li><span class="pk-ti">' + LM.ico('check') + '</span><span><b>' + base().t + ' ' + st.color[st.base] + '</b><small>' + base().d + '</small></span></li>' +
        LM.REGALOS.map(function (r) { return '<li class="is-regalo"><span class="pk-ti">' + IC[r[2]] + '</span><span><b>' + r[0] + '</b><small>' + r[1] + '</small></span><em>Regalo</em></li>'; }).join('') +
        '<li class="pk-ticket-tot"><span>Total del pack</span><b>' + (d ? LM.eur(d.p + (st.recogida ? LM.RECOGIDA.p : 0)) : '—') + '</b></li>';
    }
    var total = d ? d.p + (st.recogida ? LM.RECOGIDA.p : 0) : 0;
    $('#p-cta').textContent = 'Añadir el pack al carrito · ' + LM.eur(total);
    $('#p-stick-m').textContent = nombrePack() + ' · ' + LM.medidaTxt(st.medida);
    $('#p-stick-p').textContent = LM.eur(total);
    $('#p-buy').removeAttribute('aria-busy');
    LM.fill($('#p-buy'));
    if (window.fijarCaja) fijarCaja();
  }

  var sel = LM.selector($('#p-size'), { medida: st.medida, tabla: function () { return tabla(); }, onChange: function (m) { st.medida = m; pintar(); } });
  LM.elegirMedida = function (m) { sel.choose(m); };
  LM.medidaDisponible = function (m) { var d = tabla()[m]; return !!(d && d.s); };

  function cambiarBase(k) {
    if (k === st.base || !tabla(k)[st.medida]) return;
    st.base = k; galeria(); sel.refresh(); pintar();
    history.replaceState(null, '', '?base=' + k);
    LM.track('select_item', { item_id: P.packs[k].pid, item_variant: k, item_list_name: 'pack' });
  }
  cfg.addEventListener('change', function (e) { if (e.target.name === 'pk-base') cambiarBase(e.target.value); });
  cfg.addEventListener('click', function (e) {
    var t = e.target.closest('[data-base]'); if (t && !t.disabled) return cambiarBase(t.getAttribute('data-base'));
    var c = e.target.closest('[data-color]');
    if (c) { st.color[st.base] = c.getAttribute('data-color'); pintar(); LM.track('select_item', { item_variant: st.base + '-' + st.color[st.base], item_list_name: 'pack_color' }); }
  });
  $$('input[name="recogida"]').forEach(function (r) { r.addEventListener('change', function () { st.recogida = this.value === 'si'; pintar(); }); });
  $('#p-recogida-p').textContent = '+' + LM.eur(LM.RECOGIDA.p);

  function comprar(src) {
    var d = actual(); if (!d) return;
    LM.cart.add({ id: d.id, pid: P.packs[st.base].pid, nombre: nombrePack() + ' (' + st.color[st.base] + ')', medida: st.medida,
      extra: 'De regalo: almohadas, edredón y protector' + (st.recogida ? ' · Con retirada del colchón viejo' : ''), precio: d.p + (st.recogida ? LM.RECOGIDA.p : 0) }, src);
  }
  $('#p-cta').addEventListener('click', function () { comprar('main'); });
  $('#p-stick-cta').addEventListener('click', function () { comprar('sticky'); });
  $('#p-call').innerHTML = LM.llamar('pack') +
    '<a class="lm-live-link" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i><span><b>¿Quieres verlo antes?</b> Te lo enseñamos por videollamada</span></a>';
  $('#p-trust').innerHTML = LM.confianza(P, { link: '#condiciones' });

  var box = $('#p-buy');
  function fijar() { box.style.top = 'min(var(--cab, 52px), ' + (innerHeight - box.offsetHeight - 16) + 'px)'; }
  window.fijarCaja = fijar; addEventListener('resize', fijar); setTimeout(fijar, 50);
  var stick = $('#p-stick');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) {
    var off = !en[0].isIntersecting; stick.classList.toggle('is-on', off); stick.setAttribute('aria-hidden', !off);
    $('#p-stick-cta').tabIndex = off ? 0 : -1; document.body.classList.toggle('lm-has-stick', off);
  }).observe($('#p-cta'));

  pintar();
  var d0 = actual(); if (d0) LM.track('view_item', { item_id: d0.id, item_variant: st.base + '-' + st.medida, price: d0.p, currency: 'EUR', item_category: 'pack' });
})();
