/* LO MONACO · DISEÑO 2 · «Menos web, más compra»
   Un único script para las tres páginas (home, categoría, ficha). Datos reales en assets/datos.js. */
(function () {
  'use strict';
  var C = LM.CONFIG, P = LM.PRODUCTOS, ORDEN = LM.ORDEN, PR = LM.PRECIOS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute('data-page');
  document.documentElement.classList.add('js');
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- utilidades ---------- */
  // Formato español con punto de miles también en cifras de 4 dígitos (1.044 €)
  function eur(n) {
    var c = Math.round(n * 100), e = Math.floor(c / 100), d = c % 100;
    return String(e).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (d ? ',' + String(d).padStart(2, '0') : '') + ' €';
  }
  function cuota(p) { return Math.round(p / 3 * 100) / 100; }
  function med(m) { return m.replace('x', ' × '); }
  function desde(t) { var b = null; for (var m in t) if (!b || t[m].p < b.p) b = t[m]; return b; }
  function off(d) { return d.r > d.p ? Math.round((1 - d.p / d.r) * 100) : 0; }
  function precio(d, o) {
    o = o || {};
    if (!d) return '<p class="pr-from">No disponible en esta medida</p>';
    return '<div class="pr">' + (o.from ? '<span class="pr-from">' + o.from + '</span>' : '') +
      '<div class="pr-r"><span class="pr-now num">' + eur(d.p) + '</span>' + (off(d) ? '<span class="pr-old num">' + eur(d.r) + '</span><span class="pr-off">−' + off(d) + ' %</span>' : '') + '</div>' +
      (o.fee === false ? '' : '<span class="pr-fee num">o 3 pagos de ' + eur(cuota(d.p)) + ' sin intereses</span>') + '</div>';
  }
  var SENS = { firme: 'Firme', equilibrada: 'Ni duro ni blando', acogedora: 'Suave' };
  var IMG = { visco: 'img/natura-visco-nueva', gold: 'img/natura-gold-nueva', latex: 'img/natura-latex-01', gran: 'img/gran-natura-nueva' };
  var IMG_W = { visco: 1024, gold: 1024, latex: 1100, gran: 1024 };
  function foto(k, small) { return IMG[k] + '-' + (small ? 560 : IMG_W[k]) + '.webp'; }
  function url(k, q) { return P[k].url + (q ? '?' + q : ''); }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var GIFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1s3 1 5 1c2 0 5 1.5 5-1s-3.5-2-5 1"/></svg>';
  function track(ev, o) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: ev, page_type: page }, o || {})); if (window.console) console.debug('[GA4]', ev, o || ''); }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  var MEDIDA = store('d2_medida') || C.medidaInicial.v;

  /* ---------- cabecera y pie ---------- */
  var tel = C.telefono;
  $('#hd').innerHTML =
    '<div class="bar"><div class="w bar-in"><span class="bar-h">' + C.horario.v + '</span>' +
      '<ul><li>Envío y montaje gratis</li><li>14 noches de prueba</li><li>3 pagos sin intereses</li></ul>' +
      '<a href="tel:' + tel.tel + '" data-lead="franja">' + tel.v + '</a></div></div>' +
    '<header class="hd"><div class="w hd-in">' +
      '<a class="hd-logo" href="index.html" aria-label="Lo Monaco, inicio"><img src="https://www.grupolomonaco.com/wp-content/uploads/2024/04/LOMONACO-LOGO.svg" alt="LOMONACO" width="128" height="19"></a>' +
      '<nav class="hd-nav" aria-label="Principal"><a href="colchones.html"' + (page === 'categoria' ? ' aria-current="page"' : '') + '>Colchones</a><a href="colchon-natura-gold.html?base=canape">Packs con regalo</a><a href="#ayuda">Ayuda</a></nav>' +
      '<div class="hd-r"><button class="hd-cart" type="button" data-cart aria-label="Ver la cesta">Cesta <b id="cart-n">0</b></button></div>' +
    '</div></header>';
  $('#ft').innerHTML =
    '<footer class="ft" id="ayuda"><div class="w"><div class="ft-in">' +
      '<div><img src="https://www.grupolomonaco.com/wp-content/uploads/2024/04/LOMONACO-LOGO.svg" alt="LOMONACO" width="120" height="17" loading="lazy"><p style="color:var(--mute);max-width:22em">Colchones de látex, muelles ensacados y viscoelástica. Te ayudamos a elegir por teléfono.</p></div>' +
      '<div><p class="k">Comprar</p><ul><li><a href="colchones.html">Colchones</a></li><li><a href="colchon-natura-gold.html?base=canape">Packs con regalo</a></li>' + ORDEN.map(function (k) { return '<li><a href="' + url(k) + '">' + P[k].nombre + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><p class="k">Ayuda</p><ul><li><a href="' + LM.WEB + '/envios/">Envíos</a></li><li><a href="' + LM.WEB + '/devoluciones/">Devoluciones</a></li><li><a href="' + LM.WEB + '/garantia/">Garantía</a></li><li><a href="' + LM.WEB + '/metodos-de-pago/">Formas de pago</a></li></ul></div>' +
      '<div><p class="k">Habla con nosotros</p><ul><li><a href="tel:' + tel.tel + '" data-lead="pie">' + tel.v + '</a></li><li><a href="https://wa.me/+34650282094" data-lead="whatsapp">WhatsApp</a></li><li><span style="color:var(--mute)">' + C.horario.v + '</span></li></ul></div>' +
    '</div><div class="ft-legal"><span>© LM Descanso S.L.</span><a href="' + LM.WEB + '/aviso-legal/">Aviso legal</a><a href="' + LM.WEB + '/politica-de-privacidad/">Privacidad</a><a href="' + LM.WEB + '/politica-de-cookies/">Cookies</a><span>Maqueta · Diseño 2</span></div></div></footer>';

  /* ---------- cesta ---------- */
  var cesta = [];
  function abrirCesta(it) {
    var d = document.createElement('div'); d.className = 'drawer';
    var tot = cesta.reduce(function (s, x) { return s + x.precio; }, 0);
    d.innerHTML = '<div class="drawer-bg" data-x></div><aside class="drawer-p" role="dialog" aria-modal="true" aria-label="Tu cesta" tabindex="-1">' +
      '<div class="drawer-h"><b>Tu cesta</b><button class="drawer-x" type="button" data-x aria-label="Cerrar">×</button></div>' +
      (it ? '<p class="drawer-ok">✓ Añadido a tu cesta</p>' : '') +
      (cesta.length ? cesta.map(function (x) { return '<div class="drawer-it"><img src="' + x.img + '" alt=""><div><b>' + x.nombre + '</b><small>' + x.detalle + '</small><b class="num">' + eur(x.precio) + '</b></div></div>'; }).join('') : '<p class="drawer-note">Tu cesta está vacía.</p>') +
      (cesta.length ? '<div class="drawer-tot"><span>Total</span><span class="num">' + eur(tot) + '</span></div><p class="drawer-note">o 3 pagos de ' + eur(cuota(tot)) + ' sin intereses · Envío y montaje gratis en la península</p>' +
        '<a class="b b--full" href="' + LM.WEB + '/?add-to-cart=' + cesta[cesta.length - 1].pid + '&variation_id=' + cesta[cesta.length - 1].id + '" data-checkout>Finalizar compra <i>' + ARROW + '</i></a>' : '') +
      '<button class="u" type="button" data-x style="justify-self:start">Seguir mirando</button>' +
      '<p class="drawer-note">¿Alguna duda antes de pagar? <a href="tel:' + tel.tel + '" data-lead="cesta">' + tel.v + '</a></p></aside>';
    document.body.appendChild(d); document.documentElement.style.overflow = 'hidden';
    $('.drawer-p', d).focus();
    function cerrar() { d.remove(); document.documentElement.style.overflow = ''; }
    d.addEventListener('click', function (e) { if (e.target.closest('[data-x]')) cerrar(); if (e.target.closest('[data-checkout]')) track('begin_checkout', { value: tot }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }
  function anadir(it) {
    cesta.push(it); $('#cart-n').textContent = cesta.length;
    track('add_to_cart', { item_id: it.id, item_name: it.nombre, price: it.precio, currency: 'EUR' });
    abrirCesta(it);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart]')) abrirCesta();
    var l = e.target.closest('[data-lead]'); if (l) track('generate_lead', { method: /wa\.me/.test(l.href) ? 'whatsapp' : 'phone', source: l.getAttribute('data-lead') });
  });

  /* ---------- revelado al hacer scroll ---------- */
  function revelar() {
    var els = $$('.rv, .ln');
    if (!motion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('on'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('on'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // respaldo: lo que ya está a la vista o por encima se muestra
    setTimeout(function () { els.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('on'); }); }, 1200);
  }
  addEventListener('load', function () { document.body.classList.add('loaded'); });

  /* =========================================================================
     HOME
     ========================================================================= */
  if (page === 'home') {
    var minP = Math.min.apply(null, ORDEN.map(function (k) { return desde(PR[k]).p; }));
    $('#h-desde').textContent = eur(minP);
    // Selector «¿Cuál es el tuyo?»: dos preguntas → recomendación al momento (reglas con los datos de cada colchón)
    var r = { sens: 'media', calor: 'no' };
    function reco() {
      if (r.sens === 'firme') return r.calor === 'si' ? 'gran' : 'visco';
      if (r.sens === 'media') return r.calor === 'si' ? 'latex' : 'gold';
      return 'latex';
    }
    function pintarReco(anim) {
      var k = reco(), p = P[k], d = desde(PR[k]), box = $('#pick-r');
      box.innerHTML = '<figure><img src="' + foto(k) + '" alt="Colchón ' + p.nombre + '" width="1024" height="1024"></figure>' +
        '<div class="pick-b"><div><span class="k k--lm">Te recomendamos</span><h3>' + p.nombre + '</h3><p class="why">' + p.paraQuien + ' ' + p.diferencia + '</p>' +
        '<div style="margin-top:14px">' + precio(d, { from: 'Desde' }) + '</div></div>' +
        '<div class="acts"><a class="b" href="' + url(k) + '" data-reco="' + k + '">Ver el ' + p.nombre + ' <i>' + ARROW + '</i></a>' +
        '<a class="u" href="colchones.html" style="font-size:14px">o compara los cuatro</a></div></div>';
      if (anim) { box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap'); }
    }
    $('#pick-q').addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]'); if (!b) return;
      r[b.getAttribute('data-q')] = b.getAttribute('data-v');
      $$('[data-q="' + b.getAttribute('data-q') + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      pintarReco(true); track('quiz_answer', { q: b.getAttribute('data-q'), v: b.getAttribute('data-v'), result: reco() });
    });
    pintarReco();

    // Lista editorial
    $('#list').innerHTML = ORDEN.map(function (k, i) {
      var p = P[k], d = desde(PR[k]);
      return '<a class="row rv" style="--d:' + i * 80 + 'ms" href="' + url(k) + '" data-img="' + foto(k, true) + '">' +
        '<img class="th" src="' + foto(k, true) + '" alt="" width="72" height="72" loading="lazy">' +
        '<h3>' + p.nombre + '</h3><p>' + SENS[p.sensacion] + '. ' + p.diferencia + '</p>' +
        '<span class="pr"><span class="pr-from">Desde</span><b class="num">' + eur(d.p) + '</b></span>' +
        '<span class="go">' + ARROW + '</span></a>';
    }).join('');
    // Foto que sigue al cursor sobre la lista (escritorio)
    if (matchMedia('(hover: hover) and (min-width: 901px)').matches) {
      var peek = document.createElement('div'); peek.className = 'peek'; peek.innerHTML = '<img alt="">'; document.body.appendChild(peek);
      var pi = $('img', peek), mx = 0, my = 0, px = 0, py = 0, raf = 0;
      function mover() { px += (mx - px) * .16; py += (my - py) * .16; peek.style.left = px + 'px'; peek.style.top = py + 'px'; raf = Math.abs(mx - px) + Math.abs(my - py) > .5 ? requestAnimationFrame(mover) : 0; }
      $('#list').addEventListener('mousemove', function (e) { mx = e.clientX + 170; my = e.clientY; if (!raf) raf = requestAnimationFrame(mover); });
      $('#list').addEventListener('mouseover', function (e) { var row = e.target.closest('.row'); if (row) { pi.src = row.getAttribute('data-img').replace('-560', '-' + (row.getAttribute('data-img').indexOf('latex') > -1 ? 1100 : 1024)); peek.classList.add('on'); } });
      $('#list').addEventListener('mouseleave', function () { peek.classList.remove('on'); });
    }

    // Pack: precio mínimo real de los 8 packs
    var packMin = Math.min.apply(null, ORDEN.reduce(function (a, k) { return a.concat([desde(PR[k + 'Canape']).p, desde(PR[k + 'Base']).p]); }, []));
    $('#pack-desde').textContent = eur(packMin);
    $('#gifts').innerHTML = LM.REGALOS.map(function (g) { return '<li>' + g[0] + '<span>Regalo</span></li>'; }).join('');

    // Opiniones reales
    var revs = LM.RESENAS.filter(function (x) { return x.x.length < 130; }), ri = 0, q = $('#q'), qm = $('#q-m'), dots = $('#q-dots');
    dots.innerHTML = revs.map(function (_, i) { return '<button type="button" aria-label="Opinión ' + (i + 1) + '"></button>'; }).join('');
    function verRev(i, anim) {
      ri = i; q.textContent = revs[i].x; qm.textContent = 'Cliente verificado · ' + revs[i].f + (revs[i].m ? ' · ' + revs[i].m : '');
      $$('button', dots).forEach(function (b, j) { b.setAttribute('aria-current', j === i); });
      if (anim) { q.classList.remove('swap'); void q.offsetWidth; q.classList.add('swap'); }
    }
    dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { verRev($$('button', dots).indexOf(b), true); clearInterval(auto); } });
    verRev(0);
    var auto = motion ? setInterval(function () { if (!document.hidden) verRev((ri + 1) % revs.length, true); }, 6000) : 0;
  }

  /* =========================================================================
     CATEGORÍA
     ========================================================================= */
  if (page === 'categoria') {
    var stc = { medida: MEDIDA, sens: 'all' };
    var selM = $('#c-medida');
    selM.innerHTML = LM.MEDIDAS.map(function (m) { return '<option value="' + m + '"' + (m === stc.medida ? ' selected' : '') + '>' + med(m) + ' cm</option>'; }).join('');
    function tarjetas() {
      $('#grid').innerHTML = ORDEN.map(function (k, i) {
        var p = P[k], d = PR[k][stc.medida];
        var ok = stc.sens === 'all' || LM.FILTROS_B.sens[stc.sens].indexOf(k) > -1;
        return '<article class="card rv' + (ok ? '' : ' is-out') + '" style="--d:' + i * 80 + 'ms">' +
          '<figure><img src="' + foto(k) + '" alt="Colchón ' + p.nombre + '" width="1024" height="1024" loading="lazy"><span class="tag">' + p.etiqueta + '</span></figure>' +
          '<div class="card-b"><span class="k">' + p.nucleo + '</span><h2><a href="' + url(k, 'medida=' + stc.medida) + '">' + p.nombre + '</a></h2><p>' + p.diferencia + '</p>' +
          '<dl class="spec"><div><dt>Sensación</dt><dd>' + SENS[p.sensacion] + '</dd></div><div><dt>Firmeza</dt><dd class="num">' + p.firmeza + ' %</dd></div><div><dt>Altura</dt><dd>' + p.altura + '</dd></div></dl>' +
          '<div class="card-f">' + precio(d, { from: 'En ' + med(stc.medida) + ' cm' }) +
          '<div class="acts">' + (d ? '<button class="b b--plain" type="button" data-add="' + k + '">Comprar</button>' : '') + '<a class="b b--line" href="' + url(k, 'medida=' + stc.medida) + '">Ver</a></div></div></div></article>';
      }).join('');
      var n = $$('.card:not(.is-out)').length;
      $('#c-n').textContent = n + (n === 1 ? ' colchón' : ' colchones') + ' · precios en ' + med(stc.medida) + ' cm';
      $$('.card .rv, .card.rv').forEach(function (el) { el.classList.add('on'); });
      tabla();
    }
    function tabla() {
      var rows = [['Sensación', function (p) { return SENS[p.sensacion]; }], ['Firmeza', function (p) { return p.firmeza + ' %'; }], ['Adaptabilidad', function (p) { return p.adaptabilidad + ' %'; }],
        ['Núcleo', function (p) { return p.nucleo; }], ['Altura', function (p) { return p.altura; }], ['Precio en ' + med(stc.medida), function (p, k) { var d = PR[k][stc.medida]; return d ? '<b class="num">' + eur(d.p) + '</b>' : 'No disponible'; }]];
      $('#cmp').innerHTML = '<thead><tr><th></th>' + ORDEN.map(function (k) { return '<th scope="col"><a href="' + url(k, 'medida=' + stc.medida) + '" style="text-decoration:none">' + P[k].nombre + '</a></th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th>' + ORDEN.map(function (k) { return '<td>' + r[1](P[k], k) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
    }
    selM.addEventListener('change', function () { stc.medida = this.value; store('d2_medida', stc.medida); tarjetas(); track('filter', { medida: stc.medida }); });
    $('#c-sens').addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      stc.sens = b.getAttribute('data-v'); $$('#c-sens button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); tarjetas(); track('filter', { sensacion: stc.sens });
    });
    // Compra directa desde la categoría (sin pasar por la ficha)
    $('#grid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-add]'); if (!b) return;
      var k = b.getAttribute('data-add'), d = PR[k][stc.medida];
      anadir({ id: d.id, pid: P[k].id, nombre: 'Colchón ' + P[k].nombre, detalle: med(stc.medida) + ' cm', precio: d.p, img: foto(k, true) });
    });
    tarjetas();
  }

  /* =========================================================================
     FICHA
     ========================================================================= */
  if (page === 'producto') {
    var K = document.body.getAttribute('data-producto'), Pk = P[K];
    var qs = new URLSearchParams(location.search), PB = LM.PACK_BASES;
    var st = { medida: qs.get('medida') || MEDIDA, base: ({ canape: 1, base: 1 })[qs.get('base')] ? qs.get('base') : 'solo', color: { canape: PB.canape.porDefecto, base: PB.base.porDefecto } };
    function tab(b) { b = b || st.base; return b === 'solo' ? PR[K] : PR[K + PB[b].tabla]; }
    if (!tab()[st.medida]) st.medida = C.medidaInicial.v;
    function act() { return tab()[st.medida]; }

    // Galería: foto del modelo + detalles
    var fotos = [{ s: foto(K), a: 'Colchón ' + Pk.nombre }].concat([2, 3, 4, 5, 6, 7].map(function (n) { return { s: 'img/producto-0' + n + '-947.webp', a: 'Detalle del colchón' }; }));
    var gal = $('#gal');
    gal.innerHTML = fotos.map(function (f, i) { return '<figure><img src="' + f.s + '" alt="' + f.a + '" width="1024" height="1024"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '></figure>'; }).join('');
    function contador() { var i = Math.round(gal.scrollLeft / (gal.clientWidth || 1)); $('#gal-n').textContent = (i + 1) + ' / ' + fotos.length; }
    gal.addEventListener('scroll', contador, { passive: true }); contador();

    // Caja de compra: 3 decisiones (medida · solo o pack · color)
    $('#b-k').textContent = Pk.etiqueta; $('#b-h1').textContent = Pk.nombre; $('#b-v').textContent = Pk.vp;
    $('#b-crumb').textContent = Pk.nombre;
    var entrega = Pk.entrega || C.entrega.v;
    $('#b-mini').innerHTML = ['Llega en ' + entrega, C.envio.v, C.prueba.v + ' de prueba en tu cama', C.garantia.v + ' de garantía'].map(function (x) { return '<li>' + x + '</li>'; }).join('');
    function pintar() {
      var d = act(), solo = PR[K][st.medida];
      $('#b-pr').innerHTML = precio(d, { from: 'Precio en ' + med(st.medida) + ' cm' });
      $('#sz').innerHTML = LM.MEDIDAS.map(function (m) { var x = tab()[m]; return '<button type="button" aria-pressed="' + (m === st.medida) + '" data-m="' + m + '"' + (x && x.s ? '' : ' disabled') + '>' + med(m).replace(' × ', '×') + '</button>'; }).join('');
      $('#sz-v').textContent = med(st.medida) + ' cm';
      $('#opt').innerHTML = [['solo', 'Solo colchón', 'Para tu cama o canapé actual'], ['canape', 'Con canapé abatible', PB.canape.d], ['base', 'Con base tapizada', PB.base.d]].map(function (o) {
        var x = tab(o[0])[st.medida];
        var dif = !x ? 'No disponible' : o[0] === 'solo' ? eur(x.p) : '+' + eur(x.p - (solo ? solo.p : 0));
        return '<button type="button" aria-pressed="' + (st.base === o[0]) + '" data-b="' + o[0] + '"' + (x ? '' : ' disabled') + '><span><b>' + o[1] + '</b><small>' + o[2] + (o[0] !== 'solo' ? ' · <span class="gift">regalos incluidos</span>' : '') + '</small></span><em class="num">' + dif + '</em></button>';
      }).join('');
      var pack = st.base !== 'solo';
      $('#st-color').hidden = !pack; $('#gift').hidden = !pack;
      if (pack) {
        $('#sw').innerHTML = PB[st.base].colores.map(function (c) { return '<button type="button" aria-pressed="' + (st.color[st.base] === c[0]) + '" data-c="' + c[0] + '" style="--c:' + c[1] + '" title="' + c[0] + '" aria-label="' + c[0] + '"></button>'; }).join('');
        $('#sw-v').textContent = st.color[st.base];
      }
      var nom = pack ? Pk.nombre + ' + ' + PB[st.base].corto + ' ' + st.color[st.base] : 'Colchón ' + Pk.nombre;
      $('#b-cta').innerHTML = (d ? 'Añadir a la cesta · <span class="num">' + eur(d.p) + '</span>' : 'No disponible') + ' <i>' + ARROW + '</i>';
      $('#s-t').textContent = nom + ' · ' + med(st.medida); $('#s-p').textContent = d ? eur(d.p) : '';
      var u = new URLSearchParams(); u.set('medida', st.medida); if (pack) u.set('base', st.base);
      try { history.replaceState(null, '', '?' + u.toString()); } catch (e) { /* abierto como archivo: no pasa nada */ }
    }
    $('#buy').addEventListener('click', function (e) {
      var m = e.target.closest('[data-m]'), b = e.target.closest('[data-b]'), c = e.target.closest('[data-c]');
      if (m && !m.disabled) { st.medida = m.getAttribute('data-m'); store('d2_medida', st.medida); pintar(); track('select_item', { item_variant: st.medida }); }
      if (b && !b.disabled) { st.base = b.getAttribute('data-b'); if (!tab()[st.medida]) st.medida = C.medidaInicial.v; pintar(); track('select_item', { item_variant: st.base }); }
      if (c) { st.color[st.base] = c.getAttribute('data-c'); pintar(); }
    });
    function comprar(src) {
      var d = act(); if (!d) return;
      var pack = st.base !== 'solo';
      anadir({ id: d.id, pid: pack ? Pk.packs[st.base].pid : Pk.id, nombre: pack ? 'Pack ' + Pk.nombre + ' + ' + PB[st.base].corto : 'Colchón ' + Pk.nombre,
        detalle: med(st.medida) + ' cm' + (pack ? ' · ' + st.color[st.base] + ' · con almohadas, edredón y protector de regalo' : ''), precio: d.p, img: foto(K, true) });
      track('add_to_cart_src', { src: src });
    }
    $('#b-cta').addEventListener('click', function () { comprar('main'); });
    $('#s-cta').addEventListener('click', function () { comprar('sticky'); });
    pintar();

    // Barra fija cuando el botón principal sale de pantalla
    var stk = $('#sticky');
    if ('IntersectionObserver' in window) // Visible siempre que el botón principal no esté en pantalla (por encima o por debajo): la compra, siempre a un clic
    new IntersectionObserver(function (en) { var on = !en[0].isIntersecting; stk.classList.toggle('on', on); stk.setAttribute('aria-hidden', !on); }).observe($('#b-cta'));

    // Cuerpo: 3 razones, por dentro, datos, opiniones, preguntas
    $('#three').innerHTML = Pk.beneficios.slice(0, 3).map(function (b, i) { return '<li class="rv" style="--d:' + i * 90 + 'ms"><b>' + b[1] + '</b><p>' + b[2] + '</p></li>'; }).join('');
    $('#layers').innerHTML = Pk.capas.map(function (c) { return '<li><div><b>' + c[0] + '</b><p>' + c[1] + '</p></div></li>'; }).join('');
    $('#in-h').innerHTML = 'Cuatro capas.<br><em>Ni una de más.</em>';
    $('#specs').innerHTML = [['Núcleo', Pk.nucleo], ['Altura', Pk.altura], ['Firmeza', Pk.firmeza + ' %'], ['Adaptabilidad', Pk.adaptabilidad + ' %'], ['Sensación', Pk.sensacionTxt], ['Para quién', Pk.paraQuien]]
      .map(function (s) { return '<tr><th scope="row">' + s[0] + '</th><td>' + s[1] + '</td></tr>'; }).join('');
    $('#revs').innerHTML = LM.RESENAS.slice(0, 3).map(function (x, i) { return '<figure class="rev rv" style="--d:' + i * 90 + 'ms"><span class="stars" aria-label="5 estrellas">★★★★★</span><p>«' + x.x + '»</p><small>Cliente verificado · ' + x.f + '</small></figure>'; }).join('');
    var faqs = [
      ['¿Y si no me acostumbro?', 'Tienes ' + C.prueba.v + ' para probarlo en tu cama. ' + C.devolucionCond.v],
      ['¿Cuándo me llega?', 'En ' + entrega + '. ' + C.envio.v + '. Si lo pides con canapé o base, te lo montamos todo.'],
      ['¿Qué cubre la garantía?', C.garantia.v + ' de garantía. ' + C.garantiaCubre.v],
      ['¿Puedo pagarlo a plazos?', 'Sí: en ' + C.financiacion.v + '. También con tarjeta o Bizum.'],
      ['¿Qué medida necesito?', 'La de tu cama o canapé: mide por dentro el ancho y el largo. Si dudas, llámanos al ' + tel.v + ' y lo vemos contigo.']
    ];
    $('#faq').innerHTML = faqs.map(function (f) { return '<details class="more"><summary>' + f[0] + '</summary><div class="in"><p>' + f[1] + '</p></div></details>'; }).join('');
    $('#faq').addEventListener('toggle', function (e) { if (e.target.open) track('faq_open', { q: $('summary', e.target).textContent }); }, true);
    var d0 = act(); if (d0) track('view_item', { item_id: d0.id, item_name: Pk.nombre, price: d0.p, currency: 'EUR' });
  }

  revelar();
})();
