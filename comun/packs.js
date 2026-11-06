/* LO MONACO · Configurador de packs de la home (y de la categoría, si tiene #h4p).
   Paco, 05/11: solo los packs que existen en la tienda.
   - Canapé + Gran Natura, Natura Látex o Natura Gold: almohadas, edredón y protector de regalo.
   - Canapé + Natura Visco: almohadas y protector de regalo.
   - Base tapizada antideslizante + colchón: descuento sobre el precio, sin regalos.
   Se ve el precio de cada producto por separado y lo que te ahorras con el pack (precios para 150 × 190). */
(function () {
  'use strict';
  var $ = LM.$, $$ = LM.$$;
  var pc = $('#h4p');
  if (!pc) return;
  var PC = LM.PACK_CONF, st = { base: 'canape', col: 'gran' };
  var M = LM.CONFIG.medidaInicial.v;
  function off(d) { return Math.round((1 - d.p / d.r) * 100); }
  function tabla(col, base) { return LM.PRECIOS[col + (base === 'canape' ? 'Canape' : 'Base')]; }
  function medida(col, base) { return tabla(col, base)[M] ? M : Object.keys(tabla(col, base))[0]; }
  function maxOff(t) { var m = 0; for (var k in t) m = Math.max(m, off(t[k])); return m; }
  function red(n) { return Math.round(n * 100) / 100; }
  var CTA_HTML = $('#h4p-go').innerHTML;

  var segB = $('#h4p-base'), colB = $('#h4p-col');
  segB.innerHTML = PC.orden.map(function (b) { return '<button type="button" role="radio" data-base="' + b + '">' + PC.bases[b].t + '</button>'; }).join('');
  colB.innerHTML = PC.colchones.map(function (c) { return '<button type="button" role="radio" data-col="' + c.k + '"><b>' + c.t + '</b><small>' + c.d + '</small></button>'; }).join('');
  var img = $('#h4p-img'), ultimaFoto = 'canape';

  function fila(nombre, precio, cls) { return '<li' + (cls ? ' class="' + cls + '"' : '') + '><span>' + nombre + '</span><b>' + precio + '</b></li>'; }

  function pintarPack() {
    var col = PC.colchones.filter(function (c) { return c.k === st.col; })[0];
    $$('[data-base]', segB).forEach(function (b) { var on = b.getAttribute('data-base') === st.base; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    $$('[data-col]', colB).forEach(function (b) { var on = b.getAttribute('data-col') === st.col; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    foto();
    var m = medida(st.col, st.base), pack = tabla(st.col, st.base)[m], colchon = LM.PRECIOS[st.col][m];
    var G = LM.regalosPack(st.col, st.base), vReg = G.reduce(function (s, r) { return s + r[4]; }, 0);
    var go = $('#h4p-go'), h, precio;
    if (st.base === 'canape') {
      // Canapé: colchón + canapé por separado y los regalos tachados. En la tienda, el pack cuesta lo mismo que colchón + canapé:
      // el ahorro son los regalos
      // (diferencias de céntimos entre el pack y colchón + canapé son redondeos de la tienda: se ignoran)
      var can = LM.PRECIO_CANAPE[m], dif = red(colchon.p + can.p - pack.p);
      if (Math.abs(dif) < 1) dif = 0;
      var suelto = red(pack.p + dif + vReg), ahorro = red(suelto - pack.p);
      h = fila('Colchón ' + col.t, LM.eur(colchon.p)) + fila('Canapé abatible de madera', LM.eur(can.p)) +
        G.map(function (r) {
          return '<li class="h4p-gift"><img src="' + r[3] + '" alt="" width="160" height="160" loading="lazy"><span>' + r[0] + ' <small>de regalo</small></span>' +
            '<b><s>' + LM.eur(r[4]) + '</s><strong>Gratis</strong></b></li>';
        }).join('') +
        fila('Por separado', '<s>' + LM.eur(suelto) + '</s>', 'h4p-sum');
      $('#h4p-pill').textContent = 'Regalos valorados en ' + LM.eur(vReg);
      precio = '<p class="h4p-from">Pack para ' + LM.medidaTxt(m) + '</p><p class="h4p-now">' + LM.eur(pack.p) + '</p>' +
        (ahorro > 0 ? '<p class="h4p-save">Te ahorras ' + LM.eur(ahorro) + '</p>' : '');
    } else {
      // Base antideslizante: no se vende suelta. El pack lleva el descuento en el precio, sin regalos
      h = fila('Colchón ' + col.t, LM.eur(colchon.p)) + fila('Base tapizada antideslizante', 'Incluida') +
        '<li class="h4p-note">Con patas de 30 cm. Este pack no lleva regalos: el ahorro va en el precio.</li>' +
        fila('Precio sin descuento', '<s>' + LM.eur(pack.r) + '</s>', 'h4p-sum');
      $('#h4p-pill').textContent = 'Hasta -' + maxOff(tabla(st.col, st.base)) + ' % · con base';
      precio = '<p class="h4p-from">Pack para ' + LM.medidaTxt(m) + ' <span class="lm-price-off">-' + off(pack) + ' %</span></p><p class="h4p-now">' + LM.eur(pack.p) + '</p>' +
        '<p class="h4p-save">Te ahorras ' + LM.eur(red(pack.r - pack.p)) + '</p>';
    }
    $('#h4p-det').innerHTML = h;
    $('#h4p-price').innerHTML = precio + '<p class="lm-price-fee">' + LM.cuotaTxt(pack.p) + '</p>';
    go.innerHTML = CTA_HTML;
    go.href = LM.PRODUCTOS[st.col].url.replace('colchon-', 'pack-') + '?base=' + st.base;
    go.setAttribute('data-pid', PC.packs[st.col + (st.base === 'canape' ? 'Canape' : 'Base')].pid);
    go.setAttribute('aria-label', 'Ver el pack ' + col.t + ' ' + PC.bases[st.base].t.toLowerCase());
  }
  function foto() {
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
  // Las fotos de las bases se precargan para que el cambio sea instantáneo
  PC.orden.forEach(function (b) { var i = new Image(); i.src = PC.bases[b].img + '-1200.webp'; });
})();
