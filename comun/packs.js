/* LO MONACO · Packs (home, categoría de packs y categoría de colchones: el bloque #h4p).
   Paco, 05/11: solo los packs que existen en la tienda (LM.PACK_CONF).
   Paco, 18/11: nueva estructura. Arriba se elige canapé o base, la medida y el colchón; debajo, la cuenta del pack:
   colchón + canapé o base + regalos = tu pack completo, y una franja con el resumen. Precios reales de cada medida (LM.packDesglose).
   Versión anterior en pulido/copias-1811-packs/packs.js */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$;
  // Paco, 12/11: se puede arrancar más tarde (la categoría de packs lo coloca después de cargar)
  function iniciar() {
    var pc = $('#h4p');
    if (!pc || pc.getAttribute('data-on')) return;
    pc.setAttribute('data-on', '1');
    var PC = LM.PACK_CONF, M = LM.CONFIG.medidaInicial.v;
    var st = { base: 'canape', col: 'gran', medida: LM.medidaInicial(), colorB: { canape: 'Nogal', base: 'Chocolate' } };
    var segB = $('#h4p-base'), colB = $('#h4p-col'), medSel = $('#h4p-med'), go = $('#h4p-go'), CTA = go.innerHTML;
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function pkKey() { return st.col + (st.base === 'canape' ? 'Canape' : 'Base'); }
    function precio(l) {
      if (l.p == null) return '<p class="pk2-pr"><small>No en esta medida</small></p>';
      return '<p class="pk2-pr">' + (l.r > l.p ? '<span class="pk2-was"><s>' + LM.eur(l.r) + '</s><span class="lm-price-off">-' + Math.round((1 - l.p / l.r) * 100) + ' %</span></span>' : '') + '<b>' + LM.eur(l.p) + '</b></p>';
    }

    // Selectores de arriba: canapé o base (la pastilla granate se desliza), medida y colchón
    segB.innerHTML = '<span class="h4p-seg-ind" aria-hidden="true"></span>' +
      PC.orden.map(function (b) { return '<button type="button" role="radio" data-base="' + b + '">' + PC.bases[b].t + '</button>'; }).join('');
    colB.innerHTML = PC.colchones.map(function (c) { return '<button type="button" role="radio" data-col="' + c.k + '"><b>' + c.t + '</b><small>' + c.d + '</small></button>'; }).join('');
    var ind = $('.h4p-seg-ind', segB);
    function deslizar() {
      var b = $('[data-base="' + st.base + '"]', segB); if (!b || !b.offsetWidth) return;
      ind.style.width = b.offsetWidth + 'px'; ind.style.height = b.offsetHeight + 'px';
      ind.style.borderRadius = getComputedStyle(b).borderRadius;
      ind.style.transform = 'translate(' + b.offsetLeft + 'px,' + b.offsetTop + 'px)';
    }
    function recolocar() { segB.classList.add('is-sin'); deslizar(); requestAnimationFrame(function () { segB.classList.remove('is-sin'); }); }
    addEventListener('resize', recolocar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recolocar);

    function pintar() {
      var col = PC.colchones.filter(function (c) { return c.k === st.col; })[0], k = pkKey();
      $$('[data-base]', segB).forEach(function (b) { var on = b.getAttribute('data-base') === st.base; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      $$('[data-col]', colB).forEach(function (b) { var on = b.getAttribute('data-col') === st.col; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      deslizar();
      // Medidas de este pack, en el orden de siempre
      var MP = LM.MEDIDAS.filter(function (x) { var t = LM.TIENDA.packs[k].tabla; return t[x] || t[x + '-2p']; });
      if (MP.indexOf(st.medida) < 0) st.medida = MP.indexOf(M) > -1 ? M : MP[0];
      medSel.innerHTML = MP.map(function (x) { return '<option value="' + x + '"' + (x === st.medida ? ' selected' : '') + '>' + LM.medidaTxt(x) + '</option>'; }).join('');
      var COLS = (st.base === 'canape' ? LM.TIENDA.canape : LM.TIENDA.base3d).colores;
      if (!COLS.some(function (x) { return x.k === st.colorB[st.base]; })) st.colorB[st.base] = COLS[0].k;
      var D = LM.packDesglose(k, st.medida, st.colorB[st.base]);
      if (!D) { st.medida = M; D = LM.packDesglose(k, M, st.colorB[st.base]); }
      var L0 = D.lineas[0], L1 = D.lineas[1], P = LM.PRODUCTOS[st.col], canape = st.base === 'canape';

      // 1 · Colchón
      $('#pk2-col').innerHTML = '<div class="pk2-img"><img src="' + L0.img + '" alt="Colchón ' + esc(P.nombre) + '" width="480" height="480" loading="lazy"></div>' +
        '<div class="pk2-b"><h3>' + esc(L0.t) + '</h3><p class="pk2-sub">' + esc(col.d) + ' · ' + LM.medidaTxt(D.m) + '</p>' + precio(L0) +
        '</div>'; // Paco, 19/11: fuera «Ver el colchón»; tarjeta igual que la del canapé o la base
      // 2 · Canapé o base, con sus acabados
      $('#pk2-base').innerHTML = '<div class="pk2-img"><img src="../img/pack-tipo-' + st.base + '-700.webp" srcset="../img/pack-tipo-' + st.base + '-700.webp 700w, ../img/pack-tipo-' + st.base + '-1200.webp 1200w" sizes="(max-width: 700px) 90vw, 320px" alt="' + esc(L1.t) + '" width="700" height="438" loading="lazy"></div>' +
        // Paco, 19/11: fuera el selector de acabados (se elige en la página del pack); precio con el acabado de siempre
        '<div class="pk2-b"><h3>' + esc(canape ? 'Canapé abatible' : L1.t) + '</h3><p class="pk2-sub">' + COLS.length + ' acabados a elegir en el pack</p>' +
        precio(L1) + '</div>';
      // 3 · Regalos
      $('#pk2-reg').innerHTML = '<div class="pk2-reg-h">' + LM.ico('gift') + '<h3>' + D.regalos.length + ' regalos incluidos</h3></div>' +
        '<p class="pk2-pill">Valorados en ' + LM.eur(D.valorRegalos) + '</p>' +
        '<ul class="pk2-reg-l">' + D.regalos.map(function (r) {
          return '<li><img src="' + r.img + '" alt="" width="64" height="64" loading="lazy"><span><b>' + esc(r.t) + '</b><s>' + LM.eur(r.p) + '</s></span></li>';
        }).join('') + '</ul><p class="pk2-gratis">Gratis con tu pack</p>';
      // 4 · Tu pack completo
      var pack = D.d;
      $('#h4p-price').innerHTML = '<p class="pk2-tot-k">Tu pack completo</p>' +
        (D.suelto > pack.p ? '<p class="pk2-tot-was">Por separado <s>' + LM.eur(D.suelto) + '</s></p>' : '') +
        '<p class="pk2-tot-now">' + LM.eur(pack.p) + '</p>' +
        (D.ahorro >= 1 ? '<p class="pk2-save">Te ahorras ' + LM.eur(D.ahorro) + '</p>' : '') +
        '<p class="lm-price-fee">' + LM.cuotaTxt(pack.p) + '</p>';
      var tr = $('#h4p-trust');
      if (!tr.firstChild) tr.innerHTML = '<li>' + LM.ico('truck') + LM.c('envioDevolucion') + '</li><li>' + LM.ico('moon') + LM.c('prueba') + ' de prueba</li>';
      // Franja de resumen
      var piezas = (L0.p || 0) + (L1.p || 0);
      $('#pk2-bar').innerHTML = '<p>Colchón + ' + (canape ? 'canapé' : 'base') + ': <b>' + LM.eur(piezas) + '</b></p>' +
        '<p>Regalos: <b>' + LM.eur(D.valorRegalos) + '</b> incluidos</p>' +
        '<p>Total del pack: <b>' + LM.eur(pack.p) + '</b></p>';
      go.innerHTML = CTA;
      go.href = LM.packPagina(st.col, st.base);
      go.setAttribute('data-pid', PC.packs[k].pid);
      go.setAttribute('aria-label', 'Ver el pack ' + col.t + ' ' + PC.bases[st.base].t.toLowerCase());
    }

    function radios(box, attr, set) {
      box.addEventListener('click', function (e) { var b = e.target.closest('[' + attr + ']'); if (!b) return; set(b.getAttribute(attr)); pintar(); });
      box.addEventListener('keydown', function (e) {
        var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
        e.preventDefault(); var bs = $$('[' + attr + ']', box), i = bs.indexOf(document.activeElement);
        var n = bs[(i + d + bs.length) % bs.length]; set(n.getAttribute(attr)); pintar(); n.focus();
      });
    }
    radios(segB, 'data-base', function (v) { st.base = v; LM.track('pack_base', { base: v }); });
    radios(colB, 'data-col', function (v) { st.col = v; LM.track('pack_colchon', { colchon: v }); });
    medSel.addEventListener('change', function () {
      st.medida = this.value; LM.store.set('lm_medida', st.medida); pintar(); LM.track('pack_medida', { medida: st.medida });
      // el filtro de medidas de la página (si lo hay) marca la misma
      $$('[data-hm]').forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-hm') === st.medida); });
    });
    // Acabado del canapé o de la base
    pc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pkc]'); if (!b) return;
      st.colorB[st.base] = b.getAttribute('data-pkc'); pintar();
      var n = $('[data-pkc="' + st.colorB[st.base] + '"]', pc); if (n) n.focus({ preventScroll: true });
      LM.track('pack_color', { color: st.colorB[st.base], base: st.base });
    });
    go.addEventListener('click', function () { if (this.hasAttribute('data-pid')) LM.track('select_item', { item_list_name: 'home_pack_config', item_id: +this.getAttribute('data-pid') }); });
    LM.repintarPacks = function () { st.medida = LM.medidaInicial(); pintar(); }; // la home lo llama al cambiar la medida de las tarjetas
    pintar();
  }
  LM.iniciarPacks = iniciar;
  iniciar();
})();
