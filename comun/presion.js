/* LO MONACO · Ficha · «Laboratorio de descanso» (29/10, A y B)
   Mapa de presión animado sobre el colchón visto desde arriba, con estética de laboratorio.
   Es una SIMULACIÓN ilustrativa: la intensidad y el reparto salen de la firmeza y la adaptabilidad reales
   de cada colchón (más adaptable → presión más repartida y picos más bajos). No es un ensayo. */
(function () {
  'use strict';
  // 29/10: primero solo en la Opción B; Paco lo pasa también a la A
  var sec = document.querySelector('.p-firm'); if (!sec) return;
  var K = document.body.getAttribute('data-producto') || 'latex', P = LM.PRODUCTOS[K];
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 15 manchas [x, y, radio, intensidad, estirado en x, estirado en y] sobre un colchón de 1000 × 420 (cabeza a la izquierda).
  // Las alargadas (muslos, brazos, espalda) y el leve movimiento de cada una dan la forma orgánica del cuerpo.
  function cero(x, y) { return [x, y, 0, 0, 1, 1]; }
  var POSTURAS = {
    arriba: { t: 'Boca arriba', s: [[115,210,42,.45,1,1.05],[265,150,46,.65,1.1,.9],[265,270,46,.65,1.1,.9],[340,210,44,.38,1.5,.8],[480,210,70,1,1.15,1],[625,182,36,.5,1.6,.75],[625,238,36,.5,1.6,.75],[790,186,28,.4,1.7,.7],[790,234,28,.4,1.7,.7],[915,190,16,.75,1,1],[915,230,16,.75,1,1],[400,98,22,.22,2.2,.6],[400,322,22,.22,2.2,.6],[520,92,14,.2,1,1],[520,328,14,.2,1,1]] },
    lado:   { t: 'De lado',     s: [[115,218,40,.6,1,1.1],[265,205,56,.95,.9,1.25],cero(265,205),[370,208,38,.38,1.6,.85],[485,215,64,1,1.05,1.15],[580,222,34,.5,1.8,.8],[665,228,34,.65,1,1],[790,222,26,.4,1.8,.7],cero(790,222),[915,218,20,.55,1.2,.9],cero(915,218),[330,150,20,.3,1.8,.7],cero(330,150),[430,140,14,.25,1,1],cero(430,140)] },
    abajo:  { t: 'Boca abajo',  s: [[110,195,34,.35,1.1,1],[290,172,50,.6,1.1,.9],[290,248,50,.6,1.1,.9],[365,210,46,.55,1.4,.9],[480,210,58,.72,1.2,1],[600,184,30,.45,1.6,.75],[600,236,30,.45,1.6,.75],[675,182,26,.6,1,1],[675,238,26,.6,1,1],[920,192,14,.5,1,1],[920,228,14,.5,1,1],[175,100,22,.3,1.8,.7],[175,320,22,.3,1.8,.7],[95,112,14,.22,1,1],[95,308,14,.22,1,1]] }
  };
  var ZONA = ['Cabeza', 'Hombros', 'Hombros', 'Espalda', 'Cadera', 'Piernas', 'Piernas', 'Piernas', 'Piernas', 'Pies', 'Pies', 'Brazos', 'Brazos', 'Manos', 'Manos'];
  var a = P.adaptabilidad / 100, f = P.firmeza / 100;
  var spread = .82 + a * .38, pico = 1.12 - a * .48 + (f - .8) * .3;
  var reparto = a >= .95 ? 'Muy repartido' : a >= .82 ? 'Repartido' : 'Más concentrado';

  var box = document.createElement('div');
  box.className = 'lm-w p-lab';
  var ns = 'http://www.w3.org/2000/svg';
  var marcas = [['Cabeza', 115], ['Hombros', 265], ['Cadera', 480], ['Piernas', 700], ['Pies', 915]];
  box.innerHTML =
    '<div class="p-lab-head"><p class="lm-eyebrow"><span class="p-lab-live"></span>Laboratorio de descanso</p>' +
      '<h3 class="p-lab-t">Así reparte tu peso el ' + P.nombre + '.</h3></div>' +
    '<div class="p-lab-in">' +
      '<figure class="p-lab-fig" aria-label="Mapa de presión simulado sobre el colchón">' +
        '<svg viewBox="0 0 1000 440" role="img" aria-hidden="true">' +
          '<defs><pattern id="lab-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#e3e3e6" stroke-width="1"/></pattern>' +
          '<radialGradient id="lab-g"><stop offset="0" stop-color="#7c1919"/><stop offset=".28" stop-color="#b3261e" stop-opacity=".95"/><stop offset=".62" stop-color="#e0705c" stop-opacity=".6"/><stop offset="1" stop-color="#f6c3b8" stop-opacity="0"/></radialGradient>' +
          '<filter id="lab-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>' +
          '<linearGradient id="lab-scan" x1="0" x2="1"><stop offset="0" stop-color="#7c1919" stop-opacity="0"/><stop offset="1" stop-color="#7c1919" stop-opacity=".18"/></linearGradient></defs>' +
          '<rect x="0" y="0" width="1000" height="440" fill="url(#lab-grid)"/>' +
          marcas.map(function (m) { return '<text class="p-lab-z" x="' + m[1] + '" y="34" text-anchor="middle">' + m[0].toUpperCase() + '</text>'; }).join('') +
          '<rect x="40" y="52" width="920" height="330" rx="22" class="p-lab-mat"/>' +

          [180, 330, 480, 630, 780].map(function (x) { return '<path d="M' + x + ' 392v14" class="p-lab-tick"/>'; }).join('') +
        '</svg><canvas class="p-lab-cv" aria-hidden="true"></canvas>' +
        '<figcaption class="p-lab-cap"><span>Colchón visto desde arriba</span><span id="lab-coord">x 000 · y 000</span></figcaption>' +
      '</figure>' +
      '<div class="p-lab-panel">' +
        '<div class="p-lab-tabs" role="tablist" aria-label="Postura">' + Object.keys(POSTURAS).map(function (k, i) {
          return '<button type="button" role="tab" data-postura="' + k + '" aria-selected="' + (i === 0) + '">' + POSTURAS[k].t + '</button>';
        }).join('') + '</div>' +
        '<dl class="p-lab-dl">' +
          '<div><dt>Modelo</dt><dd>' + P.nombre + '</dd></div>' +
          '<div><dt>Postura</dt><dd id="lab-post">Boca arriba</dd></div>' +
          '<div><dt>Firmeza</dt><dd>' + P.firmeza + ' %</dd></div>' +
          '<div><dt>Adaptabilidad</dt><dd>' + P.adaptabilidad + ' %</dd></div>' +
          '<div><dt>Más presión en</dt><dd id="lab-max">Cadera</dd></div>' +
          '<div><dt>Reparto</dt><dd>' + reparto + '</dd></div>' +
        '</dl>' +
        '<div class="p-lab-leg"><span>Baja</span><i></i><span>Alta</span></div>' +
        '<p class="p-lab-note">Simulación ilustrativa hecha con la firmeza y la adaptabilidad de este colchón. No es un ensayo de laboratorio.</p>' +
      '</div>' +
    '</div>';
  sec.appendChild(box);

  // 29/10 · Metaballs: el campo de presión es la suma de todas las manchas, así se funden entre sí como en una
  // cámara de presión real. Se pinta en baja resolución (suavizado al escalar) y encima van las curvas de nivel.
  var cv = box.querySelector('.p-lab-cv'), ctx = cv.getContext('2d');
  var COLS = 250, ROWS = 110, CEL = 4;                 // rejilla de cálculo: 1000 × 440 en celdas de 4
  var off = document.createElement('canvas'); off.width = COLS; off.height = ROWS;
  var octx = off.getContext('2d'), img = octx.createImageData(COLS, ROWS), campo = new Float32Array(COLS * ROWS);
  var NIVELES = [.16, .34, .55, .78];
  // Rampa de color: transparente → rosa → coral → rojo → granate LM
  var RAMPA = [[0, 246, 195, 184, 0], [.12, 246, 195, 184, .55], [.35, 232, 128, 111, .8], [.62, 192, 57, 43, .92], [1, 124, 25, 25, 1]];
  function color(t) {
    for (var i = 1; i < RAMPA.length; i++) if (t <= RAMPA[i][0]) {
      var A = RAMPA[i - 1], B = RAMPA[i], k = (t - A[0]) / (B[0] - A[0]);
      return [A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k, A[3] + (B[3] - A[3]) * k, A[4] + (B[4] - A[4]) * k];
    }
    return RAMPA[RAMPA.length - 1].slice(1);
  }
  var cur = POSTURAS.arriba.s.map(function (b) { return b.slice(); }), obj = POSTURAS.arriba.s, postura = 'arriba';
  var W = 0, H = 0, S = 1;
  function medir() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = Math.round(r.width * dpr); H = Math.round(r.height * dpr); if (!W) return;
    cv.width = W; cv.height = H; S = W / 1000;
  }
  addEventListener('resize', medir);
  // Curvas de nivel (marching squares) sobre la rejilla
  function curvas(nivel) {
    ctx.beginPath();
    for (var y = 0; y < ROWS - 1; y++) for (var x = 0; x < COLS - 1; x++) {
      var a = campo[y * COLS + x], b = campo[y * COLS + x + 1], c = campo[(y + 1) * COLS + x + 1], d = campo[(y + 1) * COLS + x];
      var idx = (a > nivel ? 8 : 0) | (b > nivel ? 4 : 0) | (c > nivel ? 2 : 0) | (d > nivel ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      var px = x * CEL, py = y * CEL;
      var t = [px + CEL * (nivel - a) / (b - a), py], r = [px + CEL, py + CEL * (nivel - b) / (c - b)],
          bo = [px + CEL * (nivel - d) / (c - d), py + CEL], l = [px, py + CEL * (nivel - a) / (d - a)];
      var segs = { 1: [l, bo], 2: [bo, r], 3: [l, r], 4: [t, r], 5: [l, t, bo, r], 6: [t, bo], 7: [l, t], 8: [l, t], 9: [t, bo], 10: [t, r, l, bo], 11: [t, r], 12: [l, r], 13: [bo, r], 14: [l, bo] }[idx];
      for (var k = 0; k < segs.length; k += 2) { ctx.moveTo(segs[k][0] * S, segs[k][1] * S); ctx.lineTo(segs[k + 1][0] * S, segs[k + 1][1] * S); }
    }
    ctx.stroke();
  }
  function pintar(t) {
    if (!W) medir(); if (!W) return;
    var resp = motion ? Math.sin(t / 900) : 0, i, mx = -1, mi = 0;
    var bl = cur.map(function (b, i) {
      var o = obj[i];
      for (var j = 0; j < 6; j++) b[j] += (o[j] - b[j]) * (motion ? .07 : 1);
      // Leve movimiento propio de cada mancha (deriva y latido), para que el cuerpo parezca vivo
      var ph = i * 1.7, w = motion ? 1 : 0;
      var x = b[0] + w * 3.5 * Math.sin(t / 1300 + ph), y = b[1] + w * 3 * Math.cos(t / 1700 + ph * 1.3);
      var sg = Math.max(1, b[2] * spread * .62 * (1 + (i < 4 ? .04 : .015) * resp + w * .05 * Math.sin(t / 1100 + ph)));
      var sx = sg * b[4], sy = sg * b[5];
      return [x, y, 1 / (2 * sx * sx), 1 / (2 * sy * sy), Math.min(1.15, b[3] * pico * 1.05)];
    });
    // Campo de presión = suma de gaussianas (metaballs)
    var data = img.data, p = 0;
    for (var y = 0; y < ROWS; y++) {
      var wy = y * CEL + CEL / 2, dentro = wy > 52 && wy < 382;
      for (var x = 0; x < COLS; x++, p++) {
        var wx = x * CEL + CEL / 2, v = 0;
        if (dentro && wx > 40 && wx < 960) for (i = 0; i < bl.length; i++) {
          var g = bl[i]; if (!g[4]) continue;
          var dx = wx - g[0], dy = wy - g[1]; v += g[4] * Math.exp(-(dx * dx * g[2] + dy * dy * g[3]));
        }
        campo[p] = v;
        var c = color(Math.min(1, v)), q = p * 4;
        data[q] = c[0]; data[q + 1] = c[1]; data[q + 2] = c[2]; data[q + 3] = c[3] * 255;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, 0, 0, W, H);
    // Curvas de nivel: finas, en granate suave; la exterior discontinua
    ctx.lineWidth = Math.max(1, S * 1.4);
    NIVELES.forEach(function (n, k) {
      ctx.setLineDash(k ? [] : [4 * S, 5 * S]);
      ctx.strokeStyle = k ? 'rgba(124,25,25,' + (.22 + k * .08) + ')' : 'rgba(124,25,25,.28)';
      curvas(n);
    });
    ctx.setLineDash([]);
    // Línea de escaneo
    var sx = motion ? 40 + ((t / 3800) % 1) * 920 : 480;
    var gr = ctx.createLinearGradient((sx - 120) * S, 0, sx * S, 0);
    gr.addColorStop(0, 'rgba(124,25,25,0)'); gr.addColorStop(1, 'rgba(124,25,25,.14)');
    ctx.fillStyle = gr; ctx.fillRect((sx - 120) * S, 52 * S, 120 * S, 330 * S);
    ctx.strokeStyle = 'rgba(124,25,25,.8)'; ctx.lineWidth = Math.max(1, 1.5 * S); ctx.setLineDash([4 * S, 5 * S]);
    ctx.beginPath(); ctx.moveTo(sx * S, 52 * S); ctx.lineTo(sx * S, 382 * S); ctx.stroke(); ctx.setLineDash([]);
    // Lecturas
    cur.forEach(function (b, i) { var m = b[3] * b[2]; if (m > mx) { mx = m; mi = i; } });
    if (!pintar.n || t - pintar.n > 120) { box.querySelector('#lab-coord').textContent = 'x ' + String(Math.round(sx)).padStart(3, '0') + ' · y ' + String(Math.round(210 + 60 * Math.sin(t / 700))).padStart(3, '0'); pintar.n = t; }
    box.querySelector('#lab-max').textContent = ZONA[mi];
  }
  var raf = 0, visible = true;
  function bucle(t) { pintar(t); raf = visible ? requestAnimationFrame(bucle) : 0; }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf && motion) raf = requestAnimationFrame(bucle); }, { rootMargin: '100px' }).observe(box);
  if (motion) raf = requestAnimationFrame(bucle); else pintar(0);

  function poner(k, usuario) {
    postura = k; obj = POSTURAS[k].s;
    box.querySelectorAll('[data-postura]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-postura') === k); });
    box.querySelector('#lab-post').textContent = POSTURAS[k].t;
    if (!motion) { cur = obj.map(function (b) { return b.slice(); }); pintar(0); }
    if (usuario) { clearInterval(auto); LM.track('laboratorio_postura', { postura: k }); }
  }
  box.querySelector('.p-lab-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-postura]'); if (b) poner(b.getAttribute('data-postura'), true); });
  // Mientras nadie toca, va cambiando de postura sola
  var orden = Object.keys(POSTURAS), auto = motion ? setInterval(function () { if (visible) poner(orden[(orden.indexOf(postura) + 1) % orden.length]); }, 5200) : 0;
})();
