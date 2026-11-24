package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.LoginRequest;
import Cerveceria.Taberna.dto.RegistroRequest;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.UsuarioRepository;
import Cerveceria.Taberna.util.ValidacionesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Validated
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Si tenemos una sesión en memoria mientras dure la instancia,
    // entonces guardamos acá el correo del usuario que hizo login.
    // Es temporal: cuando el front pide /es-admin volvemos a buscar al usuario
    // en la BD para leer su rol de verdad.
    private static String sesionEmail = null;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest credenciales) {
        String email = credenciales.getEmail().trim().toLowerCase();
        String password = credenciales.getPassword();

        // Si el correo no tiene formato válido, entonces ni buscamos en la BD:
        // devolvemos 400 directo para que el front muestre el error en el formulario.
        if (!ValidacionesUtil.esEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El formato del email es inválido"));
        }

        // Si no encontramos el correo, entonces mandamos 401 "credenciales inválidas"
        // (no decimos que el usuario no existe, por seguridad).
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        // Si la contraseña que viene no coincide con el hash guardado,
        // entonces tampoco dejamos entrar: usamos BCrypt.matches, nunca texto plano.
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        // Si pasamos las dos validaciones, entonces marcamos la sesión con este correo.
        sesionEmail = email;

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", "token-simulado-" + email);
        respuesta.put("usuario", usuario);

        EntityModel<Map<String, Object>> model = EntityModel.of(respuesta);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).login(null)).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).sesion()).withRel("sesion"));

        return ResponseEntity.ok(model);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest datos) {
        String nombre = datos.getNombre().trim();
        String email = datos.getEmail().trim().toLowerCase();
        String password = datos.getPassword();
        String fechaNacimientoStr = datos.getFechaNacimiento();

        // Si el email no es válido, entonces ni seguimos con el registro.
        if (!ValidacionesUtil.esEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El formato del email es inválido"));
        }

        // Si el correo ya está en la BD, entonces no creamos otro usuario:
        // el email es único y se lo avisamos al front con un 400.
        if (usuarioRepository.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El email ya está registrado"));
        }

        // Si la fecha viene en otro formato, entonces no la podemos parsear:
        // le pedimos YYYY-MM-DD para que el front sepa cómo enviarla.
        LocalDate fechaNacimiento;
        try {
            fechaNacimiento = LocalDate.parse(fechaNacimientoStr);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Formato de fecha inválido. Use YYYY-MM-DD"));
        }

        // Si la edad no está entre 18 y 120, entonces validarEdad lanza:
        // la capturamos y le mandamos el mensaje al front con un 400.
        try {
            ValidacionesUtil.validarEdad(fechaNacimiento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }

        // Si llegamos hasta acá, entonces armamos el usuario:
        // guardamos la contraseña hasheada con BCrypt y el rol siempre "cliente"
        // (los admin los creamos directo en Neon, no por este endpoint).
        Usuario nuevo = new Usuario();
        nuevo.setNombre(nombre);
        nuevo.setEmail(email);
        nuevo.setPassword(passwordEncoder.encode(password));
        nuevo.setRol("cliente");
        nuevo.setFechaNacimiento(fechaNacimiento);

        usuarioRepository.save(nuevo);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("ok", true);
        respuesta.put("mensaje", "Usuario registrado exitosamente");

        EntityModel<Map<String, Object>> model = EntityModel.of(respuesta);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).registro(null)).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).login(null)).withRel("login"));

        return ResponseEntity.status(HttpStatus.CREATED).body(model);
    }

    @GetMapping("/sesion")
    public ResponseEntity<?> sesion() {
        if (sesionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No hay sesiñn activa"));
        }

        Usuario usuario = usuarioRepository.findByEmail(sesionEmail);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sesiñn invñlida"));
        }

        EntityModel<Usuario> model = EntityModel.of(usuario);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).sesion()).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).esAdmin()).withRel("es-admin"));

        return ResponseEntity.ok(model);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        sesionEmail = null;
        return ResponseEntity.ok(Map.of("mensaje", "Sesiñn cerrada"));
    }

    @GetMapping("/es-admin")
    public ResponseEntity<?> esAdmin() {
        if (sesionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("esAdmin", false));
        }

        Usuario usuario = usuarioRepository.findByEmail(sesionEmail);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("esAdmin", false));
        }

        // Si hay sesión, entonces comparamos el rol del usuario:
        // con esto el front decide si muestra o no el botón de Administración.
        boolean esAdmin = "admin".equals(usuario.getRol());
        return ResponseEntity.ok(Map.of("esAdmin", esAdmin));
    }

    /**
     * Si @Valid encuentra campos malos, entonces armamos un mapa
     * campo -> mensaje para que el front sepa exactamente qué corregir.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errores.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Datos invñlidos", "campos", errores));
    }
}
