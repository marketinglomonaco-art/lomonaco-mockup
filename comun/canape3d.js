/* LO MONACO · «Ábrelo»: canapé abatible en 3D (Paco, 12/11).
   Construido con las medidas reales del plano de la web actual: 32 cm de alto, arcón de 28 cm de fondo y 103 cm de alto con la tapa abierta.
   Madera con las muestras reales de los 4 acabados (img/tienda/*-madera). Tapa partida en 180 × 200 y 200 × 200 cm.
   Se gira arrastrando, se abre con el botón y se cambia de madera. Solo se carga (three.js, en comun/vendor) al acercarse a la sección.
   Pinta solo cuando algo cambia (no gasta batería parado). Sin WebGL, se ve la foto del canapé abierto. */
(function () {
  'use strict';
  LM.canape3d = function (box, o) {
    var view = box.querySelector('#tf-3d-view'), btn = box.querySelector('#tf-3d-abrir');
    var listo = false, quiere = false;
    function pre() { quiere = true; cargar(); }
    btn.addEventListener('click', pre);
    function cargar() {
      if (listo) return; listo = true;
      if (window.THREE) return iniciar();
      var s = document.createElement('script'); s.src = '../comun/vendor/three.min.js'; s.onload = iniciar; s.onerror = sinWebgl; document.head.appendChild(s);
    }
    function sinWebgl() {
      var c = o.colores.filter(function (x) { return x.k === o.color; })[0] || o.colores[0];
      view.innerHTML = '<img src="../img/tienda/' + c.fotos[1] + '-700.webp" alt="Canapé abatible abierto" width="700" height="700">';
      btn.hidden = true;
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); cargar(); } }, { rootMargin: '400px 0px' });
      io.observe(box);
    } else cargar();

    function iniciar() {
      var T = window.THREE, renderer;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: false }); } catch (e) { return sinWebgl(); }
      if (!renderer.getContext()) return sinWebgl();
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.outputEncoding = T.sRGBEncoding;
      view.innerHTML = ''; view.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-label', 'Canapé abatible en 3D. Arrastra para girarlo.');
      renderer.domElement.setAttribute('role', 'img');

      var scene = new T.Scene(); scene.background = new T.Color(0xf6f6f6);
      var cam = new T.PerspectiveCamera(30, 1, 0.05, 50);
      scene.add(new T.HemisphereLight(0xffffff, 0xd8d2c8, 0.85));
      var sol = new T.DirectionalLight(0xffffff, 0.75); sol.position.set(2.5, 5, 3); sol.castShadow = true;
      sol.shadow.mapSize.set(1024, 1024); var sc = sol.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sol.shadow.radius = 6; sol.shadow.bias = -0.0005;
      scene.add(sol);
      var suelo = new T.Mesh(new T.PlaneGeometry(14, 14), new T.ShadowMaterial({ opacity: 0.13 })); suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; scene.add(suelo);

      var grupo = new T.Group(); scene.add(grupo);
      var H = o.cotas.alto / 100, FONDO = o.cotas.fondo / 100, AP = o.cotas.apertura / 100, TW = 0.025, R = 0.045, TAPA = 0.035;
      var texs = {}, loader = new T.TextureLoader();
      function madera(k) {
        if (texs[k]) return texs[k];
        var c = o.colores.filter(function (x) { return x.k === k; })[0];
        var t = loader.load('../img/tienda/' + c.sw + '-700.webp', pintar);
        t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(1.6, 1.6); t.encoding = T.sRGBEncoding; t.anisotropy = 4;
        return (texs[k] = t);
      }
      // Tela de la tapa: gris claro acolchado, como en las fotos de la tienda
      var cv = document.createElement('canvas'); cv.width = cv.height = 256; var g = cv.getContext('2d');
      g.fillStyle = '#9fa4ab'; g.fillRect(0, 0, 256, 256); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 3;
      for (var i = -256; i < 512; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); g.beginPath(); g.moveTo(i, 256); g.lineTo(i + 256, 0); g.stroke(); }
      var tela = new T.CanvasTexture(cv); tela.wrapS = tela.wrapT = T.RepeatWrapping; tela.repeat.set(2.4, 2.4); tela.encoding = T.sRGBEncoding;
      var mMadera = new T.MeshStandardMaterial({ map: madera(o.color), roughness: 0.62, metalness: 0 });
      var mTela = new T.MeshStandardMaterial({ map: tela, roughness: 0.95 });
      var mNegro = new T.MeshStandardMaterial({ color: 0x232325, roughness: 0.9 });
      var mFondo = new T.MeshStandardMaterial({ color: 0xe9e6e0, roughness: 0.9 });
      var mMetal = new T.MeshStandardMaterial({ color: 0x2a2a2c, roughness: 0.4, metalness: 0.6 });
      var mPiston = new T.MeshStandardMaterial({ color: 0xb8b8bc, roughness: 0.3, metalness: 0.8 });

      function rect(w, l, r) {
        var s = new T.Shape(), x = -w / 2, y = -l / 2;
        s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + l - r);
        s.quadraticCurveTo(x + w, y + l, x + w - r, y + l); s.lineTo(x + r, y + l); s.quadraticCurveTo(x, y + l, x, y + l - r);
        s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
      }
      function extruir(shape, alto) {
        var geo = new T.ExtrudeGeometry(shape, { depth: alto, bevelEnabled: false, curveSegments: 10 });
        geo.rotateX(-Math.PI / 2); return geo;
      }
      var piezas = [], tapas = [], pist = [], W = 1.5, L = 1.9, ANG = 0, abierto = false, anim = null;
      function construir(m) {
        piezas.forEach(function (p) { grupo.remove(p); if (p.geometry) p.geometry.dispose(); }); piezas = []; tapas = []; pist = [];
        var a = m.replace('-2p', '').split('x'); W = +a[0] / 100; L = +a[1] / 100;
        var partida = /-2p$/.test(m);
        // Cajón: marco redondeado de madera
        var marco = rect(W, L, R), hueco = rect(W - 2 * TW, L - 2 * TW, Math.max(0.01, R - TW)); marco.holes.push(hueco);
        var caja = new T.Mesh(extruir(marco, H), mMadera); caja.castShadow = caja.receiveShadow = true; add(caja);
        var fondo = new T.Mesh(new T.BoxGeometry(W - 2 * TW, 0.012, L - 2 * TW), mFondo); fondo.position.y = H - FONDO; fondo.receiveShadow = true; add(fondo);
        if (partida) { var bar = new T.Mesh(new T.BoxGeometry(0.03, FONDO, L - 2 * TW), mMadera); bar.position.set(0, H - FONDO / 2, 0); bar.castShadow = true; add(bar); }
        // Tapa (o dos): bisagra en la cabecera; sube por los pies
        var nt = partida ? 2 : 1, wt = (W - (partida ? 0.006 : 0)) / nt;
        for (var t = 0; t < nt; t++) {
          var piv = new T.Group(); piv.position.set(partida ? (t ? wt / 2 + 0.003 : -wt / 2 - 0.003) : 0, H, -L / 2 + 0.02);
          var tp = new T.Mesh(extruir(rect(wt, L - 0.02, R * 0.8), TAPA), [mTela, mTela]); tp.position.set(0, 0, (L - 0.02) / 2); tp.castShadow = true; piv.add(tp);
          var bajo = new T.Mesh(new T.PlaneGeometry(wt - 0.03, L - 0.05), mNegro); bajo.rotation.x = Math.PI / 2; bajo.position.set(0, -0.001, (L - 0.02) / 2); piv.add(bajo);
          add(piv); tapas.push(piv);
        }
        // Frenos de seguridad (amortiguadores): dos por tapa, a los lados
        tapas.forEach(function (piv) {
          [-1, 1].forEach(function (lado) {
            var x = piv.position.x + lado * (wt / 2 - 0.07);
            var cil = new T.Mesh(new T.CylinderGeometry(0.014, 0.014, 1, 12), mMetal), vas = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 1, 8), mPiston);
            cil.castShadow = true; add(cil); add(vas); pist.push({ piv: piv, x: x, cil: cil, vas: vas });
          });
        });
        // Encuadre según el tamaño
        var d = Math.max(W, L) * 1.62 + 0.95; cam.position.set(d * 0.62, d * 0.44, d * 0.8); cam.lookAt(0, H * 1.25, 0);
        aplicar();
      }
      function add(m) { grupo.add(m); piezas.push(m); }
      var abiertoMax = 0.72; // unos 41°, como en las fotos del canapé abierto de la tienda (el plano marca 103 cm de alto con la tapa abierta)
      var A = 0;
      var tmp = new T.Vector3(), tmp2 = new T.Vector3(), Y = new T.Vector3(0, 1, 0);
      function aplicar() {
        tapas.forEach(function (p) { p.rotation.x = -A * abiertoMax; });
        grupo.updateMatrixWorld(true);
        pist.forEach(function (p) {
          // De la pared lateral del cajón (abajo, cerca de la cabecera) a la cara de abajo de la tapa
          var base = tmp.set(p.x, H - FONDO + 0.06, -L / 2 + 0.28);
          var punta = tmp2.set(p.x - p.piv.position.x, -0.01, 0.62).applyMatrix4(p.piv.matrix);
          var dir = punta.clone().sub(base), lon = dir.length(), mid = base.clone().add(dir.clone().multiplyScalar(0.5));
          var q = new T.Quaternion().setFromUnitVectors(Y, dir.clone().normalize());
          var lc = Math.min(lon * 0.62, 0.32);
          p.cil.scale.set(1, lc, 1); p.cil.quaternion.copy(q); p.cil.position.copy(base.clone().add(dir.clone().normalize().multiplyScalar(lc / 2)));
          p.vas.scale.set(1, lon, 1); p.vas.quaternion.copy(q); p.vas.position.copy(mid);
          p.cil.visible = p.vas.visible = A > 0.02;
        });
        pintar(); etiquetas();
      }
      // Etiquetas numeradas sobre el modelo (solo con la tapa abierta)
      var PTS = [['arcon', function () { return new T.Vector3(-W * 0.12, H - FONDO + 0.03, -L * 0.05); }],
                 ['frenos', function () { var p = pist[1]; return p ? p.cil.position.clone() : new T.Vector3(); }],
                 ['tapa', function () { var v = new T.Vector3(0, TAPA + 0.01, (L - 0.02) * 0.62); return v.applyMatrix4(tapas[tapas.length - 1].matrixWorld); }],
                 ['madera', function () { return new T.Vector3(-W / 2 - 0.004, H * 0.5, -L * 0.18); }]];
      var labs = PTS.map(function (p, i) { var e = document.createElement('span'); e.className = 'tf-3d-dot'; e.textContent = i + 1; e.setAttribute('aria-hidden', 'true'); view.appendChild(e); return e; });
      function etiquetas() {
        var w = view.clientWidth, h = view.clientHeight;
        PTS.forEach(function (p, i) {
          var v = p[1]().applyMatrix4(grupo.matrixWorld).project(cam);
          labs[i].style.transform = 'translate(' + ((v.x + 1) / 2 * w - 13) + 'px,' + ((1 - v.y) / 2 * h - 13) + 'px)';
          labs[i].classList.toggle('is-on', A > 0.6 || p[0] === 'madera');
        });
      }
      var pend = false;
      function pintar() { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; renderer.render(scene, cam); }); }
      function tam() {
        var w = view.clientWidth, h = Math.round(w * (innerWidth < 700 ? 0.82 : 0.6));
        view.style.height = h + 'px'; renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = h + 'px';
        cam.aspect = w / h; cam.updateProjectionMatrix(); aplicar();
      }
      addEventListener('resize', tam);

      // Girar arrastrando (ratón o dedo). En el móvil, el gesto vertical sigue moviendo la página
      var rot = -0.5, drag = null; // de cara a la apertura, como en la foto del canapé abierto grupo.rotation.y = rot;
      renderer.domElement.style.touchAction = 'pan-y';
      renderer.domElement.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, r: grupo.rotation.y }; renderer.domElement.setPointerCapture(e.pointerId); box.classList.add('is-girando'); });
      renderer.domElement.addEventListener('pointermove', function (e) { if (!drag) return; grupo.rotation.y = drag.r + (e.clientX - drag.x) / 160; aplicar(); });
      ['pointerup', 'pointercancel'].forEach(function (ev) { renderer.domElement.addEventListener(ev, function () { if (drag) LM.track('canape3d_girar', {}); drag = null; }); });

      var reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
      function abrir(on) {
        abierto = on; btn.setAttribute('aria-pressed', on); btn.innerHTML = LM.ico('lift') + (on ? 'Cerrar el canapé' : 'Abrir el canapé');
        box.classList.toggle('is-abierto', on);
        if (anim) cancelAnimationFrame(anim);
        var de = A, a = on ? 1 : 0, t0 = performance.now(), dur = reducir ? 1 : 1100;
        (function paso(t) {
          var k = Math.min(1, (t - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          A = de + (a - de) * e; aplicar();
          if (k < 1) anim = requestAnimationFrame(paso);
        })(t0);
        LM.track('canape3d_abrir', { abierto: on });
      }
      btn.removeEventListener('click', pre);
      btn.addEventListener('click', function () { abrir(!abierto); });
      document.addEventListener('tf:color', function (e) { mMadera.map = madera(e.detail); mMadera.needsUpdate = true; pintar(); });
      document.addEventListener('tf:medida', function (e) { construir(e.detail); tam(); });
      // Al pasar por la lista de puntos, se resalta su número
      box.querySelectorAll('[data-pt]').forEach(function (li, i) {
        li.addEventListener('mouseenter', function () { labs[i].classList.add('is-hi'); if (!abierto && i < 3) abrir(true); });
        li.addEventListener('mouseleave', function () { labs[i].classList.remove('is-hi'); });
      });
      construir(o.medida()); tam();
      box.classList.add('is-listo');
      if (quiere) setTimeout(function () { abrir(true); }, 300);
    }
  };
})();
