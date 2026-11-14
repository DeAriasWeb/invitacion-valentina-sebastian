/* EXPERIENCIA 2 · Galería 3D (planos con profundidad, inclinación al arrastrar, foco al tocar) */
(function () {
  var LAYOUT = [ // x,y en % del escenario, z en px, giro Y/Z en grados, ancho en %
    { x: -27, y: -24, z: -150, ry: 20,  rz: -4, w: 40 },
    { x:  27, y: -28, z: -260, ry: -18, rz:  3, w: 36 },
    { x:   0, y:   0, z:  110, ry:  4,  rz: -2, w: 46 },
    { x:  31, y:  22, z:  -60, ry: -24, rz:  4, w: 36 },
    { x: -30, y:  28, z: -190, ry:  22, rz: -3, w: 36 },
    { x:   0, y: -40, z: -380, ry:  0,  rz:  1, w: 30 }
  ];

  App.register(function (ev) {
    var root = App.$('#g3d'), scene = App.$('#g3dScene'), stage = App.$('#g3dStage');
    var cards = [], W = 0, H = 0;
    var rx = 0, ry = 0, trx = 0, tr_y = 0, focus = -1, drag = null, visible = false, raf = 0, t0 = performance.now(), idle = 0;

    LAYOUT.forEach(function (L, i) {
      var it = ev.gallery[(i * 2 + 1) % ev.gallery.length];
      var el = document.createElement('div'); el.className = 'g3d__card'; el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.setAttribute('aria-label', it.caption || 'Fotografía');
      el.appendChild(Photos.make(Object.assign({ key: 'g3d' + i }, it), { w: 700, alt: it.caption || '' }));
      var sheen = document.createElement('i'); sheen.className = 'g3d__sheen'; el.appendChild(sheen);
      stage.appendChild(el); cards.push({ el: el, L: L, sheen: sheen });
    });

    function place() {
      W = root.clientWidth; H = root.clientHeight;
      cards.forEach(function (c, i) {
        var L = c.L, w = W * L.w / 100, h = w * 1.26;
        c.w = w; c.h = h;
        c.el.style.width = w + 'px'; c.el.style.height = h + 'px';
        c.el.style.marginLeft = (-w / 2) + 'px'; c.el.style.marginTop = (-h / 2) + 'px';
        var depth = (L.z + 400) / 560; // 0 (lejos) … 1 (cerca)
        c.el.style.setProperty('--sh', (8 + depth * 40).toFixed(0) + 'px');
        c.el.style.setProperty('--sh2', (20 + depth * 70).toFixed(0) + 'px');
      });
      apply();
    }

    function apply() {
      stage.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      cards.forEach(function (c, i) {
        var L = c.L, x = W * L.x / 100, y = H * L.y / 100 * 0.78;
        var tf;
        if (focus === i) tf = 'translate3d(0,0,330px) rotateY(0deg) rotateZ(0deg) scale(1.28)';
        else tf = 'translate3d(' + x + 'px,' + y + 'px,' + L.z + 'px) rotateY(' + L.ry + 'deg) rotateZ(' + L.rz + 'deg)';
        c.el.style.transform = tf;
        c.sheen.style.setProperty('--sx', (50 + (ry * 3.4) + L.ry * .6).toFixed(0) + '%');
      });
    }

    function loop(t) {
      raf = 0;
      if (!drag) {
        // inercia + vuelta suave al reposo con un leve vaivén
        var sway = App.reduceMotion || focus >= 0 ? 0 : Math.sin((t - t0) / 2300) * 4;
        var gx = drag ? trx : 0, gy = sway;
        ry += (gy - ry) * 0.045; rx += (gx - rx) * 0.045;
      }
      apply();
      if (visible) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && visible) raf = requestAnimationFrame(loop); }

    scene.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      var card = e.target.closest('.g3d__card');
      drag = { x: e.clientX, y: e.clientY, ry0: ry, rx0: rx, moved: 0, card: card ? cards.findIndex(function (c) { return c.el === card; }) : -1 };
      scene.setPointerCapture(e.pointerId); root.classList.add('is-drag');
    });
    scene.addEventListener('pointermove', function (e) {
      if (!drag) { // ratón sin presionar: leve inclinación
        if (e.pointerType === 'mouse' && focus < 0) { var r = root.getBoundingClientRect(); ry = ((e.clientX - r.left) / r.width - .5) * 16; rx = -((e.clientY - r.top) / r.height - .5) * 10; }
        return;
      }
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
      if (focus < 0) {
        ry = Math.max(-34, Math.min(34, drag.ry0 + dx * 0.22));
        rx = Math.max(-20, Math.min(20, drag.rx0 - dy * 0.16));
      }
    });
    function end() {
      if (!drag) return; var d = drag; drag = null; root.classList.remove('is-drag');
      if (d.moved < 7) {
        if (d.card >= 0 && focus !== d.card) { focus = d.card; rx = 0; ry = 0; }
        else focus = -1;
        root.classList.toggle('has-focus', focus >= 0);
        cards.forEach(function (c, i) { c.el.classList.toggle('is-focus', i === focus); });
      }
      kick();
    }
    scene.addEventListener('pointerup', end); scene.addEventListener('pointercancel', end);
    scene.addEventListener('pointerleave', function (e) { if (!drag && e.pointerType === 'mouse') { /* vuelve al reposo en el bucle */ } });
    cards.forEach(function (c, i) { c.el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focus = focus === i ? -1 : i; root.classList.toggle('has-focus', focus >= 0); cards.forEach(function (k, j) { k.el.classList.toggle('is-focus', j === focus); }); kick(); } }); });

    App.whenVisible(root, function (v) { visible = v; if (v) { root.classList.add('in'); kick(); } }, 0.2);
    place(); addEventListener('resize', place);
  });
})();
