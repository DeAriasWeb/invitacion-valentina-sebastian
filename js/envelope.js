/* ==========================================================================
   Sobre animado: sello → solapa → tarjeta → zoom hacia la invitación
   ========================================================================== */
(function () {
  function dust(canvas) {
    var ctx = canvas.getContext('2d'), W, H, run = true, ps = [];
    function size() {
      var r = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = innerWidth * r; H = canvas.height = innerHeight * r; canvas.__r = r;
    }
    size(); addEventListener('resize', size);
    for (var i = 0; i < 46; i++) ps.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, s: Math.random() * .00012 + .00004, d: Math.random() * 6, a: Math.random() * .5 + .15 });
    var t0 = performance.now();
    (function frame(t) {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      ps.forEach(function (p) {
        p.y -= p.s * 16; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
        var x = (p.x + Math.sin((t - t0) / 2600 + p.d) * .02) * W, y = p.y * H, r = p.r * canvas.__r;
        var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        g.addColorStop(0, 'rgba(240,214,160,' + p.a + ')'); g.addColorStop(1, 'rgba(240,214,160,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill();
      });
      requestAnimationFrame(frame);
    })(t0);
    return function stop() { run = false; };
  }

  window.Envelope = {
    init: function (ev, onReveal) {
      var sobre = App.$('#sobre'), btn = App.$('#envBtn'), flap = App.$('#envFlap');
      var stopDust = App.reduceMotion ? function () {} : dust(App.$('#dust'));
      var opened = false;

      // Entrada suave de la escena
      requestAnimationFrame(function () { requestAnimationFrame(function () { sobre.classList.add('is-ready'); }); });

      function at(ms, fn) { setTimeout(fn, App.reduceMotion ? Math.min(ms, 120) : ms); }

      function open() {
        if (opened) return; opened = true;
        // 1) Pantalla completa y música, directamente desde el toque del invitado
        if (ev.fullscreen !== false) Fullscreen.request();   // activa por defecto; con fullscreen: false en event.js se desactiva
        Music.startFromGesture(ev.music);

        sobre.classList.add('is-opening');
        btn.disabled = true;
        // 2) El sello se rompe y la solapa se levanta
        sobre.classList.add('is-broken');
        at(380, function () { sobre.classList.add('is-open'); });
        at(900, function () { sobre.classList.add('flap-behind'); });
        // 3) La tarjeta sale del sobre
        at(1350, function () { sobre.classList.add('is-rise'); });
        // 4) La tarjeta se acerca al invitado
        at(2500, function () { sobre.classList.add('is-front'); });
        // 5) Zoom hacia la invitación
        at(3350, function () { sobre.classList.add('is-dive'); onReveal(); });
        at(4750, function () { stopDust(); sobre.classList.add('is-gone'); });
      }

      btn.addEventListener('click', open);
    }
  };
})();