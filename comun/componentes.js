/* =========================================================================
   LO MONACO · Componentes comunes de las maquetas (opción A y opción B)
   Las dos opciones comparten marcado y comportamiento; cambia solo el CSS.
   Códigos de requisito de la especificación CRO v2 entre corchetes.
   ========================================================================= */
(function () {
  'use strict';
  var C = LM.CONFIG;
  var LOGO = 'https://www.grupolomonaco.com/wp-content/uploads/2024/04/LOMONACO-LOGO.svg';

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
    thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 10v7"/>'
  };
  LM.ico = function (n, cls) {
    return '<svg class="lm-i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>';
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
  LM.cuota = function (p) { return Math.round(p * C.financiacion.factor * 100) / 100; };
  LM.cuotaTxt = function (p) { return LM.mark(C.financiacion, 'o en 3 pagos de ' + LM.eur(LM.cuota(p)) + ' sin intereses'); };
  LM.precio = function (d, o) {
    o = o || {};
    var off = d.r > d.p ? Math.round((1 - d.p / d.r) * 100) : 0;
    var h = '<div class="lm-price' + (o.cls ? ' ' + o.cls : '') + '" data-testid="price">';
    if (o.medida) h += '<div class="lm-price-for">Precio para <b>' + LM.medidaTxt(o.medida) + '</b></div>';
    h += '<div class="lm-price-row">' + (o.desde ? '<span class="lm-price-from">Desde</span>' : '') +
      '<span class="lm-price-now">' + LM.eur(d.p) + '</span>';
    if (off) h += '<s class="lm-price-ref">' + LM.mark(C.precioRef, LM.eur(d.r)) + '</s><span class="lm-price-off">-' + off + ' %</span>';
    h += '</div>';
    if (o.cuota !== false) h += '<div class="lm-price-fee">' + LM.cuotaTxt(d.p) + '</div>';
    return h + '</div>';
  };
  LM.desdeTabla = function (t) {
    var best = null;
    for (var m in t) if (!best || t[m].p < best.p) best = t[m];
    return best;
  };
  LM.desde = function (k) { return LM.desdeTabla(LM.PRECIOS[k]); };

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
    var sel = opts.medida, def = C.medidaInicial.v;
    // Ficha · comentario 4 (29/10): Opción A = desplegable; Opción B = botones pequeños. En las dos, sin precio
    var desplegable = document.body.getAttribute('data-variante') === 'a';
    function render() {
      var t = opts.tabla();
      if (desplegable) {
        el.innerHTML = '<div class="lm-size-head"><label class="lm-size-lbl" for="lm-size-sel">Elige tu medida</label>' +
          '<button type="button" class="lm-size-help" data-asistente aria-haspopup="dialog">' + LM.ico('chat') + 'Ayúdame a elegir</button></div>' +
          '<div class="lm-size-dd"><select id="lm-size-sel" data-testid="size-dropdown">' +
          LM.MEDIDAS.map(function (m) {
            var d = t[m], st = !d ? 'na' : (!d.s ? 'out' : 'ok');
            return '<option value="' + m + '"' + (m === sel ? ' selected' : '') + (st !== 'ok' ? ' disabled' : '') + '>' +
              m.replace('x', ' × ') + ' cm' + (st === 'na' ? ' · no disponible' : st === 'out' ? ' · agotada' : '') + '</option>';
          }).join('') + '</select>' + LM.ico('down') + '</div>';
        return;
      }
      el.innerHTML = '<div class="lm-size-head"><span class="lm-size-lbl" id="lm-size-lbl">Elige tu medida</span>' +
        '<button type="button" class="lm-size-help" data-asistente aria-haspopup="dialog">' + LM.ico('chat') + 'Ayúdame a elegir</button></div>' +
        '<div class="lm-size-grid" role="radiogroup" aria-labelledby="lm-size-lbl">' +
        LM.MEDIDAS.map(function (m) {
          var d = t[m], st = !d ? 'na' : (!d.s ? 'out' : 'ok');
          var on = m === sel && st === 'ok';
          return '<button type="button" role="radio" class="lm-sz' + (m === def ? ' is-default' : '') + (st !== 'ok' ? ' is-' + st : '') + '"' +
            ' data-m="' + m + '" aria-checked="' + on + '"' + (st !== 'ok' ? ' aria-disabled="true"' : '') + ' tabindex="' + (on ? 0 : -1) + '">' +
            '<span>' + m.replace('x', '×') + '</span>' +
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
      if (focus) { var b = $('[data-m="' + m + '"]', el) || $('select', el); if (b) b.focus(); }
      LM.track('select_item', { item_id: d.id, item_variant: m });
      setTimeout(function () { el.removeAttribute('aria-busy'); opts.onChange(m); }, 180);
    }
    el.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT') choose(e.target.value); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.lm-sz'); if (!b) return;
      if (b.getAttribute('aria-disabled') === 'true') { b.classList.add('is-shake'); setTimeout(function () { b.classList.remove('is-shake'); }, 400); return; }
      choose(b.getAttribute('data-m'));
    });
    el.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'SELECT') return;
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
  LM.header = function (el) {
    var active = el.getAttribute('data-active') || '';
    var tel = LM.mark(C.telefono, C.telefono.v);
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
    el.innerHTML =
      // V4 · Cambio 1 y 1b: franja en color LM. Al pasar el hero cambia a los valores de marca, en corto
      '<div class="lm-top"><div class="lm-w lm-top-in lm-top-a">' +
        '<span class="lm-top-h">' + esc(C.horario.v) + '</span>' +
        '<a class="lm-top-promo" href="' + LM.href('/packs/') + '">Ofertas en packs</a>' +
        '<a class="lm-top-tel" href="tel:' + C.telefono.tel + '" data-lead="topbar">' + LM.ico('phone') + tel + '<span class="lm-top-hm">' + esc(C.horario.corto) + '</span></a>' +
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
        '<a class="lm-top-tel lm-top-tel2" href="tel:' + C.telefono.tel + '" data-lead="topbar-fija">' + LM.ico('phone') + tel + '<span class="lm-top-hor">' + esc(C.horario.corto) + '</span></a>' +
      '</div></div>' +
      '<header class="lm-head"><div class="lm-w lm-head-in">' +
        '<button class="lm-burger" type="button" aria-label="Abrir el menú" aria-expanded="false" aria-controls="lm-drawer">' + LM.ico('menu') + '</button>' +
        '<a class="lm-logo" href="index.html"><img src="' + LOGO + '" alt="LOMONACO" width="128" height="19"></a>' +
        '<nav class="lm-nav" aria-label="Menú principal"><ul>' + nav +
          '<li class="lm-ni' + (active === 'Showroom Live' ? ' is-active' : '') + '"><a class="lm-nl lm-live" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i>Showroom Live</a></li>' +
          '<li class="lm-ni"><a class="lm-packs" href="' + LM.href(LM.MENU_PACKS.href) + '">' + esc(LM.MENU_PACKS.t) + '</a></li></ul></nav>' +
        '<div class="lm-head-r">' +
          '<a class="lm-head-tel" href="tel:' + C.telefono.tel + '" data-lead="header">' + LM.ico('phone') + '<span><b>' + tel + '</b><small>' + esc(C.horario.corto) + '</small></span></a>' +
          '<a class="lm-ico lm-acc" href="' + LM.WEB + '/mi-cuenta/" aria-label="Mi cuenta">' + LM.ico('user') + '</a>' +
          '<button class="lm-ico lm-cart" type="button" aria-label="Ver el carrito" data-testid="header-cart">' + LM.ico('cart') + '<b class="lm-cart-n">0</b><span class="lm-cart-t">0 €</span></button>' +
        '</div></div></header>' +
      '<div class="lm-drawer" id="lm-drawer" hidden><div class="lm-drawer-in">' +
        LM.MENU.map(function (it) {
          return '<details class="lm-dacc"><summary>' + esc(it.t) + LM.ico('down') + '</summary><a class="lm-dall" href="' + LM.href(it.href) + '">Ver todo ' + esc(it.t.toLowerCase()) + '</a>' +
            it.grupos.map(function (g) { return '<p>' + esc(g.t) + '</p><ul' + (g.cols === 2 ? ' class="lm-d2"' : '') + '>' + g.links.map(function (l) { return '<li><a href="' + LM.href(l[1]) + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul>'; }).join('') +
            '</details>';
        }).join('') +
        '<a class="lm-dlive" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i><span><b>Showroom Live</b><small>Visita la tienda por videollamada</small></span></a>' +
        '<a class="lm-dpacks" href="' + LM.href(LM.MENU_PACKS.href) + '">' + esc(LM.MENU_PACKS.t) + '</a>' +
        LM.llamar('menu', { label: 'Te ayudamos a elegir' }) +
      '</div></div>';

    // 29/10 · Maqueta: el menú se ve igual, pero todo enlace a la web real (categorías, packs, productos que no tenemos)
    // lleva a la categoría que estamos maquetando. Se respetan las páginas propias de la maqueta, el teléfono y WhatsApp.
    $$('a[href]', el).forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(tel:|mailto:|#)/.test(h) || /wa\.me/.test(h)) return;
      if (/\/mi-cuenta\//.test(h)) { a.setAttribute('href', '#'); return; }
      if (/^[\w-]+\.html$/.test(h)) return; // páginas de la maqueta (home, fichas, Showroom Live, categoría)
      a.setAttribute('href', 'colchones.html');
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
  LM.footer = function (el) {
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
      '</div><div class="lm-foot-legal"><img src="' + LOGO + '" alt="LOMONACO" width="120" height="16" loading="lazy">' +
      '<span>© LM DESCANSO SL</span>' +
      '<a href="' + LM.WEB + '/aviso-legal/">Aviso legal</a><a href="' + LM.WEB + '/politica-de-privacidad/">Política privacidad</a><a href="' + LM.WEB + '/politica-de-cookies/">Política cookies</a></div>' +
      '</div></footer>';
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
      ['¿Cuánto tardará en llegar a mi casa?', 'Normalmente ' + (p && p.entrega ? LM.mark({ estado: 'confirmar', nota: 'Plazo de este modelo' }, p.entrega) : LM.c('entrega')) + '. Si pides montaje, ' + LM.c('entregaMontaje') + '.'],
      ['¿Qué cubre la garantía y qué no?', 'Tu colchón tiene ' + LM.c('garantia') + ' de garantía. ' + LM.c('garantiaCubre')],
      ['¿Puedo pagarlo a plazos?', 'Sí. Puedes pagarlo en ' + LM.c('financiacion') + '. También en 4, 6, 12 o 18 meses, con un pequeño coste fijo al mes (18 meses, en pedidos desde 390 €). Solo necesitas tu DNI, tu móvil y una tarjeta. ' + LM.c('financiacionLarga')],
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

  /* ---------- carrito lateral (maqueta) ---------- */
  LM.cart = {
    items: [], el: null,
    build: function () {
      var d = document.createElement('div');
      d.className = 'lm-sheet lm-sheet--cart'; d.hidden = true;
      d.innerHTML = '<div class="lm-sheet-bg" data-close></div><aside class="lm-sheet-p" role="dialog" aria-modal="true" aria-labelledby="lm-cart-t" tabindex="-1">' +
        '<button class="lm-sheet-x" type="button" data-close aria-label="Cerrar">' + LM.ico('close') + '</button>' +
        '<h2 id="lm-cart-t">Tu carrito</h2><div class="lm-cart-body"></div></aside>';
      document.body.appendChild(d);
      d.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) LM.cart.close(); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape') LM.cart.close(); });
      this.el = d;
    },
    add: function (it, source) {
      this.items.push(it);
      LM.track('add_to_cart', { value: it.precio, currency: 'EUR', source: source || 'main', items: [{ item_id: it.id, item_name: it.nombre, item_variant: it.medida, price: it.precio }] });
      this.update(); this.open(true);
    },
    total: function () { return this.items.reduce(function (s, i) { return s + i.precio; }, 0); },
    update: function () {
      $$('.lm-cart-n').forEach(function (b) { b.textContent = LM.cart.items.length; });
      $$('.lm-cart-t').forEach(function (b) { b.textContent = LM.eur(LM.cart.total()); });
    },
    open: function (added) {
      if (!this.el) this.build();
      var body = $('.lm-cart-body', this.el), last = this.items[this.items.length - 1];
      body.innerHTML = !this.items.length ? '<p>Tu carrito está vacío.</p><a class="lm-btn" href="colchones.html">Ver colchones</a>' :
        (added ? '<p class="lm-cart-ok">' + LM.ico('check') + 'Añadido a tu carrito</p>' : '') +
        this.items.map(function (i) { return '<div class="lm-cart-it"><b>' + esc(i.nombre) + '</b><span>' + LM.medidaTxt(i.medida) + (i.extra ? ' · ' + esc(i.extra) : '') + '</span><em>' + LM.eur(i.precio) + '</em></div>'; }).join('') +
        '<div class="lm-cart-tot"><span>Total con IVA</span><b>' + LM.eur(this.total()) + '</b></div>' +
        '<p class="lm-cart-fee">' + LM.cuotaTxt(this.total()) + '</p>' +
        LM.confianza() +
        '<a class="lm-btn lm-btn--buy" href="' + LM.WEB + '/?add-to-cart=' + last.pid + '&variation_id=' + last.id + '" data-testid="cart-checkout">Finalizar compra</a>' +
        '<p class="lm-note">Maqueta: el botón añade el producto en la web actual.</p>' +
        LM.llamar('cart', { label: '¿Prefieres comprar por teléfono?' });
      this.el.hidden = false;
      document.documentElement.classList.add('lm-noscroll');
      $('.lm-sheet-p', this.el).focus();
      LM.track('view_cart', { value: this.total(), currency: 'EUR' });
    },
    close: function () { this.el.hidden = true; document.documentElement.classList.remove('lm-noscroll'); }
  };

  /* ---------- aparición al hacer scroll (P2: solo opacidad, sin mover el layout) ---------- */
  LM.reveal = function () {
    var els = $$('.lm-rv');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    document.documentElement.classList.add('lm-js');
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- interruptor de marcas de revisión ---------- */
  function marksToggle() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'lm-marks';
    var on = LM.store.get('lm_marcas') === '1'; // 29/10: para enseñar la maqueta, las marcas empiezan ocultas
    function set() {
      document.documentElement.classList.toggle('lm-nomarks', !on);
      b.innerHTML = LM.ico('info') + (on ? 'Ocultar marcas de revisión' : 'Ver marcas de revisión');
      b.setAttribute('aria-pressed', on);
    }
    b.addEventListener('click', function () { on = !on; LM.store.set('lm_marcas', on ? '1' : '0'); set(); });
    set(); document.body.appendChild(b);
  }

  /* ---------- arranque común ---------- */
  LM.init = function () {
    var h = $('#lm-header'); if (h) LM.header(h);
    var f = $('#lm-footer'); if (f) LM.footer(f);
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
