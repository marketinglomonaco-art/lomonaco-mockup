/* LO MONACO · Ficha · «Así trabajan los muelles» (Paco, 09/11)
   Ilustración de producto (referencia de Paco): el colchón de lado sobre el canapé, con una ventana de corte en el
   lateral que deja ver los muelles ensacados. Una persona tumbada encima respira y cambia de postura; los muelles
   se hunden en onda según el peso de cada parte del cuerpo (mucho en hombros y cadera, casi nada en los pies).
   Solo en los colchones con muelles ensacados. SIMULACIÓN ilustrativa hecha con la firmeza real de cada colchón. */
(function () {
  'use strict';
  var sec = document.querySelector('.p-firm'); if (!sec) return;
  var K = document.body.getAttribute('data-producto') || '', P = LM.PRODUCTOS[K];
  if (!P || P.nucleo.toLowerCase().indexOf('muelles') < 0) return;      // Visco y Gran Natura no llevan muelles
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LATEX = P.nucleo.toLowerCase().indexOf('látex') > -1, CONFORT = LATEX ? 'Látex' : 'Visco';

  // ---- Escena 1000 × 480 (unidades de dibujo). Cabeza a la izquierda.
  var VW = 1000, VH = 480;
  var MX0 = 40, MX1 = 960, TOP = 262, BOT = 402;                       // colchón
  var CX0 = 92, CX1 = 820, CY0 = 280, CY1 = 392;                        // ventana de corte
  var BASE_Y = 380;                                                     // empieza la espuma de la base (dentro del corte)
  var CONF = 24;                                                        // grosor de la capa de confort
  var N = 30, PASO = (CX1 - CX0) / N;                                   // muelles visibles en el corte
  var HUNDE = 44;                                                       // hundimiento máximo (unidades)
  var f = P.firmeza / 100, cede = 2.4 * (1.32 - f);

  // ---- Cuerpo: segmentos [x1, y1, x2, y2, radio, color]; y negativa = por encima de la superficie
  var C_PELO = [112, 62, 42], C_PIEL = [226, 192, 168], C_CAMISA = [176, 168, 190], C_PANTALON = [92, 88, 106], C_CALCETIN = [234, 231, 226];
  var POSTURAS = {
    lado: { t: 'De lado',                                               // como la referencia: de lado, piernas algo flexionadas
      seg: [[150, -64, 150, -64, 33, C_PELO], [183, -52, 210, -50, 15, C_PIEL], [222, -54, 330, -50, 52, C_CAMISA], [330, -46, 420, -46, 41, C_CAMISA],
            [440, -58, 515, -58, 57, C_PANTALON], [262, -104, 392, -96, 18, C_CAMISA], [392, -96, 468, -84, 15, C_CAMISA], [474, -80, 474, -80, 12, C_PIEL],
            [520, -40, 682, -40, 38, C_PANTALON], [690, -30, 828, -28, 26, C_PANTALON], [836, -22, 886, -26, 18, C_CALCETIN]],
      peso: [[150, 34, .32], [262, 44, .98], [372, 40, .34], [480, 50, 1], [640, 46, .5], [770, 44, .28], [866, 22, .25]] },
    arriba: { t: 'Boca arriba',
      seg: [[148, -62, 148, -62, 31, C_PIEL], [134, -54, 134, -54, 29, C_PELO], [181, -44, 204, -42, 14, C_PIEL], [222, -40, 340, -40, 40, C_CAMISA], [340, -35, 430, -34, 34, C_CAMISA],
            [440, -37, 520, -37, 38, C_PANTALON], [236, -18, 468, -16, 16, C_CAMISA], [474, -16, 474, -16, 12, C_PIEL],
            [524, -30, 690, -27, 30, C_PANTALON], [696, -23, 852, -19, 22, C_PANTALON], [866, -22, 872, -58, 15, C_CALCETIN]],
      peso: [[148, 32, .34], [262, 56, .62], [360, 50, .45], [482, 56, 1], [620, 56, .45], [790, 48, .3], [866, 18, .4]] },
    abajo: { t: 'Boca abajo',
      seg: [[146, -58, 146, -58, 31, C_PELO], [180, -44, 204, -42, 14, C_PIEL], [222, -38, 340, -39, 40, C_CAMISA], [340, -36, 430, -35, 33, C_CAMISA],
            [442, -42, 528, -40, 42, C_PANTALON], [236, -17, 462, -15, 15, C_CAMISA], [468, -15, 468, -15, 11, C_PIEL],
            [532, -30, 692, -27, 30, C_PANTALON], [698, -23, 842, -20, 22, C_PANTALON], [850, -16, 892, -12, 13, C_CALCETIN]],
      peso: [[146, 30, .3], [292, 66, .72], [484, 54, .78], [620, 56, .5], [692, 32, .52], [800, 44, .26], [880, 20, .24]] }
  };
  // Todas las posturas con el mismo número de segmentos (para pasar de una a otra con un movimiento continuo)
  (function igualar() {
    var n = 0; Object.keys(POSTURAS).forEach(function (k) { n = Math.max(n, POSTURAS[k].seg.length); });
    Object.keys(POSTURAS).forEach(function (k) { var s = POSTURAS[k].seg; while (s.length < n) { var u = s[s.length - 1]; s.splice(s.length - 1, 0, [u[0], u[1], u[2], u[3], 0.01, u[5]]); } });
  })();
  var ZONAS = [['Cabeza', 150], ['Hombros', 262], ['Cadera', 482], ['Piernas', 680], ['Pies', 866]];
  function zonaDe(x) { var m = ZONAS[0]; ZONAS.forEach(function (z) { if (Math.abs(z[1] - x) < Math.abs(m[1] - x)) m = z; }); return m[0]; }

  var box = document.createElement('div');
  box.className = 'lm-w p-lab p-spr';
  box.innerHTML =
    '<div class="p-lab-head"><p class="lm-eyebrow"><span class="p-lab-live"></span>Muelles ensacados</p>' +
      '<h3 class="p-lab-t">Así se adaptan los muelles del ' + P.nombre + ' a tu cuerpo.</h3></div>' +
    '<div class="p-lab-in">' +
      '<figure class="p-lab-fig p-spr-fig" aria-label="Colchón visto de lado con un corte: los muelles se hunden más bajo los hombros y la cadera">' +
        '<canvas class="p-lab-cv p-spr-cv" aria-hidden="true"></canvas>' +
        '<figcaption class="p-lab-cap"><span>Colchón visto de lado, con un corte</span><span id="spr-cap">De lado</span></figcaption>' +
      '</figure>' +
      '<div class="p-lab-panel">' +
        '<div class="p-lab-tabs" role="tablist" aria-label="Postura">' + ['lado', 'arriba', 'abajo'].map(function (k, i) {
          return '<button type="button" role="tab" data-postura="' + k + '" aria-selected="' + (i === 0) + '">' + POSTURAS[k].t + '</button>';
        }).join('') + '</div>' +
        '<dl class="p-lab-dl">' +
          '<div><dt>Modelo</dt><dd>' + P.nombre + '</dd></div>' +
          '<div><dt>Postura</dt><dd id="spr-post">De lado</dd></div>' +
          '<div><dt>Capa de confort</dt><dd>' + CONFORT + '</dd></div>' +
          '<div><dt>Se hunden más en</dt><dd id="spr-max">Cadera</dd></div>' +
          '<div><dt>Apenas se mueven en</dt><dd id="spr-min">Pies</dd></div>' +
          '<div><dt>Cada muelle</dt><dd>Trabaja por separado</dd></div>' +
        '</dl>' +
        '<p class="p-lab-note">Cada muelle va en su propia bolsa y cede solo lo que pide la parte del cuerpo que tiene encima: tu columna queda recta y, si tu pareja se mueve, tu lado no lo nota. Simulación ilustrativa hecha con la firmeza de este colchón.</p>' +
      '</div>' +
    '</div>';
  sec.appendChild(box);

  var cv = box.querySelector('canvas'), ctx = cv.getContext('2d');
  var W = 0, H = 0, S = 1;
  function medir() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = Math.round(r.width * dpr); H = Math.round(r.height * dpr); if (!W) return;
    cv.width = W; cv.height = H; S = W / VW;
  }
  addEventListener('resize', medir);

  // ---- Estado: segmentos actuales (interpolan hacia la postura) y compresión de cada muelle
  var postura = 'lado', seg = POSTURAS.lado.seg.map(function (s) { return s.slice(); });
  var peso = POSTURAS.lado.peso.map(function (p) { return p.slice(); });
  var comp = new Float32Array(N);
  function cargaEn(x) { var v = 0; peso.forEach(function (g) { var d = (x - g[0]) / g[1]; v += g[2] * Math.exp(-.5 * d * d); }); return v; }
  function hund(x) {                                                    // hundimiento de la superficie (suavizado por la capa de confort)
    if (x <= CX0) x = CX0; if (x >= CX1) x = CX1 - .01;
    var i = (x - CX0) / PASO - .5, i0 = Math.max(0, Math.floor(i)), i1 = Math.min(N - 1, i0 + 1), k = Math.max(0, Math.min(1, i - i0));
    var v = comp[Math.min(N - 1, i0)] + (comp[i1] - comp[Math.min(N - 1, i0)]) * k;
    return v * HUNDE;
  }
  function hundSup(x) {                                                 // fuera del corte, la superficie también cede (y se suaviza)
    var a = hund(x - 14), b = hund(x), c = hund(x + 14);
    var fade = x < CX0 ? Math.max(0, 1 - (CX0 - x) / 60) : x > CX1 ? Math.max(0, 1 - (x - CX1) / 80) : 1;
    return (a + 2 * b + c) / 4 * fade + (x < CX0 || x > CX1 ? (1 - fade) * 0 : 0);
  }

  // ---- Cuerpo con volumen: campo de distancias (unión suave de cápsulas) pintado en un lienzo auxiliar
  var BX0 = 60, BX1 = 940, BY0 = 120, BY1 = 300, RES = 1;               // zona del cuerpo (unidades) y resolución
  var bw = Math.round((BX1 - BX0) * RES), bh = Math.round((BY1 - BY0) * RES);
  var aux = document.createElement('canvas'); aux.width = bw; aux.height = bh;
  var actx = aux.getContext('2d'), img = actx.createImageData(bw, bh);
  function dSeg(px, py, s, dy1, dy2) {
    var ax = s[0], ay = TOP + s[1] + dy1, bx = s[2], by = TOP + s[3] + dy2, vx = bx - ax, vy = by - ay;
    var l2 = vx * vx + vy * vy, t = l2 ? Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2)) : 0;
    var dx = px - ax - vx * t, dy = py - ay - vy * t;
    return Math.sqrt(dx * dx + dy * dy) - s[4];
  }
  function pintarCuerpo(t) {
    var resp = motion ? Math.sin(t / 950) : 0;
    var hs = seg.map(function (s) { return [hundSup(s[0]) * .9, hundSup(s[2]) * .9]; });
    var data = img.data;
    for (var y = 0; y < bh; y++) {
      var py = BY0 + (y + .5) / RES;
      for (var x = 0; x < bw; x++) {
        var px = BX0 + (x + .5) / RES, q = (y * bw + x) * 4, dmin = 1e9, d2 = 1e9, col = null, sum = 0;
        for (var i = 0; i < seg.length; i++) {
          var s = seg[i]; if (s[4] < .5) continue;
          // el pecho respira un poco
          var d = dSeg(px, py, s, hs[i][0], hs[i][1]) - (i >= 2 && i <= 3 ? 1.2 * resp : 0);
          if (d < dmin) { d2 = dmin; dmin = d; col = s[5]; } else if (d < d2) d2 = d;
        }
        // unión suave entre las dos cápsulas más cercanas
        var k = 10, hh = Math.max(k - Math.abs(dmin - d2), 0) / k, dd = Math.min(dmin, d2) - hh * hh * k * .25;
        var a = Math.max(0, Math.min(1, .5 - dd * .9));
        if (a <= 0) { data[q + 3] = 0; continue; }
        // volumen: más claro arriba y hacia dentro, más oscuro en el borde de abajo
        var dentro = Math.max(0, Math.min(1, -dd / 26)), luz = .8 + .22 * Math.sqrt(dentro) - .1 * Math.max(0, (py - (TOP - 30)) / 40);
        data[q] = Math.min(255, col[0] * luz); data[q + 1] = Math.min(255, col[1] * luz); data[q + 2] = Math.min(255, col[2] * luz); data[q + 3] = a * 255;
      }
    }
    actx.putImageData(img, 0, 0);
    ctx.drawImage(aux, BX0 * S, BY0 * S, (BX1 - BX0) * S, (BY1 - BY0) * S);
  }

  function rr(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x * S, y * S, w * S, h * S, r * S); else ctx.rect(x * S, y * S, w * S, h * S); }

  function pintar(t) {
    if (!W) medir(); if (!W) return;
    var vel = motion ? .06 : 1, obj = POSTURAS[postura];
    seg.forEach(function (s, i) { var o = obj.seg[i]; for (var j = 0; j < 5; j++) s[j] += (o[j] - s[j]) * vel; s[5] = o[5]; });
    peso.forEach(function (p, i) { var o = obj.peso[i]; for (var j = 0; j < 3; j++) p[j] += (o[j] - p[j]) * vel; });
    var resp = motion ? 1 + .03 * Math.sin(t / 950) : 1;
    for (var i = 0; i < N; i++) {
      var x = CX0 + PASO * (i + .5), o = Math.pow(1 - Math.exp(-cargaEn(x) * resp * cede), 1.3);
      comp[i] += (o - comp[i]) * (motion ? .1 : 1);
    }
    ctx.clearRect(0, 0, W, H);

    // Sombra en el suelo y canapé de nogal
    var sg = ctx.createRadialGradient(500 * S, 466 * S, 10 * S, 500 * S, 466 * S, 520 * S);
    sg.addColorStop(0, 'rgba(60,40,30,.18)'); sg.addColorStop(1, 'rgba(60,40,30,0)');
    ctx.fillStyle = sg; ctx.fillRect(0, 440 * S, W, 40 * S);
    var gn = ctx.createLinearGradient(0, BOT * S, 0, 462 * S);
    gn.addColorStop(0, '#5a4433'); gn.addColorStop(.5, '#4a382b'); gn.addColorStop(1, '#3b2c22');
    rr(MX0 + 6, BOT - 2, MX1 - MX0 - 12, 60, 10); ctx.fillStyle = gn; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = S;
    for (var v = 0; v < 6; v++) { ctx.beginPath(); ctx.moveTo((MX0 + 20) * S, (BOT + 10 + v * 8) * S); ctx.bezierCurveTo(300 * S, (BOT + 6 + v * 8) * S, 700 * S, (BOT + 14 + v * 8) * S, (MX1 - 20) * S, (BOT + 9 + v * 8) * S); ctx.stroke(); }

    // Colchón: lateral de la funda (la parte de arriba sigue al cuerpo)
    ctx.beginPath();
    ctx.moveTo(MX0 * S, (TOP + 14) * S);
    for (x = MX0; x <= MX1; x += 4) {
      var e = Math.min(1, (x - MX0) / 14, (MX1 - x) / 14), yy = TOP + hundSup(x) + (1 - Math.sqrt(Math.max(0, e))) * 12;
      ctx.lineTo(x * S, yy * S);
    }
    ctx.lineTo(MX1 * S, (BOT - 10) * S); ctx.quadraticCurveTo(MX1 * S, BOT * S, (MX1 - 10) * S, BOT * S);
    ctx.lineTo((MX0 + 10) * S, BOT * S); ctx.quadraticCurveTo(MX0 * S, BOT * S, MX0 * S, (BOT - 10) * S); ctx.closePath();
    var gf = ctx.createLinearGradient(0, TOP * S, 0, BOT * S);
    gf.addColorStop(0, '#fbfaf7'); gf.addColorStop(.12, '#f1eee8'); gf.addColorStop(1, '#e4dfd6');
    ctx.fillStyle = gf; ctx.fill(); ctx.strokeStyle = '#d3cdc3'; ctx.lineWidth = Math.max(1, S); ctx.stroke();
    // costura de la funda y marca
    ctx.strokeStyle = 'rgba(150,140,128,.5)'; ctx.setLineDash([3 * S, 4 * S]);
    ctx.beginPath(); for (x = MX0 + 12; x <= MX1 - 12; x += 4) { var yc = TOP + 10 + hundSup(x); if (x === MX0 + 12) ctx.moveTo(x * S, yc * S); else ctx.lineTo(x * S, yc * S); } ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#a49c92'; ctx.font = '700 ' + (12 * S) + 'px Albert Sans, system-ui, sans-serif'; ctx.textAlign = 'center';
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = (3 * S) + 'px';
    ctx.fillText('LOMONACO', 892 * S, 340 * S);
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

    // Ventana de corte
    ctx.save(); rr(CX0, CY0, CX1 - CX0, CY1 - CY0, 10); ctx.clip();
    ctx.fillStyle = '#e9e4dc'; ctx.fillRect(CX0 * S, CY0 * S, (CX1 - CX0) * S, (CY1 - CY0) * S);
    // base de espuma
    ctx.fillStyle = '#f0ebe3'; ctx.fillRect(CX0 * S, BASE_Y * S, (CX1 - CX0) * S, (CY1 - BASE_Y) * S);
    // muelles: cilindros blancos con su bolsa, más bajos cuanto más se comprimen
    for (i = 0; i < N; i++) {
      var cx = CX0 + PASO * (i + .5), top = CY0 + CONF + 4 + comp[i] * HUNDE, bx0 = cx - PASO / 2 + .9, bwd = PASO - 1.8, alt = BASE_Y - top;
      var gc = ctx.createLinearGradient(bx0 * S, 0, (bx0 + bwd) * S, 0);
      gc.addColorStop(0, '#d4cec5'); gc.addColorStop(.35, '#fdfcfa'); gc.addColorStop(.6, '#f4f1ec'); gc.addColorStop(1, '#cfc8be');
      rr(bx0, top, bwd, alt, 4); ctx.fillStyle = gc; ctx.fill();
      // espiras que se intuyen bajo la tela (más juntas cuanto más comprimido)
      ctx.strokeStyle = 'rgba(160,150,138,.38)'; ctx.lineWidth = Math.max(1, .9 * S);
      var esp = 6; for (var k2 = 1; k2 < esp; k2++) { var ye = top + alt * k2 / esp; ctx.beginPath(); ctx.moveTo((bx0 + 2) * S, (ye + 1.5) * S); ctx.quadraticCurveTo(cx * S, (ye - 2.5) * S, (bx0 + bwd - 2) * S, (ye + 1.5) * S); ctx.stroke(); }
      // tapa del cilindro
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.ellipse(cx * S, (top + 2) * S, (bwd / 2 - 1) * S, 2.4 * S, 0, 0, 7); ctx.fill();
    }
    // capa de confort (visco o látex) que se curva con el cuerpo
    ctx.beginPath();
    for (x = CX0; x <= CX1; x += 3) { var y1 = CY0 - 2 + hund(x) * .98; if (x === CX0) ctx.moveTo(x * S, y1 * S); else ctx.lineTo(x * S, y1 * S); }
    for (x = CX1; x >= CX0; x -= 3) ctx.lineTo(x * S, (CY0 + CONF + 4 + hund(x)) * S);
    ctx.closePath();
    var gl = ctx.createLinearGradient(0, CY0 * S, 0, (CY0 + CONF + HUNDE) * S);
    if (LATEX) { gl.addColorStop(0, '#f6ead0'); gl.addColorStop(1, '#e9d6ae'); } else { gl.addColorStop(0, '#f3ece1'); gl.addColorStop(1, '#e2d5c1'); }
    ctx.fillStyle = gl; ctx.fill(); ctx.strokeStyle = 'rgba(150,130,100,.35)'; ctx.lineWidth = Math.max(1, S); ctx.stroke();
    if (LATEX) { ctx.fillStyle = 'rgba(150,128,92,.45)'; for (x = CX0 + 10; x < CX1; x += 16) { ctx.beginPath(); ctx.arc(x * S, (CY0 + 11 + hund(x)) * S, 1.9 * S, 0, 7); ctx.fill(); } }
    // sombra interior del corte (da profundidad)
    var si = ctx.createLinearGradient(0, CY0 * S, 0, (CY0 + 14) * S); si.addColorStop(0, 'rgba(70,55,40,.22)'); si.addColorStop(1, 'rgba(70,55,40,0)');
    ctx.fillStyle = si; ctx.fillRect(CX0 * S, CY0 * S, (CX1 - CX0) * S, 14 * S);
    ctx.restore();
    rr(CX0, CY0, CX1 - CX0, CY1 - CY0, 10); ctx.strokeStyle = 'rgba(120,108,94,.45)'; ctx.lineWidth = Math.max(1, 1.4 * S); ctx.stroke();

    // Almohada (se hunde un poco con la cabeza)
    var ha = hundSup(150);
    rr(68, TOP - 34 + ha * .8, 168, 36, 18);
    var ga = ctx.createLinearGradient(0, (TOP - 34) * S, 0, (TOP + 2) * S); ga.addColorStop(0, '#ffffff'); ga.addColorStop(1, '#e8e3db');
    ctx.fillStyle = ga; ctx.fill(); ctx.strokeStyle = '#d8d2c8'; ctx.lineWidth = Math.max(1, S); ctx.stroke();

    // Persona
    pintarCuerpo(t);

    // Lecturas
    var mx = 0; for (i = 1; i < N; i++) if (comp[i] > comp[mx]) mx = i;
    var zs = ZONAS.map(function (z) { var j = Math.max(0, Math.min(N - 1, Math.floor((z[1] - CX0) / PASO))); return [z[0], comp[j]]; });
    zs.sort(function (a, b) { return a[1] - b[1]; });
    box.querySelector('#spr-max').textContent = zonaDe(CX0 + PASO * (mx + .5));
    box.querySelector('#spr-min').textContent = zs[0][0];
  }

  var raf = 0, visible = true;
  function bucle(t) { pintar(t); raf = visible ? requestAnimationFrame(bucle) : 0; }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf && motion) raf = requestAnimationFrame(bucle); }, { rootMargin: '100px' }).observe(box);
  if (motion) raf = requestAnimationFrame(bucle); else { for (var n = 0; n < 3; n++) pintar(0); }

  function poner(k, usuario) {
    postura = k;
    box.querySelectorAll('[data-postura]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-postura') === k); });
    box.querySelector('#spr-post').textContent = POSTURAS[k].t; box.querySelector('#spr-cap').textContent = POSTURAS[k].t;
    if (!motion) pintar(0);
    if (usuario) { clearInterval(auto); LM.track('muelles_postura', { postura: k }); }
  }
  box.querySelector('.p-lab-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-postura]'); if (b) poner(b.getAttribute('data-postura'), true); });
  // Como una persona durmiendo: se va dando la vuelta sola hasta que alguien elige una postura
  var orden = ['lado', 'arriba', 'abajo'], auto = motion ? setInterval(function () { if (visible) poner(orden[(orden.indexOf(postura) + 1) % orden.length]); }, 5600) : 0;
})();
