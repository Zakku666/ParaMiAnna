(() => {
  /* ======================================================================
     CONFIGURACIÓN
     ====================================================================== */
  const CUMPLE = { mes: 11, dia: 7 };   // día del cumpleaños (mes de 1 a 12)

  const TEXTOS = {
    intro: ["Feliz", "cumpleaños"],     // lo que dice la pantalla de inicio ese día (una línea por elemento)
    titulo: "¡Feliz cumpleaños, mi amor!",
    parrafos: [
      "Hoy es tu día, y quería que lo primero que vieras fuera esto: gracias por existir y por dejarme ser parte de tu vida",
      "Deseo que este nuevo año te traiga todo lo bonito que mereces: risas, tranquilidad y muchos momentos que quieras guardar para siempre",
      "Y que yo pueda estar a tu lado para celebrarlos contigo, hoy y en todos los cumpleaños que vienen"
    ],
    firma: "Con todo mi cariño,\nElAmorDeTuVida",
    pregunta: "¡Feliz cumpleaños otra vez! ¿Quieres volver a leer tu mensaje?"
  };

  /* ======================================================================
     CÓDIGO (no necesitas tocar nada de aquí hacia abajo)
     ====================================================================== */
  const q = id => document.getElementById(id);
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Para probar: ?fecha=2026-11-07
  function ahora() {
    const d = new Date();
    const p = new URLSearchParams(location.search);
    const f = (p.get('fecha') || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (f) d.setFullYear(+f[1], +f[2] - 1, +f[3]);
    return d;
  }

  function esCumple() {
    const d = ahora();
    return d.getMonth() + 1 === CUMPLE.mes && d.getDate() === CUMPLE.dia;
  }

  const clave = () => 'cumple-visto-' + ahora().getFullYear();

  function yaVisto() {
    try { return localStorage.getItem(clave()) === '1'; } catch (e) { return false; }
  }
  function marcarVisto() {
    try { localStorage.setItem(clave(), '1'); } catch (e) {}
  }

  /* ---------- Pantalla de inicio ---------- */
  function textoIntro() {
    if (!esCumple()) return;
    const t = document.querySelector('.intro-texto');
    if (!t) return;
    t.textContent = '';
    TEXTOS.intro.forEach((linea, i) => {
      if (i) t.appendChild(document.createElement('br'));
      t.appendChild(document.createTextNode(linea));
    });
  }

  /* ---------- Capa del cumpleaños ---------- */
  let capa = null;
  let timerCierre = null;

  function crearCapa() {
    if (capa) return;
    capa = document.createElement('div');
    capa.className = 'cumple';
    capa.hidden = true;
    capa.innerHTML =
      '<div class="cumple-confeti"></div>' +
      '<article class="cumple-carta" id="cumple-mensaje" role="dialog" aria-modal="true" aria-label="Feliz cumpleaños">' +
        '<p class="cumple-emoji">🎂</p>' +
        '<h2 class="cumple-titulo"></h2>' +
        '<div class="cumple-cuerpo"></div>' +
        '<button type="button" class="boton cumple-cerrar">Entrar a la página 💗</button>' +
      '</article>' +
      '<article class="cumple-carta" id="cumple-pregunta" role="dialog" aria-modal="true" hidden>' +
        '<p class="cumple-emoji">🎂</p>' +
        '<p class="cumple-texto-pregunta"></p>' +
        '<div class="cumple-botones">' +
          '<button type="button" class="boton romantico cumple-si">Sí, leerlo de nuevo</button>' +
          '<button type="button" class="boton suave cumple-no">Ahora no</button>' +
        '</div>' +
      '</article>';
    document.body.appendChild(capa);
    capa.querySelector('.cumple-cerrar').addEventListener('click', cerrar);
    capa.querySelector('.cumple-no').addEventListener('click', cerrar);
    capa.querySelector('.cumple-si').addEventListener('click', mostrarMensaje);
  }

  function abrirCapa() {
    capa.hidden = false;
    requestAnimationFrame(() => capa.classList.add('visible'));
    document.body.classList.add('modal-abierto');
  }

  function cerrar() {
    capa.classList.remove('visible');
    document.body.classList.remove('modal-abierto');
    timerCierre = setTimeout(() => { capa.hidden = true; }, reducido ? 0 : 600);
  }

  function confeti() {
    const cont = capa.querySelector('.cumple-confeti');
    cont.textContent = '';
    if (reducido) return;
    const colores = ['#f4c06f', '#eaa9a6', '#f6f1de', '#6fa58a', '#c9605c'];
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.width = (6 + Math.random() * 6) + 'px';
      s.style.height = (10 + Math.random() * 10) + 'px';
      s.style.background = colores[Math.floor(Math.random() * colores.length)];
      s.style.animationDuration = (3 + Math.random() * 3) + 's';
      s.style.animationDelay = (Math.random() * 2) + 's';
      s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      cont.appendChild(s);
    }
  }

  function mostrarMensaje() {
    crearCapa();
    clearTimeout(timerCierre);

    const m = q('cumple-mensaje');
    q('cumple-pregunta').hidden = true;
    m.hidden = false;
    m.querySelector('.cumple-titulo').textContent = TEXTOS.titulo;

    // Se reconstruye cada vez, así la animación empieza de nuevo
    const cuerpo = m.querySelector('.cumple-cuerpo');
    cuerpo.textContent = '';
    TEXTOS.parrafos.forEach((texto, i) => {
      const p = document.createElement('p');
      p.className = 'cumple-linea';
      p.textContent = texto;
      p.style.animationDelay = (0.8 + i * 1.5) + 's';
      cuerpo.appendChild(p);
    });

    const firma = document.createElement('p');
    firma.className = 'cumple-linea cumple-firma';
    TEXTOS.firma.split('\n').forEach((linea, i) => {
      if (i) firma.appendChild(document.createElement('br'));
      firma.appendChild(document.createTextNode(linea));
    });
    firma.style.animationDelay = (0.8 + TEXTOS.parrafos.length * 1.5) + 's';
    cuerpo.appendChild(firma);

    confeti();
    abrirCapa();
    marcarVisto();

    if (typeof avisarZac === 'function') {
      avisarZac('🎂 Abrió su mensaje de cumpleaños', 'cumple-' + ahora().getFullYear());
    }
  }

  function mostrarPregunta() {
    crearCapa();
    clearTimeout(timerCierre);
    q('cumple-mensaje').hidden = true;
    const p = q('cumple-pregunta');
    p.hidden = false;
    p.querySelector('.cumple-texto-pregunta').textContent = TEXTOS.pregunta;
    abrirCapa();
  }

  /* ---------- Cuándo mostrarlo ---------- */
  let mostradoEnEstaVisita = false;

  function intentar() {
    if (mostradoEnEstaVisita || !esCumple()) return;
    const abrir = q('abrir');
    if (abrir && !abrir.checked) return;   // espera a que abra la pantalla de inicio
    mostradoEnEstaVisita = true;
    if (yaVisto()) mostrarPregunta();
    else mostrarMensaje();
  }

  function iniciar() {
    textoIntro();
    const abrir = q('abrir');
    if (abrir && !abrir.checked) {
      abrir.addEventListener('change', () => {
        if (abrir.checked) setTimeout(intentar, 700);
      });
    } else {
      intentar();
    }
    setInterval(intentar, 20000);   // por si pasa la medianoche con la página abierta
  }

  iniciar();
})();