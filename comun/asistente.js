/* LO MONACO · Ficha · «Ayúdame a elegir» (29/10, A y B)
   Venta consultiva en un pop-up: 4 preguntas cortas → colchón y medida recomendados.
   Solo se abre si el cliente lo pulsa. Siempre termina en una acción: elegir la medida (vuelve a la compra),
   ver el colchón recomendado si es otro, o llamar.
   Reglas con los datos reales de cada colchón (firmeza, «para quién», frescor). Pendiente: validarlas con el call center. */
(function () {
  'use strict';
  if (!document.getElementById('p-size')) return;
  var $ = LM.$, C = LM.CONFIG, P = LM.PRODUCTOS;
  var K = document.body.getAttribute('data-producto') || 'latex';
  var MEDIDAS = LM.MEDIDAS;

  var PASOS = [
    { k: 'quien', t: '¿Cuántos vais a dormir en el colchón?', ops: [['solo', 'Yo solo', 'body'], ['pareja', 'En pareja', 'couple']] },
    { k: 'medida', t: '¿Sabes la medida de tu cama o canapé?', s: 'Mide por dentro el ancho y el largo de la base. Si no tienes cama todavía, elige «No la sé».', medidas: true },
    { k: 'sens', t: '¿Cómo te gusta el colchón?', ops: [['firme', 'Firme', 'shield'], ['media', 'Ni duro ni blando', 'body'], ['suave', 'Suave y acogedor', 'moon']] },
    { k: 'calor', t: '¿Pasas calor por la noche?', ops: [['si', 'Sí, a menudo', 'thermo'], ['no', 'No especialmente', 'leaf']] }
  ];
  var PASO_ALTO = { k: 'alto', t: '¿Alguno de los dos mide más de 1,85 m?', tSolo: '¿Mides más de 1,85 m?', ops: [['si', 'Sí', 'ruler'], ['no', 'No', 'check']] };

  // Recomendación con los datos de la web: firmeza, adaptabilidad y frescor de cada colchón
  function colchon(r) {
    if (r.sens === 'firme') return r.calor === 'si' ? ['gran', 'visco'] : ['visco', 'gran'];
    if (r.sens === 'media') return r.calor === 'si' ? ['latex', 'gold'] : ['gold', 'latex'];
    return r.calor === 'si' ? ['latex', 'gran'] : ['latex', 'gold'];
  }
  function medida(r) {
    if (r.medida && r.medida !== 'nose') return r.medida;
    var largo = r.alto === 'si' ? '200' : '190';
    return (r.quien === 'pareja' ? '150x' : '90x') + largo;
  }
  var POR_QUE = {
    sens: { firme: 'Te gusta firme', media: 'Buscas un punto medio', suave: 'Te gusta suave y acogedor' },
    calor: { si: 'pasas calor', no: 'no pasas calor' }
  };

  var d = document.createElement('div');
  d.className = 'lm-asis'; d.hidden = true;
  d.innerHTML = '<div class="lm-asis-bg" data-cerrar></div>' +
    '<div class="lm-asis-p" role="dialog" aria-modal="true" aria-labelledby="lm-asis-t" tabindex="-1">' +
      '<button type="button" class="lm-asis-x" data-cerrar aria-label="Cerrar">' + LM.ico('close') + '</button>' +
      '<p class="lm-asis-k">Ayúdame a elegir</p>' +
      '<div class="lm-asis-bar" aria-hidden="true"><i></i></div>' +
      '<div class="lm-asis-c" id="lm-asis-c"></div>' +
    '</div>';
  document.body.appendChild(d);
  var cont = $('#lm-asis-c', d), barra = $('.lm-asis-bar i', d), panel = $('.lm-asis-p', d);
  var r = {}, paso = 0, antes = null;

  function lista() {
    var l = PASOS.slice(0, 2);
    if (r.medida === 'nose') l.push(PASO_ALTO);
    return l.concat(PASOS.slice(2));
  }
  function pintar() {
    var L = lista(), p = L[paso];
    barra.style.width = Math.round(paso / L.length * 100) + '%';
    if (!p) return resultado();
    var h = '<p class="lm-asis-n">Pregunta ' + (paso + 1) + ' de ' + L.length + '</p>' +
      '<h2 class="lm-asis-t" id="lm-asis-t">' + (p.k === 'alto' && r.quien === 'solo' ? p.tSolo : p.t) + '</h2>' + (p.s ? '<p class="lm-asis-s">' + p.s + '</p>' : '');
    if (p.medidas) {
      h += '<div class="lm-asis-med">' + MEDIDAS.map(function (m) {
        var ok = LM.medidaDisponible(m);
        return '<button type="button" data-v="' + m + '"' + (ok ? '' : ' disabled title="No disponible en este colchón"') + '>' + m.replace('x', '×') + '</button>';
      }).join('') + '</div><button type="button" class="lm-asis-op lm-asis-op--ancha" data-v="nose">' + LM.ico('info') + '<span>No la sé</span></button>';
    } else {
      h += '<div class="lm-asis-ops">' + p.ops.map(function (o) {
        return '<button type="button" class="lm-asis-op" data-v="' + o[0] + '">' + LM.ico(o[2]) + '<span>' + o[1] + '</span></button>';
      }).join('') + '</div>';
    }
    h += '<div class="lm-asis-pie">' + (paso ? '<button type="button" class="lm-asis-atras" data-atras>' + '← Atrás</button>' : '<span></span>') +
      '<a class="lm-asis-tel" href="tel:' + C.telefono.tel + '" data-lead="asistente">' + LM.ico('phone') + 'Prefiero llamar</a></div>';
    cont.innerHTML = h;
    var f = cont.querySelector('button:not([disabled])'); if (f) f.focus({ preventScroll: true });
    LM.track('asistente_paso', { paso: p.k });
  }
  function resultado() {
    barra.style.width = '100%';
    var rec = colchon(r), k1 = rec[0], k2 = rec[1], m = medida(r), p1 = P[k1];
    var mismo = k1 === K, dispo = !!(LM.PRECIOS[k1][m] && LM.PRECIOS[k1][m].s);
    var porque = POR_QUE.sens[r.sens] + ' y ' + POR_QUE.calor[r.calor] + (r.quien === 'pareja' ? ', y dormís en pareja.' : '.');
    var h = '<p class="lm-asis-n">Tu recomendación</p>' +
      '<h2 class="lm-asis-t" id="lm-asis-t">' + (mismo ? 'El ' + p1.nombre + ' encaja contigo.' : 'Te recomendamos el ' + p1.nombre + '.') + '</h2>' +
      '<div class="lm-asis-res"><img src="' + p1.img + '" alt="" width="120" height="120">' +
        '<div><b>' + p1.titulo + '</b><span>' + p1.nucleo + ' · ' + p1.altura + ' · Firmeza ' + p1.firmeza + '%</span>' +
        '<span class="lm-asis-med1">Tu medida: <b>' + m.replace('x', ' × ') + ' cm</b></span></div></div>' +
      '<p class="lm-asis-s">' + porque + ' ' + p1.paraQuien + '</p>' +
      '<p class="lm-asis-s lm-asis-rev" data-solo-revision>' + LM.pend('reglas de la recomendación: validar con el call center') + '</p>' +
      '<div class="lm-asis-cta">';
    if (mismo) {
      h += dispo ? '<button type="button" class="lm-btn lm-btn--full" data-medida="' + m + '">Elegir ' + m.replace('x', ' × ') + ' y seguir</button>'
                 : '<p class="lm-asis-s">Esta medida no la fabricamos en este colchón. Llámanos y te ofrecemos la más parecida.</p>';
    } else {
      LM.store.set('lm_medida', m);
      h += '<a class="lm-btn lm-btn--full" href="' + p1.url + '" data-ir="' + k1 + '">Ver el ' + p1.nombre + ' en ' + m.replace('x', ' × ') + '</a>';
      if (LM.medidaDisponible(m)) h += '<button type="button" class="lm-btn lm-btn--line lm-btn--full" data-medida="' + m + '">Quedarme con el ' + P[K].nombre + ' en ' + m.replace('x', ' × ') + '</button>';
    }
    h += '</div>' + (k2 !== K ? '<p class="lm-asis-alt">También te puede encajar: <a href="' + P[k2].url + '">' + P[k2].nombre + '</a>.</p>' : '') +
      '<div class="lm-asis-pie"><button type="button" class="lm-asis-atras" data-repetir>Volver a empezar</button>' +
      '<a class="lm-asis-tel" href="tel:' + C.telefono.tel + '" data-lead="asistente-resultado">' + LM.ico('phone') + 'Llámanos: ' + C.telefono.v + '</a></div>';
    cont.innerHTML = h;
    var f = cont.querySelector('.lm-btn'); if (f) f.focus({ preventScroll: true });
    LM.track('asistente_resultado', { colchon: k1, medida: m, es_este: mismo });
  }

  function abrir() {
    antes = document.activeElement; r = {}; paso = 0;
    d.hidden = false; document.documentElement.classList.add('lm-noscroll');
    pintar(); LM.track('asistente_abrir', { item_id: P[K].id });
  }
  function cerrar() { d.hidden = true; document.documentElement.classList.remove('lm-noscroll'); if (antes && antes.focus) antes.focus(); }

  document.addEventListener('click', function (e) { if (e.target.closest('[data-asistente]')) { e.preventDefault(); abrir(); } });
  d.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-cerrar]')) return cerrar();
    if (t.closest('[data-atras]')) { paso = Math.max(0, paso - 1); return pintar(); }
    if (t.closest('[data-repetir]')) { r = {}; paso = 0; return pintar(); }
    var med = t.closest('[data-medida]');
    if (med) { LM.elegirMedida(med.getAttribute('data-medida')); cerrar(); var b = document.getElementById('p-cta'); if (b) b.focus(); return; }
    var op = t.closest('[data-v]');
    if (op && !op.disabled) {
      var p = lista()[paso]; r[p.k] = op.getAttribute('data-v');
      if (p.k === 'medida' && r.medida !== 'nose') delete r.alto;
      paso++; pintar();
    }
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrar();
    if (e.key === 'Tab') { // el foco no sale del pop-up
      var f = d.querySelectorAll('button:not([disabled]), a[href]'), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
})();
