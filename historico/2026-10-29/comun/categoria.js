/* LO MONACO · Categoría «Encuentra tu colchón» [C1–C3] */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, P = LM.PRODUCTOS;
  var state = { medida: LM.medidaInicial(), sens: 'all', tipo: 'all', mat: 'all', alt: 'all', orden: 'rec' };
  var FB = LM.FILTROS_B;
  // Alturas reales, de menor a mayor
  var ALT = [['all', 'Todas']].concat(LM.ORDEN.map(function (k) { return P[k].altura; }).filter(function (a, i, l) { return l.indexOf(a) === i; })
    .sort(function (a, b) { return parseFloat(a) - parseFloat(b); }).map(function (a) { return [a, a]; }));
  var SENS = [['all', 'Todas'], ['firme', 'Firme'], ['equilibrada', 'Equilibrada'], ['acogedora', 'Acogedora']];
  var TIPO = [['all', 'Todo'], ['latex', 'Látex natural'], ['muelles', 'Dormir en pareja'], ['precio', 'Mejor precio']];

  function matchTipo(k) {
    if (state.tipo === 'all') return true;
    if (state.tipo === 'latex') return P[k].nucleo.toLowerCase().indexOf('látex') > -1;
    if (state.tipo === 'muelles') return P[k].nucleo.toLowerCase().indexOf('muelles') > -1;
    if (state.tipo === 'precio') return k === LM.ORDEN.slice().sort(function (a, b) { return precio(a).p - precio(b).p; })[0];
  }
  function precio(k) { return LM.PRECIOS[k][state.medida] || null; }
  function chips(el, list, key) {
    if (!el) return; // Opción A: sin filtros
    el.innerHTML = list.map(function (o) {
      return '<button type="button" role="radio" class="c-chip" aria-checked="' + (state[key] === o[0]) + '" data-v="' + o[0] + '">' + o[1] + '</button>';
    }).join('');
    el.onclick = function (e) {
      var b = e.target.closest('.c-chip'); if (!b) return;
      state[key] = b.getAttribute('data-v');
      if (key === 'medida') LM.store.set('lm_medida', state.medida);
      chips(el, list, key); render();
      LM.track('compare_use', { filter: key, value: state[key] });
    };
  }

  // Pago aplazado (comentario 4): siempre desde el precio más bajo (la medida más pequeña) a 36 meses
  function cuota36(k) {
    var F = LM.CONFIG.financiacion36, min = LM.desde(k).p, c = Math.round(min / F.meses * 100) / 100;
    return '<div class="lm-price-fee">' + LM.mark(F, 'o desde ' + LM.eur(c) + ' al mes, en ' + F.meses + ' meses') + '</div>';
  }
  var B = document.body.getAttribute('data-variante') === 'b';

  function card(k) {
    var p = P[k], d = precio(k), href = LM.href(p.url), X = LM.CAT_EXTRA[k];
    return '<article class="lm-card c-card" data-testid="product-card-' + k + '">' +
      '<div class="lm-card-img"><img src="' + p.img + '" alt="" width="760" height="806" loading="lazy">' +
        (p.imgDetalle ? '<img class="lm-detalle" src="' + p.imgDetalle + '" alt="" width="560" height="560" loading="lazy">' : '') + '<span class="lm-pill">' + p.etiqueta + '</span></div>' +
      '<div class="lm-card-b"><p class="lm-card-k">' + p.nucleo + ' · ' + p.altura + '</p>' +
      '<h3><a class="lm-stretch" href="' + href + '">' + p.titulo + '</a></h3>' +
      '<p class="c-diffline"><b>Qué lo diferencia:</b> ' + p.diferencia + '</p>' +
      // Comentario 4 (29/10): fuera los textos bajo los porcentajes; en su lugar, palabras clave en globos LM
      LM.firmeza(p, { txt: false }) +
      // Opción B (29/10): sin los globos de palabras clave; se quedan los pictogramas
      (B ? '' : '<ul class="c-keys" aria-label="Claves">' + X.claves.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>') +
      // Opción B: además, pictogramas de materiales y beneficios
      (B ? '<ul class="c-pictos">' + X.pictos.map(function (q) { return '<li>' + LM.ico(q[0]) + '<span>' + q[1] + '</span></li>'; }).join('') + '</ul>' : '') +
      LM.rating('c-rate') +
      '<div class="lm-card-f">' + (d ? LM.precio(d, { medida: state.medida, cuota: false }) + cuota36(k) : '<p class="c-na">No lo fabricamos en ' + LM.medidaTxt(state.medida) + '.</p>') +
      '<span class="lm-btn lm-btn--full" aria-hidden="true">Ver colchón</span></div></div></article>';
  }

  function render() {
    var B = document.body.getAttribute('data-variante') === 'b';
    var list = LM.ORDEN.filter(function (k) {
      // Opción B: sensación según el reparto de Paco (un colchón puede estar en varias)
      var sensOk = state.sens === 'all' || (B ? FB.sens[state.sens].indexOf(k) > -1 : P[k].sensacion === state.sens);
      var matOk = state.mat === 'all' || FB.matDe[state.mat].indexOf(k) > -1;
      var altOk = state.alt === 'all' || P[k].altura === state.alt;
      return sensOk && matOk && altOk && matchTipo(k);
    });
    if (state.orden !== 'rec') list.sort(function (a, b) {
      var pa = precio(a) ? precio(a).p : 1e9, pb = precio(b) ? precio(b).p : 1e9;
      return state.orden === 'asc' ? pa - pb : pb - pa;
    });
    $('#c-grid').innerHTML = list.map(card).join('');
    $('#c-empty').hidden = list.length > 0;
    $('#c-count').textContent = list.length + (list.length === 1 ? ' colchón' : ' colchones') + ' · precios para ' + LM.medidaTxt(state.medida);
    table();
    LM.fill($('#c-grid'));
  }

  function table() {
    if (!$('#c-table')) return; // Opción A: sin comparador
    var rows = [
      ['Sensación', function (p) { return p.sensacionTxt; }],
      ['Firmeza', function (p) { return '<span class="lm-bar c-tbar"><i style="--w:' + p.firmeza + '%"></i></span>' + p.firmeza + '%'; }],
      ['Adaptabilidad', function (p) { return '<span class="lm-bar c-tbar"><i style="--w:' + p.adaptabilidad + '%"></i></span>' + p.adaptabilidad + '%'; }],
      ['Por dentro', function (p) { return p.nucleoTxt; }],
      ['Altura', function (p) { return p.altura; }],
      ['Para quién', function (p) { return p.paraQuien; }],
      ['Te llega en', function (p) { return p.entrega ? LM.mark({ estado: 'confirmar', nota: 'Plazo de este modelo' }, p.entrega) : LM.c('entrega'); }],
      ['Garantía', function () { return LM.c('garantia'); }],
      ['Precio en ' + LM.medidaTxt(state.medida), function (p, k) { var d = precio(k); return d ? LM.precio(d, { cuota: false }) : 'No disponible'; }]
    ];
    var only = $('#c-diff') && $('#c-diff').checked;
    var h = '<thead><tr><th scope="col"><span class="lm-note">Modelo</span></th>' + LM.ORDEN.map(function (k) {
      return '<th scope="col"><a href="' + LM.href(P[k].url) + '"><img src="' + P[k].img + '" alt="" width="96" height="96" loading="lazy">' + P[k].nombre + '</a></th>';
    }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      var cells = LM.ORDEN.map(function (k) { return r[1](P[k], k); });
      if (only && cells.every(function (c) { return c === cells[0]; })) return;
      h += '<tr><th scope="row">' + r[0] + '</th>' + cells.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
    });
    h += '<tr class="c-tcta"><th scope="row"></th>' + LM.ORDEN.map(function (k) { return '<td><a class="lm-btn lm-btn--line" href="' + LM.href(P[k].url) + '">Ver ' + P[k].nombre + '</a></td>'; }).join('') + '</tr></tbody>';
    if ($('#c-table')) $('#c-table').innerHTML = h;
  }

  chips($('#c-medidas'), LM.MEDIDAS.map(function (m) { return [m, m.replace('x', '×')]; }), 'medida');
  chips($('#c-sens'), SENS, 'sens');
  chips($('#c-tipo'), TIPO, 'tipo');
  chips($('#c-mat'), FB.mat, 'mat');
  chips($('#c-alt'), ALT, 'alt');
  $('#c-orden').onchange = function () { state.orden = this.value; render(); };
  if ($('#c-diff')) $('#c-diff').onchange = function () { table(); LM.track('compare_use', { filter: 'solo_diferencias', value: this.checked }); };
  $('#c-reset').onclick = function () { state.sens = 'all'; state.tipo = 'all'; state.mat = 'all'; state.alt = 'all'; chips($('#c-sens'), SENS, 'sens'); chips($('#c-tipo'), TIPO, 'tipo'); chips($('#c-mat'), FB.mat, 'mat'); chips($('#c-alt'), ALT, 'alt'); render(); };
  if ($('.c-table-wrap')) $('.c-table-wrap').addEventListener('scroll', function once() { LM.track('compare_use', { filter: 'tabla_scroll' }); this.removeEventListener('scroll', once); });

  if ($('#c-help')) $('#c-help').innerHTML = LM.llamar('categoria', { label: '¿Dudas? Te ayudamos a elegir' });
  $('#c-guide-call').innerHTML = LM.llamar('categoria-guia', { label: 'Llámanos y elegimos contigo', cls: 'lm-call--big' });
  if ($('#c-packs')) $('#c-packs').innerHTML = LM.PACKS.slice(0, 4).map(function (p) {
    return '<article class="lm-card h-pk"><div class="lm-card-img"><img src="' + p.img + '" alt="" width="760" height="470" loading="lazy"></div>' +
      '<div class="lm-card-b"><h3><a class="lm-stretch" href="' + LM.href(p.url) + '">' + p.n + '</a></h3><p class="lm-card-d">' + p.inc + '</p><div class="lm-card-f">' + LM.precio({ p: p.p, r: p.r }, { desde: true }) + '</div></div></article>';
  }).join('');
  // 29/10 · Texto SEO de la categoría en acordeón (A y B): el texto de WooCommerce no se toca;
  // solo se agrupa cada apartado (h3 + lo que le sigue) en un desplegable abierto, en dos columnas
  (function () {
    var seo = $('.lm-seo-content'); if (!seo) return;
    var head = document.createElement('div'); head.className = 'lm-seo-head';
    var acc = document.createElement('div'); acc.className = 'lm-faqs';
    var cur = null;
    Array.prototype.slice.call(seo.childNodes).forEach(function (n) {
      if (n.nodeType === 1 && n.tagName === 'H3') {
        cur = document.createElement('details'); cur.className = 'lm-faq'; cur.open = true;
        var sm = document.createElement('summary'); sm.appendChild(n); sm.insertAdjacentHTML('beforeend', LM.ico('down'));
        var body = document.createElement('div'); body.className = 'lm-faq-a';
        cur.appendChild(sm); cur.appendChild(body); acc.appendChild(cur);
      } else if (cur) cur.lastChild.appendChild(n);
      else head.appendChild(n);
    });
    seo.appendChild(head); seo.appendChild(acc);
  })();

  var f = LM.faqs(); $('#c-faq').innerHTML = LM.faqHTML([f[6], f[0], f[3], f[5], f[1]]);

  render();
  LM.track('view_item_list', { item_list_name: 'colchones', items: LM.ORDEN.map(function (k) { return { item_id: P[k].id, item_name: P[k].titulo }; }) });
  LM.fill(document);
})();
