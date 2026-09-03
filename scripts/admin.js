const productosAdmin = [
    { id: 1, nombre: "Pikachu - Triple IPA", estilo: "Triple IPA", precio: 4500 },
    { id: 2, nombre: "Bulbasaur - Bulbo Tóxico", estilo: "Sour Verde", precio: 3800 },
    { id: 3, nombre: "Snorlax - Coma Etílico", estilo: "Baltic Porter", precio: 4900 },
    { id: 4, nombre: "Gengar - Sombra Líquida", estilo: "Dark Stout", precio: 4200 },
    { id: 5, nombre: "Vaporeon - Licor de Sirena", estilo: "Gose Azul", precio: 3900 },
    { id: 6, nombre: "Mewtwo - Clonación Resaca", estilo: "Barleywine", precio: 5500 },
    { id: 7, nombre: "Meowth - Moneda de Oro", estilo: "Golden Ale", precio: 3200 },
    { id: 8, nombre: "Psyduck - Coctel Migraña", estilo: "Extra Bitter", precio: 3700 },
    { id: 9, nombre: "Dragonite - Aliento Lagarto", estilo: "Imperial Stout", precio: 4800 },
    { id: 10, nombre: "Squirtle - Agua Turbia", estilo: "Saline Pale Ale", precio: 3400 },
    { id: 11, nombre: "Jigglypuff - Néctar Rosa", estilo: "Sweet Wheat", precio: 3600 },
    { id: 12, nombre: "Charizard - Cola Flambeada", estilo: "Smoked Stout", precio: 4600 }
];

const contenedorProductos = document.getElementById("lista-admin-productos");
const kpiProductos = document.getElementById("kpi-productos");

function renderizarProductosAdmin() {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";

    productosAdmin.forEach((prod, index) => {
        const item = document.createElement("div");
        item.className = "box p-3 mb-2 has-background-white-ter";

        item.innerHTML = `
            <div class="columns is-vcentered is-mobile">
                <div class="column is-5">
                    <p class="has-text-weight-bold mb-0">${prod.nombre}</p>
                    <span class="tag is-warning is-light is-small">${prod.estilo}</span>
                </div>
                <div class="column is-3 has-text-weight-semibold has-text-primary">
                    $${prod.precio.toLocaleString("es-CL")}
                </div>
                <div class="column is-4 has-text-right">
                    <button type="button" class="button is-danger is-small is-light btn-borrar-item">
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        item.querySelector(".btn-borrar-item").addEventListener("click", function () {
            item.remove();
            productosAdmin.splice(index, 1);
            if (kpiProductos) {
                kpiProductos.textContent = document.querySelectorAll("#lista-admin-productos .box").length;
            }
        });

        contenedorProductos.appendChild(item);
    });

    if (kpiProductos) {
        kpiProductos.textContent = productosAdmin.length;
    }
}

renderizarProductosAdmin();