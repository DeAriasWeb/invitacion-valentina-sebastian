# Invitaciones digitales premium · Demo

Sobre animado → invitación completa → cinco experiencias visuales → vista previa Open Graph.
HTML + CSS + JavaScript puros. Listo para GitHub + Netlify.

## 1. Probarlo en tu computadora
- Opción rápida: doble clic en `index.html` (funciona en Chrome/Edge/Safari).
- Opción recomendada (para probar con el celular en tu red): en esta carpeta ejecuta `python -m http.server 8000` y abre `http://localhost:8000`.

## 2. Cambiar nombres, fecha, textos, colores, música y fotos
Todo está en **un solo archivo: `js/config/event.js`**. Ahí encuentras, con comentarios:
- `names`, `date`, `texts`, `location`, `rsvp` (número de WhatsApp), `music`, `theme` (colores)
- `photos` (portada, sobre, carta, pareja…) y `gallery` (colección de fotos)

### Usar tus propias fotos
1. Copia tu foto a `assets/images/` (ej. `portada.jpg`).
2. En `event.js`, en la foto correspondiente, cambia `{ id: '...' }` por `{ src: 'assets/images/portada.jpg' }`.
Si una foto no carga, aparece una imagen de respaldo de `assets/images/respaldo/` (nunca queda un espacio vacío).
Tamaños recomendados: portada 1400 px de ancho, galería 900 px, JPG calidad 70–80.

### Imagen al compartir el enlace (WhatsApp, Facebook…)
Es independiente de la carta: `photos.vistaPrevia` (por defecto `assets/images/vista-previa.jpg`, 1200 × 630).
Reemplázala por tu foto con el mismo nombre, o cambia la ruta en `event.js`.

## 3. Publicar en Netlify
1. Sube esta carpeta a un repositorio de GitHub.
2. En Netlify: *Add new site → Import from Git* y elige el repositorio. No necesita comando de build (ya está `netlify.toml`).
3. Tu invitación queda en `https://tu-sitio.netlify.app/`.

### Varias invitaciones
En `event.js` copia el bloque `demo`, pégalo con otra clave (ej. `'ana-luis'`) y cambia los datos.
Ese evento se abre en `https://tu-sitio.netlify.app/i/ana-luis`.

### Cómo funciona la vista previa (Open Graph)
WhatsApp lee solo el HTML inicial y no ejecuta JavaScript. Por eso `/` y `/i/<slug>` pasan por la función
`netlify/functions/invitacion.js`, que entrega `index.html` con las metaetiquetas `og:*` y `twitter:*`
de ESA invitación (título, descripción e imagen salen de `event.js`).
Después de publicar, si cambias la imagen y WhatsApp muestra la anterior, borra la caché con
https://developers.facebook.com/tools/debug/

## 4. Estructura
```
index.html                 estructura de la página
css/                       base · envelope · sections · experiences
js/config/event.js         ← TODA la configuración
js/core/                   imágenes, cuenta regresiva, música, pantalla completa…
js/envelope.js             animación del sobre
js/experiences/            carrusel · galería 3D · cortinas · transformación · flotantes
netlify/functions/         generador de metaetiquetas
assets/                    images/ (vista previa y respaldos) · audio/musica.mp3
```

## Notas
- Pantalla completa: se solicita al tocar el sobre. Chrome Android la acepta; iPhone/Safari no permite
  pantalla completa en páginas web, y ahí la invitación sigue funcionando con las unidades `dvh` y áreas seguras.
- La música de muestra (`assets/audio/musica.mp3`) es una melodía sencilla generada para la demo; cámbiala por tu canción.
- Confirmación de asistencia: en esta etapa abre WhatsApp con el mensaje ya escrito (sin base de datos).
