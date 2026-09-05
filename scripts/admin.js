const cervezasBase = [
    { nombre: "Pikachoque Radioactivo - Enema de Corriente Alterna", estilo: "Electro-Sour DIPA Hipercarbonatada (9.5° ABV)", descripcion: "Una Double IPA ácida y efervescente cargada con lúpulo cítrico ionizado; te propina una descarga de 220 voltios al paladar que te deja la lengua vibrando y las pupilas dilatadas.", precio: 4600, imagen: "imagenes/pika.png" },
    { nombre: "Bulbasour Tóxico - Esencia de Bulbo Venenoso", estilo: "Kettle Sour Botánica con Clorofila y Ajenjo (6.2° ABV)", descripcion: "Cerveza ácida de un verde esmeralda turbio macerada con hierbas astringentes; un latigazo corrosivo que te sacude el sistema digestivo y te resetea el esmalte dental en el primer sorbo.", precio: 3800, imagen: "imagenes/bulb.png" },
    { nombre: "Snorlager Comatosa - Coma Etílico de 300 Litros", estilo: "Imperial Eisbock Letárgica (12.0° ABV)", descripcion: "Lager concentrada por congelación, tan densa, maltosa y oscura que te anula la motricidad fina, te bloquea el metabolismo y te noquea en el sillón por un fin de semana completo.", precio: 5200, imagen: "imagenes/snoe.png" },
    { nombre: "Gengarrón Espectral - Sombra Líquida y Cremosa", estilo: "Pastry Stout con Melaza de Ron Añejo y Carbón Activado (9.0° ABV)", descripcion: "Brebaje negro opaco infusionado con melaza de ron y carbón botánico; una textura viscosa y aterciopelada que parece moverse sola dentro del vaso cada vez que pestañeas.", precio: 4400, imagen: "imagenes/gen.png" },
    { nombre: "Vaporshot Oceanico - Trago Corto de Licor Viscoso e Hidratante", estilo: "Shot Criogénico de Licor Salino y Blue Curaçao (22.0° ABV)", descripcion: "Chupito azul petróleo espeso y resbaladizo formulado con salmuera marina; baja denso por la garganta para hidratar tus órganos por ósmosis mientras te desconecta el habla.", precio: 3500, imagen: "imagenes/vapo.png" },
    { nombre: "Mewtworremoto Psíquico - Mezcla Fulminante para Apagar Neuronas", estilo: "Barleywine estilo Terremoto con Pipeño Mutante (15.0° ABV)", descripcion: "Aberración etílica de 15 grados nacida en laboratorio clandestino; cruce brutal entre cebada añejada y fermento de uva que te apaga los dos hemisferios cerebrales con pura telequinesis.", precio: 5900, imagen: "imagenes/mew.png" },
    { nombre: "Meowjito Callejero - Moneda de Oro de Callejón", estilo: "Golden Ale estilo Mojito con Menta y Azúcar de Caña (5.0° ABV)", descripcion: "Rubia brillante con reflejos dorados y notas de menta silvestre; entra ligera y refrescante como dinero fácil, pero te vacía los bolsillos y te deja maullando en la calle a las 4 AM.", precio: 3400, imagen: "imagenes/meow.png" },
    { nombre: "Psycóctel Cefalea - Bebida para Migraña Crónica", estilo: "Triple IPA Hiperamarga 130 IBU (8.5° ABV)", descripcion: "Saturación monstruosa de lúpulos resinosos con un amargor cortante y seco; te mete tanta presión en las sienes que terminas agarrándote la cabeza esperando que te explote el cráneo.", precio: 4200, imagen: "imagenes/duck.png" },
    { nombre: "Dragonipisco Sin Frenos - Trago Potente con Golpe de Cola Directo al Hígado", estilo: "Imperial Stout Añejada en Roble Pisquero de 40° (11.5° ABV)", descripcion: "Cerveza negra de gran cuerpo madurada en madera impregnada de pisco reservado; dulce en nariz pero con un golpe alcohólico seco que te manda de espaldas al suelo sin previo aviso.", precio: 4900, imagen: "imagenes/drag.png" },
    { nombre: "Squirtónica Turbia - Agua Pesada de Caparazón", estilo: "Hard Tonic Marina con Sal de Mar y Quinina (4.5° ABV)", descripcion: "Tónica alcohólica y opaca con sales minerales y extracto de algas; amarga, efervescente y salobre, con el impacto refrescante de un chorro de agua de pantano directo a la cara.", precio: 3500, imagen: "imagenes/squir.png" },
    { nombre: "Jigglypunch Narcoléptico - Néctar Rosa Apagamentes", estilo: "Milkshake Sour Rosada con Frutos Rojos y Lactosa (4.2° ABV)", descripcion: "Ponche rosado, cremoso y dulzón que entra como postre inofensivo; te baja las defensas sin que te des cuenta hasta que tus ojos se cierran y caes rendido sobre la mesa.", precio: 3700, imagen: "imagenes/jiggly.png" },
    { nombre: "Charizcal Incandescente - Mezcal Humeante Prendido con Carbón de Cola", estilo: "Mezcal Artesanal Ahumado y Flambeado con Carbón Encendido (46.0° ABV)", descripcion: "Destilado volcánico servido en llamas vivas que te calcina las papilas gustativas al primer trago; un golpe denso de humo y fuego que baja como lava pura directo a incendiarte el estómago.", precio: 4800, imagen: "imagenes/chariz.png" }
];

