/* EXPERIENCIA 5 · Fotografías flotantes (entradas desde distintos puntos, arrastre, parallax, reorganizar) */
(function () {
  var SPEC = [ // posición/tamaño en % del escenario · rot en grados · z = profundidad (0…1) · from = punto de entrada (% del escenario)
    { x:  4, y:  3, w: 42, r: -5, z: .55, ratio: 1.25, from: [-130, -40] },
    { x: 54, y:  0, w: 38, r:  4, z: .35, ratio: 1.2,  from: [130, -60] },
    { x: 27, y: 21, w: 46, r: -2, z: 1,   ratio: 1.28, from: [0, -150] },
    { x:  1, y: 43, w: 33, r:  6, z: .45, ratio: 1.15, from: [-140, 30] },
    { x: 58, y: 38, w: 37, r: -6, z: .75, ratio: 1.22, from: [140, 40] },
    { x: 12, y: 64, w: 40, r:  3, z: .8,  ratio: 1.2,  from: [-60, 150] },
    { x: 55, y: 64, w: 39, r: -3, z: .4,  ratio: 1.18, from: [80, 150] }
  ];

  App.register(function (ev) {
    var stage = App.$('#float'), btn = App.$('#floatBtn');
    var ph = [], W = 0, H = 0, zTop = 50, entered = false;
    var px = 0, py = 0, tpx = 0, tpy = 0, drag = null, raf = 0, visible = false;

    SPEC.forEach(function (S, i) {
      var pool = (ev.sets && ev.sets.instantes) || ev.gallery; var it = pool[i % pool.length];
      var fp = document.createElement('div'); fp.className = 'fp'; fp.style.zIndex = String(Math.round(S.z * 40));
      var en = document.createElement('div'); en.className = 'fp__enter';
      var bob = document.createElement('div'); bob.className = 'fp__bob';
      bob.style.animationDuration = (5 + (i * 1.3) % 4) + 's'; bob.style.animationDelay = (-i * 0.9) + 's';
      var fr = document.createElement('div'); fr.className = 'fp__frame'; fr.style.transform = 'rotate(' + S.r + 'deg)';
      fr.appendChild(Photos.make(Object.assign({ key: 'fl' + i }, it), { w: 600, alt: it.caption || '' }));
      bob.appendChild(fr); en.appendChild(bob); fp.appendChild(en); stage.appendChild(fp);
      en.style.opacity = '0';
      ph.push({ fp: fp, en: en, S: S, dx: 0, dy: 0 });
    });

    function layout() {
      W = stage.clientWidth; H = stage.clientHeight;
      ph.forEach(function (p) {
        var w = W * p.S.w / 100;
        p.fp.style.width = w + 'px'; p.fp.style.height = (w * p.S.ratio) + 'px';
        p.fp.style.left = (W * p.S.x / 100) + 'px'; p.fp.style.top = (H * p.S.y / 100) + 'px';
      });
    }
    function paint() {
      ph.forEach(function (p) {
        var k = 0.4 + p.S.z * 1.1;
        p.fp.style.transform = 'translate3d(' + (p.dx + px * k) + 'px,' + (p.dy + py * k) + 'px,0)';
      });
    }
    function loop() {
      raf = 0;
      if (!drag || drag.bg) { var tx = drag && drag.bg ? tpx : 0, ty = drag && drag.bg ? tpy : 0; px += (tx - px) * 0.1; py += (ty - py) * 0.1; }
      paint();
      if (visible && (drag || Math.abs(px) + Math.abs(py) > 0.05)) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    function enter(delayBase) {
      ph.forEach(function (p, i) {
        var fx = p.S.from[0] / 100 * W, fy = p.S.from[1] / 100 * H;
        p.en.animate([
          { opacity: 0, transform: 'translate3d(' + fx + 'px,' + fy + 'px,0) rotate(' + (i % 2 ? 40 : -40) + 'deg) scale(' + (.5 + p.S.z * .1) + ')' },
          { opacity: 1, transform: 'translate3d(0,0,0) rotate(0deg) scale(1)' }
        ], { duration: 1500, delay: (delayBase || 0) + i * 130, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'forwards' });
      });
    }
    function exit() {
      return Promise.all(ph.map(function (p, i) {
        var fx = p.S.from[0] / 100 * W * 1.3, fy = p.S.from[1] / 100 * H * 1.3;
        return p.en.animate([
          { opacity: 1, transform: 'translate3d(0,0,0) rotate(0deg) scale(1)' },
          { opacity: 0, transform: 'translate3d(' + fx + 'px,' + fy + 'px,0) rotate(' + (i % 2 ? -50 : 50) + 'deg) scale(.55)' }
        ], { duration: 750, delay: i * 50, easing: 'cubic-bezier(.6,0,.9,.4)', fill: 'forwards' }).finished;
      }));
    }
    btn.addEventListener('click', function () {
      if (btn.disabled) return; btn.disabled = true;
      exit().then(function () {
        ph.forEach(function (p) { p.dx = 0; p.dy = 0; }); paint();
        enter(150); setTimeout(function () { btn.disabled = false; }, 1500 + ph.length * 130);
      });
    });

    stage.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      var el = e.target.closest('.fp'), p = ph.find(function (q) { return q.fp === el; });
      drag = p ? { p: p, x: e.clientX, y: e.clientY, dx0: p.dx, dy0: p.dy } : { bg: true, x: e.clientX, y: e.clientY };
      if (p) { p.fp.style.zIndex = String(++zTop); p.fp.classList.add('is-held'); }
      stage.setPointerCapture(e.pointerId); kick();
    });
    stage.addEventListener('pointermove', function (e) {
      if (drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (drag.p) { drag.p.dx = drag.dx0 + dx; drag.p.dy = drag.dy0 + dy; }
        else { tpx = Math.max(-60, Math.min(60, dx * 0.5)); tpy = Math.max(-60, Math.min(60, dy * 0.5)); }
        paint();
      } else if (e.pointerType === 'mouse') { var r = stage.getBoundingClientRect(); px = ((e.clientX - r.left) / r.width - .5) * -40; py = ((e.clientY - r.top) / r.height - .5) * -30; paint(); }
    });
    function end() { if (!drag) return; if (drag.p) drag.p.fp.classList.remove('is-held'); drag = null; kick(); }
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);

    App.whenVisible(stage, function (v) {
      visible = v; if (v) { kick(); if (!entered) { entered = true; enter(0); } }
    }, 0.3);
    layout(); addEventListener('resize', function () { layout(); paint(); });
  });
})();