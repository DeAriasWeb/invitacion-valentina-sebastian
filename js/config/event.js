/* ==========================================================================
   CONFIGURACIÓN CENTRALIZADA DE INVITACIONES
   --------------------------------------------------------------------------
   Aquí cambias TODO: fotografías, nombres, fecha, ubicación, textos,
   colores y música. No hace falta tocar ningún otro archivo.

   Cada clave de EVENTS es una invitación distinta (un "slug"):
     /            -> invitación "demo" (la primera)
     /i/demo      -> invitación "demo"
     /i/ana-luis  -> la que agregues con la clave 'ana-luis'

   FOTOGRAFÍAS - dos formas de definir cada una:
     1) Foto propia:  { src: 'assets/images/portada.jpg' }
        (copia tu archivo a /assets/images/ con ese nombre y listo)
     2) Foto del banco Unsplash:  { id: '1519741497674-611481863552' }
        (la parte que sigue a "photo-" en la URL de Unsplash)
   Si una foto no carga, se muestra automáticamente una imagen de respaldo
   elegante (assets/images/respaldo/) para que nunca se vea un espacio vacío.
   ========================================================================== */

window.EVENTS = {

  demo: {
    type: 'boda',
    lang: 'es',

    fullscreen: true,

    /* ---------- Protagonistas ---------- */
    names: {
      first: 'Valentina',
      second: 'Sebastián',
      initials: 'V&S',                 // dentro del sello de cera
      together: 'Valentina & Sebastián'
    },

    /* ---------- Fecha (con zona horaria) ---------- */
    date: {
      iso: '2027-03-20T17:00:00-05:00',
      display: '20 · 03 · 2027',
      long: 'Sábado, 20 de marzo de 2027',
      time: '5:00 p. m.'
    },

    /* ---------- Textos ---------- */
    texts: {
      envelopeKicker: 'Tienes una invitación especial',
      envelopeHint: 'Toca para abrir',
      heroKicker: 'Nos casamos',
      heroScroll: 'Desliza',
      quoteKicker: 'Con inmensa alegría',
      quote: 'Después de tanto camino compartido, queremos que seas parte del día en que decidimos caminar juntos para siempre.',
      quoteSign: 'Valentina & Sebastián',
      countdownKicker: 'Falta muy poco',
      countdownTitle: 'La cuenta regresiva ha comenzado',
      countdownDone: 'Hoy es el gran día',
      calendarBtn: 'Agregar al calendario',
      labels: { days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' },

      storyKicker: 'Nuestra historia',
      storyTitle: 'Cada momento nos trajo hasta aquí',
      storyHint: 'Desliza',
      floatKicker: 'Instantes',
      floatTitle: 'Pequeños momentos, grandes recuerdos',
      floatHint: 'Arrastra las fotografías',
      floatBtn: 'Reorganizar',
      curtainKicker: 'Un secreto',
      curtainPrompt: 'Toca para descorrer',
      curtainReveal: 'Y por fin…',
      curtainTitle: 'Nos vamos a casar',
      curtainReplay: 'Volver a cerrar',
      galleryKicker: 'Álbum',
      galleryTitle: 'Un mundo en tres dimensiones',
      galleryHint: 'Arrastra o toca una fotografía',
      morphKicker: 'De ayer a hoy',
      morphTitle: 'Así empezó todo',
      morphHint: 'Toca la imagen para transformarla',
      morphFx: ['Máscara circular', 'Persianas', 'Mosaico', 'Desplazamiento', 'Disolución'],

      infoKicker: 'El gran día',
      infoTitle: 'Programa',
      schedule: [
        { time: '5:00', ampm: 'p. m.', title: 'Ceremonia',  text: 'Jardín de los Cipreses. Te pedimos llegar con 20 minutos de anticipación.' },
        { time: '6:30', ampm: 'p. m.', title: 'Cóctel',     text: 'Brindis de bienvenida bajo las luces del atardecer.' },
        { time: '8:00', ampm: 'p. m.', title: 'Cena y baile', text: 'Una noche para celebrar, brindar y bailar hasta el amanecer.' }
      ],
      dressKicker: 'Código de vestimenta',
      dress: 'Etiqueta formal. Tonos tierra, verdes y champagne son bienvenidos; reservemos el blanco para la novia.',

      placeKicker: 'Ubicación',
      mapBtn: 'Abrir en Google Maps',

      rsvpKicker: 'Confirmación',
      rsvpTitle: '¿Nos acompañas?',
      rsvpText: 'Confirma tu asistencia antes del 20 de febrero de 2027.',
      rsvpName: 'Tu nombre completo',
      rsvpGuests: 'Número de asistentes',
      rsvpYes: 'Allí estaré',
      rsvpNo: 'No podré asistir',
      rsvpMsg: 'Un mensaje para los novios (opcional)',
      rsvpBtn: 'Enviar confirmación',
      rsvpErrorName: 'Escribe tu nombre para continuar.',
      rsvpErrorChoice: 'Elige una opción.',
      rsvpSending: 'Enviando…',
      rsvpThanks: '¡Gracias! Tu respuesta fue registrada.',
      rsvpFail: 'No se pudo enviar. Inténtalo de nuevo.',

      // Panel privado de organizadores (doble toque en la última foto)
      admin: {
        pinTitle: 'Acceso de organizadores',
        pinLead: 'Ingresa tu PIN de 4 dígitos',
        checking: 'Verificando…',
        wrong: 'PIN incorrecto. Intentos restantes: ',
        locked: 'Demasiados intentos. Inténtalo de nuevo en ',
        offline: 'No se pudo conectar. Revisa tu internet.',
        notReady: 'El panel aún no está conectado a Google Sheets.',
        title: 'Invitados',
        confirmed: 'Personas confirmadas',
        answers: 'Respuestas',
        declined: 'No asistirán',
        yes: 'Asistirá',
        no: 'No asistirá',
        empty: 'Aún no hay respuestas.',
        refresh: 'Actualizar',
        sheet: 'Abrir Google Sheets',
        exit: 'Salir'
      },

      thanksKicker: 'Gracias',
      thanksTitle: 'Gracias por ser parte de nuestra historia',
      thanksText: 'Tu presencia es el mejor regalo.',
      thanksSign: 'Con cariño, Valentina & Sebastián'
    },

    /* ---------- Ubicación ---------- */
    location: {
      name: 'Jardín de los Cipreses',
      address: 'Av. Los Olivos 1250, Lima, Perú',
      // Enlace que abre el botón (puedes pegar el de Google Maps "Compartir")
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+de+los+Cipreses+Lima'
    },

    /* ---------- Confirmación (RSVP) ----------
       En esta etapa no hay base de datos: el formulario abre WhatsApp
       con el mensaje ya escrito, dirigido al número de los novios.
       Formato internacional sin "+" ni espacios (ej. Perú: 51999999999). */
    rsvp: {
      whatsapp: '51999999999',
      whatsappToo: false     // true = además de guardar en Google Sheets, abre WhatsApp
    },

    /* ---------- Google Sheets (vía Google Apps Script) ----------
       Pega aquí la URL de tu "Aplicación web" de Apps Script (termina en /exec).
       Mientras esté vacío, la confirmación se envía solo por WhatsApp. */
    sheets: {
      url: 'https://script.google.com/macros/s/AKfycbz64C6qv6NXwHNaDAoYnutkIZOZRlh_Lr6mqvfTRUaOShCMnjlCV-Uv3LwGPfqC2Uns/exec'
    },

    /* ---------- Música ---------- */
    music: {
      src: 'assets/audio/musica.mp3',   // cambia por tu canción (mp3)
      autoplayOnOpen: true,             // intenta sonar al abrir el sobre
      volume: 0.55
    },

    /* ---------- Colores ---------- */
    theme: {
      ink: '#18241d',          // verde casi negro (fondos oscuros)
      ink2: '#24352b',
      paper: '#f6f0e5',        // marfil
      paper2: '#ece2d0',
      gold: '#b9975b',         // dorado champagne
      goldLight: '#e2c994',
      blush: '#e8d3c8',
      seal: '#7b1f2b',         // cera del sello
      sealLight: '#a8384a'
    },

    /* ---------- Fotografías ----------
       Cada clave es un "espacio" de la invitación. Cambia id (Unsplash)
       o usa src (archivo propio en /assets/images/). */
    photos: {
      sobre:      { id: '1519225421980-715cb0215aed', alt: 'Fondo del sobre' },
      carta:      { id: '1511285560929-80b456fea0bc', alt: 'Tarjeta de invitación' },
      portada:    { src: 'assets/images/k.png', alt: 'Valentina y Sebastián' },
     pareja:     { src: 'assets/images/novios.png', alt: 'Los novios' },
      cuenta:     { id: '1469371670807-013ccf25f16a', alt: 'Cuenta regresiva' },
      cortinas:   {  src: 'assets/images/nos_casamos.png', alt: 'Nos casamos' },
      ubicacion:  { src: 'assets/images/ubicacion.png', alt: 'Lugar del evento' },
      gracias:    { src: 'assets/images/gracias.png', alt: 'Gracias' },
      // Imagen que se ve al compartir el enlace (independiente del sobre).
      // Ideal 1200 × 630. Por defecto una composición local; para usar una
      // foto: { id: '...' }  o  { src: 'assets/images/vista-previa.jpg' }
      vistaPrevia:{ src: 'assets/images/vista-previa.jpg' }
    },

    /* Fotos de cada sección. Si una sección no tiene su lista aquí,
       usa la lista "gallery" de abajo. */
        sets: {
      // "Nuestra historia" (carrusel): 8 fotos
      historia: [
        { src: 'assets/images/historia_1.png', caption: 'El primer baile' },
        { src: 'assets/images/historia_2.png', caption: 'Promesas' },
        { src: 'assets/images/historia_3.png', caption: 'Flores de ese día' },
        { src: 'assets/images/historia_4.png', caption: 'Tu mano en la mía' },
        { src: 'assets/images/historia_5.png', caption: 'El vestido' },
        { src: 'assets/images/historia_6.png', caption: 'Entre risas' },
        { src: 'assets/images/historia_7.png', caption: 'Un paseo al atardecer' },
        { src: 'assets/images/historia_8.png', caption: 'La mesa' }
      ],
      // "Instantes" (fotos flotantes): 7 fotos
      instantes: [
        { src: 'assets/images/instantes_1.png', caption: '' },
        { src: 'assets/images/instantes_2.png', caption: '' },
        { src: 'assets/images/instantes_3.png', caption: '' },
        { src: 'assets/images/instantes_4.png', caption: '' },
        { src: 'assets/images/instantes_5.png', caption: '' },
        { src: 'assets/images/instantes_6.png', caption: '' },
        { src: 'assets/images/instantes_7.png', caption: '' }
      ],
      // "Álbum" (galería 3D): 6 fotos
      album: [
        { src: 'assets/images/album_1.png', caption: 'Nuestro primer viaje' },
        { src: 'assets/images/album_2.png', caption: 'Una tarde cualquiera' },
        { src: 'assets/images/album_3.png', caption: 'Con la familia' },
        { src: 'assets/images/album_4.png', caption: 'Celebrando' },
        { src: 'assets/images/album_5.png', caption: 'Mirando el mar' },
        { src: 'assets/images/album_6.png', caption: 'Nuestro hogar' }
      ],
      // "De ayer a hoy" (transformación): 5 fotos
      ayerHoy: [
        { src: 'assets/images/ayer_1.png', caption: 'Cuando nos conocimos' },
        { src: 'assets/images/ayer_2.png', caption: 'Nuestro primer año' },
        { src: 'assets/images/ayer_3.png', caption: 'La propuesta' },
        { src: 'assets/images/ayer_4.png', caption: 'Preparando todo' },
        { src: 'assets/images/ayer_5.png', caption: 'Hoy' }
      ]
    },

    gallery: [
      { id: '1511285560929-80b456fea0bc', caption: 'El primer baile' },
      { id: '1519225421980-715cb0215aed', caption: 'Promesas' },
      { id: '1532712938310-34cb3982ef74', caption: 'Flores de ese día' },
      { id: '1606216794074-735e91aa2c92', caption: 'Tu mano en la mía' },
      { id: '1520854221256-17451cc331bf', caption: 'El vestido' },
      { id: '1544078751-58fee2d8a03b',    caption: 'Entre risas' },
      { id: '1529636798458-92182e662485', caption: 'Un paseo al atardecer' },
      { id: '1460978812857-470ed1c77af0', caption: 'La mesa' }
    ],

    /* ---------- Vista previa al compartir (Open Graph) ---------- */
    og: {
      title: 'Valentina & Sebastián · Nos casamos',
      description: 'Te invitamos a celebrar nuestra boda el 20 de marzo de 2027. Abre tu invitación.',
      siteName: 'Invitaciones Premium',
      imageAlt: 'Invitación de boda de Valentina y Sebastián'
    }
  }

  /* Para crear otra invitación, copia el bloque "demo" completo, pégalo
     aquí debajo con otra clave (ej.  'ana-luis': { ... }) y cambia los datos. */
};

window.DEFAULT_EVENT = 'demo';