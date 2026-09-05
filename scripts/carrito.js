const contenedorCarrito = document.getElementById("contenedor-carrito");
let carrito = JSON.parse(localStorage.getItem("carritoTaberna")) || [];

if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<p class="has-text-grey has-text-centered py-5">Tu carrito de compras está vacío.</p>`;
} else {
    let htmlCarrito = "";
    let totalPagar = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;

        htmlCarrito += `
            <div class="box p-3 mb-3 has-background-white-ter">
                <div class="columns is-vcentered is-mobile is-multiline">
                    
                    <div class="column is-12-mobile is-5-tablet is-flex is-align-items-center">
                        <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: contain;" class="mr-3">
                        <span class="has-text-weight-bold">${item.nombre}</span>
                    </div>
                    
                    <div class="column is-6-mobile is-3-tablet has-text-grey has-text-centered-tablet">
                        $${item.precio.toLocaleString("es-CL")} x ${item.cantidad} un.
                    </div>
                    
                    <div class="column is-6-mobile is-2-tablet has-text-weight-bold has-text-primary has-text-right-tablet">
                        $${subtotal.toLocaleString("es-CL")}
                    </div>
                    
                    <div class="column is-12-mobile is-2-tablet has-text-right-tablet has-text-centered-mobile">
                        <button class="button is-danger is-small is-light btn-eliminar-item" data-index="${index}">
                            Quitar
                        </button>
                    </div>

                </div>
            </div>
        `;
    });

    htmlCarrito += `
        <hr class="my-4">
        <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <span class="title is-5 mb-0 has-text-dark">Total a Pagar:</span>
            <span class="title is-4 has-text-primary mb-0">$${totalPagar.toLocaleString("es-CL")}</span>
        </div>
        <button class="button is-primary is-fullwidth is-medium has-text-weight-bold" id="btn-pagar">
            Proceder al Pago
        </button>
    `;

    contenedorCarrito.innerHTML = htmlCarrito;

    document.querySelectorAll(".btn-eliminar-item").forEach(boton => {
        boton.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            carrito.splice(index, 1);
            localStorage.setItem("carritoTaberna", JSON.stringify(carrito));
            location.reload(); 
        });
    });

    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
        btnPagar.addEventListener("click", () => {
            alert("¡Compra realizada con éxito! Salud 🍻");
            localStorage.removeItem("carritoTaberna");
            location.reload();
        });
    }
}