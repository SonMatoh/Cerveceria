//CONTACTO

const formContacto = document.getElementById("form-contacto");

if (formContacto) {
    formContacto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let formularioValido = true;

        const inputNombre = document.getElementById("nombre");
        const inputEmail = document.getElementById("email");
        const inputAsunto = document.getElementById("asunto");
        const inputMensaje = document.getElementById("mensaje");

        const errorNombre = document.getElementById("error-nombre");
        const errorEmail = document.getElementById("error-email");
        const errorAsunto = document.getElementById("error-asunto");
        const errorMensaje = document.getElementById("error-mensaje");
        const mensajeExito = document.getElementById("mensaje-exito");

        if (inputNombre.value.trim().length < 2) {
            errorNombre.classList.remove("is-hidden");
            inputNombre.classList.add("is-danger");
            formularioValido = false;
        } else {
            errorNombre.classList.add("is-hidden");
            inputNombre.classList.remove("is-danger");
            inputNombre.classList.add("is-success");
        }

        const emailValor = inputEmail.value.trim().toLowerCase();
        const patronCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

        if (!patronCorreo.test(emailValor)) {
            errorEmail.classList.remove("is-hidden");
            inputEmail.classList.add("is-danger");
            formularioValido = false;
        } else {
            errorEmail.classList.add("is-hidden");
            inputEmail.classList.remove("is-danger");
            inputEmail.classList.add("is-success");
        }

        if (inputAsunto.value.trim() === "") {
            errorAsunto.classList.remove("is-hidden");
            inputAsunto.classList.add("is-danger");
            formularioValido = false;
        } else {
            errorAsunto.classList.add("is-hidden");
            inputAsunto.classList.remove("is-danger");
            inputAsunto.classList.add("is-success");
        }

        if (inputMensaje.value.trim().length < 10) {
            errorMensaje.classList.remove("is-hidden");
            inputMensaje.classList.add("is-danger");
            formularioValido = false;
        } else {
            errorMensaje.classList.add("is-hidden");
            inputMensaje.classList.remove("is-danger");
            inputMensaje.classList.add("is-success");
        }

        if (formularioValido) {
            mensajeExito.classList.remove("is-hidden");
            formContacto.reset();

            [inputNombre, inputEmail, inputAsunto, inputMensaje].forEach(input => {
                input.classList.remove("is-success");
            });

            setTimeout(() => {
                mensajeExito.classList.add("is-hidden");
            }, 4000);
        }
    });
}

//REGISTRO

const formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let registroValido = true;

        const inputNombre = document.getElementById("reg-nombre");
        const inputEmail = document.getElementById("reg-email");
        const inputPass = document.getElementById("reg-pass");
        const inputPass2 = document.getElementById("reg-pass2");
        const inputEdad = document.getElementById("reg-edad");

        const errorNombre = document.getElementById("error-reg-nombre");
        const errorEmail = document.getElementById("error-reg-email");
        const errorPass = document.getElementById("error-reg-pass");
        const errorPass2 = document.getElementById("error-reg-pass2");
        const errorEdad = document.getElementById("error-reg-edad");
        const mensajeExito = document.getElementById("registro-exito");

        if (inputNombre.value.trim().length < 2) {
            errorNombre.classList.remove("is-hidden");
            inputNombre.classList.add("is-danger");
            registroValido = false;
        } else {
            errorNombre.classList.add("is-hidden");
            inputNombre.classList.remove("is-danger");
            inputNombre.classList.add("is-success");
        }

        const patronCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!patronCorreo.test(inputEmail.value.trim().toLowerCase())) {
            errorEmail.classList.remove("is-hidden");
            inputEmail.classList.add("is-danger");
            registroValido = false;
        } else {
            errorEmail.classList.add("is-hidden");
            inputEmail.classList.remove("is-danger");
            inputEmail.classList.add("is-success");
        }

        const passValor = inputPass.value;
        if (passValor.length < 4 || passValor.length > 10) {
            errorPass.classList.remove("is-hidden");
            inputPass.classList.add("is-danger");
            registroValido = false;
        } else {
            errorPass.classList.add("is-hidden");
            inputPass.classList.remove("is-danger");
            inputPass.classList.add("is-success");
        }

        if (inputPass2.value === "" || inputPass2.value !== passValor) {
            errorPass2.classList.remove("is-hidden");
            inputPass2.classList.add("is-danger");
            registroValido = false;
        } else {
            errorPass2.classList.add("is-hidden");
            inputPass2.classList.remove("is-danger");
            inputPass2.classList.add("is-success");
        }

        if (!inputEdad.checked) {
            errorEdad.classList.remove("is-hidden");
            registroValido = false;
        } else {
            errorEdad.classList.add("is-hidden");
        }

        if (registroValido) {

            const nuevoUsuario ={
                nombre: inputNombre.value.trim(),
                email: inputEmail.value.trim().toLowerCase(),
                password: passValor

            }

            let listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

            const correoDuplicado = listaUsuarios.some(user => user.email === nuevoUsuario.email);

            if (correoDuplicado) {
                alert("Este correo ya está registrado.");
                return;
            }

            listaUsuarios.push(nuevoUsuario);

            localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));

            mensajeExito.classList.remove("is-hidden");
            formRegistro.reset();

            [inputNombre, inputEmail, inputPass, inputPass2].forEach(campo => {
                campo.classList.remove("is-success");
            });

            setTimeout(() => {
                mensajeExito.classList.add("is-hidden");
            }, 6000);
        }
    });

            
}


//LOGIN


const formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let loginValido = true;

        const inputEmail = document.getElementById("login-email");
        const inputPass = document.getElementById("login-pass");

        const errorEmail = document.getElementById("error-login-email");
        const errorPass = document.getElementById("error-login-pass");
        const mensajeExito = document.getElementById("login-exito");

        const patronCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!patronCorreo.test(inputEmail.value.trim().toLowerCase())) {
            errorEmail.classList.remove("is-hidden");
            inputEmail.classList.add("is-danger");
            loginValido = false;
        } else {
            errorEmail.classList.add("is-hidden");
            inputEmail.classList.remove("is-danger");
            inputEmail.classList.add("is-success");
        }
        
        const passValor = inputPass.value;
        if (passValor.length < 4 || passValor.length > 10) {
            errorPass.classList.remove("is-hidden");
            inputPass.classList.add("is-danger");
            loginValido = false;
        } else {
            errorPass.classList.add("is-hidden");
            inputPass.classList.remove("is-danger");
            inputPass.classList.add("is-success");
        }

        //REVIZAR
        if (loginValido) {
            const emailIngresado = inputEmail.value.trim().toLowerCase();
            const passIngresada = inputPass.value;

            let listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

            const usuarioEncontrado = listaUsuarios.find(
                user => user.email === emailIngresado && user.password === passIngresada
            );

            if (!usuarioEncontrado) {
                alert("Correo o contraseña incorrectos, o la cuenta no existe.");
                loginValido = false; // 
            } else {
                localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
            }
        }

        if (loginValido) {
            mensajeExito.classList.remove("is-hidden");
            formLogin.reset();

            inputEmail.classList.remove("is-success");
            inputPass.classList.remove("is-success");

            setTimeout(() => {
                mensajeExito.classList.add("is-hidden");
                window.location.href = "productos.html";
            }, 2000);
        }
    });
}