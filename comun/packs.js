/* LO MONACO · Configurador de packs (cambio 13 de la home).
   Compartido: home y categoría (Diseño 1 · Opción A, comentario 6). Si la página no tiene #h4p, no hace nada. */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- V4 · Cambio 13: configurador de packs ---------- */
  var pc = $('#h4p');
  if (pc) {
    var PC = LM.PACK_CONF, st = { base: 'canape', col: 'gran' };
    function off(d) { return Math.round((1 - d.p / d.r) * 100); }
    function tabla(col, base) { return LM.PRECIOS[col + (base === 'canape' ? 'Canape' : 'Base')]; }
    function maxOff(t) { var m = 0; for (var k in t) m = Math.max(m, off(t[k])); return m; }
    var todo = 0;
    PC.colchones.forEach(function (c) { ['canape', 'base'].forEach(function (b) { todo = Math.max(todo, maxOff(tabla(c.k, b))); }); });
    var CTA_HTML = $('#h4p-go').innerHTML;
    $('#h4p-max').textContent = todo;

    var segB = $('#h4p-base'), colB = $('#h4p-col');
    segB.innerHTML = PC.orden.map(function (b) {
      return '<button type="button" role="radio" data-base="' + b + '">' + PC.bases[b].t + '</button>';
    }).join('');
    colB.innerHTML = PC.colchones.map(function (c) {
      return '<button type="button" role="radio" data-col="' + c.k + '"><b>' + c.t + '</b><small>' + c.d + '</small></button>';
    }).join('');
    var img = $('#h4p-img'), ultimaFoto = 'canape';

    function pintarPack() {
      var col = PC.colchones.filter(function (c) { return c.k === st.col; })[0];
      $$('[data-base]', segB).forEach(function (b) { var on = b.getAttribute('data-base') === st.base; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      $$('[data-col]', colB).forEach(function (b) { var on = b.getAttribute('data-col') === st.col; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
      foto();
      var go = $('#h4p-go');
      if (PC.bases[st.base].sinPack) {
        // Base tapizada de tela: la tienda no tiene este pack. No se inventa precio: se ofrece la llamada
        $('#h4p-inc').innerHTML = ['Colchón ' + col.t, 'Base tapizada de tela'].map(function (x) { return '<li>' + LM.ico('check') + x + '</li>'; }).join('') +
          '<li class="h4p-inc-n">' + LM.pend('este pack no existe en la tienda: crear «Pack colchón + base tapizada de tela» o quitar la pestaña') + '</li>';
        $('#h4p-pill').textContent = PC.bases[st.base].t;
        $('#h4p-price').innerHTML = '<p class="h4p-from">Colchón + base tapizada de tela</p><p class="h4p-ask">Te damos el precio por teléfono</p><p class="lm-price-fee">' + C.horario.v + '</p>';
        go.href = 'tel:' + C.telefono.tel; go.setAttribute('data-lead', 'home-pack-tela'); go.removeAttribute('data-pid');
        go.innerHTML = LM.ico('phone') + 'Llamar al ' + C.telefono.v; go.setAttribute('aria-label', 'Llamar para pedir el pack con base tapizada');
        return;
      }
      go.removeAttribute('data-lead'); go.innerHTML = CTA_HTML;
      var key = st.col + (st.base === 'canape' ? 'Canape' : 'Base'), pk = PC.packs[key], t = tabla(st.col, st.base);
      var d = LM.desdeTabla(t);
      $('#h4p-inc').innerHTML = ['Colchón ' + col.t].concat(pk.inc).map(function (x) { return '<li>' + LM.ico('check') + x + '</li>'; }).join('');  // 29/10: contenido confirmado por Paco (regalos: almohadas, edredón y protector)
      $('#h4p-pill').textContent = 'Hasta -' + maxOff(t) + ' % · ' + PC.bases[st.base].t.toLowerCase();
      $('#h4p-price').innerHTML = '<p class="h4p-from">Pack desde <s>' + LM.mark(C.precioRef, LM.eur(d.r)) + '</s><span class="lm-price-off">-' + off(d) + ' %</span></p>' +
        '<p class="h4p-now">' + LM.eur(d.p) + '</p><p class="lm-price-fee">' + LM.cuotaTxt(d.p) + '</p>';
      // 29/10: «Ver el pack» lleva a la ficha de pack de la maqueta, con la base ya elegida
      go.href = LM.PRODUCTOS[st.col].url.replace('colchon-', 'pack-') + '?base=' + st.base; go.setAttribute('data-pid', pk.pid);
      go.setAttribute('aria-label', 'Ver el pack ' + col.t + ' ' + PC.bases[st.base].t.toLowerCase());
    }
    function foto() {
      // 29/10: sin fundido entre fotos; cambia al instante
      if (ultimaFoto !== st.base) {
        ultimaFoto = st.base; var f = PC.bases[st.base];
        img.srcset = f.img + '-700.webp 700w, ' + f.img + '-1200.webp 1200w'; img.src = f.img + '-1200.webp';
      }
      img.alt = PC.bases[st.base].alt;
    }
    function radios(box, attr, set) {
      box.addEventListener('click', function (e) { var b = e.target.closest('[' + attr + ']'); if (!b) return; set(b.getAttribute(attr)); pintarPack(); });
      box.addEventListener('keydown', function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
        e.preventDefault(); var bs = $$('[' + attr + ']', box), i = bs.indexOf(document.activeElement);
        var n = bs[(i + k + bs.length) % bs.length]; set(n.getAttribute(attr)); pintarPack(); n.focus();
      });
    }
    radios(segB, 'data-base', function (v) { st.base = v; });
    radios(colB, 'data-col', function (v) { st.col = v; });
    $('#h4p-go').addEventListener('click', function () { if (this.hasAttribute('data-pid')) LM.track('select_item', { item_list_name: 'home_pack_config', item_id: +this.getAttribute('data-pid') }); });
    pintarPack();
    $('#h4p-img').alt = PC.bases.canape.alt;
  }

  // Las fotos de las 3 bases se precargan para que el cambio sea instantáneo
  if ($('#h4p')) ['canape', 'tela', 'base'].forEach(function (b) { var i = new Image(); i.src = LM.PACK_CONF.bases[b].img + '-1200.webp'; });
})();
