(() => {
  const VERSION = 'v5';

  /* ======================================================================
     CONFIGURACIÓN: aquí editas todos los textos
     ====================================================================== */

  // Saludo según la hora (se elige uno al azar de cada lista)
  const SALUDOS = {
    madrugada: ["Es de madrugada… ¿no deberías estar durmiendo? 🌙", "¿Despierta a esta hora? Duerme pronto, mi amor 🌙"],
    manana:    ["Buenos días, mi amor ☀️", "Que tengas una mañana preciosa ☀️"],
    tarde:     ["Buenas tardes, mi amor 🌼", "Espero que tu tarde vaya lindo 🌼"],
    noche:     ["Buenas noches, mi amor 🌙", "Qué bueno que abriste esto esta noche 🌙"]
  };

  const CONFIG = {
    mesiversario: true,        // avisa los días que cumplen meses o años (usa INICIO de script.js)
    mostrarPista: true,        // muestra "Hay 5 secretos escondidos…" en el pie de página
    ordenPolaroids: [1, 3, 2], // orden secreto de las polaroids (1 = la primera de arriba)
    // Fechas especiales extra (mes 1-12 y día). Ejemplo:
    // { mes: 3, dia: 14, titulo: "¡Feliz cumpleaños!", texto: "Hoy el mundo tiene una persona más hermosa." }
    fechasEspeciales: []
  };

  const SECRETOS = {
    sol: {
      titulo: "Me encontraste",
      texto: "Tocaste el sol cinco veces, así que ya sé que eres curiosa eh, esa curiosidad es una de las cosas que más me gustan de ti."
    },
    corazon: {
      titulo: "Un secreto más",
      texto: "Mantuviste presionado mi corazón, y así de firme es lo que siento por ti una y un millon de veces"
    },
    luciernaga: {
      titulo: "Atrapaste una estrella",
      texto: "Dicen que si atrapas una luz dorada puedes pedir un deseo mi amor, pídelo, y yo hago todo lo posible por cumplirlo"
    },
    polaroids: {
      emoji: "💌",
      imagen: "fotos/Nosotros.jpeg",       // opcional: una foto especial (si no existe, usa el emoji)
      pie: "Esta no estaba en la lista, jsjsjs algun dia seremos estos mi amor",
      aviso: "Apareció una imagen secreta ✨"
    },
    fondo: {
      texto: "Llegaste hasta el final y no te fuiste... Eso me encanta de ti"
    },
    final: {
      titulo: "Los encontraste todos",
      texto: "Eres igual de buena encontrando secretos que quedándote con mi corazónbb jsjs como premio, al final de la página se desbloquearon dos botones 💌🔥"
    }
  };

  /* ======================================================================
     CÓDIGO (no necesitas tocar nada de aquí hacia abajo)
     ====================================================================== */
  const q = id => document.getElementById(id);
  const azar = (a, b) => a + Math.random() * (b - a);
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BUSQUEDAS = ['sol', 'corazon', 'polaroids', 'luciernaga', 'fondo'];
  const TOTAL = BUSQUEDAS.length;
  const CLAVE = 'secretos-encontrados';

  console.log('secretos.js', VERSION);

  let encontrados = [];
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE));
    if (Array.isArray(guardados)) encontrados = guardados.filter(id => BUSQUEDAS.includes(id));
  } catch (e) {}

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(encontrados)); } catch (e) {}
  }

  // Para probar: ?fecha=2026-12-01  y/o  ?hora=23
  function ahora() {
    const d = new Date();
    const p = new URLSearchParams(location.search);
    const f = (p.get('fecha') || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (f) d.setFullYear(+f[1], +f[2] - 1, +f[3]);
    const h = p.get('hora');
    if (h !== null && /^\d{1,2}$/.test(h)) d.setHours(+h);
    return d;
  }

  /* ---------- Ventana y aviso ---------- */
  let ventana = null;
  let timerVentana = null;
  let scrollPendiente = false;

  function asegurarVentana() {
    if (ventana) return;
    ventana = document.createElement('div');
    ventana.className = 'secreto';
    ventana.hidden = true;
    ventana.innerHTML =
      '<div class="secreto-fondo"></div>' +
      '<article class="secreto-carta" role="dialog" aria-modal="true">' +
        '<p class="secreto-contador"></p>' +
        '<h3 class="secreto-titulo"></h3>' +
        '<p class="secreto-texto"></p>' +
        '<button type="button" class="boton secreto-cerrar">Cerrar</button>' +
      '</article>';
    document.body.appendChild(ventana);
    ventana.querySelector('.secreto-fondo').addEventListener('click', cerrarVentana);
    ventana.querySelector('.secreto-cerrar').addEventListener('click', cerrarVentana);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !ventana.hidden) cerrarVentana();
    });
  }

  function mostrarVentana({ contador, titulo, texto, extra }) {
    asegurarVentana();
    clearTimeout(timerVentana);
    ventana.querySelector('.secreto-contador').textContent = contador || '';
    ventana.querySelector('.secreto-titulo').textContent = titulo || '';
    ventana.querySelector('.secreto-texto').textContent = extra ? texto + '\n\n' + extra : texto;
    ventana.hidden = false;
    requestAnimationFrame(() => ventana.classList.add('visible'));
    document.body.classList.add('modal-abierto');
    ventana.querySelector('.secreto-cerrar').focus();
  }

  function cerrarVentana() {
    ventana.classList.remove('visible');
    document.body.classList.remove('modal-abierto');
    timerVentana = setTimeout(() => { ventana.hidden = true; }, reducido ? 0 : 350);

    // Si acaba de desbloquear los planes, baja sola hasta los botones
    if (scrollPendiente) {
      scrollPendiente = false;
      setTimeout(() => {
        const s = q('planes-hoy');
        if (s) s.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 450);
    }
  }

  let avisoEl = null;
  let timerAviso = null;

  function aviso(texto) {
    if (!avisoEl) {
      avisoEl = document.createElement('div');
      avisoEl.className = 'secreto-aviso';
      avisoEl.setAttribute('role', 'status');
      document.body.appendChild(avisoEl);
    }
    avisoEl.textContent = texto;
    requestAnimationFrame(() => avisoEl.classList.add('visible'));
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => avisoEl.classList.remove('visible'), 3600);
  }

  /* ---------- Planes de hoy (se desbloquean con los 5 secretos) ---------- */
  // Si la sección no está en el HTML, se crea aquí mismo
  function asegurarSeccionPlanes() {
    let sec = q('planes-hoy');
    if (sec) return sec;

    const main = document.querySelector('main');
    if (!main) return null;

    sec = document.createElement('section');
    sec.className = 'planes-hoy';
    sec.id = 'planes-hoy';
    sec.hidden = true;
    sec.innerHTML =
      '<h2>Premio por encontrarlos todos</h2>' +
      '<p class="nota">cada día hay un plan nuevo para ti</p>' +
      '<div class="planes-hoy-botones">' +
        '<a class="boton romantico" href="plan-hoy.html?tipo=romantico">Plan romántico de hoy 💌</a>' +
        '<a class="boton hot" href="plan-hoy.html?tipo=hot">Plan hot de hoy 🔥</a>' +
      '</div>';

    const pie = main.querySelector('footer');
    main.insertBefore(sec, pie || null);
    return sec;
  }

  function desbloquearPlanes(nuevo) {
    const sec = asegurarSeccionPlanes();
    if (!sec) return;
    sec.hidden = false;
    if (nuevo) {
      sec.classList.add('nueva');
      scrollPendiente = true;
    }
  }

  /* ---------- Registro de secretos encontrados ---------- */
  function registrar(id) {
    const nuevo = !encontrados.includes(id);
    if (nuevo) { encontrados.push(id); guardar(); }
    return { nuevo, n: encontrados.length, completo: nuevo && encontrados.length === TOTAL };
  }

  function encontrar(id, datos, conVentana) {
    const r = registrar(id);
    const contador = r.nuevo ? '✦ secreto ' + r.n + ' de ' + TOTAL : '✦ ya lo habías encontrado';

    if (conVentana) {
      mostrarVentana({
        contador,
        titulo: datos.titulo,
        texto: datos.texto,
        extra: r.completo ? SECRETOS.final.texto : ''
      });
    } else {
      aviso(contador);
      if (r.completo) {
        setTimeout(() => mostrarVentana({
          contador: '✦ ' + TOTAL + ' de ' + TOTAL,
          titulo: SECRETOS.final.titulo,
          texto: SECRETOS.final.texto
        }), 2200);
      }
    }

    if (r.completo) {
      desbloquearPlanes(true);
      if (typeof lluviaCorazones === 'function') lluviaCorazones();
      if (typeof avisarZac === 'function') {
        avisarZac('🎉 Encontró los 5 secretos y desbloqueó los planes de hoy', 'secretos-completos');
      }
    }
  }

  /* ---------- 6. Saludo según la hora ---------- */
  function saludoHora() {
    const portada = document.querySelector('.portada');
    const h1 = portada && portada.querySelector('h1');
    if (!h1) return;

    const h = ahora().getHours();
    const tramo = h < 6 ? 'madrugada' : h < 12 ? 'manana' : h < 20 ? 'tarde' : 'noche';
    const lista = SALUDOS[tramo];

    const p = document.createElement('p');
    p.className = 'saludo-hora';
    p.textContent = lista[Math.floor(Math.random() * lista.length)];
    portada.insertBefore(p, h1);
  }

  /* ---------- 7. Banner de fechas especiales ---------- */
  function fechaEspecial() {
    const hoy = ahora();
    const y = hoy.getFullYear();
    const m = hoy.getMonth();
    const d = hoy.getDate();

    if (CONFIG.mesiversario && typeof INICIO !== 'undefined') {
      const diasMes = new Date(y, m + 1, 0).getDate();
      const diaObjetivo = Math.min(INICIO.getDate(), diasMes);
      const meses = (y - INICIO.getFullYear()) * 12 + (m - INICIO.getMonth());

      if (d === diaObjetivo && meses > 0) {
        const anios = Math.floor(meses / 12);
        const resto = meses % 12;
        if (resto === 0) {
          return {
            titulo: '¡Feliz aniversario!',
            texto: 'Hoy cumplimos ' + anios + (anios === 1 ? ' año' : ' años') + ' juntos'
          };
        }
        const partes = (anios ? anios + (anios === 1 ? ' año' : ' años') + ' y ' : '') +
                       resto + (resto === 1 ? ' mes' : ' meses');
        return { titulo: '¡Feliz mesiversario!', texto: 'Hoy cumplimos ' + partes + ' juntos' };
      }
    }

    return CONFIG.fechasEspeciales.find(f => f.mes - 1 === m && f.dia === d) || null;
  }

  function mostrarBanner(f) {
    const b = document.createElement('div');
    b.className = 'banner-fecha';
    b.setAttribute('role', 'status');

    const t = document.createElement('p');
    t.className = 'banner-titulo';
    t.textContent = f.titulo;
    const x = document.createElement('p');
    x.className = 'banner-texto';
    x.textContent = f.texto;
    b.appendChild(t);
    b.appendChild(x);
    document.body.appendChild(b);

    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('visible')));
    const quitar = () => { b.classList.remove('visible'); setTimeout(() => b.remove(), 800); };
    b.addEventListener('click', quitar);
    setTimeout(quitar, 14000);
    if (typeof lluviaCorazones === 'function') lluviaCorazones();
  }

  function iniciarBanner() {
    const f = fechaEspecial();
    if (!f) return;
    const abrir = q('abrir'); // el banner aparece cuando ella abre la pantalla de inicio
    if (!abrir || abrir.checked) { mostrarBanner(f); return; }
    abrir.addEventListener('change', () => {
      if (abrir.checked) setTimeout(() => mostrarBanner(f), 900);
    }, { once: true });
  }

  /* ---------- 8. 11:11 ---------- */
  function iniciarDeseo() {
    let ultimo = '';
    const revisar = () => {
      const d = ahora();
      const clave = d.getHours() + ':' + d.getMinutes();
      if (d.getHours() % 12 === 11 && d.getMinutes() === 11 && clave !== ultimo) {
        ultimo = clave;
        aviso('11:11 ✨ pide un deseo');
      }
    };
    revisar();
    setInterval(revisar, 15000);
  }

  /* ---------- 1. Sol: 5 toques ---------- */
  function iniciarSol() {
    const astro = document.querySelector('.astro');
    if (!astro) return;
    let toques = 0;
    let ultimo = 0;

    astro.addEventListener('click', () => {
      const t = Date.now();
      toques = (t - ultimo < 1200) ? toques + 1 : 1;
      ultimo = t;

      astro.style.filter = 'brightness(1.4)';
      setTimeout(() => { astro.style.filter = ''; }, 160);

      if (toques >= 5) {
        toques = 0;
        encontrar('sol', SECRETOS.sol, true);
      }
    });
  }

  /* ---------- 2. Corazón: mantener presionado ---------- */
  function iniciarCorazon() {
    const corazon = q('corazon-secreto');
    if (!corazon) return;
    let timer = null;

    const empezar = () => {
      corazon.classList.add('latiendo');
      timer = setTimeout(() => {
        corazon.classList.remove('latiendo');
        timer = null;
        encontrar('corazon', SECRETOS.corazon, true);
      }, 1500);
    };
    const cancelar = () => {
      clearTimeout(timer);
      timer = null;
      corazon.classList.remove('latiendo');
    };

    corazon.addEventListener('pointerdown', empezar);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => corazon.addEventListener(ev, cancelar));
    corazon.addEventListener('contextmenu', e => e.preventDefault());
  }

  /* ---------- 3. Polaroids: orden secreto ---------- */
  function crearPolaroidSecreta(animar) {
    const cont = document.querySelector('.polaroids');
    if (!cont || cont.querySelector('.polaroid-secreta')) return null;
    const d = SECRETOS.polaroids;

    const fig = document.createElement('figure');
    fig.className = 'polaroid polaroid-secreta' + (animar ? ' nueva' : '');
    fig.style.setProperty('--r', '2deg');

    const foto = document.createElement('div');
    foto.className = 'foto f-secreta';
    const ponerEmoji = () => {
      foto.textContent = '';
      const s = document.createElement('span');
      s.textContent = d.emoji || '💌';
      foto.appendChild(s);
    };
    ponerEmoji();

    if (d.imagen) {
      const img = new Image();
      img.alt = d.pie || '';
      img.onload = () => { foto.textContent = ''; foto.appendChild(img); };
      img.src = d.imagen;
    }

    const cap = document.createElement('figcaption');
    cap.textContent = d.pie || '';
    fig.appendChild(foto);
    fig.appendChild(cap);
    cont.appendChild(fig);
    return fig;
  }

  function iniciarPolaroids() {
    if (encontrados.includes('polaroids')) crearPolaroidSecreta(false);

    const lista = [...document.querySelectorAll('.polaroid:not(.polaroid-secreta)')];
    const orden = CONFIG.ordenPolaroids.map(n => n - 1);
    if (!lista.length || orden.some(i => i >= lista.length)) return;
    let paso = 0;

    lista.forEach((el, idx) => {
      el.addEventListener('click', () => {
        if (encontrados.includes('polaroids')) return;
        if (idx === orden[paso]) paso++;
        else paso = (idx === orden[0]) ? 1 : 0;

        if (paso === orden.length) {
          paso = 0;
          const fig = crearPolaroidSecreta(true);
          if (fig) setTimeout(() => fig.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          aviso(SECRETOS.polaroids.aviso);
          setTimeout(() => encontrar('polaroids', SECRETOS.polaroids, false), 1800);
        }
      });
    });
  }

  /* ---------- 4. Luz dorada ---------- */
  function iniciarDorada() {
    if (reducido || encontrados.includes('luciernaga')) return;

    const programar = () => {
      if (encontrados.includes('luciernaga')) return;
      setTimeout(soltar, azar(25000, 60000));
    };

    const soltar = () => {
      if (encontrados.includes('luciernaga')) return;
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'dorada';
      d.setAttribute('aria-label', 'Una luz dorada');
      d.style.top = azar(15, 75) + 'dvh';
      d.style.setProperty('--dur', azar(12, 18) + 's');
      d.addEventListener('click', () => {
        d.remove();
        encontrar('luciernaga', SECRETOS.luciernaga, true);
      });
      d.addEventListener('animationend', () => { d.remove(); programar(); });
      document.body.appendChild(d);
    };

    programar();
  }

  /* ---------- 5. Final de la página ---------- */
  function iniciarPie() {
    const pie = document.querySelector('footer');
    if (!pie) return;

    const pista = q('pista');
    if (pista && CONFIG.mostrarPista) {
      pista.textContent = 'Hay ' + TOTAL + ' secretos escondidos en esta página 👀';
    }

    const extra = q('footer-extra');
    if (!extra) return;

    if (encontrados.includes('fondo')) {
      extra.textContent = SECRETOS.fondo.texto;
      extra.classList.add('visible');
      return;
    }
    if (!('IntersectionObserver' in window)) return;

    let timer = null;
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(en => {
        clearTimeout(timer);
        if (en.isIntersecting && en.intersectionRatio >= 0.9) {
          timer = setTimeout(() => {
            extra.textContent = SECRETOS.fondo.texto;
            extra.classList.add('visible');
            encontrar('fondo', SECRETOS.fondo, false);
            obs.disconnect();
          }, 2000);
        }
      });
    }, { threshold: [0, 0.9, 1] });
    obs.observe(pie);
  }

  /* ---------- Modo de prueba: abre la página con ?debug al final del link ---------- */
  const NOMBRES = {
    sol: 'Sol (5 toques)',
    corazon: 'Corazón (mantener presionado)',
    polaroids: 'Polaroids (orden secreto)',
    luciernaga: 'Luz dorada',
    fondo: 'Final de la página'
  };

  function iniciarDebug() {
    if (!new URLSearchParams(location.search).has('debug')) return;

    const panel = document.createElement('div');
    panel.className = 'secretos-debug';

    const titulo = document.createElement('p');
    titulo.className = 'debug-titulo';
    panel.appendChild(titulo);

    const lineas = {};
    BUSQUEDAS.forEach(id => {
      const p = document.createElement('p');
      lineas[id] = p;
      panel.appendChild(p);
    });

    const estado = document.createElement('p');
    estado.className = 'debug-estado';
    panel.appendChild(estado);

    const boton = (texto, accion) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = texto;
      b.addEventListener('click', accion);
      panel.appendChild(b);
    };
    boton('Marcar todos y recargar', () => { encontrados = BUSQUEDAS.slice(); guardar(); location.reload(); });
    boton('Reiniciar y recargar', () => { encontrados = []; guardar(); location.reload(); });
    boton('Mostrar los botones ahora', () => {
      desbloquearPlanes(false);
      const s = q('planes-hoy');
      if (s) s.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const pintar = () => {
      titulo.textContent = 'Secretos ' + VERSION + ': ' + encontrados.length + ' de ' + TOTAL;
      BUSQUEDAS.forEach(id => {
        lineas[id].textContent = (encontrados.includes(id) ? '✅ ' : '⬜ ') + NOMBRES[id];
      });
      const sec = q('planes-hoy');
      const visible = !!sec && !sec.hidden && getComputedStyle(sec).display !== 'none';
      estado.textContent = 'Botones: ' + (sec ? (visible ? 'visibles ✅' : 'ocultos') : 'no existen') +
        ' · avisos.js: ' + (typeof avisarZac === 'function' ? 'sí' : 'no');
    };
    pintar();
    setInterval(pintar, 1000);
    document.body.appendChild(panel);
  }

  /* ---------- Inicio ---------- */
  saludoHora();
  iniciarBanner();
  iniciarDeseo();
  iniciarSol();
  iniciarCorazon();
  iniciarPolaroids();
  iniciarDorada();
  iniciarPie();
  iniciarDebug();
  if (encontrados.length >= TOTAL) desbloquearPlanes(false);
})();