let inventario = JSON.parse(localStorage.getItem("inventarioTaberna"));
if (!inventario) {
    inventario = cervezasBase;
    localStorage.setItem("inventarioTaberna", JSON.stringify(inventario));
}


const contenedorProductos = document.getElementById("lista-admin-productos");
const kpiProductos = document.getElementById("kpi-productos");
const formAdmin = document.getElementById("form-admin-producto");
const tituloFormulario = document.getElementById("titulo-formulario");
const btnCancelar = document.getElementById("btn-cancelar");

function renderizarProductosAdmin() {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";

    inventario.forEach((prod, index) => {
        const item = document.createElement("div");
        item.className = "box p-3 mb-2 has-background-white-ter";

        item.innerHTML = `
            <div class="columns is-vcentered is-mobile is-multiline">
                <div class="column is-12-mobile is-5-tablet">
                    <p class="has-text-weight-bold mb-0">${prod.nombre}</p>
                    <span class="tag is-warning is-light is-small">${prod.estilo}</span>
                </div>
                <div class="column is-6-mobile is-3-tablet has-text-weight-semibold has-text-primary has-text-centered-tablet">
                    $${Number(prod.precio).toLocaleString("es-CL")}
                </div>
                <div class="column is-6-mobile is-4-tablet has-text-right-tablet">
                    <button type="button" class="button is-info is-small is-light btn-editar-item" data-index="${index}">
                        Editar
                    </button>
                    <button type="button" class="button is-danger is-small is-light btn-borrar-item" data-index="${index}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        item.querySelector(".btn-editar-item").addEventListener("click", () => {
            document.getElementById("admin-index").value = index;
            document.getElementById("admin-nombre").value = prod.nombre;
            document.getElementById("admin-estilo").value = prod.estilo;
            document.getElementById("admin-precio").value = prod.precio;
            document.getElementById("admin-imagen").value = prod.imagen;
            document.getElementById("admin-desc").value = prod.descripcion;
            
            tituloFormulario.textContent = "Editar Producto";
            btnCancelar.classList.remove("is-hidden");
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        });

        item.querySelector(".btn-borrar-item").addEventListener("click", () => {
            const confirmacion = confirm(`¿Seguro que deseas eliminar ${prod.nombre}?`);
            if (confirmacion) {
                inventario.splice(index, 1);
                localStorage.setItem("inventarioTaberna", JSON.stringify(inventario));
                renderizarProductosAdmin();
            }
        });

        contenedorProductos.appendChild(item);
    });

    if (kpiProductos) {
        kpiProductos.textContent = inventario.length;
    }
}

if (formAdmin) {
    formAdmin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const indexEdicion = document.getElementById("admin-index").value;
        const nuevoProducto = {
            nombre: document.getElementById("admin-nombre").value.trim(),
            estilo: document.getElementById("admin-estilo").value.trim(),
            precio: Number(document.getElementById("admin-precio").value),
            imagen: document.getElementById("admin-imagen").value.trim(),
            descripcion: document.getElementById("admin-desc").value.trim()
        };

        if (indexEdicion === "") {
            inventario.push(nuevoProducto);
        } else {

            inventario[indexEdicion] = nuevoProducto;
        }

        localStorage.setItem("inventarioTaberna", JSON.stringify(inventario));
        renderizarProductosAdmin();
        resetearFormulario();
    });
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", resetearFormulario);
}

function resetearFormulario() {
    formAdmin.reset();
    document.getElementById("admin-index").value = "";
    tituloFormulario.textContent = "Añadir Nuevo Producto";
    btnCancelar.classList.add("is-hidden");
}

renderizarProductosAdmin();