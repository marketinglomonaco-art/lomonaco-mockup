/* PROHIBIDO · Brutalista: cabecera, cinta y pie comunes, y la tarjeta «foto + descuento» */
(function () {
  'use strict';
  var X = window.LMX;
  var pag = document.body.getAttribute('data-pag');
  var cab = document.getElementById('cab');
  if (cab) cab.outerHTML =
    '<header class="cab"><a class="logo" href="brutalista.html">LOMONACO</a>' +
    '<nav><a href="brutalista-colchones.html"' + (pag === 'cat' || pag === 'ficha' ? ' aria-current="page"' : '') + '>Colchones</a>' +
    '<a href="brutalista.html#packs">Packs</a><a href="brutalista.html#condiciones">Condiciones</a></nav>' +
    '<a class="tel" href="' + X.TEL_HREF + '">' + X.TEL + '</a></header>' +
    '<div class="ticker" aria-hidden="true"><span>Hasta −63 % · Almohadas gratis · Envío y montaje gratis en la península · 14 noches de prueba · 10 años de garantía · 3 pagos sin intereses · ' + X.TEL + ' ·</span></div>';
  var pie = document.getElementById('pie');
  if (pie) pie.outerHTML =
    '<footer><div class="pie" id="condiciones"><p>14 noches de prueba</p><p>10 años de garantía</p><p>Envío y montaje gratis · península</p><p><a href="' + X.TEL_HREF + '">' + X.TEL + '</a> · L–V 9–18</p></div>' +
    '<p class="legal">Precio tachado: precio de referencia de la tienda. © LM DESCANSO SL</p></footer>';

  /* Tarjeta de colchón: la foto lleva pegado su descuento */
  X.tarjeta = function (m, md) {
    var d = m.precios[md] || m.precios[X.MEDIDA];
    return '<a class="card" href="brutalista-colchon.html?m=' + m.k + '&medida=' + md + '">' +
      '<div class="foto"><img src="' + m.img + '" alt="' + m.titulo + '" loading="lazy" width="1024" height="1024"><span class="dto">−' + X.dto(d) + '<small>%</small></span></div>' +
      '<div class="info"><div><h3 class="big">' + m.nombre + '</h3><p>' + m.nucleo + ' · ' + m.altura + '</p></div>' +
      '<div class="p"><b>' + X.eur(d.p) + '</b><s>' + X.eur(d.r) + '</s><small>' + X.medidaTxt(md) + '</small></div></div></a>';
  };
})();
