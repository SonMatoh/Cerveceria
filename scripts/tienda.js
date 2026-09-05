const cervezas = [
    {
        nombre: "Pikachoque Radioactivo - Enema de Corriente Alterna",
        estilo: "Electro-Sour DIPA Hipercarbonatada (9.5° ABV)",
        descripcion: "Una Double IPA ácida y efervescente cargada con lúpulo cítrico ionizado; te propina una descarga de 220 voltios al paladar que te deja la lengua vibrando y las pupilas dilatadas.",
        precio: 4600,
        imagen: "/imagenes/pika.png"
    },
    {
        nombre: "Bulbasour Tóxico - Esencia de Bulbo Venenoso",
        estilo: "Kettle Sour Botánica con Clorofila y Ajenjo (6.2° ABV)",
        descripcion: "Cerveza ácida de un verde esmeralda turbio macerada con hierbas astringentes; un latigazo corrosivo que te sacude el sistema digestivo y te resetea el esmalte dental en el primer sorbo.",
        precio: 3800,
        imagen: "../imagenes/bulb.png"
    },
    {
        nombre: "Snorlager Comatosa - Coma Etílico de 300 Litros",
        estilo: "Imperial Eisbock Letárgica (12.0° ABV)",
        descripcion: "Lager concentrada por congelación, tan densa, maltosa y oscura que te anula la motricidad fina, te bloquea el metabolismo y te noquea en el sillón por un fin de semana completo.",
        precio: 5200,
        imagen: "../imagenes/snoe.png"
    },
    {
        nombre: "Gengarrón Espectral - Sombra Líquida y Cremosa",
        estilo: "Pastry Stout con Melaza de Ron Añejo y Carbón Activado (9.0° ABV)",
        descripcion: "Brebaje negro opaco infusionado con melaza de ron y carbón botánico; una textura viscosa y aterciopelada que parece moverse sola dentro del vaso cada vez que pestañeas.",
        precio: 4400,
        imagen: "../imagenes/gen.png"
    },
    {
        nombre: "Vaporshot Oceanico - Trago Corto de Licor Viscoso e Hidratante",
        estilo: "Shot Criogénico de Licor Salino y Blue Curaçao (22.0° ABV)",
        descripcion: "Chupito azul petróleo espeso y resbaladizo formulado con salmuera marina; baja denso por la garganta para hidratar tus órganos por ósmosis mientras te desconecta el habla.",
        precio: 3500,
        imagen: "../imagenes/vapo.png"
    },
    {
        nombre: "Mewtworremoto Psíquico - Mezcla Fulminante para Apagar Neuronas",
        estilo: "Barleywine estilo Terremoto con Pipeño Mutante (15.0° ABV)",
        descripcion: "Aberración etílica de 15 grados nacida en laboratorio clandestino; cruce brutal entre cebada añejada y fermento de uva que te apaga los dos hemisferios cerebrales con pura telequinesis.",
        precio: 5900,
        imagen: "../imagenes/mew.png"
    },
    {
        nombre: "Meowjito Callejero - Moneda de Oro de Callejón",
        estilo: "Golden Ale estilo Mojito con Menta y Azúcar de Caña (5.0° ABV)",
        descripcion: "Rubia brillante con reflejos dorados y notas de menta silvestre; entra ligera y refrescante como dinero fácil, pero te vacía los bolsillos y te deja maullando en la calle a las 4 AM.",
        precio: 3400,
        imagen: "../imagenes/meow.png"
    },
    {
        nombre: "Psycóctel Cefalea - Bebida para Migraña Crónica",
        estilo: "Triple IPA Hiperamarga 130 IBU (8.5° ABV)",
        descripcion: "Saturación monstruosa de lúpulos resinosos con un amargor cortante y seco; te mete tanta presión en las sienes que terminas agarrándote la cabeza esperando que te explote el cráneo.",
        precio: 4200,
        imagen: "../imagenes/duck.png"
    },
    {
        nombre: "Dragonipisco Sin Frenos - Trago Potente con Golpe de Cola Directo al Hígado",
        estilo: "Imperial Stout Añejada en Roble Pisquero de 40° (11.5° ABV)",
        descripcion: "Cerveza negra de gran cuerpo madurada en madera impregnada de pisco reservado; dulce en nariz pero con un golpe alcohólico seco que te manda de espaldas al suelo sin previo aviso.",
        precio: 4900,
        imagen: "../imagenes/drag.png"
    },
    {
        nombre: "Squirtónica Turbia - Agua Pesada de Caparazón",
        estilo: "Hard Tonic Marina con Sal de Mar y Quinina (4.5° ABV)",
        descripcion: "Tónica alcohólica y opaca con sales minerales y extracto de algas; amarga, efervescente y salobre, con el impacto refrescante de un chorro de agua de pantano directo a la cara.",
        precio: 3500,
        imagen: "../imagenes/squir.png"
    },
    {
        nombre: "Jigglypunch Narcoléptico - Néctar Rosa Apagamentes",
        estilo: "Milkshake Sour Rosada con Frutos Rojos y Lactosa (4.2° ABV)",
        descripcion: "Ponche rosado, cremoso y dulzón que entra como postre inofensivo; te baja las defensas sin que te des cuenta hasta que tus ojos se cierran y caes rendido sobre la mesa.",
        precio: 3700,
        imagen: "../imagenes/jiggly.png"
    },
    {
    nombre: "Charizcal Incandescente - Mezcal Humeante Prendido con Carbón de Cola",
    estilo: "Mezcal Artesanal Ahumado y Flambeado con Carbón Encendido (46.0° ABV)",
    descripcion: "Destilado volcánico servido en llamas vivas que te calcina las papilas gustativas al primer trago; un golpe denso de humo y fuego que baja como lava pura directo a incendiarte el estómago.",
    precio: 4800,
    imagen: "../imagenes/chariz.png"
    }
];


