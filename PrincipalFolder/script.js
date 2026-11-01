/* ===== UTILIDADES ===== */
const $ = id => document.getElementById(id);
const dos = n => String(n).padStart(2, '0');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sinAnimaciones = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function poner(id, valor) {
  const nodo = $(id);
  if (nodo) nodo.textContent = valor;
}

/* ===== CONTADOR ===== */
// Cambia por el día exacto: new Date(año, mes - 1, día, hora, minuto)
// En JavaScript los meses empiezan en 0 (enero = 0, septiembre = 8).
const INICIO = new Date(2020, 8, 1, 0, 0, 0);

function diferencia(desde, hasta) {
  let anios = hasta.getFullYear() - desde.getFullYear();
  let meses = hasta.getMonth()    - desde.getMonth();
  let dias  = hasta.getDate()     - desde.getDate();
  let horas = hasta.getHours()    - desde.getHours();
  let min   = hasta.getMinutes()  - desde.getMinutes();
  let seg   = hasta.getSeconds()  - desde.getSeconds();

  if (seg < 0)   { seg  += 60; min--; }
  if (min < 0)   { min  += 60; horas--; }
  if (horas < 0) { horas += 24; dias--; }
  if (dias < 0) {
    dias += new Date(hasta.getFullYear(), hasta.getMonth(), 0).getDate();
    meses--;
  }
  if (meses < 0) { meses += 12; anios--; }

  return { anios, meses, dias, horas, min, seg };
}

function actualizarContador() {
  const ahora = new Date();
  const d = diferencia(INICIO, ahora);

  poner('anios', d.anios);
  poner('meses', d.meses);
  poner('dias',  dos(d.dias));
  poner('horas', dos(d.horas));
  poner('min',   dos(d.min));
  poner('seg',   dos(d.seg));

  const ms = Math.max(0, ahora - INICIO);
  poner('total-dias', Math.floor(ms / 86400000).toLocaleString('es-CL'));
  poner('total-seg',  Math.floor(ms / 1000).toLocaleString('es-CL'));
}

actualizarContador();
setInterval(actualizarContador, 1000);

/* ===== CARTA ===== */
const btnCarta  = $('btn-carta');
const sobreWrap = $('sobre-wrap');
const carta     = $('carta');
let cartaAbierta = false;

// Mantiene el cursor de escritura a la vista mientras baja el texto
function seguir(parrafo) {
  const pluma = parrafo.querySelector('.pluma');
  if (!pluma) return;
  const r = pluma.getBoundingClientRect();
  if (r.bottom > window.innerHeight * 0.78) {
    window.scrollBy({ top: r.bottom - window.innerHeight * 0.55, behavior: 'smooth' });
  }
}

async function escribirCarta(parrafos, textos) {
  for (let k = 0; k < parrafos.length; k++) {
    const p = parrafos[k];
    const t = textos[k];
    let i = 0;
    let n = 0;

    while (i < t.length) {
      // Si hay una etiqueta (como <br>), se agrega completa de una vez
      if (t[i] === '<') { i = t.indexOf('>', i) + 1; continue; }
      i++; n++;

      // Lo escrito + cursor + el resto invisible (así el papel no "salta" de tamaño)
      p.innerHTML = t.slice(0, i)
        + '<span class="pluma"></span>'
        + '<span class="resto">' + t.slice(i) + '</span>';

      if (n % 25 === 0) seguir(p);

      const c = t[i - 1];
      let espera = 40 + Math.random() * 35;
      if ('.!?'.includes(c)) espera += 420;
      else if (',;:'.includes(c)) espera += 180;
      await sleep(espera);
    }

    // Párrafo terminado: texto limpio, sin cursor
    p.innerHTML = t;
    if (k < parrafos.length - 1) await sleep(700);
  }
}

