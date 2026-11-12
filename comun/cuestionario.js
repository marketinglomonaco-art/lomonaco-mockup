/* LO MONACO · Cuestionario «¿Qué colchón es el tuyo?» (home, Paco, 05/11; 12/11: preguntas y puntos del Excel de Paco).
   - Para quién, peso, edad, qué te pasa al dormir, dolencias de espalda y (en pareja) si os molesta notar al otro.
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

  /* Paco, 12/11 · cambios 5 y 6. Preguntas y puntos de su Excel (pulido/recomendador_colchones_puntuado.xlsx, hoja «Puntos»).
     Cada respuesta suma puntos a cada colchón [Natura Visco, Natura Gold, Natura Látex, Gran Natura]; el que más suma es la
     recomendación y el segundo, la alternativa. Empate: gana el que va antes (Visco, Gold, Látex, Gran Natura).
     En pareja, las preguntas personales se contestan para los dos en la misma pantalla y se suman los puntos de los dos. */
  var ORD = ['visco', 'gold', 'latex', 'gran'];
  var PREG = [
    { k: 'quien', t: '¿Para quién es el colchón?', ops: [['1', 'Para mí', 'body', [3, 3, 5, 4]], ['2', 'Para dormir en pareja', 'couple', [4, 5, 4, 6]]] },
    // Peso en rangos amplios, sin pedir el peso exacto. Se traduce al IMC del Excel con una altura media de 1,70 m
    { k: 'peso', yo: 1, t: '¿Cuánto pesas, más o menos?', s: 'Solo para recomendarte la firmeza justa. No se guarda.', ops: [
      ['i1', 'Menos de 55 kg', '', [5, 1, 6, 4]], ['i2', 'Entre 55 y 70 kg', '', [3, 3, 5, 5]], ['i3', 'Entre 70 y 85 kg', '', [1, 4, 4, 5]],
      ['i4', 'Entre 85 y 100 kg', '', [1, 6, 6, 5]], ['i5', 'Más de 100 kg', '', [0, 6, 2, 4]], ['nd', 'Prefiero no decirlo', '', [0, 0, 0, 0]]] },
    { k: 'edad', yo: 1, t: '¿Qué edad tienes?', ops: [
      ['ninos', 'Menos de 12 años', '', [1, 5, 3, 4]], ['adol', 'De 12 a 17 años', '', [1, 5, 4, 4]], ['jov', 'De 18 a 35 años', '', [3, 4, 4, 5]],
      ['med', 'De 36 a 55 años', '', [2, 4, 5, 6]], ['sen', 'De 56 a 70 años', '', [2, 4, 6, 5]], ['anc', 'Más de 70 años', '', [2, 3, 6, 5]]] },
    { k: 'postural', yo: 1, t: '¿Qué te pasa al dormir?', s: 'Elige lo que más se parezca a ti.', ops: [
      ['sin', 'Duermo bien, sin problemas', '', [2, 3, 4, 4]], ['sed', 'Paso muchas horas sin moverme', '', [1, 4, 4, 5]],
      ['lumb', 'Trabajo sentado y acabo cargado de la zona lumbar', '', [1, 4, 4, 5]], ['hombro', 'Me molestan el hombro o la cadera', '', [5, 2, 6, 4]],
      ['movil', 'Tengo la movilidad reducida', '', [1, 5, 6, 5]], ['inq', 'Duermo inquieto, me muevo mucho', '', [1, 4, 5, 5]],
      ['calor', 'Paso calor por la noche', '', [1, 6, 4, 4]], ['dep', 'Hago mucho deporte', '', [3, 3, 5, 5]]] },
    { k: 'pato', yo: 1, t: '¿Tienes alguna dolencia de espalda?', ops: [
      ['sin', 'No, ninguna', '', [2, 3, 4, 4]], ['lumbalgia', 'Lumbalgia', '', [1, 4, 4, 5]], ['hernia', 'Hernia o protrusión discal', '', [1, 4, 4, 5]],
      ['ciatica', 'Ciática', '', [1, 3, 5, 5]], ['cervical', 'Dolor cervical', '', [2, 3, 5, 5]], ['dorsal', 'Dolor en la zona dorsal', '', [1, 3, 4, 5]],
      ['escol', 'Escoliosis leve', '', [1, 5, 4, 4]], ['artrosis', 'Artrosis', '', [3, 2, 6, 4]], ['fibro', 'Fibromialgia', '', [5, 1, 6, 4]]] },
    { k: 'indep', solo2: 1, t: '¿Os molesta notar al otro moverse?', ops: [['baja', 'No, nada', 'check', [0, 0, 0, 0]], ['media', 'Un poco', 'waves', [3, 3, 3, 4]], ['alta', 'Sí, mucho', 'couple', [5, 4, 4, 5]]] }
  ];
  function pregs() { return PREG.filter(function (p) { return !p.solo2 || r.quien === '2'; }); }
  function dos() { return r.quien === '2'; }
  function op(p, v) { return p.ops.filter(function (o) { return o[0] === v; })[0]; }

  LM.recomendar = function (r) {
    var pts = [0, 0, 0, 0], max = 0;
    PREG.forEach(function (p) {
      if (p.solo2 && r.quien !== '2') return;
      var vs = p.yo ? (r[p.k] || []) : [r[p.k]];
      vs.forEach(function (v) { var o = op(p, v); if (!o || v === 'nd') return; o[3].forEach(function (n, i) { pts[i] += n; }); max += 6; });
    });
    var l = ORD.map(function (k, i) { return { k: k, i: i, pts: pts[i], pct: max ? Math.round(100 * pts[i] / max) : 0 }; })
      .sort(function (a, b) { return b.pts - a.pts || a.i - b.i; });
    // Paco: los dos resultados tienen que distar en torno a un 20 %, para que se vea claro cuál va primero
    l[0].pct = Math.min(98, l[0].pct);
    l[1].pct = Math.min(l[1].pct, l[0].pct - 20);
    return l;
  };

  // Beneficios de la ficha que encajan con lo que ha contestado (máx. 3)
  function tiene(k, vals) { return (r[k] || []).some(function (v) { return vals.indexOf(v) > -1; }); }
  function beneficios(k) {
    var B = P[k].beneficios, out = [];
    function busca(re) { B.forEach(function (b) { if (out.length < 3 && out.indexOf(b) < 0 && re.test(b[1] + ' ' + b[2])) out.push(b); }); }
    if (dos()) busca(/pareja/i);
    if (tiene('postural', ['calor'])) busca(/calor|frescor|ventilaci|temperatura/i);
    if (tiene('pato', ['lumbalgia', 'hernia', 'ciatica', 'dorsal', 'escol']) || tiene('postural', ['lumb', 'sed'])) busca(/soporte|postura|espalda/i);
    if (tiene('postural', ['hombro']) || tiene('pato', ['cervical', 'artrosis', 'fibro'])) busca(/adapt|acoge|presi/i);
    B.forEach(function (b) { if (out.length < 3 && out.indexOf(b) < 0) out.push(b); });
    return out;
  }

  // «Buscas un colchón para ___, que te ayude con ___» (como en el script de llamadas)
  var AYUDA = {
    postural: { sed: 'que te sostenga aunque pases horas sin moverte', lumb: 'que descargue la zona lumbar', hombro: 'que alivie la presión en hombro y cadera',
      movil: 'que te ponga fácil moverte y levantarte', inq: 'que no se note cada vez que te mueves', calor: 'que no dé calor', dep: 'que te ayude a recuperarte' },
    pato: { lumbalgia: 'que te ayude con la lumbalgia', hernia: 'que cuide tu espalda', ciatica: 'que te ayude con la ciática', cervical: 'que te ayude con las cervicales',
      dorsal: 'que cuide tu zona dorsal', escol: 'que acompañe a tu espalda', artrosis: 'que alivie la presión en las articulaciones', fibro: 'acogedor, que alivie los puntos de presión' }
  };
  function resumen() {
    var partes = ['Buscas un colchón ' + (dos() ? 'para dormir en pareja' : 'para ti')];
    ['postural', 'pato'].forEach(function (k) { (r[k] || []).forEach(function (v) { var t = AYUDA[k][v]; if (t && partes.indexOf(t) < 0) partes.push(t); }); });
    if (r.indep === 'alta') partes.push('en el que no notéis al otro moveros');
    partes = partes.slice(0, 4);
    var u = partes.pop();
    return (partes.length ? partes.join(', ') + ' y ' + u : u) + '.';
  }

  var r = {}, paso = 0, medida = C.medidaInicial.v;

  function botones(p, quien) {
    var sel = p.yo ? (r[p.k] || [])[quien] : r[p.k], largo = p.ops.length > 4;
    return '<div class="h4q-ops' + (largo ? ' h4q-ops--lista' : p.ops.length > 3 ? ' h4q-ops--4' : '') + '" role="group" aria-label="' + (p.yo && dos() ? (quien ? 'Tu pareja' : 'Tú') : p.t) + '">' + p.ops.map(function (o) {
      return '<button type="button" class="h4q-op" data-v="' + o[0] + '" data-quien="' + quien + '"' + (sel === o[0] ? ' aria-pressed="true"' : '') + '>' + (o[2] ? LM.ico(o[2]) : '') + '<span>' + o[1] + '</span></button>';
    }).join('') + '</div>';
  }
  function pregunta() {
    var L = pregs(), p = L[paso], par = p.yo && dos();
    box.innerHTML =
      '<div class="h4q-top"><p class="h4q-n">Pregunta ' + (paso + 1) + ' de ' + L.length + '</p>' +
        (paso ? '<button type="button" class="h4q-back" data-back>' + LM.ico('right', 'h4q-back-i') + 'Atrás</button>' : '') + '</div>' +
      '<div class="h4q-bar" aria-hidden="true"><i style="width:' + Math.round(paso / L.length * 100) + '%"></i></div>' +
      '<h3 class="h4q-q" id="h4q-q" tabindex="-1">' + (par ? p.t.replace('¿Cuánto pesas', '¿Cuánto pesáis').replace('¿Qué edad tienes', '¿Qué edad tenéis').replace('¿Qué te pasa', '¿Qué os pasa').replace('¿Tienes alguna', '¿Tenéis alguna') : p.t) + '</h3>' +
      (p.s ? '<p class="h4q-s">' + p.s + '</p>' : '') +
      (par ? '<div class="h4q-par"><p class="h4q-quien">Tú</p>' + botones(p, 0) + '<p class="h4q-quien">Tu pareja</p>' + botones(p, 1) + '</div>' +
        '<button type="button" class="lm-btn h4q-sig" data-sig' + ((r[p.k] || [])[0] && (r[p.k] || [])[1] ? '' : ' disabled') + '>Siguiente</button>' : botones(p, 0));
  }
  function avanzar() {
    if (++paso < pregs().length) { pregunta(); $('#h4q-q').focus(); }
    else { medida = dos() ? C.medidaInicial.v : '90x190'; resultado(true); }
  }
  function empezar() { r = {}; paso = 0; res.hidden = true; res.innerHTML = ''; box.hidden = false; pregunta(); }

  box.addEventListener('click', function (e) {
    if (e.target.closest('[data-back]')) { paso = Math.max(0, paso - 1); pregunta(); $('#h4q-q').focus(); return; }
    if (e.target.closest('[data-sig]')) { avanzar(); return; }
    var b = e.target.closest('.h4q-op'); if (!b) return;
    var p = pregs()[paso], v = b.getAttribute('data-v'), q = +b.getAttribute('data-quien');
    LM.track('quiz_answer', { step: paso + 1, question: p.k, answer: v, persona: q });
    if (p.yo) {
      r[p.k] = (r[p.k] || []).slice(); r[p.k][q] = v;
      if (dos()) { $$('.h4q-op[data-quien="' + q + '"]', box).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('[data-sig]', box).disabled = !(r[p.k][0] && r[p.k][1]); return; }
    } else {
      if (p.k === 'quien' && r.quien !== v) { var q0 = r.quien; r = {}; if (q0) LM.track('quiz_restart_quien'); }
      r[p.k] = v;
    }
    avanzar();
  });

  function tarjeta(x, n) {
    var k = x.k, p = P[k], d = LM.PRECIOS[k][medida], f = '../img/' + LM.FOTO_HOME[k];
    var pack = LM.packPagina(k, 'canape');
    return '<article class="h4q-card' + (n ? '' : ' is-top') + '" data-testid="quiz-result-' + k + '">' +
      '<div class="h4q-cimg"><img src="' + f + '-480.webp" alt="Colchón ' + p.nombre + '" width="480" height="480" loading="lazy">' +
        '<span class="lm-pill">' + (n ? 'Alternativa' : 'El más compatible') + '</span>' + LM.selloOcu(k) + '</div>' +
      '<div class="h4q-cb">' +
        '<div class="h4q-pct"><b>' + x.pct + ' %</b><span>compatible contigo</span><i aria-hidden="true"><i style="width:' + x.pct + '%"></i></i></div>' +
        '<p class="lm-card-k">' + p.nucleo + ' · ' + p.altura + '</p><h3>' + p.titulo + '</h3>' +
        '<ul class="h4q-why">' + beneficios(k).map(function (b) { return '<li>' + LM.ico(b[0]) + '<span><b>' + b[1] + '.</b> ' + b[2] + '</span></li>'; }).join('') + '</ul>' +
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
      '<h3 class="h4q-q" id="h4q-q" tabindex="-1">' + resumen() + '</h3>' +
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
