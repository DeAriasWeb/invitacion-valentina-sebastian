/* EXPERIENCIA 4 · Transformación entre fotografías (máscara, persianas, mosaico, desplazamiento, disolución) */
(function () {
  var EASE = 'cubic-bezier(.65,0,.2,1)';

  App.register(function (ev) {
    var stage = App.$('#morphStage'), dotsEl = App.$('#morphDots'), capEl = App.$('#morphCap'), fxEl = App.$('#morphFx');
    var items = ((ev.sets && ev.sets.ayerHoy) || ev.gallery).slice(0, 5), n = items.length, urls = [], cur = 0, busy = false, fxI = 0, last = 0, visible = false;
    var names = (ev.texts.morphFx) || ['Máscara', 'Persianas', 'Mosaico', 'Desplazamiento', 'Disolución'];

    var base = document.createElement('div'); base.className = 'mp mp--base'; stage.appendChild(base);
    function bg(el, u) { el.style.backgroundImage = 'url("' + u + '")'; }
    function layer(u) { var d = document.createElement('div'); d.className = 'mp'; bg(d, u); stage.appendChild(d); return d; }

    Promise.all(items.map(function (it, i) { return Photos.load(Object.assign({ key: 'mp' + i }, it), 900); })).then(function (u) {
      urls = u; bg(base, urls[0]); stage.classList.add('is-ready');
    });

    items.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'dot'; b.setAttribute('aria-label', 'Foto ' + (i + 1));
      b.addEventListener('click', function (e) { e.stopPropagation(); to(i); }); dotsEl.appendChild(b);
    });
    function ui() {
      Array.prototype.forEach.call(dotsEl.children, function (d, i) { d.classList.toggle('is-on', i === cur); });
      capEl.textContent = items[cur].caption || '';
    }
    ui();

    function rect() { return stage.getBoundingClientRect(); }
    var opt = { duration: 1150, easing: EASE, fill: 'forwards' };

    var FX = [
      function circle(u, pt) { // 1 · máscara circular desde el punto tocado
        var l = layer(u), r = rect(), x = pt ? pt.x - r.left : r.width / 2, y = pt ? pt.y - r.top : r.height / 2;
        l.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)';
        var big = Math.hypot(r.width, r.height);
        base.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }], opt);
        return l.animate([{ clipPath: 'circle(0px at ' + x + 'px ' + y + 'px)', transform: 'scale(1.25)' }, { clipPath: 'circle(' + big + 'px at ' + x + 'px ' + y + 'px)', transform: 'scale(1)' }], { duration: 1300, easing: EASE, fill: 'forwards' }).finished.then(function () { return [l]; });
      },
      function blinds(u) { // 2 · persianas verticales
        var r = rect(), k = 7, ls = [], anims = [];
        for (var i = 0; i < k; i++) {
          var l = layer(u); l.style.clipPath = 'inset(0 ' + (100 - (i + 1) * 100 / k) + '% 0 ' + (i * 100 / k) + '%)';
          ls.push(l);
          anims.push(l.animate([{ transform: 'translateY(' + (i % 2 ? '-' : '') + '105%)' }, { transform: 'translateY(0)' }], { duration: 950, delay: i * 85, easing: EASE, fill: 'both' }).finished);
        }
        return Promise.all(anims).then(function () { return ls; });
      },
      function mosaic(u) { // 3 · mosaico: cada pieza es la MISMA foto (mismo recorte que la base), recortada con clip-path
        var cols = 6, rows = 8, anims = [], wrap = document.createElement('div'); wrap.className = 'mp mp--grid'; stage.appendChild(wrap);
        for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
          var t = document.createElement('i');
          var top = y * 100 / rows, left = x * 100 / cols, bottom = 100 - (y + 1) * 100 / rows, right = 100 - (x + 1) * 100 / cols;
          t.style.cssText = 'position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;background-image:url("' + u + '");' +
            'clip-path:inset(' + Math.max(0, top - .2) + '% ' + Math.max(0, right - .2) + '% ' + Math.max(0, bottom - .2) + '% ' + Math.max(0, left - .2) + '%)';
          wrap.appendChild(t);
          anims.push(t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: Math.random() * 650, easing: 'ease-in-out', fill: 'both' }).finished);
        }
        return Promise.all(anims).then(function () { return [wrap]; });
      },
      function slide(u) { // 4 · desplazamiento diagonal con escala
        var l = layer(u);
        base.animate([{ transform: 'translateX(0) scale(1)', filter: 'brightness(1)' }, { transform: 'translateX(-22%) scale(1.15)', filter: 'brightness(.55)' }], opt);
        return l.animate([{ clipPath: 'polygon(100% 0,100% 0,100% 100%,100% 100%)', transform: 'translateX(14%) scale(1.2)' }, { clipPath: 'polygon(-30% 0,100% 0,100% 100%,0% 100%)', transform: 'translateX(0) scale(1)' }, { clipPath: 'polygon(-30% 0,130% 0,130% 100%,-30% 100%)', transform: 'translateX(0) scale(1)' }], { duration: 1250, easing: EASE, fill: 'forwards' }).finished.then(function () { return [l]; });
      },
      function dissolve(u) { // 5 · disolución con desenfoque y zoom
        var l = layer(u);
        base.animate([{ opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }, { opacity: 0, filter: 'blur(14px)', transform: 'scale(1.18)' }], { duration: 1300, easing: 'ease-in-out', fill: 'forwards' });
        return l.animate([{ opacity: 0, filter: 'blur(14px)', transform: 'scale(.88)' }, { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }], { duration: 1300, easing: 'ease-in-out', fill: 'forwards' }).finished.then(function () { return [l]; });
      }
    ];

    function to(i, pt) {
      if (busy || i === cur || !urls.length) return;
      busy = true; last = Date.now();
      var fx = fxI % FX.length; fxI++;
      fxEl.textContent = names[fx]; fxEl.classList.remove('in'); void fxEl.offsetWidth; fxEl.classList.add('in');
      cur = i; ui();
      FX[fx](urls[i], pt).then(function (ls) {
        bg(base, urls[i]);
        base.getAnimations().forEach(function (a) { a.cancel(); });
        ls.forEach(function (l) { l.remove(); });
        busy = false;
      });
    }

    stage.addEventListener('click', function (e) { last = Date.now(); to((cur + 1) % n, { x: e.clientX, y: e.clientY }); });
    App.whenVisible(stage, function (v) { visible = v; }, 0.4);
    setInterval(function () { if (visible && !busy && Date.now() - last > 4800 && !App.reduceMotion) to((cur + 1) % n); }, 1200);
  });
})();