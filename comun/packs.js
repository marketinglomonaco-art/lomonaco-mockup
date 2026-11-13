/* LO MONACO · Configurador de packs de la home (y de la categoría, si tiene #h4p).
   Paco, 05/11: solo los packs que existen en la tienda.
   - Canapé + Gran Natura, Natura Látex o Natura Gold: almohadas, edredón y protector de regalo.
   - Canapé + Natura Visco: almohadas y protector de regalo.
   - Base tapizada antideslizante + colchón: descuento sobre el precio y almohadas de regalo (Paco, 06/11).
   Se ve el precio de cada producto por separado y lo que te ahorras con el pack (precios para 150 × 190). */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$;
  // Paco, 12/11: se puede arrancar más tarde (la categoría de packs lo coloca después de cargar)
  function iniciar() {
  var pc = $('#h4p');
  if (!pc || pc.getAttribute('data-on')) return;
  pc.setAttribute('data-on', '1');
  var PC = LM.PACK_CONF, st = { base: 'canape', col: 'gran' };
  var M = LM.CONFIG.medidaInicial.v;
  function off(d) { return Math.round((1 - d.p / d.r) * 100); }
  function tabla(col, base) { return LM.PRECIOS[col + (base === 'canape' ? 'Canape' : 'Base')]; }
  function medida(col, base) { return tabla(col, base)[M] ? M : Object.keys(tabla(col, base))[0]; }
  function red(n) { return Math.round(n * 100) / 100; }
  var CTA_HTML = $('#h4p-go').innerHTML;

  var segB = $('#h4p-base'), colB = $('#h4p-col');
  // Paco, 12/11: selector de medida del colchón, debajo de «Elige tu colchón»
  colB.insertAdjacentHTML('afterend', '<p class="h4p-k" id="h4p-mk">Elige tu medida</p><label class="h4p-med"><span class="lm-sr">Medida del colchón</span><select id="h4p-med" aria-labelledby="h4p-mk"></select></label>');
  var medSel = $('#h4p-med');
  st.medida = LM.medidaInicial();
  medSel.addEventListener('change', function () {
    st.medida = this.value; LM.store.set('lm_medida', st.medida); pintarPack(); LM.track('pack_medida', { medida: st.medida });
    // el filtro de medidas de la página (si lo hay) marca la misma
    LM.$$('[data-hm]').forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-hm') === st.medida); });
  });
  // Paco, 13/11: en el configurador grande, canapé o base se elige con su foto
  var FOTOS = segB.classList.contains('h4p-tipo'), NUEVO = !!$('#h4p-sel');
  if (FOTOS) {
    // Paco, 13/11: foto del canapé o de la base sola (sin colchón), sobre gris, y debajo su selector de acabados
    segB.innerHTML = PC.orden.map(function (b) {
      var f = PC.bases[b];
      return '<div class="h4p-tipo-c"><button type="button" role="radio" data-base="' + b + '" aria-label="' + f.t + '">' +
        '<img src="../img/pack-tipo-' + b + '-700.webp" srcset="../img/pack-tipo-' + b + '-700.webp 700w, ../img/pack-tipo-' + b + '-1200.webp 1200w" sizes="(max-width: 900px) 50vw, 25vw" alt="" width="700" height="438" loading="lazy">' +
        '<span>' + LM.ico('check', 'h4p-tipo-ok') + f.t + '</span></button><div class="h4p-tipo-sw" data-sw-base="' + b + '"></div></div>';
    }).join('');
  } else {
  // Paco, 06/11: la pastilla granate se desliza de una opción a la otra (h4p-seg-ind)
  segB.innerHTML = '<span class="h4p-seg-ind" aria-hidden="true"></span>' +
    PC.orden.map(function (b) { return '<button type="button" role="radio" data-base="' + b + '">' + PC.bases[b].t + '</button>'; }).join('');
  }
  var ind = $('.h4p-seg-ind', segB);
  function deslizar() {
    if (!ind) return;
    var b = $('[data-base="' + st.base + '"]', segB); if (!b || !b.offsetWidth) return;
    ind.style.width = b.offsetWidth + 'px'; ind.style.height = b.offsetHeight + 'px';
    ind.style.borderRadius = getComputedStyle(b).borderRadius;
    ind.style.transform = 'translate(' + b.offsetLeft + 'px,' + b.offsetTop + 'px)';
  }
  // Al cambiar el tamaño de la ventana (o al cargar las fuentes) se recoloca sin animación
  function recolocar() { segB.classList.add('is-sin'); deslizar(); requestAnimationFrame(function () { segB.classList.toggle('is-sin', false); }); }
  addEventListener('resize', recolocar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(recolocar);
  // Paco, 13/11: en el configurador grande, cada colchón con su foto
  colB.innerHTML = PC.colchones.map(function (c) { return '<button type="button" role="radio" data-col="' + c.k + '">' + (FOTOS ? '<img src="../img/' + LM.FOTO_HOME[c.k] + '-480.webp" alt="" width="480" height="480" loading="lazy">' : '') + '<b>' + c.t + '</b><small>' + c.d + '</small></button>'; }).join('');
  var img = $('#h4p-img'), ultimaFoto = 'canape'; // 12/11: la home ya no lleva foto (img = null)
  /* Paco, 10/11 · Categoría (versión reducida): que no se elija el colchón a ciegas. Bajo los botones,
     qué es el colchón elegido, cómo se siente, sus tres puntos fuertes y el enlace a su ficha */
  var info = null;
  if (pc.closest('.h4p--mini')) {
    info = document.createElement('div'); info.className = 'h4p-info'; info.id = 'h4p-info'; info.setAttribute('aria-live', 'polite');
    colB.parentNode.insertBefore(info, colB.nextSibling);
  }
  function pintarInfo() {
    if (!info) return;
    var P = LM.PRODUCTOS[st.col];
    info.innerHTML = '<p class="h4p-info-k">' + P.nucleo + ' · ' + P.altura + '</p>' +
      '<p class="h4p-info-s">' + P.sensacionTxt + '</p>' +
      '<ul class="h4p-info-b">' + P.beneficios.slice(0, 3).map(function (b) { return '<li>' + LM.ico(b[0]) + '<span>' + b[1] + '</span></li>'; }).join('') + '</ul>' +
      '<a class="h4p-info-l" href="' + LM.href(P.url) + '">Ver el colchón ' + P.nombre + '</a>';
  }

  // Paco, 06/11: los regalos, con más protagonismo: bloque propio con las fotos grandes, valor tachado y «Gratis»
  function regalos(G, v) {
    return '<li class="h4p-gifts' + (G.length === 1 ? ' h4p-gifts--1' : '') + '"><p class="h4p-gifts-k">' + LM.ico('gift') + '<span>De regalo con tu pack</span>' +
      '<em>Valorado en <s>' + LM.eur(v) + '</s> <strong>Gratis</strong></em></p><div class="h4p-gifts-g">' +
      G.map(function (r) {
        return '<figure><img src="' + r[3] + '" alt="' + r[0] + ' de regalo" width="320" height="320" loading="lazy">' +
          '<figcaption><b>' + r[0] + '</b><span><s>' + LM.eur(r[4]) + '</s> <strong>Gratis</strong></span></figcaption></figure>';
      }).join('') + '</div></li>';
  }
  function fila(nombre, precio, cls) { return '<li' + (cls ? ' class="' + cls + '"' : '') + '><span>' + nombre + '</span><b>' + precio + '</b></li>'; }

  function pintarAcabados() {
    if (!FOTOS) return;
    PC.orden.forEach(function (b) {
      var box = $('[data-sw-base="' + b + '"]', segB); if (!box) return;
      var COLS = (b === 'canape' ? LM.TIENDA.canape : LM.TIENDA.base3d).colores, sel = st.colorB[b];
      box.innerHTML = '<p class="h4p-tipo-acl">Acabado: <b>' + sel + '</b></p><span class="pkl-sw" role="radiogroup" aria-label="Acabado ' + (b === 'canape' ? 'del canapé' : 'de la base') + '">' + COLS.map(function (x) {
        return '<button type="button" role="radio" data-pkc="' + x.k + '" data-pkb="' + b + '" aria-checked="' + (x.k === sel) + '" aria-label="' + x.k + '" title="' + x.k + '"><img src="../img/tienda/' + x.sw + '-700.webp" alt="" width="28" height="28" loading="lazy"></button>';
      }).join('') + '</span>';
    });
  }
  function pintarPack() {
    var col = PC.colchones.filter(function (c) { return c.k === st.col; })[0];
    $$('[data-base]', segB).forEach(function (b) { var on = b.getAttribute('data-base') === st.base; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    deslizar();
    $$('[data-col]', colB).forEach(function (b) { var on = b.getAttribute('data-col') === st.col; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    foto(); pintarInfo();
    // Paco, 12/11: lista con cada pieza y cada regalo con su precio real para la medida; al final, por separado y lo que te ahorras
    var pkKey = st.col + (st.base === 'canape' ? 'Canape' : 'Base');
    var COLS = (st.base === 'canape' ? LM.TIENDA.canape : LM.TIENDA.base3d).colores;
    st.colorB = st.colorB || { canape: 'Nogal', base: 'Chocolate' };
    if (!COLS.some(function (x) { return x.k === st.color; })) st.color = st.colorB[st.base] || (st.base === 'canape' ? 'Nogal' : 'Chocolate');
    st.colorB[st.base] = st.color;
    pintarAcabados();
    // Medidas de este pack (sin repetir las de 2 partes), en el orden de siempre
    var MP = LM.MEDIDAS.filter(function (x) { var t = LM.TIENDA.packs[pkKey].tabla; return t[x] || t[x + '-2p']; });
    if (MP.indexOf(st.medida) < 0) st.medida = MP.indexOf(M) > -1 ? M : MP[0];
    medSel.innerHTML = MP.map(function (x) { return '<option value="' + x + '"' + (x === st.medida ? ' selected' : '') + '>' + LM.medidaTxt(x) + '</option>'; }).join('');
    var m = st.medida, D = LM.packDesglose(pkKey, m, st.color);
    if (!D) { m = M; D = LM.packDesglose(pkKey, m, st.color); }
    var pack = D.d, go = $('#h4p-go');
    if (NUEVO) pintarNuevo(D, col);
    else {
    var h = LM.packLista(D, { precio: false, colores: true });
    var precio = '<p class="h4p-from">Pack para ' + LM.medidaTxt(m) + '</p><p class="h4p-now">' + LM.eur(pack.p) + '</p>' +
      (D.ahorro >= 1 ? '<p class="h4p-save">Te ahorras ' + LM.eur(D.ahorro) + '</p>' : '');
    $('#h4p-det').innerHTML = h;
    $('#h4p-price').innerHTML = precio + '<p class="lm-price-fee">' + LM.cuotaTxt(pack.p) + '</p>';
    }
    go.innerHTML = CTA_HTML;
    go.href = LM.packPagina(st.col, st.base);
    go.setAttribute('data-pid', PC.packs[st.col + (st.base === 'canape' ? 'Canape' : 'Base')].pid);
    go.setAttribute('aria-label', 'Ver el pack ' + col.t + ' ' + PC.bases[st.base].t.toLowerCase());
  }
  /* Paco, 13/11 · Configurador grande: izquierda lo que compras, derecha lo que te regalamos, abajo el precio */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function linea(l, sw, sinFoto) {
    return '<li class="pkl-li' + (l.regalo ? ' is-regalo' : '') + (sinFoto ? ' pkl-li--sf' : '') + '">' + (sinFoto ? '' : '<img src="' + l.img + '" alt="" width="92" height="92" loading="lazy">') +
      '<span><b>' + esc(l.t) + '</b><small>' + esc(l.sub) + '</small>' + (sw || '') + '</span>' +
      (l.regalo ? '<em><s>' + LM.eur(l.p) + '</s><strong>Gratis</strong></em>'
      : l.r > l.p ? '<em class="pkl-pr"><span><s>' + LM.eur(l.r) + '</s><span class="lm-price-off">-' + Math.round((1 - l.p / l.r) * 100) + ' %</span></span><b>' + LM.eur(l.p) + '</b></em>'
      : '<em>' + (l.p != null ? LM.eur(l.p) : '—') + '</em>') + '</li>';
  }
  function pintarNuevo(D, col) {
    var COLS = D.pk.base === 'canape' ? LM.TIENDA.canape.colores : LM.TIENDA.base3d.colores;
    var sw = '<span class="pkl-sw" role="radiogroup" aria-label="Color del ' + (D.pk.base === 'canape' ? 'canapé' : 'la base') + '">' + COLS.map(function (x) {
      return '<button type="button" role="radio" data-pkc="' + esc(x.k) + '" aria-checked="' + (x.k === D.color) + '" aria-label="' + esc(x.k) + '" title="' + esc(x.k) + '"><img src="../img/tienda/' + x.sw + '-700.webp" alt="" width="28" height="28" loading="lazy"></button>';
    }).join('') + '</span>';
    $('#h4p-sel').innerHTML = '<p class="h4p-k">Tu selección</p><ul class="pkl" aria-label="Lo que compras">' + linea(D.lineas[0], '', FOTOS) + linea(D.lineas[1], FOTOS ? '' : sw, FOTOS) + '</ul>'; // Paco, 13/11: sin fotos ni selector de color (ya están arriba)
    // Regalos
    $('#h4p-rgk').innerHTML = LM.ico('gift') + '<span>Lo que te regalamos</span>';
    $('#h4p-reg').innerHTML = '<p class="h4p-rg-v">' + D.regalos.length + ' regalos valorados en <s>' + LM.eur(D.valorRegalos) + '</s> <strong>Gratis</strong></p>' +
      '<ul class="pkl" aria-label="Lo que te regalamos">' + D.regalos.map(function (l) { return linea(l); }).join('') + '</ul>' +
      '<p class="h4p-rg-n">Van dentro de tu pack. No pagas nada más por ellos.</p>';
    // Precio: después de ver lo que compras y lo que te regalan
    var pack = D.d, nom = col.t + (st.base === 'canape' ? ' con canapé ' : ' con base ') + D.color;
    $('#h4p-price').innerHTML = '<p class="h4p-from">Tu pack · ' + nom + ' · ' + LM.medidaTxt(D.m) + '</p>' +
      '<div class="h4p-pr-row"><p class="h4p-now">' + LM.eur(pack.p) + '</p>' +
      (D.suelto > pack.p ? '<p class="h4p-was">Por separado <s>' + LM.eur(D.suelto) + '</s></p>' : '') + '</div>' +
      '<div class="h4p-pr-row h4p-pr-row--2">' + (D.ahorro >= 1 ? '<p class="h4p-save">Te ahorras ' + LM.eur(D.ahorro) + '</p>' : '') +
      '<p class="lm-price-fee">' + LM.cuotaTxt(pack.p) + '</p></div>';
    var tr = $('#h4p-trust');
    if (tr && !tr.firstChild) tr.innerHTML = '<li>' + LM.ico('truck') + LM.c('envioDevolucion') + '</li><li>' + LM.ico('moon') + LM.c('prueba') + ' de prueba</li>';
  }
  function foto() {
    if (!img) return; // versión reducida (categorías): sin foto
    if (ultimaFoto !== st.base) {
      ultimaFoto = st.base; var f = PC.bases[st.base];
      img.srcset = f.img + '-700.webp 700w, ' + f.img + '-1200.webp 1200w'; img.src = f.img + '-1200.webp';
    }
    img.alt = PC.bases[st.base].alt;
  }
  function radios(box, attr, set) {
    box.addEventListener('click', function (e) { var b = e.target.closest('[' + attr + ']'); if (!b) return; set(b.getAttribute(attr)); pintarPack(); });
    box.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
      e.preventDefault(); var bs = $$('[' + attr + ']', box), i = bs.indexOf(document.activeElement);
      var n = bs[(i + k + bs.length) % bs.length]; set(n.getAttribute(attr)); pintarPack(); n.focus();
    });
  }
  // Paco, 12/11: color del canapé o de la base, elegido en su línea del listado
  pc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pkc]'); if (!b) return;
    var pb = b.getAttribute('data-pkb');
    if (pb) { st.base = pb; st.colorB = st.colorB || {}; st.colorB[pb] = b.getAttribute('data-pkc'); }
    st.color = b.getAttribute('data-pkc'); pintarPack();
    var n = $('[data-pkc="' + st.color + '"]' + (pb ? '[data-pkb="' + pb + '"]' : ''), pc); if (n) n.focus({ preventScroll: true });
    LM.track('pack_color', { color: st.color, base: st.base });
  });
  LM.repintarPacks = function () { st.medida = LM.medidaInicial(); pintarPack(); }; // la home lo llama al cambiar la medida de las tarjetas
  radios(segB, 'data-base', function (v) { st.base = v; if (st.colorB && st.colorB[v]) st.color = st.colorB[v]; });
  radios(colB, 'data-col', function (v) { st.col = v; });
  $('#h4p-go').addEventListener('click', function () { if (this.hasAttribute('data-pid')) LM.track('select_item', { item_list_name: 'home_pack_config', item_id: +this.getAttribute('data-pid') }); });
  pintarPack();
  // Las fotos de las bases se precargan para que el cambio sea instantáneo
  if (img) PC.orden.forEach(function (b) { var i = new Image(); i.src = PC.bases[b].img + '-1200.webp'; });
  }
  LM.iniciarPacks = iniciar;
  iniciar();
})();
