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
    /* Paco, 13/11: la edad va dentro de «¿Para quién es el colchón?». Cada botón = quién + su edad (grupos).
       Los puntos de «para quién» y de la edad son los del Excel; «Para mis hijos» suma como «Para mí» (una persona). */
    /* Paco, 18/11: la primera pregunta se queda en 4 respuestas, en una fila, sin pedir la edad exacta. Las 4 que más cambian
       la recomendación: una persona, pareja, hijos y persona mayor (la edad pesa en el Excel: más de 70 sube Látex y baja Gold).
       Cada una suma la edad más habitual: mí y pareja = 36-55; hijos = 12-17; persona mayor = más de 70.
       «Para una persona mayor» suma como «Para mí» (una persona) y las preguntas siguientes van en tercera persona, como hijos.
       Paco, 18/11 (después): fuera «Para una persona mayor»; quedan 3 y «Para dormir en pareja» en dos líneas */
    { k: 'quien', t: '¿Para quién es el colchón?', s: 'Elige quién va a dormir en él.',
      ops: [['1', 'Para mí', 'user', [3, 3, 5, 4], 'med'], ['2', 'Para dormir<br>en pareja', 'couple', [4, 5, 4, 6], 'med'],
            ['h', 'Para mis hijos', 'nino', [3, 3, 5, 4], 'adol']] },
    // Peso en rangos amplios, sin pedir el peso exacto. Se traduce al IMC del Excel con una altura media de 1,70 m
    /* Paco, 18/11: máximo 4 respuestas por pregunta, para que entren en una fila. Peso: «Menos de 55» y «Entre 55 y 70» se juntan
       en «Menos de 70 kg» (puntos de 55-70) y sale «Prefiero no decirlo» (ya pone que no se guarda) */
    { k: 'peso', yo: 1, t: '¿Cuánto pesas, más o menos?', t2: '¿Cuánto pesáis, más o menos?', t3: '¿Cuánto pesa, más o menos?', s: 'Solo para recomendarte la firmeza justa. No se guarda.', ops: [
      ['i2', 'Menos de 70 kg', '', [3, 3, 5, 5]], ['i3', 'Entre 70 y 85 kg', '', [1, 4, 4, 5]],
      ['i4', 'Entre 85 y 100 kg', '', [1, 6, 6, 5]], ['i5', 'Más de 100 kg', '', [0, 6, 2, 4]]] },
    // La edad ya no se pregunta aparte (sale del primer paso), pero sigue sumando sus puntos
    { k: 'edad', yo: 1, auto: 1, ops: [
      ['ninos', '', '', [1, 5, 3, 4]], ['adol', '', '', [1, 5, 4, 4]], ['jov', '', '', [3, 4, 4, 5]],
      ['med', '', '', [2, 4, 5, 6]], ['sen', '', '', [2, 4, 6, 5]], ['anc', '', '', [2, 3, 6, 5]]] },
    /* Paco, 18/11: la antigua «¿Qué se parece más a ti?» se parte en dos: una de la noche (con cuál te identificas al dormir)
       y otra del día a día (horas sentado, zona lumbar, deporte). Mismos puntos del Excel. 5.º campo: texto para «Para mis hijos» (null = no sale) */
    { k: 'postural', yo: 1, t: '¿Con cuál te identificas más por la noche?', t2: '¿Con cuál se identifica más cada uno por la noche?', t3: '¿Con cuál se identifica más por la noche?',
      s: 'Elige la frase que más se parezca a ti.', s2: 'Elige una frase para ti y otra para tu pareja.', s3: 'Elige la frase que más se parezca a tu hijo o hija.', ops: [
      ['sin', 'Duermo bien, nada en especial', '', [2, 3, 4, 4], 'Duerme bien, nada en especial'],
      ['hombro', 'Duermo de lado y noto el hombro o la cadera', '', [5, 2, 6, 4], 'Duerme de lado y nota el hombro o la cadera'],
      ['inq', 'Me muevo mucho por la noche', '', [1, 4, 5, 5], 'Se mueve mucho por la noche'],
      ['calor', 'Paso calor por la noche', '', [1, 6, 4, 4], 'Pasa calor por la noche']] },
    { k: 'dia', yo: 1, t: '¿Y en tu día a día, con cuál te identificas más?', t2: '¿Y en vuestro día a día, con cuál se identifica más cada uno?', t3: '¿Y en su día a día, con cuál se identifica más?',
      s: 'Lo que haces durante el día también cuenta para elegir el colchón.', s2: 'Lo que hacéis durante el día también cuenta para elegir el colchón.', s3: 'Lo que hace durante el día también cuenta para elegir el colchón.', ops: [
      ['tranq', 'Llevo un ritmo tranquilo', '', [2, 3, 4, 4], 'Lleva un ritmo tranquilo'],
      ['sed', 'Paso muchas horas sentado o sin moverme', '', [1, 4, 4, 5], 'Pasa muchas horas sentado (clases, pantallas)'],
      ['lumb', 'Trabajo sentado y acabo con la zona lumbar cargada', '', [1, 4, 4, 5], null],
      ['dep', 'Hago mucho deporte', '', [3, 3, 5, 5], 'Hace mucho deporte']] },
    /* Paco, 18/11: de 6 a 4 respuestas: «parte baja» y «mitad de la espalda» pasan a «En la espalda» (puntos de la parte baja);
       «rigidez» y «varias zonas» pasan a «Rigidez o varias zonas» (puntos de rigidez) */
    // Paco, 13/11: punto delicado. Nada de enfermedades ni diagnósticos: solo molestias al levantarse, dicho de forma sencilla
    { k: 'pato', yo: 1, t: '¿Te levantas con alguna molestia?', t2: '¿Os levantáis con alguna molestia?', t3: '¿Se levanta con alguna molestia?', ops: [
      ['sin', 'No, ninguna', '', [2, 3, 4, 4]], ['lumbalgia', 'En la espalda', '', [1, 4, 4, 5]],
      ['cervical', 'En el cuello', '', [2, 3, 5, 5]], ['artrosis', 'Rigidez o en varias zonas', '', [3, 2, 6, 4]]] },
    { k: 'indep', solo2: 1, t: '¿Os molesta notar al otro moverse?', ops: [['baja', 'No, nada', 'check', [0, 0, 0, 0]], ['media', 'Un poco', 'waves', [3, 3, 3, 4]], ['alta', 'Sí, mucho', 'couple', [5, 4, 4, 5]]] }
  ];
  function pregs() { return PREG.filter(function (p) { return !p.auto && (!p.solo2 || r.quien === '2'); }); }
  function dos() { return r.quien === '2'; }
  function hijo() { return r.quien === 'h'; }
  function mayor() { return r.quien === 'm'; }
  function terc() { return hijo() || mayor(); }
  function tit(p) { return dos() ? (p.t2 || p.t) : terc() ? (p.t3 || p.t) : p.t; }
  // Texto de cada respuesta: en tercera persona para hijos o persona mayor (lo de «clases, pantallas» solo para hijos)
  function txt(o) { return terc() && o[4] ? (mayor() ? o[4].replace(/ \(.*\)$/, '') : o[4]) : o[1]; }
  function sub(p) { var s = (terc() && p.s3) || (dos() && p.s2) || p.s; return s && mayor() ? s.replace('a tu hijo o hija', 'a esa persona') : s; }
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
    /* Paco, 13/11: el más compatible siempre entre 94 y 98 %; el segundo, entre 4 y 15 puntos por debajo y nunca menos de 82 %.
       Dentro de esas horquillas manda la puntuación: más puntos, más arriba; cuanto más lejos el segundo, más baja */
    var raw0 = l[0].pct, dif = raw0 - l[1].pct;
    l[0].pct = 94 + Math.round(4 * Math.max(0, Math.min(1, (raw0 - 50) / 40)));
    l[1].pct = Math.max(82, l[0].pct - Math.max(4, Math.min(15, Math.round(dif * 1.5))));
    l.slice(2).forEach(function (x) { x.pct = Math.max(82, l[1].pct - 4); });
    return l;
  };

  // Beneficios de la ficha que encajan con lo que ha contestado (máx. 3)
  function tiene(k, vals) { return (r[k] || []).some(function (v) { return vals.indexOf(v) > -1; }); }
  function beneficios(k) {
    var B = P[k].beneficios, out = [];
    function busca(re) { B.forEach(function (b) { if (out.length < 3 && out.indexOf(b) < 0 && re.test(b[1] + ' ' + b[2])) out.push(b); }); }
    if (dos()) busca(/pareja/i);
    if (tiene('postural', ['calor'])) busca(/calor|frescor|ventilaci|temperatura/i);
    if (tiene('pato', ['lumbalgia', 'hernia', 'ciatica', 'dorsal', 'escol']) || tiene('dia', ['lumb', 'sed'])) busca(/soporte|postura|espalda/i);
    if (tiene('postural', ['hombro']) || tiene('pato', ['cervical', 'artrosis', 'fibro'])) busca(/adapt|acoge|presi/i);
    B.forEach(function (b) { if (out.length < 3 && out.indexOf(b) < 0) out.push(b); });
    return out;
  }

  // «Buscas un colchón para ___, que te ayude con ___» (como en el script de llamadas)
  var AYUDA = {
    postural: { hombro: 'que alivie la presión en hombro y cadera',
      inq: 'que no se note cada vez que te mueves', calor: 'que no dé calor' },
    dia: { sed: 'que te sostenga aunque pases horas sin moverte', lumb: 'que descargue la zona lumbar', dep: 'que te ayude a recuperarte' },
    pato: { lumbalgia: 'que sostenga bien la espalda', cervical: 'que acompañe bien al cuello', dorsal: 'que sostenga bien la espalda',
      artrosis: 'que reparta bien el peso', fibro: 'acogedor, que reparta bien la presión' }
  };
  function resumen() {
    var partes = ['Buscas un colchón ' + (dos() ? 'para dormir en pareja' : hijo() ? 'para tus hijos' : mayor() ? 'para una persona mayor' : 'para ti')];
    ['postural', 'dia', 'pato'].forEach(function (k) { (r[k] || []).forEach(function (v) { var t = AYUDA[k][v]; if (t && partes.indexOf(t) < 0) partes.push(t); }); });
    if (r.indep === 'alta') partes.push('en el que no notéis al otro moveros');
    partes = partes.slice(0, 4);
    var u = partes.pop();
    return (partes.length ? partes.join(', ') + ' y ' + u : u) + '.';
  }

  var r = {}, paso = 0, medida = C.medidaInicial.v;

  function botones(p, quien) {
    if (p.grupos) return '<div class="h4q-grupos">' + p.grupos.map(function (g) {
      return '<div class="h4q-gr" role="group" aria-label="' + g[1] + '"><p class="h4q-gr-t">' + LM.ico(g[2]) + g[1] + '</p><div class="h4q-gr-b">' + g[3].map(function (e) {
        var on = r.quien === g[0] && (r.edad || [])[0] === e[0];
        return '<button type="button" class="h4q-op h4q-op--ch" data-v="' + g[0] + '|' + e[0] + '" data-quien="0"' + (on ? ' aria-pressed="true"' : '') + ' aria-label="' + g[1] + ', ' + e[1].toLowerCase() + '">' + e[1] + '</button>';
      }).join('') + '</div></div>';
    }).join('') + '</div>';
    var sel = p.yo ? (r[p.k] || [])[quien] : r[p.k];
    var ops = p.ops.filter(function (o) { return !(terc() && o[4] === null); });
    return '<div class="h4q-ops h4q-ops--fila" style="--n:' + ops.length + '" role="group" aria-label="' + (p.yo && dos() ? (quien ? 'Tu pareja' : 'Tú') : tit(p)) + '">' + ops.map(function (o) {
      return '<button type="button" class="h4q-op" data-v="' + o[0] + '" data-quien="' + quien + '"' + (sel === o[0] ? ' aria-pressed="true"' : '') + '>' + (o[2] ? LM.ico(o[2]) : '') + '<span>' + (p.k === 'quien' ? o[1] : txt(o)) + '</span></button>';
    }).join('') + '</div>';
  }
  function pregunta() {
    var L = pregs(), p = L[paso], par = p.yo && dos();
    box.innerHTML =
      '<div class="h4q-top"><p class="h4q-n">Pregunta ' + (paso + 1) + ' de ' + L.length + '</p>' +
        (paso ? '<button type="button" class="h4q-back" data-back>' + LM.ico('right', 'h4q-back-i') + 'Atrás</button>' : '') + '</div>' +
      '<div class="h4q-bar" aria-hidden="true"><i style="width:' + Math.round(paso / L.length * 100) + '%"></i></div>' +
      '<h3 class="h4q-q" id="h4q-q" tabindex="-1">' + tit(p) + '</h3>' +
      (sub(p) ? '<p class="h4q-s">' + sub(p) + '</p>' : '') +
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
    if (p.grupos) {
      var qe = v.split('|');
      if (r.quien && r.quien !== qe[0]) { r = {}; LM.track('quiz_restart_quien'); }
      r.quien = qe[0]; r.edad = qe[0] === '2' ? [qe[1], qe[1]] : [qe[1]];
      avanzar(); return;
    }
    if (p.yo) {
      r[p.k] = (r[p.k] || []).slice(); r[p.k][q] = v;
      if (dos()) { $$('.h4q-op[data-quien="' + q + '"]', box).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('[data-sig]', box).disabled = !(r[p.k][0] && r[p.k][1]); return; }
    } else {
      if (p.k === 'quien' && r.quien !== v) { var q0 = r.quien; r = {}; if (q0) LM.track('quiz_restart_quien'); }
      r[p.k] = v;
      if (p.k === 'quien') { var e = op(p, v)[4]; r.edad = v === '2' ? [e, e] : [e]; }
    }
    avanzar();
  });

  /* Paco, 13/11 · Diseño B: sin %; caritas que van de sonrisa media a sonrisa amplia. El primero llena 5 y el segundo 4,5 */
  var OPB = document.body.getAttribute('data-op') === 'b';
  function cara(i) {
    var w = 3.6 + i * .5, y = 14.2, c = 15.6 + i * .9;
    var boca = 'M' + (12 - w).toFixed(1) + ' ' + y + 'Q12 ' + c.toFixed(1) + ' ' + (12 + w).toFixed(1) + ' ' + y + (i > 2 ? 'Z' : '');
    return '<circle cx="12" cy="12" r="10.4"/><circle class="o" cx="8.6" cy="9.6" r="1.25"/><circle class="o" cx="15.4" cy="9.6" r="1.25"/><path class="b' + (i > 2 ? ' is-ab' : '') + '" d="' + boca + '"/>';
  }
  function caritas(v, n) {
    var h = '';
    for (var i = 0; i < 5; i++) {
      var f = Math.max(0, Math.min(1, v - i));
      h += '<span class="h4q-cara"><svg viewBox="0 0 24 24" class="h4q-cara-v">' + cara(i) + '</svg>' +
        (f ? '<span class="h4q-cara-f" style="width:' + (f * 100) + '%"><svg viewBox="0 0 24 24">' + cara(i) + '</svg></span>' : '') + '</span>';
    }
    return '<div class="h4q-caras" role="img" aria-label="' + String(v).replace('.', ',') + ' de 5 caritas sonrientes">' +
      '<div class="h4q-caras-i">' + h + '</div><span>' + (n ? 'También encaja muy bien contigo' : 'Encaja de maravilla contigo') + '</span></div>';
  }
  function tarjeta(x, n) {
    var k = x.k, p = P[k], d = LM.PRECIOS[k][medida], f = '../img/' + LM.FOTO_HOME[k];
    var pack = LM.packPagina(k, 'canape');
    return '<article class="h4q-card' + (n ? '' : ' is-top') + '" data-testid="quiz-result-' + k + '">' +
      '<div class="h4q-cimg"><img src="' + f + '-480.webp" alt="Colchón ' + p.nombre + '" width="480" height="480" loading="lazy">' +
        '<span class="lm-pill">' + (n ? 'Alternativa' : 'El más compatible') + '</span>' + LM.selloOcu(k) + '</div>' +
      '<div class="h4q-cb">' +
        (OPB ? caritas(n ? 4.5 : 5, n)
          : '<div class="h4q-pct"><b>' + x.pct + ' %</b><span>compatible contigo</span><i aria-hidden="true"><i style="width:' + x.pct + '%"></i></i></div>') +
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