async function abrirCarta() {
  if (cartaAbierta) return;
  cartaAbierta = true;
  btnCarta.setAttribute('aria-expanded', 'true');

  const parrafos = [...carta.querySelectorAll('p')];
  const textos = parrafos.map(p => p.innerHTML);

  // Sin animaciones: se muestra la carta completa de una vez
  if (sinAnimaciones) {
    sobreWrap.classList.add('guardado');
    carta.hidden = false;
    return;
  }

  // Reserva el espacio final del texto (todo invisible) antes de mostrar el papel
  parrafos.forEach((p, i) => {
    p.innerHTML = '<span class="resto">' + textos[i] + '</span>';
  });

  btnCarta.classList.add('abierto');          // se abre la solapa
  await sleep(900);

  sobreWrap.classList.add('guardado');        // el sobre se guarda
  carta.hidden = false;
  carta.classList.add('desplegada');          // el papel se despliega
  await sleep(500);
  carta.scrollIntoView({ behavior: 'smooth', block: 'start' });
  await sleep(1000);

  await escribirCarta(parrafos, textos);      // y se escribe poco a poco
}

if (btnCarta && carta) btnCarta.addEventListener('click', abrirCarta);

/* ===== RAZONES ===== */
const cajaRazon   = $('razon-caja');
const elRazon     = $('razon');
const elNum       = $('razon-num');
const btnRazon    = $('otra-razon');
const elProgreso  = $('razon-progreso');
const CLAVE_VISTAS = 'razones-vistas';

let vistas = [];
try {
  const guardadas = JSON.parse(localStorage.getItem(CLAVE_VISTAS)) || [];
  vistas = guardadas.filter(i => Number.isInteger(i) && i < RAZONES.length);
} catch (e) { /* si no hay almacenamiento, sigue funcionando igual */ }

let ultima = vistas.length ? vistas[vistas.length - 1] : -1;
let cambiando = false;

function guardarVistas() {
  try { localStorage.setItem(CLAVE_VISTAS, JSON.stringify(vistas)); } catch (e) {}
}

// Elige al azar entre las que aún no ha visto; si ya vio todas, empieza otra ronda
function elegirRazon() {
  const todas = RAZONES.map((_, i) => i);
  let pendientes = todas.filter(i => !vistas.includes(i));

  if (pendientes.length === 0) {
    vistas = [];
    pendientes = todas.filter(i => i !== ultima); // evita repetir la última justo al reiniciar
    if (pendientes.length === 0) pendientes = todas;
  }
  return pendientes[Math.floor(Math.random() * pendientes.length)];
}

async function mostrarRazon() {
  if (cambiando || !RAZONES.length) return;
  cambiando = true;

  const i = elegirRazon();
  ultima = i;
  vistas.push(i);
  guardarVistas();

  cajaRazon.classList.add('cambiando');
  await sleep(sinAnimaciones ? 0 : 300);

  elNum.textContent = 'Razón N° ' + (i + 1);
  elRazon.textContent = RAZONES[i];
  elProgreso.textContent = vistas.length + ' de ' + RAZONES.length + ' descubiertas';
  btnRazon.textContent = 'Otra razón';

  cajaRazon.classList.remove('cambiando');
  cambiando = false;
}

if (btnRazon && cajaRazon && typeof RAZONES !== 'undefined') {
  btnRazon.addEventListener('click', mostrarRazon);
}

/* ===== ÁBREME CUANDO ===== */
const contSobres  = $('sobres');
const modal       = $('modal');
const modalTitulo = $('modal-titulo');
const modalTexto  = $('modal-texto');
const CLAVE_LEIDOS = 'sobres-leidos';

let leidos = [];
try { leidos = JSON.parse(localStorage.getItem(CLAVE_LEIDOS)) || []; } catch (e) {}

const ultimoMensaje = {};   // para no repetir el mismo mensaje dos veces seguidas
let botonAbierto = null;    // para devolver el foco al cerrar
let timerModal = null;

function guardarLeidos() {
  try { localStorage.setItem(CLAVE_LEIDOS, JSON.stringify(leidos)); } catch (e) {}
}

function elegirMensaje(sobre) {
  const m = sobre.mensajes;
  if (m.length === 1) return m[0];
  let i;
  do { i = Math.floor(Math.random() * m.length); } while (i === ultimoMensaje[sobre.titulo]);
  ultimoMensaje[sobre.titulo] = i;
  return m[i];
}

