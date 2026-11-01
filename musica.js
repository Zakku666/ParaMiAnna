
(() => {
  const q = id => document.getElementById(id);

  const lista = q('lista');
  const audio = q('audio');
  const rep = q('reproductor');

  if (!lista || !audio || typeof CANCIONES === 'undefined' || !CANCIONES.length) return;

  const ui = {
    titulo: q('rep-titulo'),
    artista: q('rep-artista'),
    play: q('rep-play'),
    prev: q('rep-prev'),
    next: q('rep-next'),
    atras: q('rep-atras'),
    adelante: q('rep-adelante'),
    barra: q('rep-barra'),
    actual: q('rep-actual'),
    total: q('rep-total'),
    aleatorio: q('rep-aleatorio'),
    ciclo: q('rep-ciclo')
  };

  const ICONO = {
    play: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pausa: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    aleatorio: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 14 4 4-4 4"/><path d="M18 2l4 4-4 4"/><path d="M2 18h2.5a6 6 0 0 0 4.2-1.7L17.3 7.7A6 6 0 0 1 21.5 6H22"/><path d="M2 6h2.5a6 6 0 0 1 4.2 1.7"/><path d="M14 14.5l3.3 3.3a6 6 0 0 0 4.2 1.7H22"/></svg>',
    lista: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
    una: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>'
  };

  let actual = -1;
  let posicion = -1;
  let orden = CANCIONES.map((_, i) => i);
  let aleatorio = false;
  let ciclo = 0;
  let arrastrando = false;

  const botonesTarjeta = [];
  const tarjetas = [];

  const formato = s => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const seg = Math.floor(s % 60);
    return m + ':' + String(seg).padStart(2, '0');
  };

  function mezclar(array) {
    const resultado = [...array];

    for (let i = resultado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }

    return resultado;
  }

  function prepararOrden(indice) {
    if (aleatorio) {
      const restantes = CANCIONES.map((_, i) => i).filter(i => i !== indice);
      orden = [indice, ...mezclar(restantes)];
      posicion = 0;
    } else {
      orden = CANCIONES.map((_, i) => i);
      posicion = indice;
    }
  }

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
      botonesTarjeta[i].innerHTML = esta && sonando ? ICONO.pausa : ICONO.play;
    });
  }

  function pintarModos() {
    ui.aleatorio.classList.toggle('activo', aleatorio);
    ui.aleatorio.setAttribute('aria-pressed', String(aleatorio));
    ui.aleatorio.setAttribute('aria-label', aleatorio ? 'Desactivar reproducción aleatoria' : 'Activar reproducción aleatoria');

    ui.ciclo.classList.toggle('activo', ciclo !== 0);
    ui.ciclo.setAttribute('aria-pressed', String(ciclo !== 0));

    if (ciclo === 0) {
      ui.ciclo.innerHTML = ICONO.lista;
      ui.ciclo.setAttribute('aria-label', 'Repetición desactivada');
      ui.ciclo.title = 'Repetición desactivada';
    } else if (ciclo === 1) {
      ui.ciclo.innerHTML = ICONO.lista;
      ui.ciclo.setAttribute('aria-label', 'Repetir lista');
      ui.ciclo.title = 'Repetir lista';
    } else {
      ui.ciclo.innerHTML = ICONO.una;
      ui.ciclo.setAttribute('aria-label', 'Repetir canción');
      ui.ciclo.title = 'Repetir canción';
    }
  }

  function pintarProgreso() {
    const d = audio.duration;
    const t = audio.currentTime;
    const p = d ? (t / d) * 1000 : 0;

    ui.barra.value = p;
    ui.barra.style.setProperty('--p', (p / 10) + '%');
    ui.actual.textContent = formato(t);
    ui.total.textContent = formato(d);
  }

  /* ---------- Reproducción ---------- */

  function cargar(i) {
    actual = i;

    const c = CANCIONES[i];

    audio.src = c.archivo;
    ui.titulo.textContent = c.titulo;
    ui.artista.textContent = c.artista;

    rep.hidden = false;
    pintarProgreso();
    pintar();

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
    if (p && p.catch) p.catch(() => pintar());
  }

  function reproducir(i) {
    if (i === actual) {
      audio.paused ? intentarPlay() : audio.pause();
      return;
    }

    prepararOrden(i);
    cargar(i);
    intentarPlay();
  }

  function reproducirNueva(i) {
    posicion = i;
    cargar(orden[posicion]);
    intentarPlay();
  }

  function siguiente(automatico = false) {
    if (actual < 0) {
      prepararOrden(0);
      reproducirNueva(0);
      return;
    }

    if (automatico && ciclo === 2) {
      audio.currentTime = 0;
      intentarPlay();
      return;
    }

    if (posicion < orden.length - 1) {
      reproducirNueva(posicion + 1);
      return;
    }

    if (ciclo === 1 || !automatico) {
      reproducirNueva(0);
    }
  }

  function anterior() {
    if (actual < 0) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (posicion > 0) {
      reproducirNueva(posicion - 1);
    } else {
      reproducirNueva(orden.length - 1);
    }
  }

  function saltar(segundos) {
    if (actual < 0) return;

    const limite = isFinite(audio.duration) ? audio.duration : Infinity;

    audio.currentTime = Math.min(
      Math.max(0, audio.currentTime + segundos),
      limite
    );
  }

  /* ---------- Modos de reproducción ---------- */

  function cambiarAleatorio() {
    aleatorio = !aleatorio;

    if (actual >= 0) {
      prepararOrden(actual);
    } else {
      orden = aleatorio
        ? mezclar(CANCIONES.map((_, i) => i))
        : CANCIONES.map((_, i) => i);

      posicion = -1;
    }

    pintarModos();
  }

  function cambiarCiclo() {
    ciclo = (ciclo + 1) % 3;
    pintarModos();
  }

  /* ---------- Eventos del audio ---------- */

  audio.addEventListener('play', pintar);
  audio.addEventListener('pause', pintar);
  audio.addEventListener('loadedmetadata', pintarProgreso);

  audio.addEventListener('timeupdate', () => {
    if (!arrastrando) pintarProgreso();
  });

  audio.addEventListener('ended', () => siguiente(true));

  audio.addEventListener('error', () => {
    if (actual >= 0) {
      ui.artista.textContent = 'No encontré el archivo: ' + CANCIONES[actual].archivo;
    }
    pintar();
  });

  /* ---------- Botones del reproductor ---------- */

  ui.play.addEventListener('click', () => {
    if (actual < 0) {
      if (aleatorio) {
        prepararOrden(orden[0]);
        reproducirNueva(0);
      } else {
        reproducir(0);
      }
      return;
    }

    audio.paused ? intentarPlay() : audio.pause();
  });

  ui.next.addEventListener('click', () => siguiente());
  ui.prev.addEventListener('click', anterior);

  ui.atras.addEventListener('click', () => saltar(-10));
  ui.adelante.addEventListener('click', () => saltar(10));

  ui.aleatorio.addEventListener('click', cambiarAleatorio);
  ui.ciclo.addEventListener('click', cambiarCiclo);

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

  /* ---------- Controles del celular ---------- */

  if ('mediaSession' in navigator) {
    const acciones = {
      play: intentarPlay,
      pause: () => audio.pause(),
      previoustrack: anterior,
      nexttrack: () => siguiente(),
      seekbackward: () => saltar(-10),
      seekforward: () => saltar(10)
    };

    Object.keys(acciones).forEach(nombre => {
      try {
        navigator.mediaSession.setActionHandler(nombre, acciones[nombre]);
      } catch (e) {}
    });
  }

  pintarModos();
  ui.play.innerHTML = ICONO.play;
})();
