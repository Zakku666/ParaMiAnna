// Tu número de WhatsApp con código de país, sin + ni espacios (Chile: 569XXXXXXXX).
// Si lo dejas vacío (""), WhatsApp le deja elegir el chat.
const WHATSAPP = "56921770879";

// Qué mensaje te llega cuando ella canjea un vale
const MENSAJE_CANJE = vale =>
  "Hola mi amor 💗 Quiero canjear mi vale: " + vale.titulo;

// preguntas = cuántas preguntas tiene cada intento
// minimo    = cuántas debe acertar para ganar el vale
const NIVELES = {
  facil:   { nombre: "Fácil",   emoji: "🌱", descripcion: "Para empezar con cariño",              preguntas: 5, minimo: 3 },
  normal:  { nombre: "Normal",  emoji: "🌿", descripcion: "Aquí hay que conocerme un poquito",    preguntas: 5, minimo: 4 },
  dificil: { nombre: "Difícil", emoji: "🔥", descripcion: "Solo para quien me conoce de verdad",  preguntas: 5, minimo: 4 }
};

const PREGUNTAS = {
  facil: [
    { pregunta: "[Ejemplo] ¿Cuál es mi color favorito?",        opciones: ["Verde", "Azul", "Rojo", "Negro"], correcta: 0 },
    { pregunta: "[Ejemplo] ¿Cuál es tu comida favorita?",       opciones: ["Pizza", "Sushi", "Pasta", "Tacos"], correcta: 1 },
    { pregunta: "[Ejemplo] ¿En qué mes empezamos?",             opciones: ["Agosto", "Septiembre", "Octubre", "Noviembre"], correcta: 1 }
    // ... agrega más
  ],
  normal: [
    { pregunta: "[Ejemplo] ¿Qué película vimos primero juntos?", opciones: ["A", "B", "C", "D"], correcta: 2 },
    { pregunta: "[Ejemplo] ¿Cuál es mi juego favorito?",         opciones: ["A", "B", "C", "D"], correcta: 0 },
    { pregunta: "[Ejemplo] ¿Qué es lo que más me da risa?",      opciones: ["A", "B", "C", "D"], correcta: 3 }
    // ... agrega más
  ],
  dificil: [
    { pregunta: "[Ejemplo] ¿Qué dije la primera vez que hablamos?", opciones: ["A", "B", "C", "D"], correcta: 1 },
    { pregunta: "[Ejemplo] ¿Cuál es mi mayor miedo?",               opciones: ["A", "B", "C", "D"], correcta: 2 },
    { pregunta: "[Ejemplo] ¿Qué lugar sueño conocer?",              opciones: ["A", "B", "C", "D"], correcta: 0 }
    // ... agrega más
  ]
};

// nivel: "facil" | "normal" | "dificil"
const VALES = [
  { id: "f1", nivel: "facil",   emoji: "💌", titulo: "Un audio para ti",            texto: "Vale por un audio mío cantándote o contándote algo bonito." },
  { id: "f2", nivel: "facil",   emoji: "🎵", titulo: "Una canción dedicada",        texto: "Vale por una canción elegida solo para ti, con su razón." },
  { id: "f3", nivel: "facil",   emoji: "🌅", titulo: "Buenos días especiales",      texto: "Vale por un mensaje de buenos días hecho a tu medida." },

  { id: "n1", nivel: "normal",  emoji: "🎬", titulo: "Noche de películas",          texto: "Vale por una noche de películas, y tú eliges todo." },
  { id: "n2", nivel: "normal",  emoji: "🍫", titulo: "Antojo cumplido",             texto: "Vale por ese antojo que se te ocurra, sin preguntas." },
  { id: "n3", nivel: "normal",  emoji: "🎨", titulo: "Un dibujo hecho por mí",      texto: "Vale por un dibujo hecho a mano, aunque me quede feo." },

  { id: "d1", nivel: "dificil", emoji: "🎁", titulo: "Regalo sorpresa",             texto: "Vale por un regalo sorpresa que ya estoy pensando." },
  { id: "d2", nivel: "dificil", emoji: "🌟", titulo: "Un día a tu manera",          texto: "Vale por un día completo con los planes que tú elijas." },
  { id: "d3", nivel: "dificil", emoji: "💍", titulo: "Una cita inolvidable",        texto: "Vale por una cita planeada con todo mi cariño." }
];