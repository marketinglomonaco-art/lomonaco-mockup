/* LO MONACO · Fichas de canapé, bases y complementos (Paco, 12/11).
   Los datos salen de comun/tienda.js (los de la web actual: precios, medidas, colores, fotos y textos).
   Cada tipo de producto lleva sus módulos propios, que hacen el papel de los del colchón:
   - Canapé: Ábrelo (visor 3D) · Ventajas · ¿Qué te cabe? · Tapa entera o partida · Montaje · Medidas y ficha técnica.
   - Bases: Cómo está hecha · Ventajas · Pasa el robot · Elige color · Montaje · Ficha técnica.
   - Complementos: Ventajas · En detalle · ¿Qué medida necesito? · De regalo en los packs · Cuidados.
   El body lleva data-tienda="canape" (o baseTela, base3d, almLatex, almVisco, edredon, bajera). */
(function () {
  'use strict';
  // Ficha de pack (body[data-pk]): debajo de la caja de compra van «Qué te llevas» y los módulos de su canapé o su base
  var PKD = LM.TIENDA && LM.TIENDA.packs[document.body.getAttribute('data-pk')];
  var K = document.body.getAttribute('data-tienda') || (PKD ? (PKD.base === 'canape' ? 'canape' : 'base3d') : null);
  if (!K || !LM.TIENDA || !LM.TIENDA[K]) return;
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, P = LM.TIENDA[K], TIPO = P.tipo;
  var root = $('#tf');
  if (PKD) { root = document.createElement('div'); root.id = 'tf'; root.className = 'tf-enpack'; $('.p-top').insertAdjacentElement('afterend', root); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var img = LM.tfImg;

  /* ---------- medidas ---------- */
  function orden(a, b) {
    var x = a.match(/(\d+)(?:x(\d+))?/), y = b.match(/(\d+)(?:x(\d+))?/);
    return (+x[1] - +y[1]) || ((+x[2] || 0) - (+y[2] || 0)) || (a.length - b.length);
  }
  var MED = Object.keys(P.tabla).sort(orden);
  function lbl(m) {
    if (/\|/.test(m)) { var p = m.split('|'); return p[0].replace('x', ' × ') + ' cm'; }
    if (/ cm$/.test(m)) return m;
    var b = m.replace('-2p', ''), a = b.split('x');
    return a[0] + ' × ' + a[1] + ' cm' + (/-2p$/.test(m) ? ' (2 partes)' : '');
  }
  function corto(m) {
    if (/\|/.test(m)) return m.split('|')[0].replace('x', '×');
    if (/ cm$/.test(m)) return m;
    return m.replace('-2p', '').replace('x', '×') + (/-2p$/.test(m) ? '·2p' : '');
  }
  function sub(m) { return /\|/.test(m) ? 'Para ' + m.split('|')[1] : ''; }
  function partes(m) { if (!/-2p$/.test(m)) return 0; return +m.split('x')[0] / 2; }

  /* ---------- estado ---------- */
  var q = new URLSearchParams(location.search);
  var COLS = P.colores || null;
  function colorDe(k) { return COLS && COLS.filter(function (c) { return c.k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-') === String(k || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'); })[0]; }
  var st = { color: COLS ? ((colorDe(q.get('color')) || colorDe(P.colorDef) || COLS[0]).k) : '-', medida: null };
  // Medida: la de la URL, la que el cliente ya eligió en otra ficha o la de por defecto (150 × 190)
  var pedida = q.get('medida') || LM.medidaInicial();
  st.medida = MED.filter(function (m) { return m === pedida || m.replace('-2p', '') === pedida; })[0] ||
    (P.k === 'almLatex' || P.k === 'almVisco' ? '90 cm' : P.k === 'edredon' ? MED[3] : MED.filter(function (m) { return m === C.medidaInicial.v; })[0]) || MED[0];
  function deMedida(x) { return MED.filter(function (m) { return m === x; })[0] || MED.filter(function (m) { return m.replace('-2p', '') === String(x).replace('-2p', ''); })[0] || st.medida; }
  if (PKD && LM.packEstado) { var pe = LM.packEstado(); st.color = pe.color; st.medida = deMedida(pe.medida + (pe.partes ? '-2p' : '')); }
  // La medida y el color pueden cambiar desde la caja de compra (de esta ficha o del pack)
  document.addEventListener('tf:medida', function (e) { st.medida = deMedida(e.detail); });
  document.addEventListener('tf:color', function (e) { if (COLS && COLS.some(function (c) { return c.k === e.detail; })) st.color = e.detail; });
  function fila(m, c) { var t = P.tabla[m] || {}; return t[c || st.color] || t['-'] || t[Object.keys(t)[0]]; }
  function actual() { return fila(st.medida); }
  function tablaSel() {
    var o = {}; MED.forEach(function (m) { var d = fila(m); if (d) o[m] = { id: d.id, p: d.p, r: d.r, s: true }; }); return o;
  }
  function colorObj() { return COLS ? COLS.filter(function (c) { return c.k === st.color; })[0] : null; }
  function fotos() { var c = colorObj(); return c ? c.fotos : P.fotos; }

  var CAT = { canape: ['Canapés', 'canape.html'], bases: ['Bases', 'bases.html'], almohadas: ['Almohadas', 'almohadas.html'], otros: ['Complementos', 'otros.html'] }[P.cat];
  var garantia = P.garantiaNota ? LM.mark({ estado: 'confirmar', nota: P.garantiaNota }, P.garantia) : LM.mark({ estado: 'confirmar', nota: 'Garantía que pone la web actual en esta ficha' }, P.garantia);
  var facts = {
    baseTela: ['Bastidor de madera maciza', 'Tejido AirFresh', '4 colores'],
    base3d: ['Tejido 3D antideslizante', '5 barras de acero', 'Patas incluidas'],
    almLatex: ['100% látex', 'Firmeza media', '4 largos'],
    almVisco: ['Viscoelástica', 'Desenfundable', '4 largos'],
    edredon: ['Dos capas', 'Hipoalergénico', 'Lavable'],
    bajera: ['Tencel®', 'Impermeable', 'Transpirable']
  }[K] || [];
  if (K === 'canape') facts = ['Arcón de ' + P.cotas.fondo + ' cm de fondo', P.cotas.alto + ' cm de alto', '4 acabados de madera'];

  /* =======================================================================
     Caja de compra
     ======================================================================= */
  var esMueble = TIPO === 'canape' || TIPO === 'base';
  if (PKD) root.innerHTML = '<div id="tf-mods"></div>';
  else {
  root.innerHTML =
    '<section class="p-top tf-top" aria-label="Comprar ' + esc(P.nombre) + '"><div class="p-top-in">' +
      '<div class="p-gal" data-testid="gallery"><div class="p-gal-track" id="tf-gal" tabindex="0" aria-label="Fotos"></div><p class="p-gal-count" id="tf-gal-count" aria-hidden="true"></p></div>' +
      '<div class="p-buy lm-buy" id="p-buy" data-testid="buy-box">' +
        // Paco, 12/11: migas dentro de la caja de compra, encima del título (como en la ficha de colchón)
        '<nav class="c-crumbs p-crumbs p-crumbs--box" aria-label="Estás aquí"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><a href="' + CAT[1] + '">' + CAT[0] + '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(P.nombre) + '</span></nav>' +
        '<div class="p-buy-head">' + (P.para ? '<span class="lm-pill lm-pill--soft">' + esc(P.para) + '</span>' : '') +
          '<h1 class="p-h1">' + esc(P.nombre) + '</h1><p>' + LM.rating() + '</p></div>' +
        '<p class="p-vp">' + esc(P.lema) + '</p>' +
        '<ul class="p-facts">' + facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<div class="p-price" id="tf-price" aria-live="polite"></div>' +
        (COLS ? '<fieldset class="tf-cols"><legend>' + esc(P.colorLabel) + ': <b id="tf-col-n">' + esc(st.color) + '</b></legend><div class="tf-sw" role="radiogroup" aria-label="' + esc(P.colorLabel) + '">' +
          COLS.map(function (c) { return '<button type="button" role="radio" class="tf-sw-b" data-col="' + esc(c.k) + '" aria-checked="' + (c.k === st.color) + '" aria-label="' + esc(c.k) + '" title="' + esc(c.k) + '"><img src="../img/tienda/' + c.sw + '-700.webp" alt="" width="56" height="56" loading="lazy"></button>'; }).join('') +
          '</div></fieldset>' : '') +
        '<div class="tf-size" id="tf-size" data-testid="size-selector"></div>' +
        '<p class="tf-partes" id="tf-partes" hidden></p>' +
        (P.nota ? '<p class="tf-nota">' + LM.ico('info') + esc(P.nota) + '</p>' : '') +
        '<button class="lm-btn lm-btn--buy lm-btn--full p-cta" type="button" id="p-cta" data-testid="add-to-cart">Añadir al carrito</button>' +
        '<div class="p-call">' + LM.llamar('ficha-' + K) + '</div>' +
        '<ul class="lm-trust tf-trust">' +
          '<li>' + LM.ico('truck') + '<span>' + (esMueble ? LM.c('envio') + '. ' + esc(P.entrega) + '.' : 'Te llega en ' + LM.c('entrega') + '. ' + LM.c('envio') + '.') + '</span></li>' +
          '<li>' + LM.ico('shield') + '<span>' + garantia + ' de garantía.</span></li>' +
          (esMueble ? '<li>' + LM.ico('back') + '<span>¿Tienes uno viejo? Nos lo llevamos: lo eliges al finalizar la compra.</span></li>' : '') +
          '<li>' + LM.ico('card') + '<span id="tf-cuota">Paga a plazos de 3 a 36 meses.</span></li>' +
        '</ul>' +
        // Paco, 12/11 (CRO): en el canapé, lo que te cabe en la medida elegida, junto al botón de compra
        (TIPO === 'canape' ? '<a class="tf-cabe-mini" id="tf-cabe-mini" href="#cabe"></a>' : '') +
      '</div></div></section>' +
    '<div id="tf-mods"></div>';

  /* Galería: la grande + el resto (en el móvil, carrusel) */
  var gal = $('#tf-gal');
  // Paco, 12/11: siempre 5 fotos a la vista (la grande + 4). Si faltan, se repiten; si sobran, «Ver más fotos»
  LM.cincoFotos = function (f) { var o = f.slice(); for (var i = 0; o.length < 5 && f.length; i++) o.push(f[i % f.length]); return o; };
  function pintarGaleria() {
    var f = LM.cincoFotos(fotos());
    var b = gal.nextElementSibling; if (b && b.classList.contains('p-gal-mas')) b.remove();
    gal.classList.remove('is-todas');
    if (f.length > 5) {
      gal.insertAdjacentHTML('afterend', '<button type="button" class="p-gal-mas" aria-expanded="false">Ver más fotos (' + (f.length - 5) + ')</button>');
      gal.nextElementSibling.addEventListener('click', function () { var on = gal.classList.toggle('is-todas'); this.setAttribute('aria-expanded', on); this.textContent = on ? 'Ver menos fotos' : 'Ver más fotos (' + (f.length - 5) + ')'; });
    }
    gal.innerHTML = f.map(function (n, i) { return '<figure' + (i ? (i >= 5 ? ' class="is-mas"' : '') : ' class="is-main is-square"') + '>' + img(n, { alt: P.nombre + (COLS ? ', acabado ' + st.color : '') + ' (foto ' + (i + 1) + ')', eager: !i, sizes: i ? '(max-width: 900px) 100vw, 32vw' : '(max-width: 900px) 100vw, 64vw' }) + '</figure>'; }).join('');
    $('#tf-gal-count').textContent = '1 / ' + f.length;
  }
  gal.addEventListener('scroll', function () { $('#tf-gal-count').textContent = (Math.round(gal.scrollLeft / (gal.clientWidth || 1)) + 1) + ' / ' + LM.cincoFotos(fotos()).length; }, { passive: true });

  function pintarPrecio() {
    var d = actual();
    $('#tf-price').innerHTML = d ? LM.precio(d, { cls: 'lm-price--big', cuota: false }).replace('<div class="lm-price-row">', '<div class="lm-price-for">Precio para <b>' + esc(lbl(st.medida)) + '</b>' + (sub(st.medida) ? ' · ' + esc(sub(st.medida)) : '') + '</div><div class="lm-price-row">') : '';
    $('#p-cta').textContent = 'Añadir al carrito · ' + (d ? LM.eur(d.p) : '');
    var cb = d && LM.cuotaBaja(d.p);
    $('#tf-cuota').innerHTML = cb ? 'O desde ' + LM.cuotaBajaFrase(d.p) + '.' : 'Paga con tarjeta, Bizum o transferencia.';
    var pt = partes(st.medida), np = $('#tf-partes');
    np.hidden = !pt;
    if (pt) np.innerHTML = LM.ico('info') + (TIPO === 'canape' ? 'Esta medida lleva la <b>tapa partida</b>: 2 partes de ' + pt + ' cm.' : 'Esta medida viene en <b>2 partes de ' + pt + ' cm</b>.');
    var sm = $('#p-stick-m'), sp = $('#p-stick-p');
    if (sm) sm.textContent = (COLS ? st.color + ' · ' : '') + lbl(st.medida);
    if (sp) sp.textContent = d ? LM.eur(d.p) : '';
    LM.fill($('#tf-price'));
  }
  var sel = LM.selector($('#tf-size'), {
    medida: st.medida, medidas: MED, label: lbl, corto: corto, ayuda: false, def: MED.filter(function (m) { return m === C.medidaInicial.v; })[0],
    titulo: P.medidaLabel ? 'Elige el ' + P.medidaLabel.toLowerCase() : 'Elige tu medida',
    tabla: tablaSel, onChange: function (m) { st.medida = m; pintarPrecio(); document.dispatchEvent(new CustomEvent('tf:medida', { detail: m })); }
  });
  function ponerColor(k, src) {
    if (!COLS || k === st.color) return;
    st.color = k;
    $$('.tf-sw-b').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-col') === k); });
    $('#tf-col-n').textContent = k;
    pintarGaleria(); sel.refresh(); pintarPrecio();
    history.replaceState(null, '', '?color=' + encodeURIComponent(k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')));
    document.dispatchEvent(new CustomEvent('tf:color', { detail: k }));
    LM.track('select_item', { item_id: P.pid, item_variant: k, source: src || 'ficha' });
  }
  LM.tfColor = ponerColor;
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-col]'); if (b) ponerColor(b.getAttribute('data-col'), b.getAttribute('data-src') || 'ficha');
  });

  function comprar(src) {
    var d = actual(); if (!d) return;
    var c = colorObj();
    LM.cart.add({ id: d.id, pid: P.pid, k: K, tipo: TIPO, nombre: P.nombre, medida: st.medida.replace('-2p', '').split('|')[0].replace(' cm', ''),
      vtxt: lbl(st.medida) + (sub(st.medida) ? ' · ' + sub(st.medida) : ''), color: COLS ? st.color : '', precio: d.p, ref: d.r,
      img: '../img/tienda/' + (c ? c.fotos[0] : P.fotos[0]) + '-700.webp', url: P.pagina + (COLS ? '?color=' + encodeURIComponent(st.color) : ''), regalos: [] }, src);
  }
  $('#p-cta').addEventListener('click', function () { comprar('main'); });

  /* Barra fija cuando el botón principal sale de la pantalla */
  document.body.insertAdjacentHTML('beforeend', '<div class="lm-stick" id="p-stick" aria-hidden="true"><div class="lm-stick-t"><small id="p-stick-m"></small><b id="p-stick-p"></b></div>' +
    '<button class="lm-btn lm-btn--buy" type="button" id="p-stick-cta" tabindex="-1">Añadir</button></div>');
  $('#p-stick-cta').addEventListener('click', function () { comprar('sticky'); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) {
    var off = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
    $('#p-stick').classList.toggle('is-on', off); $('#p-stick').setAttribute('aria-hidden', !off);
    $('#p-stick-cta').tabIndex = off ? 0 : -1; document.body.classList.toggle('lm-has-stick', off);
  }).observe($('#p-cta'));

  pintarGaleria(); pintarPrecio();
  }

  /* =======================================================================
     Módulos
     ======================================================================= */
  var mods = $('#tf-mods'), H = [];
  function sec(id, cls, eyebrow, titulo, cuerpo, o) {
    o = o || {};
    return '<section class="lm-sec tf-sec ' + (cls || '') + '" id="' + id + '" aria-labelledby="' + id + '-t"><div class="lm-w">' +
      '<div class="tf-head"><p class="lm-eyebrow">' + eyebrow + '</p><h2 class="lm-h2" id="' + id + '-t">' + titulo + '</h2>' + (o.sub ? '<p class="lm-sub">' + o.sub + '</p>' : '') + '</div>' +
      cuerpo + '</div></section>';
  }
  function ventajas(titulo) {
    return sec('ventajas', 'p-ben', 'Por qué elegirlo', titulo,
      '<ul class="p-ben-grid tf-ben">' + P.ventajas.map(function (b) { return '<li><span class="h-ic">' + LM.ico(b[0]) + '</span><b>' + esc(b[1]) + '</b><p>' + esc(b[2]) + '</p></li>'; }).join('') + '</ul>');
  }
  function detalle(titulo) {
    return sec('detalle', 'lm-alt tf-det', 'En detalle', titulo,
      '<div class="tf-det-g">' + P.detalle.map(function (d) { return '<article><h3>' + esc(d[0]) + '</h3><p>' + esc(d[1]) + '</p></article>'; }).join('') + '</div>' +
      (P.lista ? '<ul class="tf-lista">' + P.lista.map(function (x) { return '<li>' + LM.ico('check') + esc(x) + '</li>'; }).join('') + '</ul>' : ''));
  }
  function packsCon(filtro) {
    return Object.keys(LM.TIENDA.packs).map(function (k) { return LM.TIENDA.packs[k]; }).filter(filtro);
  }
  var desdePack = LM.desdePack;
  function opiniones() {
    var r = LM.RESENAS.slice(0, 3);
    if (K === 'canape') r = [{ t: null, f: '27 oct 2025', x: 'Todo perfecto. El canapé abatible es sólido, cómodo y la entrega rápida, menos de 15 días. Muy contenta.' }].concat(LM.RESENAS.slice(0, 2));
    return sec('opiniones', 'p-revs', 'Opiniones verificadas', 'Lo que dicen <em>nuestros clientes.</em>', '<div class="p-rev-grid">' + r.map(LM.resena).join('') + '</div>', { sub: LM.rating() });
  }
  function faq(list) {
    return sec('dudas', 'lm-alt p-faq', 'Preguntas frecuentes', 'Las dudas <em>que más nos preguntan.</em>',
      '<div class="lm-faqs">' + LM.faqHTML(list) + '</div><div class="tf-faq-call">' + LM.llamar('faq-' + K) + '</div>');
  }
  function ficha(filas, extra) {
    return sec('ficha', 'p-tech', 'Ficha técnica', 'Los datos, <em>uno a uno.</em>',
      (extra || '') + '<dl class="p-tech-dl">' + filas.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' +
      (P.mant ? '<div class="tf-mant"><h3>Cuidados</h3><ul>' + P.mant.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : ''));
  }
  var medidasTxt = MED.map(function (m) { return lbl(m).replace(' (2 partes)', ''); }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' · ');

  /* ---------------- CANAPÉ ---------------- */
  if (TIPO === 'canape') {
    var CT = P.cotas;
    H.push(ventajas('Las ventajas del <em>canapé abatible.</em>'));
    H.push(sec('cabe', 'lm-alt tf-cabe-sec', 'Almacenaje', '¿Qué te <em>cabe dentro?</em>',
      '<div class="tf-cabe"><div class="tf-cabe-m" role="radiogroup" aria-label="Medida del canapé" id="tf-cabe-m"></div>' +
      '<div class="tf-cabe-r" id="tf-cabe-r" aria-live="polite"></div>' +
      '<figure class="tf-cabe-f tf-cad" id="tf-cad"></figure></div>',
      { sub: 'Elige la medida y te decimos cuánto espacio tienes debajo de la cama.' }));
    H.push(sec('tapa', 'tf-tapa-sec', 'Tapa entera o partida', 'Las medidas grandes, <em>en dos partes.</em>',
      '<div class="tf-tapa"><figure><svg viewBox="0 0 220 260" aria-hidden="true"><rect x="40" y="20" width="150" height="190" rx="10" class="tf-tapa-b"/><rect x="48" y="28" width="134" height="174" rx="6" class="tf-tapa-t"/><text x="115" y="240">150 × 190 cm</text></svg>' +
        '<figcaption><b>Tapa entera</b><span>Hasta 160 × 200 cm: la tapa es de una sola pieza.</span></figcaption></figure>' +
      '<figure><svg viewBox="0 0 220 260" aria-hidden="true"><rect x="20" y="20" width="180" height="190" rx="10" class="tf-tapa-b"/><rect x="28" y="28" width="80" height="174" rx="6" class="tf-tapa-t"/><rect x="112" y="28" width="80" height="174" rx="6" class="tf-tapa-t"/><text x="110" y="240">180 × 200 cm</text></svg>' +
        '<figcaption><b>Tapa partida</b><span>180 × 200 y 200 × 200 cm: dos tapas de 90 o 100 cm. Más fáciles de subir a casa y de montar.</span></figcaption></figure></div>'));
  }

  /* ---------------- BASES ---------------- */
  if (TIPO === 'base') {
    var N = P.capas.length;
    H.push(sec('hecha', 'tf-capas-sec', 'Por dentro', 'Así está <em>hecha.</em>',
      '<div class="tf-capas"><svg class="tf-capas-svg" viewBox="0 0 420 ' + (60 + N * 70) + '" role="img" aria-label="Capas de la ' + esc(P.nombre) + '">' +
        P.capas.map(function (c, i) {
          var y = 30 + i * 70, f = ['tf-cp1', 'tf-cp2', 'tf-cp3', 'tf-cp4'][i];
          if (/barras/.test(c[0])) return '<g class="tf-cp ' + f + '">' + [0, 1, 2, 3, 4].map(function (k) { var x = 80 + k * 50; return '<path d="M' + x + ' ' + (y + 18) + 'L' + (x + 100) + ' ' + (y - 2) + '" stroke-width="7" stroke-linecap="round"/>'; }).join('') + '</g>';
          if (/Patas/.test(c[0])) return '<g class="tf-cp ' + f + '"><path d="M120 ' + (y + 6) + 'v34M300 ' + (y + 6) + 'v34M170 ' + (y - 4) + 'v34M350 ' + (y - 4) + 'v34" stroke-width="9" stroke-linecap="round"/></g>';
          return '<path class="tf-cp ' + f + '" d="M60 ' + (y + 20) + 'L160 ' + y + 'H400L300 ' + (y + 20) + 'Z"/><path class="tf-cp-e ' + f + '" d="M60 ' + (y + 20) + 'v10H300v-10M300 ' + (y + 30) + 'L400 ' + (y + 10) + 'V' + y + '"/>';
        }).join('') + '</svg>' +
      '<ol class="tf-capas-l">' + P.capas.map(function (c) { return '<li><b>' + esc(c[0]) + '</b><span>' + esc(c[1]) + '</span></li>'; }).join('') + '</ol></div>'));
    H.push(ventajas('Las ventajas de la <em>' + esc(P.corto.toLowerCase()) + '.</em>'));
    H.push(sec('robot', 'lm-alt tf-robot-sec', 'Limpieza fácil', 'Pasa el robot <em>por debajo.</em>',
      '<div class="tf-robot"><svg viewBox="0 0 720 260" role="img" aria-label="Base de perfil con un robot aspirador pasando por debajo">' +
        '<rect x="70" y="40" width="500" height="44" rx="8" class="tf-rb-col"/><rect x="60" y="84" width="520" height="34" rx="6" class="tf-rb-base"/>' +
        '<path d="M90 118v100M550 118v100" class="tf-rb-pata"/><path d="M20 218H620" class="tf-rb-suelo"/>' +
        '<g class="tf-rb-robot"><rect x="250" y="186" width="130" height="30" rx="15"/><circle cx="315" cy="195" r="4"/></g>' +
        '<path d="M600 118v100" class="tf-rb-cota"/><path d="M594 118h12M594 218h12" class="tf-rb-cota"/>' +
        '<text x="618" y="175" class="tf-rb-t">' + (P.patas ? P.patas + ' cm' : '') + '</text></svg>' +
      '<div><p>' + (P.patas ? 'Sus patas dejan ' + LM.mark({ estado: 'confirmar', nota: P.patasNota }, P.patas + ' cm') + ' libres bajo la base.' : 'Está elevada sobre patas, a una altura pensada para que pase el robot de limpieza. ' + LM.pend('altura libre bajo la base de tela')) +
        ' La mayoría de robots aspiradores miden menos de 10 cm de alto: pasan por debajo sin problema.</p>' +
        '<p>Y como el aire circula, el colchón se mantiene más fresco y seco.</p></div></div>'));
  }

  /* ---------------- CANAPÉ y BASES: montaje, ficha, combina ---------------- */
  if (esMueble) {
    if (TIPO === 'canape') {
      H.push(sec('montaje', 'lm-alt tf-mont-sec', 'Montaje', 'Te ayudamos <em>a que lo montes.</em>',
        '<div class="tf-mont" id="tf-mont">' +
          '<div class="tf-mont-tabs" role="tablist"><button role="tab" type="button" data-v="normal" aria-selected="true">Tapa entera</button><button role="tab" type="button" data-v="partida" aria-selected="false">Tapa partida (180 y 200)</button></div>' +
          '<div class="tf-mont-g"><figure class="tf-mont-f"><img id="tf-mont-img" src="../img/montaje/canape-normal-03.webp" alt="" width="900" height="1270" loading="lazy">' +
            '<div class="tf-mont-nav"><button type="button" data-paso="-1" aria-label="Paso anterior">' + LM.ico('back') + '</button><span id="tf-mont-n">Hoja 1 de 12</span><button type="button" data-paso="1" aria-label="Paso siguiente">' + LM.ico('right') + '</button></div></figure>' +
          '<div class="tf-mont-info"><h3>Antes de empezar</h3><ul class="tf-lista">' +
            '<li>' + LM.ico('check') + 'Incluido: llave fija n.º 13 y llave Allen.</li>' +
            '<li>' + LM.ico('tool') + 'No incluido: un destornillador plano o de estrella.</li>' +
            '<li>' + LM.ico('couple') + 'Mejor entre dos personas: las piezas pesan.</li>' +
            '<li>' + LM.ico('home') + 'Monta sobre una alfombra o un cartón para no rayar la madera.</li>' +
            '<li>' + LM.ico('info') + 'Atornilla sin llegar al máximo y aprieta del todo al final.</li>' +
            '<li>' + LM.ico('lift') + 'Para apretar los herrajes, sube la tapa a media altura.</li></ul>' +
            '<div class="tf-mont-pdf"><a class="lm-btn lm-btn--line" href="../img/montaje/instrucciones-canape-abatible.pdf" target="_blank" rel="noopener">' + LM.ico('pdf') + 'Instrucciones tapa entera (PDF)</a>' +
            '<a class="lm-btn lm-btn--line" href="../img/montaje/instrucciones-canape-abatible-tapa-partida.pdf" target="_blank" rel="noopener">' + LM.ico('pdf') + 'Instrucciones tapa partida (PDF)</a></div>' +
            '<p class="tf-mont-dudas">¿Dudas con el montaje? Escríbenos a <a href="mailto:gestion@lomonaco.es">gestion@lomonaco.es</a> o llámanos al <a href="tel:' + C.telefono.tel + '" data-lead="montaje">' + LM.mark(C.telefono, C.telefono.v) + '</a>.</p>' +
          '</div></div></div>', { sub: 'Paso a paso, con las instrucciones oficiales. Y si te atascas, te ayudamos por teléfono o por email.' }));
    }
    var filas = TIPO === 'canape' ? [
      ['Alto', LM.mark({ estado: 'confirmar', nota: 'Plano de medidas de la web actual' }, P.cotas.alto + ' cm')], ['Fondo del arcón', P.cotas.fondo + ' cm'], ['Altura con la tapa abierta', P.cotas.apertura + ' cm'],
      ['Acabados', 'Blanco, Nórdico, Roble y Nogal'], ['Apertura', 'Abatible, con frenos de seguridad'], ['Tapa', 'Antideslizante. Partida en 180 × 200 y 200 × 200 cm'],
      ['Material', 'Madera de alta calidad'], ['Medidas', medidasTxt], ['Montaje', 'Lo montas tú, con las instrucciones paso a paso de esta página'], ['Garantía', garantia], ['Entrega', esc(P.entrega)], ['Retirada del viejo', 'Base o canapé: 49,01 €. Base y colchón: 89 €. Se retira la base si está desmontada.']
    // Paco, 12/11 (cambio 26): en las bases, los datos en el mismo orden que la ficha técnica de los packs:
    // modelo y altura, después los materiales, y al final medidas, garantía, entrega y retirada
    ] : K === 'base3d' ? [
      ['Modelo', esc(P.nombre || P.titulo)], ['Altura de las patas', LM.mark({ estado: 'confirmar', nota: P.patasNota }, P.patas + ' cm')], ['Tejido', 'Airflow® 3D antideslizante, con microceldas tridimensionales'],
      ['Tablero', 'Reforzado, de 8 mm'], ['Refuerzo', '5 barras transversales de acero de 30 × 30 mm'], ['Patas', 'De madera wengué, incluidas'],
      ['Colores', 'Chocolate y Blanco'], ['Medidas', medidasTxt], ['En 2 partes', '160, 180 y 200 cm de ancho'],
      ['Garantía', garantia], ['Entrega', esc(P.entrega)], ['Retirada del viejo', 'Base o canapé: 49,01 €. Base y colchón: 89 €.']
    ] : [
      ['Modelo', esc(P.nombre || P.titulo)], ['Patas', LM.pend('altura de las patas')], ['Tejido', 'Tapizado AirFresh, transpirable'],
      ['Estructura', 'Bastidor de madera maciza'], ['Colores', 'Beige, Gris Claro, Chocolate y Antracita'], ['Medidas', medidasTxt],
      ['En 2 partes', '160, 180 y 200 cm de ancho'], ['Garantía', garantia], ['Entrega', esc(P.entrega)], ['Retirada del viejo', 'Base o canapé: 49,01 €. Base y colchón: 89 €.']
    ];
    H.push(ficha(filas, TIPO === 'canape' ? '<figure class="tf-plano">' + img(P.medidasImg, { alt: 'Plano del canapé: 32 cm de alto, 28 cm de fondo y 103 cm con la tapa abierta' }) + '</figure>' : ''));
    H.push(detalle(TIPO === 'canape' ? 'Pensado para <em>durar.</em>' : 'Calidad que <em>se nota.</em>'));
    H.push(opiniones());
    var F = TIPO === 'canape' ? [
      ['¿Cuánto cabe dentro?', 'El arcón tiene ' + P.cotas.fondo + ' cm de fondo en toda la superficie de la cama. En la sección «¿Qué te cabe dentro?» calculas el espacio para tu medida.'],
      ['¿Cómo se monta?', 'Con las instrucciones paso a paso de esta página (tapa entera o partida, según la medida). Si tienes dudas, escríbenos a gestion@lomonaco.es o llámanos y te ayudamos.'],
      ['¿Qué medidas llevan la tapa partida?', 'La 180 × 200 y la 200 × 200 cm: la tapa viene en dos partes de 90 o 100 cm.'],
      ['¿Cuánto mide con la tapa abierta?', P.cotas.apertura + ' cm de alto. Cerrado mide ' + P.cotas.alto + ' cm.'],
      ['¿Os lleváis mi canapé viejo?', 'Sí. La retirada de tu base o canapé antiguo cuesta 49,01 € y la de base y colchón, 89 €. Lo eliges al finalizar la compra. La base solo se retira si está desmontada.'],
      ['¿Cómo lo limpio?', 'Con un paño un poco húmedo, solo con agua. Sin jabón ni otros productos.']
    ] : [
      ['¿Vale para cualquier colchón?', 'Sí. Es compatible con cualquier colchón y reparte el peso por igual.'],
      ['¿Qué medidas vienen en dos partes?', 'Las de 160, 180 y 200 cm de ancho vienen en dos piezas: más fáciles de subir a casa.'],
      ['¿Pasa el robot aspirador por debajo?', 'Sí. Está elevada sobre patas para que el robot de limpieza pase por debajo.'],
      ['¿Os lleváis mi base vieja?', 'Sí. La retirada de tu base o canapé antiguo cuesta 49,01 € y la de base y colchón, 89 €. Lo eliges al finalizar la compra. La base solo se retira si está desmontada.'],
      ['¿Cómo la limpio?', 'Con un paño un poco húmedo, solo con agua. Sin jabón ni otros productos.']
    ];
    H.push(faq(F));
  }

  /* ---------------- COMPLEMENTOS ---------------- */
  if (TIPO === 'complemento') {
    H.push(ventajas('Por qué te va a <em>gustar.</em>'));
    H.push(detalle('Hecho para <em>dormir mejor.</em>'));
    var guia = K === 'edredon' ? MED.map(function (m) { return [m.split('|')[0].replace('x', ' × ') + ' cm', 'Para ' + m.split('|')[1].replace('cama ', 'cama de ').replace(/-/g, ', ').replace(/, (\d+)$/, ' y $1') + ' cm']; })
      : K === 'bajera' ? [['La misma que tu colchón', 'Si tu colchón es de 150 × 190 cm, elige la bajera de 150 × 190 cm.'], ['¿Colchón de 135 × 180?', 'Elige la de 135 × 182 cm.']]
      : [['70 y 75 cm', 'Almohada individual: para camas individuales, o dos en una cama de matrimonio'], ['90 cm', 'Para camas individuales'], ['135 cm', 'Una para los dos, en camas de matrimonio']];
    H.push(sec('medida', 'tf-guia-sec', '¿Qué medida necesito?', K === 'edredon' ? 'Cada medida, <em>para su cama.</em>' : K === 'bajera' ? 'La de <em>tu colchón.</em>' : 'Elige el largo <em>según tu cama.</em>',
      '<dl class="tf-guia">' + guia.map(function (g) { return '<div><dt>' + g[0] + '</dt><dd>' + g[1] + '</dd></div>'; }).join('') + '</dl>'));
    if (P.mant) H.push(sec('cuidados', 'tf-cuid-sec', 'Cuidados', 'Para que te dure <em>muchos años.</em>', '<ul class="tf-lista">' + P.mant.map(function (x) { return '<li>' + LM.ico('check') + esc(x) + '</li>'; }).join('') + '</ul>'));
    H.push(opiniones());
  }

  /* Paco, 12/11: orden de los módulos de cada ficha */
  var ORDEN = PKD ? (TIPO === 'canape' ? ['cabe', 'ventajas', 'tapa', 'montaje'] : ['ventajas', 'robot', 'hecha'])
    : TIPO === 'canape' ? ['cabe', 'ficha', 'ventajas', 'tapa', 'montaje', 'detalle', 'opiniones', 'dudas']
    : TIPO === 'base' ? ['ventajas', 'robot', 'hecha', 'ficha', 'detalle', 'opiniones', 'dudas']
    : ['ventajas', 'detalle', 'medida', 'cuidados', 'opiniones'];
  var porId = {}; H.forEach(function (h) { var m = h.match(/ id="([\w-]+)"/); if (m) porId[m[1]] = h; });
  H = ORDEN.filter(function (k) { return porId[k]; }).map(function (k) { return porId[k]; });
  if (PKD) {
    H = H
      .map(function (h) { return h.replace('Las ventajas del <em>canapé abatible.</em>', 'Las ventajas <em>de tu canapé.</em>').replace(/Las ventajas de la <em>[^<]*<\/em>/, 'Las ventajas <em>de tu base.</em>'); });
    // Paco, 12/11: «Qué te llevas» va dentro de la caja de compra (comun/pack.js), ya no como módulo aparte
  }
  mods.innerHTML = H.join('');
  LM.fill(mods);

  /* ---------- ¿Qué te cabe? (canapé) ---------- */
  if (TIPO === 'canape') {
    var cm = $('#tf-cabe-m'), cr = $('#tf-cabe-r'), MC = MED.slice();
    /* Plano estilo CAD (Paco, 12/11): vista frontal cerrada y vista lateral con la tapa abierta, en granate LM */
    function cad(m) {
      var a = m.replace('-2p', '').split('x'), W = +a[0], L = +a[1], H = P.cotas.alto, F = P.cotas.fondo, A = P.cotas.apertura, mv = matchMedia('(max-width: 700px)').matches, k = mv ? 1.25 : 1.3, CX = mv ? 160 : 145; cad.m = m; // móvil: vistas una encima de otra
      var t = function (x, y, txt, cls, rot) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" class="' + (cls || 'cad-t') + '"' + (rot ? ' transform="rotate(-90 ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"' : '') + '>' + txt + '</text>'; };
      var cotaH = function (x1, x2, y, txt) { return '<path class="cad-c" d="M' + x1 + ' ' + (y - 6) + 'V' + (y + 6) + 'M' + x2 + ' ' + (y - 6) + 'V' + (y + 6) + 'M' + x1 + ' ' + y + 'H' + x2 + 'M' + (x1 - 4) + ' ' + (y + 4) + 'l8 -8M' + (x2 - 4) + ' ' + (y + 4) + 'l8 -8"/>' + t((x1 + x2) / 2, y + 17, txt); };
      var cotaV = function (x, y1, y2, txt, izq) { return '<path class="cad-c" d="M' + (x - 6) + ' ' + y1 + 'H' + (x + 6) + 'M' + (x - 6) + ' ' + y2 + 'H' + (x + 6) + 'M' + x + ' ' + y1 + 'V' + y2 + 'M' + (x - 4) + ' ' + (y1 + 4) + 'l8 -8M' + (x - 4) + ' ' + (y2 + 4) + 'l8 -8"/>' + t(x + (izq ? -11 : 13), (y1 + y2) / 2, txt, 'cad-t', true); };
      // Vista frontal (arriba): cerrado, ancho × alto, el arcón en discontinuo y la tapa partida si la lleva
      var G1 = mv ? 96 : 168, fw = W * k, fh = H * k, fx = CX - fw / 2, fy = G1 - fh;
      var front = '<path class="cad-s" d="M4 ' + G1 + (mv ? 'H326' : 'H696') + '"/><rect class="cad-o" x="' + fx + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" rx="3"/>' +
        '<path class="cad-l" d="M' + fx + ' ' + (fy + 6) + 'H' + (fx + fw) + '"/>' +
        '<rect class="cad-d" x="' + (fx + 7) + '" y="' + (fy + 10) + '" width="' + (fw - 14) + '" height="' + (F * k - 8) + '"/>' +
        (/-2p/.test(m) ? '<path class="cad-d" d="M' + CX + ' ' + fy + 'V' + (fy + 6) + '"/>' : '') +
        cotaH(fx, fx + fw, G1 + 20, W + ' cm') + cotaV(fx + fw + 20, G1, fy, H + ' cm') + t(CX, G1 + 56, 'VISTA FRONTAL', 'cad-v');
      // Vista lateral (abajo): la tapa abierta desde la cabecera, el fondo del arcón y la altura con la tapa abierta
      var C2 = mv ? 160 : 515, G2 = mv ? 318 : G1, sl = L * k, sh = H * k, sx = C2 - sl / 2 - 6, sy = G2 - sh;
      var ang = Math.asin(Math.min(.95, (A - H) / L)), hx = sx + 5, hy = sy, ex = hx + sl * Math.cos(ang), ey = G2 - A * k;
      var nx = Math.sin(ang) * 6, ny = Math.cos(ang) * 6;
      var lid = '<path class="cad-o" d="M' + hx + ' ' + hy + 'L' + ex.toFixed(1) + ' ' + ey.toFixed(1) + 'L' + (ex + nx).toFixed(1) + ' ' + (ey + ny).toFixed(1) + 'L' + (hx + nx).toFixed(1) + ' ' + (hy + ny).toFixed(1) + 'Z"/>';
      var px = function (u) { return [hx + sl * u * Math.cos(ang) + nx, hy - sl * u * Math.sin(ang) + ny]; }, p1 = px(.42), p2 = px(.6);
      var side = (mv ? '<path class="cad-s" d="M4 ' + G2 + 'H326"/>' : '') + '<rect class="cad-o" x="' + sx + '" y="' + sy + '" width="' + sl + '" height="' + sh + '" rx="3"/>' +
        '<rect class="cad-d" x="' + (sx + 7) + '" y="' + sy + '" width="' + (sl - 14) + '" height="' + (F * k) + '"/>' + lid +
        '<path class="cad-l" d="M' + (sx + sl * .30) + ' ' + (G2 - 7) + 'L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + 'M' + (sx + sl * .47) + ' ' + (G2 - 7) + 'L' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + '"/>' +
        cotaH(sx, sx + sl, G2 + 20, L + ' cm') + cotaV(sx - 18, sy, sy + F * k, F + ' cm', true) + cotaV(ex + 24, G2, ey, A + ' cm') + t(C2, G2 + 56, 'VISTA LATERAL · TAPA ABIERTA', 'cad-v');
      $('#tf-cad').innerHTML = '<svg viewBox="' + (mv ? '0 22 330 360' : '0 18 700 214') + '" role="img" aria-label="Plano del canapé de ' + W + ' × ' + L + ' cm: ' + H + ' cm de alto, arcón de ' + F + ' cm de fondo y ' + A + ' cm con la tapa abierta">' + front + side + '</svg>';
    }
    addEventListener('resize', function () { if (cad.m) cad(cad.m); });
    function cabe(m) {
      cad(m);
      var a = m.replace('-2p', '').split('x'), w = +a[0] - 4, l = +a[1] - 4, f = P.cotas.fondo;
      var litros = Math.round(w * l * f / 1000 / 10) * 10, maletas = Math.floor(w / 40) * Math.floor(l / 55);
      cm.innerHTML = MC.map(function (x) { return '<button type="button" role="radio" aria-checked="' + (x === m) + '" data-cabe="' + x + '">' + corto(x).replace('·2p', '') + '</button>'; }).join('');
      cr.innerHTML = '<p class="tf-cabe-big"><b>' + LM.mark({ estado: 'confirmar', nota: 'Cálculo aproximado: interior estimado con 2 cm de pared y 28 cm de fondo' }, 'unos ' + litros.toLocaleString('es-ES') + ' litros') + '</b></p>' +
        '<p>de espacio en un canapé de ' + lbl(m).replace(' (2 partes)', '') + ', con ' + f + ' cm de fondo.</p>' +
        '<ul class="tf-lista"><li>' + LM.ico('box') + 'Caben unas <b>' + maletas + ' maletas de cabina</b> tumbadas.</li><li>' + LM.ico('layers') + 'Mantas, edredones y ropa de otra temporada, a mano.</li></ul>';
    }
    cm.addEventListener('click', function (e) { var b = e.target.closest('[data-cabe]'); if (b) { cabe(b.getAttribute('data-cabe')); LM.track('canape_cabe', { medida: b.getAttribute('data-cabe') }); } });
    document.addEventListener('tf:medida', function () { cabe(st.medida); cabeMini(); });
    function cabeMini() {
      var el = $('#tf-cabe-mini'); if (!el) return;
      var a = st.medida.replace('-2p', '').split('x'), w = +a[0] - 4, l = +a[1] - 4, f = P.cotas.fondo;
      var litros = Math.round(w * l * f / 1000 / 10) * 10, maletas = Math.floor(w / 40) * Math.floor(l / 55);
      el.innerHTML = '<span class="tf-cabe-mini-i">' + LM.ico('box') + '</span><span><small>Lo que te cabe en ' + lbl(st.medida).replace(' (2 partes)', '') + '</small>' +
        '<b>' + LM.mark({ estado: 'confirmar', nota: 'Cálculo aproximado: interior estimado con 2 cm de pared y 28 cm de fondo' }, 'Unos ' + litros.toLocaleString('es-ES') + ' litros') + '</b>' +
        '<em>Caben unas ' + maletas + ' maletas de cabina tumbadas</em></span>' + LM.ico('right', 'tf-cabe-mini-go');
    }
    cabeMini();
    var cmi = $('#tf-cabe-mini');
    if (cmi) cmi.addEventListener('click', function (e) { var t = $('#cabe'); if (!t) return; e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); LM.track('canape_cabe_mini', { medida: st.medida }); });
    cabe(st.medida);

    /* Montaje: hojas de las instrucciones reales (p. 2 a 14 del PDF) */
    var mv = 'normal', mp = 0, HOJAS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    function hoja() {
      var n = HOJAS[mp];
      $('#tf-mont-img').src = '../img/montaje/canape-' + mv + '-' + (n < 10 ? '0' : '') + n + '.webp';
      $('#tf-mont-img').alt = 'Instrucciones de montaje del canapé, ' + (mv === 'normal' ? 'tapa entera' : 'tapa partida') + ': hoja ' + (mp + 1);
      $('#tf-mont-n').textContent = (mp === 0 ? 'Herramientas y consejos' : 'Hoja ' + (mp + 1) + ' de ' + HOJAS.length);
    }
    $('#tf-mont').addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) { mv = t.getAttribute('data-v'); mp = 0; $$('#tf-mont [role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', x === t); }); hoja(); LM.track('montaje_tab', { version: mv }); return; }
      var b = e.target.closest('[data-paso]'); if (!b) return;
      mp = Math.max(0, Math.min(HOJAS.length - 1, mp + +b.getAttribute('data-paso'))); hoja();
    });
    if (partes(st.medida)) { mv = 'partida'; $$('#tf-mont [role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', x.getAttribute('data-v') === 'partida'); }); }
    hoja();

    /* Visor 3D: se carga al acercarse */
  }
  if (PKD) {
    var inc = $('#tf-inc'), RG = LM.REGALOS.filter(function (r) { return PKD.regalos.indexOf(r[2]) > -1; });
    function pintarInc() {
      if (!inc) return;
      var pe = LM.packEstado(), col = LM.PRODUCTOS[PKD.colchon], dc = LM.PRECIOS[PKD.colchon][pe.medida], db = fila(st.medida, pe.color);
      var cfoto = COLS ? (colorObj() || COLS[0]).fotos[TIPO === 'canape' ? 1 : 0] : null;
      var vreg = RG.reduce(function (t, r) { return t + r[4]; }, 0), suma = (dc ? dc.p : 0) + (db ? db.p : 0), dif = Math.round((suma - pe.precio) * 100) / 100;
      inc.innerHTML = '<ul class="tf-inc-l">' +
        '<li><img src="../img/' + LM.FOTO_HOME[PKD.colchon] + '-480.webp" alt="" width="96" height="96" loading="lazy"><span><b>Colchón ' + esc(col.nombre) + '</b><small>' + LM.medidaTxt(pe.medida) + ' · ' + esc(col.nucleo) + '</small></span><em>' + (dc ? LM.eur(dc.p) : '') + '</em></li>' +
        '<li>' + img(cfoto, { alt: '' }) + '<span><b>' + (TIPO === 'canape' ? 'Canapé abatible de madera' : 'Base tapizada 3D antideslizante') + '</b><small>' + esc(pe.color) + (pe.partes ? ' · en 2 partes' : '') + '</small></span><em>' + (db ? LM.eur(db.p) : '') + '</em></li>' +
        RG.map(function (r) { return '<li class="is-regalo"><img src="' + r[3] + '" alt="" width="96" height="96" loading="lazy"><span><b>' + r[0] + '</b><small>' + r[1] + '</small></span><em><s>' + LM.eur(r[4]) + '</s> Gratis</em></li>'; }).join('') +
        '</ul><div class="tf-inc-tot">' +
          '<p><span>Por separado</span><b>' + LM.eur(suma) + '</b></p>' +
          '<p><span>Regalos</span><b><s>' + LM.eur(vreg) + '</s> Gratis</b></p>' +
          '<p class="tf-inc-pk"><span>Tu pack</span><b>' + LM.eur(pe.precio) + '</b></p>' +
          '<p class="tf-inc-ah">' + LM.ico('gift') + (dif >= 1 ? 'Te ahorras ' + LM.eur(dif) + ' y te llevas los regalos, valorados en ' + LM.eur(vreg) + '.' : 'Pagas lo mismo que por separado y te llevas los regalos, valorados en ' + LM.eur(vreg) + '.') + '</p>' +
        '</div>';
    }
    document.addEventListener('tf:medida', function () { setTimeout(pintarInc, 0); });
    document.addEventListener('tf:color', function () { setTimeout(pintarInc, 0); });
    pintarInc();
    return;
  }
  LM.track('view_item', { item_id: P.pid, item_name: P.nombre, item_category: P.cat });
})();
