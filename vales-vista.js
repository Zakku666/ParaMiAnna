(() => {
  const q = id => document.getElementById(id);

  const vistaNiveles = q('vista-niveles');
  const vistaQuiz    = q('vista-quiz');
  const vistaRes     = q('vista-resultado');
  if (!vistaNiveles || typeof NIVELES === 'undefined' ||
      typeof PREGUNTAS === 'undefined' || typeof VALES === 'undefined') return;

  /* ---------- Almacenamiento ---------- */
  const K_GANADOS   = 'vales-ganados';
  const K_CANJEADOS = 'vales-canjeados';

  const leer = clave => {
    try {
      const v = JSON.parse(localStorage.getItem(clave));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  };
  const guardar = (clave, valor) => {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) {}
  };

  let ganados   = leer(K_GANADOS).filter(id => VALES.some(v => v.id === id));
  let canjeados = leer(K_CANJEADOS);

  /* ---------- Utilidades ---------- */
  function el(etiqueta, clase, texto) {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function mezclar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const elegir = lista => lista[Math.floor(Math.random() * lista.length)];

  function mostrar(cual) {
    vistaNiveles.hidden = cual !== 'niveles';
    vistaQuiz.hidden    = cual !== 'quiz';
    vistaRes.hidden     = cual !== 'resultado';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Vales ---------- */
  function urlCanje(vale) {
    const msg = (typeof MENSAJE_CANJE === 'function')
      ? MENSAJE_CANJE(vale)
      : 'Quiero canjear mi vale: ' + vale.titulo;
    const base = (typeof WHATSAPP !== 'undefined' && WHATSAPP)
      ? 'https://wa.me/' + WHATSAPP
      : 'https://wa.me/';
    return base + '?text=' + encodeURIComponent(msg);
  }

  function crearVale(vale) {
    const yaCanjeado = canjeados.includes(vale.id);
    const caja = el('div', 'vale' + (yaCanjeado ? ' canjeado' : ''));
    caja.appendChild(el('span', 'vale-emoji', vale.emoji || '\u2665'));

    const cuerpo = el('div', 'vale-cuerpo');
    cuerpo.appendChild(el('p', 'vale-titulo', vale.titulo));
    cuerpo.appendChild(el('p', 'vale-texto', vale.texto));
    if (yaCanjeado) cuerpo.appendChild(el('p', 'vale-estado', 'Canjeado \u2713'));

    const a = el('a', 'boton', yaCanjeado ? 'Enviar de nuevo' : 'Canjear');
    a.href = urlCanje(vale);
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', () => {
      if (!canjeados.includes(vale.id)) {
        canjeados.push(vale.id);
        guardar(K_CANJEADOS, canjeados);
      }
      // Se actualiza un instante después, para no interrumpir la apertura de WhatsApp
      setTimeout(pintarVales, 500);
    });
    cuerpo.appendChild(a);

    caja.appendChild(cuerpo);
    return caja;
  }

  function pintarVales() {
    const lista = q('vales-lista');
    lista.textContent = '';

    // Primero los que ya ganó, luego los misteriosos
    const ordenados = [
      ...VALES.filter(v => ganados.includes(v.id)),
      ...VALES.filter(v => !ganados.includes(v.id))
    ];

    ordenados.forEach(v => {
      const li = el('li');
      if (ganados.includes(v.id)) {
        li.appendChild(crearVale(v));
      } else {
        const caja = el('div', 'vale bloqueado');
        caja.appendChild(el('span', 'vale-emoji', '\uD83D\uDD12'));
        const cuerpo = el('div', 'vale-cuerpo');
        cuerpo.appendChild(el('p', 'vale-titulo', 'Vale misterioso'));
        const nombre = (NIVELES[v.nivel] || {}).nombre || '';
        cuerpo.appendChild(el('p', 'vale-texto', 'Nivel ' + nombre + ' \u00B7 respóndeme bien para descubrirlo'));
        caja.appendChild(cuerpo);
        li.appendChild(caja);
      }
      lista.appendChild(li);
    });

    q('vales-contador').textContent = ganados.length + ' de ' + VALES.length + ' vales ganados';
  }

  /* ---------- Niveles ---------- */
  function pintarNiveles() {
    const cont = q('niveles');
    cont.textContent = '';

    Object.keys(NIVELES).forEach(clave => {
      const n = NIVELES[clave];
      const delNivel = VALES.filter(v => v.nivel === clave);
      const tengo = delNivel.filter(v => ganados.includes(v.id)).length;
      const completo = delNivel.length > 0 && tengo >= delNivel.length;

      const b = el('button', 'nivel-card' + (completo ? ' completo' : ''));
      b.type = 'button';
      b.appendChild(el('span', 'nivel-emoji', n.emoji));

      const info = el('span', 'nivel-info');
      info.appendChild(el('span', 'nivel-nombre', n.nombre));
      info.appendChild(el('span', 'nivel-desc', n.descripcion));
      info.appendChild(el('span', 'nivel-prog',
        completo ? '¡Completado! \uD83D\uDC97' : tengo + ' de ' + delNivel.length + ' vales ganados'));
      b.appendChild(info);

      if (!completo) b.addEventListener('click', () => iniciarQuiz(clave));
      cont.appendChild(b);
    });
  }

  /* ---------- Quiz ---------- */
  const FEED_OK = ['¡Bien!', '¡Esa era!', 'Me conoces \uD83D\uDC97', '¡Exacto!'];
  const FEED_NO = ['Mmm, era la otra…', 'Casi \uD83D\uDE48', 'Uy, esa no era', 'Ay, ya casi'];
  let estado = null;

  function iniciarQuiz(clave) {
    const nivel = NIVELES[clave];
    const pool = PREGUNTAS[clave] || [];
    if (!pool.length) return;

    const n = Math.min(nivel.preguntas, pool.length);
    const preguntas = mezclar(pool).slice(0, n).map(p => ({
      pregunta: p.pregunta,
      opciones: mezclar(p.opciones.map((texto, i) => ({ texto, ok: i === p.correcta })))
    }));

    estado = {
      clave, preguntas,
      i: 0, aciertos: 0,
      minimo: Math.min(nivel.minimo, n),
      respondida: false
    };

    q('quiz-nivel').textContent = nivel.emoji + ' Nivel ' + nivel.nombre;
    mostrar('quiz');
    pintarPregunta();
  }

  function pintarPregunta() {
    const total = estado.preguntas.length;
    const p = estado.preguntas[estado.i];
    estado.respondida = false;

    q('quiz-contador').textContent = 'Pregunta ' + (estado.i + 1) + ' de ' + total;
    q('quiz-progreso').style.width = (estado.i / total * 100) + '%';
    q('quiz-pregunta').textContent = p.pregunta;
    q('quiz-feedback').textContent = '';
    q('quiz-siguiente').hidden = true;

    const cont = q('quiz-opciones');
    cont.textContent = '';
    p.opciones.forEach(o => {
      const b = el('button', 'opcion', o.texto);
      b.type = 'button';
      b.addEventListener('click', () => responder(b, o));
      cont.appendChild(b);
    });
  }

  function responder(boton, opcion) {
    if (estado.respondida) return;
    estado.respondida = true;

    const p = estado.preguntas[estado.i];
    const botones = [...q('quiz-opciones').children];
    p.opciones.forEach((op, k) => { if (op.ok) botones[k].classList.add('correcta'); });

    if (opcion.ok) estado.aciertos++;
    else boton.classList.add('incorrecta');

    q('quiz-feedback').textContent = elegir(opcion.ok ? FEED_OK : FEED_NO);

    const total = estado.preguntas.length;
    const ultima = estado.i === total - 1;
    q('quiz-progreso').style.width = ((estado.i + 1) / total * 100) + '%';

    const sig = q('quiz-siguiente');
    sig.textContent = ultima ? 'Ver resultado' : 'Siguiente';
    sig.hidden = false;
    sig.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  q('quiz-siguiente').addEventListener('click', () => {
    if (!estado || !estado.respondida) return;
    if (estado.i < estado.preguntas.length - 1) {
      estado.i++;
      pintarPregunta();
    } else {
      terminar();
    }
  });

  /* ---------- Resultado ---------- */
  function terminar() {
    const { clave, aciertos, preguntas, minimo } = estado;
    const total = preguntas.length;

    const emoji = q('res-emoji');
    const titulo = q('res-titulo');
    const texto = q('res-texto');
    const cajaVale = q('res-vale');
    const reintentar = q('res-reintentar');
    cajaVale.textContent = '';

    if (aciertos >= minimo) {
      const pendientes = VALES.filter(v => v.nivel === clave && !ganados.includes(v.id));
      emoji.textContent = '\uD83C\uDF89';
      titulo.textContent = '¡Me conoces!';
      reintentar.hidden = true;

      if (pendientes.length) {
        const premio = elegir(pendientes);
        ganados.push(premio.id);
        guardar(K_GANADOS, ganados);
        texto.textContent = 'Acertaste ' + aciertos + ' de ' + total + '. Ganaste un vale:';
        const tarjeta = crearVale(premio);
        tarjeta.classList.add('vale-nuevo');
        cajaVale.appendChild(tarjeta);
        if (typeof lluviaCorazones === 'function') lluviaCorazones();
      } else {
        texto.textContent = 'Acertaste ' + aciertos + ' de ' + total + '. Ya tenías todos los vales de este nivel \uD83D\uDC97';
      }
    } else {
      emoji.textContent = '\uD83D\uDE48';
      titulo.textContent = '¡Casi!';
      texto.textContent = 'Acertaste ' + aciertos + ' de ' + total + ' y necesitabas ' + minimo +
        '. Puedes intentarlo otra vez.';
      reintentar.hidden = false;
      reintentar.onclick = () => iniciarQuiz(clave);
    }

    pintarNiveles();
    pintarVales();
    mostrar('resultado');
  }

  q('res-volver').addEventListener('click', () => mostrar('niveles'));

  /* ---------- Inicio ---------- */
  pintarNiveles();
  pintarVales();
})();