const characterGrid = document.getElementById("character-grid");

function actualizarBotonCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carritoTaberna")) || [];
    let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const btnCart = document.querySelector(".btn-cart");
    if (btnCart) {
        btnCart.textContent = `🛒 Cart (${totalItems})`;
    }
}

function crearTarjeta(cerveza) {
    const col = document.createElement("div");
    col.className = "column is-12-mobile is-6-tablet is-4-desktop"; // Ajustado para 3 columnas en PC

    let carritoActual = JSON.parse(localStorage.getItem("carritoTaberna")) || [];
    let encontrado = carritoActual.find(item => item.nombre === cerveza.nombre);
    let cantidad = encontrado ? encontrado.cantidad : 0;

    col.innerHTML = `
        <div class="card h-100">
            <div class="card-image py-3" style="background-color: #fdfaf6;">
                <img src="${cerveza.imagen}" alt="${cerveza.nombre}" style="height: 180px; width: 100%; object-fit: contain;">
            </div>
            <div class="card-content">
                <p class="title is-5 card-name mb-1 has-text-dark">${cerveza.nombre}</p>
                <span class="tag is-warning is-light mb-2 has-text-weight-semibold">${cerveza.estilo}</span>
                <p class="is-size-7 has-text-grey-dark mb-3">${cerveza.descripcion}</p>
                <p class="has-text-weight-bold has-text-primary is-size-5">$${cerveza.precio.toLocaleString("es-CL")}</p>
            </div>
            <footer class="card-footer p-3 is-flex is-justify-content-space-between is-align-items-center">
                <span class="is-size-7 has-text-weight-medium">Unidades:</span>
                <div class="buttons are-small mb-0">
                    <button type="button" class="button is-danger is-light btn-restar has-text-weight-bold" style="width: 30px;">-</button>
                    <span class="button is-static cantidad-texto has-text-weight-bold" style="min-width: 36px;">${cantidad}</span>
                    <button type="button" class="button is-success is-light btn-sumar has-text-weight-bold" style="width: 30px;">+</button>
                </div>
            </footer>
        </div>
    `;

    const spanCantidad = col.querySelector(".cantidad-texto");
    const btnRestar = col.querySelector(".btn-restar");
    const btnSumar = col.querySelector(".btn-sumar");

    function guardarEnCarrito(cambio) {
        let carrito = JSON.parse(localStorage.getItem("carritoTaberna")) || [];
        let index = carrito.findIndex(item => item.nombre === cerveza.nombre);

        if (cambio > 0) {
            if (index !== -1) {
                carrito[index].cantidad += 1;
            } else {
                carrito.push({
                    nombre: cerveza.nombre,
                    precio: cerveza.precio,
                    imagen: cerveza.imagen,
                    cantidad: 1
                });
            }
        } else {
            if (index !== -1) {
                carrito[index].cantidad -= 1;
                if (carrito[index].cantidad <= 0) {
                    carrito.splice(index, 1);
                }
            }
        }

        localStorage.setItem("carritoTaberna", JSON.stringify(carrito));
        actualizarBotonCarrito();
    }

    btnSumar.addEventListener("click", () => {
        cantidad++;
        spanCantidad.textContent = cantidad;
        guardarEnCarrito(1);
    });

    btnRestar.addEventListener("click", () => {
        if (cantidad > 0) {
            cantidad--;
            spanCantidad.textContent = cantidad;
            guardarEnCarrito(-1);
        }
    });

    return col;
}

if (characterGrid) {
    characterGrid.innerHTML = "";
    cervezas.forEach(cerveza => {
        characterGrid.appendChild(crearTarjeta(cerveza));
    });
}

const searchInput = document.getElementById("search-input");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const textoBuscado = searchInput.value.toLowerCase().trim();
        const tarjetas = document.querySelectorAll("#character-grid .column");

        tarjetas.forEach(function (tarjeta) {
            const nombre = tarjeta.querySelector(".card-name").textContent.toLowerCase();
            const estilo = tarjeta.querySelector(".tag").textContent.toLowerCase();

            if (nombre.includes(textoBuscado) || estilo.includes(textoBuscado)) {
                tarjeta.style.display = "block";
            } else {
                tarjeta.style.display = "none";
            }
        });
    });
}

actualizarBotonCarrito();