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
  $('#p-tag').textContent = P.etiqueta; $('#p-tag').hidden = !P.etiqueta;
  if (P.ocu) $('.p-gal').insertAdjacentHTML('beforeend', LM.selloOcu(K, 'lm-ocu--ficha')); // Paco, 06/11: sello OCU en el Natura Visco // Paco, 05/11: solo Gran Natura y Natura Gold llevan etiqueta
  $('#p-vp').textContent = P.vp;
  $('#p-facts').innerHTML = [P.altura + ' de alto', 'Firmeza ' + P.firmeza + '%', P.nucleo].map(function (f) { return '<li>' + f + '</li>'; }).join('');

  /* Galería [F2]: una foto grande y debajo dos columnas (en móvil, carrusel).
     Fotos nuevas del Natura Látex; en el resto de modelos se usan como provisionales. */
  // Paco, 09/11: fotos de producto nuevas. Primero las del modelo (Látex, Gran Natura) y luego las de detalle, en todas.
  // Paco, 09/11: el botón de vídeo, en la 4.ª y la 5.ª
  var fotos = LM.galeria(K).map(function (x, i) { return { f: '../img/' + x[0], g: i ? 947 : 1400, h: i ? 947 : 1400, alt: x[1], video: i === 3 || i === 4 }; });
  var PLAY = '<span class="p-vid" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span class="p-vid-k" aria-hidden="true">Vídeo</span>';
  var gal = $('#p-gal'), VIS = LM.GALERIA.visibles || fotos.length;
  gal.innerHTML = fotos.map(function (x, i) {
    return '<figure' + (i ? (i >= VIS ? ' class="is-mas"' : '') : ' class="is-main is-square"') + (x.video ? ' data-video' : '') + '><img src="' + x.f + '-' + x.g + '.webp" srcset="' + x.f + '-560.webp 560w, ' + x.f + '-' + x.g + '.webp ' + x.g + 'w"' +
      ' sizes="' + (i ? '(max-width: 900px) 100vw, 32vw' : '(max-width: 900px) 100vw, 64vw') + '" width="' + x.g + '" height="' + x.h + '"' +
      ' alt="' + P.titulo + ': ' + x.alt + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '>' +
      (x.video ? '<button type="button" class="p-vid-b" aria-label="Ver el vídeo: ' + x.alt + '">' + PLAY + '</button>' : '') + '</figure>';
  }).join(''); // 29/10: sin avisos bajo la galería (Paco). Fotos de otro modelo y vídeos siguen pendientes en el LEEME
  // Paco, 09/11: la grande + 4 a la vista; el resto con «Ver más fotos» (en el móvil, carrusel con todas)
  if (fotos.length > VIS) {
    var mas = fotos.length - VIS;
    gal.insertAdjacentHTML('afterend', '<button type="button" class="p-gal-mas" aria-expanded="false" aria-controls="p-gal">Ver más fotos (' + mas + ')</button>');
    var bMas = gal.nextElementSibling;
    bMas.addEventListener('click', function () {
      var on = gal.classList.toggle('is-todas');
      bMas.setAttribute('aria-expanded', on); bMas.textContent = on ? 'Ver menos fotos' : 'Ver más fotos (' + mas + ')';
      if (on) LM.track('galeria_ver_mas', {});
    });
  }
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
      // Paco, 30/10: cada opción lleva la foto de sus regalos y su valor tachado («Gratis»), sin la franja granate.
      // Solo colchón: almohadas (120 €). Packs: almohadas, edredón y protector.
      // Paco, 05/11: cada pack con sus regalos reales. Canapé: almohadas, edredón y protector (Visco: sin edredón). Base: sin regalos
      var R = LM.REGALO_SOLO, G = b.k === 'solo' ? null : LM.regalosPack(K, b.k);
      var v = G ? G.reduce(function (s, r) { return s + r[4]; }, 0) : R.valor, conRegalo = !G || G.length;
      var foto = !G ? '<img class="p-card-img" src="' + R.img + '" alt="' + R.alt + '" width="240" height="180" loading="lazy">'
        : G.length ? '<span class="p-card-imgs"><i class="p-card-tipo" title="' + (b.k === 'canape' ? 'Con canapé abatible' : 'Con base tapizada') + '">' + LM.ico(b.k === 'canape' ? 'canape' : 'base') + '</i><b class="p-card-mas" aria-hidden="true">+</b>' + G.map(function (x) { return '<img src="' + x[3] + '" alt="' + x[0] + ' de regalo" width="160" height="160" loading="lazy">'; }).join('<b class="p-card-plus" aria-hidden="true">+</b>') + '</span>' : '';
      return '<label class="p-card' + (conRegalo ? ' p-card--regalo' : '') + (dis ? ' is-na' : '') + '"><input type="radio" name="base" value="' + b.k + '"' + (st.base === b.k ? ' checked' : '') + (dis ? ' disabled' : '') + '>' + foto +
        '<span><b>' + (b.k === 'solo' ? R.t : b.t) + '</b><small>' + b.d + '</small>' +
        (conRegalo ? '<small class="p-card-val">Valorado en <s>' + LM.eur(v) + '</s> <strong>Gratis</strong></small>' : '') + '</span><em>' + diff + '</em>' +
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
  // Paco, 06/11: la retirada del colchón viejo se elige en el checkout, no en la ficha

  /* Compra [F6, F11] y segunda vía [F12] */
  function comprar(src) {
    var d = actual(); if (!d) return;
    var b = B(), solo = b.k === 'solo';
    // Paco, 12/11: la línea del carrito lleva foto, precio tachado y los regalos de verdad (colchón: almohadas; pack: los de LM.PACK_CONF)
    LM.cart.add({ id: d.id, pid: b.pid, k: K, tipo: solo ? 'colchon' : 'pack', base: b.k,
      nombre: solo ? P.titulo : 'Pack ' + P.nombre + ' + ' + LM.PACK_BASES[b.k].corto, medida: st.medida, color: '',
      precio: d.p, ref: d.r, img: solo ? '../img/' + LM.FOTO_HOME[K] + '-480.webp' : P.packs[b.k].img,
      url: location.pathname.split('/').pop(),
      regalos: solo ? [['Almohadas', LM.REGALO_SOLO.valor, '../img/regalo-almohada-2-320.webp']] :
        LM.regalosPack(K, b.k).map(function (r) { return [r[0], r[4], r[3]]; }) }, src);
  }
  $('#p-cta').addEventListener('click', function () { comprar('main'); });
  $('#p-stick-cta').addEventListener('click', function () { comprar('sticky'); });
  $('#p-call').innerHTML = LM.llamar('ficha') +
    '<a class="lm-live-link" href="showroom-live.html"><i class="lm-live-dot" aria-hidden="true"></i><span><b>¿Quieres verlo antes?</b> Te lo enseñamos por videollamada</span></a>';
  $('#p-trust').innerHTML = LM.confianza(P, { link: '#compromisos' });

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

  /* Módulo «Columna recta» (Paco, 09/11) · bloque narrativo con el scroll. Mientras bajas, la imagen se queda fija y:
     1) se dibuja la columna, algo curvada; 2) se iluminan una tras otra las zonas donde trabaja el colchón, con su frase;
     3) la columna se endereza y pasa a granate, con «Columna recta». Todo sigue al scroll (si subes, se deshace).
     Sin movimiento si el usuario lo ha reducido: se ve directamente el final */
  /* Paco, 09/11: en el móvil la imagen fija se quedaba sola, con un hueco blanco debajo. Debajo de la imagen va
     el texto del momento en grande, una línea que lo explica y el paso (1 de 3). En escritorio no se ve */
  function txtMovil(k, expl) {
    return '<div class="p-esc-txt"><p class="p-esc-txt-k">' + k + ' · <span class="p-esc-txt-n">Paso 1 de 3</span></p>' +
      '<p class="p-esc-txt-t" aria-live="polite"></p><p class="p-esc-txt-p">' + expl + '</p></div>';
  }
  function txtSincro(el, paso, txt) {
    var on = $('.p-esc-lab.is-on', el) || $('.p-esc-cap.is-on', el), t = $('.p-esc-txt-t', el), n = $('.p-esc-txt-n', el), cap = $('.p-esc-cap', el);
    var v = txt || (on ? on.textContent : (t.textContent || (cap ? cap.textContent : '')));
    if (t.textContent !== v) t.textContent = v;
    var nv = 'Paso ' + (paso + 1) + ' de 3'; if (n.textContent !== nv) n.textContent = nv;
  }
  function espalda(esc, E) {
    var s = function (w) { return E.img + '-' + w + '.webp'; }, C = E.columna;
    esc.innerHTML = '<div class="p-esc-stick"><div class="p-esc-img">' +
        '<div class="p-esc-zoom">' +
          '<img src="' + s(1200) + '" srcset="' + s(800) + ' 800w, ' + s(1200) + ' ' + E.w + 'w" sizes="(max-width: 1320px) 100vw, 1320px" alt="Persona durmiendo de lado sobre el ' + P.titulo + ', con la columna recta" width="' + E.w + '" height="' + E.h + '" loading="lazy">' +
          // Paco, 12/11: sin brillos granates ni pastillas de zona; capa negra al 10 % y la frase grande en blanco
          '<i class="p-esc-velo" aria-hidden="true"></i>' +
          '<svg class="p-esc-col" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="p-esc-sp"/></svg>' +
        '</div>' +
        '<p class="p-esc-frase">' + (E.frase || 'Tu espalda, siempre recta.') + '</p>' +
        '<ol class="p-esc-pasos" aria-hidden="true"><li></li><li></li><li></li></ol>' +
        // Paco, 09/11: aviso integrado, como el de «Por dentro» (sin «Recreación ilustrativa»)
        '<p class="p-esc-aviso"><span class="p-scrub-mouse" aria-hidden="true"><i></i></span><span>Sigue bajando<small>y verás cómo se queda recta tu espalda</small></span></p></div>' +
        txtMovil('Columna recta', 'El colchón cede donde hace falta y sujeta donde lo necesitas, para que tu espalda descanse recta.') + '</div>';
    esc.hidden = false;
    var zoom = $('.p-esc-zoom', esc), sp = $('.p-esc-sp', esc), pasos = $$('.p-esc-pasos li', esc);
    var frase = $('.p-esc-frase', esc), aviso = $('.p-esc-aviso', esc), stick = $('.p-esc-stick', esc);
    var movil = matchMedia('(max-width: 900px)');
    function lim(v) { return Math.max(0, Math.min(1, v)); }
    function pintar(p) {
      // 0–0,2: se dibuja la columna (curvada) · 0,2–0,7: zonas · 0,7–0,95: se endereza · acercamiento suave todo el rato
      var dib = lim(p / .2), rect = lim((p - .7) / .25), N = 24, d = '';
      for (var i = 0; i <= N; i++) {
        var u = i / N, x = C.x0 + (C.x1 - C.x0) * u, y = C.y + C.curva * Math.sin(Math.PI * u) * (1 - rect);
        if (u > dib + 1e-6) break;
        d += (i ? ' L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
      }
      sp.setAttribute('d', d || 'M0 0');
      // Puntos blancos con halo: empiezan grandes y se hacen pequeños hasta su tamaño final al quedar recta
      var w0 = movil.matches ? 10 : 15, w = w0 * (1 + .9 * (1 - lim(p / .95)));
      sp.style.strokeWidth = w.toFixed(2); sp.style.strokeDasharray = '.1 ' + (w * 1.6).toFixed(2);
      frase.classList.toggle('is-on', rect > .6);
      aviso.classList.toggle('is-off', p > .82);
      var paso = p < .2 ? 0 : p < .7 ? 1 : 2;
      pasos.forEach(function (l, k) { l.classList.toggle('is-on', k <= paso && p > .02); });
      zoom.style.transform = 'scale(' + (1 + .07 * p).toFixed(4) + ')';
      txtSincro(esc, paso, paso < 2 ? E.zonas[Math.min(E.zonas.length - 1, Math.floor(lim((p - .2) / .5) * E.zonas.length))][2] : E.frase);
    }
    // Paco, 12/11: el bloque fijo, centrado en la altura de la pantalla (sin quedar bajo la cabecera)
    function centrar() {
      var cab = document.querySelector('.lm-head'), hb = cab ? Math.max(0, cab.getBoundingClientRect().bottom) : 70;
      stick.style.top = Math.max(hb + 12, (innerHeight - stick.offsetHeight) / 2) + 'px';
    }
    centrar(); addEventListener('resize', centrar);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { pintar(1); return; }
    esc.classList.add('is-story');
    var pendiente = false;
    function medir() {
      pendiente = false;
      var r = esc.getBoundingClientRect(), st = $('.p-esc-stick', esc).offsetHeight, recorrido = r.height - st;
      pintar(recorrido > 0 ? lim(-(r.top - parseFloat(getComputedStyle($('.p-esc-stick', esc)).top)) / recorrido) : 1);
    }
    function alScroll() { if (!pendiente) { pendiente = true; requestAnimationFrame(medir); } }
    addEventListener('scroll', alScroll, { passive: true });
    addEventListener('resize', alScroll);
    medir();
  }

  /* Módulo «Independencia de lechos» (Paco, 09/11) · narrativo con el scroll, como el de la columna:
     1) ondas animadas desde el lado de él («Tu pareja se mueve…»); 2) una línea en el centro del colchón las frena
     («…pero cada muelle trabaja solo»); 3) las ondas se apagan y en el lado de ella: «Tú sigues durmiendo» */
  function pareja(fig, E) {
    var s = function (w) { return E.img + '-' + w + '.webp'; }, k = E.h / E.w * 100, y = function (v) { return (v * k / 100).toFixed(2); };
    var muelles = P.nucleo.toLowerCase().indexOf('muelles') > -1;
    var T = [E.textos[0][1], muelles ? E.textos[1][1] : E.textos[1][2]];
    var L = E.lado, O = E.ondas, M = E.limite;
    fig.innerHTML = '<div class="p-esc-stick"><div class="p-esc-img">' +
        '<div class="p-esc-zoom">' +
          '<img src="' + s(1200) + '" srcset="' + s(800) + ' 800w, ' + s(1200) + ' ' + E.w + 'w" sizes="(max-width: 1320px) 100vw, 1320px" alt="Pareja durmiendo abrazada sobre el ' + P.titulo + ', vista desde arriba" width="' + E.w + '" height="' + E.h + '" loading="lazy">' +
          '<svg class="p-ind-svg" viewBox="0 0 100 ' + k.toFixed(2) + '" preserveAspectRatio="none" aria-hidden="true">' +
            '<defs><clipPath id="p-ind-clip"><rect x="' + L[0] + '" y="' + y(L[1]) + '" width="' + (L[2] - L[0]) + '" height="' + y(L[3] - L[1]) + '" rx="1.2"/></clipPath></defs>' +
            '<g clip-path="url(#p-ind-clip)">' + [0, 1, 2].map(function (i) {
              return '<circle class="p-ind-onda" style="animation-delay:' + (i * .8) + 's;transform-origin:' + O[0] + 'px ' + y(O[1]) + 'px" cx="' + O[0] + '" cy="' + y(O[1]) + '" r="24"/>';
            }).join('') + '</g>' +
            '<line class="p-ind-lim" x1="' + M[0] + '" y1="' + y(M[1]) + '" x2="' + M[0] + '" y2="' + y(M[2]) + '"/>' +
          '</svg>' +
          '<p class="p-esc-cap" data-z="0" style="left:' + E.textos[0][0] + '%">' + T[0] + '</p>' +
          '<p class="p-esc-cap" data-z="1" style="left:' + E.textos[1][0] + '%">' + T[1] + '</p>' +
          '<p class="p-esc-lab" style="left:' + E.etiqueta[0] + '%;top:' + E.etiqueta[1] + '%">' + LM.ico('check') + 'Tú sigues durmiendo</p>' +
        '</div>' +
        '<ol class="p-esc-pasos" aria-hidden="true"><li></li><li></li><li></li></ol>' +
        '<p class="p-esc-aviso"><span class="p-scrub-mouse" aria-hidden="true"><i></i></span><span>Sigue bajando<small>y verás por qué no te despierta</small></span></p></div>' +
        txtMovil('Independencia de lechos', 'Si tu pareja se gira o se levanta, el movimiento se queda en su lado y no te despierta.') + '</div>';
    fig.hidden = false;
    var zoom = $('.p-esc-zoom', fig), svg = $('.p-ind-svg', fig), lim = $('.p-ind-lim', fig), lab = $('.p-esc-lab', fig);
    var caps = $$('.p-esc-cap', fig), pasos = $$('.p-esc-pasos li', fig), aviso = $('.p-esc-aviso', fig);
    function c01(v) { return Math.max(0, Math.min(1, v)); }
    function pintar(p) {
      var paso = p < .42 ? 0 : p < .74 ? 1 : 2;
      svg.classList.toggle('is-on', p > .06 && p < .8);
      var l = c01((p - .42) / .2);
      lim.style.opacity = l > 0 ? 1 : 0;
      lim.style.clipPath = 'inset(0 0 ' + ((1 - l) * 100).toFixed(1) + '% 0)';
      caps[0].classList.toggle('is-on', p > .08 && p < .42);
      caps[1].classList.toggle('is-on', p >= .42 && p < .78);
      lab.classList.toggle('is-on', p >= .76);
      aviso.classList.toggle('is-off', p > .82);
      pasos.forEach(function (li, i) { li.classList.toggle('is-on', i <= paso && p > .02); });
      zoom.style.transform = 'scale(' + (1 + .05 * p).toFixed(4) + ')';
      txtSincro(fig, paso);
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { pintar(1); return; }
    fig.classList.add('is-story');
    var pendiente = false, st = $('.p-esc-stick', fig);
    function medir() {
      pendiente = false;
      var r = fig.getBoundingClientRect(), recorrido = r.height - st.offsetHeight;
      pintar(recorrido > 0 ? c01(-(r.top - parseFloat(getComputedStyle(st).top)) / recorrido) : 1);
    }
    function alScroll() { if (!pendiente) { pendiente = true; requestAnimationFrame(medir); } }
    addEventListener('scroll', alScroll, { passive: true });
    addEventListener('resize', alScroll);
    medir();
  }

  /* Cuerpo [F13–F19] */
  $('#p-ben').innerHTML = P.beneficios.map(function (b) { return '<li><span class="h-ic">' + LM.ico(b[0]) + '</span><b>' + b[1] + '</b><p>' + b[2] + '</p></li>'; }).join('');
  $('#p-dur').textContent = P.durTxt;
  // Paco, 09/11: «Tu espalda, recta»: sin adaptación / con adaptación sobre la misma escena
  if (LM.ESCENA_CORTE && $('#p-esc')) espalda($('#p-esc'), LM.ESCENA_CORTE);
  if (LM.ESCENA_PAREJA && $('#p-ind')) pareja($('#p-ind'), LM.ESCENA_PAREJA);
  // Paco, 06/11: fuera la tarjeta de barras de firmeza y adaptabilidad (los datos siguen en el Laboratorio de descanso)
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
    return '<a class="p-reco-c" href="' + LM.href(p.url) + '"><img src="' + p.img + '" alt="" width="160" height="160" loading="lazy"><span>' + (p.etiqueta ? '<small>' + p.etiqueta + '</small>' : '') + '<b>' + p.titulo + '</b><span>' + p.diferencia + '</span>' + LM.precio(d, { cuota: false }) + '</span></a>';
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
    // Paco, 09/11: si hay capas del vídeo para este modelo (LM.VIDEO_CAPAS), una tarjeta por capa y un punto sobre ella
    var CV = (LM.VIDEO_CAPAS || {}).todos, capas = CV || P.capas, n = capas.length, dd = function (x) { return (x < 10 ? '0' : '') + x; };
    var NUM = ['', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez', 'Once', 'Doce'];
    var A0 = .15, A1 = .86, tr = (A1 - A0) / n;
    var pasos = [{ a: 0, b: A0, k: 'Por dentro', t: 'Así es tu ' + P.nombre + '.', p: 'Lo abrimos capa a capa.', h2: true, aviso: true }]
      .concat(capas.map(function (c, i) { return { a: A0 + i * tr, b: A0 + (i + 1) * tr, k: 'Capa ' + dd(i + 1) + ' de ' + dd(n), t: c[0], p: c[1], pt: CV ? i : -1 }; }))
      .concat([{ a: A1, b: 1.01, k: P.altura + ' de descanso', t: (NUM[n] || n) + ' capas. Un solo objetivo.', p: 'Que duermas fresco y te levantes descansado. Firmeza ' + P.firmeza + '% y adaptabilidad ' + P.adaptabilidad + '%.', cta: true }]);
    // Puntos sobre las capas: la capa se ajusta al trozo de vídeo que se ve (object-fit: cover)
    var pts = $('.p-scrub-pts', sec), dots = [];
    if (pts && CV) {
      pts.innerHTML = CV.map(function (c, i) { return '<i style="left:' + c[2] + '%;top:' + c[3] + '%">' + (i + 1) + '</i>'; }).join('');
      dots = $$('i', pts);
      var encajar = function () {
        var m = v.parentNode, W = m.clientWidth, H = m.clientHeight, vw = v.videoWidth || +v.getAttribute('width'), vh = v.videoHeight || +v.getAttribute('height');
        var s = Math.max(W / vw, H / vh), w = vw * s, h = vh * s, op = getComputedStyle(v).objectPosition.split(' ').map(parseFloat);
        pts.style.cssText = 'width:' + w + 'px;height:' + h + 'px;left:' + ((W - w) * (op[0] / 100)) + 'px;top:' + ((H - h) * ((op[1] === undefined ? 50 : op[1]) / 100)) + 'px';
      };
      encajar(); addEventListener('resize', encajar); v.addEventListener('loadedmetadata', encajar);
    }
    list.innerHTML = pasos.map(function (s, i) {
      var tag = s.h2 ? 'h2 id="p-scrub-t"' : 'h3';
      // Comentario 6: cada tarjeta lleva un botón para pasar a la siguiente capa
      var sig = s.cta ? '' : '<button type="button" class="p-scrub-next" data-ir="' + (i + 1) + '">' + (i ? 'Siguiente capa' : 'Empezar') +
        ' <svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg></button>';
      return '<li class="p-scrub-step' + (s.cta ? ' is-end' : '') + '" data-i="' + i + '"><p class="lm-eyebrow">' + s.k + '</p><' + tag + ' class="p-scrub-t">' + s.t + '</' + tag.split(' ')[0] + '>' +
        '<p class="p-scrub-p">' + s.p + '</p>' +
        // 29/10: el aviso de «desliza» va dentro de la primera tarjeta (antes flotaba aparte)
        (s.aviso ? '<p class="p-scrub-aviso"><span class="p-scrub-mouse" aria-hidden="true"><i></i></span><span>Desliza aquí dentro para abrir el colchón<small>Fuera del recuadro, la página sigue bajando</small></span></p>' : '') +
        // Paco, 09/11: poder ir arriba y abajo. Desde la 1.ª capa, botón «Anterior» junto al de seguir
        '<div class="p-scrub-nav">' + (i ? '<button type="button" class="p-scrub-prev" data-ir="' + (i - 1) + '" aria-label="Volver a la tarjeta anterior">' +
          '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>Anterior</button>' : '') +
        (s.cta ? '<a class="lm-btn" href="#p-size">Elegir mi medida</a>' : sig) + '</div></li>';
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
    if (n > 4) { RECORRIDO += (n - 4) * 350; RECORRIDO_TACTIL += (n - 4) * 160; } // más capas, más recorrido (unos 3 golpes de rueda por capa)
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
    // Paco, 09/11: qué parte del vídeo corresponde a cada punto del scroll (data-tramos en el <video>; sin él, lineal hasta el 85 %)
    var tramos = (v.getAttribute('data-tramos') || '0 0, .85 1').split(',').map(function (s) { return s.trim().split(/\s+/).map(Number); });
    function tramo(x) {
      for (var i = 1; i < tramos.length; i++) {
        var a = tramos[i - 1], b = tramos[i];
        if (x <= b[0]) return a[1] + (b[1] - a[1]) * limitar((x - a[0]) / (b[0] - a[0] || 1));
      }
      return tramos[tramos.length - 1][1];
    }
    function pintar() {
      if (dur && !v.seeking) { var t = tramo(p) * (dur - .05); if (Math.abs(v.currentTime - t) > .02) v.currentTime = t; }
      var on = -1; pasos.forEach(function (s, i) { if (p >= s.a && p < s.b) on = i; });
      if (on !== last) {
        items.forEach(function (el, i) { el.classList.toggle('is-on', i === on); });
        dots.forEach(function (d, i) { d.classList.toggle('is-on', on > -1 && pasos[on].pt === i); });
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
