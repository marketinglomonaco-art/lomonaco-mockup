/* LO MONACO · Showroom Live: sala navegable tipo Street View (CSS 3D) y reserva de videollamada.
   Todo el recorrido empuja a lo mismo: reservar la videollamada o llamar. */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, S = LM.SHOWROOM;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $$('[data-estado]').forEach(function (el) { el.innerHTML = LM.estado(); });

  /* ================= VISOR 3D (tipo Street View) =================
     Paco, 06/11: la sala se recorre como en Street View. Cada foto se proyecta por dentro de un cilindro
     (CSS 3D, sin librerías: funciona también abriendo la entrega desde el ordenador). Arrastras para girar la cabeza,
     las flechas del suelo te llevan a otro punto de vista y los puntos de cada cama abren sus capas.
     Sin plano ni selector de zonas: el selector «¿Qué colchón quieres ver?» va fuera del visor. */
  var sv = $('#s-sv');
  var ES = {}; S.escenas.forEach(function (e) { ES[e.id] = e; });
  var RAD = Math.PI / 180, TIRAS = 40;
  var ICO_MAS = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var ICO_MENOS = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
  var CHEVRON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 32 24 16l16 16" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  sv.setAttribute('tabindex', '0');
  sv.setAttribute('role', 'region');
  sv.setAttribute('aria-label', 'Visor del showroom. Flechas del teclado para mirar; las flechas del suelo te mueven por la sala.');
  sv.innerHTML =
    '<div class="s-sv-view" id="s-view"></div>' +
    '<div class="s-ground" id="s-ground" role="group" aria-label="Moverte por el showroom"></div>' +
    '<p class="s-sv-scene" id="s-scene" aria-live="polite"></p>' +
    '<p class="s-sv-hint" id="s-hint"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-4.3-2.5L5.4 15a1.5 1.5 0 0 1 2.6-1.5L8 14"/></svg>Arrastra para mirar</p>' +
    '<div class="s-sv-ctl">' +
      '<button class="s-sv-btn" type="button" data-zoom="1" aria-label="Acercar">' + ICO_MAS + '</button>' +
      '<button class="s-sv-btn" type="button" data-zoom="-1" aria-label="Alejar">' + ICO_MENOS + '</button>' +
      '<button class="s-sv-btn" type="button" id="s-full" aria-label="Pantalla completa"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>' +
    '</div>' +
    '<div class="s-sv-cta"><a class="lm-btn lm-btn--buy" href="#reserva">Verlo en directo por videollamada</a></div>' +
    '<aside class="s-card" id="s-card" hidden></aside>';

  var view = $('#s-view'), ground = $('#s-ground');
  var cam = { yaw: 0, pitch: 0, zoom: 1 }, esc0 = null, pano = null, G = null, busy = false, vel = 0, lim = { y: 0, p: 0 }, pendiente = null;

  /* Geometría: el radio del cilindro sale del tamaño del visor para que la foto lo cubra siempre */
  function geo(e) {
    var vw = sv.clientWidth, vh = sv.clientHeight, asp = e.h / e.w;
    var halfV = Math.atan(asp * e.A * RAD / 2) / RAD;
    var F0 = Math.max((vw / 2) / Math.tan(Math.min(36, e.A / 2 - 9) * RAD), (vh / 2) / Math.tan(halfV * 0.93 * RAD));
    return { vw: vw, vh: vh, asp: asp, halfV: halfV, R: F0, F0: F0 };
  }
  function crearPano(e, g) {
    var R = g.R, arco = R * e.A * RAD, H = arco * g.asp, seg = arco / TIRAS, ancho = seg + 1.4, dT = e.A / TIRAS;
    var grande = arco * (devicePixelRatio || 1) > 1700;
    var url = '../img/' + e.img + e.src[grande ? 1 : 0] + '.webp';
    var p = document.createElement('div'); p.className = 's-pano';
    var h = '<div class="s-cam" style="--img:url(' + url + ')">';
    for (var i = 0; i < TIRAS; i++) {
      var th = -e.A / 2 + (i + 0.5) * dT;
      h += '<i class="s-tira" style="width:' + ancho + 'px;height:' + H + 'px;margin:' + (-H / 2) + 'px 0 0 ' + (-ancho / 2) + 'px;' +
        'background-size:' + arco + 'px ' + H + 'px;background-position:' + (-i * seg - 0.7) + 'px 0;' +
        'transform:rotateY(' + (-th) + 'deg) translateZ(' + (-R) + 'px)"></i>';
    }
    h += e.puntos.map(function (pt) {
      var c = S.camas[pt[0]], th = (pt[1] / 100 - 0.5) * e.A, y = (pt[2] / 100 - 0.5) * H;
      var cap = LM.PRODUCTOS[pt[0]] ? ' · capas' : '';
      return '<button type="button" class="s-spot" data-spot="' + pt[0] + '" style="transform:rotateY(' + (-th) + 'deg) translateZ(' + (-R + 6) + 'px) translateY(' + y + 'px)" aria-label="' + c.t + ': ver ' + (cap ? 'sus capas' : 'detalles') + '">' +
        '<i aria-hidden="true"></i><span>' + c.t + cap + '</span></button>';
    }).join('');
    p.innerHTML = h + '</div>';
    // Precarga de la foto grande si se empezó por la pequeña
    return p;
  }
  function limites() {
    var F = G.F0 * cam.zoom;
    lim.y = Math.max(0, esc0.A / 2 - Math.atan((G.vw / 2) / F) / RAD);
    lim.p = Math.max(0, G.halfV - Math.atan((G.vh / 2) / F) / RAD);
  }
  function pintar() {
    if (!pano) return;
    limites();
    cam.yaw = Math.max(-lim.y, Math.min(lim.y, cam.yaw));
    cam.pitch = Math.max(-lim.p, Math.min(lim.p, cam.pitch));
    var F = G.F0 * cam.zoom;
    pano.style.perspective = F + 'px';
    pano.firstChild.style.transform = 'translateZ(' + F + 'px) rotateX(' + cam.pitch + 'deg) rotateY(' + cam.yaw + 'deg)';
    suelo();
  }

  /* Flechas del suelo, como en Street View: giran con la vista y apuntan hacia donde puedes ir */
  function pintarFlechas() {
    ground.innerHTML = esc0.enlaces.map(function (l) {
      var d = ES[l[0]], atras = Math.abs(l[1]) > 120;
      return '<button type="button" class="s-arrow' + (atras ? ' is-back' : '') + '" data-ir="' + l[0] + '" data-yaw="' + l[1] + '" aria-label="' + (atras ? 'Volver: ' : 'Ir a: ') + d.t + '">' +
        '<span class="s-arrow-c">' + CHEVRON + '</span><span class="s-arrow-t">' + (atras ? 'Volver · ' : '') + d.t + '</span></button>';
    }).join('');
    suelo();
  }
  function suelo() {
    var rx = Math.min(130, G.vw * 0.26), ry = rx * 0.36;
    $$('.s-arrow', ground).forEach(function (b) {
      var a = +b.getAttribute('data-yaw') - cam.yaw; a = ((a + 540) % 360) - 180;
      var x = Math.sin(a * RAD) * rx, y = -Math.cos(a * RAD) * ry;
      b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      b.firstChild.style.transform = 'scaleY(.5) rotate(' + a + 'deg)';
      b.style.zIndex = Math.round(100 - y);
    });
  }

  function girarA(yaw, fin) {
    limites();
    var y1 = Math.max(-lim.y, Math.min(lim.y, yaw)), y0 = cam.yaw, t0 = performance.now();
    if (reduce || Math.abs(y1 - y0) < 0.5) { cam.yaw = y1; pintar(); fin(); return; }
    (function paso(t) {
      var k = Math.min(1, (t - t0) / 280), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      cam.yaw = y0 + (y1 - y0) * e; pintar();
      if (k < 1) requestAnimationFrame(paso); else fin();
    })(t0);
  }
  function ir(id, yawEnlace) {
    var e = ES[id]; if (!e || (esc0 && esc0.id === id && !busy)) return;
    if (busy) { pendiente = [id, yawEnlace]; return; } // se hace al terminar el paso que está en marcha
    cerrarCard(); if (pano) ocultarPista();
    var prev = pano, atras = yawEnlace != null && Math.abs(yawEnlace) > 120;
    function cambiar() {
      esc0 = e; G = geo(e);
      var np = crearPano(e, G); view.appendChild(np); pano = np;
      cam.yaw = 0; cam.zoom = 1; vel = 0; limites(); cam.pitch = -lim.p * 0.6; // un poco hacia abajo: a las camas, no al techo
      pintar(); pintarFlechas();
      $('#s-scene').textContent = e.t;
      marcarPick();
      if (prev && !reduce) {
        busy = true;
        prev.classList.add(atras ? 'is-out-back' : 'is-out');
        np.classList.add(atras ? 'is-in-back' : 'is-in');
        setTimeout(function () { prev.remove(); np.classList.remove('is-in', 'is-in-back'); busy = false; if (pendiente) { var q = pendiente; pendiente = null; ir(q[0], q[1]); } }, 650);
      } else if (prev) prev.remove();
      LM.track('showroom_scene', { scene: e.id });
    }
    if (prev && yawEnlace != null && !atras) { busy = true; girarA(yawEnlace, function () { busy = false; cambiar(); }); } else cambiar();
  }
  function rehacer() {
    if (!esc0) return;
    var vieja = pano; G = geo(esc0); pano = crearPano(esc0, G); view.appendChild(pano); if (vieja) vieja.remove(); pintar();
  }

  /* Arrastrar (ratón o dedo) con inercia; pellizcar para acercar */
  var drag = null, dedos = {}, pinza = null;
  function gradosPorPx() { return 2 * Math.atan((G.vw / 2) / (G.F0 * cam.zoom)) / RAD / G.vw; }
  sv.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, a, .s-card')) return;
    dedos[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(dedos);
    if (ids.length === 2) {
      var a = dedos[ids[0]], b = dedos[ids[1]];
      pinza = { d: Math.hypot(a.x - b.x, a.y - b.y), z: cam.zoom }; drag = null; return;
    }
    drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
    sv.classList.add('is-drag'); vel = 0;
  });
  addEventListener('pointermove', function (e) {
    if (dedos[e.pointerId]) { dedos[e.pointerId].x = e.clientX; dedos[e.pointerId].y = e.clientY; }
    if (pinza) {
      var ids = Object.keys(dedos); if (ids.length < 2) return;
      var a = dedos[ids[0]], b = dedos[ids[1]];
      cam.zoom = Math.max(1, Math.min(2.4, pinza.z * Math.hypot(a.x - b.x, a.y - b.y) / (pinza.d || 1))); pintar(); return;
    }
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now();
    if (!drag.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    if (!drag.moved && e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) { drag = null; sv.classList.remove('is-drag'); return; } // deja hacer scroll
    drag.moved = true; ocultarPista();
    var k = gradosPorPx();
    cam.yaw -= dx * k; cam.pitch += dy * k;
    vel = -dx * k / Math.max(1, now - drag.t) * 16;
    drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
    pintar();
  });
  function soltar(e) {
    delete dedos[e.pointerId];
    if (pinza) { if (Object.keys(dedos).length < 2) pinza = null; return; }
    if (!drag) return; drag = null; sv.classList.remove('is-drag');
    (function inercia() { if (Math.abs(vel) < 0.01) return; cam.yaw += vel; vel *= 0.9; pintar(); requestAnimationFrame(inercia); })();
  }
  addEventListener('pointerup', soltar);
  addEventListener('pointercancel', soltar);
  sv.addEventListener('keydown', function (e) {
    if (e.target !== sv) return;
    var m = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, 4], ArrowDown: [0, -4] }[e.key];
    if (m) { cam.yaw += m[0]; cam.pitch += m[1]; pintar(); ocultarPista(); e.preventDefault(); }
    if (e.key === '+' || e.key === '=') { zoom(1); e.preventDefault(); }
    if (e.key === '-') { zoom(-1); e.preventDefault(); }
  });
  function zoom(d) { cam.zoom = Math.max(1, Math.min(2.4, cam.zoom * (d > 0 ? 1.3 : 1 / 1.3))); pintar(); }
  var pista = true;
  function ocultarPista() { if (pista) { pista = false; $('#s-hint').classList.add('is-off'); } }

  /* Ficha de cada colchón: sus capas (Paco, 06/11), y siempre la videollamada */
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
  function abrirCard(k) {
    var c = S.camas[k], p = LM.PRODUCTOS[k], card = $('#s-card');
    var cerca = ES[k + '-cerca'] && esc0.id !== k + '-cerca';
    var body = '<button class="s-card-x" type="button" aria-label="Cerrar">' + LM.ico('close') + '</button>';
    if (p) {
      body += '<p class="lm-eyebrow">Así es por dentro</p><h3>' + p.titulo + '</h3><p class="s-card-d">' + p.altura + ' · ' + p.nucleo + '</p>' + capasHTML(p);
    } else {
      body += '<img src="' + c.img + '" alt="" width="320" height="200"><p class="lm-eyebrow">En el showroom</p><h3>' + c.t + '</h3><p class="s-card-d">' + c.donde + '</p>';
    }
    body += (cerca ? '<button class="lm-btn lm-btn--line lm-btn--full" type="button" data-ir="' + k + '-cerca">Acércate a ' + (p ? 'este colchón' : 'verlas') + '</button>' : '') +
      '<button class="lm-btn lm-btn--buy lm-btn--full" type="button" data-ver="' + k + '">Quiero verlo en videollamada</button>' +
      '<a class="lm-link" href="' + (p ? LM.href(p.url) : LM.href(c.url)) + '">' + (p ? 'Ver la ficha del colchón' : 'Ver almohadas') + '</a>';
    card.innerHTML = body; card.hidden = false; ocultarPista();
    LM.track('showroom_spot', { spot: k, scene: esc0.id });
  }
  function cerrarCard() { var c = $('#s-card'); if (c) c.hidden = true; }
  sv.addEventListener('click', function (e) {
    var b = e.target.closest('[data-spot]'); if (b) { abrirCard(b.getAttribute('data-spot')); return; }
    if (e.target.closest('.s-card-x')) { cerrarCard(); return; }
    var a = e.target.closest('[data-ir]'); if (a) { var y = a.getAttribute('data-yaw'); ir(a.getAttribute('data-ir'), y == null ? null : +y); return; }
    var z = e.target.closest('[data-zoom]'); if (z) { zoom(+z.getAttribute('data-zoom')); return; }
    var v = e.target.closest('[data-ver]'); if (v) { marcarInteres(v.getAttribute('data-ver')); $('#reserva').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  });
  $('#s-full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else if (sv.requestFullscreen) sv.requestFullscreen();
  });
  var tRes;
  function alCambiar() { clearTimeout(tRes); tRes = setTimeout(rehacer, 120); }
  document.addEventListener('fullscreenchange', alCambiar);
  addEventListener('resize', alCambiar);

  /* «¿Qué colchón quieres ver?» (fuera del visor): te pone delante de esa cama */
  var PICK = ['gold', 'latex', 'gran', 'almohadas'];
  $('#s-pick-row').innerHTML = PICK.map(function (k) {
    var p = LM.PRODUCTOS[k], c = S.camas[k];
    return '<button type="button" class="s-pick-b" data-pick="' + k + '" aria-pressed="false"><img src="' + (p ? p.img : c.img) + '" alt="" width="56" height="56" loading="lazy">' +
      '<span><b>' + (p ? p.nombre : c.t) + '</b><small>' + (p ? p.nucleo : 'Complementos') + '</small></span></button>';
  }).join('');
  $('#s-pick-row').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    var k = b.getAttribute('data-pick');
    sv.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    ir(k + '-cerca', null);
    LM.track('showroom_pick', { item: k });
  });
  function marcarPick() {
    $$('.s-pick-b').forEach(function (b) { b.setAttribute('aria-pressed', !!esc0 && esc0.cama === b.getAttribute('data-pick')); });
  }

  G = geo(S.escenas[0]); ir(S.escenas[0].id, null);
  // Pista inicial: un pequeño giro para que se entienda que se puede mirar
  if (!reduce) setTimeout(function () {
    var t0 = performance.now();
    (function giro(t) { var k = (t - t0) / 1800; if (!pista || k > 1) return; cam.yaw = Math.sin(k * Math.PI * 2) * Math.min(10, lim.y); pintar(); requestAnimationFrame(giro); })(t0);
  }, 900);

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
    return '<figure class="s-det-i' + (d[0] === 7010 ? ' is-tall' : '') + '"><img src="../img/showroom-detalle-' + d[0] + '.webp" alt="' + d[1] + '" width="900" height="' + (d[0] === 7010 ? 1600 : 506) + '" loading="lazy"><figcaption>' + d[1] + '</figcaption></figure>';
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

  LM.fill(document);
})();
