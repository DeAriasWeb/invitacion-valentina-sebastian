/* ==========================================================================
   GOOGLE APPS SCRIPT · Invitados y confirmaciones (sin base de datos)
   Pégalo COMPLETO en: tu Google Sheet → Extensiones → Apps Script → Code.gs
   ========================================================================== */

// 1) PIN de 4 dígitos por invitación. La clave es el "slug" del evento
//    (la misma que usas en js/config/event.js; la demo se llama 'demo').
const PINS = {
  demo: '1234'
  // 'ana-luis': '7351',
};

const MAX_FAILS   = 3;    // intentos permitidos
const LOCK_SECONDS = 30;  // bloqueo tras fallar

// Colores de la invitación
const C = { ink: '#18241d', gold: '#b9975b', goldLight: '#e2c994', paper: '#f6f0e5', paper2: '#ece2d0', ok: '#2f6b46', no: '#8a3b3b' };
const HEADERS = ['Fecha', 'Nombre', 'Asistencia', 'Personas', 'Mensaje'];

/* ---------------- Entrada web ---------------- */
function doGet() { return json_({ ok: true, msg: 'Invitaciones activo' }); }

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!PINS[d.slug]) return json_({ ok: false, error: 'evento' });
    if (d.action === 'rsvp') return json_(saveRsvp_(d));
    if (d.action === 'list') return json_(listGuests_(d));
    return json_({ ok: false, error: 'accion' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------------- Guardar confirmación ---------------- */
function saveRsvp_(d) {
  const name = clean_(d.name, 80);
  if (!name) return { ok: false, error: 'nombre' };
  const attending = d.attending === true;
  const guests = attending ? Math.max(1, Math.min(10, parseInt(d.guests, 10) || 1)) : 0;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheetFor_(d.slug);
    sh.appendRow([new Date(), name, attending ? 'Asistirá' : 'No asistirá', guests, clean_(d.message, 300)]);
  } finally { lock.releaseLock(); }
  return { ok: true };
}

/* ---------------- Listar invitados (requiere PIN) ---------------- */
function listGuests_(d) {
  const chk = checkPin_(d.slug, d.pin);
  if (!chk.ok) return chk;
  const sh = sheetFor_(d.slug), tz = Session.getScriptTimeZone();
  const last = sh.getLastRow();
  const rows = last > 1 ? sh.getRange(2, 1, last - 1, 5).getValues() : [];
  const guests = rows.filter(r => r[1]).map(r => ({
    date: r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'dd/MM/yyyy HH:mm') : String(r[0]),
    name: String(r[1]), attending: r[2] === 'Asistirá', guests: Number(r[3]) || 0, message: String(r[4] || '')
  })).reverse();
  return { ok: true, guests: guests, sheetUrl: SpreadsheetApp.getActive().getUrl() };
}

/* ---------------- PIN con bloqueo (se verifica aquí, no en la página) ---------------- */
function checkPin_(slug, pin) {
  const cache = CacheService.getScriptCache();
  if (cache.get('lock_' + slug)) return { ok: false, locked: true, wait: LOCK_SECONDS };
  if (String(pin) === String(PINS[slug])) { cache.remove('fails_' + slug); return { ok: true }; }
  const n = (parseInt(cache.get('fails_' + slug), 10) || 0) + 1;
  if (n >= MAX_FAILS) {
    cache.put('lock_' + slug, '1', LOCK_SECONDS); cache.remove('fails_' + slug);
    return { ok: false, locked: true, wait: LOCK_SECONDS };
  }
  cache.put('fails_' + slug, String(n), 600);
  return { ok: false, left: MAX_FAILS - n };
}

/* ---------------- Hojas con diseño ---------------- */
function sheetFor_(slug) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(slug);
  if (!sh) { sh = ss.insertSheet(slug); style_(sh); }
  return sh;
}

function style_(sh) {
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setBackground(C.ink).setFontColor(C.goldLight).setFontFamily('Georgia').setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 38); sh.setFrozenRows(1); sh.setHiddenGridlines(true);
  [150, 230, 130, 90, 360].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  const body = sh.getRange(2, 1, Math.max(sh.getMaxRows() - 1, 1), HEADERS.length);
  body.setFontFamily('Georgia').setFontSize(11).setFontColor(C.ink).setVerticalAlignment('middle').setWrap(true);
  const band = sh.getRange(1, 1, sh.getMaxRows(), HEADERS.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  band.setHeaderRowColor(C.ink).setFirstRowColor(C.paper).setSecondRowColor(C.paper2);
  sh.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm').setHorizontalAlignment('center');
  sh.getRange('C2:D').setHorizontalAlignment('center');
  const col = sh.getRange('C2:C');
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Asistirá').setFontColor(C.ok).setBold(true).setRanges([col]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No asistirá').setFontColor(C.no).setBold(true).setRanges([col]).build()
  ]);
  sh.getRange(1, 1, sh.getMaxRows(), HEADERS.length).setBorder(null, null, null, null, null, true, C.paper2, SpreadsheetApp.BorderStyle.SOLID);
}

/* Ejecútala UNA vez a mano (▶): crea las hojas con diseño y la hoja "Resumen". */
function prepararHoja() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(PINS).forEach(slug => sheetFor_(slug));
  let r = ss.getSheetByName('Resumen') || ss.insertSheet('Resumen', 0);
  r.clear(); r.setHiddenGridlines(true);
  r.getRange(1, 1, 1, 5).setValues([['Evento', 'Respuestas', 'Asistirán', 'No asistirán', 'Personas confirmadas']])
    .setBackground(C.ink).setFontColor(C.goldLight).setFontFamily('Georgia').setFontWeight('bold').setHorizontalAlignment('center');
  Object.keys(PINS).forEach((slug, i) => {
    const n = i + 2, s = "'" + slug + "'!";
    r.getRange(n, 1, 1, 5).setFormulas([[slug, '=COUNTA(' + s + 'B2:B)', '=COUNTIF(' + s + 'C2:C,"Asistirá")', '=COUNTIF(' + s + 'C2:C,"No asistirá")', '=SUM(' + s + 'D2:D)']])
      .setBackground(i % 2 ? C.paper2 : C.paper).setFontFamily('Georgia').setHorizontalAlignment('center');
  });
  [200, 130, 130, 140, 190].forEach((w, i) => r.setColumnWidth(i + 1, w)); r.setRowHeight(1, 38);
  const def = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1'); if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
}

/* ---------------- Utilidades ---------------- */
function clean_(v, max) {
  let s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;   // evita fórmulas inyectadas
  return s;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
