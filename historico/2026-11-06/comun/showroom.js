/* LO MONACO · Showroom Live: visor del showroom y reserva de videollamada.
   Todo el recorrido empuja a lo mismo: reservar la videollamada o llamar. */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, S = LM.SHOWROOM;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $$('[data-estado]').forEach(function (el) { el.innerHTML = LM.estado(); });

  /* ================= VISOR =================
     Paco, 06/11: el visor de siempre (foto que se arrastra para mirar y flechas para avanzar), sin plano ni selector de zonas.
     Probamos la sala tipo Street View y Paco prefiere esta. Fuera del visor: «¿Qué colchón quieres ver?».
     Al pinchar un colchón se ven sus capas. */
  var sv = $('#s-sv');
  var ES = {}; S.escenas.forEach(function (e, i) { ES[e.id] = i; });
  var arrow = function (d) { return '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (d < 0 ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6') + '"/></svg>'; };
  sv.setAttribute('tabindex', '0');
  sv.setAttribute('role', 'region');
  sv.setAttribute('aria-label', 'Visor del showroom. Usa las flechas izquierda y derecha para mirar, y los botones para cambiar de sitio.');
  sv.innerHTML =
    '<div class="s-sv-stages" id="s-stages"></div>' +
    '<p class="s-sv-scene" id="s-scene" aria-live="polite"></p>' +
    '<p class="s-sv-hint" id="s-hint"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-4.3-2.5L5.4 15a1.5 1.5 0 0 1 2.6-1.5L8 14"/></svg>Arrastra para mirar</p>' +
    '<button class="s-sv-nav s-sv-prev" type="button" data-go="-1" aria-label="Sitio anterior">' + arrow(-1) + '</button>' +
    '<button class="s-sv-nav s-sv-next" type="button" data-go="1" aria-label="Avanzar al siguiente sitio">' + arrow(1) + '</button>' +
    '<button class="s-sv-full" type="button" id="s-full" aria-label="Pantalla completa"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>' +
    '<div class="s-sv-cta"><a class="lm-btn lm-btn--buy" href="#reserva">Verlo en directo por videollamada</a></div>' +
    '<aside class="s-card" id="s-card" hidden></aside>';

  var stages = $('#s-stages'), cur = -1, pan = { x: .5, y: .5 }, vel = 0, dims = {}, stage = null, busy = false;

  function medir() {
    var e = S.escenas[Math.max(0, cur)], ratio = e.w / e.h;
    var w = sv.clientWidth, h = sv.clientHeight;
    var sw = Math.max(w * 1.3, h * ratio * 1.08), sh = sw / ratio;
    if (sh < h * 1.05) { sh = h * 1.05; sw = sh * ratio; }
    dims = { w: w, h: h, sw: sw, sh: sh, rx: sw - w, ry: sh - h };
    $$('.s-stage', stages).forEach(function (st) { st.style.width = sw + 'px'; st.style.height = sh + 'px'; });
    pintar();
  }
  function pintar() {
    if (!stage) return;
    pan.x = Math.min(1, Math.max(0, pan.x)); pan.y = Math.min(1, Math.max(0, pan.y));
    stage.style.transform = 'translate3d(' + (-pan.x * dims.rx) + 'px,' + (-pan.y * dims.ry) + 'px,0)';
  }
  function crearEscena(i) {
    var e = S.escenas[i], st = document.createElement('div');
    st.className = 's-stage';
    st.style.width = dims.sw + 'px'; st.style.height = dims.sh + 'px';
    var big = '../../../img/' + e.img + e.src[1] + '.webp', small = '../../../img/' + e.img + e.src[0] + '.webp';
    st.innerHTML = '<img src="' + big + '" srcset="' + small + ' ' + small.match(/-(\d+)\.webp$/)[1] + 'w, ' + big + ' ' + e.w + 'w" sizes="' + Math.round(dims.sw) + 'px" alt="Showroom de Lo Monaco: ' + e.t + '" width="' + e.w + '" height="' + e.h + '" draggable="false">' +
      e.puntos.map(function (p) {
        var c = S.camas[p[0]];
        return '<button type="button" class="s-spot" data-spot="' + p[0] + '" style="left:' + p[1] + '%;top:' + p[2] + '%"><i aria-hidden="true"></i><span>' + c.t + '</span></button>';
      }).join('');
    return st;
  }
  function ir(i, dir) {
    i = (i + S.escenas.length) % S.escenas.length;
    if (i === cur || busy) return;
    var prev = stage;
    cur = i; medir();
    var next = crearEscena(i);
    stages.appendChild(next);
    stage = next; pan = { x: .5, y: .45 }; vel = 0; pintar();
    cerrarCard();
    $('#s-scene').textContent = (i + 1) + ' / ' + S.escenas.length + ' · ' + S.escenas[i].t;
    marcarPick();
    if (prev && !reduce) {
      busy = true;
      next.classList.add(dir < 0 ? 'is-in-back' : 'is-in');
      prev.classList.add(dir < 0 ? 'is-out-back' : 'is-out');
      setTimeout(function () { prev.remove(); next.classList.remove('is-in', 'is-in-back'); busy = false; }, 700);
    } else if (prev) prev.remove();
    LM.track('showroom_scene', { scene: S.escenas[i].id });
  }
  function irA(id) { var i = ES[id]; if (i != null) { ocultarPista(); ir(i, i > cur ? 1 : -1); } }

  /* Arrastrar con ratón o dedo, con un poco de inercia */
  var drag = null;
  sv.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, a, .s-card')) return;
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
    if (!drag) return; drag = null; sv.classList.remove('is-drag');
    (function inercia() { if (Math.abs(vel) < .0005) return; pan.x += vel; vel *= .92; pintar(); requestAnimationFrame(inercia); })();
  });
  sv.addEventListener('keydown', function (e) {
    if (e.target !== sv) return;
    if (e.key === 'ArrowLeft') { pan.x -= .08; pintar(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { pan.x += .08; pintar(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { ir(cur + 1, 1); e.preventDefault(); }
    if (e.key === 'ArrowDown') { ir(cur - 1, -1); e.preventDefault(); }
  });
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
    var c = S.camas[k], p = LM.PRODUCTOS[k], card = $('#s-card'), e = S.escenas[cur];
    var cerca = ES[k + '-cerca'] != null && e.id !== k + '-cerca';
    var body = '<button class="s-card-x" type="button" aria-label="Cerrar">' + LM.ico('close') + '</button>';
    if (p) body += '<p class="lm-eyebrow">Así es por dentro</p><h3>' + p.titulo + '</h3><p class="s-card-d">' + p.altura + ' · ' + p.nucleo + '</p>' + capasHTML(p);
    else body += '<img src="' + c.img + '" alt="" width="320" height="200"><p class="lm-eyebrow">En el showroom</p><h3>' + c.t + '</h3><p class="s-card-d">' + c.donde + '</p>';
    body += (cerca ? '<button class="lm-btn lm-btn--line lm-btn--full" type="button" data-ir="' + k + '-cerca">Verlo de cerca</button>' : '') +
      '<button class="lm-btn lm-btn--buy lm-btn--full" type="button" data-ver="' + k + '">Quiero verlo en videollamada</button>' +
      '<a class="lm-link" href="' + (p ? LM.href(p.url) : LM.href(c.url)) + '">' + (p ? 'Ver la ficha del colchón' : 'Ver almohadas') + '</a>';
    card.innerHTML = body; card.hidden = false; ocultarPista();
    LM.track('showroom_spot', { spot: k, scene: e.id });
  }
  function cerrarCard() { var c = $('#s-card'); if (c) c.hidden = true; }
  sv.addEventListener('click', function (e) {
    var b = e.target.closest('[data-spot]'); if (b) { abrirCard(b.getAttribute('data-spot')); return; }
    if (e.target.closest('.s-card-x')) { cerrarCard(); return; }
    var a = e.target.closest('[data-ir]'); if (a) { irA(a.getAttribute('data-ir')); return; }
    var g = e.target.closest('[data-go]'); if (g) { ir(cur + +g.getAttribute('data-go'), +g.getAttribute('data-go')); return; }
    var v = e.target.closest('[data-ver]'); if (v) { marcarInteres(v.getAttribute('data-ver')); $('#reserva').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  });
  $('#s-full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else if (sv.requestFullscreen) sv.requestFullscreen();
  });
  document.addEventListener('fullscreenchange', function () { setTimeout(medir, 50); });
  addEventListener('resize', medir);

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
    irA(k + '-cerca');
    LM.track('showroom_pick', { item: k });
  });
  function marcarPick() {
    var e = S.escenas[cur];
    $$('.s-pick-b').forEach(function (b) { b.setAttribute('aria-pressed', !!e && e.cama === b.getAttribute('data-pick')); });
  }

  cur = 0; medir(); cur = -1; ir(0, 1);
  // Pista inicial: un pequeño giro para que se entienda que se puede mirar
  if (!reduce) setTimeout(function () {
    var t0 = performance.now();
    (function giro(t) { var k = (t - t0) / 1600; if (!pista || k > 1) return; pan.x = .5 + Math.sin(k * Math.PI * 2) * .12; pintar(); requestAnimationFrame(giro); })(t0);
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
    return '<figure class="s-det-i' + (d[0] === 7010 ? ' is-tall' : '') + '"><img src="../../../img/showroom-detalle-' + d[0] + '.webp" alt="' + d[1] + '" width="900" height="' + (d[0] === 7010 ? 1600 : 506) + '" loading="lazy"><figcaption>' + d[1] + '</figcaption></figure>';
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
