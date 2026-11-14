/* EXPERIENCIA 3 · Revelación mediante cortinas */
(function () {
  App.register(function (ev) {
    var sec = App.$('#cortinas'), btn = App.$('#curtainBtn'), replay = App.$('#curtainReplay'), title = App.$('#curtainTitle');
    var opened = false;

    // Título animado letra por letra
    var text = title.textContent; title.textContent = '';
    title.setAttribute('aria-label', text);
    text.split(' ').forEach(function (word, wi, arr) {
      var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (ch, ci) {
        var s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
        s.style.setProperty('--i', (wi * 4 + ci)); w.appendChild(s);
      });
      title.appendChild(w); if (wi < arr.length - 1) title.appendChild(document.createTextNode(' '));
    });

    function open() {
      if (opened) return; opened = true; sec.classList.add('is-open'); sec.classList.remove('is-peek');
      btn.setAttribute('tabindex', '-1'); btn.setAttribute('aria-hidden', 'true');
    }
    function close() {
      opened = false; sec.classList.remove('is-open');
      btn.removeAttribute('tabindex'); btn.removeAttribute('aria-hidden');
    }
    btn.addEventListener('click', open);
    replay.addEventListener('click', close);

    App.whenVisible(sec, function (v) { if (v && !opened) sec.classList.add('is-peek'); }, 0.5);
  });
})();
