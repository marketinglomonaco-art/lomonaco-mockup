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

    '<p class="s-sv-hint" id="s-hint"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-4.3-2.5L5.4 15a1.5 1.5 0 0 1 2.6-1.5L8 14"/></svg>Arrastra para mirar</p>' +
    '<button class="s-sv-nav s-sv-prev" type="button" data-go="-1" aria-label="Punto de vista anterior">' + flecha(-1) + '</button>' +
    '<button class="s-sv-nav s-sv-next" type="button" data-go="1" aria-label="Siguiente punto de vista">' + flecha(1) + '</button>' +
    '<button class="s-sv-full" type="button" id="s-sv-full" aria-label="Pantalla completa"><svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>' +
    '<div class="s-sv-cta"><a class="lm-btn lm-btn--buy" href="#reserva">Verlo en directo por videollamada</a></div>';
  // Paco, 09/11: el plano se sustituye por una tira de vistas con su foto, debajo del visor (como la galería de las fichas)
  sv.insertAdjacentHTML('afterend', '<div class="s-vistas" id="s-vistas" role="tablist" aria-label="Desde dónde mirar la sala">' + SALA.map(function (e, i) {
    return '<button type="button" role="tab" class="s-vista" data-i="' + i + '" aria-selected="false">' +
      '<img src="../../../img/sr2-' + e.img + '-900.webp" alt="" width="900" height="' + Math.round(900 * e.h / e.w) + '" loading="lazy" draggable="false">' +
      '<span><b>' + (i < 9 ? '0' : '') + (i + 1) + '</b>' + e.t + '</span></button>';
  }).join('') + '</div>');
  $('#s-vistas').addEventListener('click', function (e) { var b = e.target.closest('.s-vista'); if (b) { ocultarPista(); ir(+b.getAttribute('data-i')); } });

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
    var e = SALA[i], st = document.createElement('div'), n = '../../../img/sr2-' + e.img;
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
        prev.style.transformOrigin = (prevPan * 100) + '% 55%';
        prev.classList.add('is-go'); next.classList.add('is-come');
        setTimeout(function () { prev.remove(); next.classList.remove('is-come'); busy = false; }, 760);
      };
      if (img.decode) img.decode().then(arrancar, arrancar); else img.onload = arrancar;
      setTimeout(arrancar, 1200);
    } else if (prev) prev.remove();
    LM.track('showroom_scene', { scene: SALA[i].img });
  }
  function marcarPlano() {
    $$('.s-vista').forEach(function (b, j) { b.classList.toggle('is-on', j === cur); b.setAttribute('aria-selected', j === cur); });
    var on = $('.s-vista.is-on'), tira = $('#s-vistas');
    if (on && tira && tira.scrollWidth > tira.clientWidth) tira.scrollTo({ left: on.offsetLeft - (tira.clientWidth - on.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
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
    if (!drag) return; drag = null; sv.classList.remove('is-drag');
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
  sv.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cama]'); if (b) { abrirCama(b.getAttribute('data-cama')); return; }
    var g = e.target.closest('[data-go]'); if (g) { ocultarPista(); ir(cur + +g.getAttribute('data-go')); }
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
  addEventListener('load', function () { SALA.forEach(function (e) { var im = new Image(); im.src = '../../../img/sr2-' + e.img + '-' + ((sv.clientWidth * (devicePixelRatio || 1)) > 1700 ? 2560 : 1600) + '.webp'; }); });

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
  function src(n, w) { return '../../../img/sr2-' + n + '-' + w + '.webp'; }
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
    return '<figure class="s-det-i"><img src="../../../img/sr2-' + d[0] + '-900.webp" srcset="../../../img/sr2-' + d[0] + '-900.webp 900w, ../../../img/sr2-' + d[0] + '-1600.webp 1600w" sizes="(max-width: 700px) 100vw, 33vw" alt="' + d[1] + '" width="900" height="600" loading="lazy"><figcaption>' + d[1] + '</figcaption></figure>';
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
