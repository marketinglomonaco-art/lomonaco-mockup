/* LO MONACO · Diseño 1 · Selector Opción A / Opción B (solo para la maqueta, no va a la web).
   Paco, 10/11: vuelven las dos opciones. Lleva a la misma página en la otra opción. */
(function () {
  'use strict';
  var op = document.body.getAttribute('data-op') || 'a';
  var file = location.pathname.split('/').pop() || 'index.html';
  var resto = location.search + location.hash;
  var d = document.createElement('nav');
  d.className = 'lm-dock lm-ab';
  d.setAttribute('aria-label', 'Opciones del Diseño 1');
  d.innerHTML = [['a', 'Opción A', 'diseno1-a'], ['b', 'Opción B', 'diseno1-b']].map(function (o) {
    return '<a href="../' + o[2] + '/' + file + resto + '"' + (o[0] === op ? ' aria-current="page"' : '') + '>' + o[1] + '</a>';
  }).join('');
  document.body.appendChild(d);
})();
