/* =========================================================================
   LO MONACO · Componentes comunes de las maquetas (opción A y opción B)
   Las dos opciones comparten marcado y comportamiento; cambia solo el CSS.
   Códigos de requisito de la especificación CRO v2 entre corchetes.
   ========================================================================= */
(function () {
  'use strict';
  var C = LM.CONFIG;
  var LOGO ='https://www.grupolomonaco.com/wp-content/uploads/2024/04/LOMONACO-LOGO.svg';

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  LM.$ = $; LM.$$ = $$;
  LM.href = function (h) { return /^\//.test(h) ? LM.WEB + h : h; };
  LM.eur = function (n) {
    var dec = Math.round(n * 100) % 100 !== 0;
    return n.toLocaleString('es-ES', { minimumFractionDigits: dec ? 2 : 0, maximumFractionDigits: 2, useGrouping: true }) + ' €';
  };
  LM.medidaTxt = function (m) { return m.replace('x', ' × ') + ' cm'; };
  LM.store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- medición GA4 (sección 9) ---------- */
  window.dataLayer = window.dataLayer || [];
  LM.track = function (ev, params) {
    var o = { event: ev, page_type: document.body.getAttribute('data-page') || '' };
    for (var k in params) o[k] = params[k];
    window.dataLayer.push(o);
    if (window.console) console.debug('[GA4]', ev, params || {});
  };

  /* ---------- marcas de revisión: dato a confirmar o pendiente ---------- */
  LM.mark = function (entry, text) {
    if (!entry || entry.estado === 'ok') return esc(text);
    if (entry.estado === 'pendiente' || text == null)
      return '<span class="lm-pend" title="' + esc(entry.nota || '') + '">[[PENDIENTE: ' + esc(entry.nota || '') + ']]</span>';
    return '<span class="lm-chk" title="A confirmar: ' + esc(entry.nota || '') + '">' + esc(text) + '</span>';
  };
  LM.c = function (key, field) { var e = C[key]; return LM.mark(e, e[field || 'v']); };
  LM.pend = function (nota) { return LM.mark({ estado: 'pendiente', nota: nota }); };
  LM.fill = function (root) {
    $$('[data-cfg]', root).forEach(function (el) {
      var k = el.getAttribute('data-cfg'), f = el.getAttribute('data-f');
      el.innerHTML = LM.c(k, f);
    });
    $$('a[data-tel]', root).forEach(function (a) {
      a.href = 'tel:' + C.telefono.tel;
      if (!a.hasAttribute('data-lead')) a.setAttribute('data-lead', a.getAttribute('data-tel') || 'tel');
    });
  };

  /* ---------- iconos (línea fina) ---------- */
  var P = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    back: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    cart: '<path d="M3 4h2l2.4 11h10.2L20 8H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 13 11"/>',
    chat: '<path d="M4 5h16v11H8l-4 4z"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    waves: '<path d="M3 7c3-4 6-4 9 0s6 4 9 0"/><path d="M3 12c3-4 6-4 9 0s6 4 9 0"/><path d="M3 17c3-4 6-4 9 0s6 4 9 0"/>',
    body: '<path d="M4 18c2-6 5-9 8-9s6 3 8 9"/><path d="M2 18h20"/>',
    couple: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20a6 6 0 0 1 12 0M10 20a6 6 0 0 1 12 0"/>',
    thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 10v7"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    gift: '<path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13"/><path d="M12 7c-1.5-3-5-3.5-5-1s3 1 5 1c2 0 5 1.5 5-1s-3.5-2-5 1"/>',
    /* 12/11: iconos de canapé, bases y complementos */
    box: '<path d="M3 9h18v10H3z"/><path d="M3 9 6 5h12l3 4"/><path d="M9 13h6"/>',
    lift: '<path d="M3 19h18"/><path d="M4 19V15h16v4"/><path d="M4 15 17 6"/><path d="M9 15l4-6"/>',
    grip: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11h.01M11 11h.01M15 11h.01M9 14h.01M13 14h.01M17 14h.01"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-1 1-2-.7-1.2 0-2.5 1.4-2.5H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    robot: '<path d="M3 16a9 4 0 0 0 18 0v-1a9 4 0 0 0-18 0z"/><path d="M3 15a9 4 0 0 1 18 0"/><circle cx="12" cy="14" r="1"/><path d="M2 9h20M5 9V6M19 9V6"/>',
    layers: '<path d="m12 4 9 4.5-9 4.5-9-4.5z"/><path d="m3 13 9 4.5 9-4.5"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    tool: '<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    pdf: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    canape: '<path d="M3 13h18v6H3z"/><path d="M3 16h18"/><path d="M3 13 17.5 5.5l.9 1.8L5.6 13"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
    recoger: '<rect x="2.5" y="10" width="13" height="7" rx="1.5"/><path d="M2.5 13.5h13"/><path d="M17.5 13.5h4m-2-2 2 2-2 2"/>',
    base: '<rect x="2.5" y="9.5" width="19" height="5" rx="1.5"/><path d="M5.5 14.5V18M18.5 14.5V18M2.5 12h19"/>'
  };
  LM.ico = function (n, cls) {
    return '<svg class="lm-i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>';
  };
  /* Fotos de la tienda (img/tienda/, 12/11): -700.webp y, si existe, -1400.webp */
  /* Página de cada pack (8, como la tienda): colchón + canapé o base (12/11) */
  LM.packPagina = function (k, base) { var p = LM.TIENDA && LM.TIENDA.packs[k + (base === 'base' ? 'Base' : 'Canape')]; return p ? p.pagina : 'packs.html'; };
  LM.tfImg = function (n, o) {
    o = o || {};
    if (!LM._gr) { LM._gr = {}; (LM.TIENDA_GRANDES || []).forEach(function (x) { LM._gr[x] = 1; }); }
    var b = '../img/tienda/' + n;
    return '<img src="' + b + '-700.webp"' + (LM._gr[n] ? ' srcset="' + b + '-700.webp 700w, ' + b + '-1400.webp 1400w" sizes="' + (o.sizes || '(max-width: 900px) 100vw, 50vw') + '"' : '') +
      ' alt="' + esc(o.alt || '') + '" width="700" height="700"' + (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + (o.cls ? ' class="' + o.cls + '"' : '') + '>';
  };
  /* Tarjeta de pack de la tienda (fichas, categorías y venta cruzada, 12/11) */
  LM.desdePack = function (pk) {
    var best = null;
    Object.keys(pk.tabla).forEach(function (m) { Object.keys(pk.tabla[m]).forEach(function (c) { var d = pk.tabla[m][c]; if (!best || d.p < best.p) best = d; }); });
    return best;
  };
  var desdePack = LM.desdePack;
  LM.tfPackCard = function (pk) {
    var d = desdePack(pk), foto = pk.fotoColor[Object.keys(pk.fotoColor)[0]], R = LM.REGALOS_TIENDA;
    var col = LM.PRODUCTOS[pk.colchon];
    return '<article class="lm-card tf-pk"><div class="lm-card-img">' + LM.tfImg(foto, { alt: pk.nombre, sizes: '(max-width: 900px) 100vw, 25vw' }) + '<span class="lm-pill">Regalos incluidos</span></div>' +
      '<div class="lm-card-b"><p class="lm-card-k">' + esc(col.nombre) + ' + ' + (pk.base === 'canape' ? 'canapé' : 'base antideslizante') + '</p>' +
      '<h3><a class="lm-stretch" href="' + pk.pagina + '">' + esc(pk.nombre) + '</a></h3>' +
      '<p class="tf-pk-reg">' + LM.ico('gift') + 'De regalo: ' + pk.regalos.map(function (r, i) { return i ? R[r][0].toLowerCase() : R[r][0]; }).join(', ').replace(/, ([^,]*)$/, ' y $1') + '</p>' +
      '<div class="lm-card-f">' + LM.precio(d, { desde: true }) + '<span class="lm-btn lm-btn--full" aria-hidden="true">Ver pack</span></div></div></article>';
  };
  /* Desglose de un pack (Paco, 12/11): cada pieza con su precio real para esa medida y color, y los regalos valorados
     con el precio de la tienda para esa medida (almohadas: 120 €, dato de Paco; edredón según el ancho de la cama;
     bajera de la misma medida). Lo usan el configurador de packs (home y categoría) y la caja de compra de la ficha de pack */
  function filaT(t, m, c) {
    if (!t) return null;
    var f = t[m] || t[m + '-2p'] || (m === '135x180' ? t['135x182'] : null); if (!f) return null;
    return f[c] || f['-'] || f[Object.keys(f)[0]];
  }
  LM.valorRegalo = function (k, m) {
    var ancho = +String(m).split('x')[0], T = LM.TIENDA || {};
    if (k === 'almohada') return LM.REGALO_SOLO.valor;
    if (k === 'protector') { var b = filaT(T.bajera && T.bajera.tabla, m, '-'); return b ? b.p : 48; }
    if (k === 'edredon' && T.edredon) {
      var tope = { 90: '150x220|cama 80 y 90', 105: '180x220|cama 105', 140: '220x220|cama 120-135-140', 160: '240x220|cama 150-160', 180: '260x240|cama 180', 200: '280x240|cama 200' };
      var lim = [90, 105, 140, 160, 180, 200].filter(function (x) { return ancho <= x; })[0] || 200;
      var e = T.edredon.tabla[tope[lim]]; return e ? e['-'].p : 144;
    }
    return 0;
  };
  LM.packDesglose = function (pkKey, m, color) {
    var pk = LM.TIENDA.packs[pkKey]; if (!pk) return null;
    var P = LM.PRODUCTOS[pk.colchon], canape = pk.base === 'canape';
    color = color || (canape ? 'Nogal' : 'Chocolate');
    var dp = filaT(pk.tabla, m, color), dc = LM.PRECIOS[pk.colchon][m], db = filaT((canape ? LM.TIENDA.canape : LM.TIENDA.base3d).tabla, m, color);
    if (!dp || !dc) return null;
    var cfoto = canape ? LM.TIENDA.canape.colores.filter(function (x) { return x.k === color; })[0] : LM.TIENDA.base3d.colores.filter(function (x) { return x.k === color; })[0];
    var lineas = [
      { t: 'Colchón ' + P.nombre, sub: LM.medidaTxt(m) + ' · ' + P.nucleo, img: '../img/' + LM.FOTO_HOME[pk.colchon] + '-480.webp', p: dc.p },
      { t: canape ? 'Canapé abatible de madera' : 'Base tapizada antideslizante', sub: 'Acabado ' + color, img: cfoto ? '../img/tienda/' + cfoto.fotos[canape ? 1 : 0] + '-700.webp' : '', p: db ? db.p : null }
    ];
    var regalos = LM.REGALOS.filter(function (r) { return pk.regalos.indexOf(r[2]) > -1; }).map(function (r) {
      return { t: r[0], sub: r[1], img: r[3], p: LM.valorRegalo(r[2], m), regalo: true };
    });
    var piezas = lineas.reduce(function (s, l) { return s + (l.p || 0); }, 0), vReg = regalos.reduce(function (s, l) { return s + l.p; }, 0);
    var suelto = Math.round((piezas + vReg) * 100) / 100, ahorro = Math.round((suelto - dp.p) * 100) / 100;
    return { pk: pk, m: m, color: color, d: dp, lineas: lineas, regalos: regalos, valorRegalos: vReg, suelto: suelto, ahorro: ahorro };
  };
  /* El listado: una línea por pieza y por regalo, con su precio; al final, por separado, el pack y lo que te ahorras */
  LM.packLista = function (D, o) {
    o = o || {};
    if (!D) return '<p class="c-na">Este pack no se hace en esta medida.</p>';
    var li = function (l) {
      return '<li class="pkl-li' + (l.regalo ? ' is-regalo' : '') + '"><img src="' + l.img + '" alt="" width="64" height="64" loading="lazy"><span><b>' + esc(l.t) + '</b><small>' + esc(l.sub) + '</small></span>' +
        (l.regalo ? '<em><s>' + LM.eur(l.p) + '</s><strong>Gratis</strong></em>' : '<em>' + (l.p != null ? LM.eur(l.p) : '—') + '</em>') + '</li>';
    };
    return '<ul class="pkl" aria-label="Qué te llevas">' + D.lineas.map(li).join('') +
      (D.regalos.length ? '<li class="pkl-k">' + LM.ico('gift') + 'De regalo con tu pack</li>' + D.regalos.map(li).join('') : '') + '</ul>' +
      '<dl class="pkl-tot"><div><dt>Por separado</dt><dd><s>' + LM.eur(D.suelto) + '</s></dd></div>' +
      '<div><dt>Regalos</dt><dd><s>' + LM.eur(D.valorRegalos) + '</s> <strong>Gratis</strong></dd></div>' +
      (o.precio !== false ? '<div class="pkl-pk"><dt>Tu pack · ' + LM.medidaTxt(D.m) + '</dt><dd>' + LM.eur(D.d.p) + '</dd></div>' : '') +
      '</dl>' + (D.ahorro >= 1 ? '<p class="pkl-ah">' + LM.ico('check') + 'Te ahorras <b>' + LM.eur(D.ahorro) + '</b> frente a comprarlo todo por separado</p>' : '');
  };
  LM.stars = function (val) {
    var v = parseFloat(String(val).replace(',', '.')), h = '';
    for (var i = 1; i <= 5; i++) {
      var f = Math.max(0, Math.min(1, v - (i - 1)));
      h += '<span class="lm-st"><i style="width:' + Math.round(f * 100) + '%"></i></span>';
    }
    return '<span class="lm-stars" role="img" aria-label="' + esc(val) + ' de 5">' + h + '</span>';
  };

  /* ---------- precio único [T2] ---------- */
  /* Cuotas con la calculadora de Paco (LM.FINANCIACION). Devuelve null si ese plazo no se ofrece para ese importe */
  LM.sinIntereses = function (p) { return p >= LM.FINANCIACION.sinInteresesDesde; };
  LM.cuotaPlazo = function (p, n) {
    var F = LM.FINANCIACION, pl = F.plazos[n];
    if (!pl || p < F.min || p > F.max || p < pl.min) return null;
    var coste = (n === 12 && LM.sinIntereses(p)) ? 0 : pl.coste;
    var c = Math.round(p * (1 + coste) / n * 100) / 100;
    return c < F.cuotaMin ? null : c;
  };
  /* Paco, 12/11: la cuota que se enseña es SIEMPRE a 36 meses, con el coste de 36 meses de la calculadora (24,91 %),
     aunque la calculadora no ofrezca ese plazo para ese importe («fuérzalo»). Ej.: 449,49 € → 15,60 € al mes */
  LM.cuota36 = function (p) { return p > 0 ? Math.round(p * (1 + LM.FINANCIACION.plazos[36].coste) / 36 * 100) / 100 : null; };
  LM.cuota = LM.cuota36;
  LM.cuotaFrase = function (p) {
    var c = LM.cuota36(p); if (c == null) return '';
    return '<b>' + LM.eur(c) + ' al mes</b> en 36 meses' + LM.ast;
  };
  LM.cuotaBaja = function (p) { var c = LM.cuota36(p); return c == null ? null : { c: c, n: 36 }; };
  LM.cuotaBajaFrase = LM.cuotaFrase;
  LM.ast = '<a class="lm-ast" href="#lm-legal" aria-label="Ver condiciones de la financiación">*</a>';
  LM.cuotaTxt = function (p) { var f = LM.cuotaFrase(p); return f ? 'o ' + f : ''; };
  LM.precio = function (d, o) {
    o = o || {};
    var off = d.r > d.p ? Math.round((1 - d.p / d.r) * 100) : 0;
    var h = '<div class="lm-price' + (o.cls ? ' ' + o.cls : '') + '" data-testid="price">';
    if (o.medida) h += '<div class="lm-price-for">Precio para <b>' + LM.medidaTxt(o.medida) + '</b></div>';
    h += '<div class="lm-price-row">' + (o.desde ? '<span class="lm-price-from">Desde</span>' : '') +
      '<span class="lm-price-now">' + LM.eur(d.p) + '</span>';
    if (off) h += '<s class="lm-price-ref">' + LM.mark(C.precioRef, LM.eur(d.r)) + '</s><span class="lm-price-off">-' + off + ' %</span>';
    h += '</div>';
    if (o.cuota !== false && LM.cuota(d.p) != null) h += '<div class="lm-price-fee">' + LM.cuotaTxt(d.p) + '</div>';
    return h + '</div>';
  };
  LM.desdeTabla = function (t) {
    var best = null;
    for (var m in t) if (!best || t[m].p < best.p) best = t[m];
    return best;
  };
  LM.desde = function (k) { return LM.desdeTabla(LM.PRECIOS[k]); };

  /* ---------- regalos (Paco, 05/11) ---------- */
  // Los colchones siempre llevan las almohadas de regalo: valor tachado para que se vea lo que valen
  LM.regaloAlmohadas = function (cls) {
    var R = LM.REGALO_SOLO;
    return '<p class="lm-gift-line' + (cls ? ' ' + cls : '') + '"><img src="' + R.img + '" alt="" width="240" height="180" loading="lazy">' +
      '<span><b>Almohadas de regalo</b><small>Valoradas en <s>' + LM.eur(R.valor) + '</s> <strong>Gratis</strong></small></span></p>';
  };
  // Regalos reales de cada pack: [nombre, frase, icono, foto, valor]. Base antideslizante: sin regalos
  LM.regalosPack = function (col, base) {
    var pk = LM.PACK_CONF.packs[col + (base === 'canape' ? 'Canape' : 'Base')], q = (pk && pk.regalos) || [];
    return LM.REGALOS.filter(function (r) { return q.indexOf(r[2]) > -1; });
  };

  /* ---------- tarjeta estándar de colchón (Paco, 05/11) ----------
     La de la home es la estándar del ecommerce: home, categoría y cualquier página que liste colchones.
     Precio para la medida elegida (por defecto 150 × 190), cuota a 36 meses (12/11) y almohadas de regalo bajo el botón. */
  LM.selloOcu = function (k, cls) {
    var p = LM.PRODUCTOS[k]; if (!p || !p.ocu) return '';
    return '<span class="lm-ocu' + (cls ? ' ' + cls : '') + '"><img src="' + LM.SELLO_OCU.img + '" alt="' + LM.SELLO_OCU.alt + '" width="160" height="160" loading="lazy"><span>' + LM.SELLO_OCU.t + '</span></span>';
  };
  LM.tarjeta = function (k, o) {
    o = o || {};
    var p = LM.PRODUCTOS[k], m = o.medida || LM.medidaInicial(), d = LM.PRECIOS[k][m], href = LM.href(p.url);
    var f = '../img/' + LM.FOTO_HOME[k];
    return '<article class="lm-card h-pc' + (o.cls ? ' ' + o.cls : '') + '" data-testid="product-card-' + k + '">' +
      '<div class="lm-card-img"><img src="' + f + '-760.webp" srcset="' + f + '-480.webp 480w, ' + f + '-760.webp 760w" sizes="(max-width: 600px) 100vw, 25vw" alt="Colchón ' + p.nombre + '" width="760" height="760" loading="lazy">' +
        '<img class="lm-detalle" src="../img/colchon-card-hover-760.webp" srcset="../img/colchon-card-hover-480.webp 480w, ../img/colchon-card-hover-760.webp 760w" sizes="(max-width: 600px) 100vw, 25vw" alt="" width="760" height="760" loading="lazy">' +
        (p.etiqueta ? '<span class="lm-pill">' + p.etiqueta + '</span>' : '') + LM.selloOcu(k) + '</div>' +
      '<div class="lm-card-b"><p class="lm-card-k">' + p.nucleo + ' · ' + p.altura + '</p>' +
        '<h3><a class="lm-stretch" href="' + href + '" data-select="' + p.id + '">' + p.titulo + '</a></h3>' +
        '<p class="lm-card-d">' + p.diferencia + '</p>' + LM.firmeza(p, { txt: false }) +
        '<div class="lm-card-f">' + (d ? LM.precio(d, { medida: m }) : '<p class="c-na">No lo fabricamos en ' + LM.medidaTxt(m) + '.</p>') +
        '<span class="lm-btn lm-btn--full" aria-hidden="true">Ver colchón</span>' + LM.regaloAlmohadas() + '</div></div></article>';
  };

  /* ---------- valoración [C3, F17] ---------- */
  LM.rating = function (cls) {
    var v = C.valoracion;
    return '<a class="lm-rate ' + (cls || '') + '" href="' + v.url + '" target="_blank" rel="noopener" data-testid="rating">' +
      LM.stars(v.media) + '<b>' + LM.mark(v, v.media) + '</b><span>' + esc(v.plataforma) +
      (v.total ? ' · ' + v.total + ' opiniones' : '') + '</span></a>'; // 29/10: sin la marca «número de opiniones» (molestaba); sigue pendiente en el LEEME
  };

  /* ---------- firmeza y sensación [F14, C3] ---------- */
  LM.firmeza = function (p, o) {
    o = o || {};
    return '<div class="lm-firm" data-testid="firmness">' +
      '<div class="lm-firm-row"><span>Firmeza</span><span class="lm-bar" aria-hidden="true"><i style="--w:' + p.firmeza + '%"></i></span><b>' + p.firmeza + '%</b></div>' +
      '<div class="lm-firm-row"><span>Adaptabilidad</span><span class="lm-bar" aria-hidden="true"><i style="--w:' + p.adaptabilidad + '%"></i></span><b>' + p.adaptabilidad + '%</b></div>' +
      (o.txt === false ? '' : '<p class="lm-firm-txt">' + esc(p.sensacionTxt) + '</p>') + '</div>';
  };

  /* ---------- ¿Estamos atendiendo ahora? L–V de 9:00 a 18:00, hora de Madrid ---------- */
  LM.abierto = function () {
    try {
      var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var min = +p.hour * 60 + +p.minute, lab = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(p.weekday) > -1;
      return lab && min >= 540 && min < 1080;
    } catch (e) { return false; }
  };
  LM.estado = function () {
    var on = LM.abierto();
    return '<span class="lm-state' + (on ? ' is-on' : '') + '"><i aria-hidden="true"></i>' + (on ? 'Asesores disponibles ahora' : 'Ahora cerrado · ' + esc(C.horario.corto)) + '</span>';
  };

  /* ---------- vídeo de YouTube ligero: solo se carga al pulsar ---------- */
  LM.short = function (v) {
    return '<figure class="lm-short" data-testid="ugc-video"><button type="button" class="lm-short-b" data-yt="' + v.id + '" aria-label="Ver el vídeo de ' + esc(v.autor) + '">' +
      '<img src="../img/ugc-' + v.id + '.webp" alt="" width="432" height="768" loading="lazy"><span class="lm-short-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span></button>' +
      '<figcaption>' + esc(v.autor) + '</figcaption></figure>';
  };

  /* ---------- llamada al call center [T1, H2, F12] ---------- */
  LM.llamar = function (lead, o) {
    o = o || {};
    return '<a class="lm-call ' + (o.cls || '') + '" href="tel:' + C.telefono.tel + '" data-lead="' + lead + '" data-testid="call-' + lead + '">' +
      LM.ico('phone') + '<span><small>' + esc(o.label || '¿Dudas? Te asesoramos por teléfono') + '</small><b>' + LM.mark(C.telefono, C.telefono.v) + '</b>' +
      '<small class="lm-call-h">' + esc(C.horario.v) + '</small></span></a>';
  };

  /* ---------- entrega y confianza junto al botón [F7, T3] ---------- */
  LM.confianza = function (p, o) {
    var entrega = p && p.entrega ? LM.mark({ estado: 'confirmar', nota: 'Plazo de este modelo en la web actual' }, p.entrega) : LM.c('entrega');
    return '<ul class="lm-trust" data-testid="trust-block">' +
      '<li>' + LM.ico('truck') + '<span>Te llega en ' + entrega + '. ' + LM.c('envio') + '.</span></li>' +
      '<li>' + LM.ico('moon') + '<span>' + LM.c('prueba') + ' para probarlo en tu cama.</span></li>' +
      '<li>' + LM.ico('back') + '<span>Si no te convence, ' + LM.c('devolucion').toLowerCase() + '.</span></li>' +
      '<li>' + LM.ico('shield') + '<span>' + LM.c('garantia') + ' de garantía.</span></li></ul>' +
      (o && o.link ? '<a class="lm-trust-more" href="' + o.link + '">Ver todas las condiciones</a>' : '');
  };

  /* ---------- selector de medida con todos sus estados [F5] ---------- */
  LM.medidaInicial = function () { return LM.store.get('lm_medida') || C.medidaInicial.v; };
  LM.selector = function (el, opts) {
    // opts: { tabla: fn() -> objeto de precios activo, medida, onChange(m) }
    var sel = opts.medida, def = opts.def || C.medidaInicial.v;
    // 12/11: también para canapé, bases y complementos: su lista de medidas, su texto y sin «Ayúdame a elegir»
    var MED = opts.medidas || LM.MEDIDAS, TXT = opts.label || function (m) { return m.replace('x', ' × ') + ' cm'; };
    var CORTO = opts.corto || function (m) { return m.replace('x', '×'); }, TIT = opts.titulo || 'Elige tu medida';
    var AYUDA = opts.ayuda === false ? '' : '<button type="button" class="lm-size-help" data-asistente aria-haspopup="dialog">' + LM.ico('chat') + 'Ayúdame a elegir</button>';
    // Ficha · comentario 4 (29/10): Opción A = desplegable; Opción B = botones pequeños. En las dos, sin precio
    var desplegable = document.body.getAttribute('data-variante') === 'a';
    function render() {
      var t = opts.tabla();
      if (desplegable) {
        // Paco, 06/11: al desplegar las medidas se ve el precio de cada una (con el tachado), en una lista propia
        var precioDe = function (d) { return '<span class="lm-dd-pr">' + (d.r > d.p ? '<s>' + LM.eur(d.r) + '</s> ' : '') + '<b>' + LM.eur(d.p) + '</b></span>'; };
        var cur = t[sel];
        el.innerHTML = '<div class="lm-size-head"><span class="lm-size-lbl" id="lm-size-lbl">' + TIT + '</span>' + AYUDA + '</div>' +
          '<div class="lm-size-dd lm-dd"><button type="button" class="lm-dd-btn" id="lm-size-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="lm-size-lbl lm-size-btn" data-testid="size-dropdown">' +
          '<span class="lm-dd-m">' + TXT(sel) + '</span>' + (cur ? precioDe(cur) : '') + LM.ico('down') + '</button>' +
          '<ul class="lm-dd-list" role="listbox" aria-labelledby="lm-size-lbl" hidden>' +
          MED.map(function (m) {
            var d = t[m], st = !d ? 'na' : (!d.s ? 'out' : 'ok');
            return '<li role="option" tabindex="-1" data-m="' + m + '" aria-selected="' + (m === sel) + '"' + (st !== 'ok' ? ' aria-disabled="true"' : '') + '>' +
              '<span class="lm-dd-m">' + TXT(m) + '</span>' +
              (st === 'ok' ? precioDe(d) : '<small>' + (st === 'na' ? 'No disponible' : 'Agotada') + '</small>') + '</li>';
          }).join('') + '</ul></div>';
        return;
      }
      el.innerHTML = '<div class="lm-size-head"><span class="lm-size-lbl" id="lm-size-lbl">' + TIT + '</span>' + AYUDA + '</div>' +
        '<div class="lm-size-grid" role="radiogroup" aria-labelledby="lm-size-lbl">' +
        MED.map(function (m) {
          var d = t[m], st = !d ? 'na' : (!d.s ? 'out' : 'ok');
          var on = m === sel && st === 'ok';
          return '<button type="button" role="radio" class="lm-sz' + (m === def ? ' is-default' : '') + (st !== 'ok' ? ' is-' + st : '') + '"' +
            ' data-m="' + m + '" aria-checked="' + on + '"' + (st !== 'ok' ? ' aria-disabled="true"' : '') + ' tabindex="' + (on ? 0 : -1) + '">' +
            '<span>' + CORTO(m) + '</span>' +
            (st === 'ok' ? '' : '<small>' + (st === 'na' ? 'No disponible' : 'Agotada') + '</small>') + '</button>';
        }).join('') + '</div>';
      if (!$('[aria-checked="true"]', el)) { var f = $('.lm-sz:not(.is-na):not(.is-out)', el); if (f) f.tabIndex = 0; }
    }
    function choose(m, focus) {
      var d = opts.tabla()[m];
      if (!d || !d.s) return;
      sel = m; LM.store.set('lm_medida', m);
      el.setAttribute('aria-busy', 'true');
      render();
      if (focus) { var b = $('.lm-sz[data-m="' + m + '"]', el) || $('.lm-dd-btn', el); if (b) b.focus(); }
      LM.track('select_item', { item_id: d.id, item_variant: m });
      setTimeout(function () { el.removeAttribute('aria-busy'); opts.onChange(m); }, 180);
    }
    /* Lista desplegable propia (Opción A): se abre con el botón; flechas, Intro y Esc; se cierra al pulsar fuera */
    function abrir(on, foco) {
      var btn = $('.lm-dd-btn', el), list = $('.lm-dd-list', el); if (!btn) return;
      list.hidden = !on; btn.setAttribute('aria-expanded', on); el.classList.toggle('is-open', on);
      if (on) { var o = $('[aria-selected="true"]', list) || $('[role="option"]:not([aria-disabled])', list); if (o) { o.scrollIntoView({ block: 'nearest' }); if (foco) o.focus(); } }
      else if (foco) btn.focus();
    }
    document.addEventListener('click', function (e) { if (!el.contains(e.target)) abrir(false); });
    el.addEventListener('click', function (e) {
      if (e.target.closest('.lm-dd-btn')) { abrir($('.lm-dd-list', el).hidden, e.detail === 0); return; }
      var o = e.target.closest('[role="option"]');
      if (o) { if (o.getAttribute('aria-disabled') !== 'true') choose(o.getAttribute('data-m'), true); return; }
      var b = e.target.closest('.lm-sz'); if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') { b.classList.add('is-shake'); setTimeout(function () { b.classList.remove('is-shake'); }, 400); return; }
      choose(b.getAttribute('data-m'));
    });
    el.addEventListener('keydown', function (e) {
      var list = $('.lm-dd-list', el);
      if (list) {
        if (e.target.closest('.lm-dd-btn') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); abrir(true, true); return; }
        if (!e.target.closest('[role="option"]')) return;
        var ops = $$('[role="option"]:not([aria-disabled])', list), j = ops.indexOf(e.target);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); var n2 = ops[Math.min(ops.length - 1, Math.max(0, j + (e.key === 'ArrowDown' ? 1 : -1)))]; if (n2) n2.focus(); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(e.target.getAttribute('data-m'), true); }
        else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.preventDefault(); abrir(false, e.key === 'Escape'); }
        return;
      }
      var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      var all = $$('.lm-sz:not(.is-na):not(.is-out)', el), i = all.indexOf(document.activeElement);
      var n = all[(i + keys[e.key] + all.length) % all.length];
      if (n) choose(n.getAttribute('data-m'), true);
    });
    render();
    return { get: function () { return sel; }, set: function (m) { sel = m; render(); }, refresh: render, choose: function (m) { choose(m); } };
  };

  /* ---------- cabecera y menú (estructura de grupolomonaco.com) [T1] ---------- */
  function megaCard(k) {
    var p = LM.PRODUCTOS[k], d = LM.desde(k);
    return '<a class="lm-mc" href="' + LM.href(p.url) + '"><img src="' + p.img + '" alt="" width="120" height="120" loading="lazy">' +
      '<span><small>' + esc(p.nucleo) + '</small><b>' + esc(p.titulo) + '</b><em>Desde ' + LM.eur(d.p) + '</em></span></a>';
  }
  function fichaCard(k) {
    var f = LM.FICHAS[k];
    return '<a class="lm-mc" href="' + LM.href(f.url) + '">' + (f.img ? '<img src="' + f.img + '" alt="" width="120" height="120" loading="lazy">' : '<span class="lm-mc-ph">' + LM.ico('home') + '</span>') +
      '<span><small>' + esc(f.d) + '</small><b>' + esc(f.n) + '</b><em>Desde ' + LM.eur(f.p) + '</em></span></a>';
  }
  /* Paco, 10/11 · Opción B: vuelve el botón de packs del menú, con su submenú (packs con canapé y con base) */
  var PK_ORDEN = ['gran', 'latex', 'gold', 'visco'];
  function packsMenu() {
    var g = function (base, t) {
      return { t: t, links: PK_ORDEN.map(function (k) { return ['Pack ' + LM.PRODUCTOS[k].nombre + (base === 'canape' ? ' + canapé' : ' + base'), LM.packPagina(k, base)]; }) };
    };
    return { t: LM.MENU_PACKS.t, href: LM.MENU_PACKS.href, grupos: [g('canape', 'Packs con canapé abatible'), g('base', 'Packs con base antideslizante')] };
  }
  function packCard(k) {
    var p = LM.PRODUCTOS[k], d = LM.desdeTabla(LM.PRECIOS[p.packs.canape.tabla]);
    return '<a class="lm-mc" href="' + LM.packPagina(k, 'canape') + '"><img src="' + p.packs.canape.img + '" alt="" width="120" height="120" loading="lazy">' +
      '<span><small>Colchón + canapé</small><b>Pack ' + esc(p.nombre) + '</b><em>Desde ' + LM.eur(d.p) + '</em></span></a>';
  }
  /* ---------- cabecera y pie del checkout (Paco, 12/11) ----------
     Fuga n.º 1 de la web actual: en el checkout salen dos cabeceras con todo el menú y el pie completo (171 enlaces que sacan de la compra).
     Aquí: logo, pasos, «Compra segura» y teléfono. Nada más. */
  /* Ruta de la maqueta para un enlace de la web actual. Devuelve el mismo enlace si ya es de la maqueta (o teléfono, WhatsApp…),
     la página equivalente si existe y null si la maqueta no la tiene */
  LM.ruta = function (h) {
    if (!h || /^(tel:|mailto:|#)/.test(h) || /wa\.me/.test(h) || /^[\w-]+\.html([?#].*)?$/.test(h)) return h;
    if (/^https?:/.test(h) && h.indexOf(LM.WEB) !== 0) return h;
    var u = h.replace(LM.WEB, ''), path = u.split('?')[0], q = u.split('?')[1] || '', R = LM.RUTAS || {};
    if (R[path]) {
      var col = (q.match(/attribute_pa_color=([\w-]+)/) || [])[1];
      return R[path] + (col ? '?color=' + col : '');
    }
    var cm = path.match(/^\/canape-(\d+)-x-(\d+)\/$/);
    if (cm && R['/canape-abatible-de-madera/']) return R['/canape-abatible-de-madera/'] + '?medida=' + cm[1] + 'x' + cm[2];
    if (/^\/almohadas?-(70|75|90|135)\/$/.test(path)) return 'almohadas.html';
    return null;
  };
  LM.headerCompra = function (el, pg) {
    var paso = pg === 'confirmado' ? 3 : 2;
    var pasos = [['Carrito', 'carrito.html'], ['Datos y pago', 'finalizar-compra.html'], ['Confirmación', '']];
    el.innerHTML = '<header class="lm-ck-head"><div class="lm-w lm-ck-head-in">' +
      '<a class="lm-logo" href="index.html"><img src="' + LOGO + '" alt="LOMONACO" width="128" height="19"></a>' +
      '<ol class="lm-ck-steps" aria-label="Pasos de la compra">' + pasos.map(function (p, i) {
        var n = i + 1, st = n < paso ? 'is-done' : n === paso ? 'is-on' : '';
        var dentro = '<i aria-hidden="true">' + (n < paso ? LM.ico('check') : n) + '</i><span>' + p[0] + '</span>';
        return '<li class="' + st + '"' + (n === paso ? ' aria-current="step"' : '') + '>' + (n < paso && paso < 3 && p[1] ? '<a href="' + p[1] + '">' + dentro + '</a>' : dentro) + '</li>';
      }).join('') + '</ol>' +
      '<div class="lm-ck-help"><span class="lm-ck-safe">' + LM.ico('lock') + 'Compra segura</span>' +
        '<a class="lm-ck-tel" href="tel:' + C.telefono.tel + '" data-lead="checkout-cabecera">' + LM.ico('phone') + '<span><small>¿Dudas? Te ayudamos</small><b>' + LM.mark(C.telefono, C.telefono.v) + '</b></span></a></div>' +
      '</div></header>';
  };
  LM.footerCompra = function (el) {
    var l = [['Envíos y entregas', '/envios/'], ['Garantías y devoluciones', '/devoluciones/'], ['Métodos de pago', '/metodos-de-pago/'],
             ['Términos y condiciones', '/terminos-condiciones-venta/'], ['Política de privacidad', '/politica-de-privacidad/']];
    el.innerHTML = '<footer class="lm-ck-foot"><div class="lm-w">' + LM.pagos() +
      '<ul class="lm-ck-foot-l">' + l.map(function (x) { return '<li><a href="' + LM.WEB + x[1] + '" target="_blank" rel="noopener">' + x[0] + '</a></li>'; }).join('') + '</ul>' +
      '<p class="lm-foot-fin" id="lm-legal">* ' + esc(C.legalFinanciacion.v) + '</p>' +
      '<p class="lm-ck-copy">© LM DESCANSO SL · ' + esc(C.horario.v) + ' · <a href="tel:' + C.telefono.tel + '" data-lead="checkout-pie">' + LM.mark(C.telefono, C.telefono.v) + '</a></p>' +
      '</div></footer>';
  };

  LM.header = function (el) {
    var PG = document.body.getAttribute('data-page');
    if (PG === 'checkout' || PG === 'confirmado') { LM.headerCompra(el, PG); return; }
    var active = el.getAttribute('data-active') || '';
    var tel = LM.mark(C.telefono, C.telefono.v);
    // Paco, 12/11: queda solo el diseño A, con la cabecera que tenía la B (franja sin horario ni teléfono y botón «Packs» con su submenú)
    var OPB = true;
    var nav = LM.MENU.map(function (it, i) {
      var cards = it.destacados ? it.destacados.map(megaCard).join('') : (it.fichas || []).map(fichaCard).join('');
      return '<li class="lm-ni' + (active === it.t ? ' is-active' : '') + '">' +
        '<a class="lm-nl" href="' + LM.href(it.href) + '" aria-haspopup="true" aria-expanded="false" data-i="' + i + '">' + esc(it.t) + LM.ico('down', 'lm-car') + '</a>' +
        '<div class="lm-mega" role="region" aria-label="' + esc(it.t) + '"><div class="lm-w lm-mega-in">' +
        it.grupos.map(function (g) {
          return '<div class="lm-mg' + (g.cols === 2 ? ' lm-mg2' : '') + '"><p>' + esc(g.t) + '</p><ul>' +
            g.links.map(function (l) { return '<li><a href="' + LM.href(l[1]) + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul></div>';
        }).join('') + '<div class="lm-mcards">' + cards + '</div></div></div></li>';
    }).join('');
    var PKM = OPB ? packsMenu() : null;
    var navPacks = !OPB ? '' : '<li class="lm-ni lm-ni-packs">' +
        '<a class="lm-nl lm-nl-packs" href="' + PKM.href + '" aria-haspopup="true" aria-expanded="false">' + esc(PKM.t) + LM.ico('down', 'lm-car') + '</a>' +
        '<div class="lm-mega" role="region" aria-label="Packs"><div class="lm-w lm-mega-in">' +
        PKM.grupos.map(function (g) { return '<div class="lm-mg"><p>' + esc(g.t) + '</p><ul>' + g.links.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul></div>'; }).join('') +
        '<div class="lm-mcards">' + PK_ORDEN.map(packCard).join('') + '</div></div></div></li>';
    el.innerHTML =
      // V4 · Cambio 1 y 1b: franja en color LM. Al pasar el hero cambia a los valores de marca, en corto
      '<div class="lm-top"><div class="lm-w lm-top-in lm-top-a">' +
        // Paco, 10/11 · Opción B: fuera el horario y el teléfono de la franja (salen en el menú, debajo)
        (OPB ? '' : '<span class="lm-top-h">' + esc(C.horario.v) + '</span>') +
        '<a class="lm-top-promo" href="' + LM.href('/packs/') + '">Ofertas en packs</a>' +
        (OPB ? '' : '<a class="lm-top-tel" href="tel:' + C.telefono.tel + '" data-lead="topbar">' + LM.ico('phone') + tel + '<span class="lm-top-hm">' + esc(C.horario.corto) + '</span></a>') +
      '</div>' +
      '<div class="lm-w lm-top-b">' +
        '<a class="lm-top-dto" href="' + LM.href('/packs/') + '">Hasta 60 % DTO</a>' +
        '<ul class="lm-top-vals" aria-label="Lo que te garantizamos">' +
        '<li class="lm-top-dto-m"><a href="' + LM.href('/packs/') + '">Hasta 60 % DTO</a></li>' +
        '<li>' + LM.ico('truck') + '<span>' + LM.c('envioDevolucion') + '</span></li>' +
        '<li>' + LM.ico('moon') + '<span>' + LM.c('prueba') + ' de prueba</span></li>' +
        '<li>' + LM.ico('shield') + '<span>' + LM.c('garantia') + ' de garantía</span></li>' +
        '<li>' + LM.ico('home') + '<span>' + LM.mark(C.fabricacion, 'Fabricación propia') + '</span></li>' +
        '<li>' + LM.ico('user') + '<span>+' + LM.c('clientes') + ' clientes</span></li></ul>' +
        (OPB ? '' : '<a class="lm-top-tel lm-top-tel2" href="tel:' + C.telefono.tel + '" data-lead="topbar-fija">' + LM.ico('phone') + tel + '<span class="lm-top-hor">' + esc(C.horario.corto) + '</span></a>') +
      '</div></div>' +
      '<header class="lm-head"><div class="lm-w lm-head-in">' +
        '<button class="lm-burger" type="button" aria-label="Abrir el menú" aria-expanded="false" aria-controls="lm-drawer">' + LM.ico('menu') + '</button>' +
        '<a class="lm-logo" href="index.html"><img src="' + LOGO + '" alt="LOMONACO" width="128" height="19"></a>' +
        '<nav class="lm-nav" aria-label="Menú principal"><ul>' + nav +
          '<li class="lm-ni' + (active === 'Showroom Live' ? ' is-active' : '') + '"><a class="lm-nl lm-live" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i>Showroom Live</a></li>' +
          navPacks + '</ul></nav>' + // Paco, 05/11: fuera el botón «Packs colchón + canapé o base»
        '<div class="lm-head-r">' +
          '<a class="lm-head-tel" href="tel:' + C.telefono.tel + '" data-lead="header">' + LM.ico('phone') + '<span><b>' + tel + '</b><small>' + esc(C.horario.corto) + '</small></span></a>' +
          '<a class="lm-ico lm-acc" href="' + LM.WEB + '/mi-cuenta/" aria-label="Mi cuenta">' + LM.ico('user') + '</a>' +
          '<button class="lm-ico lm-cart" type="button" aria-label="Ver el carrito" data-testid="header-cart">' + LM.ico('cart') + '<b class="lm-cart-n">0</b><span class="lm-cart-t">0 €</span></button>' +
        '</div></div></header>' +
      '<div class="lm-drawer" id="lm-drawer" hidden><div class="lm-drawer-in">' +
        LM.MENU.map(function (it) {
          // Paco, 06/11: en el menú del móvil, «Colchones» empieza por «Modelos» (los 4 del menú de escritorio).
          // «Tipos de colchones» y «Medidas principales» se quedan debajo (SEO)
          var modelos = it.destacados ? '<p>Modelos</p><ul class="lm-dmod">' + it.destacados.map(function (k) {
            var p = LM.PRODUCTOS[k], d = LM.desde(k);
            return '<li><a href="' + LM.href(p.url) + '"><img src="' + p.img + '" alt="" width="56" height="56" loading="lazy"><span><b>' + esc(p.titulo) + '</b><small>' + esc(p.nucleo) + ' · desde ' + LM.eur(d.p) + '</small></span></a></li>';
          }).join('') + '</ul>' : '';
          return '<details class="lm-dacc"><summary>' + esc(it.t) + LM.ico('down') + '</summary><a class="lm-dall" href="' + LM.href(it.href) + '">Ver todo ' + esc(it.t.toLowerCase()) + '</a>' +
            modelos + it.grupos.map(function (g) { return '<p>' + esc(g.t) + '</p><ul' + (g.cols === 2 ? ' class="lm-d2"' : '') + '>' + g.links.map(function (l) { return '<li><a href="' + LM.href(l[1]) + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul>'; }).join('') +
            '</details>';
        }).join('') +
        (!OPB ? '' : '<details class="lm-dacc lm-dacc-packs"><summary>Packs' + LM.ico('down') + '</summary>' +
          PKM.grupos.map(function (g) { return '<p>' + esc(g.t) + '</p><ul>' + g.links.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul>'; }).join('') + '</details>') +
        '<a class="lm-dlive" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i><span><b>Showroom Live</b><small>Visita la tienda por videollamada</small></span></a>' +
        LM.llamar('menu', { label: 'Te ayudamos a elegir' }) +
      '</div></div>';

    // 29/10 · Maqueta: el menú se ve igual, pero todo enlace a la web real (categorías, packs, productos que no tenemos)
    // lleva a la categoría que estamos maquetando. Se respetan las páginas propias de la maqueta, el teléfono y WhatsApp.
    // 12/11: canapé, bases, packs, complementos, blog y Mi cuenta ya tienen su página (LM.RUTAS, en comun/tienda.js)
    $$('a[href]', el).forEach(function (a) {
      var h = a.getAttribute('href'), r = LM.ruta(h);
      if (r !== h) a.setAttribute('href', r || 'colchones.html');
    });

    var burger = $('.lm-burger', el), drawer = $('.lm-drawer', el);
    burger.addEventListener('click', function () {
      var open = drawer.hasAttribute('hidden');
      if (open) drawer.removeAttribute('hidden'); else drawer.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', open);
      burger.innerHTML = LM.ico(open ? 'close' : 'menu');
      document.documentElement.classList.toggle('lm-noscroll', open);
    });
    // Escritorio: abre con ratón y con teclado; el primer clic en táctil abre el panel
    $$('.lm-ni', el).forEach(function (li) {
      var a = $('.lm-nl', li); if (!a) return;
      li.addEventListener('mouseenter', function () { a.setAttribute('aria-expanded', 'true'); });
      li.addEventListener('mouseleave', function () { a.setAttribute('aria-expanded', 'false'); });
      li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) a.setAttribute('aria-expanded', 'false'); });
      a.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); a.setAttribute('aria-expanded', 'true'); var f = $('.lm-mega a', li); if (f) f.focus(); }
        if (e.key === 'Escape') a.setAttribute('aria-expanded', 'false');
      });
    });
    $('.lm-cart', el).addEventListener('click', function () { LM.cart.open(); });

    // V4 · Franja: estado A (horario, packs, teléfono) hasta pasar el hero; luego, estado B (valores)
    // 29/10: al bajar se oculta el menú y solo queda fija la franja LM; al subir, el menú vuelve a aparecer
    var hero = document.querySelector('.h-hero, .s-hero'), ultY = scrollY;
    function menu(oculto) {
      el.classList.toggle('is-oculto', oculto);
      document.documentElement.classList.toggle('lm-cab-full', !oculto);
    }
    function sentido() {
      var y = scrollY, dy = y - ultY;
      if (Math.abs(dy) < 6) return;
      if (y < 80 || dy < 0) menu(false);                       // arriba del todo o subiendo: se ve el menú
      else if (el.classList.contains('is-valores')) menu(true); // bajando, ya pasado el banner: se oculta
      ultY = y;
    }
    function poner(b) { if (el.classList.contains('is-valores') !== b) { el.classList.toggle('is-valores', b); if (!b) menu(false); } }
    // ¿Hemos pasado el banner? (en páginas sin banner, al bajar 160 px). Se mira en cada scroll: barato y fiable
    function pasado() { poner(hero ? hero.getBoundingClientRect().bottom < 0 : scrollY > 160); }
    addEventListener('scroll', function () { pasado(); sentido(); }, { passive: true });
    menu(false); pasado();
    // En móvil los valores no caben: pasan de uno en uno
    var items = $$('.lm-top-vals li', el), n = 0;
    if (items.length) {
      items[0].classList.add('is-on');
      setInterval(function () {
        if (!el.classList.contains('is-valores') || innerWidth > 1023) return;
        items[n].classList.remove('is-on'); n = (n + 1) % items.length; items[n].classList.add('is-on');
      }, 3200);
    }
  };

  /* ---------- pie (enlaces de la web actual) ---------- */
  /* Redes sociales y Trusted Shops con iconos (Paco, 06/11) */
  var RED_IC = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.5H7.8v3h2.6V21z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2.1 1.7 3.5 3.9 3.8v3.1a7 7 0 0 1-3.9-1.2v6.2A5.7 5.7 0 1 1 11 9.3v3.2a2.6 2.6 0 1 0 2.4 2.6V3z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8zM10 15.2V8.8l5.4 3.2z"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.2-4.5 4.4 0 .9.3 1.8.8 2.3l.1.4-.3 1.1c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1 0-2-.5-2.4-1.2l-.6 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2z"/></svg>'
  };
  function redes() {
    return '<nav class="lm-foot-soc" aria-label="Síguenos">' + (LM.REDES || []).map(function (r) {
      var ic = r.k === 'trusted' ? '<img src="../img/trusted-shops.png" alt="" width="124" height="116" loading="lazy">' : RED_IC[r.k];
      return r.url
        ? '<a href="' + r.url + '" target="_blank" rel="noopener" aria-label="' + esc(r.t) + '" title="' + esc(r.t) + '">' + ic + '</a>'
        : '<a href="#" class="is-pend" aria-label="' + esc(r.t) + '" title="' + esc(r.t) + ': falta la URL">' + ic + '</a>';
    }).join('') + '</nav>';
  }
  /* Sellos de confianza del pie (Paco, 09/11): OCU, OEKO-TEX, ISO, Top Marcas de Descanso (inventado), Trusted Shops
     (rehecho a nuestro estilo) y Producto de calidad garantizada. Todos con el mismo dibujo: círculo blanco, texto en arco
     y un icono en el centro, en granate. MAQUETA: antes de producción, usar los logos oficiales y solo los sellos que se tengan */
  var SELLO_IC = {
    ocu: '<image href="' + LM.SELLO_OCU.img + '" x="31" y="31" width="38" height="38"/>',
    oeko: '<path d="M50 30c-11 4-16 13-14 26 9 1 17-3 21-12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M36 56c5-8 11-14 20-18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<text x="50" y="68" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">100</text>',
    iso: '<text x="50" y="53" text-anchor="middle" font-size="19" font-weight="800" letter-spacing="1" fill="currentColor">ISO</text><text x="50" y="66" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1.5" fill="currentColor">9001</text>',
    top: '<path d="M36 64c-6-6-7-15-3-22M64 64c6-6 7-15 3-22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M33 50l-4-2M32 57l-4 0M35 44l-3-4M67 50l4-2M68 57l4 0M65 44l3-4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M50 38l3.3 6.8 7.5 1-5.4 5.2 1.3 7.4L50 54.9l-6.7 3.5 1.3-7.4-5.4-5.2 7.5-1z" fill="currentColor"/><text x="50" y="69" text-anchor="middle" font-size="8.5" font-weight="800" letter-spacing="1.2" fill="currentColor">TOP</text>',
    trusted: '<text x="50" y="56" text-anchor="middle" font-size="17" font-weight="800" fill="currentColor">4,39</text>' +
      [0, 1, 2, 3, 4].map(function (i) { return '<path transform="translate(' + (31.5 + i * 8.2) + ' 61) scale(.32)" d="M10 0l3 6.2 6.8.9-5 4.7 1.2 6.7L10 15.3 4 18.5l1.2-6.7-5-4.7 6.8-.9z" fill="currentColor"' + (i === 4 ? ' opacity=".35"' : '') + '/>'; }).join(''),
    garantia: '<text x="50" y="57" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">10</text><text x="50" y="68" text-anchor="middle" font-size="8.5" font-weight="800" letter-spacing="1.4" fill="currentColor">AÑOS</text>',
    dinero: '<path d="M62.5 41.5A14 14 0 1 0 64 52" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M58.5 40.5l4.3 1.4.9-4.4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="50" y="55.5" text-anchor="middle" font-size="13" font-weight="800" fill="currentColor">€</text>',
    calidad: '<path d="M50 30l15 5v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V35z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M43 48.5l5 5 9.5-10" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  var SELLOS = [
    ['ocu', 'ANALIZADO POR', 'LA OCU', 'Colchón Natura Visco analizado por la OCU'],
    ['oeko', 'OEKO-TEX®', 'STANDARD 100', 'Tejidos con certificado OEKO-TEX Standard 100'],
    ['iso', 'CALIDAD CERTIFICADA', 'GESTIÓN ISO', 'Gestión de calidad certificada ISO 9001'],
    ['top', 'TOP MARCAS', 'DE DESCANSO', 'Top Marcas de Descanso'],
    ['trusted', 'TIENDA VERIFICADA', 'TRUSTED SHOPS', 'Tienda verificada por Trusted Shops: ' + C.valoracion.media + ' de 5'],
    ['calidad', 'PRODUCTO DE CALIDAD', 'GARANTIZADA', 'Producto de calidad garantizada'],
    // Paco, 09/11: dos más
    ['garantia', 'PRODUCTO CON', 'DE GARANTÍA', 'Producto con 10 años de garantía'],
    ['dinero', 'COMPRA GARANTIZADA', 'DINERO DEVUELTO', 'Compra garantizada o te devolvemos el dinero']
  ];
  LM.sellos = function () {
    return '<div class="lm-foot-sellos"><p class="lm-foot-sellos-t">Compra con confianza</p><ul>' + SELLOS.map(function (s) {
      var id = 'lm-se-' + s[0];
      return '<li title="' + esc(s[3]) + '"><svg viewBox="0 0 100 100" role="img" aria-label="' + esc(s[3]) + '">' +
        '<defs><path id="' + id + '-a" d="M15 50a35 35 0 0 1 70 0"/><path id="' + id + '-b" d="M12.5 50a37.5 37.5 0 0 0 75 0"/></defs>' +
        '<circle cx="50" cy="50" r="48" class="lm-se-bg"/><circle cx="50" cy="50" r="44.5" class="lm-se-ring"/><circle cx="50" cy="50" r="27" class="lm-se-in"/>' +
        '<text class="lm-se-arc"><textPath href="#' + id + '-a" startOffset="50%" text-anchor="middle">' + s[1] + '</textPath></text>' +
        '<text class="lm-se-arc"><textPath href="#' + id + '-b" startOffset="50%" text-anchor="middle">' + s[2] + '</textPath></text>' +
        '<g class="lm-se-ic">' + SELLO_IC[s[0]] + '</g></svg></li>';
    }).join('') + '</ul></div>';
  };
  /* Formas de pago en el pie (Paco, 09/11): seQura, Pepper, transferencia, Visa, Mastercard y Bizum, misma altura y separación.
     MAQUETA: dibujados aquí con los colores de cada marca; en producción, los logos oficiales */
  var PAGOS = [
    ['seQura', '0 0 112 34', '<rect width="112" height="34" rx="7" fill="#52bf9d"/><text x="56" y="23.5" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">seQura</text>'],
    ['Pepper', '0 0 104 34', '<text x="52" y="24" text-anchor="middle" font-size="27" font-weight="800" letter-spacing="-.5" fill="#ef5148">pepper</text>'],
    ['Transferencia bancaria', '0 0 138 34', '<text x="0" y="14.5" font-size="13.5" font-weight="800" letter-spacing=".2" fill="#111">TRANSFERENCIA</text><text x="0" y="30" font-size="13.5" font-weight="800" letter-spacing=".2" fill="#111">BANCARIA</text>'],
    ['Visa', '0 0 58 36', '<rect x=".75" y=".75" width="56.5" height="34.5" rx="3" fill="#fff" stroke="#c9c9ce" stroke-width="1.5"/><rect x="3" y="3" width="52" height="6" fill="#1a1f71"/><rect x="3" y="27" width="52" height="6" fill="#f7b600"/><text x="29" y="24" text-anchor="middle" font-size="15.5" font-weight="900" font-style="italic" fill="#1a1f71">VISA</text>'],
    ['Mastercard', '0 0 52 34', '<defs><clipPath id="lm-mc"><circle cx="19" cy="17" r="15"/></clipPath></defs><circle cx="19" cy="17" r="15" fill="#eb001b"/><circle cx="33" cy="17" r="15" fill="#f79e1b"/><circle cx="33" cy="17" r="15" fill="#ff5f00" clip-path="url(#lm-mc)"/>'],
    ['Bizum', '0 0 104 34', '<path d="M5 6l6 6M5 28l14-14M15 24l5 5" fill="none" stroke="#05b9cf" stroke-width="4.2" stroke-linecap="round"/><text x="28" y="24.5" font-size="24" font-weight="600" letter-spacing="-.3" fill="#05b9cf">bizum</text>']
  ];
  LM.PAGOS_SVG = PAGOS;
  LM.pagos = function () {
    return '<div class="lm-foot-pagos"><p class="lm-foot-sellos-t">Paga como prefieras</p><ul>' + PAGOS.map(function (p) {
      return '<li><svg viewBox="' + p[1] + '" role="img" aria-label="' + p[0] + '">' + p[2] + '</svg></li>';
    }).join('') + '</ul></div>';
  };
  LM.footer = function (el) {
    var PG = document.body.getAttribute('data-page');
    if (PG === 'checkout' || PG === 'confirmado') { LM.footerCompra(el); return; }
    var li = function (l) { return '<li><a href="' + LM.href(l[1]) + '"' + (l[2] ? ' rel="nofollow noopener" target="_blank"' : '') + '>' + l[0] + '</a></li>'; };
    var col = function (t, links, cls) { return '<div class="lm-fc' + (cls ? ' ' + cls : '') + '"><p>' + t + '</p><ul>' + links.map(li).join('') + '</ul></div>'; };
    var medCol = LM.MEDIDAS.map(function (m) { var a = m.split('x'); return ['Colchón ' + m, '/colchon-' + a[0] + '-x-' + a[1] + '/']; });
    var medCan = LM.MEDIDAS.filter(function (m) { return m !== '140x200'; }).map(function (m) { var a = m.split('x'); return ['Canapé Abatible ' + m, '/canape-' + a[0] + '-x-' + a[1] + '/']; });
    el.innerHTML = '<footer class="lm-foot"><div class="lm-w">' +
      '<div class="lm-foot-help"><div><p class="lm-foot-t">Te ayudamos a elegir</p><p>Llámanos y te asesoramos sin compromiso. ' + esc(C.horario.v) + '.</p></div>' + LM.llamar('footer', { label: 'Teléfono de venta' }) +
      '<a class="lm-foot-wa" href="https://wa.me/+34650282094" data-lead="whatsapp">' + LM.ico('chat') + 'WhatsApp</a>' +
      '<a class="lm-foot-wa" href="showroom-live.html">Showroom Live</a></div>' +
      '<div class="lm-foot-cols">' +
      col('Nuestros productos', [['Colchones de viscoelástica', '/colchones-visco/'], ['Colchón de látex', '/colchones-latex/'], ['Colchones de muelles', '/colchones-muelles/'],
        ['Colchones contrareembolso', '/colchones-contrareembolso/'], ['Colchones financiados', '/colchones-financiados/'], ['Canapé abatible', '/canape/'],
        ['Base tapizada', '/base-tapizada-de-tela/'], ['Almohada viscoelástica', '/almohada-visco/'], ['Almohada látex', '/almohada-latex-lomonaco/'],
        ['Edredón nórdico', '/edredon-nordico/'], ['Sábana bajera ajustable', '/bajera-impermeable/']]) +
      col('Medidas colchones', medCol) +
      col('Medidas canapés', medCan) +
      col('Sobre nosotros', [['Quiénes somos', '/quienes-somos/'], ['Blog', '/blog/'], ['Contacto', '/contacto/']]) +
      col('Condiciones', [['Envíos, entregas y montajes', '/envios/'], ['Métodos de pago', '/metodos-de-pago/#mastercard'], ['Garantías y Devoluciones', '/devoluciones/'],
        ['Certificados de venta', '/certificados-de-venta/'], ['Términos y condiciones de la venta', '/terminos-condiciones-venta/'], ['Política de calidad', '/politica-de-calidad/'],
        ['FAQ - Preguntas y respuestas frecuentes', '/faq-preguntas-y-respuestas-frecuentes/'], ['Black Friday', '/blackfriday/']]) +
      '<div class="lm-fc"><p>Redes sociales</p><ul>' + li(['Facebook', 'https://www.facebook.com/GrupoLoMonaco/', 1]) + li(['Instagram', 'https://www.instagram.com/lomonaco_es/', 1]) + '</ul>' +
        '<p class="lm-fc-t2">Atención</p><ul class="lm-fc-at"><li>' + esc(C.horario.v) + '</li>' +
        '<li><a href="tel:' + C.telefono.tel + '" data-lead="footer-venta">Venta: ' + LM.mark(C.telefono, C.telefono.v) + '</a></li>' +
        '<li><a href="tel:+34858225189">Atención al cliente: 858 22 51 89</a></li>' +
        '<li><a href="https://wa.me/+34650282094" data-lead="whatsapp">WhatsApp</a></li></ul>' +
        '<a class="lm-foot-ts" href="https://www.trustedshops.es/" target="_blank" rel="noopener">Protección al Comprador y Valoraciones reales · Trusted Shops</a></div>' +
      '</div>' + LM.sellos() + LM.pagos() + '<p class="lm-foot-fin" id="lm-legal">* ' + esc(C.legalFinanciacion.v) + '</p><div class="lm-foot-legal"><img src="' + LOGO + '" alt="LOMONACO" width="120" height="16" loading="lazy">' + redes() +
      '<span>© LM DESCANSO SL</span>' +
      '<a href="' + LM.WEB + '/aviso-legal/">Aviso legal</a><a href="' + LM.WEB + '/politica-de-privacidad/">Política privacidad</a><a href="' + LM.WEB + '/politica-de-cookies/">Política cookies</a></div>' +
      '</div></footer>';
    $$('a[href]', el).forEach(function (a) { var h = a.getAttribute('href'), r = LM.ruta(h); if (r && r !== h) a.setAttribute('href', r); });
  };

  /* ---------- reseñas reales ---------- */
  LM.resena = function (r) {
    return '<figure class="lm-rev" data-testid="review"><blockquote>' + (r.t ? '<b>' + esc(r.t) + '</b>' : '') + '<p>«' + esc(r.x) + '»</p></blockquote>' +
      '<figcaption>' + LM.ico('check') + 'Cliente verificado · ' + esc(r.f) + (r.m ? ' · ' + esc(r.m) : '') + '</figcaption></figure>';
  };

  /* ---------- preguntas frecuentes [F22] ---------- */
  LM.faqs = function (p) {
    var tel = LM.mark(C.telefono, C.telefono.v);
    return [
      ['¿Qué pasa si el colchón me parece demasiado duro?', 'Tienes ' + LM.c('prueba') + ' para probarlo en tu cama. Los primeros días el cuerpo se acostumbra. Si no te adaptas, llámanos al ' + tel + ' y te ayudamos. Si aun así no te convence, puedes devolverlo dentro de ese plazo.'],
      ['¿Puedo devolverlo si no me adapto?', 'Sí. ' + LM.c('devolucionCond')],
      ['¿Quién recoge el colchón y quién paga la recogida?', 'Lo recogemos nosotros, en la misma dirección donde te lo entregamos. Se pueden descontar los gastos de envío y recogida cuando la ley lo permite. Si el colchón llegó dañado o equivocado, te devolvemos todo, sin descontar nada.'],
      ['¿Cuánto tardará en llegar a mi casa?', 'Normalmente ' + (p && p.entrega ? LM.mark({ estado: 'confirmar', nota: 'Plazo de este modelo' }, p.entrega) : LM.c('entrega')) + '.'],
      ['¿Qué cubre la garantía y qué no?', 'Tu colchón tiene ' + LM.c('garantia') + ' de garantía. ' + LM.c('garantiaCubre')],
      ['¿Puedo pagarlo a plazos?', 'Sí. Puedes financiarlo ' + LM.c('financiacion') + '. ' + LM.c('financiacionLarga')],
      ['¿Qué necesito para elegir la medida correcta?', 'Mide por dentro tu cama o tu canapé: el ancho y el largo. Tu colchón debe tener esa misma medida. Si dudas, llámanos al ' + tel + ' y te ayudamos.'],
      ['¿Lo puedo probar en una tienda?', LM.c('tiendas'), true]
    ];
  };
  LM.faqHTML = function (list) {
    return list.map(function (q, i) {
      // 29/10: acordeón en dos columnas que empieza desplegado (A y B). Los globos se probaron y se descartaron
      return '<details class="lm-faq" open' + (q[2] ? ' data-solo-revision' : '') + ' data-testid="faq-' + (i + 1) + '"><summary>' + esc(q[0]) + LM.ico('down') + '</summary><div class="lm-faq-a"><p>' + q[1] + '</p></div></details>';
    }).join('');
  };

  /* ---------- vista previa de la landing de confianza [CF2] ---------- */
  LM.trust = {
    el: null,
    build: function () {
      var d = document.createElement('div');
      d.className = 'lm-sheet'; d.hidden = true;
      d.innerHTML = '<div class="lm-sheet-bg" data-close></div><aside class="lm-sheet-p" role="dialog" aria-modal="true" aria-labelledby="lm-tp-t" tabindex="-1">' +
        '<button class="lm-sheet-x" type="button" data-close aria-label="Cerrar">' + LM.ico('close') + '</button>' +
        '<p class="lm-eyebrow">La marca de toda la vida</p><h2 id="lm-tp-t">Por qué confiar en nosotros</h2>' +
        '<ol class="lm-tp">' +
        '<li><b>Nuestra historia</b><span>Fabricamos colchones desde ' + LM.c('fundacion') + '. Más de ' + LM.c('clientes') + ' clientes ya duermen con nosotros.</span></li>' +
        '<li><b>Fabricación y calidad</b><span>' + LM.c('fabricacion') + '. ' + LM.pend('controles de calidad que hacemos') + '</span></li>' +
        '<li><b>Materiales</b><span>Látex natural, viscoelástica y muelles ensacados. ' + LM.pend('cómo elegimos los materiales') + '</span></li>' +
        '<li><b>Personas que lo respaldan</b><span>' + LM.pend('equipo, expertos o certificados reales') + '</span></li>' +
        '<li><b>Opiniones de clientes</b><span>' + LM.rating() + '</span></li>' +
        '<li><b>Después de tu compra</b><span>' + LM.c('garantia') + ' de garantía y ' + LM.c('prueba') + ' de prueba. Si lo devuelves, ' + LM.c('devolucion').toLowerCase() + '.</span></li></ol>' +
        '<a class="lm-btn lm-btn--line" href="#" aria-disabled="true">Ver la página completa ' + LM.pend('landing CF1 por crear') + '</a></aside>';
      document.body.appendChild(d);
      d.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) LM.trust.close(); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape') LM.trust.close(); });
      this.el = d;
    },
    open: function (src) {
      if (!this.el) this.build();
      this.last = document.activeElement;
      this.el.hidden = false;
      document.documentElement.classList.add('lm-noscroll');
      $('.lm-sheet-p', this.el).focus();
      LM.track('trust_preview_open', { source: src || '' });
    },
    close: function () {
      this.el.hidden = true;
      document.documentElement.classList.remove('lm-noscroll');
      if (this.last) this.last.focus();
    }
  };

  /* ---------- carrito (Paco, 12/11: proceso de compra completo en la maqueta) ----------
     El carrito se guarda en la sesión del navegador: pasa de la ficha al carrito, al checkout y a la confirmación.
     Cada línea: { id, pid, k, tipo, nombre, medida, color, precio, ref, img, url, regalos: [[nombre, valor, foto]], cant }.
     Los regalos van dentro de su producto y no se pueden tocar (en la web actual salen como otra línea con + y −). */
  LM.cart = {
    items: [], el: null,
    load: function () {
      try { this.items = JSON.parse(sessionStorage.getItem('lm_cart') || '[]'); } catch (e) { this.items = []; }
      this.items = this.items.filter(function (i) { return i && i.id && i.precio; });
    },
    save: function () {
      try { sessionStorage.setItem('lm_cart', JSON.stringify(this.items)); } catch (e) {}
      this.update();
      try { document.dispatchEvent(new CustomEvent('lm:cart')); } catch (e) {}
    },
    build: function () {
      var d = document.createElement('div');
      d.className = 'lm-sheet lm-sheet--cart'; d.hidden = true;
      d.innerHTML = '<div class="lm-sheet-bg" data-close></div><aside class="lm-sheet-p" role="dialog" aria-modal="true" aria-labelledby="lm-cart-t" tabindex="-1">' +
        '<button class="lm-sheet-x" type="button" data-close aria-label="Cerrar">' + LM.ico('close') + '</button>' +
        '<h2 id="lm-cart-t">Tu carrito</h2><div class="lm-cart-body"></div></aside>';
      document.body.appendChild(d);
      d.addEventListener('click', function (e) {
        if (e.target.closest('[data-close]')) { e.preventDefault(); LM.cart.close(); return; }
        var q = e.target.closest('[data-q]');
        if (q) { LM.cart.setCant(+q.getAttribute('data-i'), +q.getAttribute('data-q')); LM.cart.open(); }
      });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape') LM.cart.close(); });
      this.el = d;
    },
    add: function (it, source) {
      it.cant = it.cant || 1;
      var same = this.items.filter(function (i) { return i.id === it.id && (i.color || '') === (it.color || ''); })[0];
      if (same) same.cant = Math.min(9, same.cant + it.cant); else this.items.push(it);
      LM.track('add_to_cart', { value: it.precio, currency: 'EUR', source: source || 'main', items: [{ item_id: it.id, item_name: it.nombre, item_variant: it.medida + (it.color ? ' · ' + it.color : ''), price: it.precio, quantity: it.cant }] });
      this.save(); this.open(true);
    },
    setCant: function (i, n) {
      var it = this.items[i]; if (!it) return;
      if (n < 1) { this.items.splice(i, 1); LM.track('remove_from_cart', { item_id: it.id, item_name: it.nombre }); }
      else it.cant = Math.min(n, 9);
      this.save();
    },
    count: function () { return this.items.reduce(function (s, i) { return s + i.cant; }, 0); },
    total: function () { return this.items.reduce(function (s, i) { return s + i.precio * i.cant; }, 0); },
    regalos: function () { return this.items.reduce(function (s, i) { return s + (i.regalos || []).reduce(function (t, r) { return t + r[1]; }, 0) * i.cant; }, 0); },
    ahorro: function () { return this.items.reduce(function (s, i) { return s + Math.max(0, (i.ref || i.precio) - i.precio) * i.cant; }, 0) + this.regalos(); },
    update: function () {
      $$('.lm-cart-n').forEach(function (b) { b.textContent = LM.cart.count(); });
      $$('.lm-cart-t').forEach(function (b) { b.textContent = LM.eur(LM.cart.total()); });
    },
    /* Línea de producto, la misma en el panel, el carrito y el resumen del checkout */
    linea: function (it, i, o) {
      o = o || {};
      var reg = (it.regalos || []).map(function (r) {
        return '<li><img src="' + r[2] + '" alt="" width="40" height="40" loading="lazy"><span>' + esc(r[0]) + (it.cant > 1 ? ' × ' + it.cant : '') + '</span><span class="lm-li-gv"><s>' + LM.eur(r[1] * it.cant) + '</s> Gratis</span></li>';
      }).join('');
      // Resumen del checkout: regalos en una sola línea, para que el total se vea sin bajar
      if (o.compact && (it.regalos || []).length) reg = '';
      var regc = o.compact && (it.regalos || []).length ? '<p class="lm-li-regc">' + LM.ico('gift') + '<span>De regalo: ' + esc(it.regalos.map(function (r, j) { return j ? r[0].toLowerCase() : r[0]; }).join(', ').replace(/, ([^,]*)$/, ' y $1')) + '</span></p>' : '';
      var q = o.cant === false ? (o.badge ? '' : '<span class="lm-li-qn">Cantidad: ' + it.cant + '</span>') :
        '<span class="lm-qty" role="group" aria-label="Cantidad de ' + esc(it.nombre) + '">' +
          // En la página del carrito hay «Eliminar» aparte: el − se queda en 1. En el panel, el − en 1 es una × que lo quita
          '<button type="button" data-q="' + (it.cant - 1) + '" data-i="' + i + '" aria-label="' + (it.cant > 1 ? 'Quitar uno' : 'Eliminar del carrito') + '"' + (it.cant < 2 && o.quitar ? ' disabled' : '') + '>' + (it.cant > 1 || o.quitar ? '−' : LM.ico('close')) + '</button>' +
          '<b aria-live="polite">' + it.cant + '</b>' +
          '<button type="button" data-q="' + (it.cant + 1) + '" data-i="' + i + '" aria-label="Añadir uno"' + (it.cant >= 9 ? ' disabled' : '') + '>+</button></span>';
      return '<li class="lm-li" data-testid="cart-line">' +
        '<a class="lm-li-img" href="' + esc(it.url || '#') + '"' + (o.links === false ? ' tabindex="-1" aria-hidden="true"' : '') + '><img src="' + esc(it.img) + '" alt="" width="96" height="96" loading="lazy">' + (o.badge ? '<b class="lm-li-badge">' + it.cant + '</b>' : '') + '</a>' +
        '<div class="lm-li-b"><p class="lm-li-n">' + (o.links === false ? esc(it.nombre) : '<a href="' + esc(it.url || '#') + '">' + esc(it.nombre) + '</a>') + '</p>' +
          '<p class="lm-li-v">' + (it.vtxt ? esc(it.vtxt) : LM.medidaTxt(it.medida)) + (it.color ? ' · Acabado ' + esc(it.color) : '') + '</p>' + q + regc +
          (o.quitar ? '<button class="lm-li-x" type="button" data-q="0" data-i="' + i + '">Eliminar</button>' : '') + '</div>' +
        '<div class="lm-li-p">' + (it.ref > it.precio ? '<s>' + LM.eur(it.ref * it.cant) + '</s>' : '') + '<b>' + LM.eur(it.precio * it.cant) + '</b></div>' +
        (reg ? '<ul class="lm-li-reg" aria-label="De regalo con este producto"><li class="lm-li-rt">' + LM.ico('gift') + 'De regalo, ya incluido</li>' + reg + '</ul>' : '') +
      '</li>';
    },
    open: function (added) {
      if (!this.el) this.build();
      var body = $('.lm-cart-body', this.el), n = this.count();
      $('#lm-cart-t', this.el).textContent = 'Tu carrito' + (n ? ' (' + n + ')' : '');
      body.innerHTML = !this.items.length ? '<p>Tu carrito está vacío.</p><a class="lm-btn" href="colchones.html">Ver colchones</a>' :
        (added ? '<p class="lm-cart-ok">' + LM.ico('check') + 'Añadido a tu carrito</p>' : '') +
        '<ul class="lm-lis">' + this.items.map(function (it, i) { return LM.cart.linea(it, i); }).join('') + '</ul>' +
        '<div class="lm-cart-tot"><span>Total <small>IVA incluido</small></span><b>' + LM.eur(this.total()) + '</b></div>' +
        '<p class="lm-cart-fee">' + LM.cuotaTxt(this.total()) + '</p>' +
        '<a class="lm-btn lm-btn--buy lm-btn--full" href="finalizar-compra.html" data-testid="cart-checkout">' + LM.ico('lock') + 'Finalizar compra</a>' +
        '<div class="lm-cart-2"><a class="lm-btn lm-btn--line" href="carrito.html">Ver carrito</a><button class="lm-btn lm-btn--line" type="button" data-close>Seguir comprando</button></div>' +
        LM.confianza() +
        LM.llamar('cart', { label: '¿Prefieres comprar por teléfono?' });
      if (this.el.hidden) {
        this.last = document.activeElement;
        this.el.hidden = false;
        document.documentElement.classList.add('lm-noscroll');
        $('.lm-sheet-p', this.el).focus();
        LM.track('view_cart', { value: this.total(), currency: 'EUR', source: 'panel' });
      }
    },
    close: function () {
      this.el.hidden = true; document.documentElement.classList.remove('lm-noscroll');
      if (this.last && this.last.focus) this.last.focus();
    }
  };
  LM.cart.load();

  /* ---------- aparición al hacer scroll (P2: solo opacidad, sin mover el layout) ---------- */
  LM.reveal = function () {
    var els = $$('.lm-rv');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    document.documentElement.classList.add('lm-js');
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- interruptor de marcas de revisión ---------- */
  /* Paco, 12/11: fuera las pastillas «Ver marcas de revisión» y «Opción A / B». Queda un botón pequeño, abajo a la izquierda,
     que despliega el histórico de versiones (LM.HISTORICO, comun/historico.js) y, dentro, el interruptor de las marcas */
  function marksToggle() {
    var on = LM.store.get('lm_marcas') === '1'; // las marcas empiezan ocultas
    var pag = location.pathname.split('/').pop() || 'index.html', H = LM.HISTORICO || [];
    var URL = 'https://marketinglomonaco-art.github.io/lomonaco-mockup/historico/';
    var w = document.createElement('div');
    w.className = 'lm-vers-w';
    w.innerHTML = '<button type="button" class="lm-vers-btn" aria-expanded="false" aria-controls="lm-vers-p" aria-label="Versiones de la maqueta">' + LM.ico('layers') + '<span>Versiones</span></button>' +
      '<div class="lm-vers-p" id="lm-vers-p" hidden><p class="lm-vers-t">Versiones de la maqueta</p><ol>' +
      '<li class="is-on"><b>Actual</b><span>La que estás viendo</span></li>' +
      H.map(function (v) {
        var p = v.pags.indexOf(pag) > -1 ? pag : 'index.html';
        return '<li><a href="' + URL + v.id + '/diseno1-a/' + p + '"><b>' + esc(v.fecha) + '</b><span>' + esc(v.titulo) + '</span></a>' +
          (v.b ? '<a class="lm-vers-b" href="' + URL + v.id + '/diseno1-b/' + p + '" aria-label="Opción B del ' + esc(v.fecha) + '">B</a>' : '') + '</li>';
      }).join('') + '</ol>' +
      '<label class="lm-vers-m"><input type="checkbox"' + (on ? ' checked' : '') + '><span>Ver marcas de revisión</span></label></div>';
    document.body.appendChild(w);
    var b = w.querySelector('.lm-vers-btn'), p = w.querySelector('.lm-vers-p');
    function set() { document.documentElement.classList.toggle('lm-nomarks', !on); }
    b.addEventListener('click', function () { p.hidden = !p.hidden; b.setAttribute('aria-expanded', !p.hidden); });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) { p.hidden = true; b.setAttribute('aria-expanded', 'false'); } });
    w.querySelector('.lm-vers-m input').addEventListener('change', function () { on = this.checked; LM.store.set('lm_marcas', on ? '1' : '0'); set(); });
    set();
  }

  /* ---------- arranque común ---------- */
  LM.init = function () {
    var h = $('#lm-header'); if (h) LM.header(h);
    var f = $('#lm-footer'); if (f) LM.footer(f);
    LM.cart.update();
    LM.fill(document);
    marksToggle();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lead]');
      if (t) LM.track('generate_lead', { method: t.getAttribute('data-lead') === 'whatsapp' ? 'whatsapp' : 'phone', source: t.getAttribute('data-lead') });
      var yt = e.target.closest('[data-yt]');
      if (yt) {
        var id = yt.getAttribute('data-yt'), f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
        f.title = yt.getAttribute('aria-label'); f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
        yt.replaceWith(f); LM.track('ugc_play', { video_id: id });
      }
      var tp = e.target.closest('[data-trust-preview]');
      if (tp) { e.preventDefault(); LM.trust.open(tp.getAttribute('data-trust-preview')); }
    });
    // 29/10: las preguntas empiezan abiertas; solo se mide cuando el cliente pulsa (no al cargar la página)
    document.addEventListener('click', function (e) {
      var sm = e.target.closest('.lm-faq > summary'); if (!sm) return;
      var d = sm.parentNode;
      LM.track(d.open ? 'faq_close' : 'faq_open', { question: sm.textContent });
    });
    LM.reveal();
  };
})();
