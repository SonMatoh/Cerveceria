// ============================================================================
// Fuente de datos inicial (semilla) de la tienda.
// Actúa como el "registro inicial" de la base de datos simulada.
// ============================================================================

export const productosIniciales = [
  {
    id: 1,
    nombre: 'Pikachoque Radioactivo - Enema de Corriente Alterna',
    estilo: 'Electro-Sour DIPA Hipercarbonatada (9.5° ABV)',
    descripcion:
      'Una Double IPA ácida y efervescente cargada con lúpulo cítrico ionizado; te propina una descarga de 220 voltios al paladar que te deja la lengua vibrando y las pupilas dilatadas.',
    precio: 4600,
    imagen: 'imagenes/pika.png',
    categoria: 'Cervezas',
    descuento: 0,
  },
  {
    id: 2,
    nombre: 'Bulbasour Tóxico - Esencia de Bulbo Venenoso',
    estilo: 'Kettle Sour Botánica con Clorofila y Ajenjo (6.2° ABV)',
    descripcion:
      'Cerveza ácida de un verde esmeralda turbio macerada con hierbas astringentes; un latigazo corrosivo que te sacude el sistema digestivo y te resetea el esmalte dental en el primer sorbo.',
    precio: 3800,
    imagen: 'imagenes/bulb.png',
    categoria: 'Cervezas',
    descuento: 15,
  },
  {
    id: 3,
    nombre: 'Snorlager Comatosa - Coma Etílico de 300 Litros',
    estilo: 'Imperial Eisbock Letárgica (12.0° ABV)',
    descripcion:
      'Lager concentrada por congelación, tan densa, maltosa y oscura que te anula la motricidad fina, te bloquea el metabolismo y te noquea en el sillón por un fin de semana completo.',
    precio: 5200,
    imagen: 'imagenes/snoe.png',
    categoria: 'Cervezas',
    descuento: 10,
  },
  {
    id: 4,
    nombre: 'Gengarrón Espectral - Sombra Líquida y Cremosa',
    estilo: 'Pastry Stout con Melaza de Ron Añejo y Carbón Activado (9.0° ABV)',
    descripcion:
      'Brebaje negro opaco infusionado con melaza de ron y carbón botánico; una textura viscosa y aterciopelada que parece moverse sola dentro del vaso cada vez que pestañeas.',
    precio: 4400,
    imagen: 'imagenes/gen.png',
    categoria: 'Cervezas',
    descuento: 0,
  },
  {
    id: 5,
    nombre: 'Vaporshot Oceanico - Trago Corto de Licor Viscoso e Hidratante',
    estilo: 'Shot Criogénico de Licor Salino y Blue Curaçao (22.0° ABV)',
    descripcion:
      'Chupito azul petróleo espeso y resbaladizo formulado con salmuera marina; baja denso por la garganta para hidratar tus órganos por ósmosis mientras te desconecta el habla.',
    precio: 3500,
    imagen: 'imagenes/vapo.png',
    categoria: 'Shooters',
    descuento: 0,
  },
  {
    id: 6,
    nombre: 'Mewtworremoto Psíquico - Mezcla Fulminante para Apagar Neuronas',
    estilo: 'Barleywine estilo Terremoto con Pipeño Mutante (15.0° ABV)',
    descripcion:
      'Aberración etílica de 15 grados nacida en laboratorio clandestino; cruce brutal entre cebada añejada y fermento de uva que te apaga los dos hemisferios cerebrales con pura telequinesis.',
    precio: 5900,
    imagen: 'imagenes/mew.png',
    categoria: 'Cervezas',
    descuento: 0,
  },
  {
    id: 7,
    nombre: 'Meowjito Callejero - Moneda de Oro de Callejón',
    estilo: 'Golden Ale estilo Mojito con Menta y Azúcar de Caña (5.0° ABV)',
    descripcion:
      'Rubia brillante con reflejos dorados y notas de menta silvestre; entra ligera y refrescante como dinero fácil, pero te vacía los bolsillos y te deja maullando en la calle a las 4 AM.',
    precio: 3400,
    imagen: 'imagenes/meow.png',
    categoria: 'Aperitivos',
    descuento: 20,
  },
  {
    id: 8,
    nombre: 'Psycóctel Cefalea - Bebida para Migraña Crónica',
    estilo: 'Triple IPA Hiperamarga 130 IBU (8.5° ABV)',
    descripcion:
      'Saturación monstruosa de lúpulos resinosos con un amargor cortante y seco; te mete tanta presión en las sienes que terminas agarrándote la cabeza esperando que te explote el cráneo.',
    precio: 4200,
    imagen: 'imagenes/duck.png',
    categoria: 'Cervezas',
    descuento: 0,
  },
  {
    id: 9,
    nombre: 'Dragonipisco Sin Frenos - Trago Potente con Golpe de Cola Directo al Hígado',
    estilo: 'Imperial Stout Añejada en Roble Pisquero de 40° (11.5° ABV)',
    descripcion:
      'Cerveza negra de gran cuerpo madurada en madera impregnada de pisco reservado; dulce en nariz pero con un golpe alcohólico seco que te manda de espaldas al suelo sin previo aviso.',
    precio: 4900,
    imagen: 'imagenes/drag.png',
    categoria: 'Cervezas',
    descuento: 0,
  },
  {
    id: 10,
    nombre: 'Squirtónica Turbia - Agua Pesada de Caparazón',
    estilo: 'Hard Tonic Marina con Sal de Mar y Quinina (4.5° ABV)',
    descripcion:
      'Tónica alcohólica y opaca con sales minerales y extracto de algas; amarga, efervescente y salobre, con el impacto refrescante de un chorro de agua de pantano directo a la cara.',
    precio: 3500,
    imagen: 'imagenes/squir.png',
    categoria: 'Aperitivos',
    descuento: 0,
  },
  {
    id: 11,
    nombre: 'Jigglypunch Narcoléptico - Néctar Rosa Apagamentes',
    estilo: 'Milkshake Sour Rosada con Frutos Rojos y Lactosa (4.2° ABV)',
    descripcion:
      'Ponche rosado, cremoso y dulzón que entra como postre inofensivo; te baja las defensas sin que te des cuenta hasta que tus ojos se cierran y caes rendido sobre la mesa.',
    precio: 3700,
    imagen: 'imagenes/jiggly.png',
    categoria: 'Cervezas',
    descuento: 0,
  },
  {
    id: 12,
    nombre: 'Charizcal Incandescente - Mezcal Humeante Prendido con Carbón de Cola',
    estilo: 'Mezcal Artesanal Ahumado y Flambeado con Carbón Encendido (46.0° ABV)',
    descripcion:
      'Destilado volcánico servido en llamas vivas que te calcina las papilas gustativas al primer trago; un golpe denso de humo y fuego que baja como lava pura directo a incendiarte el estómago.',
    precio: 4800,
    imagen: 'imagenes/chariz.png',
    categoria: 'Shooters',
    descuento: 0,
  },
];

export const categorias = ['Cervezas', 'Shooters', 'Aperitivos'];
