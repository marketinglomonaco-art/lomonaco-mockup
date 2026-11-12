/* LO MONACO · Blog (Paco, 12/11): portada (blog.html) y entradas (blog-<slug>.html).
   Las 68 entradas de la web actual, con su texto (lo pone construir.py) y la lista en comun/blog-datos.js (LM.BLOG).
   - Portada: la última, destacada; filtro por categoría (solo las que tienen entradas) y «Ver más».
   - Entrada: índice que sigue la lectura, enlaces de la web actual a las páginas de la maqueta, ayuda para elegir y relacionadas. */
(function () {
  'use strict';
  var PG = document.body.getAttribute('data-page');
  if ((PG !== 'blog' && PG !== 'entrada') || !LM.BLOG) return;
  var $ = LM.$, $$ = LM.$$;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  LM.fechaLarga = function (f) { var a = f.split('-'); return +a[2] + ' de ' + MESES[+a[1] - 1] + ' de ' + a[0]; };
  function foto(e, w, cls) {
    if (!e.img) return '<span class="bl-noimg" aria-hidden="true">' + LM.ico('moon') + '</span>';
    return '<img src="../../../img/blog/' + e.img + '-' + (w || 640) + '.webp" alt="' + esc(e.alt) + '" width="640" height="400" loading="lazy"' + (cls ? ' class="' + cls + '"' : '') + '>';
  }
  function tarjeta(e) {
    return '<article class="bl-card" data-testid="blog-card"><a class="bl-card-img" href="' + e.pagina + '" tabindex="-1" aria-hidden="true">' + foto(e) + '</a>' +
      '<div class="bl-card-b"><p class="bl-cat">' + esc(e.cats[0]) + '</p><h3><a href="' + e.pagina + '">' + esc(e.titulo) + '</a></h3>' +
      '<p class="bl-ext">' + esc(e.extracto.slice(0, 150)) + (e.extracto.length > 150 ? '…' : '') + '</p>' +
      '<p class="bl-meta">' + LM.fechaLarga(e.fecha) + ' · ' + e.min + ' min</p></div></article>';
  }

  /* ---------------- portada ---------------- */
  if (PG === 'blog') {
    var root = $('#bl'), q = new URLSearchParams(location.search), cat = q.get('cat') || 'Todas', vistos = 12;
    var cats = {}; LM.BLOG.forEach(function (e) { e.cats.forEach(function (c) { cats[c] = (cats[c] || 0) + 1; }); });
    var orden = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
    var top = LM.BLOG[0];
    root.innerHTML =
      '<nav class="lm-w c-crumbs" aria-label="Estás aquí"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>' +
      '<section class="c-head tc-head"><div class="lm-w"><p class="lm-eyebrow">Blog de descanso</p><h1 class="lm-h2">Duerme mejor, <em>cada noche.</em></h1>' +
        '<p class="lm-sub">Guías para elegir colchón, almohada y base, y consejos de descanso y salud del equipo de Asesores del Descanso de LOMONACO.</p></div></section>' +
      '<section class="bl-top"><div class="lm-w"><a class="bl-dest" href="' + top.pagina + '">' + foto(top, 1200, 'bl-dest-img') +
        '<span class="bl-dest-b"><span class="bl-cat">' + esc(top.cats[0]) + ' · Lo último</span><b>' + esc(top.titulo) + '</b><span class="bl-ext">' + esc(top.extracto.slice(0, 220)) + '…</span>' +
        '<span class="bl-meta">' + LM.fechaLarga(top.fecha) + ' · ' + top.min + ' min de lectura</span><span class="lm-btn">Leer la guía' + LM.ico('right') + '</span></span></a></div></section>' +
      '<section class="bl-list"><div class="lm-w"><div class="tc-filtros" role="group" aria-label="Categorías"><span>Temas</span>' +
        ['Todas'].concat(orden).map(function (c) { return '<button type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + (c === 'Todas' ? '' : ' <small>' + cats[c] + '</small>') + '</button>'; }).join('') + '</div>' +
        '<p class="c-count" id="bl-count" aria-live="polite"></p><div class="bl-grid" id="bl-grid"></div>' +
        '<button type="button" class="lm-btn lm-btn--line bl-mas" id="bl-mas">Ver más artículos</button></div></section>' +
      '<section class="lm-sec bl-help"><div class="lm-w bl-help-in"><div><p class="lm-eyebrow">¿Buscas colchón?</p><h2 class="lm-h2">Te ayudamos <em>a elegir.</em></h2>' +
        '<p class="lm-sub">Responde 5 preguntas y te decimos qué colchón va contigo. O llámanos y te asesoramos.</p><a class="lm-btn" href="index.html#h4q">Hacer el test</a></div>' + LM.llamar('blog') + '</div></section>';
    function pintar() {
      var l = LM.BLOG.filter(function (e, i) { return (cat === 'Todas' ? i > 0 : e.cats.indexOf(cat) > -1); });
      $('#bl-grid').innerHTML = l.slice(0, vistos).map(tarjeta).join('');
      $('#bl-count').textContent = (cat === 'Todas' ? LM.BLOG.length : l.length) + ' artículos';
      $('#bl-mas').hidden = l.length <= vistos;
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (b) { cat = b.getAttribute('data-cat'); vistos = 12; $$('[data-cat]', root).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); pintar(); history.replaceState(null, '', cat === 'Todas' ? 'blog.html' : '?cat=' + encodeURIComponent(cat)); LM.track('blog_filtro', { cat: cat }); }
      if (e.target.closest('#bl-mas')) { vistos += 12; pintar(); }
    });
    pintar(); LM.fill(root);
    return;
  }

  /* ---------------- entrada ---------------- */
  var art = $('.bl-art'), slug = art.getAttribute('data-slug'), yo = LM.BLOG.filter(function (e) { return e.slug === slug; })[0];
  // Enlaces de la web actual: a su página en la maqueta si existe (si no, a la web actual, en otra pestaña)
  $$('.bl-body a[href]', art).forEach(function (a) {
    var h = a.getAttribute('href'); if (/^\//.test(h)) h = LM.WEB + h;
    var r = LM.ruta(h);
    if (r && r !== h) a.setAttribute('href', r);
    else if (/^https?:/.test(h)) { a.setAttribute('href', h); a.target = '_blank'; a.rel = 'noopener'; }
    else if (r === null) a.setAttribute('href', /colch/.test(h) ? 'colchones.html' : h);
  });
  // Índice: marca la sección que estás leyendo
  var toc = $$('.bl-toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) toc.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.bl-body h2[id]', art).forEach(function (h) { io.observe(h); });
  }
  // Ayuda para elegir (lateral) y relacionadas del mismo tema
  $('#bl-side').innerHTML = '<div class="bl-side-c"><p class="lm-eyebrow">¿Buscas colchón?</p><p class="bl-side-t">Te decimos cuál va contigo en 5 preguntas.</p><a class="lm-btn lm-btn--full" href="index.html#h4q">Hacer el test</a></div>' +
    '<div class="bl-side-c">' + LM.llamar('blog-entrada', { label: '¿Prefieres que te lo expliquemos?' }) + '</div>' +
    '<a class="bl-side-pk" href="packs.html">' + LM.ico('gift') + '<span><b>Packs con regalos</b><small>Colchón y canapé o base, con almohadas y más de regalo</small></span></a>';
  var rel = LM.BLOG.filter(function (e) { return e.slug !== slug && yo && e.cats[0] === yo.cats[0]; }).slice(0, 3);
  if (rel.length < 3) rel = rel.concat(LM.BLOG.filter(function (e) { return e.slug !== slug && rel.indexOf(e) < 0; }).slice(0, 3 - rel.length));
  $('#bl-rel').innerHTML = rel.map(tarjeta).join('');
  LM.track('blog_leer', { slug: slug, cat: yo ? yo.cats[0] : '' });
})();
