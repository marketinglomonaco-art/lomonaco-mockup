/* LO MONACO · Páginas de información del pie (Paco, 24/11): quiénes somos, contacto, envíos, pagos, garantías, certificados,
   condiciones, calidad, preguntas frecuentes y legales. Misma maqueta que las entradas del blog: índice que sigue la lectura,
   texto y, al lado, ayuda (teléfono, WhatsApp y las demás páginas de ayuda). */
(function () {
  'use strict';
  if (document.body.getAttribute('data-page') !== 'info') return;
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, art = $('.if-art');
  // Iconos de los datos clave
  $$('.if-ic[data-ico]').forEach(function (s) { s.innerHTML = LM.ico(s.getAttribute('data-ico')); });
  // Enlaces de la web actual: a su página en la maqueta si existe; si no, a la web actual en otra pestaña
  $$('.bl-body a[href]', art).forEach(function (a) {
    var h = a.getAttribute('href'); if (!h || /^(mailto:|tel:|#)/.test(h)) return;
    if (/^\//.test(h)) h = LM.WEB + h;
    var r = LM.ruta(h);
    if (r && r !== h) a.setAttribute('href', r);
    else if (/^https?:/.test(h)) { a.setAttribute('href', h); a.target = '_blank'; a.rel = 'noopener'; }
  });
  // Índice que marca el apartado que estás leyendo
  var toc = $$('.bl-toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) toc.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.bl-body h2[id]', art).forEach(function (h) { io.observe(h); });
  }
  // Preguntas frecuentes: desplegables (la flecha, como en el resto de la web)
  $$('.if-faq details.lm-faq > summary').forEach(function (s) { s.insertAdjacentHTML('beforeend', LM.ico('down')); });
  // Lateral: ayuda y las demás páginas de ayuda
  var AY = [['Envíos, entregas y montajes', 'envios.html'], ['Métodos de pago', 'metodos-de-pago.html'], ['Garantías y devoluciones', 'devoluciones.html'],
            ['Preguntas frecuentes', 'faq-preguntas-y-respuestas-frecuentes.html'], ['Contacto', 'contacto.html']];
  var aqui = location.pathname.split('/').pop();
  $('#if-side').innerHTML = '<div class="bl-side-c">' + LM.llamar('info', { label: '¿Te ayudamos?' }) + '</div>' +
    '<a class="bl-side-pk" href="https://wa.me/+34650282094" data-lead="whatsapp">' + LM.ico('chat') + '<span><b>WhatsApp</b><small>Escríbenos y te respondemos en horario de atención</small></span></a>' +
    '<nav class="bl-side-c if-ayuda" aria-label="Más ayuda"><p class="lm-eyebrow">Más ayuda</p><ul>' + AY.filter(function (x) { return x[1] !== aqui; }).map(function (x) {
      return '<li><a href="' + x[1] + '">' + x[0] + LM.ico('right') + '</a></li>'; }).join('') + '</ul></nav>';
  // Cierre: test o teléfono (el mismo bloque que el blog)
  $('#if-help').innerHTML = '<div><p class="lm-eyebrow">¿Buscas colchón?</p><h2 class="lm-h2">Te ayudamos <em>a elegir.</em></h2>' +
    '<p class="lm-sub">Responde unas preguntas rápidas y te decimos qué colchón va contigo. O llámanos y te asesoramos.</p><a class="lm-btn" href="index.html#cuestionario">Hacer el test</a></div>' + LM.llamar('info-cierre');
  LM.fill(document);
})();
