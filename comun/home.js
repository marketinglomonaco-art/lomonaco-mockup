/* LO MONACO · Home: pinta los bloques dinámicos a partir de datos.js */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$;
  var arrow = '<svg class="lm-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // Cuota mínima del catálogo para el antetítulo del hero
  var minP = Math.min.apply(null, LM.ORDEN.map(function (k) { return LM.desde(k).p; }));
  $$('[data-cuota-desde]').forEach(function (el) { el.textContent = LM.eur(LM.cuota36(minP)); });
  $$('[data-stars]').forEach(function (el) { el.innerHTML = LM.stars(LM.CONFIG.valoracion.media); });
  $$('[data-rating]').forEach(function (el) { el.innerHTML = LM.rating(); });

  // V4 · Cambio 3: reseñas del hero en carrusel (fundido, se para al pasar el ratón o con el foco)
  var hr = $('#h4-res');
  if (hr) {
    hr.innerHTML = LM.HERO_RESENAS.map(function (r, i) {
      return '<q' + (i ? ' class="is-wait"' : '') + '>' + LM.mark(r, r.x) + '</q>';
    }).join('');
    var qs = $$('q', hr), qi = 0, pausa = false, fig = hr.closest('.h4-res');
    fig.addEventListener('mouseenter', function () { pausa = true; });
    fig.addEventListener('mouseleave', function () { pausa = false; });
    fig.addEventListener('focusin', function () { pausa = true; });
    fig.addEventListener('focusout', function () { pausa = false; });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(function () {
      if (pausa || document.hidden) return;
      var a = qs[qi]; qi = (qi + 1) % qs.length; var b = qs[qi];
      a.classList.add('is-out'); b.classList.remove('is-wait', 'is-out');
      setTimeout(function () { a.classList.remove('is-out'); a.classList.add('is-wait'); }, 700);
    }, 5000);
  }

  // Parallax suave: la foto del banner baja más despacio que la página al hacer scroll
  var hh = $('.h4'), foto = hh && $('.h-hero-img', hh);
  if (foto && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var px = 0;
    var mover = function () {
      px = 0;
      var y = Math.min(scrollY, hh.offsetHeight + hh.offsetTop);
      foto.style.transform = 'translate3d(0,' + (y * 0.28).toFixed(1) + 'px,0)';
    };
    addEventListener('scroll', function () { if (!px) px = requestAnimationFrame(mover); }, { passive: true });
    mover();
  }

  // Los 4 colchones [C3]
  var g = $('#h-productos');
  if (g) {
    // Paco, 05/11: la tarjeta estándar del ecommerce (comun/componentes.js · LM.tarjeta), con precio para 150 × 190
    var MED = ['90x190', '150x190', '180x200'], selM = $('#h-prod-med');
    var med = MED.indexOf(LM.medidaInicial()) > -1 ? LM.medidaInicial() : '150x190';
    function pintarTarjetas() {
      g.innerHTML = LM.ORDEN.map(function (k) { return LM.tarjeta(k, { medida: med }); }).join('');
      if (selM) selM.innerHTML = '<span>Precio para</span>' + MED.map(function (m) {
        return '<button type="button" role="radio" data-hm="' + m + '" aria-checked="' + (m === med) + '">' + LM.medidaTxt(m) + '</button>';
      }).join('');
      LM.fill(g);
    }
    pintarTarjetas();
    if (selM) selM.addEventListener('click', function (e) {
      var b = e.target.closest('[data-hm]'); if (!b) return;
      med = b.getAttribute('data-hm'); LM.store.set('lm_medida', med); pintarTarjetas();
      var n = selM.querySelector('[data-hm="' + med + '"]'); if (n) n.focus({ preventScroll: true });
      if (LM.repintarPacks) LM.repintarPacks();
      LM.track('home_medida', { medida: med });
    });
    g.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]'); if (!a) return;
      var c = e.target.closest('[data-testid^="product-card-"]');
      if (c) LM.track('select_item', { item_list_name: 'home', item_id: LM.PRODUCTOS[c.getAttribute('data-testid').replace('product-card-', '')].id });
    });
  }

  var fc = $('#h-faq-call');
  if (fc) fc.innerHTML = '<p class="lm-sub">¿Tienes otra duda? Te respondemos por teléfono.</p>' + LM.llamar('home-faq');

  // UGC: vídeos reales de clientes (YouTube Shorts) intercalados con opiniones verificadas
  var u = $('#h-ugc');
  if (u) {
    var r = LM.RESENAS, h = '';
    LM.UGC.forEach(function (v, i) { h += LM.short(v); if (r[i]) h += LM.resena(r[i]); });
    u.innerHTML = h;
  }

  // Dudas frecuentes de la home: las que más bloquean la compra
  var fq = $('#h-faq');
  if (fq) { var all = LM.faqs(); fq.innerHTML = LM.faqHTML([all[3], all[1], all[5], all[6]]); }

  var C = LM.CONFIG;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compromisos (cambio 12): ahora en comun/compromisos.js, compartido con la categoría

  // Configurador de packs (cambio 13): ahora en comun/packs.js, compartido con la categoría

  LM.fill(document);
  LM.reveal();
})();

