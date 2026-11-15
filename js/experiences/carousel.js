/* EXPERIENCIA 1 · Carrusel cinematográfico (arrastre con inercia, profundidad, desenfoque, parallax) */
(function () {
  App.register(function (ev) {
    var root = App.$('#cine'), track = App.$('#cineTrack');
    var items = ((ev.sets && ev.sets.historia) || ev.gallery).slice(0, 8), n = items.length;
    var nowEl = App.$('#cineNow'), totalEl = App.$('#cineTotal'), capEl = App.$('#cineCap');
    totalEl.textContent = String(n).padStart(2, '0');

    var slides = items.map(function (it, i) {
      var fig = document.createElement('figure'); fig.className = 'cine__slide';
      var box = document.createElement('div'); box.className = 'cine__img';
      box.appendChild(Photos.make(Object.assign({ key: 'cine' + i }, it), { w: 900, eager: true, alt: it.caption || '' }));
      var glare = document.createElement('i'); glare.className = 'cine__glare';
      fig.appendChild(box); fig.appendChild(glare); track.appendChild(fig);
      return { fig: fig, img: box };
    });

    var pos = 0, target = 0, W = 0, step = 1, visible = false, raf = 0, shown = -1;
    var drag = null, lastInteract = 0, autoTimer = 0;

    function measure() { W = root.clientWidth; step = Math.min(W * 0.5, 280); }
    function wrap(d) { d = ((d % n) + n) % n; return d > n / 2 ? d - n : d; }

    function layout() {
      for (var i = 0; i < n; i++) {
        var d = wrap(i - pos), a = Math.abs(d), c = Math.min(a, 1);
        var s = slides[i];
        if (a > 2.6) { s.fig.style.visibility = 'hidden'; continue; }
        s.fig.style.visibility = 'visible';
        s.fig.style.transform = 'translate3d(' + (d * step * 1.28) + 'px,0,' + (-a * 140) + 'px) rotateY(' + (-d * 16) + 'deg) scale(' + (1 - c * 0.12) + ')';
        s.fig.style.filter = 'blur(' + (Math.min(a, 1.8) * 3.2).toFixed(2) + 'px) brightness(' + (1 - Math.min(a, 1.4) * 0.34).toFixed(3) + ')';
        s.fig.style.zIndex = String(100 - Math.round(a * 10));
        s.img.firstChild.style.transform = 'translate3d(' + (-d * 16) + '%,0,0) scale(' + (1.04 + c * 0.2).toFixed(3) + ')';
        s.fig.style.setProperty('--glare', (0.5 - d * 0.5).toFixed(2));
      }
      var idx = ((Math.round(pos) % n) + n) % n;
      if (idx !== shown) {
        shown = idx;
        nowEl.textContent = String(idx + 1).padStart(2, '0');
        capEl.classList.remove('in'); void capEl.offsetWidth;
        capEl.textContent = items[idx].caption || ''; capEl.classList.add('in');
        slides.forEach(function (s, k) { s.fig.classList.toggle('is-active', k === idx); });
      }
    }

    function loop() {
      raf = 0;
      if (!drag) pos += (target - pos) * 0.085;
      if (Math.abs(target - pos) < 0.0006 && !drag) pos = target;
      layout();
      if (visible && (drag || pos !== target)) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && visible) raf = requestAnimationFrame(loop); }

    function go(t) { target = t; lastInteract = Date.now(); kick(); }

    root.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { x: e.clientX, p: pos, t: e.timeStamp, v: 0, moved: 0, lx: e.clientX, lt: e.timeStamp };
      root.setPointerCapture(e.pointerId); root.classList.add('is-drag'); kick();
    });
    root.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x; drag.moved = Math.max(drag.moved, Math.abs(dx));
      pos = drag.p - dx / (step * 1.1);
      var dt = e.timeStamp - drag.lt; if (dt > 0) drag.v = 0.8 * drag.v + 0.2 * ((e.clientX - drag.lx) / dt);
      drag.lx = e.clientX; drag.lt = e.timeStamp;
    });
    function end(e) {
      if (!drag) return;
      var d = drag; drag = null; root.classList.remove('is-drag');
      if (d.moved < 6) {
        var fig = e.target.closest && e.target.closest('.cine__slide');
        var i = slides.findIndex(function (s) { return s.fig === fig; });
        if (i >= 0) { var diff = wrap(i - pos); target = Math.round(pos + diff); }
        else target = Math.round(pos);
      } else {
        target = Math.round(pos - d.v * 220 / step * 1.1);
        if (Math.abs(target - Math.round(pos)) > 2) target = Math.round(pos) + Math.sign(target - pos) * 2;
      }
      lastInteract = Date.now(); kick();
    }
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    root.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(Math.round(target) + 1); if (e.key === 'ArrowLeft') go(Math.round(target) - 1); });
    root.tabIndex = 0;

    App.whenVisible(root, function (v) {
      visible = v; clearInterval(autoTimer);
      if (v) { kick(); autoTimer = setInterval(function () { if (!drag && Date.now() - lastInteract > 6500 && !App.reduceMotion) go(Math.round(target) + 1); }, 4300); }
    }, 0.3);

    measure(); addEventListener('resize', function () { measure(); layout(); });
    layout();
  });
})();