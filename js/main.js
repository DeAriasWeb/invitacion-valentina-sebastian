/* Punto de entrada: arranca la invitación */
(function () {
  function start() {
    App.init();
    var ev = App.ev;
    Reveal.init();
    Music.init(ev.music);
    App.experiences.forEach(function (fn) { try { fn(ev); } catch (e) { console.warn('[experiencia]', e); } });

    // Programa (línea de tiempo)
    var tl = App.$('#timeline');
    ev.texts.schedule.forEach(function (s) {
      var li = document.createElement('li'); li.className = 'tl reveal';
      li.innerHTML = '<div class="tl__time"><b></b><span></span></div><span class="tl__dot" aria-hidden="true"></span><div class="tl__body"><h3></h3><p></p></div>';
      li.querySelector('b').textContent = s.time; li.querySelector('.tl__time span').textContent = s.ampm;
      li.querySelector('h3').textContent = s.title; li.querySelector('p').textContent = s.text;
      tl.appendChild(li);
    });
    Reveal.init();

    // RSVP → WhatsApp
    var form = App.$('#rsvpForm'), n = 1, out = App.$('#gOut');
    App.$('#gMinus').onclick = function () { n = Math.max(1, n - 1); out.textContent = n; };
    App.$('#gPlus').onclick = function () { n = Math.min(10, n + 1); out.textContent = n; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = App.$('#rsvpName').value.trim(), att = (form.att.value || ''), ok = true;
      App.$('#errName').textContent = name ? '' : ev.texts.rsvpErrorName; if (!name) ok = false;
      App.$('#errChoice').textContent = att ? '' : ev.texts.rsvpErrorChoice; if (!att) ok = false;
      if (!ok) return;
      var msg = App.$('#rsvpMsg').value.trim();
      var yes = att === 'yes';
      var status = App.$('#rsvpStatus'), btn = App.$('#rsvpSubmit');
      var url = ev.sheets && ev.sheets.url;

      function whatsapp() {
        var text = 'Hola, soy ' + name + '. ' + (yes ? 'Confirmo mi asistencia (' + n + (n > 1 ? ' personas' : ' persona') + ')' : 'Lamentablemente no podré asistir') + ' a la boda de ' + ev.names.together + '.' + (msg ? ' ' + msg : '');
        window.open('https://wa.me/' + ev.rsvp.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      }

      if (!(url && /^https:\/\/script\.google\.com\//.test(url))) { whatsapp(); return; }

      btn.disabled = true; status.textContent = ev.texts.rsvpSending;
      fetch(url, { method: 'POST', body: JSON.stringify({ action: 'rsvp', slug: App.slug, name: name, attending: yes, guests: yes ? n : 0, message: msg }) })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.error || 'error');
          status.textContent = ev.texts.rsvpThanks; form.reset(); n = 1; out.textContent = 1;
          if (ev.rsvp.whatsappToo) whatsapp();
        })
        .catch(function () { status.textContent = ev.texts.rsvpFail; })
        .then(function () { btn.disabled = false; });
    });

    Envelope.init(ev, function () {
      var inv = App.$('#invitacion'); inv.classList.add('is-on'); inv.removeAttribute('aria-hidden');
      setTimeout(function () { document.body.classList.remove('is-locked'); scrollTo(0, 0); }, 1300);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
