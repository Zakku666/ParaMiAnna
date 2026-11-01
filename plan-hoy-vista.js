(() => {
  const q = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const tipo = params.get('tipo') === 'hot' ? 'hot' : 'romantico';

  if (typeof PLANES_HOY === 'undefined' || !PLANES_HOY[tipo] || !PLANES_HOY[tipo].length) return;

  const lista = PLANES_HOY[tipo];
  const N = lista.length;
  const esHot = tipo === 'hot';
  const nombreTipo = esHot ? 'plan hot' : 'plan romántico';

  // Fecha de hoy (para probar otro día: ?fecha=2026-12-01)
  function ahora() {
    const d = new Date();
    const f = (params.get('fecha') || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (f) d.setFullYear(+f[1], +f[2] - 1, +f[3]);
    return d;
  }

  const hoy = ahora();
  const fechaISO = hoy.getFullYear() + '-' +
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoy.getDate()).padStart(2, '0');
  const diaNumero = Math.floor(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) / 86400000);

  /* ---------- Qué plan toca hoy ---------- */
  // Generador de números aleatorios con semilla: el mismo día da siempre el mismo resultado
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Cada "ciclo" de N días recorre todos los planes una vez, en un orden mezclado
  function ordenDelCiclo(ciclo) {
    const rnd = mulberry32(ciclo * 7919 + (esHot ? 104729 : 15485863));
    const a = [...Array(N).keys()];
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function indiceDeHoy() {
    const ciclo = Math.floor(diaNumero / N);
    const pos = diaNumero % N;
    const orden = ordenDelCiclo(ciclo);
    // Evita que el último plan de un ciclo se repita como primero del siguiente
    if (N > 2 && ciclo > 0) {
      const previo = ordenDelCiclo(ciclo - 1);
      if (orden[0] === previo[N - 1]) [orden[0], orden[1]] = [orden[1], orden[0]];
    }
    return orden[pos];
  }

  const indice = indiceDeHoy();
  const plan = lista[indice];

  /* ---------- Pantalla ---------- */
  q('ph-titulo').textContent = esHot ? 'Plan hot de hoy 🔥' : 'Plan romántico de hoy 💌';
  document.title = esHot ? 'Plan hot de hoy' : 'Plan romántico de hoy';
  q('ph-fecha').textContent = hoy
    .toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^./, c => c.toUpperCase());
  q('ph-nombre').textContent = plan.titulo;
  q('ph-desc').textContent = plan.texto;
  q('ph-manana').textContent = 'Mañana habrá un plan nuevo ✨';

  // Foto (o emoji si no hay imagen)
  const foto = q('ph-foto');
  const ph = document.createElement('div');
  ph.className = 'plan-ph';
  ph.textContent = plan.emoji || (esHot ? '🔥' : '💌');
  foto.appendChild(ph);
  if (plan.imagen) {
    const img = new Image();
    img.alt = plan.titulo;
    img.className = 'plan-img';
    img.onload = () => { if (ph.parentNode === foto) foto.replaceChild(img, ph); };
    img.src = plan.imagen;
  }

  const puerta = q('ph-puerta');
  const articulo = q('ph-plan');

  function mostrarPlan() {
    puerta.hidden = true;
    articulo.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => articulo.classList.remove('cambiando')));
  }

  if (esHot) {
    puerta.hidden = false;
    q('ph-ver').addEventListener('click', mostrarPlan);
  } else {
    mostrarPlan();
  }

  /* ---------- Avisos a Zac ---------- */
  const avisosActivos = (typeof NTFY_TEMA !== 'undefined' && NTFY_TEMA && typeof avisarZac === 'function');

  if (!avisosActivos) {
    q('ph-respuestas').hidden = true;
    q('ph-transparente').hidden = true;
  } else {
    // Cuando ella entra (una vez al día por tipo de plan)
    avisarZac((esHot ? '🔥 Entró al plan hot de hoy' : '💌 Entró al plan romántico de hoy'),
              'ph-' + fechaISO + '-' + tipo);
  }

  function responder(clave, mensaje, textoOk) {
    const estado = q('ph-estado');
    estado.textContent = 'Enviando…';
    avisarZac(mensaje, 'ph-' + fechaISO + '-' + tipo + '-' + clave).then(ok => {
      estado.textContent = ok ? textoOk : 'No pude avisarle desde aquí. Cuéntale tú 🙈';
    });
    if (clave === 'si' && typeof lluviaCorazones === 'function') lluviaCorazones();
  }

  q('ph-si').addEventListener('click', () => responder(
    'si',
    '💗 Se apuntó al ' + nombreTipo + ' de hoy (plan N° ' + (indice + 1) + ')',
    '¡Perfecto! Ya le avisé a Zac 💗'
  ));
  q('ph-no').addEventListener('click', () => responder(
    'no',
    '🙈 Pidió otro día para el ' + nombreTipo + ' de hoy (plan N° ' + (indice + 1) + ')',
    'Está bien, otro día entonces. Ya le avisé 🙈'
  ));
})();