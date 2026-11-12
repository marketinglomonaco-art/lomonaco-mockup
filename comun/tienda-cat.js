/* LO MONACO · Categorías de packs, canapés, bases, almohadas y complementos (Paco, 12/11).
   Las mismas que la web actual (/packs/, /canape/, /bases/, /almohadas/, /otros/), con sus productos, su H1, su texto SEO
   y sus preguntas frecuentes (LM.CATS en comun/tienda.js). body[data-cat] dice cuál es. */
(function () {
  'use strict';
  var CAT = document.body.getAttribute('data-cat');
  if (!CAT || !LM.CATS || !LM.CATS[CAT]) return;
  var $ = LM.$, $$ = LM.$$, T = LM.TIENDA, D = LM.CATS[CAT], root = $('#tc');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function desde(tabla) {
    var b = null; Object.keys(tabla).forEach(function (m) { Object.keys(tabla[m]).forEach(function (c) { var d = tabla[m][c]; if (!b || d.p < b.p) b = d; }); }); return b;
  }
  function packs(f) { return Object.keys(T.packs).map(function (k) { return T.packs[k]; }).filter(f || function () { return true; }); }
  var slugCol = function (k) { return k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'); };

  /* Paco, 12/11: precio de cada producto para la medida de cama elegida en el filtro */
  var MED = LM.medidaFiltro();
  function paraCama(k, m) {
    var P = T[k], t = P.tabla, ancho = +m.split('x')[0], key = null, nota = '';
    if (k === 'almLatex' || k === 'almVisco') { key = ancho <= 105 ? '90 cm' : '135 cm'; nota = 'Almohada de ' + key; }
    else if (k === 'edredon') {
      var tope = { 90: '150x220|cama 80 y 90', 105: '180x220|cama 105', 140: '220x220|cama 120-135-140', 160: '240x220|cama 150-160', 180: '260x240|cama 180', 200: '280x240|cama 200' };
      key = tope[[90, 105, 140, 160, 180, 200].filter(function (x) { return ancho <= x; })[0] || 200]; nota = 'Edredón de ' + key.split('|')[0].replace('x', ' × ') + ' cm';
    } else key = t[m] ? m : t[m + '-2p'] ? m + '-2p' : (m === '135x180' && t['135x182'] ? '135x182' : null);
    var row = key && t[key]; if (!row) return null;
    return { d: row['-'] || row[Object.keys(row)[0]], nota: nota };
  }
  /* Tarjeta de producto de la tienda (canapé, bases, complementos) */
  function tarjeta(k, o) {
    o = o || {};
    var P = T[k], c = o.color ? P.colores.filter(function (x) { return x.k === o.color; })[0] : (P.colores ? P.colores[0] : null);
    var pc = paraCama(k, MED), foto = c ? c.fotos[0] : P.fotos[0], d = pc ? pc.d : desde(P.tabla), href = P.pagina + (o.color ? '?color=' + slugCol(o.color) : '');
    var nombre = o.color ? P.corto + ' ' + o.color : P.nombre;
    return '<article class="lm-card tc-card" data-testid="cat-card"><div class="lm-card-img">' + LM.tfImg(foto, { alt: nombre, sizes: '(max-width: 700px) 100vw, 33vw' }) + '</div>' +
      '<div class="lm-card-b"><p class="lm-card-k">' + esc(P.para || P.colorLabel && (P.colores.length + (P.tipo === 'canape' ? ' acabados' : ' colores')) || '') + '</p>' +
      '<h3><a class="lm-stretch" href="' + href + '">' + esc(nombre) + '</a></h3><p class="lm-card-d">' + esc(P.lema) + '</p>' +
      (P.colores && !o.color ? '<p class="tc-dots" aria-label="Colores">' + P.colores.map(function (x) { return '<img src="../img/tienda/' + x.sw + '-700.webp" alt="" title="' + esc(x.k) + '" width="22" height="22" loading="lazy">'; }).join('') + '</p>' : '') +
      '<div class="lm-card-f">' + (pc ? LM.precio(d, { medida: MED }) + (pc.nota ? '<p class="tc-nota">' + pc.nota + '</p>' : '') : LM.precio(d, { desde: true })) + '<span class="lm-btn lm-btn--full" aria-hidden="true">Ver ' + (P.tipo === 'complemento' ? 'producto' : P.tipo === 'canape' ? 'canapé' : 'base') + '</span></div></div></article>';
  }
  function seccion(id, eyebrow, titulo, cuerpo, cls) {
    return '<section class="lm-sec tc-sec ' + (cls || '') + '" id="' + id + '" aria-labelledby="' + id + '-t"><div class="lm-w"><div class="tf-head"><p class="lm-eyebrow">' + eyebrow + '</p><h2 class="lm-h2" id="' + id + '-t">' + titulo + '</h2></div>' + cuerpo + '</div></section>';
  }

  var EYE = { packs: 'Colchón + canapé o base', canape: 'Canapés de madera', bases: 'Bases tapizadas', almohadas: 'Almohadas', otros: 'Complementos de descanso' }[CAT];
  var H1 = { canape: 'Canapé abatible', almohadas: 'Almohadas' }[CAT] || D.h1;
  var html = '<nav class="lm-w c-crumbs" aria-label="Estás aquí"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(H1) + '</span></nav>' +
    '<section class="c-head tc-head"><div class="lm-w"><p class="lm-eyebrow">' + EYE + '</p><h1 class="lm-h2">' + esc(H1) + '</h1><p class="lm-sub">' + esc(D.meta) + '</p></div></section>';

  /* ---------- listado ---------- */
  if (CAT === 'packs') {
    // Paco, 12/11: en vez de los 8 packs, el configurador de la home
    html += '<div class="lm-w"><div id="tc-hmed"></div></div><div id="tc-h4p"></div>';
  } else {
    var listaHTML = function () {
      return (CAT === 'canape' ? T.canape.colores.map(function (c) { return tarjeta('canape', { color: c.k }); })
        : CAT === 'bases' ? [tarjeta('base3d'), tarjeta('baseTela')]
        : CAT === 'almohadas' ? [tarjeta('almLatex'), tarjeta('almVisco')]
        : [tarjeta('edredon'), tarjeta('bajera')]);
    };
    var lista = listaHTML();
    html += '<section class="c-list tc-list"><div class="lm-w"><div id="tc-hmed"></div><p class="c-count">' + lista.length + (CAT === 'canape' ? ' acabados del canapé abatible de madera' : ' productos') + '</p><div class="tc-grid' + (lista.length > 2 ? ' tc-grid--4' : '') + '" id="tc-lista">' + lista.join('') + '</div></div></section>';
  }

  /* ---------- bloques de ayuda según la categoría ---------- */
  if (CAT === 'canape' || CAT === 'bases') {
    html += seccion('elegir', 'Cómo elegir', '¿Canapé o <em>base tapizada?</em>',
      '<div class="tc-vs"><a class="tc-vs-c" href="canape.html">' + LM.tfImg(T.canape.colores[3].fotos[1], { alt: 'Canapé abatible abierto' }) + '<b>Canapé abatible</b><span>Guardas mantas, edredones y maletas en un arcón de 28 cm de fondo. Con frenos de seguridad.</span></a>' +
      '<a class="tc-vs-c" href="bases.html">' + LM.tfImg(T.base3d.colores[0].fotos[0], { alt: 'Base tapizada 3D' }) + '<b>Base tapizada</b><span>Estructura fija, más ligera y sin almacenaje. Sobre patas: el aire circula y pasa el robot aspirador.</span></a></div>' +
      '<p class="tc-vs-n">Las dos, en las mismas medidas y compatibles con cualquiera de nuestros colchones.</p>', 'lm-alt');
  }
  if (CAT === 'almohadas') {
    html += seccion('elegir', 'Cómo elegir', '¿Látex o <em>viscoelástica?</em>',
      '<div class="tc-vs"><a class="tc-vs-c" href="almohada-latex-lomonaco.html">' + LM.tfImg(T.almLatex.fotos[0], { alt: 'Almohada Látex' }) + '<b>Almohada Látex</b><span>Más elástica y transpirable: recupera su forma al instante y es algo más fresca. Ideal si duermes de lado.</span></a>' +
      '<a class="tc-vs-c" href="almohada-visco.html">' + LM.tfImg(T.almVisco.fotos[0], { alt: 'Almohada ViscoAir' }) + '<b>Almohada ViscoAir</b><span>Se adapta poco a poco a tu cabeza y tu cuello: sensación envolvente que alivia la presión cervical.</span></a></div>' +
      '<p class="tc-vs-n">Tamaños: 70, 75 y 90 cm para una persona; 135 cm, una para los dos en camas de matrimonio.</p>', 'lm-alt');
  }
  if (CAT !== 'packs') {
    var reg = { almohadas: 'almohada', otros: null }[CAT];
    var pk = CAT === 'canape' ? packs(function (p) { return p.base === 'canape'; }) : CAT === 'bases' ? packs(function (p) { return p.base === 'base'; })
      : packs(function (p) { return CAT === 'almohadas' ? p.regalos.indexOf('almohada') > -1 : p.regalos.indexOf('edredon') > -1; }).slice(0, 4);
    html += seccion('packs', 'Llévatelo en pack', CAT === 'canape' ? 'Canapé y colchón, <em>con regalos.</em>' : CAT === 'bases' ? 'Base y colchón, <em>con regalos.</em>' : 'Con un pack, <em>te lo regalamos.</em>',
      '<div class="tf-pk-g">' + pk.map(LM.tfPackCard ? LM.tfPackCard : function () { return ''; }).join('') + '</div>');
  }
  if (CAT === 'packs') {
    html += seccion('regalos', 'De regalo', 'Lo que te llevas <em>gratis.</em>',
      '<div class="tc-reg">' + LM.REGALOS.map(function (r) {
        var cuantos = packs(function (p) { return p.regalos.indexOf(r[2]) > -1; }).length;
        return '<div class="tc-reg-c"><img src="' + r[3] + '" alt="" width="160" height="160" loading="lazy"><b>' + r[0] + '</b><span>' + r[1] + '</span><small>Valorado en ' + LM.eur(r[4]) + ' · en ' + cuantos + ' de 8 packs</small></div>';
      }).join('') + '</div>', 'lm-alt');
  }

  /* ---------- preguntas y texto de la categoría (los de la web actual) ---------- */
  if (D.faqs && D.faqs.length) html += seccion('dudas', 'Preguntas frecuentes', 'Las dudas <em>que más nos preguntan.</em>', '<div class="lm-faqs">' + LM.faqHTML(D.faqs) + '</div>', 'p-faq');
  var par = D.parrafos.map(function (p, i) {
    var titulo = p.length < 90 && !/[.:]$/.test(p);
    return titulo ? '<h3>' + esc(p) + '</h3>' : '<p>' + esc(p) + '</p>';
  }).join('');
  html += '<section class="lm-sec tc-seo" aria-label="Sobre esta categoría"><div class="lm-w"><div class="tc-seo-in" id="tc-seo">' + par + '</div>' +
    '<button type="button" class="lm-btn lm-btn--line tc-seo-mas" aria-expanded="false" aria-controls="tc-seo">Leer más</button>' +
    '<div class="tc-call">' + LM.llamar('categoria-' + CAT, { label: '¿Dudas? Te asesoramos por teléfono' }) + '</div></div></section>';
  root.innerHTML = html;
  LM.fill(root);

  /* Filtro de medidas: cambia los precios de la lista (o del configurador, en packs) */
  if ($('#tc-hmed')) LM.filtroMedidas($('#tc-hmed'), function (m) {
    MED = m;
    if (CAT === 'packs') { if (LM.repintarPacks) LM.repintarPacks(); return; }
    var g = $('#tc-lista'); if (g) { g.innerHTML = listaHTML().join(''); LM.fill(g); }
  });
  /* Packs: el configurador de la home (plantilla #tpl-h4p de la página) */
  if (CAT === 'packs') {
    var montar = function () {
      var tp = document.getElementById('tpl-h4p'), dest = $('#tc-h4p'); if (!tp || !dest || dest.firstChild) return !!(dest && dest.firstChild);
      dest.appendChild(tp.content.cloneNode(true)); LM.fill(dest); if (LM.iniciarPacks) LM.iniciarPacks(); return true;
    };
    if (!montar()) document.addEventListener('DOMContentLoaded', montar);
  }
  var mas = $('.tc-seo-mas'), seo = $('#tc-seo');
  mas.addEventListener('click', function () { var on = seo.classList.toggle('is-open'); mas.setAttribute('aria-expanded', on); mas.textContent = on ? 'Leer menos' : 'Leer más'; });
  LM.track('view_item_list', { item_list_name: CAT });
})();
