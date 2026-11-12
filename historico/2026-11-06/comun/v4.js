/* LO MONACO · Versión 4 · Comportamientos globales (todas las páginas)
   - Cambio 8: titulares en color LM (sin cambio de color al hacer scroll, por decisión de Paco).
   - Cambio 9: barras de firmeza y adaptabilidad que se rellenan al entrar en pantalla. */
(function () {
  'use strict';
  var $$ = LM.$$;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('lm-v4');

  // Cambio 8 · Titulares: siempre en color LM (29/10: Paco quita el cambio a negro al hacer scroll)

  /* 29/10 · Burbuja «¿Hablamos?»: aparece al pasar el banner. Al pasar el ratón (o al tocarla en móvil)
     se separa en dos: WhatsApp (verde) y «Te llamamos» (deja tu teléfono y te llamamos). */
  (function () {
    var C = LM.CONFIG;
    var WA = 'https://wa.me/+34650282094';
    var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z"/></svg>';
    var b = document.createElement('div');
    b.className = 'lm-talk';
    b.innerHTML =
      '<div class="lm-talk-pop" id="lm-talk-pop" hidden role="dialog" aria-labelledby="lm-talk-t">' +
        '<button class="lm-talk-x" type="button" aria-label="Cerrar">' + LM.ico('close') + '</button>' +
        '<form class="lm-talk-f" novalidate>' +
          '<p class="lm-talk-t" id="lm-talk-t">Te llamamos</p>' +
          '<p class="lm-talk-s">Déjanos tu teléfono y te llamamos ' + LM.c('horario').toLowerCase().replace('lunes', 'de lunes') + '.</p>' +
          '<label class="lm-talk-l"><span class="lm-sr">Tu teléfono</span><input type="tel" name="tel" inputmode="tel" autocomplete="tel" placeholder="Tu teléfono" required></label>' +
          '<em class="lm-talk-e" hidden>Revisa el teléfono: tiene que tener 9 cifras.</em>' +
          '<button class="lm-btn lm-btn--full" type="submit">Que me llamen</button>' +
          '<p class="lm-talk-n">o llama tú al <a href="tel:' + C.telefono.tel + '" data-lead="burbuja-tel">' + C.telefono.v + '</a></p>' +
          '<p class="lm-talk-n">' + LM.pend('maqueta: la petición no se envía; conectar con el call center') + '</p>' +
        '</form>' +
        '<p class="lm-talk-ok" hidden>' + LM.ico('check') + 'Recibido. Te llamamos en horario de atención.</p>' +
      '</div>' +
      '<div class="lm-talk-opts">' +
        '<a class="lm-talk-o lm-talk-wa" href="' + WA + '" target="_blank" rel="noopener" data-lead="whatsapp" tabindex="-1">' + WA_SVG + 'WhatsApp</a>' +
        '<button class="lm-talk-o lm-talk-call" type="button" aria-controls="lm-talk-pop" aria-expanded="false" tabindex="-1">' + LM.ico('phone') + 'Te llamamos</button>' +
      '</div>' +
      '<button class="lm-talk-main" type="button" aria-expanded="false">' + LM.ico('chat') + '¿Hablamos?</button>';
    document.body.appendChild(b);

    var main = b.querySelector('.lm-talk-main'), opts = LM.$$('.lm-talk-o', b), pop = b.querySelector('.lm-talk-pop'), call = b.querySelector('.lm-talk-call');
    var tactil = matchMedia('(hover: none)').matches;
    function abrir(on) {
      b.classList.toggle('is-open', on); main.setAttribute('aria-expanded', on);
      opts.forEach(function (o) { o.tabIndex = on ? 0 : -1; });
    }
    function verPop(on) {
      pop.hidden = !on; call.setAttribute('aria-expanded', on); b.classList.toggle('is-pop', on);
      if (on) { var i = pop.querySelector('input'); if (i && !tactil) i.focus(); }
    }
    if (!tactil) {
      b.addEventListener('mouseenter', function () { abrir(true); });
      b.addEventListener('mouseleave', function () { if (pop.hidden) abrir(false); });
    }
    main.addEventListener('click', function () { abrir(!b.classList.contains('is-open')); if (b.classList.contains('is-open')) opts[0].focus({ preventScroll: true }); });
    b.addEventListener('focusout', function (e) { if (!b.contains(e.relatedTarget) && pop.hidden) abrir(false); });
    call.addEventListener('click', function () { verPop(pop.hidden); });
    b.querySelector('.lm-talk-x').addEventListener('click', function () { verPop(false); abrir(false); main.focus(); });
    document.addEventListener('click', function (e) { if (!b.contains(e.target)) { verPop(false); abrir(false); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (b.classList.contains('is-open'))) { verPop(false); abrir(false); main.focus(); } });
    b.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = this.tel, v = inp.value.replace(/\D/g, '').replace(/^34(?=\d{9}$)/, ''), ok = /^[6789]\d{8}$/.test(v);
      b.querySelector('.lm-talk-e').hidden = ok; inp.setAttribute('aria-invalid', !ok);
      if (!ok) { inp.focus(); return; }
      LM.track('generate_lead', { method: 'te_llamamos', source: 'burbuja' });
      this.hidden = true; b.querySelector('.lm-talk-ok').hidden = false;
    });

    // Aparece cuando la cabecera pasa a la franja LM (= hemos pasado el banner)
    var cab = document.getElementById('lm-header');
    function ver() { var on = !cab || cab.classList.contains('is-valores'); b.classList.toggle('is-on', on); if (!on) { verPop(false); abrir(false); } }
    if (cab) new MutationObserver(ver).observe(cab, { attributes: true, attributeFilter: ['class'] });
    ver();
  })();

  // Cambio 9 · Barras: se rellenan una vez al verse (sin animación si el usuario la ha desactivado)
  var barras = $$('.lm-bar');
  if (!motion || !('IntersectionObserver' in window)) { barras.forEach(function (b) { b.classList.add('is-in'); }); return; }
  document.documentElement.classList.add('lm-bars');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.6 });
  barras.forEach(function (b) { io.observe(b); });
  // Las barras que se pintan más tarde (filtros de categoría, comparador) se rellenan al momento
  new MutationObserver(function () {
    $$('.lm-bar:not(.is-in)').forEach(function (b) { if (barras.indexOf(b) < 0) { barras.push(b); io.observe(b); } });
  }).observe(document.body, { childList: true, subtree: true });
})();
