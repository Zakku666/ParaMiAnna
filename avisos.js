// Avisos al celular de Zac con ntfy (https://ntfy.sh).
// Pon aquí el mismo nombre de tema al que te suscribiste en la app.
// Si lo dejas vacío (""), no se envía ningún aviso.
const NTFY_TEMA = "";

// Envía un aviso. Si pasas "clave", se manda una sola vez por esa clave
// (así recargar la página no te llena de notificaciones repetidas).
// Para probar sin ese límite, agrega ?probar al link.
async function avisarZac(texto, clave) {
  if (!NTFY_TEMA) return false;

  const llave = clave ? 'aviso-' + clave : null;
  const probando = new URLSearchParams(location.search).has('probar');

  try {
    if (llave && !probando && localStorage.getItem(llave)) return true;
  } catch (e) {}

  try {
    const r = await fetch('https://ntfy.sh/' + encodeURIComponent(NTFY_TEMA), {
      method: 'POST',
      body: texto
    });
    if (!r.ok) return false;
    if (llave) { try { localStorage.setItem(llave, '1'); } catch (e) {} }
    return true;
  } catch (e) {
    return false;
  }
}