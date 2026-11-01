const SOBRES = [
  {
    titulo: "estés triste",
    mensajes: [
      "Ven acá mi amor, si pudiera estaría abrazándote ahora mismo y no te soltaría hasta que te sintieras un poquito mejor",
      "No tienes que fingir que estás bien conmigo, puedes contarme lo que te pasa o simplemente quedarte aquí conmigo",
      "Ojalá pudiera aparecer a tu lado y llenarte de besitos hasta sacarte aunque sea una pequeña sonrisa",
      "Sé que hay días en los que todo pesa más de lo normal, no te exijas tanto hoy mi niña",
      "Quisiera poder quitarte un poquito de eso que te está haciendo sentir mal, mientras tanto aquí estoy para escucharte",
      "No sé exactamente qué pasó pero no tienes que guardártelo todo, cuéntame que quiero saber cómo estás",
      "Te mando un abrazo enorme de esos que empiezan suavecito y terminan con un apretón porque no quiero soltarte",
      "Hoy no tienes que estar de buen humor ni hacer bromas si no te nace, también puedes tener un día malo y dejarte cuidar",
      "Si no tienes ganas de hablar tampoco pasa nada, podemos quedarnos juntitos sin decir nada por un ratito",
      "Quiero que recuerdes que un mal día no significa que todo esté saliendo mal, mañana puede ser diferente",
      "Mi amor no te voy a pedir que sonrías si no te nace, solamente quiero que sepas que estoy aquí",
      "Ojalá pudiera darte un besito en la frente y decirte que por ahora dejes de preocuparte por todo",
      "Nunca pienses que eres una molestia por contarme lo que te pasa, quiero que puedas confiar en mí también en tus días difíciles",
      "Si pudiera te prepararía algo rico, te acomodaría entre mis brazos y dejaría que descansaras un poquito",
      "Te quiero incluso en esos días en los que tú misma no tienes muchas ganas de ti, no tienes que demostrarme nada"
    ]
  },
  {
    titulo: "estés feliz",
    mensajes: [
      "Y ESA FELICIDAD JAJAJA ahora me cuentas absolutamente todo, no acepto un resumen de dos palabras",
      "Me encanta saber que estás teniendo un buen día, disfrútalo muchísimo mi amor que te lo mereces",
      "Quisiera estar ahí para verte sonreír y darte un beso cada vez que te rías",
      "Guárdate este momentito para recordarlo después, también hay días muy bonitos y quiero que disfrutes cada uno de ellos",
      "JAJAJA seguro tienes una cara de felicidad que no te la quita nadie, me alegra muchísimo por ti",
      "Si estás feliz yo quiero enterarme, así que ve preparando el chisme porque quiero saberlo todo",
      "Hoy te toca disfrutar y dejar de preocuparte por tantas cosas, ya habrá tiempo para pensar en lo demás",
      "Me encanta cuando me cuentas cosas emocionada, aunque no entienda la mitad al principio quiero escucharte",
      "Ven que te doy un besito de celebración, bueno mejor varios porque uno solo me parece muy poco",
      "Espero que esta felicidad te dure muchísimo y si puedo aportar aunque sea un poquito mejor todavía",
      "Quiero saber qué pasó y todos los detalles, no te saltes ninguna parte porque después tengo preguntas",
      "Qué bonito que algo te haya alegrado el día, ojalá pudiera estar ahí para celebrarlo contigo",
      "Hoy nada de estar preocupándote por cosas que pueden esperar, disfruta tu momento mi vida",
      "Disfruta mucho y no minimices las cosas buenas que te pasan, incluso las más pequeñitas",
      "Me alegra que estés feliz Bianca, ahora ven que tienes muchos besitos pendientes"
    ]
  },
  {
    titulo: "estés enojada",
    mensajes: [
      "Bueno primero respira señorita, no quiero que termines peleándote hasta con las paredes JAJAJA",
      "Si algo te molestó tienes derecho a sentirte así, no voy a decirte que no te enojes",
      "Cuéntame qué pasó cuando quieras, prometo escucharte antes de empezar a darte opiniones que nadie me pidió",
      "Si necesitas desahogarte hazlo, no tienes que guardarte todo para parecer tranquila",
      "Te daría un abrazo aunque probablemente me mandarías a volar si estás muy enojada JAJAJA",
      "No tienes que decidir nada ahora mismo, date un ratito para ti y después ves qué quieres hacer",
      "Quién hizo enojar a mi mujer, necesito una explicación JAJAJA mentira primero cuéntame qué pasó",
      "A veces lo mejor es alejarse un momento y recuperar la calma, no tienes que solucionar todo ahora",
      "Aunque estés de malas puedes venir a hablar conmigo, no necesitas estar de buen humor para que quiera escucharte",
      "Si necesitas espacio te lo doy, pero quiero que sepas que me sigue importando lo que te pasa",
      "Ojalá pudiera darte un besito en la frente y ayudarte a soltar un poquito esa rabia",
      "No quiero que sientas que tienes que estar de acuerdo conmigo en todo, también quiero entender cuando algo te molesta",
      "Tómate tu tiempo mi amor, no hay ninguna competencia por ver quién se calma primero",
      "Si pudiera estaría ahí para abrazarte aunque me toque recibir alguna mirada asesina JAJAJA",
      "Cuando estés más tranquila me cuentas todo y si todavía quieres quejarte un ratito también te escucho"
    ]
  },
  {
    titulo: "estés aburrida",
    mensajes: [
      "A ver tienes cinco segundos para inventar una estupidez y yo tengo que seguirte el juego, empieza",
      "Vamos a jugar, dime un objeto de la casa y te diré qué creo que serías tú, pero no puedes responder vibrador otra vez JAJAJA",
      "Te reto a pensar en una comida que nos represente como pareja, pero intenta elegir algo que no me dé hambre",
      "Cuéntame tres cosas que tengas cerca y yo voy a inventar una historia absurda con ellas",
      "Tengo una pregunta importante, si fueras un animal durante un día seguirías siendo una suricata o cambiarías de especie",
      "Ve a escuchar una canción que te guste y después me dices qué parte te gusta más, quiero conocer tu selección musical",
      "Inventemos nombres ridículos para una futura mascota, nuestra familia de animalitos necesita organización",
      "Hoy podríamos hacer un juego de preguntas, pero esta vez prometo intentar no responder puras tonterías, no prometo nada",
      "Imagínate que tenemos que abrir un restaurante juntos, qué venderíamos, yo digo que burritos y fideos con carne",
      "Te mando un beso y si sigues aburrida te mando otro, así hasta que tengas que pedirme que pare",
      "Mira a tu alrededor y busca algo que se parezca a mí, espero que no encuentres un trapeador al revés",
      "Quiero que me cuentes la cosa más random que se te haya pasado por la cabeza hoy, no tiene que tener sentido",
      "Hagamos un ranking de animales más bonitos y comidas más ricas, aunque seguramente terminaremos discutiendo por las respuestas",
      "Si estuviera contigo ahora mismo probablemente estaría molestándote, intentando abrazarte y preguntando si me das permiso de comerte a besos",
      "No sé qué hacer para quitarte el aburrimiento pero puedo ofrecerte compañía, preguntas absurdas y muchos besitos"
    ]
  },
  {
    titulo: "me extrañes",
    mensajes: [
      "Yo también te extraño mi amor, ojalá pudiera cruzar la pantalla y darte ese abrazo que nos debemos",
      "Quisiera estar a tu lado ahora mismo aunque fuera solamente para hacer absolutamente nada contigo",
      "Cierra los ojitos un momento e imagina que estoy abrazándote por detrás y dándote un besito en la mejilla",
      "Me hace falta poder tenerte cerquita y no solamente imaginar que te tengo entre mis brazos",
      "Si pudiera aparecer ahí ahora mismo lo primero que haría sería abrazarte y después llenarte de besos",
      "No importa cuánta distancia haya, siempre puedes venir a buscar un poquito de cariño conmigo",
      "Te mando un abrazo tan grande que espero que puedas sentirlo aunque sea a través de esta pantallita",
      "Algún día no tendremos que despedirnos solamente con mensajes, mientras tanto guardemos todos esos besos pendientes",
      "Me gustaría estar a tu lado hasta para hacer nada, solamente compartir el mismo espacio contigo",
      "Imagínate que estoy sentado a tu lado y te pregunto si me das permiso de comerte a besos",
      "No te imaginas las ganas que tengo de que todos nuestros abrazos imaginarios se vuelvan reales",
      "Si me extrañas mucho ven a buscarme, siempre voy a tener un ratito para ti",
      "Quiero que sepas que no eres la única que piensa en lo bonito que sería tener al otro cerquita",
      "Te guardo un abrazo, dos besitos y muchísimo tiempo que algún día podremos compartir sin mirar el reloj",
      "Te extraño Bianca y cuando por fin pueda abrazarte probablemente no voy a querer soltarte"
    ]
  },
  {
    titulo: "no puedas dormir",
    mensajes: [
      "A ver acomódate bien, cierra los ojitos y deja de pelearte con la almohada, no vas a ganar esa batalla JAJAJA",
      "Cuenta hojitas de Totoro, si llegas a cien y sigues despierta me avisas para mandarte refuerzos",
      "Imagínate que estoy a tu lado acariciándote el cabello hasta que te quedes dormidita",
      "No tienes que resolver todos tus problemas a esta hora mi amor, por ahora intenta descansar",
      "Te doy un besito de buenas noches en la frente y otro en la mejilla, ahora sí a dormir",
      "Deja el celular un ratito, toma agüita si tienes sed y ponte cómoda, quiero que descanses bien",
      "Si tu cabeza no deja de pensar intenta imaginar una escena bonita, por ejemplo nosotros dos abrazaditos sin ninguna preocupación",
      "Ojalá pudiera acomodarte las mantitas y darte un beso antes de que cierres los ojos",
      "No te quedes mirando la hora cada cinco minutos, eso solamente hace que parezca que el reloj se está burlando de ti",
      "Si estuviera ahí probablemente también estaría despierto molestándote para que me des un beso",
      "Respira despacito y relaja los hombros, no tienes que hacer nada más por ahora",
      "Imagina a Nina hecha bolita durmiendo tranquilamente, seguro que está mucho más cómoda que nosotros",
      "Si no tienes sueño todavía no te desesperes, ponte cómoda y deja que el descanso llegue poquito a poquito",
      "Te mando un beso de piquito y te abrazo fuerte, buenas noches mi niña espero que descanses bonito",
      "Duerme mi amor, mañana habrá tiempo para todas tus ocurrencias pero ahora toca descansar"
    ]
  },
  {
    titulo: "sientas que no puedes más",
    mensajes: [
      "Mi amor detente un momento, no tienes que resolver toda tu vida hoy, vamos de a poquito",
      "Sé que a veces te cansas de intentar que las cosas salgan como quieres, pero eso no significa que estés fallando",
      "No tienes que ser fuerte todo el tiempo, también mereces descansar y dejar que alguien te acompañe",
      "Si hoy solamente pudiste levantarte y seguir con tu día no voy a decir que eso sea poco",
      "No quiero que te compares con otras personas ni que sientas que vas atrasada, tu camino también importa",
      "Si necesitas llorar hazlo, no tienes que convertir cada sentimiento en una solución inmediata",
      "Me gustaría poder quitarte un poquito de peso de encima, mientras tanto puedes contar conmigo para escucharte",
      "No eres menos capaz por tener días en los que no sabes qué hacer, a todos nos pasa mi vida",
      "Vamos a separar todo ese montón de cosas en pequeños pasos, no tienes que enfrentarlas todas al mismo tiempo",
      "Quiero que seas paciente contigo misma, no puedes exigirte estar bien todos los días",
      "No tienes que demostrarle nada a nadie para merecer tranquilidad",
      "Si hoy no salió como esperabas no significa que todo esté perdido, date la oportunidad de intentarlo de otra manera",
      "Recuerda que también puedes decir que no, parar un rato y cuidar de ti, no tienes que poder con todo",
      "Estoy orgulloso de ti por todo lo que has intentado incluso por esas cosas que nadie más alcanza a ver",
      "Te quiero mucho Bianca, no voy a exigirte que estés bien ahora mismo, solamente quiero acompañarte mientras te sientes un poquito mejor"
    ]
  },
  {
    titulo: "estemos peleados",
    mensajes: [
      "No me gusta que estemos así mi amor, pero quiero que podamos hablarlo y entender qué pasó",
      "No quiero que ganemos una discusión y terminemos haciéndonos daño, prefiero que intentemos entendernos",
      "Si hice algo que te lastimó quiero escucharlo y hacerme responsable, no quiero que sientas que tus sentimientos no importan",
      "Sé que a veces puedo ser terco y querer que las cosas salgan como yo las imagino, voy a intentar escucharte mejor",
      "No quiero que sientas que tienes que hablarme inmediatamente, tómate tu tiempo y cuando quieras podemos arreglar las cosas",
      "Podemos pensar diferente y aun así tratarnos con cariño, no quiero que nuestras diferencias se conviertan en una competencia",
      "No te escribo para fingir que no pasó nada, te escribo porque me importas y no quiero dejar las cosas sin hablar",
      "Si necesitas explicarme por qué te molestaste voy a escucharte, quiero entender tu lado aunque al principio no lo vea igual",
      "No quiero pedirte perdón solamente para terminar la pelea, si me equivoqué quiero reconocerlo de verdad",
      "A veces podemos decir cosas sin pensar demasiado, ojalá podamos hablar cuando estemos más tranquilos",
      "No tienes que darme la razón para que yo quiera solucionar las cosas contigo",
      "Quiero que podamos decirnos cuando algo nos duele sin miedo a que la conversación termine siendo otra pelea",
      "Te extraño incluso cuando estamos molestos, pero sé que primero tenemos que hablar y resolver lo que pasó",
      "No quiero que el orgullo hable por nosotros, prefiero que seamos sinceros y encontremos una manera de solucionarlo",
      "Sigo queriéndote mi amor, no quiero que ignoremos lo que pasó sino que podamos arreglarlo juntos"
    ]
  }
];