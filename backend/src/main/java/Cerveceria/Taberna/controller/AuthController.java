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
import org.springframework.web.bind.annotation.*;
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

    // Sesiñn en memoria simple (para desarrollo)
    private static String sesionEmail = null;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest credenciales) {
        String email = credenciales.getEmail().trim().toLowerCase();
        String password = credenciales.getPassword();

        if (!ValidacionesUtil.esEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El formato del email es invñlido"));
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales invñlidas"));
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales invñlidas"));
        }

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

        if (!ValidacionesUtil.esEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El formato del email es invñlido"));
        }

        if (usuarioRepository.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El email ya estñ registrado"));
        }

        LocalDate fechaNacimiento;
        try {
            fechaNacimiento = LocalDate.parse(fechaNacimientoStr);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Formato de fecha invñlido. Use YYYY-MM-DD"));
        }

        ValidacionesUtil.validarEdad(fechaNacimiento);

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

        boolean esAdmin = "admin".equals(usuario.getRol());
        return ResponseEntity.ok(Map.of("esAdmin", esAdmin));
    }

    /**
     * Manejador de errores de validaciñn @Valid
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
