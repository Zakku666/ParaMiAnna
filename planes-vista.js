(() => {
  const q = id => document.getElementById(id);

  const tarjeta  = q('plan');
  const foto     = q('plan-foto');
  const titulo   = q('plan-titulo');
  const desc     = q('plan-desc');
  const btn      = q('otro-plan');
  const progreso = q('plan-progreso');
  if (!tarjeta || typeof PLANES === 'undefined' || !PLANES.length) return;

  const CLAVE = 'planes-vistos';
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esperar = ms => new Promise(r => setTimeout(r, ms));

  let vistos = [];
  try {
    vistos = (JSON.parse(localStorage.getItem(CLAVE)) || [])
      .filter(i => Number.isInteger(i) && i < PLANES.length);
  } catch (e) {}

  let ultimo = vistos.length ? vistos[vistos.length - 1] : -1;
  let ocupado = false;

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(vistos)); } catch (e) {}
  }

  // Elige entre los planes que aún no ha visto; si ya vio todos, empieza otra ronda
  function elegir() {
    const todos = PLANES.map((_, i) => i);
    let pendientes = todos.filter(i => !vistos.includes(i));
    if (pendientes.length === 0) {
      vistos = [];
      pendientes = todos.filter(i => i !== ultimo);
      if (pendientes.length === 0) pendientes = todos;
    }
    return pendientes[Math.floor(Math.random() * pendientes.length)];
  }

  // Espera a que la foto cargue (o falle) antes de mostrar el plan
  function cargarImagen(plan) {
    return new Promise(resolve => {
      if (!plan.imagen) { resolve(null); return; }
      const img = new Image();
      img.alt = plan.titulo;
      img.onload  = () => resolve(img);
      img.onerror = () => resolve(null);
      setTimeout(() => resolve(null), 4000);
      img.src = plan.imagen;
    });
  }

  function armarMarco(plan, img) {
    foto.textContent = '';
    if (img) {
      img.className = 'plan-img';
      foto.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'plan-ph';
      ph.textContent = plan.emoji || '\u2665';
      foto.appendChild(ph);
    }
    if (plan.lugar) {
      const cap = document.createElement('figcaption');
      cap.textContent = plan.lugar;
      foto.appendChild(cap);
    }
  }

  async function mostrar() {
    if (ocupado) return;
    ocupado = true;

    const i = elegir();
    ultimo = i;
    vistos.push(i);
    guardar();
    const plan = PLANES[i];

    tarjeta.classList.add('cambiando');
    const [img] = await Promise.all([
      cargarImagen(plan),
      esperar(reducido ? 0 : 350)
    ]);

    armarMarco(plan, img);
    titulo.textContent = plan.titulo;
    desc.textContent   = plan.texto;
    tarjeta.classList.toggle('especial', !!plan.especial);
    progreso.textContent = vistos.length + ' de ' + PLANES.length + ' planes descubiertos';
    btn.textContent = 'Otro plan';

    tarjeta.classList.remove('cambiando');
    if (plan.especial && typeof lluviaCorazones === 'function') lluviaCorazones();
    ocupado = false;
  }

  btn.addEventListener('click', mostrar);
  mostrar(); // al entrar, ya muestra un plan
})();