function abrirSobre(sobre, boton) {
  clearTimeout(timerModal);
  modalTitulo.textContent = 'Ábreme cuando ' + sobre.titulo + '…';
  modalTexto.textContent  = elegirMensaje(sobre);

  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('visible'));
  document.body.classList.add('modal-abierto');
  botonAbierto = boton;
  $('modal-cerrar').focus();

  if (!leidos.includes(sobre.titulo)) {
    leidos.push(sobre.titulo);
    guardarLeidos();
  }
  boton.classList.add('leido');
}

function cerrarModal() {
  modal.classList.remove('visible');
  document.body.classList.remove('modal-abierto');
  timerModal = setTimeout(() => { modal.hidden = true; }, sinAnimaciones ? 0 : 350);
  if (botonAbierto) botonAbierto.focus();
}

function crearSobres() {
  SOBRES.forEach(sobre => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sobre';
    b.textContent = sobre.titulo;
    if (leidos.includes(sobre.titulo)) b.classList.add('leido');
    b.addEventListener('click', () => abrirSobre(sobre, b));
    contSobres.appendChild(b);
  });
}

if (contSobres && modal && typeof SOBRES !== 'undefined') {
  crearSobres();
  $('modal-cerrar').addEventListener('click', cerrarModal);
  $('modal-fondo').addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
  });
}

/* ===== PREGUNTA FINAL ===== */
const respuestas  = $('respuestas');
const btnSi       = $('si');
const btnNo       = $('no');
const avisoFinal  = $('respuesta-final');
const mensajeSi   = $('mensaje-si');
const capaCorazones = $('corazones');

// Cada intento de tocar "No": lo que dice el botón y la frase de abajo
const PASOS = [
  { boton: '¿Segura?',  aviso: 'Mmm… ese botón se mueve solo jsjs' },
  { boton: 'Piénsalo',  aviso: 'Piénsalo bien…' },
  { boton: 'Jsjs no',   aviso: 'Cada vez te cuesta más, ¿no?' },
  { boton: 'Imposible', aviso: 'Ese botón no quiere que lo toques' },
  { boton: 'Casi…',     aviso: 'Se está cansando de correr' },
  { boton: 'Bueno…',    aviso: 'Uy, quedó agotado' },
];

let intentos = 0;
let rendido = false;
let respondido = false;
let ultimoSalto = 0;

// Busca un lugar del área donde el "No" no quede encima del "Sí"
function posicionLibre() {
  const c = respuestas.getBoundingClientRect();
  const w = btnNo.offsetWidth;
  const h = btnNo.offsetHeight;
  const s = btnSi.getBoundingClientRect();
  const actualX = btnNo.offsetLeft;
  const actualY = btnNo.offsetTop;
  const margen = 14;
  let respaldo = null;

  for (let k = 0; k < 40; k++) {
    const x = Math.random() * Math.max(0, c.width - w);
    const y = Math.random() * Math.max(0, c.height - h);
    const l = c.left + x;
    const t = c.top + y;
    const choca = l < s.right + margen && l + w > s.left - margen &&
                  t < s.bottom + margen && t + h > s.top - margen;
    const lejos = Math.hypot(x - actualX, y - actualY) > 90;

    if (!choca && lejos) return { x, y };
    if (!choca && !respaldo) respaldo = { x, y };
  }
  return respaldo || { x: Math.random() * Math.max(0, c.width - w), y: c.height - h };
}

function huir() {
  const ahora = Date.now();
  if (rendido || respondido || ahora - ultimoSalto < 200) return;
  ultimoSalto = ahora;
  intentos++;

  const paso = PASOS[intentos - 1];
  btnNo.textContent = paso.boton;
  avisoFinal.textContent = paso.aviso;
  btnSi.style.setProperty('--escala', Math.min(1.5, 1 + 0.09 * intentos));

  const p = posicionLibre();
  btnNo.style.left = p.x + 'px';
  btnNo.style.top  = p.y + 'px';

  if (intentos === PASOS.length) setTimeout(rendirse, 1000);
}

