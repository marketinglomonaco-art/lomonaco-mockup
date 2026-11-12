/* LO MONACO · Showroom Live: recorrido colchón a colchón (fotos de Paco, 09/11) y reserva de videollamada.
   Todo el recorrido empuja a lo mismo: reservar la videollamada o llamar. */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, S = LM.SHOWROOM;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $$('[data-estado]').forEach(function (el) { el.innerHTML = LM.estado(); });

  /* ================= SALA (plano general) =================
     Paco, 09/11: se empieza por la sala, donde se ven los 3 colchones. Efecto de cámara 3D (falso): al arrastrar, la vista gira
     un poco en perspectiva, como si movieras la cabeza; al cambiar de sitio, la cámara avanza hacia el nuevo punto de vista.
     Plano para elegir desde dónde mirar (nuevo diseño). Los puntos de cada cama abren su recorrido (más abajo). */
  var sv = $('#s-sv'), SALA = S.sala;
  var flecha = function (d) { return '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (d < 0 ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6') + '"/></svg>'; };
  var ICO_PLANO = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>';

  /* Plano del showroom: pared de madera con el panel iluminado, las 3 camas en fila con su cabecero y su canapé,
     la estantería de complementos y, encima, los puntos de vista con su cono de visión */
  function cama(x, w, cab, can, etq) {
    return '<g class="s-mp-bed"><rect x="' + (x + 3) + '" y="15" width="' + (w - 6) + '" height="5" rx="1.5" fill="' + cab + '"/>' +
      '<rect x="' + x + '" y="20" width="' + w + '" height="44" rx="4" fill="' + can + '"/>' +
      '<rect x="' + (x + 2.5) + '" y="21.5" width="' + (w - 5) + '" height="39" rx="3" fill="#fff"/>' +
      '<rect x="' + (x + 6) + '" y="24" width="' + (w / 2 - 8) + '" height="7" rx="2.5" fill="#efe9e1"/><rect x="' + (x + w / 2 + 2) + '" y="24" width="' + (w / 2 - 8) + '" height="7" rx="2.5" fill="#efe9e1"/>' +
      '<text x="' + (x + w / 2) + '" y="76" text-anchor="middle">' + etq + '</text></g>';
  }
  var PLANO = '<svg class="s-mp-svg" viewBox="0 0 200 132" aria-hidden="true">' +
    '<defs><radialGradient id="s-mp-g" cx="0" cy="0" r="1"><stop offset="0" stop-color="#7c1919" stop-opacity=".75"/><stop offset="1" stop-color="#7c1919" stop-opacity="0"/></radialGradient></defs>' +
    '<rect x="1" y="1" width="198" height="130" rx="12" fill="#f3eee7"/>' +
    '<path d="M1 13V13a12 12 0 0 1 12-12h174a12 12 0 0 1 12 12z" fill="#b9997a"/>' +
    '<rect x="10" y="12.5" width="166" height="2.5" rx="1.2" fill="#fff4dc"/>' +
    cama(18, 42, '#b8b3ba', '#dcc5a2', 'Natura Gold') + cama(78, 42, '#5f5f66', '#7b5236', 'Natura Látex') + cama(138, 42, '#5f5f66', '#e4e0da', 'Gran Natura') +
    '<rect x="184" y="16" width="11" height="22" rx="2" fill="#d6bd96"/><text class="s-mp-sm" x="189.5" y="46" text-anchor="middle">Almoh.</text>' +
    '<path class="s-mp-cone" id="s-mp-cone" d="M0 0 L54 -30 A62 62 0 0 1 54 30 Z" fill="url(#s-mp-g)"/>' +
    '</svg>';

  sv.setAttribute('tabindex', '0');
  sv.setAttribute('role', 'region');
  sv.setAttribute('aria-label', 'Sala del showroom. Arrastra o usa las flechas del teclado para mirar; toca una cama para verla de cerca.');
  sv.innerHTML =
    '<div class="s-sv-stages" id="s-stages"></div>' +
    // Paco, 10/11: de cerca, un botón para volver a ver las tres camas
    '<button class="s-sv-todos" type="button" id="s-todos"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h18M5 10V6h4v4M15 10V6h4v4M3 10v8M21 10v8M3 15h18"/></svg>Ver todos los colchones</button>' +

    '<p class="s-sv-hint" id="s-hint"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-4.3-2.5L5.4 15a1.5 1.5 0 0 1 2.6-1.5L8 14"/></svg>Arrastra para mirar</p>' +
    '<button class="s-sv-nav s-sv-prev" type="button" data-go="-1" aria-label="Punto de vista anterior">' + flecha(-1) + '</button>' +
    '<button class="s-sv-nav s-sv-next" type="button" data-go="1" aria-label="Siguiente punto de vista">' + flecha(1) + '</button>' +
    '<button class="s-sv-full" type="button" id="s-sv-full" aria-label="Pantalla completa"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>';
  /* Paco, 10/11: «Desde dónde mirar» como un plano del showroom hecho por un arquitecto: línea granate, muy limpio.
     Pared con el panel iluminado, las 3 camas con su cabecero, almohadas, mesillas y alfombras, y la estantería.
     Cada punto de vista: punto numerado; el elegido, con su cono de visión y una línea de puntos. Al lado, la lista. */
  function camaPlano(x, etq, mesas, alfombra) {
    var w = 112, l = x - w / 2, g = '';
    if (alfombra) g += '<rect class="s-pl-rug" x="' + (x - 88) + '" y="92" width="176" height="122" rx="4"/>';
    mesas.forEach(function (m) {
      g += m[0] === 'c' ? '<circle class="s-pl-mue" cx="' + (x + m[1]) + '" cy="44" r="10"/>'
        : '<rect class="s-pl-mue" x="' + (x + m[1] - 12) + '" y="31" width="24" height="24" rx="2"/>';
    });
    g += '<rect class="s-pl-cab" x="' + (l - 6) + '" y="26" width="' + (w + 12) + '" height="9" rx="2"/>' +
      '<rect class="s-pl-bed" x="' + l + '" y="35" width="' + w + '" height="128" rx="6"/>' +
      '<rect class="s-pl-alm" x="' + (l + 9) + '" y="42" width="42" height="17" rx="5"/><rect class="s-pl-alm" x="' + (l + w - 51) + '" y="42" width="42" height="17" rx="5"/>' +
      '<path class="s-pl-fold" d="M' + (l + 6) + ' 112H' + (l + w - 6) + '"/>' +
      '<text class="s-pl-etq" x="' + x + '" y="236" text-anchor="middle">' + etq + '</text>';
    return g;
  }
  function cono(c) {
    var x = c[0], y = c[1], h = c[2] / 2 * Math.PI / 180, L = c[3];
    var x1 = x - Math.sin(h) * L, x2 = x + Math.sin(h) * L, yy = y - Math.cos(h) * L;
    return 'M' + x + ' ' + y + 'L' + x1.toFixed(1) + ' ' + yy.toFixed(1) + 'A' + L + ' ' + L + ' 0 0 1 ' + x2.toFixed(1) + ' ' + yy.toFixed(1) + 'Z';
  }
  var PLANO_SALA = '<svg class="s-pl-svg" viewBox="0 0 600 330" aria-hidden="true">' +
    '<defs><linearGradient id="s-pl-g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7c1919" stop-opacity=".22"/><stop offset="1" stop-color="#7c1919" stop-opacity="0"/></linearGradient></defs>' +
    '<rect class="s-pl-room" x="6" y="18" width="588" height="306" rx="3"/>' +
    '<path class="s-pl-wall" d="M6 18H594"/><path class="s-pl-luz" d="M40 23H548"/>' +
    // conos de visión debajo de los muebles (las camas, blancas, los tapan); la línea de puntos llega hasta los pies de la cama
    SALA.map(function (e, i) { return '<g class="s-pl-vis" data-i="' + i + '"><path class="s-pl-cono" d="' + cono(e.cam) + '"/><path class="s-pl-ray" d="M' + e.cam[0] + ' ' + (e.cam[1] - 15) + 'V' + Math.max(e.cam[1] - e.cam[3] + 10, e.cam[3] > 150 ? 252 : 0) + '"/></g>'; }).join('') +
    camaPlano(130, 'NATURA GOLD', [['c', -76], ['c', 76]], true) +
    camaPlano(300, 'NATURA LÁTEX', [['r', -74], ['r', 74]], false) +
    camaPlano(470, 'GRAN NATURA', [['r', -74], ['c', 76]], true) +
    '<rect class="s-pl-mue" x="562" y="26" width="26" height="74" rx="2"/><path class="s-pl-mue" d="M562 50.5h26M562 75h26"/>' +
    '<text class="s-pl-sm" x="575" y="116" text-anchor="middle">ALMOH.</text>' +
    '</svg>';
  sv.insertAdjacentHTML('afterend', '<div class="s-plano" id="s-plano">' +
    '<button type="button" class="s-pl-tog" aria-expanded="false"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18v14H3zM3 9h18M8 9v10"/></svg><span>Ver plano</span></button>' +
    '<div class="s-pl-map">' + PLANO_SALA + SALA.map(function (e, i) {
      return '<button type="button" class="s-pl-pt" data-i="' + i + '" style="left:' + (e.cam[0] / 6).toFixed(2) + '%;top:' + (e.cam[1] / 3.3).toFixed(2) + '%" aria-label="Mirar: ' + e.t + '">' + (i + 1) + '</button>';
    }).join('') + '</div>' +
    '<div class="s-pl-side"><p class="lm-eyebrow">Elige desde dónde mirar</p><ul class="s-pl-list">' + SALA.map(function (e, i) {
      return '<li><button type="button" class="s-pl-op" data-i="' + i + '" aria-pressed="false"><img class="s-pl-th" src="../img/sr2-' + e.img + '-900.webp" alt="" width="900" height="600" decoding="async"><b>' + (i < 9 ? '0' : '') + (i + 1) + '</b><span>' + e.t + '<small>' + e.s + '</small></span></button></li>';
    }).join('') + '</ul><p class="s-pl-nota">Pincha en un número del plano, o en el suelo de la foto para acercarte a una cama.</p>' +
      '<a class="lm-btn lm-btn--video lm-btn--full s-pl-cta" href="#reserva">' + LM.ico('video') + 'Quiero hacer una videollamada</a></div>' +
    '<p class="s-pl-now" aria-live="polite"><small>Estás viendo</small><b></b></p></div>');
  /* Paco, 10/11 · tres propuestas para integrar el plano (sin rosa). Se eligen con ?plano=1, 2 o 3:
     1 · panel gris a la altura de la foto · 2 · con miniaturas de cada vista · 3 · plano pequeño dentro de la foto */
  var PV = (/[?&]plano=([1-6])/.exec(location.search) || [])[1] || '1';
  sv.parentNode.setAttribute('data-plano', PV);
  /* 4 · barra bajo la foto · 5 · panel granate con el plano en blanco · 6 · fotos de cada vista dentro del visor,
     y el plano se abre con «Ver plano» */
  $('.s-pl-tog').addEventListener('click', function () {
    var on = sv.parentNode.classList.toggle('is-plano');
    this.setAttribute('aria-expanded', on); this.lastChild.textContent = on ? 'Ocultar plano' : 'Ver plano';
  });
  // Paco, 10/11: los 3 pasos no van en la columna del plano; se queda el bloque grande «Cómo funciona» de la página
  $('#s-plano').addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b && b.tagName === 'BUTTON') { ocultarPista(); ir(+b.getAttribute('data-i')); } });

  var stages = $('#s-stages'), cur = -1, pan = { x: .5, y: .5 }, vel = 0, dims = {}, stage = null, busy = false;
  var ESCALA = 1.18; // la foto es un 18 % mayor que el visor: margen para mirar sin perder los 3 colchones
  function medir() {
    var e = SALA[Math.max(0, cur)], rat = e.w / e.h, w = sv.clientWidth, h = sv.clientHeight;
    var sw = Math.max(w * ESCALA, h * rat * 1.06), sh = sw / rat;
    if (sh < h * 1.08) { sh = h * 1.08; sw = sh * rat; }
    dims = { w: w, h: h, sw: sw, sh: sh, rx: sw - w, ry: sh - h };
    $$('.s-stage', stages).forEach(function (st) { st.style.width = sw + 'px'; st.style.height = sh + 'px'; });
    pintar();
  }
  /* Cámara: el desplazamiento mueve la foto y, a la vez, la gira unos grados en perspectiva (cabeza que gira) */
  function pintar() {
    if (!stage) return;
    pan.x = Math.min(1, Math.max(0, pan.x)); pan.y = Math.min(1, Math.max(0, pan.y));
    var giro = reduce ? 0 : (pan.x - .5) * -9, cab = reduce ? 0 : (pan.y - .5) * 5;
    stage.style.transform = 'translate3d(' + (-pan.x * dims.rx) + 'px,' + (-pan.y * dims.ry) + 'px,0) rotateY(' + giro.toFixed(2) + 'deg) rotateX(' + cab.toFixed(2) + 'deg)';
  }
  function crearEscena(i) {
    var e = SALA[i], st = document.createElement('div'), n = '../img/sr2-' + e.img;
    st.className = 's-stage';
    st.style.width = dims.sw + 'px'; st.style.height = dims.sh + 'px';
    st.innerHTML = '<img src="' + n + '-2560.webp" srcset="' + n + '-1600.webp 1600w, ' + n + '-2560.webp 2560w" sizes="' + Math.round(dims.sw) + 'px" alt="Showroom de Lo Monaco: ' + e.t + '" width="' + e.w + '" height="' + e.h + '" draggable="false">' +
      e.puntos.map(function (p) {
        var c = S.camas[p[0]];
        return '<button type="button" class="s-spot" data-cama="' + p[0] + '" style="left:' + p[1] + '%;top:' + p[2] + '%"><i aria-hidden="true"></i><span>' + c.t + '</span></button>';
      }).join('');
    return st;
  }
  /* Cambio de sitio: la cámara avanza (la foto actual se acerca y se difumina) y la nueva llega asentándose */
  function ir(i) {
    i = (i + SALA.length) % SALA.length;
    if (i === cur || busy) return;
    var prev = stage, prevPan = pan.x;
    cur = i; medir();
    sv.classList.toggle('is-cerca', SALA[i].puntos.length < 2);
    var next = crearEscena(i);
    stages.appendChild(next);
    stage = next; pan = { x: .5, y: .5 }; vel = 0; pintar();
    marcarPlano();
    if (prev && !reduce) {
      busy = true;
      next.style.visibility = 'hidden';
      // La cámara avanza cuando la foto nueva ya está lista (como mucho, 1,2 s de espera)
      var img = next.querySelector('img'), hecho = false;
      var arrancar = function () {
        if (hecho) return; hecho = true;
        next.style.visibility = '';
        prev.style.transformOrigin = origenGo || ((prevPan * 100) + '% 55%'); origenGo = null;
        prev.classList.add('is-go'); next.classList.add('is-come');
        setTimeout(function () { prev.remove(); next.classList.remove('is-come'); busy = false; }, 760);
      };
      if (img.decode) img.decode().then(arrancar, arrancar); else img.onload = arrancar;
      setTimeout(arrancar, 1200);
    } else if (prev) prev.remove();
    LM.track('showroom_scene', { scene: SALA[i].img });
  }
  function marcarPlano() {
    var now = $('.s-pl-now b'); if (now && SALA[cur]) now.textContent = SALA[cur].t + (SALA[cur].puntos.length === 1 ? ' · ' + SALA[cur].s.toLowerCase() : '');
    $$('.s-pl-pt, .s-pl-op, .s-pl-vis').forEach(function (b) { var on = +b.getAttribute('data-i') === cur; b.classList.toggle('is-on', on); if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on); });
  }

  /* Paco, 09/11 · falso 3D: con el ratón, la vista sigue al cursor (suave, sin bamboleo): la foto se desplaza,
     gira unos grados en perspectiva y los puntos de las camas flotan por delante. En el móvil, se arrastra */
  var raton = matchMedia('(hover: hover) and (pointer: fine)').matches, meta = null, sigue = 0;
  function seguir() {
    sigue = 0; if (!meta) return;
    pan.x += (meta.x - pan.x) * .07; pan.y += (meta.y - pan.y) * .07; pintar();
    if (Math.abs(meta.x - pan.x) > .0008 || Math.abs(meta.y - pan.y) > .0008) sigue = requestAnimationFrame(seguir);
  }
  if (raton && !reduce) {
    sv.classList.add('is-raton');
    sv.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = sv.getBoundingClientRect();
      meta = { x: .08 + .84 * Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: .15 + .7 * Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
      ocultarPista(); if (!sigue) sigue = requestAnimationFrame(seguir);
    });
    sv.addEventListener('pointerleave', function () { meta = { x: .5, y: .5 }; if (!sigue) sigue = requestAnimationFrame(seguir); });
    $('#s-hint').lastChild.textContent = 'Mueve el ratón para mirar';
  }

  /* Arrastrar con el dedo (o el ratón, si no se sigue al cursor), con un poco de inercia */
  var drag = null;
  sv.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, a')) return;
    if (raton && !reduce && e.pointerType === 'mouse') return;
    drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
    sv.classList.add('is-drag'); vel = 0;
  });
  addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now();
    if (!drag.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    if (!drag.moved && e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) { drag = null; sv.classList.remove('is-drag'); return; } // deja hacer scroll vertical
    drag.moved = true; ocultarPista();
    pan.x -= dx / (dims.rx || 1); pan.y -= dy / (dims.ry || 1);
    vel = -dx / (dims.rx || 1) / Math.max(1, now - drag.t) * 16;
    drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
    pintar();
  });
  addEventListener('pointercancel', function () { drag = null; sv.classList.remove('is-drag'); });
  addEventListener('pointerup', function () {
    if (!drag) return; if (drag.moved) arrastrado = performance.now(); drag = null; sv.classList.remove('is-drag');
    (function inercia() { if (Math.abs(vel) < .0005) return; pan.x += vel; vel *= .92; pintar(); requestAnimationFrame(inercia); })();
  });
  sv.addEventListener('keydown', function (e) {
    if (e.target !== sv) return;
    if (e.key === 'ArrowLeft') { pan.x -= .08; pintar(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { pan.x += .08; pintar(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { ir(cur + 1); e.preventDefault(); }
    if (e.key === 'ArrowDown') { ir(cur - 1); e.preventDefault(); }
  });
  var pista = true;
  function ocultarPista() { if (pista) { pista = false; $('#s-hint').classList.add('is-off'); } }
  /* Paco, 10/11: en la vista de toda la sala, si pinchas en el suelo (a los pies de una cama) o cerca de un colchón,
     te acercas: la cámara avanza hacia ese punto y entra en la foto de frente de esa cama (con el mismo falso 3D).
     Al pasar el ratón por la sala sale una marca en el suelo, como en Street View, con «Acércate al …» */
  var origenGo = null, arrastrado = 0;
  sv.insertAdjacentHTML('beforeend', '<div class="s-walk" id="s-walk" aria-hidden="true"><i></i><span></span></div>');
  var walk = $('#s-walk');
  function camaCercana(e) {
    if (!stage || !SALA[cur] || SALA[cur].puntos.length < 2) return null;
    var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 100, mejor = null, dist = 1e9;
    SALA[cur].puntos.forEach(function (p) {
      var j = -1; SALA.forEach(function (v, k) { if (v.puntos.length === 1 && v.puntos[0][0] === p[0]) j = k; });
      if (j > -1 && Math.abs(p[1] - x) < dist) { dist = Math.abs(p[1] - x); mejor = { cama: p[0], vista: j }; }
    });
    return mejor;
  }
  sv.addEventListener('pointermove', function (e) {
    var c = !drag && !busy && !e.target.closest('button, a') ? camaCercana(e) : null;
    sv.classList.toggle('is-walk', !!c);
    if (!c) return;
    var r = sv.getBoundingClientRect();
    walk.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)';
    walk.lastChild.textContent = 'Acércate al ' + S.camas[c.cama].t;
  });
  sv.addEventListener('pointerleave', function () { sv.classList.remove('is-walk'); });
  sv.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cama]'); if (b) { abrirCama(b.getAttribute('data-cama')); return; }
    var g = e.target.closest('[data-go]'); if (g) { ocultarPista(); ir(cur + +g.getAttribute('data-go')); return; }
    if (e.target.closest('#s-todos')) { ir(0); LM.track('showroom_vista_general', {}); return; }
    if (e.target.closest('button, a') || performance.now() - arrastrado < 350) return;
    var c = camaCercana(e); if (!c) return;
    var r = stage.getBoundingClientRect();
    origenGo = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '% ' + ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
    ocultarPista(); sv.classList.remove('is-walk'); ir(c.vista);
    LM.track('showroom_acercarse', { cama: c.cama });
  });
  $('#s-sv-full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else if (sv.requestFullscreen) sv.requestFullscreen();
  });
  document.addEventListener('fullscreenchange', function () { setTimeout(medir, 50); });
  addEventListener('resize', medir);
  cur = 0; medir(); cur = -1; ir(0);
  // Pista inicial: un pequeño giro de cámara para que se entienda que se puede mirar
  if (!reduce) setTimeout(function () {
    var t0 = performance.now();
    (function giro(t) { var k = (t - t0) / 1800; if (!pista || k > 1) return; pan.x = .5 + Math.sin(k * Math.PI * 2) * .22; pintar(); requestAnimationFrame(giro); })(t0);
  }, 900);
  // Precarga de las vistas de la sala, para que el cambio de sitio sea inmediato
  addEventListener('load', function () { SALA.forEach(function (e) { var im = new Image(); im.src = '../img/sr2-' + e.img + '-' + ((sv.clientWidth * (devicePixelRatio || 1)) > 1700 ? 2560 : 1600) + '.webp'; }); });

  /* De la sala a una cama, y vuelta */
  function abrirCama(k) {
    ocultarPista();
    $('#s-sala').hidden = true; $('#s-room').hidden = false;
    verCama(k);
    $('#tour').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  function volverSala() {
    if (document.fullscreenElement) document.exitFullscreen();
    $('#s-room').hidden = true; $('#s-sala').hidden = false; medir();
    $('#tour').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    sv.focus({ preventScroll: true });
  }

  /* ================= RECORRIDO =================
     Paco, 09/11: página rehecha con su sesión de fotos. Eliges colchón, ves sus fotos de detalle, sus capas al lado
     y puedes abrir el canapé. Todo termina en la videollamada. */
  var ph = $('#s-room-ph'), imgA = $('#s-img-a'), imgB = $('#s-img-b'), side = $('#s-room-side');
  var R = { cama: S.orden[0], foto: 0, canape: false };
  function src(n, w) { return '../img/sr2-' + n + '-' + w + '.webp'; }
  function srcset(n) { return src(n, 900) + ' 900w, ' + src(n, 1600) + ' 1600w, ' + src(n, 2560) + ' 2560w'; }
  function lista() { return R.canape ? S.canape.fotos : S.camas[R.cama].fotos; }

  /* Capas del colchón: esquema con las capas reales de datos.js */
  var MAT = [[/tejido|damastretch/i, 'tela', 16], [/fibra/i, 'fibra', 14], [/visco/i, 'visco', 20], [/hr extra/i, 'hr2', 18],
    [/núcleo hr/i, 'hr', 40], [/núcleo 100% látex/i, 'latex-n', 50], [/látex/i, 'latex', 22], [/algodón/i, 'algodon', 14], [/muelles/i, 'muelles', 46]];
  function material(n) { for (var i = 0; i < MAT.length; i++) if (MAT[i][0].test(n)) return MAT[i]; return null; }
  function capasHTML(p) {
    var capas = p.capas.map(function (c) { return { n: c[0], d: c[1], m: material(c[0]) }; });
    var fis = capas.filter(function (c) { return c.m; }), extra = capas.filter(function (c) { return !c.m; });
    return '<div class="s-capas" aria-hidden="true">' + fis.map(function (c, i) {
        return '<div class="s-capa s-capa--' + c.m[1] + '" style="--h:' + c.m[2] + 'px"><b>' + (i + 1) + '</b></div>';
      }).join('') + '</div>' +
      '<ol class="s-capas-l">' + fis.map(function (c) { return '<li><b>' + c.n + '</b><span>' + c.d + '</span></li>'; }).join('') + '</ol>' +
      (extra.length ? '<ul class="s-capas-x">' + extra.map(function (c) { return '<li>' + LM.ico('check') + '<span><b>' + c.n + '.</b> ' + c.d + '</span></li>'; }).join('') + '</ul>' : '') +
      '<p class="s-capas-n">Esquema ilustrativo, sin escala.</p>';
  }

  /* Ficha lateral: el colchón (con sus capas), las almohadas o el canapé */
  function pintarFicha() {
    var k = R.cama, c = S.camas[k], p = LM.PRODUCTOS[k], h;
    if (R.canape) {
      var f = LM.FICHAS.canape;
      h = '<p class="lm-eyebrow">El canapé, abierto</p><h3>' + S.canape.t + '</h3><p class="s-card-d">' + S.canape.donde + '</p>' +
        '<p class="s-side-t">Se levanta con su mecanismo de pistones y deja todo el hueco libre para guardar. ' + f.d + '.</p>' +
        LM.precio({ p: f.p, r: f.r }, { desde: true, cuota: false }) +
        '<button class="lm-btn lm-btn--line lm-btn--full" type="button" data-cerrar>Cerrar el canapé</button>' +
        '<button class="lm-btn lm-btn--video lm-btn--full" type="button" data-ver="bases">Quiero verlo en videollamada</button>';
    } else if (p) {
      h = '<p class="lm-eyebrow">En el showroom</p><h3>' + p.titulo + '</h3><p class="s-card-d">' + c.donde + '</p>' +
        '<p class="s-side-t">' + p.diferencia + '</p>' +
        /* Paco, 10/11: fuera el esquema de capas de la ficha lateral (ya sale en la ventana «Capas» en 3D) */
        '<button class="lm-btn lm-btn--video lm-btn--full" type="button" data-ver="' + k + '">Quiero verlo en videollamada</button>' +
        '<a class="lm-link" href="' + LM.href(p.url) + '">Ver la ficha del colchón</a>';
    } else {
      h = '<p class="lm-eyebrow">En el showroom</p><h3>' + c.t + '</h3><p class="s-card-d">' + c.donde + '</p>' +
        '<p class="s-side-t">Almohadas de látex y viscoelásticas, y el edredón que regalamos con los packs de colchón y canapé.</p>' +
        '<button class="lm-btn lm-btn--video lm-btn--full" type="button" data-ver="almohadas">Quiero verlas en videollamada</button>' +
        '<a class="lm-link" href="' + LM.href(c.url) + '">Ver almohadas</a>';
    }
    side.innerHTML = h;
    LM.fill(side);
  }

  /* Foto grande con fundido entre fotos; los puntos solo en la foto de frente del colchón */
  var capaVisible = imgA;
  function pintarFoto() {
    var fs = lista(), f = fs[R.foto], otra = capaVisible === imgA ? imgB : imgA;
    otra.srcset = srcset(f[0]); otra.sizes = '(max-width: 900px) 100vw, 62vw'; otra.src = src(f[0], 1600);
    otra.alt = (R.canape ? S.canape.t : S.camas[R.cama].t) + ': ' + f[1];
    var mostrar = function () { otra.classList.add('is-on'); capaVisible.classList.remove('is-on'); capaVisible = otra; };
    if (otra.complete && otra.naturalWidth) mostrar(); else { otra.onload = mostrar; otra.onerror = mostrar; }
    $('#s-room-cap').textContent = (R.canape ? 'Canapé abierto' : S.camas[R.cama].t) + ' · ' + f[1] + ' · ' + (R.foto + 1) + '/' + fs.length;
    var c = S.camas[R.cama], pts = '';
    if (!R.canape && R.foto === 0 && c.puntos) {
      pts = '<button type="button" class="s-spot" data-capas style="left:' + c.puntos.capas[0] + '%;top:' + c.puntos.capas[1] + '%"><i aria-hidden="true"></i><span>Capas</span></button>' +
        '<button type="button" class="s-spot" data-abrir style="left:' + c.puntos.canape[0] + '%;top:' + c.puntos.canape[1] + '%"><i aria-hidden="true"></i><span>Abrir el canapé</span></button>';
    }
    $('#s-room-pts').innerHTML = pts;
    $('#s-room-th').innerHTML = fs.map(function (x, i) {
      return '<button type="button" role="listitem" class="s-room-t' + (i === R.foto ? ' is-on' : '') + '" data-foto="' + i + '" aria-label="' + x[1] + '"' + (i === R.foto ? ' aria-current="true"' : '') + '>' +
        '<img src="' + src(x[0], 900) + '" alt="" width="900" height="600" loading="lazy"><span>' + x[1] + '</span></button>';
    }).join('');
    var b = $('#s-canape'), conCanape = !!(c.puntos);
    b.hidden = !R.canape && (!conCanape || R.foto === 0); // en la foto de frente ya está el punto «Abrir el canapé»
    b.textContent = R.canape ? 'Cerrar el canapé' : 'Abrir el canapé';
    b.setAttribute('aria-pressed', R.canape);
  }
  function verCama(k) {
    R.cama = k; R.foto = 0; R.canape = false;
    pintarFoto(); pintarFicha();
    LM.track('showroom_cama', { item: k });
  }
  function canape(on) {
    R.canape = on; R.foto = 0; pintarFoto(); pintarFicha();
    if (on) LM.track('showroom_canape', { cama: R.cama });
  }
  function mover(d) { var n = lista().length; R.foto = (R.foto + d + n) % n; pintarFoto(); }

  $('#s-room').addEventListener('click', function (e) {
    var t = e.target.closest('[data-foto]'); if (t) { R.foto = +t.getAttribute('data-foto'); pintarFoto(); return; }
    if (e.target.closest('[data-prev]')) { mover(-1); return; }
    if (e.target.closest('[data-next]')) { mover(1); return; }
    if (e.target.closest('#s-canape')) { canape(!R.canape); return; }
    if (e.target.closest('[data-abrir]')) { canape(true); return; }
    if (e.target.closest('[data-cerrar]')) { canape(false); return; }
    if (e.target.closest('[data-capas]')) { abrirCapas(R.cama, e.target.closest('[data-capas]')); LM.track('showroom_capas', { cama: R.cama }); return; }
    var v = e.target.closest('[data-ver]'); if (v) { marcarInteres(v.getAttribute('data-ver')); $('#reserva').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  });
  // Deslizar el dedo sobre la foto para pasar a la siguiente
  var x0 = null;
  ph.addEventListener('pointerdown', function (e) { if (!e.target.closest('button')) x0 = e.clientX; });
  ph.addEventListener('pointerup', function (e) { if (x0 == null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1); });
  ph.addEventListener('pointercancel', function () { x0 = null; });
  ph.setAttribute('tabindex', '0');
  ph.addEventListener('keydown', function (e) { if (e.target !== ph) return; if (e.key === 'ArrowLeft') { mover(-1); e.preventDefault(); } if (e.key === 'ArrowRight') { mover(1); e.preventDefault(); } });
  $('#s-full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else if (ph.requestFullscreen) ph.requestFullscreen();
  });
  $('#s-back').addEventListener('click', volverSala);
  // Precarga: las fotos de frente de cada cama y el canapé abierto, para que el cambio sea inmediato
  addEventListener('load', function () {
    var w = (ph.clientWidth * (devicePixelRatio || 1)) > 1600 ? 2560 : 1600;
    S.orden.map(function (k) { return S.camas[k].fotos[0][0]; }).concat(S.canape.fotos.map(function (f) { return f[0]; }))
      .forEach(function (n) { var i = new Image(); i.src = src(n, w); });
  });

  /* ================= RESERVA ================= */
  var form = $('#s-form'), R = { dia: null, hora: null, interes: [], canal: 'WhatsApp' };
  function madrid() {
    var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { d: new Date(+p.year, +p.month - 1, +p.day), min: +p.hour * 60 + +p.minute };
  }
  var hoy = madrid(), dias = [], d = new Date(hoy.d);
  if (hoy.min > 16 * 60 + 30) d.setDate(d.getDate() + 1);
  while (dias.length < 6) { if (d.getDay() > 0 && d.getDay() < 6) dias.push(new Date(d)); d.setDate(d.getDate() + 1); }
  var fmtD = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  var fmtL = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  function mismoDia(a, b) { return a.toDateString() === b.toDateString(); }
  function etiqueta(x) {
    var man = new Date(hoy.d); man.setDate(man.getDate() + 1);
    return mismoDia(x, hoy.d) ? 'Hoy' : mismoDia(x, man) ? 'Mañana' : fmtD.format(x).replace('.', '');
  }
  function chips(el, list, sel, multi) {
    el.innerHTML = list.map(function (o) {
      var on = multi ? sel.indexOf(o[0]) > -1 : sel === o[0];
      return '<button type="button" class="s-chip" ' + (multi ? 'aria-pressed' : 'role="radio" aria-checked') + '="' + on + '" data-v="' + o[0] + '">' + o[1] + '</button>';
    }).join('');
  }
  function pintarDias() { chips($('#s-dias'), dias.map(function (x, i) { return [String(i), etiqueta(x)]; }), R.dia); }
  function pintarHoras() {
    var esHoy = R.dia !== null && mismoDia(dias[+R.dia], hoy.d), hs = [];
    for (var m = 9 * 60; m <= 17 * 60 + 30; m += 30) if (!esHoy || m >= hoy.min + 60) hs.push([String(m), Math.floor(m / 60) + ':' + (m % 60 ? '30' : '00')]);
    if (R.hora && !hs.some(function (h) { return h[0] === R.hora; })) R.hora = null;
    chips($('#s-horas'), hs, R.hora);
    if (R.dia === null) $('#s-horas').innerHTML = '<p class="lm-note">Primero elige el día.</p>';
  }
  var INT = LM.ORDEN.map(function (k) { return [k, LM.PRODUCTOS[k].nombre]; }).concat([['bases', 'Canapés y bases'], ['almohadas', 'Almohadas'], ['nose', 'Aún no lo sé']]);
  function pintarInteres() { chips($('#s-interes'), INT, R.interes, true); }
  function marcarInteres(k) { if (R.interes.indexOf(k) < 0) R.interes.push(k); pintarInteres(); resumen(); }
  function resumen() {
    var nom = INT.filter(function (o) { return R.interes.indexOf(o[0]) > -1; }).map(function (o) { return o[1]; });
    var hora = R.hora ? Math.floor(R.hora / 60) + ':' + (R.hora % 60 ? '30' : '00') : null;
    $('#s-sum').innerHTML =
      '<div><dt>Día</dt><dd>' + (R.dia !== null ? fmtL.format(dias[+R.dia]) : '<span class="s-sum-no">Sin elegir</span>') + '</dd></div>' +
      '<div><dt>Hora</dt><dd>' + (hora || '<span class="s-sum-no">Sin elegir</span>') + '</dd></div>' +
      '<div><dt>Por</dt><dd>' + R.canal + '</dd></div>' +
      '<div><dt>Para ver</dt><dd>' + (nom.length ? nom.join(', ') : 'Lo que quieras') + '</dd></div>';
  }
  $('#s-dias').addEventListener('click', function (e) { var b = e.target.closest('.s-chip'); if (!b) return; R.dia = b.getAttribute('data-v'); pintarDias(); pintarHoras(); resumen(); });
  $('#s-horas').addEventListener('click', function (e) { var b = e.target.closest('.s-chip'); if (!b) return; R.hora = b.getAttribute('data-v'); pintarHoras(); resumen(); });
  $('#s-interes').addEventListener('click', function (e) {
    var b = e.target.closest('.s-chip'); if (!b) return; var v = b.getAttribute('data-v'), i = R.interes.indexOf(v);
    if (i > -1) R.interes.splice(i, 1); else R.interes.push(v); pintarInteres(); resumen();
  });
  $('#s-canal').addEventListener('change', function (e) { R.canal = e.target.value; resumen(); });

  function telOk(v) { var n = v.replace(/[\s.-]/g, '').replace(/^(\+34|0034)/, ''); return /^[6789]\d{8}$/.test(n); }
  function err(input, show) { var e = input.closest('.s-field').querySelector('.s-err'); e.hidden = !show; input.setAttribute('aria-invalid', show); }
  form.nombre.addEventListener('blur', function () { if (this.value) err(this, !this.value.trim()); });
  form.tel.addEventListener('blur', function () { if (this.value) err(this, !telOk(this.value)); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    if (R.dia === null) { ok = false; first = first || $('#s-dias'); $('#s-dias').classList.add('is-err'); }
    if (!R.hora) { ok = false; first = first || $('#s-horas'); $('#s-horas').classList.add('is-err'); }
    if (!form.nombre.value.trim()) { ok = false; err(form.nombre, true); first = first || form.nombre; }
    if (!telOk(form.tel.value)) { ok = false; err(form.tel, true); first = first || form.tel; }
    var priv = form.privacidad.checked; $('.s-err-priv').hidden = priv; if (!priv) { ok = false; first = first || form.privacidad; }
    setTimeout(function () { $$('.is-err').forEach(function (x) { x.classList.remove('is-err'); }); }, 900);
    if (!ok) { first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); if (first.focus) first.focus({ preventScroll: true }); return; }
    var dia = dias[+R.dia], h = +R.hora, nombre = form.nombre.value.trim();
    LM.track('generate_lead', { method: 'videollamada', source: 'showroom_live', canal: R.canal, interes: R.interes.join(',') });
    var ini = new Date(dia); ini.setHours(Math.floor(h / 60), h % 60);
    var fin = new Date(ini.getTime() + 30 * 60000);
    function ics(x) { return x.getFullYear() + String(x.getMonth() + 1).padStart(2, '0') + String(x.getDate()).padStart(2, '0') + 'T' + String(x.getHours()).padStart(2, '0') + String(x.getMinutes()).padStart(2, '0') + '00'; }
    var cal = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lo Monaco//Showroom Live//ES\r\nBEGIN:VEVENT\r\nUID:' + Date.now() + '@grupolomonaco.com\r\nDTSTAMP:' + ics(new Date()) + '\r\nDTSTART;TZID=Europe/Madrid:' + ics(ini) +
      '\r\nDTEND;TZID=Europe/Madrid:' + ics(fin) + '\r\nSUMMARY:Videollamada Showroom Live · Lo Monaco\r\nDESCRIPTION:Te llamamos por ' + R.canal + '. Si necesitas cambiarla\\, llama al ' + C.telefono.v + '.\r\nEND:VEVENT\r\nEND:VCALENDAR';
    var url = URL.createObjectURL(new Blob([cal], { type: 'text/calendar' }));
    form.hidden = true;
    var done = $('#s-done');
    done.innerHTML = '<span class="s-done-ok">' + LM.ico('check') + '</span><h3>¡Hecho, ' + esc(nombre) + '!</h3>' +
      '<p>Te llamamos el <b>' + fmtL.format(dia) + ' a las ' + Math.floor(h / 60) + ':' + (h % 60 ? '30' : '00') + '</b> por <b>' + R.canal + '</b> al ' + esc(form.tel.value) + '.</p>' +
      '<div class="s-done-cta"><a class="lm-btn" href="' + url + '" download="videollamada-lomonaco.ics">Añadir a mi calendario</a><a class="lm-btn lm-btn--line" href="colchones.html">Mientras, mira los colchones</a></div>' +
      '<p class="lm-note">Si necesitas cambiarla, llámanos al ' + LM.mark(C.telefono, C.telefono.v) + '. ' + LM.pend('Maqueta: no se ha enviado nada') + '</p>';
    done.hidden = false; done.focus();
  });
  pintarDias(); pintarHoras(); pintarInteres(); resumen();
  $('#s-call').innerHTML = LM.llamar('showroom-reserva', { label: 'Llámanos', cls: 'lm-call--big' });

  /* ================= DETALLES Y DUDAS ================= */
  $('#s-det').innerHTML = S.detalles.map(function (d) {
    return '<figure class="s-det-i"><img src="../img/sr2-' + d[0] + '-900.webp" srcset="../img/sr2-' + d[0] + '-900.webp 900w, ../img/sr2-' + d[0] + '-1600.webp 1600w" sizes="(max-width: 700px) 100vw, 33vw" alt="' + d[1] + '" width="900" height="600" loading="lazy"><figcaption>' + d[1] + '</figcaption></figure>';
  }).join('');
  $('#s-faq').innerHTML = LM.faqHTML([
    ['¿Cuánto cuesta la videollamada?', LM.c('videollamada') + '. No tienes que comprar nada.'],
    ['¿Qué necesito?', 'Un móvil con WhatsApp o un ordenador con cámara. Si lo prefieres, te llamamos por teléfono normal. Canales: ' + LM.c('videoCanales') + '.'],
    ['¿Cuánto dura?', LM.c('videoDuracion')],
    ['¿Puedo comprar durante la llamada?', 'Sí. Te ayudamos a elegir medida y base, y puedes hacer el pedido por teléfono o en la web.'],
    ['¿Puedo ir al showroom en persona?', LM.c('showroomDir'), true]
  ]);

  /* Barra fija en móvil mientras no se ve el formulario */
  var stick = $('#s-stick'), res = $('#reserva');
  function barra() {
    var r = res.getBoundingClientRect(), on = scrollY > 400 && (r.top > innerHeight || r.bottom < 0);
    stick.classList.toggle('is-on', on); stick.setAttribute('aria-hidden', !on);
    document.body.classList.toggle('lm-has-stick', on);
  }
  addEventListener('scroll', barra, { passive: true }); barra();

  /* ================= CAPAS EN 3D (Paco, 10/11) =================
     El punto «Capas» abre una ventana con el colchón en 3D de la web (el vídeo de «Por dentro» de las fichas):
     con la rueda o el dedo se abre capa a capa, con una tarjeta y un punto por capa. Siempre con «Salir» (y Esc). */
  var CM = null, cmP = 0, cmObj = 0, cmRaf = 0, cmDur = 0, cmVolver = null, cmPasos = [], cmLast = -1;
  var CV = (LM.VIDEO_CAPAS || {}).todos || [], CV_TR = [[0, 0], [.15, .5], [.86, .5], [.97, 1]];
  var NUMS = ['', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez', 'Once', 'Doce'];
  function cmTramo(x) {
    for (var i = 1; i < CV_TR.length; i++) { var a = CV_TR[i - 1], b = CV_TR[i]; if (x <= b[0]) return a[1] + (b[1] - a[1]) * Math.min(1, Math.max(0, (x - a[0]) / (b[0] - a[0]))); }
    return 1;
  }
  function crearCapas() {
    var flechaArr = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    var flechaAb = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
    document.body.insertAdjacentHTML('beforeend', '<div class="s-cm" id="s-cm" hidden role="dialog" aria-modal="true" aria-labelledby="s-cm-t">' +
      '<div class="s-cm-box">' +
        '<div class="s-cm-head"><p class="lm-eyebrow" id="s-cm-k">Capas</p><button type="button" class="s-cm-x" id="s-cm-x">' + LM.ico('close') + 'Salir</button></div>' +
        '<div class="s-cm-in">' +
          '<div class="s-cm-media"><div class="s-cm-cam"><video muted playsinline disablepictureinpicture preload="auto" poster="../img/natura-latex-capas-v2-inicio.webp" aria-hidden="true"></video>' +
            '<div class="s-cm-pts" aria-hidden="true">' + CV.map(function (c, i) { return '<i style="left:' + c[2] + '%;top:' + c[3] + '%">' + (i + 1) + '</i>'; }).join('') + '</div></div>' +
            '<div class="s-cm-bar" aria-hidden="true"><i></i></div></div>' +
          '<div class="s-cm-txt"><p class="s-cm-n" id="s-cm-n"></p><h3 class="s-cm-t" id="s-cm-t"></h3><p class="s-cm-p" id="s-cm-p"></p>' +
            '<div class="s-cm-nav"><button type="button" class="s-cm-prev" data-cm="-1">' + flechaArr + 'Anterior</button><button type="button" class="lm-btn s-cm-next" data-cm="1">Siguiente capa ' + flechaAb + '</button></div>' +
            '<p class="s-cm-aviso"><span class="p-scrub-mouse" aria-hidden="true"><i></i></span>Usa la rueda o desliza para abrir el colchón</p></div>' +
        '</div>' +
      '</div></div>');
    CM = $('#s-cm');
    var v = $('video', CM), url = '../img/natura-latex-capas-v2-' + (innerWidth < 768 ? 640 : 960) + '.mp4';
    v.addEventListener('loadedmetadata', function () { cmDur = v.duration || 0; cmPintar(); });
    if (window.fetch && location.protocol !== 'file:') fetch(url).then(function (r) { if (!r.ok) throw r; return r.blob(); }).then(function (b) { v.src = URL.createObjectURL(b); }).catch(function () { v.src = url; });
    else v.src = url;
    CM.addEventListener('click', function (e) {
      if (e.target === CM || e.target.closest('#s-cm-x')) { cerrarCapas(); return; }
      var b = e.target.closest('[data-cm]'); if (!b) return;
      var on = cmActual(), sig = Math.min(cmPasos.length - 1, Math.max(0, on + +b.getAttribute('data-cm')));
      cmIr(cmPasos[sig].a + .01);
    });
    /* Paco, 10/11 · falso 3D con el ratón: el cuadro se inclina unos grados hacia el cursor y el colchón se desplaza
       un poco por dentro (con sus puntos). Suave, sin bamboleo; vuelve al centro al salir. No en táctil ni con «reducir movimiento» */
    if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
      var med = $('.s-cm-media', CM), cam = $('.s-cm-cam', CM), tg = { x: 0, y: 0 }, now = { x: 0, y: 0 }, tRaf = 0;
      var tilt = function () {
        tRaf = 0; now.x += (tg.x - now.x) * .08; now.y += (tg.y - now.y) * .08;
        med.style.transform = 'rotateY(' + (now.x * 7).toFixed(2) + 'deg) rotateX(' + (-now.y * 5).toFixed(2) + 'deg)';
        cam.style.transform = 'translate3d(' + (-now.x * 12).toFixed(1) + 'px,' + (-now.y * 9).toFixed(1) + 'px,0) scale(1.06)';
        if (Math.abs(tg.x - now.x) > .002 || Math.abs(tg.y - now.y) > .002) tRaf = requestAnimationFrame(tilt);
      };
      CM.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = med.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        tg.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * .75)));
        tg.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * .75)));
        if (!tRaf) tRaf = requestAnimationFrame(tilt);
      });
      CM.addEventListener('pointerleave', function () { tg.x = tg.y = 0; if (!tRaf) tRaf = requestAnimationFrame(tilt); });
    }
    var RECO = 4800, RECO_T = 2200, ty = null;
    CM.addEventListener('wheel', function (e) { e.preventDefault(); cmIr(cmObj + e.deltaY * (e.deltaMode === 1 ? 40 : 1) / RECO); }, { passive: false });
    CM.addEventListener('touchstart', function (e) { ty = e.target.closest('button') ? null : e.touches[0].clientY; }, { passive: true });
    CM.addEventListener('touchmove', function (e) { if (ty === null) return; e.preventDefault(); var y = e.touches[0].clientY; cmIr(cmObj + (ty - y) / RECO_T); ty = y; }, { passive: false });
    CM.addEventListener('touchend', function () { ty = null; });
    document.addEventListener('keydown', function (e) {
      if (!CM || CM.hidden) return;
      if (e.key === 'Escape') { cerrarCapas(); return; }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); cmIr(cmObj + .06); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); cmIr(cmObj - .06); }
    });
  }
  function cmActual() { var on = 0; cmPasos.forEach(function (s, i) { if (cmP >= s.a - .001) on = i; }); return on; }
  function cmIr(x) { cmObj = Math.min(1, Math.max(0, x)); if (!cmRaf) cmRaf = requestAnimationFrame(cmBucle); }
  function cmBucle() { cmRaf = 0; cmP += (cmObj - cmP) * .16; if (Math.abs(cmObj - cmP) < .0008) cmP = cmObj; cmPintar(); if (cmP !== cmObj) cmRaf = requestAnimationFrame(cmBucle); }
  function cmPintar() {
    var v = $('video', CM);
    if (cmDur && !v.seeking) { var t = cmTramo(cmP) * (cmDur - .05); if (Math.abs(v.currentTime - t) > .02) v.currentTime = t; }
    $('.s-cm-bar i', CM).style.transform = 'scaleX(' + cmP.toFixed(3) + ')';
    CM.classList.toggle('is-empezado', cmP > .02);
    var on = cmActual(); if (on === cmLast) return; cmLast = on;
    var s = cmPasos[on];
    $('#s-cm-n').textContent = s.k; $('#s-cm-t').textContent = s.t; $('#s-cm-p').textContent = s.p;
    $$('.s-cm-pts i', CM).forEach(function (d, i) { d.classList.toggle('is-on', s.pt === i); });
    $('.s-cm-prev', CM).disabled = on === 0; $('.s-cm-next', CM).hidden = on === cmPasos.length - 1;
    $('.s-cm-next', CM).firstChild.textContent = on === 0 ? 'Empezar ' : 'Siguiente capa ';
  }
  function abrirCapas(k, desde) {
    if (!CM) crearCapas();
    var P = LM.PRODUCTOS[k] || LM.PRODUCTOS.latex, n = CV.length, A0 = .15, A1 = .86, tr = (A1 - A0) / n;
    cmPasos = [{ a: 0, k: 'Capa a capa', t: 'Así es tu ' + P.nombre + '.', p: 'Lo abrimos capa a capa: usa la rueda, desliza o pulsa «Empezar».', pt: -1 }]
      .concat(CV.map(function (c, i) { return { a: A0 + i * tr, k: 'Capa ' + (i < 9 ? '0' : '') + (i + 1) + ' de ' + n, t: c[0], p: c[1], pt: i }; }))
      .concat([{ a: A1, k: P.altura + ' de descanso', t: (NUMS[n] || n) + ' capas. Un solo objetivo.', p: 'Que duermas fresco y te levantes descansado.', pt: -1 }]);
    $('#s-cm-k').textContent = 'Capas · ' + P.nombre;
    cmVolver = desde || document.activeElement; cmP = cmObj = 0; cmLast = -1;
    CM.hidden = false; document.documentElement.classList.add('s-cm-open');
    cmPintar(); $('#s-cm-x').focus({ preventScroll: true });
  }
  function cerrarCapas() {
    CM.hidden = true; document.documentElement.classList.remove('s-cm-open');
    if (cmVolver && cmVolver.focus) cmVolver.focus({ preventScroll: true });
  }

  LM.fill(document);
})();

