/* LO MONACO · Cuestionario «¿Qué colchón es el tuyo?» (home, Paco, 05/11).
   - 5 preguntas, sacadas de la fase consultiva del script de llamadas del call center.
   - Resultado: los 2 colchones más compatibles, con su % de compatibilidad.
   - Recopilación de lo que buscas, beneficios ligados a tus respuestas, cuota destacada, almohadas de regalo,
     base o canapé, «Ver colchón» y teléfono. La medida se elige en el resultado.
   El % sale de comparar tus respuestas con los datos de la web de cada colchón (firmeza, adaptabilidad,
   frescor y si se nota a la pareja). Las reglas están pendientes de validar con el call center. */
(function () {
  'use strict';
  var box = document.getElementById('h4q');
  if (!box) return;
  var $ = LM.$, $$ = LM.$$, C = LM.CONFIG, P = LM.PRODUCTOS;
  var res = $('#h4q-res');

  var PREG = [
    { k: 'quien', t: '¿Para quién es el colchón?', ops: [['solo', 'Para mí', 'body'], ['pareja', 'Para dormir en pareja', 'couple']] },
    { k: 'postura', t: '¿Cómo duermes?', ops: [['lado', 'De lado', 'body'], ['arriba', 'Boca arriba', 'moon'], ['abajo', 'Boca abajo', 'down'], ['cambio', 'Cambio mucho de postura', 'waves']] },
    { k: 'calor', t: '¿Sueles pasar calor por la noche?', ops: [['mucho', 'Sí, a menudo', 'thermo'], ['aveces', 'A veces', 'waves'], ['no', 'No especialmente', 'leaf']] },
    { k: 'molestia', t: '¿Tienes molestias al despertar?', ops: [['espalda', 'En la espalda', 'shield'], ['cervical', 'En las cervicales', 'user'], ['no', 'No, ninguna', 'check']] },
    { k: 'firmeza', t: '¿Qué firmeza prefieres?', ops: [['firme', 'Firme', 'shield'], ['media', 'Intermedia', 'body'], ['suave', 'Suave y acogedor', 'moon'], ['nose', 'No lo sé', 'info']] }
  ];

  /* Rasgos de cada colchón (0 a 1), a partir de los datos de la web:
     F = firmeza y A = adaptabilidad (porcentajes de la ficha);
     fresco: Látex y Gran Natura «no pasas calor / frescor», Gold «ventilación continua», Visco «fibra termorreguladora»;
     pareja: Gold es «para ti si duermes en pareja»; los muelles y el látex aíslan el movimiento; la visco algo menos. */
  var R = {
    visco: { fresco: 0.6, pareja: 0.85 },
    gold:  { fresco: 0.75, pareja: 1 },
    latex: { fresco: 1, pareja: 0.95 },
    gran:  { fresco: 1, pareja: 0.9 }
  };
  LM.ORDEN.forEach(function (k) { R[k].F = P[k].firmeza / 100; R[k].A = P[k].adaptabilidad / 100; });
  function firme(x) { return Math.max(0, Math.min(1, 0.7 + 3 * (x.F - 0.75))); }   // 75 % → 0,7 · 85 % → 1
  function suave(x) { return 0.5 * Math.max(0, 1 - 3 * (x.F - 0.75)) + 0.5 * x.A; }
  function media(x) { return Math.max(0, 1 - 5 * Math.abs(x.F - 0.8)) * 0.6 + x.A * 0.4; }

  // Cada respuesta suma un criterio con su peso: [peso, función]
  function criterios(r) {
    var c = [];
    if (r.quien === 'pareja') c.push([1, function (x) { return x.pareja; }]);
    c.push({ lado: [1.2, function (x) { return x.A; }], arriba: [1, media], abajo: [1.2, firme], cambio: [1, function (x) { return 0.5 * x.A + 0.5 * x.pareja; }] }[r.postura]);
    if (r.calor === 'mucho') c.push([1.5, function (x) { return x.fresco; }]);
    if (r.calor === 'aveces') c.push([0.7, function (x) { return x.fresco; }]);
    if (r.molestia === 'espalda') c.push([1.2, firme]);
    if (r.molestia === 'cervical') c.push([1.2, function (x) { return x.A; }]);
    if (r.firmeza === 'firme') c.push([1.5, firme]);
    if (r.firmeza === 'media') c.push([1.5, media]);
    if (r.firmeza === 'suave') c.push([1.5, suave]);
    return c;
  }
  LM.recomendar = function (r) {
    var c = criterios(r), tot = c.reduce(function (s, x) { return s + x[0]; }, 0);
    return LM.ORDEN.map(function (k, i) {
      var s = c.reduce(function (t, x) { return t + x[0] * x[1](R[k]); }, 0);
      return { k: k, pct: Math.round(100 * s / tot), i: i };
    }).sort(function (a, b) { return b.pct - a.pct || a.i - b.i; });
  };

  // Beneficios de la ficha que encajan con lo que ha contestado (máx. 3)
  function beneficios(k, r) {
    var B = P[k].beneficios, out = [];
    function busca(re) { B.forEach(function (b) { if (out.length < 3 && out.indexOf(b) < 0 && re.test(b[1] + ' ' + b[2])) out.push(b); }); }
    if (r.quien === 'pareja') busca(/pareja/i);
    if (r.calor !== 'no') busca(/calor|frescor|ventilaci|temperatura/i);
    if (r.molestia === 'espalda' || r.firmeza === 'firme' || r.postura === 'abajo') busca(/soporte|postura|espalda/i);
    if (r.molestia === 'cervical' || r.postura === 'lado' || r.firmeza === 'suave') busca(/adapt|acoge|presi/i);
    B.forEach(function (b) { if (out.length < 3 && out.indexOf(b) < 0) out.push(b); });
    return out;
  }

  // «Buscas un colchón ___, que no dé calor y que te ayude con ___» (como en el script)
  function resumen(r) {
    var tipo = { firme: 'firme', media: 'de firmeza intermedia', suave: 'suave y acogedor', nose: '' }[r.firmeza];
    var partes = ['Buscas un colchón' + (tipo ? ' ' + tipo : '') + (r.quien === 'pareja' ? ' para dormir en pareja' : ' para ti')];
    if (r.postura === 'lado') partes.push('que se adapte a hombros y cadera, porque duermes de lado');
    if (r.postura === 'abajo') partes.push('que te sujete bien, porque duermes boca abajo');
    if (r.calor === 'mucho') partes.push('que no dé calor');
    if (r.calor === 'aveces') partes.push('fresco');
    if (r.molestia === 'espalda') partes.push('que te ayude con la espalda');
    if (r.molestia === 'cervical') partes.push('que te ayude con las cervicales');
    var u = partes.pop();
    return (partes.length ? partes.join(', ') + ' y ' + u : u) + '.';
  }

  var r = {}, paso = 0, medida = C.medidaInicial.v;

  function pregunta() {
    var p = PREG[paso];
    box.innerHTML =
      '<div class="h4q-top"><p class="h4q-n">Pregunta ' + (paso + 1) + ' de ' + PREG.length + '</p>' +
        (paso ? '<button type="button" class="h4q-back" data-back>' + LM.ico('right', 'h4q-back-i') + 'Atrás</button>' : '') + '</div>' +
      '<div class="h4q-bar" aria-hidden="true"><i style="width:' + Math.round(paso / PREG.length * 100) + '%"></i></div>' +
      '<h3 class="h4q-q" id="h4q-q" tabindex="-1">' + p.t + '</h3>' +
      '<div class="h4q-ops' + (p.ops.length > 3 ? ' h4q-ops--4' : '') + '" role="group" aria-labelledby="h4q-q">' + p.ops.map(function (o) {
        return '<button type="button" class="h4q-op" data-v="' + o[0] + '"' + (r[p.k] === o[0] ? ' aria-pressed="true"' : '') + '>' + LM.ico(o[2]) + '<span>' + o[1] + '</span></button>';
      }).join('') + '</div>';
  }
  function empezar() { r = {}; paso = 0; res.hidden = true; res.innerHTML = ''; box.hidden = false; pregunta(); }

  box.addEventListener('click', function (e) {
    if (e.target.closest('[data-back]')) { paso = Math.max(0, paso - 1); pregunta(); $('#h4q-q').focus(); return; }
    var b = e.target.closest('.h4q-op'); if (!b) return;
    r[PREG[paso].k] = b.getAttribute('data-v');
    LM.track('quiz_answer', { step: paso + 1, question: PREG[paso].k, answer: r[PREG[paso].k] });
    if (++paso < PREG.length) { pregunta(); $('#h4q-q').focus(); }
    else { medida = r.quien === 'pareja' ? C.medidaInicial.v : '90x190'; resultado(true); }
  });

  function tarjeta(x, n) {
    var k = x.k, p = P[k], d = LM.PRECIOS[k][medida], f = '../../../img/' + LM.FOTO_HOME[k];
    var pack = LM.href(p.url.replace('colchon-', 'pack-')) + '?base=canape';
    return '<article class="h4q-card' + (n ? '' : ' is-top') + '" data-testid="quiz-result-' + k + '">' +
      '<div class="h4q-cimg"><img src="' + f + '-480.webp" alt="Colchón ' + p.nombre + '" width="480" height="480" loading="lazy">' +
        '<span class="lm-pill">' + (n ? 'Alternativa' : 'El más compatible') + '</span>' + LM.selloOcu(k) + '</div>' +
      '<div class="h4q-cb">' +
        '<div class="h4q-pct"><b>' + x.pct + ' %</b><span>compatible contigo</span><i aria-hidden="true"><i style="width:' + x.pct + '%"></i></i></div>' +
        '<p class="lm-card-k">' + p.nucleo + ' · ' + p.altura + '</p><h3>' + p.titulo + '</h3>' +
        '<ul class="h4q-why">' + beneficios(k, r).map(function (b) { return '<li>' + LM.ico(b[0]) + '<span><b>' + b[1] + '.</b> ' + b[2] + '</span></li>'; }).join('') + '</ul>' +
        (d ? '<div class="h4q-price"><p class="h4q-fee">' + LM.cuotaBajaFrase(d.p) + '</p>' +
          '<p class="h4q-cash">o ' + LM.eur(d.p) + (d.r > d.p ? ' <s>' + LM.eur(d.r) + '</s>' : '') + ' al contado, en ' + LM.medidaTxt(medida) + '</p></div>'
          : '<p class="c-na">No lo fabricamos en ' + LM.medidaTxt(medida) + '.</p>') +
        LM.regaloAlmohadas() +
        '<p class="h4q-base">¿Lo quieres con base o canapé? <a href="' + pack + '">Ver el pack con canapé</a></p>' +
        '<a class="lm-btn lm-btn--full h4q-go" href="' + LM.href(p.url) + '" data-k="' + k + '">Ver colchón</a>' +
      '</div></article>';
  }

  function resultado(primera) {
    var top = LM.recomendar(r).slice(0, 2);
    box.innerHTML =
      '<p class="h4q-n">Tu resultado</p><div class="h4q-bar" aria-hidden="true"><i style="width:100%"></i></div>' +
      '<h3 class="h4q-q" id="h4q-q" tabindex="-1">' + resumen(r) + '</h3>' +
      '<p class="h4q-s">Estos son los dos colchones que mejor encajan contigo. Elige tu medida para ver el precio:</p>' +
      '<label class="h4q-med"><span>Medida</span><select id="h4q-med">' + LM.MEDIDAS.map(function (m) { return '<option value="' + m + '"' + (m === medida ? ' selected' : '') + '>' + LM.medidaTxt(m) + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" class="h4q-again" data-again>Repetir el test</button>';
    res.hidden = false;
    res.innerHTML = '<div class="h4q-cards">' + top.map(tarjeta).join('') + '</div>' +
      '<div class="h4q-call"><p><b>¿Lo hablamos?</b> Te ayudamos a decidir entre los dos, sin compromiso. ' + C.horario.v + '.</p>' + LM.llamar('home-cuestionario') + '</div>';
    LM.fill(res);
    if (primera) {
      LM.track('quiz_result', { first: top[0].k, first_pct: top[0].pct, second: top[1].k, second_pct: top[1].pct, answers: JSON.stringify(r) });
      $('#h4q-q').focus();
    }
  }
  box.addEventListener('change', function (e) { if (e.target.id === 'h4q-med') { medida = e.target.value; resultado(false); } });
  box.addEventListener('click', function (e) { if (e.target.closest('[data-again]')) { empezar(); $('#h4q-q').focus(); } });
  // La medida elegida pasa a la ficha (la ficha la lee al abrir)
  res.addEventListener('click', function (e) {
    var a = e.target.closest('.h4q-go'); if (!a) return;
    LM.store.set('lm_medida', medida);
    LM.track('select_item', { item_list_name: 'home_cuestionario', item_id: P[a.getAttribute('data-k')].id });
  });

  empezar();
})();
