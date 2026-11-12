/* LO MONACO · Mi cuenta (Paco, 12/11).
   Lo de WooCommerce (entrar o registrarse, pedidos, direcciones, datos, contraseña) con la estética LM, y extras de descanso:
   seguimiento de la entrega, cuenta atrás de las noches de prueba, garantía, valorar el colchón, repetir compra y ayuda.
   MAQUETA: se entra con cualquier dato y el pedido es el último hecho en el checkout de la maqueta (o uno de ejemplo). */
(function () {
  'use strict';
  if (document.body.getAttribute('data-page') !== 'cuenta') return;
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, root = $('#mc');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var get = function (k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  var put = function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fecha(d) { return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear(); }
  function dias(n, desde) { var d = new Date(desde || Date.now()); d.setDate(d.getDate() + n); return d; }
  var NOCHES = parseInt(C.prueba.v, 10) || 150;

  /* Pedido: el del checkout de la maqueta o uno de ejemplo con productos y precios reales */
  function pedidoEjemplo() {
    var pk = LM.TIENDA.packs.goldCanape, d = pk.tabla['150x190'].Nogal;
    return { num: 'LM-24871', ejemplo: true, nombre: 'Laura', email: 'laura@ejemplo.com', fecha: dias(-9).toISOString(),
      dir: 'Laura Martínez Ruiz, Calle Mayor, 1, 2.º B, 30001 Murcia (Murcia)', envio: LM.ENVIOS.pack[0], ret: null, pago: 'fin', pagoT: 'Financiación hasta 36 meses', total: d.p,
      items: [{ id: d.id, nombre: pk.nombre, medida: '150x190', color: 'Nogal', precio: d.p, ref: d.r, cant: 1, tipo: 'pack', img: '../img/tienda/' + pk.fotoColor.Nogal + '-700.webp', url: pk.pagina,
        regalos: LM.REGALOS.filter(function (r) { return pk.regalos.indexOf(r[2]) > -1; }).map(function (r) { return [r[0], r[4], r[3]]; }) }] };
  }
  function pedido() { var p = get('lm_pedido'); if (p && !p.fecha) { p.fecha = new Date().toISOString(); put('lm_pedido', p); } return p || pedidoEjemplo(); }
  var user = get('lm_user');

  /* ================= Entrar o crear cuenta ================= */
  function acceso() {
    root.innerHTML =
      '<nav class="lm-w c-crumbs" aria-label="Estás aquí"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Mi cuenta</span></nav>' +
      '<section class="lm-w mc-acc"><div class="mc-acc-in">' +
        '<div class="ck-card mc-form"><div class="mc-tabs" role="tablist"><button role="tab" type="button" data-t="entrar" aria-selected="true">Entrar</button><button role="tab" type="button" data-t="crear" aria-selected="false">Crear cuenta</button></div>' +
          '<form id="mc-entrar" novalidate><h1 class="mc-h1">Hola de nuevo</h1>' +
            '<div class="ck-f"><label for="mc-e">Email o usuario</label><input id="mc-e" type="email" autocomplete="username" required></div>' +
            '<div class="ck-f"><label for="mc-p">Contraseña</label><input id="mc-p" type="password" autocomplete="current-password" required></div>' +
            '<div class="mc-row"><label class="ck-chk"><input type="checkbox" checked><span>Recuérdame</span></label><a href="#" data-olvido>¿Has olvidado la contraseña?</a></div>' +
            '<button class="lm-btn lm-btn--full" type="submit">Entrar</button>' +
            '<button class="ck-demo" type="button" data-demo>' + LM.ico('info') + 'Maqueta: entrar con la cuenta de ejemplo</button></form>' +
          '<form id="mc-crear" hidden novalidate><h1 class="mc-h1">Crea tu cuenta</h1>' +
            '<div class="ck-f"><label for="mc-ce">Email</label><input id="mc-ce" type="email" autocomplete="email" required></div>' +
            '<div class="ck-f"><label for="mc-cp">Contraseña</label><input id="mc-cp" type="password" autocomplete="new-password" required><small class="ck-help">Mínimo 8 caracteres.</small></div>' +
            '<p class="ck-legal">Tus datos se usan para gestionar tu cuenta y tus pedidos, como explica nuestra <a href="' + LM.WEB + '/politica-de-privacidad/" target="_blank" rel="noopener">política de privacidad</a>.</p>' +
            '<button class="lm-btn lm-btn--full" type="submit">Crear cuenta</button></form>' +
          '<p class="mc-err" id="mc-err" role="alert" hidden></p></div>' +
        '<div class="mc-acc-side"><div class="ck-card"><h2>Sigue tu pedido sin entrar</h2><p class="mc-muted">Con el número de pedido y el email de la compra.</p>' +
          '<form id="mc-seg" class="mc-seg" novalidate><div class="ck-f"><label for="mc-sn">N.º de pedido</label><input id="mc-sn" placeholder="LM-12345"></div><div class="ck-f"><label for="mc-se">Email</label><input id="mc-se" type="email"></div><button class="lm-btn lm-btn--line" type="submit">Ver el estado</button></form><div id="mc-seg-r" aria-live="polite"></div></div>' +
          '<div class="ck-card"><h2>Con tu cuenta</h2><ul class="tf-lista"><li>' + LM.ico('truck') + 'Sigues tu entrega paso a paso.</li><li>' + LM.ico('moon') + 'Ves cuántas noches de prueba te quedan.</li><li>' + LM.ico('shield') + 'Tienes tu garantía a mano.</li><li>' + LM.ico('back') + 'Repites compra en un clic.</li></ul>' +
          '<p class="mc-muted">No hace falta cuenta para comprar.</p></div></div>' +
      '</div></section>';
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) { $$('[role="tab"]', root).forEach(function (x) { x.setAttribute('aria-selected', x === t); }); $('#mc-entrar').hidden = t.getAttribute('data-t') !== 'entrar'; $('#mc-crear').hidden = t.getAttribute('data-t') !== 'crear'; }
      if (e.target.closest('[data-demo]')) entrar('laura@ejemplo.com', 'Laura');
      if (e.target.closest('[data-olvido]')) { e.preventDefault(); err('Te enviaremos un enlace para crear una contraseña nueva. ' + LM.pend('maqueta: en WooCommerce, «Recuperar contraseña»')); }
    });
    function err(m) { var x = $('#mc-err'); x.innerHTML = m; x.hidden = !m; }
    $('#mc-entrar').addEventListener('submit', function (e) {
      e.preventDefault(); var em = $('#mc-e').value.trim();
      if (!em || !$('#mc-p').value) return err('Escribe tu email y tu contraseña.');
      entrar(em, em.split('@')[0]);
    });
    $('#mc-crear').addEventListener('submit', function (e) {
      e.preventDefault(); var em = $('#mc-ce').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)) return err('Revisa tu email: debe ser como nombre@gmail.com.');
      if ($('#mc-cp').value.length < 8) return err('La contraseña necesita al menos 8 caracteres.');
      LM.track('sign_up', { method: 'email' }); entrar(em, em.split('@')[0]);
    });
    $('#mc-seg').addEventListener('submit', function (e) {
      e.preventDefault(); var p = pedido(), n = $('#mc-sn').value.trim().toUpperCase();
      $('#mc-seg-r').innerHTML = n && n === p.num ? seguimiento(p) : '<p class="mc-err">No encontramos ese pedido. Revisa el número (está en el email de confirmación) o llámanos.</p><p class="mc-muted">' + LM.pend('maqueta: prueba con ' + p.num) + '</p>';
    });
  }
  function entrar(email, nombre) {
    var p = get('lm_pedido');
    user = { email: email, nombre: p && p.nombre ? p.nombre : nombre.charAt(0).toUpperCase() + nombre.slice(1) };
    put('lm_user', user); LM.track('login', { method: 'email' }); panel('resumen');
    scrollTo(0, 0);
  }

  /* ================= Seguimiento ================= */
  function seguimiento(p) {
    var f0 = new Date(p.fecha), plazo = /14 a 20/.test(p.envio.d) ? 20 : 6, hoy = Date.now(), entrega = dias(plazo, f0);
    var pasos = [['Pedido confirmado', fecha(f0)], ['Preparando tu pedido', fecha(dias(2, f0))], ['En reparto', 'Te llamamos antes de ir'], ['Entregado' + (/montaje/i.test(p.envio.t) ? ' y montado' : ''), 'Hacia el ' + fecha(entrega)]];
    var dTrans = (hoy - f0) / 864e5, actual = dTrans < 2 ? 0 : dTrans < plazo - 2 ? 1 : dTrans < plazo ? 2 : 3;
    return '<ol class="mc-track">' + pasos.map(function (x, i) { return '<li class="' + (i < actual ? 'is-done' : i === actual ? 'is-on' : '') + '"><i>' + (i < actual ? LM.ico('check') : i + 1) + '</i><span><b>' + x[0] + '</b><small>' + x[1] + '</small></span></li>'; }).join('') + '</ol>' +
      '<p class="mc-muted">' + esc(p.envio.t) + '. ' + esc(p.envio.d) + '. ' + LM.pend('maqueta: estados de ejemplo; en producción, los del transportista') + '</p>';
  }

  /* ================= Panel ================= */
  var SECS = [['resumen', 'Resumen', 'home'], ['pedidos', 'Mis pedidos', 'box'], ['descanso', 'Mi descanso', 'moon'], ['direcciones', 'Direcciones', 'truck'], ['datos', 'Mis datos', 'user']];
  function panel(sec) {
    var p = pedido(), it = p.items[0];
    var entrega = dias(/14 a 20/.test(p.envio.d) ? 20 : 6, new Date(p.fecha)), usadas = Math.max(0, Math.round((Date.now() - entrega) / 864e5)), quedan = Math.max(0, NOCHES - usadas);
    var finPrueba = dias(NOCHES, entrega), finGar = new Date(entrega); finGar.setFullYear(finGar.getFullYear() + (parseInt(C.garantia.v, 10) || 10));
    var H = {};
    H.resumen = '<h1 class="mc-h1">Hola, ' + esc(user.nombre) + '</h1>' +
      '<div class="mc-grid"><div class="ck-card mc-ped"><div class="mc-ped-h"><h2>Tu pedido ' + esc(p.num) + '</h2><span class="mc-tag">' + (Date.now() < entrega ? 'En camino' : 'Entregado') + '</span></div>' +
        '<div class="mc-ped-it"><img src="' + esc(it.img) + '" alt="" width="96" height="96"><span><b>' + esc(it.nombre) + '</b><small>' + LM.medidaTxt(it.medida) + (it.color ? ' · ' + esc(it.color) : '') + (p.items.length > 1 ? ' · y ' + (p.items.length - 1) + ' más' : '') + '</small></span></div>' +
        seguimiento(p) + '</div>' +
      '<div class="ck-card mc-noches"><h2>Tus noches de prueba</h2><p class="mc-big"><b>' + (Date.now() < entrega ? NOCHES : quedan) + '</b> de ' + NOCHES + '</p>' +
        '<div class="mc-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + NOCHES + '" aria-valuenow="' + quedan + '"><i style="width:' + Math.round((Date.now() < entrega ? NOCHES : quedan) / NOCHES * 100) + '%"></i></div>' +
        '<p class="mc-muted">' + (Date.now() < entrega ? 'Empiezan a contar el día que lo recibes.' : 'Hasta el ' + fecha(finPrueba) + '. Si no te convence, ' + LM.c('devolucion').toLowerCase() + '.') + '</p></div>' +
      '<div class="ck-card mc-gar"><h2>Tu garantía</h2><p class="mc-big"><b>' + LM.c('garantia') + '</b></p><p class="mc-muted">Tu colchón está cubierto hasta el ' + fecha(finGar) + '. Guarda este pedido: es tu justificante.</p><a class="mc-link" href="#" data-sec="descanso">Qué cubre' + LM.ico('right') + '</a></div>' +
      '<div class="ck-card mc-val"><h2>¿Qué tal duermes?</h2><p class="mc-muted">Cuéntanos cómo te va con tu colchón. Tu opinión ayuda a otros a elegir.</p>' +
        '<div class="mc-stars" role="radiogroup" aria-label="Tu valoración">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" aria-checked="false" data-star="' + n + '" aria-label="' + n + ' de 5">' + LM.ico('star') + '</button>'; }).join('') + '</div>' +
        '<a class="lm-btn lm-btn--line" href="' + C.valoracion.url + '" target="_blank" rel="noopener" data-opinar>Escribir mi opinión en Trusted Shops</a></div></div>' +
      '<div class="ck-card mc-rep"><h2>Completa tu descanso</h2><p class="mc-muted">Para tu cama de ' + LM.medidaTxt(it.medida) + '.</p><div class="mc-rep-g">' +
        ['almLatex', 'bajera', 'edredon'].map(function (k) { var P = LM.TIENDA[k]; var d = LM.desdeTabla ? null : null; var b = null; Object.keys(P.tabla).forEach(function (m) { var x = P.tabla[m]['-']; if (!b || x.p < b.p) b = x; });
          return '<a class="mc-rep-c" href="' + P.pagina + '">' + LM.tfImg(P.fotos[0], { alt: '' }) + '<b>' + esc(P.nombre) + '</b><small>Desde ' + LM.eur(b.p) + '</small></a>'; }).join('') +
        '</div><button class="lm-btn" type="button" data-repetir>' + LM.ico('back') + 'Repetir mi último pedido</button></div>' +
      '<div class="mc-ayuda">' + LM.llamar('cuenta', { label: '¿Necesitas ayuda con tu pedido?' }) + '<a class="lm-foot-wa mc-wa" href="https://wa.me/+34650282094" data-lead="whatsapp" target="_blank" rel="noopener">' + LM.ico('chat') + 'WhatsApp</a></div>';
    H.pedidos = '<h1 class="mc-h1">Mis pedidos</h1><div class="ck-card"><table class="mc-tabla"><thead><tr><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Total</th><th></th></tr></thead><tbody>' +
      '<tr><td><b>' + esc(p.num) + '</b></td><td>' + fecha(new Date(p.fecha)) + '</td><td><span class="mc-tag">' + (Date.now() < entrega ? 'En camino' : 'Entregado') + '</span></td><td>' + LM.eur(p.total) + '</td><td><button type="button" class="mc-link" data-ver>Ver</button></td></tr>' +
      '</tbody></table><div class="mc-det" id="mc-det" hidden><ul class="lm-lis">' + p.items.map(function (x, i) { return LM.cart.linea(x, i, { cant: false, links: false, compact: true }); }).join('') + '</ul>' +
      '<p class="mc-muted">Pago: ' + esc(p.pagoT) + ' · Envío: ' + esc(p.envio.t) + '</p><p><a class="lm-btn lm-btn--line" href="#" data-factura>' + LM.ico('pdf') + 'Descargar factura</a> ' + LM.pend('factura PDF de WooCommerce') + '</p></div></div>';
    H.descanso = '<h1 class="mc-h1">Mi descanso</h1><div class="mc-grid">' +
      '<div class="ck-card"><h2>Noches de prueba</h2><p>' + LM.c('devolucionCond') + '</p><p class="mc-muted">' + (Date.now() < entrega ? 'Tus ' + NOCHES + ' noches empiezan el día de la entrega.' : 'Te quedan ' + quedan + ' noches, hasta el ' + fecha(finPrueba) + '.') + '</p>' +
        '<a class="lm-btn lm-btn--line" href="tel:' + C.telefono.tel + '" data-lead="cuenta-devolucion">Quiero devolverlo</a></div>' +
      '<div class="ck-card"><h2>Garantía de ' + LM.c('garantia') + '</h2><p>' + LM.c('garantiaCubre') + '</p></div>' +
      '<div class="ck-card"><h2>Cuida tu colchón</h2><ul class="tf-lista"><li>' + LM.ico('check') + 'Sácalo del embalaje antes de 7 días.</li><li>' + LM.ico('check') + 'Usa un protector: alarga su vida.</li><li>' + LM.ico('check') + 'Gíralo de vez en cuando.</li><li>' + LM.ico('check') + 'Ponlo sobre una base que deje transpirar.</li></ul></div>' +
      '<div class="ck-card"><h2>¿Te llevamos lo viejo?</h2><p class="mc-muted">Si no lo pediste en la compra, llámanos: colchón 49,01 €, base o canapé 49,01 €, base y colchón 89 €.</p>' + LM.llamar('cuenta-retirada', { label: 'Pide la retirada' }) + '</div></div>';
    H.direcciones = '<h1 class="mc-h1">Direcciones</h1><div class="mc-grid">' +
      '<div class="ck-card"><h2>Dirección de entrega</h2><p>' + esc(p.dir) + '</p><button type="button" class="mc-link" data-editar>Editar</button></div>' +
      '<div class="ck-card"><h2>Dirección de facturación</h2><p>La misma que la de entrega.</p><button type="button" class="mc-link" data-editar>Añadir otra</button></div></div>';
    H.datos = '<h1 class="mc-h1">Mis datos</h1><form class="ck-card mc-datos" novalidate><div class="ck-row"><div class="ck-f"><label for="md-n">Nombre</label><input id="md-n" value="' + esc(user.nombre) + '" autocomplete="given-name"></div><div class="ck-f"><label for="md-a">Apellidos</label><input id="md-a" autocomplete="family-name"></div></div>' +
      '<div class="ck-f"><label for="md-e">Email</label><input id="md-e" type="email" value="' + esc(user.email) + '" autocomplete="email"></div>' +
      '<h2>Cambiar la contraseña</h2><div class="ck-row"><div class="ck-f"><label for="md-p1">Contraseña actual</label><input id="md-p1" type="password" autocomplete="current-password"></div><div class="ck-f"><label for="md-p2">Contraseña nueva</label><input id="md-p2" type="password" autocomplete="new-password"></div></div>' +
      '<label class="ck-chk"><input type="checkbox"><span>Quiero recibir novedades y ofertas exclusivas.</span></label>' +
      '<button class="lm-btn" type="submit">Guardar cambios</button><p class="mc-ok" hidden>' + LM.ico('check') + 'Cambios guardados.</p></form>';
    root.innerHTML =
      '<nav class="lm-w c-crumbs" aria-label="Estás aquí"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Mi cuenta</span></nav>' +
      '<section class="lm-w mc-panel"><nav class="mc-nav" aria-label="Mi cuenta">' + SECS.map(function (s) { return '<a href="#' + s[0] + '" data-sec="' + s[0] + '"' + (s[0] === sec ? ' aria-current="page"' : '') + '>' + LM.ico(s[2]) + s[1] + '</a>'; }).join('') +
        '<button type="button" data-salir>' + LM.ico('back') + 'Cerrar sesión</button></nav>' +
      '<div class="mc-main">' + (p.ejemplo ? '<p class="mc-ej">' + LM.pend('maqueta: pedido de ejemplo con productos y precios reales; haz una compra en la maqueta y saldrá la tuya') + '</p>' : '') + H[sec] + '</div></section>';
    LM.fill(root);
    history.replaceState(null, '', '#' + sec);
    LM.track('cuenta_ver', { seccion: sec });
  }
  root.addEventListener('click', function (e) {
    if (!user) return;
    var s = e.target.closest('[data-sec]'); if (s) { e.preventDefault(); panel(s.getAttribute('data-sec')); return; }
    if (e.target.closest('[data-salir]')) { try { sessionStorage.removeItem('lm_user'); } catch (x) {} user = null; acceso(); return; }
    var st = e.target.closest('[data-star]');
    if (st) { var n = +st.getAttribute('data-star'); $$('[data-star]', root).forEach(function (b) { var on = +b.getAttribute('data-star') <= n; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', +b.getAttribute('data-star') === n); }); LM.track('valorar', { estrellas: n }); }
    if (e.target.closest('[data-ver]')) { var d = $('#mc-det'); d.hidden = !d.hidden; }
    if (e.target.closest('[data-repetir]')) { pedido().items.forEach(function (x) { LM.cart.add(JSON.parse(JSON.stringify(x)), 'cuenta_repetir'); }); }
    if (e.target.closest('[data-factura]') || e.target.closest('[data-editar]')) e.preventDefault();
  });
  root.addEventListener('submit', function (e) { if (e.target.classList.contains('mc-datos')) { e.preventDefault(); $('.mc-ok', root).hidden = false; } });
  if (user) panel((location.hash || '#resumen').slice(1).replace(/[^a-z]/g, '') || 'resumen'); else acceso();
})();