/* Paco, 12/11 · Avatar «en línea» (abajo a la derecha). Al pasar el ratón salen bocadillos con dudas típicas;
   cada uno lleva a reservar la videollamada. La foto es provisional hasta tener la de un asesor del showroom. */
(function () {
  var C = LM.CONFIG, ahora = new Date(), d = ahora.getDay(), h = ahora.getHours() + ahora.getMinutes() / 60;
  var online = d > 0 && d < 6 && h >= 9 && h < 18; // horario: lunes a viernes de 9:00 a 18:00
  var DUDAS = [
    ['¿Puedo verlo sin ir a la tienda?', 'Sí. Te enseñamos el showroom en directo.'],
    ['¿Me abrís el canapé?', 'Claro. Lo abrimos y ves todo lo que cabe.'],
    ['¿Cuánto cuesta?', LM.c('videollamada') + '.'],
    ['¿Qué necesito?', 'Un móvil con WhatsApp o un ordenador con cámara.']
  ];
  var SIL = '<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#ececee"/><circle cx="60" cy="47" r="21" fill="#c9c9ce"/><path d="M20 120c2-26 19-40 40-40s38 14 40 40z" fill="#c9c9ce"/></svg>';
  var w = document.createElement('div');
  w.className = 'sl-av' + (online ? ' is-online' : '');
  w.innerHTML =
    '<div class="sl-av-pop" id="sl-av-pop">' +
      DUDAS.map(function (q, i) { return '<a class="sl-av-b" href="#reserva" style="--i:' + i + '" data-duda="' + i + '"><b>' + q[0] + '</b><span>' + q[1] + '</span></a>'; }).join('') +
      '<a class="lm-btn lm-btn--video sl-av-cta" href="#reserva" style="--i:' + DUDAS.length + '">' + LM.ico('video') + 'Quiero hacer una videollamada</a>' +
    '</div>' +
    '<button type="button" class="sl-av-btn" aria-expanded="false" aria-controls="sl-av-pop" aria-label="Habla con un asesor del showroom">' +
      '<span class="sl-av-ph">' + SIL + '</span>' +
      '<span class="sl-av-st"><i></i>' + (online ? 'En línea' : 'Reserva tu hora') + '</span>' +
    '</button>' + LM.pend('foto real de un asesor del showroom (recortada, mirando a cámara)');
  document.body.appendChild(w);
  var b = w.querySelector('.sl-av-btn');
  function abrir(on) { w.classList.toggle('is-open', on); b.setAttribute('aria-expanded', on); }
  if (!matchMedia('(hover: none)').matches) {
    w.addEventListener('mouseenter', function () { abrir(true); });
    w.addEventListener('mouseleave', function () { abrir(false); });
  }
  b.addEventListener('click', function () { abrir(!w.classList.contains('is-open')); });
  document.addEventListener('click', function (e) { if (!w.contains(e.target)) abrir(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });
  w.addEventListener('focusout', function (e) { if (!w.contains(e.relatedTarget)) abrir(false); });
  w.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#reserva"]'); if (!a) return;
    LM.track('generate_lead_intent', { source: 'avatar_showroom', duda: a.getAttribute('data-duda') || 'cta' }); abrir(false);
  });
  // Mientras se ve el formulario de reserva no hace falta
  var res = document.getElementById('reserva');
  if (res && 'IntersectionObserver' in window) new IntersectionObserver(function (en) { w.classList.toggle('is-off', en[0].isIntersecting); }, { threshold: .25 }).observe(res);
})();
