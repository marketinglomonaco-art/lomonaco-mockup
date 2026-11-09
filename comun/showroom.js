/* LO MONACO · Showroom Live: recorrido colchón a colchón (fotos de Paco, 09/11) y reserva de videollamada.
   Todo el recorrido empuja a lo mismo: reservar la videollamada o llamar. */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, S = LM.SHOWROOM;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $$('[data-estado]').forEach(function (el) { el.innerHTML = LM.estado(); });

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
        '<button class="lm-btn lm-btn--buy lm-btn--full" type="button" data-ver="bases">Quiero verlo en videollamada</button>';
    } else if (p) {
      h = '<p class="lm-eyebrow">En el showroom</p><h3>' + p.titulo + '</h3><p class="s-card-d">' + c.donde + '</p>' +
        '<p class="s-side-t">' + p.diferencia + '</p>' +
        '<div class="s-side-capas" id="s-capas"><p class="s-side-k">Así es por dentro <small>' + p.altura + ' · ' + p.nucleo + '</small></p>' + capasHTML(p) + '</div>' +
        '<button class="lm-btn lm-btn--buy lm-btn--full" type="button" data-ver="' + k + '">Quiero verlo en videollamada</button>' +
        '<a class="lm-link" href="' + LM.href(p.url) + '">Ver la ficha del colchón</a>';
    } else {
      h = '<p class="lm-eyebrow">En el showroom</p><h3>' + c.t + '</h3><p class="s-card-d">' + c.donde + '</p>' +
        '<p class="s-side-t">Almohadas de látex y viscoelásticas, y el edredón que regalamos con los packs de colchón y canapé.</p>' +
        '<button class="lm-btn lm-btn--buy lm-btn--full" type="button" data-ver="almohadas">Quiero verlas en videollamada</button>' +
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
      pts = '<button type="button" class="s-spot" data-capas style="left:' + c.puntos.capas[0] + '%;top:' + c.puntos.capas[1] + '%"><i aria-hidden="true"></i><span>Por dentro</span></button>' +
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
    $$('.s-pick-b').forEach(function (b) { var on = b.getAttribute('data-pick') === k; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    pintarFoto(); pintarFicha();
    LM.track('showroom_pick', { item: k });
  }
  function canape(on) {
    R.canape = on; R.foto = 0; pintarFoto(); pintarFicha();
    if (on) LM.track('showroom_canape', { cama: R.cama });
  }
  function mover(d) { var n = lista().length; R.foto = (R.foto + d + n) % n; pintarFoto(); }

  $('#s-pick-row').innerHTML = S.orden.map(function (k) {
    var p = LM.PRODUCTOS[k], c = S.camas[k];
    return '<button type="button" role="tab" class="s-pick-b" data-pick="' + k + '" aria-selected="false" tabindex="-1"><img src="' + src(c.fotos[0][0], 900) + '" alt="" width="56" height="56" loading="lazy">' +
      '<span><b>' + (p ? p.nombre : c.t) + '</b><small>' + (p ? p.nucleo : 'Complementos') + '</small></span></button>';
  }).join('');
  $('#s-pick-row').addEventListener('click', function (e) { var b = e.target.closest('[data-pick]'); if (b) verCama(b.getAttribute('data-pick')); });
  $('#s-pick-row').addEventListener('keydown', function (e) {
    var d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
    var i = (S.orden.indexOf(R.cama) + d + S.orden.length) % S.orden.length; verCama(S.orden[i]); $('[data-pick="' + S.orden[i] + '"]').focus(); e.preventDefault();
  });
  $('#s-room').addEventListener('click', function (e) {
    var t = e.target.closest('[data-foto]'); if (t) { R.foto = +t.getAttribute('data-foto'); pintarFoto(); return; }
    if (e.target.closest('[data-prev]')) { mover(-1); return; }
    if (e.target.closest('[data-next]')) { mover(1); return; }
    if (e.target.closest('#s-canape')) { canape(!R.canape); return; }
    if (e.target.closest('[data-abrir]')) { canape(true); return; }
    if (e.target.closest('[data-cerrar]')) { canape(false); return; }
    if (e.target.closest('[data-capas]')) {
      var cp = $('#s-capas'); if (!cp) return;
      cp.classList.remove('is-flash'); void cp.offsetWidth; cp.classList.add('is-flash');
      if (matchMedia('(max-width: 900px)').matches) cp.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      LM.track('showroom_capas', { cama: R.cama }); return;
    }
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
  verCama(S.orden[0]);
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

  LM.fill(document);
})();
