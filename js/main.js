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
      var text = 'Hola, soy ' + name + '. ' + (att === 'yes' ? 'Confirmo mi asistencia (' + n + (n > 1 ? ' personas' : ' persona') + ')' : 'Lamentablemente no podré asistir') + ' a la boda de ' + ev.names.together + '.' + (msg ? ' ' + msg : '');
      window.open('https://wa.me/' + ev.rsvp.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });

    Envelope.init(ev, function () {
      var inv = App.$('#invitacion'); inv.classList.add('is-on'); inv.removeAttribute('aria-hidden');
      setTimeout(function () { document.body.classList.remove('is-locked'); scrollTo(0, 0); }, 1300);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