// El "No" se cansa, se queda quieto y se convierte en otro "Sí"
function rendirse() {
  if (respondido) return;
  rendido = true;
  btnNo.textContent = 'Está bien, sí 💗';
  btnNo.classList.add('rendido');
  avisoFinal.textContent = 'Ya, hasta él se rindió jsjs';
  btnNo.style.left = ((respuestas.clientWidth - btnNo.offsetWidth) / 2) + 'px';
  btnNo.style.top  = (respuestas.clientHeight - btnNo.offsetHeight - 6) + 'px';
}

function lluviaCorazones() {
  if (sinAnimaciones) return;
  const colores = ['#eaa9a6', '#f4c06f', '#f6f1de', '#c9605c'];
  for (let i = 0; i < 45; i++) {
    const h = document.createElement('span');
    h.textContent = '\u2665';
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (14 + Math.random() * 26) + 'px';
    h.style.color = colores[Math.floor(Math.random() * colores.length)];
    h.style.animationDuration = (4 + Math.random() * 4) + 's';
    h.style.animationDelay = (Math.random() * 2.5) + 's';
    h.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
    h.addEventListener('animationend', () => h.remove());
    capaCorazones.appendChild(h);
  }
}

function decirSi() {
  if (respondido) return;
  respondido = true;

  respuestas.classList.add('oculto');
  avisoFinal.textContent = '';

  const dias = Math.max(0, Math.floor((Date.now() - INICIO) / 86400000));
  poner('dias-final', dias.toLocaleString('es-CL'));

  mensajeSi.hidden = false;
  requestAnimationFrame(() => mensajeSi.classList.add('visible'));
  lluviaCorazones();
  setTimeout(() => mensajeSi.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
}

if (btnSi && btnNo && respuestas) {
  btnSi.addEventListener('click', decirSi);

  // Celular: salta apenas lo tocan. Computador: salta cuando el mouse se acerca.
  btnNo.addEventListener('pointerdown', e => { if (!rendido) { e.preventDefault(); huir(); } });
  btnNo.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') huir(); });
  // Teclado (Enter) o, cuando ya se rindió, cuenta como "sí"
  btnNo.addEventListener('click', () => { rendido ? decirSi() : huir(); });
}

/* ===== FONDO CAMBIANTE ===== */
const azar = (a, b) => a + Math.random() * (b - a);

// n = cantidad de partículas, s = tamaño (px), t = duración (s),
// dx = desvío lateral (px), y = altura (%), meta = color de la barra del navegador
const TEMAS = {
  bosque:    { meta: '#14232b', n: 16, s: [5, 9],    t: [9, 14] },
  estrellas: { meta: '#0b1026', n: 60, s: [1.5, 4],  t: [2.5, 6], y: [0, 100], fugaces: 3 },
  sakura:    { meta: '#2a1a30', n: 26, s: [12, 22],  t: [9, 15],  dx: [-70, 70] },
  lluvia:    { meta: '#0e1b22', n: 70, s: [14, 32],  t: [0.8, 1.5] },
  mar:       { meta: '#06202e', n: 22, s: [8, 34],   t: [8, 15],  dx: [-40, 40] },
  aurora:    { meta: '#0a1a24', n: 4,  s: [1, 1],    t: [14, 22], y: [-10, 50],
               colores: ['#4fd1a5', '#7a6cf0', '#3fa7d6', '#e17aa5'] }
};

function montarFondo(nombre) {
  const tema = TEMAS[nombre];
  const capa = $('particulas');
  if (!tema || !capa) return;

  document.body.dataset.tema = nombre;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = tema.meta;

  capa.textContent = '';
  for (let i = 0; i < tema.n; i++) {
    const el = document.createElement('i');
    const dur = azar(tema.t[0], tema.t[1]);
    el.style.setProperty('--x', azar(2, 98) + '%');
    el.style.setProperty('--s', azar(tema.s[0], tema.s[1]) + 'px');
    el.style.setProperty('--t', dur + 's');
    el.style.setProperty('--d', (-Math.random() * dur) + 's'); // arrancan ya en movimiento
    if (tema.dx) el.style.setProperty('--dx', azar(tema.dx[0], tema.dx[1]) + 'px');
    if (tema.y) el.style.setProperty('--y', azar(tema.y[0], tema.y[1]) + '%');
    if (tema.colores) el.style.setProperty('--c', tema.colores[i % tema.colores.length]);
    capa.appendChild(el);
  }

  // Estrellas fugaces
  for (let k = 0; k < (tema.fugaces || 0); k++) {
    const el = document.createElement('i');
    const dur = azar(7, 12);
    el.className = 'fugaz';
    el.style.setProperty('--x', azar(5, 55) + '%');
    el.style.setProperty('--y', azar(2, 35) + '%');
    el.style.setProperty('--t', dur + 's');
    el.style.setProperty('--d', (-Math.random() * dur) + 's');
    capa.appendChild(el);
  }
}

// Elige el tema: no repite hasta que haya visto todos
function elegirTema() {
  const nombres = Object.keys(TEMAS);

  // Para probar: index.html?tema=lluvia
  const forzado = new URLSearchParams(location.search).get('tema');
  if (forzado && TEMAS[forzado]) return forzado;

  let vistos = [];
  try {
    vistos = (JSON.parse(localStorage.getItem('temas-vistos')) || []).filter(n => TEMAS[n]);
  } catch (e) {}

  let pendientes = nombres.filter(n => !vistos.includes(n));
  if (pendientes.length === 0) {
    const ultimo = vistos[vistos.length - 1];
    vistos = [];
    pendientes = nombres.filter(n => n !== ultimo);
  }

  const elegido = pendientes[Math.floor(Math.random() * pendientes.length)];
  vistos.push(elegido);
  try { localStorage.setItem('temas-vistos', JSON.stringify(vistos)); } catch (e) {}
  return elegido;
}

montarFondo(elegirTema());

/* ===== CARTA QUE CAMBIA ===== */
const CLAVE_CARTAS = 'cartas-vistas';
let cartasVistas = [];
try {
  cartasVistas = (JSON.parse(localStorage.getItem(CLAVE_CARTAS)) || []).filter(i => Number.isInteger(i));
} catch (e) {}
let cartaElegida = -1;

// Elige entre las cartas que aún no ha leído; si ya leyó todas, empieza otra ronda
function elegirCarta() {
  const todas = CARTAS.map((_, i) => i);
  const leidas = cartasVistas.filter(i => i < CARTAS.length);
  let pendientes = todas.filter(i => !leidas.includes(i));

  if (pendientes.length === 0) {
    const ultima = leidas[leidas.length - 1];
    pendientes = todas.filter(i => i !== ultima);
    if (pendientes.length === 0) pendientes = todas;
  }
  return pendientes[Math.floor(Math.random() * pendientes.length)];
}

// Arma el papel con la carta elegida (el texto queda listo para el efecto de escritura)
function montarCarta() {
  if (!carta || typeof CARTAS === 'undefined' || !CARTAS.length) return;
  cartaElegida = elegirCarta();
  const c = CARTAS[cartaElegida];

  carta.textContent = '';

  const saludo = document.createElement('p');
  saludo.className = 'saludo';
  saludo.textContent = c.saludo;
  carta.appendChild(saludo);

  c.parrafos.forEach(texto => {
    const p = document.createElement('p');
    p.textContent = texto;
    carta.appendChild(p);
  });

  const firma = document.createElement('p');
  firma.className = 'firma';
  c.firma.split('\n').forEach((linea, k) => {
    if (k) firma.appendChild(document.createElement('br'));
    firma.appendChild(document.createTextNode(linea));
  });
  carta.appendChild(firma);
}

// Se marca como leída recién cuando ella abre el sobre
function marcarCartaLeida() {
  if (cartaElegida < 0) return;
  let leidas = cartasVistas.filter(i => i < CARTAS.length);
  if (leidas.length >= CARTAS.length) leidas = []; // ya las leyó todas: nueva ronda
  if (!leidas.includes(cartaElegida)) leidas.push(cartaElegida);
  cartasVistas = leidas;
  try { localStorage.setItem(CLAVE_CARTAS, JSON.stringify(leidas)); } catch (e) {}
}

montarCarta();
if (btnCarta) btnCarta.addEventListener('click', marcarCartaLeida);