/* Paco, 12/11 · Pop-up de newsletter (solo en la home): 10 % de descuento en el próximo colchón.
   Aparece a los 6 s de entrar, una vez por visita. Se cierra con la X, «No, gracias», Esc o pinchando fuera. */
(function () {
  if (!document.getElementById('colchones')) return; // solo en la home
  var visto = false; try { visto = sessionStorage.getItem('lm_nl') === '1'; } catch (e) {}
  if (visto) return;
  var $ = LM.$;
  var w = document.createElement('div');
  w.className = 'lm-news'; w.hidden = true;
  w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'lm-news-t');
  w.innerHTML = '<div class="lm-news-box">' +
    '<button type="button" class="lm-news-x" aria-label="Cerrar">' + LM.ico('close') + '</button>' +
    '<figure class="lm-news-img"><img src="../img/newsletter-pareja-800.webp" srcset="../img/newsletter-pareja-800.webp 800w, ../img/newsletter-pareja-1400.webp 1400w" sizes="(max-width: 700px) 100vw, 420px" alt="" width="800" height="506" loading="lazy"></figure>' + // Paco, 12/11: foto de la pareja leyendo en la cama
    '<div class="lm-news-b">' +
      '<form class="lm-news-f" novalidate>' +
        '<p class="lm-eyebrow">Newsletter LOMONACO</p>' +
        '<h2 class="lm-news-t" id="lm-news-t">Suscríbete y llévate un <em>10 %</em> en tu próximo colchón.</h2>' +
        '<p class="lm-news-s">Te enviamos tu código al momento. Y, de vez en cuando, ofertas y consejos para dormir mejor. Te das de baja cuando quieras.</p>' +
        '<label class="lm-news-l"><span class="lm-sr">Tu email</span><input type="email" name="email" autocomplete="email" placeholder="Tu email" required></label>' +
        '<em class="lm-news-e" hidden>Revisa tu email: debe ser como nombre@gmail.com.</em>' +
        '<label class="lm-news-chk"><input type="checkbox" name="ok" required><span>Acepto la <a href="' + LM.WEB + '/politica-de-privacidad/" target="_blank" rel="noopener">política de privacidad</a>.</span></label>' +
        '<em class="lm-news-e lm-news-e2" hidden>Marca la casilla para continuar.</em>' +
        '<button type="submit" class="lm-btn lm-btn--full">Quiero mi 10 %</button>' +
        '<button type="button" class="lm-news-no">No, gracias</button>' +
        '<p class="lm-news-n">' + LM.pend('condiciones del 10 %: colchones, no acumulable con otras ofertas, caducidad; maqueta: la suscripción no se envía') + '</p>' +
      '</form>' +
      '<div class="lm-news-ok" hidden>' + LM.ico('check') + '<p class="lm-news-t">¡Listo! Revisa tu correo.</p><p class="lm-news-s">Te hemos enviado tu código del 10 % para tu próximo colchón.</p>' +
        '<a class="lm-btn" href="colchones.html">Ver colchones</a></div>' +
    '</div></div>';
  document.body.appendChild(w);
  var antes = null;
  function abrir() {
    if (document.querySelector('.lm-sheet:not([hidden]), .lm-asis:not([hidden])')) { setTimeout(abrir, 4000); return; } // no encima de otro panel abierto
    antes = document.activeElement; w.hidden = false; document.documentElement.classList.add('lm-noscroll');
    try { sessionStorage.setItem('lm_nl', '1'); } catch (e) {}
    setTimeout(function () { var i = $('input[type="email"]', w); if (i && matchMedia('(hover: hover)').matches) i.focus({ preventScroll: true }); }, 50);
    LM.track('newsletter_popup_view', {});
  }
  function cerrar() { w.hidden = true; document.documentElement.classList.remove('lm-noscroll'); if (antes && antes.focus) antes.focus({ preventScroll: true }); }
  setTimeout(abrir, 6000);
  w.addEventListener('click', function (e) { if (e.target === w || e.target.closest('.lm-news-x, .lm-news-no')) { cerrar(); LM.track('newsletter_popup_close', {}); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !w.hidden) cerrar(); });
  $('.lm-news-f', w).addEventListener('submit', function (e) {
    e.preventDefault();
    var f = this, v = f.email.value.trim(), okMail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
    f.querySelector('.lm-news-e').hidden = okMail; f.email.setAttribute('aria-invalid', !okMail);
    f.querySelector('.lm-news-e2').hidden = f.ok.checked;
    if (!okMail) { f.email.focus(); return; }
    if (!f.ok.checked) return;
    f.hidden = true; $('.lm-news-ok', w).hidden = false;
    LM.track('generate_lead', { method: 'newsletter', source: 'popup_home' });
  });
})();
