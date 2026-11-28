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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Validated
@Tag(name = "Autenticación", description = "Login, registro y sesión de usuarios")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static String sesionEmail = null;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Operation(summary = "Iniciar sesión", description = "Valida credenciales y devuelve token simulado",
        responses = { @ApiResponse(responseCode = "200", description = "Login exitoso"),
                      @ApiResponse(responseCode = "401", description = "Credenciales inválidas") })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest credenciales) {
        String email = credenciales.getEmail().trim().toLowerCase();
        String password = credenciales.getPassword();

        if (!ValidacionesUtil.esEmailPermitido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com"));
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        sesionEmail = email;

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", "token-simulado-" + email);
        respuesta.put("usuario", usuario);

        var model = EntityModel.of(respuesta);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).login(null)).withSelfRel());
        model.add(
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).sesion()).withRel("sesion"));

        return ResponseEntity.ok(model);
    }

    @Operation(summary = "Registrar usuario", description = "Crea un cliente validando correo, contraseña y edad",
        responses = { @ApiResponse(responseCode = "201", description = "Usuario creado"),
                      @ApiResponse(responseCode = "400", description = "Datos inválidos") })
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest datos) {
        String nombre = datos.getNombre().trim();
        String email = datos.getEmail().trim().toLowerCase();
        String password = datos.getPassword();
        String fechaNacimientoStr = datos.getFechaNacimiento();

        if (!ValidacionesUtil.esEmailPermitido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com"));
        }

        if (usuarioRepository.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El email ya está registrado"));
        }

        LocalDate fechaNacimiento;
        try {
            fechaNacimiento = LocalDate.parse(fechaNacimientoStr);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Formato de fecha inválido. Use YYYY-MM-DD"));
        }

        try {
            ValidacionesUtil.validarEdad(fechaNacimiento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }

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

        var model = EntityModel.of(respuesta);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).registro(null))
                .withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).login(null))
                .withRel("login"));

        return ResponseEntity.status(HttpStatus.CREATED).body(model);
    }

    @Operation(summary = "Sesión activa", description = "Devuelve el usuario logueado",
        responses = { @ApiResponse(responseCode = "200", description = "Sesión activa"),
                      @ApiResponse(responseCode = "401", description = "Sin sesión") })
    @GetMapping("/sesion")
    public ResponseEntity<?> sesion() {
        if (sesionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No hay sesión activa"));
        }

        Usuario usuario = usuarioRepository.findByEmail(sesionEmail);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sesión inválida"));
        }

        EntityModel<Usuario> model = EntityModel.of(usuario);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).sesion()).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).esAdmin())
                .withRel("es-admin"));

        return ResponseEntity.ok(model);
    }

    @Operation(summary = "Cerrar sesión", description = "Limpia la sesión en memoria",
        responses = { @ApiResponse(responseCode = "200", description = "Sesión cerrada") })
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        sesionEmail = null;
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }

    @Operation(summary = "Verificar admin", description = "Indica si el usuario logueado es administrador",
        responses = { @ApiResponse(responseCode = "200", description = "Resultado del rol") })
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

        boolean esAdmin = "admin".equals(usuario.getRol());
        return ResponseEntity.ok(Map.of("esAdmin", esAdmin));
    }

    @Operation(summary = "Listar usuarios", description = "Devuelve todos los usuarios registrados",
        responses = { @ApiResponse(responseCode = "200", description = "Lista de usuarios") })
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Datos inválidos", "campos", errores));
    }
}