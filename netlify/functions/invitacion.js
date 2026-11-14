/* ==========================================================================
   Función de Netlify: entrega index.html con las metaetiquetas Open Graph
   y Twitter Cards de la invitación solicitada.

   WhatsApp, Facebook, Messenger, etc. leen el HTML inicial y NO ejecutan
   JavaScript, por eso las metaetiquetas se generan aquí, en el servidor.

   Rutas (ver netlify.toml):  /  y  /i/<slug>
   Datos: js/config/event.js (la misma fuente que usa la página).
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();

function read(rel) {
  const candidates = [path.join(ROOT, rel), path.join(__dirname, '..', '..', rel), path.join(process.cwd(), rel)];
  for (const p of candidates) { try { return fs.readFileSync(p, 'utf8'); } catch (e) { /* siguiente */ } }
  throw new Error('No se encontró ' + rel);
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadEvents() {
  const sandbox = { window: {} };
  vm.runInNewContext(read('js/config/event.js'), sandbox, { timeout: 1000 });
  return sandbox.window;
}

function absolute(origin, url) {
  if (/^https?:\/\//i.test(url)) return url;
  return origin + '/' + String(url).replace(/^\/+/, '');
}

function imageUrl(origin, photo) {
  if (!photo) return absolute(origin, 'assets/images/vista-previa.jpg');
  if (photo.src) return absolute(origin, photo.src);
  if (photo.id) return 'https://images.unsplash.com/photo-' + photo.id + '?auto=format&fit=crop&w=1200&h=630&q=80';
  return absolute(origin, 'assets/images/vista-previa.jpg');
}

exports.handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const w = loadEvents();
    const events = w.EVENTS || {};
    const slug = events[qs.slug] ? qs.slug : (w.DEFAULT_EVENT || Object.keys(events)[0]);
    const ev = events[slug];

    const host = (event.headers && (event.headers['x-forwarded-host'] || event.headers.host)) || '';
    const origin = process.env.URL || (host ? 'https://' + host : '');
    const pageUrl = origin + (slug === (w.DEFAULT_EVENT || '') && !qs.slug ? '/' : '/i/' + encodeURIComponent(slug));
    const og = ev.og || {};
    const img = imageUrl(origin, ev.photos && ev.photos.vistaPrevia);
    const title = og.title || ev.names.together;
    const desc = og.description || '';

    const meta = [
      `<meta name="description" content="${esc(desc)}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="${esc(og.siteName || '')}">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(desc)}">`,
      `<meta property="og:url" content="${esc(pageUrl)}">`,
      `<meta property="og:image" content="${esc(img)}">`,
      `<meta property="og:image:secure_url" content="${esc(img)}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta property="og:image:alt" content="${esc(og.imageAlt || title)}">`,
      `<meta property="og:locale" content="es_ES">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(title)}">`,
      `<meta name="twitter:description" content="${esc(desc)}">`,
      `<meta name="twitter:image" content="${esc(img)}">`
    ].join('\n  ');

    let html = read('index.html');
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = html.replace(/<!-- OG:START[\s\S]*?<!-- OG:END -->/, `<!-- OG -->\n  ${meta}`);
    // Las rutas relativas (css/, js/, assets/) deben resolverse desde la raíz también en /i/<slug>
    html = html.replace('<head>', `<head>\n  <base href="/">`);
    // Le indica a la página qué invitación mostrar
    html = html.replace('<script src="js/config/event.js"></script>', `<script>window.__SLUG__=${JSON.stringify(slug)};</script>\n  <script src="js/config/event.js"></script>`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate' },
      body: html
    };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: 'Error generando la invitación: ' + err.message };
  }
};
