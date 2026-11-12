/* LO MONACO · Proceso de compra (Paco, 12/11): carrito, checkout y confirmación.
   Se traspasa el checkout actual de grupolomonaco.com (FunnelKit sobre WooCommerce) con los mismos pasos, campos,
   envíos y formas de pago. Solo cambia la estética y lo que hace que la gente abandone la compra:
   - Cabecera y pie mínimos (la web actual repite cabecera y deja el menú y el pie completos: 171 enlaces).
   - El email, lo primero: si se va, se puede recuperar el carrito.
   - El NIF, una sola vez (la web actual lo pide dos veces y las dos son obligatorias).
   - Provincia automática con el código postal, errores al momento y en tú.
   - Regalos dentro de su producto, sin + ni − (en la web actual son otra línea que se puede quitar).
   - Sin textos en inglés ni código a la vista («Shipping & taxes…», «Save 40%» y el comentario «Pack familia (-30% automático)» a la vista).
   - Los complementos se añaden sin salir del carrito (en la web actual llevan a su ficha).
   MAQUETA: no se cobra nada. En WooCommerce, cada campo y cada forma de pago es la de la tienda. */
(function () {
  'use strict';
  var PG = document.body.getAttribute('data-page');
  if (['carrito', 'checkout', 'confirmado'].indexOf(PG) < 0) return;
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, CART = LM.cart;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function iva(t) { return t - t / 1.21; }
  function ancho(m) { return +String(m).split('x')[0]; }
  // 12/11: el canapé y las bases se envían y se montan como los packs; los complementos solos, a domicilio
  function hayPack() { return CART.items.some(function (i) { return ['pack', 'canape', 'base'].indexOf(i.tipo) > -1; }); }
  function hayColchon() { return CART.items.some(function (i) { return i.tipo === 'colchon' || i.tipo === 'pack'; }); }
  var get = function (k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  var put = function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var logo = function (n) { var p = (LM.PAGOS_SVG || []).filter(function (x) { return x[0] === n; })[0]; return p ? '<svg class="ck-logo" viewBox="' + p[1] + '" role="img" aria-label="' + p[0] + '">' + p[2] + '</svg>' : ''; };

  /* Totales del pedido: los del carrito + la retirada elegida en el checkout */
  function cuentas(ret) {
    var sub = CART.total(), ref = CART.items.reduce(function (s, i) { return s + (i.ref || i.precio) * i.cant; }, 0);
    var r = ret ? ret.p : 0;
    return { ref: ref, dto: ref - sub, regalos: CART.regalos(), sub: sub, ret: r, total: sub + r };
  }
  function filasTotales(c, o) {
    o = o || {};
    return '<dl class="ck-tot">' +
      '<div><dt>Productos</dt><dd>' + LM.eur(c.ref) + '</dd></div>' +
      (c.dto > 0 ? '<div class="ck-tot-dto"><dt>Descuento</dt><dd>−' + LM.eur(c.dto) + '</dd></div>' : '') +
      (c.regalos ? '<div class="ck-tot-reg"><dt>' + LM.ico('gift') + 'Regalos incluidos</dt><dd><s>' + LM.eur(c.regalos) + '</s> Gratis</dd></div>' : '') +
      '<div><dt>Envío</dt><dd class="ck-gratis">Gratis</dd></div>' +
      (o.ret ? '<div><dt>' + esc(o.ret.t) + '</dt><dd>' + LM.eur(o.ret.p) + '</dd></div>' : '') +
      '<div class="ck-tot-t"><dt>Total</dt><dd>' + LM.eur(c.total) + '</dd></div>' +
      '</dl><p class="ck-iva">IVA incluido (' + LM.eur(Math.round(iva(c.total) * 100) / 100) + ')</p>' +
      (c.dto + c.regalos > 0 ? '<p class="ck-ahorro">' + LM.ico('check') + '<span>Te ahorras <b>' + LM.eur(c.dto + c.regalos) + '</b> con esta compra</span></p>' : '');
  }
  function cupon() {
    return '<details class="ck-cupon"><summary>¿Tienes un código de descuento?</summary><div class="ck-cupon-in">' +
      '<label class="lm-sr" for="ck-cod">Código de descuento</label><input id="ck-cod" type="text" autocomplete="off" placeholder="Escribe tu código">' +
      '<button class="lm-btn lm-btn--line" type="button" data-cupon>Aplicar</button></div><p class="ck-cupon-m" hidden></p></details>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cupon]'); if (!b) return;
    var m = b.closest('.ck-cupon').querySelector('.ck-cupon-m'), v = b.closest('.ck-cupon').querySelector('input').value.trim();
    m.hidden = false;
    m.innerHTML = v ? LM.pend('maqueta: el código se comprueba en WooCommerce') : 'Escribe tu código.';
    LM.track('coupon_try', { coupon: v });
  });

  var vacio = '<div class="ck-vacio">' + LM.ico('cart') + '<h1>Tu carrito está vacío</h1><p>Elige tu colchón o un pack con regalos.</p>' +
    '<div class="ck-vacio-b"><a class="lm-btn" href="colchones.html">Ver colchones</a><a class="lm-btn lm-btn--line" href="packs.html">Ver packs</a></div></div>';

  /* =======================================================================
     1 · CARRITO
     ======================================================================= */
  if (PG === 'carrito') {
    var raiz = $('#ck-carrito');
    var pintarCarrito = function () {
      if (!CART.items.length) { raiz.innerHTML = vacio; document.body.classList.remove('lm-has-stick'); return; }
      var c = cuentas(), n = CART.count();
      var base = CART.items.filter(function (i) { return i.tipo !== 'complemento'; })[0], medida = base ? base.medida : LM.medidaInicial();
      var regalados = CART.items.reduce(function (a, i) { return a.concat((i.regalos || []).map(function (r) { return r[0]; })); }, []);
      var comps = LM.COMPLEMENTOS.filter(function (x) { return !x.regalo || regalados.indexOf(x.regalo) < 0; });
      raiz.innerHTML =
        '<div class="ck-tit"><h1>Tu carrito</h1><p>' + n + (n === 1 ? ' producto' : ' productos') + '</p></div>' +
        '<div class="ck-grid">' +
          '<div class="ck-main">' +
            '<section class="ck-card" aria-label="Productos"><ul class="lm-lis lm-lis--big">' + CART.items.map(function (it, i) { return CART.linea(it, i, { quitar: true }); }).join('') + '</ul>' +
            '<a class="ck-seguir" href="colchones.html">' + LM.ico('back') + 'Seguir comprando</a></section>' +
            (comps.length && base ? '<section class="ck-card ck-xs" aria-labelledby="ck-xs-t"><h2 id="ck-xs-t">Completa tu descanso</h2><p class="ck-xs-s">Para tu cama de ' + LM.medidaTxt(medida) + '. Se añade aquí mismo.</p><ul>' +
              comps.map(function (x) {
                var sel = x.porCama(ancho(medida), medida), m = x.medidas.filter(function (y) { return y[0] === sel; })[0];
                if (!m) return '';
                var en = CART.items.some(function (i) { return i.id === m[1]; });
                return '<li class="ck-xs-i" data-k="' + x.k + '"><img src="' + x.img + '" alt="" width="120" height="120" loading="lazy"><div><b>' + esc(x.n) + '</b><small>' + esc(x.d) + '</small>' +
                  (x.elegir ? '<label class="ck-xs-sel"><span class="lm-sr">Medida de la almohada</span><select data-xs-m>' + x.medidas.map(function (y) { return '<option' + (y[0] === sel ? ' selected' : '') + '>' + y[0] + '</option>'; }).join('') + '</select></label>' : '<small class="ck-xs-m">' + (x.k === 'bajera' ? LM.medidaTxt(m[0]) : esc(m[0])) + '</small>') +
                  '<p class="ck-xs-p"><b>' + LM.eur(m[2]) + '</b><s>' + LM.eur(m[3]) + '</s></p></div>' +
                  '<button class="lm-btn lm-btn--line" type="button" data-xs="' + x.k + '"' + (en ? ' disabled' : '') + '>' + (en ? LM.ico('check') + 'Añadido' : 'Añadir') + '</button></li>';
              }).join('') + '</ul></section>' : '') +
          '</div>' +
          '<aside class="ck-side"><div class="ck-card ck-sum"><h2>Resumen</h2>' + filasTotales(c) +
            '<p class="ck-fee">' + LM.cuotaTxt(c.total) + '</p>' +
            '<a class="lm-btn lm-btn--buy lm-btn--full ck-go" href="finalizar-compra.html" data-testid="cart-page-checkout">' + LM.ico('lock') + 'Finalizar compra</a>' +
            cupon() + LM.pagos() + '</div>' +
            '<div class="ck-card ck-conf">' + LM.confianza() + '</div>' +
            LM.llamar('carrito', { label: '¿Prefieres comprar por teléfono?' }) + '</aside>' +
        '</div>' +
        '<div class="ck-bar" aria-hidden="false"><span><small>Total</small><b>' + LM.eur(c.total) + '</b></span><a class="lm-btn lm-btn--buy" href="finalizar-compra.html">' + LM.ico('lock') + 'Finalizar compra</a></div>';
      document.body.classList.toggle('lm-has-stick', matchMedia('(max-width: 899px)').matches);
    };
    raiz.addEventListener('click', function (e) {
      var q = e.target.closest('[data-q]');
      if (q) { CART.setCant(+q.getAttribute('data-i'), +q.getAttribute('data-q')); return; }
      var b = e.target.closest('[data-xs]'); if (!b) return;
      var x = LM.COMPLEMENTOS.filter(function (y) { return y.k === b.getAttribute('data-xs'); })[0];
      var li = b.closest('.ck-xs-i'), s = li.querySelector('[data-xs-m]');
      var base = CART.items.filter(function (i) { return i.tipo !== 'complemento'; })[0];
      var sel = s ? s.value : x.porCama(ancho(base.medida), base.medida), m = x.medidas.filter(function (y) { return y[0] === sel; })[0];
      CART.items.push({ id: m[1], pid: m[1], k: x.k, tipo: 'complemento', nombre: x.n, medida: x.k === 'bajera' ? m[0] : base.medida,
        vtxt: x.k === 'bajera' ? LM.medidaTxt(m[0]) : 'Medida ' + m[0],
        color: '', precio: m[2], ref: m[3], img: x.img, url: '#', regalos: [], cant: 1 });
      LM.track('add_to_cart', { value: m[2], currency: 'EUR', source: 'carrito_complementos', items: [{ item_id: m[1], item_name: x.n, item_variant: m[0], price: m[2] }] });
      CART.save();
    });
    raiz.addEventListener('change', function (e) {
      var s = e.target.closest('[data-xs-m]'); if (!s) return;
      var x = LM.COMPLEMENTOS[0], m = x.medidas.filter(function (y) { return y[0] === s.value; })[0], li = s.closest('.ck-xs-i');
      li.querySelector('.ck-xs-p').innerHTML = '<b>' + LM.eur(m[2]) + '</b><s>' + LM.eur(m[3]) + '</s>';
      var b = li.querySelector('[data-xs]'), en = CART.items.some(function (i) { return i.id === m[1]; });
      b.disabled = en; b.innerHTML = en ? LM.ico('check') + 'Añadido' : 'Añadir';
    });
    document.addEventListener('lm:cart', pintarCarrito);
    // El panel lateral no se abre aquí: el carrito ya está en la página
    var ico = $('.lm-cart'); if (ico) ico.addEventListener('click', function (e) { e.stopImmediatePropagation(); scrollTo({ top: 0, behavior: 'smooth' }); }, true);
    pintarCarrito();
    LM.track('view_cart', { value: CART.total(), currency: 'EUR', source: 'pagina' });
    return;
  }

  /* =======================================================================
     3 · CONFIRMACIÓN
     ======================================================================= */
  if (PG === 'confirmado') {
    var ped = get('lm_pedido'), box = $('#ck-ok');
    if (!ped) { box.innerHTML = '<div class="ck-vacio">' + LM.ico('info') + '<h1>No hay ningún pedido reciente</h1><p>Si acabas de comprar, revisa tu email.</p><div class="ck-vacio-b"><a class="lm-btn" href="index.html">Ir a la tienda</a></div></div>'; return; }
    box.innerHTML =
      '<div class="ck-ok-h"><span class="ck-ok-ic">' + LM.ico('check') + '</span><p class="lm-eyebrow">Pedido ' + esc(ped.num) + '</p>' +
        '<h1>¡Gracias, ' + esc(ped.nombre) + '! Tu pedido está confirmado</h1>' +
        '<p>Te hemos enviado la confirmación a <b>' + esc(ped.email) + '</b>.</p></div>' +
      '<div class="ck-grid ck-grid--ok"><div class="ck-main">' +
        '<section class="ck-card"><h2>Qué pasa ahora</h2><ol class="ck-pasos">' +
          (ped.pago === 'transferencia' ? '<li><b>Haz la transferencia</b><span>Tienes los datos de la cuenta en el email. Preparamos tu pedido cuando nos llega el pago.</span></li>' : '') +
          (ped.pago === 'fin' ? '<li><b>Tu financiación</b><span>' + LM.c('financiacionLarga') + '</span></li>' : '') +
          '<li><b>Preparamos tu pedido</b><span>' + esc(ped.envio.t) + '. ' + esc(ped.envio.d) + '.</span></li>' +
          (ped.ret ? '<li><b>Retirada</b><span>' + esc(ped.ret.t) + '.</span></li>' : '') +
          '<li><b>Pruébalo en casa</b><span>Tienes ' + LM.c('prueba') + ' para probarlo en tu cama. Si no te convence, ' + LM.c('devolucion').toLowerCase() + '.</span></li></ol></section>' +
        '<section class="ck-card"><h2>Te enviamos a</h2><p class="ck-dir">' + esc(ped.dir) + '</p></section>' +
        '<div class="ck-ok-b"><a class="lm-btn" href="index.html">Volver a la tienda</a></div>' +
      '</div><aside class="ck-side"><div class="ck-card ck-sum"><h2>Tu pedido</h2><ul class="lm-lis">' +
        ped.items.map(function (it, i) { return CART.linea(it, i, { cant: false, links: false, compact: true }); }).join('') + '</ul>' +
        '<dl class="ck-tot"><div><dt>Envío</dt><dd class="ck-gratis">Gratis</dd></div>' + (ped.ret ? '<div><dt>' + esc(ped.ret.t) + '</dt><dd>' + LM.eur(ped.ret.p) + '</dd></div>' : '') +
        '<div><dt>Pago</dt><dd>' + esc(ped.pagoT) + '</dd></div><div class="ck-tot-t"><dt>Total</dt><dd>' + LM.eur(ped.total) + '</dd></div></dl>' +
        '<p class="ck-iva">IVA incluido</p></div>' + LM.llamar('confirmado', { label: '¿Alguna duda con tu pedido?' }) + '</aside></div>' +
      '<p class="ck-maq">' + LM.pend('maqueta: número de pedido de ejemplo; no se ha cobrado nada') + '</p>';
    return;
  }

  /* =======================================================================
     2 · CHECKOUT
     ======================================================================= */
  var form = $('#ck-form');
  if (!CART.items.length) { $('#ck-checkout').innerHTML = vacio; return; }
  var guardado = get('lm_ck') || {};
  var soloComp = CART.items.every(function (i) { return i.tipo === 'complemento'; });
  var ENV = soloComp ? [{ k: 'casa', t: 'Envío a domicilio', d: 'Te llega en ' + C.entrega.v, p: 0, nota: 'Método de envío cuando solo hay complementos: confirmar en la tienda' }] : hayPack() ? LM.ENVIOS.pack : LM.ENVIOS.colchon;
  var RET = (hayColchon() ? LM.RETIRADAS.colchon : []).concat(hayPack() ? LM.RETIRADAS.pack : []);
  var st = { envio: guardado.envio && ENV.some(function (x) { return x.k === guardado.envio; }) ? guardado.envio : ENV[0].k, ret: guardado.ret || '', pago: guardado.pago || 'fin' };

  function campo(id, label, o) {
    o = o || {};
    var v = guardado[id] != null ? guardado[id] : '';
    return '<div class="ck-f' + (o.cls ? ' ' + o.cls : '') + '"><label for="ck-' + id + '">' + label + (o.req ? '' : ' <small>(opcional)</small>') + '</label>' +
      (o.select ? '<select id="ck-' + id + '" name="' + id + '"' + (o.ac ? ' autocomplete="' + o.ac + '"' : '') + '><option value="">Elige tu provincia</option>' +
        Object.keys(LM.PROVINCIAS).map(function (k) { return LM.PROVINCIAS[k]; }).sort(function (a, b) { return a.localeCompare(b, 'es'); }).map(function (p) { return '<option' + (p === v ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select>' :
        '<input id="ck-' + id + '" name="' + id + '" type="' + (o.type || 'text') + '"' + (o.ac ? ' autocomplete="' + o.ac + '"' : '') + (o.im ? ' inputmode="' + o.im + '"' : '') +
        (o.max ? ' maxlength="' + o.max + '"' : '') + (o.req ? ' required aria-required="true"' : '') + ' value="' + esc(v) + '"' + (o.ph ? ' placeholder="' + o.ph + '"' : '') + ' aria-describedby="ck-' + id + '-e' + (o.help ? ' ck-' + id + '-h' : '') + '">') +
      (o.help ? '<small class="ck-help" id="ck-' + id + '-h">' + o.help + '</small>' : '') +
      '<p class="ck-err" id="ck-' + id + '-e" role="alert" hidden></p></div>';
  }
  var pagos = [
    { k: 'fin', t: 'Financiación hasta 36 meses', logos: logo('Pepper'), ok: CART.total() >= LM.FINANCIACION.min && CART.total() <= LM.FINANCIACION.max },
    { k: 'tarjeta', t: 'Tarjeta de débito o crédito', logos: logo('Visa') + logo('Mastercard'), ok: true },
    { k: 'bizum', t: 'Bizum', logos: logo('Bizum'), ok: true },
    { k: 'sequra', t: 'Paga en 3 plazos sin coste', logos: logo('seQura'), ok: true },
    { k: 'transferencia', t: 'Transferencia bancaria', logos: '', ok: true }
  ].filter(function (p) { return p.ok; });
  if (!pagos.some(function (p) { return p.k === st.pago; })) st.pago = pagos[0].k;
  function detallePago(k, total) {
    if (k === 'fin') {
      var b = LM.cuotaBaja(total);
      return (b ? '<p class="ck-pd-big">Desde <b>' + LM.eur(b.c) + ' al mes</b> en ' + b.n + ' meses' + LM.ast + '</p>' : '') +
        '<p>Eliges el plazo de 3 a 36 meses al hacer la solicitud con Pepper. ' + LM.c('financiacionLarga') + '</p>';
    }
    if (k === 'tarjeta') return '<p>Pago seguro con tu tarjeta. Tus datos van cifrados y no los guardamos.</p>';
    if (k === 'bizum') return '<p>Confirmas el pago desde la app de tu banco.</p>';
    if (k === 'sequra') return '<p class="ck-pd-big"><b>3 plazos de ' + LM.eur(Math.ceil(total / 3 * 100) / 100) + '</b>, sin coste.</p><p>Con seQura. Pagas el primero hoy.</p>';
    return '<p>Te enviamos los datos de la cuenta por email. Preparamos tu pedido cuando nos llega el pago.</p>';
  }
  /* Paco, 12/11: cada retirada es un botón «Añadir»; solo una a la vez (vuelve a pulsar para quitarla) */
  function botonRet(r) {
    var on = r.k === st.ret;
    return '<div class="ck-rec-i' + (on ? ' is-on' : '') + '">' + LM.ico('recoger') + '<span><b>' + esc(r.t) + '</b><small>' + esc(r.d || '') + '</small></span>' +
      '<button type="button" class="ck-rec-b" data-ret="' + r.k + '" aria-pressed="' + on + '">' + (on ? LM.ico('check') + 'Añadido' : 'Añadir · +' + LM.eur(r.p)) + '</button></div>';
  }
  function retSel() { return RET.filter(function (r) { return r.k === st.ret; })[0] || null; }
  function envSel() { return ENV.filter(function (x) { return x.k === st.envio; })[0]; }
  function etiquetaBoton(k, t) {
    return { fin: 'Continuar con la financiación', tarjeta: 'Pagar ' + LM.eur(t), bizum: 'Pagar con Bizum', sequra: 'Continuar con seQura', transferencia: 'Confirmar pedido' }[k] +
      (k === 'tarjeta' ? '' : ' · ' + LM.eur(t));
  }

  form.innerHTML =
    '<button class="ck-demo" type="button" data-demo>' + LM.ico('info') + 'Maqueta: rellenar con datos de ejemplo</button>' +
    /* 1 · Contacto: el email, lo primero */
    '<section class="ck-card ck-sec" aria-labelledby="ck-s1"><h2 id="ck-s1"><i>1</i>Tus datos de contacto</h2>' +
      campo('email', 'Email', { req: true, type: 'email', ac: 'email', im: 'email', help: 'Aquí te enviamos la confirmación y el seguimiento del pedido.' }) +
      '<p class="ck-sug" id="ck-email-s" hidden></p>' +
      campo('tel', 'Teléfono', { type: 'tel', ac: 'tel-national', im: 'tel', max: 15, help: 'Para que el transportista te avise antes de llegar.' }) +
      '<label class="ck-chk"><input type="checkbox" name="news"' + (guardado.news ? ' checked' : '') + '><span>Quiero recibir novedades y ofertas exclusivas.</span></label>' +
      '<p class="ck-aviso" id="ck-aviso">Guardamos tu email y tu carrito para poder recordarte este pedido si no lo terminas. <button type="button" data-noaviso>No, gracias</button></p>' +
    '</section>' +
    /* 2 · Entrega */
    '<section class="ck-card ck-sec" aria-labelledby="ck-s2"><h2 id="ck-s2"><i>2</i>Dirección de entrega</h2><div class="ck-row">' +
      campo('nombre', 'Nombre', { req: true, ac: 'given-name' }) + campo('apellidos', 'Apellidos', { req: true, ac: 'family-name' }) + '</div>' +
      campo('dir', 'Dirección', { req: true, ac: 'address-line1', ph: 'Calle y número' }) +
      campo('dir2', 'Piso, puerta, escalera…', { ac: 'address-line2' }) +
      '<div class="ck-row ck-row--3">' + campo('cp', 'Código postal', { req: true, ac: 'postal-code', im: 'numeric', max: 5 }) +
        campo('ciudad', 'Ciudad', { req: true, ac: 'address-level2' }) + campo('prov', 'Provincia', { select: true, ac: 'address-level1' }) + '</div>' +
      '<p class="ck-pais">' + LM.ico('home') + 'País: España</p>' +
      campo('nif', 'NIF, NIE o CIF', { req: true, max: 10, help: 'Lo necesitamos para tu factura.' }) +
      '<details class="ck-mas"' + (guardado.empresa ? ' open' : '') + '><summary>Añadir el nombre de una empresa</summary>' + campo('empresa', 'Empresa', { ac: 'organization' }) + '</details>' +
      '<label class="ck-chk"><input type="checkbox" name="otra" data-otra' + (guardado.otra ? ' checked' : '') + '><span>Quiero la factura con otra dirección</span></label>' +
      '<div class="ck-fact" id="ck-fact"' + (guardado.otra ? '' : ' hidden') + '><div class="ck-row">' +
        campo('f_nombre', 'Nombre', { req: true, ac: 'billing given-name' }) + campo('f_apellidos', 'Apellidos', { req: true, ac: 'billing family-name' }) + '</div>' +
        campo('f_dir', 'Dirección', { req: true, ac: 'billing address-line1' }) + campo('f_dir2', 'Piso, puerta, escalera…', { ac: 'billing address-line2' }) +
        '<div class="ck-row ck-row--3">' + campo('f_cp', 'Código postal', { req: true, ac: 'billing postal-code', im: 'numeric', max: 5 }) +
        campo('f_ciudad', 'Ciudad', { req: true, ac: 'billing address-level2' }) + campo('f_prov', 'Provincia', { select: true, ac: 'billing address-level1' }) + '</div>' +
        campo('f_tel', 'Teléfono', { req: true, type: 'tel', ac: 'billing tel-national', im: 'tel', max: 15 }) + '</div>' +
    '</section>' +
    /* 3 · Envío y retirada */
    '<section class="ck-card ck-sec" aria-labelledby="ck-s3"><h2 id="ck-s3"><i>3</i>Envío</h2>' +
      '<div class="ck-ops" role="radiogroup" aria-labelledby="ck-s3">' + ENV.map(function (x) {
        return '<label class="ck-op"><input type="radio" name="envio" value="' + x.k + '"' + (x.k === st.envio ? ' checked' : '') + '>' +
          '<span class="ck-op-t">' + LM.ico('truck') + '<span><b>' + esc(x.t) + '</b><small>' + esc(x.d) + (x.nota ? ' ' + LM.mark({ estado: 'confirmar', nota: x.nota }, '') : '') + '</small></span></span><span class="ck-gratis">Gratis</span></label>';
      }).join('') + '</div>' +
      (RET.length ? '<div class="ck-ret"><p class="ck-ret-t">¿Nos llevamos lo viejo?</p><input type="hidden" name="ret" value="' + esc(st.ret) + '"><div class="ck-rec">' + RET.map(botonRet).join('') + '</div></div>' : '') +
    '</section>' +
    /* 4 · Pago */
    '<section class="ck-card ck-sec" aria-labelledby="ck-s4"><h2 id="ck-s4"><i>4</i>Pago</h2><p class="ck-seg">' + LM.ico('lock') + 'Todas las transacciones son seguras y van cifradas.</p>' +
      '<div class="ck-ops ck-pagos" role="radiogroup" aria-labelledby="ck-s4">' + pagos.map(function (p) {
        return '<div class="ck-pago' + (p.k === st.pago ? ' is-on' : '') + '" data-pk="' + p.k + '"><label class="ck-op"><input type="radio" name="pago" value="' + p.k + '"' + (p.k === st.pago ? ' checked' : '') + '>' +
          '<span class="ck-op-t"><span><b>' + p.t + '</b></span></span><span class="ck-logos">' + p.logos + '</span></label><div class="ck-pd"></div></div>';
      }).join('') + '</div>' +
      '<p class="ck-legal">Tus datos se usan para procesar tu pedido y mejorar tu experiencia en esta web, como explica nuestra <a href="' + LM.WEB + '/politica-de-privacidad/" target="_blank" rel="noopener">política de privacidad</a>.</p>' +
      '<label class="ck-chk ck-terms"><input type="checkbox" name="terms" id="ck-terms" required aria-describedby="ck-terms-e"' + (guardado.terms ? ' checked' : '') + '><span>He leído y acepto los <a href="' + LM.WEB + '/terminos-condiciones-venta/" target="_blank" rel="noopener">términos y condiciones</a> de la web</span></label>' +
      '<p class="ck-err" id="ck-terms-e" role="alert" hidden></p>' +
      '<p class="ck-err ck-err-all" id="ck-err-all" role="alert" hidden></p>' +
      '<button class="lm-btn lm-btn--buy lm-btn--full ck-pay" type="submit" data-testid="place-order"></button>' +
      '<ul class="ck-sellos"><li>' + LM.ico('shield') + LM.c('compraGarantizada') + '</li><li>' + LM.ico('moon') + LM.c('prueba') + ' de prueba</li><li>' + LM.ico('back') + 'Devolución: ' + LM.c('devolucion').toLowerCase() + '</li></ul>' +
      '<p class="ck-maq">' + LM.pend('maqueta: no se cobra nada; en WooCommerce, cada forma de pago abre su pasarela real') + '</p>' +
    '</section>';

  /* Resumen del pedido (columna derecha; en el móvil, plegado arriba) */
  var side = $('#ck-side'), mob = $('#ck-mob');
  function pintarResumen() {
    var c = cuentas(retSel());
    var lista = '<ul class="lm-lis">' + CART.items.map(function (it, i) { return CART.linea(it, i, { cant: false, links: false, badge: true, compact: true }); }).join('') + '</ul>';
    side.innerHTML = '<div class="ck-card ck-sum"><div class="ck-sum-h"><h2>Tu pedido</h2><a href="carrito.html">Editar</a></div>' + lista + cupon() + filasTotales(c, { ret: retSel() }) +
      (LM.cuota(c.total) != null ? '<p class="ck-fee">' + LM.cuotaTxt(c.total) + '</p>' : '') + '</div>' +
      '<div class="ck-card ck-conf"><h3>Compra con tranquilidad</h3>' + LM.confianza() + '<div class="ck-rate">' + LM.rating() + '</div>' + LM.resena(LM.RESENAS[0]) + '</div>';
    mob.innerHTML = '<details class="ck-mob"><summary><span>' + LM.ico('cart') + 'Ver tu pedido (' + CART.count() + ')' + LM.ico('down') + '</span><b>' + LM.eur(c.total) + '</b></summary>' +
      '<div class="ck-mob-in">' + lista + filasTotales(c, { ret: retSel() }) + '<a class="ck-mob-ed" href="carrito.html">Editar el carrito</a></div></details>';
    $$('.ck-pago').forEach(function (d) {
      var on = d.getAttribute('data-pk') === st.pago;
      d.classList.toggle('is-on', on);
      $('.ck-pd', d).innerHTML = on ? detallePago(st.pago, c.total) : '';
    });
    $('.ck-pay', form).innerHTML = LM.ico('lock') + etiquetaBoton(st.pago, c.total);
  }

  /* ---------- validación al momento, en tú ---------- */
  var DOMINIOS = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.es': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmail.co': 'gmail.com',
    'hotmal.com': 'hotmail.com', 'hotmial.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'yaho.es': 'yahoo.es', 'yahoo.co': 'yahoo.com', 'outlok.com': 'outlook.com', 'outlook.co': 'outlook.com' };
  function nifOk(v) {
    v = v.toUpperCase().replace(/[\s-]/g, '');
    var L = 'TRWAGMYFPDXBNJZSQVHLCKE', m;
    if ((m = v.match(/^(\d{8})([A-Z])$/))) return L[+m[1] % 23] === m[2];
    if ((m = v.match(/^([XYZ])(\d{7})([A-Z])$/))) return L[+('XYZ'.indexOf(m[1]) + m[2]) % 23] === m[3];
    return /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(v);
  }
  var REGLAS = {
    email: function (v) { return !v ? 'Escribe tu email.' : !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v) ? 'Revisa tu email: debe ser como nombre@gmail.com.' : ''; },
    tel: function (v) { var d = v.replace(/\D/g, '').replace(/^34(?=\d{9}$)/, ''); return !v ? '' : !/^[6789]\d{8}$/.test(d) ? 'Revisa el teléfono: 9 cifras, sin el prefijo.' : ''; },
    nombre: function (v) { return v ? '' : 'Escribe tu nombre.'; },
    apellidos: function (v) { return v ? '' : 'Escribe tus apellidos.'; },
    dir: function (v) { return !v ? 'Escribe la dirección de entrega.' : v.length < 4 ? 'Revisa la dirección: calle y número.' : ''; },
    cp: function (v) { return !v ? 'Escribe el código postal.' : !/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(v) ? 'Revisa el código postal: 5 cifras (ej.: 30001).' : ''; },
    ciudad: function (v) { return v ? '' : 'Escribe tu ciudad.'; },
    nif: function (v) { return !v ? 'Escribe tu NIF, NIE o CIF.' : !nifOk(v) ? 'Revisa el NIF: 8 números y una letra (ej.: 12345678Z).' : ''; },
    f_nombre: function (v) { return v ? '' : 'Escribe el nombre de la factura.'; },
    f_apellidos: function (v) { return v ? '' : 'Escribe los apellidos de la factura.'; },
    f_dir: function (v) { return v ? '' : 'Escribe la dirección de la factura.'; },
    f_cp: function (v) { return !v ? 'Escribe el código postal.' : !/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(v) ? 'Revisa el código postal: 5 cifras.' : ''; },
    f_ciudad: function (v) { return v ? '' : 'Escribe la ciudad de la factura.'; },
    f_tel: function (v) { return !/^[6789]\d{8}$/.test(v.replace(/\D/g, '').replace(/^34(?=\d{9}$)/, '')) ? 'Escribe un teléfono de 9 cifras.' : ''; }
  };
  function mostrar(id, msg) {
    var i = $('#ck-' + id), e = $('#ck-' + id + '-e'); if (!i || !e) return !msg;
    e.textContent = msg; e.hidden = !msg; i.setAttribute('aria-invalid', msg ? 'true' : 'false');
    i.closest('.ck-f').classList.toggle('is-err', !!msg);
    i.closest('.ck-f').classList.toggle('is-ok', !msg && !!i.value.trim());
    return !msg;
  }
  function validar(id) {
    var i = $('#ck-' + id); if (!i || !REGLAS[id]) return true;
    if (/^f_/.test(id) && $('#ck-fact').hidden) return mostrar(id, '');
    return mostrar(id, REGLAS[id](i.value.trim()));
  }
  function guardar() {
    var d = {};
    $$('input, select', form).forEach(function (i) {
      if (i.type === 'radio') { if (i.checked) d[i.name] = i.value; }
      else if (i.type === 'checkbox') d[i.name] = i.checked;
      else if (i.name) d[i.name] = i.value;
    });
    put('lm_ck', d);
  }
  function sugerir() {
    var i = $('#ck-email'), s = $('#ck-email-s'), m = i.value.trim().toLowerCase().match(/^([^@\s]+)@([^@\s]+)$/);
    var bien = m && DOMINIOS[m[2]];
    s.hidden = !bien;
    if (bien) s.innerHTML = '¿Querías decir <button type="button" data-sug="' + esc(m[1] + '@' + bien) + '">' + esc(m[1] + '@' + bien) + '</button>?';
  }
  form.addEventListener('focusout', function (e) {
    var i = e.target; if (!i.name || !REGLAS[i.name]) return;
    if (i.value.trim()) validar(i.name);   // un campo vacío no da error hasta pulsar el botón
    if (i.name === 'email') { sugerir(); if (!REGLAS.email(i.value.trim())) LM.track('add_contact_info', { method: 'email' }); }
  });
  form.addEventListener('input', function (e) {
    var i = e.target;
    if (i.name === 'cp' || i.name === 'f_cp') {
      i.value = i.value.replace(/\D/g, '').slice(0, 5);
      var p = LM.PROVINCIAS[i.value.slice(0, 2)], sel = $('#ck-' + (i.name === 'cp' ? 'prov' : 'f_prov'));
      if (i.value.length === 5 && p) sel.value = p;
    }
    if (i.closest('.ck-f.is-err') && REGLAS[i.name]) validar(i.name);   // el error se quita en cuanto lo arreglas
    guardar();
  });
  form.addEventListener('change', function (e) {
    var i = e.target;
    if (i.name === 'envio') { st.envio = i.value; LM.track('add_shipping_info', { shipping_tier: i.value, value: CART.total(), currency: 'EUR' }); pintarResumen(); }
    if (i.name === 'ret') { st.ret = i.value; LM.track('select_retirada', { retirada: i.value || 'no' }); pintarResumen(); }
    if (i.name === 'pago') { st.pago = i.value; LM.track('add_payment_info', { payment_type: i.value, value: CART.total(), currency: 'EUR' }); pintarResumen(); }
    if (i.hasAttribute('data-otra')) { $('#ck-fact').hidden = !i.checked; }
    if (i.name === 'terms' && i.checked) { $('#ck-terms-e').hidden = true; i.closest('.ck-chk').classList.remove('is-err'); }
    guardar();
  });
  form.addEventListener('click', function (e) {
    var rb = e.target.closest('[data-ret]');
    if (rb) {
      var k = rb.getAttribute('data-ret'); st.ret = st.ret === k ? '' : k;
      $('.ck-rec', form).innerHTML = RET.map(botonRet).join(''); $('input[name="ret"]', form).value = st.ret;
      LM.track('select_retirada', { retirada: st.ret || 'no' }); pintarResumen(); guardar();
    }
    var s = e.target.closest('[data-sug]');
    if (s) { $('#ck-email').value = s.getAttribute('data-sug'); $('#ck-email-s').hidden = true; validar('email'); guardar(); LM.track('email_suggest_accept'); }
    if (e.target.closest('[data-noaviso]')) { $('#ck-aviso').innerHTML = 'Hecho: no te enviaremos recordatorios de este pedido.'; LM.track('cart_reminder_optout'); }
    if (e.target.closest('[data-demo]')) {
      var D = { email: 'laura@ejemplo.com', tel: '600000000', nombre: 'Laura', apellidos: 'Martínez Ruiz', dir: 'Calle Mayor, 1', dir2: '2.º B', cp: '30001', ciudad: 'Murcia', prov: 'Murcia', nif: '00000000T' };
      Object.keys(D).forEach(function (k) { var i = $('#ck-' + k); if (i) { i.value = D[k]; validar(k); } });
      $('#ck-terms').checked = true; guardar();
    }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var malos = Object.keys(REGLAS).filter(function (id) { var i = $('#ck-' + id); return i && !validar(id); });
    var terms = $('#ck-terms');
    if (!terms.checked) { $('#ck-terms-e').textContent = 'Marca la casilla para aceptar los términos y condiciones.'; $('#ck-terms-e').hidden = false; terms.closest('.ck-chk').classList.add('is-err'); malos.push('terms'); }
    var all = $('#ck-err-all');
    if (malos.length) {
      all.textContent = malos.length === 1 ? 'Te falta revisar 1 campo. Lo hemos marcado en rojo.' : 'Te faltan ' + malos.length + ' campos por revisar. Los hemos marcado en rojo.';
      all.hidden = false;
      var f = $('#ck-' + malos[0]); f.focus({ preventScroll: true }); f.scrollIntoView({ block: 'center', behavior: 'smooth' });
      LM.track('checkout_error', { fields: malos.join(',') });
      return;
    }
    all.hidden = true;
    var c = cuentas(retSel()), v = function (id) { return $('#ck-' + id).value.trim(); };
    var pedido = { num: 'LM-' + String(Date.now()).slice(-6), nombre: v('nombre'), email: v('email'),
      dir: v('nombre') + ' ' + v('apellidos') + ', ' + v('dir') + (v('dir2') ? ', ' + v('dir2') : '') + ', ' + v('cp') + ' ' + v('ciudad') + ($('#ck-prov').value ? ' (' + $('#ck-prov').value + ')' : ''),
      items: CART.items, envio: envSel(), ret: retSel(), pago: st.pago, pagoT: pagos.filter(function (p) { return p.k === st.pago; })[0].t, total: c.total };
    LM.track('purchase', { transaction_id: pedido.num, value: c.total, currency: 'EUR', shipping: 0, payment_type: st.pago,
      items: CART.items.map(function (i) { return { item_id: i.id, item_name: i.nombre, item_variant: i.medida, price: i.precio, quantity: i.cant }; }) });
    put('lm_pedido', pedido);
    try { sessionStorage.removeItem('lm_ck'); } catch (err) {}
    CART.items = []; CART.save();
    location.href = 'pedido-confirmado.html';
  });

  pintarResumen();
  LM.track('begin_checkout', { value: CART.total(), currency: 'EUR', items: CART.items.map(function (i) { return { item_id: i.id, item_name: i.nombre, price: i.precio, quantity: i.cant }; }) });
})();
