/* LO MONACO · Versión 4 · Barra de revisión (solo para la maqueta, no va a la web).
   - Selector centrado: Diseño 1 · Opción A / Opción B (misma página en la otra opción).
   - Deslizador «Rojo LM ↔ original»: devuelve a su color de antes los elementos que se pasaron a LM,
     de golpe (sin degradado ni fundido) y por grupos, empezando por los que más superficie ocupan (comun/rojo.css). */
(function () {
  'use strict';
  var OPS = [['a', 'Opción A', 'diseno1-a'], ['b', 'Opción B', 'diseno1-b']];
  var actual = document.body.getAttribute('data-variante') || 'a';
  var file = location.pathname.split('/').pop() || 'index.html';
  // Grupos de mayor a menor superficie: [variable, nombre]
  var G = [['p1', 'Franja de confianza'], ['p2', 'Franja superior'], ['p3', 'Titulares'], ['p4', 'Botones de tarjeta y menú'],
           ['p5', 'Etiquetas de foto'], ['p6', 'Descuentos'], ['p7', 'Barras de firmeza'], ['p8', 'Detalles (flechas, iconos, selección)']];
  // Cambio abrupto (29/10): cada grupo pasa de golpe de LM a su color original al cruzar su umbral
  function umbral(i) { return Math.round((i + 1) * 100 / (G.length + 1)); }

  var box = document.createElement('div');
  box.className = 'lm-dock';
  box.innerHTML =
    '<div class="lm-vers">' +
      '<button type="button" class="lm-vers-b" aria-expanded="false" aria-controls="lm-vers-p"><b>Diseño 1 · ' + actual.toUpperCase() + '</b></button>' +
      '<div class="lm-vers-p" id="lm-vers-p" hidden><p class="lm-vers-t">Diseño 1</p><div class="lm-vers-ops">' +
        OPS.map(function (o) { return '<a href="../' + o[2] + '/' + file + '"' + (o[0] === actual ? ' aria-current="page"' : '') + '>' + o[1] + '</a>'; }).join('') +
      '</div></div>' +
    '</div>' +
    '<label class="lm-rojo"><span class="lm-rojo-k">Rojo</span>' +
      '<input type="range" min="0" max="100" step="1" value="0" aria-label="Devolver el rojo a su color original">' +
      '<span class="lm-rojo-v" aria-live="polite">LM</span></label>';
  document.body.appendChild(box);

  var b = box.querySelector('.lm-vers-b'), pnl = box.querySelector('.lm-vers-p');
  function cerrar() { pnl.hidden = true; b.setAttribute('aria-expanded', 'false'); }
  b.addEventListener('click', function () { var o = pnl.hidden; pnl.hidden = !o; b.setAttribute('aria-expanded', o); });
  document.addEventListener('click', function (e) { if (!box.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

  var r = box.querySelector('input'), out = box.querySelector('.lm-rojo-v'), root = document.documentElement.style;
  function aplicar(v) {
    var ult = '';
    G.forEach(function (g, i) {
      var p = v >= umbral(i) ? 1 : 0;
      root.setProperty('--' + g[0], p);
      if (p > 0) ult = g[1];
    });
    r.style.setProperty('--fill', v + '%');
    var n = G.filter(function (g, i) { return v >= umbral(i); }).length;
    out.textContent = n === 0 ? 'LM' : n === G.length ? 'Original' : n + ' de ' + G.length;
    r.title = ult ? 'Cambiando hasta: ' + ult : 'Todo en color LM';
  }
  // 29/10: cada página empieza siempre en LM (la base); el deslizador no se recuerda entre páginas
  try { sessionStorage.removeItem('lm_rojo'); } catch (e) {}
  r.value = 0; aplicar(0);
  var snap = 0;
  r.addEventListener('input', function () {
    var v = +r.value;
    document.documentElement.classList.add('lm-rojo-snap'); clearTimeout(snap);
    snap = setTimeout(function () { document.documentElement.classList.remove('lm-rojo-snap'); }, 400);
    aplicar(v);
  });
})();
