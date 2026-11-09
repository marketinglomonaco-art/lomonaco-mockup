/* LO MONACO · Ficha · «Así trabajan los muelles» (Paco, 09/11)
   Mismo estilo que el «Laboratorio de descanso», debajo de él. Corte lateral del colchón: una persona tumbada
   (respira y cambia de postura) y cada muelle ensacado se hunde según el peso que tiene encima: mucho en la cadera
   y los hombros, menos en las piernas, casi nada en los pies. Solo en los colchones con muelles ensacados.
   Es una SIMULACIÓN ilustrativa: el hundimiento sale de la firmeza real de cada colchón. No es un ensayo. */
(function () {
  'use strict';
  var sec = document.querySelector('.p-firm'); if (!sec) return;
  var K = document.body.getAttribute('data-producto') || '', P = LM.PRODUCTOS[K];
  if (!P || P.nucleo.toLowerCase().indexOf('muelles') < 0) return;      // Visco y Gran Natura no llevan muelles
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CONFORT = P.nucleo.toLowerCase().indexOf('látex') > -1 ? 'Látex' : 'Visco';

  // Coordenadas de dibujo: 1000 × 440. Cabeza a la izquierda, como en el mapa de presión.
  var X0 = 40, X1 = 960, N = 28, ANCHO = (X1 - X0) / N;
  var Y_SUP = 186, Y_CONF = 222, Y_BASE = 380, Y_FIN = 398;           // superficie, fin de la capa de confort, base
  var HUNDE = 78;                                                      // hundimiento máximo dibujado (px)

  // Grosor del cuerpo visto de lado (puntos [x, alto]) y reparto del peso ([x, ancho, peso]) en cada postura
  var POSTURAS = {
    arriba: { t: 'Boca arriba',
      perfil: [[70, 0], [78, 40], [100, 70], [130, 76], [158, 62], [178, 36], [200, 70], [260, 100], [330, 104], [400, 92], [450, 84], [500, 86], [560, 74], [640, 58], [720, 48], [770, 42], [850, 36], [900, 32], [918, 44], [930, 70], [946, 40], [952, 0]],
      peso: [[115, 34, .35], [265, 58, .62], [360, 50, .45], [485, 58, 1], [630, 58, .45], [800, 48, .3], [915, 18, .42]] },
    lado: { t: 'De lado',
      perfil: [[70, 0], [76, 46], [100, 82], [130, 88], [158, 74], [176, 52], [196, 96], [240, 138], [290, 128], [360, 104], [420, 112], [480, 134], [530, 124], [600, 98], [660, 86], [700, 82], [760, 64], [840, 52], [900, 46], [940, 40], [950, 0]],
      peso: [[115, 30, .5], [262, 44, .98], [370, 40, .35], [485, 48, 1], [680, 40, .55], [820, 40, .28], [915, 22, .34]] },
    abajo: { t: 'Boca abajo',
      perfil: [[66, 0], [72, 38], [96, 64], [128, 70], [156, 58], [176, 34], [198, 64], [270, 96], [340, 98], [410, 86], [470, 96], [520, 102], [570, 80], [650, 60], [700, 54], [760, 46], [860, 36], [920, 30], [948, 22], [956, 0]],
      peso: [[112, 30, .3], [300, 70, .72], [480, 54, .78], [620, 58, .5], [690, 34, .55], [820, 44, .26], [925, 20, .3]] }
  };
  var ZONAS = [['Cabeza', 115], ['Hombros', 265], ['Cadera', 485], ['Piernas', 700], ['Pies', 915]];
  function zonaDe(x) { var m = ZONAS[0]; ZONAS.forEach(function (z) { if (Math.abs(z[1] - x) < Math.abs(m[1] - x)) m = z; }); return m[0]; }

  // Cuánto cede cada muelle: un colchón más firme se hunde menos
  var f = P.firmeza / 100, cede = 2.3 * (1.32 - f);

  var box = document.createElement('div');
  box.className = 'lm-w p-lab p-spr';
  box.innerHTML =
    '<div class="p-lab-head"><p class="lm-eyebrow"><span class="p-lab-live"></span>Laboratorio de descanso</p>' +
      '<h3 class="p-lab-t">Así trabajan los muelles del ' + P.nombre + '.</h3></div>' +
    '<div class="p-lab-in">' +
      '<figure class="p-lab-fig" aria-label="Corte lateral del colchón: los muelles se hunden según el peso de cada parte del cuerpo">' +
        '<svg viewBox="0 0 1000 440" role="img" aria-hidden="true">' +
          '<defs><pattern id="spr-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#e3e3e6" stroke-width="1"/></pattern></defs>' +
          '<rect x="0" y="0" width="1000" height="440" fill="url(#spr-grid)"/>' +
          ZONAS.map(function (z) { return '<text class="p-lab-z" x="' + z[1] + '" y="34" text-anchor="middle">' + z[0].toUpperCase() + '</text>'; }).join('') +
        '</svg><canvas class="p-lab-cv" aria-hidden="true"></canvas>' +
        '<figcaption class="p-lab-cap"><span>Colchón visto de lado, en corte</span><span id="spr-lect">muelle 00 · 00 %</span></figcaption>' +
      '</figure>' +
      '<div class="p-lab-panel">' +
        '<div class="p-lab-tabs" role="tablist" aria-label="Postura">' + Object.keys(POSTURAS).map(function (k, i) {
          return '<button type="button" role="tab" data-postura="' + k + '" aria-selected="' + (i === 0) + '">' + POSTURAS[k].t + '</button>';
        }).join('') + '</div>' +
        '<dl class="p-lab-dl">' +
          '<div><dt>Modelo</dt><dd>' + P.nombre + '</dd></div>' +
          '<div><dt>Postura</dt><dd id="spr-post">Boca arriba</dd></div>' +
          '<div><dt>Núcleo</dt><dd>Muelles ensacados</dd></div>' +
          '<div><dt>Capa de confort</dt><dd>' + CONFORT + '</dd></div>' +
          '<div><dt>Se hunden más en</dt><dd id="spr-max">Cadera</dd></div>' +
          '<div><dt>Apenas se mueven en</dt><dd id="spr-min">Pies</dd></div>' +
          '<div><dt>Cada muelle</dt><dd>Trabaja por separado</dd></div>' +
        '</dl>' +
        '<div class="p-lab-leg"><span>Poco</span><i></i><span>Mucho</span></div>' +
        '<p class="p-lab-note">Simulación ilustrativa hecha con la firmeza de este colchón. No es un ensayo de laboratorio.</p>' +
      '</div>' +
    '</div>';
  sec.appendChild(box);

  var cv = box.querySelector('.p-lab-cv'), ctx = cv.getContext('2d');
  var W = 0, H = 0, S = 1;
  function medir() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = Math.round(r.width * dpr); H = Math.round(r.height * dpr); if (!W) return;
    cv.width = W; cv.height = H; S = W / 1000;
  }
  addEventListener('resize', medir);

  // Perfil del cuerpo interpolado (Catmull-Rom) en x
  function altoEn(perfil, x) {
    if (x <= perfil[0][0] || x >= perfil[perfil.length - 1][0]) return 0;
    for (var i = 0; i < perfil.length - 1; i++) if (x <= perfil[i + 1][0]) {
      var p0 = perfil[Math.max(0, i - 1)], p1 = perfil[i], p2 = perfil[i + 1], p3 = perfil[Math.min(perfil.length - 1, i + 2)];
      var t = (x - p1[0]) / (p2[0] - p1[0]), t2 = t * t, t3 = t2 * t;
      return Math.max(0, .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3));
    }
    return 0;
  }
  function cargaEn(peso, x) {
    var v = 0; peso.forEach(function (g) { var d = (x - g[0]) / g[1]; v += g[2] * Math.exp(-.5 * d * d); }); return v;
  }
  var RAMPA = [[0, 196, 190, 182], [.35, 226, 150, 132], [.7, 192, 57, 43], [1, 124, 25, 25]];
  function tono(c) {
    for (var i = 1; i < RAMPA.length; i++) if (c <= RAMPA[i][0]) {
      var A = RAMPA[i - 1], B = RAMPA[i], k = (c - A[0]) / (B[0] - A[0]);
      return 'rgb(' + Math.round(A[1] + (B[1] - A[1]) * k) + ',' + Math.round(A[2] + (B[2] - A[2]) * k) + ',' + Math.round(A[3] + (B[3] - A[3]) * k) + ')';
    }
    return 'rgb(124,25,25)';
  }

  var postura = 'arriba', anterior = 'arriba', mezcla = 1;               // mezcla: 0 → postura anterior, 1 → actual
  var comp = new Float32Array(N);                                       // compresión actual de cada muelle (0–1)
  function objetivo(i, t) {
    var x = X0 + ANCHO * (i + .5), resp = motion ? .035 * Math.sin(t / 900) : 0;
    var a = cargaEn(POSTURAS[anterior].peso, x), b = cargaEn(POSTURAS[postura].peso, x);
    var carga = (a + (b - a) * mezcla) * (1 + resp);
    return Math.pow(1 - Math.exp(-carga * cede), 1.35);   // más contraste: la cadera se hunde mucho, los pies casi nada
  }
  function hundimiento(x) {                                             // la capa de confort reparte: suaviza entre muelles
    var i = (x - X0) / ANCHO - .5, i0 = Math.max(0, Math.min(N - 1, Math.floor(i))), i1 = Math.min(N - 1, i0 + 1), k = Math.max(0, Math.min(1, i - i0));
    return (comp[i0] + (comp[i1] - comp[i0]) * k) * HUNDE;
  }

  function cuerpo(perfil, alfa, t) {
    if (alfa <= .01) return;
    var resp = motion ? 1 + .03 * Math.sin(t / 900) : 1;
    ctx.save(); ctx.globalAlpha = alfa;
    ctx.beginPath();
    var xs = []; for (var x = 60; x <= 960; x += 4) xs.push(x);
    xs.forEach(function (x, j) {
      var h = altoEn(perfil, x) * (x > 190 && x < 460 ? resp : 1), y = Y_SUP + hundimiento(x) * .92 - h;
      if (!j) ctx.moveTo(x * S, (Y_SUP + hundimiento(x)) * S); ctx.lineTo(x * S, y * S);
    });
    for (var j = xs.length - 1; j >= 0; j--) ctx.lineTo(xs[j] * S, (Y_SUP + hundimiento(xs[j]) * .92) * S);
    ctx.closePath();
    var gr = ctx.createLinearGradient(0, 80 * S, 0, Y_SUP * S);
    gr.addColorStop(0, 'rgba(124,25,25,.10)'); gr.addColorStop(1, 'rgba(124,25,25,.20)');
    ctx.fillStyle = gr; ctx.fill();
    ctx.strokeStyle = 'rgba(124,25,25,.6)'; ctx.lineWidth = Math.max(1, 1.6 * S); ctx.stroke();
    ctx.restore();
  }

  function pintar(t) {
    if (!W) medir(); if (!W) return;
    for (var i = 0; i < N; i++) { var o = objetivo(i, t); comp[i] += (o - comp[i]) * (motion ? .08 : 1); }
    if (motion && mezcla < 1) mezcla = Math.min(1, mezcla + .025);
    ctx.clearRect(0, 0, W, H);
    // Base (espuma de abajo) y marco del corte
    ctx.fillStyle = '#ece6dc'; ctx.fillRect(X0 * S, Y_BASE * S, (X1 - X0) * S, (Y_FIN - Y_BASE) * S);
    // Muelles ensacados: bolsa de tela + espiral; se acortan según la compresión
    for (i = 0; i < N; i++) {
      var cx = X0 + ANCHO * (i + .5), top = Y_CONF + comp[i] * HUNDE, alto = Y_BASE - top;
      var bx = (cx - ANCHO / 2 + 1.2) * S, bw = (ANCHO - 2.4) * S;
      ctx.fillStyle = '#f6f2ec'; ctx.strokeStyle = '#d6cfc4'; ctx.lineWidth = Math.max(1, S);
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx, top * S, bw, alto * S, 5 * S); else ctx.rect(bx, top * S, bw, alto * S);
      ctx.fill(); ctx.stroke();
      var vueltas = 5, pasos = vueltas * 16, r = ANCHO / 2 - 6;
      ctx.beginPath();
      for (var k = 0; k <= pasos; k++) {
        var yy = top + 5 + (alto - 10) * k / pasos, xx = cx + r * Math.sin(2 * Math.PI * k / 16);
        if (!k) ctx.moveTo(xx * S, yy * S); else ctx.lineTo(xx * S, yy * S);
      }
      ctx.strokeStyle = tono(comp[i]); ctx.lineWidth = Math.max(1, 2.2 * S); ctx.stroke();
    }
    // Capa de confort: arriba sigue al cuerpo, abajo a los muelles
    ctx.beginPath();
    for (var x = X0; x <= X1; x += 4) { var y = Y_SUP + hundimiento(x); if (x === X0) ctx.moveTo(x * S, y * S); else ctx.lineTo(x * S, y * S); }
    for (x = X1; x >= X0; x -= 4) ctx.lineTo(x * S, (Y_CONF + hundimiento(x) * .98) * S);
    ctx.closePath();
    ctx.fillStyle = CONFORT === 'Látex' ? '#f3e7cc' : '#efe8dc'; ctx.fill();
    ctx.strokeStyle = '#cfc6b8'; ctx.lineWidth = Math.max(1, S); ctx.stroke();
    if (CONFORT === 'Látex') {                                          // perforaciones del látex
      ctx.fillStyle = 'rgba(160,140,108,.55)';
      for (x = X0 + 12; x < X1; x += 18) { var yc = Y_SUP + hundimiento(x) + (Y_CONF - Y_SUP) / 2; ctx.beginPath(); ctx.arc(x * S, yc * S, 2.2 * S, 0, 7); ctx.fill(); }
    }
    // Cuerpo: funde de la postura anterior a la nueva
    if (mezcla < 1) cuerpo(POSTURAS[anterior].perfil, 1 - mezcla, t);
    cuerpo(POSTURAS[postura].perfil, mezcla, t);
    // Línea de lectura que recorre el colchón
    var sx = motion ? X0 + ((t / 4200) % 1) * (X1 - X0) : 485;
    var gr = ctx.createLinearGradient((sx - 110) * S, 0, sx * S, 0);
    gr.addColorStop(0, 'rgba(124,25,25,0)'); gr.addColorStop(1, 'rgba(124,25,25,.10)');
    ctx.fillStyle = gr; ctx.fillRect((sx - 110) * S, 60 * S, 110 * S, (Y_FIN - 60) * S);
    ctx.strokeStyle = 'rgba(124,25,25,.75)'; ctx.lineWidth = Math.max(1, 1.4 * S); ctx.setLineDash([4 * S, 5 * S]);
    ctx.beginPath(); ctx.moveTo(sx * S, 60 * S); ctx.lineTo(sx * S, Y_FIN * S); ctx.stroke(); ctx.setLineDash([]);
    // Lecturas
    var im = Math.max(0, Math.min(N - 1, Math.floor((sx - X0) / ANCHO)));
    if (!pintar.n || t - pintar.n > 120) {
      box.querySelector('#spr-lect').textContent = 'muelle ' + String(im + 1).padStart(2, '0') + ' · ' + String(Math.round(comp[im] * 100)).padStart(2, '0') + ' %';
      pintar.n = t;
    }
    var mx = 0, mn = 0;
    for (i = 1; i < N; i++) { if (comp[i] > comp[mx]) mx = i; }
    // «apenas se mueven»: la zona del cuerpo con menos hundimiento (entre cabeza y pies)
    var minZ = ZONAS.slice().sort(function (a, b) { return objetivoX(a[1]) - objetivoX(b[1]); })[0][0];
    box.querySelector('#spr-max').textContent = zonaDe(X0 + ANCHO * (mx + .5));
    box.querySelector('#spr-min').textContent = minZ;
  }
  function objetivoX(x) { var i = Math.max(0, Math.min(N - 1, Math.floor((x - X0) / ANCHO))); return comp[i]; }

  var raf = 0, visible = true;
  function bucle(t) { pintar(t); raf = visible ? requestAnimationFrame(bucle) : 0; }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf && motion) raf = requestAnimationFrame(bucle); }, { rootMargin: '100px' }).observe(box);
  if (motion) raf = requestAnimationFrame(bucle); else pintar(0);

  function poner(k, usuario) {
    if (k === postura) return;
    anterior = postura; postura = k; mezcla = motion ? 0 : 1;
    box.querySelectorAll('[data-postura]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-postura') === k); });
    box.querySelector('#spr-post').textContent = POSTURAS[k].t;
    if (!motion) pintar(0);
    if (usuario) { clearInterval(auto); LM.track('muelles_postura', { postura: k }); }
  }
  box.querySelector('.p-lab-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-postura]'); if (b) poner(b.getAttribute('data-postura'), true); });
  // Como si la persona se moviera mientras duerme: cambia de postura sola hasta que alguien toca
  var orden = Object.keys(POSTURAS), auto = motion ? setInterval(function () { if (visible) poner(orden[(orden.indexOf(postura) + 1) % orden.length]); }, 5200) : 0;
})();
