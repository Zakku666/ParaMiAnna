(() => {
  const q = id => document.getElementById(id);

  const lista = q('lista');
  const audio = q('audio');
  const rep   = q('reproductor');
  if (!lista || !audio || typeof CANCIONES === 'undefined' || !CANCIONES.length) return;

  const ui = {
    titulo:   q('rep-titulo'),
    artista:  q('rep-artista'),
    play:     q('rep-play'),
    prev:     q('rep-prev'),
    next:     q('rep-next'),
    atras:    q('rep-atras'),
    adelante: q('rep-adelante'),
    barra:    q('rep-barra'),
    actual:   q('rep-actual'),
    total:    q('rep-total')
  };

  const ICONO = {
    play:  '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pausa: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
  };

  let actual = -1;          // canción cargada (-1 = ninguna)
  let arrastrando = false;  // true mientras mueve la barra
  const botonesTarjeta = [];
  const tarjetas = [];

  const formato = s => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const seg = Math.floor(s % 60);
    return m + ':' + String(seg).padStart(2, '0');
  };

  /* ---------- Tarjetas ---------- */
  function texto(clase, valor, etiqueta) {
    const el = document.createElement(etiqueta || 'p');
    el.className = clase;
    el.textContent = valor || '';
    return el;
  }

  CANCIONES.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'tarjeta';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tarjeta-play';
    btn.setAttribute('aria-label', 'Reproducir ' + c.titulo);
    btn.innerHTML = ICONO.play;
    btn.addEventListener('click', () => reproducir(i));

    const info = document.createElement('div');
    info.className = 'tarjeta-info';
    info.appendChild(texto('tarjeta-titulo', c.titulo, 'h2'));
    info.appendChild(texto('tarjeta-artista', c.artista));
    info.appendChild(texto('tarjeta-frase', c.frase));
    info.appendChild(texto('tarjeta-nota', c.nota));

    li.appendChild(btn);
    li.appendChild(info);
    lista.appendChild(li);

    botonesTarjeta.push(btn);
    tarjetas.push(li);
  });

  /* ---------- Estado visual ---------- */
  function pintar() {
    const sonando = !audio.paused && actual >= 0;
    ui.play.innerHTML = sonando ? ICONO.pausa : ICONO.play;
    ui.play.setAttribute('aria-label', sonando ? 'Pausar' : 'Reproducir');

    tarjetas.forEach((li, i) => {
      const esta = i === actual;
      li.classList.toggle('sonando', esta);
      botonesTarjeta[i].innerHTML = (esta && sonando) ? ICONO.pausa : ICONO.play;
    });
  }

  function pintarProgreso() {
    const d = audio.duration;
    const t = audio.currentTime;
    const p = d ? (t / d) * 1000 : 0;
    ui.barra.value = p;
    ui.barra.style.setProperty('--p', (p / 10) + '%');
    ui.actual.textContent = formato(t);
    ui.total.textContent  = formato(d);
  }

  /* ---------- Control ---------- */
  function cargar(i) {
    actual = i;
    const c = CANCIONES[i];
    audio.src = c.archivo;
    ui.titulo.textContent  = c.titulo;
    ui.artista.textContent = c.artista;
    rep.hidden = false;
    pintarProgreso();

    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: c.titulo,
        artist: c.artista,
        album: 'Nuestra música'
      });
    }
  }

  function intentarPlay() {
    const p = audio.play();
    if (p && p.catch) p.catch(() => { pintar(); });
  }

  function reproducir(i) {
    if (i === actual) {
      audio.paused ? intentarPlay() : audio.pause();
    } else {
      cargar(i);
      intentarPlay();
    }
  }

  function siguiente() {
    reproducir_nueva((actual + 1) % CANCIONES.length);
  }

  function anterior() {
    // Si ya pasaron más de 3 segundos, reinicia la canción; si no, va a la anterior
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    reproducir_nueva((actual - 1 + CANCIONES.length) % CANCIONES.length);
  }

  function reproducir_nueva(i) {
    cargar(i);
    intentarPlay();
  }

  function saltar(segundos) {
    if (actual < 0) return;
    const limite = isFinite(audio.duration) ? audio.duration : Infinity;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + segundos), limite);
  }

  /* ---------- Eventos del audio ---------- */
  audio.addEventListener('play', pintar);
  audio.addEventListener('pause', pintar);
  audio.addEventListener('loadedmetadata', pintarProgreso);
  audio.addEventListener('timeupdate', () => { if (!arrastrando) pintarProgreso(); });
  audio.addEventListener('ended', siguiente);
  audio.addEventListener('error', () => {
    if (actual >= 0) ui.artista.textContent = 'No encontré el archivo: ' + CANCIONES[actual].archivo;
    pintar();
  });

  /* ---------- Botones del reproductor ---------- */
  ui.play.addEventListener('click', () => {
    if (actual < 0) { reproducir(0); return; }
    audio.paused ? intentarPlay() : audio.pause();
  });
  ui.next.addEventListener('click', siguiente);
  ui.prev.addEventListener('click', anterior);
  ui.atras.addEventListener('click', () => saltar(-10));
  ui.adelante.addEventListener('click', () => saltar(10));

  /* ---------- Barra de progreso ---------- */
  ui.barra.addEventListener('input', () => {
    arrastrando = true;
    const d = audio.duration || 0;
    const t = (ui.barra.value / 1000) * d;
    ui.barra.style.setProperty('--p', (ui.barra.value / 10) + '%');
    ui.actual.textContent = formato(t);
  });
  ui.barra.addEventListener('change', () => {
    const d = audio.duration;
    if (d) audio.currentTime = (ui.barra.value / 1000) * d;
    arrastrando = false;
  });

  /* ---------- Controles del celular (pantalla de bloqueo) ---------- */
  if ('mediaSession' in navigator) {
    const acciones = {
      play:          () => intentarPlay(),
      pause:         () => audio.pause(),
      previoustrack: anterior,
      nexttrack:     siguiente,
      seekbackward:  () => saltar(-10),
      seekforward:   () => saltar(10)
    };
    Object.keys(acciones).forEach(nombre => {
      try { navigator.mediaSession.setActionHandler(nombre, acciones[nombre]); } catch (e) {}
    });
  }

  ui.play.innerHTML = ICONO.play;
})();